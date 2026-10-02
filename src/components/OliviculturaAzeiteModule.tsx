import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Coins,
  Layers,
  Award,
  Droplet,
  FlaskConical,
  Sun,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ParcelaOlival {
  id: string;
  nome: string;
  cultivar: string;
  areaHa: number;
  anoPlantio: number;
  densidadeArvoresHa: number;
  producaoAzeitonaKgHa: number;
  rendimentoAzeitePct: number; // % óleo extraído a frio
  indiceMaturacaoJaen: number; // 0 a 7
  acidezLivrePct: number; // % ácido oleico (< 0.20% super premium)
  polifenoisMgKg: number;
}

export const OliviculturaAzeiteModule: React.FC = () => {
  const [parcelas, setParcelas] = useState<ParcelaOlival[]>([
    {
      id: 'OLV-01',
      nome: 'Olival Mantiqueira Alta (Colheita Precoce)',
      cultivar: 'Koroneiki (Grega - Rico em Polifenóis)',
      areaHa: 14,
      anoPlantio: 2017,
      densidadeArvoresHa: 650,
      producaoAzeitonaKgHa: 6800,
      rendimentoAzeitePct: 15.8,
      indiceMaturacaoJaen: 2.8,
      acidezLivrePct: 0.12,
      polifenoisMgKg: 520,
    },
    {
      id: 'OLV-02',
      nome: 'Olival Serra Sul (Equilíbrio & Frutado)',
      cultivar: 'Arbequina (Espanhola - Suave e Aromática)',
      areaHa: 16,
      anoPlantio: 2016,
      densidadeArvoresHa: 700,
      producaoAzeitonaKgHa: 7600,
      rendimentoAzeitePct: 17.2,
      indiceMaturacaoJaen: 3.5,
      acidezLivrePct: 0.15,
      polifenoisMgKg: 380,
    },
    {
      id: 'OLV-03',
      nome: 'Olival Encosta do Sol (Robusto)',
      cultivar: 'Picual (Alta Estabilidade Oxidativa)',
      areaHa: 10,
      anoPlantio: 2019,
      densidadeArvoresHa: 600,
      producaoAzeitonaKgHa: 7100,
      rendimentoAzeitePct: 16.5,
      indiceMaturacaoJaen: 3.1,
      acidezLivrePct: 0.14,
      polifenoisMgKg: 490,
    },
  ]);

  const [precoGarrafa500mlReais, setPrecoGarrafa500mlReais] = useState<number>(68.0); // R$ 68,00 por garrafa 500ml extravirgem
  const [custoExtracaoEnvasePorLitro, setCustoExtracaoEnvasePorLitro] = useState<number>(14.50); // Custo lagar + vidro + rotulagem

  // Cálculos Consolidados
  const olivalMetrics = useMemo(() => {
    const areaTotalHa = parcelas.reduce((acc, p) => acc + p.areaHa, 0);

    let producaoTotalAzeitonaKg = 0;
    let producaoTotalAzeiteLitros = 0;
    let somaPonderadaAcidez = 0;
    let somaPonderadaPolifenois = 0;

    parcelas.forEach((p) => {
      const azeitonaLoteKg = p.producaoAzeitonaKgHa * p.areaHa;
      const azeiteLoteLitros = azeitonaLoteKg * (p.rendimentoAzeitePct / 100);

      producaoTotalAzeitonaKg += azeitonaLoteKg;
      producaoTotalAzeiteLitros += azeiteLoteLitros;
      somaPonderadaAcidez += p.acidezLivrePct * azeiteLoteLitros;
      somaPonderadaPolifenois += p.polifenoisMgKg * azeiteLoteLitros;
    });

    const acidezMediaPct = producaoTotalAzeiteLitros > 0 ? somaPonderadaAcidez / producaoTotalAzeiteLitros : 0;
    const polifenoisMedios = producaoTotalAzeiteLitros > 0 ? somaPonderadaPolifenois / producaoTotalAzeiteLitros : 0;

    const garrafas500mlTotal = Math.round(producaoTotalAzeiteLitros * 2);
    const faturamentoBrutoReais = garrafas500mlTotal * precoGarrafa500mlReais;
    const faturamentoPorHaReais = areaTotalHa > 0 ? faturamentoBrutoReais / areaTotalHa : 0;

    const custoTotalProcessamentoReais = producaoTotalAzeiteLitros * custoExtracaoEnvasePorLitro;
    const margemLiquidaReais = faturamentoBrutoReais - custoTotalProcessamentoReais;

    const isSuperPremium = acidezMediaPct <= 0.20;

    return {
      areaTotalHa,
      producaoTotalAzeitonaKg,
      producaoTotalAzeiteLitros,
      acidezMediaPct,
      polifenoisMedios,
      garrafas500mlTotal,
      faturamentoBrutoReais,
      faturamentoPorHaReais,
      custoTotalProcessamentoReais,
      margemLiquidaReais,
      isSuperPremium,
    };
  }, [parcelas, precoGarrafa500mlReais, custoExtracaoEnvasePorLitro]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-lime-950/40 via-slate-900 to-slate-900 border border-lime-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-lime-500/20 border border-lime-500/30 text-lime-400">
                <Droplet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Olivicultura de Precisão & Azeite Extravirgem
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-lime-500/20 text-lime-300 font-mono border border-lime-500/30">
                    Olea europaea • Acidez &lt; 0.20% • Polifenóis Totais
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Extração contínua a frio (&lt; 27°C), índice de maturação de Jaén, laudo físico-químico e agregação de valor gourmet.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Acidez Livre: {olivalMetrics.acidezMediaPct.toFixed(2)}% (Super Premium Extravirgem)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Produção de Azeite */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Azeite Extraído a Frio</span>
            <Droplet className="w-4 h-4 text-lime-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-lime-400">
            {olivalMetrics.producaoTotalAzeiteLitros.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-slate-600">Litros</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {olivalMetrics.garrafas500mlTotal.toLocaleString('pt-BR')} garrafas de 500ml envasadas.
          </p>
        </div>

        {/* KPI 2: Pureza & Polifenóis */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Polifenóis Totais</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            {Math.round(olivalMetrics.polifenoisMedios)}{' '}
            <span className="text-xs font-normal text-slate-600">mg/kg</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Alta estabilidade oxidativa e propriedades nutracêuticas comprovadas.
          </p>
        </div>

        {/* KPI 3: Faturamento Bruto */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Faturamento da Safra</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            R$ {olivalMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Preço: R$ {precoGarrafa500mlReais.toFixed(2)} por garrafa 500ml no mercado fino.
          </p>
        </div>

        {/* KPI 4: Retorno por Hectare */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Rentabilidade / Hectare</span>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            R$ {olivalMetrics.faturamentoPorHaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-emerald-400">/ ha</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Margem líquida: R$ {olivalMetrics.margemLiquidaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}.
          </p>
        </div>
      </div>

      {/* Grid de Parcelas e Painel de Lagar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Parcelas de Olival */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-lime-400" />
                Talhões de Olival & Laudo Físico-Químico
              </h3>
              <p className="text-xs text-slate-600">
                Monitoramento da colheita manual/vibratória e índice de viragem de cor Jaén.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              {parcelas.length} Talhões em Produção
            </span>
          </div>

          <div className="space-y-3">
            {parcelas.map((p) => {
              const azeitonaLoteKg = p.producaoAzeitonaKgHa * p.areaHa;
              const azeiteLitros = azeitonaLoteKg * (p.rendimentoAzeitePct / 100);
              const garrafas = Math.round(azeiteLitros * 2);
              const faturamentoLote = garrafas * precoGarrafa500mlReais;

              return (
                <div
                  key={p.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-lime-500/20 text-lime-300 font-mono text-xs font-bold border border-lime-500/30">
                        {p.id}
                      </span>
                      <h4 className="text-xs font-bold text-white">{p.nome}</h4>
                      <span className="text-[11px] text-slate-600 font-mono">({p.cultivar})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                      Acidez {p.acidezLivrePct}% • {p.polifenoisMgKg} mg/kg
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-600">
                    <span>Área: <strong className="text-white">{p.areaHa} ha</strong> ({p.densidadeArvoresHa} pl/ha)</span>
                    <span>Azeitonas: <strong className="text-white">{(azeitonaLoteKg / 1000).toFixed(1)} ton</strong></span>
                    <span>Rendimento: <strong className="text-lime-400">{p.rendimentoAzeitePct}%</strong> ({azeiteLitros.toFixed(0)} L)</span>
                    <span>Garrafas 500ml: <strong className="text-cyan-400">{garrafas.toLocaleString('pt-BR')} un</strong></span>
                    <span>Faturamento: <strong className="text-amber-400">R$ {faturamentoLote.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Técnico de Boas Práticas Oleícolas */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-lime-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes de Extração e Qualidade COI (Conselho Oleícola Internacional):
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>
                <strong>Velocidade de Processamento:</strong> A extração das azeitonas no lagar deve ocorrer em no máximo 4 a 6 horas após a colheita para impedir fermentações anaeróbicas indesejadas e oxidação.
              </li>
              <li>
                <strong>Temperatura de Batimento (&lt; 27°C):</strong> Garante a preservação dos voláteis aromáticos de folha verde, maçã e tomateiro e a integridade dos polifenóis bioativos.
              </li>
              <li>
                <strong>Envasamento Sob Atmosfera Inerte (Gás Nitrogênio):</strong> O uso de nitrogênio nas garrafas escuras protege o azeite contra o ranço oxidativo ao longo de todo o prazo de validade.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Comerciais */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Parâmetros Comerciais & Lagar
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Preço de Venda da Garrafa 500ml (R$)</label>
              <input
                type="number"
                step="1.00"
                value={precoGarrafa500mlReais}
                onChange={(e) => setPrecoGarrafa500mlReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Custo de Extração, Garrafa e Rotulagem (R$/L)</label>
              <input
                type="number"
                step="0.50"
                value={custoExtracaoEnvasePorLitro}
                onChange={(e) => setCustoExtracaoEnvasePorLitro(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Faturamento da Safra:</span>
                <span className="text-amber-400 font-mono font-bold">
                  R$ {olivalMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Custo Total de Lagar:</span>
                <span className="text-rose-400 font-mono font-bold">
                  -R$ {olivalMetrics.custoTotalProcessamentoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-white">Lucro Líquido Oleícola:</span>
                <span className="text-emerald-400 font-mono">
                  R$ {olivalMetrics.margemLiquidaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / safra
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
