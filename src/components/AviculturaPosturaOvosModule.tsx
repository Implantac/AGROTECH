import React, { useState, useMemo } from 'react';
import {
  Egg,
  Heart,
  Scale,
  Award,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';

interface GalpaoPostura {
  id: string;
  galpao: string;
  linhagem: string;
  sistemaAlojamento: 'CAGE_FREE' | 'VERTICAL_AUTOMATIZADO' | 'CAIPIRA_PASTO';
  avesAlojadas: number;
  idadeSemanas: number;
  taxaPosturaDiariaPct: number;
  pesoMedioOvoG: number;
  corGemaRoche: number;
  status: 'PICO_POSTURA' | 'POSTURA_ESTAVEL' | 'DESCARTE_PROGRAMADO';
}

export const AviculturaPosturaOvosModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'galpoes' | 'qualidade' | 'nutricao' | 'simulador'>('galpoes');

  // Parâmetros do Simulador
  const [avesAlojadas, setAvesAlojadas] = useState<number>(100000);
  const [taxaPosturaDiariaPct, setTaxaPosturaDiariaPct] = useState<number>(92.0);
  const [consumoRacaoAveDiaG, setConsumoRacaoAveDiaG] = useState<number>(110.0);
  const [precoDuziaOvosReais, setPrecoDuziaOvosReais] = useState<number>(5.2);
  const [custoKgRacaoReais, setCustoKgRacaoReais] = useState<number>(1.85);
  const [custoOperacionalAveAnoReais, setCustoOperacionalAveAnoReais] = useState<number>(22.0);

  const [galpoes, setGalpoes] = useState<GalpaoPostura[]>([
    {
      id: 'GLP-01',
      galpao: 'Galpão Climatizado 01 (Bastos - SP)',
      linhagem: 'Lohmann Brown Extra',
      sistemaAlojamento: 'VERTICAL_AUTOMATIZADO',
      avesAlojadas: 40000,
      idadeSemanas: 28,
      taxaPosturaDiariaPct: 94.5,
      pesoMedioOvoG: 63.2,
      corGemaRoche: 13,
      status: 'PICO_POSTURA',
    },
    {
      id: 'GLP-02',
      galpao: 'Galpão Cage-Free 02 (Santa Maria de Jetibá - ES)',
      linhagem: 'Hy-Line Brown',
      sistemaAlojamento: 'CAGE_FREE',
      avesAlojadas: 35000,
      idadeSemanas: 34,
      taxaPosturaDiariaPct: 91.8,
      pesoMedioOvoG: 62.5,
      corGemaRoche: 14,
      status: 'POSTURA_ESTAVEL',
    },
    {
      id: 'GLP-03',
      galpao: 'Piquete Agroecológico 03 (Guapiaçu - SP)',
      linhagem: 'Novogen Brown Certificada',
      sistemaAlojamento: 'CAIPIRA_PASTO',
      avesAlojadas: 25000,
      idadeSemanas: 42,
      taxaPosturaDiariaPct: 88.0,
      pesoMedioOvoG: 61.8,
      corGemaRoche: 14,
      status: 'POSTURA_ESTAVEL',
    },
  ]);

  const metricas = useMemo(() => {
    const ovosDia = Number(((avesAlojadas * taxaPosturaDiariaPct) / 100).toFixed(0));
    const duziasAno = Number(((ovosDia * 365) / 12).toFixed(0));
    const racaoTotalAnoKg = Number(((avesAlojadas * consumoRacaoAveDiaG * 365) / 1000).toFixed(1));
    const conversaoKgPorDuzia = duziasAno > 0 ? Number((racaoTotalAnoKg / duziasAno).toFixed(2)) : 0;

    const receitaBrutaReais = Number((duziasAno * precoDuziaOvosReais).toFixed(2));
    const custoAlimentarReais = Number((racaoTotalAnoKg * custoKgRacaoReais).toFixed(2));
    const custoOperacionalReais = Number((avesAlojadas * custoOperacionalAveAnoReais).toFixed(2));
    const custoTotalReais = Number((custoAlimentarReais + custoOperacionalReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = receitaBrutaReais > 0 ? Number(((lucroLiquidoReais / receitaBrutaReais) * 100).toFixed(1)) : 0;

    return {
      ovosDia,
      duziasAno,
      racaoTotalAnoKg,
      conversaoKgPorDuzia,
      receitaBrutaReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    avesAlojadas,
    taxaPosturaDiariaPct,
    consumoRacaoAveDiaG,
    precoDuziaOvosReais,
    custoKgRacaoReais,
    custoOperacionalAveAnoReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Egg className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Avicultura de Postura Comercial & Qualidade de Ovos
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                Módulo 122 • Cage-Free, Conversão kg/dz & Gema Roche 14
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Controle zootécnico de taxa de postura, conversão alimentar por dúzia, espessura de casca e agregação de valor em ovos especiais.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Postura
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Produção Anual</span>
            <Egg className="w-5 h-5 text-amber-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {(metricas.duziasAno / 1000000).toFixed(2)}M dúzias
          </p>
          <span className="text-xs text-amber-700 mt-1 block">
            {metricas.ovosDia.toLocaleString('pt-BR')} ovos/dia
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Conversão Alimentar</span>
            <Scale className="w-5 h-5 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {metricas.conversaoKgPorDuzia} kg/dz
          </p>
          <span className="text-xs text-emerald-700 mt-1 block">
            Consumo médio de {consumoRacaoAveDiaG}g/ave/dia
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Faturamento Anual</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            R$ {(metricas.receitaBrutaReais / 1000000).toFixed(2)}M
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            R$ {precoDuziaOvosReais.toFixed(2)} / dúzia
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Lucro Líquido Anual</span>
            <Award className="w-5 h-5 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            R$ {(metricas.lucroLiquidoReais / 1000000).toFixed(2)}M
          </p>
          <span className="text-xs text-emerald-700 mt-1 block">
            {metricas.margemLiquidaPct}% de Margem Líquida
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('galpoes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'galpoes'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer'
          }`}
        >
          <Layers className="w-4 h-4" />
          Galpões de Postura
        </button>

        <button
          onClick={() => setActiveTab('qualidade')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'qualidade'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer'
          }`}
        >
          <Award className="w-4 h-4" />
          Classificação & Casca
        </button>

        <button
          onClick={() => setActiveTab('nutricao')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'nutricao'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer'
          }`}
        >
          <Scale className="w-4 h-4" />
          Nutrição & Gema Roche
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'galpoes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Egg className="w-5 h-5 text-amber-700" />
            Galpões Automatizados & Monitoramento de Postura Diária
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="text-xs uppercase bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Galpão / Município</th>
                  <th className="px-4 py-3">Linhagem</th>
                  <th className="px-4 py-3">Sistema</th>
                  <th className="px-4 py-3">Aves Alojadas</th>
                  <th className="px-4 py-3">Taxa Postura</th>
                  <th className="px-4 py-3">Peso Médio</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {galpoes.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-bold text-slate-900">{g.galpao}</td>
                    <td className="px-4 py-3 text-amber-700 font-semibold">{g.linhagem}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {g.sistemaAlojamento}
                      </span>
                    </td>
                    <td className="px-4 py-3">{g.avesAlojadas.toLocaleString('pt-BR')} aves</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">{g.taxaPosturaDiariaPct}%</td>
                    <td className="px-4 py-3">{g.pesoMedioOvoG} g</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'qualidade' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-700" />
              <h4 className="text-sm font-semibold text-slate-900">Espessura de Casca</h4>
            </div>
            <p className="text-xs text-slate-600">
              Fornecimento de carbonato de cálcio particulado graúdo no período vespertino garantindo espessura superior a 0.35 mm e resistência à trinca no transporte.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Meta Zootécnica:</span>
              <span className="text-sm font-bold text-amber-700 block">superior a 0.36 mm de espessura</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <h4 className="text-sm font-semibold text-slate-900">Ovoscopia Eletrônica</h4>
            </div>
            <p className="text-xs text-slate-600">
              Varredura óptica por LED para descarte automático de microfissuras, manchas de sangue internas e ovos deformados antes da embalagem final.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Índice de Quebra:</span>
              <span className="text-sm font-bold text-emerald-700 block">menor que 1.2% total</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-slate-900">Classificação por Tipo</h4>
            </div>
            <p className="text-xs text-slate-600">
              Ovo Tipo Extra (60g a 65g) e Tipo Jumbo (acima de 66g) com câmara de ar intacta e unidade Haugh superior a 75 (frescor máximo).
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Unidade Haugh (Albumen):</span>
              <span className="text-sm font-bold text-yellow-400 block">superior a 80 UH (Classe AA)</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'nutricao' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-yellow-400" />
            Nutrição com Carotenóides Naturais & Pigmentação de Gema (Leque Roche)
          </h3>
          <p className="text-sm text-slate-600">
            A inclusão de extratos naturais de urucum e tagetes na ração intensifica a coloração amarelo-alaranjada da gema, atendendo à preferência do consumidor e agregando valor nas gôndolas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Coloração de Gema</span>
              <p className="text-lg font-bold text-amber-700 mt-1">Leque DSM 13 a 14</p>
              <span className="text-[11px] text-slate-500">Laranja intenso natural</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Enriquecimento Ômega-3</span>
              <p className="text-lg font-bold text-emerald-700 mt-1">+180 mg DHA/ovo</p>
              <span className="text-[11px] text-emerald-500/80">Adição de farelo de linhaça</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Certificação Cage-Free</span>
              <p className="text-lg font-bold text-slate-900 mt-1">HFAC / Certified Humane</p>
              <span className="text-[11px] text-slate-500">Prêmio de R$ 1,80 a R$ 2,50 por dúzia</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-xs">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-700" />
            Simulador de Eficiência Alimentar & Margem por Dúzia
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Aves Alojadas</label>
              <input
                type="number"
                value={avesAlojadas}
                onChange={(e) => setAvesAlojadas(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Taxa de Postura (%)</label>
              <input
                type="number"
                step="0.5"
                value={taxaPosturaDiariaPct}
                onChange={(e) => setTaxaPosturaDiariaPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Preço Dúzia (R$)</label>
              <input
                type="number"
                step="0.1"
                value={precoDuziaOvosReais}
                onChange={(e) => setPrecoDuziaOvosReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Custo Ração (R$/kg)</label>
              <input
                type="number"
                step="0.05"
                value={custoKgRacaoReais}
                onChange={(e) => setCustoKgRacaoReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-600 block">Eficiência de Conversão Calculada:</span>
              <span className="text-base font-bold text-emerald-700">
                {metricas.conversaoKgPorDuzia} kg de ração / dúzia produzida
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-600 block">Lucro Líquido Anual Projetado:</span>
              <span className="text-xl font-bold text-emerald-700">
                R$ {metricas.lucroLiquidoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
