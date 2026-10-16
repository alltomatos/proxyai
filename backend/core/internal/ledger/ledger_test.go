package ledger_test

import (
	"context"
	"testing"
	"time"

	"proxyai/core/internal/ledger"
)

func TestLedgerManager_PreFlightHold_Success(t *testing.T) {
	ctx := context.Background()
	storage := ledger.NewMemoryStore()
	lm := ledger.NewManager(storage)

	tenantID := "ten_test_1"
	// Credita R$ 100,00 na conta do tenant
	storage.SetBalance(tenantID, 100.0)

	// Solicita reserva estimada de R$ 0,50
	holdID, err := lm.PreFlightHold(ctx, tenantID, 0.50, 5*time.Minute)
	if err != nil {
		t.Fatalf("esperava sucesso no hold, obteve erro: %v", err)
	}

	if holdID == "" {
		t.Fatalf("holdID gerado não pode ser vazio")
	}

	// O saldo disponível agora deve ser R$ 99,50
	avail := storage.GetAvailableBalance(tenantID)
	if avail != 99.50 {
		t.Errorf("esperava saldo disponível de 99.50, obteve %f", avail)
	}
}

func TestLedgerManager_PreFlightHold_InsufficientBalance(t *testing.T) {
	ctx := context.Background()
	storage := ledger.NewMemoryStore()
	lm := ledger.NewManager(storage)

	tenantID := "ten_broke"
	storage.SetBalance(tenantID, 0.20) // Saldo inferior ao hold de 0.50

	_, err := lm.PreFlightHold(ctx, tenantID, 0.50, 5*time.Minute)
	if err != ledger.ErrInsufficientBalance {
		t.Fatalf("esperava ErrInsufficientBalance, obteve: %v", err)
	}
}

func TestLedgerManager_PostFlightSettlement(t *testing.T) {
	ctx := context.Background()
	storage := ledger.NewMemoryStore()
	lm := ledger.NewManager(storage)

	tenantID := "ten_settle"
	storage.SetBalance(tenantID, 50.0)

	holdID, err := lm.PreFlightHold(ctx, tenantID, 1.0, 5*time.Minute)
	if err != nil {
		t.Fatalf("falha ao criar hold: %v", err)
	}

	// O consumo real foi de apenas R$ 0,15 (menor que a reserva de 1.0)
	err = lm.PostFlightSettlement(ctx, holdID, tenantID, 0.15, ledger.UsageStats{
		PromptTokens:     1000,
		CompletionTokens: 250,
		UpstreamModel:    "gpt-4o",
	})
	if err != nil {
		t.Fatalf("falha na liquidação: %v", err)
	}

	// Saldo final deve ser 50.0 - 0.15 = 49.85 e zero reservas pendentes
	avail := storage.GetAvailableBalance(tenantID)
	if avail != 49.85 {
		t.Errorf("esperava saldo final de 49.85, obteve %f", avail)
	}

	entries := storage.GetLedgerEntries(tenantID)
	if len(entries) != 1 {
		t.Fatalf("esperava 1 entrada no ledger definitivo, obteve %d", len(entries))
	}

	if entries[0].Amount != 0.15 {
		t.Errorf("valor gravado incorreto: %f", entries[0].Amount)
	}
}
