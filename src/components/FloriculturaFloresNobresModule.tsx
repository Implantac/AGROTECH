import React, { useState, useMemo } from 'react';
import {
  Flower2,
  Sun,
  Droplets,
  Award,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface LoteFloricultura {
  id: string;
  estufa: string;
  especie: string;
  cultivar: string;
  areaM2: number;
  hastesM2Ano: number;
  comprimentoMedioHasteCm: number;
  temperaturaMediaC: number;
  umidadeRelativaPct: number;
  status: 'INDUCAO_FLORAL' | 'PULSAGEM_POS_COLHEITA' | 'EXPEDICAO_COMEMORATIVA';
}

export const FloriculturaFloresNobresModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'estufas' | 'pulsagem' | 'qualidade' | 'simulador'>('estufas');

  // Parâmetros do Simulador
  const [areaEstufasM2, setAreaEstufasM2] = useState<number>(5000);
  const [hastesPorMetroAno, setHastesPorMetroAno] = useState<number>(120);
  const [proporcaoClasseA1Pct, setProporcaoClasseA1Pct] = useState<number>(75);
  const [precoHasteA1Reais, setPrecoHasteA1Reais] = useState<number>(3.8);
  const [precoHastePadraoReais, setPrecoHastePadraoReais] = useState<number>(2.2);
  const [custoTotalM2AnoReais, setCustoTotalM2AnoReais] = useState<number>(190.0);

  const [estufas, setEstufas] = useState<LoteFloricultura[]>([
    {
      id: 'EST-FLOR-01',
      estufa: 'Estufa Climatizada 01 (Holambra - SP)',
      especie: 'Rosa de Corte (Rosa hybrida)',
      cultivar: 'Red Naomi Grandiflora',
      areaM2: 2000,
      hastesM2Ano: 135,
      comprimentoMedioHasteCm: 78,
      temperaturaMediaC: 21.5,
      umidadeRelativaPct: 70,
      status: 'EXPEDICAO_COMEMORATIVA',
    },
    {
      id: 'EST-FLOR-02',
      estufa: 'Estufa Climatizada 02 (Ibiúna - SP)',
      especie: 'Orquídea Nobre (Phalaenopsis)',
      cultivar: 'White Giant Cascade',
      areaM2: 1800,
      hastesM2Ano: 95,
      comprimentoMedioHasteCm: 65,
      temperaturaMediaC: 23.0,
      umidadeRelativaPct: 68,
      status: 'INDUCAO_FLORAL',
    },
    {
      id: 'EST-FLOR-03',
      estufa: 'Estufa Climatizada 03 (Serra de Ibiapaba - CE)',
      especie: 'Lírio Asiático & Oriental',
      cultivar: 'Sorbonne Pink Perfumed',
      areaM2: 1200,
      hastesM2Ano: 110,
      comprimentoMedioHasteCm: 82,
      temperaturaMediaC: 20.0,
      umidadeRelativaPct: 72,
      status: 'PULSAGEM_POS_COLHEITA',
    },
  ]);

  const metricas = useMemo(() => {
    const producaoTotalHastes = Number((areaEstufasM2 * hastesPorMetroAno).toFixed(0));
    const hastesA1 = Number(((producaoTotalHastes * proporcaoClasseA1Pct) / 100).toFixed(0));
    const hastesPadrao = producaoTotalHastes - hastesA1;

    const receitaBrutaReais = Number(
      (hastesA1 * precoHasteA1Reais + hastesPadrao * precoHastePadraoReais).toFixed(2)
    );
    const custoTotalReais = Number((areaEstufasM2 * custoTotalM2AnoReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = receitaBrutaReais > 0 ? Number(((lucroLiquidoReais / receitaBrutaReais) * 100).toFixed(1)) : 0;

    return {
      producaoTotalHastes,
      hastesA1,
      hastesPadrao,
      receitaBrutaReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaEstufasM2,
    hastesPorMetroAno,
    proporcaoClasseA1Pct,
    precoHasteA1Reais,
    precoHastePadraoReais,
    custoTotalM2AnoReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-[#EAF4E7] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Flower2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Floricultura & Flores Nobres em Estufa
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Módulo 121 • Rosas de Corte, Phalaenopsis & Pulsagem Sacarose
              </span>
            </div>
            <p className="text-sm text-[#66736A] mt-1">
              Controle de fotoperíodo e tela termo-refletora, pulsagem pós-colheita para longevidade em vaso e classificação Botão Extra A1.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-rose-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Florada
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Produção Anual Total</span>
            <Flower2 className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.producaoTotalHastes.toLocaleString('pt-BR')} hastes
          </p>
          <span className="text-xs text-rose-400 mt-1 block">
            {hastesPorMetroAno} hastes/m² ano
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Hastes Classe Extra A1</span>
            <Sparkles className="w-5 h-5 text-pink-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.hastesA1.toLocaleString('pt-BR')}
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            {proporcaoClasseA1Pct}% de aproveitamento nobre
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Receita Bruta Anual</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.receitaBrutaReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            Faturamento em cooperativas (Veiling)
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Lucro Líquido Anual</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.lucroLiquidoReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            {metricas.margemLiquidaPct}% Margem Líquida
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('estufas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'estufas'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Estufas Climatizadas
        </button>

        <button
          onClick={() => setActiveTab('pulsagem')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'pulsagem'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Droplets className="w-4 h-4" />
          Pulsagem & Vida de Vaso
        </button>

        <button
          onClick={() => setActiveTab('qualidade')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'qualidade'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Award className="w-4 h-4" />
          Classificação A1 (Comprimento & Botão)
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'estufas' && (
        <div className="bg-slate-900/40 rounded-2xl border border-[#EAF4E7] p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-rose-400" />
            Monitoramento de Estufas com Telas Termo-Refletoras & Pad-Fan
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#26332A]">
              <thead className="text-xs uppercase bg-[#F7F9F5] text-[#66736A]">
                <tr>
                  <th className="px-4 py-3">Estufa / Região</th>
                  <th className="px-4 py-3">Espécie & Cultivar</th>
                  <th className="px-4 py-3">Área (m²)</th>
                  <th className="px-4 py-3">Produtividade</th>
                  <th className="px-4 py-3">Comprimento Haste</th>
                  <th className="px-4 py-3">Clima Interno</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {estufas.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-white">{e.estufa}</td>
                    <td className="px-4 py-3">
                      <span className="text-rose-400 font-semibold">{e.especie}</span>
                      <span className="block text-xs text-[#66736A]">{e.cultivar}</span>
                    </td>
                    <td className="px-4 py-3">{e.areaM2} m²</td>
                    <td className="px-4 py-3 font-bold text-white">{e.hastesM2Ano} hastes/m²</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">{e.comprimentoMedioHasteCm} cm</td>
                    <td className="px-4 py-3 text-xs">
                      {e.temperaturaMediaC}°C | {e.umidadeRelativaPct}% UR
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pulsagem' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-semibold text-white">Solução de Pulsagem com Sacarose</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Imersão basal das hastes imediatamente após o corte em água desmineralizada com 2% a 4% de sacarose e sulfato de alumínio para acidificação (pH 3.5 a 4.0).
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Absorção Rápida:</span>
              <span className="text-sm font-bold text-rose-400 block">4 a 6 horas em câmara a 4°C</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Bactericida & Desobstrução</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Uso de hipoclorito ou compostos de cloro ativo para inibir proliferação bacteriana nos vasos xilemáticos, evitando o fenômeno de "pescoço caído" (*bent neck*).
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Vida Útil em Vaso:</span>
              <span className="text-sm font-bold text-emerald-400 block">14 a 20 dias garantidos</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Sincronização de Datas Festivas</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Poda programada e ajuste de temperatura permitem concentrar 60% do faturamento nas janelas de maior valor agregado (Dia das Mães, Namorados e Fim de Ano).
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Ágio Comercial:</span>
              <span className="text-sm font-bold text-yellow-400 block">+80% a +150% no preço unitário</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'qualidade' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-pink-400" />
            Classificação Padrão Veiling Holambra (Norma Ibraflor)
          </h3>
          <p className="text-sm text-[#66736A]">
            A padronização dimensional garante máxima liquidez no leilão eletrônico diário de flores. Hastes longas, retas e com botões túrgidos são comercializadas no topo da tabela.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Classe A1 Extra Longa</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">superior a 70 cm</p>
              <span className="text-[11px] text-emerald-500/80">Botão superior a 4.5 cm de altura</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Classe A2 Média</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">50 a 69 cm</p>
              <span className="text-[11px] text-slate-500">Uso para buquês comerciais</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Classe B Curta</span>
              <p className="text-lg font-bold text-white mt-1">menor que 50 cm</p>
              <span className="text-[11px] text-slate-500">Destinado a arranjos de mesa</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-rose-400" />
            Simulador de Faturamento & Rentabilidade por m² de Estufa
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-[#66736A]">Área Estufas (m²)</label>
              <input
                type="number"
                value={areaEstufasM2}
                onChange={(e) => setAreaEstufasM2(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Hastes / m² / ano</label>
              <input
                type="number"
                value={hastesPorMetroAno}
                onChange={(e) => setHastesPorMetroAno(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Hastes Classe A1 (%)</label>
              <input
                type="number"
                value={proporcaoClasseA1Pct}
                onChange={(e) => setProporcaoClasseA1Pct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Preço Haste A1 (R$)</label>
              <input
                type="number"
                step="0.1"
                value={precoHasteA1Reais}
                onChange={(e) => setPrecoHasteA1Reais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#66736A] block">Volume Extra A1 Produzido:</span>
              <span className="text-base font-bold text-rose-400">
                {metricas.hastesA1.toLocaleString('pt-BR')} hastes nobres
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#66736A] block">Lucro Líquido Anual Projetado:</span>
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
