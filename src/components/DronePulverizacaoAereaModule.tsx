import React, { useState } from 'react';
import {
  Plane,
  Radio,
  BatteryCharging,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Compass,
  Sliders,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

export interface DroneOperacao {
  id: string;
  modeloDrone: string;
  identificacaoAnac: string;
  pilotoRemoto: string;
  talhaoAlvoId: string;
  capacidadeTanqueLitros: number;
  taxaAplicacaoLha: number;
  larguraFaixaMetros: number;
  velocidadeVooKmh: number;
  alturaVooMetros: number;
  densidadeGotasCm2: number;
  statusVoo: 'EM_VOO_APLICANDO' | 'REABASTECENDO_BATERIA' | 'POUSADO_BASE';
  bateriaPct: number;
  haAplicadosHoje: number;
}

const DRONES_INICIAIS: DroneOperacao[] = [
  {
    id: 'dr-01',
    modeloDrone: 'DJI Agras T50 (Capacidade 50L)',
    identificacaoAnac: 'PP-AGR-04128',
    pilotoRemoto: 'Piloto Certificado Rafael Medeiros (DECEA)',
    talhaoAlvoId: 'talhao-02',
    capacidadeTanqueLitros: 50,
    taxaAplicacaoLha: 15.0,
    larguraFaixaMetros: 11.0,
    velocidadeVooKmh: 25.0,
    alturaVooMetros: 3.5,
    densidadeGotasCm2: 56,
    statusVoo: 'EM_VOO_APLICANDO',
    bateriaPct: 74,
    haAplicadosHoje: 85.0,
  },
  {
    id: 'dr-02',
    modeloDrone: 'XAG P100 Pro (Capacidade 50L)',
    identificacaoAnac: 'PP-AGR-04129',
    pilotoRemoto: 'Piloto Certificado Fernando Dias',
    talhaoAlvoId: 'talhao-04',
    capacidadeTanqueLitros: 50,
    taxaAplicacaoLha: 12.0,
    larguraFaixaMetros: 10.5,
    velocidadeVooKmh: 24.0,
    alturaVooMetros: 3.2,
    densidadeGotasCm2: 62,
    statusVoo: 'REABASTECENDO_BATERIA',
    bateriaPct: 98,
    haAplicadosHoje: 62.0,
  },
];

export const DronePulverizacaoAereaModule: React.FC = () => {
  const [drones] = useState<DroneOperacao[]>(DRONES_INICIAIS);

  // Parâmetros da Calculadora de Rendimento do Drone
  const [calcFaixaMetros, setCalcFaixaMetros] = useState<number>(11.0);
  const [calcVelocidadeKmh, setCalcVelocidadeKmh] = useState<number>(25.0);
  const [calcEficienciaPct, setCalcEficienciaPct] = useState<number>(75.0);
  const [calcGotasCm2, setCalcGotasCm2] = useState<number>(56);

  const rendimentoHaHora = Number(
    ((calcFaixaMetros * calcVelocidadeKmh * (calcEficienciaPct / 100)) / 10).toFixed(1)
  );

  let statusCobertura = 'IDEAL (40 a 70 gotas/cm²)';
  if (calcGotasCm2 < 40) statusCobertura = 'BAIXA COBERTURA (Risco de Falha)';
  else if (calcGotasCm2 > 80) statusCobertura = 'ALTO VOLUME (Risco de Escorrimento)';

  const totalHaHoje = drones.reduce((acc, curr) => acc + curr.haAplicadosHoje, 0);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">Drones & Aplicação Aérea de Precisão</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  Telemetria ANAC / DECEA
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Ultrabaixo Volume (UBV)
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                Plano de voo autônomo por talhão, espectro de gotas em papel hidrossensível e rendimento operacional ($ha/h$).
              </p>
            </div>
          </div>
        </div>

        {/* Resumo da Operação */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Área Coberta Hoje:</span>
            <span className="text-emerald-400 font-bold font-mono">{totalHaHoje.toFixed(1)} hectares</span>
          </div>
        </div>
      </div>

      {/* Cards de Métricas de Voo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Aeronaves em Operação</span>
            <Plane className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">2 Drones de Carga</div>
          <p className="text-xs text-slate-500 mt-1">DJI Agras T50 + XAG P100 Pro</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Rendimento de Voo</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 font-mono">20.6 ha/h</div>
          <p className="text-xs text-slate-500 mt-1">Com trocas rápidas de bateria</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Taxa de Aplicação (UBV)</span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300 font-mono">15.0 L/ha</div>
          <p className="text-xs text-slate-500 mt-1">Economia de 90% de água vs trator</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Deposição de Gotas</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-300 font-mono">56 gotas/cm²</div>
          <p className="text-xs text-emerald-400/80 mt-1">DVM 180 µm (Anti-deriva)</p>
        </div>
      </div>

      {/* Grid: Telemetria da Frota de Drones + Calculadora de Faixa & Gotas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel da Frota de Drones (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-400" />
                Telemetria de Voo e Pulverização Aérea em Tempo Real
              </h2>
              <p className="text-xs text-slate-400">Posicionamento RTK centimétrico e controle de vazão por bico centrífugo</p>
            </div>
          </div>

          <div className="space-y-4">
            {drones.map((drone) => {
              const talhao = TALHOES_INICIAIS.find((t) => t.id === drone.talhaoAlvoId);

              return (
                <div key={drone.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Plane className="w-4 h-4 text-blue-400" />
                        {drone.modeloDrone}
                      </h3>
                      <div className="text-[11px] text-slate-400">{drone.pilotoRemoto} • {drone.identificacaoAnac}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-mono text-cyan-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                        {drone.bateriaPct}% Bateria
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          drone.statusVoo === 'EM_VOO_APLICANDO'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {drone.statusVoo === 'EM_VOO_APLICANDO' ? 'PULVERIZANDO' : 'BASE DE RECARGA'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 bg-slate-900 rounded-lg">
                      <span className="text-slate-500 text-[10px] uppercase block">Talhão Alvo:</span>
                      <span className="font-bold text-slate-200">{talhao ? talhao.codigo : drone.talhaoAlvoId}</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg font-mono">
                      <span className="text-slate-500 text-[10px] uppercase block">Taxa de Aplicação:</span>
                      <span className="font-bold text-emerald-400">{drone.taxaAplicacaoLha} L/ha</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg font-mono">
                      <span className="text-slate-500 text-[10px] uppercase block">Faixa de Voo:</span>
                      <span className="font-bold text-slate-200">{drone.larguraFaixaMetros} m ({drone.alturaVooMetros}m alt.)</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg font-mono">
                      <span className="text-slate-500 text-[10px] uppercase block">Área Aplicada Hoje:</span>
                      <span className="font-bold text-cyan-300">{drone.haAplicadosHoje} ha</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calculadora de Voo & Espectro de Gotas (1 col) */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-slate-100">Calculador de Voo do Drone</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Calcule a produtividade operacional ($ha/h$) considerando tempo de voo e recarga rápida:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Largura da Faixa de Aplicação (m):</label>
                <input
                  type="number"
                  step="0.5"
                  value={calcFaixaMetros}
                  onChange={(e) => setCalcFaixaMetros(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Velocidade de Deslocamento (km/h):</label>
                <input
                  type="number"
                  step="1"
                  value={calcVelocidadeKmh}
                  onChange={(e) => setCalcVelocidadeKmh(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Eficiência Operacional (%):</label>
                <input
                  type="number"
                  step="5"
                  value={calcEficienciaPct}
                  onChange={(e) => setCalcEficienciaPct(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Gotas por cm² (Papel Hidrossensível):</label>
                <input
                  type="number"
                  step="2"
                  value={calcGotasCm2}
                  onChange={(e) => setCalcGotasCm2(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-950/30 border border-blue-800/40 rounded-xl text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span>Rendimento Estimado:</span>
              <span className="font-mono font-bold text-slate-100">{rendimentoHaHora} ha / hora</span>
            </div>
            <div className="border-t border-blue-900/50 pt-2 flex justify-between items-center">
              <span className="font-bold text-slate-100">Avaliação da Deposição:</span>
              <span className="font-mono font-bold text-emerald-300 text-[11px]">
                {statusCobertura}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DronePulverizacaoAereaModule;
