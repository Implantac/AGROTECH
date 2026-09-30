import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Thermometer,
  Layers,
  Award,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Sun,
  Flame,
} from 'lucide-react';

interface LoteFermentacaoCacau {
  id: string;
  lote: string;
  variedade: string;
  origemTerroir: string;
  diaFermentacao: number;
  tempCochoGraus: number;
  phPolpa: number;
  amendoasFermentadasPct: number;
  amendoasVioletasPct: number;
  amendoasMohosasPct: number;
  status: 'EM_FERMENTACAO' | 'SECAGEM_BARCACA' | 'TREE_TO_BAR_APROVADO';
}

export const CacauFinoFermentacaoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cochos' | 'cut_test' | 'secagem' | 'simulador'>('cochos');

  // Parâmetros do Simulador Tree-to-Bar
  const [areaCultivoHa, setAreaCultivoHa] = useState<number>(25);
  const [produtividadeKgHa, setProdutividadeKgHa] = useState<number>(1200);
  const [amendoasFermentadasInputPct, setAmendoasFermentadasInputPct] = useState<number>(82);
  const [amendoasVioletasInputPct, setAmendoasVioletasInputPct] = useState<number>(6);
  const [amendoasMohosasInputPct, setAmendoasMohosasInputPct] = useState<number>(0.5);
  const [precoBaseCommodityKg, setPrecoBaseCommodityKg] = useState<number>(35.0);
  const [premioFinoOrigemPct, setPremioFinoOrigemPct] = useState<number>(40);
  const [custoManejoHaReais, setCustoManejoHaReais] = useState<number>(18000);

  const [lotes, setLotes] = useState<LoteFermentacaoCacau[]>([
    {
      id: 'LOTE-CC-01',
      lote: 'L-2026-F01',
      variedade: 'BN-34 (Catongo / Forasteiro Fino)',
      origemTerroir: 'Sul da Bahia (Ilhéus - Cabruca)',
      diaFermentacao: 4,
      tempCochoGraus: 49.2,
      phPolpa: 4.85,
      amendoasFermentadasPct: 84.0,
      amendoasVioletasPct: 5.5,
      amendoasMohosasPct: 0.2,
      status: 'EM_FERMENTACAO',
    },
    {
      id: 'LOTE-CC-02',
      lote: 'L-2026-F02',
      variedade: 'CCN-51 Seleção Especial Fermentada',
      origemTerroir: 'Transamazônica (Medicilândia - PA)',
      diaFermentacao: 6,
      tempCochoGraus: 44.1,
      phPolpa: 5.2,
      amendoasFermentadasPct: 78.5,
      amendoasVioletasPct: 8.0,
      amendoasMohosasPct: 0.8,
      status: 'SECAGEM_BARCACA',
    },
    {
      id: 'LOTE-CC-03',
      lote: 'L-2026-F03',
      variedade: 'Cacau Criollo Nativo Amazônico',
      origemTerroir: 'Baixo Amazonas (Mocambo / Parintins)',
      diaFermentacao: 7,
      tempCochoGraus: 32.0,
      phPolpa: 5.4,
      amendoasFermentadasPct: 88.0,
      amendoasVioletasPct: 3.0,
      amendoasMohosasPct: 0.1,
      status: 'TREE_TO_BAR_APROVADO',
    },
  ]);

  const metricas = useMemo(() => {
    const producaoTotalKg = areaCultivoHa * produtividadeKgHa;
    const isTreeToBar =
      amendoasFermentadasInputPct >= 75 &&
      amendoasVioletasInputPct <= 10 &&
      amendoasMohosasInputPct <= 2.0;

    const precoEfetivoKg = isTreeToBar
      ? Number((precoBaseCommodityKg * (1 + premioFinoOrigemPct / 100)).toFixed(2))
      : precoBaseCommodityKg;

    const receitaBrutaReais = Number((producaoTotalKg * precoEfetivoKg).toFixed(2));
    const custoTotalReais = Number((areaCultivoHa * custoManejoHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = receitaBrutaReais > 0 ? Number(((lucroLiquidoReais / receitaBrutaReais) * 100).toFixed(1)) : 0;

    return {
      producaoTotalKg,
      isTreeToBar,
      precoEfetivoKg,
      receitaBrutaReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaCultivoHa,
    produtividadeKgHa,
    amendoasFermentadasInputPct,
    amendoasVioletasInputPct,
    amendoasMohosasInputPct,
    precoBaseCommodityKg,
    premioFinoOrigemPct,
    custoManejoHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Cacau Fino & Fermentação Tree-to-Bar
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Módulo 111 • Prova de Corte (Cut Test) & Prêmio Especial
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Controle térmico de cochos de madeira (48-50°C), viragens diárias, secagem solar em barcaças e classificação sensorial nobre.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Prêmio
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Volume Safra Estimado</span>
            <Layers className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.producaoTotalKg.toLocaleString('pt-BR')} kg
          </p>
          <span className="text-xs text-amber-400 mt-1 block">
            {(metricas.producaoTotalKg / 1000).toFixed(1)} toneladas secas
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Preço Efetivo c/ Prêmio</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {metricas.precoEfetivoKg.toFixed(2)}/kg
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            {metricas.isTreeToBar ? `+${premioFinoOrigemPct}% vs Commodity` : 'Preço Base Commodity'}
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Receita Bruta Total</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.receitaBrutaReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            Faturamento Tree-to-Bar
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Lucro Líquido Safra</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.lucroLiquidoReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            {metricas.margemLiquidaPct}% Margem Líquida
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('cochos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'cochos'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          Cochos de Fermentação
        </button>

        <button
          onClick={() => setActiveTab('cut_test')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'cut_test'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Award className="w-4 h-4" />
          Prova de Corte (Cut Test)
        </button>

        <button
          onClick={() => setActiveTab('secagem')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'secagem'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Sun className="w-4 h-4" />
          Barcaças & Secagem Solar
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
      {activeTab === 'cochos' && (
        <div className="space-y-4">
          <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Monitoramento Térmico & Viragens em Cochos de Madeira (Cedro/Jequitibá)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-950/60 text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Lote</th>
                    <th className="px-4 py-3">Variedade / Clone</th>
                    <th className="px-4 py-3">Origem & Terroir</th>
                    <th className="px-4 py-3">Dia</th>
                    <th className="px-4 py-3">Temp. (°C)</th>
                    <th className="px-4 py-3">pH Polpa</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {lotes.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-white">{l.lote}</td>
                      <td className="px-4 py-3">{l.variedade}</td>
                      <td className="px-4 py-3 text-slate-400">{l.origemTerroir}</td>
                      <td className="px-4 py-3 font-semibold text-amber-400">Dia {l.diaFermentacao}/7</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          l.tempCochoGraus >= 48
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {l.tempCochoGraus}°C
                        </span>
                      </td>
                      <td className="px-4 py-3">{l.phPolpa}</td>
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
        </div>
      )}

      {activeTab === 'cut_test' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Amêndoas Bem Fermentadas</h4>
            </div>
            <p className="text-xs text-slate-400">
              Cor marrom-escura homogênea, estrias abertas, aroma achocolatado suave, acidez equilibrada e ausência de adstringência excessiva.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Meta Tree-to-Bar Especial:</span>
              <span className="text-sm font-bold text-emerald-400 block">superior a 75%</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Amêndoas Violetas (Subfermentadas)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Pigmentação roxa/violeta interna por interrupção precoce da fermentação ou aeração insuficiente da massa de cacau.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Tolerância Máxima Fino:</span>
              <span className="text-sm font-bold text-yellow-400 block">menor que 10%</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-semibold text-white">Ardósia & Mohosas (Defeitos)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Amêndoas acinzentadas duras (zero fermentação) ou atacadas por fungos filamentosos. Desclassificam imediatamente o lote fino.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Limite Crítico:</span>
              <span className="text-sm font-bold text-rose-400 block">0% Ardósia / menor que 2% Mofo</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'secagem' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-400" />
            Secagem em Barcaças Tradicionais com Teto Móvel & Estufas Solares
          </h3>
          <p className="text-sm text-slate-400">
            A secagem lenta ao sol é responsável por fixar os precursores aromáticos do chocolate. Redução gradual de 55% de umidade inicial para a faixa ideal de 6.5% a 7.5% em 6 a 8 dias.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Espessura da Camada</span>
              <p className="text-lg font-bold text-white mt-1">4 a 5 cm</p>
              <span className="text-[11px] text-slate-500">Rodo de madeira a cada 2h</span>
            </div>
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Umidade Final Segura</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">7.0% ± 0.5%</p>
              <span className="text-[11px] text-emerald-500/80">Sem risco de mofo em sacaria de juta</span>
            </div>
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Armazenamento</span>
              <p className="text-lg font-bold text-amber-400 mt-1">Sacos de Juta 60kg</p>
              <span className="text-[11px] text-slate-500">Estrados a 20cm do piso</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            Simulador de Valorização Tree-to-Bar & Prêmio sobre Cotação Internacional
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Área Cultivada (ha)</label>
              <input
                type="number"
                value={areaCultivoHa}
                onChange={(e) => setAreaCultivoHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Produtividade (kg/ha seco)</label>
              <input
                type="number"
                value={produtividadeKgHa}
                onChange={(e) => setProdutividadeKgHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Amêndoas Fermentadas (%)</label>
              <input
                type="number"
                value={amendoasFermentadasInputPct}
                onChange={(e) => setAmendoasFermentadasInputPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Prêmio Origem Fina (%)</label>
              <input
                type="number"
                value={premioFinoOrigemPct}
                onChange={(e) => setPremioFinoOrigemPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Classificação do Lote no Cut Test:</span>
              <span className={`text-base font-bold ${metricas.isTreeToBar ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {metricas.isTreeToBar ? '✓ APROVADO: CACAU FINO ESPECIAL TREE-TO-BAR' : 'PADRÃO COMMODITY'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Lucro Líquido Projetado:</span>
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
