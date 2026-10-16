package main

import (
	"log"
	"net/http"
	"os"

	"proxyai/core/internal/router"
)

func main() {
	// Pureza de Stdio: Todos os logs da aplicação saem obrigatoriamente no stderr
	logger := log.New(os.Stderr, "[ProxyAI-Core] ", log.LstdFlags|log.Lmicroseconds)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	appRouter := router.NewRouter()

	logger.Printf("ProxyAI Data Plane iniciado e escutando na porta :%s\n", port)
	if err := http.ListenAndServe(":"+port, appRouter); err != nil {
		logger.Fatalf("Falha crítica no servidor HTTP: %v\n", err)
	}
}
