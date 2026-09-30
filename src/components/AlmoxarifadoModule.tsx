import React, { useState } from 'react';
import {
  Package,
  FileCode,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Calculator,
  RefreshCw,
  Search,
  Plus,
  Minus,
  X,
  CheckCircle2
} from 'lucide-react';
import { INSUMOS_INICIAIS, InsumoEstoqueData, TALHOES_INICIAIS } from '../data/mockAgroData';

export const AlmoxarifadoModule: React.FC = () => {
  const [insumos, setInsumos] = useState<InsumoEstoqueData[]>(INSUMOS_INICIAIS);
  const [searchTerm, setSearchTerm] = useState('');
  const [xmlImported, setXmlImported] = useState(false);

  // Modais de Lançamento de Almoxarifado
  const [modalEntradaOpen, setModalEntradaOpen] = useState(false);
  const [modalSaidaOpen, setModalSaidaOpen] = useState(false);

  // Form states: Entrada de Insumo
  const [entradaInsumoId, setEntradaInsumoId] = useState<string>('ins-01');
  const [entradaQtd, setEntradaQtd] = useState<number>(500);
  const [entradaPrecoUnit, setEntradaPrecoUnit] = useState<number>(75.0);
  const [entradaNotaFiscal, setEntradaNotaFiscal] = useState<string>('NF-e 004128');

  // Form states: Saída / Baixa de Insumo
  const [saidaInsumoId, setSaidaInsumoId] = useState<string>('ins-02');
  const [saidaTalhaoId, setSaidaTalhaoId] = useState<string>('talhao-02');
  const [saidaQtd, setSaidaQtd] = useState<number>(120);

  // Simulação de Importação de XML de NF-e
  const handleSimularImportacaoNFe = () => {
    setInsumos((prev) =>
      prev.map((ins) => {
        if (ins.id === 'ins-02') {
          const qtdNota = 400;
          const custoEfetivoNota = 340.0;
          const novoSaldo = ins.saldoAtual + qtdNota;
          const novoCustoMedio =
            (ins.saldoAtual * ins.custoMedioUnitario + qtdNota * custoEfetivoNota) /
            novoSaldo;
          return {
            ...ins,
            saldoAtual: novoSaldo,
            custoMedioUnitario: Number(novoCustoMedio.toFixed(2)),
          };
        }
        return ins;
      })
    );
    setXmlImported(true);
  };

  // Handler para Entrada Manual de Nota Fiscal
  const handleConfirmarEntrada = () => {
    setInsumos((prev) =>
      prev.map((ins) => {
        if (ins.id === entradaInsumoId) {
          const novoSaldo = ins.saldoAtual + entradaQtd;
          const novoCustoMedio =
            (ins.saldoAtual * ins.custoMedioUnitario + entradaQtd * entradaPrecoUnit) /
            novoSaldo;
          return {
            ...ins,
            saldoAtual: novoSaldo,
            custoMedioUnitario: Number(novoCustoMedio.toFixed(2)),
          };
        }
        return ins;
      })
    );
    setModalEntradaOpen(false);
  };

  // Handler para Saída Manual para Campo
  const handleConfirmarSaida = () => {
    setInsumos((prev) =>
      prev.map((ins) => {
        if (ins.id === saidaInsumoId) {
          const novoSaldo = Math.max(0, ins.saldoAtual - saidaQtd);
          return {
            ...ins,
            saldoAtual: novoSaldo,
          };
        }
        return ins;
      })
    );
    setModalSaidaOpen(false);
  };

  const filteredInsumos = insumos.filter(
    (ins) =>
      ins.nomeComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.principioAtivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner do Almoxarifado */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs font-bold">
              Gestão de Insumos & Custo Médio Móvel
            </span>
            <span className="text-xs text-slate-400">Almoxarifado Central Sede</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" /> Inventário de Defensivos, Fertilizantes e Diesel
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cada aplicação no campo pelo tratorista consome o estoque e apropria o custo exato no talhão em tempo real.
          </p>
        </div>

        {/* Ações Rápidas de Lançamento */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setModalEntradaOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nova Entrada NF-e
          </button>
          <button
            onClick={() => setModalSaidaOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Minus className="w-4 h-4" /> Baixa para Lavoura
          </button>
          <button
            onClick={handleSimularImportacaoNFe}
            disabled={xmlImported}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all ${
              xmlImported
                ? 'bg-slate-800 text-emerald-400 border border-emerald-800/40 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
            }`}
          >
            {xmlImported ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" /> NF-e #184920 OK
              </>
            ) : (
              <>
                <FileCode className="w-4 h-4" /> Importar XML
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerta de Custo Médio Ponderado Recalculado */}
      {xmlImported && (
        <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-800/60 p-4 rounded-xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Custo Médio Ponderado Atualizado Automaticamente via NF-e:
              </p>
              <p className="text-xs text-slate-300">
                Insumo: <span className="font-semibold text-emerald-300">Fox Xpro (Fungicida)</span> • Entrada de 400 L • Saldo foi de 620 L para 1.020 L • Custo Médio Unitário recalculado de <span className="line-through text-slate-400">R$ 310,00</span> para <span className="font-bold text-white">R$ 321,76/L</span>.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-900 text-emerald-300 px-2.5 py-1 rounded-full font-bold">
            Auditado SEFAZ
          </span>
        </div>
      )}

      {/* Barra de Pesquisa e Tabela */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar insumo ou princípio ativo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-400">
            Mostrando <b>{filteredInsumos.length}</b> itens em estoque
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Insumo Comercial</th>
                <th className="px-4 py-3">Princípio Ativo</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3 text-right">Saldo Físico</th>
                <th className="px-4 py-3 text-right text-emerald-400">Custo Médio Unitário</th>
                <th className="px-4 py-3 text-right">Valor Total em Estoque</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredInsumos.map((ins) => {
                const totalFinanceiro = ins.saldoAtual * ins.custoMedioUnitario;
                const isBaixo = ins.saldoAtual <= ins.estoqueMinimo;

                return (
                  <tr key={ins.id} className="hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-bold text-white">{ins.nomeComercial}</td>
                    <td className="px-4 py-3 text-slate-400">{ins.principioAtivo}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {ins.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-200">
                      {ins.saldoAtual.toLocaleString('pt-BR')} {ins.unidade}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                      R$ {ins.custoMedioUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / {ins.unidade}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300">
                      R$ {totalFinanceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isBaixo ? (
                        <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Abaixo do Mínimo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-[10px] font-bold">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Entrada de NF-e */}
      {modalEntradaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Lançamento de Entrada de Insumo (NF-e)
              </h3>
              <button onClick={() => setModalEntradaOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Insumo / Produto</label>
                <select
                  value={entradaInsumoId}
                  onChange={(e) => setEntradaInsumoId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                >
                  {insumos.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.nomeComercial} (Saldo: {i.saldoAtual} {i.unidade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Número da Nota Fiscal (NF-e)</label>
                <input
                  type="text"
                  value={entradaNotaFiscal}
                  onChange={(e) => setEntradaNotaFiscal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Quantidade Entrando</label>
                  <input
                    type="number"
                    value={entradaQtd}
                    onChange={(e) => setEntradaQtd(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Custo Unitário NF (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={entradaPrecoUnit}
                    onChange={(e) => setEntradaPrecoUnit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setModalEntradaOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarEntrada}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirmar Entrada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Baixa para Lavoura */}
      {modalSaidaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Minus className="w-5 h-5 text-amber-400" />
                Baixa de Insumo para Aplicação no Campo
              </h3>
              <button onClick={() => setModalSaidaOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Insumo a Baixar</label>
                <select
                  value={saidaInsumoId}
                  onChange={(e) => setSaidaInsumoId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                >
                  {insumos.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.nomeComercial} (Saldo Atual: {i.saldoAtual} {i.unidade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Talhão de Destino</label>
                <select
                  value={saidaTalhaoId}
                  onChange={(e) => setSaidaTalhaoId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                >
                  {TALHOES_INICIAIS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome} ({t.areaHa} ha - {t.cultura})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Quantidade a Baixar</label>
                <input
                  type="number"
                  value={saidaQtd}
                  onChange={(e) => setSaidaQtd(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setModalSaidaOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarSaida}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirmar Baixa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

