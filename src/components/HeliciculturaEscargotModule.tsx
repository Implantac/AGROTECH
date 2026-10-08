import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  Box,
  Truck,
  Leaf,
  Filter,
  DollarSign,
  Activity,
  Award,
  Droplets,
  Heart
} from 'lucide-react';

interface ParqueHelicicola {
  id: string;
  identificacao: string;
  especie: 'CORNU_ASPERSUM_MAXIMA' | 'HELIX_ASPERSA_MULLER';
  areaM2: number;
  populacaoCaracois: number;
  pesoMedioGramas: number;
  umidadeRelativaPct: number;
  temperaturaC: number;
  extracaoMucinaLitrosMes: number;
  status: 'EM_ENGORDA' | 'REPRODUCAO_POSTURA' | 'CICLO_EXTRACAO_MUCINA';
}

export const HeliciculturaEscargotModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parques' | 'mucina' | 'gastronomia' | 'simulador'>('parques');

  // Parques de Criação de Caracóis
  const [parques] = useState<ParqueHelicicola[]>([
    {
      id: 'PARQUE-01',
      identificacao: 'Parque Helicícola 01 • Estufa Sombreada A',
      especie: 'CORNU_ASPERSUM_MAXIMA',
      areaM2: 400,
      populacaoCaracois: 60000,
      pesoMedioGramas: 25.5,
      umidadeRelativaPct: 86,
      temperaturaC: 20.5,
      extracaoMucinaLitrosMes: 75.0,
      status: 'CICLO_EXTRACAO_MUCINA',
    },
    {
      id: 'PARQUE-02',
      identificacao: 'Parque Helicícola 02 • Terminação Gourmet B',
      especie: 'CORNU_ASPERSUM_MAXIMA',
      areaM2: 400,
      populacaoCaracois: 60000,
      pesoMedioGramas: 24.8,
      umidadeRelativaPct: 88,
      temperaturaC: 19.8,
      extracaoMucinaLitrosMes: 72.0,
      status: 'EM_ENGORDA',
    },
  ]);

  // Simulador Econômico da Helicicultura
  const [areaParquesM2, setAreaParquesM2] = useState<number>(800);
  const [densidadeCaracoisM2, setDensidadeCaracoisM2] = useState<number>(150);
  const [pesoMedioCaracolVivoGramas, setPesoMedioCaracolVivoGramas] = useState<number>(25.0);
  const [rendimentoCarneEscargotPct, setRendimentoCarneEscargotPct] = useState<number>(40.0);
  const [litrosMucinaExtraidaPorM2Ano, setLitrosMucinaExtraidaPorM2Ano] = useState<number>(2.2);
  const [precoKgCarneEscargotReais, setPrecoKgCarneEscargotReais] = useState<number>(110.0);
  const [precoLitroMucinaPurificadaReais, setPrecoLitroMucinaPurificadaReais] = useState<number>(320.0);
  const [custoOperacionalPorM2AnoReais, setCustoOperacionalPorM2AnoReais] = useState<number>(280.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const totalCaracoisAtivos = areaParquesM2 * densidadeCaracoisM2;
    const biomassaVivaTotalKg = (totalCaracoisAtivos * pesoMedioCaracolVivoGramas) / 1000;
    const carneEscargotProntaKg = Number((biomassaVivaTotalKg * (rendimentoCarneEscargotPct / 100)).toFixed(1));
    const totalMucinaLitrosAno = Number((areaParquesM2 * litrosMucinaExtraidaPorM2Ano).toFixed(1));

    const receitaCarneReais = Number((carneEscargotProntaKg * precoKgCarneEscargotReais).toFixed(2));
    const receitaMucinaReais = Number((totalMucinaLitrosAno * precoLitroMucinaPurificadaReais).toFixed(2));
    const receitaBrutaTotalReais = Number((receitaCarneReais + receitaMucinaReais).toFixed(2));

    const custoTotalAnoReais = Number((areaParquesM2 * custoOperacionalPorM2AnoReais).toFixed(2));
    const lucroLiquidoAnoReais = Number((receitaBrutaTotalReais - custoTotalAnoReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoAnoReais / (receitaBrutaTotalReais || 1)) * 100).toFixed(1));

    return {
      totalCaracoisAtivos,
      biomassaVivaTotalKg,
      carneEscargotProntaKg,
      totalMucinaLitrosAno,
      receitaCarneReais,
      receitaMucinaReais,
      receitaBrutaTotalReais,
      custoTotalAnoReais,
      lucroLiquidoAnoReais,
      margemLiquidaPct,
    };
  }, [
    areaParquesM2,
    densidadeCaracoisM2,
    pesoMedioCaracolVivoGramas,
    rendimentoCarneEscargotPct,
    litrosMucinaExtraidaPorM2Ano,
    precoKgCarneEscargotReais,
    precoLitroMucinaPurificadaReais,
    custoOperacionalPorM2AnoReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-amber-950/40 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-emerald-500/20 text-emerald-800 border border-emerald-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Módulo 92 • Helicicultura & Escargot
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-cyan-500/20 text-sky-800 border border-cyan-500/30 rounded-full">
                Cornu aspersum • Mucina Cosmética & Alta Gastronomia
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              🐌 Helicicultura Comercial & Mucina Purificada
            </h2>
            <p className="text-sm text-slate-900 max-w-3xl leading-relaxed">
              Criação intensiva de caracóis terrestres comestíveis com duplo aproveitamento: extração não letal por ozônio de secreção bioativa (*snail mucin* - rica em alantoína e ácido glicólico para a indústria cosmética) e carne nobre de escargot.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Escargot Limpo</span>
              <span className="text-xl font-black text-amber-700">1.200 kg</span>
              <span className="text-[10px] text-slate-600 block mt-0.5">40% Rendimento</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Mucina Pura</span>
              <span className="text-xl font-black text-sky-700">1.760 L</span>
              <span className="text-[10px] text-sky-700/80 block mt-0.5">Grau Cosmético</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">População nos Parques</span>
            <Activity className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">120.000 caracóis</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            150 caracóis / m²
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Mucina Purificada (L)</span>
            <Droplets className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black text-sky-700">1.760 Litros</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            R$ 320,00/L para Indústria Dermocosmética
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faturamento Total</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-700">R$ 695.200,00</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Carne Gourmet + Cosméticos
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <Award className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-black text-teal-700">R$ 471.200,00</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Margem Líquida de 67.8%
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('parques')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'parques'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Leaf className="w-4 h-4" />
          1. Parques Helicícolas & Nebulização
        </button>

        <button
          onClick={() => setActiveTab('mucina')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'mucina'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          2. Extração de Mucina Cosmética
        </button>

        <button
          onClick={() => setActiveTab('gastronomia')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'gastronomia'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Award className="w-4 h-4" />
          3. Carne Nobre de Escargot
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico
        </button>
      </div>

      {/* Conteúdo Aba 1: Parques */}
      {activeTab === 'parques' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-emerald-700" />
              Monitoramento dos Parques com Painéis Verticais de Madeira
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Cultivo sob sombrites de 80% com barreiras perimetrais antifuga (faixas de sal ou telas elétricas de 12V). Microaspersão noturna programada mantendo a umidade necessária para atividade alimentar e acasalamento.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Parque / Estufa</th>
                    <th className="py-3 px-3">Espécie</th>
                    <th className="py-3 px-3">População</th>
                    <th className="py-3 px-3">Peso Médio</th>
                    <th className="py-3 px-3">Umidade / Temp</th>
                    <th className="py-3 px-3">Mucina Mensal</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {parques.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{p.identificacao}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{p.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-emerald-800 font-semibold">{p.especie}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-800">{p.populacaoCaracois.toLocaleString()} cab</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-amber-700">{p.pesoMedioGramas} g</td>
                      <td className="py-3.5 px-3 font-mono text-sky-700">{p.umidadeRelativaPct}% • {p.temperaturaC}°C</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-teal-700">{p.extracaoMucinaLitrosMes} L/mês</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Mucina */}
      {activeTab === 'mucina' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-700" />
              Tecnologia MullerOne de Extração Não-Letal
            </h3>
            <p className="text-xs text-slate-600">
              O processo estimula as glândulas mucosas dos caracóis através de névoa de ozônio medicinal e vibração rotativa suave sem estresse nem lesão, preservando a vida do animal para múltiplos ciclos:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Alantoína Natural Purificada</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Promove regeneração tecidual acelerada e proliferação celular dérmica.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Ácido Glicólico e Elastina</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Microesfoliação natural e atenuação de rugas de expressão com alta demanda internacional.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              Controle de Pureza e Filtragem
            </h3>
            <p className="text-xs text-slate-600">
              Microfiltração esterilizante em membrana de 0,22 micras:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Teor de Pureza Cosmética:</span>
                <span className="font-mono font-bold text-sky-700">&gt; 99.2% livre de bactérias</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Frequência de Extração por Lote:</span>
                <span className="font-mono font-bold text-emerald-700">A cada 30 a 45 dias</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Gastronomia */}
      {activeTab === 'gastronomia' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-700" />
              Carne Nobre de Escargot na Alta Gastronomia
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Após o período produtivo de mucina, os animais selecionados passam por 5 dias de jejum e purga em caixas ventiladas antes do processamento térmico (cozimento em court-bouillon), sendo comercializados congelados ou pré-recheados à moda da Borgonha (*Beurre d'escargot*).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Proteína Nobre</span>
                <span className="text-2xl font-black text-slate-900 font-mono">16.3%</span>
                <span className="text-[11px] text-amber-700 block">Alta digestibilidade</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Gordura Saturada</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">&lt; 1.0%</span>
                <span className="text-[11px] text-slate-600 block">Carne magra saudável</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Preço de Mercado</span>
                <span className="text-2xl font-black text-sky-700 font-mono">R$ 110,00 / kg</span>
                <span className="text-[11px] text-slate-600 block">Venda direta a bistrôs</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              Parâmetros da Helicicultura
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Área dos Parques (m²)</span>
                <span className="font-mono text-emerald-700">{areaParquesM2} m²</span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="100"
                value={areaParquesM2}
                onChange={(e) => setAreaParquesM2(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Preço Carne Escargot (R$/kg)</span>
                <span className="font-mono text-slate-800">R$ {precoKgCarneEscargotReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="70.0"
                max="180.0"
                step="5.0"
                value={precoKgCarneEscargotReais}
                onChange={(e) => setPrecoKgCarneEscargotReais(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Preço Mucina Cosmética (R$/L)</span>
                <span className="font-mono text-sky-700">R$ {precoLitroMucinaPurificadaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="180.0"
                max="550.0"
                step="10.0"
                value={precoLitroMucinaPurificadaReais}
                onChange={(e) => setPrecoLitroMucinaPurificadaReais(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Custo Operacional por m²/ano</span>
                <span className="font-mono text-rose-700">R$ {custoOperacionalPorM2AnoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="150.0"
                max="450.0"
                step="10.0"
                value={custoOperacionalPorM2AnoReais}
                onChange={(e) => setCustoOperacionalPorM2AnoReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              Retorno Financeiro da Helicicultura Comercial
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Escargot Limpo</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {(metricas.carneEscargotProntaKg / 1000).toFixed(2)} ton
                </span>
                <span className="text-[10px] text-slate-600 block">{rendimentoCarneEscargotPct}% rendimento</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Mucina Pura</span>
                <span className="font-mono font-bold text-sky-700 text-base">
                  {metricas.totalMucinaLitrosAno.toFixed(0)} L
                </span>
                <span className="text-[10px] text-sky-700/80 block">Cosméticos</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  R$ {(metricas.receitaBrutaTotalReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-slate-600 block">Carne + Mucina</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  R$ {(metricas.lucroLiquidoAnoReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-700/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Venda de Carne de Escargot ({metricas.carneEscargotProntaKg.toLocaleString()} kg @ R$ {precoKgCarneEscargotReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-slate-900">
                  R$ {metricas.receitaCarneReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Venda de Mucina Cosmética Purificada ({metricas.totalMucinaLitrosAno.toLocaleString()} L @ R$ {precoLitroMucinaPurificadaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-sky-700">
                  + R$ {metricas.receitaMucinaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custo com Alimentação Rica em Cálcio, Energia e Nebulização:</span>
                <span className="font-mono font-bold text-rose-700">
                  - R$ {metricas.custoTotalAnoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-50 px-3 rounded-lg border border-emerald-200">
                <span className="text-slate-900">Lucro Líquido Anual Consolidado:</span>
                <span className="font-mono text-emerald-800">
                  R$ {metricas.lucroLiquidoAnoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeliciculturaEscargotModule;
