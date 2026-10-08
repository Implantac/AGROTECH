import React, { useState, useMemo } from 'react';
import {
  Activity,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Coins,
  Layers,
  Award,
  Thermometer,
  Wind,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Scale,
  Gauge
} from 'lucide-react';

interface LoteSuinos {
  id: string;
  fase: 'MATERNIDADE' | 'CRECHE' | 'TERMINACAO';
  galpao: string;
  totalAnimais: number;
  diasAlojamento: number;
  pesoMedioKg: number;
  gpdEsperadoGdia: number;
  conversaoAlimentar: number;
  temperaturaGalpaoC: number;
  umidadeRelativaPct: number;
  itghAmbiencia: number; // Índice de Temperatura de Globo e Umidade (< 74 Conforto Térmico)
}

export const SuinoculturaPrecisaoModule: React.FC = () => {
  const [totalMatrizes, setTotalMatrizes] = useState<number>(1200);
  const [dfaLeitoesAno, setDfaLeitoesAno] = useState<number>(32.4); // Desmamados por Fêmea/Ano
  const [pesoAbateKg, setPesoAbateKg] = useState<number>(118.5);
  const [precoKgVivoReais, setPrecoKgVivoReais] = useState<number>(7.40);
  const [custoNutricaoKgVivoReais, setCustoNutricaoKgVivoReais] = useState<number>(4.65);

  const [lotes, setLotes] = useState<LoteSuinos[]>([
    {
      id: 'LOTE-MAT-01',
      fase: 'MATERNIDADE',
      galpao: 'Galpão 01 Climatizado (Escamoteador Térmico)',
      totalAnimais: 1420,
      diasAlojamento: 18,
      pesoMedioKg: 5.8,
      gpdEsperadoGdia: 260,
      conversaoAlimentar: 1.05,
      temperaturaGalpaoC: 22.5,
      umidadeRelativaPct: 62,
      itghAmbiencia: 71.2,
    },
    {
      id: 'LOTE-CRE-03',
      fase: 'CRECHE',
      galpao: 'Galpão 03 Creche Pressão Negativa',
      totalAnimais: 3200,
      diasAlojamento: 42,
      pesoMedioKg: 28.4,
      gpdEsperadoGdia: 580,
      conversaoAlimentar: 1.48,
      temperaturaGalpaoC: 24.0,
      umidadeRelativaPct: 65,
      itghAmbiencia: 72.8,
    },
    {
      id: 'LOTE-TERM-02',
      fase: 'TERMINACAO',
      galpao: 'Galpão 06 Terminação Automática (Dry-Feeder)',
      totalAnimais: 2800,
      diasAlojamento: 110,
      pesoMedioKg: 104.2,
      gpdEsperadoGdia: 985,
      conversaoAlimentar: 2.38,
      temperaturaGalpaoC: 23.2,
      umidadeRelativaPct: 68,
      itghAmbiencia: 72.0,
    },
  ]);

  // Cálculos Consolidados da Granja
  const suinoculturaMetrics = useMemo(() => {
    const leitoesDesmamadosAno = Math.round(totalMatrizes * dfaLeitoesAno);
    const pesoTotalVivoKg = Number((leitoesDesmamadosAno * pesoAbateKg).toFixed(1));
    const faturamentoAnualReais = Number((pesoTotalVivoKg * precoKgVivoReais).toFixed(2));
    const custoNutricionalTotalReais = Number((pesoTotalVivoKg * custoNutricaoKgVivoReais).toFixed(2));
    const margemNutricionalReais = Number((faturamentoAnualReais - custoNutricionalTotalReais).toFixed(2));
    const margemPorSuinoReais = leitoesDesmamadosAno > 0 ? margemNutricionalReais / leitoesDesmamadosAno : 0;

    const totalAnimaisAlojados = lotes.reduce((acc, l) => acc + l.totalAnimais, 0);

    return {
      leitoesDesmamadosAno,
      pesoTotalVivoKg,
      faturamentoAnualReais,
      custoNutricionalTotalReais,
      margemNutricionalReais,
      margemPorSuinoReais,
      totalAnimaisAlojados,
    };
  }, [totalMatrizes, dfaLeitoesAno, pesoAbateKg, precoKgVivoReais, custoNutricaoKgVivoReais, lotes]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-pink-950/40 via-slate-900 to-slate-900 border border-pink-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-400">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Suinocultura de Precisão 4.0 & Bem-Estar Animal
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono border border-pink-500/30">
                    Ciclo Completo • DFA {dfaLeitoesAno} • ITGH Climatizado
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Monitoramento zootécnico por lote, alimentação de precisão (Dry-Feeder), índice de conforto térmico e margem sobre ração.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-800 border-emerald-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              {suinoculturaMetrics.leitoesDesmamadosAno.toLocaleString('pt-BR')} Leitões Desmamados / Ano
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Animais Alojados */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Plantel Ativo na Granja</span>
            <Activity className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-pink-400">
            {suinoculturaMetrics.totalAnimaisAlojados.toLocaleString('pt-BR')}{' '}
            <span className="text-xs font-normal text-slate-600">cabeças</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalMatrizes.toLocaleString('pt-BR')} matrizes ativas em gestação/maternidade.
          </p>
        </div>

        {/* KPI 2: Faturamento Anual */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Faturamento Bruto Anual</span>
            <Coins className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-700">
            R$ {suinoculturaMetrics.faturamentoAnualReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Preço: R$ {precoKgVivoReais.toFixed(2)}/kg vivo na terminação ({pesoAbateKg} kg abate).
          </p>
        </div>

        {/* KPI 3: Margem Nutricional */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Margem sobre Ração</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-700">
            R$ {suinoculturaMetrics.margemNutricionalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            R$ {suinoculturaMetrics.margemPorSuinoReais.toFixed(2)} de margem líquida por animal abatido.
          </p>
        </div>

        {/* KPI 4: Produtividade DFA */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Produtividade DFA</span>
            <Award className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-sky-700">
            {dfaLeitoesAno.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-600">leitões/matriz</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Padrão internacional de alta prolificidade (Embrapa Suínos).
          </p>
        </div>
      </div>

      {/* Grid de Lotes e Painel de Gestão */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Lotes Alojados */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-pink-400" />
                Galpões de Confinamento & Ambiência Térmica
              </h3>
              <p className="text-xs text-slate-600">
                Índice ITGH em tempo real, telemetria de sensores de CO₂, amônia e temperatura de bulbo úmido.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              {lotes.length} Galpões Monitorados
            </span>
          </div>

          <div className="space-y-3">
            {lotes.map((l) => {
              const isConforto = l.itghAmbiencia <= 74.0;

              return (
                <div
                  key={l.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono text-xs font-bold border border-pink-500/30">
                        {l.fase}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{l.galpao}</h4>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        isConforto
                          ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      ITGH: {l.itghAmbiencia} • {isConforto ? 'Conforto Térmico' : 'Estresse por Calor'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-600">
                    <span>Alojados: <strong className="text-white">{l.totalAnimais.toLocaleString('pt-BR')} cab</strong></span>
                    <span>Peso Médio: <strong className="text-pink-400">{l.pesoMedioKg} kg</strong></span>
                    <span>GPD: <strong className="text-emerald-700">{l.gpdEsperadoGdia} g/dia</strong></span>
                    <span>CA: <strong className="text-sky-700">{l.conversaoAlimentar}</strong></span>
                    <span>Ambiência: <strong className="text-white">{l.temperaturaGalpaoC}°C • {l.umidadeRelativaPct}% UR</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diretrizes Zootécnicas de Suinocultura 4.0 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-pink-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes de Manejo e Biosseguridade ABPA / MAPA:
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>
                <strong>Maternidade & Colostragem:</strong> Ingestão de colostro nas primeiras 6 horas de vida (mínimo 250 g/leitão) e aquecimento em escamoteador térmico a 32°C para erradicação do esmagamento.
              </li>
              <li>
                <strong>Controle de Ambiência (ITGH &lt; 74):</strong> Em fases de crescimento e terminação, a ventilação por pressão negativa e resfriamento evaporativo evitam a queda no consumo voluntário de ração provocada pelo calor.
              </li>
              <li>
                <strong>Economia Circular de Dejetos:</strong> Toda a fração líquida é direcionada a biodigestores anaeróbios para geração de biometano e fertirrigação agronômica (DLS) com monitoramento de fósforo.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Zootécnicos & Comerciais */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-700" />
            Parâmetros Zootécnicos & Preços
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Matrizes Ativas no Plantel</label>
              <input
                type="number"
                value={totalMatrizes}
                onChange={(e) => setTotalMatrizes(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Desmamados / Fêmea / Ano (DFA)</label>
              <input
                type="number"
                step="0.1"
                value={dfaLeitoesAno}
                onChange={(e) => setDfaLeitoesAno(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Peso Médio ao Abate (kg vivo)</label>
              <input
                type="number"
                step="0.5"
                value={pesoAbateKg}
                onChange={(e) => setPesoAbateKg(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Preço do Kg Vivo Suíno (R$)</label>
              <input
                type="number"
                step="0.10"
                value={precoKgVivoReais}
                onChange={(e) => setPrecoKgVivoReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-emerald-700 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Custo Nutricional por Kg Vivo (R$)</label>
              <input
                type="number"
                step="0.05"
                value={custoNutricaoKgVivoReais}
                onChange={(e) => setCustoNutricaoKgVivoReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-rose-700 font-mono font-bold"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Faturamento Anual:</span>
                <span className="text-amber-700 font-mono font-bold">
                  R$ {suinoculturaMetrics.faturamentoAnualReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Custo Total de Ração:</span>
                <span className="text-rose-700 font-mono font-bold">
                  -R$ {suinoculturaMetrics.custoNutricionalTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-white">Margem sobre Nutrição:</span>
                <span className="text-emerald-700 font-mono">
                  R$ {suinoculturaMetrics.margemNutricionalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
