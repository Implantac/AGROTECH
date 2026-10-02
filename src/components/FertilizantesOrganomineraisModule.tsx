import React, { useState, useMemo } from 'react';
import {
  Recycle,
  Sprout,
  DollarSign,
  TrendingUp,
  Layers,
  Award,
  Factory,
  Beaker,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface LoteOrganomineral {
  id: string;
  lote: string;
  materiaPrimaOrganica: string;
  formulaNpK: string;
  carbonoOrganicoPct: number;
  umidadePct: number;
  ctcMmolcKg: number;
  producaoToneladas: number;
  conformidadeMapa: boolean;
}

export const FertilizantesOrganomineraisModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lotes' | 'normas' | 'processo' | 'simulador'>('lotes');

  // Parâmetros do Simulador
  const [toneladasProduzidasAno, setToneladasProduzidasAno] = useState<number>(25000);
  const [custoMateriaOrganicaPorTon, setCustoMateriaOrganicaPorTon] = useState<number>(120);
  const [custoFontesMineraisPorTon, setCustoFontesMineraisPorTon] = useState<number>(950);
  const [custoProcessamentoGranulacaoPorTon, setCustoProcessamentoGranulacaoPorTon] = useState<number>(180);
  const [precoVendaOrganomineralPorTon, setPrecoVendaOrganomineralPorTon] = useState<number>(1850);
  const [precoMineralEquivalentePorTon, setPrecoMineralEquivalentePorTon] = useState<number>(2400);

  const [lotes, setLotes] = useState<LoteOrganomineral[]>([
    {
      id: 'LOT-ORG-01',
      lote: 'Granulado Organomineral NPK 04-14-08 + 1% B',
      materiaPrimaOrganica: 'Cama de Frango Compostada + Torta de Filtro',
      formulaNpK: '04-14-08',
      carbonoOrganicoPct: 9.2,
      umidadePct: 14.5,
      ctcMmolcKg: 142,
      producaoToneladas: 5000,
      conformidadeMapa: true,
    },
    {
      id: 'LOT-ORG-02',
      lote: 'Pellet Organomineral NPK 08-16-16 + Zn',
      materiaPrimaOrganica: 'Dejeto Suíno Biodigerido + Palha de Café',
      formulaNpK: '08-16-16',
      carbonoOrganicoPct: 8.8,
      umidadePct: 13.0,
      ctcMmolcKg: 165,
      producaoToneladas: 8000,
      conformidadeMapa: true,
    },
    {
      id: 'LOT-ORG-03',
      lote: 'Farelo Enriquecido Micro-Ativado 03-10-10',
      materiaPrimaOrganica: 'Biochar Pirofílico + Fosfato Natural Reativo',
      formulaNpK: '03-10-10',
      carbonoOrganicoPct: 14.0,
      umidadePct: 11.8,
      ctcMmolcKg: 210,
      producaoToneladas: 4500,
      conformidadeMapa: true,
    },
  ]);

  const metricas = useMemo(() => {
    const custoUnitarioProducao = Number((custoMateriaOrganicaPorTon * 0.55 + custoFontesMineraisPorTon * 0.45 + custoProcessamentoGranulacaoPorTon).toFixed(2));
    const custoTotalAno = Number((custoUnitarioProducao * toneladasProduzidasAno).toFixed(2));
    const receitaTotalAno = Number((precoVendaOrganomineralPorTon * toneladasProduzidasAno).toFixed(2));
    const lucroLiquidoAno = Number((receitaTotalAno - custoTotalAno).toFixed(2));
    const margemLiquidaPct = receitaTotalAno > 0 ? Number(((lucroLiquidoAno / receitaTotalAno) * 100).toFixed(1)) : 0;
    const economiaProdutorVsMineralPorTon = Number((precoMineralEquivalentePorTon - precoVendaOrganomineralPorTon).toFixed(2));
    const economiaTotalAgricultores = Number((economiaProdutorVsMineralPorTon * toneladasProduzidasAno).toFixed(2));

    return {
      custoUnitarioProducao,
      custoTotalAno,
      receitaTotalAno,
      lucroLiquidoAno,
      margemLiquidaPct,
      economiaProdutorVsMineralPorTon,
      economiaTotalAgricultores,
    };
  }, [
    toneladasProduzidasAno,
    custoMateriaOrganicaPorTon,
    custoFontesMineraisPorTon,
    custoProcessamentoGranulacaoPorTon,
    precoVendaOrganomineralPorTon,
    precoMineralEquivalentePorTon,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-[#EAF4E7] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-lime-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-lime-500/20">
            <Recycle className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Fertilizantes Organominerais & Bioeconomia Circular
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-lime-500/10 text-lime-400 border border-lime-500/20">
                Módulo 123 • MAPA IN 61/2020 & Granulação Sustentável
              </span>
            </div>
            <p className="text-sm text-[#66736A] mt-1">
              Valorização de resíduos agroindustriais (torta de filtro, cama de frango, esterco), condicionamento físico-químico do solo e liberação gradual de nutrientes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lime-500 to-emerald-400 hover:from-lime-400 hover:to-emerald-300 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-lime-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Viabilidade
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Produção Anual</span>
            <Factory className="w-5 h-5 text-lime-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {toneladasProduzidasAno.toLocaleString('pt-BR')} ton
          </p>
          <span className="text-xs text-lime-400 mt-1 block">
            Substituição de adubo 100% mineral
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Custo de Fabricação</span>
            <Sliders className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {metricas.custoUnitarioProducao.toFixed(2)} / ton
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Matéria orgânica + sais + peletização
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Economia ao Agricultor</span>
            <Sprout className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {metricas.economiaProdutorVsMineralPorTon.toFixed(2)} / ton
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            R$ {(metricas.economiaTotalAgricultores / 1000000).toFixed(2)}M no ecossistema
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Margem Líquida da Usina</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.margemLiquidaPct}%
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            R$ {(metricas.lucroLiquidoAno / 1000000).toFixed(2)}M / ano de lucro
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('lotes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'lotes'
              ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Lotes de Produção
        </button>

        <button
          onClick={() => setActiveTab('normas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'normas'
              ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Award className="w-4 h-4" />
          MAPA IN 61/2020 & Parâmetros
        </button>

        <button
          onClick={() => setActiveTab('processo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'processo'
              ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Factory className="w-4 h-4" />
          Processo de Granulação
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'lotes' && (
        <div className="bg-slate-900/40 rounded-2xl border border-[#EAF4E7] p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Recycle className="w-5 h-5 text-lime-400" />
            Lotes Industriais Formulados
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#26332A]">
              <thead className="text-xs uppercase bg-[#F7F9F5] text-[#66736A]">
                <tr>
                  <th className="px-4 py-3">Produto / Fórmula</th>
                  <th className="px-4 py-3">Matéria Orgânica</th>
                  <th className="px-4 py-3">COT (%)</th>
                  <th className="px-4 py-3">CTC (mmolc/kg)</th>
                  <th className="px-4 py-3">Umidade</th>
                  <th className="px-4 py-3">Volume</th>
                  <th className="px-4 py-3">Status MAPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lotes.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-white">{l.lote}</td>
                    <td className="px-4 py-3 text-xs text-[#66736A]">{l.materiaPrimaOrganica}</td>
                    <td className="px-4 py-3 font-bold text-lime-400">{l.carbonoOrganicoPct}%</td>
                    <td className="px-4 py-3">{l.ctcMmolcKg}</td>
                    <td className="px-4 py-3">{l.umidadePct}%</td>
                    <td className="px-4 py-3">{l.producaoToneladas.toLocaleString('pt-BR')} ton</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Conforme IN 61
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'normas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Beaker className="w-5 h-5 text-lime-400" />
              <h4 className="text-sm font-semibold text-white">Carbono Orgânico Total (COT)</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Mínimo regulatório exigido de 8% de COT na massa seca, estimulando a microbiota telúrica benéfica e solubilização biológica de fósforo residual.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Exigência MAPA:</span>
              <span className="text-sm font-bold text-lime-400 block">mínimo 8.0% COT</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Sprout className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Capacidade de Troca Catiônica</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              CTC mínima de 80 mmolc/kg proporcionando retenção de cátions (K+, Ca2+, Mg2+) e reduzindo as perdas por lixiviação nas chuvas tropicais.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Exigência MAPA:</span>
              <span className="text-sm font-bold text-emerald-400 block">mínimo 80 mmolc/kg</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Umidade Máxima Permitida</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Limite máximo de 30% de umidade (ou 15% para fórmulas peletizadas/granuladas a vácuo) evitando empedramento e degradação nas adubadeiras de plantio.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Limite de Tolerância:</span>
              <span className="text-sm font-bold text-yellow-400 block">máximo 15% a 30%</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'processo' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Factory className="w-5 h-5 text-lime-400" />
            Fluxo Contínuo de Compostagem Termofílica e Granulação Industrial
          </h3>
          <p className="text-sm text-[#66736A]">
            A fase termofílica (temperatura superior a 55°C por 14 dias contínuos) elimina fitopatógenos, ovos de nematóides e sementes de plantas daninhas antes da mistura com as fontes minerais.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2">
            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">1. Compostagem Ativa</span>
              <p className="text-sm font-bold text-white mt-1">Aeração forçada</p>
              <span className="text-[11px] text-lime-400">Sanitização biológica</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">2. Adição de Minerais</span>
              <p className="text-sm font-bold text-white mt-1">MAP, KCl e Ureia</p>
              <span className="text-[11px] text-lime-400">Homogeneização mecânica</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">3. Peletização / Granulação</span>
              <p className="text-sm font-bold text-white mt-1">Matriz Rotativa</p>
              <span className="text-[11px] text-lime-400">Grânulos de 2 a 4 mm</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">4. Secagem & Ensaque</span>
              <p className="text-sm font-bold text-white mt-1">Resfriador Contracorrente</p>
              <span className="text-[11px] text-lime-400">Big Bags de 1.000 kg</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-lime-400" />
            Simulador de Viabilidade Industrial & Economia em Campo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-[#66736A]">Produção Anual (toneladas)</label>
              <input
                type="number"
                value={toneladasProduzidasAno}
                onChange={(e) => setToneladasProduzidasAno(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-lime-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Preço Venda Organomineral (R$/ton)</label>
              <input
                type="number"
                value={precoVendaOrganomineralPorTon}
                onChange={(e) => setPrecoVendaOrganomineralPorTon(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-lime-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Preço Adubo Mineral Equiv. (R$/ton)</label>
              <input
                type="number"
                value={precoMineralEquivalentePorTon}
                onChange={(e) => setPrecoMineralEquivalentePorTon(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-lime-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#66736A] block">Custo Industrial por Tonelada:</span>
              <span className="text-base font-bold text-lime-400">
                R$ {metricas.custoUnitarioProducao.toFixed(2)} / ton
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#66736A] block">Lucro Líquido Anual da Fábrica:</span>
              <span className="text-xl font-bold text-emerald-400">
                R$ {metricas.lucroLiquidoAno.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
