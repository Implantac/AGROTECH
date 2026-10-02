import React, { useState, useMemo } from 'react';
import {
  Trees,
  TrendingUp,
  Droplets,
  Coins,
  ShieldCheck,
  Sparkles,
  Layers,
  FlaskConical,
  Award,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface SeringalLote {
  id: string;
  clone: string;
  areaHa: number;
  arvoresPorHa: number;
  anoPlantio: number;
  sistemaSangria: string;
  coaguloCampoKgHaAno: number;
  drcPct: number; // Teor de Borracha Seca %
}

export const HeveiculturaBorrachaModule: React.FC = () => {
  const [lotes, setLotes] = useState<SeringalLote[]>([
    {
      id: 'LOTE-HEVEA-01',
      clone: 'RRIM 600 (Alta Produtividade)',
      areaHa: 65,
      arvoresPorHa: 500,
      anoPlantio: 2017,
      sistemaSangria: 'd/3 1/2S (Sangria a cada 3 dias, 1/2 espiral)',
      coaguloCampoKgHaAno: 3100,
      drcPct: 54.0,
    },
    {
      id: 'LOTE-HEVEA-02',
      clone: 'PB 260 (Excelente Vigor & DRC Elevado)',
      areaHa: 45,
      arvoresPorHa: 480,
      anoPlantio: 2016,
      sistemaSangria: 'd/3 1/2S + Ethephon 2.5% mensal',
      coaguloCampoKgHaAno: 2850,
      drcPct: 56.5,
    },
    {
      id: 'LOTE-HEVEA-03',
      clone: 'FX 3864 (Resistente ao Mal-das-Folhas)',
      areaHa: 30,
      arvoresPorHa: 520,
      anoPlantio: 2019,
      sistemaSangria: 'd/4 1/2S (Início de painel)',
      coaguloCampoKgHaAno: 2100,
      drcPct: 51.0,
    },
  ]);

  const [precoBorrachaSecaReaisKg, setPrecoBorrachaSecaReaisKg] = useState<number>(11.80); // R$/kg DRC GEB-10
  const [custoMaoObraSangriaPorKg, setCustoMaoObraSangriaPorKg] = useState<number>(3.80); // Custo do sangrador por kg de borracha

  // Métricas Consolidadas do Seringal
  const heveaMetrics = useMemo(() => {
    const areaTotalHa = lotes.reduce((acc, l) => acc + l.areaHa, 0);

    // Cálculos por lote
    let producaoTotalBorrachaSecaKg = 0;
    let producaoTotalCoaguloKg = 0;

    lotes.forEach((l) => {
      const coaguloLoteKg = l.coaguloCampoKgHaAno * l.areaHa;
      const borrachaSecaLoteKg = coaguloLoteKg * (l.drcPct / 100);
      producaoTotalCoaguloKg += coaguloLoteKg;
      producaoTotalBorrachaSecaKg += borrachaSecaLoteKg;
    });

    const mediaDrcPct = producaoTotalCoaguloKg > 0 ? (producaoTotalBorrachaSecaKg / producaoTotalCoaguloKg) * 100 : 0;
    const produtividadeMediaDrcKgHa = areaTotalHa > 0 ? producaoTotalBorrachaSecaKg / areaTotalHa : 0;

    // Faturamento bruto
    const faturamentoBrutoReais = producaoTotalBorrachaSecaKg * precoBorrachaSecaReaisKg;
    const faturamentoPorHaReais = areaTotalHa > 0 ? faturamentoBrutoReais / areaTotalHa : 0;

    // Custo de sangria e margem líquida
    const custoTotalSangriaReais = producaoTotalBorrachaSecaKg * custoMaoObraSangriaPorKg;
    const margemOperacionalReais = faturamentoBrutoReais - custoTotalSangriaReais;

    return {
      areaTotalHa,
      producaoTotalCoaguloKg,
      producaoTotalBorrachaSecaKg,
      mediaDrcPct,
      produtividadeMediaDrcKgHa,
      faturamentoBrutoReais,
      faturamentoPorHaReais,
      custoTotalSangriaReais,
      margemOperacionalReais,
    };
  }, [lotes, precoBorrachaSecaReaisKg, custoMaoObraSangriaPorKg]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Trees className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Heveicultura de Precisão & Borracha Natural
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                    Hevea brasiliensis • DRC GEB-10 • Sangria
                  </span>
                </h2>
                <p className="text-sm text-[#66736A]">
                  Manejo de painéis de sangria, estimulação ethephon, apuração de DRC e rentabilidade por hectare de seringal.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              DRC Médio do Seringal: {heveaMetrics.mediaDrcPct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Produtividade DRC */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Produtividade DRC</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            {heveaMetrics.produtividadeMediaDrcKgHa.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-[#66736A]">kg DRC/ha/ano</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Borracha seca purificada em {heveaMetrics.areaTotalHa} hectares em produção.
          </p>
        </div>

        {/* KPI 2: Produção Total */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Safra de Borracha Seca</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            {(heveaMetrics.producaoTotalBorrachaSecaKg / 1000).toFixed(1)}{' '}
            <span className="text-xs font-normal text-[#66736A]">ton DRC</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Coágulo de campo total: {(heveaMetrics.producaoTotalCoaguloKg / 1000).toFixed(1)} ton.
          </p>
        </div>

        {/* KPI 3: Faturamento Bruto */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Faturamento Bruto</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            R$ {heveaMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Cotação GEB-10: R$ {precoBorrachaSecaReaisKg.toFixed(2)}/kg DRC.
          </p>
        </div>

        {/* KPI 4: Margem Operacional */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Margem Operacional Líquida</span>
            <Award className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            R$ {heveaMetrics.margemOperacionalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-emerald-400">/ ano</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Retorno líquido: R$ {(heveaMetrics.margemOperacionalReais / heveaMetrics.areaTotalHa).toFixed(0)}/ha.
          </p>
        </div>
      </div>

      {/* Grid de Lotes e Painel de Simulação */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Lotes de Seringal */}
        <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Talhões do Seringal & Manejo de Sangria
              </h3>
              <p className="text-xs text-[#66736A]">
                Clones recomendados, densidade de plantas e sistema de corte de casca.
              </p>
            </div>
            <span className="text-xs font-mono text-[#66736A]">
              {lotes.length} Talhões Cadastrados
            </span>
          </div>

          <div className="space-y-3">
            {lotes.map((l) => {
              const drcKgHa = l.coaguloCampoKgHaAno * (l.drcPct / 100);
              const faturamentoLote = drcKgHa * l.areaHa * precoBorrachaSecaReaisKg;

              return (
                <div
                  key={l.id}
                  className="p-4 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                        {l.id}
                      </span>
                      <h4 className="text-xs font-bold text-white">{l.clone}</h4>
                      <span className="text-[11px] text-[#66736A] font-mono">(Plantio {l.anoPlantio})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                      DRC {l.drcPct.toFixed(1)}%
                    </span>
                  </div>

                  <p className="text-xs text-[#26332A]">
                    <span className="text-slate-500">Sistema:</span> {l.sistemaSangria}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-[#66736A]">
                    <span>Área: <strong className="text-white">{l.areaHa} ha</strong> ({l.arvoresPorHa} árv/ha)</span>
                    <span>Produtividade: <strong className="text-emerald-400">{drcKgHa.toFixed(0)} kg DRC/ha</strong></span>
                    <span>Faturamento: <strong className="text-amber-400">R$ {faturamentoLote.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Técnico de Boas Práticas da Seringueira */}
          <div className="p-4 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes Técnicas de Manejo e Sangria (IAC / EMBRAPA):
            </div>
            <ul className="list-disc list-inside text-[#66736A] space-y-1">
              <li>
                <strong>Consumo de Casca:</strong> O corte deve consumir no máximo 1.5 a 1.8 mm de casca por sangria, garantindo vida útil do painel superior a 6 anos por espiral.
              </li>
              <li>
                <strong>Estimulação com Ethephon:</strong> Aplicar ethephon a 2.5% ou 5.0% no máximo 4 a 6 vezes ao ano para evitar a Secagem do Painel (TPD - Tapping Panel Dryness).
              </li>
              <li>
                <strong>Borracha e Descarbonização:</strong> A seringueira é uma cultura perene que estoca em média 120 a 180 t de biomassa/ha, gerando créditos de reposição florestal e CPRs Verdes.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros de Mercado */}
        <div className="bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Parâmetros Comerciais & Custos
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#66736A] font-medium block mb-1">Preço do kg de Borracha Seca DRC (R$)</label>
              <input
                type="number"
                step="0.10"
                value={precoBorrachaSecaReaisKg}
                onChange={(e) => setPrecoBorrachaSecaReaisKg(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#66736A] font-medium block mb-1">Custo de Mão de Obra Sangrador (R$/kg DRC)</label>
              <input
                type="number"
                step="0.10"
                value={custoMaoObraSangriaPorKg}
                onChange={(e) => setCustoMaoObraSangriaPorKg(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-[#EAF4E7] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#66736A]">Faturamento Bruto:</span>
                <span className="text-amber-400 font-mono font-bold">
                  R$ {heveaMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736A]">Custo Total de Sangria:</span>
                <span className="text-rose-400 font-mono font-bold">
                  -R$ {heveaMetrics.custoTotalSangriaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#EAF4E7] pt-2 font-bold">
                <span className="text-white">Margem Operacional Líquida:</span>
                <span className="text-emerald-400 font-mono">
                  R$ {heveaMetrics.margemOperacionalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / ano
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
