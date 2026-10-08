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
  Zap,
  Droplets,
  ThermometerSnowflake
} from 'lucide-react';

interface LoteBatata {
  id: string;
  identificacao: string;
  variedade: 'Atlantic (Chips)' | 'Asterix (Fritas/Massa)' | 'Markies (Palito Congelado)';
  areaHa: number;
  produtividadeTonHa: number;
  gravidadeEspecifica: number;
  materiaSecaPct: number;
  acucaresRedutoresPct: number;
  statusProcessamento: 'APROVADO_CHIPS_PREMIUM' | 'APROVADO_PALITO' | 'MESA_IN_NATURA';
}

export const BataticulturaChipsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'talhoes' | 'gravidade' | 'requeima' | 'simulador'>('talhoes');

  // Lotes de Bataticultura
  const [lotes] = useState<LoteBatata[]>([
    {
      id: 'BATATA-TALHAO-01',
      identificacao: 'Pivô Batata 01 • Cristalina GO (Variedade Atlantic)',
      variedade: 'Atlantic (Chips)',
      areaHa: 50,
      produtividadeTonHa: 42.5,
      gravidadeEspecifica: 1.0845,
      materiaSecaPct: 21.6,
      acucaresRedutoresPct: 0.08,
      statusProcessamento: 'APROVADO_CHIPS_PREMIUM',
    },
    {
      id: 'BATATA-TALHAO-02',
      identificacao: 'Pivô Batata 02 • Perdizes MG (Variedade Asterix)',
      variedade: 'Asterix (Fritas/Massa)',
      areaHa: 45,
      produtividadeTonHa: 46.0,
      gravidadeEspecifica: 1.0790,
      materiaSecaPct: 20.3,
      acucaresRedutoresPct: 0.12,
      statusProcessamento: 'APROVADO_PALITO',
    },
  ]);

  // Simulador Econômico da Bataticultura
  const [areaCultivoHa, setAreaCultivoHa] = useState<number>(50);
  const [produtividadeTonHa, setProdutividadeTonHa] = useState<number>(42.0);
  const [precoTonContratoChipsReais, setPrecoTonContratoChipsReais] = useState<number>(1950.0);
  const [custoTotalHaReais, setCustoTotalHaReais] = useState<number>(48500.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const producaoTotalTon = areaCultivoHa * produtividadeTonHa;
    const receitaBrutaReais = Number((producaoTotalTon * precoTonContratoChipsReais).toFixed(2));
    const custoTotalReais = Number((areaCultivoHa * custoTotalHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaReais || 1)) * 100).toFixed(1));
    const lucroPorHaReais = Number((lucroLiquidoReais / (areaCultivoHa || 1)).toFixed(2));

    return {
      producaoTotalTon,
      receitaBrutaReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
      lucroPorHaReais,
    };
  }, [
    areaCultivoHa,
    produtividadeTonHa,
    precoTonContratoChipsReais,
    custoTotalHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-yellow-950/60 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-amber-500/20 text-amber-800 border border-amber-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                Módulo 101 • Bataticultura & Chips Industrial
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-cyan-500/20 text-sky-800 border border-cyan-500/30 rounded-full">
                Gravidade Específica &gt; 1.080 • Requeima (Phytophthora)
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              🥔 Bataticultura de Precisão, Gravidade Específica & Requeima
            </h2>
            <p className="text-sm text-slate-900 max-w-3xl leading-relaxed">
              Gestão agronômica e industrial da batata para processamento de chips e palitos congelados. Medição de gravidade específica e matéria seca por balança hidrostática, teores de açúcares redutores (prevenção de escurecimento Maillard) e modelos preditivos de requeima.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Produção Total</span>
              <span className="text-xl font-black text-amber-700">2.100 ton</span>
              <span className="text-[10px] text-slate-600 block mt-0.5">50 ha @ 42 t/ha</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Faturamento</span>
              <span className="text-xl font-black text-emerald-700">R$ 4,09M</span>
              <span className="text-[10px] text-emerald-700/80 block mt-0.5">Contrato Industrial</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gravidade Específica</span>
            <Activity className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">1.0845 GE</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            21.6% Matéria Seca (Chips Premium)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Açúcares Redutores</span>
            <Sparkles className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black text-sky-700">0.08% Glicose/Frutose</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Zero Manchas Escuras na Fritura
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Produtividade Média</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-700">42.0 t / ha</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Ciclo de 115 dias sob Pivô
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-black text-teal-700">R$ 1.670.000,00</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            R$ 33.400,00 por hectare
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('talhoes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'talhoes'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Leaf className="w-4 h-4" />
          1. Talhões & Variedades
        </button>

        <button
          onClick={() => setActiveTab('gravidade')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'gravidade'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          2. Balança Hidrostática (GE & MS)
        </button>

        <button
          onClick={() => setActiveTab('requeima')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'requeima'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          3. Alerta de Requeima (Phytophthora)
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          4. Simulador Econômico
        </button>
      </div>

      {/* Conteúdo Aba 1: Talhões */}
      {activeTab === 'talhoes' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-amber-700" />
              Lotes em Cultivo Sob Pivô Central
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              A batata para chips exige solos arenosos e friáveis, drenagem perfeita e fertilização potássica preferencialmente à base de sulfato de potássio (K₂SO₄) para não deprimir a gravidade específica com excesso de cloro.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Talhão / Local</th>
                    <th className="py-3 px-3">Variedade</th>
                    <th className="py-3 px-3">Área (ha)</th>
                    <th className="py-3 px-3">Produtividade</th>
                    <th className="py-3 px-3">Gravidade Específica</th>
                    <th className="py-3 px-3">Matéria Seca</th>
                    <th className="py-3 px-3">Açúcares</th>
                    <th className="py-3 px-3">Classificação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {lotes.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{l.identificacao}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{l.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-amber-800 font-semibold">{l.variedade}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-800">{l.areaHa} ha</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-700 font-bold">{l.produtividadeTonHa} t/ha</td>
                      <td className="py-3.5 px-3 font-mono text-sky-700 font-bold">{l.gravidadeEspecifica}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-800">{l.materiaSecaPct}%</td>
                      <td className="py-3.5 px-3 font-mono text-slate-900">{l.acucaresRedutoresPct}%</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30">
                          {l.statusProcessamento}
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

      {/* Conteúdo Aba 2: Gravidade */}
      {activeTab === 'gravidade' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-700" />
              Balança Hidrostática & Matéria Seca
            </h3>
            <p className="text-xs text-slate-600">
              A gravidade específica determina a taxa de absorção de óleo na fritura e o rendimento na indústria de chips:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">GE &gt; 1.080 (Alto Rendimento de Chips)</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Menor absorção de óleo vegetal, crocância superior e 1 kg de batata crua rende até 250 g de chips secos.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">GE &lt; 1.070 (Inapropriado para Indústria)</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Batatas encharcadas de óleo, textura mole e penalização financeira severa na balança de entrega.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              Prevenção da Reação de Maillard
            </h3>
            <p className="text-xs text-slate-600">
              Controle de temperatura na armazenagem para evitar a quebra do amido em açúcares livres:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Temperatura Ideal de Câmara:</span>
                <span className="font-mono font-bold text-amber-700">8.0°C a 10.0°C (Evita Cold-Sweetening)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Anti-Brotamento Sustentável:</span>
                <span className="font-mono font-bold text-emerald-700">Óleo de Hortelã (Spearmint)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Requeima */}
      {activeTab === 'requeima' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-rose-700" />
              Previsão Epidemiológica de Requeima (Phytophthora infestans)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              A requeima é a doença mais devastadora da bataticultura mundial, capaz de dizimar 100% de uma lavoura em menos de 5 dias quando as condições meteorológicas de molhamento foliar prolongado (superior a 10 horas) e temperatura entre 15°C e 22°C coincidem.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Molhamento Foliar Atual</span>
                <span className="text-2xl font-black text-slate-900 font-mono">3.2 Horas</span>
                <span className="text-[11px] text-emerald-700 block">Condição de Baixo Risco</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Temperatura Média Noturna</span>
                <span className="text-2xl font-black text-amber-700 font-mono">18.4°C</span>
                <span className="text-[11px] text-slate-600 block">Faixa de Atenção Térmica</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Recomendação de Manejo</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">Preventivo</span>
                <span className="text-[11px] text-slate-600 block">Mancozebe + Fluazinam</span>
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
              <DollarSign className="w-5 h-5 text-amber-700" />
              Parâmetros da Safra de Batata
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Área Cultivada (ha)</span>
                <span className="font-mono text-amber-700">{areaCultivoHa} hectares</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={areaCultivoHa}
                onChange={(e) => setAreaCultivoHa(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Produtividade (t/ha)</span>
                <span className="font-mono text-sky-700">{produtividadeTonHa} t/ha</span>
              </div>
              <input
                type="range"
                min="25"
                max="60"
                step="1"
                value={produtividadeTonHa}
                onChange={(e) => setProdutividadeTonHa(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Preço Contrato Indústria (R$/ton)</span>
                <span className="font-mono text-emerald-700">R$ {precoTonContratoChipsReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1200"
                max="3000"
                step="50"
                value={precoTonContratoChipsReais}
                onChange={(e) => setPrecoTonContratoChipsReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Custo de Produção por Ha (R$)</span>
                <span className="font-mono text-rose-700">R$ {custoTotalHaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="25000"
                max="75000"
                step="1000"
                value={custoTotalHaReais}
                onChange={(e) => setCustoTotalHaReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              Retorno Financeiro da Bataticultura
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Produção Total</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {metricas.producaoTotalTon.toLocaleString()} ton
                </span>
                <span className="text-[10px] text-slate-600 block">{areaCultivoHa} ha</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-amber-700 text-base">
                  R$ {(metricas.receitaBrutaReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-amber-700/80 block">Venda Indústria</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  R$ {(metricas.lucroLiquidoReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-emerald-700/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Lucro por Ha</span>
                <span className="font-mono font-bold text-sky-700 text-base">
                  R$ {(metricas.lucroPorHaReais / 1000).toFixed(1)}k
                </span>
                <span className="text-[10px] text-sky-700/80 block">Por Hectare</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Faturamento Bruto ({metricas.producaoTotalTon.toLocaleString()} t @ R$ {precoTonContratoChipsReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-slate-900">
                  R$ {metricas.receitaBrutaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custos Totais de Batata-Semente, Fertirrigação e Defensivos ({areaCultivoHa} ha @ R$ {custoTotalHaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-rose-700">
                  - R$ {metricas.custoTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-amber-50 px-3 rounded-lg border border-amber-200">
                <span className="text-slate-900">Lucro Líquido Consolidado da Safra:</span>
                <span className="font-mono text-emerald-800">
                  R$ {metricas.lucroLiquidoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BataticulturaChipsModule;
