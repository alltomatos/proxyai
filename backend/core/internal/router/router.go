package router

import (
	"encoding/json"
	"net/http"
	"time"
)

// Router encapsula o multiplexador de requisições HTTP do Data Plane
type Router struct {
	mux *http.ServeMux
}

// NewRouter instancia e configura as rotas suportadas pelo Gateway
func NewRouter() *Router {
	r := &Router{
		mux: http.NewServeMux(),
	}
	r.registerRoutes()
	return r
}

func (r *Router) registerRoutes() {
	r.mux.HandleFunc("/v1/chat/completions", r.handleChatCompletions)
	r.mux.HandleFunc("/healthz", r.handleHealth)
}

// ServeHTTP implementa a interface http.Handler
func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	r.mux.ServeHTTP(w, req)
}

func (r *Router) handleHealth(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{
		"status": "healthy",
		"mode":   "data_plane",
	})
}

func (r *Router) handleChatCompletions(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "Method not allowed", "invalid_request_error")
		return
	}

	var chatReq ChatCompletionRequest
	decoder := json.NewDecoder(req.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&chatReq); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON payload or unknown fields", "invalid_request_error")
		return
	}

	if chatReq.Model == "" {
		writeError(w, http.StatusBadRequest, "The 'model' field is required", "invalid_request_error")
		return
	}

	if len(chatReq.Messages) == 0 {
		writeError(w, http.StatusBadRequest, "The 'messages' array must not be empty", "invalid_request_error")
		return
	}

	res := ChatCompletionResponse{
		ID:      "chatcmpl-proxyai-init",
		Object:  "chat.completion",
		Created: time.Now().Unix(),
		Model:   chatReq.Model,
		Choices: []ChatCompletionResponseChoice{
			{
				Index: 0,
				Message: Message{
					Role:    "assistant",
					Content: "ProxyAI Data Plane Ready",
				},
				FinishReason: "stop",
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(res)
}

func writeError(w http.ResponseWriter, statusCode int, message string, errType string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(ErrorResponse{
		Error: ErrorDetail{
			Message: message,
			Type:    errType,
		},
	})
}
