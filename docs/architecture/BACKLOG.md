# Backlog Técnico de Implementação — ProxyAI

Backlog estruturado em vertical slices atômicos e prontos para execução pelo `/developer`.

---

## [EPIC 01] Data Plane: Engine de Streaming e Proxy em Go (Golang)

### Issue #01: Setup do Servidor Go e Roteamento Básico OpenAI-Compatible
- **Escopo:** Inicialização do módulo Go com `net/http` de alta performance, suporte a context timeouts e middleware de logging estruturado (JSON).
- **Critérios de Aceite:**
  - Endpoint `POST /v1/chat/completions` recebe payloads padrão da OpenAI.
  - Validação estrita de JSON sem alocações desnecessárias.
  - Testes unitários de parsing e verificação de concorrência com `-race`.

### Issue #02: Pipeline de Streaming SSE e Despachante Upstream
- **Escopo:** Implementação do leitor/escritor de Server-Sent Events (SSE) sem buffering excessivo para streaming de tokens em tempo real.
- **Critérios de Aceite:**
  - Forward de chunks do upstream para o downstream mantendo latência TTFT < 5ms.
  - Flush imediato de cada linha `data: {...}`.
  - Cancelamento limpo da requisição upstream quando o cliente aborta a conexão (`ctx.Done()`).

### Issue #03: Motor de Combos e Resiliência (Circuit Breaker & Fallback)
- **Escopo:** Implementação de estratégias de combo (`priority`, `weighted`, `cost-optimized`) e máquina de estados de Circuit Breaker (`CLOSED`, `DEGRADED`, `OPEN`, `HALF_OPEN`).
- **Critérios de Aceite:**
  - Se um provedor retornar 429 ou 5xx, o motor tenta o próximo provedor da lista automaticamente sem quebrar a conexão do cliente.
  - Se um provedor atingir o threshold de falhas consecutivas, seu circuito abre e novas chamadas são desviadas sem custo de timeout.

---

## [EPIC 02] Autenticação Híbrida & Sidecar de Provedores Web/Cookie

### Issue #04: Gerenciador de Chaves de API e Rotação OAuth
- **Escopo:** Módulo para injeção de credenciais nos provedores upstream com rotação pró-ativa de tokens OAuth antes da expiração.
- **Critérios de Aceite:**
  - Armazenamento em memória com cache seguro de tokens ativos.
  - Renovação automática de tokens com base na política de cada provedor (ex.: Codex, Gemini CLI).

### Issue #05: Sidecar Node.js com Browser Stealth Pool (Playwright)
- **Escopo:** Serviço isolado para manter sessões navegadas ativas e resolver desafios anti-bot (Turnstile e VQD) para provedores gratuitos via web.
- **Critérios de Aceite:**
  - Pool de páginas warm com reuso de contexto.
  - Isolamento de processos: crash no browser não derruba o gateway principal em Go.
  - Endpoint interno de IPC/HTTP para onde o gateway em Go despacha as queries web.

---

## [EPIC 03] Sistema Comercial: Faturamento e Ledger Atômico

### Issue #06: Protocolo de Reserva Atômica no Redis (Pre-flight Hold)
- **Escopo:** Script Lua no Redis para validação de crédito e reserva temporária de tokens antes do disparo da inferência.
- **Critérios de Aceite:**
  - Verificação atômica: rejeição imediata com HTTP 402 se o saldo for insuficiente.
  - Hold automático com TTL de expiração para proteção contra requisições zumbis.

### Issue #07: Conciliação Pós-Stream e Persistência no PostgreSQL
- **Escopo:** Registro transacional de débito/crédito no banco PostgreSQL e liberação do hold do Redis.
- **Critérios de Aceite:**
  - Cálculo exato: (Tokens Prompt * Tarifa) + (Tokens Saída * Tarifa) + Margem de Lucro.
  - Gravação imutável no ledger financeiro com suporte a auditoria contábil.

---

## [EPIC 04] Frontend Dashboard Ultra Rápido (SPA)

### Issue #08: Setup do Projeto Vite + React 19 + Tailwind v4 + shadcn/ui
- **Escopo:** Configuração da base do dashboard com tokens do `design-system/MASTER.md` e modo escuro nativo.
- **Critérios de Aceite:**
  - Build estático com carregamento instantâneo (<500ms).
  - Componentes base estilizados conforme o guia DevTools/Terminal.

### Issue #09: Painel de Gerenciamento de Combos e Monitoramento de Provedores
- **Escopo:** Interface interativa para criação de combos com drag & drop e visualização do status dos Circuit Breakers em tempo real.
- **Critérios de Aceite:**
  - Indicadores visuais de saúde do provedor com latência média.
  - Tela de edição e ordenação de rotas de failover.

---

## [EPIC 05] Servidor MCP Gerencial Integrado (Model Context Protocol)

### Issue #10: Protocolo JSON-RPC 2.0 e Transporte Dual (Stdio & SSE) em Go
- **Escopo:** Implementação do servidor MCP nativo em `backend/core/pkg/mcp/` com suporte a execução Stdio (`proxyai mcp`) e endpoints HTTP SSE (`/api/v1/mcp/sse`).
- **Critérios de Aceite:**
  - Garantia de pureza de Stdio: stdout 100% livre de logs de aplicação (logs canalizados para stderr).
  - Handshake e inicialização MCP (`initialize`, `tools/list`, `tools/call`) em conformidade com a especificação oficial.

### Issue #11: Catálogo de Ferramentas Gerenciais e Controle de Escopos (RBAC)
- **Escopo:** Registro das ferramentas gerenciais (`proxyai_get_health`, `proxyai_list_circuit_breakers`, `proxyai_list_combos`, `proxyai_simulate_route`, `proxyai_get_billing_summary`) com checagem de escopos de permissão.
- **Critérios de Aceite:**
  - Execução segura: chaves sem escopo `write:combos` são rejeitadas ao tentar criar ou alterar rotas.
  - Acesso direto e em memória aos dados de telemetria e combos sem requisições HTTP loopback.

---

## [EPIC 06] Autenticação de Colaboradores e Login para OpenCode (Seats & Limits)

### Issue #12: API de Autenticação Corporativa e Emissão de Tokens de Colaborador
- **Escopo:** Endpoints no Control Plane (`POST /api/v1/auth/opencode/login` e `/device`) para autenticar o desenvolvedor com usuário/senha e emitir token de sessão `opc_usr_...`.
- **Critérios de Aceite:**
  - Hash seguro de senhas com Argon2id ou bcrypt.
  - Vínculo inquebrável do token com o `tenant_id` e `user_id`.

### Issue #13: Validação de Limites Individuais e Modelo de Governança no Data Plane
- **Escopo:** Extensão do middleware de autorização do gateway em Go para validar a cota pessoal do colaborador no Redis antes de disparar o pre-flight hold.
- **Critérios de Aceite:**
  - Rejeição imediata com HTTP 429 se o desenvolvedor exceder sua cota individual (`monthly_budget_usd`).
  - Rejeição com HTTP 403 se o colaborador tentar chamar modelo fora de sua lista de `allowed_models` ou `allowed_combos`.
  - Débito coordenado: contabiliza o gasto no acumulador pessoal do membro e no saldo global da empresa.

### Issue #14: Interface de Gestão de Membros e Extensão/Plugin para OpenCode
- **Escopo:** Tela no dashboard para cadastro e ajuste de limites de colaboradores + script/comando CLI para login no OpenCode (`opencode auth login`).
- **Critérios de Aceite:**
  - Interface intuitiva com barra de consumo individual e reset de senha.
  - Comando CLI grava automaticamente as credenciais em `~/.opencode/auth.json`.
