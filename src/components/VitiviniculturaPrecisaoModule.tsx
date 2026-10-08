import React, { useState, useMemo } from 'react';
import {
  Grape,
  Sparkles,
  TrendingUp,
  Thermometer,
  Award,
  CheckCircle2,
  Clock,
  Layers,
  Wine,
  ShieldCheck,
  Coins
} from 'lucide-react';

interface ParcelaVinhedo {
  id: string;
  cultivar: string;
  tipoVinho: 'TINTO_FINO' | 'BRANCO_FINO' | 'ESPUMANTE' | 'UVA_MESA';
  areaHa: number;
  anoPlantio: number;
  grauBrix: number;
  acidezGL: number; // g/L ácido tartárico
  phMosto: number;
  produtividadeTonHa: number;
  statusMaturacao: 'EM_MATURACAO' | 'PONTO_OTIMO_COLHEITA' | 'SOBREMATURACAO';
}

export const VitiviniculturaPrecisaoModule: React.FC = () => {
  const [parcelas, setParcelas] = useState<ParcelaVinhedo[]>([
    {
      id: 'VIN-01',
      cultivar: 'Cabernet Sauvignon (Clone 169 / Paulsen 1103)',
      tipoVinho: 'TINTO_FINO',
      areaHa: 8.5,
      anoPlantio: 2018,
      grauBrix: 23.2,
      acidezGL: 5.6,
      phMosto: 3.42,
      produtividadeTonHa: 13.0,
      statusMaturacao: 'PONTO_OTIMO_COLHEITA',
    },
    {
      id: 'VIN-02',
      cultivar: 'Syrah (Seleção Massal / Riparia do Traviú)',
      tipoVinho: 'TINTO_FINO',
      areaHa: 6.0,
      anoPlantio: 2019,
      grauBrix: 22.8,
      acidezGL: 5.8,
      phMosto: 3.38,
      produtividadeTonHa: 14.5,
      statusMaturacao: 'PONTO_OTIMO_COLHEITA',
    },
    {
      id: 'VIN-03',
      cultivar: 'Chardonnay (Clone 76 / SO4)',
      tipoVinho: 'BRANCO_FINO',
      areaHa: 5.5,
      anoPlantio: 2020,
      grauBrix: 21.0,
      acidezGL: 6.8,
      phMosto: 3.25,
      produtividadeTonHa: 11.5,
      statusMaturacao: 'EM_MATURACAO',
    },
  ]);

  const [indiceHuglinAtual, setIndiceHuglinAtual] = useState<number>(2380); // Índice Heliotérmico de Huglin (IH)
  const [precoUvaKgReais, setPrecoUvaKgReais] = useState<number>(4.80); // R$ 4,80 por kg de uva fina para vinificação
  const [custoManejoCanopiaPorHa, setCustoManejoCanopiaPorHa] = useState<number>(6500); // R$/ha poda verde, desfolha e fitossanidade

  // Cálculos Técnicos Vitícolas
  const vitiMetrics = useMemo(() => {
    const areaTotalHa = parcelas.reduce((acc, p) => acc + p.areaHa, 0);

    let producaoTotalKg = 0;
    let somaPonderadaBrix = 0;
    let somaPonderadaAcidez = 0;

    parcelas.forEach((p) => {
      const prodKg = p.produtividadeTonHa * 1000 * p.areaHa;
      producaoTotalKg += prodKg;
      somaPonderadaBrix += p.grauBrix * prodKg;
      somaPonderadaAcidez += p.acidezGL * prodKg;
    });

    const brixMedio = producaoTotalKg > 0 ? somaPonderadaBrix / producaoTotalKg : 0;
    const acidezMedia = producaoTotalKg > 0 ? somaPonderadaAcidez / producaoTotalKg : 0;
    const indiceMaturacaoGeral = acidezMedia > 0 ? brixMedio / (acidezMedia / 10) : 0;

    // Faturamento e Margem
    const faturamentoBrutoReais = producaoTotalKg * precoUvaKgReais;
    const custoCanopiaTotalReais = areaTotalHa * custoManejoCanopiaPorHa;
    const margemLiquidaReais = faturamentoBrutoReais - custoCanopiaTotalReais;
    const margemPorHaReais = areaTotalHa > 0 ? margemLiquidaReais / areaTotalHa : 0;

    // Potencial em garrafas de 750ml (rendimento de 68% de mosto em prensa pneumática)
    const garrafasVinho750ml = Math.round((producaoTotalKg * 0.68) / 0.75);

    return {
      areaTotalHa,
      producaoTotalKg,
      brixMedio,
      acidezMedia,
      indiceMaturacaoGeral,
      faturamentoBrutoReais,
      custoCanopiaTotalReais,
      margemLiquidaReais,
      margemPorHaReais,
      garrafasVinho750ml,
    };
  }, [parcelas, precoUvaKgReais, custoManejoCanopiaPorHa]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-700">
                <Wine className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Vitivinicultura de Precisão & Enologia
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-800 font-mono border border-purple-500/30">
                    °Brix • Huglin • Canópia • Vitis vinifera
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Rastreabilidade de parcelas de vinhedo, acidez titulável, pH do mosto e determinação fenólica da colheita nobre.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-purple-500/20 text-purple-800 border-purple-500/40 flex items-center gap-1.5">
              <Grape className="w-4 h-4" />
              Brix Médio Geral: {vitiMetrics.brixMedio.toFixed(1)} °Brix
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Maturação Industrial */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Índice de Maturação</span>
            <Thermometer className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-purple-700">
            {vitiMetrics.indiceMaturacaoGeral.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-600">Brix/Acidez</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Acidez média: {vitiMetrics.acidezMedia.toFixed(2)} g/L ácido tartárico.
          </p>
        </div>

        {/* KPI 2: Potencial Vinícola */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Potencial Enológico</span>
            <Wine className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-pink-400">
            {vitiMetrics.garrafasVinho750ml.toLocaleString('pt-BR')}{' '}
            <span className="text-xs font-normal text-slate-600">garrafas (750ml)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Produção de {(vitiMetrics.producaoTotalKg / 1000).toFixed(1)} ton de uva em {vitiMetrics.areaTotalHa} ha.
          </p>
        </div>

        {/* KPI 3: Faturamento Bruto */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Faturamento da Safra</span>
            <Coins className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-700">
            R$ {vitiMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Cotação: R$ {precoUvaKgReais.toFixed(2)}/kg de uva vinífera.
          </p>
        </div>

        {/* KPI 4: Margem Líquida */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Margem Operacional</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-700">
            R$ {vitiMetrics.margemLiquidaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-slate-600">/ safra</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Retorno de R$ {vitiMetrics.margemPorHaReais.toFixed(0)}/ha no vinhedo.
          </p>
        </div>
      </div>

      {/* Grid de Parcelas e Manejo de Vinhedo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Parcelas de Vinhedo */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-700" />
                Parcelas do Vinhedo & Análise Tecnológica
              </h3>
              <p className="text-xs text-slate-600">
                Acompanhamento semanal de curvas de maturação para determinação da vindima.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              {parcelas.length} Parcelas Mapeadas
            </span>
          </div>

          <div className="space-y-3">
            {parcelas.map((p) => {
              const prodKg = p.produtividadeTonHa * 1000 * p.areaHa;
              const faturamentoParcela = prodKg * precoUvaKgReais;
              const im = p.acidezGL > 0 ? (p.grauBrix / (p.acidezGL / 10)).toFixed(1) : '0';

              return (
                <div
                  key={p.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-800 font-mono text-xs font-bold border border-purple-500/30">
                        {p.id}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{p.cultivar}</h4>
                      <span className="text-[11px] text-slate-600 font-mono">({p.anoPlantio})</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        p.statusMaturacao === 'PONTO_OTIMO_COLHEITA'
                          ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-800 border-amber-500/30'
                      }`}
                    >
                      {p.statusMaturacao.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-600">
                    <span>Área: <strong className="text-white">{p.areaHa} ha</strong></span>
                    <span>°Brix: <strong className="text-purple-700">{p.grauBrix}°</strong></span>
                    <span>Acidez: <strong className="text-pink-400">{p.acidezGL} g/L</strong> (pH {p.phMosto})</span>
                    <span>Índice Mat: <strong className="text-sky-700">{im}</strong></span>
                    <span>Faturamento: <strong className="text-amber-700">R$ {faturamentoParcela.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Técnico Enológico */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-purple-700 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes Técnicas de Enologia & Canópia (Embrapa Uva e Vinho):
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>
                <strong>Poda Verde & Aeração:</strong> A desfolha seletiva na zona dos cachos reduz em até 70% a incidência de Botrytis cinerea (podridão cinzenta) e favorece o acúmulo de antocianinas.
              </li>
              <li>
                <strong>Índice Heliotérmico de Huglin (IH):</strong> Varia de 2.100 a 2.400 em regiões vitícolas de clima temperado a subtropical, ditando a tipicidade aromática dos terpenos e pirazinas.
              </li>
              <li>
                <strong>Equilíbrio Brix/Acidez:</strong> Para espumantes finos, busca-se colheita precoce (18-19 °Brix e acidez 8-9 g/L); para tintos de guarda, busca-se maturação fenólica completa (&gt; 23 °Brix e pH 3.4-3.6).
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Bioclimáticos e Custos */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-purple-700" />
            Parâmetros Bioclimáticos & Mercado
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Índice Heliotérmico de Huglin (IH)</span>
                <span className="text-purple-700 font-mono font-bold">{indiceHuglinAtual} IH</span>
              </div>
              <input
                type="number"
                value={indiceHuglinAtual}
                onChange={(e) => setIndiceHuglinAtual(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Preço da Uva Vinífera (R$/kg)</label>
              <input
                type="number"
                step="0.10"
                value={precoUvaKgReais}
                onChange={(e) => setPrecoUvaKgReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Custo de Manejo de Canópia (R$/ha)</label>
              <input
                type="number"
                step="500"
                value={custoManejoCanopiaPorHa}
                onChange={(e) => setCustoManejoCanopiaPorHa(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Receita da Vindima:</span>
                <span className="text-amber-700 font-mono font-bold">
                  R$ {vitiMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Custo Total de Canópia:</span>
                <span className="text-rose-700 font-mono font-bold">
                  -R$ {vitiMetrics.custoCanopiaTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-white">Lucro Operacional:</span>
                <span className="text-emerald-700 font-mono">
                  R$ {vitiMetrics.margemLiquidaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
