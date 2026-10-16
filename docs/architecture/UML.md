# Diagramas UML de Arquitetura e Engenharia — ProxyAI

---

## 1. Diagrama de Classes e Componentes do Data Plane (Go)

```mermaid
classDiagram
    class GatewayServer {
        -Router: chi.Router
        -Config: Config
        -RedisClient: RedisPool
        -DB: PostgresPool
        +Start(port int): error
        +HandleChatCompletions(w, r): void
    }

    class AuthEngine {
        +ValidateKey(apiKey string): (Tenant, ApiKey, error)
        +CheckBudget(tenantID string): (bool, error)
        +VerifyScopes(key ApiKey, required []string): bool
    }

    class LedgerManager {
        +PreFlightHold(tenantID string, estimatedTokens int): (string, error)
        +PostFlightSettlement(holdID string, actualCost decimal, usage UsageStats): error
        +ReleaseHold(holdID string): error
    }

    class ComboDispatcher {
        +ResolveStrategy(comboID string): RoutingStrategy
        +ExecutePipeline(ctx context.Context, combo Combo, req ChatRequest): (StreamResponse, error)
    }

    class CircuitBreaker {
        -state: string
        -failureThreshold: int
        -cooldownDuration: time.Duration
        +Execute(target Target, req Request): (Response, error)
        +RecordSuccess(): void
        +RecordFailure(statusCode int): void
        +GetState(): string
    }

    class UpstreamExecutor {
        <<interface>>
        +ExecuteStream(ctx context.Context, req Request): (<-chan SSEChunk, error)
    }

    class OpenAIExecutor {
        +ExecuteStream(ctx, req): (<-chan SSEChunk, error)
    }

    class ClaudeExecutor {
        +ExecuteStream(ctx, req): (<-chan SSEChunk, error)
    }

    class WebStealthSidecarExecutor {
        +ExecuteStream(ctx, req): (<-chan SSEChunk, error)
    }

    class WebshareProxyManager {
        +GetBestProxy(country string, mode string): (ProxyConfig, error)
        +SyncProxiesFromAPI(): error
    }

    GatewayServer --> AuthEngine
    GatewayServer --> LedgerManager
    GatewayServer --> ComboDispatcher
    ComboDispatcher --> CircuitBreaker
    CircuitBreaker --> UpstreamExecutor
    UpstreamExecutor <|.. OpenAIExecutor
    UpstreamExecutor <|.. ClaudeExecutor
    UpstreamExecutor <|.. WebStealthSidecarExecutor
    WebStealthSidecarExecutor --> WebshareProxyManager
```

---

## 2. Diagrama de Máquina de Estados: Circuit Breaker de Provedores

```mermaid
stateDiagram-v2
    [*] --> CLOSED: Inicialização Saudável

    state CLOSED {
        [*] --> NormalTraffic
        NormalTraffic: Tráfego normal 100% liberado
        NormalTraffic --> CheckFailureRate: Falhas consecutivas
    }

    CLOSED --> DEGRADED: Falhas > 15% ou Rate-Limit 429
    
    state DEGRADED {
        DegradedTraffic: Tráfego continua com alertas visuais no dashboard
    }

    DEGRADED --> CLOSED: Taxa de sucesso recuperada (>95%)
    DEGRADED --> OPEN: Falhas > 40% (Threshold atingido)
    CLOSED --> OPEN: Timeout consecutivo severo

    state OPEN {
        BlockedTraffic: Todas as chamadas são desviadas para o próximo alvo do Combo
        CooldownTimer: Aguarda janela de resiliência (ex: 30 segundos)
    }

    OPEN --> HALF_OPEN: Cooldown expirado

    state HALF_OPEN {
        CanaryProbe: Permite 1 requisição de sonda (canary request)
    }

    HALF_OPEN --> CLOSED: Sonda bem-sucedida (HTTP 200)
    HALF_OPEN --> OPEN: Sonda falhou (volta ao bloqueio por 60s)
```

---

## 3. Diagrama de Sequência: Fluxo Ponta-a-Ponta com Pre-Flight Hold e Streaming SSE

```mermaid
sequenceDiagram
    autonumber
    actor DevClient as Cliente / Agente (IDE / CLI)
    participant GW as ProxyAI Gateway (Go)
    participant Redis as Redis Cache & Holds
    participant Postgres as PostgreSQL (Ledger RLS)
    participant Upstream as Provedor Upstream (OpenAI/Claude)

    DevClient->>GW: POST /v1/chat/completions (Bearer pk-live-...)
    GW->>Redis: Validar Chave de API & Escopos
    Redis-->>GW: Tenant = Acme, Cota = R$ 5.000, Saldo OK

    GW->>Redis: Pre-Flight Hold (Lua Script: Reserva R$ 0,50 estimados)
    alt Saldo Insuficiente / Cota Excedida
        Redis-->>GW: ERRO_SALDO_INSUFICIENTE
        GW-->>DevClient: HTTP 402 Payment Required / 429 Quota Exceeded
    else Reserva Aprovada
        Redis-->>GW: HoldID = hold_9a8b1c
        GW->>Upstream: POST /chat/completions (Stream: true, Master Key)
        
        loop Transmissão de Chunks SSE
            Upstream-->>GW: data: {"choices": [{"delta": {"content": "..."}}]}
            GW-->>DevClient: data: {"choices": [{"delta": {"content": "..."}}]}
        end

        Upstream-->>GW: data: [DONE] (usage: {prompt: 1200, completion: 450})
        GW-->>DevClient: data: [DONE]

        critical Liquidação Pós-Stream (Post-Flight Settlement)
            GW->>Redis: Release Hold (hold_9a8b1c)
            GW->>Postgres: INSERT INTO credit_ledger (Tenant Acme, Gasto Real R$ 0,082, Tokens)
            Postgres-->>GW: Transação Gravada com Sucesso
        end
    end
```
