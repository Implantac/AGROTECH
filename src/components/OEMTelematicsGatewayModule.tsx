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
  CloudRain,
  Play,
  RotateCcw,
  Zap,
  Gauge
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

interface DecodedCanResult {
  sucesso: boolean;
  canIdHex: string;
  dadosBytesHex: string;
  pgn: number;
  hexPgn: string;
  descricaoPgn: string;
  rpmMotor?: number;
  temperaturaLiquidoArrefecimentoC?: number;
  consumoCombustivelLPorHora?: number;
  tensaoBateriaVolts?: number;
  velocidadeKmH?: number;
  normativa: string;
  timestampMs: number;
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

  // CAN Bus Decoder Live State
  const [selectedPreset, setSelectedPreset] = useState<string>('JD_RPM');
  const [canIdInput, setCanIdInput] = useState<string>('0x0CF00400');
  const [dataBytesInput, setDataBytesInput] = useState<string>('00, 00, 00, 224, 62, 00, 00, 00');
  const [loadingDecoder, setLoadingDecoder] = useState<boolean>(false);
  const [decodedResult, setDecodedResult] = useState<DecodedCanResult | null>({
    sucesso: true,
    canIdHex: '0x0CF00400',
    dadosBytesHex: '00 00 00 E0 3E 00 00 00',
    pgn: 61444,
    hexPgn: '0x00F004',
    descricaoPgn: 'EEC1_ROTACAO_MOTOR_RPM',
    rpmMotor: 2012,
    normativa: 'SAE J1939 / ISO 11783 (ISOBUS)',
    timestampMs: Date.now()
  });

  const presetsCan = [
    {
      id: 'JD_RPM',
      nome: 'John Deere 8370R - Rotação Motor (PGN 61444 EEC1)',
      canId: '0x0CF00400',
      data: '00, 00, 00, 224, 62, 00, 00, 00'
    },
    {
      id: 'CASE_TEMP',
      nome: 'Case Magnum 340 - Temp. Arrefecimento (PGN 65262 ET1)',
      canId: '0x18FEEE00',
      data: '126, 00, 00, 00, 00, 00, 00, 00'
    },
    {
      id: 'NH_FUEL',
      nome: 'New Holland CR8.90 - Consumo Diesel L/h (PGN 65266 LFE)',
      canId: '0x18FEF200',
      data: '88, 02, 00, 00, 00, 00, 00, 00'
    },
    {
      id: 'JACTO_VOLT',
      nome: 'Jacto Uniport 3030 - Tensão Alternador (PGN 65271 VEP1)',
      canId: '0x18FEF700',
      data: '00, 00, 00, 00, 100, 02, 00, 00'
    },
    {
      id: 'VALTRA_SPEED',
      nome: 'Valtra T250 - Velocidade Roda (PGN 65265 CCVS1)',
      canId: '0x18FEF100',
      data: '00, 00, 24, 00, 00, 00, 00, 00'
    }
  ];

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const found = presetsCan.find(p => p.id === presetId);
    if (found) {
      setCanIdInput(found.canId);
      setDataBytesInput(found.data);
    }
  };

  const handleDecodificarFrame = async () => {
    setLoadingDecoder(true);
    try {
      const parsedBytes = dataBytesInput
        .split(',')
        .map(s => parseInt(s.trim(), 10) || 0)
        .slice(0, 8);
      while (parsedBytes.length < 8) parsedBytes.push(0);

      const resp = await fetch('/api/v1/erp/telemetria/canbus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canId: canIdInput,
          data: parsedBytes
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        setDecodedResult(data);
      } else {
        alert('Falha ao decodificar pacote CAN. Verifique formato dos dados.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com gateway CAN local.');
    } finally {
      setLoadingDecoder(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Módulo - Paleta Agro Corporativa */}
      <div className="bg-gradient-to-r from-[#1D4B38] via-[#285943] to-[#3A6B4F] border border-[#5F8F52]/40 rounded-2xl p-6 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold bg-[#EAF4E7] text-[#285943] rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Radio className="w-3.5 h-3.5 text-[#285943]" />
                Módulo 93 • OEM Telematics & Gateway MQTT Edge
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-white/15 text-white/95 border border-white/20 rounded-full">
                John Deere • Case IH • New Holland • Trimble • Jacto • ISOBUS
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              Gateway Universal de Telemetria OEM & Decodificador CAN Bus J1939
            </h2>
            <p className="text-xs sm:text-sm text-[#EAF4E7] max-w-3xl leading-relaxed">
              Integração bidirecional direta via OAuth2 e MQTT Edge com frotas multimarcas conectadas. Recepção de telemetria CAN Bus SAE J1939 / ISO 11783 em tempo real e leitura serial de balanças rodoviárias com buffer offline-first.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3.5 text-center min-w-[130px] shadow-sm">
              <span className="text-[10px] font-bold text-[#EAF4E7] uppercase tracking-wider block">Máquinas Online</span>
              <span className="text-xl font-black text-white">38 Ativas</span>
              <span className="text-[10px] text-[#EAF4E7]/80 block mt-0.5">3 Conectores OEM</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3.5 text-center min-w-[145px] shadow-sm">
              <span className="text-[10px] font-bold text-[#EAF4E7] uppercase tracking-wider block">Fluxo Telemetria</span>
              <span className="text-xl font-black text-[#D9B65D]">3.020 msg/min</span>
              <span className="text-[10px] text-[#EAF4E7]/80 block mt-0.5">Latência Média 48ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-[#5F8F52]/50 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Bridge John Deere</span>
            <Wifi className="w-4 h-4 text-[#5F8F52]" />
          </div>
          <div className="text-2xl font-black text-[#285943]">Conectado</div>
          <div className="text-[11px] text-[#5F8F52] font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tokens OAuth2 Válidos (23h)
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-[#5F8F52]/50 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Balança Rodoviária Edge</span>
            <Scale className="w-4 h-4 text-[#285943]" />
          </div>
          <div className="text-2xl font-black text-[#285943]">Toledo 9091</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Porta COM3 / MQTT Local Ativo
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-[#5F8F52]/50 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Estação Davis Vantage</span>
            <CloudRain className="w-4 h-4 text-[#D9B65D]" />
          </div>
          <div className="text-2xl font-black text-[#285943]">Telemetria 10s</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Chuva, Vento, Delta T e Radiação
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-[#5F8F52]/50 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Buffer Offline em Disco</span>
            <Cpu className="w-4 h-4 text-[#5F8F52]" />
          </div>
          <div className="text-2xl font-black text-[#5F8F52]">Zero Perdas</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Persistência Local SQLite / DuckDB
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('conexoes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'conexoes'
              ? 'bg-[#285943] text-white shadow-md'
              : 'bg-[#F7F9F5] text-[#26332A] hover:bg-[#EAF4E7] border border-[#EAF4E7]'
          }`}
        >
          <Wifi className="w-4 h-4" />
          1. Conexões de Frotas OEM
        </button>

        <button
          onClick={() => setActiveTab('mqtt_edge')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'mqtt_edge'
              ? 'bg-[#285943] text-white shadow-md'
              : 'bg-[#F7F9F5] text-[#26332A] hover:bg-[#EAF4E7] border border-[#EAF4E7]'
          }`}
        >
          <Radio className="w-4 h-4" />
          2. Broker MQTT Edge & Balança
        </button>

        <button
          onClick={() => setActiveTab('can_bus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'can_bus'
              ? 'bg-[#285943] text-white shadow-md'
              : 'bg-[#F7F9F5] text-[#26332A] hover:bg-[#EAF4E7] border border-[#EAF4E7]'
          }`}
        >
          <Cpu className="w-4 h-4" />
          3. Sniffer & Decodificador CAN (J1939)
        </button>

        <button
          onClick={() => setActiveTab('buffer_offline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'buffer_offline'
              ? 'bg-[#285943] text-white shadow-md'
              : 'bg-[#F7F9F5] text-[#26332A] hover:bg-[#EAF4E7] border border-[#EAF4E7]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Buffer de Resiliência Offline
        </button>
      </div>

      {/* Conteúdo Aba 1: Conexões OEM */}
      {activeTab === 'conexoes' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-[#285943] flex items-center gap-2 mb-2">
              <Wifi className="w-5 h-5 text-[#5F8F52]" />
              Sincronização em Nuvem com APIs Oficiais dos Fabricantes
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              A arquitetura conecta com as APIs oficiais dos fabricantes, ingerindo localização GPS em tempo real, velocidade operacional, consumo instantâneo de diesel e alertas de código de falha (DTC).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAF4E7] bg-[#F7F9F5] text-[#66736A] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Fabricante / Plataforma</th>
                    <th className="py-3 px-3">Máquinas</th>
                    <th className="py-3 px-3">Status Autenticação</th>
                    <th className="py-3 px-3">Latência</th>
                    <th className="py-3 px-3">Fluxo Mensagens</th>
                    <th className="py-3 px-3">Último Heartbeat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAF4E7] font-medium">
                  {conexoes.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F7F9F5] transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-[#285943]">{c.nomePlataforma}</div>
                        <div className="text-[11px] text-[#66736A] font-mono">{c.id}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#285943]">{c.maquinasConectadas} máquinas</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF4E7] text-[#285943] border border-[#5F8F52]/40">
                          {c.statusAuth}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#5F8F52] font-bold">{c.latenciaMs} ms</td>
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

      {/* Conteúdo Aba 2: MQTT Edge & Balança */}
      {activeTab === 'mqtt_edge' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#285943] flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#5F8F52]" />
              Balança Rodoviária (Porta Serial RS-232 / MQTT Edge)
            </h3>
            <p className="text-xs text-[#66736A]">
              Captura em tempo real do stream contínuo de caracteres ASCII da balança física da fazenda:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-[#285943] block">Tópico MQTT: fazenda/balanca/peso_bruto</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5 font-mono">
                  Payload atual: &#123; "peso_kg": 48250, "estavel": true, "timestamp": "2026-10-02T19:25:00Z" &#125;
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-[#285943] block">Zero Intervenção Humana</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Quando o caminhão estabiliza na plataforma por mais de 3 segundos, o romaneio é gerado automaticamente com leitura de placa via OCR e peso capturado com precisão metrológica INMETRO.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#285943] flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-[#5F8F52]" />
              Estação Meteorológica Davis Vantage Pro2 Edge
            </h3>
            <p className="text-xs text-[#66736A]">
              Leitura a cada 10 segundos para alimentação direta da janela ótima de pulverização:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Velocidade do Vento:</span>
                <span className="font-mono font-bold text-[#5F8F52]">6.2 km/h (Janela Segura)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Delta T Atual:</span>
                <span className="font-mono font-bold text-[#285943]">4.8°C (Ótimo para Gota Média/Fina)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Chuva Acumulada 24h:</span>
                <span className="font-mono font-bold text-[#D9B65D]">0.0 mm</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: CAN Bus Sniffer & Decodificador Live */}
      {activeTab === 'can_bus' && (
        <div className="space-y-6">
          {/* Card Principal do Decodificador Conectado ao Backend */}
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAF4E7] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#285943] flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#5F8F52]" />
                  Decodificador & Sniffer de Quadros SAE J1939 / ISOBUS 11783
                </h3>
                <p className="text-xs text-[#66736A] mt-0.5">
                  Decodificação estrita de quadros CAN Bus estendidos (29-bit CAN ID) processados pelo microserviço Core ERP da plataforma.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#EAF4E7] text-[#285943] font-bold text-xs rounded-full border border-[#5F8F52]/40 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#5F8F52]" /> API REST: /api/v1/erp/telemetria/canbus
                </span>
              </div>
            </div>

            {/* Presets Rápidos de Frotas Agrícolas */}
            <div>
              <label className="text-xs font-bold text-[#285943] block mb-2">
                Selecione um Quadro CAN de Amostra de Frota Rural:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {presetsCan.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-3 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                      selectedPreset === preset.id
                        ? 'bg-[#EAF4E7] border-[#285943] text-[#285943] font-bold shadow-sm'
                        : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:bg-white'
                    }`}
                  >
                    <span className="block font-semibold text-[#26332A]">{preset.nome}</span>
                    <span className="font-mono text-[11px] text-[#5F8F52] mt-0.5 block">{preset.canId}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs de Teste Interativo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#66736A] block mb-1">
                  CAN-ID (Hexadecimal 29 bits):
                </label>
                <input
                  type="text"
                  value={canIdInput}
                  onChange={(e) => setCanIdInput(e.target.value)}
                  className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#285943] focus:outline-none focus:border-[#285943]"
                  placeholder="0x0CF00400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-[#66736A] block mb-1">
                  Payload de Dados (8 Bytes decimais separados por vírgula):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={dataBytesInput}
                    onChange={(e) => setDataBytesInput(e.target.value)}
                    className="flex-1 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-xs font-mono text-[#26332A] focus:outline-none focus:border-[#285943]"
                    placeholder="00, 00, 00, 224, 62, 00, 00, 00"
                  />
                  <button
                    onClick={handleDecodificarFrame}
                    disabled={loadingDecoder}
                    className="px-4 py-2 bg-[#285943] hover:bg-[#1D4B38] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {loadingDecoder ? 'Decodificando...' : 'Decodificar Quadro'}
                  </button>
                </div>
              </div>
            </div>

            {/* Resultado Decodificado em Tempo Real */}
            {decodedResult && (
              <div className="bg-[#F7F9F5] border border-[#8FBF88]/50 rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAF4E7] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#EAF4E7] text-[#285943] font-mono font-bold text-xs rounded border border-[#5F8F52]/40">
                      PGN {decodedResult.pgn} ({decodedResult.hexPgn})
                    </span>
                    <span className="text-xs font-bold text-[#285943]">
                      {decodedResult.descricaoPgn}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#66736A]">
                    Padrão: {decodedResult.normativa}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white p-3 rounded-lg border border-[#EAF4E7]">
                    <span className="text-[10px] text-[#66736A] uppercase font-bold block">CAN-ID 29b</span>
                    <span className="text-sm font-black font-mono text-[#285943] mt-0.5 block">{decodedResult.canIdHex}</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#EAF4E7]">
                    <span className="text-[10px] text-[#66736A] uppercase font-bold block">Bytes Hexadecimais</span>
                    <span className="text-xs font-black font-mono text-[#5F8F52] mt-0.5 block truncate">{decodedResult.dadosBytesHex}</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#EAF4E7]">
                    <span className="text-[10px] text-[#66736A] uppercase font-bold block">Métrica Extraída</span>
                    <span className="text-base font-black font-mono text-[#285943] mt-0.5 block">
                      {decodedResult.rpmMotor !== undefined && `${decodedResult.rpmMotor} RPM`}
                      {decodedResult.temperaturaLiquidoArrefecimentoC !== undefined && `${decodedResult.temperaturaLiquidoArrefecimentoC} °C`}
                      {decodedResult.consumoCombustivelLPorHora !== undefined && `${decodedResult.consumoCombustivelLPorHora} L/h`}
                      {decodedResult.tensaoBateriaVolts !== undefined && `${decodedResult.tensaoBateriaVolts} V`}
                      {decodedResult.velocidadeKmH !== undefined && `${decodedResult.velocidadeKmH} km/h`}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#EAF4E7]">
                    <span className="text-[10px] text-[#66736A] uppercase font-bold block">Status do Barramento</span>
                    <span className="text-xs font-bold text-[#5F8F52] mt-0.5 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5F8F52]" /> Frame Válido
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Buffer Offline */}
      {activeTab === 'buffer_offline' && (
        <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#285943] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#5F8F52]" />
            Arquitetura Offline-First de Tolerância a Falhas de Conexão Rural
          </h3>
          <p className="text-xs text-[#66736A]">
            Quando a conexão Starlink ou 4G oscila no talhão durante o plantio ou colheita, o gateway local ativa automaticamente a fila de persistência FIFO em disco:
          </p>

          <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]">
              <span className="text-[#66736A]">Capacidade de Retenção Local:</span>
              <span className="font-mono font-bold text-[#285943]">Até 90 dias ininterruptos de telemetria</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]">
              <span className="text-[#66736A]">Algoritmo de Compressão:</span>
              <span className="font-mono font-bold text-[#5F8F52]">Zstandard (Zstd) com 8x redução de banda</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#66736A]">Sincronização Automática:</span>
              <span className="font-mono font-bold text-[#D9B65D]">Reenvio em blocos assim que o sinal retorna</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OEMTelematicsGatewayModule;
