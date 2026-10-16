# Guia de Especificação e Desenvolvimento: Dashboard Geral

> **Módulo:** `frontend/src/pages/dashboard`  
> **Status:** Aprovado para Implementação  
> **Tema:** Clean Light & Colorful Enterprise  
> **Referência Visual:** `design-system/pages/dashboard/mockups/`

---

## 1. Visão Geral da Tela
O Dashboard é a central de comando da plataforma. Ele consolida telemetria de streaming (SSE) em tempo real, monitoramento dos circuit breakers dos provedores, métricas financeiras acumuladas e logs recentes das últimas inferências.

---

## 2. Componentes e Estrutura de Arquivos

```
src/pages/dashboard/
├── index.tsx                         # Página principal que orquestra o layout
├── components/
│   ├── Topbar.tsx                    # Header global com busca (Cmd+K) e tenant
│   ├── Sidebar.tsx                   # Menu lateral persistente com status do cluster
│   ├── KpiGrid.tsx                   # Grid de 4 cards com métricas-chave
│   ├── KpiCard.tsx                   # Card individual com badge de variação e ícone
│   ├── StreamingChart.tsx            # Gráfico de área empilhada (Prompt vs Completion)
│   ├── CircuitBreakerList.tsx        # Lista de saúde dos provedores conectados
│   └── LiveInferenceTable.tsx        # Tabela com as últimas transações e latências
└── modals/
    └── FilterTimeRangeModal.tsx      # Modal para seleção customizada de período
```

---

## 3. Mockups SVG do Módulo

| Arquivo SVG | Descrição |
| :--- | :--- |
| [`mockups/page-layout.svg`](mockups/page-layout.svg) | Visão completa da página montada (1440x900). |
| [`mockups/kpi-cards.svg`](mockups/kpi-cards.svg) | Especificação isolada dos 4 cartões de KPIs coloridos. |
| [`mockups/streaming-chart.svg`](mockups/streaming-chart.svg) | Área empilhada com gradiente e legenda de Prompt/Completion. |
| [`mockups/circuit-breaker-widget.svg`](mockups/circuit-breaker-widget.svg) | Widget de status (CLOSED, DEGRADED, OPEN) com badges e ping. |
| [`mockups/modal-filter-period.svg`](mockups/modal-filter-period.svg) | Modal de filtro de data/hora e intervalo customizado. |

---

## 4. Diretrizes Técnicas de Implementação

### A. Polling e WebSocket / SSE em Tempo Real
- Utilizar **TanStack Query** com `refetchInterval: 5000` para a lista de circuit breakers.
- Conectar via EventSource ou WebSocket no endpoint `/api/v1/telemetry/live` para atualizar o gráfico de tokens sem renderizar novamente a árvore inteira do React.

### B. Cores e Classes Tailwind
- Fundo: `bg-[#F8FAFC]`
- Card Base: `bg-white border border-slate-200 shadow-sm rounded-xl`
- Textos: Títulos em `text-slate-900 font-bold`, secundários em `text-slate-500 font-medium`.
- Status:
  - `CLOSED`: `bg-emerald-50 text-emerald-700 border-emerald-200`
  - `DEGRADED`: `bg-amber-50 text-amber-700 border-amber-200`
  - `OPEN`: `bg-rose-50 text-rose-700 border-rose-200`
