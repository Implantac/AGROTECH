import React, { useState, useMemo } from 'react';
import {
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  Droplets,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Gauge,
  Activity,
  BarChart3,
  Download,
  Sprout,
  ShieldAlert,
  ArrowUpRight,
  TrendingDown,
  Info
} from 'lucide-react';

interface PrevisaoDia {
  dia: string;
  data: string;
  tempMin: number;
  tempMax: number;
  urMedia: number;
  ventoKmh: number;
  chuvaMm: number;
  probabilidadeChuvaPct: number;
  deltaTEstimado: number;
  janelaPulverizacao: 'RECOMENDADA' | 'JANELA_CURTA' | 'RISCO_DERIVA' | 'RISCO_EVAPORACAO';
}

interface BalancoHidricoDecendial {
  periodo: string;
  chuvaMm: number;
  etoMm: number;
  etcMm: number;
  deficitMm: number;
  excedenteMm: number;
  armPercentual: number; // Armazenamento de água no solo %
}

export const AgrometeorologiaModule: React.FC = () => {
  // Sensores da Estação Meteorológica IoT Davis Vantage Pro2 na Sede
  const [temperatura, setTemperatura] = useState<number>(27.5);
  const [umidadeRelativa, setUmidadeRelativa] = useState<number>(64);
  const [velocidadeVento, setVelocidadeVento] = useState<number>(7.2);
  const [direcaoVento, setDirecaoVento] = useState<string>('Sudeste (SE - 135°)');
  const [pluviometriaHojeMm, setPluviometriaHojeMm] = useState<number>(14.5);
  const [pluviometriaSafraMm, setPluviometriaSafraMm] = useState<number>(1285.0);
  const [radiacaoSolarWm2, setRadiacaoSolarWm2] = useState<number>(840);
  const [cadSoloMm, setCadSoloMm] = useState<number>(100); // Capacidade de Água Disponível (solo argiloso Latossolo Vermelho = 100-120mm)
  const [culturaSelecionada, setCulturaSelecionada] = useState<'SOJA' | 'MILHO_SAFRINHA' | 'ALGODAO' | 'CAFE'>('SOJA');
  const [estadioFenologico, setEstadioFenologico] = useState<string>('R1_FLORESCIMENTO');
  const [viewTab, setViewTab] = useState<'ESTACAO' | 'BALANCO_HIDRICO' | 'PREVISAO_7DIAS' | 'GDD_FENOLOGIA'>('ESTACAO');

  // Coeficiente de Cultura (Kc) por fase fenológica segundo FAO-56
  const kcAtual = useMemo(() => {
    switch (culturaSelecionada) {
      case 'SOJA':
        if (estadioFenologico.startsWith('VE')) return 0.40;
        if (estadioFenologico.startsWith('V4')) return 0.75;
        if (estadioFenologico.startsWith('R1')) return 1.15; // Floração e enchimento de grãos
        return 0.50; // Maturação R7/R8
      case 'MILHO_SAFRINHA':
        if (estadioFenologico.startsWith('VE')) return 0.40;
        if (estadioFenologico.startsWith('V4')) return 0.85;
        if (estadioFenologico.startsWith('R1')) return 1.20; // Pendoamento
        return 0.60;
      case 'ALGODAO':
        return 1.10;
      case 'CAFE':
        return 0.95;
      default:
        return 1.0;
    }
  }, [culturaSelecionada, estadioFenologico]);

  // Cálculo agronômico de Delta T psicrométrico
  // Delta T (°C) = Tbs - Tbu. Para fins práticos agronômicos:
  const deltaT = Number((temperatura * (1 - umidadeRelativa / 100) * 0.85).toFixed(1));

  let statusDeltaT: 'IDEAL' | 'CRITICO_EVAPORACAO' | 'ATENCAO_DERIVA' = 'IDEAL';
  let badgeColor = 'bg-emerald-950 text-emerald-400 border-emerald-800';
  let explicacaoDeltaT = 'Condições ideais de gota. Sem risco de evaporação prematura nem deriva acentuada.';

  if (deltaT > 8.0) {
    statusDeltaT = 'CRITICO_EVAPORACAO';
    badgeColor = 'bg-red-950 text-red-400 border-red-800';
    explicacaoDeltaT = 'Ar extremamente seco ou quente. As gotas finas evaporam antes de atingir as folhas inferiores do dossel.';
  } else if (deltaT < 2.0) {
    statusDeltaT = 'ATENCAO_DERIVA';
    badgeColor = 'bg-amber-950 text-amber-400 border-amber-800';
    explicacaoDeltaT = 'Ar com umidade excessiva. Risco de escorrimento foliar de calda e inversão térmica com deriva estagnada.';
  }

  // Cálculo de Evapotranspiração ETo FAO-56 Simplificada (Hargreaves-Samani / Radiação)
  // ETo estimada diária (mm/dia)
  const etoDiariaMm = useMemo(() => {
    // Estimativa baseada em radiação, temperatura média e vento
    const base = (temperatura * 0.16) + (radiacaoSolarWm2 / 240) + (velocidadeVento * 0.08);
    return Math.max(2.5, Number(base.toFixed(2)));
  }, [temperatura, radiacaoSolarWm2, velocidadeVento]);

  // ETc = ETo * Kc
  const etcDiariaMm = Number((etoDiariaMm * kcAtual).toFixed(2));

  // Balanço Hídrico Decendial (Últimos 6 decêndios da safra)
  const historicoBalanco: BalancoHidricoDecendial[] = [
    { periodo: 'Dez/1º Dec', chuvaMm: 85.0, etoMm: 42.0, etcMm: 33.6, deficitMm: 0.0, excedenteMm: 51.4, armPercentual: 100 },
    { periodo: 'Dez/2º Dec', chuvaMm: 62.0, etoMm: 46.0, etcMm: 41.4, deficitMm: 0.0, excedenteMm: 20.6, armPercentual: 98 },
    { periodo: 'Dez/3º Dec', chuvaMm: 110.0, etoMm: 39.0, etcMm: 42.9, deficitMm: 0.0, excedenteMm: 67.1, armPercentual: 100 },
    { periodo: 'Jan/1º Dec', chuvaMm: 24.0, etoMm: 48.0, etcMm: 55.2, deficitMm: 12.4, excedenteMm: 0.0, armPercentual: 82 },
    { periodo: 'Jan/2º Dec', chuvaMm: 15.0, etoMm: 52.0, etcMm: 59.8, deficitMm: 34.8, excedenteMm: 0.0, armPercentual: 64 },
    { periodo: 'Jan/3º Dec (Atual)', chuvaMm: pluviometriaHojeMm + 28, etoMm: 45.0, etcMm: 51.8, deficitMm: 9.3, excedenteMm: 0.0, armPercentual: 74 }
  ];

  // Previsão Agrometeorológica ECMWF / GFS de 7 Dias
  const previsao7Dias: PrevisaoDia[] = [
    {
      dia: 'Hoje (Qui)',
      data: '01/10',
      tempMin: 21.0,
      tempMax: 32.5,
      urMedia: 62,
      ventoKmh: 8.5,
      chuvaMm: 14.5,
      probabilidadeChuvaPct: 85,
      deltaTEstimado: 4.8,
      janelaPulverizacao: 'RECOMENDADA'
    },
    {
      dia: 'Sex',
      data: '02/10',
      tempMin: 20.5,
      tempMax: 33.0,
      urMedia: 58,
      ventoKmh: 9.2,
      chuvaMm: 5.0,
      probabilidadeChuvaPct: 40,
      deltaTEstimado: 5.4,
      janelaPulverizacao: 'RECOMENDADA'
    },
    {
      dia: 'Sáb',
      data: '03/10',
      tempMin: 22.0,
      tempMax: 34.5,
      urMedia: 44,
      ventoKmh: 14.0,
      chuvaMm: 0.0,
      probabilidadeChuvaPct: 10,
      deltaTEstimado: 8.4,
      janelaPulverizacao: 'RISCO_EVAPORACAO'
    },
    {
      dia: 'Dom',
      data: '04/10',
      tempMin: 23.0,
      tempMax: 35.0,
      urMedia: 40,
      ventoKmh: 16.5,
      chuvaMm: 0.0,
      probabilidadeChuvaPct: 5,
      deltaTEstimado: 9.1,
      janelaPulverizacao: 'RISCO_DERIVA'
    },
    {
      dia: 'Seg',
      data: '05/10',
      tempMin: 21.5,
      tempMax: 30.0,
      urMedia: 72,
      ventoKmh: 6.8,
      chuvaMm: 28.0,
      probabilidadeChuvaPct: 90,
      deltaTEstimado: 2.8,
      janelaPulverizacao: 'JANELA_CURTA'
    },
    {
      dia: 'Ter',
      data: '06/10',
      tempMin: 20.0,
      tempMax: 29.0,
      urMedia: 80,
      ventoKmh: 5.0,
      chuvaMm: 18.0,
      probabilidadeChuvaPct: 75,
      deltaTEstimado: 2.1,
      janelaPulverizacao: 'JANELA_CURTA'
    },
    {
      dia: 'Qua',
      data: '07/10',
      tempMin: 21.0,
      tempMax: 31.5,
      urMedia: 65,
      ventoKmh: 7.0,
      chuvaMm: 2.0,
      probabilidadeChuvaPct: 20,
      deltaTEstimado: 4.5,
      janelaPulverizacao: 'RECOMENDADA'
    }
  ];

  // Cálculo de Graus-Dia Acumulados (GDD = (Tmax + Tmin)/2 - Tb)
  // Para Soja: Temperatura base (Tb) = 10°C
  const tbSoja = 10.0;
  const gddHoje = Math.max(0, ((temperatura + 21.0) / 2) - tbSoja);
  const gddAcumuladoSafra = 1420; // Aproximação para R1/R2

  return (
    <div className="space-y-6">
      {/* Top Banner de Agrometeorologia */}
      <div className="bg-white border border-[#EAF4E7] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-800 rounded text-xs font-bold flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Estação Meteorológica IoT Davis Vantage Pro2 & Telemetria LoRaWAN
            </span>
            <span className="text-xs text-[#66736A]">Instalada na Sede da Fazenda Santa Helena • Coordenadas: 12°32'S 55°43'W</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-400" /> Agrometeorologia, Balanço Hídrico & Janela Delta T
          </h2>
          <p className="text-xs text-[#66736A] mt-1">
            Monitoramento psicrométrico de pulverização, balanço hídrico climatológico de Thornthwaite-Mather e previsão ECMWF/GFS para manejo de safras.
          </p>
        </div>

        {/* Status da Janela de Pulverização */}
        <div className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-3 ${badgeColor}`}>
          <Gauge className="w-5 h-5 shrink-0" />
          <div>
            <span className="block text-[10px] uppercase font-semibold text-[#66736A]">Janela de Pulverização</span>
            <span className="text-sm">Delta T: {deltaT}°C ({statusDeltaT === 'IDEAL' ? 'LIBERADA' : 'RESTRITA'})</span>
          </div>
        </div>
      </div>

      {/* Navegação entre Abas do Cockpit Agrometeorológico */}
      <div className="flex flex-wrap gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setViewTab('ESTACAO')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            viewTab === 'ESTACAO'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
              : 'bg-slate-900 text-[#66736A] hover:text-white hover:bg-slate-800'
          }`}
        >
          <Thermometer className="w-4 h-4" /> Estação em Tempo Real & Delta T
        </button>

        <button
          onClick={() => setViewTab('BALANCO_HIDRICO')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            viewTab === 'BALANCO_HIDRICO'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
              : 'bg-slate-900 text-[#66736A] hover:text-white hover:bg-slate-800'
          }`}
        >
          <Droplets className="w-4 h-4" /> Balanço Hídrico Thornthwaite-Mather
        </button>

        <button
          onClick={() => setViewTab('PREVISAO_7DIAS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            viewTab === 'PREVISAO_7DIAS'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
              : 'bg-slate-900 text-[#66736A] hover:text-white hover:bg-slate-800'
          }`}
        >
          <CloudRain className="w-4 h-4" /> Previsão 7 Dias & Radar Agronômico
        </button>

        <button
          onClick={() => setViewTab('GDD_FENOLOGIA')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            viewTab === 'GDD_FENOLOGIA'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
              : 'bg-slate-900 text-[#66736A] hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sprout className="w-4 h-4" /> Graus-Dia (GDD) & Fenologia
        </button>
      </div>

      {/* ABA 1: ESTAÇÃO EM TEMPO REAL E DELTA T */}
      {viewTab === 'ESTACAO' && (
        <>
          {/* Simulador Interativo de Condições Meteorológicas */}
          <div className="bg-white border border-[#EAF4E7] p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-amber-400" />
                  Simulador Dinâmico de Condições de Aplicação (Delta T em Tempo Real)
                </h3>
                <p className="text-xs text-[#66736A]">
                  Ajuste temperatura, umidade e vento para verificar a viabilidade da pulverização antes de enviar a frota a campo.
                </p>
              </div>
              <button
                onClick={() => {
                  setTemperatura(27.5);
                  setUmidadeRelativa(64);
                  setVelocidadeVento(7.2);
                  setRadiacaoSolarWm2(840);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[#26332A] text-xs rounded-xl border border-slate-700 transition"
              >
                Restaurar Sensores Telemetria
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Slider Temperatura */}
              <div className="space-y-2 bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#66736A] font-medium">Temperatura do Ar</span>
                  <span className="text-amber-400 font-bold font-mono">{temperatura.toFixed(1)} °C</span>
                </div>
                <input
                  type="range"
                  min="15.0"
                  max="40.0"
                  step="0.5"
                  value={temperatura}
                  onChange={(e) => setTemperatura(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>15°C</span>
                  <span>25°C</span>
                  <span>40°C</span>
                </div>
              </div>

              {/* Slider Umidade Relativa */}
              <div className="space-y-2 bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#66736A] font-medium">Umidade Relativa (UR)</span>
                  <span className="text-cyan-400 font-bold font-mono">{umidadeRelativa}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  step="1"
                  value={umidadeRelativa}
                  onChange={(e) => setUmidadeRelativa(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>20% (Seco)</span>
                  <span>60% (Ideal)</span>
                  <span>95% (Úmido)</span>
                </div>
              </div>

              {/* Slider Vento */}
              <div className="space-y-2 bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#66736A] font-medium">Velocidade do Vento</span>
                  <span className="text-emerald-400 font-bold font-mono">{velocidadeVento.toFixed(1)} km/h</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="25.0"
                  step="0.5"
                  value={velocidadeVento}
                  onChange={(e) => setVelocidadeVento(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>&lt; 3 km/h (Inversão)</span>
                  <span>3-10 km/h (Seguro)</span>
                  <span>&gt; 12 km/h (Deriva)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Cards de Sensores da Estação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#EAF4E7] p-4 rounded-xl shadow">
              <div className="flex justify-between items-center text-xs text-[#66736A] mb-1">
                <span>Temperatura & UR</span>
                <Thermometer className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white">
                {temperatura}°C <span className="text-xs font-normal text-[#66736A]">/ {umidadeRelativa}%</span>
              </p>
              <span className="text-[11px] text-[#66736A] mt-1 block">Ponto de Orvalho: 20.1°C</span>
            </div>

            <div className="bg-white border border-[#EAF4E7] p-4 rounded-xl shadow">
              <div className="flex justify-between items-center text-xs text-[#66736A] mb-1">
                <span>Vento & Rajada</span>
                <Wind className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-black text-cyan-400">
                {velocidadeVento} <span className="text-xs font-normal text-[#66736A]">km/h</span>
              </p>
              <span className="text-[11px] text-[#66736A] mt-1 block">{direcaoVento} • Rajada 11.4 km/h</span>
            </div>

            <div className="bg-white border border-[#EAF4E7] p-4 rounded-xl shadow">
              <div className="flex justify-between items-center text-xs text-[#66736A] mb-1">
                <span>Chuva Hoje</span>
                <CloudRain className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-blue-400">
                {pluviometriaHojeMm} <span className="text-xs font-normal text-[#66736A]">mm</span>
              </p>
              <span className="text-[11px] text-[#66736A] mt-1 block">Intensidade: 2.8 mm/h (Chuva leve)</span>
            </div>

            <div className="bg-white border border-[#EAF4E7] p-4 rounded-xl shadow">
              <div className="flex justify-between items-center text-xs text-[#66736A] mb-1">
                <span>Evapotranspiração ETo</span>
                <Droplets className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-400">
                {etoDiariaMm} <span className="text-xs font-normal text-[#66736A]">mm/dia</span>
              </p>
              <span className="text-[11px] text-emerald-400 mt-1 block font-semibold">
                ETc Cultura: {etcDiariaMm} mm/dia (Kc {kcAtual})
              </span>
            </div>
          </div>

          {/* Painel do Índice Delta T para Pulverização */}
          <div className="bg-white border border-[#EAF4E7] p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-emerald-400" /> O que é o Índice Delta T e Como Ele Protege a Aplicação?
                </h3>
                <p className="text-xs text-[#66736A] mt-0.5">
                  Relação psicrométrica entre temperatura de bulbo seco e bulbo úmido para garantir sobrevivência da gota sem deriva
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-[#F7F9F5] px-3 py-1.5 rounded-xl border border-[#EAF4E7] text-[#26332A]">
                Delta T Atual: <b className="text-emerald-400">{deltaT}°C</b>
              </span>
            </div>

            {/* Escala Visual de Delta T */}
            <div className="space-y-2">
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-[#F7F9F5] border border-[#EAF4E7]">
                <div className="bg-amber-500 h-full w-[20%]" title="Risco de Deriva (< 2°C)"></div>
                <div className="bg-emerald-500 h-full w-[60%]" title="Janela Ideal (2°C a 8°C)"></div>
                <div className="bg-red-500 h-full w-[20%]" title="Risco de Evaporação (> 8°C)"></div>
              </div>
              <div className="flex justify-between text-[11px] text-[#66736A] font-medium px-1">
                <span>&lt; 2°C (Deriva Alta / Inversão)</span>
                <span className="text-emerald-400 font-bold">Faixa Ótima Agronômica (2°C a 8°C)</span>
                <span>&gt; 8°C (Evaporação Excessiva de Gotas)</span>
              </div>
            </div>

            <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-[#26332A] leading-relaxed">
                <b className="text-white">Diagnóstico Operacional em Tempo Real:</b> {explicacaoDeltaT}
                <p className="text-[#66736A] mt-1">
                  Vento a <b>{velocidadeVento} km/h</b> está dentro da faixa segura (3 a 10 km/h). Bicos recomendados para a aplicação atual: <b>TTJ60-11002 (Gotas Médias a Grossas com Indução de Ar)</b>.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ABA 2: BALANÇO HÍDRICO THORNTHWAITE-MATHER */}
      {viewTab === 'BALANCO_HIDRICO' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#EAF4E7] p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-400" /> Balanço Hídrico Climatológico Decendial (Thornthwaite-Mather)
                </h3>
                <p className="text-xs text-[#66736A] mt-1">
                  Contabilidade hídrica do perfil do solo considerando Precipitação (P), Evapotranspiração da Cultura (ETc) e Capacidade de Água Disponível (CAD).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-right">
                  <span className="block text-[#66736A] font-medium">CAD do Solo Selecionada:</span>
                  <span className="text-emerald-400 font-bold">{cadSoloMm} mm (Latossolo Argiloso)</span>
                </div>
              </div>
            </div>

            {/* Tabela de Balanço Hídrico */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAF4E7] text-[#66736A] bg-[#F7F9F5]">
                    <th className="p-3">Decêndio / Período</th>
                    <th className="p-3 text-right">Chuva (P)</th>
                    <th className="p-3 text-right">ETo (FAO-56)</th>
                    <th className="p-3 text-right">ETc (Cultura)</th>
                    <th className="p-3 text-right">Déficit (DEF)</th>
                    <th className="p-3 text-right">Excedente (EXC)</th>
                    <th className="p-3 text-right">Armazenamento Solo (ARM)</th>
                    <th className="p-3 text-center">Situação Hídrica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {historicoBalanco.map((bh, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="p-3 font-semibold text-white">{bh.periodo}</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">{bh.chuvaMm.toFixed(1)} mm</td>
                      <td className="p-3 text-right font-mono text-[#26332A]">{bh.etoMm.toFixed(1)} mm</td>
                      <td className="p-3 text-right font-mono text-amber-400 font-bold">{bh.etcMm.toFixed(1)} mm</td>
                      <td className="p-3 text-right font-mono text-red-400">{bh.deficitMm > 0 ? `${bh.deficitMm.toFixed(1)} mm` : '-'}</td>
                      <td className="p-3 text-right font-mono text-emerald-400">{bh.excedenteMm > 0 ? `${bh.excedenteMm.toFixed(1)} mm` : '-'}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-mono font-bold text-cyan-400">{bh.armPercentual}%</span>
                          <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                bh.armPercentual >= 70 ? 'bg-emerald-500' : bh.armPercentual >= 40 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${bh.armPercentual}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        {bh.deficitMm > 20 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                            Estresse Hídrico Moderado
                          </span>
                        ) : bh.excedenteMm > 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            Armazenamento Pleno
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                            Consumo de Reserva
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Diagnóstico Agronômico de Reserva do Solo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <span className="text-[#66736A] text-xs">Água Facilmente Disponível (AFD):</span>
                <p className="text-xl font-bold text-white mt-1">60.0 mm</p>
                <p className="text-[11px] text-slate-500 mt-1">Fator de depleção p = 0.50 (Sem estresse)</p>
              </div>
              <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <span className="text-[#66736A] text-xs">Autonomia sem Chuva (Dias):</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">11 a 13 Dias</p>
                <p className="text-[11px] text-slate-500 mt-1">Consumo atual ETc de 5.18 mm/dia</p>
              </div>
              <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <span className="text-[#66736A] text-xs">Risco de Veranico Decendial:</span>
                <p className="text-xl font-bold text-cyan-400 mt-1">BAIXO (12%)</p>
                <p className="text-[11px] text-slate-500 mt-1">Frente fria e corredor de umidade previstos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: PREVISÃO 7 DIAS E RADAR */}
      {viewTab === 'PREVISAO_7DIAS' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#EAF4E7] p-6 rounded-2xl shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-blue-400" /> Previsão Agrometeorológica ECMWF / GFS de 7 Dias
              </h3>
              <p className="text-xs text-[#66736A] mt-1">
                Projeção integrada com modelagem numérica de alta resolução (9 km) e cálculo preventivo da janela de aplicação.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {previsao7Dias.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col justify-between ${
                    idx === 0
                      ? 'bg-emerald-950/20 border-emerald-700/60 shadow-lg'
                      : 'bg-[#F7F9F5] border-[#EAF4E7]'
                  }`}
                >
                  <div className="border-b border-[#EAF4E7]/80 pb-2 mb-2">
                    <span className="text-[11px] font-bold text-white block">{p.dia}</span>
                    <span className="text-[10px] text-[#66736A]">{p.data}</span>
                  </div>

                  <div className="space-y-1.5 text-xs my-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[#66736A] text-[10px]">Temp:</span>
                      <span className="font-mono font-bold text-amber-400">{p.tempMin}° - {p.tempMax}°</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#66736A] text-[10px]">Chuva:</span>
                      <span className="font-mono font-bold text-blue-400">{p.chuvaMm} mm ({p.probabilidadeChuvaPct}%)</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#66736A] text-[10px]">Vento:</span>
                      <span className="font-mono text-cyan-400">{p.ventoKmh} km/h</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#66736A] text-[10px]">Delta T:</span>
                      <span className="font-mono font-bold text-emerald-400">{p.deltaTEstimado}°C</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#EAF4E7]/80">
                    <span
                      className={`block text-center py-1 px-1.5 rounded text-[9px] font-bold ${
                        p.janelaPulverizacao === 'RECOMENDADA'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : p.janelaPulverizacao === 'JANELA_CURTA'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {p.janelaPulverizacao === 'RECOMENDADA'
                        ? 'Janela Boa'
                        : p.janelaPulverizacao === 'JANELA_CURTA'
                        ? 'Chuva Prevista'
                        : p.janelaPulverizacao === 'RISCO_DERIVA'
                        ? 'Vento Alto'
                        : 'Evaporação'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: GDD E FENOLOGIA */}
      {viewTab === 'GDD_FENOLOGIA' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#EAF4E7] p-6 rounded-2xl shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-400" /> Acúmulo Térmico de Graus-Dia (GDD) & Fenologia
              </h3>
              <p className="text-xs text-[#66736A] mt-1">
                Acompanhamento da soma térmica para predição precisa da data de florescimento, enchimento de grãos e colheita.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <span className="text-xs text-[#66736A]">GDD Acumulado Hoje:</span>
                <p className="text-2xl font-black text-amber-400 mt-1 font-mono">+{gddHoje.toFixed(1)} °C.dia</p>
                <span className="text-[11px] text-slate-500">Tb = 10°C (Soja)</span>
              </div>

              <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <span className="text-xs text-[#66736A]">Total da Safra:</span>
                <p className="text-2xl font-black text-white mt-1 font-mono">{gddAcumuladoSafra} °C.dia</p>
                <span className="text-[11px] text-emerald-400 font-semibold">68% da soma térmica total</span>
              </div>

              <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <span className="text-xs text-[#66736A]">Estádio Fenológico Atual:</span>
                <p className="text-lg font-bold text-emerald-400 mt-1">R1 (Início Florescimento)</p>
                <span className="text-[11px] text-slate-500">Janela crítica para controle de ferrugem</span>
              </div>

              <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <span className="text-xs text-[#66736A]">Previsão de Maturação R8:</span>
                <p className="text-lg font-bold text-cyan-400 mt-1">05 a 10 de Fevereiro</p>
                <span className="text-[11px] text-slate-500">Restam 660 °C.dia</span>
              </div>
            </div>

            {/* Linha do Tempo Fenológica */}
            <div className="bg-[#F7F9F5] p-5 rounded-xl border border-[#EAF4E7] space-y-3">
              <span className="text-xs font-bold text-white block">Evolução Fenológica da Safra de Soja</span>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                <div className="bg-emerald-600 h-full w-[25%]" title="VE a V4 (Emergência)"></div>
                <div className="bg-teal-500 h-full w-[20%]" title="V5 a V8 (Vegetativo Pleno)"></div>
                <div className="bg-amber-500 h-full w-[25%]" title="R1 a R3 (Floração Atual)"></div>
                <div className="bg-slate-700 h-full w-[15%]" title="R4 a R5 (Enchimento)"></div>
                <div className="bg-slate-800 h-full w-[15%]" title="R6 a R8 (Colheita)"></div>
              </div>
              <div className="flex justify-between text-[11px] text-[#66736A]">
                <span>Emergência (VE)</span>
                <span>Vegetativo (V4)</span>
                <span className="text-amber-400 font-bold">★ Floração R1 (Hoje)</span>
                <span>Enchimento (R5)</span>
                <span>Colheita (R8)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
