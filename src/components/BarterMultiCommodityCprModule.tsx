import React, { useState, useMemo } from 'react';
import {
  Handshake,
  DollarSign,
  TrendingUp,
  Layers,
  Award,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Scale,
  Landmark,
} from 'lucide-react';

interface ContratoBarterCpr {
  id: string;
  numeroCprB3: string;
  produtorTitular: string;
  pacoteInsumos: string;
  commodityPagamento: 'SOJA' | 'MILHO' | 'ALGODAO_PLUMA' | 'CAFE_ARABICA';
  valorCreditoInsumosReais: number;
  precoTravadoSacaReais: number;
  sacasComprometidas: number;
  sacasEntregues: number;
  dataVencimentoEntrega: string;
  garantiaAlienacaoFiduciariaPct: number;
  status: 'REGISTRADA_B3' | 'EM_LIQUIDACAO_FISICA' | 'LIQUIDADA_100_PCT';
}

export const BarterMultiCommodityCprModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contratos' | 'troca' | 'cprb3' | 'simulador'>('contratos');

  // Parâmetros do Simulador
  const [valorPacoteInsumosReais, setValorPacoteInsumosReais] = useState<number>(2400000);
  const [precoFuturoSacaReais, setPrecoFuturoSacaReais] = useState<number>(132.5);
  const [sacasGarantidasCpr, setSacasGarantidasCpr] = useState<number>(20000);
  const [taxaRegistroB3Reais, setTaxaRegistroB3Reais] = useState<number>(1850);
  const [premioHedgeB3PorSaca, setPremioHedgeB3PorSaca] = useState<number>(1.2);

  const [contratos, setContratos] = useState<ContratoBarterCpr[]>([
    {
      id: 'CPR-B3-2026-0041',
      numeroCprB3: 'CPR-F-B3-MT-2026-90412',
      produtorTitular: 'Agropecuária Santa Rita Ltda',
      pacoteInsumos: 'Fertilizante NPK + Químicos + Semente Intacta 2 Xtend',
      commodityPagamento: 'SOJA',
      valorCreditoInsumosReais: 2400000,
      precoTravadoSacaReais: 132.5,
      sacasComprometidas: 20000,
      sacasEntregues: 20000,
      dataVencimentoEntrega: '2026-05-30',
      garantiaAlienacaoFiduciariaPct: 110.4,
      status: 'LIQUIDADA_100_PCT',
    },
    {
      id: 'CPR-B3-2026-0042',
      numeroCprB3: 'CPR-F-B3-GO-2026-88120',
      produtorTitular: 'Fazenda Rio Bonito (Condomínio Rural)',
      pacoteInsumos: 'Ureia Protegida + Adubo de Cobertura Safrinha',
      commodityPagamento: 'MILHO',
      valorCreditoInsumosReais: 1800000,
      precoTravadoSacaReais: 62.0,
      sacasComprometidas: 32000,
      sacasEntregues: 18500,
      dataVencimentoEntrega: '2026-08-15',
      garantiaAlienacaoFiduciariaPct: 110.2,
      status: 'EM_LIQUIDACAO_FISICA',
    },
    {
      id: 'CPR-B3-2026-0043',
      numeroCprB3: 'CPR-F-B3-BA-2026-74519',
      produtorTitular: 'Algodoeira e Grãos do Oeste S/A',
      pacoteInsumos: 'Biorreguladores + Defensivos Fungicidas + Inseticidas',
      commodityPagamento: 'ALGODAO_PLUMA',
      valorCreditoInsumosReais: 3200000,
      precoTravadoSacaReais: 148.0,
      sacasComprometidas: 23500,
      sacasEntregues: 0,
      dataVencimentoEntrega: '2026-09-20',
      garantiaAlienacaoFiduciariaPct: 108.7,
      status: 'REGISTRADA_B3',
    },
  ]);

  const metricas = useMemo(() => {
    const sacasExigidasBarter = precoFuturoSacaReais > 0 ? Number((valorPacoteInsumosReais / precoFuturoSacaReais).toFixed(1)) : 0;
    const saldoExcedenteSacas = Number((sacasGarantidasCpr - sacasExigidasBarter).toFixed(1));
    const valorTotalGarantiaReais = Number((sacasGarantidasCpr * precoFuturoSacaReais).toFixed(2));
    const margemCoberturaGarantiaPct = valorPacoteInsumosReais > 0 ? Number(((valorTotalGarantiaReais / valorPacoteInsumosReais) * 100).toFixed(1)) : 0;
    const custoHedgeTotalReais = Number((sacasExigidasBarter * premioHedgeB3PorSaca).toFixed(2));
    const custoTotalOperacaoBarter = Number((valorPacoteInsumosReais + taxaRegistroB3Reais + custoHedgeTotalReais).toFixed(2));

    return {
      sacasExigidasBarter,
      saldoExcedenteSacas,
      valorTotalGarantiaReais,
      margemCoberturaGarantiaPct,
      custoHedgeTotalReais,
      custoTotalOperacaoBarter,
    };
  }, [
    valorPacoteInsumosReais,
    precoFuturoSacaReais,
    sacasGarantidasCpr,
    taxaRegistroB3Reais,
    premioHedgeB3PorSaca,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Handshake className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Barter Multi-Commodity & Cédula de Produto Rural (CPR Eletrônica B3)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Módulo 130 • Registro B3 / Cerc & Relação de Troca
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Trava de insumos sem desembolso financeiro imediato, cálculo dinâmico de relação de troca em sacas, emissão de CPR com penhor cedular e liquidação física nos armazéns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Relação de Troca
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Relação de Troca Exigida</span>
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.sacasExigidasBarter.toLocaleString('pt-BR')} sacas
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Equivalente a R$ {(valorPacoteInsumosReais / 1000000).toFixed(2)}M em insumos
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Cobertura de Garantia</span>
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.margemCoberturaGarantiaPct}%
          </p>
          <span className="text-xs text-amber-400 mt-1 block">
            R$ {(metricas.valorTotalGarantiaReais / 1000000).toFixed(2)}M valorizado na B3
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Sobra para Comercialização</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            +{metricas.saldoExcedenteSacas.toLocaleString('pt-BR')} sc
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Margem de segurança acima do pactuado
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Status de Registro B3</span>
            <Landmark className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            100% Homologado
          </p>
          <span className="text-xs text-cyan-400 mt-1 block">
            Certificação Lei nº 13.986 (Agro 4.0)
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('contratos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'contratos'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Contratos de Barter
        </button>

        <button
          onClick={() => setActiveTab('troca')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'troca'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Scale className="w-4 h-4" />
          Relação de Troca por Cultura
        </button>

        <button
          onClick={() => setActiveTab('cprb3')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'cprb3'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Landmark className="w-4 h-4" />
          Custódia & Registro B3
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'contratos' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Contratos de Barter com Emissão e Registro de CPR
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Número B3</th>
                  <th className="px-4 py-3">Titular</th>
                  <th className="px-4 py-3">Commodity</th>
                  <th className="px-4 py-3">Valor Travado</th>
                  <th className="px-4 py-3">Preço Travado</th>
                  <th className="px-4 py-3">Sacas</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {contratos.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono text-xs text-white">{c.numeroCprB3}</td>
                    <td className="px-4 py-3 text-slate-300 font-medium">{c.produtorTitular}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-400">{c.commodityPagamento}</td>
                    <td className="px-4 py-3 font-bold text-white">
                      R$ {c.valorCreditoInsumosReais.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">R$ {c.precoTravadoSacaReais.toFixed(2)}/sc</td>
                    <td className="px-4 py-3 text-slate-200">{c.sacasComprometidas.toLocaleString('pt-BR')} sc</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'troca' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Relação de Troca Histórica</h4>
            </div>
            <p className="text-xs text-slate-400">
              Mede a quantidade de sacas de soja necessárias para comprar 1 tonelada de adubo formulado (ex: MAP ou NPK 02-20-20). Faixas abaixo de 22 sc/ton indicam excelente momento de trava.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Índice Atual:</span>
              <span className="text-sm font-bold text-emerald-400 block">18.2 sacas / tonelada de fertilizante</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Hedge Cambial & CBOT Embutido</h4>
            </div>
            <p className="text-xs text-slate-400">
              Ao fixar a operação de Barter, a revenda ou multinacional executa a venda futura da commodity e a compra do insumo, eliminando totalmente o risco de descasamento cambial para o produtor.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Proteção Volatilidade:</span>
              <span className="text-sm font-bold text-amber-400 block">100% blindado contra oscilação do dólar</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Landmark className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">Liquidação Física em Armazém</h4>
            </div>
            <p className="text-xs text-slate-400">
              Na colheita, o produtor entrega os grãos no armazém credenciado ou trading, transferindo o romaneio de balança diretamente para quitação integral da CPR.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Desoneração Fiscal:</span>
              <span className="text-sm font-bold text-cyan-400 block">Operação isenta de IOF</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cprb3' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-cyan-400" />
            Estruturação Jurídica da CPR Conforme Lei nº 13.986 (Nova Lei do Agro)
          </h3>
          <p className="text-sm text-slate-400">
            A CPR física é registrada no sistema de custódia da B3 ou Cerc em até 10 dias úteis após emissão, conferindo eficácia de título executivo extrajudicial com garantia real de penhor cedular de safra.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Assinatura Eletrônica</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">ICP-Brasil / gov.br</p>
              <span className="text-[11px] text-slate-400">Validade jurídica sem reconhecimento em cartório</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Garantia Imobiliária</span>
              <p className="text-lg font-bold text-amber-400 mt-1">Penhor de Safra</p>
              <span className="text-[11px] text-slate-400">Vinculado às coordenadas do talhão CAR</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Integração Bancária</span>
              <p className="text-lg font-bold text-white mt-1">B3 Registradora</p>
              <span className="text-[11px] text-slate-400">Custódia digital e consulta pública</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Simulador de Relação de Troca & Margem da Operação Barter
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Valor Insumos (R$)</label>
              <input
                type="number"
                value={valorPacoteInsumosReais}
                onChange={(e) => setValorPacoteInsumosReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Preço Futuro Saca (R$)</label>
              <input
                type="number"
                step="0.5"
                value={precoFuturoSacaReais}
                onChange={(e) => setPrecoFuturoSacaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Sacas Ofertadas CPR</label>
              <input
                type="number"
                value={sacasGarantidasCpr}
                onChange={(e) => setSacasGarantidasCpr(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Taxa Registro B3 (R$)</label>
              <input
                type="number"
                value={taxaRegistroB3Reais}
                onChange={(e) => setTaxaRegistroB3Reais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Sacas Necessárias para Quitação:</span>
              <span className="text-base font-bold text-emerald-400">
                {metricas.sacasExigidasBarter.toLocaleString('pt-BR')} sacas contratadas
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Garantia Total Registrada na B3:</span>
              <span className="text-xl font-bold text-amber-400">
                R$ {metricas.valorTotalGarantiaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
