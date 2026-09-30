import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  Box,
  Truck,
  Leaf,
  Filter,
  DollarSign,
  Activity,
  Award,
  Cpu,
  Radio,
  Wifi,
  Compass,
  Zap,
  Play
} from 'lucide-react';

interface RoboAutonomo {
  id: string;
  nome: string;
  tipo: 'TRATOR_AUTONOMO_ELETRICO' | 'DRONE_PULVERIZACAO_PESADA' | 'ROVER_FENOTIPAGEM_SOLO';
  bateriaPct: number;
  missaoAtual: string;
  posicaoGpsRtk: string;
  velocidadeKmH: number;
  status: 'EM_OPERACAO' | 'RETORNANDO_BASE_RECARGA' | 'AGUARDANDO_MISSÃO';
}

export const OrquestradorAutonomo40Module: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'frota' | 'missoes' | 'digital_twin' | 'simulador'>('frota');

  // Frota Autônoma Nível 4 (ISO 18497)
  const [frota] = useState<RoboAutonomo[]>([
    {
      id: 'AUTON-ROBOT-01',
      nome: 'Titan E-Tractor 400 • Trator Autônomo 100% Elétrico',
      tipo: 'TRATOR_AUTONOMO_ELETRICO',
      bateriaPct: 88,
      missaoAtual: 'Descompactação & Semeadura Direta em Taxa Variável (Talhão 04)',
      posicaoGpsRtk: 'Lat -12.4489, Lon -55.8231 (Precisão 1.5 cm)',
      velocidadeKmH: 7.2,
      status: 'EM_OPERACAO',
    },
    {
      id: 'AUTON-DRONE-02',
      nome: 'AeroSwarm Hexa 70L • Enxame de Pulverização Noturna',
      tipo: 'DRONE_PULVERIZACAO_PESADA',
      bateriaPct: 64,
      missaoAtual: 'Aplicação Seletiva de Bioinsumos em Reboleiras de Ferrugem',
      posicaoGpsRtk: 'Lat -12.4495, Lon -55.8219 (Precisão 1.0 cm)',
      velocidadeKmH: 22.0,
      status: 'EM_OPERACAO',
    },
    {
      id: 'AUTON-ROVER-03',
      nome: 'BioScout Rover Terrestre • Scanner Multiespectral de Raiz',
      tipo: 'ROVER_FENOTIPAGEM_SOLO',
      bateriaPct: 92,
      missaoAtual: 'Leitura de Condutividade Elétrica e Matéria Orgânica do Solo',
      posicaoGpsRtk: 'Lat -12.4510, Lon -55.8205 (Precisão 2.0 cm)',
      velocidadeKmH: 4.5,
      status: 'EM_OPERACAO',
    },
  ]);

  // Simulador Econômico da Autonomia Agrícola
  const [areaTotalHa, setAreaTotalHa] = useState<number>(2450);
  const [reducaoDieselLitrosAno, setReducaoDieselLitrosAno] = useState<number>(145000);
  const [precoLitroDieselReais, setPrecoLitroDieselReais] = useState<number>(6.20);
  const [economiaQuimicosPct, setEconomiaQuimicosPct] = useState<number>(34.0);
  const [gastoAnualQuimicosOriginalReais, setGastoAnualQuimicosOriginalReais] = useState<number>(2800000.0);
  const [custoManutencaoEnxameAnoReais, setCustoManutencaoEnxameAnoReais] = useState<number>(420000.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const economiaCombustivelReais = reducaoDieselLitrosAno * precoLitroDieselReais;
    const economiaDefensivosReais = (gastoAnualQuimicosOriginalReais * economiaQuimicosPct) / 100;
    const economiaTotalBrutaReais = economiaCombustivelReais + economiaDefensivosReais;

    const saldoLiquidoEconomiaReais = Number((economiaTotalBrutaReais - custoManutencaoEnxameAnoReais).toFixed(2));
    const economiaPorHaReais = Number((saldoLiquidoEconomiaReais / (areaTotalHa || 1)).toFixed(2));

    return {
      economiaCombustivelReais,
      economiaDefensivosReais,
      economiaTotalBrutaReais,
      saldoLiquidoEconomiaReais,
      economiaPorHaReais,
    };
  }, [
    areaTotalHa,
    reducaoDieselLitrosAno,
    precoLitroDieselReais,
    economiaQuimicosPct,
    gastoAnualQuimicosOriginalReais,
    custoManutencaoEnxameAnoReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950/80 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Módulo 100 • Marco Histórico • Orquestrador Autônomo 4.0
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Autonomia Nível 4 ISO 18497 • Swarm Robotics
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🤖 Central Autônoma 4.0: Enxame Robótico & Gêmeo Digital
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              O ápice da agricultura 4.0 em escala corporativa: orquestração autônoma de enxames de tratores elétricos sem cabine, drones de alta vazão e rovers de solo guiados por GPS-RTK centimétrico, IA de visão computacional em borda e conectividade 5G Privada/Starlink.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Área Coberta</span>
              <span className="text-xl font-black text-cyan-400">2.450 ha</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Sem Operador Físico</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Economia Anual</span>
              <span className="text-xl font-black text-emerald-400">R$ 1,43M</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">Diesel & Insumos</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Grau de Autonomia</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">Nível 4 (ISO 18497)</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Parada de Emergência & LiDAR 3D
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Economia de Diesel</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">- 145.000 L / ano</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Propulsão Elétrica Recarregável Solar
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Redução de Químicos</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">- 34.0% Insumos</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Pulverização Milimétrica em Alvo
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Saldo Líquido Gerado</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">R$ 1.431.000,00</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            R$ 584,00 por hectare de economia
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('frota')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'frota'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          1. Frota Autônoma & Enxame
        </button>

        <button
          onClick={() => setActiveTab('missoes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'missoes'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Play className="w-4 h-4" />
          2. Despachador de Missões IA
        </button>

        <button
          onClick={() => setActiveTab('digital_twin')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'digital_twin'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          3. Gêmeo Digital (Digital Twin)
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador de Retorno Financeiro
        </button>
      </div>

      {/* Conteúdo Aba 1: Frota */}
      {activeTab === 'frota' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Telemetria Ativa dos Veículos Autônomos de Campo
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Cada máquina possui fusão de sensores com LiDAR estéreo 3D, câmeras térmicas, radares de ondas milimétricas e computador de bordo NVIDIA Jetson Orin para tomada de decisão em tempo real (&lt; 10 ms).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Veículo / Robô</th>
                    <th className="py-3 px-3">Tipo</th>
                    <th className="py-3 px-3">Bateria</th>
                    <th className="py-3 px-3">Velocidade</th>
                    <th className="py-3 px-3">Localização RTK</th>
                    <th className="py-3 px-3">Missão em Curso</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {frota.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{r.nome}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{r.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-cyan-300 font-semibold">{r.tipo}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">{r.bateriaPct}%</td>
                      <td className="py-3.5 px-3 font-mono text-white">{r.velocidadeKmH} km/h</td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">{r.posicaoGpsRtk}</td>
                      <td className="py-3.5 px-3 text-slate-200">{r.missaoAtual}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Missões */}
      {activeTab === 'missoes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-cyan-400" />
              Despacho Automatizado por Gatilhos Agronômicos
            </h3>
            <p className="text-xs text-slate-400">
              O orquestrador gera ordens de serviço autônomas sem intervenção humana baseado em telemetria:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Gatilho: Anomalia de Vigor NDVI Detectada por Satélite</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Despacha automaticamente o Rover BioScout para o ponto georreferenciado para checagem in situ e envio de fotos macro.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Gatilho: Umidade Relativa Favorável à Ferrugem Noturna</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Decolagem coordenada de 3 drones AeroSwarm para aplicação localizada entre 22h e 04h, sem vento térmico.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Segurança Operacional e Geofencing
            </h3>
            <p className="text-xs text-slate-400">
              Protocolos de contenção estritos e certificação internacional:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Cerca Virtual (Geofencing Rígido):</span>
                <span className="font-mono font-bold text-emerald-400">Zero Invasão de Estradas</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Tempo de Parada de Emergência:</span>
                <span className="font-mono font-bold text-cyan-400">&lt; 0.20 segundos</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Digital Twin */}
      {activeTab === 'digital_twin' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Radio className="w-5 h-5 text-indigo-400" />
              Gêmeo Digital (Digital Twin) da Propriedade em 3D
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Representação digital contínua da fazenda: modelo digital de elevação (DEM), histórico de compactação das trilhas de tráfego controlado (CTF), mapa de umidade da raiz a 40 cm e previsão microclimática por hiperespectro.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Latência 5G Borda</span>
                <span className="text-2xl font-black text-white font-mono">&lt; 8 ms</span>
                <span className="text-[11px] text-emerald-400 block">Comunicação Máquina a Máquina (M2M)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tráfego Controlado (CTF)</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">100% Repetibilidade</span>
                <span className="text-[11px] text-slate-400 block">Redução de 80% na compactação</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Disponibilidade Noturna</span>
                <span className="text-2xl font-black text-indigo-400 font-mono">24 Horas / Dia</span>
                <span className="text-[11px] text-slate-400 block">Sem fadiga de operador</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Parâmetros da Operação Autônoma
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Área Total da Fazenda (ha)</span>
                <span className="font-mono text-cyan-400">{areaTotalHa} hectares</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={areaTotalHa}
                onChange={(e) => setAreaTotalHa(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Diesel Economizado (Litros/Ano)</span>
                <span className="font-mono text-amber-400">{reducaoDieselLitrosAno.toLocaleString()} L</span>
              </div>
              <input
                type="range"
                min="30000"
                max="300000"
                step="5000"
                value={reducaoDieselLitrosAno}
                onChange={(e) => setReducaoDieselLitrosAno(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Economia com Químicos (%)</span>
                <span className="font-mono text-emerald-400">{economiaQuimicosPct}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="50"
                step="1"
                value={economiaQuimicosPct}
                onChange={(e) => setEconomiaQuimicosPct(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Custo Manutenção do Enxame / Ano</span>
                <span className="font-mono text-rose-400">R$ {custoManutencaoEnxameAnoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="1000000"
                step="20000"
                value={custoManutencaoEnxameAnoReais}
                onChange={(e) => setCustoManutencaoEnxameAnoReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Ganhos Financeiros da Autonomia 4.0
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Diesel Poupado</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  R$ {(metricas.economiaCombustivelReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-amber-400/80 block">Elétrico Solar</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Insumos Menos</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricas.economiaDefensivosReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-400/80 block">Spot-Spray</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Economia Líquida</span>
                <span className="font-mono font-bold text-cyan-400 text-base">
                  R$ {(metricas.saldoLiquidoEconomiaReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-cyan-400/80 block">Livre de manutenção</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ganho por Ha</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {metricas.economiaPorHaReais.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block">Por Hectare/Ano</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Economia Direta em Diesel ({reducaoDieselLitrosAno.toLocaleString()} L @ R$ {precoLitroDieselReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-white">
                  + R$ {metricas.economiaCombustivelReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Economia em Defensivos e Fertilizantes por Aplicação Seletiva ({economiaQuimicosPct}%):</span>
                <span className="font-mono font-bold text-emerald-400">
                  + R$ {metricas.economiaDefensivosReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Custo Anual de Manutenção de Baterias, Sensores e Links 5G:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {custoManutencaoEnxameAnoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-cyan-950/30 px-3 rounded-lg border border-cyan-800/50">
                <span className="text-white">Saldo Líquido de Eficiência Econômica Gerado:</span>
                <span className="font-mono text-cyan-300">
                  R$ {metricas.saldoLiquidoEconomiaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrquestradorAutonomo40Module;
