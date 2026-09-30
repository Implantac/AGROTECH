import React, { useState } from 'react';
import {
  Handshake,
  DollarSign,
  TrendingUp,
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  Plus,
  Building,
  Scale,
  PieChart
} from 'lucide-react';
import { CONTRATOS_BARTER_INICIAIS, ContratoGraosBarterData, TALHOES_INICIAIS } from '../data/mockAgroData';

export const ComercializacaoBarterModule: React.FC = () => {
  const [contratos, setContratos] = useState<ContratoGraosBarterData[]>(CONTRATOS_BARTER_INICIAIS);
  const [modalNovoOpen, setModalNovoOpen] = useState(false);

  // Totais da Comercialização
  const totalAreaHa = TALHOES_INICIAIS.reduce((acc, curr) => acc + curr.areaHa, 0); // 2.450 ha
  const metaProdutividade = 68; // sc/ha
  const producaoEstimadaTotal = totalAreaHa * metaProdutividade; // 166.600 sc

  const sacasContratadas = contratos.reduce((acc, curr) => acc + curr.quantidadeSacas60kg, 0);
  const sacasEntreguesTotal = contratos.reduce((acc, curr) => acc + curr.sacasEntregues, 0);
  const sacasDisponiveisSpot = Math.max(0, producaoEstimadaTotal - sacasContratadas);
  const valorTotalContratos = contratos.reduce((acc, curr) => acc + curr.valorTotalContrato, 0);
  const percentualTravado = ((sacasContratadas / producaoEstimadaTotal) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner de Comercialização e Barter */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs font-bold flex items-center gap-1.5">
              <Handshake className="w-3.5 h-3.5" /> Barter de Insumos & Cédula de Produto Rural (CPR)
            </span>
            <span className="text-xs text-slate-400">Safra 2025/2026 • Comercialização de Soja e Milho</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Gestão de Contratos Futuros, Tradings e Barter
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Controle de amortização de defensivos e sementes via entrega física de sacas para tradings (Cargill, Bunge, Amaggi).
          </p>
        </div>

        <button
          onClick={() => setModalNovoOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Novo Contrato / CPR
        </button>
      </div>

      {/* 4 Cards de Posição de Comercialização */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Produção Estimada</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {producaoEstimadaTotal.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">sc</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Meta: 68 sc/ha em 2.450 ha</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Volume Travado (Hedge)</span>
            <span className="text-xs font-bold text-emerald-400">{percentualTravado}%</span>
          </div>
          <p className="text-2xl font-black text-amber-400">
            {sacasContratadas.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">sc</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Barter + Vendas Futuras</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Sacas Entregues (Armazém)</span>
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-blue-400">
            {sacasEntreguesTotal.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">sc</span>
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 block font-semibold">
            {((sacasEntreguesTotal / sacasContratadas) * 100).toFixed(1)}% do compromisso físico
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Disponível Mercado Spot</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>
          <p className="text-2xl font-black text-emerald-400">
            {sacasDisponiveisSpot.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">sc</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Sacas livres para venda em alta</span>
        </div>
      </div>

      {/* Tabela de Contratos Futuros e Barter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-white">Contratos de Comercialização e Operações de Barter</h3>
            <p className="text-xs text-slate-400">Vínculo com Cédula de Produto Rural (CPR Registrada em Cartório)</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            Total Contratado: R$ {valorTotalContratos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Contrato / CPR</th>
                <th className="px-4 py-3">Trading / Comprador</th>
                <th className="px-4 py-3">Modalidade</th>
                <th className="px-4 py-3 text-right">Volume (sc 60kg)</th>
                <th className="px-4 py-3 text-right text-emerald-400">Preço Unitário</th>
                <th className="px-4 py-3 text-right">Valor Total (R$)</th>
                <th className="px-4 py-3">Progresso de Entrega</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {contratos.map((ct) => {
                const progressoPct = (ct.sacasEntregues / ct.quantidadeSacas60kg) * 100;

                return (
                  <tr key={ct.id} className="hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-white block">{ct.numeroContrato}</span>
                      <span className="text-[10px] font-mono text-slate-500">{ct.cprVinculadaNumero}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-200 block">{ct.compradorTrader}</span>
                      <span className="text-[10px] text-slate-400">{ct.localEntregaArmazem}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ct.tipoOperacao === 'BARTER_INSUMOS'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}
                      >
                        {ct.tipoOperacao === 'BARTER_INSUMOS' ? 'Barter Insumos' : 'Venda Futura Fixa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-200">
                      {ct.quantidadeSacas60kg.toLocaleString('pt-BR')} sc
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                      R$ {ct.precoUnitarioSaca.toFixed(2)} / sc
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300">
                      R$ {ct.valorTotalContrato.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>{ct.sacasEntregues.toLocaleString('pt-BR')} sc</span>
                          <span>{progressoPct.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${progressoPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ct.statusEntrega === 'LIQUIDADO'
                            ? 'bg-emerald-950 text-emerald-400'
                            : ct.statusEntrega === 'ENTREGA_PARCIAL'
                            ? 'bg-blue-950 text-blue-400'
                            : 'bg-amber-950 text-amber-400'
                        }`}
                      >
                        {ct.statusEntrega}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Novo Contrato */}
      {modalNovoOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-md w-full shadow-2xl text-slate-200 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Handshake className="w-5 h-5 text-emerald-400" /> Cadastrar Contrato de Barter / CPR
            </h3>
            <p className="text-xs text-slate-400">
              Trave insumos recebidos contra entrega futura de sacas de soja ou milho.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Trading / Comprador</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white">
                  <option>Cargill Agrícola S.A.</option>
                  <option>Bunge Alimentos S.A.</option>
                  <option>Amaggi Exportação</option>
                  <option>LDC (Louis Dreyfus Company)</option>
                  <option>ADM do Brasil</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Volume (Sacas 60kg)</label>
                  <input
                    type="number"
                    defaultValue={20000}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Preço Travado (R$/sc)</label>
                  <input
                    type="number"
                    defaultValue={135.0}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Número do Registro da CPR</label>
                <input
                  type="text"
                  defaultValue="CPR-FÍSICA-CARTÓRIO-9214"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
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
                onClick={() => {
                  alert('✓ Contrato de Barter e CPR registrados com sucesso na safra!');
                  setModalNovoOpen(false);
                }}
                className="px-4 py-1.5 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/40"
              >
                Confirmar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
