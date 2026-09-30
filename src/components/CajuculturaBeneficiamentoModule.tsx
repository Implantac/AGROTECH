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
  Sun,
  Droplets
} from 'lucide-react';

interface LoteCastanha {
  id: string;
  identificacao: string;
  clone: string;
  castanhaBrutaKg: number;
  rendimentoAmendoaPct: number;
  classificacaoW: 'W1_INTEIRA_PREMIUM' | 'W2' | 'W3' | 'BROKEN_PEDACINHOS';
  pedunculoTon: number;
  cajuinaProduzidaLitros: number;
  status: 'EM_SECAGEM_SOLAR' | 'AUTOCLAVE_DESPELICULAGEM' | 'ENGARRAFAMENTO_CAJUINA';
}

export const CajuculturaBeneficiamentoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'safra' | 'cajuina' | 'amendoa' | 'simulador'>('safra');

  // Lotes de Cajucultura
  const [lotes] = useState<LoteCastanha[]>([
    {
      id: 'LOTE-CAJU-01',
      identificacao: 'Pomar 01 • Caju-Anão-Precoce CCP 76',
      clone: 'Embrapa CCP 76',
      castanhaBrutaKg: 8400,
      rendimentoAmendoaPct: 24.5,
      classificacaoW: 'W1_INTEIRA_PREMIUM',
      pedunculoTon: 60.0,
      cajuinaProduzidaLitros: 21000,
      status: 'AUTOCLAVE_DESPELICULAGEM',
    },
    {
      id: 'LOTE-CAJU-02',
      identificacao: 'Pomar 02 • Caju-Anão-Precoce BRS 226',
      clone: 'Embrapa BRS 226',
      castanhaBrutaKg: 8400,
      rendimentoAmendoaPct: 23.8,
      classificacaoW: 'W1_INTEIRA_PREMIUM',
      pedunculoTon: 60.0,
      cajuinaProduzidaLitros: 21000,
      status: 'ENGARRAFAMENTO_CAJUINA',
    },
  ]);

  // Simulador Econômico da Cajucultura
  const [areaHa, setAreaHa] = useState<number>(12);
  const [produtividadeCastanhaKgHa, setProdutividadeCastanhaKgHa] = useState<number>(1400);
  const [produtividadePedunculoTonHa, setProdutividadePedunculoTonHa] = useState<number>(10.0);
  const [rendimentoAmendoaPct, setRendimentoAmendoaPct] = useState<number>(24.0);
  const [litrosCajuinaPorTonPedunculo, setLitrosCajuinaPorTonPedunculo] = useState<number>(350);
  const [precoKgAmendoaW1Reais, setPrecoKgAmendoaW1Reais] = useState<number>(68.0);
  const [precoLitroCajuinaReais, setPrecoLitroCajuinaReais] = useState<number>(14.0);
  const [custoPorHaReais, setCustoPorHaReais] = useState<number>(18500.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const producaoTotalCastanhaKg = areaHa * produtividadeCastanhaKgHa;
    const amendoaW1ExportacaoKg = Number((producaoTotalCastanhaKg * (rendimentoAmendoaPct / 100)).toFixed(1));
    const producaoTotalPedunculoTon = areaHa * produtividadePedunculoTonHa;
    const cajuinaProduzidaLitros = producaoTotalPedunculoTon * litrosCajuinaPorTonPedunculo;

    const receitaAmendoaReais = Number((amendoaW1ExportacaoKg * precoKgAmendoaW1Reais).toFixed(2));
    const receitaCajuinaReais = Number((cajuinaProduzidaLitros * precoLitroCajuinaReais).toFixed(2));
    const receitaBrutaTotalReais = Number((receitaAmendoaReais + receitaCajuinaReais).toFixed(2));

    const custoTotalReais = Number((areaHa * custoPorHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaTotalReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaTotalReais || 1)) * 100).toFixed(1));

    return {
      producaoTotalCastanhaKg,
      amendoaW1ExportacaoKg,
      producaoTotalPedunculoTon,
      cajuinaProduzidaLitros,
      receitaAmendoaReais,
      receitaCajuinaReais,
      receitaBrutaTotalReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaHa,
    produtividadeCastanhaKgHa,
    produtividadePedunculoTonHa,
    rendimentoAmendoaPct,
    litrosCajuinaPorTonPedunculo,
    precoKgAmendoaW1Reais,
    precoLitroCajuinaReais,
    custoPorHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-orange-950/70 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                Módulo 95 • Cajucultura & Beneficiamento
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Caju-Anão CCP 76 • Castanha W1 & Cajuína DOC
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🥜 Cajucultura de Precisão, Castanhas Nobres & Cajuína
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Manejo agronômico de clones de caju-anão-precoce irrigados e beneficiamento duplo integral: despeliculagem e classificação de amêndoas inteiras (W1 a W4) para exportação e clarificação do pedúnculo para produção de Cajuína artesanal e LCC industrial.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Amêndoa W1</span>
              <span className="text-xl font-black text-amber-400">4.032 kg</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">24% Rendimento</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cajuína Clarificada</span>
              <span className="text-xl font-black text-emerald-400">42.000 L</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">Sem Conservantes</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Produtividade de Castanha</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">1.400 kg / ha</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Clones CCP 76 & BRS 226
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Aproveitamento Pedúnculo</span>
            <Droplets className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">10,0 t / ha</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Gelatina Alimentícia para Clarificação
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faturamento Anual</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">R$ 862.176,00</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Amêndoas Nobres + Cajuína
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <Award className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">R$ 640.176,00</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Margem Líquida de 74.2%
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('safra')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'safra'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Sun className="w-4 h-4" />
          1. Pomares & Produtividade
        </button>

        <button
          onClick={() => setActiveTab('amendoa')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'amendoa'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Box className="w-4 h-4" />
          2. Classificação de Amêndoas (W1)
        </button>

        <button
          onClick={() => setActiveTab('cajuina')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cajuina'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Droplets className="w-4 h-4" />
          3. Processamento de Cajuína DOC
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
          4. Simulador Econômico da Cajucultura
        </button>
      </div>

      {/* Conteúdo Aba 1: Safra */}
      {activeTab === 'safra' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Sun className="w-5 h-5 text-amber-400" />
              Lotes de Caju-Anão-Precoce e Rendimento Agroindustrial
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Colheita diária no ponto de maturação fisiológica: a castanha cai junto com o pseudofruto turgido. Processamento em até 24 horas para preservar a cor dourada e o aroma doce da cajuína.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Pomar / Lote</th>
                    <th className="py-3 px-3">Clone Embrapa</th>
                    <th className="py-3 px-3">Castanha Bruta</th>
                    <th className="py-3 px-3">Rendimento Amêndoa</th>
                    <th className="py-3 px-3">Classificação</th>
                    <th className="py-3 px-3">Pedúnculo</th>
                    <th className="py-3 px-3">Cajuína Estimada</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {lotes.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{l.identificacao}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{l.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-amber-300 font-semibold">{l.clone}</td>
                      <td className="py-3.5 px-3 font-mono text-white">{l.castanhaBrutaKg.toLocaleString()} kg</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">{l.rendimentoAmendoaPct}%</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {l.classificacaoW}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-200">{l.pedunculoTon} ton</td>
                      <td className="py-3.5 px-3 font-mono text-cyan-400 font-bold">{l.cajuinaProduzidaLitros.toLocaleString()} L</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
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

      {/* Conteúdo Aba 2: Amêndoa */}
      {activeTab === 'amendoa' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-amber-400" />
              Linha de Processamento da Castanha
            </h3>
            <p className="text-xs text-slate-400">
              Etapas industriais para obter o padrão exportação W1 (Whole White):
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Autoclavagem & Quebra Mecânica</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Cozimento sob vapor a 130°C para fragilizar a casca dura e facilitar a quebra sem romper a amêndoa.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Estufagem & Despeliculagem Pneumática</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Secagem a 70°C para descolar a película protetora marrom, deixando a amêndoa branca intacta.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Padrões Internacionais W1 a W4
            </h3>
            <p className="text-xs text-slate-400">
              Contagem de amêndoas inteiras por libra (lb):
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Padrão W1 210/240:</span>
                <span className="font-mono font-bold text-amber-400">Amêndoas Gigantes Premium (Ágio +30%)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Padrão W1 320:</span>
                <span className="font-mono font-bold text-emerald-400">Padrão Mais Comercializado no Mundo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Cajuína */}
      {activeTab === 'cajuina' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-amber-400" />
              Clarificação Enzimática e Caramelização Térmica da Cajuína
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              A cajuína é patrimônio cultural imaterial do Brasil: suco de caju clarificado com gelatina alimentícia para precipitar os taninos adstringentes, seguido de banho-maria em garrafas de vidro onde a frutose carameliza naturalmente em tom âmbar brilhante sem adição de açúcar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Teor de Vitamina C</span>
                <span className="text-2xl font-black text-white font-mono">220 mg / 100g</span>
                <span className="text-[11px] text-amber-400 block">5x superior à laranja</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Grau °Brix Natural</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">11.5°</span>
                <span className="text-[11px] text-slate-400 block">Frutose pura do clone CCP 76</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Vida de Prateleira</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">24 meses</span>
                <span className="text-[11px] text-slate-400 block">Pasteurizada em garrafa de vidro</span>
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
              Parâmetros da Cajucultura
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Área Plantada (ha)</span>
                <span className="font-mono text-amber-400">{areaHa} hectares</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={areaHa}
                onChange={(e) => setAreaHa(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Preço Amêndoa W1 (R$/kg)</span>
                <span className="font-mono text-emerald-400">R$ {precoKgAmendoaW1Reais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="45.0"
                max="95.0"
                step="1.0"
                value={precoKgAmendoaW1Reais}
                onChange={(e) => setPrecoKgAmendoaW1Reais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Preço Garrafa Cajuína (R$/L)</span>
                <span className="font-mono text-white">R$ {precoLitroCajuinaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="8.0"
                max="25.0"
                step="1.0"
                value={precoLitroCajuinaReais}
                onChange={(e) => setPrecoLitroCajuinaReais(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Custo de Manejo e Indústria por Ha</span>
                <span className="font-mono text-rose-400">R$ {custoPorHaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="30000"
                step="500"
                value={custoPorHaReais}
                onChange={(e) => setCustoPorHaReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Demonstrativo Financeiro da Cajucultura Integrada
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Castanhas W1</span>
                <span className="font-mono font-bold text-white text-base">
                  {(metricas.amendoaW1ExportacaoKg / 1000).toFixed(1)} ton
                </span>
                <span className="text-[10px] text-slate-400 block">{rendimentoAmendoaPct}% rendimento</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cajuína Nobre</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {(metricas.cajuinaProduzidaLitros / 1000).toFixed(0)}k L
                </span>
                <span className="text-[10px] text-amber-400/80 block">Zero Açúcar Adicionado</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricas.receitaBrutaTotalReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-slate-400 block">Amêndoa + Suco</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricas.lucroLiquidoReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Venda de Amêndoas de Castanha ({metricas.amendoaW1ExportacaoKg.toLocaleString()} kg @ R$ {precoKgAmendoaW1Reais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-white">
                  R$ {metricas.receitaAmendoaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Venda de Cajuína Clarificada ({metricas.cajuinaProduzidaLitros.toLocaleString()} L @ R$ {precoLitroCajuinaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-amber-400">
                  + R$ {metricas.receitaCajuinaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Custo Total de Manejo do Pomar, Despeliculagem e Pasteurização:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {metricas.custoTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-950/30 px-3 rounded-lg border border-emerald-800/50">
                <span className="text-white">Lucro Líquido Anual Consolidado:</span>
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

export default CajuculturaBeneficiamentoModule;
