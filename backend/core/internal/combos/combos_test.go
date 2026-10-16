package combos_test

import (
	"testing"
	"time"

	"proxyai/core/internal/combos"
)

func TestCircuitBreaker_StateTransitions(t *testing.T) {
	cb := combos.NewCircuitBreaker("openai", 3, 50*time.Millisecond)

	if cb.State() != combos.StateClosed {
		t.Fatalf("esperava estado CLOSED, obteve %s", cb.State())
	}

	// 2 falhas: permanece CLOSED
	cb.RecordFailure()
	cb.RecordFailure()
	if cb.State() != combos.StateClosed {
		t.Fatalf("com 2 falhas esperava CLOSED, obteve %s", cb.State())
	}

	// 3ª falha atinge threshold -> OPEN
	cb.RecordFailure()
	if cb.State() != combos.StateOpen {
		t.Fatalf("com 3 falhas consecutivas esperava OPEN, obteve %s", cb.State())
	}

	// Durante o cooldown, permanece OPEN
	if cb.AllowRequest() {
		t.Fatalf("circuito OPEN não deveria permitir novas requisições")
	}

	// Aguarda o cooldown expirar -> HALF_OPEN
	time.Sleep(60 * time.Millisecond)
	if !cb.AllowRequest() {
		t.Fatalf("após cooldown esperava permissão para sonda canary")
	}
	if cb.State() != combos.StateHalfOpen {
		t.Fatalf("esperava estado HALF_OPEN, obteve %s", cb.State())
	}

	// Sonda com sucesso -> restaura para CLOSED
	cb.RecordSuccess()
	if cb.State() != combos.StateClosed {
		t.Fatalf("após sucesso da sonda esperava CLOSED, obteve %s", cb.State())
	}
}

func TestComboEngine_Failover(t *testing.T) {
	engine := combos.NewEngine()

	// Configura 2 alvos: Alvo 1 que falha e Alvo 2 saudável
	engine.RegisterTarget("target-1", func() (string, error) {
		return "", combos.ErrRateLimitExceeded
	})
	engine.RegisterTarget("target-2", func() (string, error) {
		return "resultado-sucesso", nil
	})

	combo := combos.Combo{
		ID:       "combo-coder",
		Strategy: combos.StrategyPriority,
		Targets:  []string{"target-1", "target-2"},
	}

	res, targetUsed, err := engine.Execute(combo)
	if err != nil {
		t.Fatalf("esperava sucesso no failover, obteve erro: %v", err)
	}

	if targetUsed != "target-2" {
		t.Errorf("esperava que o alvo 2 fosse usado no failover, obteve %s", targetUsed)
	}

	if res != "resultado-sucesso" {
		t.Errorf("resposta inesperada: %s", res)
	}
}
