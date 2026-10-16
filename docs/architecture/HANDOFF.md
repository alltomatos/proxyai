# Guia de Handoff Arquitetural para Engenharia (`/developer`)

> **Projeto:** ProxyAI (Enterprise AI Gateway & Commercial Proxy)  
> **Status da Arquitetura:** Aprovado e Fechado para Desenvolvimento  
> **Fontes da Verdade:** [`AGENT.md`](../../AGENT.md) e [`CLAUDE.md`](../../CLAUDE.md)

---

## 1. Mapa de Navegação dos Artefatos

Todo o planejamento de engenharia, negócios e design foi persistido no repositório. Antes de escrever código, o desenvolvedor deve consultar os arquivos conforme o escopo da tarefa:

```
proxyai/
├── AGENT.md                           # Regras inegociáveis de engenharia (Zero pseudocódigo, RLS, limites)
├── CLAUDE.md                          # Ponto de ancoragem para Claude Code / Codex
│
├── docs/
│   ├── PRD.md                         # Requisitos funcionais, personas e regras de negócio
│   ├── architecture/
│   │   ├── ADD.md                     # Visão global, C4 Model (Contexto e Contêineres)
│   │   ├── ADD-mcp-server.md          # Especificação do servidor MCP Gerencial (Stdio/SSE/HTTP)
│   │   ├── DER.md                     # Modelagem relacional, chaves, índices anti-N+1 e RLS
│   │   ├── UML.md                     # Diagramas de classes em Go, máquina de estados e sequência
│   │   └── BACKLOG.md                 # 6 Epics e 14 Vertical Slices detalhados com critérios de aceite
│   └── adr/
│       ├── 0001-go-data-plane-hybrid-architecture.md
│       ├── 0002-hybrid-billing-and-atomic-ledger.md
│       ├── 0003-multitenant-and-webshare-proxy-pool.md
│       ├── 0004-database-strategy-postgres-redis.md
│       ├── 0005-opencode-collaborator-auth-and-seats.md
│       └── 0006-multi-window-sliding-limits.md
│
└── design-system/
    ├── MASTER.md                      # Tokens visuais Tailwind v4 (Clean Light & Colorful Enterprise)
    └── pages/                         # Especificações de tela e mockups SVG vetoriais
        ├── dashboard/                 # 4 Mocks SVG + README.md
        ├── providers/                 # 3 Mocks SVG + README.md
        ├── combos/                    # 3 Mocks SVG + README.md
        ├── tenants/                   # 3 Mocks SVG + README.md
        ├── proxies/                   # 3 Mocks SVG + README.md
        └── collaborators/             # 4 Mocks SVG (incluindo página dedicada de formulário) + README.md
```

---

## 2. Ordem Sequencial de Implementação Recomendada (Slices)

Para manter entregas atômicas e testáveis sem regressão, a engenharia deve seguir a seguinte ordem dos Epics descritos no [`docs/architecture/BACKLOG.md`](BACKLOG.md):

1. **Fase 1: Infraestrutura & Bancos de Dados**
   - Configuração de `docker-compose.yml` para desenvolvimento local com **PostgreSQL 16** e **Redis 7**.
   - Execução das migrations iniciais baseadas no [`docs/architecture/DER.md`](DER.md) (tabelas `tenants`, `users`, `api_keys`, `credit_ledger`, `combos`, `providers`, `webshare_proxies`).
2. **Fase 2: Data Plane em Go (Motor de Streaming & Roteamento)**
   - Setup do módulo `backend/core` com roteador `net/http` compatível com OpenAI (`POST /v1/chat/completions`).
   - Implementação do leitor/escritor de Server-Sent Events (SSE) com latência TTFT < 5ms.
   - Circuit Breakers em 4 estados (`CLOSED`, `DEGRADED`, `OPEN`, `HALF_OPEN`) compartilhados via Redis.
   - Combos de failover sequencial e tradutores de payload (OpenAI ↔ Claude ↔ Gemini).
3. **Fase 3: Faturamento Atômico & Multi-Janela Temporal**
   - Script Lua no Redis para *Pre-Flight Hold* (reserva de crédito antes do stream) e reconciliação *Post-Flight Settlement* no PostgreSQL.
   - Rate limit multi-janela: bloqueio 429 com `Retry-After` para janela de 5 horas, semanal e mensal (Tenant e Membro).
4. **Fase 4: Sidecar Playwright & Proxies Webshare**
   - Serviço em Node.js (`backend/sidecar`) para pool de sessões web stealth com bypass de Turnstile e VQD.
   - Cliente Webshare API v2 em Go para sincronização de IPs e rotação `quality-first`.
5. **Fase 5: Servidor MCP Gerencial Integrado**
   - Binário Go com suporte ao comando `proxyai mcp` via Stdio (pureza de stdout) e HTTP SSE/Streamable.
   - Registro de ferramentas de telemetria, reset de breakers, simulação de combos e auditoria.
6. **Fase 6: Autenticação de Colaboradores & Login no OpenCode**
   - API de login de desenvolvedores e comando CLI `opencode auth login --proxy ...`.
7. **Fase 7: Frontend Dashboard (Vite + React 19 + Tailwind v4)**
   - Scaffold do frontend seguindo rigorosamente os tokens de [`design-system/MASTER.md`](../../design-system/MASTER.md) e os mockups SVG em `design-system/pages/*/mockups/`.

---

## 3. Comandos de Verificação & Critérios de Pronto (Definition of Done)

Qualquer Pull Request ou incremento de código só será considerado concluído se atender aos seguintes requisitos inegociáveis:
- **Build Limpo:** `go build ./...` sem warnings e `npm run build` no frontend sem erros de TypeScript.
- **Testes com Race Detector:** `go test -race ./...` com cobertura mínima de 70% nas rotas críticas de streaming e faturamento.
- **Zero Pseudocódigo:** Nenhuma função pode conter stubs vazios ou comentários indicando código futuro.
- **Auditoria de Concorrência:** Simulação de 100 requisições simultâneas debitando a mesma chave pré-paga para comprovar zero saldo negativo.
