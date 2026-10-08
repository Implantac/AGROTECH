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
  Milk,
  Sun,
  Flame
} from 'lucide-react';

interface LoteCaprino {
  id: string;
  identificacao: string;
  raca: 'Saanen (Suíça Leiteira)' | 'Alpina Francesa' | 'Toggenburg';
  matrizesLactacao: number;
  producaoLitrosDiaMatriz: number;
  ccsMilCelulasMl: number;
  teorGorduraPct: number;
  teorProteinaPct: number;
  destinoLeite: 'QUEIJO_CHEVRE_BARRICA' | 'CROTTIN_MATURADO' | 'BOURSIN_FRESCO';
  status: 'EM_LACTACAO_PICO' | 'SECAGEM_PROGRAMADA';
}

export const CaprinoculturaQueijosModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rebanho' | 'queijaria' | 'sanidade' | 'simulador'>('rebanho');

  // Lotes do Rebanho Caprino
  const [lotes] = useState<LoteCaprino[]>([
    {
      id: 'CAPRINO-LOTE-01',
      identificacao: 'Lote Alpha • Matrizes Saanen 1ª e 2ª Ordem de Parto',
      raca: 'Saanen (Suíça Leiteira)',
      matrizesLactacao: 70,
      producaoLitrosDiaMatriz: 3.4,
      ccsMilCelulasMl: 850,
      teorGorduraPct: 3.8,
      teorProteinaPct: 3.3,
      destinoLeite: 'QUEIJO_CHEVRE_BARRICA',
      status: 'EM_LACTACAO_PICO',
    },
    {
      id: 'CAPRINO-LOTE-02',
      identificacao: 'Lote Beta • Matrizes Alpina Francesa Alta Gordura',
      raca: 'Alpina Francesa',
      matrizesLactacao: 50,
      producaoLitrosDiaMatriz: 3.0,
      ccsMilCelulasMl: 920,
      teorGorduraPct: 4.1,
      teorProteinaPct: 3.5,
      destinoLeite: 'CROTTIN_MATURADO',
      status: 'EM_LACTACAO_PICO',
    },
  ]);

  // Simulador Econômico da Caprinocultura
  const [matrizesTotais, setMatrizesTotais] = useState<number>(120);
  const [producaoLeiteDiaMatriz, setProducaoLeiteDiaMatriz] = useState<number>(3.2);
  const [diasLactacaoAno, setDiasLactacaoAno] = useState<number>(280);
  const [rendimentoQueijoLitrosPorKg, setRendimentoQueijoLitrosPorKg] = useState<number>(7.5);
  const [precoKgQueijoChevreReais, setPrecoKgQueijoChevreReais] = useState<number>(95.0);
  const [custoOperacionalAnoReais, setCustoOperacionalAnoReais] = useState<number>(580000.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const volumeTotalLeiteAnoLitros = matrizesTotais * producaoLeiteDiaMatriz * diasLactacaoAno;
    const queijoProduzidoKg = Number((volumeTotalLeiteAnoLitros / rendimentoQueijoLitrosPorKg).toFixed(1));
    const receitaBrutaReais = Number((queijoProduzidoKg * precoKgQueijoChevreReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoOperacionalAnoReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaReais || 1)) * 100).toFixed(1));

    return {
      volumeTotalLeiteAnoLitros,
      queijoProduzidoKg,
      receitaBrutaReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    matrizesTotais,
    producaoLeiteDiaMatriz,
    diasLactacaoAno,
    rendimentoQueijoLitrosPorKg,
    precoKgQueijoChevreReais,
    custoOperacionalAnoReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-yellow-950/70 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-amber-500/20 text-amber-800 border border-amber-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Milk className="w-3.5 h-3.5" />
                Módulo 104 • Caprinocultura Leiteira & Queijos Finos
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 rounded-full">
                Saanen & Alpina • Queijos Chèvre e Crottin
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              🐐 Caprinocultura de Precisão, Queijaria Artesanal & Chèvre
            </h2>
            <p className="text-sm text-slate-900 max-w-3xl leading-relaxed">
              Manejo intensivo de cabras leiteiras em aprisco suspenso ripado, controle fotoperiódico para quebra de estacionalidade reprodutiva, sanidade da secreção apócrina do leite e maturação de queijos finos artesanais (Chèvre, Crottin de Chavignol e Boursin).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Queijo Chèvre</span>
              <span className="text-xl font-black text-amber-700">14.336 kg</span>
              <span className="text-[10px] text-slate-600 block mt-0.5">120 Matrizes</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Faturamento</span>
              <span className="text-xl font-black text-emerald-700">R$ 1,36M</span>
              <span className="text-[10px] text-emerald-700/80 block mt-0.5">57.4% Margem</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Produção Média</span>
            <Activity className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">3.20 L / cabra / dia</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            280 dias de persistência
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Rendimento Queijeiro</span>
            <Milk className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black text-sky-700">7.5 L / kg Chèvre</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Massa Lática com Drenagem Lenta
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Preço Médio do Queijo</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-700">R$ 95,00 / kg</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Mercado Gastronômico e Empórios
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-black text-teal-700">R$ 781.920,00</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            R$ 6.516,00 por matriz ao ano
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('rebanho')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'rebanho'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Milk className="w-4 h-4" />
          1. Rebanho Leiteiro & Aprisco
        </button>

        <button
          onClick={() => setActiveTab('queijaria')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'queijaria'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Award className="w-4 h-4" />
          2. Queijaria & Maturação Chèvre
        </button>

        <button
          onClick={() => setActiveTab('sanidade')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sanidade'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          3. Sanidade & Secreção Apócrina
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico
        </button>
      </div>

      {/* Conteúdo Aba 1: Rebanho */}
      {activeTab === 'rebanho' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Milk className="w-5 h-5 text-amber-700" />
              Lotes de Matrizes em Aprisco Suspenso Climatizado
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Aprisco com piso ripado elevado evita contato com fezes e umidade, reduzindo drasticamente verminoses e pododermatite. O manejo alimentar baseia-se em feno de Tifton 85, silagem de milho de alta energia e concentrado com 18% PB balanceado.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Lote / Aprisco</th>
                    <th className="py-3 px-3">Raça</th>
                    <th className="py-3 px-3">Matrizes</th>
                    <th className="py-3 px-3">Produção/Dia</th>
                    <th className="py-3 px-3">Gordura / Prot</th>
                    <th className="py-3 px-3">CCS (mil/mL)</th>
                    <th className="py-3 px-3">Destino</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {lotes.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{l.identificacao}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{l.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-amber-800 font-semibold">{l.raca}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-800">{l.matrizesLactacao} cab</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-700 font-bold">{l.producaoLitrosDiaMatriz} L/dia</td>
                      <td className="py-3.5 px-3 font-mono text-sky-800">{l.teorGorduraPct}% / {l.teorProteinaPct}%</td>
                      <td className="py-3.5 px-3 font-mono text-slate-900">{l.ccsMilCelulasMl} mil</td>
                      <td className="py-3.5 px-3 text-amber-800 font-semibold">{l.destinoLeite}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30">
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

      {/* Conteúdo Aba 2: Queijaria */}
      {activeTab === 'queijaria' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-700" />
              Tipificação de Queijos Nobres de Cabra
            </h3>
            <p className="text-xs text-slate-600">
              Transformação do leite na queijaria própria da fazenda com pasteurização lenta a 65°C por 30 minutos:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Chèvre Tradicional em Tronco</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Coagulação predominantemente lática (24 horas), textura aveludada e cobertura com carvão vegetal alimentício ou cinzas nobres.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Crottin de Chavignol Maturado</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Maturado por 3 a 6 semanas sob umidade de 85% e temperatura de 11°C, desenvolvendo mofo branco Geotrichum candidum.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              Digestibilidade e Hipoalergenicidade
            </h3>
            <p className="text-xs text-slate-600">
              Vantagens nutricionais do leite caprino:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Globulos de Gordura Menores:</span>
                <span className="font-mono font-bold text-emerald-700">Digestão em 20 min (vs 2h vaca)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Fração de Proteína Alfa-S1 Caseína:</span>
                <span className="font-mono font-bold text-sky-700">Quase Nula (Não inflamatório)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Sanidade */}
      {activeTab === 'sanidade' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              Fisiologia Apócrina & Contagem de Células Somáticas (CCS)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Ao contrário da vaca (que possui secreção merócrina), a glândula mamária da cabra desprende fragmentos citoplasmáticos celulares apicais normais no leite durante a ordenha. Por isso, a CCS normal em cabras sadias pode atingir até 1.000.000 células/mL sem indicar mastite clínica, exigindo equipamento calibrado com corante de DNA (como brometo de etídio) para não falsificar mastite.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Calibração Específica</span>
                <span className="text-2xl font-black text-slate-900 font-mono">Fluoro-Óptica</span>
                <span className="text-[11px] text-emerald-700 block">Distingue glóbulos de leucócitos</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Controle de CAE</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">100% Negativo</span>
                <span className="text-[11px] text-slate-600 block">Artrite Encefalite Caprina (Livre)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Linha de Ordenha</span>
                <span className="text-2xl font-black text-amber-700 font-mono">Circuito Fechado</span>
                <span className="text-[11px] text-slate-600 block">Inox 316L sanitário</span>
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
              <BarChart3 className="w-5 h-5 text-amber-700" />
              Parâmetros da Caprinocultura
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Matrizes em Lactação</span>
                <span className="font-mono text-amber-700">{matrizesTotais} cabras</span>
              </div>
              <input
                type="range"
                min="30"
                max="300"
                step="10"
                value={matrizesTotais}
                onChange={(e) => setMatrizesTotais(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Produção por Matriz (L/dia)</span>
                <span className="font-mono text-sky-700">{producaoLeiteDiaMatriz} L/dia</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="4.5"
                step="0.1"
                value={producaoLeiteDiaMatriz}
                onChange={(e) => setProducaoLeiteDiaMatriz(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Preço do Queijo Chèvre (R$/kg)</span>
                <span className="font-mono text-emerald-700">R$ {precoKgQueijoChevreReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="65"
                max="140"
                step="5"
                value={precoKgQueijoChevreReais}
                onChange={(e) => setPrecoKgQueijoChevreReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Custo Operacional Total / Ano</span>
                <span className="font-mono text-rose-700">R$ {custoOperacionalAnoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="200000"
                max="1000000"
                step="20000"
                value={custoOperacionalAnoReais}
                onChange={(e) => setCustoOperacionalAnoReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              Retorno Financeiro da Queijaria Caprina
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Leite Coletado</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {(metricas.volumeTotalLeiteAnoLitros / 1000).toFixed(0)}k L
                </span>
                <span className="text-[10px] text-slate-600 block">{matrizesTotais} matrizes</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Queijo Produzido</span>
                <span className="font-mono font-bold text-amber-700 text-base">
                  {metricas.queijoProduzidoKg.toLocaleString()} kg
                </span>
                <span className="text-[10px] text-amber-700/80 block">7.5 L/kg rendimento</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  R$ {(metricas.receitaBrutaReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-slate-600 block">Venda Boutique</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  R$ {(metricas.lucroLiquidoReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-700/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Receita com Venda de Queijos Finos ({metricas.queijoProduzidoKg.toLocaleString()} kg @ R$ {precoKgQueijoChevreReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-slate-900">
                  R$ {metricas.receitaBrutaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custos Totais de Nutrição (Feno/Concentrado), Veterinária e Queijaria:</span>
                <span className="font-mono font-bold text-rose-700">
                  - R$ {custoOperacionalAnoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-amber-50 px-3 rounded-lg border border-amber-200">
                <span className="text-slate-900">Lucro Líquido Anual Consolidado:</span>
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

export default CaprinoculturaQueijosModule;
