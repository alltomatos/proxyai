# Diagrama Entidade-Relacionamento (DER) — ProxyAI

> **Banco de Dados Relacional:** PostgreSQL 16+ com Row-Level Security (RLS)  
> **Camada de Cache & Locks:** Redis 7+

---

## 1. Diagrama DER Visual (Mermaid)

```mermaid
erDiagram
    TENANTS ||--o{ USERS : "possui"
    TENANTS ||--o{ API_KEYS : "emite"
    TENANTS ||--o{ CREDIT_LEDGER : "registra transacoes"
    TENANTS ||--o{ COMBOS : "configura / acessa"
    
    USERS ||--o{ API_KEYS : "cria"
    
    PROVIDERS ||--o{ PROVIDER_ACCOUNTS : "possui credenciais"
    PROVIDER_ACCOUNTS ||--o{ CIRCUIT_BREAKER_LOGS : "historico de falhas"
    
    COMBOS ||--o{ COMBO_TARGETS : "contem alvos ordenados"
    PROVIDER_ACCOUNTS ||--o{ COMBO_TARGETS : "atende"

    TENANTS {
        uuid id PK
        string name
        string slug UK
        decimal limit_5h_usd "teto da janela móvel de 5h para toda empresa"
        decimal limit_weekly_usd "teto da janela semanal para toda empresa"
        decimal monthly_budget_usd "teto mensal total"
        decimal current_cycle_spent_usd
        int budget_reset_day
        string currency
        jsonb allowed_combos
        jsonb allowed_models
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    USERS {
        uuid id PK
        uuid tenant_id FK
        string email UK
        string username UK
        string password_hash
        string full_name
        string role "admin | member | viewer"
        decimal limit_5h_usd "teto individual a cada 5 horas"
        decimal limit_weekly_usd "teto individual semanal"
        decimal monthly_budget_usd "teto pessoal mensal"
        decimal current_cycle_spent_usd "gasto acumulado no ciclo"
        jsonb allowed_combos "combos liberados para este dev"
        jsonb allowed_models "modelos individuais liberados"
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    API_KEYS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        string key_hash UK
        string key_prefix "pk-live-..."
        string name
        jsonb mcp_scopes
        decimal custom_rate_limit_rpm
        boolean is_active
        timestamp last_used_at
        timestamp expires_at
        timestamp created_at
    }

    PROVIDERS {
        uuid id PK
        string slug UK "openai | claude | deepseek | ddg"
        string name
        string provider_type "api_key | oauth | web_stealth"
        string base_url
        boolean is_active
        timestamp created_at
    }

    PROVIDER_ACCOUNTS {
        uuid id PK
        uuid provider_id FK
        string label
        text credentials_encrypted
        jsonb oauth_tokens
        timestamp token_expires_at
        timestamp last_refresh_at
        string status "active | cooling_down | disabled"
        timestamp rate_limited_until
        timestamp created_at
    }

    COMBOS {
        uuid id PK
        uuid tenant_id FK "null = global"
        string name
        string alias UK "proxyai/coding-auto"
        string strategy "priority | cost_optimized | headroom | fusion"
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    COMBO_TARGETS {
        uuid id PK
        uuid combo_id FK
        uuid provider_account_id FK
        string upstream_model "gpt-4o | claude-3-5-sonnet"
        int priority_order
        int weight
        int timeout_seconds
        int retry_attempts
        boolean trigger_on_429
        boolean trigger_on_5xx
    }

    CREDIT_LEDGER {
        uuid id PK
        uuid tenant_id FK
        uuid api_key_id FK
        string transaction_type "DEBIT_INFERENCE | CREDIT_RECHARGE"
        decimal amount
        decimal balance_after
        int prompt_tokens
        int completion_tokens
        string upstream_provider
        string upstream_model
        string payment_gateway_ref "pix_12345"
        timestamp created_at
    }

    WEBSHARE_PROXIES {
        uuid id PK
        string proxy_address
        int port
        string username
        string password
        string country_code
        string city_name
        string mode "direct | backbone"
        boolean is_valid
        int latency_ms
        timestamp last_verification
        timestamp created_at
    }
```

---

## 2. Estratégia de Índices e Otimização contra N+1

1. **`idx_api_keys_lookup`:** Índice B-Tree composto em `API_KEYS (key_hash, is_active)` para autenticação em O(1).
2. **`idx_ledger_tenant_history`:** Índice particionado em `CREDIT_LEDGER (tenant_id, created_at DESC)` para extração ultra rápida de extratos sem full scan.
3. **`idx_combo_targets_ordered`:** Índice em `COMBO_TARGETS (combo_id, priority_order ASC)` com prefetch em eager loading no Data Plane para evitar queries sequenciais N+1.
4. **`idx_webshare_routing`:** Índice em `WEBSHARE_PROXIES (is_valid, mode, country_code, latency_ms ASC)` para seleção rápida do melhor proxy em <1ms.

---

## 3. Políticas de Isolamento Multitenant (Row-Level Security - RLS)

```sql
-- Habilitar RLS nas tabelas pertencentes ao Tenant
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE combos ENABLE ROW LEVEL SECURITY;

-- Política de Leitura e Escrita baseada na Sessão Atual do Tenant
CREATE POLICY tenant_isolation_api_keys ON api_keys
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_ledger ON credit_ledger
  FOR SELECT
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- Superusuários e Administradores Globais possuem Bypass de RLS via role específica do PostgreSQL
```
