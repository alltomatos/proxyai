# DEVELOPER ROADMAP — ProxyAI

> Bussola estratégica de implementação do ProxyAI.
> Single Source of Truth para o `/developer` e `/roadmap`.

## Epics

- [**[E01] Data Plane: Engine de Streaming e Proxy em Go**](https://github.com/alltomatos/proxyai/issues/1) - `done`
- [**[E02] Autenticação Híbrida & Sidecar de Provedores Web com Webshare**](https://github.com/alltomatos/proxyai/issues/2) - `done`
- [**[E03] Sistema Comercial: Faturamento e Ledger Atômico**](https://github.com/alltomatos/proxyai/issues/3) - `done`
- [**[E04] Frontend Dashboard Ultra Rápido (SPA)**](https://github.com/alltomatos/proxyai/issues/4) - `in_progress`
- [**[E05] Servidor MCP Gerencial Integrado**](https://github.com/alltomatos/proxyai/issues/5) - `done`
- [**[E06] Governança Multi-Empresa, Seats e Acesso OpenCode**](https://github.com/alltomatos/proxyai/issues/6) - `done`

---

## Milestones

### Milestone 1: Fundação, Infraestrutura e Banco de Dados (PostgreSQL + Redis)
- Setup de `docker-compose.yml` e migrations iniciais (RLS, Tenants, Users, Combos, Ledger).
- Meta: Ambiente de banco pronto para persistência ACID e cache em microssegundos.

### Milestone 2: Core Data Plane & Streaming SSE em Go (TTFT < 5ms)
- Servidor HTTP OpenAI-compatible (`POST /v1/chat/completions`).
- Pipeline de streaming SSE zero-alloc.
- Máquina de estados de Circuit Breaker (CLOSED, DEGRADED, OPEN, HALF_OPEN) via Redis.
- Motor de combos de failover sequencial.

### Milestone 3: Motor Financeiro & Multi-Janela (5h, Semanal e Mensal)
- Pre-flight hold via script Lua no Redis.
- Multi-window rate limiting e rolling quota.
- Reconciliação post-flight na tabela imutável `credit_ledger`.

### Milestone 4: Sidecar Playwright & Pool Webshare
- Serviço Node.js para contornar desafios Turnstile e VQD.
- Sincronização automática de proxies via Webshare API v2.

### Milestone 5: MCP Gerencial Integrado (Stdio & SSE)
- CLI `proxyai mcp` com pureza de stdout e catálogo de ferramentas de governança.

### Milestone 6: Corporate Seats & OpenCode CLI Login
- Autenticação corporativa de desenvolvedores e comando CLI `opencode auth login`.

### Milestone 7: Frontend SPA Dashboard (React 19 + Vite + Tailwind v4)
- Dashboard Clean Light & Colorful Enterprise baseado nos mockups aprovados em `design-system/pages/*/mockups/`.
