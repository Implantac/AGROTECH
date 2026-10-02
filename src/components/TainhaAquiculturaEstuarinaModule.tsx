import React, { useState, useMemo } from 'react';
import {
  Fish,
  Waves,
  Droplets,
  Award,
  DollarSign,
  TrendingUp,
  Scale,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface TanqueTainha {
  id: string;
  nome: string;
  areaHa: number;
  biomassaTotalKg: number;
  salinidadePpt: number;
  oxigenioMgL: number;
  femeasComOvaPct: number;
  fcr: number;
  status: 'ENGORDA' | 'PRE_DESPESCA_OVA' | 'DESPESCA_FINALIZADA';
}

export const TainhaAquiculturaEstuarinaModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tanques' | 'bottarga' | 'qualidade_agua' | 'simulador'>('tanques');

  // Parâmetros do Simulador de Produção Integrada
  const [areaTanquesHa, setAreaTanquesHa] = useState<number>(10);
  const [biomassaDespescaKgHa, setBiomassaDespescaKgHa] = useState<number>(6000);
  const [proporcaoFemeasPct, setProporcaoFemeasPct] = useState<number>(45);
  const [rendimentoOvaPct, setRendimentoOvaPct] = useState<number>(12);
  const [precoKgCarneReais, setPrecoKgCarneReais] = useState<number>(22.0);
  const [precoKgBottargaCuradaReais, setPrecoKgBottargaCuradaReais] = useState<number>(420.0);
  const [custoTotalKgPeixeReais, setCustoTotalKgPeixeReais] = useState<number>(14.5);

  const [tanques, setTanques] = useState<TanqueTainha[]>([
    {
      id: 'TQ-EST-01',
      nome: 'Tanque Estuário Norte (Cananéia - SP)',
      areaHa: 3.5,
      biomassaTotalKg: 21500,
      salinidadePpt: 18.5,
      oxigenioMgL: 6.4,
      femeasComOvaPct: 46.0,
      fcr: 1.28,
      status: 'PRE_DESPESCA_OVA',
    },
    {
      id: 'TQ-EST-02',
      nome: 'Tanque Lagoa Costeira (Imbituba - SC)',
      areaHa: 4.0,
      biomassaTotalKg: 24200,
      salinidadePpt: 22.0,
      oxigenioMgL: 5.9,
      femeasComOvaPct: 44.5,
      fcr: 1.32,
      status: 'ENGORDA',
    },
    {
      id: 'TQ-EST-03',
      nome: 'Viveiro Maré Natural (Paranaguá - PR)',
      areaHa: 2.5,
      biomassaTotalKg: 15300,
      salinidadePpt: 15.0,
      oxigenioMgL: 6.8,
      femeasComOvaPct: 48.0,
      fcr: 1.25,
      status: 'PRE_DESPESCA_OVA',
    },
  ]);

  const metricas = useMemo(() => {
    const producaoCarneTotalKg = areaTanquesHa * biomassaDespescaKgHa;
    const producaoOvaFrescaKg = Number(
      (producaoCarneTotalKg * (proporcaoFemeasPct / 100) * (rendimentoOvaPct / 100)).toFixed(1)
    );
    // Cura e salga desidratam a ova fresca com 65% de rendimento de massa final
    const producaoBottargaCuradaKg = Number((producaoOvaFrescaKg * 0.65).toFixed(1));

    const receitaCarneReais = Number((producaoCarneTotalKg * precoKgCarneReais).toFixed(2));
    const receitaBottargaReais = Number((producaoBottargaCuradaKg * precoKgBottargaCuradaReais).toFixed(2));
    const receitaTotalReais = Number((receitaCarneReais + receitaBottargaReais).toFixed(2));

    const custoTotalReais = Number((producaoCarneTotalKg * custoTotalKgPeixeReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaTotalReais - custoTotalReais).toFixed(2));
    const margemPct = receitaTotalReais > 0 ? Number(((lucroLiquidoReais / receitaTotalReais) * 100).toFixed(1)) : 0;

    return {
      producaoCarneTotalKg,
      producaoOvaFrescaKg,
      producaoBottargaCuradaKg,
      receitaCarneReais,
      receitaBottargaReais,
      receitaTotalReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemPct,
    };
  }, [
    areaTanquesHa,
    biomassaDespescaKgHa,
    proporcaoFemeasPct,
    rendimentoOvaPct,
    precoKgCarneReais,
    precoKgBottargaCuradaReais,
    custoTotalKgPeixeReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-[#EAF4E7] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Fish className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Tainha & Aquicultura Estuarina Sustentável
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Módulo 112 • Mugil liza, Bottarga Nobre & Circulação Estuarina
              </span>
            </div>
            <p className="text-sm text-[#66736A] mt-1">
              Engorda em lagoas costeiras e estuários, manejo de salinidade dinâmica (5-25 ppt) e extração de ovas para cura de Bottarga a R$ 420/kg.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador Bottarga
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Biomassa Total Peixe</span>
            <Fish className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.producaoCarneTotalKg.toLocaleString('pt-BR')} kg
          </p>
          <span className="text-xs text-cyan-400 mt-1 block">
            {(metricas.producaoCarneTotalKg / 1000).toFixed(1)} toneladas de tainha
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Bottarga Curada</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.producaoBottargaCuradaKg.toLocaleString('pt-BR')} kg
          </p>
          <span className="text-xs text-amber-400 mt-1 block">
            R$ {precoKgBottargaCuradaReais.toFixed(2)}/kg curado
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Receita Integrada</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.receitaTotalReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Peixe + Ovas de Ouro
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Lucro Líquido do Ciclo</span>
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.lucroLiquidoReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-blue-400 mt-1 block">
            {metricas.margemPct}% de Margem Líquida
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('tanques')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'tanques'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Fish className="w-4 h-4" />
          Viveiros & Despesca
        </button>

        <button
          onClick={() => setActiveTab('bottarga')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'bottarga'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Processamento de Bottarga
        </button>

        <button
          onClick={() => setActiveTab('qualidade_agua')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'qualidade_agua'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Waves className="w-4 h-4" />
          Salinidade & Hidrodinâmica
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Integrado
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'tanques' && (
        <div className="bg-slate-900/40 rounded-2xl border border-[#EAF4E7] p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Fish className="w-5 h-5 text-cyan-400" />
            Viveiros Estuarinos & Monitoramento de Maturação Gonadal
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#26332A]">
              <thead className="text-xs uppercase bg-[#F7F9F5] text-[#66736A]">
                <tr>
                  <th className="px-4 py-3">Viveiro / Localidade</th>
                  <th className="px-4 py-3">Área (ha)</th>
                  <th className="px-4 py-3">Biomassa (kg)</th>
                  <th className="px-4 py-3">Salinidade</th>
                  <th className="px-4 py-3">O.D. (mg/L)</th>
                  <th className="px-4 py-3">Fêmeas c/ Ova</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tanques.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-white">{t.nome}</td>
                    <td className="px-4 py-3">{t.areaHa} ha</td>
                    <td className="px-4 py-3 font-semibold text-cyan-400">
                      {t.biomassaTotalKg.toLocaleString('pt-BR')} kg
                    </td>
                    <td className="px-4 py-3">{t.salinidadePpt} ppt</td>
                    <td className="px-4 py-3 text-emerald-400 font-medium">{t.oxigenioMgL} mg/L</td>
                    <td className="px-4 py-3 text-amber-400 font-bold">{t.femeasComOvaPct}%</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
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

      {activeTab === 'bottarga' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">1. Extração Cirúrgica</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Abertura abdominal cuidadosa mantendo a bolsa ovariana (gônada) 100% intacta, com pedúnculo preservado para amarração.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Integridade de Bolsa:</span>
              <span className="text-sm font-bold text-cyan-400 block">superior a 98% sem fissura</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">2. Salga Marinha & Prensagem</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Sal marinho grosso não iodado durante 2 a 4 horas com prensa de madeira sob peso gradual para extração da umidade superficial.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Perda de Umidade Inicial:</span>
              <span className="text-sm font-bold text-amber-400 block">15% a 20% em 24h</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">3. Maturação & Cera de Abelha</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Cura em câmara fria ventilada a 14°C e 60% UR durante 15 a 25 dias. Revestimento em cera de abelha pura para conservação e valorização nobre.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Preço Mercado Gourmet:</span>
              <span className="text-sm font-bold text-emerald-400 block">R$ 420,00 a R$ 600,00/kg</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'qualidade_agua' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            Salinidade Estuarina & Renovação Maregráfica
          </h3>
          <p className="text-sm text-[#66736A]">
            A tainha é eurialina por excelência, suportando de 0 a 35 ppt. Na fase final de maturação gonadal, o aumento da salinidade para 18–25 ppt via marés induz o enchimento lipídico da gônada feminina.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Salinidade Ideal de Maturação</span>
              <p className="text-lg font-bold text-cyan-400 mt-1">18 a 24 ppt</p>
              <span className="text-[11px] text-slate-500">Estimula vitelogênese</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Oxigênio Dissolvido Crítico</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">superior a 5.0 mg/L</p>
              <span className="text-[11px] text-emerald-500/80">Aeradores tipo chafariz</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Conversão Alimentar (FCR)</span>
              <p className="text-lg font-bold text-white mt-1">1.25 a 1.35 : 1</p>
              <span className="text-[11px] text-slate-500">Ração peletizada flutuante</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-cyan-400" />
            Simulador de Receita Dupla: Biomassa de Tainha + Bottarga Curada
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-[#66736A]">Área de Viveiros (ha)</label>
              <input
                type="number"
                value={areaTanquesHa}
                onChange={(e) => setAreaTanquesHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Biomassa (kg/ha)</label>
              <input
                type="number"
                value={biomassaDespescaKgHa}
                onChange={(e) => setBiomassaDespescaKgHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Proporção Fêmeas c/ Ova (%)</label>
              <input
                type="number"
                value={proporcaoFemeasPct}
                onChange={(e) => setProporcaoFemeasPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Preço Bottarga (R$/kg)</label>
              <input
                type="number"
                value={precoKgBottargaCuradaReais}
                onChange={(e) => setPrecoKgBottargaCuradaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#66736A] block">Composição da Receita Bruta:</span>
              <span className="text-sm font-semibold text-white">
                Peixe: R$ {metricas.receitaCarneReais.toLocaleString('pt-BR')} | Bottarga: R$ {metricas.receitaBottargaReais.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#66736A] block">Lucro Líquido Projetado:</span>
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
