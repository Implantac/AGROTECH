import React, { useState } from 'react';
import {
  LineChart,
  Target,
  Sparkles,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  Calendar,
  Layers,
  BarChart2
} from 'lucide-react';
import { TALHOES_INICIAIS, TalhaoData } from '../data/mockAgroData';

interface PrevisaoTalhao {
  id: string;
  talhaoNome: string;
  cultura: string;
  cultivar: string;
  areaHa: number;
  estadioFenologico: string;
  gddAcumulado: number; // Graus-dia
  ndviPicoR3: number;
  deficitHidricoMm: number;
  produtividadeHistoricaScHa: number;
  p10PessimistaScHa: number;
  p50ProvavelScHa: number;
  p90OtimistaScHa: number;
  volumeP50Sacas: number;
  limiteTravaBarterSacas: number; // 60% do P10
  statusLavoura: 'EXCELENTE' | 'NORMAL' | 'ESTRESSE_LEVE';
}

const PREVISOES_INICIAIS: PrevisaoTalhao[] = [
  {
    id: 'prev-01',
    talhaoNome: 'Talhão 01 - Sede / Pivô Central',
    cultura: 'Soja',
    cultivar: 'BMX Bônus IPRO',
    areaHa: 500,
    estadioFenologico: 'R5.3 (Enchimento de Grãos)',
    gddAcumulado: 1380,
    ndviPicoR3: 0.84,
    deficitHidricoMm: 18,
    produtividadeHistoricaScHa: 66.0,
    p10PessimistaScHa: 64.4,
    p50ProvavelScHa: 71.6,
    p90OtimistaScHa: 76.8,
    volumeP50Sacas: 35800,
    limiteTravaBarterSacas: 19320,
    statusLavoura: 'EXCELENTE',
  },
  {
    id: 'prev-02',
    talhaoNome: 'Talhão 02 - Chapadão Alto',
    cultura: 'Soja',
    cultivar: 'TMG 2381 IPRO',
    areaHa: 420,
    estadioFenologico: 'R5.1 (Início Formação Grão)',
    gddAcumulado: 1290,
    ndviPicoR3: 0.82,
    deficitHidricoMm: 22,
    produtividadeHistoricaScHa: 68.0,
    p10PessimistaScHa: 65.2,
    p50ProvavelScHa: 72.4,
    p90OtimistaScHa: 77.5,
    volumeP50Sacas: 30408,
    limiteTravaBarterSacas: 16430,
    statusLavoura: 'EXCELENTE',
  },
  {
    id: 'prev-03',
    talhaoNome: 'Talhão 04 - Corredor Norte',
    cultura: 'Soja',
    cultivar: 'Monsoy M 6410 IPRO',
    areaHa: 380,
    estadioFenologico: 'R4 (Vagem Completa)',
    gddAcumulado: 1140,
    ndviPicoR3: 0.77,
    deficitHidricoMm: 38,
    produtividadeHistoricaScHa: 62.0,
    p10PessimistaScHa: 57.0,
    p50ProvavelScHa: 63.3,
    p90OtimistaScHa: 68.0,
    volumeP50Sacas: 24054,
    limiteTravaBarterSacas: 12996,
    statusLavoura: 'NORMAL',
  },
];

export const ProdutividadePreditivaModule: React.FC = () => {
  const [previsoes] = useState<PrevisaoTalhao[]>(PREVISOES_INICIAIS);
  const [selecionada, setSelecionada] = useState<PrevisaoTalhao>(PREVISOES_INICIAIS[0]);

  // Simulador de Sensibilidade de Safra
  const [fatorChuvaSimulado, setFatorChuvaSimulado] = useState<number>(100); // 100% da média histórica
  const [percentualTravaBarter, setPercentualTravaBarter] = useState<number>(60); // 60% do P10

  // Recálculo Dinâmico P50 e Trava Barter
  const multiplicadorClima = fatorChuvaSimulado / 100;
  const p50Ajustado = Number((selecionada.p50ProvavelScHa * (0.85 + 0.15 * multiplicadorClima)).toFixed(1));
  const p10Ajustado = Number((p50Ajustado * 0.90).toFixed(1));
  const volumeTotalAjustadoSacas = Math.round(p50Ajustado * selecionada.areaHa);
  const travaSeguraRecomendadaSacas = Math.round(p10Ajustado * selecionada.areaHa * (percentualTravaBarter / 100));

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-950 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl">
                <Target className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Previsão de Produtividade por Satélite & Monte Carlo
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    IA Preditiva R5
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Modelagem estocástica com NDVI Sentinel-2, acúmulo de Graus-Dia (GDD) e teto seguro contra wash-out de Barter.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Relatório de Estimativa Pré-Colheita e Trava Segura exportado em PDF!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-950/40"
            >
              <Download className="w-4 h-4" />
              Exportar Estimativa
            </button>
            <div className="text-right pl-4 border-l border-emerald-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">P50 Provável</div>
              <div className="text-xl font-bold text-emerald-300">{p50Ajustado} sc/ha</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Produtividade P50 Estimada</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {p50Ajustado} <span className="text-sm font-normal text-stone-400">sc/ha</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Histórico: {selecionada.produtividadeHistoricaScHa} sc/ha (+{((p50Ajustado/selecionada.produtividadeHistoricaScHa - 1)*100).toFixed(1)}%)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Intervalo de Confiança (P10 - P90)</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">
            {p10Ajustado} - {selecionada.p90OtimistaScHa} <span className="text-sm font-normal text-stone-400">sc/ha</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Simulação Monte Carlo com 1.000 iterações
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Trava Máxima Barter Recomendada</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {travaSeguraRecomendadaSacas.toLocaleString('pt-BR')} <span className="text-sm font-normal text-stone-400">sacas</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1">
            {percentualTravaBarter}% do cenário pessimista P10 (Risco Zero Wash-out)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Volume Total Esperado ({selecionada.areaHa} ha)</div>
          <div className="text-2xl font-bold text-white mt-1">
            {volumeTotalAjustadoSacas.toLocaleString('pt-BR')} <span className="text-sm font-normal text-stone-400">sacas</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            {selecionada.cultivar} • {selecionada.estadioFenologico}
          </div>
        </div>
      </div>

      {/* Main Dual Column: Talhões vs Simulador de Barter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lista de Talhões Monitorados (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Talhões Monitorados por Sensoriamento Remoto
                </h2>
              </div>
              <span className="text-xs text-stone-400">Sentinel-2 MSI 10m</span>
            </div>

            {/* List of Fields */}
            <div className="space-y-3 mb-6">
              {previsoes.map((p) => {
                const isSelected = p.id === selecionada.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelecionada(p)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          <Target className="w-4 h-4 text-emerald-400" />
                          {p.talhaoNome}
                          <span className="text-xs text-stone-400 font-normal">({p.areaHa} ha)</span>
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          {p.cultivar} • {p.estadioFenologico}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-stone-400">NDVI Pico</div>
                          <div className="text-sm font-bold text-emerald-400">{p.ndviPicoR3}</div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg">
                          {p.p50ProvavelScHa} sc/ha
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Agrometeorology Parameters Card */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Parâmetros Biofísicos ({selecionada.talhaoNome})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Graus-Dia (GDD)</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {selecionada.gddAcumulado} °C-dia
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Base térmica 10°C</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">NDVI Médio Pico</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">
                    {selecionada.ndviPicoR3}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Dossel fechado vigoroso</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Déficit Hídrico</div>
                  <div className="text-lg font-bold text-cyan-300 mt-1">
                    {selecionada.deficitHidricoMm} mm
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Baixo estresse no enchimento</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Status Fitossanitário</div>
                  <div className="text-lg font-bold text-emerald-300 mt-1">
                    {selecionada.statusLavoura}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Zero foco de ferrugem</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Barter Risk & Climate Stress Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Simulador de Risco de Comercialização
                </h2>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
                Proteção Wash-Out
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Simule cenários pluviométricos para estressar a safra e definir o volume seguro de entrega em contratos futuros com tradings.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-400 font-medium">Condição Pluviométrica no Enchimento de Grãos</span>
                  <span className="text-emerald-300 font-bold">{fatorChuvaSimulado}% da média</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="130"
                  step="5"
                  value={fatorChuvaSimulado}
                  onChange={(e) => setFatorChuvaSimulado(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-stone-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>60% (Veranico Severo)</span>
                  <span>100% (Normal)</span>
                  <span>130% (Chuvoso)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-400 font-medium">% de Trava Antecipada sobre o P10</span>
                  <span className="text-amber-300 font-bold">{percentualTravaBarter}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="80"
                  step="5"
                  value={percentualTravaBarter}
                  onChange={(e) => setPercentualTravaBarter(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-stone-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>30% (Conservador)</span>
                  <span>60% (Recomendado)</span>
                  <span>80% (Agressivo)</span>
                </div>
              </div>
            </div>

            {/* Trading Risk Output Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Volume Total Simulado (P50):</span>
                <span className="text-white font-bold text-sm">
                  {volumeTotalAjustadoSacas.toLocaleString('pt-BR')} sacas
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Volume no Pior Cenário (P10):</span>
                <span className="text-rose-400 font-semibold">
                  {Math.round(p10Ajustado * selecionada.areaHa).toLocaleString('pt-BR')} sacas
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Teto Seguro para Trava Futura:</span>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-300">
                    {travaSeguraRecomendadaSacas.toLocaleString('pt-BR')} sacas
                  </div>
                  <div className="text-[10px] text-emerald-500">
                    {Number((travaSeguraRecomendadaSacas / volumeTotalAjustadoSacas * 100).toFixed(1))}% da safra total comprometida
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
