import React, { useState, useMemo } from 'react';
import {
  Trees,
  Droplets,
  Layers,
  Award,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
} from 'lucide-react';

interface PomarAcai {
  id: string;
  talhao: string;
  cultivar: string;
  areaHa: number;
  produtividadeKgHa: number;
  rendimentoPolpaPct: number;
  teorSolidosTotaisPct: number;
  irrigacaoVazaoLPlantaDia: number;
  status: 'COLHEITA_ENTRESSAFRA' | 'FLORESCIMENTO' | 'ENCHIMENTO_FRUTOS';
}

export const AcaiTerraFirmeModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'talhoes' | 'despolpamento' | 'irrigacao' | 'simulador'>('talhoes');

  // Parâmetros do Simulador
  const [areaCultivoHa, setAreaCultivoHa] = useState<number>(20);
  const [produtividadeFrutosKgHa, setProdutividadeFrutosKgHa] = useState<number>(12500);
  const [rendimentoPolpaPct, setRendimentoPolpaPct] = useState<number>(45);
  const [teorSolidosTotaisInputPct, setTeorSolidosTotaisInputPct] = useState<number>(14.8);
  const [precoLitroPolpaReais, setPrecoLitroPolpaReais] = useState<number>(24.0);
  const [custoManejoHaReais, setCustoManejoHaReais] = useState<number>(28000.0);

  const [talhoes, setTalhoes] = useState<PomarAcai[]>([
    {
      id: 'ACAI-01',
      talhao: 'Gleba Terra Firme 01 (Tomé-Açu - PA)',
      cultivar: 'BRS Pai d’Égua (Embrapa)',
      areaHa: 8.0,
      produtividadeKgHa: 13200,
      rendimentoPolpaPct: 46.0,
      teorSolidosTotaisPct: 15.1,
      irrigacaoVazaoLPlantaDia: 120,
      status: 'COLHEITA_ENTRESSAFRA',
    },
    {
      id: 'ACAI-02',
      talhao: 'Gleba Terra Firme 02 (Castanhal - PA)',
      cultivar: 'BRS Pará',
      areaHa: 6.5,
      produtividadeKgHa: 12100,
      rendimentoPolpaPct: 44.5,
      teorSolidosTotaisPct: 14.5,
      irrigacaoVazaoLPlantaDia: 110,
      status: 'COLHEITA_ENTRESSAFRA',
    },
    {
      id: 'ACAI-03',
      talhao: 'Gleba Terra Firme 03 (Igarapé-Miri - PA)',
      cultivar: 'BRS Pai d’Égua Seleção Clone',
      areaHa: 5.5,
      produtividadeKgHa: 11800,
      rendimentoPolpaPct: 45.0,
      teorSolidosTotaisPct: 14.9,
      irrigacaoVazaoLPlantaDia: 115,
      status: 'ENCHIMENTO_FRUTOS',
    },
  ]);

  const metricas = useMemo(() => {
    const producaoFrutosKg = areaCultivoHa * produtividadeFrutosKgHa;
    const volumePolpaLitros = Number((producaoFrutosKg * (rendimentoPolpaPct / 100)).toFixed(1));

    const isAcaiGrossoEspecial = teorSolidosTotaisInputPct > 14.0;

    const receitaBrutaReais = Number((volumePolpaLitros * precoLitroPolpaReais).toFixed(2));
    const custoTotalReais = Number((areaCultivoHa * custoManejoHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = receitaBrutaReais > 0 ? Number(((lucroLiquidoReais / receitaBrutaReais) * 100).toFixed(1)) : 0;

    return {
      producaoFrutosKg,
      volumePolpaLitros,
      isAcaiGrossoEspecial,
      receitaBrutaReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaCultivoHa,
    produtividadeFrutosKgHa,
    rendimentoPolpaPct,
    teorSolidosTotaisInputPct,
    precoLitroPolpaReais,
    custoManejoHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-200 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-800 to-indigo-900 flex items-center justify-center shadow-lg shadow-purple-900/30">
            <Trees className="w-7 h-7 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Açaicultura Irrigada em Terra Firme
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Módulo 118 • BRS Pai d’Égua, Safra na Entressafra & Açaí Grosso
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Microaspersão subcopa de 120 L/planta/dia, quebra da sazonalidade de várzea e extração de Açaí Especial com mais de 14% de sólidos totais.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-purple-700/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Entressafra
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Produção de Frutos</span>
            <Trees className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.producaoFrutosKg.toLocaleString('pt-BR')} kg
          </p>
          <span className="text-xs text-purple-400 mt-1 block">
            {(metricas.producaoFrutosKg / 1000).toFixed(1)} t em terra firme
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Volume de Polpa Pura</span>
            <Droplets className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.volumePolpaLitros.toLocaleString('pt-BR')} L
          </p>
          <span className="text-xs text-indigo-400 mt-1 block">
            Rendimento de {rendimentoPolpaPct}%
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Receita Bruta Entressafra</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.receitaBrutaReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            R$ {precoLitroPolpaReais.toFixed(2)}/L na entressafra
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Lucro Líquido Safra</span>
            <Award className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.lucroLiquidoReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-purple-400 mt-1 block">
            {metricas.margemLiquidaPct}% de Margem Líquida
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('talhoes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'talhoes'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Trees className="w-4 h-4" />
          Glebas & Cultivares
        </button>

        <button
          onClick={() => setActiveTab('despolpamento')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'despolpamento'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Award className="w-4 h-4" />
          Sólidos Totais & Despolpamento
        </button>

        <button
          onClick={() => setActiveTab('irrigacao')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'irrigacao'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Droplets className="w-4 h-4" />
          Manejo Hídrico Subcopa
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'talhoes' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Trees className="w-5 h-5 text-purple-400" />
            Glebas sob Manejo Técnico em Terra Firme (Solo Latossolo Amarelo)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="text-xs uppercase bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Gleba / Município</th>
                  <th className="px-4 py-3">Cultivar Embrapa</th>
                  <th className="px-4 py-3">Área</th>
                  <th className="px-4 py-3">Produtividade</th>
                  <th className="px-4 py-3">Sólidos Totais</th>
                  <th className="px-4 py-3">Lâmina Água</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {talhoes.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-white">{t.talhao}</td>
                    <td className="px-4 py-3">{t.cultivar}</td>
                    <td className="px-4 py-3">{t.areaHa} ha</td>
                    <td className="px-4 py-3 font-bold text-purple-400">{t.produtividadeKgHa} kg/ha</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">{t.teorSolidosTotaisPct}%</td>
                    <td className="px-4 py-3 text-sky-400">{t.irrigacaoVazaoLPlantaDia} L/dia</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
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

      {activeTab === 'despolpamento' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-purple-400" />
              <h4 className="text-sm font-semibold text-white">Açaí Grosso / Especial</h4>
            </div>
            <p className="text-xs text-slate-600">
              Concentração máxima de sólidos totais (fibra, antocianinas e lipídios nobres), com adição mínima de água purificada no despolpamento industrial.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Teor de Sólidos:</span>
              <span className="text-sm font-bold text-purple-400 block">superior a 14.0% de sólidos totais</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-indigo-400" />
              <h4 className="text-sm font-semibold text-white">Açaí Médio (Padrão Comercial)</h4>
            </div>
            <p className="text-xs text-slate-600">
              Polpa de consistência aveludada, pasteurizada a 85°C por 15 segundos para eliminação do Trypanosoma cruzi e congelamento rápido a -35°C.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Faixa de Sólidos:</span>
              <span className="text-sm font-bold text-indigo-400 block">11.0% a 14.0% de sólidos</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Quebra de Sazonalidade</h4>
            </div>
            <p className="text-xs text-slate-600">
              Enquanto o açaí nativo de várzea produz apenas entre agosto e dezembro, a terra firme irrigada produz no primeiro semestre com ágio de até 80%.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Janela Nobre:</span>
              <span className="text-sm font-bold text-emerald-400 block">Fevereiro a Julho (Entressafra)</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'irrigacao' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-400" />
            Manejo Hídrico por Microaspersão Subcopa Automatizada
          </h3>
          <p className="text-sm text-slate-600">
            O açaizeiro necessita de 100 a 140 litros de água por touceira ao dia para manter emissão contínua de cachos. Sensores de umidade de solo (TDR) acionam as bombas durante a noite para reduzir perdas por evapotranspiração.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Vazão Média por Touceira</span>
              <p className="text-lg font-bold text-sky-400 mt-1">120 L / dia</p>
              <span className="text-[11px] text-slate-500">Microaspersor autocompensante</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Fertirrigação Nitrogênio/Potássio</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">Relação N:K 1:1.5</p>
              <span className="text-[11px] text-emerald-500/80">Injeção semanal via Venturi</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Densidade de Plantio</span>
              <p className="text-lg font-bold text-purple-400 mt-1">400 touceiras / ha</p>
              <span className="text-[11px] text-slate-500">Espaçamento 5×5m com 3 a 4 estipes</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
            Simulador de Rentabilidade na Entressafra de Terra Firme
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Área de Cultivo (ha)</label>
              <input
                type="number"
                value={areaCultivoHa}
                onChange={(e) => setAreaCultivoHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Produtividade Frutos (kg/ha)</label>
              <input
                type="number"
                value={produtividadeFrutosKgHa}
                onChange={(e) => setProdutividadeFrutosKgHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Sólidos Totais (%)</label>
              <input
                type="number"
                step="0.1"
                value={teorSolidosTotaisInputPct}
                onChange={(e) => setTeorSolidosTotaisInputPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Preço Polpa Entressafra (R$/L)</label>
              <input
                type="number"
                step="0.5"
                value={precoLitroPolpaReais}
                onChange={(e) => setPrecoLitroPolpaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-600 block">Classificação da Polpa Produzida:</span>
              <span className={`text-base font-bold ${metricas.isAcaiGrossoEspecial ? 'text-purple-400' : 'text-indigo-400'}`}>
                {metricas.isAcaiGrossoEspecial ? '✓ AÇAI GROSSO ESPECIAL (> 14.0% SÓLIDOS TOTAIS)' : 'AÇAÍ MÉDIO COMERCIAL'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-600 block">Lucro Líquido Safra:</span>
              <span className="text-xl font-bold text-emerald-400">
                R$ {metricas.lucroLiquidoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
