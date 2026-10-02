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
  Thermometer,
  Wind
} from 'lucide-react';

interface CamaraFrutificacao {
  id: string;
  identificacao: string;
  especie: 'SHITAKE' | 'SHIMEJI_PRETO' | 'SHIMEJI_BRANCO' | 'CHAMPIGNON_PARIS';
  blocosSubstrato: number;
  temperaturaC: number;
  umidadeRelativaPct: number;
  co2Ppm: number;
  diasInducao: number;
  produtividadeKgDia: number;
  status: 'INDUCAO' | 'FRUTIFICACAO_ATIVA' | 'DESCANSO_POS_COLHEITA';
}

export const FungiculturaCogumelosModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'camaras' | 'substrato' | 'qualidade' | 'simulador'>('camaras');

  // Câmaras de Cultivo Protegido
  const [camaras] = useState<CamaraFrutificacao[]>([
    {
      id: 'CAMARA-01',
      identificacao: 'Câmara Climatizada 01 • Shitake em Blocos Axênicos',
      especie: 'SHITAKE',
      blocosSubstrato: 2400,
      temperaturaC: 18.2,
      umidadeRelativaPct: 92,
      co2Ppm: 820,
      diasInducao: 8,
      produtividadeKgDia: 68.5,
      status: 'FRUTIFICACAO_ATIVA',
    },
    {
      id: 'CAMARA-02',
      identificacao: 'Câmara Climatizada 02 • Shimeji Preto Premium',
      especie: 'SHIMEJI_PRETO',
      blocosSubstrato: 3000,
      temperaturaC: 19.5,
      umidadeRelativaPct: 95,
      co2Ppm: 750,
      diasInducao: 12,
      produtividadeKgDia: 85.0,
      status: 'FRUTIFICACAO_ATIVA',
    },
    {
      id: 'CAMARA-03',
      identificacao: 'Câmara Climatizada 03 • Shimeji Branco',
      especie: 'SHIMEJI_BRANCO',
      blocosSubstrato: 2600,
      temperaturaC: 20.0,
      umidadeRelativaPct: 88,
      co2Ppm: 920,
      diasInducao: 4,
      produtividadeKgDia: 32.0,
      status: 'INDUCAO',
    },
  ]);

  // Simulador Econômico da Fungicultura
  const [substratoSecoToneladas, setSubstratoSecoToneladas] = useState<number>(24);
  const [eficienciaBiologicaPct, setEficienciaBiologicaPct] = useState<number>(75.0);
  const [precoMedioKgFrescoReais, setPrecoMedioKgFrescoReais] = useState<number>(42.0);
  const [custoToneladaSubstratoInoculadoReais, setCustoToneladaSubstratoInoculadoReais] = useState<number>(2800.0);
  const [custoEnergiaClimatizacaoMaoObraReais, setCustoEnergiaClimatizacaoMaoObraReais] = useState<number>(145000.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const producaoCogumelosFrescosKg = Number(((substratoSecoToneladas * 1000) * (eficienciaBiologicaPct / 100)).toFixed(1));
    const receitaBrutaReais = Number((producaoCogumelosFrescosKg * precoMedioKgFrescoReais).toFixed(2));
    const custoSubstratoReais = substratoSecoToneladas * custoToneladaSubstratoInoculadoReais;
    const custoTotalReais = Number((custoSubstratoReais + custoEnergiaClimatizacaoMaoObraReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemLucroPct = Number(((lucroLiquidoReais / (receitaBrutaReais || 1)) * 100).toFixed(1));

    return {
      producaoCogumelosFrescosKg,
      receitaBrutaReais,
      custoSubstratoReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLucroPct,
    };
  }, [
    substratoSecoToneladas,
    eficienciaBiologicaPct,
    precoMedioKgFrescoReais,
    custoToneladaSubstratoInoculadoReais,
    custoEnergiaClimatizacaoMaoObraReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-stone-900 via-slate-900 to-slate-950 border border-stone-600/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-stone-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-stone-500/20 text-stone-300 border border-stone-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Módulo 88 • Fungicultura & Cogumelos Nobres
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Eficiência Biológica 75% • Shitake & Shimeji
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🍄 Fungicultura de Precisão em Câmaras Climatizadas
            </h2>
            <p className="text-sm text-[#26332A] max-w-3xl leading-relaxed">
              Produção intensiva de cogumelos comestíveis e medicinais em substrato axênico suplementado (serragem e bagaço de cana). Controle microclimático milimétrico de umidade ultra-sônica, $CO_2$ e choque térmico indutor de frutificação.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Produção Anual</span>
              <span className="text-xl font-black text-stone-300">18.000 kg</span>
              <span className="text-[10px] text-[#66736A] block mt-0.5">Frescos / In Natura</span>
            </div>
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Faturamento</span>
              <span className="text-xl font-black text-emerald-400">R$ 756.000</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">71.9% Margem</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-stone-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Eficiência Biológica (EB%)</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">75.0%</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            750g cogumelo / kg substrato seco
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-stone-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Umidade Relativa Câmaras</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">92% a 95%</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Nebulização Ultra-Sônica sem Gota
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-stone-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Nível de CO₂ Dissipado</span>
            <Wind className="w-4 h-4 text-stone-300" />
          </div>
          <div className="text-2xl font-black text-stone-300">&lt; 850 ppm</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Exaustão Forçada Automatizada
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-stone-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">R$ 543.800,00</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Retorno Rápido em Pequena Área
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('camaras')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'camaras'
              ? 'bg-stone-300 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          1. Câmaras Climatizadas & Sensores
        </button>

        <button
          onClick={() => setActiveTab('substrato')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'substrato'
              ? 'bg-stone-300 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Layers className="w-4 h-4" />
          2. Formulação & Pasteurização
        </button>

        <button
          onClick={() => setActiveTab('qualidade')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'qualidade'
              ? 'bg-stone-300 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Award className="w-4 h-4" />
          3. Colheita & Classificação Gourmet
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-stone-300 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico da Fungicultura
        </button>
      </div>

      {/* Conteúdo Aba 1: Câmaras */}
      {activeTab === 'camaras' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Thermometer className="w-5 h-5 text-stone-300" />
              Telemetria Microclimática das Câmaras de Frutificação
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              Monitoramento em tempo real de temperatura, umidade relativa e concentração de dióxido de carbono ($CO_2$), garantindo chapéus carnudos e sem deformações nos cogumelos.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAF4E7] text-[#66736A] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Câmara / Setor</th>
                    <th className="py-3 px-3">Espécie</th>
                    <th className="py-3 px-3">Blocos Substrato</th>
                    <th className="py-3 px-3">Temperatura</th>
                    <th className="py-3 px-3">Umidade Relativa</th>
                    <th className="py-3 px-3">CO₂ Dissipado</th>
                    <th className="py-3 px-3">Colheita Diária</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {camaras.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{c.identificacao}</div>
                        <div className="text-[11px] text-[#66736A] font-mono">{c.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-[#26332A] font-semibold">{c.especie}</td>
                      <td className="py-3.5 px-3 font-mono text-stone-300">{c.blocosSubstrato} blocos</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-cyan-400">{c.temperaturaC}°C</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">{c.umidadeRelativaPct}%</td>
                      <td className="py-3.5 px-3 font-mono text-amber-300">{c.co2Ppm} ppm</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-white">{c.produtividadeKgDia} kg/dia</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {c.status}
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

      {/* Conteúdo Aba 2: Substrato */}
      {activeTab === 'substrato' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-stone-300" />
              Preparo do Substrato Axênico Pasteurizado
            </h3>
            <p className="text-xs text-[#66736A]">
              A base nutricional é formulada para fornecer lignina e celulose de digestão fúngica com enriquecimento proteico:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Serragem de Eucalipto ou Bagaço de Cana (75%)</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Fonte primária de celulose e lignina livre de resinas aromáticas.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Farelo de Trigo ou Soja (20%)</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Aporte de nitrogênio orgânico para impulsionar a colonização micelial e o peso dos primórdios.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Carbonato de Cálcio / Gesso Agrícola (5%)</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Estabilização do pH do substrato na faixa ótima de 6,0 a 6,5.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Choque Térmico e Hídrico
            </h3>
            <p className="text-xs text-[#66736A]">
              Protocolo para quebra de dormência e sincronização de frutificação em Shitake:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Imersão em Água Gelada:</span>
                <span className="font-mono font-bold text-cyan-400">8°C a 12°C por 12 horas</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Aparição de Primórdios:</span>
                <span className="font-mono font-bold text-emerald-400">3 a 5 dias pós-choque</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Ciclos de Colheita por Bloco:</span>
                <span className="font-mono font-bold text-amber-400">3 a 4 fluxos (flushes)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Qualidade */}
      {activeTab === 'qualidade' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-stone-300" />
              Padrões de Qualidade e Gastronomia Gourmet
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              Colheita manual cuidadosa antes da abertura completa do chapéu (véu intacto ou semi-aberto), garantindo textura firme e validade pós-colheita estendida de 14 a 21 dias sob refrigeração.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Calibre Especial</span>
                <span className="text-2xl font-black text-white font-mono">5 a 7 cm</span>
                <span className="text-[11px] text-stone-300 block">Chapéu redondo sem rachaduras</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Vida de Prateleira</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">18 dias</span>
                <span className="text-[11px] text-[#66736A] block">Sob refrigeração a 4°C</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Destino Comercial</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">Restaurantes & Empórios</span>
                <span className="text-[11px] text-[#66736A] block">Ágio de até +40% no atacado</span>
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
              <BarChart3 className="w-5 h-5 text-stone-300" />
              Parâmetros de Produção de Cogumelos
            </h3>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Substrato Seco Anual</span>
                <span className="font-mono text-stone-300">{substratoSecoToneladas} toneladas</span>
              </div>
              <input
                type="range"
                min="6"
                max="80"
                step="2"
                value={substratoSecoToneladas}
                onChange={(e) => setSubstratoSecoToneladas(Number(e.target.value))}
                className="w-full accent-stone-300 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Eficiência Biológica (EB%)</span>
                <span className="font-mono text-stone-300">{eficienciaBiologicaPct}%</span>
              </div>
              <input
                type="range"
                min="50.0"
                max="95.0"
                step="1.0"
                value={eficienciaBiologicaPct}
                onChange={(e) => setEficienciaBiologicaPct(Number(e.target.value))}
                className="w-full accent-stone-300 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Preço Médio Cogumelo Fresco (R$/kg)</span>
                <span className="font-mono text-emerald-400">R$ {precoMedioKgFrescoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="25.0"
                max="75.0"
                step="1.0"
                value={precoMedioKgFrescoReais}
                onChange={(e) => setPrecoMedioKgFrescoReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Custo Substrato Inoculado (R$/t)</span>
                <span className="font-mono text-rose-400">R$ {custoToneladaSubstratoInoculadoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1800"
                max="4500"
                step="100"
                value={custoToneladaSubstratoInoculadoReais}
                onChange={(e) => setCustoToneladaSubstratoInoculadoReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Demonstrativo Financeiro da Fungicultura
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Produção Total</span>
                <span className="font-mono font-bold text-white text-base">
                  {(metricas.producaoCogumelosFrescosKg / 1000).toFixed(1)} ton
                </span>
                <span className="text-[10px] text-[#66736A] block">{eficienciaBiologicaPct}% EB</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-stone-300 text-base">
                  R$ {(metricas.receitaBrutaReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-stone-400 block">Shitake & Shimeji</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Custo Total</span>
                <span className="font-mono font-bold text-rose-400 text-base">
                  R$ {(metricas.custoTotalReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-rose-400/80 block">Substrato + Energia</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricas.lucroLiquidoReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{metricas.margemLucroPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Receita Bruta ({metricas.producaoCogumelosFrescosKg.toLocaleString()} kg @ R$ {precoMedioKgFrescoReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-white">
                  R$ {metricas.receitaBrutaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Custo com Substrato Inoculado ({substratoSecoToneladas} t):</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {metricas.custoSubstratoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Custo com Energia, Climatização e Operações:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {custoEnergiaClimatizacaoMaoObraReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

export default FungiculturaCogumelosModule;
