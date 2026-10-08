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
  Milk,
  Scale
} from 'lucide-react';

interface LoteBufalas {
  id: string;
  identificacao: string;
  raca: 'Murrah' | 'Mediterrâneo' | 'Jafarabadi';
  totalCabecas: number;
  diasEmLactacaoMedio: number;
  producaoMediaLitrosDia: number;
  teorGorduraPct: number;
  teorProteinaPct: number;
  escoreCorporal: number;
  statusManejo: 'LACTACAO_PLENA' | 'PRE-PARTO' | 'REPRODUCAO_PASTO';
}

export const BubalinoculturaQueijoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rebanho' | 'qualidade_leite' | 'laticinio_produtos' | 'simulador'>('rebanho');

  // Lotes do Rebanho Bubalino
  const [lotes] = useState<LoteBufalas[]>([
    {
      id: 'LOTE-BUF-01',
      identificacao: 'Lote 01 • Primíparas Murrah Alta Genética',
      raca: 'Murrah',
      totalCabecas: 25,
      diasEmLactacaoMedio: 120,
      producaoMediaLitrosDia: 11.2,
      teorGorduraPct: 7.9,
      teorProteinaPct: 4.5,
      escoreCorporal: 3.5,
      statusManejo: 'LACTACAO_PLENA',
    },
    {
      id: 'LOTE-BUF-02',
      identificacao: 'Lote 02 • Multíparas Mediterrâneo Especial',
      raca: 'Mediterrâneo',
      totalCabecas: 35,
      diasEmLactacaoMedio: 180,
      producaoMediaLitrosDia: 10.0,
      teorGorduraPct: 7.7,
      teorProteinaPct: 4.3,
      escoreCorporal: 3.6,
      statusManejo: 'LACTACAO_PLENA',
    },
  ]);

  // Simulador Agroindustrial
  const [totalBufalas, setTotalBufalas] = useState<number>(60);
  const [producaoMediaLitros, setProducaoMediaLitros] = useState<number>(10.5);
  const [diasLactacao, setDiasLactacao] = useState<number>(270);
  const [litrosPorKgQueijo, setLitrosPorKgQueijo] = useState<number>(5.2);
  const [precoKgQueijoReais, setPrecoKgQueijoReais] = useState<number>(68.0);
  const [custoManejoDiaPorCabeca, setCustoManejoDiaPorCabeca] = useState<number>(16.5);
  const [custoProcessamentoKgQueijo, setCustoProcessamentoKgQueijo] = useState<number>(12.0);

  // Cálculos do Módulo
  const metricasBubalinas = useMemo(() => {
    const producaoDiariaLitros = Number((totalBufalas * producaoMediaLitros).toFixed(1));
    const producaoLactacaoLitros = Math.round(producaoDiariaLitros * diasLactacao);
    const producaoQueijoKg = Math.round(producaoLactacaoLitros / (litrosPorKgQueijo || 1));

    const receitaTotalQueijo = Number((producaoQueijoKg * precoKgQueijoReais).toFixed(2));
    const custoManejoTotal = Number((totalBufalas * custoManejoDiaPorCabeca * diasLactacao).toFixed(2));
    const custoProcessamentoTotal = Number((producaoQueijoKg * custoProcessamentoKgQueijo).toFixed(2));
    const custoTotalAgroindustrial = Number((custoManejoTotal + custoProcessamentoTotal).toFixed(2));
    const lucroLiquidoAgroindustria = Number((receitaTotalQueijo - custoTotalAgroindustrial).toFixed(2));
    const margemPorLitroEquivalente = Number((lucroLiquidoAgroindustria / (producaoLactacaoLitros || 1)).toFixed(2));

    return {
      producaoDiariaLitros,
      producaoLactacaoLitros,
      producaoQueijoKg,
      receitaTotalQueijo,
      custoManejoTotal,
      custoProcessamentoTotal,
      custoTotalAgroindustrial,
      lucroLiquidoAgroindustria,
      margemPorLitroEquivalente,
    };
  }, [totalBufalas, producaoMediaLitros, diasLactacao, litrosPorKgQueijo, precoKgQueijoReais, custoManejoDiaPorCabeca, custoProcessamentoKgQueijo]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-950 border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Milk className="w-3.5 h-3.5" />
                Módulo 84 • Bubalinocultura & Derivados Lácteos A2A2
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 rounded-full">
                Mozzarella di Bufala • 100% Caseína A2
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              🧀 Bubalinocultura Leiteira & Laticínio Gourmet On-Farm
            </h2>
            <p className="text-sm text-slate-900 max-w-3xl leading-relaxed">
              Zootecnia e agroindústria de búfalas leiteiras (Murrah e Mediterrâneo): leite super concentrado (7,8% gordura, 4,4% proteína), rendimento queijeiro de 5,2 L/kg de mozzarella, alta rusticidade em pastagens de várzea e perfil genético naturalmente A2A2.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Búfalas Ordenha</span>
              <span className="text-xl font-black text-blue-700">60 fêmeas</span>
              <span className="text-[10px] text-slate-600 block mt-0.5">630 L/dia</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Lucro Líquido Anual</span>
              <span className="text-xl font-black text-emerald-700">R$ 1,56M</span>
              <span className="text-[10px] text-emerald-700/80 block mt-0.5">R$ 9,20 / Litro Eq.</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Rendimento Queijeiro</span>
            <Scale className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">5.2 Litros / kg</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            2x mais eficiente que leite de vaca (10 L/kg)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Teor de Sólidos Nobres</span>
            <Milk className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-black text-blue-700">7.8% Gord • 4.4% Prot</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            18.5% Sólidos Totais • Textura Cremosa
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Genética de Caseína</span>
            <ShieldCheck className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black text-sky-700">100% A2A2 Puro</div>
          <div className="text-[11px] text-sky-700/80 font-medium mt-1">
            Sem Beta-Caseína A1 • Digestibilidade Total
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Produção Queijo Safra</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-700">32.712 kg</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Mozzarella, Burrata & Bocconcini
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('rebanho')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'rebanho'
              ? 'bg-blue-50 text-blue-800 border border-blue-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Milk className="w-4 h-4" />
          1. Rebanho & Zootecnia Bubalina
        </button>

        <button
          onClick={() => setActiveTab('qualidade_leite')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'qualidade_leite'
              ? 'bg-blue-50 text-blue-800 border border-blue-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Scale className="w-4 h-4" />
          2. Comparativo Bromatológico & A2A2
        </button>

        <button
          onClick={() => setActiveTab('laticinio_produtos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'laticinio_produtos'
              ? 'bg-blue-50 text-blue-800 border border-blue-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Award className="w-4 h-4" />
          3. Linha de Queijos & Filagem
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-blue-50 text-blue-800 border border-blue-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Agroindustrial
        </button>
      </div>

      {/* Conteúdo Aba 1: Rebanho */}
      {activeTab === 'rebanho' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Milk className="w-5 h-5 text-blue-700" />
              Lotes de Búfalas em Lactação (Murrah e Mediterrâneo)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              As búfalas apresentam longevidade reprodutiva excepcional (mais de 15 a 18 anos produtivas), alta conversão alimentar de gramíneas tropicais fibrosas e baixíssima incidência de mastite clínica (&lt; 1.5%).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Lote / Identificação</th>
                    <th className="py-3 px-3">Raça</th>
                    <th className="py-3 px-3">Búfalas</th>
                    <th className="py-3 px-3">DEL Médio</th>
                    <th className="py-3 px-3">Produção Diária</th>
                    <th className="py-3 px-3">Gordura (%)</th>
                    <th className="py-3 px-3">Proteína (%)</th>
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
                      <td className="py-3.5 px-3 font-bold text-blue-300">{l.raca}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-900">{l.totalCabecas} fêmeas</td>
                      <td className="py-3.5 px-3 font-mono text-slate-900">{l.diasEmLactacaoMedio} dias</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                        {l.producaoMediaLitrosDia.toFixed(1)} L/dia
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-amber-700">{l.teorGorduraPct}%</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-sky-700">{l.teorProteinaPct}%</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30">
                          {l.statusManejo}
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

      {/* Conteúdo Aba 2: Comparativo Bromatológico */}
      {activeTab === 'qualidade_leite' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-700" />
              Comparativo Bromatológico: Búfala vs Vaca
            </h3>
            <p className="text-xs text-slate-600">
              O leite de búfala é um concentrado natural de nutrientes. A cor perolada se deve à conversão completa do betacaroteno em Vitamina A pura na glândula mamária.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Gordura Láctea:</span>
                <div className="flex gap-4 font-mono font-bold">
                  <span className="text-blue-700">Búfala: 7.8%</span>
                  <span className="text-slate-500">Vaca: 3.8%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Proteína Bruta:</span>
                <div className="flex gap-4 font-mono font-bold">
                  <span className="text-blue-700">Búfala: 4.4%</span>
                  <span className="text-slate-500">Vaca: 3.2%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Cálcio Mineral (mg/100g):</span>
                <div className="flex gap-4 font-mono font-bold">
                  <span className="text-blue-700">Búfala: 195 mg</span>
                  <span className="text-slate-500">Vaca: 120 mg</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Rendimento Mozzarella:</span>
                <div className="flex gap-4 font-mono font-bold">
                  <span className="text-emerald-700">5.2 L / kg queijo</span>
                  <span className="text-slate-500">10.0 L / kg queijo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-700" />
              Selo 100% Caseína A2A2
            </h3>
            <p className="text-xs text-slate-600">
              O leite de búfala é naturalmente livre do peptídeo inflamatório BCM-7 (*beta-casomorfina-7*), sendo indicado para pessoas sensíveis às caseínas convencionais bovinas (A1).
            </p>

            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-200 space-y-2">
              <div className="font-bold flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-sky-700" />
                Vantagem Comercial do Selo A2A2
              </div>
              <p>
                Permite rotulagem premium de fácil digestão, agregação de valor de até 40% nas gôndolas de empórios gourmets e supermercados premium em relação aos queijos bovinos industriais.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Laticínio & Filagem */}
      {activeTab === 'laticinio_produtos' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-700" />
              Portfólio Agroindustrial de Queijos de Massa Filada
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Processamento higiênico on-farm com filagem a quente (80°C a 85°C) que confere elasticidade, umidade e textura úmida típica da autêntica tradição italiana.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-blue-700 block">Mozzarella em Bola na Salmoura</span>
                <div className="text-xl font-black text-white">50% do Volume</div>
                <p className="text-[11px] text-slate-600">
                  Formato tradicional 150g e 250g. Preço médio: R$ 65,00 a R$ 75,00/kg.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-sky-700 block">Burrata com Stracciatella</span>
                <div className="text-xl font-black text-white">25% do Volume</div>
                <p className="text-[11px] text-slate-600">
                  Bolsa de mozzarella recheada com fios de queijo e creme de leite. Preço: R$ 90,00 a R$ 115,00/kg.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-amber-700 block">Bocconcini (Cerejinha)</span>
                <div className="text-xl font-black text-white">15% do Volume</div>
                <p className="text-[11px] text-slate-600">
                  Pequenas esferas de 15g ideais para saladas Caprese e coquetéis. Preço: R$ 70,00 a R$ 80,00/kg.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-emerald-700 block">Ricota Cremosa de Soro</span>
                <div className="text-xl font-black text-white">10% Subproduto</div>
                <p className="text-[11px] text-slate-600">
                  Aproveitamento integral do soro doce da queijaria. Preço: R$ 38,00 a R$ 45,00/kg.
                </p>
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
              <BarChart3 className="w-5 h-5 text-blue-700" />
              Parâmetros da Queijaria & Rebanho
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Búfalas em Lactação</span>
                <span className="font-mono text-blue-700">{totalBufalas} fêmeas</span>
              </div>
              <input
                type="range"
                min="20"
                max="250"
                step="5"
                value={totalBufalas}
                onChange={(e) => setTotalBufalas(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Produção Média / Búfala / Dia</span>
                <span className="font-mono text-blue-700">{producaoMediaLitros.toFixed(1)} L/dia</span>
              </div>
              <input
                type="range"
                min="7.0"
                max="16.0"
                step="0.5"
                value={producaoMediaLitros}
                onChange={(e) => setProducaoMediaLitros(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Rendimento (Litros / kg Queijo)</span>
                <span className="font-mono text-emerald-700">{litrosPorKgQueijo.toFixed(1)} L / kg</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="6.5"
                step="0.1"
                value={litrosPorKgQueijo}
                onChange={(e) => setLitrosPorKgQueijo(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Preço Médio Queijo Gourmet (R$/kg)</span>
                <span className="font-mono text-emerald-700">R$ {precoKgQueijoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="48.0"
                max="95.0"
                step="1.0"
                value={precoKgQueijoReais}
                onChange={(e) => setPrecoKgQueijoReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Custo Diário Manejo / Búfala</span>
                <span className="font-mono text-rose-700">R$ {custoManejoDiaPorCabeca.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="10.0"
                max="26.0"
                step="0.5"
                value={custoManejoDiaPorCabeca}
                onChange={(e) => setCustoManejoDiaPorCabeca(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              DRE Agroindustrial Anual do Laticínio
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Volume de Leite</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {(metricasBubalinas.producaoLactacaoLitros / 1000).toFixed(1)}k L
                </span>
                <span className="text-[10px] text-slate-600 block">{diasLactacao} dias lactação</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Queijo Produzido</span>
                <span className="font-mono font-bold text-blue-700 text-base">
                  {(metricasBubalinas.producaoQueijoKg / 1000).toFixed(1)} ton
                </span>
                <span className="text-[10px] text-blue-700/80 block">{litrosPorKgQueijo} L/kg</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Faturamento Bruto</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  R$ {(metricasBubalinas.receitaTotalQueijo / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-slate-600 block">Linha Artesanal</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Lucro Líquido Anual</span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  R$ {(metricasBubalinas.lucroLiquidoAgroindustria / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-emerald-700/80 block">Alta Rentabilidade</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Receita Venda de Queijos ({metricasBubalinas.producaoQueijoKg.toLocaleString()} kg @ R$ {precoKgQueijoReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-emerald-700">
                  R$ {metricasBubalinas.receitaTotalQueijo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custo Total de Manejo & Alimentação do Rebanho:</span>
                <span className="font-mono font-bold text-rose-700">
                  - R$ {metricasBubalinas.custoManejoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custo de Processamento, Filagem e Embalagens:</span>
                <span className="font-mono font-bold text-rose-700">
                  - R$ {metricasBubalinas.custoProcessamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-50 px-3 rounded-lg border border-emerald-200">
                <span className="text-white">Margem Líquida por Litro de Leite Equivalente:</span>
                <span className="font-mono text-emerald-800">
                  R$ {metricasBubalinas.margemPorLitroEquivalente.toFixed(2)} / Litro
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BubalinoculturaQueijoModule;
