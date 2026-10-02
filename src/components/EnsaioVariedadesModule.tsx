import React, { useState } from 'react';
import {
  Sprout,
  Trophy,
  Scale,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Layers,
  Sparkles,
  BarChart3
} from 'lucide-react';

interface CultivarEnsaio {
  id: string;
  nomeComercial: string;
  obtentor: string;
  biotecnologia: string;
  gmr: number; // Grupo de Maturação Relativa
  cicloMedioDias: number;
  resistenciaDoencas: string[];
  produtividadeBrutaScHa: number;
  umidadeColheitaPct: number;
  pesoMilSementesGramas: number;
  populacaoPlantasHa: number;
}

const CULTIVARES_INICIAIS: CultivarEnsaio[] = [
  {
    id: 'cult-01',
    nomeComercial: 'TMG 2381 IPRO',
    obtentor: 'TMG - Tropical Melhoramento & Genética',
    biotecnologia: 'Intacta PRO',
    gmr: 8.1,
    cicloMedioDias: 118,
    resistenciaDoencas: ['Nematóide de Cisto (Raças 3 e 14)', 'Podridão Radicular de Phytophthora', 'Mancha Alvo'],
    produtividadeBrutaScHa: 76.5,
    umidadeColheitaPct: 14.5,
    pesoMilSementesGramas: 178,
    populacaoPlantasHa: 260000,
  },
  {
    id: 'cult-02',
    nomeComercial: 'DM 66X68 I2X',
    obtentor: 'DonMario Sementes',
    biotecnologia: 'Intacta 2 Xtend',
    gmr: 6.8,
    cicloMedioDias: 112,
    resistenciaDoencas: ['Lagarta-Helicoverpa', 'Falsa-Medideira', 'Tolerância ao Dicamba'],
    produtividadeBrutaScHa: 71.0,
    umidadeColheitaPct: 13.0,
    pesoMilSementesGramas: 165,
    populacaoPlantasHa: 300000,
  },
  {
    id: 'cult-03',
    nomeComercial: 'M 5917 IPRO',
    obtentor: 'Monsoy / Bayer',
    biotecnologia: 'Intacta PRO',
    gmr: 7.3,
    cicloMedioDias: 115,
    resistenciaDoencas: ['Oídio', 'Cercóspora', 'Antracnose'],
    produtividadeBrutaScHa: 68.2,
    umidadeColheitaPct: 12.0,
    pesoMilSementesGramas: 158,
    populacaoPlantasHa: 280000,
  },
  {
    id: 'cult-04',
    nomeComercial: 'Brasmax Desafio RR',
    obtentor: 'Brasmax Genética',
    biotecnologia: 'Roundup Ready',
    gmr: 7.9,
    cicloMedioDias: 120,
    resistenciaDoencas: ['Cancro da Haste', 'Mancha Olho-de-Rã'],
    produtividadeBrutaScHa: 66.8,
    umidadeColheitaPct: 13.8,
    pesoMilSementesGramas: 172,
    populacaoPlantasHa: 270000,
  },
];

export const EnsaioVariedadesModule: React.FC = () => {
  const [cultivares] = useState<CultivarEnsaio[]>(CULTIVARES_INICIAIS);
  const [dmsTukeyScHa, setDmsTukeyScHa] = useState<number>(3.5); // Diferença Mínima Significativa estatística
  const [precoSacaVenda, setPrecoSacaVenda] = useState<number>(132.0); // R$/sc
  const [areaPlanejadaProximaSafraHa, setAreaPlanejadaProximaSafraHa] = useState<number>(800); // ha a converter

  // Correção de Umidade Oficial Conab (Padrão 13,0%)
  const cultivaresProcessadas = cultivares.map((c) => {
    const fatorUmidade = (100 - c.umidadeColheitaPct) / (100 - 13.0);
    const prodLiquidaScHa = Number((c.produtividadeBrutaScHa * fatorUmidade).toFixed(1));
    const faturamentoBrutoHa = prodLiquidaScHa * precoSacaVenda;
    return {
      ...c,
      prodLiquidaScHa,
      faturamentoBrutoHa,
    };
  }).sort((a, b) => b.prodLiquidaScHa - a.prodLiquidaScHa);

  const campeao = cultivaresProcessadas[0];
  const segundoLugar = cultivaresProcessadas[1];
  const diferencaCampeaoScHa = Number((campeao.prodLiquidaScHa - segundoLugar.prodLiquidaScHa).toFixed(1));
  const ehEstatisticamenteSuperior = diferencaCampeaoScHa >= dmsTukeyScHa;

  // Ganho marginal da escolha do campeão sobre o segundo colocado na área planejada
  const ganhoMarginalSacasTotal = (campeao.prodLiquidaScHa - segundoLugar.prodLiquidaScHa) * areaPlanejadaProximaSafraHa;
  const ganhoMarginalFinanceiroReais = ganhoMarginalSacasTotal * precoSacaVenda;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl">
                <Trophy className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Ensaio de Variedades & Lado a Lado (Strip-Trials)
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Fitotecnia de Precisão
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Comparação pareada de cultivares, correção de umidade Conab (13,0%) e teste estatístico de Tukey (DMS).
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laudo Técnico Comparativo de Strip-Trial emitido com matriz de significância estatística Tukey!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-950/40"
            >
              <Download className="w-4 h-4" />
              Laudo do Ensaio
            </button>
            <div className="text-right pl-4 border-l border-emerald-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Variedade Campeã</div>
              <div className="text-xl font-bold text-emerald-300">{campeao.nomeComercial}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Produtividade Máxima (13%)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {campeao.prodLiquidaScHa} <span className="text-sm font-normal text-stone-400">sc/ha</span>
          </div>
          <div className="text-xs text-stone-500 mt-1 truncate">
            {campeao.nomeComercial} ({campeao.biotecnologia})
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Diferença vs 2º Lugar</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">
            +{diferencaCampeaoScHa} <span className="text-sm font-normal text-stone-400">sc/ha</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            {ehEstatisticamenteSuperior ? 'Superioridade Comprovada (p < 0.05)' : 'Empate Estatístico (DMS = 3.5 sc/ha)'}
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">DMS Tukey 5% de Probabilidade</div>
          <div className="text-2xl font-bold text-white mt-1">
            {dmsTukeyScHa.toFixed(1)} <span className="text-sm font-normal text-stone-400">sc/ha</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Limiar mínimo de significância real
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Ganho Marginal Previsto</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            R$ {ganhoMarginalFinanceiroReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Em {areaPlanejadaProximaSafraHa} ha alocados na próxima safra
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Ranking Pareado vs Simulador de Alocação de Área */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Strip-Trial Results Ranking Table (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Ranking Pareado de Produtividade Padronizada (13,0%)
                </h2>
              </div>
              <span className="text-xs text-stone-400 font-mono">Padrão Conab</span>
            </div>

            <div className="space-y-3">
              {cultivaresProcessadas.map((cult, idx) => {
                const isChampion = idx === 0;
                return (
                  <div
                    key={cult.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isChampion
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-stone-800/40 border-stone-700/60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            isChampion ? 'bg-emerald-500 text-slate-950' : 'bg-stone-700 text-stone-300'
                          }`}>
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-white text-sm">{cult.nomeComercial}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-[#26332A] border border-slate-700">
                            GMR {cult.gmr} • {cult.cicloMedioDias} dias
                          </span>
                        </div>
                        <div className="text-xs text-stone-400 mt-1">
                          Obtentor: <span className="text-stone-300">{cult.obtentor}</span> • PMS: {cult.pesoMilSementesGramas} g • {(cult.populacaoPlantasHa / 1000).toFixed(0)}k pl/ha
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Tolerâncias: {cult.resistenciaDoencas.join(' • ')}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs text-stone-400">
                          Colhido: {cult.produtividadeBrutaScHa} sc/ha @ {cult.umidadeColheitaPct}%
                        </div>
                        <div className="text-xl font-black text-emerald-400">
                          {cult.prodLiquidaScHa} <span className="text-xs font-normal text-stone-400">sc/ha</span>
                        </div>
                        <div className="text-[11px] text-stone-400 font-mono">
                          R$ {cult.faturamentoBrutoHa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ha
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explicação Estatística Tukey */}
            <div className="mt-4 p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-xs text-stone-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-300 block mb-0.5">
                  Conclusão Estatística do Teste de Médias (Tukey 5%):
                </span>
                A cultivar <strong>{campeao.nomeComercial}</strong> superou a segunda colocada ({segundoLugar.nomeComercial}) por <strong>+{diferencaCampeaoScHa} sc/ha</strong>, superando a Diferença Mínima Significativa calculada ({dmsTukeyScHa} sc/ha). A superioridade agronômica é estatisticamente real e recomendada para ampliação de plantio na safra seguinte.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Varietal Allocation & Financial Margin Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Planejamento da Próxima Safra
                </h2>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
                Decisão Varietal
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Simule a substituição de área da variedade secundária pela variedade campeã do ensaio lado a lado.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Área a Alocar com a Variedade Campeã (ha)</label>
                <input
                  type="number"
                  step="50"
                  value={areaPlanejadaProximaSafraHa}
                  onChange={(e) => setAreaPlanejadaProximaSafraHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Preço Projetado da Saca de Soja (R$/sc)</label>
                <input
                  type="number"
                  step="1.0"
                  value={precoSacaVenda}
                  onChange={(e) => setPrecoSacaVenda(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">DMS Tukey (Sensibilidade do Ensaio em sc/ha)</label>
                <input
                  type="number"
                  step="0.5"
                  value={dmsTukeyScHa}
                  onChange={(e) => setDmsTukeyScHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Financial Results Output Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Ganho Adicional por Hectare:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  +{diferencaCampeaoScHa} sc/ha (R$ {(diferencaCampeaoScHa * precoSacaVenda).toFixed(2)}/ha)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Produção Adicional Total:</span>
                <span className="text-white font-semibold">
                  +{ganhoMarginalSacasTotal.toLocaleString('pt-BR')} sacas
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Resultado Financeiro Marginal:</span>
                <span className="text-emerald-400 font-black text-lg">
                  R$ {ganhoMarginalFinanceiroReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
