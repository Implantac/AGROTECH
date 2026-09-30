import React, { useState } from 'react';
import {
  Sparkles,
  Dna,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calculator,
  Leaf,
  ShieldCheck,
  TrendingUp,
  Coins,
  Activity
} from 'lucide-react';

interface InspecaoNodulacao {
  id: string;
  talhaoNome: string;
  estadioFenologico: string;
  nodulosPorPlanta: number;
  corInternaLeghemoglobina: 'ROSEA_VERMELHA_ATIVA' | 'VERDE_BRANCA_INATIVA';
  coInoculacaoAzospirillum: boolean;
  volumeRadicularAumentoPct: number;
  statusNodulacao: 'EXCELENTE' | 'MODERADA' | 'DEFICITARIA';
}

const INSPECOES_INICIAIS: InspecaoNodulacao[] = [
  {
    id: 'fbn-01',
    talhaoNome: 'Talhão T-01 (Sede - 420 ha)',
    estadioFenologico: 'V3 (3º trifólio aberto)',
    nodulosPorPlanta: 19,
    corInternaLeghemoglobina: 'ROSEA_VERMELHA_ATIVA',
    coInoculacaoAzospirillum: true,
    volumeRadicularAumentoPct: 28,
    statusNodulacao: 'EXCELENTE',
  },
  {
    id: 'fbn-02',
    talhaoNome: 'Talhão T-02 (Cerrado Alto - 280 ha)',
    estadioFenologico: 'V4 (4º trifólio aberto)',
    nodulosPorPlanta: 16,
    corInternaLeghemoglobina: 'ROSEA_VERMELHA_ATIVA',
    coInoculacaoAzospirillum: true,
    volumeRadicularAumentoPct: 24,
    statusNodulacao: 'EXCELENTE',
  },
  {
    id: 'fbn-03',
    talhaoNome: 'Talhão T-04 (Pivô Sul - 130 ha)',
    estadioFenologico: 'V3 (Solo com residual químico)',
    nodulosPorPlanta: 8,
    corInternaLeghemoglobina: 'VERDE_BRANCA_INATIVA',
    coInoculacaoAzospirillum: false,
    volumeRadicularAumentoPct: 0,
    statusNodulacao: 'DEFICITARIA',
  },
];

export const FixacaoBiologicaNitrogenioModule: React.FC = () => {
  const [inspecoes] = useState<InspecaoNodulacao[]>(INSPECOES_INICIAIS);
  const [inspecaoAtiva, setInspecaoAtiva] = useState<InspecaoNodulacao>(INSPECOES_INICIAIS[0]);

  // Variáveis para Balanço de Nitrogênio e Economia de Adubação
  const [produtividadeEsperadaScHa, setProdutividadeEsperadaScHa] = useState<number>(72.0);
  const [areaTalhaoHa, setAreaTalhaoHa] = useState<number>(420.0);
  const [taxaContribuicaoFbnPct, setTaxaContribuicaoFbnPct] = useState<number>(85.0); // 85% de FBN
  const [cotacaoUreiaTon, setCotacaoUreiaTon] = useState<number>(3400.0); // R$ 3.400 / t de uréia (45% N)
  const [custoInoculacaoHa, setCustoInoculacaoHa] = useState<number>(22.0); // R$ 22,00 / ha (Bradyrhizobium + Azospirillum)

  // Cálculos Agronômicos de FBN
  // A soja demanda ~4.8 kg de N por saca de 60 kg produzida (80 kg N / ton de grão)
  const demandaTotalNkgHa = Number((produtividadeEsperadaScHa * 4.8).toFixed(1));
  const nFornecidoFbnKgHa = Number((demandaTotalNkgHa * (taxaContribuicaoFbnPct / 100)).toFixed(1));
  
  // Equivalente em Uréia mineral (45% N):
  const ureiaSubstituidaKgHa = Number((nFornecidoFbnKgHa / 0.45).toFixed(1));
  const economiaUreiaReaisHa = Number(((ureiaSubstituidaKgHa / 1000) * cotacaoUreiaTon).toFixed(2));
  const economiaLiquidaHa = economiaUreiaReaisHa - custoInoculacaoHa;

  const economiaTotalTalhaoReais = economiaLiquidaHa * areaTalhaoHa;
  const roiMultiplicador = Number((economiaUreiaReaisHa / custoInoculacaoHa).toFixed(0));

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
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
                    Fixação Biológica de Nitrogênio (FBN) & Co-Inoculação
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Biotecnologia Microbiana
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Auditoria de nodulação radicular (Bradyrhizobium + Azospirillum) e substituição de 100% de adubo nitrogenado mineral.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laudo de Auditoria de FBN e Balanço Nitrogenado gerado!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-950/40"
            >
              <Download className="w-4 h-4" />
              Laudo de Nodulação
            </button>
            <div className="text-right pl-4 border-l border-emerald-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Economia no Talhão</div>
              <div className="text-xl font-bold text-emerald-300">
                R$ {economiaTotalTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">N Biológico Fixado (FBN)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {nFornecidoFbnKgHa} <span className="text-sm font-normal text-stone-400">kg N/ha</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            {taxaContribuicaoFbnPct}% da demanda da soja ({demandaTotalNkgHa} kg N/ha)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Uréia Mineral Substituída</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">
            {ureiaSubstituidaKgHa} <span className="text-sm font-normal text-stone-400">kg/ha</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Equivale a {((ureiaSubstituidaKgHa * areaTalhaoHa) / 1000).toFixed(1)} toneladas poupadas
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Nódulos por Planta ({inspecaoAtiva.estadioFenologico.split(' ')[0]})</div>
          <div className={`text-2xl font-bold mt-1 ${
            inspecaoAtiva.statusNodulacao === 'EXCELENTE' ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {inspecaoAtiva.nodulosPorPlanta} <span className="text-sm font-normal text-stone-400">nódulos</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Meta: &gt; 15 nódulos ativos na coroa
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Retorno sobre o Inoculante</div>
          <div className="text-2xl font-bold text-amber-300 mt-1">
            {roiMultiplicador}x <span className="text-sm font-normal text-stone-400">ROI</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Gasta R$ {custoInoculacaoHa}/ha e economiza R$ {economiaUreiaReaisHa.toFixed(0)}/ha
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Auditoria de Nodulação vs Simulador Econômico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Root Nodulation Audit Table (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Auditoria de Nodulação Radicular em V3 / V4
                </h2>
              </div>
              <span className="text-xs text-stone-400 font-mono">Embrapa Soja</span>
            </div>

            {/* Selector of Talhões */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
              {inspecoes.map((insp) => {
                const isSelected = insp.id === inspecaoAtiva.id;
                return (
                  <button
                    key={insp.id}
                    onClick={() => setInspecaoAtiva(insp)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/50'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{insp.talhaoNome.split(' - ')[0]}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          insp.statusNodulacao === 'EXCELENTE'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {insp.statusNodulacao}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1 truncate">
                      {insp.nodulosPorPlanta} nódulos/pl • {insp.estadioFenologico.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Card for Active Nodulation */}
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-4">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-stone-800">
                <span className="text-stone-400">Atividade da Leg-hemoglobina (Oxigênio e Nitrogenase):</span>
                <span className={`font-bold flex items-center gap-1.5 ${
                  inspecaoAtiva.corInternaLeghemoglobina === 'ROSEA_VERMELHA_ATIVA'
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    inspecaoAtiva.corInternaLeghemoglobina === 'ROSEA_VERMELHA_ATIVA' ? 'bg-rose-500' : 'bg-stone-500'
                  }`} />
                  {inspecaoAtiva.corInternaLeghemoglobina === 'ROSEA_VERMELHA_ATIVA'
                    ? 'Interior Róseo/Vermelho (Fixação Ativa a Pleno Vapor)'
                    : 'Interior Verde/Cinza (Inativo ou Senescente)'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2 border-b border-stone-800">
                <span className="text-stone-400">Co-Inoculação com Azospirillum brasiliense:</span>
                <span className="text-white font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {inspecaoAtiva.coInoculacaoAzospirillum
                    ? `Aplicado no TSI (+${inspecaoAtiva.volumeRadicularAumentoPct}% volume radicular)`
                    : 'Não realizado'}
                </span>
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-lg text-xs text-stone-300">
                <span className="font-semibold text-emerald-300 block mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Efeito Protetivo contra Veranico:
                </span>
                A co-inoculação estimula o desenvolvimento de pêlos absorventes e raízes profundas, aumentando em até <strong>28% o volume de exploração de solo</strong>. Isso retarda o ponto de murcha permanente em períodos de estiagem e eleva a absorção de água e fósforo.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fertilizer Replacement Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Valoração Econômica do N Biológico
                </h2>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
                Economia Real
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Simule o valor financeiro do nitrogênio atmosférico fixado gratuitamente pelas bactérias simbióticas.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Meta de Produtividade do Talhão (sc/ha)</label>
                <input
                  type="number"
                  step="1"
                  value={produtividadeEsperadaScHa}
                  onChange={(e) => setProdutividadeEsperadaScHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Cotação da Uréia Agrícola 45% N (R$/tonelada)</label>
                <input
                  type="number"
                  step="50"
                  value={cotacaoUreiaTon}
                  onChange={(e) => setCotacaoUreiaTon(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Custo Total dos Inoculantes no TSI (R$/ha)</label>
                <input
                  type="number"
                  step="1"
                  value={custoInoculacaoHa}
                  onChange={(e) => setCustoInoculacaoHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Substitution Results Output Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Economia Bruta de Uréia:</span>
                <span className="text-emerald-400 font-bold">
                  R$ {economiaUreiaReaisHa.toFixed(2)} /ha
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Custo do Inoculante:</span>
                <span className="text-stone-300 font-semibold">
                  - R$ {custoInoculacaoHa.toFixed(2)} /ha
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Economia Líquida por Hectare:</span>
                <span className="text-emerald-400 font-bold text-base">
                  R$ {economiaLiquidaHa.toFixed(2)} /ha
                </span>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-900/40 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Economia no Talhão ({areaTalhaoHa} ha)</div>
                  <div className="text-xl font-black text-white">
                    R$ {economiaTotalTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
