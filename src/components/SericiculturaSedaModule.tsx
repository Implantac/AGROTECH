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
  Scissors
} from 'lucide-react';

interface LoteSirgaria {
  id: string;
  identificacao: string;
  instarAtual: '1_A_3_INOCULACAO' | '4_INSPETORIA' | '5_VORACIDADE' | 'ENCASULAMENTO_BOSQUE';
  gramasLagartaInicial: number;
  lagartasAproximadas: number;
  diasCriacao: number;
  consumoFolhaKgDia: number;
  temperaturaC: number;
  umidadeRelativaPct: number;
  status: 'EM_ALIMENTACAO' | 'SUBINDO_NO_BOSQUE' | 'COLHEITA_CASULOS';
}

export const SericiculturaSedaModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sirgarias' | 'amoreiras' | 'bosques' | 'simulador'>('sirgarias');

  // Lotes nas Sirgarias
  const [lotes] = useState<LoteSirgaria[]>([
    {
      id: 'SIRG-01',
      identificacao: 'Sirgaria Central 01 • Lote Safra Primavera',
      instarAtual: '5_VORACIDADE',
      gramasLagartaInicial: 200,
      lagartasAproximadas: 360000,
      diasCriacao: 22,
      consumoFolhaKgDia: 1450,
      temperaturaC: 25.0,
      umidadeRelativaPct: 72,
      status: 'EM_ALIMENTACAO',
    },
    {
      id: 'SIRG-02',
      identificacao: 'Sirgaria Central 02 • Bosques de Fiação',
      instarAtual: 'ENCASULAMENTO_BOSQUE',
      gramasLagartaInicial: 200,
      lagartasAproximadas: 360000,
      diasCriacao: 27,
      consumoFolhaKgDia: 0,
      temperaturaC: 24.5,
      umidadeRelativaPct: 68,
      status: 'SUBINDO_NO_BOSQUE',
    },
  ]);

  // Simulador Econômico da Sericicultura
  const [areaAmoreiraHa, setAreaAmoreiraHa] = useState<number>(8);
  const [produtividadeFolhaKgHa, setProdutividadeFolhaKgHa] = useState<number>(22000);
  const [pesoCasuloVerdeGramas, setPesoCasuloVerdeGramas] = useState<number>(2.1);
  const [teorSedaBrutaFiavelPct, setTeorSedaBrutaFiavelPct] = useState<number>(18.5);
  const [precoKgCasuloVerdeReais, setPrecoKgCasuloVerdeReais] = useState<number>(28.50);
  const [custoMaoObraInsumosPorHaReais, setCustoMaoObraInsumosPorHaReais] = useState<number>(16500.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const producaoFolhaTotalKg = areaAmoreiraHa * produtividadeFolhaKgHa;
    const fatorConversaoFolhaCasulo = 0.065; // ~65 kg casulos verdes para cada 1.000 kg folhas de Morus alba
    const producaoCasulosVerdesKg = Number((producaoFolhaTotalKg * fatorConversaoFolhaCasulo).toFixed(1));
    const producaoSedaBrutaKg = Number((producaoCasulosVerdesKg * (teorSedaBrutaFiavelPct / 100)).toFixed(1));

    const receitaBrutaCasulosReais = Number((producaoCasulosVerdesKg * precoKgCasuloVerdeReais).toFixed(2));
    const custoTotalReais = Number((areaAmoreiraHa * custoMaoObraInsumosPorHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaCasulosReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaCasulosReais || 1)) * 100).toFixed(1));

    return {
      producaoFolhaTotalKg,
      producaoCasulosVerdesKg,
      producaoSedaBrutaKg,
      receitaBrutaCasulosReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaAmoreiraHa,
    produtividadeFolhaKgHa,
    pesoCasuloVerdeGramas,
    teorSedaBrutaFiavelPct,
    precoKgCasuloVerdeReais,
    custoMaoObraInsumosPorHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5" />
                Módulo 89 • Sericicultura & Bicho-da-Seda
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Bombyx mori • Fiação Nobre Bratac
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🐛 Sericicultura de Precisão & Casulos Verdes de Seda
            </h2>
            <p className="text-sm text-[#26332A] max-w-3xl leading-relaxed">
              Manejo integrado da criação do bicho-da-seda (*Bombyx mori*) em sirgarias climatizadas e pomar de amoreiras (*Morus alba*). Controle da alimentação nos 5 instares, subida nos bosques plásticos rotativos e colheita de casulos com alto teor de fio fiavel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Casulos Verdes</span>
              <span className="text-xl font-black text-purple-400">11.440 kg</span>
              <span className="text-[10px] text-[#66736A] block mt-0.5">8 ha Amoreira</span>
            </div>
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Seda Bruta</span>
              <span className="text-xl font-black text-emerald-400">2.116 kg</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">18.5% Fio Fíavel</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Peso Médio Casulo</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">2.10 gramas</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Classificação Superior A1
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Teor de Seda Fiavel</span>
            <Scissors className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-black text-pink-400">18.5%</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Filamento Contínuo sem Quebra
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Produtividade de Folha</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">22.0 t / ha</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Variedade Miura & Korin
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">R$ 194.040,00</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            R$ 24.255,00 por hectare/ano
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('sirgarias')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sirgarias'
              ? 'bg-purple-500 text-white shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Scissors className="w-4 h-4" />
          1. Sirgarias & Manejo de Lagartas
        </button>

        <button
          onClick={() => setActiveTab('amoreiras')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'amoreiras'
              ? 'bg-purple-500 text-white shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Leaf className="w-4 h-4" />
          2. Pomar de Amoreiras & Poda
        </button>

        <button
          onClick={() => setActiveTab('bosques')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'bosques'
              ? 'bg-purple-500 text-white shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Award className="w-4 h-4" />
          3. Bosques & Fiação de Casulo
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-purple-500 text-white shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico da Seda
        </button>
      </div>

      {/* Conteúdo Aba 1: Sirgarias */}
      {activeTab === 'sirgarias' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Scissors className="w-5 h-5 text-purple-400" />
              Monitoramento dos Galpões de Criação (Sirgarias)
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              O ciclo do bicho-da-seda dura cerca de 25 a 28 dias dividido em 5 instares (idades). No 5º instar, ocorre a fase de maior consumo de folhas frescas picadas antes da subida nos bosques.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAF4E7] text-[#66736A] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Sirgaria</th>
                    <th className="py-3 px-3">Instar Atual</th>
                    <th className="py-3 px-3">Lagartas Estocadas</th>
                    <th className="py-3 px-3">Dias Criação</th>
                    <th className="py-3 px-3">Consumo Folha</th>
                    <th className="py-3 px-3">Temp / UR%</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {lotes.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{l.identificacao}</div>
                        <div className="text-[11px] text-[#66736A] font-mono">{l.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-purple-300 font-semibold">{l.instarAtual}</td>
                      <td className="py-3.5 px-3 font-mono text-white">{l.lagartasAproximadas.toLocaleString()} lagartas</td>
                      <td className="py-3.5 px-3 font-mono text-[#26332A]">{l.diasCriacao} dias</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400">{l.consumoFolhaKgDia} kg/dia</td>
                      <td className="py-3.5 px-3 font-mono text-cyan-400">{l.temperaturaC}°C • {l.umidadeRelativaPct}%</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
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

      {/* Conteúdo Aba 2: Amoreiras */}
      {activeTab === 'amoreiras' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              Manejo do Pomar de Amoreiras (Morus alba)
            </h3>
            <p className="text-xs text-[#66736A]">
              A nutrição do bicho-da-seda depende 100% de folhas sadias, frescas e ricas em proteína vegetal e carboidratos solúveis:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Espaçamento e Densidade</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Plantio de 2,5m x 0,8m (5.000 plantas/ha) facilitando podas mecânicas ou manuais escalonadas.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Poda Drástica e Cepilho</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Poda de inverno para rejuvenescimento das brotações e alinhamento com a entrega dos ovos (lagartas neonatas).
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Biosseguridade na Sirgaria
            </h3>
            <p className="text-xs text-[#66736A]">
              Prevenção de doenças infecciosas em lagartas (*Gattine*, *Flacherie* e *Grasserie*):
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Desinfecção de Camas com Cal:</span>
                <span className="font-mono font-bold text-emerald-400">Diária em pó virgem</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Exposição ao Sol dos Bosques:</span>
                <span className="font-mono font-bold text-cyan-400">Raios UV pré-uso</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Bosques */}
      {activeTab === 'bosques' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-purple-400" />
              Encasulamento nos Bosques Rotativos
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              Ao atingir o pico de maturidade, as lagartas param de se alimentar e erguem a cabeça procurando os alvéolos dos bosques de papelão ou plástico ondulado, onde tecem cerca de 1.000 a 1.500 metros contínuos de fio de seda.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Tempo de Tecelagem</span>
                <span className="text-2xl font-black text-white font-mono">72 horas</span>
                <span className="text-[11px] text-purple-400 block">Movimento em forma de oito (8)</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Colheita de Casulos</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">7º dia pós-bosque</span>
                <span className="text-[11px] text-[#66736A] block">Antes da emergência da mariposa</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Destino Industrial</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">Fiação Bratac Silk</span>
                <span className="text-[11px] text-[#66736A] block">Exportação para tecelagens de luxo</span>
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
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Parâmetros da Produção de Seda
            </h3>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Área de Amoreiras (ha)</span>
                <span className="font-mono text-purple-400">{areaAmoreiraHa} hectares</span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                step="1"
                value={areaAmoreiraHa}
                onChange={(e) => setAreaAmoreiraHa(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Produtividade Folha (kg/ha)</span>
                <span className="font-mono text-emerald-400">{produtividadeFolhaKgHa} kg/ha</span>
              </div>
              <input
                type="range"
                min="12000"
                max="30000"
                step="1000"
                value={produtividadeFolhaKgHa}
                onChange={(e) => setProdutividadeFolhaKgHa(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Preço Casulo Verde (R$/kg)</span>
                <span className="font-mono text-white">R$ {precoKgCasuloVerdeReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="18.0"
                max="40.0"
                step="0.5"
                value={precoKgCasuloVerdeReais}
                onChange={(e) => setPrecoKgCasuloVerdeReais(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Custo Operacional por Hectare</span>
                <span className="font-mono text-rose-400">R$ {custoMaoObraInsumosPorHaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="9000"
                max="24000"
                step="500"
                value={custoMaoObraInsumosPorHaReais}
                onChange={(e) => setCustoMaoObraInsumosPorHaReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Retorno Financeiro da Sericicultura
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Casulos Verdes</span>
                <span className="font-mono font-bold text-white text-base">
                  {(metricas.producaoCasulosVerdesKg / 1000).toFixed(1)} ton
                </span>
                <span className="text-[10px] text-[#66736A] block">{areaAmoreiraHa} ha pomar</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Seda Bruta</span>
                <span className="font-mono font-bold text-purple-400 text-base">
                  {metricas.producaoSedaBrutaKg.toFixed(0)} kg
                </span>
                <span className="text-[10px] text-purple-400/80 block">{teorSedaBrutaFiavelPct}% teor</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricas.receitaBrutaCasulosReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-[#66736A] block">Venda Indústria</span>
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
                <span className="text-[#66736A]">Venda de Casulos Verdes ({metricas.producaoCasulosVerdesKg.toLocaleString()} kg @ R$ {precoKgCasuloVerdeReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-white">
                  R$ {metricas.receitaBrutaCasulosReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Custo com Manejo da Amoreira e Mão de Obra na Sirgaria:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {metricas.custoTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

export default SericiculturaSedaModule;
