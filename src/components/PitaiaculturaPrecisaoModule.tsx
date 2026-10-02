import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  Zap,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface PomarPitaia {
  id: string;
  quadra: string;
  variedade: string;
  tipoPolpa: 'BRANCA' | 'VERMELHA_ROXA' | 'AMARELA_GOLD';
  areaHa: number;
  floradasAno: number;
  grauBrix: number;
  pesoMedioFrutoGramas: number;
  status: 'INDUCAO_LUMINOSA' | 'FLORESCIMENTO_NOTURNO' | 'COLHEITA_ATIVA';
}

export const PitaiaculturaPrecisaoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pomares' | 'iluminacao' | 'qualidade' | 'simulador'>('pomares');

  // Parâmetros do Simulador
  const [areaCultivoHa, setAreaCultivoHa] = useState<number>(10);
  const [produtividadeBaseKgHa, setProdutividadeBaseKgHa] = useState<number>(14000);
  const [incrementoLedPct, setIncrementoLedPct] = useState<number>(35);
  const [grauBrixInput, setGrauBrixInput] = useState<number>(16.5);
  const [precoKgFrutaReais, setPrecoKgFrutaReais] = useState<number>(16.0);
  const [custoTotalHaReais, setCustoTotalHaReais] = useState<number>(42000.0);

  const [pomares, setPomares] = useState<PomarPitaia[]>([
    {
      id: 'PIT-01',
      quadra: 'Quadra Norte (Ceará - Chapada do Apodi)',
      variedade: 'Hylocereus costaricensis (Zamorano)',
      tipoPolpa: 'VERMELHA_ROXA',
      areaHa: 4.0,
      floradasAno: 7,
      grauBrix: 17.2,
      pesoMedioFrutoGramas: 480,
      status: 'COLHEITA_ATIVA',
    },
    {
      id: 'PIT-02',
      quadra: 'Quadra Central (São Paulo - Mogi Mirim)',
      variedade: 'Hylocereus undatus (Vietnam White)',
      tipoPolpa: 'BRANCA',
      areaHa: 3.5,
      floradasAno: 5,
      grauBrix: 15.8,
      pesoMedioFrutoGramas: 520,
      status: 'FLORESCIMENTO_NOTURNO',
    },
    {
      id: 'PIT-03',
      quadra: 'Quadra Sul (Santa Catarina - Criciúma)',
      variedade: 'Selenicereus megalanthus (Golden Isis)',
      tipoPolpa: 'AMARELA_GOLD',
      areaHa: 2.5,
      floradasAno: 6,
      grauBrix: 18.5,
      pesoMedioFrutoGramas: 390,
      status: 'INDUCAO_LUMINOSA',
    },
  ]);

  const metricas = useMemo(() => {
    const produtividadeEfetivaKgHa = Number(
      (produtividadeBaseKgHa * (1 + incrementoLedPct / 100)).toFixed(1)
    );
    const producaoTotalKg = Number((areaCultivoHa * produtividadeEfetivaKgHa).toFixed(1));

    const isClasseExtraGourmet = grauBrixInput >= 16.0;

    const receitaBrutaReais = Number((producaoTotalKg * precoKgFrutaReais).toFixed(2));
    const custoTotalReais = Number((areaCultivoHa * custoTotalHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = receitaBrutaReais > 0 ? Number(((lucroLiquidoReais / receitaBrutaReais) * 100).toFixed(1)) : 0;

    return {
      produtividadeEfetivaKgHa,
      producaoTotalKg,
      isClasseExtraGourmet,
      receitaBrutaReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaCultivoHa,
    produtividadeBaseKgHa,
    incrementoLedPct,
    grauBrixInput,
    precoKgFrutaReais,
    custoTotalHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-200 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Pitaiacultura de Precisão & Iluminação LED Noturna
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Módulo 116 • Indução Fotoperiódica, Polinização Noturna & 16.5°Bx
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Controle de floração na entressafra com luz artificial LED, polinização manual dirigida e frutos Classe Extra de alto teor de sólidos solúveis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-rose-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Rentabilidade
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Produtividade c/ LED</span>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.produtividadeEfetivaKgHa.toLocaleString('pt-BR')} kg/ha
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            +{incrementoLedPct}% vs sem suplementação
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Volume Total Safra</span>
            <Layers className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.producaoTotalKg.toLocaleString('pt-BR')} kg
          </p>
          <span className="text-xs text-rose-400 mt-1 block">
            {(metricas.producaoTotalKg / 1000).toFixed(1)} toneladas
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Receita Bruta Total</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.receitaBrutaReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            R$ {precoKgFrutaReais.toFixed(2)}/kg médio
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Lucro Líquido Safra</span>
            <Award className="w-5 h-5 text-pink-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.lucroLiquidoReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-pink-400 mt-1 block">
            {metricas.margemLiquidaPct}% de Margem Líquida
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('pomares')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'pomares'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Quadras & Variedades
        </button>

        <button
          onClick={() => setActiveTab('iluminacao')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'iluminacao'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Moon className="w-4 h-4" />
          Iluminação Noturna LED
        </button>

        <button
          onClick={() => setActiveTab('qualidade')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'qualidade'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Award className="w-4 h-4" />
          Brix & Calibre de Fruto
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'pomares' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" />
            Quadras de Cultivo em Mourões em "T" com Irrigação Localizada
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="text-xs uppercase bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Quadra / Localidade</th>
                  <th className="px-4 py-3">Espécie & Cultivar</th>
                  <th className="px-4 py-3">Tipo de Polpa</th>
                  <th className="px-4 py-3">Área</th>
                  <th className="px-4 py-3">Floradas/Ano</th>
                  <th className="px-4 py-3">Brix Médio</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pomares.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-white">{p.quadra}</td>
                    <td className="px-4 py-3">{p.variedade}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {p.tipoPolpa}
                      </span>
                    </td>
                    <td className="px-4 py-3">{p.areaHa} ha</td>
                    <td className="px-4 py-3 font-bold text-yellow-400">{p.floradasAno} ciclos</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">{p.grauBrix}°Bx</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'iluminacao' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Suplementação Fotoperiódica</h4>
            </div>
            <p className="text-xs text-slate-600">
              Lâmpadas LED 15W Full Spectrum instaladas entre mourões com acionamento das 18h às 22h no inverno para simular dias longos.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Aumento de Floradas:</span>
              <span className="text-sm font-bold text-yellow-400 block">+3 a 4 floradas na entressafra</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-semibold text-white">Polinização Manual Noturna</h4>
            </div>
            <p className="text-xs text-slate-600">
              Flores se abrem exclusivamente à noite. Polinização com pincel entre 20h e 23h cruzando pólen de variedades compatíveis.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Vingamento de Frutos:</span>
              <span className="text-sm font-bold text-rose-400 block">superior a 92% de pegamento</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Preço na Entressafra</h4>
            </div>
            <p className="text-xs text-slate-600">
              Frutos colhidos fora do pico tradicional de verão atingem valorização de até 100% nas centrais de abastecimento (Ceasa).
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Preço Entressafra:</span>
              <span className="text-sm font-bold text-emerald-400 block">R$ 16,00 a R$ 22,00/kg</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'qualidade' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Classificação Comercial por Brix e Calibre de Fruto
          </h3>
          <p className="text-sm text-slate-600">
            O mercado consumidor gourmet exige frutos de polpa arroxeada ou amarela com casca perfeita, sem manchas solares e doçura pronunciada.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Classe Extra Gourmet</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">superior a 16.0°Bx</p>
              <span className="text-[11px] text-emerald-500/80">Peso médio superior a 450 gramas</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Classe Comercial</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">13.0°Bx a 15.9°Bx</p>
              <span className="text-[11px] text-slate-500">Peso de 300g a 450g</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Ponto de Colheita</span>
              <p className="text-lg font-bold text-white mt-1">80% Cor da Casca</p>
              <span className="text-[11px] text-slate-500">Fruto não climatérico (não amadurece fora do pé)</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-rose-400" />
            Simulador de Lucratividade com Suplementação Noturna
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Área Cultivada (ha)</label>
              <input
                type="number"
                value={areaCultivoHa}
                onChange={(e) => setAreaCultivoHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Produtividade Base (kg/ha)</label>
              <input
                type="number"
                value={produtividadeBaseKgHa}
                onChange={(e) => setProdutividadeBaseKgHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Incremento Luz LED (%)</label>
              <input
                type="number"
                value={incrementoLedPct}
                onChange={(e) => setIncrementoLedPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Preço Fruta (R$/kg)</label>
              <input
                type="number"
                value={precoKgFrutaReais}
                onChange={(e) => setPrecoKgFrutaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-600 block">Classificação de Qualidade Comercial:</span>
              <span className={`text-base font-bold ${metricas.isClasseExtraGourmet ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {metricas.isClasseExtraGourmet ? '✓ CLASSE EXTRA GOURMET (16.5°Bx / MÁXIMA VALORIZAÇÃO)' : 'CLASSE COMERCIAL PADRÃO'}
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
