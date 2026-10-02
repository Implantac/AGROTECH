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
  Sun,
  Droplets,
  Waves
} from 'lucide-react';

interface RacewayPond {
  id: string;
  identificacao: string;
  especie: 'SPIRULINA_PLATENSIS' | 'CHLORELLA_VULGARIS';
  areaM2: number;
  profundidadeCm: number;
  densidadeOticaOD680: number;
  ph: number;
  temperaturaC: number;
  velocidadeRodaAgitadoraRpm: number;
  status: 'CULTIVO_EXPONENCIAL' | 'COLHEITA_CONTINUA' | 'INOCULACAO_NOVA';
}

export const AlgotecnologiaMicroalgasModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'raceways' | 'co2_captura' | 'centrifuga' | 'simulador'>('raceways');

  // Lagoas Raceway
  const [lagoas] = useState<RacewayPond[]>([
    {
      id: 'RACEWAY-01',
      identificacao: 'Lagoa Raceway 01 • Spirulina platensis',
      especie: 'SPIRULINA_PLATENSIS',
      areaM2: 2500,
      profundidadeCm: 25,
      densidadeOticaOD680: 1.25,
      ph: 9.8,
      temperaturaC: 28.5,
      velocidadeRodaAgitadoraRpm: 18,
      status: 'COLHEITA_CONTINUA',
    },
    {
      id: 'RACEWAY-02',
      identificacao: 'Lagoa Raceway 02 • Chlorella vulgaris',
      especie: 'CHLORELLA_VULGARIS',
      areaM2: 2500,
      profundidadeCm: 22,
      densidadeOticaOD680: 1.40,
      ph: 7.4,
      temperaturaC: 27.0,
      velocidadeRodaAgitadoraRpm: 20,
      status: 'COLHEITA_CONTINUA',
    },
  ]);

  // Simulador Econômico de Algotecnologia
  const [areaEspelhoAguaM2, setAreaEspelhoAguaM2] = useState<number>(5000);
  const [produtividadeDiariaGramasM2Dia, setProdutividadeDiariaGramasM2Dia] = useState<number>(18.0);
  const [diasOperacaoAno, setDiasOperacaoAno] = useState<number>(330);
  const [fatorFixacaoCO2PorKgBiomassa] = useState<number>(1.83);
  const [precoKgBiomassaSecaReais, setPrecoKgBiomassaSecaReais] = useState<number>(65.0);
  const [custoOperacionalAnualReais, setCustoOperacionalAnualReais] = useState<number>(720000.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const producaoDiariaKg = (areaEspelhoAguaM2 * produtividadeDiariaGramasM2Dia) / 1000;
    const producaoAnualBiomassaKg = Number((producaoDiariaKg * diasOperacaoAno).toFixed(1));
    const fixacaoTotalCO2Toneladas = Number(((producaoAnualBiomassaKg * fatorFixacaoCO2PorKgBiomassa) / 1000).toFixed(2));

    const receitaBrutaBiomassaReais = Number((producaoAnualBiomassaKg * precoKgBiomassaSecaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaBiomassaReais - custoOperacionalAnualReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaBiomassaReais || 1)) * 100).toFixed(1));

    return {
      producaoDiariaKg,
      producaoAnualBiomassaKg,
      fixacaoTotalCO2Toneladas,
      receitaBrutaBiomassaReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaEspelhoAguaM2,
    produtividadeDiariaGramasM2Dia,
    diasOperacaoAno,
    fatorFixacaoCO2PorKgBiomassa,
    precoKgBiomassaSecaReais,
    custoOperacionalAnualReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                Módulo 90 • Algotecnologia & Microalgas
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                Spirulina & Chlorella • Fixação de CO₂
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🧪 Biotecnologia de Microalgas & Bioestimulantes Agrícolas
            </h2>
            <p className="text-sm text-[#26332A] max-w-3xl leading-relaxed">
              Cultivo industrial em lagoas tipo *Raceway* com injeção de dióxido de carbono ($CO_2$), agitação por pás mecânicas contínuas e colheita por centrifugação de fluxo contínuo para produção de bioestimulantes de solo e nutrição celular.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Biomassa Seca</span>
              <span className="text-xl font-black text-emerald-400">29.700 kg</span>
              <span className="text-[10px] text-[#66736A] block mt-0.5">5.000 m² raceway</span>
            </div>
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">CO₂ Fixado</span>
              <span className="text-xl font-black text-cyan-400">54,35 ton</span>
              <span className="text-[10px] text-cyan-400/80 block mt-0.5">1.83 kg CO₂ / kg alga</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Produtividade Areolar</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">18.0 g / m² / dia</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            90 kg biomassa seca / dia
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">pH Alcalino Estável</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">9.5 a 10.0</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Meio Zarrouk Protegido contra Invasores
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Receita Bruta Anual</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">R$ 1.930.500,00</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            R$ 65,00/kg biomassa pura
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <Award className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">R$ 1.210.500,00</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Margem Líquida de 62.7%
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('raceways')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'raceways'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Waves className="w-4 h-4" />
          1. Lagoas Raceway & Telemetria
        </button>

        <button
          onClick={() => setActiveTab('co2_captura')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'co2_captura'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Leaf className="w-4 h-4" />
          2. Injeção & Fixação de CO₂
        </button>

        <button
          onClick={() => setActiveTab('centrifuga')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'centrifuga'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Filter className="w-4 h-4" />
          3. Centrífuga & Spray Dryer
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico de Microalgas
        </button>
      </div>

      {/* Conteúdo Aba 1: Raceways */}
      {activeTab === 'raceways' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Waves className="w-5 h-5 text-emerald-400" />
              Parâmetros Físico-Químicos dos Canais Raceway
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              Canais rasos em circuito oval (20 a 30 cm de lâmina) mantidos em circulação constante por roda de pás (paddle wheel), permitindo insolação homogênea das células fotossintetizantes.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAF4E7] text-[#66736A] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Lagoa / Canal</th>
                    <th className="py-3 px-3">Espécie</th>
                    <th className="py-3 px-3">Área Espelho</th>
                    <th className="py-3 px-3">Densidade Ótica (OD₆₈₀)</th>
                    <th className="py-3 px-3">pH</th>
                    <th className="py-3 px-3">Temperatura</th>
                    <th className="py-3 px-3">Rotação Pás</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {lagoas.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{l.identificacao}</div>
                        <div className="text-[11px] text-[#66736A] font-mono">{l.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-emerald-300 font-semibold">{l.especie}</td>
                      <td className="py-3.5 px-3 font-mono text-[#26332A]">{l.areaM2} m²</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-white">{l.densidadeOticaOD680}</td>
                      <td className="py-3.5 px-3 font-mono text-cyan-400 font-bold">{l.ph}</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400">{l.temperaturaC}°C</td>
                      <td className="py-3.5 px-3 font-mono text-[#26332A]">{l.velocidadeRodaAgitadoraRpm} RPM</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {l.status}
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

      {/* Conteúdo Aba 2: CO2 Captura */}
      {activeTab === 'co2_captura' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              Injeção Controlada de Dióxido de Carbono (CO₂)
            </h3>
            <p className="text-xs text-[#66736A]">
              A injeção de microbolhas de $CO_2$ em poço profundo (*sump*) atua como fertilizante de carbono inorgânico e regulador fino de pH:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Estequiometria Fotossintética</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Para cada 1.000 kg de biomassa celular seca gerada, a cultura sequestra e fixa 1.830 kg de $CO_2$ da atmosfera ou gases de combustão limpos.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Controle Automatizado de pH por Válvula Solenoide</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Quando o consumo de bicarbonatos eleva o pH acima de 10.0, a injeção de $CO_2$ é ligada automaticamente para acidificar o meio até 9.5.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Aplicações como Bioestimulante Foliar
            </h3>
            <p className="text-xs text-[#66736A]">
              O extrato celular de *Spirulina* é rico em aminoácidos livres e fitohormônios naturais:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Proteína Bruta na Massa Seca:</span>
                <span className="font-mono font-bold text-emerald-400">65% a 70% PB</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Resistência a Estresse Hídrico:</span>
                <span className="font-mono font-bold text-cyan-400">+18% retenção de água na soja</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Fitohormônios Auxinas/Citocininas:</span>
                <span className="font-mono font-bold text-amber-400">Enraizamento Profundo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Centrífuga */}
      {activeTab === 'centrifuga' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Filter className="w-5 h-5 text-cyan-400" />
              Desidratação, Filtragem e Secagem Solar / Spray Dryer
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              A separação do caldo celular ocorre por peneiramento vibratório para *Spirulina* (filamentos longos em espiral) e centrífuga de discos para *Chlorella* (célula esférica microscópica).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Eficiência de Coleta</span>
                <span className="text-2xl font-black text-white font-mono">98.5%</span>
                <span className="text-[11px] text-emerald-400 block">Peneira curva de 30 micras</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Umidade Pós-Secagem</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">&lt; 7.0%</span>
                <span className="text-[11px] text-[#66736A] block">Estabilidade por 24 meses</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Água Recirculada</span>
                <span className="text-2xl font-black text-teal-400 font-mono">95.0%</span>
                <span className="text-[11px] text-[#66736A] block">Reaproveitamento de nutrientes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Parâmetros de Cultivo de Microalgas
            </h3>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Área de Espelho d'Água (m²)</span>
                <span className="font-mono text-emerald-400">{areaEspelhoAguaM2} m²</span>
              </div>
              <input
                type="range"
                min="1000"
                max="20000"
                step="500"
                value={areaEspelhoAguaM2}
                onChange={(e) => setAreaEspelhoAguaM2(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Produtividade (g/m²/dia)</span>
                <span className="font-mono text-cyan-400">{produtividadeDiariaGramasM2Dia} g/m²/dia</span>
              </div>
              <input
                type="range"
                min="10.0"
                max="28.0"
                step="1.0"
                value={produtividadeDiariaGramasM2Dia}
                onChange={(e) => setProdutividadeDiariaGramasM2Dia(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Preço Biomassa Seca (R$/kg)</span>
                <span className="font-mono text-white">R$ {precoKgBiomassaSecaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="40.0"
                max="120.0"
                step="2.5"
                value={precoKgBiomassaSecaReais}
                onChange={(e) => setPrecoKgBiomassaSecaReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Custo Operacional Total Anual</span>
                <span className="font-mono text-rose-400">R$ {custoOperacionalAnualReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="300000"
                max="1500000"
                step="50000"
                value={custoOperacionalAnualReais}
                onChange={(e) => setCustoOperacionalAnualReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Retorno Financeiro e Créditos de Carbono
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Biomassa Anual</span>
                <span className="font-mono font-bold text-white text-base">
                  {(metricas.producaoAnualBiomassaKg / 1000).toFixed(1)} ton
                </span>
                <span className="text-[10px] text-[#66736A] block">{diasOperacaoAno} dias/ano</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">CO₂ Fixado</span>
                <span className="font-mono font-bold text-cyan-400 text-base">
                  {metricas.fixacaoTotalCO2Toneladas} ton
                </span>
                <span className="text-[10px] text-cyan-400/80 block">Captura Ativa</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricas.receitaBrutaBiomassaReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-[#66736A] block">Bioestimulantes</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricas.lucroLiquidoReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Receita com Biomassa Seca ({metricas.producaoAnualBiomassaKg.toLocaleString()} kg @ R$ {precoKgBiomassaSecaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-white">
                  R$ {metricas.receitaBrutaBiomassaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Custo Total de Operação (Energia das Pás, Meio de Cultura e Pessoal):</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {custoOperacionalAnualReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-950/30 px-3 rounded-lg border border-emerald-800/50">
                <span className="text-white">Lucro Líquido Anual Consolidado:</span>
                <span className="font-mono text-emerald-300">
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

export default AlgotecnologiaMicroalgasModule;
