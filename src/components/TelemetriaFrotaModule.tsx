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
  BarChart3
} from 'lucide-react';
import { MAQUINAS_INICIAIS, MaquinaData } from '../data/mockAgroData';

export const TelemetriaFrotaModule: React.FC = () => {
  const [maquinas, setMaquinas] = useState<MaquinaData[]>(MAQUINAS_INICIAIS);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

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
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Telemetria CAN Bus & TimescaleDB
            </span>
            <span className="text-xs text-slate-600">Transmissão IoT 4G / Rádio Frequência</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tractor className="w-5 h-5 text-emerald-400" /> Cockpit de Telemetria de Frota & Eficiência de Combustível
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Monitora rotação do motor, velocidade de plantio/pulverização, consumo de diesel instantâneo e tempo ocioso com motor ligado.
          </p>
        </div>

        {/* Botão de Toggle da Transmissão */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all ${
              isSimulating
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-900'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Telemetria Ao Vivo Ativa' : 'Transmissão Pausada'}
          </button>
        </div>
      </div>

      {/* 4 Cards de Métricas da Frota */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Máquinas em Operação</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>
          <p className="text-2xl font-black text-white">
            {operandoCount} <span className="text-xs font-semibold text-slate-600">de {maquinas.length} máquinas</span>
          </p>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">Plantio e Pulverização Ativos</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Consumo Instantâneo Total</span>
            <Fuel className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">
            {consumoTotalLh.toFixed(1)} <span className="text-xs font-semibold text-slate-600">Litros / Hora</span>
          </p>
          <p className="text-[11px] text-slate-600 mt-1">Óleo Diesel S10</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Eficiência Operacional Média</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">
            {eficienciaMedia.toFixed(1)}%
          </p>
          <p className="text-[11px] text-slate-600 mt-1">Tempo efetivo de trabalho</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Alerta: Máquinas Ociosas</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">
            {ociosoCount} <span className="text-xs font-semibold text-slate-600">veículo</span>
          </p>
          <p className="text-[11px] text-red-400 mt-1 font-medium">Motor ligado sem trabalho útil</p>
        </div>
      </div>

      {/* Grid de Veículos com Telemetria em Tempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {maquinas.map((maq) => {
          let statusBadge = (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Em Operação
            </span>
          );

          if (maq.statusTelemetria === 'MANOBRA') {
            statusBadge = (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                Manobra de Cabeceira
              </span>
            );
          } else if (maq.statusTelemetria === 'OCIOSO_LIGADO') {
            statusBadge = (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Ocioso com Motor Ligado
              </span>
            );
          }

          return (
            <div
              key={maq.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all"
            >
              {/* Header do Card da Máquina */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shadow">
                    <Tractor className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{maq.nome}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                      <span className="font-medium text-slate-900">{maq.operadorNome}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-600">Horímetro: {maq.horimetroAtual}h</span>
                    </div>
                  </div>
                </div>
                {statusBadge}
              </div>

              {/* Grid dos Sensores CAN Bus */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-600 block font-medium">Velocidade</span>
                  <span className="text-base font-black text-white font-mono mt-0.5 block">
                    {maq.velocidadeKmh}
                  </span>
                  <span className="text-[9px] text-slate-500">km/h</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-600 block font-medium">RPM Motor</span>
                  <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">
                    {maq.rpmMotor}
                  </span>
                  <span className="text-[9px] text-slate-500">RPM</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-600 block font-medium">Diesel</span>
                  <span className="text-base font-black text-amber-400 font-mono mt-0.5 block">
                    {maq.consumoInstantaneoLh}
                  </span>
                  <span className="text-[9px] text-slate-500">L / hora</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-600 block font-medium">Temp Motor</span>
                  <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">
                    {maq.temperaturaMotorC}°
                  </span>
                  <span className="text-[9px] text-slate-500">Celsius</span>
                </div>
              </div>

              {/* Barra de Eficiência Operacional */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Eficiência Operacional (% Horas Úteis)</span>
                  <span className="font-bold text-emerald-400 font-mono">{maq.eficienciaTrabalhoPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500"
                    style={{ width: `${maq.eficienciaTrabalhoPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Rodapé com Custo por Hora e Ação */}
              <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/80">
                <span className="text-slate-600">
                  Custo Operacional: <b className="text-white">R$ {maq.custoHoraEstimado.toFixed(2)} / hora</b>
                </span>
                <button
                  onClick={() => alert(`Conexão aberta com o computador de bordo do ${maq.nome}. Todos os sensores CAN Bus operando nos parâmetros nominais.`)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-900 rounded-lg text-xs font-semibold transition-all border border-slate-700"
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
