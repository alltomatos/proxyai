# ADR 0004: Estratégia de Persistência — PostgreSQL (com RLS) e Redis (Cluster/Cache)

- **Status:** Aceito
- **Data:** 2026-10-15
- **Decisores:** Arquiteto de Software & Engenharia

## Contexto
O OmniRoute e o 9Router utilizam SQLite (`better-sqlite3` ou `sql.js`). Embora o SQLite seja ideal para ferramentas de desktop locais em modo single-user, ele apresenta severas limitações para uma plataforma corporativa comercializável:
1. **Locking de Escrita Global:** O SQLite trava em alta concorrência (`database is locked`) quando centenas de requisições paralelas tentam gravar logs de streaming e debitar tokens simultaneamente.
2. **Falta de Isolamento Multitenant Nativo (RLS):** Garantir que uma empresa cliente jamais acerte ou visualize dados de outro tenant exige filtros manuais em cada query SQL, aumentando dramaticamente o risco de brechas de segurança.
3. **Impossibilidade de Escala Horizontal:** SQLite reside em um único disco. Para rodar múltiplos nós do Data Plane em Go balanceados (Kubernetes / Docker Swarm / múltiplas instâncias), é mandatório um banco relacional em rede.

## Decisão
Adotar uma **arquitetura de persistência em dois níveis**:
1. **PostgreSQL 16+ (Fonte da Verdade ACID e Governança Multi-Empresa):**
   - Utilizado para usuários, tenants, credenciais, combos, regras de roteamento e tabela imutável de faturamento (`credit_ledger`).
   - **Row-Level Security (RLS):** Políticas de RLS habilitadas nativamente nas tabelas do tenant. O contexto `SET LOCAL app.current_tenant_id = '...'` garante isolamento rigoroso por sessão de banco.
   - **Prevenção de N+1 Queries:** Consultas e joins otimizados com índices compostos B-Tree e índices parciais para chaves ativas.
2. **Redis 7+ (Camada de Tempo Real e Alta Concorrência):**
   - Utilizado pelo Data Plane em Go para:
     - **Pre-flight Holds:** Bloqueio atômico de créditos pré-pagos via scripts Lua com TTL de 5 minutos.
     - **Token Bucket Rate Limiting:** Controle de requisições por minuto por chave/empresa.
     - **Circuit Breaker State:** Compartilhamento do estado dos provedores (`CLOSED`, `DEGRADED`, `OPEN`, `HALF_OPEN`) entre todas as instâncias do gateway.
     - **Cache de Resolução de Combos:** Lookup instantâneo (<0.5ms) de quais modelos e chaves usar.

## Consequências
- **Positivas:**
  - Capacidade ilimitada de conexões e escrita distribuída.
  - Segurança enterprise com RLS impedindo vazamento de dados entre empresas.
  - O Data Plane em Go atinge latência ultra-baixa consultando o Redis em microssegundos durante o caminho crítico da requisição de chat.
- **Negativas / Desafios:**
  - Exige orquestração de serviços de banco (PostgreSQL + Redis via Docker Compose ou Cloud Gerenciada) em comparação com o arquivo único `.sqlite` do 9router.
