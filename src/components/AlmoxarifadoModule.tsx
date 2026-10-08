import React, { useState, useMemo } from 'react';
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
  CheckCircle2,
  QrCode,
  Calendar,
  Clock,
  TrendingUp,
  ShieldCheck,
  Layers,
  Truck,
  RotateCcw
} from 'lucide-react';
import { INSUMOS_INICIAIS, InsumoEstoqueData, TALHOES_INICIAIS } from '../data/mockAgroData';

export interface InsumoLoteInfo {
  loteNumero: string;
  dataFabricacao: string;
  dataValidade: string;
  registroMapa: string;
  diasParaVencer: number;
  statusValidade: 'REGULAR' | 'ATENCAO_90D' | 'CRITICO_30D';
}

export interface InsumoCompletoEstoque extends InsumoEstoqueData {
  lote: InsumoLoteInfo;
  classeABC: 'A' | 'B' | 'C';
  valorTotal: number;
  tempoReposicaoDias: number; // Lead time do fornecedor
  consumoMedioDiarioSafra: number;
}

const LOTES_MOCK: Record<string, InsumoLoteInfo> = {
  'ins-01': {
    loteNumero: 'GLY-2026-9481B',
    dataFabricacao: '2026-03-10',
    dataValidade: '2028-03-10',
    registroMapa: 'MAPA nº 004128/99',
    diasParaVencer: 526,
    statusValidade: 'REGULAR'
  },
  'ins-02': {
    loteNumero: 'FOX-2025-0149C',
    dataFabricacao: '2025-08-15',
    dataValidade: '2027-08-15',
    registroMapa: 'MAPA nº 010214/17',
    diasParaVencer: 318,
    statusValidade: 'REGULAR'
  },
  'ins-03': {
    loteNumero: 'ENG-2026-1182A',
    dataFabricacao: '2026-01-20',
    dataValidade: '2026-11-20',
    registroMapa: 'MAPA nº 005481/08',
    diasParaVencer: 50,
    statusValidade: 'ATENCAO_90D'
  },
  'ins-04': {
    loteNumero: 'ADU-2026-8800K',
    dataFabricacao: '2026-05-01',
    dataValidade: '2027-05-01',
    registroMapa: 'MAPA Fertilizante 091-B',
    diasParaVencer: 212,
    statusValidade: 'REGULAR'
  },
  'ins-05': {
    loteNumero: 'DIE-S10-CORP09',
    dataFabricacao: '2026-09-15',
    dataValidade: '2026-12-15',
    registroMapa: 'ANP Combustíveis 8412',
    diasParaVencer: 75,
    statusValidade: 'ATENCAO_90D'
  }
};

export const AlmoxarifadoModule: React.FC = () => {
  const [insumos, setInsumos] = useState<InsumoEstoqueData[]>(INSUMOS_INICIAIS);
  const [searchTerm, setSearchTerm] = useState('');
  const [xmlImported, setXmlImported] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('TODAS');
  const [abaAtiva, setAbaAtiva] = useState<'ESTOQUE' | 'CURVA_ABC' | 'LOTES_VALIDADE' | 'PONTO_PEDIDO'>('ESTOQUE');

  // Modais de Lançamento de Almoxarifado
  const [modalEntradaOpen, setModalEntradaOpen] = useState(false);
  const [modalSaidaOpen, setModalSaidaOpen] = useState(false);
  const [modalLeitorQrOpen, setModalLeitorQrOpen] = useState(false);
  const [codigoLido, setCodigoLido] = useState<string>('');

  // Form states: Entrada de Insumo
  const [entradaInsumoId, setEntradaInsumoId] = useState<string>('ins-01');
  const [entradaQtd, setEntradaQtd] = useState<number>(500);
  const [entradaPrecoUnit, setEntradaPrecoUnit] = useState<number>(75.0);
  const [entradaNotaFiscal, setEntradaNotaFiscal] = useState<string>('NF-e 004128');

  // Form states: Saída / Baixa de Insumo
  const [saidaInsumoId, setSaidaInsumoId] = useState<string>('ins-02');
  const [saidaTalhaoId, setSaidaTalhaoId] = useState<string>('talhao-02');
  const [saidaQtd, setSaidaQtd] = useState<number>(120);

  // Enriquecimento dos Insumos com Curva ABC e Lote
  const insumosEnriquecidos: InsumoCompletoEstoque[] = useMemo(() => {
    // Calcula valor total por item para classificar em Curva ABC
    const comValor = insumos.map((i) => {
      const valorTotal = i.saldoAtual * i.custoMedioUnitario;
      const lote = LOTES_MOCK[i.id] || {
        loteNumero: `LOTE-${i.id.toUpperCase()}-2026`,
        dataFabricacao: '2026-02-01',
        dataValidade: '2027-02-01',
        registroMapa: 'MAPA REGULAR',
        diasParaVencer: 120,
        statusValidade: 'REGULAR' as const
      };
      return {
        ...i,
        valorTotal,
        lote,
        tempoReposicaoDias: i.categoria === 'FERTILIZANTE' ? 15 : i.categoria === 'DEFENSIVO' ? 7 : 3,
        consumoMedioDiarioSafra: i.categoria === 'COMBUSTIVEL' ? 450 : i.categoria === 'FERTILIZANTE' ? 2500 : 25
      };
    });

    // Ordenar decrescente por valor total
    comValor.sort((a, b) => b.valorTotal - a.valorTotal);
    const somaTotal = comValor.reduce((acc, c) => acc + c.valorTotal, 0);

    let acumulado = 0;
    return comValor.map((item) => {
      acumulado += item.valorTotal;
      const pctAcumulada = (acumulado / (somaTotal || 1)) * 100;
      let classeABC: 'A' | 'B' | 'C' = 'C';
      if (pctAcumulada <= 75) classeABC = 'A';
      else if (pctAcumulada <= 92) classeABC = 'B';

      return {
        ...item,
        classeABC
      };
    });
  }, [insumos]);

  // Estatísticas Rápidas
  const totalFinanceiroEstoque = useMemo(() => {
    return insumos.reduce((acc, i) => acc + i.saldoAtual * i.custoMedioUnitario, 0);
  }, [insumos]);

  const itensAbaixoMinimo = useMemo(() => {
    return insumos.filter((i) => i.saldoAtual <= i.estoqueMinimo).length;
  }, [insumos]);

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

  // Leitura simulada de QR Code GS1-128
  const handleSimularScanQr = (insumo: InsumoCompletoEstoque) => {
    const rawQr = `(01)07891234567890(10)${insumo.lote.loteNumero}(17)${insumo.lote.dataValidade.replace(/-/g, '')}(21)${insumo.id.toUpperCase()}`;
    setCodigoLido(rawQr);
    setModalLeitorQrOpen(true);
  };

  const filteredInsumos = insumosEnriquecidos.filter((ins) => {
    const matchBusca =
      ins.nomeComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.principioAtivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.lote.loteNumero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.categoria.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategoria = filtroCategoria === 'TODAS' || ins.categoria === filtroCategoria;
    return matchBusca && matchCategoria;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner do Almoxarifado */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Gestão de Insumos & Custo Médio Ponderado Móvel
            </span>
            <span className="text-xs text-slate-600">Almoxarifado Central Sede • Galpão Climatizado DEFITO</span>
          </div>
          <h2 className="text-xl font-bold text-[#1D4B38] flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-700" /> Almoxarifado Central, Lotes & Curva ABC
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Controle físico-financeiro de defensivos, sementes, fertilizantes e diesel com rastreabilidade de lote, validade MAPA e apropriação por talhão.
          </p>
        </div>

        {/* Ações Rápidas de Lançamento */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setModalEntradaOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-800 border border-emerald-500/40 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nova Entrada NF-e
          </button>
          <button
            onClick={() => setModalSaidaOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 border border-amber-500/40 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Minus className="w-4 h-4" /> Baixa para Lavoura
          </button>
          <button
            onClick={handleSimularImportacaoNFe}
            disabled={xmlImported}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all ${
              xmlImported
                ? 'bg-slate-50 text-emerald-700 border border-emerald-800/40 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-[#1D4B38] shadow-emerald-950/40'
            }`}
          >
            {xmlImported ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-700" /> NF-e #184920 OK
              </>
            ) : (
              <>
                <FileCode className="w-4 h-4" /> Importar XML
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Cards de Resumo Executivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Patrimônio em Estoque</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-black text-emerald-700">
            R$ {totalFinanceiroEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-600 mt-1 block">Apropriado em DRE Safra</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Itens Abaixo do Mínimo</span>
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-2xl font-black text-amber-700">
            {itensAbaixoMinimo} <span className="text-xs font-normal text-slate-600">insumos</span>
          </p>
          <span className="text-[11px] text-amber-700/90 mt-1 block font-medium">Requer compra imediata</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Itens em Classe A (80/20)</span>
            <Layers className="w-4 h-4 text-sky-700" />
          </div>
          <p className="text-2xl font-black text-sky-700">
            {insumosEnriquecidos.filter((i) => i.classeABC === 'A').length} <span className="text-xs font-normal text-slate-600">itens críticos</span>
          </p>
          <span className="text-[11px] text-slate-600 mt-1 block">Fertilizantes e Defensivos nobres</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Conformidade DEFITO / MAPA</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-black text-[#1D4B38]">100%</p>
          <span className="text-[11px] text-emerald-700 mt-1 block font-medium">Lotes e validade auditados</span>
        </div>
      </div>

      {/* Alerta de Custo Médio Ponderado Recalculado */}
      {xmlImported && (
        <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-800/60 p-4 rounded-xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-700 shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1D4B38]">
                Custo Médio Ponderado Atualizado Automaticamente via NF-e:
              </p>
              <p className="text-xs text-slate-900">
                Insumo: <span className="font-semibold text-emerald-800">Fox Xpro (Fungicida)</span> • Entrada de 400 L • Saldo foi de 620 L para 1.020 L • Custo Médio Unitário recalculado de <span className="line-through text-slate-600">R$ 310,00</span> para <span className="font-bold text-[#1D4B38]">R$ 321,76/L</span>.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-900 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
            Auditado SEFAZ
          </span>
        </div>
      )}

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setAbaAtiva('ESTOQUE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            abaAtiva === 'ESTOQUE'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs' : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Package className="w-4 h-4" />
          1. Saldo Físico & Custos Médios
        </button>

        <button
          onClick={() => setAbaAtiva('CURVA_ABC')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            abaAtiva === 'CURVA_ABC'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs' : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Layers className="w-4 h-4" />
          2. Curva ABC Financeira (Pareto)
        </button>

        <button
          onClick={() => setAbaAtiva('LOTES_VALIDADE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            abaAtiva === 'LOTES_VALIDADE'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs' : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Calendar className="w-4 h-4" />
          3. Rastreabilidade de Lotes & Validade MAPA
        </button>

        <button
          onClick={() => setAbaAtiva('PONTO_PEDIDO')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            abaAtiva === 'PONTO_PEDIDO'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs' : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Truck className="w-4 h-4" />
          4. Dimensionamento de Ponto de Pedido (Lead Time)
        </button>
      </div>

      {/* ABA 1: TABELA DE ESTOQUE */}
      {abaAtiva === 'ESTOQUE' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar insumo, princípio ativo ou lote..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#1D4B38] placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Filtro de Categoria */}
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
              >
                <option value="TODAS">Todas Categorias</option>
                <option value="DEFENSIVO">Defensivos</option>
                <option value="FERTILIZANTE">Fertilizantes</option>
                <option value="ADJUVANTE">Adjuvantes</option>
                <option value="COMBUSTIVEL">Combustível</option>
              </select>
            </div>

            <span className="text-xs text-slate-600">
              Mostrando <b>{filteredInsumos.length}</b> de <b>{insumos.length}</b> itens
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-900">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Insumo Comercial</th>
                  <th className="px-4 py-3">Princípio Ativo</th>
                  <th className="px-4 py-3">Lote / Reg. MAPA</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3 text-right">Saldo Físico</th>
                  <th className="px-4 py-3 text-right text-emerald-700">Custo Médio Unitário</th>
                  <th className="px-4 py-3 text-right">Valor Total em Estoque</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">QR Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInsumos.map((ins) => {
                  const totalFinanceiro = ins.saldoAtual * ins.custoMedioUnitario;
                  const isBaixo = ins.saldoAtual <= ins.estoqueMinimo;

                  return (
                    <tr key={ins.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-[#1D4B38]">
                        {ins.nomeComercial}
                        <span className="block text-[10px] text-slate-500 font-mono">ID: {ins.id}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{ins.principioAtivo}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-sky-700 block font-semibold">{ins.lote.loteNumero}</span>
                        <span className="text-[10px] text-slate-500">{ins.lote.registroMapa}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-900">
                          {ins.categoria}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                        {ins.saldoAtual.toLocaleString('pt-BR')} {ins.unidade}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                        R$ {ins.custoMedioUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / {ins.unidade}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-900">
                        R$ {totalFinanceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isBaixo ? (
                          <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Abaixo do Mínimo
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-bold">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleSimularScanQr(ins)}
                          className="p-1.5 hover:bg-slate-50 text-slate-600 hover:text-sky-700 rounded-lg transition"
                          title="Escanear / Ver QR Code GS1-128"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 2: CURVA ABC FINANCEIRA */}
      {abaAtiva === 'CURVA_ABC' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-700" />
              Classificação por Curva ABC (Princípio de Pareto 80/20)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Os itens da Classe A concentram cerca de 75-80% do capital imobilizado e exigem controle diário rigoroso de aplicação e segurança contra desvios.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-900">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-center">Classe</th>
                  <th className="px-4 py-3">Insumo</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3 text-right">Saldo</th>
                  <th className="px-4 py-3 text-right">Custo Unitário</th>
                  <th className="px-4 py-3 text-right">Valor Total</th>
                  <th className="px-4 py-3 text-right">% do Capital</th>
                  <th className="px-4 py-3 text-center">Estratégia de Suprimentos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {insumosEnriquecidos.map((ins) => {
                  const pctCapital = (ins.valorTotal / (totalFinanceiroEstoque || 1)) * 100;

                  return (
                    <tr key={ins.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-black font-mono ${
                            ins.classeABC === 'A'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : ins.classeABC === 'B'
                              ? 'bg-amber-950 text-amber-700 border border-amber-800'
                              : 'bg-blue-950 text-blue-700 border border-blue-800'
                          }`}
                        >
                          Classe {ins.classeABC}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#1D4B38]">{ins.nomeComercial}</td>
                      <td className="px-4 py-3 text-slate-600">{ins.categoria}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                        {ins.saldoAtual.toLocaleString('pt-BR')} {ins.unidade}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        R$ {ins.custoMedioUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                        R$ {ins.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-sky-700">
                        {pctCapital.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-center text-[11px] text-slate-600">
                        {ins.classeABC === 'A'
                          ? 'Auditoria Semanal & Travamento Barter'
                          : ins.classeABC === 'B'
                          ? 'Auditoria Quinzenal'
                          : 'Estoque de Segurança Simples'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 3: LOTES E VALIDADE MAPA */}
      {abaAtiva === 'LOTES_VALIDADE' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-700" />
              Auditoria de Validade e Quarentena Sanitária (IN MAPA nº 42)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Controle preventivo contra aplicação de defensivos com validade expirada, evitando autuações do INDEA/IDAF e perda de eficácia biológica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {insumosEnriquecidos.map((ins) => (
              <div
                key={ins.id}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[#1D4B38] text-sm">{ins.nomeComercial}</h4>
                      <span className="text-[10px] text-slate-600 font-mono">Lote: {ins.lote.loteNumero}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ins.lote.statusValidade === 'CRITICO_30D'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : ins.lote.statusValidade === 'ATENCAO_90D'
                          ? 'bg-amber-950 text-amber-700 border border-amber-800'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {ins.lote.statusValidade === 'ATENCAO_90D' ? 'Vence em < 90 dias' : 'Validade Regular'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fabricação:</span>
                      <span className="font-mono text-slate-900">{ins.lote.dataFabricacao}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vencimento:</span>
                      <span className="font-mono font-bold text-[#1D4B38]">{ins.lote.dataValidade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dias Restantes:</span>
                      <span className="font-mono font-bold text-amber-700">{ins.lote.diasParaVencer} dias</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reg. MAPA:</span>
                      <span className="font-mono text-[11px] text-slate-600">{ins.lote.registroMapa}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSimularScanQr(ins)}
                  className="w-full py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-300 shadow-2xs cursor-pointer transition"
                >
                  <QrCode className="w-3.5 h-3.5" /> Gerar Etiqueta GS1-128
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 4: PONTO DE PEDIDO E LEAD TIME */}
      {abaAtiva === 'PONTO_PEDIDO' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
              <Truck className="w-5 h-5 text-sky-700" />
              Dimensionamento de Ponto de Pedido: PP = (Consumo × Lead Time) + Estoque de Segurança
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Garante que novas ordens de compra sejam disparadas antes que a janela de aplicação fique desabastecida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insumosEnriquecidos.map((ins) => {
              const consumoNoLeadTime = ins.consumoMedioDiarioSafra * ins.tempoReposicaoDias;
              const pontoPedidoRecomendado = consumoNoLeadTime + ins.estoqueMinimo;
              const precisaComprar = ins.saldoAtual <= pontoPedidoRecomendado;

              return (
                <div key={ins.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#1D4B38] text-sm">{ins.nomeComercial}</h4>
                      <span className="text-xs text-slate-600">{ins.categoria}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        precisaComprar
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {precisaComprar ? 'Gatilho de Compra Disparado' : 'Estoque Confortável'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-2">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block">Lead Time Fornecedor</span>
                      <span className="font-bold text-[#1D4B38] font-mono">{ins.tempoReposicaoDias} dias</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block">Ponto de Pedido</span>
                      <span className="font-bold text-amber-700 font-mono">
                        {pontoPedidoRecomendado.toLocaleString('pt-BR')} {ins.unidade}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block">Saldo Atual</span>
                      <span className="font-bold text-sky-700 font-mono">
                        {ins.saldoAtual.toLocaleString('pt-BR')} {ins.unidade}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Entrada de NF-e */}
      {modalEntradaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-700" />
                Lançamento de Entrada de Insumo (NF-e)
              </h3>
              <button onClick={() => setModalEntradaOpen(false)} className="text-slate-600 hover:text-[#1D4B38] p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">Insumo / Produto</label>
                <select
                  value={entradaInsumoId}
                  onChange={(e) => setEntradaInsumoId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#1D4B38] font-medium"
                >
                  {insumos.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.nomeComercial} (Saldo: {i.saldoAtual} {i.unidade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Número da Nota Fiscal (NF-e)</label>
                <input
                  type="text"
                  value={entradaNotaFiscal}
                  onChange={(e) => setEntradaNotaFiscal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#1D4B38] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Quantidade Entrando</label>
                  <input
                    type="number"
                    value={entradaQtd}
                    onChange={(e) => setEntradaQtd(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#1D4B38] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Custo Unitário NF (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={entradaPrecoUnit}
                    onChange={(e) => setEntradaPrecoUnit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-emerald-700 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalEntradaOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900 hover:text-[#1D4B38]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
                <Minus className="w-5 h-5 text-amber-700" />
                Baixa de Insumo para Aplicação no Campo
              </h3>
              <button onClick={() => setModalSaidaOpen(false)} className="text-slate-600 hover:text-[#1D4B38] p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">Insumo a Baixar</label>
                <select
                  value={saidaInsumoId}
                  onChange={(e) => setSaidaInsumoId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#1D4B38] font-medium"
                >
                  {insumos.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.nomeComercial} (Saldo Atual: {i.saldoAtual} {i.unidade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Talhão de Destino</label>
                <select
                  value={saidaTalhaoId}
                  onChange={(e) => setSaidaTalhaoId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#1D4B38] font-medium"
                >
                  {TALHOES_INICIAIS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome} ({t.areaHa} ha - {t.cultura})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Quantidade a Baixar</label>
                <input
                  type="number"
                  value={saidaQtd}
                  onChange={(e) => setSaidaQtd(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-amber-700 font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalSaidaOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900 hover:text-[#1D4B38]"
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

      {/* Modal Leitor / Etiqueta GS1-128 */}
      {modalLeitorQrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-[#1D4B38] flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-sky-700" /> Etiqueta de Galpão GS1-128
              </span>
              <button onClick={() => setModalLeitorQrOpen(false)} className="text-slate-600 hover:text-[#1D4B38]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-xl inline-block shadow">
              <div className="w-36 h-36 bg-slate-100 text-slate-800 flex flex-col items-center justify-center border border-slate-200 font-mono text-[10px] rounded p-2">
                <QrCode className="w-20 h-20 text-emerald-700 mb-1" />
                <span>GS1-128 AGRO</span>
              </div>
            </div>

            <div className="text-left bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1">
              <span className="text-slate-500 text-[10px] block">String de Dados GS1:</span>
              <p className="text-sky-700 break-all">{codigoLido}</p>
            </div>

            <button
              onClick={() => setModalLeitorQrOpen(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
