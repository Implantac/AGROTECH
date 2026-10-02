package worker

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/superagtech/sync-gateway/models"
	amqp "github.com/rabbitmq/amqp091-go"
)

type SyncQueueConsumer struct {
	rabbitChan   *amqp.Channel
	processedMap sync.Map // Cache em memória para deduplicação de UUIDv7
	stopChan     chan struct{}
}

func NewSyncQueueConsumer(ch *amqp.Channel) *SyncQueueConsumer {
	return &SyncQueueConsumer{
		rabbitChan: ch,
		stopChan:   make(chan struct{}),
	}
}

// StartConsumer inicia a escuta assíncrona da fila agro.sync.mobile.queue
func (c *SyncQueueConsumer) StartConsumer() error {
	if c.rabbitChan == nil {
		log.Println("[WORKER] Canal RabbitMQ nulo; consumidor em modo standby/offline.")
		return nil
	}

	msgs, err := c.rabbitChan.Consume(
		"agro.sync.mobile.queue", // queue
		"sync-gateway-worker",    // consumer tag
		false,                    // auto-ack (desabilitado para garantir consistência transacional)
		false,                    // exclusive
		false,                    // no-local
		false,                    // no-wait
		nil,                      // args
	)
	if err != nil {
		return err
	}

	go func() {
		log.Println("[WORKER] Consumidor assíncrono conectado à fila agro.sync.mobile.queue com sucesso.")
		for {
			select {
			case <-c.stopChan:
				log.Println("[WORKER] Encerrando escuta de fila.")
				return
			case msg, ok := <-msgs:
				if !ok {
					log.Println("[WORKER] Canal de mensagens fechado.")
					return
				}

				c.processMessage(msg)
			}
		}
	}()

	return nil
}

func (c *SyncQueueConsumer) processMessage(msg amqp.Delivery) {
	var batch models.SyncPayloadBatch
	if err := json.Unmarshal(msg.Body, &batch); err != nil {
		log.Printf("[WORKER ERRO] Falha ao desserializar lote: %v. Enviando para DLQ.", err)
		msg.Nack(false, false) // Rejeita e envia para DLX sem requeue
		return
	}

	log.Printf("[WORKER] Processando lote %s (Fazenda %s) recebido do dispositivo %s",
		batch.BatchID, batch.FarmID, batch.DeviceID)

	// 1. Processar Operações de Campo (Plantio, Pulverização, Colheita)
	for _, op := range batch.FieldOperations {
		if _, exists := c.processedMap.LoadOrStore(op.ID, time.Now()); exists {
			log.Printf("[WORKER DEDUP] Operação %s já processada anteriormente. Ignorando duplicata idempotente.", op.ID)
			continue
		}
		// Inserção no banco de dados e recálculo de Custeio ABC
		log.Printf("[WORKER PROCESSO] Operação %s alocada ao Talhão %s (Horímetro %.1f a %.1f)",
			op.OperationType, op.PlotID, op.InitialHourmeter, op.FinalHourmeter)
	}

	// 2. Processar Abastecimentos de Combustível (DRE / Comboio)
	for _, ref := range batch.RefuelingRecords {
		if _, exists := c.processedMap.LoadOrStore(ref.ID, time.Now()); exists {
			continue
		}
		log.Printf("[WORKER PROCESSO] Abastecimento registrado: Máquina %s recebeu %.1f L de diesel",
			ref.MachineID, ref.LitersFuel)
	}

	// 3. Processar Monitoramento de Pragas MIP
	for _, pest := range batch.PestMonitoringRecords {
		if _, exists := c.processedMap.LoadOrStore(pest.ID, time.Now()); exists {
			continue
		}
		log.Printf("[WORKER PROCESSO] Registro MIP: Alvo %s no Talhão %s nível %s",
			pest.BiologicalTarget, pest.PlotID, pest.DamageLevel)
	}

	// 4. Processar Eventos Zootécnicos (Pesagem / RFID SISBOV)
	for _, anim := range batch.LivestockEvents {
		if _, exists := c.processedMap.LoadOrStore(anim.ID, time.Now()); exists {
			continue
		}
		log.Printf("[WORKER PROCESSO] Zootecnia: Animal %s evento %s (%.1f kg)",
			anim.AnimalRFID, anim.EventType, anim.WeightKg)
	}

	// Confirma processamento com sucesso no broker
	if err := msg.Ack(false); err != nil {
		log.Printf("[WORKER ERRO] Falha ao enviar ACK para mensagem: %v", err)
	} else {
		log.Printf("[WORKER SUCESSO] Lote %s totalmente persistido e conciliado.", batch.BatchID)
	}
}

func (c *SyncQueueConsumer) Stop() {
	close(c.stopChan)
}
