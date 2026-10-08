import React, { useState } from 'react';
import {
  Dna,
  Sprout,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
  Activity,
  Coins,
  Calculator,
} from 'lucide-react';

interface InspecaoNodulacao {
  id: string;
  talhaoNome: string;
  cultivarSoja: string;
  estadioFenologico: string;
  nodulosPorPlanta: number;
  corInternaLeghemoglobina: 'ROSEA_VERMELHA_ATIVA' | 'VERDE_CINZA_INATIVA';
  coInoculacaoAzospirillum: boolean;
  volumeRadicularAumentoPct: number;
  statusNodulacao: 'EXCELENTE' | 'BOM' | 'REGULAR' | 'DEFICIENTE';
}

const INSPECOES_INICIAIS: InspecaoNodulacao[] = [
  {
    id: 'fbn-01',
    talhaoNome: 'Talhão 01 - Sede Norte',
    cultivarSoja: 'TMG 2381 IPRO',
    estadioFenologico: 'V4 (4º Trifólio Aberto)',
    nodulosPorPlanta: 24,
    corInternaLeghemoglobina: 'ROSEA_VERMELHA_ATIVA',
    coInoculacaoAzospirillum: true,
    volumeRadicularAumentoPct: 28,
    statusNodulacao: 'EXCELENTE',
  },
  {
    id: 'fbn-02',
    talhaoNome: 'Talhão 02 - Pivô Central',
    cultivarSoja: 'Brasmax Desafio RR',
    estadioFenologico: 'V3 (3º Trifólio Aberto)',
    nodulosPorPlanta: 19,
    corInternaLeghemoglobina: 'ROSEA_VERMELHA_ATIVA',
    coInoculacaoAzospirillum: true,
    volumeRadicularAumentoPct: 22,
    statusNodulacao: 'EXCELENTE',
  },
  {
    id: 'fbn-03',
    talhaoNome: 'Talhão 05 - Chapadão Baixo',
    cultivarSoja: 'Monsoy 5947 IPRO',
    estadioFenologico: 'V4 (4º Trifólio Aberto)',
    nodulosPorPlanta: 11,
    corInternaLeghemoglobina: 'VERDE_CINZA_INATIVA',
    coInoculacaoAzospirillum: false,
    volumeRadicularAumentoPct: 0,
    statusNodulacao: 'REGULAR',
  },
];

export const FixacaoBiologicaNitrogenioModule: React.FC = () => {
  const [inspecoes] = useState<InspecaoNodulacao[]>(INSPECOES_INICIAIS);
  const [inspecaoAtiva, setInspecaoAtiva] = useState<InspecaoNodulacao>(INSPECOES_INICIAIS[0]);

  // Simulador de Substituição de Adubo Nitrogenado Mineral
  const [produtividadeEsperadaScHa, setProdutividadeEsperadaScHa] = useState<number>(72); // sc/ha
  const [cotacaoUreiaTon, setCotacaoUreiaTon] = useState<number>(3400); // R$/ton de uréia 45% N
  const [custoInoculacaoHa, setCustoInoculacaoHa] = useState<number>(28); // R$/ha inoculante + Azospirillum
  const areaTalhaoHa = 420;

  // Cálculos de Demanda e Fixação Embrapa Soja
  // 1 saca de soja (60kg) necessita de ~4.8 a 5.0 kg de N elementar absorvido
  const kgNPorSaca = 4.8;
  const demandaTotalNkgHa = Number((produtividadeEsperadaScHa * kgNPorSaca).toFixed(1));

  // A FBN bem inoculada fornece de 85% a 95% de todo o nitrogênio da planta
  const taxaContribuicaoFbnPct = inspecaoAtiva.statusNodulacao === 'EXCELENTE' ? 92 : 75;
  const nFornecidoFbnKgHa = Number(((demandaTotalNkgHa * taxaContribuicaoFbnPct) / 100).toFixed(1));

  // Equivalência em Ureia Agrícola (45% N)
  const ureiaSubstituidaKgHa = Number((nFornecidoFbnKgHa / 0.45).toFixed(1));
  const economiaUreiaReaisHa = (ureiaSubstituidaKgHa / 1000) * cotacaoUreiaTon;
  const economiaLiquidaHa = economiaUreiaReaisHa - custoInoculacaoHa;
  const economiaTotalTalhaoReais = economiaLiquidaHa * areaTalhaoHa;
  const roiMultiplicador = Number((economiaUreiaReaisHa / custoInoculacaoHa).toFixed(0));

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl">
              <Dna className="w-5 h-5" />
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Fixação Biológica de Nitrogênio (FBN) & Co-Inoculação
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full">
                Biotecnologia Microbiana
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Auditoria de nodulação radicular (Bradyrhizobium + Azospirillum) e substituição de 100% de adubo nitrogenado mineral.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right pr-4 border-r border-slate-200 hidden sm:block">
            <div className="text-xs text-slate-500 font-medium">Economia no Talhão</div>
            <div className="text-xl font-black text-emerald-800">
              R$ {economiaTotalTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <button
            onClick={() => alert('Laudo de Auditoria de FBN e Balanço Nitrogenado gerado!')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Laudo de Nodulação</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">N Biológico Fixado (FBN)</div>
          <div className="text-3xl font-black text-emerald-800 mt-1">
            {nFornecidoFbnKgHa} <span className="text-xs font-bold text-slate-500">kg N/ha</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            {taxaContribuicaoFbnPct}% da demanda da soja ({demandaTotalNkgHa} kg N/ha)
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Uréia Mineral Substituída</div>
          <div className="text-3xl font-black text-sky-800 mt-1">
            {ureiaSubstituidaKgHa} <span className="text-xs font-bold text-slate-500">kg/ha</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Equivale a {((ureiaSubstituidaKgHa * areaTalhaoHa) / 1000).toFixed(1)} toneladas poupadas
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Nódulos por Planta ({inspecaoAtiva.estadioFenologico.split(' ')[0]})</div>
          <div className={`text-3xl font-black mt-1 ${
            inspecaoAtiva.statusNodulacao === 'EXCELENTE' ? 'text-emerald-800' : 'text-rose-700'
          }`}>
            {inspecaoAtiva.nodulosPorPlanta} <span className="text-xs font-bold text-slate-500">nódulos</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Meta: &gt; 15 nódulos ativos na coroa
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Retorno sobre o Inoculante</div>
          <div className="text-3xl font-black text-amber-800 mt-1">
            {roiMultiplicador}x <span className="text-xs font-bold text-slate-500">ROI</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Gasta R$ {custoInoculacaoHa}/ha e economiza R$ {economiaUreiaReaisHa.toFixed(0)}/ha
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Auditoria de Nodulação vs Simulador Econômico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Root Nodulation Audit Table (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-extrabold text-slate-900">
                  Auditoria de Nodulação Radicular em V3 / V4
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Embrapa Soja</span>
            </div>

            {/* Selector of Talhões */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
              {inspecoes.map((insp) => {
                const isSelected = insp.id === inspecaoAtiva.id;
                return (
                  <button
                    key={insp.id}
                    onClick={() => setInspecaoAtiva(insp)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 shadow-2xs ring-1 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{insp.talhaoNome.split(' - ')[0]}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          insp.statusNodulacao === 'EXCELENTE'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {insp.statusNodulacao}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 truncate">
                      {insp.nodulosPorPlanta} nódulos/pl • {insp.estadioFenologico.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Card for Active Nodulation */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Atividade da Leg-hemoglobina (Oxigênio e Nitrogenase):</span>
                <span className={`font-bold flex items-center gap-1.5 ${
                  inspecaoAtiva.corInternaLeghemoglobina === 'ROSEA_VERMELHA_ATIVA'
                    ? 'text-emerald-800'
                    : 'text-rose-700'
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    inspecaoAtiva.corInternaLeghemoglobina === 'ROSEA_VERMELHA_ATIVA' ? 'bg-rose-500' : 'bg-slate-400'
                  }`} />
                  {inspecaoAtiva.corInternaLeghemoglobina === 'ROSEA_VERMELHA_ATIVA'
                    ? 'Interior Róseo/Vermelho (Fixação Ativa a Pleno Vapor)'
                    : 'Interior Verde/Cinza (Inativo ou Senescente)'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Co-Inoculação com Azospirillum brasiliense:</span>
                <span className="text-slate-900 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  {inspecaoAtiva.coInoculacaoAzospirillum
                    ? `Aplicado no TSI (+${inspecaoAtiva.volumeRadicularAumentoPct}% volume radicular)`
                    : 'Não realizado'}
                </span>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-medium">
                <span className="font-bold text-emerald-900 block mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Efeito Protetivo contra Veranico:
                </span>
                A co-inoculação estimula o desenvolvimento de pelos absorventes e raízes profundas, aumentando em até <strong>28% o volume de exploração do solo</strong>. Isso retarda o ponto de murcha permanente em períodos de estiagem e eleva a absorção de água e fósforo.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fertilizer Replacement Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-extrabold text-slate-900">
                  Valoração Econômica do N Biológico
                </h2>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full">
                Economia Real
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-5">
              Simule o valor financeiro do nitrogênio atmosférico fixado gratuitamente pelas bactérias simbióticas.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1.5">Meta de Produtividade do Talhão (sc/ha)</label>
                <input
                  type="number"
                  step="1"
                  value={produtividadeEsperadaScHa}
                  onChange={(e) => setProdutividadeEsperadaScHa(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1.5">Cotação da Uréia Agrícola 45% N (R$/tonelada)</label>
                <input
                  type="number"
                  step="50"
                  value={cotacaoUreiaTon}
                  onChange={(e) => setCotacaoUreiaTon(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1.5">Custo Total dos Inoculantes no TSI (R$/ha)</label>
                <input
                  type="number"
                  step="1"
                  value={custoInoculacaoHa}
                  onChange={(e) => setCustoInoculacaoHa(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Substitution Results Output Box */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Economia Bruta de Uréia:</span>
                <span className="text-emerald-800 font-bold font-mono">
                  R$ {economiaUreiaReaisHa.toFixed(2)} /ha
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Custo do Inoculante:</span>
                <span className="text-slate-700 font-semibold font-mono">
                  - R$ {custoInoculacaoHa.toFixed(2)} /ha
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900">Economia Líquida por Hectare:</span>
                <span className="text-emerald-800 font-black text-base font-mono">
                  R$ {economiaLiquidaHa.toFixed(2)} /ha
                </span>
              </div>

              <div className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-900">Economia no Talhão ({areaTalhaoHa} ha)</div>
                  <div className="text-xl font-black text-emerald-950">
                    R$ {economiaTotalTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <Coins className="w-6 h-6 text-emerald-800" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
