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
  Sparkles
} from 'lucide-react';

export interface ContratoCreditoRural {
  id: string;
  numeroOperacao: string;
  linhaCredito: string; // Ex: 'Plano Safra Custeio Pronamp', 'Moderfrota Maquinário', 'PCA Armazenagem'
  instituicaoFinanceira: string; // Ex: 'Banco do Brasil', 'Sicredi', 'BNDES'
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
  const [contratos] = useState<ContratoCreditoRural[]>(CONTRATOS_INICIAIS);

  // Simulador de Nova Linha de Crédito
  const [simPrincipal, setSimPrincipal] = useState<number>(1500000.0);
  const [simTaxaAnual, setSimTaxaAnual] = useState<number>(10.5);
  const [simPrazoMeses, setSimPrazoMeses] = useState<number>(12);

  // Cálculo da Amortização Balão Anual
  const simTaxaPeriodo = (simTaxaAnual / 100) * (simPrazoMeses / 12);
  const simJuros = simPrincipal * simTaxaPeriodo;
  const simMontanteFinalBalao = simPrincipal + simJuros;

  // Métricas Consolidadas da Fazenda
  const totalTomado = contratos.reduce((acc, curr) => acc + curr.valorPrincipal, 0);
  const totalSaldoDevedor = contratos.reduce((acc, curr) => acc + curr.saldoDevedorAtual, 0);
  const taxaMediaPonderada =
    contratos.reduce((acc, curr) => acc + curr.taxaJurosAnualPct * curr.valorPrincipal, 0) / totalTomado;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">Crédito Rural & Financiamentos (Plano Safra)</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Taxas Equalizadas
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  Garantias Reais B3
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                Gestão de Custeio Agrícola, Moderfrota, PCA Armazenagem, CPRs Financeiras e amortização de Pagamentos Balão.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Métricas de Crédito */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Volume Total Contratado</span>
            <Banknote className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            R$ {(totalTomado / 1_000_000).toFixed(2)}M
          </div>
          <p className="text-xs text-slate-500 mt-1">4 operações ativas de longo/médio prazo</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Saldo Devedor Atual</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">
            R$ {(totalSaldoDevedor / 1_000_000).toFixed(2)}M
          </div>
          <p className="text-xs text-slate-500 mt-1">Com amortizações semestrais em dia</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Taxa Média Ponderada</span>
            <Percent className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-300 font-mono">
            {taxaMediaPonderada.toFixed(2)}% a.a.
          </div>
          <p className="text-xs text-slate-500 mt-1">Abaixo do CDI de mercado (~11.5% a.a.)</p>
        </div>

        <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl">
          <div className="flex items-center justify-between text-emerald-300 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Liquidez Garantida Safra</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-200 font-mono">100% Coberta</div>
          <p className="text-xs text-emerald-400/80 mt-1">Margem líquida da lavoura superior à dívida</p>
        </div>
      </div>

      {/* Grid: Tabela de Operações de Crédito + Simulador de Custeio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Contratos Ativos (2 colunas) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                Operações de Crédito Rural & Garantias Reais
              </h2>
              <p className="text-xs text-slate-400">Contratos vinculados a matrículas, máquinas e penhor de safra</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-3.5 py-3">Linha & Banco</th>
                  <th className="px-3.5 py-3">Principal & Saldo</th>
                  <th className="px-3.5 py-3">Taxa & Amortização</th>
                  <th className="px-3.5 py-3">Vencimento</th>
                  <th className="px-3.5 py-3">Garantias Vinculadas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {contratos.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-3.5 py-3.5">
                      <div className="font-bold text-slate-200">{c.linhaCredito}</div>
                      <div className="text-[11px] text-emerald-400 font-medium">{c.instituicaoFinanceira}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">Op: {c.numeroOperacao}</div>
                    </td>

                    <td className="px-3.5 py-3.5">
                      <div className="font-mono font-bold text-slate-100">
                        R$ {c.valorPrincipal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-amber-400 font-mono mt-0.5">
                        Saldo: R$ {c.saldoDevedorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>

                    <td className="px-3.5 py-3.5">
                      <div className="font-bold text-indigo-300 font-mono">{c.taxaJurosAnualPct}% a.a.</div>
                      <span className="text-[10px] text-slate-400 block uppercase">
                        {c.tipoAmortizacao.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="px-3.5 py-3.5 font-mono text-slate-300">
                      <div>{c.dataVencimentoFinal}</div>
                      <span className="text-[10px] text-emerald-400 font-semibold">Em Dia</span>
                    </td>

                    <td className="px-3.5 py-3.5 space-y-1">
                      {c.garantiasVinculadas.map((gar, idx) => (
                        <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shrink-0"></span>
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

        {/* Simulador de Custeio / Pagamento Balão (1 coluna) */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-slate-100">Simulador de Custeio Rural</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Calcule o montante final e juros devidos para liquidação única pós-colheita (Pagamento Balão):
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Valor Principal Desejado (R$):</label>
                <input
                  type="number"
                  step="50000"
                  value={simPrincipal}
                  onChange={(e) => setSimPrincipal(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Taxa Equalizada Plano Safra (% a.a.):</label>
                <input
                  type="number"
                  step="0.5"
                  value={simTaxaAnual}
                  onChange={(e) => setSimTaxaAnual(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Prazo de Amortização (Meses):</label>
                <input
                  type="number"
                  value={simPrazoMeses}
                  onChange={(e) => setSimPrazoMeses(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span>Juros Devidos no Período:</span>
              <span className="font-mono font-bold text-amber-300">
                + R$ {simJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-t border-emerald-900/50 pt-2 flex justify-between items-center">
              <span className="font-bold text-slate-100">Pagamento Balão no Vencimento:</span>
              <span className="font-mono font-extrabold text-sm text-emerald-300">
                R$ {simMontanteFinalBalao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Equivalente a {(simMontanteFinalBalao / 132).toFixed(0)} sacas de soja @ R$ 132/sc
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditoRuralFinanciamentosModule;
