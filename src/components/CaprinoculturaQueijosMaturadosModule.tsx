import React, { useState, useMemo } from 'react';
import {
  Heart,
  Award,
  DollarSign,
  TrendingUp,
  Layers,
  Scale,
  CheckCircle2,
  Sliders,
  Sparkles,
  Milk,
} from 'lucide-react';

interface LoteQueijoCaprino {
  id: string;
  lote: string;
  tipoQueijo: 'CROTTIN_MATURADO' | 'CHEVRE_FRESCO' | 'CAPRINO_ROMANO_CURADO' | 'BRIQUE_CINZA_VEGETAL';
  maturacaoDias: number;
  rendimentoLitrosPorKg: number;
  estoquePecas: number;
  pesoUnitarioG: number;
  precoUnitarioReais: number;
  status: 'EM_CAMARA_FRIA' | 'PRONTO_EXPEDICAO' | 'ENVOLVIMENTO_FUNGO';
}

export const CaprinoculturaQueijosMaturadosModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lotes' | 'rebanho' | 'maturacao' | 'simulador'>('lotes');

  // Parâmetros do Simulador
  const [cabrasLactacao, setCabrasLactacao] = useState<number>(250);
  const [producaoLeiteCabraDiaLitros, setProducaoLeiteCabraDiaLitros] = useState<number>(3.2);
  const [diasLactacaoAno, setDiasLactacaoAno] = useState<number>(280);
  const [litrosLeitePorKgQueijo, setLitrosLeitePorKgQueijo] = useState<number>(8.5);
  const [precoKgQueijoMaturadoReais, setPrecoKgQueijoMaturadoReais] = useState<number>(145.0);
  const [custoAlimentarAnoReais, setCustoAlimentarAnoReais] = useState<number>(1150000);

  const [lotes, setLotes] = useState<LoteQueijoCaprino[]>([
    {
      id: 'LOT-CAP-01',
      lote: 'Lote 01 - Crottin com Casca Florida (Penicillium candidum)',
      tipoQueijo: 'CROTTIN_MATURADO',
      maturacaoDias: 21,
      rendimentoLitrosPorKg: 8.2,
      estoquePecas: 1200,
      pesoUnitarioG: 120,
      precoUnitarioReais: 24.0,
      status: 'PRONTO_EXPEDICAO',
    },
    {
      id: 'LOT-CAP-02',
      lote: 'Lote 02 - Brique Afinado com Cinza Vegetal de Oliveira',
      tipoQueijo: 'BRIQUE_CINZA_VEGETAL',
      maturacaoDias: 28,
      rendimentoLitrosPorKg: 8.5,
      estoquePecas: 850,
      pesoUnitarioG: 220,
      precoUnitarioReais: 38.0,
      status: 'EM_CAMARA_FRIA',
    },
    {
      id: 'LOT-CAP-03',
      lote: 'Lote 03 - Caprino Romano Curado em Salmoura (6 Meses)',
      tipoQueijo: 'CAPRINO_ROMANO_CURADO',
      maturacaoDias: 180,
      rendimentoLitrosPorKg: 10.5,
      estoquePecas: 400,
      pesoUnitarioG: 1500,
      precoUnitarioReais: 240.0,
      status: 'EM_CAMARA_FRIA',
    },
  ]);

  const metricas = useMemo(() => {
    const producaoTotalLeiteLitros = Number((cabrasLactacao * producaoLeiteCabraDiaLitros * diasLactacaoAno).toFixed(1));
    const queijoProduzidoKg = Number((producaoTotalLeiteLitros / litrosLeitePorKgQueijo).toFixed(1));
    const faturamentoQueijoReais = Number((queijoProduzidoKg * precoKgQueijoMaturadoReais).toFixed(2));
    const lucroOperacionalReais = Number((faturamentoQueijoReais - custoAlimentarAnoReais).toFixed(2));
    const margemOperacionalPct = faturamentoQueijoReais > 0 ? Number(((lucroOperacionalReais / faturamentoQueijoReais) * 100).toFixed(1)) : 0;
    const custoAlimentarPorKgQueijo = queijoProduzidoKg > 0 ? Number((custoAlimentarAnoReais / queijoProduzidoKg).toFixed(2)) : 0;

    return {
      producaoTotalLeiteLitros,
      queijoProduzidoKg,
      faturamentoQueijoReais,
      lucroOperacionalReais,
      margemOperacionalPct,
      custoAlimentarPorKgQueijo,
    };
  }, [
    cabrasLactacao,
    producaoLeiteCabraDiaLitros,
    diasLactacaoAno,
    litrosLeitePorKgQueijo,
    precoKgQueijoMaturadoReais,
    custoAlimentarAnoReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Milk className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Caprinocultura Leiteira & Queijos Artesanais Maturados
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Módulo 128 • Raças Saanen/Anglo & Cura em Câmara de Afinamento
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Rastreabilidade do rebanho leiteiro, rendimento de coagulação enzimática e controle de afinamento com mofos brancos naturais.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Queijaria
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Produção de Leite</span>
            <Milk className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {(metricas.producaoTotalLeiteLitros / 1000).toFixed(1)}k Litros/ano
          </p>
          <span className="text-xs text-amber-400 mt-1 block">
            {producaoLeiteCabraDiaLitros} L/dia por cabra em lactação
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Queijo Produzido</span>
            <Scale className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {(metricas.queijoProduzidoKg / 1000).toFixed(1)} toneladas
          </p>
          <span className="text-xs text-orange-400 mt-1 block">
            Rendimento de {litrosLeitePorKgQueijo} L de leite / kg queijo
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Faturamento da Queijaria</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.faturamentoQueijoReais / 1000000).toFixed(2)}M
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            Preço médio de R$ {precoKgQueijoMaturadoReais.toFixed(2)} / kg
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Margem Operacional</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.margemOperacionalPct}%
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            R$ {(metricas.lucroOperacionalReais / 1000000).toFixed(2)}M de lucro
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('lotes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'lotes'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Lotes de Queijo
        </button>

        <button
          onClick={() => setActiveTab('rebanho')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'rebanho'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Heart className="w-4 h-4" />
          Manejo do Rebanho Saanen
        </button>

        <button
          onClick={() => setActiveTab('maturacao')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'maturacao'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Afinamento & Mofos Nobres
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'lotes' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Milk className="w-5 h-5 text-amber-400" />
            Lotes em Maturação na Queijaria Artesanal
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Lote / Denominação</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Cura (dias)</th>
                  <th className="px-4 py-3">Rendimento</th>
                  <th className="px-4 py-3">Estoque</th>
                  <th className="px-4 py-3">Preço / Peça</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lotes.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-white">{l.lote}</td>
                    <td className="px-4 py-3 text-amber-400 font-medium">{l.tipoQueijo}</td>
                    <td className="px-4 py-3">{l.maturacaoDias} dias</td>
                    <td className="px-4 py-3">{l.rendimentoLitrosPorKg} L/kg</td>
                    <td className="px-4 py-3 font-bold text-white">{l.estoquePecas} peças</td>
                    <td className="px-4 py-3 font-bold text-emerald-400">R$ {l.precoUnitarioReais.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'rebanho' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-semibold text-white">Genética Leiteira Selecionada</h4>
            </div>
            <p className="text-xs text-slate-400">
              Plantel composto por matrizes Saanen puras de origem e Anglo-Nubianas para elevação do teor de gordura e sólidos totais no leite.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Teor de Gordura:</span>
              <span className="text-sm font-bold text-amber-400 block">3.8% a 4.2% de gordura</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Sanidade & Qualidade do Leite</h4>
            </div>
            <p className="text-xs text-slate-400">
              Controle rigoroso de Linfadenite Caseosa e Artrite Encefalite Caprina (CAE) com Contagem de Células Somáticas (CCS) monitorada quinzenalmente.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">CCS Média do Rebanho:</span>
              <span className="text-sm font-bold text-emerald-400 block">inferior a 650.000 cél/ml</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Dieta de Alta Densidade</h4>
            </div>
            <p className="text-xs text-slate-400">
              Fornecimento de feno de alfafa peletizado, silagem de milho grão úmido e suplementação mineral quelatada garantindo lactação contínua de 280 dias.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Persistência de Lactação:</span>
              <span className="text-sm font-bold text-yellow-400 block">superior a 88% no 7º mês</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maturacao' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Câmara Fria Climatizada de Afinamento (12°C & 85% UR)
          </h3>
          <p className="text-sm text-slate-400">
            A inoculação de Geotrichum candidum e Penicillium candidum em ambiente controlado forma uma casca rugosa branca e aveludada, quebrando as proteínas da massa e gerando textura cremosa untuosa com notas de avelã.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Temperatura da Câmara</span>
              <p className="text-lg font-bold text-amber-400 mt-1">11°C a 13°C</p>
              <span className="text-[11px] text-slate-400">Proteólise lenta e controlada</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Umidade Relativa</span>
              <p className="text-lg font-bold text-orange-400 mt-1">85% a 90% UR</p>
              <span className="text-[11px] text-slate-400">Sem ressecamento da crosta</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Prêmio Queijo Brasil</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">Medalha de Ouro</p>
              <span className="text-[11px] text-slate-400">Chèvre Nival com Cinza</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            Simulador de Eficiência Leiteira & Margem do Queijo Maturado
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Cabras em Lactação</label>
              <input
                type="number"
                value={cabrasLactacao}
                onChange={(e) => setCabrasLactacao(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Leite / Cabra / Dia (L)</label>
              <input
                type="number"
                step="0.1"
                value={producaoLeiteCabraDiaLitros}
                onChange={(e) => setProducaoLeiteCabraDiaLitros(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Preço do Queijo (R$/kg)</label>
              <input
                type="number"
                step="5"
                value={precoKgQueijoMaturadoReais}
                onChange={(e) => setPrecoKgQueijoMaturadoReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Custo Alimentar Ano (R$)</label>
              <input
                type="number"
                step="10000"
                value={custoAlimentarAnoReais}
                onChange={(e) => setCustoAlimentarAnoReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Custo de Alimentação por kg de Queijo:</span>
              <span className="text-base font-bold text-amber-400">
                R$ {metricas.custoAlimentarPorKgQueijo.toFixed(2)} / kg queijo
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Lucro Operacional Líquido:</span>
              <span className="text-xl font-bold text-emerald-400">
                R$ {metricas.lucroOperacionalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
