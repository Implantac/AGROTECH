import React, { useState } from 'react';
import {
  Bug,
  AlertTriangle,
  CheckCircle2,
  Download,
  Calculator,
  ShieldCheck,
  TrendingDown,
  Microscope,
  Leaf,
  Coins
} from 'lucide-react';

interface LaudoNematologico {
  id: string;
  talhaoNome: string;
  areaHa: number;
  especiePredominante: string;
  populacao10gRaiz: number;
  populacao200cm3Solo: number;
  limiarCritico10gRaiz: number;
  estagioCultivo: string;
  danoVisualRaiz: string;
  fatorReproducaoFR: number;
}

const LAUDOS_INICIAIS: LaudoNematologico[] = [
  {
    id: 'nem-01',
    talhaoNome: 'Talhão T-02 (Cerrado Alto - Mancha Arenosa)',
    areaHa: 280.0,
    especiePredominante: 'Pratylenchus brachyurus (Nematóide das Lesões)',
    populacao10gRaiz: 1850,
    populacao200cm3Solo: 420,
    limiarCritico10gRaiz: 1000,
    estagioCultivo: 'R1 (Início da Floração da Soja)',
    danoVisualRaiz: 'Necrose severa do córtex radicular e redução de pelos absorventes',
    fatorReproducaoFR: 2.8,
  },
  {
    id: 'nem-02',
    talhaoNome: 'Talhão T-04 (Pivô Sul)',
    areaHa: 130.0,
    especiePredominante: 'Heterodera glycines (Nematóide de Cisto - Raça 3)',
    populacao10gRaiz: 890,
    populacao200cm3Solo: 210,
    limiarCritico10gRaiz: 500,
    estagioCultivo: 'V4 (4º nó com folhas abertas)',
    danoVisualRaiz: 'Fêmeas globosas brancas aderidas às raízes secundárias',
    fatorReproducaoFR: 3.4,
  },
  {
    id: 'nem-03',
    talhaoNome: 'Talhão T-01 (Sede - Solo Argiloso)',
    areaHa: 420.0,
    especiePredominante: 'Meloidogyne javanica (Nematóide das Galhas)',
    populacao10gRaiz: 320,
    populacao200cm3Solo: 90,
    limiarCritico10gRaiz: 800,
    estagioCultivo: 'V3 (Início de Nodulação)',
    danoVisualRaiz: 'Galhas pontuais em baixa densidade',
    fatorReproducaoFR: 0.6,
  },
];

export const NematoidesManejoModule: React.FC = () => {
  const [laudos] = useState<LaudoNematologico[]>(LAUDOS_INICIAIS);
  const [laudoAtivo, setLaudoAtivo] = useState<LaudoNematologico>(LAUDOS_INICIAIS[0]);

  // Simulador de Tratamento com Nematicida Biológico no Sulco / TSI
  const [perdaEstimadaSemControleScHa, setPerdaEstimadaSemControleScHa] = useState<number>(8.5);
  const [custoNematicidaBiolHa, setCustoNematicidaBiolHa] = useState<number>(85.0); // R$ 85,00/ha (Bacillus firmus + Purpureocillium)
  const [precoSacaSoja, setPrecoSacaSoja] = useState<number>(130.0);
  const [eficienciaControlePct, setEficienciaControlePct] = useState<number>(70);

  // Cálculos Financeiros
  const ehCritico = laudoAtivo.populacao10gRaiz >= laudoAtivo.limiarCritico10gRaiz;
  const sacasSalvasHa = Number((perdaEstimadaSemControleScHa * (eficienciaControlePct / 100)).toFixed(2));
  const beneficioFinanceiroHa = Number((sacasSalvasHa * precoSacaSoja).toFixed(2));
  const beneficioLiquidoHa = beneficioFinanceiroHa - custoNematicidaBiolHa;
  const beneficioTotalTalhaoReais = beneficioLiquidoHa * laudoAtivo.areaHa;
  const roiTratamento = Number((beneficioFinanceiroHa / custoNematicidaBiolHa).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-rose-950 via-stone-900 to-slate-950 border border-rose-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl">
                <Bug className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Mapeamento & Manejo Integrado de Nematóides
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                    Fitossanidade & Solo
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Auditoria populacional em raízes (Pratylenchus, Cisto e Galha) e ROI de biológicos no sulco de plantio.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laudo Nematológico Completo emitido com prescrição de Crotalária e Nematicida Biológico!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-rose-950/40"
            >
              <Download className="w-4 h-4" />
              Laudo Nematológico
            </button>
            <div className="text-right pl-4 border-l border-rose-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Benefício Líquido</div>
              <div className="text-xl font-bold text-emerald-300">
                R$ {beneficioTotalTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">População em 10g de Raiz</div>
          <div className={`text-2xl font-bold mt-1 ${ehCritico ? 'text-rose-400' : 'text-emerald-400'}`}>
            {laudoAtivo.populacao10gRaiz.toLocaleString('pt-BR')} <span className="text-sm font-normal text-stone-400">indivíduos</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Limiar de dano econômico: {laudoAtivo.limiarCritico10gRaiz}
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Fator de Reprodução (FR)</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {laudoAtivo.fatorReproducaoFR.toFixed(1)} <span className="text-sm font-normal text-stone-400">FR</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            {laudoAtivo.fatorReproducaoFR > 1.0 ? 'População em Multiplicação Ativa' : 'População em Supressão'}
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Produtividade Salva pelo Biológico</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            +{sacasSalvasHa} <span className="text-sm font-normal text-stone-400">sc/ha</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            R$ {beneficioFinanceiroHa.toFixed(2)}/ha faturados a mais
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Retorno do Investimento (ROI)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {roiTratamento}x <span className="text-sm font-normal text-stone-400">ROI</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Custo R$ {custoNematicidaBiolHa}/ha no sulco de plantio
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Laudo Laboratorial vs Simulador Econômico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Laudo Nematológico por Talhão (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Microscope className="w-5 h-5 text-rose-400" />
                <h2 className="text-lg font-semibold text-white">
                  Laudos Laboratoriais de Nematologia
                </h2>
              </div>
              <span className="text-xs text-stone-400 font-mono">Extração por Flutuação Centrífuga</span>
            </div>

            {/* Selector of Sample Plots */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
              {laudos.map((l) => {
                const isSelected = l.id === laudoAtivo.id;
                const isOverLimit = l.populacao10gRaiz >= l.limiarCritico10gRaiz;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLaudoAtivo(l)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500/80 shadow-md ring-1 ring-rose-500/50'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{l.talhaoNome.split(' - ')[0]}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isOverLimit ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isOverLimit ? 'Crítico' : 'Baixo'}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1 truncate">{l.especiePredominante.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Details Card */}
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400">Espécie de Nematóide Identificada:</span>
                <span className="font-bold text-white">{laudoAtivo.especiePredominante}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400">População em 200 cm³ de Solo:</span>
                <span className="font-mono text-cyan-300 font-bold">{laudoAtivo.populacao200cm3Solo} espécimes</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400">Diagnóstico Visual de Raízes:</span>
                <span className="text-stone-300">{laudoAtivo.danoVisualRaiz}</span>
              </div>

              <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-lg text-stone-300 leading-relaxed text-[11px]">
                <strong className="text-rose-300 block mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Prescrição de Manejo Integrado:
                </strong>
                Recomenda-se a inoculação no sulco de semeadura com consórcio de <strong>Bacillus firmus (1.0 L/ha) + Purpureocillium lilacinum (fungo parasita de ovos)</strong>. Na entressafra, rotacionar com <strong>Crotalaria spectabilis pura (FR &lt; 0.2)</strong> para limpeza biológica do perfil radicular.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Nematicide Treatment Financial Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-rose-400" />
                <h2 className="text-lg font-semibold text-white">
                  Simulador de Proteção de Safra
                </h2>
              </div>
              <span className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded">
                ROI Biológico
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Calcule a produtividade preservada e a receita líquida do controle biológico no sulco de plantio.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Perda Estimada sem Tratamento (sc/ha)</label>
                <input
                  type="number"
                  step="0.5"
                  value={perdaEstimadaSemControleScHa}
                  onChange={(e) => setPerdaEstimadaSemControleScHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Custo do Tratamento Biológico no Sulco (R$/ha)</label>
                <input
                  type="number"
                  step="5"
                  value={custoNematicidaBiolHa}
                  onChange={(e) => setCustoNematicidaBiolHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-stone-400 font-medium">Eficiência do Controle Biológico (%)</label>
                  <span className="text-emerald-400 font-bold">{eficienciaControlePct}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="90"
                  step="5"
                  value={eficienciaControlePct}
                  onChange={(e) => setEficienciaControlePct(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Preço Projetado da Soja (R$/sc)</label>
                <input
                  type="number"
                  step="1"
                  value={precoSacaSoja}
                  onChange={(e) => setPrecoSacaSoja(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-rose-500"
                />
              </div>
            </div>

            {/* Substitution Results Output Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Sacas Preservadas:</span>
                <span className="text-emerald-400 font-bold">+{sacasSalvasHa} sc/ha</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Ganho Bruto por Hectare:</span>
                <span className="text-white font-semibold">R$ {beneficioFinanceiroHa.toFixed(2)} /ha</span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Lucro Líquido Adicional:</span>
                <span className="text-emerald-400 font-bold text-base">
                  R$ {beneficioLiquidoHa.toFixed(2)} /ha
                </span>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-900/40 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Benefício Total no Talhão ({laudoAtivo.areaHa} ha)</div>
                  <div className="text-xl font-black text-white">
                    R$ {beneficioTotalTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <Coins className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
