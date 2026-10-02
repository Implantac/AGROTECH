import React, { useState, useMemo } from 'react';
import {
  Droplets,
  Activity,
  Sliders,
  DollarSign,
  TrendingUp,
  Layers,
  Award,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Gauge,
} from 'lucide-react';

interface InjetorCanalFertirrigacao {
  id: string;
  canal: string;
  tanque: string;
  composicaoQuimica: string;
  taxaInjecaoLPorHora: number;
  proporcaoDosagem: string;
  capacidadeTanqueLitros: number;
  nivelAtualPct: number;
  status: 'INJETANDO' | 'AGUARDANDO_CICLO' | 'NIVEL_BAIXO_ALERTA';
}

export const FertirrigacaoInjecaoMulticanalModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'canais' | 'sensores' | 'receitas' | 'simulador'>('canais');

  // Parâmetros do Simulador
  const [vazaoSetorM3H, setVazaoSetorM3H] = useState<number>(45.0);
  const [horasIrrigacaoDia, setHorasIrrigacaoDia] = useState<number>(4.5);
  const [ceAlvoMsCm, setCeAlvoMsCm] = useState<number>(2.15);
  const [phAlvo, setPhAlvo] = useState<number>(6.05);
  const [custoAdubosDiaReais, setCustoAdubosDiaReais] = useState<number>(320.0);
  const [diasIrrigacaoSafra, setDiasIrrigacaoSafra] = useState<number>(180);

  const [canais, setCanais] = useState<InjetorCanalFertirrigacao[]>([
    {
      id: 'CANAL-A',
      canal: 'Canal A (Cálcio & Ferro)',
      tanque: 'Tanque Matriz A - 2.000 L',
      composicaoQuimica: 'Nitrato de Cálcio + Fe-EDDHA (Ferro Vermelho)',
      taxaInjecaoLPorHora: 45.0,
      proporcaoDosagem: '1:200',
      capacidadeTanqueLitros: 2000,
      nivelAtualPct: 82.5,
      status: 'INJETANDO',
    },
    {
      id: 'CANAL-B',
      canal: 'Canal B (Fósforo, Potássio & Magnésio)',
      tanque: 'Tanque Matriz B - 2.000 L',
      composicaoQuimica: 'MKP (Fosfato Monopotássico) + KNO3 + MgSO4',
      taxaInjecaoLPorHora: 45.0,
      proporcaoDosagem: '1:200',
      capacidadeTanqueLitros: 2000,
      nivelAtualPct: 74.0,
      status: 'INJETANDO',
    },
    {
      id: 'CANAL-C',
      canal: 'Canal C (Micronutrientes Quelatados)',
      tanque: 'Tanque Matriz C - 1.000 L',
      composicaoQuimica: 'Boro (Ácido Bórico) + Zn-EDTA + Mn-EDTA + Mo',
      taxaInjecaoLPorHora: 10.0,
      proporcaoDosagem: '1:500',
      capacidadeTanqueLitros: 1000,
      nivelAtualPct: 91.0,
      status: 'INJETANDO',
    },
    {
      id: 'CANAL-ACIDO',
      canal: 'Canal Ácido (Correção de Bicarbonatos & pH)',
      tanque: 'Tanque de Segurança Ácido - 500 L',
      composicaoQuimica: 'Ácido Nítrico 65% P.A. (Grau Agrícola)',
      taxaInjecaoLPorHora: 2.8,
      proporcaoDosagem: 'Dosagem Proporcional por Sensor',
      capacidadeTanqueLitros: 500,
      nivelAtualPct: 68.0,
      status: 'INJETANDO',
    },
  ]);

  const metricas = useMemo(() => {
    const volumeAguaDiaM3 = Number((vazaoSetorM3H * horasIrrigacaoDia).toFixed(1));
    const volumeAguaSafraM3 = Number((volumeAguaDiaM3 * diasIrrigacaoSafra).toFixed(1));
    const custoAguaNutritivaPorM3 = volumeAguaDiaM3 > 0 ? Number((custoAdubosDiaReais / volumeAguaDiaM3).toFixed(2)) : 0;
    const custoFertirrigacaoSafraReais = Number((custoAdubosDiaReais * diasIrrigacaoSafra).toFixed(2));
    const economiaVsAduboSoloReais = Number((custoFertirrigacaoSafraReais * 0.38).toFixed(2)); // Fertirrigação economiza ~38% em lixiviação

    return {
      volumeAguaDiaM3,
      volumeAguaSafraM3,
      custoAguaNutritivaPorM3,
      custoFertirrigacaoSafraReais,
      economiaVsAduboSoloReais,
    };
  }, [
    vazaoSetorM3H,
    horasIrrigacaoDia,
    custoAdubosDiaReais,
    diasIrrigacaoSafra,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-[#EAF4E7] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Droplets className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Fertirrigação Proporcional & Injeção Multicanal
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Módulo 131 • Controle Automático de CE (mS/cm) & pH
              </span>
            </div>
            <p className="text-sm text-[#66736A] mt-1">
              Injeção proporcional Venturi e Dosatron com tanques segregados para evitar precipitação de gesso, neutralização de bicarbonatos e dosagem por setor.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Fertirrigação
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Volume Diário Aplicado</span>
            <Droplets className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.volumeAguaDiaM3} m³
          </p>
          <span className="text-xs text-cyan-400 mt-1 block">
            {horasIrrigacaoDia} horas de fertirrigação ativa
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Custo da Solução / m³</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {metricas.custoAguaNutritivaPorM3.toFixed(2)}
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Insumos hidrossolúveis injetados
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Condutividade Elétrica</span>
            <Activity className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {ceAlvoMsCm} mS/cm
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            Faixa ótima para absorção osmótica
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Economia vs Adubo em Pó</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.economiaVsAduboSoloReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            -38% de perdas por lixiviação
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('canais')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'canais'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Canais de Injeção
        </button>

        <button
          onClick={() => setActiveTab('sensores')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'sensores'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Gauge className="w-4 h-4" />
          Sensores em Linha (CE & pH)
        </button>

        <button
          onClick={() => setActiveTab('receitas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'receitas'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          Compatibilidade Química
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'canais' && (
        <div className="bg-slate-900/40 rounded-2xl border border-[#EAF4E7] p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            Tanques Matriz de Injeção Dosatron / Venturi
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#26332A]">
              <thead className="text-xs uppercase bg-[#F7F9F5] text-[#66736A]">
                <tr>
                  <th className="px-4 py-3">Canal / Injetor</th>
                  <th className="px-4 py-3">Composição Nutricional</th>
                  <th className="px-4 py-3">Vazão Injeção</th>
                  <th className="px-4 py-3">Proporção</th>
                  <th className="px-4 py-3">Nível Tanque</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {canais.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-white">{c.canal}</td>
                    <td className="px-4 py-3 text-xs text-[#26332A]">{c.composicaoQuimica}</td>
                    <td className="px-4 py-3 font-mono text-cyan-400 font-bold">{c.taxaInjecaoLPorHora} L/h</td>
                    <td className="px-4 py-3 text-xs text-[#66736A]">{c.proporcaoDosagem}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-400">{c.nivelAtualPct}%</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'sensores' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">Sensor Toroidal de CE</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Leitura eletromagnética contínua sem contato metálico direto com a calda, eliminando incrustações de sais e garantindo CE estável em 2.15 mS/cm.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Tolerância Operacional:</span>
              <span className="text-sm font-bold text-cyan-400 block">± 0.05 mS/cm da meta</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Gauge className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Eletrodo Diferencial de pH</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Sonda de vidro industrial pressurizada que comanda a microdosagem de ácido nítrico para neutralização imediata de carbonatos da água de poço artesiano.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Faixa de Absorção Máxima:</span>
              <span className="text-sm font-bold text-emerald-400 block">pH 5.8 a 6.2 (Disponibilidade total de micro e macro)</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Alarme de Segurança de Desvio</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Válvula solenoide de alívio que descarta a calda de volta ao reservatório se a CE ultrapassar 3.0 mS/cm, evitando queima radicular por salinização súbita.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Tempo de Resposta:</span>
              <span className="text-sm font-bold text-yellow-400 block">Corte automático em menos de 800 ms</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'receitas' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-cyan-400" />
            Regra Fundamental de Incompatibilidade: Cálcio x Sulfatos/Fosfatos
          </h3>
          <p className="text-sm text-[#66736A]">
            A mistura de Nitrato de Cálcio com Sulfato de Magnésio ou Fosfato Monopotássico (MKP) na mesma caixa gera a precipitação imediata de Gesso insolúvel (CaSO4) e Fosfato Dicálcico, entupindo gotejadores e microaspersores.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Tanque A</span>
              <p className="text-lg font-bold text-cyan-400 mt-1">Cálcio & Ferro Quelatado</p>
              <span className="text-[11px] text-[#66736A]">Zero presença de enxofre ou fósforo</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Tanque B</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">Sulfatos & Fosfatos</p>
              <span className="text-[11px] text-[#66736A]">Dissolução completa e límpida</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Mistura na Linha Principal</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">Diluição 1:200 Dinâmica</p>
              <span className="text-[11px] text-[#66736A]">Sem contato concentrado dos sais</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-cyan-400" />
            Simulador de Eficiência Hídrico-Nutricional & Custos
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-[#66736A]">Vazão do Setor (m³/h)</label>
              <input
                type="number"
                value={vazaoSetorM3H}
                onChange={(e) => setVazaoSetorM3H(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Horas Diárias de Irrigação</label>
              <input
                type="number"
                step="0.5"
                value={horasIrrigacaoDia}
                onChange={(e) => setHorasIrrigacaoDia(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Custo Adubos / Dia (R$)</label>
              <input
                type="number"
                step="10"
                value={custoAdubosDiaReais}
                onChange={(e) => setCustoAdubosDiaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Dias de Ciclo na Safra</label>
              <input
                type="number"
                value={diasIrrigacaoSafra}
                onChange={(e) => setDiasIrrigacaoSafra(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#66736A] block">Custo Médio da Água Fertirrigada:</span>
              <span className="text-base font-bold text-cyan-400">
                R$ {metricas.custoAguaNutritivaPorM3.toFixed(2)} por m³ aplicado
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#66736A] block">Economia de Fertilizantes na Safra:</span>
              <span className="text-xl font-bold text-emerald-400">
                R$ {metricas.economiaVsAduboSoloReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
