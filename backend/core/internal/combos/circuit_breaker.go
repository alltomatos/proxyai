package combos

import (
	"errors"
	"sync"
	"time"
)

// Estados da máquina de Circuit Breaker
const (
	StateClosed   = "CLOSED"
	StateDegraded = "DEGRADED"
	StateOpen     = "OPEN"
	StateHalfOpen = "HALF_OPEN"
)

// Estratégias de Combo
const (
	StrategyPriority     = "priority"
	StrategyCostOpt      = "cost-optimized"
	StrategyHeadroom     = "headroom"
	StrategyFusion       = "fusion"
)

var (
	ErrRateLimitExceeded = errors.New("upstream rate limit 429")
	ErrAllTargetsFailed  = errors.New("all targets in combo chain failed")
	ErrCircuitOpen       = errors.New("circuit breaker is OPEN")
)

// CircuitBreaker gerencia a máquina de estados de tolerância a falhas
type CircuitBreaker struct {
	mu               sync.RWMutex
	name             string
	state            string
	failureCount     int
	failureThreshold int
	cooldown         time.Duration
	lastFailureTime  time.Time
}

// NewCircuitBreaker cria um circuit breaker atômico
func NewCircuitBreaker(name string, threshold int, cooldown time.Duration) *CircuitBreaker {
	return &CircuitBreaker{
		name:             name,
		state:            StateClosed,
		failureThreshold: threshold,
		cooldown:         cooldown,
	}
}

// State retorna o estado atual do circuito
func (cb *CircuitBreaker) State() string {
	cb.mu.RLock()
	defer cb.mu.RUnlock()
	return cb.state
}

// AllowRequest verifica se o circuito permite novas tentativas
func (cb *CircuitBreaker) AllowRequest() bool {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	if cb.state == StateClosed || cb.state == StateDegraded {
		return true
	}

	if cb.state == StateOpen {
		if time.Since(cb.lastFailureTime) >= cb.cooldown {
			cb.state = StateHalfOpen
			return true
		}
		return false
	}

	return true // HALF_OPEN permite sonda
}

// RecordSuccess registra sucesso na chamada
func (cb *CircuitBreaker) RecordSuccess() {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	cb.failureCount = 0
	cb.state = StateClosed
}

// RecordFailure registra falha consecutiva
func (cb *CircuitBreaker) RecordFailure() {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	cb.failureCount++
	cb.lastFailureTime = time.Now()

	if cb.failureCount >= cb.failureThreshold {
		cb.state = StateOpen
	}
}
