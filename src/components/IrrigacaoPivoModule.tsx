import React, { useState, useEffect } from 'react';
import {
  Droplet,
  Waves,
  RotateCw,
  Power,
  Compass,
  Zap,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Sliders,
  DollarSign,
  Radio
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

export const IrrigacaoPivoModule: React.FC = () => {
  // Estado do Pivô Central (TAL-03 Pivô Central 01 - 510 ha)
  const [pivoLigado, setPivoLigado] = useState<boolean>(true);
  const [velocidadeRelogioPct, setVelocidadeRelogioPct] = useState<number>(65);
  const [sentidoRotacao, setSentidoRotacao] = useState<'HORARIO' | 'ANTI_HORARIO'>('HORARIO');
  const [modoTarifaNoturna, setModoTarifaNoturna] = useState<boolean>(true);

  // Telemetria IoT em Tempo Real
  const [anguloAtual, setAnguloAtual] = useState<number>(142);
  const [pressaoBar, setPressaoBar] = useState<number>(3.4);
  const [vazaoM3h, setVazaoM3h] = useState<number>(280);
  const [iotOnline, setIotOnline] = useState<boolean>(true);

  // Parâmetros do Balanço Hídrico
  const [et0MmDia, setEt0MmDia] = useState<number>(5.4);
  const [kcCultura, setKcCultura] = useState<number>(1.15); // Soja R3/R5
  const [umidadeSoloAtual, setUmidadeSoloAtual] = useState<number>(22.0); // % volumétrica
  const capacidadeCampo = 35.0; // %
  const pontoMurcha = 16.0; // %

  // Polling de Sensores IoT do Pivô
  useEffect(() => {
    let montado = true;
    const fetchSensores = async () => {
      try {
        const res = await fetch('/api/v1/telemetria/sensores/live');
        if (res.ok) {
          const data = await res.json();
          if (montado && data.pivoCentral) {
            setAnguloAtual(data.pivoCentral.anguloAtualGraus);
            setPressaoBar(data.pivoCentral.pressaoBar);
            setVazaoM3h(data.pivoCentral.vazaoM3h);
            setIotOnline(true);
          }
        }
      } catch {
        if (montado) setIotOnline(false);
      }
    };

    fetchSensores();
    const interval = setInterval(fetchSensores, 4000);
    return () => {
      montado = false;
      clearInterval(interval);
    };
  }, []);

  // Cálculos do Motor de Irrigação
  const etcMmDia = et0MmDia * kcCultura; // ETc = ET0 * Kc
  const aguaDisponivelSoloPct = ((umidadeSoloAtual - pontoMurcha) / (capacidadeCampo - pontoMurcha)) * 100;
  const requerIrrigacao = aguaDisponivelSoloPct < 50.0 || (umidadeSoloAtual / capacidadeCampo) * 100 < 70.0;

  // Lâmina aplicada pelo pivô em função da velocidade (a 100% aplica 4.0mm, a 50% aplica 8.0mm)
  const laminaAplicadaMm = Number(((4.0 * 100) / velocidadeRelogioPct).toFixed(1));
  const tempoVoltaHoras = Number(((14.5 * 100) / velocidadeRelogioPct).toFixed(1));

  // Economia Tarifa Rural Noturna (21h30 às 06h00 - desconto de 70% na tarifa de energia)
  const potenciaBombaKw = 150; // Motor de 200 cv ~ 150 kW
  const tarifaNormal = 0.82; // R$/kWh
  const tarifaNoturna = 0.246; // R$/kWh (70% de desconto Aneel)
  const horasNoturnas = 8.5; // Janela das 21h30 às 06h00
  const horasDiurnas = Math.max(0, 16 - horasNoturnas);

  const custoDiurno = horasDiurnas * potenciaBombaKw * tarifaNormal;
  const custoNoturno = horasNoturnas * potenciaBombaKw * tarifaNoturna;
  const custoTotalDia = custoDiurno + custoNoturno;
  const custoSeSemDesconto = 16 * potenciaBombaKw * tarifaNormal;
  const economiaDiariaEnergia = custoSeSemDesconto - custoTotalDia;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">Manejo de Irrigação & Pivô Central</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                  Balanço Hídrico Penman-Monteith
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Tarifa Noturna -70%
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                Controle angular, lâmina d'água ($ET_c$), sensores de umidade de solo TDR e automação de tarifa especial irrigante.
              </p>
            </div>
          </div>
        </div>

        {/* Botão de Controle Rápido Liga/Desliga */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPivoLigado(!pivoLigado)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer ${
              pivoLigado
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
            }`}
          >
            <Power className="w-4 h-4" />
            {pivoLigado ? 'Pivô em Operação (Ligado)' : 'Pivô Parado (Desligado)'}
          </button>
        </div>
      </div>

      {/* Cards de Monitoramento Hídrico e Energético */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Evapotranspiração (ETc)</span>
            <Waves className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{etcMmDia.toFixed(2)} mm/dia</div>
          <p className="text-xs text-slate-500 mt-1">ET₀: {et0MmDia} mm × Kc: {kcCultura}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Lâmina Aplicada Atual</span>
            <Droplet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 font-mono">{laminaAplicadaMm} mm</div>
          <p className="text-xs text-slate-500 mt-1">Tempo de volta: {tempoVoltaHoras} horas ({velocidadeRelogioPct}%)</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Água Disponível no Solo</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-300 font-mono">
            {aguaDisponivelSoloPct.toFixed(1)}% AD
          </div>
          <p className="text-xs text-slate-500 mt-1">Umidade atual: {umidadeSoloAtual}% (CC: {capacidadeCampo}%)</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-800/60 p-4 rounded-xl">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Economia Tarifa Noturna</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-200 font-mono">
            R$ {economiaDiariaEnergia.toFixed(2)}/dia
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">Desconto de 70% (21h30 - 06h00)</p>
        </div>
      </div>

      {/* Grid Principal: Cockpit do Pivô (Posição Angular & Controles) + Sondas de Solo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel do Pivô Central (2 colunas) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  Telemetria do Pivô Central 01 (TAL-03 • 510 ha)
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                  iotOnline
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  IoT LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Bomba rio Teles Pires • Pressão: <b className="text-cyan-400 font-mono">{pressaoBar} bar</b> • Vazão: <b className="text-emerald-400 font-mono">{vazaoM3h} m³/h</b>
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono">
              Ângulo: {anguloAtual}°
            </span>
          </div>

          {/* Gráfico do Pivô / Visualizador Circular do Raio */}
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-center justify-around gap-6">
            <div className="relative w-48 h-48 rounded-full border-4 border-dashed border-cyan-500/40 flex items-center justify-center bg-slate-900/60 shadow-inner">
              {/* Centro do Pivô */}
              <div className="w-6 h-6 rounded-full bg-cyan-400 border-2 border-white shadow-lg shadow-cyan-500/50 flex items-center justify-center z-10">
                <div className="w-2 h-2 rounded-full bg-slate-950"></div>
              </div>

              {/* Braço Metálico Giratório */}
              <div
                className="absolute w-24 h-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 origin-left left-1/2 rounded shadow-lg transition-all duration-700"
                style={{ transform: `rotate(${anguloAtual}deg)` }}
              >
                <div className="w-3 h-3 rounded-full bg-emerald-400 absolute right-0 -top-0.5 animate-ping"></div>
              </div>

              {/* Marcadores Cardeais */}
              <span className="absolute top-2 text-[10px] font-bold text-slate-500">Norte (0°)</span>
              <span className="absolute bottom-2 text-[10px] font-bold text-slate-500">Sul (180°)</span>
              <span className="absolute right-2 text-[10px] font-bold text-slate-500">Leste (90°)</span>
              <span className="absolute left-2 text-[10px] font-bold text-slate-500">Oeste (270°)</span>
            </div>

            <div className="space-y-3 text-xs w-full max-w-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Área Irrigada:</span>
                <span className="font-bold text-slate-200">510 hectares</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Raio do Equipamento:</span>
                <span className="font-bold text-slate-200 font-mono">1.274 metros</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Número de Torres:</span>
                <span className="font-bold text-slate-200">18 vãos + balanço</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Sentido:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" />
                  {sentidoRotacao === 'HORARIO' ? 'Sentido Horário' : 'Anti-horário'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tempo para Volta Completa:</span>
                <span className="font-bold text-amber-300 font-mono">{tempoVoltaHoras} horas</span>
              </div>
            </div>
          </div>

          {/* Controles do Percentímetro (Velocidade) */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Percentímetro de Velocidade do Pivô:
              </span>
              <span className="font-mono font-bold text-sm text-cyan-300">{velocidadeRelogioPct}%</span>
            </div>

            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={velocidadeRelogioPct}
              onChange={(e) => setVelocidadeRelogioPct(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-500">
              <span>20% (Lâmina Máxima: 20.0 mm)</span>
              <span>65% (Lâmina Recomendada: {laminaAplicadaMm} mm)</span>
              <span>100% (Lâmina Leve: 4.0 mm)</span>
            </div>
          </div>
        </div>

        {/* Perfil de Sondas de Solo TDR & Balanço Hídrico (1 coluna) */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Waves className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-slate-100">Sondas de Umidade TDR</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Leituras contínuas da matriz de umidade do solo em três profundidades radiculares:
            </p>

            {/* Sonda 20cm */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-semibold">Camada Superficial (0 - 20 cm)</span>
                  <span className="font-mono text-cyan-400 font-bold">21.8%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Zona de absorção de raízes secundárias</span>
              </div>

              {/* Sonda 40cm */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-semibold">Camada Média (20 - 40 cm)</span>
                  <span className="font-mono text-emerald-400 font-bold">24.5%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Pico de densidade de raiz pivotante</span>
              </div>

              {/* Sonda 60cm */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-semibold">Camada Profunda (40 - 60 cm)</span>
                  <span className="font-mono text-indigo-400 font-bold">28.0%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Reserva hídrica do subsolo</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Sparkles className="w-4 h-4" /> Recomendação do Algoritmo:
            </div>
            <p className="text-slate-300">
              Lâmina de reposição hídrica calculada em <strong>{etcMmDia.toFixed(1)} mm</strong>. O sistema agendou automaticamente o acionamento para as <strong>21:30</strong> aproveitando o horário de tarifa noturna reduzida.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrrigacaoPivoModule;
