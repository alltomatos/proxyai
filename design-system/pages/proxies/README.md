# Guia de Especificação e Desenvolvimento: Gestão de Proxies & Webshare

> **Módulo:** `frontend/src/pages/proxies`  
> **Status:** Aprovado para Implementação  
> **Tema:** Clean Light & Colorful Enterprise  
> **Referência Visual:** `design-system/pages/proxies/mockups/`

---

## 1. Visão Geral da Tela
O módulo de Gestão de Proxies integra nativamente a API v2 da **Webshare.io** para alimentar o pool de rotação de IPs do gateway:
- **Pool de IPs Vivos:** Monitoramento de proxies ativos, país de origem (`country_code`), portas e protocolo (SOCKS5/HTTP).
- **Estratégias de Rotação:** `quality-first` (menor latência), `round-robin` e `country-pinned` (US para Claude, BR para provedores locais).
- **Ações Imediatas:** Refresh sob demanda (`/api/v2/proxy/list/ondemand_refresh/`) e teste de latência em tempo real.

---

## 2. Componentes e Estrutura de Arquivos

```
src/pages/proxies/
├── index.tsx                         # Painel do pool Webshare e proxies customizados
├── components/
│   ├── ProxyKpiCards.tsx             # Total de IPs, latência média e taxa de sucesso
│   ├── ProxyPoolTable.tsx            # Tabela de IPs, portas, países e verificação
│   ├── ProxyRotationSettings.tsx     # Seletor de estratégia de rotação e fallback
│   └── WebshareSyncBadge.tsx         # Indicador de sincronização com a API da Webshare
└── modals/
    ├── AddCustomProxyModal.tsx       # Modal para adicionar proxy manual (IP:Porta)
    └── WebshareConfigModal.tsx       # Modal para configurar API Key da Webshare
```

---

## 3. Mockups SVG do Módulo

| Arquivo SVG | Descrição |
| :--- | :--- |
| [`mockups/page-layout.svg`](mockups/page-layout.svg) | Visão geral da página de monitoramento de proxies da Webshare. |
| [`mockups/proxy-table-row.svg`](mockups/proxy-table-row.svg) | Especificação das linhas da tabela de proxies com ping e país. |
| [`mockups/modal-webshare-config.svg`](mockups/modal-webshare-config.svg) | Modal para vincular a conta Webshare com teste de conexão. |
