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
  Flower2,
  Droplets,
  Heart
} from 'lucide-react';

interface ColmeiaAsf {
  id: string;
  especie: 'Melipona quadrifasciata (Mandaçaia)' | 'Tetragonisca angustula (Jataí)' | 'Melipona compressipes (Tiúba)' | 'Melipona scutellaris (Uruçu)';
  caixasAtivas: number;
  areaAtendidaHa: number;
  culturaAlvo: 'Morango em Estufa' | 'Pomar de Café Especial' | 'Açaizais Irrigados';
  producaoMelLitrosAno: number;
  ganhoVingamentoPct: number;
  statusSanitario: 'COLONIA_FORTE_RAINHA_ATIVA' | 'DIVISAO_PROGRAMADA';
}

export const MeliponiculturaAsfModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'colmeias' | 'polinizacao' | 'mel' | 'simulador'>('colmeias');

  // Colmeias de ASFs
  const [colmeias] = useState<ColmeiaAsf[]>([
    {
      id: 'MELIPONA-01',
      especie: 'Melipona quadrifasciata (Mandaçaia)',
      caixasAtivas: 80,
      areaAtendidaHa: 10,
      culturaAlvo: 'Morango em Estufa',
      producaoMelLitrosAno: 200,
      ganhoVingamentoPct: 28.5,
      statusSanitario: 'COLONIA_FORTE_RAINHA_ATIVA',
    },
    {
      id: 'MELIPONA-02',
      especie: 'Tetragonisca angustula (Jataí)',
      caixasAtivas: 120,
      areaAtendidaHa: 15,
      culturaAlvo: 'Pomar de Café Especial',
      producaoMelLitrosAno: 120,
      ganhoVingamentoPct: 22.0,
      statusSanitario: 'COLONIA_FORTE_RAINHA_ATIVA',
    },
  ]);

  // Simulador Econômico da Meliponicultura
  const [totalColmeias, setTotalColmeias] = useState<number>(100);
  const [areaPolinizadaHa, setAreaPolinizadaHa] = useState<number>(12);
  const [producaoMelLitrosColmeia, setProducaoMelLitrosColmeia] = useState<number>(2.5);
  const [precoLitroMelAsfReais, setPrecoLitroMelAsfReais] = useState<number>(180.0);
  const [aluguelPolinizacaoHaReais, setAluguelPolinizacaoHaReais] = useState<number>(2500.0);
  const [custoManejoAnualReais, setCustoManejoAnualReais] = useState<number>(28000.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const volumeMelTotalLitros = totalColmeias * producaoMelLitrosColmeia;
    const receitaMelReais = volumeMelTotalLitros * precoLitroMelAsfReais;
    const receitaPolinizacaoReais = areaPolinizadaHa * aluguelPolinizacaoHaReais;
    const receitaBrutaTotalReais = Number((receitaMelReais + receitaPolinizacaoReais).toFixed(2));

    const lucroLiquidoReais = Number((receitaBrutaTotalReais - custoManejoAnualReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaTotalReais || 1)) * 100).toFixed(1));

    return {
      volumeMelTotalLitros,
      receitaMelReais,
      receitaPolinizacaoReais,
      receitaBrutaTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    totalColmeias,
    areaPolinizadaHa,
    producaoMelLitrosColmeia,
    precoLitroMelAsfReais,
    aluguelPolinizacaoHaReais,
    custoManejoAnualReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-yellow-950/70 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Flower2 className="w-3.5 h-3.5" />
                Módulo 103 • Meliponicultura & Abelhas Nativas Sem Ferrão
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Polinização Dirigida • Mel Medicinal R$ 180/L
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🐝 Meliponicultura 4.0: Polinização de Alto Valor & Mel Nobre
            </h2>
            <p className="text-sm text-[#26332A] max-w-3xl leading-relaxed">
              Manejo racional de abelhas nativas sem ferrão (Mandaçaia, Tiúba, Jataí e Uruçu) em caixas inteligentes modelo INPA. Serviços ecossistêmicos de polinização de precisão em estufas e pomares com aumento de 28% no vingamento de frutos e extração de méis de potes medicinais.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Mel Nobre ASF</span>
              <span className="text-xl font-black text-amber-400">250 L</span>
              <span className="text-[10px] text-[#66736A] block mt-0.5">100 Colmeias</span>
            </div>
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Faturamento</span>
              <span className="text-xl font-black text-emerald-400">R$ 75.000</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">62.7% Margem</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Aumento de Vingamento</span>
            <Flower2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">+ 28.5% Frutos</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Polinização por Vibração (Buzz)
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Redução de Deformidades</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">- 62.0% Perdas</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Morangos e Tomates Classe Extra
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Preço do Mel ASF</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">R$ 180,00 / L</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Alta Concentração de Flavonoides
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">R$ 47.000,00</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Mel + Aluguel de Polinização
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('colmeias')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'colmeias'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Flower2 className="w-4 h-4" />
          1. Meliponário & Espécies
        </button>

        <button
          onClick={() => setActiveTab('polinizacao')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'polinizacao'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Activity className="w-4 h-4" />
          2. Polinização por Vibração (Buzz)
        </button>

        <button
          onClick={() => setActiveTab('mel')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'mel'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Droplets className="w-4 h-4" />
          3. Mel Pot & Geoprópolis
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico
        </button>
      </div>

      {/* Conteúdo Aba 1: Colmeias */}
      {activeTab === 'colmeias' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Flower2 className="w-5 h-5 text-amber-400" />
              Colmeias Racionais em Monitoramento IoT
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              Ao contrário das abelhas com ferrão (Apis mellifera), as abelhas nativas brasileiras não atacam operadores, permitindo o manejo diário seguro dentro de estufas fechadas com trabalhadores rurais e visitantes presentes.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAF4E7] text-[#66736A] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Lote / Espécie</th>
                    <th className="py-3 px-3">Caixas Ativas</th>
                    <th className="py-3 px-3">Área Atendida</th>
                    <th className="py-3 px-3">Cultura Alvo</th>
                    <th className="py-3 px-3">Mel Estimado</th>
                    <th className="py-3 px-3">Vingamento</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {colmeias.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{c.especie}</div>
                        <div className="text-[11px] text-[#66736A] font-mono">{c.id}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-amber-300 font-bold">{c.caixasAtivas} caixas</td>
                      <td className="py-3.5 px-3 font-mono text-white">{c.areaAtendidaHa} ha</td>
                      <td className="py-3.5 px-3 text-cyan-300 font-semibold">{c.culturaAlvo}</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">{c.producaoMelLitrosAno} L/ano</td>
                      <td className="py-3.5 px-3 font-mono text-teal-300 font-bold">+{c.ganhoVingamentoPct}%</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {c.statusSanitario}
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

      {/* Conteúdo Aba 2: Polinização */}
      {activeTab === 'polinizacao' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Polinização por Vibração (Buzz Pollination)
            </h3>
            <p className="text-xs text-[#66736A]">
              Espécies como Melipona quadrifasciata agarram as anteras das flores e vibram as asas na frequência exata para liberar o pólen preso:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Solanáceas (Tomate, Berinjela, Pimentão)</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Anteras poricidas exigem vibração acústica; abelhas nativas aumentam em 25% o peso médio dos frutos e o teor de sólidos solúveis (°Brix).
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Morangos em Estufa Hidropônica</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  A fecundação completa de todos os pistilos elimina frutos tortos ou ocos, convertendo 95% da colheita em padrão Exportação Classe 1.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Densidade Ótima em Estufas
            </h3>
            <p className="text-xs text-[#66736A]">
              Recomendação por hectare de ambiente protegido:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Carga Recomendada:</span>
                <span className="font-mono font-bold text-amber-400">6 a 10 caixas / hectare</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Distância Máxima de Voo:</span>
                <span className="font-mono font-bold text-cyan-400">Até 800 metros do ninho</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Mel */}
      {activeTab === 'mel' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-amber-400" />
              Mel em Potes de Cerume & Geoprópolis Medicinal
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              As abelhas sem ferrão armazenam o mel em potes ovalados feitos de cerume (mistura de cera pura e própolis). Esse mel possui acidez natural refrescante, aroma floral exuberante e alto poder antimicrobiano devido à presença de compostos fenólicos exclusivos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Desumidificação a Frio</span>
                <span className="text-2xl font-black text-white font-mono">&lt; 18.0% UR</span>
                <span className="text-[11px] text-emerald-400 block">Impede fermentação espontânea</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Geoprópolis Ativa</span>
                <span className="text-2xl font-black text-amber-400 font-mono">Própolis + Barro</span>
                <span className="text-[11px] text-[#66736A] block">Propriedades antivirais nobres</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Mercado Gourmet</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">Chefs Michelin</span>
                <span className="text-[11px] text-[#66736A] block">Cotação até R$ 250/L em frascos</span>
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
              <BarChart3 className="w-5 h-5 text-amber-400" />
              Parâmetros da Meliponicultura
            </h3>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Número de Colmeias</span>
                <span className="font-mono text-amber-400">{totalColmeias} caixas</span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="10"
                value={totalColmeias}
                onChange={(e) => setTotalColmeias(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Área Alugada para Polinização (ha)</span>
                <span className="font-mono text-cyan-400">{areaPolinizadaHa} ha</span>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                step="1"
                value={areaPolinizadaHa}
                onChange={(e) => setAreaPolinizadaHa(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Preço Litro Mel ASF (R$)</span>
                <span className="font-mono text-emerald-400">R$ {precoLitroMelAsfReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="120"
                max="260"
                step="10"
                value={precoLitroMelAsfReais}
                onChange={(e) => setPrecoLitroMelAsfReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Custo de Manejo e Alimentação Suplementar</span>
                <span className="font-mono text-rose-400">R$ {custoManejoAnualReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="60000"
                step="2000"
                value={custoManejoAnualReais}
                onChange={(e) => setCustoManejoAnualReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Retorno Financeiro dos Serviços com Abelhas Nativas
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Mel Total</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {metricas.volumeMelTotalLitros.toFixed(0)} L
                </span>
                <span className="text-[10px] text-amber-400/80 block">Extremamente Puro</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Receita Polinização</span>
                <span className="font-mono font-bold text-cyan-400 text-base">
                  R$ {(metricas.receitaPolinizacaoReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-cyan-400/80 block">{areaPolinizadaHa} ha atendidos</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Receita Total</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricas.receitaBrutaTotalReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-[#66736A] block">Mel + Serviços</span>
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
                <span className="text-[#66736A]">Receita com Venda de Mel Puro Desumidificado ({metricas.volumeMelTotalLitros} L @ R$ {precoLitroMelAsfReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-amber-400">
                  R$ {metricas.receitaMelReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Receita com Locação de Caixas para Polinização de Estufas ({areaPolinizadaHa} ha @ R$ {aluguelPolinizacaoHaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-cyan-400">
                  + R$ {metricas.receitaPolinizacaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Custos Totais com Caixas Racionais, Alimentação e Sanidade:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {custoManejoAnualReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-amber-950/30 px-3 rounded-lg border border-amber-800/50">
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

export default MeliponiculturaAsfModule;
