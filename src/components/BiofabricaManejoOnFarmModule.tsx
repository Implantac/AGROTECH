import React, { useState } from 'react';
import {
  Dna,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Calculator,
  Layers
} from 'lucide-react';

interface LoteBiorreator {
  id: string;
  agenteBiologico: string;
  cepaRegistro: string;
  alvoPragaDoenca: string;
  volumeLoteL: number;
  dataFermentacao: string;
  tempoIncubacaoHoras: number;
  statusLote: 'FERMENTANDO' | 'LIBERADO_APLICACAO' | 'QUARENTENA_CONTAMINADO';
  temperaturaC: number;
  phAtual: number;
  contagemUfcMl: number; // ex: 2.5e9 = 2,5 bilhões de UFC/mL
  custoTotalLoteRs: number;
}

const LOTES_BIORREATOR_INICIAIS: LoteBiorreator[] = [
  {
    id: 'BIO-2026-081',
    agenteBiologico: 'Bacillus thuringiensis',
    cepaRegistro: 'Bt Kurstaki HD-1',
    alvoPragaDoenca: 'Lagarta Falsa-Medideira & Helicoverpa',
    volumeLoteL: 3000,
    dataFermentacao: '01/10/2026',
    tempoIncubacaoHoras: 48,
    statusLote: 'LIBERADO_APLICACAO',
    temperaturaC: 28.5,
    phAtual: 7.1,
    contagemUfcMl: 3.2e9,
    custoTotalLoteRs: 1850.00, // Custo de insumos + energia + inoculo
  },
  {
    id: 'BIO-2026-082',
    agenteBiologico: 'Trichoderma harzianum',
    cepaRegistro: 'Th ESALQ 1306',
    alvoPragaDoenca: 'Mofo Branco (Sclerotinia) & Podridão Radicular',
    volumeLoteL: 2000,
    dataFermentacao: '03/10/2026',
    tempoIncubacaoHoras: 72,
    statusLote: 'LIBERADO_APLICACAO',
    temperaturaC: 26.8,
    phAtual: 6.8,
    contagemUfcMl: 1.8e9,
    custoTotalLoteRs: 1420.00,
  },
  {
    id: 'BIO-2026-083',
    agenteBiologico: 'Beauveria bassiana',
    cepaRegistro: 'Bb IBCB 66',
    alvoPragaDoenca: 'Mosca-Branca & Percevejo Marrom',
    volumeLoteL: 4000,
    dataFermentacao: '04/10/2026',
    tempoIncubacaoHoras: 24,
    statusLote: 'FERMENTANDO',
    temperaturaC: 27.2,
    phAtual: 6.9,
    contagemUfcMl: 8.5e8,
    custoTotalLoteRs: 2200.00,
  },
];

export const BiofabricaManejoOnFarmModule: React.FC = () => {
  const [lotes] = useState<LoteBiorreator[]>(LOTES_BIORREATOR_INICIAIS);
  const [loteSelecionado, setLoteSelecionado] = useState<LoteBiorreator>(LOTES_BIORREATOR_INICIAIS[0]);

  // Simulador de Economia On-Farm vs Químico
  const [doseCampoLitrosHa, setDoseCampoLitrosHa] = useState<number>(1.5);
  const [areaTotalAplicarHa, setAreaTotalAplicarHa] = useState<number>(1200);
  const [custoDefensivoQuimicoHa, setCustoDefensivoQuimicoHa] = useState<number>(85.0); // R$/ha defensivo químico de mercado

  // Cálculos de Produção
  const custoLitroRs = loteSelecionado.custoTotalLoteRs / loteSelecionado.volumeLoteL;
  const custoBioPorHa = custoLitroRs * doseCampoLitrosHa;
  const custoBioTotal = custoBioPorHa * areaTotalAplicarHa;
  const custoQuimicoTotal = custoDefensivoQuimicoHa * areaTotalAplicarHa;
  const economiaFinanceiraRs = custoQuimicoTotal - custoBioTotal;
  const percentualEconomia = Number(((economiaFinanceiraRs / custoQuimicoTotal) * 100).toFixed(1));

  // Formatação UFC
  const ufcFormatada = `${(loteSelecionado.contagemUfcMl / 1e9).toFixed(1)} x 10⁹ UFC/mL`;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
              <Dna className="w-6 h-6 text-emerald-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Biofábrica On-Farm & Multiplicação Biológica
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  Manejo Regenerativo
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Biorreatores automatizados, multiplicação de Bacillus/Trichoderma, controle de pureza UFC e redução drástica de custos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laudo de Pureza e Viabilidade Microbiológica exportado para auditoria do MAPA!')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              Laudo MAPA
            </button>
            <div className="text-right pl-4 border-l border-slate-200 hidden sm:block">
              <div className="text-[11px] text-slate-500">Economia no Ciclo</div>
              <div className="text-lg font-bold text-emerald-700">{percentualEconomia}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Custo de Produção On-Farm</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            R$ {custoLitroRs.toFixed(3)} <span className="text-sm font-normal text-slate-400">/litro</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            R$ {custoBioPorHa.toFixed(2)}/ha ({doseCampoLitrosHa} L/ha na calda)
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Viabilidade Biológica (UFC)</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {ufcFormatada}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Exigência MAPA: &ge; 1.0 &times; 10⁹ UFC/mL
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Economia vs Químico Comercial</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            R$ {economiaFinanceiraRs.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Economia de {percentualEconomia}% em {areaTotalAplicarHa.toLocaleString('pt-BR')} ha
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Status do Biorreator</div>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                loteSelecionado.statusLote === 'LIBERADO_APLICACAO'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
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
          <div className="text-xs text-slate-500 mt-1 truncate">
            {loteSelecionado.agenteBiologico} ({loteSelecionado.temperaturaC}°C | pH {loteSelecionado.phAtual})
          </div>
        </div>
      </div>

      {/* Main Content Grid: Biorreatores vs Calculadora */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Lotes nos Biorreatores (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Biorreatores & Lotes em Multiplicação
                </h2>
              </div>
              <span className="text-xs text-slate-500">Tanques Inox 316L Sanitários</span>
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
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                          <Dna className="w-4 h-4 text-emerald-700" />
                          {lote.agenteBiologico}
                          <span className="text-xs text-slate-500 font-normal">({lote.cepaRegistro})</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Alvo: <span className="text-slate-700 font-medium">{lote.alvoPragaDoenca}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Volume</div>
                          <div className="text-sm font-bold text-slate-900">{lote.volumeLoteL.toLocaleString('pt-BR')} L</div>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                            lote.statusLote === 'LIBERADO_APLICACAO'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
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
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Telemetria do Biorreator: {loteSelecionado.agenteBiologico}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Temperatura</div>
                  <div className="text-lg font-bold text-emerald-700 mt-1">
                    {loteSelecionado.temperaturaC}°C
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Faixa: 28.0 - 30.0°C</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">pH Meio</div>
                  <div className="text-lg font-bold text-emerald-700 mt-1">
                    {loteSelecionado.phAtual}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Faixa: 6.8 - 7.2</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Tempo Incubação</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {loteSelecionado.tempoIncubacaoHoras}h
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Início: {loteSelecionado.dataFermentacao}</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Custo Total Lote</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    R$ {loteSelecionado.custoTotalLoteRs.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Inóculo + Melaço + Energia</div>
                </div>
              </div>

              <div className="p-3 bg-white border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-slate-600">
                    Controle de pureza: <strong>Zero contaminação</strong> por coliformes ou fungos oportunistas.
                  </span>
                </div>
                <span className="text-emerald-700 font-semibold">{ufcFormatada}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Comparativo Econômico & Simulador de Custo (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Simulador de Economia On-Farm
                </h2>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                ROI Imediato
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Compare o desembolso da calda biológica produzida na fazenda versus a compra de fungicidas/inseticidas químicos no mercado.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Dose de Campo Recomendada (L/ha)</label>
                <input
                  type="number"
                  step="0.5"
                  value={doseCampoLitrosHa}
                  onChange={(e) => setDoseCampoLitrosHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Área Total a Pulverizar (ha)</label>
                <input
                  type="number"
                  step="100"
                  value={areaTotalAplicarHa}
                  onChange={(e) => setAreaTotalAplicarHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Preço Químico Comercial Equivalente (R$/ha)</label>
                <input
                  type="number"
                  step="5"
                  value={custoDefensivoQuimicoHa}
                  onChange={(e) => setCustoDefensivoQuimicoHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Financial Comparison Summary Box */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Desembolso Químico Comercial:</span>
                <span className="text-rose-700 font-semibold line-through">
                  R$ {custoQuimicoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Custo Total Biofábrica On-Farm:</span>
                <span className="text-emerald-700 font-bold">
                  R$ {custoBioTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-900">Economia Líquida Gerada:</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-700">
                    R$ {economiaFinanceiraRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">
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
export default BiofabricaManejoOnFarmModule;
