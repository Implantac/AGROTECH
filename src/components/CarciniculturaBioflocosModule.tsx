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
  Waves,
  Scale
} from 'lucide-react';

interface TanqueBFT {
  id: string;
  identificacao: string;
  volumeM3: number;
  populacaoEstocada: number;
  diasCultivo: number;
  pesoMedioGramas: number;
  oxigenioDissolvidoMgL: number;
  amoniaTanMgL: number;
  nitritoMgL: number;
  coneImhoffMl: number;
  relacaoCN: number;
  statusAgua: 'BIOFLOCO_EQUILIBRADO' | 'ADICIONAR_MELASSO' | 'ALERTA_OXIGÊNIO';
}

export const CarciniculturaBioflocosModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tanques_bft' | 'manejo_carbono' | 'biometria' | 'simulador'>('tanques_bft');

  // Tanques de Carcinicultura BFT
  const [tanques] = useState<TanqueBFT[]>([
    {
      id: 'TANQUE-BFT-01',
      identificacao: 'Tanque Circular 01 • Estufa Climatizada A',
      volumeM3: 300,
      populacaoEstocada: 66000,
      diasCultivo: 72,
      pesoMedioGramas: 11.8,
      oxigenioDissolvidoMgL: 6.2,
      amoniaTanMgL: 0.15,
      nitritoMgL: 0.35,
      coneImhoffMl: 32,
      relacaoCN: 14.2,
      statusAgua: 'BIOFLOCO_EQUILIBRADO',
    },
    {
      id: 'TANQUE-BFT-02',
      identificacao: 'Tanque Circular 02 • Terminação BFT',
      volumeM3: 300,
      populacaoEstocada: 66000,
      diasCultivo: 95,
      pesoMedioGramas: 14.6,
      oxigenioDissolvidoMgL: 5.8,
      amoniaTanMgL: 0.22,
      nitritoMgL: 0.48,
      coneImhoffMl: 38,
      relacaoCN: 13.8,
      statusAgua: 'BIOFLOCO_EQUILIBRADO',
    },
    {
      id: 'TANQUE-BFT-03',
      identificacao: 'Tanque Circular 03 • Berçário Inicial',
      volumeM3: 300,
      populacaoEstocada: 66000,
      diasCultivo: 25,
      pesoMedioGramas: 3.2,
      oxigenioDissolvidoMgL: 6.5,
      amoniaTanMgL: 0.08,
      nitritoMgL: 0.12,
      coneImhoffMl: 22,
      relacaoCN: 15.0,
      statusAgua: 'BIOFLOCO_EQUILIBRADO',
    },
  ]);

  // Simulador de Carcinicultura
  const [volumeTotalM3, setVolumeTotalM3] = useState<number>(1200);
  const [densidadeM3, setDensidadeM3] = useState<number>(220);
  const [ciclosAno, setCiclosAno] = useState<number>(3.5);
  const [taxaSobrevivenciaPct, setTaxaSobrevivenciaPct] = useState<number>(82.0);
  const [pesoDespescaGramas, setPesoDespescaGramas] = useState<number>(14.5);
  const [precoKgCamaraoReais, setPrecoKgCamaraoReais] = useState<number>(34.0);
  const [custoTotalKgReais, setCustoTotalKgReais] = useState<number>(18.50);

  // Cálculos do Módulo
  const metricasCarcinicultura = useMemo(() => {
    const camaroesEstocadosCiclo = volumeTotalM3 * densidadeM3;
    const camaroesDespescadosCiclo = Math.round(camaroesEstocadosCiclo * (taxaSobrevivenciaPct / 100));
    const biomassaDespescadaCicloKg = Number((camaroesDespescadosCiclo * (pesoDespescaGramas / 1000)).toFixed(1));
    const biomassaDespescadaAnualKg = Number((biomassaDespescadaCicloKg * ciclosAno).toFixed(1));

    const receitaBrutaAnual = Number((biomassaDespescadaAnualKg * precoKgCamaraoReais).toFixed(2));
    const custoTotalAnual = Number((biomassaDespescadaAnualKg * custoTotalKgReais).toFixed(2));
    const lucroLiquidoAnual = Number((receitaBrutaAnual - custoTotalAnual).toFixed(2));
    const produtividadeM3AnoKg = Number((biomassaDespescadaAnualKg / (volumeTotalM3 || 1)).toFixed(2));

    return {
      camaroesEstocadosCiclo,
      camaroesDespescadosCiclo,
      biomassaDespescadaCicloKg,
      biomassaDespescadaAnualKg,
      receitaBrutaAnual,
      custoTotalAnual,
      lucroLiquidoAnual,
      produtividadeM3AnoKg,
    };
  }, [volumeTotalM3, densidadeM3, ciclosAno, taxaSobrevivenciaPct, pesoDespescaGramas, precoKgCamaraoReais, custoTotalKgReais]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-950 border border-teal-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5" />
                Módulo 86 • Carcinicultura de Precisão & Camarão BFT
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 rounded-full">
                Biofloc Technology • Zero Efluente
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              🦐 Carcinicultura BFT & Litopenaeus vannamei
            </h2>
            <p className="text-sm text-slate-900 max-w-3xl leading-relaxed">
              Cultivo superintensivo de camarão marinho em estufas cobertas com tecnologia de bioflocos bacterianos (BFT): relação C:N equilibrada, conversão de amônia em alimento proteico vivo, aeração difusa contínua e biosseguridade total contra Mancha Branca.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Volume Útil</span>
              <span className="text-xl font-black text-teal-700">1.200 m³</span>
              <span className="text-[10px] text-slate-600 block mt-0.5">4 Tanques BFT</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Despesca Anual</span>
              <span className="text-xl font-black text-emerald-700">10.986 kg</span>
              <span className="text-[10px] text-emerald-700/80 block mt-0.5">3.5 Ciclos/Ano</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-teal-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Relação C:N Atual</span>
            <Activity className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">14.0 : 1</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Amônia Segura (&lt; 0.3 mg/L)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-teal-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Densidade de Povoamento</span>
            <Waves className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black text-sky-700">220 cam / m³</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Superintensivo em Estufa Plástica
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-teal-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Conversão Alimentar (CA)</span>
            <Scale className="w-4 h-4 text-lime-400" />
          </div>
          <div className="text-2xl font-black text-lime-400">1.25 kg/kg</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Biofloco Suplementa 25% da Dieta
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-teal-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-700">R$ 170.290,75</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Receita: R$ 373,5k • R$ 9,16/m³
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('tanques_bft')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tanques_bft'
              ? 'bg-teal-50 text-teal-800 border border-teal-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Waves className="w-4 h-4" />
          1. Tanques BFT & Qualidade da Água
        </button>

        <button
          onClick={() => setActiveTab('manejo_carbono')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'manejo_carbono'
              ? 'bg-teal-50 text-teal-800 border border-teal-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Droplets className="w-4 h-4" />
          2. Relação C:N & Dosagem de Melaço
        </button>

        <button
          onClick={() => setActiveTab('biometria')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'biometria'
              ? 'bg-teal-50 text-teal-800 border border-teal-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Scale className="w-4 h-4" />
          3. Biometria & Calibre do Camarão
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-teal-50 text-teal-800 border border-teal-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico BFT
        </button>
      </div>

      {/* Conteúdo Aba 1: Tanques BFT */}
      {activeTab === 'tanques_bft' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Waves className="w-5 h-5 text-teal-700" />
              Telemetria e Parâmetros Físico-Químicos dos Tanques Circulares
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              O sistema opera sem renovação de água (circuito fechado), onde bactérias heterotróficas aeróbicas assimilam compostos nitrogenados diretamente através da suplementação de fontes de carbono orgânico.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Tanque / Setor</th>
                    <th className="py-3 px-3">Volume</th>
                    <th className="py-3 px-3">Dias Cultivo</th>
                    <th className="py-3 px-3">Peso Médio</th>
                    <th className="py-3 px-3">O₂ Dissolvido</th>
                    <th className="py-3 px-3">Amônia (TAN)</th>
                    <th className="py-3 px-3">Nitrito (NO₂)</th>
                    <th className="py-3 px-3">Cone Imhoff</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {tanques.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{t.identificacao}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{t.id}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-900">{t.volumeM3} m³</td>
                      <td className="py-3.5 px-3 font-mono text-slate-900">{t.diasCultivo} dias</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900">{t.pesoMedioGramas} g</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-teal-700">{t.oxigenioDissolvidoMgL} mg/L</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-700">{t.amoniaTanMgL} mg/L</td>
                      <td className="py-3.5 px-3 font-mono text-sky-700">{t.nitritoMgL} mg/L</td>
                      <td className="py-3.5 px-3 font-mono text-amber-800">{t.coneImhoffMl} mL/L</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30">
                          {t.statusAgua}
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

      {/* Conteúdo Aba 2: Manejo de Carbono */}
      {activeTab === 'manejo_carbono' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-teal-700" />
              Cálculo Estequiométrico da Relação C:N
            </h3>
            <p className="text-xs text-slate-600">
              Para cada grama de nitrogênio amoniacal gerado pela excreção dos camarões e sobras de ração, adiciona-se carbono orgânico (melaço de cana com 50% de carbono) para converter o nitrogênio em biomassa bacteriana celular (proteína microbiana).
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Equação de Ebeling & Avnimelech</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  ΔC = ΔN × (Relação C:N) → Para manter C:N em 14:1, aplica-se aproximadamente 600g de melaço para cada 1 kg de ração comercial (35% PB) consumida no tanque.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Aeração de Fundo com Tubos Aero-Tube</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Microbolhas contínuas que mantêm os bioflocos em suspensão homogênea na coluna d'água sem decantação anaeróbica no fundo cônico.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Alcalinidade e Carbonato de Cálcio</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  A atividade bacteriana consome bicarbonatos. Mantém-se alcalinidade &gt; 140 mg/L CaCO₃ com cal hidratada ou bicarbonato de sódio.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              Volume de Biofloco (Cone Imhoff)
            </h3>
            <p className="text-xs text-slate-600">
              Controle do volume de sólidos suspensos decantáveis em 15 minutos:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Faixa Ótima de Bioflocos:</span>
                <span className="font-mono font-bold text-emerald-700">25 a 40 mL/L</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Ação se &gt; 45 mL/L:</span>
                <span className="font-mono font-bold text-amber-700">Acionar Clarificador / Decantador</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Ação se &lt; 20 mL/L:</span>
                <span className="font-mono font-bold text-sky-700">Inocular Probiótico e Melaço</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Biometria */}
      {activeTab === 'biometria' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Scale className="w-5 h-5 text-teal-700" />
              Acompanhamento de Crescimento e Calibre Comercial
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Amostragens semanais com tarrafa biométrica: os camarões criados em bioflocos crescem em média 1,4 g/semana devido à suplementação contínua de ácidos graxos essenciais e microrganismos vivos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Peso Alvo Despesca</span>
                <span className="text-2xl font-black text-slate-900 font-mono">14.5 gramas</span>
                <span className="text-[11px] text-teal-700 block">Calibre 60/70 (Alta Demanda)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Taxa de Sobrevivência</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">82.0%</span>
                <span className="text-[11px] text-slate-600 block">Ambiente Fechado Protegido</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Produtividade Efetiva</span>
                <span className="text-2xl font-black text-sky-700 font-mono">9.16 kg / m³ / ano</span>
                <span className="text-[11px] text-slate-600 block">15x superior a viveiros de terra</span>
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
              <BarChart3 className="w-5 h-5 text-teal-700" />
              Parâmetros da Carcinicultura
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Volume Útil Total</span>
                <span className="font-mono text-teal-700">{volumeTotalM3} m³</span>
              </div>
              <input
                type="range"
                min="300"
                max="5000"
                step="100"
                value={volumeTotalM3}
                onChange={(e) => setVolumeTotalM3(Number(e.target.value))}
                className="w-full accent-teal-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Densidade de Camarões / m³</span>
                <span className="font-mono text-teal-700">{densidadeM3} cam/m³</span>
              </div>
              <input
                type="range"
                min="100"
                max="400"
                step="10"
                value={densidadeM3}
                onChange={(e) => setDensidadeM3(Number(e.target.value))}
                className="w-full accent-teal-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Preço Camarão Despescado (R$/kg)</span>
                <span className="font-mono text-emerald-700">R$ {precoKgCamaraoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="26.0"
                max="52.0"
                step="1.0"
                value={precoKgCamaraoReais}
                onChange={(e) => setPrecoKgCamaraoReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Custo Total por kg Despescado</span>
                <span className="font-mono text-rose-700">R$ {custoTotalKgReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="12.0"
                max="28.0"
                step="0.50"
                value={custoTotalKgReais}
                onChange={(e) => setCustoTotalKgReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              DRE da Carcinicultura BFT & Margem Operacional
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Despesca/Ciclo</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {(metricasCarcinicultura.biomassaDespescadaCicloKg / 1000).toFixed(2)} ton
                </span>
                <span className="text-[10px] text-slate-600 block">{taxaSobrevivenciaPct}% sobrevivência</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Produção Anual</span>
                <span className="font-mono font-bold text-teal-700 text-base">
                  {(metricasCarcinicultura.biomassaDespescadaAnualKg / 1000).toFixed(2)} ton
                </span>
                <span className="text-[10px] text-teal-700/80 block">{ciclosAno} ciclos/ano</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  R$ {(metricasCarcinicultura.receitaBrutaAnual / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-slate-600 block">Camarão Fresco</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Lucro Líquido Anual</span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  R$ {(metricasCarcinicultura.lucroLiquidoAnual / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-700/80 block">Superintensivo</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Receita Bruta com Despescas ({metricasCarcinicultura.biomassaDespescadaAnualKg.toLocaleString()} kg @ R$ {precoKgCamaraoReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-emerald-700">
                  R$ {metricasCarcinicultura.receitaBrutaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custo Total de Operação (Ração 35% PB, Melaço, Probióticos e Energia):</span>
                <span className="font-mono font-bold text-rose-700">
                  - R$ {metricasCarcinicultura.custoTotalAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-50 px-3 rounded-lg border border-emerald-200">
                <span className="text-white">Produtividade Anual por Metro Cúbico de Água:</span>
                <span className="font-mono text-emerald-800">
                  {metricasCarcinicultura.produtividadeM3AnoKg} kg / m³ / ano
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarciniculturaBioflocosModule;
