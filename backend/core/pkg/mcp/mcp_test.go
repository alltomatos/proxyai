package mcp_test

import (
	"bytes"
	"encoding/json"
	"strings"
	"testing"

	"proxyai/core/pkg/mcp"
)

func TestMCPServer_Initialize(t *testing.T) {
	server := mcp.NewServer()

	reqJSON := `{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05"}}`
	in := bytes.NewBufferString(reqJSON + "\n")
	out := &bytes.Buffer{}

	err := server.HandleSingleRequest(in, out)
	if err != nil {
		t.Fatalf("erro ao processar initialize: %v", err)
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(out.Bytes(), &resp); err != nil {
		t.Fatalf("resposta invalida: %v", err)
	}

	result, ok := resp["result"].(map[string]interface{})
	if !ok {
		t.Fatalf("resposta sem campo result: %s", out.String())
	}

	serverInfo, ok := result["serverInfo"].(map[string]interface{})
	if !ok || serverInfo["name"] != "proxyai" {
		t.Errorf("serverInfo incorreto: %v", serverInfo)
	}
}

func TestMCPServer_ToolsList(t *testing.T) {
	server := mcp.NewServer()

	reqJSON := `{"jsonrpc":"2.0","id":2,"method":"tools/list"}`
	in := bytes.NewBufferString(reqJSON + "\n")
	out := &bytes.Buffer{}

	err := server.HandleSingleRequest(in, out)
	if err != nil {
		t.Fatalf("erro ao listar ferramentas: %v", err)
	}

	body := out.String()
	if !strings.Contains(body, "proxyai_get_health") {
		t.Errorf("ferramenta proxyai_get_health não encontrada em tools/list: %s", body)
	}
	if !strings.Contains(body, "proxyai_list_combos") {
		t.Errorf("ferramenta proxyai_list_combos não encontrada em tools/list: %s", body)
	}
}
