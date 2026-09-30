import React, { useState } from 'react';
import {
  Dna,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  Download,
  Filter,
  Layers,
  TrendingDown,
  ChevronRight,
  RefreshCw,
  Clock
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

interface LoteBiofabrica {
  id: string;
  agenteBiologico: string;
  cepaRegistro: string;
  alvoPragaDoenca: string;
  volumeLoteL: number;
  dataFermentacao: string;
  tempoIncubacaoHoras: number;
  temperaturaC: number;
  phAtual: number;
  contagemUfcMl: number; // ex: 2.4e9
  custoTotalLoteRs: number;
  statusLote: 'LIBERADO_APLICACAO' | 'EM_FERMENTACAO' | 'QUARENTENA_CONTAMINACAO';
}

const LOTES_INICIAIS: LoteBiofabrica[] = [
  {
    id: 'bio-01',
    agenteBiologico: 'Bacillus subtilis',
    cepaRegistro: 'Cepa BV-02 (Certificada MAPA)',
    alvoPragaDoenca: 'Antracnose, Mancha Alvo & Mofo Branco',
    volumeLoteL: 5000,
    dataFermentacao: '2026-09-26',
    tempoIncubacaoHoras: 48,
    temperaturaC: 29.2,
    phAtual: 7.1,
    contagemUfcMl: 2.4e9,
    custoTotalLoteRs: 2670.0,
    statusLote: 'LIBERADO_APLICACAO',
  },
  {
    id: 'bio-02',
    agenteBiologico: 'Trichoderma harzianum',
    cepaRegistro: 'Cepa ESALQ-1306',
    alvoPragaDoenca: 'Nematoides das Galhas e Cisto (Heterodera)',
    volumeLoteL: 3000,
    dataFermentacao: '2026-09-27',
    tempoIncubacaoHoras: 72,
    temperaturaC: 28.5,
    phAtual: 6.8,
    contagemUfcMl: 1.8e9,
    custoTotalLoteRs: 1950.0,
    statusLote: 'LIBERADO_APLICACAO',
  },
  {
    id: 'bio-03',
    agenteBiologico: 'Beauveria bassiana',
    cepaRegistro: 'Cepa IBCB-66',
    alvoPragaDoenca: 'Mosca-branca (Bemisia tabaci) e Cigarrinha',
    volumeLoteL: 4000,
    dataFermentacao: '2026-09-28',
    tempoIncubacaoHoras: 24,
    temperaturaC: 28.0,
    phAtual: 6.9,
    contagemUfcMl: 8.5e8,
    custoTotalLoteRs: 2200.0,
    statusLote: 'EM_FERMENTACAO',
  },
];

export const BiofabricaManejoOnFarmModule: React.FC = () => {
  const [lotes] = useState<LoteBiofabrica[]>(LOTES_INICIAIS);
  const [loteSelecionado, setLoteSelecionado] = useState<LoteBiofabrica>(LOTES_INICIAIS[0]);

  // Simulador de Economia Financeira On-Farm vs Químico Comercial
  const [doseCampoLitrosHa, setDoseCampoLitrosHa] = useState<number>(2.0);
  const [areaTotalAplicarHa, setAreaTotalAplicarHa] = useState<number>(2500);
  const [custoDefensivoQuimicoHa, setCustoDefensivoQuimicoHa] = useState<number>(68.0); // R$/ha produto comercial

  // Cálculos Técnicos do Lote
  const custoLitroRs = Number((loteSelecionado.custoTotalLoteRs / loteSelecionado.volumeLoteL).toFixed(3));
  const custoBioPorHa = Number((custoLitroRs * doseCampoLitrosHa).toFixed(2));
  const custoBioTotal = custoBioPorHa * areaTotalAplicarHa;
  const custoQuimicoTotal = custoDefensivoQuimicoHa * areaTotalAplicarHa;
  const economiaFinanceiraRs = Number((custoQuimicoTotal - custoBioTotal).toFixed(2));
  const percentualEconomia = Number(((economiaFinanceiraRs / custoQuimicoTotal) * 100).toFixed(1));

  const ufcFormatada = (loteSelecionado.contagemUfcMl / 1e9).toFixed(1) + ' × 10⁹ UFC/mL';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-950 border border-emerald-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl">
                <Dna className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Biofábrica On-Farm & Multiplicação Biológica
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Manejo Regenerativo
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Biorreatores automatizados, multiplicação de Bacillus/Trichoderma, controle de pureza UFC e redução drástica de custos.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laudo de Pureza e Viabilidade Microbiológica exportado para auditoria do MAPA!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 rounded-xl text-sm font-medium transition shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Laudo MAPA
            </button>
            <div className="text-right pl-4 border-l border-emerald-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Economia no Ciclo</div>
              <div className="text-xl font-bold text-emerald-300">{percentualEconomia}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Custo de Produção On-Farm</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            R$ {custoLitroRs.toFixed(3)} <span className="text-sm font-normal text-stone-400">/litro</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            R$ {custoBioPorHa.toFixed(2)}/ha ({doseCampoLitrosHa} L/ha na calda)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Viabilidade Biológica (UFC)</div>
          <div className="text-2xl font-bold text-teal-300 mt-1">
            {ufcFormatada}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Exigência MAPA: &ge; 1.0 &times; 10⁹ UFC/mL
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Economia vs Químico Comercial</div>
          <div className="text-2xl font-bold text-white mt-1">
            R$ {economiaFinanceiraRs.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-400 mt-1">
            Economia de {percentualEconomia}% em {areaTotalAplicarHa.toLocaleString('pt-BR')} ha
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Status do Biorreator</div>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                loteSelecionado.statusLote === 'LIBERADO_APLICACAO'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {loteSelecionado.statusLote === 'LIBERADO_APLICACAO' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  APROVADO & LIBERADO
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  FERMENTANDO (48h)
                </>
              )}
            </span>
          </div>
          <div className="text-xs text-stone-500 mt-1 truncate">
            {loteSelecionado.agenteBiologico} ({loteSelecionado.temperaturaC}°C | pH {loteSelecionado.phAtual})
          </div>
        </div>
      </div>

      {/* Main Content Grid: Biorreatores vs Calculadora */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Lotes nos Biorreatores (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Biorreatores & Lotes em Multiplicação
                </h2>
              </div>
              <span className="text-xs text-stone-400">Tanques Inox 316L Sanitários</span>
            </div>

            {/* List of Batch Fermenters */}
            <div className="space-y-3 mb-6">
              {lotes.map((lote) => {
                const isSelected = lote.id === loteSelecionado.id;
                return (
                  <div
                    key={lote.id}
                    onClick={() => setLoteSelecionado(lote)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          <Dna className="w-4 h-4 text-emerald-400" />
                          {lote.agenteBiologico}
                          <span className="text-xs text-stone-400 font-normal">({lote.cepaRegistro})</span>
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          Alvo: <span className="text-stone-300">{lote.alvoPragaDoenca}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-stone-400">Volume</div>
                          <div className="text-sm font-bold text-white">{lote.volumeLoteL.toLocaleString('pt-BR')} L</div>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                            lote.statusLote === 'LIBERADO_APLICACAO'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {lote.statusLote === 'LIBERADO_APLICACAO' ? 'Liberado' : 'Em Processo'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Telemetry of the Selected Bioreactor */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Telemetria do Biorreator: {loteSelecionado.agenteBiologico}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Temperatura</div>
                  <div className="text-lg font-bold text-emerald-300 mt-1">
                    {loteSelecionado.temperaturaC}°C
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Faixa: 28.0 - 30.0°C</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">pH Meio</div>
                  <div className="text-lg font-bold text-teal-300 mt-1">
                    {loteSelecionado.phAtual}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Faixa: 6.8 - 7.2</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Tempo Incubação</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {loteSelecionado.tempoIncubacaoHoras}h
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Início: {loteSelecionado.dataFermentacao}</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Custo Total Lote</div>
                  <div className="text-lg font-bold text-white mt-1">
                    R$ {loteSelecionado.custoTotalLoteRs.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Inóculo + Melaço + Energia</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-stone-300">
                    Controle de pureza: <strong>Zero contaminação</strong> por coliformes ou fungos oportunistas.
                  </span>
                </div>
                <span className="text-emerald-400 font-semibold">{ufcFormatada}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Comparativo Econômico & Simulador de Custo (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Simulador de Economia On-Farm
                </h2>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
                ROI Imediato
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Compare o desembolso da calda biológica produzida na fazenda versus a compra de fungicidas/inseticidas químicos no mercado.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Dose de Campo Recomendada (L/ha)</label>
                <input
                  type="number"
                  step="0.5"
                  value={doseCampoLitrosHa}
                  onChange={(e) => setDoseCampoLitrosHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Área Total a Pulverizar (ha)</label>
                <input
                  type="number"
                  step="100"
                  value={areaTotalAplicarHa}
                  onChange={(e) => setAreaTotalAplicarHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Preço Químico Comercial Equivalente (R$/ha)</label>
                <input
                  type="number"
                  step="5"
                  value={custoDefensivoQuimicoHa}
                  onChange={(e) => setCustoDefensivoQuimicoHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Financial Comparison Summary Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-400">Desembolso Químico Comercial:</span>
                <span className="text-rose-400 font-semibold line-through">
                  R$ {custoQuimicoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-400">Custo Total Biofábrica On-Farm:</span>
                <span className="text-emerald-400 font-bold">
                  R$ {custoBioTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="text-xs font-semibold text-white">Economia Líquida Gerada:</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-300">
                    R$ {economiaFinanceiraRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-emerald-500">
                    Redução de {percentualEconomia}% no custo de manejo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
