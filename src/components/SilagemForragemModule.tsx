import React, { useState } from 'react';
import {
  Wheat,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calculator,
  Layers,
  Sparkles,
  TrendingDown,
  Activity,
  Coins
} from 'lucide-react';

interface SiloAuditado {
  id: string;
  nomeSilo: string;
  tipoCultura: string;
  volumeM3: number;
  materiaSecaColheitaPct: number;
  kpsScorePct: number; // Kernel Processing Score (meta > 70%)
  densidadeMsM3: number; // kg MS / m3 (meta > 220)
  phFermentacao: number; // meta 3.8 - 4.2
  temperaturaMediaC: number;
  tipoTrincheira: string;
}

const SILOS_INICIAIS: SiloAuditado[] = [
  {
    id: 'silo-01',
    nomeSilo: 'Silo Trincheira 01 (Confinamento Principal)',
    tipoCultura: 'Milho Grão Úmido / Planta Inteira (Híbrido DKB 360)',
    volumeM3: 1800.0,
    materiaSecaColheitaPct: 34.0,
    kpsScorePct: 74.0,
    densidadeMsM3: 235.0,
    phFermentacao: 3.9,
    temperaturaMediaC: 26.5,
    tipoTrincheira: 'Trincheira de Concreto com Lona Dupla Face + Barreira de Oxigênio',
  },
  {
    id: 'silo-02',
    nomeSilo: 'Silo Trincheira 02 (Bacia Leiteira / Recria)',
    tipoCultura: 'Milheto + Capim BRS Capiaçu',
    volumeM3: 1200.0,
    materiaSecaColheitaPct: 28.5,
    kpsScorePct: 62.0,
    densidadeMsM3: 185.0,
    phFermentacao: 4.6,
    temperaturaMediaC: 34.0,
    tipoTrincheira: 'Superfície com Lona Simples (Adensamento Insuficiente)',
  },
];

export const SilagemForragemModule: React.FC = () => {
  const [silos] = useState<SiloAuditado[]>(SILOS_INICIAIS);
  const [siloAtivo, setSiloAtivo] = useState<SiloAuditado>(SILOS_INICIAIS[0]);

  const [precoTonMassaVerde, setPrecoTonMassaVerde] = useState<number>(260.0); // R$/t MV

  // Cálculos de Qualidade & Perdas Fermentativas
  const msIdeal = siloAtivo.materiaSecaColheitaPct >= 32.0 && siloAtivo.materiaSecaColheitaPct <= 36.0;
  const kpsIdeal = siloAtivo.kpsScorePct >= 70.0;
  const compactacaoIdeal = siloAtivo.densidadeMsM3 >= 220.0;

  let perdaFermentativaPct = 11.5;
  if (!compactacaoIdeal) perdaFermentativaPct += 8.0;
  if (!msIdeal) perdaFermentativaPct += 5.0;

  // Massa Total Ensilada
  const densidadeMvM3 = siloAtivo.densidadeMsM3 / (siloAtivo.materiaSecaColheitaPct / 100);
  const massaTotalMvTon = Number(((densidadeMvM3 * siloAtivo.volumeM3) / 1000).toFixed(1));
  const valorTotalSiloReais = massaTotalMvTon * precoTonMassaVerde;
  const prejuizoPerdasReais = (valorTotalSiloReais * perdaFermentativaPct) / 100;

  const statusSilagem =
    kpsIdeal && compactacaoIdeal && msIdeal ? 'EXCELENTE_ALTO_AMIDO' : 'ATENCAO_PERDAS_ELEVADAS';

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-slate-950 border border-amber-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl">
                <Wheat className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Qualidade de Silagem, KPS & Compactação de Silo
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                    Nutrição de Ruminantes
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Processamento de grãos (KPS), densidade em kg MS/m³ no silo trincheira e controle de perdas fermentativas.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laudo de Auditoria Bromatológica e Compactação de Silo emitido com sucesso!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-amber-950/40"
            >
              <Download className="w-4 h-4" />
              Laudo Bromatológico
            </button>
            <div className="text-right pl-4 border-l border-amber-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Total Ensilado</div>
              <div className="text-xl font-bold text-amber-300">{massaTotalMvTon.toLocaleString('pt-BR')} ton MV</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Kernel Processing Score (KPS)</div>
          <div className={`text-2xl font-bold mt-1 ${kpsIdeal ? 'text-emerald-400' : 'text-rose-400'}`}>
            {siloAtivo.kpsScorePct}% <span className="text-sm font-normal text-stone-400">processado</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Meta: &gt; 70% (Digestibilidade ruminal máxima do amido)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Densidade de Compactação</div>
          <div className={`text-2xl font-bold mt-1 ${compactacaoIdeal ? 'text-emerald-400' : 'text-rose-400'}`}>
            {siloAtivo.densidadeMsM3} <span className="text-sm font-normal text-stone-400">kg MS/m³</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Equivale a {densidadeMvM3.toFixed(0)} kg MV/m³ (Meta: &gt; 220)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Matéria Seca na Colheita</div>
          <div className={`text-2xl font-bold mt-1 ${msIdeal ? 'text-emerald-400' : 'text-amber-400'}`}>
            {siloAtivo.materiaSecaColheitaPct}% <span className="text-sm font-normal text-stone-400">MS</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Faixa ótima: 32% a 36% (Linha de leite 1/2 a 2/3)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Perda Fermentativa Estimada</div>
          <div className={`text-2xl font-bold mt-1 ${perdaFermentativaPct < 15 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {perdaFermentativaPct}% <span className="text-sm font-normal text-stone-400">de MS</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            pH {siloAtivo.phFermentacao} • Temperatura {siloAtivo.temperaturaMediaC}°C
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Silos Auditados vs Simulador Econômico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Silos Auditados (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">
                  Auditoria de Silos Trincheira
                </h2>
              </div>
              <span className="text-xs text-stone-400 font-mono">Bromatologia & Densidade</span>
            </div>

            {/* Selector of Silos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {silos.map((s) => {
                const isSelected = s.id === siloAtivo.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSiloAtivo(s)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{s.nomeSilo.split(' (')[0]}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300">
                        {s.volumeM3} m³
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1 truncate">{s.tipoCultura.split(' (')[0]}</div>
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Details Card */}
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400">Tipo de Estrutura & Vedação:</span>
                <span className="font-semibold text-white">{siloAtivo.tipoTrincheira}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400">Estabilidade Fermentativa:</span>
                <span className={`font-bold flex items-center gap-1.5 ${
                  siloAtivo.phFermentacao <= 4.2 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {siloAtivo.phFermentacao <= 4.2 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Ácido Lático Predominante (Silagem Estável e Fria)
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Fermentação Butírica / Aquecimento Aeróbio
                    </>
                  )}
                </span>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-stone-300 leading-relaxed text-[11px]">
                <strong className="text-amber-300 block mb-1">Impacto no Desempenho do Gado:</strong>
                O processamento adequado do grão (KPS de {siloAtivo.kpsScorePct}%) quebra o pericarpo rígido, permitindo que as bactérias ruminais digiram até <strong>92% do amido total</strong>, elevando o ganho médio diário (GMD) no confinamento sem necessidade de aumento da proporção de concentrado na dieta.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Silage Valuation & Loss Prevention (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">
                  Valoração do Silo & Prevenção
                </h2>
              </div>
              <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                Economia Forrageira
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Calcule o valor do estoque de alimento volumoso e o impacto financeiro da redução das perdas por oxigênio.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Custo da Tonelada de Matéria Verde (R$/t MV)</label>
                <input
                  type="number"
                  step="10"
                  value={precoTonMassaVerde}
                  onChange={(e) => setPrecoTonMassaVerde(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-amber-500"
                />
              </div>
            </div>

            {/* Substitution Results Output Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Massa Verde Ensilada:</span>
                <span className="text-white font-semibold">{massaTotalMvTon.toLocaleString('pt-BR')} ton</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Valor Total do Estoque:</span>
                <span className="text-amber-300 font-bold">
                  R$ {valorTotalSiloReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Perda Fermentativa ({perdaFermentativaPct}%):</span>
                <span className="text-rose-400 font-bold text-base">
                  R$ {prejuizoPerdasReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-900/40 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Eficiência da Compactação</div>
                  <div className="text-xs text-stone-300 mt-0.5">
                    Atingir 235 kg MS/m³ preserva mais de <strong>R$ 38.000,00</strong> em alimento de alto valor energético.
                  </div>
                </div>
                <Coins className="w-6 h-6 text-emerald-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
