import { useState } from "react";
import { 
  Activity, 
  Server, 
  GitFork, 
  Users, 
  Globe, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal,
  RefreshCw,
  Plus
} from "lucide-react";

type TabType = "dashboard" | "collaborators" | "combos" | "providers" | "proxies" | "billing";

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            P
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-tight">ProxyAI</div>
            <span className="text-[10px] font-semibold tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              ENTERPRISE
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab === "dashboard"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Activity className="w-4 h-4" />
            Dashboard Geral
          </button>

          <button
            onClick={() => setActiveTab("collaborators")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab === "collaborators"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Users className="w-4 h-4" />
            Equipe (OpenCode)
          </button>

          <button
            onClick={() => setActiveTab("combos")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab === "combos"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <GitFork className="w-4 h-4" />
            Construtor Combos
          </button>

          <div className="pt-4 pb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Infraestrutura
          </div>

          <button
            onClick={() => setActiveTab("providers")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab === "providers"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Server className="w-4 h-4" />
            Hub Provedores
          </button>

          <button
            onClick={() => setActiveTab("proxies")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab === "proxies"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Globe className="w-4 h-4" />
            Proxies Webshare
          </button>

          <button
            onClick={() => setActiveTab("billing")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab === "billing"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Faturamento &amp; Ledger
          </button>
        </nav>

        <div className="mt-auto border-t border-slate-100 pt-4 flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
            AC
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-slate-900 truncate">Acme Corporation</div>
            <div className="text-[11px] text-slate-500">Tenant B2B Ativo</div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Data Plane Go: Operacional (TTFT &lt; 5ms)
          </div>

          <div className="text-sm text-slate-500">
            Cluster: <span className="font-semibold text-slate-800">SP-01</span> · Latência p95: <span className="font-semibold text-emerald-600">84ms</span>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-8 space-y-6">
          {/* 1. DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Visão Geral da Operação</h1>
                <p className="text-xs text-slate-500">Telemetria de inferência, status de circuit breakers e controle de saldo atômico</p>
              </div>

              {/* KPIS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Requisições (24h)</div>
                  <div className="text-2xl font-bold text-slate-900">4.82M</div>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    +14.2% vs ontem
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Custo Upstream Real</div>
                  <div className="text-2xl font-bold text-slate-900">$1,248.30</div>
                  <span className="inline-block mt-2 text-[11px] font-medium text-slate-500">
                    358 Provedores Conectados
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Receita &amp; Margem</div>
                  <div className="text-2xl font-bold text-slate-900">$2,496.60</div>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                    +50.0% Lucro Bruto
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Latência TTFT (p95)</div>
                  <div className="text-2xl font-bold text-emerald-600">132ms</div>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Saudável
                  </span>
                </div>
              </div>

              {/* CIRCUIT BREAKERS STATUS WIDGET */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Saúde dos Provedores &amp; Circuit Breakers</h2>
                    <p className="text-xs text-slate-500">Monitoramento contínuo em 4 estados: CLOSED, DEGRADED, OPEN e HALF_OPEN</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900">OpenAI Official</div>
                      <div className="text-xs text-slate-500">Latência: 182ms · Falhas: 0.01%</div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CLOSED
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900">Claude 3.5 Sonnet</div>
                      <div className="text-xs text-slate-500">OAuth Auto-Refresh: 6d restantes</div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CLOSED
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-amber-900">DeepSeek V3 (Local)</div>
                      <div className="text-xs text-amber-700">Rate Limit 429 · Failover Ativo</div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> DEGRADED
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 2. EQUIPE OPENCODE */}
          {activeTab === "collaborators" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestão de Colaboradores &amp; Acesso OpenCode</h1>
                <p className="text-xs text-slate-500">Distribua credenciais corporativas e governe limites de 5 horas, semanais e mensais no OpenCode</p>
              </div>

              {/* CLI TERMINAL BANNER */}
              <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> Comando de Login para Desenvolvedores no OpenCode
                  </div>
                  <code className="text-xs font-mono text-emerald-400">
                    opencode auth login --proxy https://proxy.acme.com --tenant acme
                  </code>
                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition">
                  Copiar Instruções
                </button>
              </div>

              {/* COLLABORATOR TABLE */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 text-sm">Desenvolvedores Cadastrados</h2>
                  <button className="px-3 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Novo Colaborador
                  </button>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200 text-[10px]">
                    <tr>
                      <th className="px-6 py-3">Colaborador</th>
                      <th className="px-6 py-3">Janela 5 Horas</th>
                      <th className="px-6 py-3">Cota Semanal</th>
                      <th className="px-6 py-3">Consumo Mensal</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">Carlos Silva</div>
                        <div className="text-[11px] text-slate-400">carlos.silva@acme.com · Tech Lead</div>
                      </td>
                      <td className="px-6 py-4 font-mono">R$ 12,00 / R$ 35,00</td>
                      <td className="px-6 py-4 font-mono">R$ 68,00 / R$ 150,00</td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-slate-900 font-semibold mb-1">R$ 290,00 / R$ 500,00 (58%)</div>
                        <div className="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full w-[58%]"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          ATIVO
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">Beatriz Lima</div>
                        <div className="text-[11px] text-slate-400">beatriz.lima@acme.com · Dev Frontend Jr</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-amber-600 font-semibold">R$ 32,00 / R$ 35,00 (91%)</td>
                      <td className="px-6 py-4 font-mono">R$ 88,00 / R$ 100,00</td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-slate-900 font-semibold mb-1">R$ 92,00 / R$ 100,00 (92%)</div>
                        <div className="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full w-[92%]"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">
                          ALERTA 5H
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. CONSTRUTOR COMBOS */}
          {activeTab === "combos" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Construtor de Combos de Roteamento</h1>
                <p className="text-xs text-slate-500">Pipeline de failover sequencial, modo eco e consenso paralelo</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase">Combo Ativo</span>
                    <h3 className="text-base font-bold text-slate-900">Smart-Coder-Resilient (proxyai/coding-auto)</h3>
                  </div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full">
                    Estratégia: Priority Failover
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-500">1. Alvo Primário (Eco Mode)</div>
                      <div className="font-bold text-slate-900">DeepSeek V3 (Local/Direct)</div>
                      <div className="text-xs text-slate-500">Custo: $0.14/M · Pula em 429 ou Timeout de 8s</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      Economia 80%
                    </span>
                  </div>

                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-500">2. Fallback 1 (Alta Velocidade)</div>
                      <div className="font-bold text-slate-900">OpenAI GPT-4o-mini</div>
                      <div className="text-xs text-slate-500">Custo: $0.15/M · Pula em erro 5xx ou latência &gt; 2.5s</div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                      Failover Rápido
                    </span>
                  </div>

                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-500">3. Fallback Final (Resiliência Máxima)</div>
                      <div className="font-bold text-slate-900">Anthropic Claude 3.5 Sonnet</div>
                      <div className="text-xs text-slate-500">SLA Garantido de 99.99%</div>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      Alta Precisão
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. HUB PROVEDORES */}
          {activeTab === "providers" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hub de Provedores Conectados</h1>
                  <p className="text-xs text-slate-500">Gerenciamento de credenciais API Key, sessões rotativas OAuth e pools stealth de cookies</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition shadow-sm flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Conectar Provedor
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* PROVEDOR 1: OPENAI */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                        OA
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">OpenAI Official</div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          API KEY
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ATIVO
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 border-t border-slate-100 pt-3">
                    <div>Chaves Ativas: <span className="font-semibold text-slate-800">3 contas em pool</span></div>
                    <div>Modelos: <span className="font-mono text-slate-800 text-[11px]">gpt-4o, gpt-4o-mini</span></div>
                    <div>Latência média: <span className="font-semibold text-emerald-600">182ms</span></div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700">
                      Testar Ping
                    </button>
                    <button className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700">
                      Configurar
                    </button>
                  </div>
                </div>

                {/* PROVEDOR 2: ANTHROPIC CLAUDE */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-sm">
                        C
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Anthropic Claude</div>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                          OAUTH 2.0
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ATIVO
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 border-t border-slate-100 pt-3">
                    <div>Sessão: <span className="font-semibold text-slate-800">Auto-Refresh Pró-Ativo</span></div>
                    <div>Expiração: <span className="font-semibold text-purple-600">6 dias restantes</span></div>
                    <div>Modelos: <span className="font-mono text-slate-800 text-[11px]">claude-3-5-sonnet</span></div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700">
                      Renovar Token
                    </button>
                    <button className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700">
                      Configurar
                    </button>
                  </div>
                </div>

                {/* PROVEDOR 3: DUCKDUCKGO WEB */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-600 text-white font-bold flex items-center justify-center text-xs">
                        DDG
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">DuckDuckGo AI</div>
                        <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded">
                          WEB STEALTH
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ATIVO
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 border-t border-slate-100 pt-3">
                    <div>Sidecar: <span className="font-semibold text-slate-800">Playwright Pool (4 abas)</span></div>
                    <div>Bypass VQD: <span className="font-semibold text-emerald-600">100% Sucesso</span></div>
                    <div>Custo Upstream: <span className="font-semibold text-slate-800">$0.00 (Livre)</span></div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700">
                      Reciclar Pool
                    </button>
                    <button className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700">
                      Configurar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. PROXIES WEBSHARE */}
          {activeTab === "proxies" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pool de Proxies &amp; Integração Webshare</h1>
                  <p className="text-xs text-slate-500">Rotação contínua de IPs residenciais e data center via API REST v2</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg shadow-sm">
                    Configurar Token
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh de IPs
                  </button>
                </div>
              </div>

              {/* KPIS PROXY */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Proxies Vivos no Pool</div>
                  <div className="text-2xl font-bold text-slate-900">128 IPs</div>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    100% Válidos &amp; Verificados
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Latência Média de Saída</div>
                  <div className="text-2xl font-bold text-emerald-600">84ms</div>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Rotação Quality-First
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Distribuição Geográfica</div>
                  <div className="text-2xl font-bold text-slate-900">US (85%) · BR (15%)</div>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Claude &amp; DDG Ready
                  </span>
                </div>
              </div>

              {/* TABELA DE PROXIES */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200 text-[10px]">
                    <tr>
                      <th className="px-6 py-3">Endereço Proxy</th>
                      <th className="px-6 py-3">Porta</th>
                      <th className="px-6 py-3">Localização</th>
                      <th className="px-6 py-3">Modo</th>
                      <th className="px-6 py-3">Latência</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">185.199.228.14</td>
                      <td className="px-6 py-4 text-slate-500">8168</td>
                      <td className="px-6 py-4 font-sans">🇺🇸 US / New York</td>
                      <td className="px-6 py-4 font-sans">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">
                          DIRECT
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-600 font-bold">42ms</td>
                      <td className="px-6 py-4 font-sans">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          ONLINE
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">45.142.120.89</td>
                      <td className="px-6 py-4 text-slate-500">8168</td>
                      <td className="px-6 py-4 font-sans">🇺🇸 US / Los Angeles</td>
                      <td className="px-6 py-4 font-sans">
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold">
                          BACKBONE
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-600 font-bold">68ms</td>
                      <td className="px-6 py-4 font-sans">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          ONLINE
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">177.54.148.210</td>
                      <td className="px-6 py-4 text-slate-500">8168</td>
                      <td className="px-6 py-4 font-sans">🇧🇷 BR / São Paulo</td>
                      <td className="px-6 py-4 font-sans">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">
                          DIRECT
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-600 font-bold">28ms</td>
                      <td className="px-6 py-4 font-sans">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          ONLINE
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. FATURAMENTO & LEDGER */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Centro de Faturamento &amp; Ledger Atômico</h1>
                  <p className="text-xs text-slate-500">Saldos pré-pagos, cotas recorrentes e extrato imutável pós-streaming</p>
                </div>
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition shadow-sm flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Comprar Créditos (PIX)
                </button>
              </div>

              {/* CARDS FATURAMENTO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Saldo Pré-Pago Disponível</div>
                  <div className="text-3xl font-bold text-slate-900">R$ 4.850,20</div>
                  <span className="inline-block mt-2 text-[11px] font-medium text-emerald-600">
                    Reserva ativa no Redis (Holds): R$ 12,40
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Cota do Plano Mensal (Pro)</div>
                  <div className="text-3xl font-bold text-indigo-600">68% <span className="text-xs text-slate-400 font-normal">usado</span></div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-indigo-600 h-full w-[68%]"></div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Margem de Revenda Bruta</div>
                  <div className="text-3xl font-bold text-emerald-600">+ R$ 2.410,80</div>
                  <span className="inline-block mt-2 text-[11px] font-medium text-slate-500">
                    Markup médio aplicado: 2.0x (100% margem)
                  </span>
                </div>
              </div>

              {/* TABELA DE EXTRATO / LEDGER */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900 text-sm">Extrato de Conciliação Financeira (Credit Ledger Imutável)</h2>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200 text-[10px]">
                    <tr>
                      <th className="px-6 py-3">ID Transação</th>
                      <th className="px-6 py-3">Data / Hora</th>
                      <th className="px-6 py-3">Aplicação / Chave</th>
                      <th className="px-6 py-3">Provedor / Modelo</th>
                      <th className="px-6 py-3">Tokens (In / Out)</th>
                      <th className="px-6 py-3">Valor</th>
                      <th className="px-6 py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="px-6 py-4 font-mono text-[11px] text-slate-400">tx_8f912a</td>
                      <td className="px-6 py-4 text-slate-500">15/10/2026 14:32:01</td>
                      <td className="px-6 py-4 font-bold text-slate-900">Agente Suporte (Chatbot)</td>
                      <td className="px-6 py-4 text-emerald-700 font-semibold">OpenAI / gpt-4o</td>
                      <td className="px-6 py-4 font-mono">1.820 in / 412 out</td>
                      <td className="px-6 py-4 font-bold text-rose-600">- R$ 0,042</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          SETTLED
                        </span>
                      </td>
                    </tr>

                    <tr className="bg-emerald-50/40">
                      <td className="px-6 py-4 font-mono text-[11px] text-emerald-700 font-bold">pix_991823</td>
                      <td className="px-6 py-4 text-emerald-900 font-semibold">15/10/2026 14:28:10</td>
                      <td className="px-6 py-4 font-bold text-emerald-900">Recarga de Créditos (PIX)</td>
                      <td className="px-6 py-4 text-emerald-700 font-semibold">Mercado Pago Gateway</td>
                      <td className="px-6 py-4 font-mono">—</td>
                      <td className="px-6 py-4 font-bold text-emerald-700 text-sm">+ R$ 500,00</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full font-bold text-[10px]">
                          CREDIT
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
