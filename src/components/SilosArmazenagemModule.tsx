import React, { useState, useEffect } from 'react';
import {
  Warehouse,
  Flame,
  Thermometer,
  Fan,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Boxes,
  Zap,
  DollarSign,
  TrendingUp,
  Percent,
  Sliders,
  Sparkles,
  Radio
} from 'lucide-react';

export interface SiloData {
  id: string;
  codigo: string;
  nome: string;
  tipo: 'SILO_ARMAZENADOR' | 'SILO_PULMAO';
  capacidadeSacas: number;
  saldoAtualSacas: number;
  cultura: string;
  umidadeMediaPct: number;
  temperaturaMediaC: number;
  statusAeracao: 'LIGADA' | 'DESLIGADA';
  cabosTermometria: {
    caboId: string;
    sensores: { profundidade: string; tempC: number; status: 'NORMAL' | 'AQUECIMENTO' }[];
  }[];
}

const SILOS_INICIAIS: SiloData[] = [
  {
    id: 'silo-01',
    codigo: 'SILO-01',
    nome: 'Silo Armazenador Kepler Weber 01',
    tipo: 'SILO_ARMAZENADOR',
    capacidadeSacas: 60000,
    saldoAtualSacas: 50400,
    cultura: 'Soja M5947 (Padrão Exportação)',
    umidadeMediaPct: 13.8,
    temperaturaMediaC: 23.4,
    statusAeracao: 'DESLIGADA',
    cabosTermometria: [
      {
        caboId: 'Cabo 1 (Central)',
        sensores: [
          { profundidade: 'Topo (18m)', tempC: 24.1, status: 'NORMAL' },
          { profundidade: 'Médio (10m)', tempC: 23.5, status: 'NORMAL' },
          { profundidade: 'Fundo (2m)', tempC: 22.8, status: 'NORMAL' },
        ],
      },
      {
        caboId: 'Cabo 2 (Periférico Leste)',
        sensores: [
          { profundidade: 'Topo (18m)', tempC: 25.2, status: 'NORMAL' },
          { profundidade: 'Médio (10m)', tempC: 29.8, status: 'AQUECIMENTO' }, // Ponto quente
          { profundidade: 'Fundo (2m)', tempC: 23.1, status: 'NORMAL' },
        ],
      },
    ],
  },
  {
    id: 'silo-02',
    codigo: 'SILO-02',
    nome: 'Silo Armazenador Kepler Weber 02',
    tipo: 'SILO_ARMAZENADOR',
    capacidadeSacas: 60000,
    saldoAtualSacas: 37200,
    cultura: 'Soja BMX Desafio',
    umidadeMediaPct: 14.0,
    temperaturaMediaC: 22.6,
    statusAeracao: 'DESLIGADA',
    cabosTermometria: [
      {
        caboId: 'Cabo 1 (Central)',
        sensores: [
          { profundidade: 'Topo (18m)', tempC: 23.0, status: 'NORMAL' },
          { profundidade: 'Médio (10m)', tempC: 22.4, status: 'NORMAL' },
          { profundidade: 'Fundo (2m)', tempC: 22.1, status: 'NORMAL' },
        ],
      },
    ],
  },
  {
    id: 'silo-pulmao',
    codigo: 'PULMAO-01',
    nome: 'Silo Pulmão Carga Úmida',
    tipo: 'SILO_PULMAO',
    capacidadeSacas: 15000,
    saldoAtualSacas: 13800,
    cultura: 'Soja Úmida (Fila Secagem)',
    umidadeMediaPct: 18.2,
    temperaturaMediaC: 26.5,
    statusAeracao: 'LIGADA',
    cabosTermometria: [
      {
        caboId: 'Cabo Central',
        sensores: [
          { profundidade: 'Topo (12m)', tempC: 27.0, status: 'NORMAL' },
          { profundidade: 'Médio (6m)', tempC: 26.8, status: 'NORMAL' },
          { profundidade: 'Fundo (2m)', tempC: 25.9, status: 'NORMAL' },
        ],
      },
    ],
  },
];

export const SilosArmazenagemModule: React.FC = () => {
  const [silos, setSilos] = useState<SiloData[]>(SILOS_INICIAIS);
  const [siloSelecionadoId, setSiloSelecionadoId] = useState<string>('silo-01');
  const [iotTermometriaLive, setIotTermometriaLive] = useState<boolean>(true);

  // Polling dos Sensores de Termometria dos Cabos
  useEffect(() => {
    let ativo = true;
    const fetchSilosTelemetry = async () => {
      try {
        const resp = await fetch('/api/v1/telemetria/sensores/live');
        if (resp.ok) {
          const data = await resp.json();
          if (ativo && Array.isArray(data.silosTermometria)) {
            setIotTermometriaLive(true);
            setSilos((prev) =>
              prev.map((silo) => {
                if (silo.id === 'silo-01' && data.silosTermometria[0]) {
                  const s1 = data.silosTermometria[0];
                  return {
                    ...silo,
                    umidadeMediaPct: s1.umidadePercentual,
                    temperaturaMediaC: s1.cabos[0]?.tempC || silo.temperaturaMediaC,
                    statusAeracao: s1.aeracaoLigada ? 'LIGADA' : 'DESLIGADA',
                  };
                }
                return silo;
              })
            );
          }
        }
      } catch {
        if (ativo) setIotTermometriaLive(false);
      }
    };

    fetchSilosTelemetry();
    const timer = setInterval(fetchSilosTelemetry, 5000);
    return () => {
      ativo = false;
      clearInterval(timer);
    };
  }, []);

  // Parâmetros do Secador de Grãos
  const [secadorPesoInicialTon, setSecadorPesoInicialTon] = useState<number>(60.0); // 60 toneladas
  const [secadorUmidadeEntrada, setSecadorUmidadeEntrada] = useState<number>(18.0); // 18%
  const [secadorUmidadeSaida, setSecadorUmidadeSaida] = useState<number>(14.0); // 14% padrão
  const [tempFornalha, setTempFornalha] = useState<number>(115); // °C ar quente

  // Cálculo da Quebra de Secagem: Q = ((U1 - U2) / (100 - U2)) * 100
  const quebraDessecacaoPct =
    ((secadorUmidadeEntrada - secadorUmidadeSaida) / (100 - secadorUmidadeSaida)) * 100;
  const pesoInicialKg = secadorPesoInicialTon * 1000;
  const aguaEvaporadaKg = Math.round(pesoInicialKg * (quebraDessecacaoPct / 100));
  const pesoFinalSecoKg = pesoInicialKg - aguaEvaporadaKg;
  const sacasSecasProntas = Number((pesoFinalSecoKg / 60).toFixed(1));

  const totalCapacidadeSacas = silos.reduce((acc, curr) => acc + curr.capacidadeSacas, 0);
  const totalArmazenadoSacas = silos.reduce((acc, curr) => acc + curr.saldoAtualSacas, 0);
  const percentualOcupacaoGeral = (totalArmazenadoSacas / totalCapacidadeSacas) * 100;

  const siloAtivo = silos.find((s) => s.id === siloSelecionadoId) || silos[0];

  const handleToggleAeracao = (id: string) => {
    setSilos((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const novoStatus = s.statusAeracao === 'LIGADA' ? 'DESLIGADA' : 'LIGADA';
          return { ...s, statusAeracao: novoStatus };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
              <Warehouse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Armazenagem, Termometria &amp; Secadores</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200 rounded-full">
                  Termometria Digital
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-full">
                  Aeração Forçada
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                  iotTermometriaLive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                  IoT Silos Live
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-0.5">
                Monitoramento térmico de silos graneleiros, controle de umidade e cálculo oficial de quebra técnica de secagem.
              </p>
            </div>
          </div>
        </div>

        {/* Resumo da Capacidade Estática */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Capacidade Estática:</span>
            <span className="text-slate-900 font-mono font-bold text-sm">{totalCapacidadeSacas.toLocaleString('pt-BR')} sacas</span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Ocupação Atual:</span>
            <span className="text-amber-800 font-mono font-bold text-sm">{percentualOcupacaoGeral.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Cards de Indicadores de Armazenagem */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Estoque Total Físico</span>
            <Warehouse className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {totalArmazenadoSacas.toLocaleString('pt-BR')} sc
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">~{(totalArmazenadoSacas * 0.06).toFixed(0)} toneladas armazenadas</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Comprometido em Barter/CPR</span>
            <TrendingUp className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black text-sky-900 font-mono">42.000 sc</div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Entregas fixadas: Cargill, Bunge, Amaggi</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Saldo Próprio Livre (Spot)</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-800 font-mono">
            {(totalArmazenadoSacas - 42000).toLocaleString('pt-BR')} sc
          </div>
          <p className="text-xs text-emerald-700 mt-1 font-medium">Disponível para negociação na alta</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Temperatura Média da Massa</span>
            <Thermometer className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">23.8 °C</div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Faixa ideal de conservação: 18°C a 25°C</p>
        </div>
      </div>

      {/* Grid: Planta de Silos & Termometria + Calculadora de Secagem */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel dos Silos & Termometria Digital (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-amber-700" />
                Matriz de Termometria Digital &amp; Cabos Sensores
              </h2>
              <p className="text-xs text-slate-500">Clique no silo para auditar os pontos de temperatura em profundidade</p>
            </div>
          </div>

          {/* Seletor de Silos em Formato de Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {silos.map((silo) => {
              const ocupacaoPct = (silo.saldoAtualSacas / silo.capacidadeSacas) * 100;
              const temPontoQuente = silo.cabosTermometria.some((c) =>
                c.sensores.some((sen) => sen.status === 'AQUECIMENTO')
              );

              return (
                <div
                  key={silo.id}
                  onClick={() => setSiloSelecionadoId(silo.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    siloSelecionadoId === silo.id
                      ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900 text-xs">{silo.codigo}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        temPontoQuente
                          ? 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {temPontoQuente ? 'PONTO QUENTE' : 'ESTÁVEL'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 truncate">{silo.cultura}</div>

                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-900 mb-1 font-mono">
                      <span>{silo.saldoAtualSacas.toLocaleString('pt-BR')} sc</span>
                      <span className="text-amber-800 font-bold">{ocupacaoPct.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${ocupacaoPct}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 font-medium">
                    <span>Umidade: {silo.umidadeMediaPct}%</span>
                    <span>Temp: {silo.temperaturaMediaC}°C</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detalhes do Silo Selecionado & Status dos Cabos */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-amber-700" />
                  {siloAtivo.nome}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {siloAtivo.saldoAtualSacas.toLocaleString('pt-BR')} sacas • Umidade Média: {siloAtivo.umidadeMediaPct}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleAeracao(siloAtivo.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
                    siloAtivo.statusAeracao === 'LIGADA'
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Fan className={`w-4 h-4 ${siloAtivo.statusAeracao === 'LIGADA' ? 'animate-spin' : ''}`} />
                  {siloAtivo.statusAeracao === 'LIGADA' ? 'Aeração Forçada Ativa' : 'Ligar Aeração'}
                </button>
              </div>
            </div>

            {/* Visualização dos Cabos de Sensores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {siloAtivo.cabosTermometria.map((cabo, cIdx) => (
                <div key={cIdx} className="p-3 bg-white border border-slate-200/90 rounded-xl space-y-2 shadow-2xs">
                  <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1">
                    {cabo.caboId}
                  </span>
                  {cabo.sensores.map((sensor, sIdx) => (
                    <div key={sIdx} className="flex justify-between items-center py-1">
                      <span className="text-slate-600">{sensor.profundidade}:</span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-lg text-[11px] border ${
                          sensor.status === 'AQUECIMENTO'
                            ? 'bg-rose-100 text-rose-900 border-rose-300'
                            : 'bg-slate-50 text-slate-900 border-slate-200'
                        }`}
                      >
                        {sensor.tempC} °C
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calculadora do Secador de Grãos (1 col) */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-rose-700" />
              <h2 className="text-base font-bold text-slate-900">Secador de Fluxo Contínuo</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              Cálculo técnico de dessecação pela fórmula oficial de quebra de massa evaporada:
            </p>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-center text-slate-800 font-bold mb-4">
              Q% = [(U₁ - U₂) / (100 - U₂)] × 100
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-900 block mb-1 font-semibold">Carga Úmida na Entrada:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={secadorPesoInicialTon}
                    onChange={(e) => setSecadorPesoInicialTon(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-slate-500 font-mono text-[11px]">toneladas</span>
                </div>
              </div>

              <div>
                <label className="text-slate-900 block mb-1 font-semibold">Umidade de Entrada (Colheita):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={secadorUmidadeEntrada}
                    onChange={(e) => setSecadorUmidadeEntrada(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-slate-500 font-mono text-[11px]">%</span>
                </div>
              </div>

              <div>
                <label className="text-slate-900 block mb-1 font-semibold">Umidade Alvo de Saída (Padrão):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={secadorUmidadeSaida}
                    onChange={(e) => setSecadorUmidadeSaida(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-slate-500 font-mono text-[11px]">%</span>
                </div>
              </div>

              <div>
                <label className="text-slate-900 block mb-1 font-semibold">Temperatura da Fornalha (Biomassa):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempFornalha}
                    onChange={(e) => setTempFornalha(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-slate-500 font-mono text-[11px]">°C</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-900">
              <span className="font-medium">Quebra Técnica de Dessecação:</span>
              <span className="font-mono font-bold text-amber-900">{quebraDessecacaoPct.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center text-slate-900">
              <span className="font-medium">Água Evaporada:</span>
              <span className="font-mono font-bold text-rose-800">-{aguaEvaporadaKg.toLocaleString('pt-BR')} kg</span>
            </div>
            <div className="border-t border-amber-900/50 pt-2 flex justify-between items-center">
              <span className="font-bold text-[#1D4B38]">Saldo Seco Pronto:</span>
              <span className="font-mono font-extrabold text-sm text-emerald-800">
                {sacasSecasProntas.toLocaleString('pt-BR')} sacas ({((pesoFinalSecoKg) / 1000).toFixed(1)} t)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SilosArmazenagemModule;
