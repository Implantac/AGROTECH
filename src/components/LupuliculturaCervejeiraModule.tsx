import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Coins,
  Layers,
  Award,
  Sun,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Beer,
  Wind
} from 'lucide-react';

interface ParcelaLupulo {
  id: string;
  cultivar: string;
  areaHa: number;
  anoPlantio: number;
  alturaEspaldeiraMetros: number;
  produtividadeConesSecosKgHa: number;
  teorAlphaAcidosPct: number; // % AA (amargor)
  teorOleosTotaisMl100g: number; // óleos aromáticos
  fotoperiodoHorasLuz: number; // Iluminação LED suplementar noturna
}

export const LupuliculturaCervejeiraModule: React.FC = () => {
  const [parcelas, setParcelas] = useState<ParcelaLupulo[]>([
    {
      id: 'LUP-01',
      cultivar: 'Cascade Tropical (Aroma Floral/Cítrico)',
      areaHa: 3.5,
      anoPlantio: 2021,
      alturaEspaldeiraMetros: 5.5,
      produtividadeConesSecosKgHa: 1920,
      teorAlphaAcidosPct: 9.8,
      teorOleosTotaisMl100g: 1.65,
      fotoperiodoHorasLuz: 16.0,
    },
    {
      id: 'LUP-02',
      cultivar: 'Chinook BR (Pinho & Frutas Tropicais)',
      areaHa: 2.5,
      anoPlantio: 2022,
      alturaEspaldeiraMetros: 5.5,
      produtividadeConesSecosKgHa: 1850,
      teorAlphaAcidosPct: 12.4,
      teorOleosTotaisMl100g: 2.10,
      fotoperiodoHorasLuz: 16.0,
    },
    {
      id: 'LUP-03',
      cultivar: 'Comet (Aroma Maracujá / Resinoso)',
      areaHa: 2.0,
      anoPlantio: 2023,
      alturaEspaldeiraMetros: 5.5,
      produtividadeConesSecosKgHa: 1780,
      teorAlphaAcidosPct: 10.5,
      teorOleosTotaisMl100g: 1.85,
      fotoperiodoHorasLuz: 16.0,
    },
  ]);

  const [precoKgPelletT90Reais, setPrecoKgPelletT90Reais] = useState<number>(290.0); // R$ 290,00/kg de pellet nacional fresco
  const [custoManejoPorHaReais, setCustoManejoPorHaReais] = useState<number>(185000.0); // Espaldeira, LED, fertirrigação, secador oast e peletizadora
  const [perdaPeletizacaoPct, setPerdaPeletizacaoPct] = useState<number>(3.0); // Perda técnica em pó de lupulina

  // Cálculos Consolidados
  const lupuloMetrics = useMemo(() => {
    const areaTotalHa = parcelas.reduce((acc, p) => acc + p.areaHa, 0);

    let producaoTotalConesKg = 0;
    let somaPonderadaAlpha = 0;
    let somaPonderadaOleos = 0;

    parcelas.forEach((p) => {
      const loteConesKg = p.produtividadeConesSecosKgHa * p.areaHa;
      producaoTotalConesKg += loteConesKg;
      somaPonderadaAlpha += p.teorAlphaAcidosPct * loteConesKg;
      somaPonderadaOleos += p.teorOleosTotaisMl100g * loteConesKg;
    });

    const alphaMedioPct = producaoTotalConesKg > 0 ? somaPonderadaAlpha / producaoTotalConesKg : 0;
    const oleosMedios = producaoTotalConesKg > 0 ? somaPonderadaOleos / producaoTotalConesKg : 0;

    const producaoPelletsT90Kg = Math.round(producaoTotalConesKg * (1 - perdaPeletizacaoPct / 100));
    const faturamentoBrutoReais = producaoPelletsT90Kg * precoKgPelletT90Reais;
    const faturamentoPorHaReais = areaTotalHa > 0 ? faturamentoBrutoReais / areaTotalHa : 0;

    const custoTotalManejoReais = areaTotalHa * custoManejoPorHaReais;
    const margemLiquidaReais = faturamentoBrutoReais - custoTotalManejoReais;
    const margemLiquidaPorHaReais = areaTotalHa > 0 ? margemLiquidaReais / areaTotalHa : 0;

    return {
      areaTotalHa,
      producaoTotalConesKg,
      producaoPelletsT90Kg,
      alphaMedioPct,
      oleosMedios,
      faturamentoBrutoReais,
      faturamentoPorHaReais,
      custoTotalManejoReais,
      margemLiquidaReais,
      margemLiquidaPorHaReais,
    };
  }, [parcelas, precoKgPelletT90Reais, custoManejoPorHaReais, perdaPeletizacaoPct]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Beer className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Lupulicultura Tropical & Peletização T-90
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                    Humulus lupulus • Fotoperíodo Artificial • Alpha-Ácidos
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Espaldeira de 5,5m, suplementação luminosa LED noturna, secagem controlada &lt; 50°C e envase sob atmosfera de nitrogênio.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-amber-500/20 text-amber-300 border-amber-500/40 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Alpha-Ácidos Médio: {lupuloMetrics.alphaMedioPct.toFixed(1)}% AA
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Produção de Pellets */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Pellets T-90 Envasados</span>
            <Beer className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            {lupuloMetrics.producaoPelletsT90Kg.toLocaleString('pt-BR')}{' '}
            <span className="text-xs font-normal text-slate-600">kg</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {lupuloMetrics.producaoTotalConesKg.toLocaleString('pt-BR')} kg de cones secos colhidos.
          </p>
        </div>

        {/* KPI 2: Faturamento Total */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Faturamento Bruto</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            R$ {lupuloMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Preço: R$ {precoKgPelletT90Reais.toFixed(2)}/kg para cervejarias artesanais.
          </p>
        </div>

        {/* KPI 3: Margem Líquida */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Margem Líquida</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            R$ {lupuloMetrics.margemLiquidaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            R$ {lupuloMetrics.margemLiquidaPorHaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / ha líquido.
          </p>
        </div>

        {/* KPI 4: Óleos Essenciais */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Óleos Essenciais</span>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            {lupuloMetrics.oleosMedios.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-600">mL/100g</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Alto potencial para Dry Hopping (Mirceno, Humuleno, Cariofileno).
          </p>
        </div>
      </div>

      {/* Grid de Parcelas e Painel Comercial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Parcelas de Lúpulo */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Espaldeiras de Lúpulo & Laudo Cromatográfico
              </h3>
              <p className="text-xs text-slate-600">
                Monitoramento do ciclo vegetativo e indução floral com fotoperíodo suplementar de 16 horas.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              {parcelas.length} Variedades em Cultivo
            </span>
          </div>

          <div className="space-y-3">
            {parcelas.map((p) => {
              const loteConesKg = p.produtividadeConesSecosKgHa * p.areaHa;
              const pelletsKg = Math.round(loteConesKg * (1 - perdaPeletizacaoPct / 100));
              const faturamentoLote = pelletsKg * precoKgPelletT90Reais;

              return (
                <div
                  key={p.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                        {p.id}
                      </span>
                      <h4 className="text-xs font-bold text-white">{p.cultivar}</h4>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                      {p.teorAlphaAcidosPct}% AA • {p.teorOleosTotaisMl100g} mL/100g Óleos
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-600">
                    <span>Área: <strong className="text-white">{p.areaHa} ha</strong></span>
                    <span>Espaldeira: <strong className="text-emerald-400">{p.alturaEspaldeiraMetros} m</strong></span>
                    <span>Fotoperíodo: <strong className="text-amber-400">{p.fotoperiodoHorasLuz}h luz/dia</strong></span>
                    <span>Pellets T-90: <strong className="text-cyan-400">{pelletsKg.toLocaleString('pt-BR')} kg</strong></span>
                    <span>Faturamento: <strong className="text-emerald-400">R$ {faturamentoLote.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diretrizes Técnicas de Lupulicultura Tropical */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes Técnicas de Lupulicultura de Precisão:
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>
                <strong>Suplementação Luminosa Noturna (Fotoperíodo):</strong> Em latitudes brasileiras tropicais/subtropicais, a iluminação LED no topo dos fios induz o crescimento vegetativo até 5,5 metros antes da emissão de cones reprodutivos.
              </li>
              <li>
                <strong>Secagem a Baixa Temperatura (&lt; 50°C):</strong> A temperatura do fluxo de ar no secador oast deve ser estritamente controlada para evitar a volatilização dos óleos finos de aroma e oxidação de lupulina.
              </li>
              <li>
                <strong>Peletização T-90 Sob Nitrogênio:</strong> O envase a vácuo com injeção de gás inerte (N₂) em embalagens metalizadas garante frescor e preservação dos alpha-ácidos por até 24 meses em câmara fria (0°C a 4°C).
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Comerciais */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Parâmetros Comerciais & Peletização
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Preço de Venda do Pellet T-90 (R$/kg)</label>
              <input
                type="number"
                step="5.0"
                value={precoKgPelletT90Reais}
                onChange={(e) => setPrecoKgPelletT90Reais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Custo Total de Manejo & Infraestrutura (R$/ha)</label>
              <input
                type="number"
                step="5000"
                value={custoManejoPorHaReais}
                onChange={(e) => setCustoManejoPorHaReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Perda Mecânica na Peletização (%)</label>
              <input
                type="number"
                step="0.5"
                value={perdaPeletizacaoPct}
                onChange={(e) => setPerdaPeletizacaoPct(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Faturamento da Safra:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  R$ {lupuloMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Custo Total de Manejo:</span>
                <span className="text-rose-400 font-mono font-bold">
                  -R$ {lupuloMetrics.custoTotalManejoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-white">Lucro Líquido Lúpulo:</span>
                <span className="text-cyan-400 font-mono">
                  R$ {lupuloMetrics.margemLiquidaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
