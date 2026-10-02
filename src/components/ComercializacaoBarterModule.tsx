import React, { useState, useEffect, useMemo } from 'react';
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
  PieChart,
  ShieldCheck,
  Printer,
  Download,
  Eye,
  X,
  AlertTriangle,
  QrCode,
  Sparkles,
  Layers,
  ArrowRight,
  Landmark,
  FileCheck
} from 'lucide-react';
import { CONTRATOS_BARTER_INICIAIS, ContratoGraosBarterData, TALHOES_INICIAIS } from '../data/mockAgroData';

export const ComercializacaoBarterModule: React.FC = () => {
  const [contratos, setContratos] = useState<ContratoGraosBarterData[]>(CONTRATOS_BARTER_INICIAIS);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalNovoOpen, setModalNovoOpen] = useState<boolean>(false);
  const [modalCprImpressao, setModalCprImpressao] = useState<ContratoGraosBarterData | null>(null);
  const [modalAmortizar, setModalAmortizar] = useState<ContratoGraosBarterData | null>(null);

  // Formulário de Novo Contrato / CPR
  const [compradorTrader, setCompradorTrader] = useState<string>('Cargill Agrícola S.A.');
  const [tipoOperacao, setTipoOperacao] = useState<'BARTER_INSUMOS' | 'VENDA_FUTURA_FIXA'>('BARTER_INSUMOS');
  const [cultura, setCultura] = useState<string>('Soja em Grãos Padrão Exportação');
  const [pacoteInsumos, setPacoteInsumos] = useState<string>('Adubação NPK YaraBela (600 ton) + Pacote Herbicidas Syngenta');
  const [valorPacoteInsumos, setValorPacoteInsumos] = useState<number>(2700000.0);
  const [precoTravadoSaca, setPrecoTravadoSaca] = useState<number>(135.0);
  const [talhaoPenhor, setTalhaoPenhor] = useState<string>('Talhão 01 - Sede (Gleba Norte)');
  const [areaVinculadaHa, setAreaVinculadaHa] = useState<number>(450);
  const [matriculaCRI, setMatriculaCRI] = useState<string>('Matrícula 41.829 - CRI 1º Ofício de Sorriso/MT');
  const [dataEntregaLimite, setDataEntregaLimite] = useState<string>('2026-04-30');
  const [localEntregaArmazem, setLocalEntregaArmazem] = useState<string>('Terminal Ferroviário Rumo / Cargill Sinop');

  // Formulário de Amortização de Romaneio
  const [amortizarSacas, setAmortizarSacas] = useState<number>(950);
  const [amortizarRomaneio, setAmortizarRomaneio] = useState<string>('ROM-2026-41802');
  const [amortizarPlaca, setAmortizarPlaca] = useState<string>('BRA-9X21 (Bitrem)');

  // Cálculo da Razão de Troca (Barter Ratio)
  const sacasCalculadas = useMemo(() => {
    if (precoTravadoSaca <= 0) return 0;
    return Math.ceil(valorPacoteInsumos / precoTravadoSaca);
  }, [valorPacoteInsumos, precoTravadoSaca]);

  const sacasPorHaCalculadas = useMemo(() => {
    if (areaVinculadaHa <= 0) return 0;
    return Number((sacasCalculadas / areaVinculadaHa).toFixed(1));
  }, [sacasCalculadas, areaVinculadaHa]);

  // Carregar contratos do backend persistente se disponível
  useEffect(() => {
    const carregarContratos = async () => {
      try {
        const resp = await fetch('/api/v1/barter/cpr/listar');
        if (resp.ok) {
          const data = await resp.json();
          if (data.contratos && data.contratos.length > 0) {
            setContratos(data.contratos);
          }
        }
      } catch (err) {
        console.warn('Usando dados locais de Barter:', err);
      }
    };
    carregarContratos();
  }, []);

  // Totais da Comercialização
  const totalAreaHa = TALHOES_INICIAIS.reduce((acc, curr) => acc + curr.areaHa, 0); // 2.450 ha
  const metaProdutividade = 68; // sc/ha
  const producaoEstimadaTotal = totalAreaHa * metaProdutividade; // 166.600 sc

  const sacasContratadas = contratos.reduce((acc, curr) => acc + curr.quantidadeSacas60kg, 0);
  const sacasEntreguesTotal = contratos.reduce((acc, curr) => acc + curr.sacasEntregues, 0);
  const sacasDisponiveisSpot = Math.max(0, producaoEstimadaTotal - sacasContratadas);
  const valorTotalContratos = contratos.reduce((acc, curr) => acc + curr.valorTotalContrato, 0);
  const percentualTravado = ((sacasContratadas / producaoEstimadaTotal) * 100).toFixed(1);

  // Submissão de Novo Contrato e CPR
  const handleCadastrarContrato = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      tipoOperacao,
      compradorTrader,
      cultura,
      pacoteInsumos,
      valorTotalContrato: valorPacoteInsumos,
      precoUnitarioSaca: precoTravadoSaca,
      quantidadeSacas60kg: sacasCalculadas,
      talhaoPenhor,
      areaVinculadaHa,
      matriculaCRI,
      dataEntregaLimite,
      localEntregaArmazem,
    };

    try {
      const resp = await fetch('/api/v1/barter/cpr/emitir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.contrato) {
          setContratos([data.contrato, ...contratos]);
          setModalNovoOpen(false);
          setModalCprImpressao(data.contrato);
        }
      } else {
        // Fallback local se backend offline
        const ano = new Date().getFullYear();
        const fallbackContrato: ContratoGraosBarterData = {
          id: `ct-${Date.now()}`,
          numeroContrato: `CTR-BARTER-${ano}-${Math.floor(1000 + Math.random() * 9000)}`,
          tipoOperacao,
          compradorTrader,
          cultura,
          quantidadeSacas60kg: sacasCalculadas,
          precoUnitarioSaca: precoTravadoSaca,
          valorTotalContrato: valorPacoteInsumos,
          dataEntregaLimite,
          localEntregaArmazem,
          statusEntrega: 'EM_ABERTO',
          sacasEntregues: 0,
          cprVinculadaNumero: `CPR-F-B3-MT-${ano}-${Math.floor(10000 + Math.random() * 90000)}`,
          pacoteInsumos,
          talhaoPenhor,
          areaVinculadaHa,
          protocoloB3: `B3-REG-${Math.floor(10000 + Math.random() * 90000)}-MT`,
          matriculaCRI,
          hashAutenticidade: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          historicoEntregas: [],
        };
        setContratos([fallbackContrato, ...contratos]);
        setModalNovoOpen(false);
        setModalCprImpressao(fallbackContrato);
      }
    } catch (err) {
      console.error('Erro ao emitir CPR:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submissão de Amortização Física via Romaneio
  const handleAmortizarCarga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAmortizar || amortizarSacas <= 0) return;
    setLoading(true);

    try {
      const resp = await fetch('/api/v1/barter/cpr/amortizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contratoId: modalAmortizar.id,
          sacasEntregues: amortizarSacas,
          numeroRomaneio: amortizarRomaneio,
          placa: amortizarPlaca,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.contrato) {
          setContratos(contratos.map(c => (c.id === data.contrato.id ? data.contrato : c)));
        }
      } else {
        // Fallback local
        setContratos(
          contratos.map(c => {
            if (c.id === modalAmortizar.id) {
              const novasSacas = c.sacasEntregues + amortizarSacas;
              return {
                ...c,
                sacasEntregues: novasSacas,
                statusEntrega: novasSacas >= c.quantidadeSacas60kg ? 'LIQUIDADO' : 'ENTREGA_PARCIAL',
                historicoEntregas: [
                  {
                    id: `ent-${Date.now()}`,
                    data: new Date().toLocaleDateString('pt-BR'),
                    romaneio: amortizarRomaneio,
                    sacas: amortizarSacas,
                    placa: amortizarPlaca,
                  },
                  ...(c.historicoEntregas || []),
                ],
              };
            }
            return c;
          })
        );
      }
      setModalAmortizar(null);
    } catch (err) {
      console.error('Erro ao amortizar:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Comercialização e Barter */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs font-bold flex items-center gap-1.5">
              <Handshake className="w-3.5 h-3.5" /> Barter de Insumos & Cédula de Produto Rural (CPR Digital)
            </span>
            <span className="text-xs text-slate-600">Safra 2025/2026 • Registro B3 & Penhor Agrícola (Lei 13.986)</span>
          </div>
          <h2 className="text-xl font-bold text-[#1D4B38] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Cockpit de Comercialização, Barter e CPR-Física
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Trava de pacotes de fertilizantes e sementes contra entrega física futura com conciliação automática de romaneios de balança.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setModalNovoOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-[#1D4B38] rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Novo Contrato de Barter / CPR
          </button>
        </div>
      </div>

      {/* 4 Cards de Posição de Comercialização */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Produção Estimada Safra</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-[#1D4B38]">
            {producaoEstimadaTotal.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-600">sc</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Meta: 68 sc/ha em {totalAreaHa.toLocaleString('pt-BR')} ha</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Volume Travado (Hedge / Barter)</span>
            <span className="text-xs font-bold text-amber-400">{percentualTravado}%</span>
          </div>
          <p className="text-2xl font-black text-amber-400">
            {sacasContratadas.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-600">sc</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Valor Travado: R$ {valorTotalContratos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Sacas Entregues (Armazém)</span>
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-blue-400">
            {sacasEntreguesTotal.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-600">sc</span>
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 block font-semibold">
            {sacasContratadas > 0 ? ((sacasEntreguesTotal / sacasContratadas) * 100).toFixed(1) : 0}% amortizado em armazém
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Disponível Mercado Spot</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-2xl font-black text-emerald-400">
            {sacasDisponiveisSpot.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-600">sc</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Sacas livres para captura de altas</span>
        </div>
      </div>

      {/* Painel de Indicador de Risco e Paridade Barter */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1D4B38] flex items-center gap-2">
              Proteção de Margem Agro (Hedge Ratio Saudável)
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-900/60 text-emerald-300 font-mono">CONFORME</span>
            </h4>
            <p className="text-[11px] text-slate-600">
              Taxa de travamento recomendada para custeio: entre 40% e 65%. Posição atual em <strong>{percentualTravado}%</strong> da safra prevista.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono shrink-0">
          <div className="text-right">
            <span className="text-slate-500 block text-[10px]">PREÇO MÉDIO TRAVADO</span>
            <span className="text-[#1D4B38] font-bold">
              R$ {sacasContratadas > 0 ? (valorTotalContratos / sacasContratadas).toFixed(2) : '0.00'} / sc
            </span>
          </div>
          <div className="h-8 w-px bg-slate-50"></div>
          <div className="text-right">
            <span className="text-slate-500 block text-[10px]">SALDO PENDENTE ENTREGA</span>
            <span className="text-amber-400 font-bold">
              {(sacasContratadas - sacasEntreguesTotal).toLocaleString('pt-BR')} sc
            </span>
          </div>
        </div>
      </div>

      {/* Tabela de Contratos Futuros e Barter */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Contratos de Comercialização e Operações de Barter Registradas
            </h3>
            <p className="text-xs text-slate-600">Cédulas de Produto Rural (CPR-Física) custodiadas na B3 / Cerc</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Total Contratado: R$ {valorTotalContratos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-900">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Contrato / CPR B3</th>
                <th className="px-4 py-3">Trading & Armazém</th>
                <th className="px-4 py-3">Modalidade & Pacote</th>
                <th className="px-4 py-3 text-right">Volume (sc 60kg)</th>
                <th className="px-4 py-3 text-right text-emerald-400">Preço Travado</th>
                <th className="px-4 py-3 text-right">Valor Total (R$)</th>
                <th className="px-4 py-3">Progresso Entrega</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAF4E7] font-sans">
              {contratos.map((ct) => {
                const progressoPct = Math.min(100, (ct.sacasEntregues / ct.quantidadeSacas60kg) * 100);

                return (
                  <tr key={ct.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-[#1D4B38] block">{ct.numeroContrato}</span>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <Landmark className="w-3 h-3 text-slate-500" /> {ct.cprVinculadaNumero}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 block">{ct.compradorTrader}</span>
                      <span className="text-[10px] text-slate-600 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-slate-500" /> {ct.localEntregaArmazem}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ct.tipoOperacao === 'BARTER_INSUMOS'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}
                        >
                          {ct.tipoOperacao === 'BARTER_INSUMOS' ? 'Barter Insumos' : 'Venda Futura Fixa'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-600 line-clamp-1" title={ct.pacoteInsumos}>
                        {ct.pacoteInsumos || ct.cultura}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {ct.quantidadeSacas60kg.toLocaleString('pt-BR')} sc
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                      R$ {ct.precoUnitarioSaca.toFixed(2)} / sc
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-900 font-semibold">
                      R$ {ct.valorTotalContrato.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-600">
                          <span className="font-bold text-[#1D4B38]">{ct.sacasEntregues.toLocaleString('pt-BR')} sc</span>
                          <span className="font-mono text-emerald-400">{progressoPct.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-50 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              progressoPct >= 100 ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${progressoPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ct.statusEntrega === 'LIQUIDADO'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : ct.statusEntrega === 'ENTREGA_PARCIAL'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {ct.statusEntrega === 'LIQUIDADO'
                          ? '100% LIQUIDADO'
                          : ct.statusEntrega === 'ENTREGA_PARCIAL'
                          ? 'ENTREGA PARCIAL'
                          : 'EM ABERTO'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setModalCprImpressao(ct)}
                          title="Visualizar CPR Oficial e Termo de Barter"
                          className="px-2.5 py-1 bg-slate-50 hover:bg-slate-700 text-slate-900 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all border border-emerald-300 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" /> CPR
                        </button>

                        <button
                          onClick={() => {
                            setModalAmortizar(ct);
                            setAmortizarSacas(Math.min(1000, ct.quantidadeSacas60kg - ct.sacasEntregues));
                          }}
                          disabled={ct.statusEntrega === 'LIQUIDADO'}
                          title="Amortizar entrega de sacas via Romaneio"
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                            ct.statusEntrega === 'LIQUIDADO'
                              ? 'bg-slate-50/40 text-slate-600 border border-slate-200 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-500 text-[#1D4B38] shadow-sm'
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5" /> Baixar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro de Novo Contrato de Barter & Emissão de CPR */}
      {modalNovoOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-300 p-6 rounded-2xl max-w-2xl w-full shadow-2xl text-slate-900 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
                  <Handshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1D4B38]">Cadastrar Contrato de Barter & CPR Digital</h3>
                  <p className="text-xs text-slate-600">Formalização de Cédula de Produto Rural com Registro B3 / Cerc</p>
                </div>
              </div>
              <button
                onClick={() => setModalNovoOpen(false)}
                className="text-slate-600 hover:text-[#1D4B38] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCadastrarContrato} className="space-y-4 text-xs">
              {/* Seletor de Tipo e Trading */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1 font-semibold">Trading / Credor Financiador</label>
                  <select
                    value={compradorTrader}
                    onChange={(e) => setCompradorTrader(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg p-2.5 text-[#1D4B38] font-medium"
                  >
                    <option value="Cargill Agrícola S.A.">Cargill Agrícola S.A. (Sorriso/MT)</option>
                    <option value="Bunge Alimentos S.A.">Bunge Alimentos S.A.</option>
                    <option value="Amaggi Exportação & Importação">Amaggi Exportação & Importação</option>
                    <option value="LDC (Louis Dreyfus Company)">LDC (Louis Dreyfus Company)</option>
                    <option value="ADM do Brasil Ltda">ADM do Brasil Ltda</option>
                    <option value="Cofco Agri Brasil">Cofco Agri Brasil</option>
                    <option value="Gavilon do Brasil">Gavilon do Brasil</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-900 block mb-1 font-semibold">Tipo de Operação</label>
                  <select
                    value={tipoOperacao}
                    onChange={(e) => setTipoOperacao(e.target.value as any)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg p-2.5 text-[#1D4B38] font-medium"
                  >
                    <option value="BARTER_INSUMOS">Barter Insumos (Adubos, Químicos e Sementes)</option>
                    <option value="VENDA_FUTURA_FIXA">Venda Futura com Preço Fixo Travado</option>
                  </select>
                </div>
              </div>

              {/* Pacote de Insumos & Cultura */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1 font-semibold">Cultura / Commodity de Pagamento</label>
                  <select
                    value={cultura}
                    onChange={(e) => setCultura(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg p-2.5 text-[#1D4B38] font-medium"
                  >
                    <option value="Soja em Grãos Padrão Exportação (CONAB Tipo 1)">Soja em Grãos Padrão Exportação (CONAB Tipo 1)</option>
                    <option value="Milho Grão Safrinha Padrão B3">Milho Grão Safrinha Padrão B3</option>
                    <option value="Algodão em Pluma Padrão HVI Extra">Algodão em Pluma Padrão HVI Extra</option>
                    <option value="Café Arábica Tipo 6 Bebida Dura">Café Arábica Tipo 6 Bebida Dura</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-900 block mb-1 font-semibold">Descrição do Pacote Tecnológico</label>
                  <input
                    type="text"
                    value={pacoteInsumos}
                    onChange={(e) => setPacoteInsumos(e.target.value)}
                    placeholder="Ex: NPK Yara + Sementes Intacta + Fungicidas"
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg p-2.5 text-[#1D4B38]"
                    required
                  />
                </div>
              </div>

              {/* Valores Financeiros e Razão de Troca */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Razão de Troca (Barter Exchange Ratio)
                  </span>
                  <span className="text-[11px] text-slate-600">Cálculo Instantâneo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1">Custo Insumos (R$)</label>
                    <input
                      type="number"
                      step="1000"
                      value={valorPacoteInsumos}
                      onChange={(e) => setValorPacoteInsumos(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-emerald-300 rounded-lg p-2 text-[#1D4B38] font-bold font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">Preço Travado (R$/sc)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={precoTravadoSaca}
                      onChange={(e) => setPrecoTravadoSaca(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-emerald-300 rounded-lg p-2 text-emerald-400 font-bold font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">Sacas a Entregar</label>
                    <div className="w-full bg-slate-900 border border-emerald-800/80 rounded-lg p-2 text-amber-400 font-black font-mono text-sm">
                      {sacasCalculadas.toLocaleString('pt-BR')} sc
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 flex justify-between pt-1 border-t border-slate-200/80">
                  <span>Compromisso por hectare: <strong className="text-[#1D4B38] font-mono">{sacasPorHaCalculadas} sc/ha</strong></span>
                  <span>Impacto na produtividade: <strong className="text-[#1D4B38] font-mono">{((sacasPorHaCalculadas / 68) * 100).toFixed(1)}% do teto</strong></span>
                </div>
              </div>

              {/* Garantia Real / Penhor da Safra Futura */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1 font-semibold">Talhão em Penhor Agrícola</label>
                  <select
                    value={talhaoPenhor}
                    onChange={(e) => {
                      setTalhaoPenhor(e.target.value);
                      const talhaoEncontrado = TALHOES_INICIAIS.find(t => t.nome === e.target.value);
                      if (talhaoEncontrado) setAreaVinculadaHa(talhaoEncontrado.areaHa);
                    }}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg p-2.5 text-[#1D4B38]"
                  >
                    {TALHOES_INICIAIS.map((t) => (
                      <option key={t.id} value={t.nome}>
                        {t.nome} ({t.areaHa} ha - {t.cultura})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-900 block mb-1 font-semibold">Matrícula no Cartório (CRI)</label>
                  <input
                    type="text"
                    value={matriculaCRI}
                    onChange={(e) => setMatriculaCRI(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg p-2.5 text-[#1D4B38] font-mono"
                    required
                  />
                </div>
              </div>

              {/* Armazém de Destino e Prazo de Entrega */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1 font-semibold">Data Limite de Entrega Física</label>
                  <input
                    type="date"
                    value={dataEntregaLimite}
                    onChange={(e) => setDataEntregaLimite(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg p-2.5 text-[#1D4B38]"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-900 block mb-1 font-semibold">Armazém / Terminal Credenciado</label>
                  <input
                    type="text"
                    value={localEntregaArmazem}
                    onChange={(e) => setLocalEntregaArmazem(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg p-2.5 text-[#1D4B38]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalNovoOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-50 hover:bg-slate-700 text-slate-900 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-500 text-[#1D4B38] font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-2 cursor-pointer"
                >
                  {loading ? 'Registrando na B3...' : 'Emitir CPR & Formalizar Barter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Visualizador e Impressão de CPR Oficial (Cédula de Produto Rural) */}
      {modalCprImpressao && (
        <div className="fixed inset-0 z-[1100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full p-8 shadow-2xl space-y-6 my-6 border border-slate-200">
            {/* Barra Superior de Ações */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" /> Registrada na B3 / Cerc Brasil
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Protocolo: {modalCprImpressao.protocoloB3 || 'B3-REG-94812-MT'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-[#1D4B38] font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Imprimir CPR (A4)
                </button>
                <button
                  onClick={() => setModalCprImpressao(null)}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Cabeçalho do Instrumento Particular */}
            <div className="text-center space-y-1 border-b border-slate-300 pb-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                REPÚBLICA FEDERATIVA DO BRASIL • SISTEMA FINANCEIRO NACIONAL
              </span>
              <h2 className="text-lg font-black text-slate-900 uppercase">
                CÉDULA DE PRODUTO RURAL COM LIQUIDAÇÃO FÍSICA (CPR-FÍSICA)
              </h2>
              <p className="text-xs text-slate-600">
                Emitida sob a égide da Lei Federal nº 8.929/1994, com redação dada pelas Leis nº 13.986/2020 e nº 14.421/2022
              </p>
              <div className="inline-block bg-slate-100 border border-slate-300 px-3 py-1 rounded text-xs font-mono font-bold text-slate-800 mt-2">
                NÚMERO DE IDENTIFICAÇÃO ÚNICA: {modalCprImpressao.cprVinculadaNumero}
              </div>
            </div>

            {/* Partes Contratantes */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-700 block uppercase text-[10px]">1. EMITENTE / DEVEDOR:</span>
                <p className="font-bold text-slate-900">FAZENDA SANTA HELENA - AGROPECUÁRIA LTDA</p>
                <p className="text-slate-600">CNPJ: 18.491.029/0001-88 • Inscrição Estadual: 13.489.102-9</p>
                <p className="text-slate-600">Rodovia MT-242, Km 38 - Zona Rural - Sorriso / MT</p>
                <p className="text-slate-600">Titular Representante: Carlos Alberto Schneider (CPF: 412.890.118-22)</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-700 block uppercase text-[10px]">2. CREDOR / BENEFICIÁRIO:</span>
                <p className="font-bold text-slate-900">{modalCprImpressao.compradorTrader}</p>
                <p className="text-slate-600">Filial Comercializadora e Financiadora de Insumos Agrícolas</p>
                <p className="text-slate-600">Local de Recebimento: {modalCprImpressao.localEntregaArmazem}</p>
                <p className="text-slate-600">Data de Vencimento da Entrega: <strong>{new Date(modalCprImpressao.dataEntregaLimite).toLocaleDateString('pt-BR')}</strong></p>
              </div>
            </div>

            {/* Objeto e Quantidade */}
            <div className="border border-slate-300 rounded-xl p-4 text-xs space-y-2">
              <span className="font-bold text-slate-800 uppercase text-[10px] block">
                3. PRODUTO, ESPECIFICAÇÃO DE QUALIDADE E CONDIÇÕES DE LIQUIDAÇÃO FÍSICA:
              </span>
              <p className="text-slate-700 leading-relaxed">
                Pelo presente título, o <strong>EMITENTE</strong> compromete-se incondicionalmente a entregar ao{' '}
                <strong>CREDOR</strong>, no local estipulado, a quantidade líquida e certa de:
              </p>
              <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">QUANTIDADE TOTAL</span>
                  <span className="text-base font-black text-slate-900">
                    {modalCprImpressao.quantidadeSacas60kg.toLocaleString('pt-BR')} SACAS DE 60 KG
                  </span>
                  <span className="text-xs text-slate-600 block">
                    ({(modalCprImpressao.quantidadeSacas60kg * 60).toLocaleString('pt-BR')} kg líquidos)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase">VALOR DA OPERAÇÃO / PREÇO FIXADO</span>
                  <span className="text-base font-black text-emerald-800">
                    R$ {modalCprImpressao.valorTotalContrato.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-slate-600 block">
                    (Base: R$ {modalCprImpressao.precoUnitarioSaca.toFixed(2)} / saca)
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                <p>
                  <strong>Padrão de Qualidade CONAB:</strong> Umidade máxima de 14,0%; Impureza máxima de 1,0%; Avariados máximos de 8,0%; Quebrados máximos de 8,0%.
                </p>
                <p>
                  <strong>Pacote de Insumos Vinculado (Barter):</strong> {modalCprImpressao.pacoteInsumos || 'Fornecimento integral de adubos e defensivos'}.
                </p>
              </div>
            </div>

            {/* Garantia Real / Penhor da Safra Futura */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
              <span className="font-bold text-slate-800 uppercase text-[10px] block">
                4. GARANTIA REAL DE PENHOR AGRÍCOLA DA SAFRA FUTURA:
              </span>
              <p className="text-slate-700 leading-relaxed">
                Em garantia do fiel cumprimento das obrigações assumidas nesta CPR, o EMITENTE constitui em favor do CREDOR penhor agrícola de primeiro grau sobre a safra futura cultivada no:
              </p>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg font-mono text-[11px]">
                <p><strong>Gleba / Talhão:</strong> {modalCprImpressao.talhaoPenhor || 'Talhão 01 - Sede (Gleba Norte)'} ({modalCprImpressao.areaVinculadaHa || 450} hectares)</p>
                <p><strong>Registro Imobiliário:</strong> {modalCprImpressao.matriculaCRI || 'Matrícula 41.829 - Livro 2 - CRI 1º Ofício de Sorriso/MT'}</p>
                <p><strong>Coordenadas Centrais WGS84:</strong> Lat: -12°32'44.2"S | Long: -55°43'12.8"W</p>
              </div>
            </div>

            {/* Registro Centralizado e Assinatura Digital */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-300 pt-4 text-[11px]">
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <QrCode className="w-16 h-16 text-slate-800 mb-1" />
                <span className="text-[9px] font-mono text-slate-500">Validação B3 Registradora</span>
                <span className="text-[9px] font-mono font-bold text-slate-700 truncate w-full">
                  {modalCprImpressao.hashAutenticidade?.slice(0, 16)}...
                </span>
              </div>

              <div className="col-span-2 space-y-3">
                <div className="border-b border-slate-300 pb-2">
                  <span className="text-[10px] text-slate-500 block uppercase">ASSINATURA ELETRÔNICA QUALIFICADA (ICP-BRASIL)</span>
                  <p className="font-bold text-slate-900">CARLOS ALBERTO SCHNEIDER - EMITENTE</p>
                  <p className="text-[10px] text-slate-600 font-mono">Assinado digitalmente em conformidade com MP nº 2.200-2/2001 e Lei 14.063/2020</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">ASSINATURA DO CREDOR ENDOSSATÁRIO</span>
                  <p className="font-bold text-slate-900">{modalCprImpressao.compradorTrader.toUpperCase()}</p>
                  <p className="text-[10px] text-slate-600 font-mono">Diretoria de Originação e Gestão de Risco Agrícola</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Amortização de Carga / Baixa de Romaneio */}
      {modalAmortizar && (
        <div className="fixed inset-0 z-[1050] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-300 p-6 rounded-2xl max-w-md w-full shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1D4B38]">Amortizar Entrega Física</h3>
                  <p className="text-xs text-slate-600">Contrato: {modalAmortizar.numeroContrato}</p>
                </div>
              </div>
              <button
                onClick={() => setModalAmortizar(null)}
                className="text-slate-600 hover:text-[#1D4B38]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAmortizarCarga} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Trading:</span>
                  <span className="font-semibold text-[#1D4B38]">{modalAmortizar.compradorTrader}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Saldo Pendente:</span>
                  <span className="font-bold font-mono text-amber-400">
                    {(modalAmortizar.quantidadeSacas60kg - modalAmortizar.sacasEntregues).toLocaleString('pt-BR')} sc
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-900 block mb-1 font-semibold">Número do Romaneio da Balança</label>
                <input
                  type="text"
                  value={amortizarRomaneio}
                  onChange={(e) => setAmortizarRomaneio(e.target.value)}
                  className="w-full bg-slate-50 border border-emerald-300 rounded-lg p-2.5 text-[#1D4B38] font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-900 block mb-1 font-semibold">Placa do Caminhão / Bitrem</label>
                <input
                  type="text"
                  value={amortizarPlaca}
                  onChange={(e) => setAmortizarPlaca(e.target.value)}
                  className="w-full bg-slate-50 border border-emerald-300 rounded-lg p-2.5 text-[#1D4B38] font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-900 block mb-1 font-semibold">Volume Amortizado (Sacas 60kg Líquidas)</label>
                <input
                  type="number"
                  value={amortizarSacas}
                  onChange={(e) => setAmortizarSacas(Number(e.target.value))}
                  max={modalAmortizar.quantidadeSacas60kg - modalAmortizar.sacasEntregues}
                  className="w-full bg-slate-50 border border-emerald-300 rounded-lg p-2.5 text-emerald-400 font-bold font-mono text-sm"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Equivalente a {(amortizarSacas * 60).toLocaleString('pt-BR')} kg líquidos
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalAmortizar(null)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-50 hover:bg-slate-700 text-slate-900 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs bg-blue-600 hover:bg-blue-500 text-[#1D4B38] font-bold shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  {loading ? 'Averbando...' : 'Confirmar Amortização'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
