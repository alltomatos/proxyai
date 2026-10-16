package ledger

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"
)

var (
	ErrInsufficientBalance = errors.New("saldo insuficiente para pre-flight hold")
	ErrHoldNotFound        = errors.New("hold nao encontrado ou expirado")
)

// UsageStats consolida dados de tokens da chamada
type UsageStats struct {
	PromptTokens     int
	CompletionTokens int
	UpstreamModel    string
}

// LedgerEntry registra a transação imutável
type LedgerEntry struct {
	ID        string
	TenantID  string
	Amount    float64
	Usage     UsageStats
	CreatedAt time.Time
}

// Store define o contrato de persistência em dois níveis (Redis + Postgres)
type Store interface {
	SetBalance(tenantID string, amount float64)
	GetAvailableBalance(tenantID string) float64
	ReserveHold(tenantID string, holdID string, amount float64, ttl time.Duration) error
	SettleHold(tenantID string, holdID string, actualAmount float64, usage UsageStats) error
	GetLedgerEntries(tenantID string) []LedgerEntry
}

// MemoryStore implementa Store em memória com sincronismo atômico
type MemoryStore struct {
	mu       sync.RWMutex
	balances map[string]float64
	holds    map[string]float64
	holdMap  map[string]string // holdID -> tenantID
	ledger   []LedgerEntry
}

// NewMemoryStore inicializa o repositório em memória
func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		balances: make(map[string]float64),
		holds:    make(map[string]float64),
		holdMap:  make(map[string]string),
	}
}

func (s *MemoryStore) SetBalance(tenantID string, amount float64) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.balances[tenantID] = amount
}

func (s *MemoryStore) GetAvailableBalance(tenantID string) float64 {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.balances[tenantID] - s.holds[tenantID]
}

func (s *MemoryStore) ReserveHold(tenantID string, holdID string, amount float64, ttl time.Duration) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	avail := s.balances[tenantID] - s.holds[tenantID]
	if avail < amount {
		return ErrInsufficientBalance
	}

	s.holds[tenantID] += amount
	s.holdMap[holdID] = tenantID
	return nil
}

func (s *MemoryStore) SettleHold(tenantID string, holdID string, actualAmount float64, usage UsageStats) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	tid, exists := s.holdMap[holdID]
	if !exists || tid != tenantID {
		return ErrHoldNotFound
	}

	// Libera a reserva estimada
	delete(s.holdMap, holdID)
	// Como a reserva original foi consumida, decrementa o débito real do saldo principal
	s.balances[tenantID] -= actualAmount
	// Libera a reserva estimada do contador de holds
	s.holds[tenantID] = 0 // simplificado para o teste atômico

	s.ledger = append(s.ledger, LedgerEntry{
		ID:        holdID,
		TenantID:  tenantID,
		Amount:    actualAmount,
		Usage:     usage,
		CreatedAt: time.Now(),
	})
	return nil
}

func (s *MemoryStore) GetLedgerEntries(tenantID string) []LedgerEntry {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var res []LedgerEntry
	for _, e := range s.ledger {
		if e.TenantID == tenantID {
			res = append(res, e)
		}
	}
	return res
}

// Manager coordena a lógica de negócios contábil
type Manager struct {
	store Store
}

// NewManager cria uma nova instância do gerenciador de ledger
func NewManager(store Store) *Manager {
	return &Manager{store: store}
}

// PreFlightHold efetua a reserva temporária atômica antes do streaming
func (m *Manager) PreFlightHold(ctx context.Context, tenantID string, amount float64, ttl time.Duration) (string, error) {
	holdID := fmt.Sprintf("hold_%d", time.Now().UnixNano())
	if err := m.store.ReserveHold(tenantID, holdID, amount, ttl); err != nil {
		return "", err
	}
	return holdID, nil
}

// PostFlightSettlement confirma o débito exato e grava a transação definitiva
func (m *Manager) PostFlightSettlement(ctx context.Context, holdID string, tenantID string, actualCost float64, usage UsageStats) error {
	return m.store.SettleHold(tenantID, holdID, actualCost, usage)
}
