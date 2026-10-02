import React, { useState, useMemo } from 'react';
import {
  Apple,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Coins,
  Layers,
  Award,
  Droplet,
  CloudRain,
  AlertTriangle,
  CheckCircle2,
  PackageCheck,
  Boxes
} from 'lucide-react';

interface LoteHF {
  id: string;
  cultura: string;
  variedade: string;
  areaHa: number;
  dataPlantio: string;
  produtividadeTonHa: number;
  pctCat1: number; // % Categoria Especial / Extra
  pctCat2: number; // % Comercial padrão
  pctRefugo: number;
  horasMolhamentoFoliar: number;
  riscoRequeima: 'BAIXO' | 'MODERADO' | 'ALERTA_CRITICO';
}

export const OlericulturaHFModule: React.FC = () => {
  const [lotes, setLotes] = useState<LoteHF[]>([
    {
      id: 'HF-01',
      cultura: 'Tomate de Mesa Indeterminado',
      variedade: 'Pizzadoro / Saladete F1',
      areaHa: 18,
      dataPlantio: '15/07/2026',
      produtividadeTonHa: 92.0,
      pctCat1: 84.0,
      pctCat2: 13.0,
      pctRefugo: 3.0,
      horasMolhamentoFoliar: 7.2,
      riscoRequeima: 'MODERADO',
    },
    {
      id: 'HF-02',
      cultura: 'Batata Consumo Especial',
      variedade: 'Agata (Lavada)',
      areaHa: 15,
      dataPlantio: '01/08/2026',
      produtividadeTonHa: 48.5,
      pctCat1: 81.0,
      pctCat2: 16.0,
      pctRefugo: 3.0,
      horasMolhamentoFoliar: 4.1,
      riscoRequeima: 'BAIXO',
    },
    {
      id: 'HF-03',
      cultura: 'Cebola Roxa de Precisão',
      variedade: 'Baia Periforme Híbrida',
      areaHa: 12,
      dataPlantio: '20/06/2026',
      produtividadeTonHa: 65.0,
      pctCat1: 80.0,
      pctCat2: 17.0,
      pctRefugo: 3.0,
      horasMolhamentoFoliar: 9.8,
      riscoRequeima: 'ALERTA_CRITICO',
    },
  ]);

  // Parâmetros Comerciais e Custo de Manejo HF
  const [precoCaixaCat1Reais, setPrecoCaixaCat1Reais] = useState<number>(75.0); // Cx 20kg
  const [precoCaixaCat2Reais, setPrecoCaixaCat2Reais] = useState<number>(48.0);
  const [precoCaixaRefugoReais, setPrecoCaixaRefugoReais] = useState<number>(18.0);
  const [custoOperacionalPorHa, setCustoOperacionalPorHa] = useState<number>(138000.0); // Custo alto intensivo HF

  // Cálculos Consolidados HF
  const hfMetrics = useMemo(() => {
    const areaTotalHa = lotes.reduce((acc, l) => acc + l.areaHa, 0);

    let producaoTotalTon = 0;
    let totalCaixasCat1 = 0;
    let totalCaixasCat2 = 0;
    let totalCaixasRefugo = 0;

    lotes.forEach((l) => {
      const loteTon = l.produtividadeTonHa * l.areaHa;
      producaoTotalTon += loteTon;

      const caixasTotaisLote = (loteTon * 1000) / 20; // 20 kg por caixa padrão CEAGESP
      totalCaixasCat1 += caixasTotaisLote * (l.pctCat1 / 100);
      totalCaixasCat2 += caixasTotaisLote * (l.pctCat2 / 100);
      totalCaixasRefugo += caixasTotaisLote * (l.pctRefugo / 100);
    });

    const caixasTotaisGeral = totalCaixasCat1 + totalCaixasCat2 + totalCaixasRefugo;
    const receitaCat1 = totalCaixasCat1 * precoCaixaCat1Reais;
    const receitaCat2 = totalCaixasCat2 * precoCaixaCat2Reais;
    const receitaRefugo = totalCaixasRefugo * precoCaixaRefugoReais;

    const faturamentoBrutoReais = receitaCat1 + receitaCat2 + receitaRefugo;
    const faturamentoPorHaReais = areaTotalHa > 0 ? faturamentoBrutoReais / areaTotalHa : 0;
    const custoTotalReais = areaTotalHa * custoOperacionalPorHa;
    const margemLiquidaReais = faturamentoBrutoReais - custoTotalReais;
    const margemLiquidaPorHaReais = areaTotalHa > 0 ? margemLiquidaReais / areaTotalHa : 0;

    const pctCat1Ponderada = caixasTotaisGeral > 0 ? (totalCaixasCat1 / caixasTotaisGeral) * 100 : 0;

    return {
      areaTotalHa,
      producaoTotalTon,
      caixasTotaisGeral,
      totalCaixasCat1,
      totalCaixasCat2,
      totalCaixasRefugo,
      faturamentoBrutoReais,
      faturamentoPorHaReais,
      custoTotalReais,
      margemLiquidaReais,
      margemLiquidaPorHaReais,
      pctCat1Ponderada,
    };
  }, [lotes, precoCaixaCat1Reais, precoCaixaCat2Reais, precoCaixaRefugoReais, custoOperacionalPorHa]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400">
                <Apple className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Olericultura de Precisão & Hortifrúti (HF 4.0)
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono border border-red-500/30">
                    Tomate • Batata • Cebola • Gotejamento Subterrâneo
                  </span>
                </h2>
                <p className="text-sm text-[#66736A]">
                  Fertirrigação diária por pulso, alerta precoce de Requeima (horas de molhamento) e classificação de calibre comercial.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4" />
              {hfMetrics.pctCat1Ponderada.toFixed(1)}% Categoria Especial / Extra
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Produção Total */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Produção Total HF</span>
            <Boxes className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-red-400">
            {hfMetrics.producaoTotalTon.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-[#66736A]">ton</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {Math.round(hfMetrics.caixasTotaisGeral).toLocaleString('pt-BR')} caixas de 20 kg colhidas.
          </p>
        </div>

        {/* KPI 2: Faturamento Total */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Faturamento Bruto HF</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            R$ {hfMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Média de R$ {hfMetrics.faturamentoPorHaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / ha.
          </p>
        </div>

        {/* KPI 3: Margem Líquida */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Margem Líquida</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            R$ {hfMetrics.margemLiquidaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Retorno líquido: R$ {hfMetrics.margemLiquidaPorHaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / ha.
          </p>
        </div>

        {/* KPI 4: Qualidade Comercial */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Caixas Cat 1 (Especial)</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            {Math.round(hfMetrics.totalCaixasCat1).toLocaleString('pt-BR')}{' '}
            <span className="text-xs font-normal text-[#66736A]">cx</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Preço de ponta: R$ {precoCaixaCat1Reais.toFixed(2)} por caixa.
          </p>
        </div>
      </div>

      {/* Grid de Lotes e Painel de Mercado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Lotes de Olericultura */}
        <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-red-400" />
                Talhões de Hortifrúti & Sanidade Fitossanitária
              </h3>
              <p className="text-xs text-[#66736A]">
                Monitoramento de horas de molhamento foliar para prevenção de Requeima e Pinta Preta.
              </p>
            </div>
            <span className="text-xs font-mono text-[#66736A]">
              {lotes.length} Talhões em Manejo
            </span>
          </div>

          <div className="space-y-3">
            {lotes.map((l) => {
              const loteTon = l.produtividadeTonHa * l.areaHa;
              const caixas = (loteTon * 1000) / 20;
              const faturamentoLote =
                caixas * (l.pctCat1 / 100) * precoCaixaCat1Reais +
                caixas * (l.pctCat2 / 100) * precoCaixaCat2Reais +
                caixas * (l.pctRefugo / 100) * precoCaixaRefugoReais;

              return (
                <div
                  key={l.id}
                  className="p-4 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-xs font-bold border border-red-500/30">
                        {l.id}
                      </span>
                      <h4 className="text-xs font-bold text-white">{l.cultura}</h4>
                      <span className="text-[11px] text-[#66736A] font-mono">({l.variedade})</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        l.riscoRequeima === 'BAIXO'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : l.riscoRequeima === 'MODERADO'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      Molhamento: {l.horasMolhamentoFoliar}h • Risco {l.riscoRequeima}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-[#66736A]">
                    <span>Área: <strong className="text-white">{l.areaHa} ha</strong></span>
                    <span>Produtividade: <strong className="text-red-400">{l.produtividadeTonHa} ton/ha</strong> ({loteTon.toFixed(0)} t)</span>
                    <span>Cat 1: <strong className="text-emerald-400">{l.pctCat1}%</strong></span>
                    <span>Caixas 20kg: <strong className="text-cyan-400">{caixas.toLocaleString('pt-BR')}</strong></span>
                    <span>Faturamento: <strong className="text-amber-400">R$ {faturamentoLote.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diretrizes Técnicas de HF de Precisão */}
          <div className="p-4 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-red-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes Agronômicas de Olericultura de Alta Performance:
            </div>
            <ul className="list-disc list-inside text-[#66736A] space-y-1">
              <li>
                <strong>Fertirrigação Balanceada:</strong> Fornecimento fracionado diário de Nitrato de Cálcio e Sulfato de Potássio para manter sólidos solúveis (°Brix), parede celular espessa e ausência de podridão apical.
              </li>
              <li>
                <strong>Alerta Precoce de Requeima (*Phytophthora*):</strong> Períodos com umidade relativa &gt; 90% e temperatura entre 18°C e 24°C com molhamento foliar acima de 6 horas exigem aplicação preventiva com fungicidas sítio-específicos.
              </li>
              <li>
                <strong>Padrão Packing House:</strong> Lavagem com água clorada (100 ppm), secagem por ventilação forçada e classificação eletrônica por diâmetro e coloração.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Comerciais */}
        <div className="bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Cotações de Mercado & Custos HF
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#66736A] font-medium block mb-1">Preço Caixa 20kg - Categoria Especial (R$)</label>
              <input
                type="number"
                step="1.00"
                value={precoCaixaCat1Reais}
                onChange={(e) => setPrecoCaixaCat1Reais(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#66736A] font-medium block mb-1">Preço Caixa 20kg - Categoria 2 (R$)</label>
              <input
                type="number"
                step="1.00"
                value={precoCaixaCat2Reais}
                onChange={(e) => setPrecoCaixaCat2Reais(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#66736A] font-medium block mb-1">Preço Caixa 20kg - Refugo Industrial (R$)</label>
              <input
                type="number"
                step="1.00"
                value={precoCaixaRefugoReais}
                onChange={(e) => setPrecoCaixaRefugoReais(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#66736A] font-medium block mb-1">Custo Total de Produção & Embalagem (R$/ha)</label>
              <input
                type="number"
                step="1000"
                value={custoOperacionalPorHa}
                onChange={(e) => setCustoOperacionalPorHa(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-[#EAF4E7] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#66736A]">Faturamento da Safra:</span>
                <span className="text-amber-400 font-mono font-bold">
                  R$ {hfMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736A]">Custo Total da Área:</span>
                <span className="text-rose-400 font-mono font-bold">
                  -R$ {hfMetrics.custoTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#EAF4E7] pt-2 font-bold">
                <span className="text-white">Lucro Líquido HF:</span>
                <span className="text-emerald-400 font-mono">
                  R$ {hfMetrics.margemLiquidaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
