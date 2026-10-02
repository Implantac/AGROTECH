import React, { useState } from 'react';
import {
  FileSignature,
  ScrollText,
  BadgeCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Plus,
  Scale,
  Sparkles,
  Layers
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

export interface ContratoArrendamento {
  id: string;
  numeroContrato: string;
  arrendadorNome: string;
  cpfCnpjArrendador: string;
  talhaoVinculadoId: string;
  nomeGleba: string;
  areaHa: number;
  sacasPorHaPactuadas: number;
  culturaReferencia: string;
  dataInicioVigencia: string;
  dataTerminoVigencia: string;
  mesVencimentoPagamento: string; // Ex: 'Abril (Pós-Colheita)'
  statusContrato: 'VIGENTE' | 'RENOVACAO_PENDENTE' | 'ENCERRADO';
}

const CONTRATOS_ARRENDAMENTO_INICIAIS: ContratoArrendamento[] = [
  {
    id: 'arr-01',
    numeroContrato: 'ARR-2023-018-MT',
    arrendadorNome: 'Espólio de Olavo Fontana',
    cpfCnpjArrendador: '219.041.820-04',
    talhaoVinculadoId: 'talhao-04',
    nomeGleba: 'Gleba Platô Sul (TAL-04)',
    areaHa: 450.0,
    sacasPorHaPactuadas: 11.5,
    culturaReferencia: 'Soja em Grãos Comercial',
    dataInicioVigencia: '2023-05-01',
    dataTerminoVigencia: '2028-04-30',
    mesVencimentoPagamento: '30 de Abril',
    statusContrato: 'VIGENTE',
  },
  {
    id: 'arr-02',
    numeroContrato: 'ARR-2024-009-MT',
    arrendadorNome: 'Agropastoril Vale do Teles Pires Ltda',
    cpfCnpjArrendador: '04.819.201/0001-92',
    talhaoVinculadoId: 'talhao-05',
    nomeGleba: 'Gleba Córrego Fundo (TAL-05)',
    areaHa: 360.0,
    sacasPorHaPactuadas: 12.0,
    culturaReferencia: 'Milho Safrinha Grão',
    dataInicioVigencia: '2024-08-01',
    dataTerminoVigencia: '2029-07-31',
    mesVencimentoPagamento: '15 de Julho',
    statusContrato: 'VIGENTE',
  },
  {
    id: 'arr-03',
    numeroContrato: 'ARR-2025-003-MT',
    arrendadorNome: 'Helena Maria de Albuquerque',
    cpfCnpjArrendador: '341.092.184-72',
    talhaoVinculadoId: 'talhao-02',
    nomeGleba: 'Gleba Represa Leste (TAL-02 Parcial)',
    areaHa: 180.0,
    sacasPorHaPactuadas: 10.0,
    culturaReferencia: 'Soja em Grãos Comercial',
    dataInicioVigencia: '2025-05-01',
    dataTerminoVigencia: '2030-04-30',
    mesVencimentoPagamento: '30 de Abril',
    statusContrato: 'VIGENTE',
  },
];

export const ArrendamentosContratosModule: React.FC = () => {
  const [contratos, setContratos] = useState<ContratoArrendamento[]>(CONTRATOS_ARRENDAMENTO_INICIAIS);
  const [cotacaoDiaSoja, setCotacaoDiaSoja] = useState<number>(131.50);
  const [cotacaoDiaMilho, setCotacaoDiaMilho] = useState<number>(56.00);
  const [mostrarModalNovo, setMostrarModalNovo] = useState<boolean>(false);
  const [sucessoMsg, setSucessoMsg] = useState<string | null>(null);

  // Simulador de Nova Área de Arrendamento
  const [simAreaHa, setSimAreaHa] = useState<number>(300.0);
  const [simSacasHa, setSimSacasHa] = useState<number>(11.0);
  const [simProdutividadeEsperada, setSimProdutividadeEsperada] = useState<number>(65.0);

  const simTotalSacasDevidas = simAreaHa * simSacasHa;
  const simComprometimentoProducaoPct = (simSacasHa / simProdutividadeEsperada) * 100;
  const simCustoTotalFinanceiro = simTotalSacasDevidas * cotacaoDiaSoja;

  const totalAreaArrendada = contratos.reduce((acc, curr) => acc + curr.areaHa, 0);
  const totalSacasComprometidasSoja = contratos
    .filter((c) => c.culturaReferencia.includes('Soja'))
    .reduce((acc, curr) => acc + curr.areaHa * curr.sacasPorHaPactuadas, 0);

  const totalDesembolsoArrendamentos = contratos.reduce((acc, curr) => {
    const cotacao = curr.culturaReferencia.includes('Soja') ? cotacaoDiaSoja : cotacaoDiaMilho;
    return acc + curr.areaHa * curr.sacasPorHaPactuadas * cotacao;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <FileSignature className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#1D4B38]">Arrendamentos Rurais & Parcerias Agrícolas</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Estatuto da Terra (Lei 4.504)
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  Indexação em Sacas/ha
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-0.5">
                Gestão de contratos com pagamento em sacas físicas, liquidação com cotação do dia e retenção de IRRF para LCDPR.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMostrarModalNovo(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Novo Contrato de Arrendamento
        </button>
      </div>

      {sucessoMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-700/50 rounded-xl text-emerald-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{sucessoMsg}</span>
          </div>
          <button onClick={() => setSucessoMsg(null)} className="text-xs text-emerald-400 hover:underline">
            Fechar
          </button>
        </div>
      )}

      {/* Cards de Métricas de Arrendamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Área Total Arrendada</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-[#1D4B38] font-mono">{totalAreaArrendada.toFixed(1)} ha</div>
          <p className="text-xs text-slate-500 mt-1">~46% da área consolidada da safra</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Compromisso Físico (Soja)</span>
            <ScrollText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">
            {totalSacasComprometidasSoja.toLocaleString('pt-BR')} sacas
          </div>
          <p className="text-xs text-slate-500 mt-1">Média: 11.2 sc/ha/ano</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Desembolso Estimado Safra</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 font-mono">
            R$ {(totalDesembolsoArrendamentos / 1_000_000).toFixed(2)}M
          </div>
          <p className="text-xs text-slate-500 mt-1">Cotação base: R$ {cotacaoDiaSoja.toFixed(2)}/sc</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Conformidade Jurídica</span>
            <BadgeCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-200 font-mono">100% Regular</div>
          <p className="text-xs text-emerald-400/80 mt-1">Registrados em Cartório de Imóveis</p>
        </div>
      </div>

      {/* Grid: Tabela de Contratos & Liquidação + Simulador de Nova Área */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Contratos (2 colunas) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-emerald-400" />
                Contratos de Arrendamento Ativos
              </h2>
              <p className="text-xs text-slate-600">Valores pactuados em sacas físicas e conversão na data da safra</p>
            </div>

            {/* Ajuste de Cotação de Liquidação */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-600">Cotação do Dia (Soja):</span>
              <input
                type="number"
                step="0.5"
                value={cotacaoDiaSoja}
                onChange={(e) => setCotacaoDiaSoja(Number(e.target.value))}
                className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-emerald-400 font-mono font-bold"
              />
              <span className="text-slate-600 font-mono">R$/sc</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-3">Contrato & Arrendador</th>
                  <th className="px-3.5 py-3">Gleba / Área</th>
                  <th className="px-3.5 py-3">Pacto (sc/ha)</th>
                  <th className="px-3.5 py-3">Sacas Devidas</th>
                  <th className="px-3.5 py-3">Valor Líquido (R$)</th>
                  <th className="px-3.5 py-3">Vencimento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {contratos.map((c) => {
                  const cotacao = c.culturaReferencia.includes('Soja') ? cotacaoDiaSoja : cotacaoDiaMilho;
                  const sacasDevidas = c.areaHa * c.sacasPorHaPactuadas;
                  const valorFinanceiro = sacasDevidas * cotacao;

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-3.5 py-3.5">
                        <div className="font-bold text-slate-900">{c.arrendadorNome}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{c.numeroContrato}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{c.cpfCnpjArrendador}</div>
                      </td>

                      <td className="px-3.5 py-3.5">
                        <div className="text-slate-900 font-medium">{c.nomeGleba}</div>
                        <div className="text-[11px] text-emerald-400 font-mono">{c.areaHa} hectares</div>
                      </td>

                      <td className="px-3.5 py-3.5">
                        <div className="font-mono font-bold text-amber-300">
                          {c.sacasPorHaPactuadas.toFixed(1)} sc/ha
                        </div>
                        <span className="text-[10px] text-slate-600">{c.culturaReferencia}</span>
                      </td>

                      <td className="px-3.5 py-3.5">
                        <div className="font-mono font-bold text-[#1D4B38]">
                          {sacasDevidas.toLocaleString('pt-BR')} sacas
                        </div>
                      </td>

                      <td className="px-3.5 py-3.5">
                        <div className="font-mono font-bold text-emerald-300">
                          R$ {valorFinanceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          R$ {(valorFinanceiro / c.areaHa).toFixed(2)} / ha
                        </span>
                      </td>

                      <td className="px-3.5 py-3.5">
                        <div className="text-slate-900 font-medium">{c.mesVencimentoPagamento}</div>
                        <span className="text-[10px] text-emerald-400 font-semibold">Vigente até 2028</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simulador de Viabilidade de Novo Arrendamento (1 col) */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-[#1D4B38]">Simulador de Arrendamento</h2>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Calcule a viabilidade econômica e comprometimento de safra de novas áreas para expansão:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-900 block mb-1">Área Ofertada (hectares):</label>
                <input
                  type="number"
                  value={simAreaHa}
                  onChange={(e) => setSimAreaHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-900 block mb-1">Sacas Pedidas por Hectare (sc/ha):</label>
                <input
                  type="number"
                  step="0.5"
                  value={simSacasHa}
                  onChange={(e) => setSimSacasHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-900 block mb-1">Produtividade Média Esperada (sc/ha):</label>
                <input
                  type="number"
                  step="0.5"
                  value={simProdutividadeEsperada}
                  onChange={(e) => setSimProdutividadeEsperada(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-900">
              <span>Comprometimento da Produção Bruta:</span>
              <span className={`font-mono font-bold ${simComprometimentoProducaoPct > 20 ? 'text-rose-400' : 'text-emerald-300'}`}>
                {simComprometimentoProducaoPct.toFixed(1)}% da safra
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-900">
              <span>Total de Sacas Anuais:</span>
              <span className="font-mono font-bold text-[#1D4B38]">
                {simTotalSacasDevidas.toLocaleString('pt-BR')} sacas
              </span>
            </div>
            <div className="border-t border-emerald-900/50 pt-2 flex justify-between items-center">
              <span className="font-bold text-[#1D4B38]">Custo Financeiro Previsto:</span>
              <span className="font-mono font-extrabold text-sm text-emerald-300">
                R$ {simCustoTotalFinanceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrendamentosContratosModule;
