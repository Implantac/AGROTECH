import React, { useState, useEffect } from 'react';
import {
  Tractor,
  Activity,
  Gauge,
  Fuel,
  Thermometer,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Play,
  RotateCw,
  TrendingDown,
  BarChart3,
  Wrench,
  Radio,
} from 'lucide-react';
import { MAQUINAS_INICIAIS, MaquinaData } from '../data/mockAgroData';

export const TelemetriaFrotaModule: React.FC = () => {
  const [maquinas, setMaquinas] = useState<MaquinaData[]>(MAQUINAS_INICIAIS);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [sseConectado, setSseConectado] = useState<boolean>(false);
  const [ultimoPingSse, setUltimoPingSse] = useState<string>('Aguardando SSE...');

  // Conexão Server-Sent Events (SSE) para Telemetria em Tempo Real
  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/v1/telemetria/stream');
      es.onopen = () => setSseConectado(true);
      es.onmessage = (event) => {
        try {
          const dados = JSON.parse(event.data);
          setUltimoPingSse(new Date().toLocaleTimeString('pt-BR'));
          if (dados && dados.tag) {
            setMaquinas((prev) =>
              prev.map((maq) =>
                maq.tag === dados.tag
                  ? {
                      ...maq,
                      rpmMotor: dados.rpm || maq.rpmMotor,
                      velocidadeKmh: dados.velocidadeKmh || maq.velocidadeKmh,
                      consumoInstantaneoLh: dados.consumoInstantaneoLh || maq.consumoInstantaneoLh,
                      temperaturaMotorC: dados.temperaturaMotorC || maq.temperaturaMotorC
                    }
                  : maq
              )
            );
          }
        } catch {
          // fallback silencioso
        }
      };
      es.onerror = () => setSseConectado(false);
    } catch {
      setSseConectado(false);
    }
    return () => {
      if (es) es.close();
    };
  }, []);

  // Efeito de telemetria CAN Bus em tempo real (simula oscilação de sensores a cada 3 segundos)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setMaquinas((prev) =>
        prev.map((maq) => {
          if (maq.statusTelemetria === 'OPERANDO') {
            const variacaoVel = (Math.random() - 0.5) * 0.8;
            const variacaoRpm = Math.floor((Math.random() - 0.5) * 40);
            const variacaoConsumo = (Math.random() - 0.5) * 1.2;

            return {
              ...maq,
              velocidadeKmh: Number(Math.max(4, maq.velocidadeKmh + variacaoVel).toFixed(1)),
              rpmMotor: Math.max(1600, Math.min(2200, maq.rpmMotor + variacaoRpm)),
              consumoInstantaneoLh: Number(
                Math.max(15, maq.consumoInstantaneoLh + variacaoConsumo).toFixed(1)
              ),
              temperaturaMotorC: Math.min(94, Math.max(82, maq.temperaturaMotorC + Math.floor((Math.random() - 0.5) * 2))),
            };
          }
          return maq;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const consumoTotalLh = maquinas.reduce((acc, curr) => acc + curr.consumoInstantaneoLh, 0);
  const eficienciaMedia =
    maquinas.reduce((acc, curr) => acc + curr.eficienciaTrabalhoPct, 0) / maquinas.length;
  const operandoCount = maquinas.filter((m) => m.statusTelemetria === 'OPERANDO').length;
  const ociosoCount = maquinas.filter((m) => m.statusTelemetria === 'OCIOSO_LIGADO').length;

  return (
    <div className="space-y-6">
      {/* Top Banner de Telemetria e Frotas */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-md text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              Telemetria CAN Bus J1939 & TimescaleDB
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border flex items-center gap-1 ${sseConectado ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
              <Radio className="w-3 h-3 text-emerald-700" />
              {sseConectado ? `SSE Ao Vivo Ativo (${ultimoPingSse})` : 'Conectando Stream SSE...'}
            </span>
            <span className="text-xs text-slate-500 font-medium">Transmissão IoT 4G / Starlink Rural</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Tractor className="w-5 h-5 text-emerald-700" />
            <span>Cockpit de Telemetria de Frota & Eficiência de Combustível</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Monitoramento de RPM do motor, velocidade de plantio/pulverização, consumo de diesel instantâneo (L/h) e prevenção de tempo ocioso.
          </p>
        </div>

        {/* Botão de Toggle da Transmissão */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
              isSimulating
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Telemetria Ao Vivo Ativa' : 'Pausar Telemetria'}</span>
          </button>
        </div>
      </div>

      {/* 4 Cards de Métricas da Frota */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
            <span>Máquinas em Operação</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {operandoCount}{' '}
            <span className="text-xs font-bold text-slate-500">de {maquinas.length} máquinas</span>
          </p>
          <p className="text-xs text-emerald-800 mt-1 font-semibold">Plantio e Pulverização Ativos</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
            <span>Consumo Instantâneo Total</span>
            <Fuel className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-700">
            {consumoTotalLh.toFixed(1)}{' '}
            <span className="text-xs font-bold text-slate-500">L / hora</span>
          </p>
          <p className="text-xs text-slate-600 mt-1 font-medium">Óleo Diesel S10 Pro-Safra</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
            <span>Eficiência Operacional Média</span>
            <Gauge className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-3xl font-black text-emerald-800">
            {eficienciaMedia.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-600 mt-1 font-medium">Tempo efetivo de talhão</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
            <span>Alerta: Máquinas Ociosas</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-800">
            {ociosoCount}{' '}
            <span className="text-xs font-bold text-slate-500">veículo</span>
          </p>
          <p className="text-xs text-rose-700 mt-1 font-semibold">Motor ligado sem trabalho útil</p>
        </div>
      </div>

      {/* Grid de Veículos com Telemetria em Tempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {maquinas.map((maq) => {
          let statusBadge = (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              Em Operação
            </span>
          );

          if (maq.statusTelemetria === 'MANOBRA') {
            statusBadge = (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-900 border border-sky-300 flex items-center gap-1.5">
                Manobra de Cabeceira
              </span>
            );
          } else if (maq.statusTelemetria === 'OCIOSO_LIGADO') {
            statusBadge = (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Ocioso com Motor Ligado
              </span>
            );
          }

          return (
            <div
              key={maq.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              {/* Header do Card da Máquina */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 border border-sky-300 flex items-center justify-center shadow-2xs shrink-0">
                    <Tractor className="w-6 h-6 text-sky-800" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-tight">{maq.nome}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="font-semibold text-slate-800">{maq.operadorNome}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-600">Horímetro: {maq.horimetroAtual}h</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0">{statusBadge}</div>
              </div>

              {/* Grid dos Sensores CAN Bus */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Velocidade</span>
                  <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">
                    {maq.velocidadeKmh}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">km/h</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">RPM Motor</span>
                  <span className="text-lg font-black text-emerald-800 font-mono mt-0.5 block">
                    {maq.rpmMotor}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">RPM</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Diesel</span>
                  <span className="text-lg font-black text-amber-800 font-mono mt-0.5 block">
                    {maq.consumoInstantaneoLh}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">L / hora</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Temp Motor</span>
                  <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">
                    {maq.temperaturaMotorC}°
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Celsius</span>
                </div>
              </div>

              {/* Barra de Eficiência Operacional */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-semibold">Eficiência Operacional (% Horas Úteis)</span>
                  <span className="font-extrabold text-emerald-800 font-mono">{maq.eficienciaTrabalhoPct}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${maq.eficienciaTrabalhoPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Rodapé com Custo por Hora e Ação */}
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                <span className="text-slate-600 font-medium">
                  Custo Operacional: <b className="text-slate-900 font-black">R$ {maq.custoHoraEstimado.toFixed(2)} / hora</b>
                </span>
                <button
                  onClick={() => alert(`Conexão aberta com o computador de bordo do ${maq.nome}. Sensores CAN Bus J1939 operando nos parâmetros nominais.`)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  Diagnóstico CAN
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
