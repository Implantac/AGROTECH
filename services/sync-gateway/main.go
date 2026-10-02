package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/superagtech/sync-gateway/handlers"
	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	rabbitURL := os.Getenv("RABBITMQ_URL")
	if rabbitURL == "" {
		rabbitURL = "amqp://agro_rabbit:agro_rabbit_pass_2026@localhost:5672/"
	}

	log.Printf("[SUPER AGTECH - SYNC GATEWAY] Iniciando serviço na porta %s...", port)

	// Conexão resiliente com RabbitMQ
	var rabbitConn *amqp.Connection
	var rabbitChan *amqp.Channel
	var err error

	for retries := 0; retries < 10; retries++ {
		rabbitConn, err = amqp.Dial(rabbitURL)
		if err == nil {
			rabbitChan, err = rabbitConn.Channel()
			if err == nil {
				log.Println("[RABBITMQ] Conexão estabelecida com sucesso com o broker de eventos.")
				break
			}
		}
		log.Printf("[RABBITMQ] Aguardando broker (%d/10): %v", retries+1, err)
		time.Sleep(2 * time.Second)
	}

	if rabbitChan != nil {
		defer rabbitConn.Close()
		defer rabbitChan.Close()

		// Declara fila persistente de sincronização
		_, err = rabbitChan.QueueDeclare(
			"agro.sync.mobile.queue", // nome da fila
			true,                     // durable
			false,                    // delete when unused
			false,                    // exclusive
			false,                    // no-wait
			amqp.Table{
				"x-dead-letter-exchange": "agro.sync.dlx",
			},
		)
		if err != nil {
			log.Fatalf("Falha ao declarar fila RabbitMQ: %v", err)
		}
	}

	syncHandler := handlers.NewSyncHandler(rabbitChan)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    "HEALTHY",
			"service":   "sync-gateway-go",
			"timestamp": time.Now().UTC(),
		})
	})
	mux.HandleFunc("/api/v1/sync/push", syncHandler.HandlePushBatch)

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      mux,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	go func() {
		log.Printf("[HTTP] Gateway escutando requisições em http://0.0.0.0:%s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Erro no servidor HTTP: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("[SHUTDOWN] Desligando Gateway suavemente...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Falha ao forçar shutdown do servidor:", err)
	}
	fmt.Println("Gateway finalizado.")
}
