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
  Droplets,
  Thermometer
} from 'lucide-react';

interface CanteiroMinhocultura {
  id: string;
  identificacao: string;
  substratoBase: string;
  diasProcessamento: number;
  temperaturaC: number;
  umidadePct: number;
  ph: number;
  densidadeMinhocasPorM2: number;
  extracaoChorumeLitrosSemana: number;
  status: 'EM_ALIMENTACAO' | 'FASE_TERMOFILICA_PREVIA' | 'COLHEITA_HUMUS';
}

export const MinhoculturaHumusModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'canteiros' | 'biologia' | 'acidos_humicos' | 'simulador'>('canteiros');

  // Canteiros de Vermicompostagem
  const [canteiros] = useState<CanteiroMinhocultura[]>([
    {
      id: 'CANT-01',
      identificacao: 'Canteiro Industrial 01 • Esterco Bovino Pré-Compostado',
      substratoBase: 'Dejetos Bovinos Curtidos (60%) + Palhada Picada (40%)',
      diasProcessamento: 65,
      temperaturaC: 22.5,
      umidadePct: 75,
      ph: 7.2,
      densidadeMinhocasPorM2: 8500,
      extracaoChorumeLitrosSemana: 420,
      status: 'COLHEITA_HUMUS',
    },
    {
      id: 'CANT-02',
      identificacao: 'Canteiro Industrial 02 • Cama de Aviário e Torta de Filtro',
      substratoBase: 'Torta de Filtro de Cana + Cama de Frango',
      diasProcessamento: 38,
      temperaturaC: 24.0,
      umidadePct: 78,
      ph: 6.9,
      densidadeMinhocasPorM2: 9200,
      extracaoChorumeLitrosSemana: 510,
      status: 'EM_ALIMENTACAO',
    },
    {
      id: 'CANT-03',
      identificacao: 'Canteiro Industrial 03 • Resíduos Hortícolas e Poda',
      substratoBase: 'Restos de HF + Serragem Curtida',
      diasProcessamento: 15,
      temperaturaC: 25.5,
      umidadePct: 80,
      ph: 7.0,
      densidadeMinhocasPorM2: 7800,
      extracaoChorumeLitrosSemana: 380,
      status: 'EM_ALIMENTACAO',
    },
  ]);

  // Simulador Econômico da Minhocultura
  const [canteirosAtivosM2, setCanteirosAtivosM2] = useState<number>(1200);
  const [estercoProcessadoTonAno, setEstercoProcessadoTonAno] = useState<number>(600);
  const [taxaConversaoHumusSolidoPct, setTaxaConversaoHumusSolidoPct] = useState<number>(50.0);
  const [litrosBiofertilizantePorTonEsterco, setLitrosBiofertilizantePorTonEsterco] = useState<number>(150);
  const [precoKgHumusSolidoReais, setPrecoKgHumusSolidoReais] = useState<number>(1.80);
  const [precoLitroBiofertilizanteReais, setPrecoLitroBiofertilizanteReais] = useState<number>(8.50);
  const [custoTotalOperacaoAnoReais, setCustoTotalOperacaoAnoReais] = useState<number>(380000.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const humusSolidoKgAno = (estercoProcessadoTonAno * 1000) * (taxaConversaoHumusSolidoPct / 100);
    const biofertilizanteLiquidoLitrosAno = estercoProcessadoTonAno * litrosBiofertilizantePorTonEsterco;

    const receitaHumusSolidoReais = Number((humusSolidoKgAno * precoKgHumusSolidoReais).toFixed(2));
    const receitaBiofertilizanteReais = Number((biofertilizanteLiquidoLitrosAno * precoLitroBiofertilizanteReais).toFixed(2));
    const receitaBrutaTotalReais = Number((receitaHumusSolidoReais + receitaBiofertilizanteReais).toFixed(2));

    const lucroLiquidoAnoReais = Number((receitaBrutaTotalReais - custoTotalOperacaoAnoReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoAnoReais / (receitaBrutaTotalReais || 1)) * 100).toFixed(1));

    return {
      humusSolidoKgAno,
      biofertilizanteLiquidoLitrosAno,
      receitaHumusSolidoReais,
      receitaBiofertilizanteReais,
      receitaBrutaTotalReais,
      lucroLiquidoAnoReais,
      margemLiquidaPct,
    };
  }, [
    estercoProcessadoTonAno,
    taxaConversaoHumusSolidoPct,
    litrosBiofertilizantePorTonEsterco,
    precoKgHumusSolidoReais,
    precoLitroBiofertilizanteReais,
    custoTotalOperacaoAnoReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/60 border border-amber-600/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                Módulo 91 • Minhocultura & Vermicompostagem
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Eisenia fetida • Húmus Sólido & Líquido
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🪱 Vermicompostagem Industrial & Ácidos Húmicos
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Reciclagem biológica acelerada de dejetos agropecuários e biomassas vegetais através da minhoca vermelha da Califórnia (*Eisenia fetida*). Produção simultânea de condicionador micropenetrável de solo e biofertilizante foliar enzimático de alta assimilação.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Húmus Peneirado</span>
              <span className="text-xl font-black text-amber-400">300 ton</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">50% Rendimento Seco</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Biofertilizante</span>
              <span className="text-xl font-black text-emerald-400">90.000 L</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">Extrato Purificado</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">População nos Canteiros</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">8.500 minh / m²</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Digestão Rápida em 60 dias
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Teor de Matéria Orgânica</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">54.0%</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Rico em Ácidos Fúlvicos e Húmicos
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faturamento Anual</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">R$ 1.305.000,00</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Húmus Sólido + Líquido
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <Award className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">R$ 925.000,00</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Margem Líquida de 70.9%
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('canteiros')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'canteiros'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          1. Canteiros & Umidade
        </button>

        <button
          onClick={() => setActiveTab('biologia')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'biologia'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          2. Biologia da Eisenia fetida
        </button>

        <button
          onClick={() => setActiveTab('acidos_humicos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'acidos_humicos'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Filter className="w-4 h-4" />
          3. Ácidos Húmicos & Biofertilizante
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
          4. Simulador Econômico da Minhocultura
        </button>
      </div>

      {/* Conteúdo Aba 1: Canteiros */}
      {activeTab === 'canteiros' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Monitoramento dos Canteiros em Galpões Cobertos
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Canteiros de alvenaria ou solo com leito drenante impermeabilizado para captação contínua de chorume enriquecido. Umidade mantida por microaspersores entre 70% e 80% e temperatura inferior a 28°C.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Canteiro / Setor</th>
                    <th className="py-3 px-3">Substrato Processado</th>
                    <th className="py-3 px-3">Dias Cultivo</th>
                    <th className="py-3 px-3">Temp / Umidade</th>
                    <th className="py-3 px-3">pH</th>
                    <th className="py-3 px-3">Densidade</th>
                    <th className="py-3 px-3">Biofertilizante</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {canteiros.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{c.identificacao}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{c.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300">{c.substratoBase}</td>
                      <td className="py-3.5 px-3 font-mono text-white">{c.diasProcessamento} dias</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-amber-400">{c.temperaturaC}°C • {c.umidadePct}%</td>
                      <td className="py-3.5 px-3 font-mono text-cyan-400 font-bold">{c.ph}</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400">{c.densidadeMinhocasPorM2.toLocaleString()} / m²</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-teal-400">{c.extracaoChorumeLitrosSemana} L/sem</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {c.status}
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

      {/* Conteúdo Aba 2: Biologia */}
      {activeTab === 'biologia' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              Fisiologia e Digestão da Eisenia fetida
            </h3>
            <p className="text-xs text-slate-400">
              Cada minhoca ingere diariamente o equivalente ao seu próprio peso corporal (0,5 a 1,0g), excretando coprólitos com flora microbiana ativa e minerais quelatizados:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Pré-Compostagem Térmica Obrigatória</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Os dejetos passam por 15 dias de fermentação aeróbica a 60°C para eliminar sementes de invasoras e patógenos entéricos antes de serem fornecidos às minhocas.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Reprodução Hermafrodita e Casulos</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Cada casulo eclode em 21 dias gerando de 2 a 4 novas minhocas, dobrando a biomassa do canteiro a cada 60 a 90 dias.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Peneiramento e Separação
            </h3>
            <p className="text-xs text-slate-400">
              Técnica de raspagem de luz ou peneiras rotativas trommel de 4mm:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Fotofobia da Minhoca:</span>
                <span className="font-mono font-bold text-amber-400">Fuga para o fundo facilitando colheita</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Peneira Cilíndrica Trommel:</span>
                <span className="font-mono font-bold text-emerald-400">Separação de 99% dos casulos e matrizes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Ácidos Húmicos */}
      {activeTab === 'acidos_humicos' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Filter className="w-5 h-5 text-cyan-400" />
              Composição Bioquímica e Quelação de Nutrientes no Solo
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              O húmus de minhoca possui alta capacidade de troca catiônica (CTC superior a 200 cmol/kg), funcionando como um banco biológico de retenção hídrica e liberação gradual de fósforo e micronutrientes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ácidos Fúlvicos</span>
                <span className="text-2xl font-black text-white font-mono">18.5%</span>
                <span className="text-[11px] text-amber-400 block">Absorção foliar ultra-rápida</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ácidos Húmicos</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">24.2%</span>
                <span className="text-[11px] text-slate-400 block">Estruturação de agregados de solo</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Carga Microbiana Viva</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">10⁹ UFC / g</span>
                <span className="text-[11px] text-slate-400 block">Antagonismo a fungos de raiz</span>
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
              Parâmetros de Vermicompostagem
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Esterco Processado Anual</span>
                <span className="font-mono text-amber-400">{estercoProcessadoTonAno} toneladas</span>
              </div>
              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={estercoProcessadoTonAno}
                onChange={(e) => setEstercoProcessadoTonAno(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Preço Húmus Sólido (R$/kg)</span>
                <span className="font-mono text-white">R$ {precoKgHumusSolidoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="3.50"
                step="0.10"
                value={precoKgHumusSolidoReais}
                onChange={(e) => setPrecoKgHumusSolidoReais(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Preço Biofertilizante Líquido (R$/L)</span>
                <span className="font-mono text-emerald-400">R$ {precoLitroBiofertilizanteReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="18.0"
                step="0.5"
                value={precoLitroBiofertilizanteReais}
                onChange={(e) => setPrecoLitroBiofertilizanteReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Custo Operacional Total Anual</span>
                <span className="font-mono text-rose-400">R$ {custoTotalOperacaoAnoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="150000"
                max="900000"
                step="25000"
                value={custoTotalOperacaoAnoReais}
                onChange={(e) => setCustoTotalOperacaoAnoReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Retorno Financeiro e Economia Circular
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Húmus Peneirado</span>
                <span className="font-mono font-bold text-white text-base">
                  {(metricas.humusSolidoKgAno / 1000).toFixed(0)} ton
                </span>
                <span className="text-[10px] text-slate-400 block">{taxaConversaoHumusSolidoPct}% rendimento</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Biofertilizante</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {(metricas.biofertilizanteLiquidoLitrosAno / 1000).toFixed(0)}k L
                </span>
                <span className="text-[10px] text-amber-400/80 block">Extrato Concentrado</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricas.receitaBrutaTotalReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-slate-400 block">Sólido + Líquido</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricas.lucroLiquidoAnoReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Venda de Húmus Sólido ({metricas.humusSolidoKgAno.toLocaleString()} kg @ R$ {precoKgHumusSolidoReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-white">
                  R$ {metricas.receitaHumusSolidoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Venda de Biofertilizante Líquido ({metricas.biofertilizanteLiquidoLitrosAno.toLocaleString()} L @ R$ {precoLitroBiofertilizanteReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-amber-400">
                  + R$ {metricas.receitaBiofertilizanteReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Custo Total de Operação, Peneiramento e Ensacamento:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {custoTotalOperacaoAnoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-950/30 px-3 rounded-lg border border-emerald-800/50">
                <span className="text-white">Lucro Líquido Anual Consolidado:</span>
                <span className="font-mono text-emerald-300">
                  R$ {metricas.lucroLiquidoAnoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinhoculturaHumusModule;
