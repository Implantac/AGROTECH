import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import { ORDENS_SERVICO_OFICINA, MAQUINAS_INICIAIS, OrdemServicoOficinaData } from '../data/mockAgroData';

export const ManutencaoOficinaModule: React.FC = () => {
  const [ordensServico, setOrdensServico] = useState<OrdemServicoOficinaData[]>(ORDENS_SERVICO_OFICINA);
  const [modalNovoOpen, setModalNovoOpen] = useState(false);

  // Form states
  const [maquinaId, setMaquinaId] = useState('maq-03');
  const [descricao, setDescricao] = useState('Troca de navalhas da barra de corte da colheitadeira e filtros');
  const [custo, setCusto] = useState<number>(2400);

  const handleCadastrarOs = () => {
    const nova: OrdemServicoOficinaData = {
      id: `os-0${ordensServico.length + 1}`,
      numeroOs: `OS-MEC-2026-0${89 + ordensServico.length}`,
      maquinaId,
      tipoManutencao: 'PREVENTIVA_HORIMETRO',
      horimetroProgramado: 1200.0,
      horimetroAtual: 1120.5,
      horasRestantes: 79.5,
      servicosDescricao: descricao,
      pecasSubstituidas: ['Kit de Navalhas Originais Case IH', 'Filtro Hidráulico'],
      custoTotalPecasMaoObra: custo,
      mecanicoResponsavel: 'Mec. Valmor Bertoncelli',
      status: 'AGENDADA',
    };

    setOrdensServico([nova, ...ordensServico]);
    setModalNovoOpen(false);
    alert(`✓ Ordem de Serviço ${nova.numeroOs} agendada com sucesso na oficina mecânica da sede!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Manutenção e Oficina */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 rounded text-xs font-bold flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" /> Oficina Mecânica da Sede & Gestão de Frotas
            </span>
            <span className="text-xs text-slate-400">Gatilhos Preventivos Automáticos por Horímetro CAN Bus</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" /> Manutenção Preventiva, Lubrificantes & Ordens de Serviço
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Evita paradas catastróficas em plena janela de plantio e colheita. Os custos de peças e óleos são incorporados no custo/hora das máquinas.
          </p>
        </div>

        <button
          onClick={() => setModalNovoOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Nova Ordem de Serviço (OS)
        </button>
      </div>

      {/* Grid de Ordens de Serviço Ativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ordensServico.map((os) => {
          const maquina = MAQUINAS_INICIAIS.find((m) => m.id === os.maquinaId);

          return (
            <div
              key={os.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{os.numeroOs}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Prog: {os.horimetroProgramado}h
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{maquina?.nome}</h3>
                  <p className="text-xs text-slate-400">
                    Mecânico: <span className="font-semibold text-slate-200">{os.mecanicoResponsavel}</span>
                  </p>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    os.status === 'EM_ANDAMENTO'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                      : os.status === 'CONCLUIDA'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}
                >
                  {os.status}
                </span>
              </div>

              {/* Status do Horímetro */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Horímetro Atual (CAN Bus):</span>
                  <span className="font-mono font-bold text-white text-sm">{os.horimetroAtual}h</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Horas Restantes p/ Revisão:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {os.horasRestantes > 0 ? `${os.horasRestantes}h restantes` : 'REVISÃO VENCIDA!'}
                  </span>
                </div>
              </div>

              {/* Descrição dos Serviços */}
              <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                <span className="font-bold text-slate-200 block mb-1">Escopo Técnico:</span>
                {os.servicosDescricao}
              </div>

              {/* Peças Substituídas */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Peças / Óleos Requisitados do Almoxarifado:</span>
                <div className="flex flex-wrap gap-1.5">
                  {os.pecasSubstituidas.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rodapé com Custo e Ações */}
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">
                  Custo da Manutenção: <b className="text-emerald-400 font-mono">R$ {os.custoTotalPecasMaoObra.toFixed(2)}</b>
                </span>
                <button
                  onClick={() => alert(`✓ Ordem de Serviço ${os.numeroOs} encerrada e custos apropriados no histórico da frota.`)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 shadow"
                >
                  Concluir Revisão
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Nova OS */}
      {modalNovoOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-md w-full shadow-2xl text-slate-200 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-emerald-400" /> Abrir Nova Ordem de Serviço de Oficina
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Máquina / Equipamento Agrícola</label>
                <select
                  value={maquinaId}
                  onChange={(e) => setMaquinaId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {MAQUINAS_INICIAIS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome} (Horímetro: {m.horimetroAtual}h)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Descrição do Serviço Mecânico</label>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white resize-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Custo Estimado de Peças e Serviços (R$)</label>
                <input
                  type="number"
                  value={custo}
                  onChange={(e) => setCusto(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setModalNovoOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCadastrarOs}
                className="px-4 py-1.5 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/40"
              >
                Registrar Ordem de Serviço
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
