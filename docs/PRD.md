# Product Requirements Document (PRD) — ProxyAI

## 1. Visão Geral do Produto
O **ProxyAI** é uma plataforma corporativa (B2B SaaS e Self-Hosted) de roteamento, agregação, resiliência e comercialização de provedores de Inteligência Artificial. Ele centraliza em um único endpoint compatível com OpenAI/Anthropic dezenas de provedores gratuitos, pagos, sessões OAuth e cookies web stealth (com suporte a pools de proxies residenciais Webshare), permitindo a revenda controlada de tokens para empresas clientes.

---

## 2. Personas do Sistema

1. **Administrador da Plataforma (Provedor do Serviço):**
   - Configura conexões mestre com provedores de IA (OpenAI, Claude, DeepSeek, Google, DuckDuckGo).
   - Cadastra empresas clientes (tenants), define tetos de gastos mensais e margens de lucro de revenda.
   - Gerencia a integração com a Webshare para garantir rotação contínua de IPs e evitar bloqueios.
2. **Empresa Cliente / Desenvolvedor B2B (Tenant):**
   - Cria suas próprias chaves de API virtuais para plugar em seus sistemas (CLIs, Chatbots, IDEs).
   - Monitora seu consumo mensal em porcentagem da cota alocada e compra créditos pré-pagos via PIX/Cartão.
   - Seleciona quais combos de modelos deseja utilizar para suas aplicações.
3. **Agentes Inteligentes Autônomos (Claude Code, OpenCode, Cursor, Hermes):**
   - Conectam via **MCP Server integrado** para autogerenciar combos, verificar saúde de circuitos, simular custos de rotas antes de disparar prompts pesados e consultar extratos.

---

## 3. Requisitos Funcionais (FRs)

### Módulo 1: Gateway de Inferência e Streaming
- **FR01 (Compatibilidade):** Suporte total aos endpoints `POST /v1/chat/completions`, `POST /v1/embeddings` e `GET /v1/models`.
- **FR02 (Streaming SSE):** Encaminhamento de chunks em tempo real com flush imediato e cancelamento gracioso (`ctx.Done()`).
- **FR03 (Tradução Universal):** Conversão transparente de esquemas de mensagens e tool calls entre formatos OpenAI, Claude e Gemini.

### Módulo 2: Combos Inteligentes e Resiliência
- **FR04 (Estratégias de Roteamento):** Suporte a failover linear (`priority`), balanceamento de carga (`weighted`), custo mínimo com SLA >98% (`cost-optimized`), respeito a janelas de rate-limit (`headroom/reset-aware`) e consenso paralelo (`fusion`).
- **FR05 (Circuit Breaker Automático):** Máquina de estados (`CLOSED`, `DEGRADED`, `OPEN`, `HALF_OPEN`) com threshold configurável por provedor.

### Módulo 3: Autenticação Híbrida & Proxies Webshare
- **FR06 (API Keys & OAuth):** Injeção de credenciais mestre com renovação automática de tokens OAuth antes do vencimento.
- **FR07 (Web Stealth Pool):** Sidecar Playwright para resolução de desafios VQD e Turnstile em provedores web.
- **FR08 (Integração Webshare):** Sincronização via API v2 de proxies residenciais (`backbone`) e data center (`direct`) com rotação `quality-first` e pinning geográfico.

### Módulo 4: Governança Multi-Empresa e Faturamento
- **FR09 (Isolamento Multi-Tenant):** Empresas clientes enxergam apenas suas próprias chaves e extratos via Row-Level Security (RLS).
- **FR10 (Cota Multi-Janela: 5h, Semanal e Mensal):** Corte automático de novas inferências (HTTP 429 com `Retry-After`) se a empresa OU o colaborador exceder o limite de 5 horas, o teto semanal ou o orçamento mensal.
- **FR11 (Ledger Atômico):** Prevenção de saldo negativo em contas pré-pagas via protocolo *Pre-Flight Hold* (Redis) e *Post-Flight Settlement* (PostgreSQL).
- **FR12 (Recarga Instantânea):** Pagamentos via PIX / Mercado Pago com liberação automática de crédito por webhook assinado.

### Módulo 5: Servidor MCP Gerencial Integrado
- **FR13 (Transporte Triplo):** Execução via Stdio (`proxyai mcp`), SSE e Streamable HTTP.
- **FR14 (Controle de Escopos):** Bloqueio de ferramentas de escrita para chaves sem escopos RBAC autorizados.

---

## 4. Requisitos Não-Funcionais (NFRs)

- **NFR01 (Latência TTFT):** Overhead interno do gateway no primeiro token menor que 5ms em condições normais de rede.
- **NFR02 (Concorrência):** Suporte a mais de 10.000 conexões SSE simultâneas por nó em Go com menos de 2GB de RAM.
- **NFR03 (Disponibilidade):** SLA de 99.95% de disponibilidade geral da plataforma com failover automático em falhas de provedores individuais.
- **NFR04 (Segurança OWASP):** Proteção contra SSRF na busca web e sanitização estrita de URLs de proxies externos.
- **NFR05 (Auditabilidade):** Registro imutável de todas as transações financeiras na tabela `credit_ledger`.

---

## 5. Métricas de Sucesso do Produto (KPIs)

- **Taxa de Failover Transparente:** > 99.8% das requisições afetadas por falha no provedor primário recuperadas sem erro ao cliente.
- **Economia Média de Tokens:** Redução de custo de 60% a 80% para clientes que utilizam combos inteligentes em vez de modelos caros exclusivos.
- **Taxa de Inadimplência por Saldo Negativo:** 0% (graças ao ledger atômico e pre-flight holds).
