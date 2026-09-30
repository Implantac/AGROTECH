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
  Trees,
  Flame,
  Droplets
} from 'lucide-react';

interface PomarMacadamia {
  id: string;
  identificacao: string;
  variedade: 'HAES 344 (Kau)' | 'IAC 4-12B' | 'HAES 741 (Mauka)';
  areaHa: number;
  idadeAnos: number;
  produtividadeNisKgHa: number;
  recuperacaoAmendoaPct: number;
  umidadePosSecagemPct: number;
  statusIndustrial: 'SECAGEM_SILO_AR_MORNO' | 'QUEBRA_MECANICA_ROTATIVA' | 'CLASSIFICACAO_ESTILO_0';
}

export const MacadamiaProcessamentoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pomares' | 'secagem' | 'quebra' | 'simulador'>('pomares');

  // Pomares de Macadâmia
  const [pomares] = useState<PomarMacadamia[]>([
    {
      id: 'MACADAMIA-01',
      identificacao: 'Fazenda Macadâmia 01 • Dois Córregos SP (HAES 344)',
      variedade: 'HAES 344 (Kau)',
      areaHa: 35,
      idadeAnos: 15,
      produtividadeNisKgHa: 3600,
      recuperacaoAmendoaPct: 33.0,
      umidadePosSecagemPct: 1.5,
      statusIndustrial: 'CLASSIFICACAO_ESTILO_0',
    },
    {
      id: 'MACADAMIA-02',
      identificacao: 'Fazenda Macadâmia 02 • São Mateus ES (IAC 4-12B)',
      variedade: 'IAC 4-12B',
      areaHa: 25,
      idadeAnos: 11,
      produtividadeNisKgHa: 3360,
      recuperacaoAmendoaPct: 31.8,
      umidadePosSecagemPct: 1.4,
      statusIndustrial: 'QUEBRA_MECANICA_ROTATIVA',
    },
  ]);

  // Simulador Econômico da Macadâmia
  const [areaCultivoHa, setAreaCultivoHa] = useState<number>(60);
  const [produtividadeNisKgHa, setProdutividadeNisKgHa] = useState<number>(3500);
  const [recuperacaoAmendoaPct, setRecuperacaoAmendoaPct] = useState<number>(32.5);
  const [precoKgAmendoaReais, setPrecoKgAmendoaReais] = useState<number>(72.0);
  const [custoTotalHaReais, setCustoTotalHaReais] = useState<number>(28000.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const producaoNisKg = areaCultivoHa * produtividadeNisKgHa;
    const amendoasRecuperadasKg = Number((producaoNisKg * (recuperacaoAmendoaPct / 100)).toFixed(1));
    const receitaBrutaReais = Number((amendoasRecuperadasKg * precoKgAmendoaReais).toFixed(2));
    const custoTotalReais = Number((areaCultivoHa * custoTotalHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaReais || 1)) * 100).toFixed(1));

    return {
      producaoNisKg,
      amendoasRecuperadasKg,
      receitaBrutaReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaCultivoHa,
    produtividadeNisKgHa,
    recuperacaoAmendoaPct,
    precoKgAmendoaReais,
    custoTotalHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-yellow-950/60 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Trees className="w-3.5 h-3.5" />
                Módulo 107 • Macadâmia de Precisão & Quebra
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Secagem NIS 1.5% • Amêndoas Estilo 0 e 1
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🥥 Macadâmia: Descascamento, Secagem Silo & Amêndoas Nobres
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Manejo industrial da noz-macadâmia (*Macadamia integrifolia*): despolpamento imediato da casca verde (carpelo), secagem lenta em silos com fluxo de ar a 35°C para contração da amêndoa (1.5% umidade) e quebra mecânica de alta recuperação sem trincas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Noz NIS</span>
              <span className="text-xl font-black text-amber-400">210.000 kg</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">60 ha Pomar</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Faturamento</span>
              <span className="text-xl font-black text-emerald-400">R$ 4,91M</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">65.8% Margem</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Taxa de Recuperação</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">32.5% Amêndoa</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            68.250 kg Amêndoas Nobres
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Umidade Pós-Silo</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">1.5% Umidade</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Amêndoa Solta Dentro da Casca
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Preço Amêndoa Limpa</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">R$ 72,00 / kg</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Exportação e Confeitaria Fina
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">R$ 3.234.000,00</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            R$ 53.900,00 por hectare
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('pomares')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pomares'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Trees className="w-4 h-4" />
          1. Pomares & Cultivares HAES
        </button>

        <button
          onClick={() => setActiveTab('secagem')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'secagem'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Droplets className="w-4 h-4" />
          2. Descascamento & Silos NIS
        </button>

        <button
          onClick={() => setActiveTab('quebra')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'quebra'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          3. Quebrador & Estilos Comerciais
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico
        </button>
      </div>

      {/* Conteúdo Aba 1: Pomares */}
      {activeTab === 'pomares' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Trees className="w-5 h-5 text-amber-400" />
              Monitoramento dos Pomares de Macadâmia
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              A macadâmia é originária das florestas subtropicais da Austrália e adaptou-se com vigor no Sudeste brasileiro. A colheita manual ou mecânica ocorre quando a casca verde se abre naturalmente e o fruto com casca dura (NIS) cai sobre o solo limpo e roçado.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Pomar / Local</th>
                    <th className="py-3 px-3">Variedade</th>
                    <th className="py-3 px-3">Idade</th>
                    <th className="py-3 px-3">Área (ha)</th>
                    <th className="py-3 px-3">Produtividade NIS</th>
                    <th className="py-3 px-3">Recuperação Amêndoa</th>
                    <th className="py-3 px-3">Umidade NIS</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {pomares.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{p.identificacao}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{p.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-amber-300 font-semibold">{p.variedade}</td>
                      <td className="py-3.5 px-3 font-mono text-white">{p.idadeAnos} anos</td>
                      <td className="py-3.5 px-3 font-mono text-white">{p.areaHa} ha</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">{p.produtividadeNisKgHa} kg/ha</td>
                      <td className="py-3.5 px-3 font-mono text-cyan-400 font-bold">{p.recuperacaoAmendoaPct}%</td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">{p.umidadePosSecagemPct}%</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {p.statusIndustrial}
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

      {/* Conteúdo Aba 2: Secagem */}
      {activeTab === 'secagem' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              Despolpamento Imediato & Silos de Secagem
            </h3>
            <p className="text-xs text-slate-400">
              O carpelo verde deve ser removido em no máximo 24 horas após a colheita para evitar fermentação e aquecimento interno:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Secagem em 3 Estágios de Temperatura</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Inicia com ar ambiente (25°C) por 3 dias, eleva para 32°C e finaliza a 38°C até a umidade cair de 10% para 1.5%.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Encolhimento da Amêndoa (Shrinkage)</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Ao secar para 1.5%, a amêndoa retrai fisicamente e descola da parede interna da casca dura (endocarpo), permitindo que a quebra ocorra sem esmagar o miolo.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Aproveitamento Integral da Casca Dura
            </h3>
            <p className="text-xs text-slate-400">
              Sustentabilidade e economia circular da queijeira:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Poder Calorífico da Casca Seca:</span>
                <span className="font-mono font-bold text-amber-400">4.800 kcal/kg (Alimenta a Caldeira)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Substrato de Moagem:</span>
                <span className="font-mono font-bold text-emerald-400">Abrasivo Industrial Biodegradável</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Quebra */}
      {activeTab === 'quebra' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-400" />
              Classificação Internacional de Estilos de Macadâmia
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              A indústria mundial categoriza a amêndoa de macadâmia pelo diâmetro e integridade física. Quanto maior o percentual de amêndoas inteiras (Estilo 0 e 1), maior a rentabilidade líquida do processamento.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estilo 0 (Super Wholes)</span>
                <span className="text-2xl font-black text-white font-mono">&gt; 20 mm</span>
                <span className="text-[11px] text-emerald-400 block">Amêndoas inteiras gigantes</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estilo 1 (Wholes)</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">16 a 20 mm</span>
                <span className="text-[11px] text-slate-400 block">Inteiras comerciais premium</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estilo 4 (Halves)</span>
                <span className="text-2xl font-black text-amber-400 font-mono">12 a 16 mm</span>
                <span className="text-[11px] text-slate-400 block">Metades para chocolates e snacks</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              Parâmetros da Safra de Macadâmia
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Área Plantada (ha)</span>
                <span className="font-mono text-amber-400">{areaCultivoHa} hectares</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={areaCultivoHa}
                onChange={(e) => setAreaCultivoHa(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Produtividade NIS (kg/ha)</span>
                <span className="font-mono text-cyan-400">{produtividadeNisKgHa} kg/ha</span>
              </div>
              <input
                type="range"
                min="1500"
                max="5000"
                step="100"
                value={produtividadeNisKgHa}
                onChange={(e) => setProdutividadeNisKgHa(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Preço Amêndoa Limpa (R$/kg)</span>
                <span className="font-mono text-emerald-400">R$ {precoKgAmendoaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="45.0"
                max="110.0"
                step="1.0"
                value={precoKgAmendoaReais}
                onChange={(e) => setPrecoKgAmendoaReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Custo de Manejo e Indústria por Ha</span>
                <span className="font-mono text-rose-400">R$ {custoTotalHaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="15000"
                max="45000"
                step="1000"
                value={custoTotalHaReais}
                onChange={(e) => setCustoTotalHaReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Retorno Financeiro da Macadâmia
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Noz em Casca NIS</span>
                <span className="font-mono font-bold text-white text-base">
                  {(metricas.producaoNisKg / 1000).toFixed(0)} ton
                </span>
                <span className="text-[10px] text-slate-400 block">{areaCultivoHa} ha colhidos</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Amêndoas Recuperadas</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {(metricas.amendoasRecuperadasKg / 1000).toFixed(1)} ton
                </span>
                <span className="text-[10px] text-amber-400/80 block">32.5% rendimento</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricas.receitaBrutaReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-slate-400 block">Exportação</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricas.lucroLiquidoReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Receita com Amêndoas Nobres Estilos 0, 1 e 4 ({metricas.amendoasRecuperadasKg.toLocaleString()} kg @ R$ {precoKgAmendoaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-white">
                  R$ {metricas.receitaBrutaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Custos Totais de Manejo, Colheita, Secagem em Silos e Quebrador:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {metricas.custoTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-amber-950/30 px-3 rounded-lg border border-amber-800/50">
                <span className="text-white">Lucro Líquido Anual Consolidado do Pomar:</span>
                <span className="font-mono text-emerald-300">
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

export default MacadamiaProcessamentoModule;
