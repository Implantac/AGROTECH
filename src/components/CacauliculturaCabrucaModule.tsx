import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  TreeDeciduous,
  ShieldCheck,
  TrendingUp,
  Coins,
  Layers,
  Award,
  Thermometer,
  Sun,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ParcelaCacau {
  id: string;
  nome: string;
  variedadeClone: string;
  sistema: 'CABRUCA_AGROFLORESTAL' | 'PLENO_SOL_IRRIGADO';
  areaHa: number;
  anoPlantio: number;
  produtividadeKgHa: number; // amêndoas secas kg/ha
  percentualFermentacaoPct: number; // teste de corte > 75%
  temperaturaMaximaPicoCocho: number; // °C
  statusSanitario: 'CONTROLADO' | 'ATENCAO_VASSOURA';
}

export const CacauliculturaCabrucaModule: React.FC = () => {
  const [parcelas, setParcelas] = useState<ParcelaCacau[]>([
    {
      id: 'CAC-01',
      nome: 'Gleba Rio de Contas (Cabruca Centenária)',
      variedadeClone: 'CCN-51 x Trinitário Selecionado',
      sistema: 'CABRUCA_AGROFLORESTAL',
      areaHa: 28,
      anoPlantio: 2016,
      produtividadeKgHa: 1250,
      percentualFermentacaoPct: 84.0,
      temperaturaMaximaPicoCocho: 49.2,
      statusSanitario: 'CONTROLADO',
    },
    {
      id: 'CAC-02',
      nome: 'Gleba Mata Atlântica Sul (SAF Sombras Nobres)',
      variedadeClone: 'IPH-01 (Cacau Fino Gourmet)',
      sistema: 'CABRUCA_AGROFLORESTAL',
      areaHa: 22,
      anoPlantio: 2018,
      produtividadeKgHa: 1100,
      percentualFermentacaoPct: 88.5,
      temperaturaMaximaPicoCocho: 50.1,
      statusSanitario: 'CONTROLADO',
    },
    {
      id: 'CAC-03',
      nome: 'Gleba Encosta Norte',
      variedadeClone: 'CEPEC 2002 (Resistente Vassoura)',
      sistema: 'PLENO_SOL_IRRIGADO',
      areaHa: 18,
      anoPlantio: 2020,
      produtividadeKgHa: 1450,
      percentualFermentacaoPct: 76.0,
      temperaturaMaximaPicoCocho: 47.8,
      statusSanitario: 'CONTROLADO',
    },
  ]);

  const [precoCommodityKgReais, setPrecoCommodityKgReais] = useState<number>(38.50); // Cotação base R$/kg amêndoa seca
  const [agioCacauFinoPct, setAgioCacauFinoPct] = useState<number>(35.0); // +35% de prêmio bean-to-bar
  const [custoManejoCabrucaHa, setCustoManejoCabrucaHa] = useState<number>(5800); // R$/ha podas, barcaças e colheita

  // Cálculos Consolidados de Produção e Qualidade
  const cacauMetrics = useMemo(() => {
    const areaTotalHa = parcelas.reduce((acc, p) => acc + p.areaHa, 0);

    let producaoTotalKg = 0;
    let somaPonderadaFermentacao = 0;

    parcelas.forEach((p) => {
      const kgParcela = p.produtividadeKgHa * p.areaHa;
      producaoTotalKg += kgParcela;
      somaPonderadaFermentacao += p.percentualFermentacaoPct * kgParcela;
    });

    const fermentacaoMediaPct = producaoTotalKg > 0 ? somaPonderadaFermentacao / producaoTotalKg : 0;
    const produtividadeMediaKgHa = areaTotalHa > 0 ? producaoTotalKg / areaTotalHa : 0;

    const precoFinoKgReais = precoCommodityKgReais * (1 + agioCacauFinoPct / 100);
    const faturamentoBrutoReais = producaoTotalKg * precoFinoKgReais;
    const faturamentoPorHaReais = areaTotalHa > 0 ? faturamentoBrutoReais / areaTotalHa : 0;

    const custoTotalManejoReais = areaTotalHa * custoManejoCabrucaHa;
    const margemLiquidaReais = faturamentoBrutoReais - custoTotalManejoReais;

    const isQualidadeFinoAroma = fermentacaoMediaPct >= 75.0;

    return {
      areaTotalHa,
      producaoTotalKg,
      produtividadeMediaKgHa,
      fermentacaoMediaPct,
      precoFinoKgReais,
      faturamentoBrutoReais,
      faturamentoPorHaReais,
      custoTotalManejoReais,
      margemLiquidaReais,
      isQualidadeFinoAroma,
    };
  }, [parcelas, precoCommodityKgReais, agioCacauFinoPct, custoManejoCabrucaHa]);

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <TreeDeciduous className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Cacaulicultura de Precisão & Sistema Cabruca
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                    Theobroma cacao • Cacau Fino Bean-to-Bar • IG Sul da Bahia
                  </span>
                </h2>
                <p className="text-sm text-slate-400">
                  Agroflorestas conservacionistas de cacau sob sombra nativa, curvas térmicas de fermentação e agregação de valor sensorial.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              {cacauMetrics.fermentacaoMediaPct.toFixed(1)}% Fermentação (Cacau Fino & Gourmet)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Produtividade */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Produtividade Média</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            {cacauMetrics.produtividadeMediaKgHa.toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-400">kg/ha seco</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Produção de {(cacauMetrics.producaoTotalKg / 1000).toFixed(1)} ton em {cacauMetrics.areaTotalHa} ha agroflorestais.
          </p>
        </div>

        {/* KPI 2: Preço com Ágio Gourmet */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Preço Especial Bean-to-Bar</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            R$ {cacauMetrics.precoFinoKgReais.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">/ kg (+{agioCacauFinoPct}%)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Preço commodity base: R$ {precoCommodityKgReais.toFixed(2)}/kg.
          </p>
        </div>

        {/* KPI 3: Faturamento Bruto */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Faturamento da Safra</span>
            <Coins className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-yellow-400">
            R$ {cacauMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Receita média: R$ {cacauMetrics.faturamentoPorHaReais.toFixed(0)}/ha.
          </p>
        </div>

        {/* KPI 4: Margem Líquida */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Resultado Operacional</span>
            <Award className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            R$ {cacauMetrics.margemLiquidaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-emerald-400">/ safra</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Custo manejo agroflorestal: R$ {cacauMetrics.custoTotalManejoReais.toLocaleString('pt-BR')}.
          </p>
        </div>
      </div>

      {/* Grid de Parcelas e Manejo de Barcaças */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Parcelas de Cacaueiros */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Glebas Cabruca & Fermentação em Cochos
              </h3>
              <p className="text-xs text-slate-400">
                Pico térmico da fermentação aeróbica e teste de corte de amêndoas na secagem em barcaça.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {parcelas.length} Glebas Cadastradas
            </span>
          </div>

          <div className="space-y-3">
            {parcelas.map((p) => {
              const kgGleba = p.produtividadeKgHa * p.areaHa;
              const faturamentoGleba = kgGleba * cacauMetrics.precoFinoKgReais;

              return (
                <div
                  key={p.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                        {p.id}
                      </span>
                      <h4 className="text-xs font-bold text-white">{p.nome}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">({p.variedadeClone})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                      {p.sistema.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-400">
                    <span>Área: <strong className="text-white">{p.areaHa} ha</strong></span>
                    <span>Fermentação: <strong className="text-emerald-400">{p.percentualFermentacaoPct}%</strong></span>
                    <span>Pico Cocho: <strong className="text-amber-400">{p.temperaturaMaximaPicoCocho}°C</strong></span>
                    <span>Produção: <strong className="text-white">{kgGleba.toLocaleString('pt-BR')} kg</strong></span>
                    <span>Faturamento: <strong className="text-yellow-400">R$ {faturamentoGleba.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Técnico de Boas Práticas Cacaueiras */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes de Pós-Colheita de Cacau Fino (CEPLAC & CIC):
            </div>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li>
                <strong>Cochos de Madeira com Revolvimentos:</strong> A fermentação dura de 6 a 7 dias em cochos de madeira furados, revolvendo as amêndoas a cada 24 horas para oxigenação das bactérias acéticas.
              </li>
              <li>
                <strong>Pico de Temperatura (48°C a 50°C):</strong> Essencial para matar o embrião e iniciar a formação dos precursores aromáticos de chocolate e notas frutadas.
              </li>
              <li>
                <strong>Secagem em Barcaças com Teto Móvel:</strong> A perda lenta de umidade até 7% em barcaças solares tradicionais preserva o sabor e impede a proliferação de fungos e acidez excessiva.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Comerciais */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Parâmetros Comerciais & Ágio
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Preço Base da Amêndoa de Cacau (R$/kg)</label>
              <input
                type="number"
                step="0.50"
                value={precoCommodityKgReais}
                onChange={(e) => setPrecoCommodityKgReais(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 font-medium">Ágio de Cacau Fino Bean-to-Bar (%)</span>
                <span className="text-emerald-400 font-mono font-bold">+{agioCacauFinoPct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={agioCacauFinoPct}
                onChange={(e) => setAgioCacauFinoPct(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Custo de Manejo Agroflorestal (R$/ha)</label>
              <input
                type="number"
                step="200"
                value={custoManejoCabrucaHa}
                onChange={(e) => setCustoManejoCabrucaHa(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Preço Faturado / kg:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  R$ {cacauMetrics.precoFinoKgReais.toFixed(2)} / kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Faturamento da Safra:</span>
                <span className="text-amber-400 font-mono font-bold">
                  R$ {cacauMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                <span className="text-white">Lucro Líquido Cabruca:</span>
                <span className="text-emerald-400 font-mono">
                  R$ {cacauMetrics.margemLiquidaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / safra
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
