import React, { useState } from 'react';
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
  Radio,
  Cpu,
  Wifi,
  Scale,
  CloudRain
} from 'lucide-react';

interface ConexaoOEM {
  id: string;
  marca: 'JOHN_DEERE' | 'CASE_IH' | 'NEW_HOLLAND' | 'TRIMBLE' | 'CLIMATE_FIELDVIEW';
  nomePlataforma: string;
  maquinasConectadas: number;
  statusAuth: 'CONECTADO_OAUTH2' | 'SINCRONIZANDO' | 'TOKEN_EXPIRANDO';
  latenciaMs: number;
  pacotesPorMinuto: number;
  ultimaSincronizacao: string;
}

export const OEMTelematicsGatewayModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'conexoes' | 'mqtt_edge' | 'can_bus' | 'buffer_offline'>('conexoes');

  // Conexões de Fabricantes OEM
  const [conexoes] = useState<ConexaoOEM[]>([
    {
      id: 'OEM-01',
      marca: 'JOHN_DEERE',
      nomePlataforma: 'John Deere Operations Center API v4',
      maquinasConectadas: 18,
      statusAuth: 'CONECTADO_OAUTH2',
      latenciaMs: 42,
      pacotesPorMinuto: 1420,
      ultimaSincronizacao: 'Agora (há 2 seg)',
    },
    {
      id: 'OEM-02',
      marca: 'CASE_IH',
      nomePlataforma: 'Case IH AFS Connect Telematics Bridge',
      maquinasConectadas: 12,
      statusAuth: 'CONECTADO_OAUTH2',
      latenciaMs: 58,
      pacotesPorMinuto: 980,
      ultimaSincronizacao: 'Agora (há 4 seg)',
    },
    {
      id: 'OEM-03',
      marca: 'CLIMATE_FIELDVIEW',
      nomePlataforma: 'Bayer Climate FieldView Cloud Sync',
      maquinasConectadas: 8,
      statusAuth: 'CONECTADO_OAUTH2',
      latenciaMs: 65,
      pacotesPorMinuto: 620,
      ultimaSincronizacao: 'Há 12 seg',
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/70 border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                Módulo 93 • OEM Telematics & Gateway MQTT Edge
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                John Deere • Case IH • Trimble • ISOBUS
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🛰️ Gateway Universal de Telemetria OEM & MQTT Local
            </h2>
            <p className="text-sm text-[#26332A] max-w-3xl leading-relaxed">
              Integração bidirecional direta via OAuth2 e MQTT Edge com frotas multimarcas conectadas. Recepção de telemetria CAN Bus J1939/ISOBUS em tempo real e comunicação serial de balanças rodoviárias com buffer offline-first.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Máquinas Online</span>
              <span className="text-xl font-black text-blue-400">38 Ativas</span>
              <span className="text-[10px] text-[#66736A] block mt-0.5">3 Conectores OEM</span>
            </div>
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Fluxo Telemetria</span>
              <span className="text-xl font-black text-emerald-400">3.020 msg/min</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">Latência Média 48ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Bridge John Deere</span>
            <Wifi className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">Conectado</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tokens OAuth2 Válidos (23h)
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Balança Rodoviária Edge</span>
            <Scale className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">Toledo 9091</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Porta COM3 / MQTT Local Ativo
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Estação Davis Vantage</span>
            <CloudRain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">Telemetria 10s</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Chuva, Vento, Delta T e Radiação
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Buffer Offline em Disco</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">Zero Perdas</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Persistência Local SQLite / DuckDB
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('conexoes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'conexoes'
              ? 'bg-blue-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Wifi className="w-4 h-4" />
          1. Conexões de Frotas OEM
        </button>

        <button
          onClick={() => setActiveTab('mqtt_edge')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'mqtt_edge'
              ? 'bg-blue-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Radio className="w-4 h-4" />
          2. Broker MQTT Edge & Dispositivos
        </button>

        <button
          onClick={() => setActiveTab('can_bus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'can_bus'
              ? 'bg-blue-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Cpu className="w-4 h-4" />
          3. Monitor de Mensagens CAN (J1939)
        </button>

        <button
          onClick={() => setActiveTab('buffer_offline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'buffer_offline'
              ? 'bg-blue-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Buffer de Resiliência Offline
        </button>
      </div>

      {/* Conteúdo Aba 1: Conexões */}
      {activeTab === 'conexoes' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Wifi className="w-5 h-5 text-blue-400" />
              Sincronização em Nuvem com Plataformas de Fabricantes
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              A arquitetura conecta com as APIs oficiais dos fabricantes, ingerindo localização GPS em tempo real, velocidade operacional, consumo instantâneo de diesel e alertas de código de falha (DTC).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAF4E7] text-[#66736A] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Fabricante / Plataforma</th>
                    <th className="py-3 px-3">Máquinas</th>
                    <th className="py-3 px-3">Status Autenticação</th>
                    <th className="py-3 px-3">Latência</th>
                    <th className="py-3 px-3">Fluxo Mensagens</th>
                    <th className="py-3 px-3">Último Heartbeat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {conexoes.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{c.nomePlataforma}</div>
                        <div className="text-[11px] text-[#66736A] font-mono">{c.id}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-blue-400">{c.maquinasConectadas} máquinas</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {c.statusAuth}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-cyan-400">{c.latenciaMs} ms</td>
                      <td className="py-3.5 px-3 font-mono text-[#26332A]">{c.pacotesPorMinuto} msg/min</td>
                      <td className="py-3.5 px-3 text-[#66736A]">{c.ultimaSincronizacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: MQTT Edge */}
      {activeTab === 'mqtt_edge' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-cyan-400" />
              Balança Rodoviária (Porta Serial RS-232 / MQTT)
            </h3>
            <p className="text-xs text-[#66736A]">
              Captura em tempo real do stream contínuo de caracteres ASCII da balança física da fazenda:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Tópico MQTT: fazenda/balanca/peso_bruto</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Payload atual: &#123; "peso_kg": 48250, "estavel": true, "timestamp": "2026-09-30T14:20:00Z" &#125;
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Zero Intervenção Humana</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Quando o caminhão estabiliza na plataforma por mais de 3 segundos, o romaneio é gerado automaticamente com leitura de placa via OCR.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-amber-400" />
              Estação Meteorológica Davis Vantage Pro2
            </h3>
            <p className="text-xs text-[#66736A]">
              Leitura a cada 10 segundos para alimentação do módulo de pulverização:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Velocidade do Vento:</span>
                <span className="font-mono font-bold text-emerald-400">6.2 km/h (Janela Segura)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Delta T Atual:</span>
                <span className="font-mono font-bold text-cyan-400">4.8°C (Ótimo para Gota Fina)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Chuva Acumulada 24h:</span>
                <span className="font-mono font-bold text-amber-300">0.0 mm</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: CAN Bus */}
      {activeTab === 'can_bus' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              Sniffer de Pacotes SAE J1939 / ISOBUS em Tempo Real
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              Decodificação estrita de Parameter Group Numbers (PGN) transmitidos na rede CAN a 250 kbps:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">PGN 65262 (SPN 110)</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">86°C</span>
                <span className="text-[11px] text-[#66736A] block">Temperatura Fluido Motor</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">PGN 65266 (SPN 183)</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">30.0 L/h</span>
                <span className="text-[11px] text-[#66736A] block">Consumo de Combustível</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">PGN 65271 (SPN 168)</span>
                <span className="text-2xl font-black text-amber-400 font-mono">27.8 V</span>
                <span className="text-[11px] text-[#66736A] block">Tensão do Alternador</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Buffer Offline */}
      {activeTab === 'buffer_offline' && (
        <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Arquitetura Offline-First de Tolerância a Falhas de Internet Rural
          </h3>
          <p className="text-xs text-[#66736A]">
            Quando a conexão Starlink ou 4G oscila no campo, o gateway local ativa automaticamente a fila de persistência FIFO em disco:
          </p>

          <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]">
              <span className="text-[#66736A]">Capacidade de Retenção Local:</span>
              <span className="font-mono font-bold text-emerald-400">Até 90 dias ininterruptos de telemetria</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]">
              <span className="text-[#66736A]">Algoritmo de Compressão:</span>
              <span className="font-mono font-bold text-cyan-400">Zstandard (Zstd) com 8x redução de banda</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#66736A]">Sincronização Automática:</span>
              <span className="font-mono font-bold text-amber-400">Reenvio em blocos assim que o sinal retorna</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OEMTelematicsGatewayModule;
