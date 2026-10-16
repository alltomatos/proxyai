package router

// Message representa uma mensagem no padrão OpenAI Chat API
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// ChatCompletionRequest representa a requisição de inferência
type ChatCompletionRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
	Stream   bool      `json:"stream,omitempty"`
}

// ChatCompletionResponseChoice representa uma escolha na resposta
type ChatCompletionResponseChoice struct {
	Index        int     `json:"index"`
	Message      Message `json:"message"`
	FinishReason string  `json:"finish_reason"`
}

// ChatCompletionResponse representa a resposta de inferência síncrona
type ChatCompletionResponse struct {
	ID      string                         `json:"id"`
	Object  string                         `json:"object"`
	Created int64                          `json:"created"`
	Model   string                         `json:"model"`
	Choices []ChatCompletionResponseChoice `json:"choices"`
}

// ErrorResponse padroniza retornos de erro da API
type ErrorResponse struct {
	Error ErrorDetail `json:"error"`
}

// ErrorDetail contém os detalhes do erro
type ErrorDetail struct {
	Message string `json:"message"`
	Type    string `json:"type"`
	Code    string `json:"code,omitempty"`
}
