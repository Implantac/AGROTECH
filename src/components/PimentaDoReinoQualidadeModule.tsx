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
  Flame,
  Droplets
} from 'lucide-react';

interface PimentalLote {
  id: string;
  identificacao: string;
  variedade: 'Bragantina (Panniyur 1)' | 'Kuthiravally' | 'Cingapura';
  tipoTutor: 'TUTOR_VIVO_GLIRICIDIA' | 'TUTOR_MORTO_EUCALIPTO';
  areaHa: number;
  pimentaSecaKg: number;
  teorPiperinaPct: number;
  densidadeLitroGramas: number;
  statusExportacao: 'APROVADO_ASTA_GRADE_1' | 'MERCADO_INTERNO_GRAU_2';
}

export const PimentaDoReinoQualidadeModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pimentais' | 'processamento' | 'asta' | 'simulador'>('pimentais');

  // Lotes de Pimenta-do-Reino
  const [lotes] = useState<PimentalLote[]>([
    {
      id: 'PIMENTA-01',
      identificacao: 'Fazenda Vale do Acará 01 • Tomé-Açu PA (Bragantina)',
      variedade: 'Bragantina (Panniyur 1)',
      tipoTutor: 'TUTOR_VIVO_GLIRICIDIA',
      areaHa: 18,
      pimentaSecaKg: 69500,
      teorPiperinaPct: 4.65,
      densidadeLitroGramas: 570,
      statusExportacao: 'APROVADO_ASTA_GRADE_1',
    },
    {
      id: 'PIMENTA-02',
      identificacao: 'Fazenda Rio Preto 02 • São Mateus ES (Kuthiravally)',
      variedade: 'Kuthiravally',
      tipoTutor: 'TUTOR_MORTO_EUCALIPTO',
      areaHa: 12,
      pimentaSecaKg: 44500,
      teorPiperinaPct: 4.50,
      densidadeLitroGramas: 560,
      statusExportacao: 'APROVADO_ASTA_GRADE_1',
    },
  ]);

  // Simulador Econômico da Pimenta-do-Reino
  const [areaHa, setAreaHa] = useState<number>(30);
  const [produtividadeKgHa, setProdutividadeKgHa] = useState<number>(3800);
  const [teorPiperinaPct, setTeorPiperinaPct] = useState<number>(4.6);
  const [precoKgPimentaReais, setPrecoKgPimentaReais] = useState<number>(32.0);
  const [custoTotalHaReais, setCustoTotalHaReais] = useState<number>(36000.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const producaoTotalKg = areaHa * produtividadeKgHa;
    const receitaBrutaReais = Number((producaoTotalKg * precoKgPimentaReais).toFixed(2));
    const custoTotalReais = Number((areaHa * custoTotalHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaReais || 1)) * 100).toFixed(1));

    return {
      producaoTotalKg,
      receitaBrutaReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaHa,
    produtividadeKgHa,
    precoKgPimentaReais,
    custoTotalHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/60 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                Módulo 109 • Pimenta-do-Reino & Padrão ASTA
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                Piper nigrum • Piperina &gt; 4.0% • 565 g/L
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🌶️ Pimenta-do-Reino de Precisão: Tutores, Branqueamento & ASTA
            </h2>
            <p className="text-sm text-slate-900 max-w-3xl leading-relaxed">
              Manejo de pimentais com tutor vivo de gliricídia ou eucalipto tratado, irrigação por gotejamento, choque hidrotérmico (branqueamento a 80°C) para escurecimento enzimático uniforme e secagem em estufa solar atendendo às exigências da American Spice Trade Association (ASTA).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Pimenta Seca</span>
              <span className="text-xl font-black text-emerald-400">114.000 kg</span>
              <span className="text-[10px] text-slate-600 block mt-0.5">30 ha Pimental</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Faturamento</span>
              <span className="text-xl font-black text-amber-400">R$ 3,64M</span>
              <span className="text-[10px] text-amber-400/80 block mt-0.5">ASTA Grade 1</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Teor de Piperina</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">4.60% Piperina</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Acima do mínimo de 4.0%
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Densidade a Granel</span>
            <Box className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">565 g / Litro</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Padrão Grade 1 (Mínimo 550 g/L)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Preço de Exportação</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">R$ 32,00 / kg</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Mercado EUA e União Europeia
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">R$ 2.568.000,00</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            R$ 85.600,00 por hectare
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('pimentais')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pimentais'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <Leaf className="w-4 h-4" />
          1. Pimentais & Tutores Vivos
        </button>

        <button
          onClick={() => setActiveTab('processamento')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'processamento'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          2. Branqueamento & Secagem Solar
        </button>

        <button
          onClick={() => setActiveTab('asta')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'asta'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          3. Padrão Sanitário ASTA
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico
        </button>
      </div>

      {/* Conteúdo Aba 1: Pimentais */}
      {activeTab === 'pimentais' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              Sistemas de Condução e Tutores
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              O uso de tutores vivos com *Gliricidia sepium* fixa até 120 kg N/ha, fornece sombra parcial amenizando o escaldamento dos frutos e reduz o custo inicial de implantação em 40% quando comparado ao eucalipto tratado.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Lote / Local</th>
                    <th className="py-3 px-3">Variedade</th>
                    <th className="py-3 px-3">Tutor</th>
                    <th className="py-3 px-3">Área (ha)</th>
                    <th className="py-3 px-3">Produção Seca</th>
                    <th className="py-3 px-3">Piperina</th>
                    <th className="py-3 px-3">Densidade</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {lotes.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{l.identificacao}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{l.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-emerald-300 font-semibold">{l.variedade}</td>
                      <td className="py-3.5 px-3 text-slate-900">{l.tipoTutor}</td>
                      <td className="py-3.5 px-3 font-mono text-white">{l.areaHa} ha</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">{l.pimentaSecaKg.toLocaleString()} kg</td>
                      <td className="py-3.5 px-3 font-mono text-cyan-400 font-bold">{l.teorPiperinaPct}%</td>
                      <td className="py-3.5 px-3 font-mono text-amber-300">{l.densidadeLitroGramas} g/L</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {l.statusExportacao}
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

      {/* Conteúdo Aba 2: Processamento */}
      {activeTab === 'processamento' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Choque Hidrotérmico (Branqueamento a 80°C)
            </h3>
            <p className="text-xs text-slate-600">
              Imersão dos grãos debulhados em água a 80°C por 1 a 2 minutos imediatamente antes da secagem:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-white block">Ativação da Polifenoloxidase (PPO)</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Promove oxidação rápida dos taninos, conferindo cor preto-ébano brilhante e homogênea aos grãos secos.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-white block">Esterilização Superficial Térmica</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Elimina coliformes e esporos fúngicos trazidos da lavoura, garantindo umidade final estável em 11.5%.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              Túneis Solares com Exaustão Forçada
            </h3>
            <p className="text-xs text-slate-600">
              Secagem protegida contra poeira e fezes de aves:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Tempo de Secagem no Túnel:</span>
                <span className="font-mono font-bold text-emerald-400">3 dias (vs 7 dias no chão)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Umidade Final Crítica:</span>
                <span className="font-mono font-bold text-cyan-400">11.0% a 12.0% UR</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: ASTA */}
      {activeTab === 'asta' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Padrões Microbiológicos e Físicos ASTA
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              A American Spice Trade Association estabelece limites estritos para importação de especiarias nos EUA e Europa. Lotes aprovados como ASTA Grade 1 não sofrem descontos e são embarcados diretamente nos portos de Belém e Vitória.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Salmonella spp.</span>
                <span className="text-2xl font-black text-white font-mono">Ausência / 25g</span>
                <span className="text-[11px] text-emerald-400 block">100% Conforme</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Matérias Estranhas</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">&lt; 0.5%</span>
                <span className="text-[11px] text-slate-600 block">Mesa densimétrica e ímãs</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Pimenta Branca</span>
                <span className="text-2xl font-black text-amber-400 font-mono">Maceração Lenta</span>
                <span className="text-[11px] text-slate-600 block">Remoção mecânica do pericarpo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Parâmetros do Pimental
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Área Plantada (ha)</span>
                <span className="font-mono text-emerald-400">{areaHa} hectares</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={areaHa}
                onChange={(e) => setAreaHa(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Produtividade Seca (kg/ha)</span>
                <span className="font-mono text-cyan-400">{produtividadeKgHa} kg/ha</span>
              </div>
              <input
                type="range"
                min="1800"
                max="5500"
                step="100"
                value={produtividadeKgHa}
                onChange={(e) => setProdutividadeKgHa(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Preço Venda Grade 1 (R$/kg)</span>
                <span className="font-mono text-amber-400">R$ {precoKgPimentaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="20.0"
                max="50.0"
                step="1.0"
                value={precoKgPimentaReais}
                onChange={(e) => setPrecoKgPimentaReais(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Custo de Manejo e Indústria por Ha</span>
                <span className="font-mono text-rose-400">R$ {custoTotalHaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="60000"
                step="1000"
                value={custoTotalHaReais}
                onChange={(e) => setCustoTotalHaReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Retorno Financeiro da Pimenta-do-Reino
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Pimenta Seca</span>
                <span className="font-mono font-bold text-white text-base">
                  {(metricas.producaoTotalKg / 1000).toFixed(1)} ton
                </span>
                <span className="text-[10px] text-slate-600 block">{areaHa} ha colhidos</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Piperina Pura</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  {((metricas.producaoTotalKg * teorPiperinaPct) / 100).toFixed(0)} kg
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{teorPiperinaPct}% ativo</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricas.receitaBrutaReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-slate-600 block">Padrão ASTA</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricas.lucroLiquidoReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Receita Bruta com Pimenta-do-Reino Seca ({metricas.producaoTotalKg.toLocaleString()} kg @ R$ {precoKgPimentaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-white">
                  R$ {metricas.receitaBrutaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custos de Tutores, Adubação NPK, Branqueamento e Túneis Solares:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {metricas.custoTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-950/30 px-3 rounded-lg border border-emerald-800/50">
                <span className="text-white">Lucro Líquido Anual Consolidado do Pimental:</span>
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

export default PimentaDoReinoQualidadeModule;
