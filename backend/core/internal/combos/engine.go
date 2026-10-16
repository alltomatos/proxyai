package combos

import (
	"sync"
)

// TargetFunc representa a função executora de inferência do alvo
type TargetFunc func() (string, error)

// Combo define o encadeamento de múltiplos alvos
type Combo struct {
	ID       string
	Strategy string
	Targets  []string
}

// Engine orquestra o despacho de combos com tolerância a falhas
type Engine struct {
	mu       sync.RWMutex
	targets  map[string]TargetFunc
	breakers map[string]*CircuitBreaker
}

// NewEngine cria uma nova instância do motor de combos
func NewEngine() *Engine {
	return &Engine{
		targets:  make(map[string]TargetFunc),
		breakers: make(map[string]*CircuitBreaker),
	}
}

// RegisterTarget vincula um alvo a uma função de execução e cria seu circuit breaker
func (e *Engine) RegisterTarget(id string, fn TargetFunc) {
	e.mu.Lock()
	defer e.mu.Unlock()

	e.targets[id] = fn
	if _, exists := e.breakers[id]; !exists {
		// Padrão: 3 falhas consecutivas abrem o circuito por 30s
		e.breakers[id] = NewCircuitBreaker(id, 3, 30)
	}
}

// Execute executa o pipeline de combo seguindo a estratégia configurada
func (e *Engine) Execute(combo Combo) (string, string, error) {
	e.mu.RLock()
	defer e.mu.RUnlock()

	for _, targetID := range combo.Targets {
		fn, exists := e.targets[targetID]
		if !exists {
			continue
		}

		cb := e.breakers[targetID]
		if cb != nil && !cb.AllowRequest() {
			continue // Circuito aberto: salta imediatamente sem latência de timeout
		}

		res, err := fn()
		if err == nil {
			if cb != nil {
				cb.RecordSuccess()
			}
			return res, targetID, nil
		}

		// Registra a falha no breaker e continua para o próximo alvo do combo
		if cb != nil {
			cb.RecordFailure()
		}
	}

	return "", "", ErrAllTargetsFailed
}
