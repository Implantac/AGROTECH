import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Plus,
  Tractor,
  DollarSign,
  Package,
  Layers,
  FileText,
  Printer,
  TrendingUp,
  Activity,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle,
  X,
  Droplet,
  Gauge
} from 'lucide-react';
import {
  ORDENS_SERVICO_OFICINA,
  MAQUINAS_INICIAIS,
  OrdemServicoOficinaData,
  MaquinaData
} from '../data/mockAgroData';

export interface AnaliseOleoTribologia {
  id: string;
  maquinaId: string;
  componente: 'MOTOR_DIESEL' | 'TRANSMISSAO_POWERSHIFT' | 'SISTEMA_HIDRAULICO' | 'DIFERENCIAL_TRASEIRO';
  dataColeta: string;
  horimetroColeta: number;
  ferroPpm: number; // Crítico se > 100
  cobrePpm: number; // Crítico se > 40
  aluminioPpm: number; // Crítico se > 30
  silicaPpm: number; // Poeira do solo, crítico se > 25
  viscosidadeCst: number; // Ideal 13.5 a 15.5 para 15W40
  diluicaoDieselPct: number; // Crítico se > 3.0%
  status: 'NORMAL' | 'ALERTA_MODERADO' | 'CRITICO_PARADA';
  diagnostico: string;
}

export const ManutencaoOficinaModule: React.FC = () => {
  const [ordensServico, setOrdensServico] = useState<OrdemServicoOficinaData[]>(ORDENS_SERVICO_OFICINA);
  const [modalNovoOpen, setModalNovoOpen] = useState(false);
  const [osParaImprimir, setOsParaImprimir] = useState<OrdemServicoOficinaData | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<'ORDENS' | 'PLANO_PREVENTIVO' | 'ANALISE_OLEO' | 'INDICADORES'>('ORDENS');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  // Form states para nova OS
  const [maquinaId, setMaquinaId] = useState('maq-03');
  const [descricao, setDescricao] = useState('Troca de navalhas da barra de corte da colheitadeira e filtros hidráulicos');
  const [custo, setCusto] = useState<number>(2400);
  const [tipoManutencao, setTipoManutencao] = useState<'PREVENTIVA_HORIMETRO' | 'CORRETIVA_URGENTE'>('PREVENTIVA_HORIMETRO');
  const [mecanico, setMecanico] = useState('Mec. Valmor Bertoncelli');

  // Amostras de Análise Laboratorial de Óleo Tribológica (SOS WearCheck)
  const [analisesOleo] = useState<AnaliseOleoTribologia[]>([
    {
      id: 'oil-01',
      maquinaId: 'maq-01',
      componente: 'MOTOR_DIESEL',
      dataColeta: '2026-09-20',
      horimetroColeta: 1800.0,
      ferroPpm: 32,
      cobrePpm: 12,
      aluminioPpm: 8,
      silicaPpm: 9,
      viscosidadeCst: 14.2,
      diluicaoDieselPct: 0.8,
      status: 'NORMAL',
      diagnostico: 'Óleo dentro dos padrões nominais. Desgaste normal de anéis e camisas. Sem contaminação externa.'
    },
    {
      id: 'oil-02',
      maquinaId: 'maq-02',
      componente: 'MOTOR_DIESEL',
      dataColeta: '2026-09-25',
      horimetroColeta: 3400.0,
      ferroPpm: 88,
      cobrePpm: 34,
      aluminioPpm: 22,
      silicaPpm: 18,
      viscosidadeCst: 13.1,
      diluicaoDieselPct: 2.2,
      status: 'ALERTA_MODERADO',
      diagnostico: 'Elevação moderada de cobre e ferro. Possível início de desgaste em bronzinas. Antecipar troca para 3.500h.'
    },
    {
      id: 'oil-03',
      maquinaId: 'maq-03',
      componente: 'SISTEMA_HIDRAULICO',
      dataColeta: '2026-09-28',
      horimetroColeta: 1100.0,
      ferroPpm: 124,
      cobrePpm: 48,
      aluminioPpm: 38,
      silicaPpm: 34,
      viscosidadeCst: 42.0,
      diluicaoDieselPct: 0.0,
      status: 'CRITICO_PARADA',
      diagnostico: 'Alerta Crítico: Presença excessiva de sílica (34 ppm) indicando rompimento do filtro de respiro hidráulico e atrito severo da bomba.'
    }
  ]);

  // Indicadores de Desempenho da Oficina
  const totalCustoOS = useMemo(() => {
    return ordensServico.reduce((acc, os) => acc + os.custoTotalPecasMaoObra, 0);
  }, [ordensServico]);

  const osEmAberto = useMemo(() => {
    return ordensServico.filter((os) => os.status === 'AGENDADA' || os.status === 'EM_ANDAMENTO').length;
  }, [ordensServico]);

  const handleCadastrarOs = () => {
    const maquinaSel = MAQUINAS_INICIAIS.find((m) => m.id === maquinaId);
    const horimetroAtual = maquinaSel ? maquinaSel.horimetroAtual : 1000;
    const horimetroProgramado = Math.ceil(horimetroAtual / 250) * 250;
    const horasRestantes = Math.max(0, Number((horimetroProgramado - horimetroAtual).toFixed(1)));

    const nova: OrdemServicoOficinaData = {
      id: `os-0${ordensServico.length + 1}`,
      numeroOs: `OS-MEC-2026-0${89 + ordensServico.length}`,
      maquinaId,
      tipoManutencao,
      horimetroProgramado,
      horimetroAtual,
      horasRestantes,
      servicosDescricao: descricao,
      pecasSubstituidas: ['Filtros de Óleo e Combustível Originais', 'Kit de Retentores e Juntas'],
      custoTotalPecasMaoObra: custo,
      mecanicoResponsavel: mecanico,
      status: 'AGENDADA',
    };

    setOrdensServico([nova, ...ordensServico]);
    setModalNovoOpen(false);
  };

  const handleConcluirOs = (id: string) => {
    setOrdensServico((prev) =>
      prev.map((os) => (os.id === id ? { ...os, status: 'CONCLUIDA' as const, horasRestantes: 0 } : os))
    );
  };

  const filteredOs = ordensServico.filter((os) => {
    const maquina = MAQUINAS_INICIAIS.find((m) => m.id === os.maquinaId);
    const matchBusca =
      os.numeroOs.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.servicosDescricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.mecanicoResponsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (maquina && maquina.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchStatus = filtroStatus === 'TODOS' || os.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner de Manutenção e Oficina */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 rounded text-xs font-bold flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-400" /> Oficina Mecânica Central & Engenharia de Frotas
            </span>
            <span className="text-xs text-slate-600">Fazenda Santa Helena • Telemetria CAN Bus J1939</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tractor className="w-5 h-5 text-amber-400" /> Manutenção Preventiva, Preditiva & Análise SOS
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Gatilhos automáticos por horímetro vindo da telemetria de tratores, colheitadeiras e pulverizadores, prevenindo quebras na safra.
          </p>
        </div>

        {/* Botão de Nova OS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalNovoOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition"
          >
            <Plus className="w-4 h-4" /> Abrir Ordem de Serviço
          </button>
        </div>
      </div>

      {/* 4 Cards de Indicadores da Oficina */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Ordens em Aberto</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">
            {osEmAberto} <span className="text-xs font-normal text-slate-600">em manutenção</span>
          </p>
          <span className="text-[11px] text-slate-600 mt-1 block">Equipe de mecânicos alocada</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Disponibilidade Mecânica</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">94.8%</p>
          <span className="text-[11px] text-emerald-400 mt-1 block font-medium">Meta: &gt; 92.0% da frota ativa</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Custo Acumulado da Frota</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-400">
            R$ {totalCustoOS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-600 mt-1 block">Peças, lubrificantes e terceiros</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>MTBF Médio (Falhas)</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">164 <span className="text-xs font-normal text-slate-600">horas</span></p>
          <span className="text-[11px] text-indigo-300 mt-1 block font-medium">Tempo médio entre quebras</span>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setAbaAtiva('ORDENS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            abaAtiva === 'ORDENS'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-900 text-slate-600 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          1. Ordens de Serviço ({ordensServico.length})
        </button>

        <button
          onClick={() => setAbaAtiva('PLANO_PREVENTIVO')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            abaAtiva === 'PLANO_PREVENTIVO'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-900 text-slate-600 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          2. Plano Preventivo por Horímetro (CAN Bus)
        </button>

        <button
          onClick={() => setAbaAtiva('ANALISE_OLEO')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            abaAtiva === 'ANALISE_OLEO'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-900 text-slate-600 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Droplet className="w-4 h-4" />
          3. Tribologia & Análise SOS de Óleo (WearCheck)
        </button>

        <button
          onClick={() => setAbaAtiva('INDICADORES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            abaAtiva === 'INDICADORES'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-900 text-slate-600 hover:text-white hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          4. MTBF / MTTR & Confiabilidade
        </button>
      </div>

      {/* ABA 1: LISTAGEM DE ORDENS DE SERVIÇO */}
      {abaAtiva === 'ORDENS' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar OS, máquina ou mecânico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="bg-slate-50 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900"
              >
                <option value="TODOS">Todos os Status</option>
                <option value="AGENDADA">Agendadas</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDA">Concluídas</option>
              </select>
            </div>

            <span className="text-xs text-slate-600">
              Mostrando <b>{filteredOs.length}</b> de <b>{ordensServico.length}</b> OS cadastradas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOs.map((os) => {
              const maquina = MAQUINAS_INICIAIS.find((m) => m.id === os.maquinaId);

              return (
                <div
                  key={os.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400">{os.numeroOs}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-900 font-semibold">
                            {os.tipoManutencao === 'PREVENTIVA_HORIMETRO' ? 'Preventiva Horímetro' : 'Corretiva'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">
                          {maquina ? maquina.nome : 'Trator Agrícola'}
                        </h3>
                        <p className="text-xs text-slate-600 font-mono">
                          Horímetro Atual: <b>{os.horimetroAtual}h</b> • Programado: <b>{os.horimetroProgramado}h</b>
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          os.status === 'CONCLUIDA'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : os.status === 'EM_ANDAMENTO'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {os.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                      {os.servicosDescricao}
                    </p>

                    {/* Peças Substituídas */}
                    <div className="text-xs space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-slate-500">Peças e Lubrificantes:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {os.pecasSubstituidas.map((p, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-800/80 text-slate-900 rounded text-[11px]">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Mecânico Responsável</span>
                      <span className="text-slate-900 font-medium">{os.mecanicoResponsavel}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        R$ {os.custoTotalPecasMaoObra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>

                      {os.status !== 'CONCLUIDA' && (
                        <button
                          onClick={() => handleConcluirOs(os.id)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          title="Marcar como Concluída"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Concluir
                        </button>
                      )}

                      <button
                        onClick={() => setOsParaImprimir(os)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-900 hover:text-white rounded-lg transition"
                        title="Visualizar / Imprimir OS A4"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 2: PLANO PREVENTIVO POR HORÍMETRO */}
      {abaAtiva === 'PLANO_PREVENTIVO' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              Cronograma de Revisões Preventivas por Horímetro (Telemetria CAN Bus)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Intervalos padrão do fabricante (250h, 500h, 1.000h, 2.000h). Alertas automáticos disparam quando restam menos de 50 horas para a intervenção.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {MAQUINAS_INICIAIS.map((maq) => {
              const proximaRevisao = Math.ceil(maq.horimetroAtual / 250) * 250;
              const horasRestantes = Number((proximaRevisao - maq.horimetroAtual).toFixed(1));
              const pctCiclo = ((250 - horasRestantes) / 250) * 100;
              const isUrgente = horasRestantes < 20;

              return (
                <div key={maq.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Tractor className="w-4 h-4 text-amber-400" />
                        <h4 className="font-bold text-white text-sm">{maq.nome}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-600 font-mono">
                          {maq.tipo}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Horímetro Atual: <b className="text-white font-mono">{maq.horimetroAtual}h</b> • Próxima Parada Programada: <b className="text-amber-400 font-mono">{proximaRevisao}h</b>
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                        isUrgente
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : horasRestantes < 50
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {horasRestantes}h Restantes ({isUrgente ? 'PARADA IMINENTE' : 'REGULAR'})
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isUrgente ? 'bg-red-500' : horasRestantes < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, pctCiclo))}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Última Revisão ({proximaRevisao - 250}h)</span>
                      <span>Progresso do Ciclo: {pctCiclo.toFixed(0)}%</span>
                      <span>Revisão Programada ({proximaRevisao}h)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 3: TRIBOLOGIA E ANÁLISE DE ÓLEO SOS */}
      {abaAtiva === 'ANALISE_OLEO' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Droplet className="w-5 h-5 text-cyan-400" />
              Monitoramento Preditivo por Análise Tribológica de Óleo (Laboratório SOS)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Espectrometria de emissão atômica para detecção de metais de desgaste prematuro (Ferro, Cobre, Alumínio) e contaminação externa (Sílica/Poeira e Diesel).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {analisesOleo.map((an) => {
              const maquina = MAQUINAS_INICIAIS.find((m) => m.id === an.maquinaId);

              return (
                <div
                  key={an.id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">{maquina ? maquina.nome : 'Máquina'}</h4>
                        <span className="text-[10px] text-cyan-400 font-mono block">{an.componente}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          an.status === 'CRITICO_PARADA'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : an.status === 'ALERTA_MODERADO'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {an.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-3">
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Ferro (Fe)</span>
                        <span className={`font-mono font-bold ${an.ferroPpm > 100 ? 'text-red-400' : 'text-slate-900'}`}>
                          {an.ferroPpm} ppm
                        </span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Cobre (Cu)</span>
                        <span className={`font-mono font-bold ${an.cobrePpm > 40 ? 'text-red-400' : 'text-slate-900'}`}>
                          {an.cobrePpm} ppm
                        </span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Sílica (Poeira)</span>
                        <span className={`font-mono font-bold ${an.silicaPpm > 25 ? 'text-red-400' : 'text-slate-900'}`}>
                          {an.silicaPpm} ppm
                        </span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Diluição Diesel</span>
                        <span className={`font-mono font-bold ${an.diluicaoDieselPct > 3 ? 'text-red-400' : 'text-slate-900'}`}>
                          {an.diluicaoDieselPct}%
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                      <b>Diagnóstico:</b> {an.diagnostico}
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-200 flex justify-between">
                    <span>Coleta: {an.dataColeta}</span>
                    <span>Horímetro: {an.horimetroColeta}h</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 4: INDICADORES E CONFIABILIDADE */}
      {abaAtiva === 'INDICADORES' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Indicadores Chave de Desempenho da Engenharia de Manutenção Rural
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Métricas de confiabilidade operacional para dimensionamento da frota reserva e redução do custo por hora trabalhada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs text-slate-600">Taxa de Manutenção Preventiva vs Corretiva</span>
              <p className="text-2xl font-bold text-emerald-400">82% / 18%</p>
              <p className="text-[11px] text-slate-500">Padrão classe mundial: &gt; 80% preventiva para evitar quebras em safra.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs text-slate-600">MTTR (Tempo Médio de Reparo)</span>
              <p className="text-2xl font-bold text-amber-400">3.8 Horas</p>
              <p className="text-[11px] text-slate-500">Agilidade no reabastecimento de peças originais e retorno à lavoura.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs text-slate-600">Custo de Manutenção / Hora Frota</span>
              <p className="text-2xl font-bold text-cyan-400">R$ 48,20 / h</p>
              <p className="text-[11px] text-slate-500">Dentro do orçamento operacional aprovado de R$ 52,00/h.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulário Abertura de Nova OS */}
      {modalNovoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                Abertura de Ordem de Serviço Mecânica (OS)
              </h3>
              <button onClick={() => setModalNovoOpen(false)} className="text-slate-600 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">Máquina / Equipamento Agrícola</label>
                <select
                  value={maquinaId}
                  onChange={(e) => setMaquinaId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                >
                  {MAQUINAS_INICIAIS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome} (Horímetro: {m.horimetroAtual}h)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Tipo de Intervenção</label>
                  <select
                    value={tipoManutencao}
                    onChange={(e) => setTipoManutencao(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="PREVENTIVA_HORIMETRO">Preventiva Horímetro</option>
                    <option value="CORRETIVA_URGENTE">Corretiva Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">Custo Estimado (R$)</label>
                  <input
                    type="number"
                    value={custo}
                    onChange={(e) => setCusto(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Descrição Detalhada do Serviço</label>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-700 rounded-xl p-3 text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Mecânico Chefe Responsável</label>
                <input
                  type="text"
                  value={mecanico}
                  onChange={(e) => setMecanico(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalNovoOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-900 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCadastrarOs}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Registrar e Abrir OS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Impressão A4 Oficial de Ordem de Serviço */}
      {osParaImprimir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-slate-950 rounded-2xl w-full max-w-2xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Cabeçalho Oficial A4 */}
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  ORDEM DE SERVIÇO MECÂNICA OFICIAL • SUPER AGTECH
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{osParaImprimir.numeroOs}</h2>
                <span className="text-xs text-slate-600 font-mono">Oficina Central Fazenda Santa Helena</span>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-slate-900 text-white font-mono font-bold text-xs rounded">
                  STATUS: {osParaImprimir.status}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Data: 01/10/2026</span>
              </div>
            </div>

            {/* Informações da Máquina */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 font-semibold block">Equipamento:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {MAQUINAS_INICIAIS.find((m) => m.id === osParaImprimir.maquinaId)?.nome || 'Trator'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Tipo de Intervenção:</span>
                <span className="font-bold text-slate-900">{osParaImprimir.tipoManutencao}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Horímetro na Intervenção:</span>
                <span className="font-mono font-bold text-slate-900">{osParaImprimir.horimetroAtual} horas</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Mecânico Chefe:</span>
                <span className="font-bold text-slate-900">{osParaImprimir.mecanicoResponsavel}</span>
              </div>
            </div>

            {/* Serviços e Peças */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold uppercase text-slate-700 block">Serviços Executados:</span>
                <p className="mt-1 p-3 bg-slate-100 rounded-lg border border-slate-200 text-slate-800 leading-relaxed">
                  {osParaImprimir.servicosDescricao}
                </p>
              </div>

              <div>
                <span className="font-bold uppercase text-slate-700 block">Peças / Insumos Utilizados:</span>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-800">
                  {osParaImprimir.pecasSubstituidas.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-950 uppercase">Custo Total Apropriado no Centro de Custos:</span>
                <span className="font-mono font-black text-emerald-900 text-base">
                  R$ {osParaImprimir.custoTotalPecasMaoObra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Assinaturas */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-600 border-t border-slate-200">
              <div>
                <div className="border-t border-slate-400 pt-1">
                  <b>{osParaImprimir.mecanicoResponsavel}</b>
                  <span className="block text-[10px]">Mecânico Chefe Executor</span>
                </div>
              </div>
              <div>
                <div className="border-t border-slate-400 pt-1">
                  <b>Eng. Agrônomo / Gestor de Frotas</b>
                  <span className="block text-[10px]">Aprovação Operacional</span>
                </div>
              </div>
            </div>

            {/* Ações do Modal */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 print:hidden">
              <button
                onClick={() => setOsParaImprimir(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" /> Imprimir Documento A4
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
