package sse_test

import (
	"context"
	"io"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"proxyai/core/pkg/sse"
)

func TestStreamWriter_FlushChunks(t *testing.T) {
	rec := httptest.NewRecorder()
	writer := sse.NewWriter(rec)

	chunks := []string{
		`{"choices":[{"delta":{"content":"Olá"}}]}`,
		`{"choices":[{"delta":{"content":" mundo"}}]}`,
	}

	for _, chunk := range chunks {
		if err := writer.SendChunk(chunk); err != nil {
			t.Fatalf("falha ao enviar chunk: %v", err)
		}
	}

	if err := writer.SendDone(); err != nil {
		t.Fatalf("falha ao enviar DONE: %v", err)
	}

	body := rec.Body.String()
	if !strings.Contains(body, "data: "+chunks[0]) {
		t.Errorf("chunk 1 não encontrado no stream: %s", body)
	}
	if !strings.Contains(body, "data: [DONE]") {
		t.Errorf("marcador [DONE] não encontrado no stream: %s", body)
	}
}

func TestStreamForwarder_ContextCancellation(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())

	rec := httptest.NewRecorder()
	writer := sse.NewWriter(rec)

	pr, pw := io.Pipe()

	go func() {
		_, _ = pw.Write([]byte("data: chunk1\n\n"))
		time.Sleep(20 * time.Millisecond)
		cancel()
		time.Sleep(20 * time.Millisecond)
		_ = pw.Close()
	}()

	err := sse.ForwardStream(ctx, pr, writer)

	if err == nil {
		t.Errorf("esperava erro de cancelamento de contexto, recebeu nil")
	}
	if ctx.Err() != context.Canceled {
		t.Errorf("esperava context.Canceled, obteve: %v", ctx.Err())
	}
}
