# Guia de Especificação e Desenvolvimento: Construtor de Combos

> **Módulo:** `frontend/src/pages/combos`  
> **Status:** Aprovado para Implementação  
> **Tema:** Clean Light & Colorful Enterprise  
> **Referência Visual:** `design-system/pages/combos/mockups/`

---

## 1. Visão Geral da Tela
O Construtor de Combos é a ferramenta mais poderosa da plataforma. Permite criar aliases virtuais (ex.: `proxyai/coding-auto`) que encadeiam múltiplos modelos em sequência ou em paralelo com estratégias sofisticadas:
- **Priority / Linear Failover:** Modelo A $\rightarrow$ Se falhar, Modelo B $\rightarrow$ Se falhar, Modelo C.
- **Cost-Optimized (Eco):** Direciona automaticamente para o modelo mais barato com disponibilidade >98%.
- **Headroom & Reset-Aware:** Evita modelos cujas cotas por minuto ou hora estejam esgotadas.
- **Fusion:** Executa 2 ou mais modelos em paralelo e usa um modelo "juiz" para consolidar a resposta final.

---

## 2. Componentes e Estrutura de Arquivos

```
src/pages/combos/
├── index.tsx                         # Listagem de combos configurados
├── editor.tsx                        # Tela de montagem do pipeline
├── components/
│   ├── PipelineBuilder.tsx           # Canvas com a esteira de nós encadeados
│   ├── PipelineNode.tsx              # Card de alvo com ordem, custos e regras de salto
│   ├── PipelineConnector.tsx         # Seta/indicador direcional com condição de failover
│   ├── StrategySelector.tsx          # Seletor de modo de roteamento
│   └── SlaSimulatorWidget.tsx        # Widget de cálculo de economia e resiliência estimada
└── modals/
    ├── AddTargetModal.tsx            # Modal para selecionar provedor e modelo
    └── NodeSettingsModal.tsx         # Modal de timeouts, thresholds de erro e retry-after
```

---

## 3. Mockups SVG do Módulo

| Arquivo SVG | Descrição |
| :--- | :--- |
| [`mockups/page-layout.svg`](mockups/page-layout.svg) | Visão geral da página de edição de combo montada. |
| [`mockups/pipeline-node-card.svg`](mockups/pipeline-node-card.svg) | Especificação isolada do card de nó de pipeline (primário e fallbacks). |
| [`mockups/strategy-selector.svg`](mockups/strategy-selector.svg) | Componente visual de escolha de estratégia de roteamento. |
| [`mockups/modal-target-config.svg`](mockups/modal-target-config.svg) | Modal para configurar parâmetros por nó (timeout, retry, peso). |

---

## 4. Diretrizes Técnicas de Implementação

- Suporte a **drag-and-drop** suave usando `@dnd-kit/core` ou `@dnd-kit/sortable`.
- Validação em tempo real: se nenhum alvo do combo estiver saudável (todos com Circuit Breaker aberto), exibir alerta imediato antes de permitir salvar.
- Sincronizar com o endpoint do Data Plane em Go: `POST /api/v1/combos` e `GET /api/v1/combos/:id/simulate`.
