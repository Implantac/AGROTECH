import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Award,
  Layers,
  Scale,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface FardoAlgodao {
  id: string;
  romaneioId: string;
  pesoBrutoCarocoKg: number;
  rendimentoPlumaPct: number;
  uhmPolegadas: number; // Comprimento
  micronaire: number;   // Finura / Maturidade
  resistenciaGtex: number;
  uniformidadeUiPct: number;
  classificacaoComercial: string;
}

export const AlgodaoHVIQualidadeModule: React.FC = () => {
  // Parâmetros de Cotonicultura
  const [areaAlgodaoHa, setAreaAlgodaoHa] = useState<number>(650);
  const [produtividadeCarocoArrobaHa, setProdutividadeCarocoArrobaHa] = useState<number>(310); // 310 @/ha em caroço (~4.650 kg/ha)
  const [rendimentoPlumaBasePct, setRendimentoPlumaBasePct] = useState<number>(40.5); // 40.5% pluma límpida
  const [cotacaoPlumaArrobaReais, setCotacaoPlumaArrobaReais] = useState<number>(145.00); // R$/@ de pluma
  const [cotacaoCarocoTonReais, setCotacaoCarocoTonReais] = useState<number>(1150.00); // R$/ton caroço de algodão para nutrição animal

  // Amostras de Fardos com Laudo HVI (High Volume Instrument)
  const [lotesFardos, setLotesFardos] = useState<FardoAlgodao[]>([
    {
      id: 'FDO-801',
      romaneioId: 'ROM-9821',
      pesoBrutoCarocoKg: 12000,
      rendimentoPlumaPct: 40.8,
      uhmPolegadas: 1.16,
      micronaire: 4.15,
      resistenciaGtex: 31.5,
      uniformidadeUiPct: 83.8,
      classificacaoComercial: 'Tipo 31-4 (Superior Exportação)',
    },
    {
      id: 'FDO-802',
      romaneioId: 'ROM-9822',
      pesoBrutoCarocoKg: 11800,
      rendimentoPlumaPct: 40.4,
      uhmPolegadas: 1.14,
      micronaire: 4.22,
      resistenciaGtex: 30.8,
      uniformidadeUiPct: 83.1,
      classificacaoComercial: 'Tipo 31-4 (Superior Exportação)',
    },
    {
      id: 'FDO-803',
      romaneioId: 'ROM-9823',
      pesoBrutoCarocoKg: 12400,
      rendimentoPlumaPct: 39.9,
      uhmPolegadas: 1.11,
      micronaire: 3.65,
      resistenciaGtex: 29.2,
      uniformidadeUiPct: 81.5,
      classificacaoComercial: 'Tipo 41-4 (Regular c/ Deságio Micronaire)',
    },
  ]);

  // Cálculos Técnicos do Motor de Cotonicultura HVI
  const hviMetrics = useMemo(() => {
    // 1. Volume total colhido
    const producaoTotalCarocoKg = areaAlgodaoHa * (produtividadeCarocoArrobaHa * 15.0);
    const producaoTotalCarocoTon = producaoTotalCarocoKg / 1000.0;

    // 2. Separação Física no Descaroçador (Ginning Turnout)
    const plumaTotalKg = producaoTotalCarocoKg * (rendimentoPlumaBasePct / 100.0);
    const plumaTotalArrobas = plumaTotalKg / 15.0;
    const carocoTotalKg = producaoTotalCarocoKg * 0.545; // ~54.5% de caroço
    const carocoTotalTon = carocoTotalKg / 1000.0;
    const fibrilhaResiduoKg = producaoTotalCarocoKg * 0.05; // 5% resíduos

    // 3. Fardos Padrão Internacional (228 kg)
    const totalFardos228Kg = Math.floor(plumaTotalKg / 228.0);

    // 4. Auditoria HVI da Safra (Média ponderada dos fardos)
    const mediaUhm =
      lotesFardos.reduce((acc, f) => acc + f.uhmPolegadas, 0) / lotesFardos.length;
    const mediaMicronaire =
      lotesFardos.reduce((acc, f) => acc + f.micronaire, 0) / lotesFardos.length;
    const mediaResistencia =
      lotesFardos.reduce((acc, f) => acc + f.resistenciaGtex, 0) / lotesFardos.length;

    // Critérios Premium ABRAPA / ICE Cotton
    const isMicronaireIdeal = mediaMicronaire >= 3.8 && mediaMicronaire <= 4.5;
    const isComprimentoLongo = mediaUhm >= 1.12;
    const isResistenciaAlta = mediaResistencia >= 30.0;

    const atendeExportacaoPremium = isMicronaireIdeal && isComprimentoLongo && isResistenciaAlta;
    const premioQualidadePct = atendeExportacaoPremium ? 4.5 : 0.0;

    // 5. Receitas Comerciais Consolidadas
    const cotacaoEfetivaArrobaPluma = cotacaoPlumaArrobaReais * (1 + premioQualidadePct / 100.0);
    const receitaPlumaReais = plumaTotalArrobas * cotacaoEfetivaArrobaPluma;
    const receitaCarocoReais = carocoTotalTon * cotacaoCarocoTonReais;
    const receitaBrutaTotalReais = receitaPlumaReais + receitaCarocoReais;
    const faturamentoPorHaReais = receitaBrutaTotalReais / areaAlgodaoHa;

    return {
      producaoTotalCarocoTon,
      plumaTotalKg,
      plumaTotalArrobas,
      carocoTotalTon,
      totalFardos228Kg,
      mediaUhm,
      mediaMicronaire,
      mediaResistencia,
      atendeExportacaoPremium,
      premioQualidadePct,
      cotacaoEfetivaArrobaPluma,
      receitaPlumaReais,
      receitaCarocoReais,
      receitaBrutaTotalReais,
      faturamentoPorHaReais,
    };
  }, [
    areaAlgodaoHa,
    produtividadeCarocoArrobaHa,
    rendimentoPlumaBasePct,
    cotacaoPlumaArrobaReais,
    cotacaoCarocoTonReais,
    lotesFardos,
  ]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Qualidade da Fibra de Algodão & Classificação HVI
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                    ABRAPA • ICE Cotton #2
                  </span>
                </h2>
                <p className="text-sm text-[#66736A]">
                  Descaroçamento, comprimento de fibra (UHM), finura/maturidade (Micronaire), resistência e bônus de exportação.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border flex items-center gap-1.5 ${
                hviMetrics.atendeExportacaoPremium
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {hviMetrics.atendeExportacaoPremium
                ? 'Padrão Premium Exportação (+4.5% Bônus)'
                : 'Padrão Regular (Mercado Interno)'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Fardos Produzidos */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Fardos Exportação</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            {hviMetrics.totalFardos228Kg.toLocaleString('pt-BR')}{' '}
            <span className="text-xs font-normal text-[#66736A]">fardos (228 kg)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Rendimento: {rendimentoPlumaBasePct}% de pluma limpa.
          </p>
        </div>

        {/* KPI 2: Parâmetros HVI Médios */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>HVI: UHM & Micronaire</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            {hviMetrics.mediaUhm.toFixed(2)}" • {hviMetrics.mediaMicronaire.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Resistência: {hviMetrics.mediaResistencia.toFixed(1)} g/tex (Meta: &gt; 30.0).
          </p>
        </div>

        {/* KPI 3: Caroço de Algodão (Subproduto Nobre) */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Caroço para Confinamento</span>
            <Scale className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            {hviMetrics.carocoTotalTon.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-[#66736A]">ton</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Receita: R$ {hviMetrics.receitaCarocoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} (@ R$ {cotacaoCarocoTonReais}/t).
          </p>
        </div>

        {/* KPI 4: Faturamento por Hectare */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Faturamento Bruto Total</span>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            R$ {hviMetrics.faturamentoPorHaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-emerald-400">/ ha</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total: R$ {hviMetrics.receitaBrutaTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} ({areaAlgodaoHa} ha).
          </p>
        </div>
      </div>

      {/* Grid Principal: Lotes Auditados e Parâmetros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Fardos Classificados pelo Laboratório HVI */}
        <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                Laudos Laboratoriais HVI dos Lotes de Algodão
              </h3>
              <p className="text-xs text-[#66736A]">
                Parâmetros físicos medidos conforme padronização do USDA / ABRAPA.
              </p>
            </div>
            <span className="text-xs font-mono text-[#66736A]">
              {lotesFardos.length} Lotes Homologados
            </span>
          </div>

          <div className="space-y-3">
            {lotesFardos.map((f) => (
              <div
                key={f.id}
                className="p-4 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                      {f.id}
                    </span>
                    <h4 className="text-xs font-bold text-white">{f.classificacaoComercial}</h4>
                  </div>
                  <span className="text-[11px] font-mono text-[#66736A]">
                    Carga: {f.pesoBrutoCarocoKg.toLocaleString('pt-BR')} kg caroço • {f.rendimentoPlumaPct}% pluma
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono">
                  <div className="p-2 rounded bg-white border border-[#EAF4E7]">
                    <span className="text-slate-500 block text-[10px]">Comprimento (UHM)</span>
                    <span className="text-white font-bold">{f.uhmPolegadas}" ({(f.uhmPolegadas * 25.4).toFixed(1)} mm)</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-[#EAF4E7]">
                    <span className="text-slate-500 block text-[10px]">Micronaire</span>
                    <span className={f.micronaire >= 3.8 && f.micronaire <= 4.5 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {f.micronaire.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-white border border-[#EAF4E7]">
                    <span className="text-slate-500 block text-[10px]">Resistência</span>
                    <span className="text-cyan-400 font-bold">{f.resistenciaGtex} g/tex</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-[#EAF4E7]">
                    <span className="text-slate-500 block text-[10px]">Uniformidade (UI)</span>
                    <span className="text-white font-bold">{f.uniformidadeUiPct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Técnico HVI */}
          <div className="p-4 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Padrões Globais de Comercialização de Pluma:
            </div>
            <ul className="list-disc list-inside text-[#66736A] space-y-1">
              <li>
                <strong>Faixa Nobre de Micronaire (3.8 a 4.5):</strong> Valores abaixo de 3.5 indicam fibras imaturas propensas a nós (neps) na fiação. Acima de 4.9 tornam a fibra grossa com deságio severo.
              </li>
              <li>
                <strong>Comprimento Superior a 1.12 polegadas:</strong> Permite tecer fios de altíssima contagem para vestuário premium no Sudeste Asiático e Europa.
              </li>
              <li>
                <strong>Certificação ABR (Algodão Brasileiro Responsável):</strong> Agrega conformidade trabalhista, ambiental e rastreabilidade por QR Code impresso no fardo.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Comerciais */}
        <div className="bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            Parâmetros da Safra
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#66736A] font-medium block mb-1">Área Cultivada (ha)</label>
              <input
                type="number"
                value={areaAlgodaoHa}
                onChange={(e) => setAreaAlgodaoHa(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#66736A] font-medium block mb-1">Produtividade em Caroço (@/ha)</label>
              <input
                type="number"
                value={produtividadeCarocoArrobaHa}
                onChange={(e) => setProdutividadeCarocoArrobaHa(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#66736A] font-medium">Rendimento no Descaroçador</span>
                <span className="text-amber-400 font-mono font-bold">{rendimentoPlumaBasePct}%</span>
              </div>
              <input
                type="range"
                min="38.0"
                max="43.0"
                step="0.1"
                value={rendimentoPlumaBasePct}
                onChange={(e) => setRendimentoPlumaBasePct(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[#66736A] font-medium block mb-1">Cotação da Pluma (R$/@ pluma)</label>
              <input
                type="number"
                value={cotacaoPlumaArrobaReais}
                onChange={(e) => setCotacaoPlumaArrobaReais(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#66736A] font-medium block mb-1">Cotação do Caroço (R$/tonelada)</label>
              <input
                type="number"
                value={cotacaoCarocoTonReais}
                onChange={(e) => setCotacaoCarocoTonReais(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-[#EAF4E7] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#66736A]">Receita Bruta Pluma:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  R$ {hviMetrics.receitaPlumaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736A]">Receita Bruta Caroço:</span>
                <span className="text-cyan-400 font-mono font-bold">
                  R$ {hviMetrics.receitaCarocoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#EAF4E7] pt-2 font-bold">
                <span className="text-white">Faturamento Global:</span>
                <span className="text-amber-400 font-mono">
                  R$ {hviMetrics.receitaBrutaTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
