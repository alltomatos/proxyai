package sse

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"net/http"
	"strings"
)

// Writer gerencia a escrita e flush imediato de Server-Sent Events
type Writer struct {
	w       http.ResponseWriter
	flusher http.Flusher
}

// NewWriter instancia um novo escritor SSE
func NewWriter(w http.ResponseWriter) *Writer {
	flusher, _ := w.(http.Flusher)
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")

	return &Writer{
		w:       w,
		flusher: flusher,
	}
}

// SendChunk envia um bloco de dados SSE com flush imediato
func (sw *Writer) SendChunk(data string) error {
	if _, err := fmt.Fprintf(sw.w, "data: %s\n\n", data); err != nil {
		return err
	}
	if sw.flusher != nil {
		sw.flusher.Flush()
	}
	return nil
}

// SendDone envia o marcador final padrão de término da OpenAI
func (sw *Writer) SendDone() error {
	if _, err := fmt.Fprintf(sw.w, "data: [DONE]\n\n"); err != nil {
		return err
	}
	if sw.flusher != nil {
		sw.flusher.Flush()
	}
	return nil
}

// ForwardStream lê do leitor upstream e transmite para o downstream respeitando o contexto
func ForwardStream(ctx context.Context, r io.Reader, sw *Writer) error {
	type scanResult struct {
		line string
		err  error
		done bool
	}

	ch := make(chan scanResult)

	go func() {
		defer close(ch)
		scanner := bufio.NewScanner(r)
		for scanner.Scan() {
			ch <- scanResult{line: scanner.Text()}
		}
		if err := scanner.Err(); err != nil {
			ch <- scanResult{err: err}
		} else {
			ch <- scanResult{done: true}
		}
	}()

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case res, ok := <-ch:
			if !ok || res.done {
				return nil
			}
			if res.err != nil {
				return res.err
			}
			line := res.line
			if strings.HasPrefix(line, "data: ") {
				payload := strings.TrimPrefix(line, "data: ")
				if payload == "[DONE]" {
					return sw.SendDone()
				}
				if err := sw.SendChunk(payload); err != nil {
					return err
				}
			}
		}
	}
}
