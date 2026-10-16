package mcp

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
)

// JSONRPCRequest estrutura de requisição MCP
type JSONRPCRequest struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      interface{}     `json:"id"`
	Method  string          `json:"method"`
	Params  json.RawMessage `json:"params,omitempty"`
}

// JSONRPCResponse estrutura de resposta MCP
type JSONRPCResponse struct {
	JSONRPC string      `json:"jsonrpc"`
	ID      interface{} `json:"id"`
	Result  interface{} `json:"result,omitempty"`
	Error   interface{} `json:"error,omitempty"`
}

// ToolDefinition descreve uma ferramenta do catálogo
type ToolDefinition struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	InputSchema interface{} `json:"inputSchema"`
}

// Server encapsula o despachante JSON-RPC 2.0
type Server struct {
	tools map[string]ToolDefinition
}

// NewServer inicializa o servidor com ferramentas essenciais
func NewServer() *Server {
	s := &Server{
		tools: make(map[string]ToolDefinition),
	}
	s.registerDefaultTools()
	return s
}

func (s *Server) registerDefaultTools() {
	s.tools["proxyai_get_health"] = ToolDefinition{
		Name:        "proxyai_get_health",
		Description: "Retorna a saude global do gateway, memoria e status dos circuit breakers.",
		InputSchema: map[string]interface{}{
			"type": "object",
		},
	}
	s.tools["proxyai_list_combos"] = ToolDefinition{
		Name:        "proxyai_list_combos",
		Description: "Lista todos os combos de modelos configurados e suas ordens de failover.",
		InputSchema: map[string]interface{}{
			"type": "object",
		},
	}
}

// HandleSingleRequest lê uma linha JSON-RPC de in e escreve a resposta em out
func (s *Server) HandleSingleRequest(in io.Reader, out io.Writer) error {
	scanner := bufio.NewScanner(in)
	if !scanner.Scan() {
		return scanner.Err()
	}

	var req JSONRPCRequest
	if err := json.Unmarshal(scanner.Bytes(), &req); err != nil {
		return err
	}

	var resp JSONRPCResponse
	resp.JSONRPC = "2.0"
	resp.ID = req.ID

	switch req.Method {
	case "initialize":
		resp.Result = map[string]interface{}{
			"protocolVersion": "2024-11-05",
			"serverInfo": map[string]string{
				"name":    "proxyai",
				"version": "1.0.0",
			},
			"capabilities": map[string]interface{}{
				"tools": map[string]bool{
					"listChanged": false,
				},
			},
		}
	case "tools/list":
		var list []ToolDefinition
		for _, t := range s.tools {
			list = append(list, t)
		}
		resp.Result = map[string]interface{}{
			"tools": list,
		}
	default:
		resp.Error = map[string]interface{}{
			"code":    -32601,
			"message": fmt.Sprintf("Metodo nao encontrado: %s", req.Method),
		}
	}

	bytes, err := json.Marshal(resp)
	if err != nil {
		return err
	}
	_, err = fmt.Fprintf(out, "%s\n", bytes)
	return err
}
