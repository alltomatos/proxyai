# ADR 0003: Multi-Tenancy Corporativo B2B e Integração com Webshare Proxy Pool

- **Status:** Aceito
- **Data:** 2026-10-15
- **Decisores:** Arquiteto de Software & Engenharia

## Contexto
O ProxyAI foi concebido para comercialização corporativa (B2B SaaS). Observando a arquitetura do 9Router (`ADD-multitenant-gateway.md`) e os desafios de bloqueio de IP enfrentados por provedores upstream e scraping web:
1. **Multi-Tenancy:** Diferentes empresas clientes precisam de isolamento completo de chaves, cotas financeiras independentes em USD/BRL e controle sobre quais combos e modelos podem ser consumidos.
2. **Proteção Anti-Bloqueio via Proxies:** Provedores baseados em Web/Cookies (DuckDuckGo, Claude Web) e chamadas diretas a APIs com rate-limits geográficos ou por IP exigem uma infraestrutura robusta de rotação de proxies residenciais e data center.
3. **Webshare Integration:** A plataforma [Webshare.io](https://apidocs.webshare.io/) oferece API v2 REST completa com suporte a listagem paginada (`/api/v2/proxy/list/`), autorização de IPs, rotação sob demanda (`/api/v2/proxy/list/refresh/`), sub-users para isolamento de banda e suporte a modos `direct` e `backbone` (residential).

## Decisão
1. **Multi-Tenancy com RLS e Hierarquia Organizacional:**
   - Implementar tabela `tenants` (Organizações/Empresas) e tabela `api_keys` associadas com chave estrangeira `tenant_id`.
   - Adicionar controle de cota mensal (`monthly_budget_usd`), saldo corrente (`current_cycle_spent_usd`) e whitelist de combos/modelos (`allowed_combos`, `allowed_models`).
   - Se a cota mensal for atingida, o gateway rejeita requisições com HTTP 429 (`Quota Exceeded`) antes de encaminhar ao upstream.
2. **Webshare Proxy Pool Manager no Data Plane e Sidecar:**
   - Criar um módulo interno em Go (`backend/core/pkg/proxy/webshare.go`) e no Sidecar Node.js que sincroniza automaticamente a lista de proxies ativos da Webshare via `GET /api/v2/proxy/list/?mode=direct`.
   - **Estratégias de Rotação:**
     - `quality-first`: Seleciona proxies com menor latência e maior taxa de sucesso recente.
     - `round-robin`: Rotação uniforme para distribuição de conexões.
     - `country-pinned`: Seleção de proxy com código de país específico (`country_code`) para compatibilidade com o provedor (ex.: US para Claude Web).
   - **Sub-Users da Webshare:** Criar sub-usuários programaticamente para tenants enterprise que necessitam de franquia de tráfego de proxy isolada.

## Consequências
- **Garantia de Uptime:** Redução drástica de bloqueios 403 e Cloudflare Turnstile em provedores web graças à rotação automática de IPs da Webshare.
- **Governança Corporativa:** O revendedor pode cadastrar múltiplas empresas, limitar seus gastos mensais e restringir o uso de modelos caros (ex.: o1, claude-3-5-sonnet) apenas a clientes com planos superiores.
