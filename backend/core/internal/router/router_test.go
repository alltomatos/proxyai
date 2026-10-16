package router_test

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"proxyai/core/internal/router"
)

func TestChatCompletions_ValidPayload(t *testing.T) {
	appRouter := router.NewRouter()

	payload := []byte(`{
		"model": "gpt-4o",
		"messages": [
			{"role": "user", "content": "Hello ProxyAI"}
		]
	}`)

	req, err := http.NewRequest(http.MethodPost, "/v1/chat/completions", bytes.NewBuffer(payload))
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	appRouter.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected status 200 OK, got %d. Body: %s", rr.Code, rr.Body.String())
	}
}

func TestChatCompletions_InvalidPayload(t *testing.T) {
	appRouter := router.NewRouter()

	invalidPayload := []byte(`{"model": ""}`)

	req, err := http.NewRequest(http.MethodPost, "/v1/chat/completions", bytes.NewBuffer(invalidPayload))
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	appRouter.ServeHTTP(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("expected status 400 Bad Request, got %d", rr.Code)
	}
}
