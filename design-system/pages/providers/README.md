# Guia de Especificação e Desenvolvimento: Hub de Provedores

> **Módulo:** `frontend/src/pages/providers`  
> **Status:** Aprovado para Implementação  
> **Tema:** Clean Light & Colorful Enterprise  
> **Referência Visual:** `design-system/pages/providers/mockups/`

---

## 1. Visão Geral da Tela
O Hub de Provedores permite conectar, auditar, renovar credenciais e testar latência de todos os backends de IA:
- **API Keys Estáticas:** OpenAI, DeepSeek, OpenRouter, Groq, Mistral.
- **Contas OAuth Rotativas:** Anthropic Claude (sessão com refresh automático de 8 dias), Google Gemini CLI / Antigravity.
- **Sessões Web / Stealth Cookies:** DuckDuckGo AI, Claude Web (com sidecar Playwright e bypass de Turnstile/VQD).

---

## 2. Componentes e Estrutura de Arquivos

```
src/pages/providers/
├── index.tsx                         # Listagem e filtros de provedores
├── components/
│   ├── ProviderFilterTabs.tsx        # Tabs (Todos, API Key, OAuth, Web Cookies)
│   ├── ProviderGrid.tsx              # Grid responsivo de cards
│   ├── ProviderCard.tsx              # Card individual com badge de status, cota e ping
│   ├── ProviderPingButton.tsx        # Botão interativo que dispara canary probe
│   └── ProviderMetricsBadge.tsx      # Exibe uptime, latência e taxa de erro 429
└── modals/
    ├── ConnectProviderModal.tsx      # Modal de conexão de novo provedor (3 passos)
    └── EditProviderQuotasModal.tsx   # Modal de configuração de limites e proxies dedicados
```

---

## 3. Mockups SVG do Módulo

| Arquivo SVG | Descrição |
| :--- | :--- |
| [`mockups/page-layout.svg`](mockups/page-layout.svg) | Visão geral da página de provedores com cards ativos. |
| [`mockups/provider-card-variants.svg`](mockups/provider-card-variants.svg) | Especificação detalhada dos 3 tipos de cards (API Key, OAuth, Web). |
| [`mockups/modal-connect-provider.svg`](mockups/modal-connect-provider.svg) | Modal para adicionar nova chave, OAuth ou sessão de cookies. |
| [`mockups/provider-buttons-ping.svg`](mockups/provider-buttons-ping.svg) | Botões de ação, feedback de ping e estados (Idle, Loading, Success, Error). |

---

## 4. Diretrizes Técnicas de Implementação

### A. Integração com o Backend Go / Sidecar
- Chamar `POST /api/v1/providers/:id/ping` para disparar um teste pontual de 1 token sem consumir cota do cliente.
- Para provedores OAuth, expor o status de `tokenExpiresAt` e `lastRefreshAt` para feedback visual de renovação pró-ativa.
- Para provedores Web, permitir reiniciar o pool do Playwright via `POST /api/v1/providers/:id/pool/reset`.
