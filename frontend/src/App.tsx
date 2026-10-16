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
  Terminal
} from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "collaborators" | "combos">("dashboard");

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4">
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

          <a href="#providers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Server className="w-4 h-4" />
            Hub Provedores
          </a>

          <a href="#proxies" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Globe className="w-4 h-4" />
            Proxies Webshare
          </a>

          <a href="#billing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <CreditCard className="w-4 h-4" />
            Faturamento &amp; Ledger
          </a>
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
      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
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
                  <button className="px-3 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded-lg shadow-sm">
                    + Novo Colaborador
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
        </div>
      </main>
    </div>
  );
}

export default App;
