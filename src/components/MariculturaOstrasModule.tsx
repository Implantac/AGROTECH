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
  Waves,
  Anchor,
  Compass
} from 'lucide-react';

interface LoteMaricultura {
  id: string;
  identificacao: string;
  especie: 'Crassostrea gasar (Nativa)' | 'Crassostrea gigas (Pacífico)' | 'Perna perna (Mexilhão)';
  duziasOstrasAno: number;
  salinidadePpt: number;
  temperaturaAguaC: number;
  oxigenioDissolvidoMgL: number;
  statusFicotoxinas: 'LIBERADO_ZERO_TOXINA' | 'ALERTA_FLORACAO';
  sistemaCultivo: 'LONGLINE_LANTERNAS_SUBMERSAS' | 'MESA_FIXA_ENTREMARES';
}

export const MariculturaOstrasModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'linhas' | 'telemetria' | 'depuracao' | 'simulador'>('linhas');

  // Lotes de Concessão Aquícola
  const [lotes] = useState<LoteMaricultura[]>([
    {
      id: 'PARQUE-AQUICOLA-01',
      identificacao: 'Concessão Marinha Baía Norte • Longline 01 a 10',
      especie: 'Crassostrea gigas (Pacífico)',
      duziasOstrasAno: 95000,
      salinidadePpt: 33.5,
      temperaturaAguaC: 19.8,
      oxigenioDissolvidoMgL: 6.8,
      statusFicotoxinas: 'LIBERADO_ZERO_TOXINA',
      sistemaCultivo: 'LONGLINE_LANTERNAS_SUBMERSAS',
    },
    {
      id: 'PARQUE-AQUICOLA-02',
      identificacao: 'Concessão Marinha Baía Sul • Longline 11 a 20',
      especie: 'Crassostrea gasar (Nativa)',
      duziasOstrasAno: 85000,
      salinidadePpt: 31.0,
      temperaturaAguaC: 23.2,
      oxigenioDissolvidoMgL: 6.4,
      statusFicotoxinas: 'LIBERADO_ZERO_TOXINA',
      sistemaCultivo: 'LONGLINE_LANTERNAS_SUBMERSAS',
    },
  ]);

  // Simulador Econômico da Maricultura
  const [areaConcessaoHa, setAreaConcessaoHa] = useState<number>(12);
  const [duziasOstrasAno, setDuziasOstrasAno] = useState<number>(180000);
  const [precoDuziaOstraReais, setPrecoDuziaOstraReais] = useState<number>(26.50);
  const [custoOperacionalBarcosLanternasReais, setCustoOperacionalBarcosLanternasReais] = useState<number>(1850000.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const duziasPorHa = Number((duziasOstrasAno / (areaConcessaoHa || 1)).toFixed(0));
    const receitaBrutaReais = Number((duziasOstrasAno * precoDuziaOstraReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoOperacionalBarcosLanternasReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaReais || 1)) * 100).toFixed(1));

    return {
      duziasPorHa,
      receitaBrutaReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaConcessaoHa,
    duziasOstrasAno,
    precoDuziaOstraReais,
    custoOperacionalBarcosLanternasReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/70 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5" />
                Módulo 99 • Maricultura Oceânica & Malacocultura
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Ostras & Mexilhões • Depuração UV-C
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🦪 Maricultura de Precisão, Ostras & Monitoramento de Marés
            </h2>
            <p className="text-sm text-[#26332A] max-w-3xl leading-relaxed">
              Cultivo de moluscos bivalves em parques aquícolas marinhos: linhas de espinhel (longlines), lanternas com boias flutuantes, telemetria oceanográfica (salinidade, temperatura e ficotoxinas marinhas) e depuração com lâmpadas ultravioleta UV-C.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Produção Anual</span>
              <span className="text-xl font-black text-cyan-400">180.000 dz</span>
              <span className="text-[10px] text-[#66736A] block mt-0.5">2,16M Ostras</span>
            </div>
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Faturamento</span>
              <span className="text-xl font-black text-emerald-400">R$ 4,77M</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">61.2% Margem</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Densidade de Cultivo</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">15.000 dz / ha</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            12 ha Concessão Federal SPU
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Depuração UV-C</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">100% Segura</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Zero E. coli & Vibrio marinho
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Alerta de Maré Vermelha</span>
            <Waves className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">Monitoramento 24/7</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Sensores Ópticos de Clorofila
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">R$ 2.920.000,00</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Preço Médio R$ 26,50/dúzia
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('linhas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'linhas'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Anchor className="w-4 h-4" />
          1. Longlines & Lanternas
        </button>

        <button
          onClick={() => setActiveTab('telemetria')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'telemetria'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Waves className="w-4 h-4" />
          2. Boia Oceanográfica & Ficotoxinas
        </button>

        <button
          onClick={() => setActiveTab('depuracao')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'depuracao'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          3. Estação de Depuração UV-C
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico
        </button>
      </div>

      {/* Conteúdo Aba 1: Linhas */}
      {activeTab === 'linhas' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Anchor className="w-5 h-5 text-cyan-400" />
              Parques Aquícolas e Linhas de Longline
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              Cultivo oceânico sustentável: ostras e mexilhões são organismos filtradores que retiram microalgas diretamente da coluna d'água marinha, não necessitando de ração industrial e atuando como sumidouros naturais de carbono e nitrogênio marinho.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAF4E7] text-[#66736A] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Parque Concessão</th>
                    <th className="py-3 px-3">Espécie</th>
                    <th className="py-3 px-3">Produção Dúzias</th>
                    <th className="py-3 px-3">Salinidade</th>
                    <th className="py-3 px-3">Temp da Água</th>
                    <th className="py-3 px-3">OD (mg/L)</th>
                    <th className="py-3 px-3">Ficotoxinas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {lotes.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{l.identificacao}</div>
                        <div className="text-[11px] text-[#66736A] font-mono">{l.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-cyan-300 font-semibold">{l.especie}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-white">{l.duziasOstrasAno.toLocaleString()} dz</td>
                      <td className="py-3.5 px-3 font-mono text-cyan-400">{l.salinidadePpt} ppt</td>
                      <td className="py-3.5 px-3 font-mono text-amber-400">{l.temperaturaAguaC}°C</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400">{l.oxigenioDissolvidoMgL} mg/L</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {l.statusFicotoxinas}
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

      {/* Conteúdo Aba 2: Telemetria */}
      {activeTab === 'telemetria' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              Boia Multiparamétrica IoT em Tempo Real
            </h3>
            <p className="text-xs text-[#66736A]">
              Coleta contínua de parâmetros oceanográficos enviada via satélite e rede 4G litorânea:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Salinidade da Água (30 a 35 ppt)</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Estabilidade osmótica que garante textura firme e sabor iodado característico da ostra in natura.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Prevenção a Florações Algais Nocivas (FAN)</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Espectrofotômetro submerso detecta dinoflagelados tóxicos produtores de toxina diarreica (DSP) antes de atingir as lanternas.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Conformidade Ambiental Marinha
            </h3>
            <p className="text-xs text-[#66736A]">
              Indicadores de bioextração e sustentabilidade dos parques marinhos:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Nitrogênio Removido da Água:</span>
                <span className="font-mono font-bold text-emerald-400">14.2 kg N / hectare/mês</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Carbonato de Cálcio Fixado na Concha:</span>
                <span className="font-mono font-bold text-cyan-400">18.6 ton CaCO₃ / ano</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Depuração */}
      {activeTab === 'depuracao' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Estação Terrestre de Depuração UV-C
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              Antes de chegarem aos restaurantes gastronômicos, todas as ostras passam por 24 a 48 horas de circulação em tanques com água do mar filtrada em cartuchos de 5 micras e esterilizada com lâmpadas UV-C germicidas de 254 nm.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Eficiência Microbiológica</span>
                <span className="text-2xl font-black text-white font-mono">&gt; 99.99%</span>
                <span className="text-[11px] text-emerald-400 block">Eliminação de coliformes</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Inspeção Oficial</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">SIF / SIE</span>
                <span className="text-[11px] text-[#66736A] block">Selo de Inspeção Federal</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Mercado Premium</span>
                <span className="text-2xl font-black text-amber-400 font-mono">Consumo Cru</span>
                <span className="text-[11px] text-[#66736A] block">Alta gastronomia e hotéis</span>
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
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Parâmetros da Maricultura
            </h3>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Área Concessão Marinha (ha)</span>
                <span className="font-mono text-cyan-400">{areaConcessaoHa} hectares</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={areaConcessaoHa}
                onChange={(e) => setAreaConcessaoHa(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Dúzias de Ostras / Ano</span>
                <span className="font-mono text-emerald-400">{duziasOstrasAno.toLocaleString()} dz</span>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="10000"
                value={duziasOstrasAno}
                onChange={(e) => setDuziasOstrasAno(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Preço por Dúzia Depurada (R$)</span>
                <span className="font-mono text-white">R$ {precoDuziaOstraReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="18.0"
                max="45.0"
                step="0.50"
                value={precoDuziaOstraReais}
                onChange={(e) => setPrecoDuziaOstraReais(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Custos Operacionais Anuais (R$)</span>
                <span className="font-mono text-rose-400">R$ {custoOperacionalBarcosLanternasReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="4000000"
                step="50000"
                value={custoOperacionalBarcosLanternasReais}
                onChange={(e) => setCustoOperacionalBarcosLanternasReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Retorno Financeiro da Fazenda Marinha
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Produtividade</span>
                <span className="font-mono font-bold text-white text-base">
                  {metricas.duziasPorHa.toLocaleString()} dz
                </span>
                <span className="text-[10px] text-[#66736A] block">por hectare marinho</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Ostras Totais</span>
                <span className="font-mono font-bold text-cyan-400 text-base">
                  {((duziasOstrasAno * 12) / 1000000).toFixed(2)}M un
                </span>
                <span className="text-[10px] text-cyan-400/80 block">100% Depuradas</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricas.receitaBrutaReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-[#66736A] block">Mercado Gastronômico</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricas.lucroLiquidoReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Receita Bruta com Venda de Ostras Depuradas ({duziasOstrasAno.toLocaleString()} dz @ R$ {precoDuziaOstraReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-white">
                  R$ {metricas.receitaBrutaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Custos Operacionais de Barcos, Lanternas, Tripulação e Depuração UV-C:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {custoOperacionalBarcosLanternasReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

export default MariculturaOstrasModule;
