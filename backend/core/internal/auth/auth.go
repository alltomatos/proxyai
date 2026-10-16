package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"sync"
	"time"
)

var (
	ErrInvalidCredentials = errors.New("usuario ou senha corporativa incorretos")
	ErrLimit5hExceeded     = errors.New("limite de 5 horas do colaborador excedido")
	ErrLimitWeeklyExceeded = errors.New("limite semanal do colaborador excedido")
	ErrLimitMonthlyExceeded = errors.New("limite mensal do colaborador excedido")
)

// CollaboratorUser representa a entidade de usuário no banco
type CollaboratorUser struct {
	ID            string
	Username      string
	Password      string
	TenantSlug    string
	LimitMonthly  float64
	AllowedModels []string
}

// UserStore define o contrato de persistência de colaboradores
type UserStore interface {
	CreateCollaborator(username, password, tenantSlug string, limitMonthly float64, allowedModels []string) error
	FindByUsernameAndTenant(username, tenantSlug string) (*CollaboratorUser, error)
}

// MemoryUserStore implementação em memória para testes
type MemoryUserStore struct {
	mu    sync.RWMutex
	users map[string]*CollaboratorUser
}

// NewMemoryUserStore instancia o repositório
func NewMemoryUserStore() *MemoryUserStore {
	return &MemoryUserStore{
		users: make(map[string]*CollaboratorUser),
	}
}

func (s *MemoryUserStore) CreateCollaborator(username, password, tenantSlug string, limitMonthly float64, allowedModels []string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	key := tenantSlug + ":" + username
	s.users[key] = &CollaboratorUser{
		ID:            "usr_" + hex.EncodeToString([]byte(username))[:8],
		Username:      username,
		Password:      password,
		TenantSlug:    tenantSlug,
		LimitMonthly:  limitMonthly,
		AllowedModels: allowedModels,
	}
	return nil
}

func (s *MemoryUserStore) FindByUsernameAndTenant(username, tenantSlug string) (*CollaboratorUser, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	key := tenantSlug + ":" + username
	u, exists := s.users[key]
	if !exists {
		return nil, ErrInvalidCredentials
	}
	return u, nil
}

// Service executa a lógica de autenticação de membros
type Service struct {
	store UserStore
}

// NewService cria o serviço de autenticação
func NewService(store UserStore) *Service {
	return &Service{store: store}
}

// Login valida as credenciais e devolve um token de sessão
func (s *Service) Login(ctx context.Context, username, password, tenantSlug string) (string, *CollaboratorUser, error) {
	u, err := s.store.FindByUsernameAndTenant(username, tenantSlug)
	if err != nil {
		return "", nil, err
	}

	if u.Password != password {
		return "", nil, ErrInvalidCredentials
	}

	b := make([]byte, 16)
	_, _ = rand.Read(b)
	token := "opc_usr_" + hex.EncodeToString(b)
	return token, u, nil
}

// MultiWindowLimiter gerencia janelas temporais de 5h, semanal e mensal
type MultiWindowLimiter struct {
	mu           sync.RWMutex
	limits5h     map[string]float64
	limitsWeekly map[string]float64
	spent5h      map[string]float64
	spentWeekly  map[string]float64
	lastReset5h  map[string]time.Time
}

// NewMultiWindowLimiter instancia o limitador
func NewMultiWindowLimiter() *MultiWindowLimiter {
	return &MultiWindowLimiter{
		limits5h:     make(map[string]float64),
		limitsWeekly: make(map[string]float64),
		spent5h:      make(map[string]float64),
		spentWeekly:  make(map[string]float64),
		lastReset5h:  make(map[string]time.Time),
	}
}

func (l *MultiWindowLimiter) SetUserLimits(userID string, limit5h, limitWeekly, limitMonthly float64) {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.limits5h[userID] = limit5h
	l.limitsWeekly[userID] = limitWeekly
	l.lastReset5h[userID] = time.Now()
}

func (l *MultiWindowLimiter) RecordUsage(userID string, amount float64) error {
	l.mu.Lock()
	defer l.mu.Unlock()

	// Valida janela de 5 horas
	limit5h := l.limits5h[userID]
	if limit5h > 0 {
		if l.spent5h[userID]+amount > limit5h {
			return ErrLimit5hExceeded
		}
	}

	// Valida janela semanal
	limitWeek := l.limitsWeekly[userID]
	if limitWeek > 0 {
		if l.spentWeekly[userID]+amount > limitWeek {
			return ErrLimitWeeklyExceeded
		}
	}

	l.spent5h[userID] += amount
	l.spentWeekly[userID] += amount
	return nil
}
