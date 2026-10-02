import React, { useState, useMemo } from 'react';
import {
  Coffee,
  Award,
  Sparkles,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sun,
  Layers,
  Info
} from 'lucide-react';

interface LoteCafeEspecial {
  id: string;
  glebaNome: string;
  variedade: string; // Catuaí Amarelo, Bourbon Amarelo, Arara, Mundo Novo
  altitudeMetros: number;
  pontuacaoSca: number; // 80 - 92 pts
  perfilSensorial: string;
  processoPosColheita: 'NATURAL' | 'CD_CEREJA_DESCASCADO' | 'FERMENTACAO_INDUZIDA';
  sacasLote: number;
  statusSecagem: 'TERREIRO_SUSPENSO' | 'SECADOR_ROTATIVO' | 'ARMAZENADO_TULHA';
}

export const CafeiculturaEspecialModule: React.FC = () => {
  // Parâmetros da Safra de Café
  const [areaCafeHa, setAreaCafeHa] = useState<number>(120);
  const [produtividadeSacasHa, setProdutividadeSacasHa] = useState<number>(38); // 38 sc/ha beneficiadas
  const [precoCommoditySacaReais, setPrecoCommoditySacaReais] = useState<number>(1350.0); // Preço base NYBOT C (R$/sc)

  // Amostragem de Maturação Pré-Colheita (%)
  const [frutosCerejaPct, setFrutosCerejaPct] = useState<number>(76.0); // Frutos maduros ideais
  const [frutosVerdesPct, setFrutosVerdesPct] = useState<number>(9.0);  // Frutos verdes (devem ser < 12%)
  const [frutosPassaBoyaPct, setFrutosPassaBoyaPct] = useState<number>(15.0); // Frutos secos na planta

  // Lotes Especiais Homologados
  const [lotes, setLotes] = useState<LoteCafeEspecial[]>([
    {
      id: 'LOT-CAF-01',
      glebaNome: 'Gleba do Mirante (Pico 1.250m)',
      variedade: 'Bourbon Amarelo Seleção',
      altitudeMetros: 1250,
      pontuacaoSca: 87.5,
      perfilSensorial: 'Fragrância floral de jasmim, notas de pêssego, mel e acidez cítrica brilhante.',
      processoPosColheita: 'CD_CEREJA_DESCASCADO',
      sacasLote: 180,
      statusSecagem: 'TERREIRO_SUSPENSO',
    },
    {
      id: 'LOT-CAF-02',
      glebaNome: 'Gleba da Nascente (Pico 1.180m)',
      variedade: 'Arara IAC 514',
      altitudeMetros: 1180,
      pontuacaoSca: 85.0,
      perfilSensorial: 'Notas marcantes de chocolate belga, caramelo toffee e corpo cremoso aveludado.',
      processoPosColheita: 'NATURAL',
      sacasLote: 220,
      statusSecagem: 'SECADOR_ROTATIVO',
    },
    {
      id: 'LOT-CAF-03',
      glebaNome: 'Gleba da Represa (1.050m)',
      variedade: 'Catuaí Vermelho IAC 144',
      altitudeMetros: 1050,
      pontuacaoSca: 82.5,
      perfilSensorial: 'Aroma de nozes tostadas, açúcar mascavo e finalização doce e equilibrada.',
      processoPosColheita: 'NATURAL',
      sacasLote: 150,
      statusSecagem: 'ARMAZENADO_TULHA',
    },
  ]);

  // Cálculos Técnicos do Motor de Cafeicultura Especial
  const cafeMetrics = useMemo(() => {
    // 1. Diagnóstico de Maturação
    const isMaturacaoIdeal = frutosCerejaPct >= 70.0 && frutosVerdesPct <= 10.0;

    // 2. Produção Total da Propriedade (sacas 60kg)
    const totalSacasProduzidas = areaCafeHa * produtividadeSacasHa;

    // 3. Média Ponderada da Pontuação SCA
    const somaPontosPonderados = lotes.reduce((acc, l) => acc + l.pontuacaoSca * l.sacasLote, 0);
    const totalSacasLotes = lotes.reduce((acc, l) => acc + l.sacasLote, 0);
    const mediaPontuacaoSca = totalSacasLotes > 0 ? somaPontosPonderados / totalSacasLotes : 80.0;

    // 4. Ágio Comercial por Qualidade SCA
    let agioEspecialPct = 0.0;
    if (mediaPontuacaoSca >= 88.0) agioEspecialPct = 60.0; // Padrão Excepcional Microlote
    else if (mediaPontuacaoSca >= 85.0) agioEspecialPct = 35.0; // Padrão Excelente
    else if (mediaPontuacaoSca >= 80.0) agioEspecialPct = 18.0; // Padrão Muito Bom Especial

    // 5. Cotação Final com Ágio de Cafés Especiais
    const precoFinalSacaEspecial = precoCommoditySacaReais * (1 + agioEspecialPct / 100.0);

    // 6. Faturamento Bruto e Valor Agregado Extra
    const receitaBaseCommodity = totalSacasProduzidas * precoCommoditySacaReais;
    const receitaComEspecial = totalSacasProduzidas * precoFinalSacaEspecial;
    const valorAgregadoExtraReais = receitaComEspecial - receitaBaseCommodity;
    const faturamentoPorHaReais = receitaComEspecial / areaCafeHa;

    return {
      isMaturacaoIdeal,
      totalSacasProduzidas,
      mediaPontuacaoSca,
      agioEspecialPct,
      precoFinalSacaEspecial,
      receitaBaseCommodity,
      receitaComEspecial,
      valorAgregadoExtraReais,
      faturamentoPorHaReais,
    };
  }, [areaCafeHa, produtividadeSacasHa, precoCommoditySacaReais, frutosCerejaPct, frutosVerdesPct, lotes]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Cafeicultura de Precisão & Classificação SCA Especial
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                    SCA &gt; 80 Pts • Q-Grader
                  </span>
                </h2>
                <p className="text-sm text-[#66736A]">
                  Maturação pré-colheita (cereja/verde), perfil sensorial, terreiro suspenso e ágio comercial sobre a cotação de bolsa.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border flex items-center gap-1.5 ${
                cafeMetrics.isMaturacaoIdeal
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Maturação: {frutosCerejaPct}% Cereja ({cafeMetrics.isMaturacaoIdeal ? 'Ponto Ideal' : 'Ajustar Janela'})
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Pontuação Média SCA */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Pontuação Média (SCA)</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            {cafeMetrics.mediaPontuacaoSca.toFixed(1)}{' '}
            <span className="text-xs font-normal text-[#66736A]">pontos SCA</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Classificação: Bebida Especial (+{cafeMetrics.agioEspecialPct}% ágio).
          </p>
        </div>

        {/* KPI 2: Preço Médio da Saca */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Preço da Saca Especial</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            R$ {cafeMetrics.precoFinalSacaEspecial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{' '}
            <span className="text-xs font-normal text-[#66736A]">/ sc 60kg</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Base comercial: R$ {precoCommoditySacaReais.toFixed(2)}/sc.
          </p>
        </div>

        {/* KPI 3: Valor Agregado Extra */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Valor Agregado da Qualidade</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            +R$ {cafeMetrics.valorAgregadoExtraReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Ganho financeiro extra obtido pelo manejo de bebida.
          </p>
        </div>

        {/* KPI 4: Faturamento por Hectare */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Faturamento Global / ha</span>
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            R$ {cafeMetrics.faturamentoPorHaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-emerald-400">/ ha</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total safra: {cafeMetrics.totalSacasProduzidas.toLocaleString('pt-BR')} sacas em {areaCafeHa} ha.
          </p>
        </div>
      </div>

      {/* Grid Principal: Lotes Especiais e Parâmetros de Maturação */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Lotes Homologados e Notas de Prova */}
        <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-400" />
                Microlotes & Laudos Sensoriais de Prova (Q-Grader)
              </h3>
              <p className="text-xs text-[#66736A]">
                Rastreabilidade de gleba, variedade, altitude e perfil aromático na xícara.
              </p>
            </div>
            <span className="text-xs font-mono text-[#66736A]">
              {lotes.length} Lotes Certificados
            </span>
          </div>

          <div className="space-y-3">
            {lotes.map((l) => (
              <div
                key={l.id}
                className="p-4 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                      {l.pontuacaoSca.toFixed(1)} PTS
                    </span>
                    <h4 className="text-xs font-bold text-white">{l.glebaNome}</h4>
                  </div>
                  <span className="text-[11px] font-mono text-[#66736A]">
                    {l.sacasLote} sacas • {l.variedade} • {l.altitudeMetros}m altitude
                  </span>
                </div>

                <p className="text-xs text-amber-200/90 italic bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/30">
                  "{l.perfilSensorial}"
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono text-[#66736A]">
                  <span>Processo: <strong className="text-[#26332A]">{l.processoPosColheita.replace(/_/g, ' ')}</strong></span>
                  <span>Secagem: <strong className="text-cyan-400">{l.statusSecagem.replace(/_/g, ' ')}</strong></span>
                  <span>Ágio estimado: <strong className="text-emerald-400">+35% a +60%</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Técnico de Boas Práticas da Cafeicultura */}
          <div className="p-4 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Protocolos de Qualidade no Pós-Colheita:
            </div>
            <ul className="list-disc list-inside text-[#66736A] space-y-1">
              <li>
                <strong>Colheita no Ponto Ótimo:</strong> Colher com mais de 70% de frutos cereja evita a adstringência de grãos verdes e fermentações acéticas indesejadas de frutos bóia/chupado.
              </li>
              <li>
                <strong>Secagem Lenta e Homogênea:</strong> O revolvimento constante em terreiro suspenso conduz a umidade de 60% para 11,2% de forma suave, estabilizando os precursores aromáticos de açúcares e ácidos orgânicos.
              </li>
              <li>
                <strong>Descanso em Tulha de Madeira:</strong> Mínimo de 30 a 45 dias de descanso em pergaminho para homogeneização da umidade antes do beneficiamento e rebenefício.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros de Maturação e Cotação */}
        <div className="bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            Parâmetros da Safra
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#66736A] font-medium block mb-1">Área em Produção (ha)</label>
              <input
                type="number"
                value={areaCafeHa}
                onChange={(e) => setAreaCafeHa(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#66736A] font-medium block mb-1">Produtividade Média (sc/ha)</label>
              <input
                type="number"
                value={produtividadeSacasHa}
                onChange={(e) => setProdutividadeSacasHa(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#66736A] font-medium">% Frutos Cereja (Maduros)</span>
                <span className="text-emerald-400 font-mono font-bold">{frutosCerejaPct}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="1"
                value={frutosCerejaPct}
                onChange={(e) => setFrutosCerejaPct(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#66736A] font-medium">% Frutos Verdes (Adstringentes)</span>
                <span className={frutosVerdesPct <= 10 ? 'text-[#26332A] font-mono font-bold' : 'text-rose-400 font-mono font-bold'}>
                  {frutosVerdesPct}% (Meta &lt; 10%)
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={frutosVerdesPct}
                onChange={(e) => setFrutosVerdesPct(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[#66736A] font-medium block mb-1">Cotação Commodity Base (R$/saca 60kg)</label>
              <input
                type="number"
                value={precoCommoditySacaReais}
                onChange={(e) => setPrecoCommoditySacaReais(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-1.5 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-[#EAF4E7] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#66736A]">Receita Padrão Commodity:</span>
                <span className="text-[#26332A] font-mono">
                  R$ {cafeMetrics.receitaBaseCommodity.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736A]">Receita c/ Ágio Especial:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  R$ {cafeMetrics.receitaComEspecial.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#EAF4E7] pt-2 font-bold">
                <span className="text-white">Bônus Extra de Qualidade:</span>
                <span className="text-cyan-400 font-mono">
                  +R$ {cafeMetrics.valorAgregadoExtraReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
