import React, { useState, useMemo } from 'react';
import {
  Radio,
  Truck,
  TrendingUp,
  DollarSign,
  Layers,
  Award,
  CheckCircle2,
  Clock,
  Navigation,
  Fuel,
  Cpu,
} from 'lucide-react';

interface VeiculoFitaLogistica {
  id: string;
  prefixo: string;
  tipo: 'RODOTREM_9_EIXOS' | 'TRANSBORDO_CANAVIEIRO' | 'COLHEITADEIRA_DUPLA' | 'CAMINHAO_CACAMBA';
  motoristaOperador: string;
  velocidadeKmH: number;
  consumoLPorHora: number;
  tempoEsperaFilaMin: number;
  status: 'EM_TRANSITO' | 'CARREGAMENTO' | 'DESCARGA_MOEGA' | 'AGUARDANDO_SLOT';
  eficienciaFitaPct: number;
}

export const TorreControleLogisticoCocModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'torre' | 'telemetria' | 'algoritmo' | 'simulador'>('torre');

  // Parâmetros do Simulador
  const [viagensSafra, setViagensSafra] = useState<number>(36000);
  const [tempoCicloMinutos, setTempoCicloMinutos] = useState<number>(145);
  const [reducaoCicloAlvoMinutos, setReducaoCicloAlvoMinutos] = useState<number>(18);
  const [custoHoraCaminhaoReais, setCustoHoraCaminhaoReais] = useState<number>(240);
  const [consumoDieselLitroPreco, setConsumoDieselLitroPreco] = useState<number>(6.2);
  const [dieselEconomizadoPorViagemLitros, setDieselEconomizadoPorViagemLitros] = useState<number>(4.5);

  const [frota, setFrota] = useState<VeiculoFitaLogistica[]>([
    {
      id: 'COC-ROD-101',
      prefixo: 'Rodotrem 101 (Canavieiro)',
      tipo: 'RODOTREM_9_EIXOS',
      motoristaOperador: 'Carlos Santana',
      velocidadeKmH: 62,
      consumoLPorHora: 42.5,
      tempoEsperaFilaMin: 8,
      status: 'EM_TRANSITO',
      eficienciaFitaPct: 96.2,
    },
    {
      id: 'COC-TRB-402',
      prefixo: 'Transbordo 402 (Frente 3)',
      tipo: 'TRANSBORDO_CANAVIEIRO',
      motoristaOperador: 'Marcos Silveira',
      velocidadeKmH: 14,
      consumoLPorHora: 28.0,
      tempoEsperaFilaMin: 2,
      status: 'CARREGAMENTO',
      eficienciaFitaPct: 98.5,
    },
    {
      id: 'COC-ROD-105',
      prefixo: 'Rodotrem 105 (Grãos)',
      tipo: 'RODOTREM_9_EIXOS',
      motoristaOperador: 'Juliana Mendes',
      velocidadeKmH: 0,
      consumoLPorHora: 3.2,
      tempoEsperaFilaMin: 14,
      status: 'DESCARGA_MOEGA',
      eficienciaFitaPct: 92.0,
    },
    {
      id: 'COC-COL-08',
      prefixo: 'Colheitadeira Axial 08',
      tipo: 'COLHEITADEIRA_DUPLA',
      motoristaOperador: 'Robson Pires',
      velocidadeKmH: 6.5,
      consumoLPorHora: 58.0,
      tempoEsperaFilaMin: 0,
      status: 'CARREGAMENTO',
      eficienciaFitaPct: 99.1,
    },
  ]);

  const metricas = useMemo(() => {
    const horasEconomizadasSafra = Number(((viagensSafra * reducaoCicloAlvoMinutos) / 60).toFixed(0));
    const economiaHorasFrotaReais = Number((horasEconomizadasSafra * custoHoraCaminhaoReais).toFixed(2));
    const dieselTotalEconomizadoLitros = Number((viagensSafra * dieselEconomizadoPorViagemLitros).toFixed(0));
    const economiaDieselReais = Number((dieselTotalEconomizadoLitros * consumoDieselLitroPreco).toFixed(2));
    const economiaTotalSafraReais = Number((economiaHorasFrotaReais + economiaDieselReais).toFixed(2));

    return {
      horasEconomizadasSafra,
      economiaHorasFrotaReais,
      dieselTotalEconomizadoLitros,
      economiaDieselReais,
      economiaTotalSafraReais,
    };
  }, [
    viagensSafra,
    reducaoCicloAlvoMinutos,
    custoHoraCaminhaoReais,
    consumoDieselLitroPreco,
    dieselEconomizadoPorViagemLitros,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Radio className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Torre de Controle Logístico & Centro de Operações Conectadas (COC)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Módulo 125 • Telemetria RTK & Sincronismo de Fita Logística
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Despacho dinâmico de frotas agrícolas, eliminação de tempo ocioso em filas de moega e redução de consumo de diesel com algoritmos de roteirização.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Eficiência
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Economia Anual Projetada</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.economiaTotalSafraReais / 1000000).toFixed(2)}M
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Diesel + horas de máquina poupadas
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Diesel Economizado</span>
            <Fuel className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {(metricas.dieselTotalEconomizadoLitros / 1000).toFixed(1)}k Litros
          </p>
          <span className="text-xs text-cyan-400 mt-1 block">
            {dieselEconomizadoPorViagemLitros} L / viagem a menos
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tempo Poupado</span>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.horasEconomizadasSafra.toLocaleString('pt-BR')} horas
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            -{reducaoCicloAlvoMinutos} min / ciclo de transbordo
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Eficiência Média da Fita</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            96.4%
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Aderência à janela ótima de moega
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('torre')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'torre'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Radio className="w-4 h-4" />
          Painel da Torre (COC)
        </button>

        <button
          onClick={() => setActiveTab('telemetria')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'telemetria'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Truck className="w-4 h-4" />
          Telemetria & Frotas
        </button>

        <button
          onClick={() => setActiveTab('algoritmo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'algoritmo'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Algoritmo de Despacho
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'torre' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            Visão Geral em Tempo Real da Fita Logística Agroindustrial
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Prefixo / Veículo</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Operador</th>
                  <th className="px-4 py-3">Velocidade</th>
                  <th className="px-4 py-3">Consumo</th>
                  <th className="px-4 py-3">Fila / Espera</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Eficiência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {frota.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-white">{v.prefixo}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{v.tipo}</td>
                    <td className="px-4 py-3 text-slate-300">{v.motoristaOperador}</td>
                    <td className="px-4 py-3">{v.velocidadeKmH} km/h</td>
                    <td className="px-4 py-3 text-cyan-400">{v.consumoLPorHora} L/h</td>
                    <td className="px-4 py-3 font-bold text-amber-400">{v.tempoEsperaFilaMin} min</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{v.eficienciaFitaPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'telemetria' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">Geolocalização RTK Submétrica</h4>
            </div>
            <p className="text-xs text-slate-400">
              Antenas GNSS RTK integradas ao CAN Bus informando posicionamento preciso das frentes de colheita e estimando tempo de chegada (ETA) à moega.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Precisão Posicional:</span>
              <span className="text-sm font-bold text-cyan-400 block">inferior a 2.5 cm em linha de tráfego</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Fuel className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Gestão Energética de Diesel</h4>
            </div>
            <p className="text-xs text-slate-400">
              Alertas automáticos para motor ocioso acima de 5 minutos, acelerações bruscas e desvios de rota homologada em estradas vicinais.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Ociosidade de Motor:</span>
              <span className="text-sm font-bold text-yellow-400 block">reduzida de 14% para 2.8%</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Slotting Dinâmico de Moega</h4>
            </div>
            <p className="text-xs text-slate-400">
              Agendamento eletrônico de descarga sincronizado com a taxa horária de esmagamento industrial, eliminando comboios e filas externas.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Tempo Médio na Moega:</span>
              <span className="text-sm font-bold text-emerald-400 block">7.5 minutos / caminhão</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'algoritmo' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Inteligência Artificial de Alocação e Despacho em Malha Aberta
          </h3>
          <p className="text-sm text-slate-400">
            O algoritmo prevê a taxa de enchimento de cada transbordo na frente de colheita e despacha o rodotrem mais próximo para acoplamento pontual, evitando paradas de colheitadeira por falta de caixa de transbordo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">1. Taxa de Colheita</span>
              <p className="text-sm font-bold text-white mt-1">95 ton/h por frente</p>
              <span className="text-[11px] text-cyan-400">Leitura contínua CAN</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">2. Previsão de Chegada</span>
              <p className="text-sm font-bold text-white mt-1">ETA Dinâmico</p>
              <span className="text-[11px] text-cyan-400">Algoritmo Dijkstra ponderado</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">3. Moega Sincronizada</span>
              <p className="text-sm font-bold text-white mt-1">Capacidade 1.400 t/h</p>
              <span className="text-[11px] text-cyan-400">Slotting sem fila</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">4. Retorno ao Talhão</span>
              <p className="text-sm font-bold text-white mt-1">Velocidade cruzeiro</p>
              <span className="text-[11px] text-cyan-400">Eficiência de fita máxima</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-cyan-400" />
            Simulador de Redução de Ciclo Logístico & Ganhos de Escala
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Viagens na Safra</label>
              <input
                type="number"
                value={viagensSafra}
                onChange={(e) => setViagensSafra(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Minutos Reduzidos / Viagem</label>
              <input
                type="number"
                value={reducaoCicloAlvoMinutos}
                onChange={(e) => setReducaoCicloAlvoMinutos(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Custo Hora Caminhão (R$)</label>
              <input
                type="number"
                value={custoHoraCaminhaoReais}
                onChange={(e) => setCustoHoraCaminhaoReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Diesel Poupado (L/viagem)</label>
              <input
                type="number"
                step="0.5"
                value={dieselEconomizadoPorViagemLitros}
                onChange={(e) => setDieselEconomizadoPorViagemLitros(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Horas de Operação Poupadas:</span>
              <span className="text-base font-bold text-yellow-400">
                {metricas.horasEconomizadasSafra.toLocaleString('pt-BR')} horas de frota ativa
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Economia Financeira Líquida:</span>
              <span className="text-xl font-bold text-emerald-400">
                R$ {metricas.economiaTotalSafraReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
