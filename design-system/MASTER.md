# Design System Master — ProxyAI Enterprise Dashboard

> **Identidade Visual:** Enterprise Clean Light & Colorful  
> **Conceito:** Inspirado na elegância, clareza e alta densidade de informação de ferramentas corporativas modernas (Stripe Dashboard, Linear, Cloudflare Radar e Datadog). Fundo claro com contraste perfeito, superfícies brancas com sombras cirúrgicas e toques vibrantes com significado semântico para monitoramento de IA.

---

## 1. Princípios de Experiência e Design (UI/UX Guidelines)

1. **Clareza Corporativa com Vitalidade (Clean & Colorful):**
   - Fundo base ultra-limpo (off-white luminoso: `#F8FAFC`) eliminando a fadiga de telas acinzentadas.
   - Cards brancos puros (`#FFFFFF`) com elevações sutis e bordas refinadas de 1px (`#E2E8F0`).
   - Cores vibrantes utilizadas com **disciplina semântica** para categorizar múltiplos provedores de IA, tipos de modelos e alertas de streaming em tempo real.

2. **Rigor de Acessibilidade (WCAG AA/AAA):**
   - Contraste mínimo de 4.5:1 para todo texto corrido e métricas.
   - Sem dependência exclusiva de cor: estados de circuito (Circuit Breaker) contam com ícones SVG (Lucide/Phosphor), rótulos explícitos e código semântico.
   - Foco visível (`focus-visible: ring-2 ring-indigo-500/20`) e suporte integral a navegação por teclado.

3. **Zero Emojis como Ícones:**
   - Ícones SVG consistentes via **Lucide Icons** ou **Phosphor Icons** (`stroke-width: 1.75px`).

---

## 2. Tokens de Design (Tailwind v4 / CSS Variables)

```css
:root {
  /* Superfícies & Fundo (Clean Light) */
  --bg-app: #F8FAFC;            /* Fundo geral da aplicação (slate-50) */
  --bg-surface: #FFFFFF;        /* Cards, Sidebar, Modais e Painéis */
  --bg-surface-subtle: #F1F5F9; /* Headers de tabela, hover em linhas e badges */
  --bg-input: #FFFFFF;

  /* Bordas e Divisores */
  --border-subtle: #E2E8F0;     /* Linhas de divisão de tabela e bordas de card */
  --border-strong: #CBD5E1;     /* Inputs em repouso e separadores ativos */
  --border-focus: #6366F1;      /* Borda em foco */

  /* Tipografia & Contraste (Inter / Plus Jakarta Sans) */
  --text-primary: #0F172A;      /* Títulos e números grandes (slate-900) - Contraste > 12:1 */
  --text-secondary: #475569;    /* Labels, subtítulos e textos explicativos (slate-600) */
  --text-muted: #94A3B8;        /* Placeholders e timestamps secundários (slate-400) */

  /* Cores de Marca & Ação Primária */
  --brand-primary: #4F46E5;     /* Indigo vibrante (CTA primário, botões principais) */
  --brand-primary-hover: #4338CA;
  --brand-primary-subtle: #EEF2FF; /* Background de seleção / highlight ativo */

  /* Cores Semânticas de Provedores de IA (Acentos Coloridos) */
  --color-openai: #10A37F;      /* Esmeralda OpenAI */
  --color-anthropic: #D97706;   /* Âmbar / Terracota Claude */
  --color-google: #2563EB;      /* Azul Gemini */
  --color-deepseek: #0284C7;    /* Ciano DeepSeek */
  --color-openrouter: #7C3AED;  /* Roxo OpenRouter */
  --color-web-stealth: #EC4899; /* Rosa / Fúcsia para Sessões Web/Cookies */

  /* Estados de Saúde & Circuit Breakers */
  --status-closed-bg: #ECFDF5;
  --status-closed-fg: #059669;  /* Saudável (CLOSED) */
  
  --status-degraded-bg: #FFFBEB;
  --status-degraded-fg: #D97706; /* Atenção / Rate-limit (DEGRADED) */
  
  --status-open-bg: #FEF2F2;
  --status-open-fg: #DC2626;    /* Fora do ar / Circuito Aberto (OPEN) */

  --status-half-open-bg: #EFF6FF;
  --status-half-open-fg: #2563EB; /* Teste canary (HALF_OPEN) */

  /* Tipografia */
  --font-sans: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Sombras (Elevation) */
  --shadow-xs: 0 1px 2px 0 rgba(15, 23, 42, 0.05);
  --shadow-card: 0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.04);
  --shadow-dropdown: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03);
}
```

---

## 3. Arquitetura de Navegação & Layout Global

```
+-------------------------------------------------------------------------------------------------------+
|  LOGO ProxyAI [Enterprise]       Buscar rotas, chaves, logs... (Cmd+K)        Org: Acme Inc  (Perfil) |
+------------------+------------------------------------------------------------------------------------+
|  [Sidebar]       |  HEADER: Visão Geral / Métricas Globais (Período: Últimos 7 dias)                  |
|                  +------------------------------------------------------------------------------------+
|  * Dashboard     |  [ KPI CARDS COLORIDOS ]                                                           |
|  * Provedores    |  +----------------+  +----------------+  +----------------+  +----------------+    |
|  * Combos        |  | Req. Totais    |  | Custo Real     |  | Receita / Lucro|  | Latência TTFT  |    |
|  * Chaves API    |  | 4.2M           |  | $1,420.50      |  | $2,841.00 (+50)|  | 142ms (p95)    |    |
|  * Faturamento   |  | [Badge +12%]   |  | [Barra Custo]  |  | [Badge Lucro]  |  | [Sinal Verde]  |    |
|  * Logs ao Vivo  |  +----------------+  +----------------+  +----------------+  +----------------+    |
|  * Configurações |                                                                                    |
|                  |  [ GRÁFICO STREAMING / VOLUMETRIA ]       [ STATUS CIRCUIT BREAKERS ]              |
|                  |  +-------------------------------------+  +-------------------------------------+  |
|                  |  | Volume de Tokens (Prompt vs Compl.) |  | Provedor   | Status   | Falhas | Lat|  |
|                  |  | (Área empilhada em tons Indigo/Rosa)|  | OpenAI     | CLOSED   | 0.01%  |180 |  |
|                  |  |                                     |  | Claude     | CLOSED   | 0.00%  |240 |  |
|                  |  |                                     |  | DeepSeek   | DEGRADED | 14.2%  |890 |  |
|                  |  |                                     |  | DDG Web    | CLOSED   | 0.00%  |310 |  |
|                  |  +-------------------------------------+  +-------------------------------------+  |
+------------------+------------------------------------------------------------------------------------+
```

---

## 4. Telas-Chave e Mockups Estruturais

### 4.1 Gestão de Provedores e Contas (Provider Hub)
- **Grid de Cards Multicor:** Cada provedor possui sua insígnia oficial e badge de tipo:
  - `[API Key]` (Badge Azul Claro)
  - `[OAuth]` (Badge Roxo Claro)
  - `[Web Cookie Stealth]` (Badge Rosa Suave)
- **Ações:** Testar Conexão em tempo real (Canary Ping), editar cotas, configurar proxies dedicados e visualizar tempo restante para expiração de token/cookie.

### 4.2 Editor de Combos Inteligentes (Pipeline Builder)
- Interface de blocos arrastáveis onde cada modelo é representado por um card de rota:
  - **Passo 1 (Primário):** `deepseek/chat` (Custo: $0.14/M) -> Se falhar / 429
  - **Passo 2 (Fallback 1):** `openai/gpt-4o-mini` (Custo: $0.15/M) -> Se falhar / Timeout
  - **Passo 3 (Fallback Final):** `anthropic/claude-3-5-haiku` (Custo: $0.80/M)
- Mostra a **Taxa Teórica de Economia** e o **SLA combinado de resiliência**.

### 4.3 Faturamento & Ledger de Créditos (Billing Center)
- **Tabela de Conciliação em Tempo Real:**
  - `Data/Hora` | `Tenant/Chave` | `Modelo Executado` | `Tokens In/Out` | `Custo Base` | `Cobrado` | `Margem`
- **Controle de Saldos:**
  - Barra de progresso de consumo de plano mensal.
  - Alerta de recarga automática para carteira pré-paga quando o saldo atingir threshold configurado.
