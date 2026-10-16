# ADR 0001: Adoção de Go (Golang) para o Data Plane e Arquitetura Híbrida

- **Status:** Aceito
- **Data:** 2026-10-15
- **Decisores:** Arquiteto de Software & Engenharia

## Contexto
O OmniRoute e o 9Router utilizam Node.js e TypeScript com Next.js tanto para o frontend administrativo quanto para o streaming SSE de rotas de IA. Durante a análise técnica (`D:\dev\OmniRoute` e `D:\dev\9router`), identificamos que:
1. O runtime de Node.js sofre em cenários de alta concorrência com milhares de conexões SSE ativas simultaneamente, devido ao overhead de memória por conexão e contention no single-thread event loop.
2. A emulação de browsers (Playwright) no mesmo processo do gateway causa vazamentos de memória e picos de latência no encaminhamento de requisições HTTP normais.
3. Para viabilizar uma solução comercial, é mandatória uma latência de trânsito ínfima (<5ms) e cálculo financeiro com locking atômico sem travar o processamento de tokens.

## Decisão
1. **Data Plane em Go (Golang):** O motor de proxy reverso, tradutor de formato de mensagens (OpenAI ↔ Claude ↔ Gemini) e despachante de streaming SSE será construído em Go, aproveitando goroutines ultraleves e baixo overhead de GC.
2. **Sidecar Dedicado para Provedores Web/Cookie:** Provedores que exigem cookies, emulação de navegador (Playwright/CloakBrowser) e resolução de turnstile/VQD serão isolados em um processo auxiliar (sidecar) em Node.js, comunicando-se com o Data Plane via HTTP local ou gRPC.
3. **Frontend SPA Desacoplado:** O painel administrativo e do usuário será um SPA estático puro (Vite + React 19 + Tailwind CSS + shadcn/ui), sem dependência de SSR, permitindo carregamento instantâneo.
4. **PostgreSQL + Redis:**
   - **Redis:** Gerenciamento de circuit breakers em memória, rate-limiting e reserva temporária de créditos (pre-flight holds).
   - **PostgreSQL:** Fonte de verdade transacional com Row-Level Security (RLS) para multitenancy, auditoria e tabela de ledger financeiro.

## Consequências
- **Positivas:**
  - Capacidade de atender 10x mais requisições simultâneas por gigabyte de RAM em comparação com Node.js monolítico.
  - Isolamento total de falhas: se uma rotina de browser do sidecar crashar por OOM, o streaming do gateway principal de Go continua 100% operacional.
  - Segurança contábil estrita para venda de créditos e combos sem risco de saldo negativo por concorrência.
- **Negativas / Desafios:**
  - Manutenção de duas bases de código (Go para data-plane/streaming e TypeScript para frontend e sidecar web).
  - Necessidade de reimplementar em Go os tradutores de payload específicos que existiam em TypeScript no `open-sse`.
