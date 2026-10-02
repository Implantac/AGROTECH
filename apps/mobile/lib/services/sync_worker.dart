import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:connectivity_plus/connectivity_plus.dart';
import '../data/database.dart';

class SyncWorker {
  final AppDatabase database;
  final String syncGatewayUrl;

  SyncWorker({required this.database, required this.syncGatewayUrl});

  /// Executa o ciclo de envio da fila Outbox para o backend Go / RabbitMQ
  Future<int> processPendingOutbox() async {
    // 1. Verifica conectividade ativa
    final connectivityResult = await Connectivity().checkConnectivity();
    if (connectivityResult == ConnectivityResult.none) {
      return 0; // Permanece 100% offline sem falhar
    }

    // 2. Busca eventos pendentes na tabela OfflineSyncOutbox
    final pendingEvents = await (database.select(database.offlineSyncOutbox)
          ..where((tbl) => tbl.syncStatus.equals('PENDING') | tbl.syncStatus.equals('FAILED'))
          ..limit(50))
        .get();

    if (pendingEvents.isEmpty) {
      return 0;
    }

    int syncedCount = 0;

    // 3. Monta o lote unificado
    final batchPayload = {
      'batch_id': 'batch_${DateTime.now().millisecondsSinceEpoch}',
      'device_id': 'device_field_offline',
      'events': pendingEvents.map((e) => jsonDecode(e.payloadJson)).toList(),
    };

    try {
      final response = await http.post(
        Uri.parse('$syncGatewayUrl/api/v1/sync/push'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(batchPayload),
      );

      if (response.statusCode == 202 || response.statusCode == 200) {
        // 4. Marca os eventos como sincronizados com segurança
        for (final event in pendingEvents) {
          await (database.update(database.offlineSyncOutbox)
                ..where((tbl) => tbl.eventId.equals(event.eventId)))
              .write(OfflineSyncOutboxCompanion(
            syncStatus: const Value('SYNCED'),
            lastAttemptAt: Value(DateTime.now()),
          ));
          syncedCount++;
        }
      }
    } catch (e) {
      // Incrementa retry count sem mascarar erros
      for (final event in pendingEvents) {
        await (database.update(database.offlineSyncOutbox)
              ..where((tbl) => tbl.eventId.equals(event.eventId)))
            .write(OfflineSyncOutboxCompanion(
          syncStatus: const Value('FAILED'),
          retryCount: Value(event.retryCount + 1),
          lastAttemptAt: Value(DateTime.now()),
        ));
      }
    }

    return syncedCount;
  }
}
