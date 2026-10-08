import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  Box,
  Truck,
  Leaf,
  Filter,
  DollarSign,
  Activity,
  Award,
  Flame,
  Wind
} from 'lucide-react';

interface LoteErvaMate {
  id: string;
  identificacao: string;
  sistema: 'SOMBREADO_AGROFLORESTAL' | 'PLENO_SOL_ADENSADO';
  massaVerdeKg: number;
  umidadePosSecagemPct: number;
  temperaturaSapecoC: number;
  ervaCancheadaKg: number;
  tipoDestino: 'CHIMARRAO_TRADICIONAL' | 'TERERE_EXPORTACAO' | 'EXTRATO_SOLUVEL';
  status: 'EM_SAPECO' | 'SECAGEM_BARBACUA' | 'MATURACAO_BARRICA';
}

export const ErvaMateSapecoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ervais' | 'sapeco' | 'maturacao' | 'simulador'>('ervais');

  // Lotes de Erva-Mate
  const [lotes] = useState<LoteErvaMate[]>([
    {
      id: 'ERVA-01',
      identificacao: 'Erval Nativo 01 • Sombra de Araucárias',
      sistema: 'SOMBREADO_AGROFLORESTAL',
      massaVerdeKg: 240000,
      umidadePosSecagemPct: 5.2,
      temperaturaSapecoC: 450,
      ervaCancheadaKg: 115200,
      tipoDestino: 'CHIMARRAO_TRADICIONAL',
      status: 'MATURACAO_BARRICA',
    },
    {
      id: 'ERVA-02',
      identificacao: 'Erval 02 • Manejo Agroecológico Selecionado',
      sistema: 'SOMBREADO_AGROFLORESTAL',
      massaVerdeKg: 240000,
      umidadePosSecagemPct: 4.8,
      temperaturaSapecoC: 460,
      ervaCancheadaKg: 115200,
      tipoDestino: 'TERERE_EXPORTACAO',
      status: 'SECAGEM_BARBACUA',
    },
  ]);

  // Simulador Econômico da Erva-Mate
  const [areaHa, setAreaHa] = useState<number>(40);
  const [produtividadeMassaVerdeKgHa, setProdutividadeMassaVerdeKgHa] = useState<number>(12000);
  const [quebraSecagemSapecoPct, setQuebraSecagemSapecoPct] = useState<number>(52.0);
  const [precoKgErvaCancheadaReais, setPrecoKgErvaCancheadaReais] = useState<number>(6.80);
  const [custoManejoColheitaHaReais, setCustoManejoColheitaHaReais] = useState<number>(14200.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const massaVerdeTotalKg = areaHa * produtividadeMassaVerdeKgHa;
    const rendimentoSecoPct = 100 - quebraSecagemSapecoPct;
    const ervaCancheadaKg = Number((massaVerdeTotalKg * (rendimentoSecoPct / 100)).toFixed(1));

    const receitaBrutaReais = Number((ervaCancheadaKg * precoKgErvaCancheadaReais).toFixed(2));
    const custoTotalReais = Number((areaHa * custoManejoColheitaHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaReais || 1)) * 100).toFixed(1));

    return {
      massaVerdeTotalKg,
      ervaCancheadaKg,
      receitaBrutaReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaHa,
    produtividadeMassaVerdeKgHa,
    quebraSecagemSapecoPct,
    precoKgErvaCancheadaReais,
    custoManejoColheitaHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-green-950/70 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-emerald-500/20 text-emerald-800 border border-emerald-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                Módulo 97 • Erva-Mate & Agrofloresta Sombreada
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-800 border border-amber-500/30 rounded-full">
                Ilex paraguariensis • Sapeco & Barricas
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              🍃 Erva-Mate de Precisão, Sapeco Térmico & Maturação
            </h2>
            <p className="text-sm text-slate-900 max-w-3xl leading-relaxed">
              Manejo sustentável de ervais sombreados sob a copa de araucárias e processamento termomecânico: sapeco em chama direta para inativação de polifenoloxidase, secagem contínua e cancheamento com maturação em barricas de cedro.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Erva Cancheada</span>
              <span className="text-xl font-black text-emerald-700">230.400 kg</span>
              <span className="text-[10px] text-slate-600 block mt-0.5">40 ha Ervais</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Faturamento</span>
              <span className="text-xl font-black text-amber-700">R$ 1.566.720</span>
              <span className="text-[10px] text-amber-700/80 block mt-0.5">63.8% Margem</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Massa Verde Colhida</span>
            <Activity className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">12.0 t / ha</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Poda Bianual Equilibrada
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Temperatura de Sapeco</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-orange-400">450°C a 500°C</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Passagem Rápida (5 a 10 seg)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Umidade Pós-Secagem</span>
            <Wind className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black text-sky-700">&lt; 5.5%</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Imune a Mofos e Fermentação
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-700">R$ 998.720,00</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            R$ 24.968,00 por hectare/ano
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('ervais')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ervais'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Leaf className="w-4 h-4" />
          1. Ervais & Podas Sustentáveis
        </button>

        <button
          onClick={() => setActiveTab('sapeco')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sapeco'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Flame className="w-4 h-4" />
          2. Sapeco & Secador Rotativo
        </button>

        <button
          onClick={() => setActiveTab('maturacao')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'maturacao'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Award className="w-4 h-4" />
          3. Cancheamento & Maturação
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico
        </button>
      </div>

      {/* Conteúdo Aba 1: Ervais */}
      {activeTab === 'ervais' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-emerald-700" />
              Monitoramento dos Ervais Agroflorestais Sombreados
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              A erva-mate sombreada sob araucárias e outras espécies nativas desenvolve folhas com verde mais intenso, maior concentração de teobromina e menor teor de taninos adstringentes, resultando em sabor mais suave.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Erval / Talhão</th>
                    <th className="py-3 px-3">Sistema de Cultivo</th>
                    <th className="py-3 px-3">Massa Verde</th>
                    <th className="py-3 px-3">Umidade Pós-Secagem</th>
                    <th className="py-3 px-3">Temp Sapeco</th>
                    <th className="py-3 px-3">Erva Cancheada</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {lotes.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{l.identificacao}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{l.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-emerald-800 font-semibold">{l.sistema}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-800">{l.massaVerdeKg.toLocaleString()} kg</td>
                      <td className="py-3.5 px-3 font-mono text-sky-700 font-bold">{l.umidadePosSecagemPct}%</td>
                      <td className="py-3.5 px-3 font-mono text-orange-400 font-bold">{l.temperaturaSapecoC}°C</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">{l.ervaCancheadaKg.toLocaleString()} kg</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30">
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Sapeco */}
      {activeTab === 'sapeco' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Sapeco Térmico por Chama Direta
            </h3>
            <p className="text-xs text-slate-600">
              Passagem ultra-rápida (5 a 10 segundos) das ramas em cilindro rotativo metálico sob chama a 450°C:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Inativação de Enzimas Oxidadoras</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Desnatura a enzima polifenoloxidase instantaneamente, preservando a clorofila verde brilhante e impedindo o escurecimento oxidativo.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Ruptura de Células Foliares</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Provoca estalos microscópicos na cutícula foliar, permitindo secagem uniforme no secador de esteiras.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              Secagem Contínua em Ar Indireto
            </h3>
            <p className="text-xs text-slate-600">
              Elimina o contato com fumaça tóxica (isento de hidrocarbonetos policíclicos aromáticos - HPAs):
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Padrão Exportação HPA-Free:</span>
                <span className="font-mono font-bold text-emerald-700">100% Ar Quente Limpo</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Tempo de Residência no Secador:</span>
                <span className="font-mono font-bold text-amber-700">30 a 45 minutos</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Maturação */}
      {activeTab === 'maturacao' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-emerald-700" />
              Cancheamento & Maturação em Barricas
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              A erva cancheada (triturada em pedaços de 1 a 2 cm) passa por período de repouso controlado de 6 a 12 meses em câmaras de madeira nobre, onde ocorrem transformações físico-químicas que arredondam o perfil sensorial.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Estilo Chimarrão</span>
                <span className="text-2xl font-black text-slate-900 font-mono">Verde Viva (PN-1)</span>
                <span className="text-[11px] text-emerald-700 block">Moagem fina com folhas novas</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Estilo Tereré</span>
                <span className="text-2xl font-black text-sky-700 font-mono">Foliácea Pura</span>
                <span className="text-[11px] text-slate-600 block">Granulometria grossa sem pó</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Mercado Global</span>
                <span className="text-2xl font-black text-amber-700 font-mono">Energy Drinks & Chás</span>
                <span className="text-[11px] text-slate-600 block">Alemanha, EUA e Oriente Médio</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              Parâmetros da Produção Ervateira
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Área dos Ervais (ha)</span>
                <span className="font-mono text-emerald-700">{areaHa} hectares</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={areaHa}
                onChange={(e) => setAreaHa(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Produtividade Massa Verde (kg/ha)</span>
                <span className="font-mono text-sky-700">{produtividadeMassaVerdeKgHa} kg/ha</span>
              </div>
              <input
                type="range"
                min="6000"
                max="22000"
                step="1000"
                value={produtividadeMassaVerdeKgHa}
                onChange={(e) => setProdutividadeMassaVerdeKgHa(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Preço Erva Cancheada (R$/kg)</span>
                <span className="font-mono text-slate-800">R$ {precoKgErvaCancheadaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="4.50"
                max="12.0"
                step="0.20"
                value={precoKgErvaCancheadaReais}
                onChange={(e) => setPrecoKgErvaCancheadaReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Custo de Manejo e Indústria por Ha</span>
                <span className="font-mono text-rose-700">R$ {custoManejoColheitaHaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="8000"
                max="22000"
                step="500"
                value={custoManejoColheitaHaReais}
                onChange={(e) => setCustoManejoColheitaHaReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              Retorno Financeiro da Agrofloresta Ervateira
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Massa Verde</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {(metricas.massaVerdeTotalKg / 1000).toFixed(0)} ton
                </span>
                <span className="text-[10px] text-slate-600 block">{areaHa} ha colhidos</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Cancheada Seca</span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  {(metricas.ervaCancheadaKg / 1000).toFixed(0)} ton
                </span>
                <span className="text-[10px] text-emerald-700/80 block">48% rendimento</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  R$ {(metricas.receitaBrutaReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-slate-600 block">Venda Indústria</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  R$ {(metricas.lucroLiquidoReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-700/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Receita com Venda de Erva-Mate Cancheada ({metricas.ervaCancheadaKg.toLocaleString()} kg @ R$ {precoKgErvaCancheadaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-slate-900">
                  R$ {metricas.receitaBrutaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custo com Manejo da Agrofloresta, Poda e Sapeco Industrial:</span>
                <span className="font-mono font-bold text-rose-700">
                  - R$ {metricas.custoTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-50 px-3 rounded-lg border border-emerald-200">
                <span className="text-slate-900">Lucro Líquido Anual Consolidado:</span>
                <span className="font-mono text-emerald-800">
                  R$ {metricas.lucroLiquidoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErvaMateSapecoModule;
