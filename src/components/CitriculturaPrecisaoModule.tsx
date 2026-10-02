import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Coins,
  Layers,
  Bug,
  Award,
  Factory,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface PomarCitros {
  id: string;
  variedade: string;
  portaEnxerto: string;
  areaHa: number;
  anoPlantio: number;
  arvoresPorHa: number;
  caixasPorArvore: number; // cx 40.8 kg
  grauBrix: number;
  acidezCitricaPct: number;
  taxaGreeningHlbPct: number; // % incidência de HLB
  capturaPsilideoArmadilhaSemana: number; // Diaphorina citri
}

export const CitriculturaPrecisaoModule: React.FC = () => {
  const [pomares, setPomares] = useState<PomarCitros[]>([
    {
      id: 'POM-01',
      variedade: 'Laranja Pera Rio (Safra Principal)',
      portaEnxerto: 'Citrumelo Swingle',
      areaHa: 45,
      anoPlantio: 2017,
      arvoresPorHa: 420,
      caixasPorArvore: 2.4,
      grauBrix: 12.6,
      acidezCitricaPct: 0.91,
      taxaGreeningHlbPct: 1.4,
      capturaPsilideoArmadilhaSemana: 0.4,
    },
    {
      id: 'POM-02',
      variedade: 'Valencia Tardia (Exportação)',
      portaEnxerto: 'Limão Cravo',
      areaHa: 30,
      anoPlantio: 2018,
      arvoresPorHa: 400,
      caixasPorArvore: 2.1,
      grauBrix: 13.2,
      acidezCitricaPct: 0.98,
      taxaGreeningHlbPct: 1.9,
      capturaPsilideoArmadilhaSemana: 0.8,
    },
    {
      id: 'POM-03',
      variedade: 'Hamlin Precoce (Suco NFC)',
      portaEnxerto: 'Trifoliata',
      areaHa: 25,
      anoPlantio: 2020,
      arvoresPorHa: 450,
      caixasPorArvore: 1.8,
      grauBrix: 11.8,
      acidezCitricaPct: 0.85,
      taxaGreeningHlbPct: 0.8,
      capturaPsilideoArmadilhaSemana: 0.2,
    },
  ]);

  const [precoCaixaIndustriaReais, setPrecoCaixaIndustriaReais] = useState<number>(48.50); // R$/caixa 40.8kg posta fábrica
  const [custoManejoFitossanitarioHa, setCustoManejoFitossanitarioHa] = useState<number>(7200); // R$/ha controle psilídeo, cancro e nutrição

  // Cálculos Técnicos do Pomar
  const citrosMetrics = useMemo(() => {
    const areaTotalHa = pomares.reduce((acc, p) => acc + p.areaHa, 0);

    let producaoTotalCaixas = 0;
    let totalArvoresPomar = 0;
    let arvoresErradicadasHLB = 0;
    let somaPonderadaBrix = 0;
    let somaPonderadaAcidez = 0;

    pomares.forEach((p) => {
      const arvoresTalhao = p.arvoresPorHa * p.areaHa;
      const caixasTalhao = arvoresTalhao * p.caixasPorArvore;
      const erradicadas = Math.round(arvoresTalhao * (p.taxaGreeningHlbPct / 100));

      totalArvoresPomar += arvoresTalhao;
      producaoTotalCaixas += caixasTalhao;
      arvoresErradicadasHLB += erradicadas;
      somaPonderadaBrix += p.grauBrix * caixasTalhao;
      somaPonderadaAcidez += p.acidezCitricaPct * caixasTalhao;
    });

    const brixMedio = producaoTotalCaixas > 0 ? somaPonderadaBrix / producaoTotalCaixas : 0;
    const acidezMedia = producaoTotalCaixas > 0 ? somaPonderadaAcidez / producaoTotalCaixas : 0;
    const ratioGeral = acidezMedia > 0 ? brixMedio / acidezMedia : 0;
    const produtividadeMediaCxHa = areaTotalHa > 0 ? producaoTotalCaixas / areaTotalHa : 0;

    // Faturamento e Custos
    const faturamentoBrutoReais = producaoTotalCaixas * precoCaixaIndustriaReais;
    const faturamentoPorHaReais = areaTotalHa > 0 ? faturamentoBrutoReais / areaTotalHa : 0;
    const custoTotalFitossanidadeReais = areaTotalHa * custoManejoFitossanitarioHa;
    const margemLiquidaReais = faturamentoBrutoReais - custoTotalFitossanidadeReais;

    const taxaGreeningGeralPct = totalArvoresPomar > 0 ? (arvoresErradicadasHLB / totalArvoresPomar) * 100 : 0;

    return {
      areaTotalHa,
      producaoTotalCaixas,
      totalArvoresPomar,
      arvoresErradicadasHLB,
      brixMedio,
      acidezMedia,
      ratioGeral,
      produtividadeMediaCxHa,
      faturamentoBrutoReais,
      faturamentoPorHaReais,
      custoTotalFitossanidadeReais,
      margemLiquidaReais,
      taxaGreeningGeralPct,
    };
  }, [pomares, precoCaixaIndustriaReais, custoManejoFitossanitarioHa]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Citricultura de Precisão & Sanidade HLB
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-mono border border-orange-500/30">
                    Ratio Industrial • Greening (IN 38) • FCOJ / NFC
                  </span>
                </h2>
                <p className="text-sm text-[#66736A]">
                  Monitoramento de psilídeo (Diaphorina citri), erradicação compulsória de HLB e apuração de rendimento em caixas e sólidos solúveis.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Incidência HLB sob controle ({citrosMetrics.taxaGreeningGeralPct.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Produtividade */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Produtividade Média</span>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-orange-400">
            {citrosMetrics.produtividadeMediaCxHa.toFixed(0)}{' '}
            <span className="text-xs font-normal text-[#66736A]">cx/ha (40.8 kg)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Safra total: {citrosMetrics.producaoTotalCaixas.toLocaleString('pt-BR')} caixas em {citrosMetrics.areaTotalHa} ha.
          </p>
        </div>

        {/* KPI 2: Ratio Industrial */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Ratio Industrial (Brix/Acidez)</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            {citrosMetrics.ratioGeral.toFixed(2)}{' '}
            <span className="text-xs font-normal text-[#66736A]">Ratio</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Brix: {citrosMetrics.brixMedio.toFixed(1)}° • Acidez: {citrosMetrics.acidezMedia.toFixed(2)}% (Padrão Indústria).
          </p>
        </div>

        {/* KPI 3: Faturamento Bruto */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Faturamento da Safra</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            R$ {citrosMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Preço: R$ {precoCaixaIndustriaReais.toFixed(2)}/cx posta indústria.
          </p>
        </div>

        {/* KPI 4: Sanidade HLB & Erradicações */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Erradicações HLB (IN 38)</span>
            <Bug className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-rose-400">
            {citrosMetrics.arvoresErradicadasHLB}{' '}
            <span className="text-xs font-normal text-[#66736A]">árvores ({citrosMetrics.taxaGreeningGeralPct.toFixed(1)}%)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Arranquio imediato para conter avanço do Candidatus Liberibacter.
          </p>
        </div>
      </div>

      {/* Grid de Pomares e Parâmetros Comerciais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Lista de Talhões de Pomar */}
        <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-orange-400" />
                Talhões Citrícolas & Laudo Fitossanitário
              </h3>
              <p className="text-xs text-[#66736A]">
                Inspeção quinzenal de sintomas visuais de greening e monitoramento por armadilhas adesivas amarelas.
              </p>
            </div>
            <span className="text-xs font-mono text-[#66736A]">
              {pomares.length} Talhões em Produção
            </span>
          </div>

          <div className="space-y-3">
            {pomares.map((p) => {
              const caixasTalhao = p.arvoresPorHa * p.areaHa * p.caixasPorArvore;
              const faturamentoTalhao = caixasTalhao * precoCaixaIndustriaReais;
              const ratio = p.acidezCitricaPct > 0 ? (p.grauBrix / p.acidezCitricaPct).toFixed(2) : '0';

              return (
                <div
                  key={p.id}
                  className="p-4 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono text-xs font-bold border border-orange-500/30">
                        {p.id}
                      </span>
                      <h4 className="text-xs font-bold text-white">{p.variedade}</h4>
                      <span className="text-[11px] text-[#66736A] font-mono">({p.portaEnxerto})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                      HLB: {p.taxaGreeningHlbPct}% • Psilídeo: {p.capturaPsilideoArmadilhaSemana}/armadilha
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-[#66736A]">
                    <span>Área: <strong className="text-white">{p.areaHa} ha</strong> ({p.arvoresPorHa} pl/ha)</span>
                    <span>Carga: <strong className="text-orange-400">{p.caixasPorArvore} cx/árvore</strong></span>
                    <span>Ratio: <strong className="text-amber-400">{ratio}</strong> ({p.grauBrix}° Brix)</span>
                    <span>Faturamento: <strong className="text-emerald-400">R$ {faturamentoTalhao.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Técnico de Boas Práticas Citrícolas */}
          <div className="p-4 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-orange-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes de Manejo Integrado de HLB (Fundecitrus & MAPA):
            </div>
            <ul className="list-disc list-inside text-[#66736A] space-y-1">
              <li>
                <strong>Três Pilares do Greening:</strong> 1) Mudas sadias certificadas em viveiro telado; 2) Controle rigoroso do psilídeo vetor; 3) Erradicação imediata e contínua de plantas com sintomas.
              </li>
              <li>
                <strong>Pulverização de Bordadura:</strong> Como 80% dos psilídeos entram pelas divisas, aplicações frequentes nos primeiros 100m de bordadura bloqueiam a colonização de novos insetos infectivos.
              </li>
              <li>
                <strong>Ponto de Colheita Industrial:</strong> O ratio ideal para a indústria processadora situa-se entre 12 e 15, com no mínimo 2.0 kg de sólidos solúveis por caixa de 40.8 kg.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Comerciais */}
        <div className="bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Parâmetros Comerciais & Custos
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#66736A] font-medium block mb-1">Preço da Caixa de Laranja Posta Fábrica (R$)</label>
              <input
                type="number"
                step="0.50"
                value={precoCaixaIndustriaReais}
                onChange={(e) => setPrecoCaixaIndustriaReais(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#66736A] font-medium block mb-1">Custo de Manejo Fitossanitário & Psilídeo (R$/ha)</label>
              <input
                type="number"
                step="500"
                value={custoManejoFitossanitarioHa}
                onChange={(e) => setCustoManejoFitossanitarioHa(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-[#EAF4E7] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#66736A]">Faturamento da Safra:</span>
                <span className="text-amber-400 font-mono font-bold">
                  R$ {citrosMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736A]">Custo Total de Manejo:</span>
                <span className="text-rose-400 font-mono font-bold">
                  -R$ {citrosMetrics.custoTotalFitossanidadeReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#EAF4E7] pt-2 font-bold">
                <span className="text-white">Margem Líquida do Pomar:</span>
                <span className="text-emerald-400 font-mono">
                  R$ {citrosMetrics.margemLiquidaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / safra
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
