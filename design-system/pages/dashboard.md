# Interface Override: Dashboard Principal (Visão Geral)

- **Arquivo Master:** `design-system/MASTER.md`
- **Página:** Visão Geral / Métricas do ProxyAI

---

## 1. Especificação de Componentes da Tela

### A. Barra de Navegação Superior (Header Global)
- **Altura:** 64px fixa, `border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30`.
- **Elementos:**
  - Logo ProxyAI em tipografia bold com tag `[Enterprise v1.0]`.
  - Caixa de comando rápido (Cmd+K / Ctrl+K) para busca instantânea de rotas, chaves de clientes e logs.
  - Seletor de Tenant / Organização ativa.
  - Indicador global de saúde da rede (Ponto verde pulsante: "Todos os clusters operacionais").

### B. Linha de Métricas Chave (KPI Summary Cards)
Quatro cartões em linha (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`):
1. **Requisições Totais (24h):**
   - Número: `4.82M` (Slate-900, text-2xl font-semibold).
   - Badge: `+14.2% vs ontem` (Fundo Emerald-50, texto Emerald-700).
   - Ícone: Lucide `Activity` em fundo Indigo-50 text-indigo-600.
2. **Custo Upstream Real:**
   - Número: `$1,248.30`.
   - Subtexto: `Gasto bruto nos provedores`.
   - Ícone: Lucide `TrendingDown` em fundo Rose-50 text-rose-600.
3. **Receita Faturada & Margem:**
   - Número: `$2,496.60` (Lucro líquido: `+$1,248.30` · Margem 50%).
   - Ícone: Lucide `DollarSign` em fundo Emerald-50 text-emerald-600.
4. **Latência Média TTFT (Time to First Token):**
   - Número: `132ms` (p95).
   - Indicador visual de velocímetro (Verde = <200ms).
   - Ícone: Lucide `Zap` em fundo Amber-50 text-amber-600.

### C. Visualizador de Streaming e Tabela de Provedores
- **Painel Esquerdo (65% largura):** Gráfico de área empilhada (Tokens de Prompt vs Tokens de Completion) com resolução de 1 minuto em tempo real.
- **Painel Direito (35% largura):** Lista de Circuit Breakers com badges interativos:
  - `OpenAI (GPT-4o)`: **CLOSED** (99.98% uptime, latência 190ms).
  - `Claude (Anthropic)`: **CLOSED** (100% uptime, latência 240ms).
  - `DeepSeek V3`: **DEGRADED** (86.4% uptime, latência 720ms - Failover ativo).
  - `DuckDuckGo (Web/Stealth)`: **CLOSED** (100% uptime, 0 pool errors).
