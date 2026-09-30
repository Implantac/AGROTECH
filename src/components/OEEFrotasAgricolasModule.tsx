import React, { useState } from 'react';
import {
  Activity,
  Tractor,
  Clock,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calculator,
  Layers,
  Sparkles,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface MaquinaOEE {
  id: string;
  nome: string;
  tipo: string;
  operador: string;
  tempoProgramadoH: number;
  tempoOperacionalH: number;
  tempoParadoH: number;
  capacidadeTeoricaHaH: number;
  capacidadeRealHaH: number;
  qualidadePct: number;
  motivoMaiorParada: string;
}

const MAQUINAS_OEE_INICIAIS: MaquinaOEE[] = [
  {
    id: 'oee-01',
    nome: 'Colheitadeira John Deere S790 (#01)',
    tipo: 'COLHEITADEIRA',
    operador: 'Carlos Eduardo Santos',
    tempoProgramadoH: 12.0,
    tempoOperacionalH: 10.2,
    tempoParadoH: 1.8,
    capacidadeTeoricaHaH: 16.0,
    capacidadeRealHaH: 14.8,
    qualidadePct: 98.5,
    motivoMaiorParada: 'Espera por transbordo de grãos na cabeceira (48 min)',
  },
  {
    id: 'oee-02',
    nome: 'Pulverizador John Deere 4030 (#01)',
    tipo: 'PULVERIZADOR',
    operador: 'Marcos Vinicius Lima',
    tempoProgramadoH: 12.0,
    tempoOperacionalH: 9.0,
    tempoParadoH: 3.0,
    capacidadeTeoricaHaH: 45.0,
    capacidadeRealHaH: 38.0,
    qualidadePct: 96.0,
    motivoMaiorParada: 'Reabastecimento de calda e lavagem de filtros (1h 50min)',
  },
  {
    id: 'oee-03',
    nome: 'Trator Case Magnum 340 (#02 - Plantio)',
    tipo: 'TRATOR',
    operador: 'José Roberto Ferreira',
    tempoProgramadoH: 12.0,
    tempoOperacionalH: 9.6,
    tempoParadoH: 2.4,
    capacidadeTeoricaHaH: 15.0,
    capacidadeRealHaH: 13.5,
    qualidadePct: 98.0,
    motivoMaiorParada: 'Abastecimento de semente ensacada e adubo no comboio (1h 20min)',
  },
];

export const OEEFrotasAgricolasModule: React.FC = () => {
  const [maquinas] = useState<MaquinaOEE[]>(MAQUINAS_OEE_INICIAIS);
  const [maquinaAtiva, setMaquinaAtiva] = useState<MaquinaOEE>(MAQUINAS_OEE_INICIAIS[0]);

  // Custo da Hora Máquina Parada
  const [custoHoraMaquinaParada, setCustoHoraMaquinaParada] = useState<number>(380.0); // R$/hora
  const [diasOperacaoSafra, setDiasOperacaoSafra] = useState<number>(45);

  // Cálculos do OEE da Máquina Ativa
  const disponibilidade = Number((maquinaAtiva.tempoOperacionalH / maquinaAtiva.tempoProgramadoH).toFixed(4));
  const desempenho = Number((maquinaAtiva.capacidadeRealHaH / maquinaAtiva.capacidadeTeoricaHaH).toFixed(4));
  const qualidade = Number((maquinaAtiva.qualidadePct / 100).toFixed(4));

  const oeeDecimal = disponibilidade * desempenho * qualidade;
  const oeePct = Number((oeeDecimal * 100).toFixed(1));

  const custoParadaTurno = Number((maquinaAtiva.tempoParadoH * custoHoraMaquinaParada).toFixed(2));
  const custoParadaSafra = Number((custoParadaTurno * diasOperacaoSafra).toFixed(2));

  // Potencial de Hectares Ganhos elevando o OEE para a meta de 85% (Classe Mundial)
  const oeeMetaPct = 85.0;
  const hectaresTrabalhadosTurno = maquinaAtiva.tempoOperacionalH * maquinaAtiva.capacidadeRealHaH;
  const hectaresPotenciaisComMeta = (hectaresTrabalhadosTurno * (oeeMetaPct / oeePct));
  const hectaresAdicionaisTurno = Math.max(0, Number((hectaresPotenciaisComMeta - hectaresTrabalhadosTurno).toFixed(1)));

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-stone-950 border border-blue-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl">
                <Activity className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Eficiência Operacional OEE de Frotas Agrícolas
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                    World Class Ag (ISO 22400)
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Métricas de Disponibilidade, Desempenho e Qualidade de colheitadeiras, tratores e pulverizadores.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Relatório Executivo de OEE e Redução de Tempos Ociosos gerado!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-950/40"
            >
              <Download className="w-4 h-4" />
              Relatório de OEE
            </button>
            <div className="text-right pl-4 border-l border-blue-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">OEE Atual</div>
              <div className={`text-xl font-bold ${
                oeePct >= 80.0 ? 'text-emerald-400' : oeePct >= 65.0 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {oeePct}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">1. Disponibilidade Operacional</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">
            {(disponibilidade * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-stone-500 mt-1">
            {maquinaAtiva.tempoOperacionalH}h úteis de {maquinaAtiva.tempoProgramadoH}h programadas
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">2. Eficiência de Desempenho</div>
          <div className="text-2xl font-bold text-amber-300 mt-1">
            {(desempenho * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-stone-400 mt-1">
            {maquinaAtiva.capacidadeRealHaH} ha/h de {maquinaAtiva.capacidadeTeoricaHaH} ha/h
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">3. Taxa de Qualidade</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {maquinaAtiva.qualidadePct.toFixed(1)}%
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Área executada sem sobreposições ou perdas
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">OEE Consolidado</div>
          <div className={`text-2xl font-bold mt-1 ${
            oeePct >= 80.0 ? 'text-emerald-400' : oeePct >= 65.0 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {oeePct}% <span className="text-sm font-normal text-stone-400">(Meta: 85%)</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            {oeePct >= 80.0 ? 'Classe Mundial' : oeePct >= 65.0 ? 'Média Brasil' : 'Abaixo do Benchmark'}
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Máquinas Auditadas vs Simulador Financeiro de Paradas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Frota Auditada (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tractor className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">
                  Auditoria de OEE por Equipamento
                </h2>
              </div>
              <span className="text-xs text-stone-400 font-mono">Turno de 12h</span>
            </div>

            {/* Selector of Machines */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
              {maquinas.map((m) => {
                const isSelected = m.id === maquinaAtiva.id;
                const mOee = (
                  (m.tempoOperacionalH / m.tempoProgramadoH) *
                  (m.capacidadeRealHaH / m.capacidadeTeoricaHaH) *
                  (m.qualidadePct / 100) *
                  100
                ).toFixed(1);

                return (
                  <button
                    key={m.id}
                    onClick={() => setMaquinaAtiva(m)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500/80 shadow-md ring-1 ring-blue-500/50'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{m.nome.split(' (#')[0]}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-blue-500/20 text-blue-300">
                        {mOee}%
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1 truncate">Op: {m.operador.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Card for Bottlenecks */}
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400">Operador Responsável:</span>
                <span className="font-semibold text-white">{maquinaAtiva.operador}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400">Gargalo / Maior Motivo de Parada:</span>
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  {maquinaAtiva.motivoMaiorParada}
                </span>
              </div>

              <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-lg text-stone-300 leading-relaxed text-[11px]">
                <strong className="text-blue-300 block mb-1">Ação Prescritiva de Gestão:</strong>
                Otimizar a logística de transbordo/abastecimento no campo para manter a máquina operando em movimento. Reduzir as paradas em cabeceira de {maquinaAtiva.tempoParadoH}h para 1.0h elevará o OEE para <strong>82.4%</strong>, adicionando até <strong>{hectaresAdicionaisTurno} hectares</strong> colhidos/pulverizados por dia.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Idle Cost & Production Gain Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">
                  Custo da Ociosidade & Potencial
                </h2>
              </div>
              <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded">
                Economia Real
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Calcule o custo das horas ociosas e o ganho em produtividade com o atingimento do benchmark de 85%.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Custo da Hora-Máquina Parada (R$/h)</label>
                <input
                  type="number"
                  step="10"
                  value={custoHoraMaquinaParada}
                  onChange={(e) => setCustoHoraMaquinaParada(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Dias de Operação Crítica na Safra</label>
                <input
                  type="number"
                  step="5"
                  value={diasOperacaoSafra}
                  onChange={(e) => setDiasOperacaoSafra(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-blue-500"
                />
              </div>
            </div>

            {/* Substitution Results Output Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Custo de Paradas por Turno:</span>
                <span className="text-rose-400 font-bold">R$ {custoParadaTurno.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Custo Total na Safra ({diasOperacaoSafra} dias):</span>
                <span className="text-rose-400 font-bold">
                  R$ {custoParadaSafra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Ganho com OEE 85%:</span>
                <span className="text-emerald-400 font-bold text-base">
                  +{hectaresAdicionaisTurno} ha / turno
                </span>
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-900/40 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-blue-400">Oportunidade de OEE</div>
                  <div className="text-xs text-stone-300 mt-0.5">
                    Eliminar {maquinaAtiva.tempoParadoH}h de paradas diárias economiza <strong>R$ {custoParadaSafra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> nesta máquina.
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
