import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  HeartPulse,
  ShieldCheck,
  TrendingUp,
  Coins,
  Layers,
  Award,
  AlertTriangle,
  Scale,
  Milk,
  CheckCircle2
} from 'lucide-react';

interface LoteRebanho {
  id: string;
  categoria: 'CORTE_CORDEIROS' | 'MATRIZES_REPRODUCAO' | 'CAPRINOS_LEITE';
  raca: string;
  quantidadeCabecas: number;
  escoreCorporalMedio: number; // ECC 1 a 5
  grauFamachaCriticoPct: number; // % animais em grau 4 e 5 necessitando vermifugação
  gpdEsperadoGramasDia: number; // Ganho de peso diário
  statusSanitario: 'REGULAR' | 'EXCELENTE' | 'ATENCAO';
}

export const OvinoculturaCaprinosModule: React.FC = () => {
  const [lotes, setLotes] = useState<LoteRebanho[]>([
    {
      id: 'LOTE-OV-01',
      categoria: 'CORTE_CORDEIROS',
      raca: 'Dorper x Santa Inês F1 (Creep Feeding)',
      quantidadeCabecas: 320,
      escoreCorporalMedio: 3.8,
      grauFamachaCriticoPct: 12.0, // Apenas 12% anêmicos
      gpdEsperadoGramasDia: 260,
      statusSanitario: 'EXCELENTE',
    },
    {
      id: 'LOTE-OV-02',
      categoria: 'MATRIZES_REPRODUCAO',
      raca: 'Santa Inês Pura (Pasto Rotacionado)',
      quantidadeCabecas: 450,
      escoreCorporalMedio: 3.2,
      grauFamachaCriticoPct: 15.0,
      gpdEsperadoGramasDia: 80,
      statusSanitario: 'EXCELENTE',
    },
    {
      id: 'LOTE-CAP-03',
      categoria: 'CAPRINOS_LEITE',
      raca: 'Saanen x Alpina (Lactação Especial)',
      quantidadeCabecas: 110,
      escoreCorporalMedio: 3.0,
      grauFamachaCriticoPct: 8.0,
      gpdEsperadoGramasDia: 50,
      statusSanitario: 'EXCELENTE',
    },
  ]);

  const [custoDoseVermifugoReais, setCustoDoseVermifugoReais] = useState<number>(4.80);
  const [precoKgVivoCordeiroReais, setPrecoKgVivoCordeiroReais] = useState<number>(16.50);
  const [precoLitroLeiteCaprinoReais, setPrecoLitroLeiteCaprinoReais] = useState<number>(4.20);
  const [producaoMediaLeiteCaprinoLitroDia, setProducaoMediaLeiteCaprinoLitroDia] = useState<number>(2.4);

  // Cálculos Consolidados
  const ovinoMetrics = useMemo(() => {
    const totalCabecas = lotes.reduce((acc, l) => acc + l.quantidadeCabecas, 0);

    // 1. Vermifugação Seletiva FAMACHA©
    let totalAnimaisTratadosSeletivo = 0;
    lotes.forEach((l) => {
      totalAnimaisTratadosSeletivo += Math.round(l.quantidadeCabecas * (l.grauFamachaCriticoPct / 100));
    });

    const percentualTratadoGeral = totalCabecas > 0 ? (totalAnimaisTratadosSeletivo / totalCabecas) * 100 : 0;
    const custoTratamentoSeletivoReais = totalAnimaisTratadosSeletivo * custoDoseVermifugoReais;
    const custoTratamentoConvencionalReais = totalCabecas * custoDoseVermifugoReais; // Se tratasse 100%
    const economiaVermifugoReais = custoTratamentoConvencionalReais - custoTratamentoSeletivoReais;

    // 2. Faturamento de Cordeiros Terminados (Lote 01)
    const loteCordeiros = lotes.find((l) => l.categoria === 'CORTE_CORDEIROS');
    const cabecasCorte = loteCordeiros ? loteCordeiros.quantidadeCabecas : 0;
    const pesoAbateKg = 35.0; // peso médio ao desmame/abate
    const faturamentoCordeirosReais = cabecasCorte * pesoAbateKg * precoKgVivoCordeiroReais;

    // 3. Faturamento de Leite Caprino (Lote 03)
    const loteCaprinos = lotes.find((l) => l.categoria === 'CAPRINOS_LEITE');
    const cabecasLeite = loteCaprinos ? loteCaprinos.quantidadeCabecas : 0;
    const producaoAnualLitros = cabecasLeite * producaoMediaLeiteCaprinoLitroDia * 300; // 300 dias lactação
    const faturamentoLeiteReais = producaoAnualLitros * precoLitroLeiteCaprinoReais;

    // 4. Receita Total
    const receitaTotalReais = faturamentoCordeirosReais + faturamentoLeiteReais;

    return {
      totalCabecas,
      totalAnimaisTratadosSeletivo,
      percentualTratadoGeral,
      custoTratamentoSeletivoReais,
      economiaVermifugoReais,
      faturamentoCordeirosReais,
      producaoAnualLitros,
      faturamentoLeiteReais,
      receitaTotalReais,
    };
  }, [
    lotes,
    custoDoseVermifugoReais,
    precoKgVivoCordeiroReais,
    precoLitroLeiteCaprinoReais,
    producaoMediaLeiteCaprinoLitroDia,
  ]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-700">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Ovinocultura & Caprinocultura de Precisão
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono border border-teal-500/30">
                    FAMACHA© • Escore ECC • Creep Feeding • Selo ARTE
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Manejo sanitário seletivo contra Haemonchus contortus, terminação de cordeiros pesados e bacia leiteira caprina.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-800 border-emerald-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              {ovinoMetrics.totalCabecas} Cabeças no Rebanho ({ovinoMetrics.percentualTratadoGeral.toFixed(1)}% vermifugação seletiva)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Economia FAMACHA */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Economia Sanitária FAMACHA©</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-700">
            R$ {ovinoMetrics.economiaVermifugoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Tratados apenas {ovinoMetrics.totalAnimaisTratadosSeletivo} de {ovinoMetrics.totalCabecas} animais (graus 4 e 5).
          </p>
        </div>

        {/* KPI 2: Faturamento Carne */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Safra de Cordeiros (Corte)</span>
            <Scale className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-700">
            R$ {ovinoMetrics.faturamentoCordeirosReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Preço: R$ {precoKgVivoCordeiroReais.toFixed(2)}/kg vivo @ 35 kg.
          </p>
        </div>

        {/* KPI 3: Bacia Leiteira Caprina */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Leite & Queijos Caprinos</span>
            <Milk className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-sky-700">
            R$ {ovinoMetrics.faturamentoLeiteReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Produção: {(ovinoMetrics.producaoAnualLitros / 1000).toFixed(1)} mil L/ano (R$ {precoLitroLeiteCaprinoReais.toFixed(2)}/L).
          </p>
        </div>

        {/* KPI 4: Faturamento Total */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Faturamento Bruto Geral</span>
            <Coins className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-slate-800">
            R$ {ovinoMetrics.receitaTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-emerald-700">/ ano</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Corte ovino precoce + bacia leiteira especializada.
          </p>
        </div>
      </div>

      {/* Grid de Lotes e Painel de Simulação */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Lotes do Rebanho */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-700" />
                Lotes de Produção & Monitoramento Sanitário
              </h3>
              <p className="text-xs text-slate-600">
                Avaliação periódica de Escore Corporal (ECC) e coloração da mucosa ocular FAMACHA©.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              {lotes.length} Lotes Ativos
            </span>
          </div>

          <div className="space-y-3">
            {lotes.map((l) => {
              const animaisTratar = Math.round(l.quantidadeCabecas * (l.grauFamachaCriticoPct / 100));

              return (
                <div
                  key={l.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-xs font-bold border border-teal-500/30">
                        {l.id}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{l.raca}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 text-[10px] font-mono border border-emerald-500/30">
                      {l.statusSanitario}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-600">
                    <span>Rebanho: <strong className="text-white">{l.quantidadeCabecas} cab</strong></span>
                    <span>ECC Médio: <strong className="text-sky-700">{l.escoreCorporalMedio.toFixed(1)}/5.0</strong></span>
                    <span>FAMACHA 4-5: <strong className="text-rose-700">{l.grauFamachaCriticoPct}% ({animaisTratar} cab)</strong></span>
                    <span>GPD: <strong className="text-emerald-700">+{l.gpdEsperadoGramasDia} g/dia</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Técnico de Boas Práticas Ovinos/Caprinos */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-teal-700 font-semibold">
              <Sparkles className="w-4 h-4" />
              Princípios do Protocolo FAMACHA© & Manejo Rotacionado (Embrapa Caprinos e Ovinos):
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>
                <strong>Controle de Haemonchose:</strong> O verme estomacal Haemonchus contortus é hematófago. A avaliação da cor da mucosa conjuntival identifica anêmicos (Graus 4 e 5) antes do surgimento do edema submandibular (papo).
              </li>
              <li>
                <strong>Preservação de Moléculas (Refugia):</strong> Tratar apenas 10% a 20% do rebanho mantém uma população de parasitas sensíveis aos vermífugos em refúgio no pasto, retardando o aparecimento de superparasitas resistentes.
              </li>
              <li>
                <strong>Creep-Feeding de Alta Conversão:</strong> O fornecimento de ração balanceada (18% PB) em cocho privativo aos cordeiros garante desmame aos 75-90 dias com peso vivo superior a 32 kg.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Comerciais */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-700" />
            Parâmetros Comerciais & Custos
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Preço do kg Vivo do Cordeiro (R$)</label>
              <input
                type="number"
                step="0.50"
                value={precoKgVivoCordeiroReais}
                onChange={(e) => setPrecoKgVivoCordeiroReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Preço do Litro de Leite Caprino (R$)</label>
              <input
                type="number"
                step="0.10"
                value={precoLitroLeiteCaprinoReais}
                onChange={(e) => setPrecoLitroLeiteCaprinoReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Custo da Dose de Vermífugo (R$)</label>
              <input
                type="number"
                step="0.20"
                value={custoDoseVermifugoReais}
                onChange={(e) => setCustoDoseVermifugoReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Venda de Cordeiros:</span>
                <span className="text-amber-700 font-mono font-bold">
                  R$ {ovinoMetrics.faturamentoCordeirosReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Venda de Leite Caprino:</span>
                <span className="text-sky-700 font-mono font-bold">
                  R$ {ovinoMetrics.faturamentoLeiteReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Custo Tratamento Seletivo:</span>
                <span className="text-rose-700 font-mono font-bold">
                  -R$ {ovinoMetrics.custoTratamentoSeletivoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-white">Faturamento Líquido:</span>
                <span className="text-emerald-700 font-mono">
                  R$ {(ovinoMetrics.receitaTotalReais - ovinoMetrics.custoTratamentoSeletivoReais).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / ano
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
