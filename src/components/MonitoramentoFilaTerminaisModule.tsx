import React, { useState, useMemo } from 'react';
import {
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  DollarSign,
  TrendingUp,
  MapPin,
  ShieldAlert,
  ArrowRightLeft,
  Building2,
} from 'lucide-react';

interface TerminalGraneleiro {
  id: string;
  nome: string;
  portoRegiao: string;
  tombadoresAtivos: number;
  capacidadeVeicHora: number;
  veiculosAgendadosDia: number;
  veiculosNoPatio: number;
  tempoPermanenciaMedioHoras: number;
  statusOperacao: 'FLUIDO' | 'MODERADO_ATENCAO' | 'CONGESTIONADO_CRITICO';
}

export const MonitoramentoFilaTerminaisModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terminais' | 'estadia' | 'tombadores' | 'simulador'>('terminais');

  // Parâmetros do Simulador da Lei da Estadia (Lei 13.103/2015)
  const [veiculosDia, setVeiculosDia] = useState<number>(280);
  const [capacidadeHora, setCapacidadeHora] = useState<number>(20);
  const [horasOperacaoDia, setHorasOperacaoDia] = useState<number>(16);
  const [tempoPermanenciaHoras, setTempoPermanenciaHoras] = useState<number>(4.2);
  const [custoHoraEstadiaReais, setCustoHoraEstadiaReais] = useState<number>(85.0);

  const [terminais, setTerminais] = useState<TerminalGraneleiro[]>([
    {
      id: 'TRM-SNT-01',
      nome: 'Terminal Integrado Exportação (Santos - SP)',
      portoRegiao: 'Porto de Santos (Margem Direita)',
      tombadoresAtivos: 4,
      capacidadeVeicHora: 24,
      veiculosAgendadosDia: 360,
      veiculosNoPatio: 42,
      tempoPermanenciaMedioHoras: 3.8,
      statusOperacao: 'FLUIDO',
    },
    {
      id: 'TRM-PNG-02',
      nome: 'Corredor de Exportação Paranaguá (PR)',
      portoRegiao: 'Porto de Paranaguá (Pátio de Triagem)',
      tombadoresAtivos: 3,
      capacidadeVeicHora: 18,
      veiculosAgendadosDia: 275,
      veiculosNoPatio: 58,
      tempoPermanenciaMedioHoras: 4.6,
      statusOperacao: 'MODERADO_ATENCAO',
    },
    {
      id: 'TRM-MRT-03',
      nome: 'Estação de Transbordo Miritituba (PA)',
      portoRegiao: 'Arco Norte (Rio Tapajós)',
      tombadoresAtivos: 2,
      capacidadeVeicHora: 14,
      veiculosAgendadosDia: 220,
      veiculosNoPatio: 65,
      tempoPermanenciaMedioHoras: 5.8,
      statusOperacao: 'CONGESTIONADO_CRITICO',
    },
  ]);

  const metricas = useMemo(() => {
    const capacidadeMaximaDia = capacidadeHora * horasOperacaoDia;
    const taxaOcupacaoPct = capacidadeMaximaDia > 0 ? Number(((veiculosDia / capacidadeMaximaDia) * 100).toFixed(1)) : 0;

    // Lei da Estadia: 5 horas de tolerância legal a partir da chegada
    const horasExcedentes = Math.max(0, Number((tempoPermanenciaHoras - 5.0).toFixed(1)));
    const custoEstadiaPorCarreta = Number((horasExcedentes * custoHoraEstadiaReais).toFixed(2));
    const custoTotalEstadiaDiaReais = Number((custoEstadiaPorCarreta * veiculosDia).toFixed(2));

    const statusGargalo =
      taxaOcupacaoPct > 95
        ? 'CONGESTIONADO_CRITICO'
        : taxaOcupacaoPct > 80
          ? 'MODERADO_ATENCAO'
          : 'FLUIDO';

    return {
      capacidadeMaximaDia,
      taxaOcupacaoPct,
      horasExcedentes,
      custoEstadiaPorCarreta,
      custoTotalEstadiaDiaReais,
      statusGargalo,
    };
  }, [veiculosDia, capacidadeHora, horasOperacaoDia, tempoPermanenciaHoras, custoHoraEstadiaReais]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-[#EAF4E7] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-600/20">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Monitoramento de Tráfego de Grãos & Fila de Terminais
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Módulo 115 • Janela de Agendamento, Pátio Regulador & Lei 13.103
              </span>
            </div>
            <p className="text-sm text-[#66736A] mt-1">
              Controle de tempo de permanência no pátio regulador, vazão dos tombadores e mitigação de multas de estadia rodoviária.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20"
          >
            <Clock className="w-4 h-4" />
            Simulador Lei da Estadia
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Capacidade Diária Máxima</span>
            <Building2 className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.capacidadeMaximaDia} carretas
          </p>
          <span className="text-xs text-sky-400 mt-1 block">
            {capacidadeHora} bitrens/hora em {horasOperacaoDia}h
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Taxa de Ocupação</span>
            <BarChart3 className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.taxaOcupacaoPct}%
          </p>
          <span className="text-xs text-indigo-400 mt-1 block">
            {veiculosDia} veículos agendados
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Tempo Médio Permanência</span>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {tempoPermanenciaHoras} horas
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Tolerância Legal: 5.0 horas
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Risco Estadia Acumulada</span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {metricas.custoTotalEstadiaDiaReais.toLocaleString('pt-BR')}
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            {metricas.horasExcedentes === 0 ? '✓ Zero Estadia (Dentro do Prazo)' : `${metricas.horasExcedentes}h excedentes`}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('terminais')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'terminais'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Terminais Portuários
        </button>

        <button
          onClick={() => setActiveTab('estadia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'estadia'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Lei da Estadia (13.103/15)
        </button>

        <button
          onClick={() => setActiveTab('tombadores')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'tombadores'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          Ciclo de Tombador
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Clock className="w-4 h-4" />
          Simulador de Tráfego
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'terminais' && (
        <div className="bg-slate-900/40 rounded-2xl border border-[#EAF4E7] p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            Situação Operacional dos Pátios Reguladores de Triagem
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#26332A]">
              <thead className="text-xs uppercase bg-[#F7F9F5] text-[#66736A]">
                <tr>
                  <th className="px-4 py-3">Terminal / Pátio</th>
                  <th className="px-4 py-3">Complexo Portuário</th>
                  <th className="px-4 py-3">Tombadores</th>
                  <th className="px-4 py-3">Vazão (veíc/h)</th>
                  <th className="px-4 py-3">Agendados</th>
                  <th className="px-4 py-3">TMP Médio</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {terminais.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-white">{t.nome}</td>
                    <td className="px-4 py-3 text-[#66736A]">{t.portoRegiao}</td>
                    <td className="px-4 py-3 text-sky-400">{t.tombadoresAtivos} unidades</td>
                    <td className="px-4 py-3 font-semibold text-white">{t.capacidadeVeicHora} veic/h</td>
                    <td className="px-4 py-3">{t.veiculosAgendadosDia} dia</td>
                    <td className="px-4 py-3 font-bold text-yellow-400">{t.tempoPermanenciaMedioHoras}h</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          t.statusOperacao === 'FLUIDO'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : t.statusOperacao === 'MODERADO_ATENCAO'
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {t.statusOperacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'estadia' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Tolerância Legal de 5 Horas</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              A Lei 13.103/2015 estipula que o transportador tem até 5 horas corridas a partir da chegada no destino/pátio de triagem para descarregar sem multa.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Franquia de Espera:</span>
              <span className="text-sm font-bold text-emerald-400 block">5.0 horas corridas gratuitas</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-semibold text-white">Cálculo da Multa por Hora Parada</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Após a 5ª hora, incide o valor de estadia calculado por tonelada de capacidade total multiplicada pela fração horária de atraso do terminal.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Valor Médio Bitrem (37t útil):</span>
              <span className="text-sm font-bold text-rose-400 block">R$ 80,00 a R$ 95,00/hora parada</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-sky-400" />
              <h4 className="text-sm font-semibold text-white">Agendamento Prévia Obrigatório</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Apenas veículos com TAG de pedágio e agendamento confirmado no sistema Carga Online/Portos podem ingressar nas vias de acesso litorâneas.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Redução de Filas na Rodovia:</span>
              <span className="text-sm font-bold text-sky-400 block">-74% no tempo de espera externo</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tombadores' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-sky-400" />
            Vazão Crítica de Descarregamento em Tombadores Hidráulicos
          </h3>
          <p className="text-sm text-[#66736A]">
            A eficiência do terminal depende da velocidade média de ciclo do tombador: pesagem inicial na balança, amostragem pneumática com calador, basculamento a 40 graus e pesagem de tara.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Tempo de Ciclo Meta</span>
              <p className="text-lg font-bold text-white mt-1">12 a 15 min</p>
              <span className="text-[11px] text-slate-500">Por conjunto bitrem/rodotrem</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Amostragem Rápida</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">90 segundos</p>
              <span className="text-[11px] text-emerald-500/80">Calador automático multi-ponto</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Vazão dos Redleres</span>
              <p className="text-lg font-bold text-sky-400 mt-1">1.200 t/hora</p>
              <span className="text-[11px] text-slate-500">Alimentação direta dos silos pulmão</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" />
            Simulador de Carga, Ocupação do Terminal e Risco de Multas de Estadia
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-[#66736A]">Veículos Agendados / Dia</label>
              <input
                type="number"
                value={veiculosDia}
                onChange={(e) => setVeiculosDia(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Vazão Tombadores (veíc/h)</label>
              <input
                type="number"
                value={capacidadeHora}
                onChange={(e) => setCapacidadeHora(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Permanência Média (horas)</label>
              <input
                type="number"
                step="0.1"
                value={tempoPermanenciaHoras}
                onChange={(e) => setTempoPermanenciaHoras(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Custo Estadia (R$/hora)</label>
              <input
                type="number"
                value={custoHoraEstadiaReais}
                onChange={(e) => setCustoHoraEstadiaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#66736A] block">Diagnóstico de Fluxo no Terminal:</span>
              <span
                className={`text-base font-bold ${
                  metricas.statusGargalo === 'FLUIDO'
                    ? 'text-emerald-400'
                    : metricas.statusGargalo === 'MODERADO_ATENCAO'
                      ? 'text-yellow-400'
                      : 'text-rose-400'
                }`}
              >
                {metricas.statusGargalo === 'FLUIDO'
                  ? '✓ OPERAÇÃO FLUIDA (OCUPAÇÃO SEGURA)'
                  : metricas.statusGargalo === 'MODERADO_ATENCAO'
                    ? '⚠ OPERAÇÃO MODERADA (ATENÇÃO AOS GARGALOS)'
                    : '🚨 ALERTA CRÍTICO: RISCO DE PARALISAÇÃO E MULTAS ALTAS'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#66736A] block">Custo Total de Estadia no Dia:</span>
              <span className={`text-xl font-bold ${metricas.custoTotalEstadiaDiaReais === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                R$ {metricas.custoTotalEstadiaDiaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
