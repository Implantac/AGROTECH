import React, { useState, useMemo } from 'react';
import {
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
  Scale,
  ShieldAlert,
  Flame,
  Activity,
  Award
} from 'lucide-react';

interface LoteCordeiros {
  id: string;
  identificacao: string;
  racaPredominante: 'Dorper' | 'Santa Inês' | 'F1 Dorper x Santa Inês' | 'Texel';
  totalAnimais: number;
  diasConfinados: number;
  pesoEntradaKg: number;
  pesoAtualKg: number;
  gmdKgDia: number;
  eccAtual: number; // Escore de Condição Corporal (1 a 5)
  famachaPredominante: 1 | 2 | 3 | 4 | 5;
  statusLote: 'ADAPTACAO' | 'CRESCIMENTO' | 'TERMINACAO_FINAL' | 'PRONTO_ABATE';
}

export const ConfinamentoCordeirosModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lotes' | 'nutricao_dieta' | 'carcaca_cortes' | 'simulador'>('lotes');

  // Lotes em terminação intensiva
  const [lotes, setLotes] = useState<LoteCordeiros[]>([
    {
      id: 'LOTE-CD-01',
      identificacao: 'Baia 01 • Lote Especial Gourmet',
      racaPredominante: 'F1 Dorper x Santa Inês',
      totalAnimais: 450,
      diasConfinados: 48,
      pesoEntradaKg: 19.5,
      pesoAtualKg: 35.2,
      gmdKgDia: 0.327,
      eccAtual: 3.2,
      famachaPredominante: 1,
      statusLote: 'TERMINACAO_FINAL',
    },
    {
      id: 'LOTE-CD-02',
      identificacao: 'Baia 02 • Terminação Rápida Alto Grão',
      racaPredominante: 'Dorper',
      totalAnimais: 400,
      diasConfinados: 62,
      pesoEntradaKg: 20.0,
      pesoAtualKg: 40.8,
      gmdKgDia: 0.335,
      eccAtual: 3.6,
      famachaPredominante: 1,
      statusLote: 'PRONTO_ABATE',
    },
    {
      id: 'LOTE-CD-03',
      identificacao: 'Baia 03 • Desmame Precoce & Adaptação',
      racaPredominante: 'Santa Inês',
      totalAnimais: 350,
      diasConfinados: 12,
      pesoEntradaKg: 18.8,
      pesoAtualKg: 22.4,
      gmdKgDia: 0.300,
      eccAtual: 2.7,
      famachaPredominante: 2,
      statusLote: 'ADAPTACAO',
    },
  ]);

  // Simulador Zootécnico & DRE
  const [totalCabecas, setTotalCabecas] = useState<number>(1200);
  const [pesoEntradaKg, setPesoEntradaKg] = useState<number>(19.5);
  const [pesoMetaAbateKg, setPesoMetaAbateKg] = useState<number>(41.5);
  const [gmdGramas, setGmdGramas] = useState<number>(320);
  const [conversaoAlimentar, setConversaoAlimentar] = useState<number>(3.85);
  const [custoKgMsDieta, setCustoKgMsDieta] = useState<number>(1.65);
  const [precoAquisicaoKgVivo, setPrecoAquisicaoKgVivo] = useState<number>(14.50);
  const [rendimentoCarcacaPct, setRendimentoCarcacaPct] = useState<number>(49.5);
  const [precoKgCarcacaGourmet, setPrecoKgCarcacaGourmet] = useState<number>(38.00);

  // Cálculos do Confinamento
  const metricasConfinamento = useMemo(() => {
    const ganhoPesoCabecaKg = Number((pesoMetaAbateKg - pesoEntradaKg).toFixed(1));
    const gmdKg = gmdGramas / 1000;
    const diasConfinamento = Math.round(ganhoPesoCabecaKg / gmdKg);
    const consumoMsCabecaKg = Number((ganhoPesoCabecaKg * conversaoAlimentar).toFixed(2));

    const custoAlimentarCabeca = Number((consumoMsCabecaKg * custoKgMsDieta).toFixed(2));
    const custoAquisicaoCabeca = Number((pesoEntradaKg * precoAquisicaoKgVivo).toFixed(2));
    const custoSanitarioCabeca = 18.0; // vacinas clostridioses, vermífugo e manejo
    const custoTotalCabeca = Number((custoAquisicaoCabeca + custoAlimentarCabeca + custoSanitarioCabeca).toFixed(2));

    const pesoCarcacaFriaKg = Number((pesoMetaAbateKg * (rendimentoCarcacaPct / 100)).toFixed(2));
    const receitaBrutaCabeca = Number((pesoCarcacaFriaKg * precoKgCarcacaGourmet).toFixed(2));
    const margemLiquidaCabeca = Number((receitaBrutaCabeca - custoTotalCabeca).toFixed(2));
    const margemLiquidaLote = Number((margemLiquidaCabeca * totalCabecas).toFixed(2));
    const receitaTotalLote = Number((receitaBrutaCabeca * totalCabecas).toFixed(2));
    const custoTotalLote = Number((custoTotalCabeca * totalCabecas).toFixed(2));

    return {
      ganhoPesoCabecaKg,
      diasConfinamento,
      consumoMsCabecaKg,
      custoAlimentarCabeca,
      custoAquisicaoCabeca,
      custoTotalCabeca,
      pesoCarcacaFriaKg,
      receitaBrutaCabeca,
      margemLiquidaCabeca,
      margemLiquidaLote,
      receitaTotalLote,
      custoTotalLote,
    };
  }, [totalCabecas, pesoEntradaKg, pesoMetaAbateKg, gmdGramas, conversaoAlimentar, custoKgMsDieta, precoAquisicaoKgVivo, rendimentoCarcacaPct, precoKgCarcacaGourmet]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-950 border border-orange-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-orange-500/20 text-orange-300 border border-orange-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                Módulo 80 • Confinamento de Cordeiros & Dieta Alto Grão
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                NRC Ovinos & Carcaça Gourmet
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🐑 Terminação Intensiva de Cordeiros de Corte
            </h2>
            <p className="text-sm text-slate-900 max-w-3xl leading-relaxed">
              Manejo zootécnico e nutricional de precisão para ovinos: dietas de grão inteiro (15:85 volumoso/concentrado), prevenção de acidose ruminal com tamponantes e monensina, controle seletivo FAMACHA© e tipificação de cortes nobres (French Rack e T-Bone).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Rebanho em Giro</span>
              <span className="text-xl font-black text-orange-400">1.200 cab</span>
              <span className="text-[10px] text-slate-600 block mt-0.5">3 Baias Cobertas</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Margem do Giro</span>
              <span className="text-xl font-black text-emerald-400">R$ 408k</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">R$ 340,02 / cab</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ganho Médio Diário (GMD)</span>
            <Activity className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-white">320 g/dia</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Meta &gt; 300 g/dia (Alto Desempenho)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Conversão Alimentar (CA)</span>
            <Scale className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">3.85 kg MS/kg</div>
          <div className="text-[11px] text-cyan-400 font-medium mt-1">
            Consumo total: 84.7 kg MS / cordeiro
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Rendimento Carcaça (RCQ)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">49.5% (20.54 kg)</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            EGS 3.2 mm • Gordura Cobertura Grau 3
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Período de Confinamento</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">69 dias</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Entrada 19.5 kg ➔ Abate 41.5 kg
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('lotes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'lotes'
              ? 'bg-orange-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          1. Baias & Lotes em Terminação
        </button>

        <button
          onClick={() => setActiveTab('nutricao_dieta')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'nutricao_dieta'
              ? 'bg-orange-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          2. Dieta Alto Grão & Adaptação Ruminal
        </button>

        <button
          onClick={() => setActiveTab('carcaca_cortes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'carcaca_cortes'
              ? 'bg-orange-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          3. Tipificação de Carcaça & Cortes Nobres
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-orange-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Zootécnico & DRE do Giro
        </button>
      </div>

      {/* Conteúdo Aba 1: Baias & Lotes */}
      {activeTab === 'lotes' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Scale className="w-5 h-5 text-orange-400" />
              Acompanhamento Biométrico e Sanitário por Baia
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Monitoramento individual e por lote: pesagens a cada 14 dias em balança digital com RFID, escore corporal (ECC) e avaliação ocular FAMACHA© contra hemoncose.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Baia / Identificação</th>
                    <th className="py-3 px-3">Genética</th>
                    <th className="py-3 px-3">Cabeças</th>
                    <th className="py-3 px-3">Dias Confinado</th>
                    <th className="py-3 px-3">Peso Médio Atual</th>
                    <th className="py-3 px-3">GMD (g/dia)</th>
                    <th className="py-3 px-3">ECC (1 a 5)</th>
                    <th className="py-3 px-3">FAMACHA</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {lotes.map((lote) => (
                    <tr key={lote.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{lote.identificacao}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{lote.id}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded font-bold text-orange-300 bg-orange-950/50 border border-orange-800/50">
                          {lote.racaPredominante}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-900">{lote.totalAnimais} cab</td>
                      <td className="py-3.5 px-3 font-mono text-slate-900">{lote.diasConfinados} dias</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-white">
                        {lote.pesoAtualKg.toFixed(1)} kg
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                        {(lote.gmdKgDia * 1000).toFixed(0)} g/dia
                      </td>
                      <td className="py-3.5 px-3 font-mono text-amber-300 font-bold">
                        {lote.eccAtual.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                          lote.famachaPredominante === 1
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          Grau {lote.famachaPredominante} (Ótimo)
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        {lote.statusLote === 'PRONTO_ABATE' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Pronto para Abate
                          </span>
                        )}
                        {lote.statusLote === 'TERMINACAO_FINAL' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            Terminação Final
                          </span>
                        )}
                        {lote.statusLote === 'ADAPTACAO' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            Fase Adaptação
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Nutrição & Dieta Alto Grão */}
      {activeTab === 'nutricao_dieta' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Protocolo de Alimentação & Dieta Alto Grão
            </h3>
            <p className="text-xs text-slate-600">
              Formulação baseada nas exigências do NRC Ovinos para cordeiros de desmame precoce (16% PB e 78% NDT).
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">Milho Grão Inteiro Seco (ou Quebrado)</span>
                  <span className="text-slate-600">Aporte de amido de fermentação ruminal lenta</span>
                </div>
                <span className="font-mono font-bold text-amber-400 text-sm">68.0%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">Farelo de Soja 46% PB</span>
                  <span className="text-slate-600">Aporte de proteína verdadeira de alto valor biológico</span>
                </div>
                <span className="font-mono font-bold text-amber-400 text-sm">14.0%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">Feno Triturado (Tifton 85 / Coastcross)</span>
                  <span className="text-slate-600">Fibra efetiva (FDNe) para motilidade e ruminação</span>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">15.0%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">Núcleo Peletizado Mineral + Monensina + Bicarbonato</span>
                  <span className="text-slate-600">Tamponante anti-acidose, ionóforo e minerais orgânicos</span>
                </div>
                <span className="font-mono font-bold text-cyan-400 text-sm">3.0%</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Manejo de Transição & Adaptação Ruminal (14 Dias)
            </h3>
            <p className="text-xs text-slate-600">
              Adaptação em degraus para colonização das bactérias amilolíticas sem risco de acidose láctica ou timpanismo.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">Fase 1: Dias 1 ao 5 (Início da Adaptação)</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold">50% Concentrado</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  50% de feno picado + 50% de concentrado. Vacinação preventiva com toxoide de *Clostridium perfringens* tipo D (Enterotoxemia / Doença do Rim Polposo).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">Fase 2: Dias 6 ao 10 (Transição Média)</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">70% Concentrado</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  30% de volumoso + 70% de concentrado. Monitoramento da consistência fecal (escore fecal 3 pastoso a normal).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">Fase 3: Do 11º Dia até o Abate (Dieta Plena)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">85% Concentrado</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  15% de feno + 85% de concentrado alto grão. Fornecimento parcelado em 3 tratos diários para evitar consumo excessivo em binga.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Carcaça & Cortes */}
      {activeTab === 'carcaca_cortes' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-orange-400" />
              Tipificação de Carcaça e Rendimento de Cortes Especiais
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Padrão frigorífico de exportação e açougues boutique: peso de carcaça entre 18 e 22 kg, cobertura de gordura uniforme grau 3 (2,5 a 4,0 mm) sem excesso de gordura pélvico-renal.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-amber-400 block">Carré Francês (French Rack)</span>
                <div className="text-xl font-black text-white">12.5% da carcaça</div>
                <p className="text-[11px] text-slate-600">
                  Corte ícone da alta gastronomia. Cotação média: R$ 85,00 a R$ 110,00/kg fracionado.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-amber-400 block">Pernil Desossado / Inteiro</span>
                <div className="text-xl font-black text-white">33.5% da carcaça</div>
                <p className="text-[11px] text-slate-600">
                  Principal corte em massa muscular magra. Cotação média: R$ 48,00 a R$ 56,00/kg.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-amber-400 block">Paleta Especial com Osso</span>
                <div className="text-xl font-black text-white">19.0% da carcaça</div>
                <p className="text-[11px] text-slate-600">
                  Maciez e sabor característico de animais jovens (&lt; 5 meses). Cotação: R$ 44,00 a R$ 52,00/kg.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-amber-400 block">T-Bone & Costela Prime</span>
                <div className="text-xl font-black text-white">18.0% da carcaça</div>
                <p className="text-[11px] text-slate-600">
                  Lombo com contrafilé e filé mignon ovino. Cotação: R$ 75,00 a R$ 90,00/kg.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador Zootécnico & DRE */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-orange-400" />
              Parâmetros Zootécnicos do Lote
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Número de Cabeças</span>
                <span className="font-mono text-orange-400">{totalCabecas} ovinos</span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="50"
                value={totalCabecas}
                onChange={(e) => setTotalCabecas(Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Peso de Entrada (Desmame)</span>
                <span className="font-mono text-orange-400">{pesoEntradaKg.toFixed(1)} kg vivo</span>
              </div>
              <input
                type="range"
                min="15.0"
                max="25.0"
                step="0.5"
                value={pesoEntradaKg}
                onChange={(e) => setPesoEntradaKg(Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Peso Meta de Abate</span>
                <span className="font-mono text-orange-400">{pesoMetaAbateKg.toFixed(1)} kg vivo</span>
              </div>
              <input
                type="range"
                min="34.0"
                max="48.0"
                step="0.5"
                value={pesoMetaAbateKg}
                onChange={(e) => setPesoMetaAbateKg(Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>GMD Meta (Ganho Diário)</span>
                <span className="font-mono text-emerald-400">{gmdGramas} g/dia</span>
              </div>
              <input
                type="range"
                min="220"
                max="420"
                step="10"
                value={gmdGramas}
                onChange={(e) => setGmdGramas(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Conversão Alimentar (MS/Ganho)</span>
                <span className="font-mono text-cyan-400">{conversaoAlimentar.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="5.5"
                step="0.05"
                value={conversaoAlimentar}
                onChange={(e) => setConversaoAlimentar(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Custo Dieta (R$ / kg MS)</span>
                <span className="font-mono text-amber-400">R$ {custoKgMsDieta.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.10"
                max="2.50"
                step="0.05"
                value={custoKgMsDieta}
                onChange={(e) => setCustoKgMsDieta(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Cotação Carcaça Gourmet</span>
                <span className="font-mono text-emerald-400">R$ {precoKgCarcacaGourmet.toFixed(2)} / kg</span>
              </div>
              <input
                type="range"
                min="28.00"
                max="48.00"
                step="0.50"
                value={precoKgCarcacaGourmet}
                onChange={(e) => setPrecoKgCarcacaGourmet(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              DRE Zootécnica & Margem do Confinamento
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Dias no Cocho</span>
                <span className="font-mono font-bold text-white text-base">
                  {metricasConfinamento.diasConfinamento} dias
                </span>
                <span className="text-[10px] text-slate-600 block">Giro Rápido</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Peso Carcaça</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {metricasConfinamento.pesoCarcacaFriaKg} kg
                </span>
                <span className="text-[10px] text-amber-400/80 block">{rendimentoCarcacaPct}% RCQ</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Receita Bruta/Cab</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {metricasConfinamento.receitaBrutaCabeca.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-600 block">Frigorífico Gourmet</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Lucro Líquido Lote</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {metricasConfinamento.margemLiquidaLote.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{totalCabecas} cordeiros</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Preço Compra Cordeiro Magro ({pesoEntradaKg} kg @ R$ {precoAquisicaoKgVivo.toFixed(2)}/kg):</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {metricasConfinamento.custoAquisicaoCabeca.toFixed(2)} / cab
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custo Alimentação Alto Grão ({metricasConfinamento.consumoMsCabecaKg} kg MS):</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {metricasConfinamento.custoAlimentarCabeca.toFixed(2)} / cab
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custo Sanitário & Manejo (Vacinas Clostridioses e Vermífugo):</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ 18,00 / cab
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custo Total de Produção por Cabeça:</span>
                <span className="font-mono font-bold text-slate-900">
                  R$ {metricasConfinamento.custoTotalCabeca.toFixed(2)} / cab
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-950/30 px-3 rounded-lg border border-emerald-800/50">
                <span className="text-white">Margem Líquida por Cordeiro Acabado:</span>
                <span className="font-mono text-emerald-300">
                  R$ {metricasConfinamento.margemLiquidaCabeca.toFixed(2)} / animal
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfinamentoCordeirosModule;
