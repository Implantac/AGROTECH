import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Tractor,
  Download,
  Calculator
} from 'lucide-react';

interface MaquinaOEE {
  id: string;
  nome: string;
  tipo: string;
  operador: string;
  tempoProgramadoH: number; // Ex: 12h turno
  tempoOperacionalH: number; // Ex: 9.6h rodando
  tempoParadoH: number;      // Ex: 2.4h paradas (abastecimento, manutenção, manobras)
  capacidadeTeoricaHaH: number; // Ex: 15 ha/h
  capacidadeRealHaH: number;    // Ex: 13.5 ha/h
  qualidadePct: number;         // Ex: 98% (sem sobreposições ou falhas)
  motivoMaiorParada: string;
}

const MAQUINAS_INICIAIS: MaquinaOEE[] = [
  {
    id: 'maq-01',
    nome: 'Colheitadeira John Deere S790 (#01)',
    tipo: 'Colheita de Grãos',
    operador: 'Robson Silveira',
    tempoProgramadoH: 12.0,
    tempoOperacionalH: 9.6,
    tempoParadoH: 2.4,
    capacidadeTeoricaHaH: 14.5,
    capacidadeRealHaH: 13.05,
    qualidadePct: 98.0,
    motivoMaiorParada: 'Aguardando caminhão de transbordo no carreador (1.2h)',
  },
  {
    id: 'maq-02',
    nome: 'Pulverizador John Deere 4030 (#04)',
    tipo: 'Aplicação de Defensivos',
    operador: 'Marcos Vinícius',
    tempoProgramadoH: 12.0,
    tempoOperacionalH: 8.8,
    tempoParadoH: 3.2,
    capacidadeTeoricaHaH: 45.0,
    capacidadeRealHaH: 39.5,
    qualidadePct: 96.5,
    motivoMaiorParada: 'Abastecimento lento de calda no ponto de apoio (1.8h)',
  },
  {
    id: 'maq-03',
    nome: 'Trator Case Magnum 380 (#08)',
    tipo: 'Semeadura Direta 32L',
    operador: 'Valdir Mendonça',
    tempoProgramadoH: 12.0,
    tempoOperacionalH: 10.2,
    tempoParadoH: 1.8,
    capacidadeTeoricaHaH: 18.0,
    capacidadeRealHaH: 16.9,
    qualidadePct: 99.0,
    motivoMaiorParada: 'Manutenção preventiva em mangueira hidráulica (0.9h)',
  },
];

export const OEEFrotasAgricolasModule: React.FC = () => {
  const [maquinas] = useState<MaquinaOEE[]>(MAQUINAS_INICIAIS);
  const [maquinaAtiva, setMaquinaAtiva] = useState<MaquinaOEE>(MAQUINAS_INICIAIS[0]);

  // Custo Horário e Simulações Financeiras de Perdas
  const [custoHoraMaquinaParada, setCustoHoraMaquinaParada] = useState<number>(450.0); // R$ 450 / hora ociosa
  const [diasOperacaoSafra, setDiasOperacaoSafra] = useState<number>(45); // 45 dias de janela crítica

  // Cálculo Oficial dos 3 Pilares do OEE (ISO 22400):
  // 1. Disponibilidade = Tempo Operacional / Tempo Programado
  const disponibilidade = maquinaAtiva.tempoOperacionalH / maquinaAtiva.tempoProgramadoH;

  // 2. Desempenho = Capacidade Real (ha/h) / Capacidade Teórica (ha/h)
  const desempenho = maquinaAtiva.capacidadeRealHaH / maquinaAtiva.capacidadeTeoricaHaH;

  // 3. Qualidade = Qualidade (%) / 100
  const qualidade = maquinaAtiva.qualidadePct / 100;

  // OEE Geral = Disponibilidade * Desempenho * Qualidade
  const oeeConsolidado = disponibilidade * desempenho * qualidade;
  const oeePct = (oeeConsolidado * 100).toFixed(1);

  // Perdas e Ganhos Financeiros
  const custoParadaTurno = maquinaAtiva.tempoParadoH * custoHoraMaquinaParada;
  const custoParadaSafra = custoParadaTurno * diasOperacaoSafra;

  // Potencial de ganho com elevação para meta Classe Mundial (85% OEE)
  const hectaresAdicionaisTurno = Number(
    ((0.85 - oeeConsolidado) * (maquinaAtiva.tempoProgramadoH * maquinaAtiva.capacidadeTeoricaHaH)).toFixed(1)
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl">
              <Activity className="w-6 h-6 text-sky-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Eficiência Operacional OEE de Frotas Agrícolas
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 rounded-full">
                  ISO 22400
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Métricas de Disponibilidade, Desempenho e Qualidade de colheitadeiras, tratores e pulverizadores.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Relatório Executivo de OEE e Redução de Tempos Ociosos gerado!')}
              className="flex items-center gap-2 px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              Relatório de OEE
            </button>
            <div className="text-right pl-4 border-l border-slate-200 hidden sm:block">
              <div className="text-[11px] text-slate-500">OEE Atual</div>
              <div className={`text-lg font-bold ${
                Number(oeePct) >= 80.0 ? 'text-emerald-700' : Number(oeePct) >= 65.0 ? 'text-amber-700' : 'text-rose-700'
              }`}>
                {oeePct}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">1. Disponibilidade Operacional</div>
          <div className="text-2xl font-bold text-sky-700 mt-1">
            {(disponibilidade * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {maquinaAtiva.tempoOperacionalH}h úteis de {maquinaAtiva.tempoProgramadoH}h programadas
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">2. Eficiência de Desempenho</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {(desempenho * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {maquinaAtiva.capacidadeRealHaH} ha/h de {maquinaAtiva.capacidadeTeoricaHaH} ha/h
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">3. Taxa de Qualidade</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {maquinaAtiva.qualidadePct.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Área executada sem sobreposições ou perdas
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">OEE Consolidado</div>
          <div className={`text-2xl font-bold mt-1 ${
            Number(oeePct) >= 80.0 ? 'text-emerald-700' : Number(oeePct) >= 65.0 ? 'text-amber-700' : 'text-rose-700'
          }`}>
            {oeePct}% <span className="text-sm font-normal text-slate-400">(Meta: 85%)</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {Number(oeePct) >= 80.0 ? 'Classe Mundial' : Number(oeePct) >= 65.0 ? 'Média Brasil' : 'Abaixo do Benchmark'}
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Máquinas Auditadas vs Simulador Financeiro de Paradas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Frota Auditada (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tractor className="w-5 h-5 text-sky-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Auditoria de OEE por Equipamento
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Turno de 12h</span>
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
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50/70 border-sky-300 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{m.nome.split(' (#')[0]}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-sky-100 text-sky-800">
                        {mOee}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 truncate">Op: {m.operador.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Card for Bottlenecks */}
            <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Operador Responsável:</span>
                <span className="font-semibold text-slate-900">{maquinaAtiva.operador}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Gargalo / Maior Motivo de Parada:</span>
                <span className="font-bold text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  {maquinaAtiva.motivoMaiorParada}
                </span>
              </div>

              <div className="p-3 bg-sky-50/60 border border-sky-200/80 rounded-lg text-slate-600 leading-relaxed text-[11px]">
                <strong className="text-sky-900 block mb-1">Ação Prescritiva de Gestão:</strong>
                Otimizar a logística de transbordo/abastecimento no campo para manter a máquina operando em movimento. Reduzir as paradas em cabeceira de {maquinaAtiva.tempoParadoH}h para 1.0h elevará o OEE para <strong>82.4%</strong>, adicionando até <strong>{hectaresAdicionaisTurno} hectares</strong> colhidos/pulverizados por dia.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Idle Cost & Production Gain Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-sky-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Custo da Ociosidade & Potencial
                </h2>
              </div>
              <span className="text-xs bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded font-semibold">
                Economia Real
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Calcule o custo das horas ociosas e o ganho em produtividade com o atingimento do benchmark de 85%.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Custo da Hora-Máquina Parada (R$/h)</label>
                <input
                  type="number"
                  step="10"
                  value={custoHoraMaquinaParada}
                  onChange={(e) => setCustoHoraMaquinaParada(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Dias de Operação Crítica na Safra</label>
                <input
                  type="number"
                  step="5"
                  value={diasOperacaoSafra}
                  onChange={(e) => setDiasOperacaoSafra(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Substitution Results Output Box */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Custo de Paradas por Turno:</span>
                <span className="text-rose-700 font-bold">R$ {custoParadaTurno.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Custo Total na Safra ({diasOperacaoSafra} dias):</span>
                <span className="text-rose-700 font-bold">
                  R$ {custoParadaSafra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Ganho com OEE 85%:</span>
                <span className="text-emerald-700 font-bold text-base">
                  +{hectaresAdicionaisTurno} ha / turno
                </span>
              </div>

              <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-sky-800">Oportunidade de OEE</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Eliminar {maquinaAtiva.tempoParadoH}h de paradas diárias economiza <strong>R$ {custoParadaSafra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> nesta máquina.
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-sky-700 shrink-0" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default OEEFrotasAgricolasModule;
