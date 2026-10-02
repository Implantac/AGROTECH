import React, { useState, useMemo } from 'react';
import {
  Wheat,
  Globe2,
  Filter,
  Award,
  DollarSign,
  TrendingUp,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';

interface TalhaoGergelim {
  id: string;
  talhao: string;
  variedade: string;
  areaHa: number;
  produtividadeKgHa: number;
  teorOleoPct: number;
  impurezasPct: number;
  umidadePct: number;
  status: 'MATURACAO' | 'DESSECACAO_PRE_COLHEITA' | 'COLHEITA_CONCLUIDA';
}

export const GergelimSegundaSafraModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lavouras' | 'qualidade' | 'exportacao' | 'simulador'>('lavouras');

  // Parâmetros do Simulador Safrinha
  const [areaHa, setAreaHa] = useState<number>(300);
  const [produtividadeKgHa, setProdutividadeKgHa] = useState<number>(850);
  const [teorOleoInputPct, setTeorOleoInputPct] = useState<number>(52.5);
  const [impurezasInputPct, setImpurezasInputPct] = useState<number>(0.8);
  const [precoExportacaoUsdTon, setPrecoExportacaoUsdTon] = useState<number>(1450.0);
  const [taxaCambioUsdBrl, setTaxaCambioUsdBrl] = useState<number>(5.4);
  const [custoTotalHaReais, setCustoTotalHaReais] = useState<number>(3200.0);

  const [talhoes, setTalhoes] = useState<TalhaoGergelim[]>([
    {
      id: 'TL-GERG-01',
      talhao: 'Talhão Safrinha 01 (Canarana - MT)',
      variedade: 'BRS Seda (Grão Branco Nobre)',
      areaHa: 120,
      produtividadeKgHa: 920,
      teorOleoPct: 53.0,
      impurezasPct: 0.7,
      umidadePct: 7.2,
      status: 'COLHEITA_CONCLUIDA',
    },
    {
      id: 'TL-GERG-02',
      talhao: 'Talhão Safrinha 02 (Querência - MT)',
      variedade: 'Trebol Indeiscente',
      areaHa: 100,
      produtividadeKgHa: 830,
      teorOleoPct: 52.0,
      impurezasPct: 0.9,
      umidadePct: 7.5,
      status: 'COLHEITA_CONCLUIDA',
    },
    {
      id: 'TL-GERG-03',
      talhao: 'Talhão Safrinha 03 (Rio Verde - GO)',
      variedade: 'K3 Selection Export',
      areaHa: 80,
      produtividadeKgHa: 780,
      teorOleoPct: 51.5,
      impurezasPct: 1.1,
      umidadePct: 8.0,
      status: 'DESSECACAO_PRE_COLHEITA',
    },
  ]);

  const metricas = useMemo(() => {
    const producaoTotalKg = areaHa * produtividadeKgHa;
    const producaoTotalTon = producaoTotalKg / 1000;
    const sacasTotal = producaoTotalKg / 60;

    const isTipo1Exportacao = teorOleoInputPct >= 50.0 && impurezasInputPct <= 1.0;

    const precoTonReais = Number((precoExportacaoUsdTon * taxaCambioUsdBrl).toFixed(2));
    const receitaBrutaReais = Number((producaoTotalTon * precoTonReais).toFixed(2));
    const custoTotalReais = Number((areaHa * custoTotalHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemSacaReais = sacasTotal > 0 ? Number((lucroLiquidoReais / sacasTotal).toFixed(2)) : 0;
    const margemPercentual = receitaBrutaReais > 0 ? Number(((lucroLiquidoReais / receitaBrutaReais) * 100).toFixed(1)) : 0;

    return {
      producaoTotalKg,
      producaoTotalTon,
      sacasTotal,
      isTipo1Exportacao,
      precoTonReais,
      receitaBrutaReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemSacaReais,
      margemPercentual,
    };
  }, [
    areaHa,
    produtividadeKgHa,
    teorOleoInputPct,
    impurezasInputPct,
    precoExportacaoUsdTon,
    taxaCambioUsdBrl,
    custoTotalHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-[#EAF4E7] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Wheat className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Gergelim de Segunda Safra & Exportação Asiática
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Módulo 114 • Safrinha no Cerrado, Mesas Densimétricas & Mercado Global
              </span>
            </div>
            <p className="text-sm text-[#66736A] mt-1">
              Cultura resiliente ao estresse hídrico no pós-soja, teor de óleo superior a 50% e classificação Tipo 1 para exportação à Ásia e Oriente Médio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Câmbio & Arbitragem
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Volume Total Safra</span>
            <Wheat className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.producaoTotalTon.toFixed(1)} t
          </p>
          <span className="text-xs text-amber-400 mt-1 block">
            {metricas.sacasTotal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} sacas (60kg)
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Preço FOB Exportação</span>
            <Globe2 className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            USD {precoExportacaoUsdTon.toFixed(0)}/t
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            R$ {metricas.precoTonReais.toLocaleString('pt-BR')}/t (câmbio {taxaCambioUsdBrl})
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Receita Bruta Total</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.receitaBrutaReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Faturamento Safrinha
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Margem Líquida / Saca</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {metricas.margemSacaReais.toFixed(2)}/sc
          </p>
          <span className="text-xs text-amber-400 mt-1 block">
            {metricas.margemPercentual}% Lucro Líquido
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('lavouras')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'lavouras'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Wheat className="w-4 h-4" />
          Lavouras de Safrinha
        </button>

        <button
          onClick={() => setActiveTab('qualidade')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'qualidade'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Filter className="w-4 h-4" />
          Mesas Densimétricas & Óleo
        </button>

        <button
          onClick={() => setActiveTab('exportacao')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'exportacao'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          Destinos de Exportação
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'lavouras' && (
        <div className="bg-slate-900/40 rounded-2xl border border-[#EAF4E7] p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Wheat className="w-5 h-5 text-amber-400" />
            Talhões Monitorados no Médio-Norte e Vale do Araguaia
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#26332A]">
              <thead className="text-xs uppercase bg-[#F7F9F5] text-[#66736A]">
                <tr>
                  <th className="px-4 py-3">Talhão / Região</th>
                  <th className="px-4 py-3">Cultivar</th>
                  <th className="px-4 py-3">Área (ha)</th>
                  <th className="px-4 py-3">Produtividade</th>
                  <th className="px-4 py-3">Teor de Óleo</th>
                  <th className="px-4 py-3">Impurezas</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {talhoes.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-white">{t.talhao}</td>
                    <td className="px-4 py-3">{t.variedade}</td>
                    <td className="px-4 py-3">{t.areaHa} ha</td>
                    <td className="px-4 py-3 font-semibold text-amber-400">{t.produtividadeKgHa} kg/ha</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">{t.teorOleoPct}%</td>
                    <td className="px-4 py-3">{t.impurezasPct}%</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'qualidade' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Teor Lipídico Elevado</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Grãos com mais de 50% de óleo de alta pureza e baixa acidez livre, muito valorizados pela indústria de tahine e óleos finos.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Exigência Padrão Tipo 1:</span>
              <span className="text-sm font-bold text-amber-400 block">superior ou igual a 50.0% de óleo</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">Limpeza em Mesa Densimétrica</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Separação gravitacional e ar aspirado eliminam pedúnculos, sementes chochas, poeira e pedriscos antes da exportação.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Impureza Máxima Permitida:</span>
              <span className="text-sm font-bold text-cyan-400 block">menor ou igual a 1.0%</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Coloração Clara Uniforme</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Seleção por leitoras ópticas cromáticas garantindo 99.5% de pureza visual sem grãos pretos ou manchados por chuvas na colheita.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Pureza Visual:</span>
              <span className="text-sm font-bold text-emerald-400 block">superior a 99.5% de sementes brancas</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'exportacao' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-yellow-400" />
            Fluxo Logístico de Exportação (Containers 20ft & Big Bags)
          </h3>
          <p className="text-sm text-[#66736A]">
            O gergelim brasileiro conquistou mercados cruciais na Ásia e Oriente Médio devido à janela de colheita complementar do hemisfério sul e padrões de resíduo zero.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">China & Índia</span>
              <p className="text-lg font-bold text-white mt-1">Esmagamento & Óleo</p>
              <span className="text-[11px] text-slate-500">Demanda em grande escala</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Turquia & Oriente Médio</span>
              <p className="text-lg font-bold text-amber-400 mt-1">Tahine & Confeitaria</p>
              <span className="text-[11px] text-amber-500/80">Exige grão branco extra limpo</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Embalagem de Trânsito</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">Big Bag 1.000 kg c/ liner</p>
              <span className="text-[11px] text-slate-500">Protege contra umidade marítima</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            Simulador de Paridade Cambial & Rentabilidade por Saca
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-[#66736A]">Área Cultivada (ha)</label>
              <input
                type="number"
                value={areaHa}
                onChange={(e) => setAreaHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Produtividade (kg/ha)</label>
              <input
                type="number"
                value={produtividadeKgHa}
                onChange={(e) => setProdutividadeKgHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Cotação FOB (USD/ton)</label>
              <input
                type="number"
                value={precoExportacaoUsdTon}
                onChange={(e) => setPrecoExportacaoUsdTon(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Câmbio USD/BRL</label>
              <input
                type="number"
                step="0.05"
                value={taxaCambioUsdBrl}
                onChange={(e) => setTaxaCambioUsdBrl(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#66736A] block">Status de Conformidade Exportação:</span>
              <span className={`text-base font-bold ${metricas.isTipo1Exportacao ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {metricas.isTipo1Exportacao ? '✓ TIPO 1 EXPORTAÇÃO PREMIUM (ÁGIO MÁXIMO)' : 'PADRÃO COMERCIAL INTERNO'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#66736A] block">Lucro Líquido Safra:</span>
              <span className="text-xl font-bold text-emerald-400">
                R$ {metricas.lucroLiquidoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
