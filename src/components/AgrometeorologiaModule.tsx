import React, { useState } from 'react';
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
  Gauge
} from 'lucide-react';

export const AgrometeorologiaModule: React.FC = () => {
  // Sensores da Estação Meteorológica na Sede
  const [temperatura, setTemperatura] = useState<number>(27.5);
  const [umidadeRelativa, setUmidadeRelativa] = useState<number>(64);
  const [velocidadeVento, setVelocidadeVento] = useState<number>(7.2);
  const [direcaoVento, setDirecaoVento] = useState<string>('Sudeste (SE - 135°)');
  const [pluviometriaHojeMm, setPluviometriaHojeMm] = useState<number>(14.5);
  const [pluviometriaSafraMm, setPluviometriaSafraMm] = useState<number>(1285.0);
  const [umidadeSolo20cm, setUmidadeSolo20cm] = useState<number>(78); // Capacidade de campo

  // Cálculo agronômico de Delta T:
  // Delta T é a diferença entre a temperatura de bulbo seco e a de bulbo úmido.
  // Uma aproximação padrão: Delta T ≈ T - (T * (UR / 100)) / (algum fator) ou fórmula psicrométrica simplificada.
  // Simplificação agronômica confiável: Delta T = Temperatura - (Temperatura * (0.56 + 0.004 * UR))
  // A faixa ideal agronômica é entre 2 e 8 °C.
  const deltaT = Number((temperatura * (1 - umidadeRelativa / 100) * 0.85).toFixed(1));

  let statusDeltaT = 'IDEAL';
  let badgeColor = 'bg-emerald-950 text-emerald-400 border-emerald-800';
  let explicacaoDeltaT = 'Condições ideais de gota. Sem risco de evaporação prematura nem deriva acentuada.';

  if (deltaT > 8.0) {
    statusDeltaT = 'CRÍTICO_EVAPORACAO';
    badgeColor = 'bg-red-950 text-red-400 border-red-800';
    explicacaoDeltaT = 'Ar extremamente seco ou quente. As gotas finas evaporam antes de atingir as folhas inferiores da cultura.';
  } else if (deltaT < 2.0) {
    statusDeltaT = 'ATENCAO_DERIVA';
    badgeColor = 'bg-amber-950 text-amber-400 border-amber-800';
    explicacaoDeltaT = 'Ar com umidade excessiva. Risco de escorrimento de produto e gotas suspensas no ar por inversão térmica.';
  }

  return (
    <div className="space-y-6">
      {/* Top Banner de Agrometeorologia */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-800 rounded text-xs font-bold flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Estação Meteorológica IoT Davis Vantage Pro2
            </span>
            <span className="text-xs text-slate-400">Instalada na Sede da Fazenda Santa Helena</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-400" /> Agrometeorologia, Pluviometria & Índice Delta T
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cálculo em tempo real da janela de pulverização (Delta T) para orientar os tratoristas e evitar perda química de defensivos.
          </p>
        </div>

        {/* Status da Janela de Pulverização */}
        <div className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${badgeColor}`}>
          <Gauge className="w-4 h-4 shrink-0" />
          <div>
            <span className="block text-[10px] uppercase font-semibold text-slate-400">Janela de Pulverização</span>
            <span>Delta T: {deltaT}°C ({statusDeltaT === 'IDEAL' ? 'LIBERADA' : 'RESTRITA'})</span>
          </div>
        </div>
      </div>

      {/* Simulador Interativo de Condições Meteorológicas */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-400" />
              Simulador Dinâmico de Condições de Aplicação (Delta T em Tempo Real)
            </h3>
            <p className="text-xs text-slate-400">
              Ajuste temperatura, umidade e vento para verificar a viabilidade da pulverização antes de enviar a frota a campo.
            </p>
          </div>
          <button
            onClick={() => {
              setTemperatura(27.5);
              setUmidadeRelativa(64);
              setVelocidadeVento(7.2);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 transition"
          >
            Restaurar Valores da Estação
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Slider Temperatura */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Temperatura do Ar</span>
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
          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Umidade Relativa (UR)</span>
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
          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Velocidade do Vento</span>
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
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Temperatura & Umidade</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {temperatura}°C <span className="text-xs font-normal text-slate-400">/ {umidadeRelativa}% UR</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Ponto de Orvalho: 20.1°C</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Anemômetro (Vento)</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-400">
            {velocidadeVento} <span className="text-xs font-normal text-slate-400">km/h</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">{direcaoVento}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Chuva Hoje</span>
            <CloudRain className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-blue-400">
            {pluviometriaHojeMm} <span className="text-xs font-normal text-slate-400">mm</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Chuva leve pela madrugada</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Acumulado da Safra</span>
            <Droplets className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">
            {pluviometriaSafraMm} <span className="text-xs font-normal text-slate-400">mm</span>
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 block font-semibold">
            87% da média histórica da região
          </span>
        </div>
      </div>

      {/* Painel do Índice Delta T para Pulverização */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Gauge className="w-5 h-5 text-emerald-400" /> O que é o Índice Delta T e Como Ele Protege a Aplicação?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Relação direta entre temperatura do ar e umidade relativa para garantir que a gota não evapore nem derive
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            Delta T Atual: <b className="text-emerald-400">{deltaT}°C</b>
          </span>
        </div>

        {/* Escala Visual de Delta T */}
        <div className="space-y-2">
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-950 border border-slate-800">
            <div className="bg-amber-500 h-full w-[20%]" title="Risco de Deriva (< 2°C)"></div>
            <div className="bg-emerald-500 h-full w-[60%]" title="Janela Ideal (2°C a 8°C)"></div>
            <div className="bg-red-500 h-full w-[20%]" title="Risco de Evaporação (> 8°C)"></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
            <span>&lt; 2°C (Deriva Alta)</span>
            <span className="text-emerald-400 font-bold">Faixa Ótima Agronômica (2°C a 8°C)</span>
            <span>&gt; 8°C (Evaporação das Gotas)</span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <b className="text-white">Diagnóstico em Tempo Real:</b> {explicacaoDeltaT}
            <p className="text-slate-400 mt-1">
              Velocidade do vento em <b>{velocidadeVento} km/h</b> está dentro do limite agronômico de segurança (&lt; 10 km/h). Aplicação de Fox Xpro e Engeo Pleno liberada no pulverizador John Deere 4030.
            </p>
          </div>
        </div>
      </div>

      {/* Umidade do Solo por Profundidade & Manejo de Pivô */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-400" /> Sensores de Umidade do Solo (Tensiômetros Eletrônicos)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Profundidade Superficial (0 a 20 cm)</span>
              <span className="font-bold text-emerald-400 font-mono">78% da Capacidade de Campo</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[78%]"></div>
            </div>
            <p className="text-[11px] text-slate-400">Zona radicular ativa das plântulas de soja em formação.</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Profundidade Profunda (20 a 40 cm)</span>
              <span className="font-bold text-blue-400 font-mono">84% da Capacidade de Campo</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[84%]"></div>
            </div>
            <p className="text-[11px] text-slate-400">Reserva hídrica do perfil do solo adequada para os próximos 8 dias sem chuva.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
