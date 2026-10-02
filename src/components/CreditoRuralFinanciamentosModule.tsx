import React, { useState } from 'react';
import {
  Landmark,
  Banknote,
  Scale,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  FileText,
  ShieldCheck,
  Plus,
  Percent,
  Sparkles,
  Download,
  Building,
  FileSpreadsheet,
  Check
} from 'lucide-react';

export interface ContratoCreditoRural {
  id: string;
  numeroOperacao: string;
  linhaCredito: string;
  instituicaoFinanceira: string;
  valorPrincipal: number;
  saldoDevedorAtual: number;
  taxaJurosAnualPct: number;
  tipoTaxa: 'PRE_FIXADA' | 'POS_CDI';
  dataContratacao: string;
  dataVencimentoFinal: string;
  tipoAmortizacao: 'BALAO_ANUAL_SAFRA' | 'SEMESTRAL' | 'MENSAL';
  garantiasVinculadas: string[];
  statusContrato: 'ATIVO_EM_DIA' | 'CARENCIA' | 'LIQUIDADO';
}

interface ItemPagamentoCnab {
  id: string;
  favorecido: string;
  cnpjCpf: string;
  valor: number;
  vencimento: string;
  finalidade: string;
}

interface CnabResponse {
  sucesso: boolean;
  nomeArquivo: string;
  totalLinhas: number;
  totalPagamentos: number;
  valorTotalReais: number;
  conteudoCnab240: string;
  banco: string;
  padrao: string;
}

const CONTRATOS_INICIAIS: ContratoCreditoRural[] = [
  {
    id: 'cred-01',
    numeroOperacao: '489.102.941-BB',
    linhaCredito: 'Plano Safra Custeio Agrícola Soja',
    instituicaoFinanceira: 'Banco do Brasil S.A.',
    valorPrincipal: 2500000.0,
    saldoDevedorAtual: 2762500.0,
    taxaJurosAnualPct: 10.5,
    tipoTaxa: 'PRE_FIXADA',
    dataContratacao: '2026-05-15',
    dataVencimentoFinal: '2027-05-30',
    tipoAmortizacao: 'BALAO_ANUAL_SAFRA',
    garantiasVinculadas: [
      'Penhor Agrícola de 35.000 sacas de soja safra 25/26',
      'Aval dos Condôminos Titulares'
    ],
    statusContrato: 'ATIVO_EM_DIA',
  },
  {
    id: 'cred-02',
    numeroOperacao: '784.210.091-SICREDI',
    linhaCredito: 'Moderfrota (2x Tratores John Deere 8370R)',
    instituicaoFinanceira: 'Sicredi União MT',
    valorPrincipal: 3800000.0,
    saldoDevedorAtual: 3120000.0,
    taxaJurosAnualPct: 9.5,
    tipoTaxa: 'PRE_FIXADA',
    dataContratacao: '2024-04-10',
    dataVencimentoFinal: '2031-04-10',
    tipoAmortizacao: 'SEMESTRAL',
    garantiasVinculadas: [
      'Alienação Fiduciária dos 2 Tratores JD 8370R (Chassis #41029 e #41030)',
      'Hipoteca de 2º Grau de 300 ha'
    ],
    statusContrato: 'ATIVO_EM_DIA',
  },
  {
    id: 'cred-03',
    numeroOperacao: '912.840.110-BNDES',
    linhaCredito: 'PCA Armazenagem (Silo Kepler Weber 60k sc)',
    instituicaoFinanceira: 'BNDES / Banco do Brasil',
    valorPrincipal: 5000000.0,
    saldoDevedorAtual: 4650000.0,
    taxaJurosAnualPct: 8.5,
    tipoTaxa: 'PRE_FIXADA',
    dataContratacao: '2023-08-20',
    dataVencimentoFinal: '2033-08-20',
    tipoAmortizacao: 'SEMESTRAL',
    garantiasVinculadas: [
      'Hipoteca de 1º Grau Matrícula nº 14.890 (Gleba Santa Helena - 500 ha)',
      'Alienação da Planta de Armazenagem'
    ],
    statusContrato: 'ATIVO_EM_DIA',
  },
  {
    id: 'cred-04',
    numeroOperacao: 'CPR-FIN-2026-SAN',
    linhaCredito: 'CPR Financeira Capital de Giro Fertilizantes',
    instituicaoFinanceira: 'Banco Santander Agro',
    valorPrincipal: 1800000.0,
    saldoDevedorAtual: 1940000.0,
    taxaJurosAnualPct: 12.8,
    tipoTaxa: 'POS_CDI',
    dataContratacao: '2026-06-01',
    dataVencimentoFinal: '2027-04-30',
    tipoAmortizacao: 'BALAO_ANUAL_SAFRA',
    garantiasVinculadas: [
      'Cédula de Produto Rural Financeira registrada na B3',
      'Trava de Domicílio Bancário de Grãos'
    ],
    statusContrato: 'ATIVO_EM_DIA',
  },
];

export const CreditoRuralFinanciamentosModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'carteira' | 'cnab240'>('carteira');
  const [contratos] = useState<ContratoCreditoRural[]>(CONTRATOS_INICIAIS);

  // Simulador de Nova Linha de Crédito
  const [simPrincipal, setSimPrincipal] = useState<number>(1500000.0);
  const [simTaxaAnual, setSimTaxaAnual] = useState<number>(10.5);
  const [simPrazoMeses, setSimPrazoMeses] = useState<number>(12);

  // Estado do Emissor CNAB 240
  const [bancoCnab, setBancoCnab] = useState<string>('001'); // 001=BB, 748=Sicredi, 756=Sicoob
  const [cnpjEmitente, setCnpjEmitente] = useState<string>('18.491.029/0001-88');
  const [razaoSocial, setRazaoSocial] = useState<string>('AGROPECUARIA SANTA HELENA LTDA');
  const [agencia, setAgencia] = useState<string>('1234');
  const [conta, setConta] = useState<string>('56789');
  const [gerandoCnab, setGerandoCnab] = useState<boolean>(false);
  const [resultadoCnab, setResultadoCnab] = useState<CnabResponse | null>(null);

  const [itensPagamento] = useState<ItemPagamentoCnab[]>([
    {
      id: 'pg-1',
      favorecido: 'FERTILIZANTES DO CERRADO LTDA',
      cnpjCpf: '12.345.678/0001-90',
      valor: 185000.0,
      vencimento: '20261015',
      finalidade: 'COMPRA ADUBO NPK 04-14-08'
    },
    {
      id: 'pg-2',
      favorecido: 'SEMENTES SOJA BRASIL S/A',
      cnpjCpf: '98.765.432/0001-11',
      valor: 120500.5,
      vencimento: '20261020',
      finalidade: 'COMPRA SEMENTES CERTIFICADAS TSI'
    },
    {
      id: 'pg-3',
      favorecido: 'PETROBRAS DISTRIBUIDORA DIESEL',
      cnpjCpf: '33.000.167/0001-01',
      valor: 74200.0,
      vencimento: '20261025',
      finalidade: 'COMBUSTIVEL DIESEL S10 COMBOIO'
    }
  ]);

  // Cálculo da Amortização Balão Anual
  const simTaxaPeriodo = (simTaxaAnual / 100) * (simPrazoMeses / 12);
  const simJuros = simPrincipal * simTaxaPeriodo;
  const simMontanteFinalBalao = simPrincipal + simJuros;

  // Métricas Consolidadas da Fazenda
  const totalTomado = contratos.reduce((acc, curr) => acc + curr.valorPrincipal, 0);
  const totalSaldoDevedor = contratos.reduce((acc, curr) => acc + curr.saldoDevedorAtual, 0);
  const taxaMediaPonderada =
    contratos.reduce((acc, curr) => acc + curr.taxaJurosAnualPct * curr.valorPrincipal, 0) / totalTomado;

  const handleGerarRemessaCnab = async () => {
    setGerandoCnab(true);
    try {
      const resp = await fetch('/api/v1/erp/bancario/cnab240', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigoBanco: bancoCnab,
          cnpjEmpresa: cnpjEmitente,
          nomeEmpresa: razaoSocial,
          numeroAgencia: agencia,
          digitoAgencia: '0',
          numeroConta: conta,
          digitoConta: '1',
          pagamentos: itensPagamento.map(item => ({
            tipoInscricao: '2',
            cpfCnpj: item.cnpjCpf,
            nomeFavorecido: item.favorecido,
            valorReais: item.valor,
            dataVencimento: item.vencimento,
            finalidade: item.finalidade
          }))
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        setResultadoCnab(data);
      } else {
        alert('Falha ao gerar arquivo CNAB 240.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao gerar remessa bancária.');
    } finally {
      setGerandoCnab(false);
    }
  };

  const handleDownloadCnab = () => {
    if (!resultadoCnab) return;
    const blob = new Blob([resultadoCnab.conteudoCnab240], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = resultadoCnab.nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Módulo - Paleta Verde Floresta */}
      <div className="bg-gradient-to-r from-[#1D4B38] via-[#285943] to-[#3A6B4F] text-white border border-[#5F8F52]/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 border border-white/20 rounded-xl text-[#EAF4E7]">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-white">Crédito Rural, Financiamentos & CNAB 240</h1>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-50 text-[#285943] rounded-full">
                  Plano Safra Equalizado
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-white/15 text-white border border-white/20 rounded-full">
                  FEBRABAN v10.7
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#EAF4E7] mt-0.5">
                Gestão de Custeio Agrícola, Moderfrota, PCA Armazenagem, CPRs Financeiras e Remessas Bancárias CNAB 240.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('carteira')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'carteira'
              ? 'bg-[#285943] text-white shadow-md'
              : 'bg-slate-50 text-slate-900 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          1. Carteira de Financiamentos & Custeio
        </button>

        <button
          onClick={() => setActiveTab('cnab240')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'cnab240'
              ? 'bg-[#285943] text-white shadow-md'
              : 'bg-slate-50 text-slate-900 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          2. Remessa Bancária CNAB 240 (FEBRABAN)
        </button>
      </div>

      {/* Aba 1: Carteira e Métricas */}
      {activeTab === 'carteira' && (
        <div className="space-y-6">
          {/* Cards de Métricas de Crédito */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Volume Total Contratado</span>
                <Banknote className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-2xl font-black text-[#285943] font-mono">
                R$ {(totalTomado / 1_000_000).toFixed(2)}M
              </div>
              <p className="text-xs text-slate-600 mt-1">4 operações ativas de médio e longo prazo</p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Saldo Devedor Atual</span>
                <DollarSign className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-2xl font-black text-amber-700 font-mono">
                R$ {(totalSaldoDevedor / 1_000_000).toFixed(2)}M
              </div>
              <p className="text-xs text-slate-600 mt-1">Com amortizações em dia</p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Taxa Média Ponderada</span>
                <Percent className="w-4 h-4 text-[#285943]" />
              </div>
              <div className="text-2xl font-black text-[#285943] font-mono">
                {taxaMediaPonderada.toFixed(2)}% a.a.
              </div>
              <p className="text-xs text-slate-600 mt-1">Abaixo do CDI de mercado (~11.5% a.a.)</p>
            </div>

            <div className="bg-emerald-50 border border-[#5F8F52]/40 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between text-[#285943] mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Liquidez Garantida Safra</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-2xl font-black text-[#285943] font-mono">100% Coberta</div>
              <p className="text-xs text-emerald-700 mt-1">Margem líquida da lavoura superior à dívida</p>
            </div>
          </div>

          {/* Grid: Tabela de Operações de Crédito + Simulador de Custeio */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#285943] flex items-center gap-2">
                    <Scale className="w-5 h-5 text-emerald-700" />
                    Operações de Crédito Rural & Garantias Reais
                  </h2>
                  <p className="text-xs text-slate-600">Contratos vinculados a matrículas, máquinas e penhor de safra</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-3">Linha & Banco</th>
                      <th className="px-3.5 py-3">Principal & Saldo</th>
                      <th className="px-3.5 py-3">Taxa & Amortização</th>
                      <th className="px-3.5 py-3">Vencimento</th>
                      <th className="px-3.5 py-3">Garantias Vinculadas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAF4E7]">
                    {contratos.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3.5 py-3.5">
                          <div className="font-bold text-[#285943]">{c.linhaCredito}</div>
                          <div className="text-[11px] text-emerald-700 font-medium">{c.instituicaoFinanceira}</div>
                          <div className="text-[10px] text-slate-600 font-mono mt-0.5">Op: {c.numeroOperacao}</div>
                        </td>

                        <td className="px-3.5 py-3.5">
                          <div className="font-mono font-bold text-[#285943]">
                            R$ {c.valorPrincipal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[11px] text-amber-700 font-mono mt-0.5">
                            Saldo: R$ {c.saldoDevedorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </td>

                        <td className="px-3.5 py-3.5">
                          <div className="font-bold text-[#285943] font-mono">{c.taxaJurosAnualPct}% a.a.</div>
                          <span className="text-[10px] text-slate-600 block uppercase">
                            {c.tipoAmortizacao.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="px-3.5 py-3.5 font-mono text-slate-900">
                          <div>{c.dataVencimentoFinal}</div>
                          <span className="text-[10px] text-emerald-700 font-semibold">Em Dia</span>
                        </td>

                        <td className="px-3.5 py-3.5 space-y-1">
                          {c.garantiasVinculadas.map((gar, idx) => (
                            <div key={idx} className="text-[11px] text-slate-900 flex items-start gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#5F8F52] mt-1 shrink-0"></span>
                              <span>{gar}</span>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Simulador Balão */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-base font-bold text-[#285943]">Simulador de Custeio Rural</h2>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Calcule o montante final e juros devidos para liquidação única pós-colheita (Pagamento Balão):
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-900 font-semibold block mb-1">Valor Principal Desejado (R$):</label>
                    <input
                      type="number"
                      step="50000"
                      value={simPrincipal}
                      onChange={(e) => setSimPrincipal(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[#285943] font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-900 font-semibold block mb-1">Taxa Equalizada Plano Safra (% a.a.):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={simTaxaAnual}
                      onChange={(e) => setSimTaxaAnual(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[#285943] font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-900 font-semibold block mb-1">Prazo de Amortização (Meses):</label>
                    <input
                      type="number"
                      value={simPrazoMeses}
                      onChange={(e) => setSimPrazoMeses(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[#285943] font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-900">
                  <span>Juros Devidos no Período:</span>
                  <span className="font-mono font-bold text-amber-700">
                    + R$ {simJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <span className="font-bold text-[#285943]">Pagamento Balão no Vencimento:</span>
                  <span className="font-mono font-black text-sm text-[#285943]">
                    R$ {simMontanteFinalBalao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 block">
                  Equivalente a {(simMontanteFinalBalao / 132).toFixed(0)} sacas de soja @ R$ 132/sc
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aba 2: Remessa Bancária CNAB 240 FEBRABAN */}
      {activeTab === 'cnab240' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#285943] flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                  Gerador de Remessa CNAB 240 (Padrão FEBRABAN v10.7)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Geração em lote de pagamentos a fornecedores de defensivos, adubos e diesel com linhas estritas de 240 posições.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-[#285943] text-xs font-bold rounded-full border border-[#5F8F52]/40">
                  API: /api/v1/erp/bancario/cnab240
                </span>
              </div>
            </div>

            {/* Parâmetros do Emitente */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Banco Conveniado:</label>
                <select
                  value={bancoCnab}
                  onChange={(e) => setBancoCnab(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#285943] focus:outline-none focus:border-[#285943]"
                >
                  <option value="001">001 - Banco do Brasil</option>
                  <option value="748">748 - Sicredi Agro</option>
                  <option value="756">756 - Sicoob</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">CNPJ da Propriedade:</label>
                <input
                  type="text"
                  value={cnpjEmitente}
                  onChange={(e) => setCnpjEmitente(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-[#285943] focus:outline-none focus:border-[#285943]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Agência:</label>
                <input
                  type="text"
                  value={agencia}
                  onChange={(e) => setAgencia(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-[#285943] focus:outline-none focus:border-[#285943]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Conta Corrente:</label>
                <input
                  type="text"
                  value={conta}
                  onChange={(e) => setConta(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-[#285943] focus:outline-none focus:border-[#285943]"
                />
              </div>
            </div>

            {/* Tabela de Itens para Pagamento */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#285943] uppercase tracking-wider">
                  Lote de Pagamentos de Insumos & Fornecedores (Segmento A / TED / PIX):
                </span>
                <span className="text-xs font-mono text-slate-600">
                  Total: {itensPagamento.length} favorecidos • R$ {itensPagamento.reduce((acc, i) => acc + i.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Favorecido</th>
                      <th className="py-2.5 px-3">CNPJ / CPF</th>
                      <th className="py-2.5 px-3">Finalidade</th>
                      <th className="py-2.5 px-3">Vencimento</th>
                      <th className="py-2.5 px-3 text-right">Valor Líquido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAF4E7]">
                    {itensPagamento.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-[#285943]">{item.favorecido}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{item.cnpjCpf}</td>
                        <td className="py-2.5 px-3 text-slate-900">{item.finalidade}</td>
                        <td className="py-2.5 px-3 font-mono text-[#285943]">{item.vencimento}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-right text-[#285943]">
                          R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleGerarRemessaCnab}
                disabled={gerandoCnab}
                className="px-5 py-2.5 bg-[#285943] hover:bg-[#1D4B38] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4" />
                {gerandoCnab ? 'Compilando CNAB 240...' : 'Gerar Remessa CNAB 240'}
              </button>
            </div>

            {/* Resultado da Geração */}
            {resultadoCnab && (
              <div className="bg-slate-50 border border-emerald-300/50 rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="font-bold text-[#285943] text-sm block flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-700" />
                      Arquivo de Remessa Homologado: {resultadoCnab.nomeArquivo}
                    </span>
                    <span className="text-xs text-slate-600">
                      {resultadoCnab.banco} • {resultadoCnab.padrao} • {resultadoCnab.totalLinhas} Linhas de 240 caracteres
                    </span>
                  </div>

                  <button
                    onClick={handleDownloadCnab}
                    className="px-4 py-2 bg-[#5F8F52] hover:bg-[#285943] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Baixar Arquivo .REM
                  </button>
                </div>

                <div>
                  <span className="text-[10px] text-slate-600 uppercase font-bold block mb-1">
                    Visualização Hexadecimal / ASCII (Primeiras Linhas Formatadas):
                  </span>
                  <pre className="p-3 bg-white border border-slate-200 rounded-lg font-mono text-[10px] text-[#285943] overflow-x-auto whitespace-pre leading-relaxed">
                    {resultadoCnab.conteudoCnab240}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditoRuralFinanciamentosModule;
