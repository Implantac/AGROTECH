import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Coins,
  Layers,
  Award,
  Scale,
  FlaskConical,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Factory
} from 'lucide-react';

interface LoteMandioca {
  id: string;
  talhao: string;
  variedade: string;
  areaHa: number;
  idadeMeses: number;
  produtividadeTonHa: number;
  pesoAmostraArG: number; // Padrão 5000g
  pesoAmostraAguaG: number; // Gravimetria da balança hidrostática
  incidenciaMandarova: 'BAIXA' | 'MODERADA' | 'CRITICA_BACULOVIRUS';
}

export const MandioculturaAmidoModule: React.FC = () => {
  const [lotes, setLotes] = useState<LoteMandioca[]>([
    {
      id: 'MAN-01',
      talhao: 'Talhão Raízes Sul (Fecularia Especial)',
      variedade: 'BRS Formosa (Indústria)',
      areaHa: 45,
      idadeMeses: 16,
      produtividadeTonHa: 34.2,
      pesoAmostraArG: 5000,
      pesoAmostraAguaG: 1960,
      incidenciaMandarova: 'BAIXA',
    },
    {
      id: 'MAN-02',
      talhao: 'Talhão Chapadão IAC',
      variedade: 'IAC 14 (Alta Matéria Seca)',
      areaHa: 40,
      idadeMeses: 18,
      produtividadeTonHa: 36.0,
      pesoAmostraArG: 5000,
      pesoAmostraAguaG: 1980,
      incidenciaMandarova: 'MODERADA',
    },
    {
      id: 'MAN-03',
      talhao: 'Talhão Baixada Nova',
      variedade: 'Fécula Branca Regional',
      areaHa: 35,
      idadeMeses: 14,
      produtividadeTonHa: 30.5,
      pesoAmostraArG: 5000,
      pesoAmostraAguaG: 1910,
      incidenciaMandarova: 'BAIXA',
    },
  ]);

  const [precoBaseTonReais, setPrecoBaseTonReais] = useState<number>(680.0); // Padrão 30% amido
  const [bonificacaoPorPctAmidoReais, setBonificacaoPorPctAmidoReais] = useState<number>(20.0); // R$ por ponto acima de 30%
  const [custoPorHaReais, setCustoPorHaReais] = useState<number>(11400.0);

  // Cálculos Consolidados
  const mandiocaMetrics = useMemo(() => {
    const areaTotalHa = lotes.reduce((acc, l) => acc + l.areaHa, 0);

    let producaoTotalTon = 0;
    let somaPonderadaAmido = 0;
    let faturamentoTotalReais = 0;

    lotes.forEach((l) => {
      const loteTon = l.produtividadeTonHa * l.areaHa;
      producaoTotalTon += loteTon;

      // Balança Hidrostática de Grossmann
      const densidade = l.pesoAmostraArG / (l.pesoAmostraArG - l.pesoAmostraAguaG);
      const teorAmidoPct = Number(((densidade - 1.0) * 52.4).toFixed(1));

      const deltaAmido = Math.max(0, teorAmidoPct - 30.0);
      const precoEfetivoTon = precoBaseTonReais + deltaAmido * bonificacaoPorPctAmidoReais;

      somaPonderadaAmido += teorAmidoPct * loteTon;
      faturamentoTotalReais += loteTon * precoEfetivoTon;
    });

    const teorAmidoMedioPct = producaoTotalTon > 0 ? somaPonderadaAmido / producaoTotalTon : 0;
    const faturamentoPorHaReais = areaTotalHa > 0 ? faturamentoTotalReais / areaTotalHa : 0;
    const custoTotalReais = areaTotalHa * custoPorHaReais;
    const margemLiquidaReais = faturamentoTotalReais - custoTotalReais;
    const margemLiquidaPorHaReais = areaTotalHa > 0 ? margemLiquidaReais / areaTotalHa : 0;

    return {
      areaTotalHa,
      producaoTotalTon,
      teorAmidoMedioPct,
      faturamentoTotalReais,
      faturamentoPorHaReais,
      custoTotalReais,
      margemLiquidaReais,
      margemLiquidaPorHaReais,
    };
  }, [lotes, precoBaseTonReais, bonificacaoPorPctAmidoReais, custoPorHaReais]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-700">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Mandiocultura Industrial & Balança Hidrostática
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 font-mono border border-amber-500/30">
                    Grossmann • Teor de Amido/Fécula • Bonificação Fecularia
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Determinação gravimétrica de matéria seca, prêmio por teor de fécula e controle biológico de Mandarová com Baculovirus.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-800 border-emerald-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Amido Médio: {mandiocaMetrics.teorAmidoMedioPct.toFixed(1)}% (Padrão Premium &gt; 32%)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Produção de Raízes */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Raízes Tuberosas</span>
            <Sprout className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-700">
            {mandiocaMetrics.producaoTotalTon.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-slate-600">toneladas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Área total em colheita: {mandiocaMetrics.areaTotalHa} hectares.
          </p>
        </div>

        {/* KPI 2: Faturamento Total */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Faturamento Bruto</span>
            <Coins className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-700">
            R$ {mandiocaMetrics.faturamentoTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Média de R$ {mandiocaMetrics.faturamentoPorHaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / ha.
          </p>
        </div>

        {/* KPI 3: Margem Líquida */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Margem Líquida</span>
            <TrendingUp className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-sky-700">
            R$ {mandiocaMetrics.margemLiquidaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            R$ {mandiocaMetrics.margemLiquidaPorHaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / ha líquido.
          </p>
        </div>

        {/* KPI 4: Qualidade do Amido */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Teor Médio de Amido</span>
            <Award className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-slate-800">
            {mandiocaMetrics.teorAmidoMedioPct.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            +{(mandiocaMetrics.teorAmidoMedioPct - 30.0).toFixed(1)} pontos acima do padrão base industrial.
          </p>
        </div>
      </div>

      {/* Grid de Lotes e Painel de Balança */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Talhões de Mandioca */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-700" />
                Talhões de Mandioca & Laudo Hidrostático Grossmann
              </h3>
              <p className="text-xs text-slate-600">
                Ensaio gravimétrico de 5.000g de raízes imersas em água para cálculo de matéria seca.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              {lotes.length} Talhões Cadastrados
            </span>
          </div>

          <div className="space-y-3">
            {lotes.map((l) => {
              const loteTon = l.produtividadeTonHa * l.areaHa;
              const densidade = l.pesoAmostraArG / (l.pesoAmostraArG - l.pesoAmostraAguaG);
              const amidoPct = Number(((densidade - 1.0) * 52.4).toFixed(1));
              const deltaAmido = Math.max(0, amidoPct - 30.0);
              const precoEfetivo = precoBaseTonReais + deltaAmido * bonificacaoPorPctAmidoReais;
              const faturamentoLote = loteTon * precoEfetivo;

              return (
                <div
                  key={l.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 font-mono text-xs font-bold border border-amber-500/30">
                        {l.id}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{l.talhao}</h4>
                      <span className="text-[11px] text-slate-600 font-mono">({l.variedade} • {l.idadeMeses} meses)</span>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 text-[10px] font-mono border border-emerald-500/30">
                      Amido: {amidoPct}% (Prêmio R$ {deltaAmido * bonificacaoPorPctAmidoReais}/t)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-600">
                    <span>Área: <strong className="text-white">{l.areaHa} ha</strong></span>
                    <span>Produtividade: <strong className="text-amber-700">{l.produtividadeTonHa} t/ha</strong> ({loteTon.toFixed(0)} t)</span>
                    <span>Peso na Água: <strong className="text-sky-700">{l.pesoAmostraAguaG} g</strong></span>
                    <span>Preço Pago: <strong className="text-white">R$ {precoEfetivo.toFixed(2)}/t</strong></span>
                    <span>Faturamento: <strong className="text-emerald-700">R$ {faturamentoLote.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diretrizes Técnicas de Mandiocultura */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-700 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes Técnicas Embrapa Mandioca e Fruticultura:
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>
                <strong>Balança Hidrostática de Grossmann:</strong> Padrão oficial adotado por fecularias. Quanto maior o peso da cesta de raízes submersa na água, maior a gravidade específica e o rendimento de amido industrial.
              </li>
              <li>
                <strong>Controle Biológico de Mandarová (*Erinnyis ello*):</strong> O uso de *Baculovirus erinnyis* (extrato de lagartas mortas congeladas pulverizado a 50 mL/ha) atinge 95% de controle biológico sem resíduos químicos.
              </li>
              <li>
                <strong>Ponto Ideal de Colheita (16 a 20 meses):</strong> O ciclo de dois ciclos vegetativos maximiza o acúmulo de amido nas raízes antes da brotação primaveril.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Comerciais */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Factory className="w-5 h-5 text-amber-700" />
            Parâmetros Comerciais da Fecularia
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Preço Base por Tonelada - Padrão 30% Amido (R$)</label>
              <input
                type="number"
                step="10.0"
                value={precoBaseTonReais}
                onChange={(e) => setPrecoBaseTonReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Bonificação por 1% Adicional de Amido (R$/t)</label>
              <input
                type="number"
                step="1.0"
                value={bonificacaoPorPctAmidoReais}
                onChange={(e) => setBonificacaoPorPctAmidoReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Custo Operacional Total de Produção (R$/ha)</label>
              <input
                type="number"
                step="200"
                value={custoPorHaReais}
                onChange={(e) => setCustoPorHaReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Faturamento da Safra:</span>
                <span className="text-emerald-700 font-mono font-bold">
                  R$ {mandiocaMetrics.faturamentoTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Custo Total de Campo:</span>
                <span className="text-rose-700 font-mono font-bold">
                  -R$ {mandiocaMetrics.custoTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-slate-900">Lucro Líquido Mandioca:</span>
                <span className="text-sky-700 font-mono">
                  R$ {mandiocaMetrics.margemLiquidaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
