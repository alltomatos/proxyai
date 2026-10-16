# AGENTS.md — Guia Mestre de Engenharia e Operação da Plataforma ProxyAI

> **Single Source of Truth.** Este documento é a fonte suprema e inegociável de diretrizes arquiteturais, regras de engenharia, padrões de código e governança para **todos os agentes de IA** e desenvolvedores que operam neste repositório.

---

## 1. Visão do Produto & Missão Técnica
O **ProxyAI** é um gateway de inteligência artificial corporativo (B2B SaaS) de alta disponibilidade e ultrabaixa latência (TTFT < 5ms), projetado para:
1. Unificar provedores pagos (API Key), contas rotativas (OAuth) e sessões gratuitas/web (Web Cookie Stealth via Playwright pool com integração à Webshare).
2. Fornecer roteamento inteligente de modelos através de **Combos Resilientes** (Failover linear, Modo Eco, Headroom e Fusion).
3. Viabilizar faturamento comercial robusto em modelo híbrido (planos mensais + créditos pré-pagos sob demanda) com reconciliação atômica (*Credit Ledger*) para evitar saldo negativo.
4. Oferecer **Governança Multi-Empresa e Gestão de Colaboradores** com cotas multi-janela temporais (5 horas, semanal e mensal) e autenticação de desenvolvedores para o **OpenCode** (CLI e Desktop).

---

## 2. Arquitetura da Stack Híbrida

| Camada | Tecnologia | Localização | Responsabilidade |
| :--- | :--- | :--- | :--- |
| **Data Plane** | **Go (Golang)** | `backend/core` | Roteamento OpenAI-compatible, streaming SSE, circuit breakers, verificação de limites multi-janela e holds de crédito no Redis. |
| **Browser Sidecar** | **Node.js + Playwright** | `backend/sidecar` | Pool isolado de navegadores stealth para bypass de Turnstile e VQD em provedores web com proxy Webshare. |
| **Control Plane** | **Go / Fastify + PostgreSQL** | `backend/api` | Gestão de tenants, colaboradores, webhooks de recarga (Mercado Pago / PIX), RLS multitenant e auditoria. |
| **Frontend SPA** | **React 19 + Vite + Tailwind v4** | `frontend/` | Dashboard estático ultra rápido, consumo de APIs, sem overhead de SSR. |

---

## 3. Diretrizes Inegociáveis de Engenharia (The Hard Rules)

### A. Rigor de Código e Zero Alucinação
1. **ZERO Pseudocódigo:** Proibido `// ...`, `// resto do código` ou `/* implementação futura */`. Todo arquivo gerado ou editado deve ser real, completo e auto-contido.
2. **Edição Cirúrgica & Diagnóstico Real:** Diante de falhas no build ou testes, leia as linhas exatas do erro antes de modificar. Se um erro persistir por 2 tentativas consecutivas, **PARE**, isole o problema e alinhe com o usuário.
3. **Fronteira SRP (Single Responsibility):** Arquivos com mais de 250 linhas devem ser obrigatoriamente desmembrados em módulos específicos do pacote (ex.: `models.go`, `interfaces.go`, `service.go`).

### B. Resiliência & Circuit Breakers (4 Estados)
Todo despachante upstream no Data Plane em Go deve obedecer à máquina de estados:
- `CLOSED`: Provedor saudável, recebendo 100% do tráfego.
- `DEGRADED`: Taxa de erro > 15% ou aviso de rate limit. Emite alerta nos dashboards sem cortar o tráfego.
- `OPEN`: Taxa de erro > 40%. Bloqueia novas chamadas imediatamente por $N$ segundos e salta para o próximo alvo do combo sem penalidade de timeout.
- `HALF_OPEN`: Envia uma requisição de sonda (*canary probe*). Se bem-sucedida, restaura para `CLOSED`.

### C. Faturamento Seguro & Cotas Multi-Janela (5h, Semanal e Mensal)
1. **Pre-flight Hold:** Script Lua no Redis para reservar tokens estimados com TTL de 5 minutos. Rejeitar com HTTP 402 se o saldo for insuficiente.
2. **Multi-Window Quota Check:** Avaliação em <0.5ms no Redis dos tetos de 5h, semanal e mensal do Tenant e do Colaborador. Se excedido, responder com HTTP 429 contendo o cabeçalho `Retry-After: <segundos>`.
3. **Streaming & Post-flight Settlement:** Repassar chunks SSE em tempo real. No término (`[DONE]`), liberar o Hold no Redis e gravar a transação definitiva no PostgreSQL na tabela imutável `credit_ledger`.

### D. Interface & UI/UX (Conformidade com UI/UX Pro Max)
- **Tema Obrigatório:** Clean Light & Colorful Enterprise.
- **Fundo Base:** `#F8FAFC`, cards brancos puros (`#FFFFFF`) com elevações sutis (`shadow-sm`).
- **Sem Emojis como Ícones:** Utilizar exclusivamente SVGs vetoriais (Lucide Icons ou Phosphor Icons).
- **Consulte sempre os guias por página antes de codificar:**
  - `design-system/pages/dashboard/README.md`
  - `design-system/pages/providers/README.md`
  - `design-system/pages/combos/README.md`
  - `design-system/pages/tenants/README.md`
  - `design-system/pages/proxies/README.md`
  - `design-system/pages/collaborators/README.md`
  - `design-system/pages/billing/README.md`

### E. Servidor MCP Gerencial Integrado (Model Context Protocol)
- O ProxyAI fornece nativamente um servidor MCP em Go (`backend/core/pkg/mcp/`) com suporte a Stdio (`proxyai mcp`), SSE e Streamable HTTP.
- **Pureza de Stdio:** Proibido utilizar `fmt.Println` ou `log.Println` direcionados ao stdout no modo MCP. Todos os logs devem ir para `os.Stderr`.
- **RBAC e Escopos:** Nenhuma ferramenta gerencial de escrita (`write:combos`, `write:resilience`, `write:providers`) deve ser executada sem a validação do escopo da chave chamadora.
- Documento de referência: [`docs/architecture/ADD-mcp-server.md`](docs/architecture/ADD-mcp-server.md).

### F. Uso Mandatório da Ferramenta de Memória (`memory_save` & `memory_search`)
- **Persistência de Decisões Relevantes:** Sempre que uma decisão arquitetural, convenção técnica, mudança de padrão ou definição de negócio for alinhada com o operador, o agente **DEVE** gravá-la imediatamente na memória com escopo `project` (`memory_save(scope="project")`).
- **Consulta Prévia:** Ao iniciar novas sessões ou tarefas complexas de desenvolvimento, o agente deve consultar a memória (`memory_search`) para resgatar o contexto do projeto antes de fazer suposições ou repetir perguntas.
- **Resumo de Contexto Extenso:** Quando o contexto da sessão estiver próximo ao teto, consolide as decisões pendentes e o estado da fila de tarefas na memória antes de sugerir uma nova sessão limpa.

---

## 4. Estrutura de Diretórios Recomendada

```
proxyai/
├── backend/
│   ├── core/                         # Gateway Data Plane de alta performance (Go)
│   │   ├── cmd/server/main.go
│   │   ├── internal/router/          # Endpoints /v1/chat/completions
│   │   ├── internal/combos/          # Lógica de failover e circuit breakers
│   │   ├── internal/ledger/          # Holds Redis, multi-window limiter e reconciliação
│   │   ├── pkg/mcp/                  # Servidor MCP gerencial integrado (Stdio / SSE)
│   │   ├── pkg/proxy/                # Gerenciador de proxies Webshare
│   │   └── pkg/sse/                  # Streaming ultra veloz
│   └── sidecar/                      # Pool de browser stealth (Node.js/Playwright)
│       ├── package.json
│       └── src/browserPool.ts
├── frontend/                         # Dashboard administrativo (Vite + React 19)
│   ├── src/pages/dashboard/
│   ├── src/pages/providers/
│   ├── src/pages/combos/
│   ├── src/pages/tenants/
│   ├── src/pages/proxies/
│   ├── src/pages/collaborators/
│   └── src/pages/billing/
├── design-system/                    # Fonte da verdade de UI/UX
│   ├── MASTER.md                     # Tokens e paleta corporativa
│   └── pages/                        # Guias e mockups SVG por tela
└── docs/
    ├── PRD.md                        # Requisitos funcionais e de produto
    ├── architecture/ADD.md           # Architecture Design Document
    ├── architecture/ADD-mcp-server.md# ADD específico do MCP Server integrado
    ├── architecture/DER.md           # Modelagem relacional, índices e RLS
    ├── architecture/UML.md           # Diagramas de classes, estados e sequência
    ├── architecture/BACKLOG.md       # Slices verticais de desenvolvimento
    ├── architecture/HANDOFF.md       # Guia de handoff sequencial para engenharia
    └── adr/                          # Architecture Decision Records (0001 a 0006)
```

---

## 5. Fluxo de Trabalho dos Agentes Executores (`/developer`)
1. Leia o `AGENTS.md` e o `docs/architecture/ADD.md`.
2. Pegue o próximo slice vertical em `docs/architecture/BACKLOG.md`.
3. Verifique os mockups e o README do módulo em `design-system/pages/<modulo>/`.
4. Implemente com rigor cirúrgico (Clean Architecture, testes unitários automatizados e zero pseudocódigo).
5. Valide a compilação e execute a suíte de testes antes de considerar o slice concluído.
