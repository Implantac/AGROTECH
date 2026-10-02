package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/superagtech/sync-gateway/models"
	amqp "github.com/rabbitmq/amqp091-go"
)

type SyncHandler struct {
	rabbitChan *amqp.Channel
}

func NewSyncHandler(ch *amqp.Channel) *SyncHandler {
	return &SyncHandler{rabbitChan: ch}
}

func (h *SyncHandler) HandlePushBatch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Falha ao ler corpo da requisição", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var batch models.SyncPayloadBatch
	if err := json.Unmarshal(body, &batch); err != nil {
		http.Error(w, "Payload JSON inválido: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Validação básica do cabeçalho de lote
	if batch.BatchID == "" || batch.FarmID == "" {
		http.Error(w, "Campos 'batch_id' e 'farm_id' são obrigatórios", http.StatusUnprocessableEntity)
		return
	}

	totalItems := len(batch.FieldOperations) + len(batch.PestMonitoringRecords) + len(batch.RefuelingRecords) + len(batch.LivestockEvents)
	log.Printf("[SYNC GATEWAY] Recebido lote %s da fazenda %s: %d operações, %d pragas, %d abastecimentos, %d zootecnia",
		batch.BatchID, batch.FarmID, len(batch.FieldOperations), len(batch.PestMonitoringRecords), len(batch.RefuelingRecords), len(batch.LivestockEvents))

	// Envio assíncrono para o RabbitMQ
	if h.rabbitChan != nil {
		err = h.rabbitChan.Publish(
			"",                        // exchange default
			"agro.sync.mobile.queue", // routing key / nome da fila
			true,                      // mandatory
			false,                     // immediate
			amqp.Publishing{
				DeliveryMode: amqp.Persistent,
				ContentType:  "application/json",
				Body:         body,
				Timestamp:    time.Now().UTC(),
				Headers: amqp.Table{
					"batch_id": batch.BatchID,
					"farm_id":  batch.FarmID,
				},
			},
		)
		if err != nil {
			log.Printf("[ERRO RABBITMQ] Falha ao enfileirar lote %s: %v", batch.BatchID, err)
			http.Error(w, "Falha ao persistir evento no broker assíncrono", http.StatusInternalServerError)
			return
		}
	}

	// Resposta HTTP 202 Accepted imediata liberando a fila do app no campo
	response := models.SyncAckResponse{
		Status:           "ACCEPTED",
		BatchID:          batch.BatchID,
		ReceivedAt:       time.Now().UTC(),
		ServerMonotonic:  time.Now().UnixNano(),
		AcceptedItems:    totalItems,
		RequiresConflict: false,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(response)
}
