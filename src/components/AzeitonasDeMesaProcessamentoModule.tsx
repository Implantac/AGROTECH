import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Droplets,
  DollarSign,
  TrendingUp,
  Layers,
  Award,
  CheckCircle2,
  Sliders,
  Scale,
  FlaskConical,
} from 'lucide-react';

interface TanqueFermentacao {
  id: string;
  tanque: string;
  cultivar: 'MANZANILLA' | 'GORDAL_SEVILLANA' | 'ASCOLANA' | 'ARAUCO';
  metodoCura: 'SEVILHANO_ALCALINO' | 'NATURAL_SALMOURA' | 'CALIFORNIANO_OXIDADO';
  volumeKg: number;
  diasFermentacao: number;
  salinidadePct: number;
  phSalmoura: number;
  acidezVolatilPct: number;
  status: 'EM_FERMENTACAO' | 'PRONTO_ENVASAR' | 'DESAMARGAMENTO';
}

export const AzeitonasDeMesaProcessamentoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tanques' | 'metodos' | 'qualidade' | 'simulador'>('tanques');

  // Parâmetros do Simulador
  const [kgProcessadosAno, setKgProcessadosAno] = useState<number>(180000);
  const [custoKgAzeitonaInNatura, setCustoKgAzeitonaInNatura] = useState<number>(7.5);
  const [custoInsumosProcessoKg, setCustoInsumosProcessoKg] = useState<number>(2.4);
  const [rendimentoFinalDrenadoPct, setRendimentoFinalDrenadoPct] = useState<number>(88.0);
  const [precoKgAzeitonaEnvasada, setPrecoKgAzeitonaEnvasada] = useState<number>(24.0);

  const [tanques, setTanques] = useState<TanqueFermentacao[]>([
    {
      id: 'TNK-01',
      tanque: 'Tanque Inox Fermentador 01 (Mantiqueira - MG)',
      cultivar: 'MANZANILLA',
      metodoCura: 'SEVILHANO_ALCALINO',
      volumeKg: 15000,
      diasFermentacao: 45,
      salinidadePct: 7.2,
      phSalmoura: 3.85,
      acidezVolatilPct: 0.65,
      status: 'PRONTO_ENVASAR',
    },
    {
      id: 'TNK-02',
      tanque: 'Tanque Subterrâneo 02 (Pelotas - RS)',
      cultivar: 'GORDAL_SEVILLANA',
      metodoCura: 'NATURAL_SALMOURA',
      volumeKg: 20000,
      diasFermentacao: 90,
      salinidadePct: 8.5,
      phSalmoura: 4.1,
      acidezVolatilPct: 0.58,
      status: 'EM_FERMENTACAO',
    },
    {
      id: 'TNK-03',
      tanque: 'Tanque Maturação 03 (Maria da Fé - MG)',
      cultivar: 'ASCOLANA',
      metodoCura: 'SEVILHANO_ALCALINO',
      volumeKg: 12000,
      diasFermentacao: 12,
      salinidadePct: 6.8,
      phSalmoura: 4.25,
      acidezVolatilPct: 0.42,
      status: 'DESAMARGAMENTO',
    },
  ]);

  const metricas = useMemo(() => {
    const kgFinalEnvasado = Number(((kgProcessadosAno * rendimentoFinalDrenadoPct) / 100).toFixed(0));
    const custoMateriaPrima = Number((kgProcessadosAno * custoKgAzeitonaInNatura).toFixed(2));
    const custoInsumos = Number((kgProcessadosAno * custoInsumosProcessoKg).toFixed(2));
    const custoTotalProcessamento = Number((custoMateriaPrima + custoInsumos).toFixed(2));
    const custoMedioPorKgEnvasado = kgFinalEnvasado > 0 ? Number((custoTotalProcessamento / kgFinalEnvasado).toFixed(2)) : 0;
    const receitaBrutaAno = Number((kgFinalEnvasado * precoKgAzeitonaEnvasada).toFixed(2));
    const lucroLiquidoAno = Number((receitaBrutaAno - custoTotalProcessamento).toFixed(2));
    const margemLiquidaPct = receitaBrutaAno > 0 ? Number(((lucroLiquidoAno / receitaBrutaAno) * 100).toFixed(1)) : 0;

    return {
      kgFinalEnvasado,
      custoTotalProcessamento,
      custoMedioPorKgEnvasado,
      receitaBrutaAno,
      lucroLiquidoAno,
      margemLiquidaPct,
    };
  }, [
    kgProcessadosAno,
    custoKgAzeitonaInNatura,
    custoInsumosProcessoKg,
    rendimentoFinalDrenadoPct,
    precoKgAzeitonaEnvasada,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Droplets className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Azeitonas de Mesa & Cura Hidroeletrolítica
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Módulo 124 • Método Sevilhano & Fermentação Lática
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Controle de desamargamento alcalino da oleuropeína, controle microbiológico com bactérias ácido-láticas e conservação em salmoura equilibrada.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Envase
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Processamento Anual</span>
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {(kgProcessadosAno / 1000).toFixed(1)} toneladas
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            {metricas.kgFinalEnvasado.toLocaleString('pt-BR')} kg drenados envasados
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Custo Médio / kg</span>
            <Sliders className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {metricas.custoMedioPorKgEnvasado.toFixed(2)}
          </p>
          <span className="text-xs text-teal-400 mt-1 block">
            Fruto in natura + soda + salmoura + vidro
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Faturamento Anual</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.receitaBrutaAno / 1000000).toFixed(2)}M
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            Preço médio de R$ {precoKgAzeitonaEnvasada.toFixed(2)} / kg
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Margem Líquida</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.margemLiquidaPct}%
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            R$ {(metricas.lucroLiquidoAno / 1000).toFixed(0)}k de lucro líquido
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tanques')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'tanques'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Tanques de Fermentação
        </button>

        <button
          onClick={() => setActiveTab('metodos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'metodos'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          Métodos de Cura
        </button>

        <button
          onClick={() => setActiveTab('qualidade')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'qualidade'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Award className="w-4 h-4" />
          Padrões de Qualidade
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'tanques' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Droplets className="w-5 h-5 text-emerald-400" />
            Lotes em Fermentação & Monitoramento Físico-Químico
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Tanque / Unidade</th>
                  <th className="px-4 py-3">Cultivar</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3">Volume</th>
                  <th className="px-4 py-3">pH</th>
                  <th className="px-4 py-3">Salinidade</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tanques.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-white">{t.tanque}</td>
                    <td className="px-4 py-3 text-emerald-400 font-medium">{t.cultivar}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{t.metodoCura}</td>
                    <td className="px-4 py-3">{t.volumeKg.toLocaleString('pt-BR')} kg</td>
                    <td className="px-4 py-3 font-bold text-teal-400">{t.phSalmoura}</td>
                    <td className="px-4 py-3">{t.salinidadePct}% NaCl</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'metodos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Estilo Sevilhano (Verdes)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Tratamento com solução de NaOH (1.8% a 2.2%) por 6 a 9 horas para penetração de 2/3 da polpa, hidrólise da oleuropeína amarga e lavagens com água filtrada.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Tempo de Processamento:</span>
              <span className="text-sm font-bold text-emerald-400 block">30 a 60 dias de fermentação lática</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-teal-400" />
              <h4 className="text-sm font-semibold text-white">Método Natural em Salmoura</h4>
            </div>
            <p className="text-xs text-slate-400">
              Sem uso de soda cáustica. Os frutos (verdes-amarelados ou pretos) sofrem fermentação espontânea direta em salmoura a 8-10% de sal, preservando antioxidantes.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Tempo de Processamento:</span>
              <span className="text-sm font-bold text-teal-400 block">6 a 10 meses de cura lenta</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Método Californiano (Pretas)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Tratamentos alcalinos múltiplos intercalados com injeção de ar comprimido para oxidação forçada de compostos fenólicos e fixação com gluconato ferroso.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Acabamento:</span>
              <span className="text-sm font-bold text-yellow-400 block">Coloração preta azeviche uniforme</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'qualidade' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            Parâmetros de Estabilidade Microbiológica e Textura
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">pH Seguro de Conservação</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">pH inferior a 4.0</p>
              <span className="text-[11px] text-slate-400">Inibição de Clostridium botulinum</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Concentração de NaCl</span>
              <p className="text-lg font-bold text-teal-400 mt-1">6.0% a 7.5%</p>
              <span className="text-[11px] text-slate-400">Equilíbrio osmótico e palatabilidade</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Firmeza de Textura</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">superior a 650 g/cm²</p>
              <span className="text-[11px] text-slate-400">Crocância sem amolecimento péctico</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Simulador de Envase & Margem de Valor Agregado
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Fruto In Natura (kg)</label>
              <input
                type="number"
                value={kgProcessadosAno}
                onChange={(e) => setKgProcessadosAno(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Custo Fruto (R$/kg)</label>
              <input
                type="number"
                step="0.5"
                value={custoKgAzeitonaInNatura}
                onChange={(e) => setCustoKgAzeitonaInNatura(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Preço Venda Envasada (R$/kg)</label>
              <input
                type="number"
                step="1"
                value={precoKgAzeitonaEnvasada}
                onChange={(e) => setPrecoKgAzeitonaEnvasada(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Rendimento Drenado (%)</label>
              <input
                type="number"
                step="1"
                value={rendimentoFinalDrenadoPct}
                onChange={(e) => setRendimentoFinalDrenadoPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Custo Total Envasado:</span>
              <span className="text-base font-bold text-teal-400">
                R$ {metricas.custoMedioPorKgEnvasado.toFixed(2)} / kg
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Lucro Líquido Anual:</span>
              <span className="text-xl font-bold text-emerald-400">
                R$ {metricas.lucroLiquidoAno.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
