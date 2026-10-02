import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

part 'database.g.dart';

// 1. Tabela de Apontamentos de Operações no Campo (Plantio, Pulverização, Colheita)
class FieldOperations extends Table {
  TextColumn get id => text()(); // UUIDv7
  TextColumn get farmId => text()();
  TextColumn get plotId => text()();
  TextColumn get machineId => text().nullable()();
  TextColumn get operationType => text()(); // 'PLANTIO', 'PULVERIZACAO', 'COLHEITA'
  RealColumn get initialHourmeter => real()();
  RealColumn get finalHourmeter => real()();
  RealColumn get temperatureCelsius => real()();
  RealColumn get relativeHumidityPct => real()();
  RealColumn get windSpeedKmh => real()();
  TextColumn get tankMixJson => text()(); // JSON com insumos e dosagens
  DateTimeColumn get startedAt => dateTime()();
  DateTimeColumn get finishedAt => dateTime()();
  DateTimeColumn get deviceLocalTimestamp => dateTime()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

// 2. Tabela de Monitoramento Fitossanitário MIP
class PestMonitorings extends Table {
  TextColumn get id => text()(); // UUIDv7
  TextColumn get farmId => text()();
  TextColumn get plotId => text()();
  TextColumn get biologicalTarget => text()();
  TextColumn get targetType => text()(); // 'PRAGA', 'DOENCA', 'DANINHA'
  TextColumn get damageLevel => text()(); // 'BAIXO', 'MEDIO', 'CRITICO'
  RealColumn get sampleCount => real()();
  RealColumn get latitude => real()();
  RealColumn get longitude => real()();
  TextColumn get photoPath => text().nullable()();
  DateTimeColumn get deviceLocalTimestamp => dateTime()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

// 3. Tabela de Abastecimentos de Comboio
class Refuelings extends Table {
  TextColumn get id => text()(); // UUIDv7
  TextColumn get farmId => text()();
  TextColumn get machineId => text()();
  RealColumn get hourmeter => real()();
  RealColumn get litersFuel => real()();
  TextColumn get tankOriginId => text()();
  DateTimeColumn get deviceLocalTimestamp => dateTime()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

// 4. Fila Outbox Local para Sincronização Assíncrona Resiliente (Princípio 12)
class OfflineSyncOutbox extends Table {
  TextColumn get eventId => text()(); // UUIDv7
  TextColumn get eventType => text()(); // 'OPERACAO_CAMPO', 'MIP', 'ABASTECIMENTO'
  TextColumn get payloadJson => text()();
  TextColumn get syncStatus => text().withDefault(const Constant('PENDING'))(); // PENDING, SYNCING, SYNCED, FAILED
  IntColumn get retryCount => integer().withDefault(const Constant(0))();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get lastAttemptAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {eventId};
}

@DriftDatabase(tables: [FieldOperations, PestMonitorings, Refuelings, OfflineSyncOutbox])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'agtech_field.sqlite'));
    return NativeDatabase.createInBackground(file);
  });
}
