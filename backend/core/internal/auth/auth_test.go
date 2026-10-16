package auth_test

import (
	"context"
	"testing"

	"proxyai/core/internal/auth"
)

func TestCollaboratorAuth_Login_Success(t *testing.T) {
	ctx := context.Background()
	store := auth.NewMemoryUserStore()
	authService := auth.NewService(store)

	// Cadastra colaborador para a empresa Acme
	_ = store.CreateCollaborator("dev@acme.com", "senha123", "acme", 150.0, []string{"gpt-4o-mini", "claude-3-5-sonnet"})

	token, user, err := authService.Login(ctx, "dev@acme.com", "senha123", "acme")
	if err != nil {
		t.Fatalf("esperava sucesso no login, obteve erro: %v", err)
	}

	if token == "" || len(token) < 10 {
		t.Errorf("token gerado invalido: %s", token)
	}

	if user.Username != "dev@acme.com" || user.TenantSlug != "acme" {
		t.Errorf("dados de usuario retornados incorretos: %+v", user)
	}
}

func TestCollaboratorAuth_Login_InvalidPassword(t *testing.T) {
	ctx := context.Background()
	store := auth.NewMemoryUserStore()
	authService := auth.NewService(store)

	_ = store.CreateCollaborator("dev@acme.com", "senha-correta", "acme", 100.0, []string{})

	_, _, err := authService.Login(ctx, "dev@acme.com", "senha-errada", "acme")
	if err != auth.ErrInvalidCredentials {
		t.Fatalf("esperava ErrInvalidCredentials, obteve: %v", err)
	}
}

func TestMultiWindowLimiter_Check(t *testing.T) {
	limiter := auth.NewMultiWindowLimiter()

	userID := "usr_dev_1"
	// Configura limite de R$ 35,00 por janela de 5h
	limiter.SetUserLimits(userID, 35.0, 150.0, 500.0)

	// Consome R$ 30,00 -> permitido
	err := limiter.RecordUsage(userID, 30.0)
	if err != nil {
		t.Fatalf("esperava consumo aprovado, obteve: %v", err)
	}

	// Tenta consumir mais R$ 10,00 (Total 40 > 35) -> Bloqueio 429
	err = limiter.RecordUsage(userID, 10.0)
	if err != auth.ErrLimit5hExceeded {
		t.Fatalf("esperava ErrLimit5hExceeded, obteve: %v", err)
	}
}
