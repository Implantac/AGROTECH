import React, { useState, useMemo } from 'react';
import {
  Wine,
  Sun,
  DollarSign,
  TrendingUp,
  Layers,
  Award,
  CheckCircle2,
  Sliders,
  Sparkles,
  Thermometer,
} from 'lucide-react';

interface ParcelaVinhoFino {
  id: string;
  parcela: string;
  cultivar: 'SYRAH' | 'CABERNET_FRANC' | 'SAUVIGNON_BLANC' | 'CHARDONNAY';
  regiaoTerroir: string;
  areaHa: number;
  brixColheita: number;
  phMosto: number;
  acidezTotalGPerL: number;
  polifenoisTotaisIpt: number;
  sistemaPoda: 'DUPLA_PODA_INVERNO' | 'TRADICIONAL_VERAO';
  status: 'COLHEITA_INVERNO' | 'FERMENTACAO_BARRICA' | 'MATURACAO_ENGARRAFADO';
}

export const VinhosFinosDuplaPodaModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parcelas' | 'duplapoda' | 'enologia' | 'simulador'>('parcelas');

  // Parâmetros do Simulador
  const [areaTotalHa, setAreaTotalHa] = useState<number>(18);
  const [produtividadeUvaKgHa, setProdutividadeUvaKgHa] = useState<number>(6500);
  const [brixColheita, setBrixColheita] = useState<number>(23.5);
  const [rendimentoGarrafasPorKg, setRendimentoGarrafasPorKg] = useState<number>(0.72);
  const [precoMedioGarrafaReais, setPrecoMedioGarrafaReais] = useState<number>(95.0);
  const [custoProducaoHaReais, setCustoProducaoHaReais] = useState<number>(65000);

  const [parcelas, setParcelas] = useState<ParcelaVinhoFino[]>([
    {
      id: 'PARC-01',
      parcela: 'Parcela Altos da Mantiqueira 01 (Andradas - MG)',
      cultivar: 'SYRAH',
      regiaoTerroir: 'Serra da Mantiqueira (1.150m)',
      areaHa: 6,
      brixColheita: 24.2,
      phMosto: 3.65,
      acidezTotalGPerL: 5.8,
      polifenoisTotaisIpt: 72,
      sistemaPoda: 'DUPLA_PODA_INVERNO',
      status: 'COLHEITA_INVERNO',
    },
    {
      id: 'PARC-02',
      parcela: 'Parcela Cerrado de Altitude 02 (Cristalina - GO)',
      cultivar: 'CABERNET_FRANC',
      regiaoTerroir: 'Planalto Central (1.020m)',
      areaHa: 7,
      brixColheita: 23.8,
      phMosto: 3.58,
      acidezTotalGPerL: 6.1,
      polifenoisTotaisIpt: 68,
      sistemaPoda: 'DUPLA_PODA_INVERNO',
      status: 'FERMENTACAO_BARRICA',
    },
    {
      id: 'PARC-03',
      parcela: 'Parcela Pedra Roxa 03 (São Roque de Minas - MG)',
      cultivar: 'SAUVIGNON_BLANC',
      regiaoTerroir: 'Serra da Canastra (1.280m)',
      areaHa: 5,
      brixColheita: 22.8,
      phMosto: 3.32,
      acidezTotalGPerL: 7.2,
      polifenoisTotaisIpt: 45,
      sistemaPoda: 'DUPLA_PODA_INVERNO',
      status: 'MATURACAO_ENGARRAFADO',
    },
  ]);

  const metricas = useMemo(() => {
    const producaoTotalKg = Number((areaTotalHa * produtividadeUvaKgHa).toFixed(1));
    const totalGarrafas = Number((producaoTotalKg * rendimentoGarrafasPorKg).toFixed(0));
    const receitaTotalReais = Number((totalGarrafas * precoMedioGarrafaReais).toFixed(2));
    const custoTotalProducaoReais = Number((areaTotalHa * custoProducaoHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaTotalReais - custoTotalProducaoReais).toFixed(2));
    const margemLiquidaPct = receitaTotalReais > 0 ? Number(((lucroLiquidoReais / receitaTotalReais) * 100).toFixed(1)) : 0;
    const custoUnitarioPorGarrafa = totalGarrafas > 0 ? Number((custoTotalProducaoReais / totalGarrafas).toFixed(2)) : 0;

    return {
      producaoTotalKg,
      totalGarrafas,
      receitaTotalReais,
      custoTotalProducaoReais,
      lucroLiquidoReais,
      margemLiquidaPct,
      custoUnitarioPorGarrafa,
    };
  }, [
    areaTotalHa,
    produtividadeUvaKgHa,
    rendimentoGarrafasPorKg,
    precoMedioGarrafaReais,
    custoProducaoHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-rose-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Wine className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Vitivinicultura de Vinhos Finos & Dupla Poda de Inverno
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Módulo 127 • Inversão de Ciclo & Vinhos de Altitude
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Manejo fisiológico com poda de formação e poda de produção, colheita no inverno seco e ensolarado com amplitude térmica superior a 15°C e alta concentração fenólica.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-400 hover:to-rose-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-purple-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Garrafas
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Garrafas Produzidas</span>
            <Wine className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.totalGarrafas.toLocaleString('pt-BR')} gf
          </p>
          <span className="text-xs text-purple-400 mt-1 block">
            {(metricas.producaoTotalKg / 1000).toFixed(1)} toneladas de uva fina
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Custo por Garrafa</span>
            <Sliders className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {metricas.custoUnitarioPorGarrafa.toFixed(2)}
          </p>
          <span className="text-xs text-rose-400 mt-1 block">
            Vinhedo + barrica + vidro + rolha nobre
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Faturamento Previsto</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.receitaTotalReais / 1000000).toFixed(2)}M
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            R$ {precoMedioGarrafaReais.toFixed(2)} preço médio ao consumidor
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
            R$ {(metricas.lucroLiquidoReais / 1000000).toFixed(2)}M de lucro líquido
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('parcelas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'parcelas'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Parcelas & Terroirs
        </button>

        <button
          onClick={() => setActiveTab('duplapoda')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'duplapoda'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Sun className="w-4 h-4" />
          Método de Dupla Poda
        </button>

        <button
          onClick={() => setActiveTab('enologia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'enologia'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Award className="w-4 h-4" />
          Parâmetros Enológicos
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'parcelas' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Wine className="w-5 h-5 text-purple-400" />
            Vinhedos com Inversão de Ciclo & Vinhos de Inverno
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Parcela / Região</th>
                  <th className="px-4 py-3">Cultivar</th>
                  <th className="px-4 py-3">Área (ha)</th>
                  <th className="px-4 py-3">Brix</th>
                  <th className="px-4 py-3">Acidez (g/L)</th>
                  <th className="px-4 py-3">IPT (Polifenóis)</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {parcelas.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-white">{p.parcela}</td>
                    <td className="px-4 py-3 font-bold text-purple-400">{p.cultivar}</td>
                    <td className="px-4 py-3">{p.areaHa} ha</td>
                    <td className="px-4 py-3 font-bold text-yellow-400">{p.brixColheita}°Bx</td>
                    <td className="px-4 py-3">{p.acidezTotalGPerL} g/L</td>
                    <td className="px-4 py-3 text-rose-400 font-medium">{p.polifenoisTotaisIpt} IPT</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
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

      {activeTab === 'duplapoda' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">1ª Poda (Vegetativa / Agosto)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Poda curta durante o final do inverno para brotação da ramagem de suporte durante as chuvas de verão, sem retenção de cachos para evitar podridões fúngicas.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Objetivo Fisiológico:</span>
              <span className="text-sm font-bold text-yellow-400 block">Acúmulo de reservas amiláceas no lenho</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-purple-400" />
              <h4 className="text-sm font-semibold text-white">2ª Poda (Produção / Janeiro-Fev)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Poda com quebra de dormência (cianamida hidrogenada) para floração em março e maturação dos cachos no inverno seco (maio a julho).
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Janela de Colheita:</span>
              <span className="text-sm font-bold text-purple-400 block">Junho e Julho (Zero Chuva)</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-semibold text-white">Amplitude Térmica & Polifenóis</h4>
            </div>
            <p className="text-xs text-slate-400">
              Dias ensolarados (25°C) e noites frias (8°C a 10°C) garantem acúmulo excepcional de antocianinas, síntese de resveratrol e preservação de ácido málico.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Índice Fenólico:</span>
              <span className="text-sm font-bold text-rose-400 block">IPT superior a 65 (Vinho de Guarda)</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'enologia' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Parâmetros de Qualidade Enológica & Maturação em Barricas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Açúcares Naturais</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">superior a 23.5° Brix</p>
              <span className="text-[11px] text-slate-400">Graduação alcoólica natural de 14.0% v/v</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Estágio em Madeira</span>
              <p className="text-lg font-bold text-purple-400 mt-1">12 a 18 meses</p>
              <span className="text-[11px] text-slate-400">Carvalho francês de primeiro uso</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Certificação D.O.</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">Selo Vinhos de Inverno</p>
              <span className="text-[11px] text-slate-400">Associação Nacional ANPROVIN</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
            Simulador de Envase, Custo por Garrafa & Lucro Líquido
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Área Cultivada (ha)</label>
              <input
                type="number"
                value={areaTotalHa}
                onChange={(e) => setAreaTotalHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Produtividade (kg/ha)</label>
              <input
                type="number"
                value={produtividadeUvaKgHa}
                onChange={(e) => setProdutividadeUvaKgHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Preço da Garrafa (R$)</label>
              <input
                type="number"
                step="5"
                value={precoMedioGarrafaReais}
                onChange={(e) => setPrecoMedioGarrafaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Custo Anual (R$/ha)</label>
              <input
                type="number"
                step="1000"
                value={custoProducaoHaReais}
                onChange={(e) => setCustoProducaoHaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Custo Total por Garrafa Pronta:</span>
              <span className="text-base font-bold text-purple-400">
                R$ {metricas.custoUnitarioPorGarrafa.toFixed(2)} / garrafa
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Lucro Líquido Anual:</span>
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
