import React, { useState, useMemo } from 'react';
import {
  Trees,
  Compass,
  ShieldCheck,
  Award,
  DollarSign,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Sparkles,
} from 'lucide-react';

interface LoteCastanha {
  id: string;
  codigoLote: string;
  resexOrigem: string;
  castanheirasMapeadas: number;
  ouricosColetadosKg: number;
  castanhaCascaKg: number;
  amendoaInteiraKg: number;
  teorAflatoxinaPpb: number;
  status: 'EM_SECAGEM' | 'ANALISE_MICOTOXINA' | 'CERTIFICADO_EXPORTACAO';
}

export const CastanhaBrasilExtrativismoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lotes' | 'sanidade' | 'resex' | 'simulador'>('lotes');

  // Parâmetros do Simulador Extrativista
  const [ouricosTotalKg, setOuricosTotalKg] = useState<number>(100000);
  const [rendimentoCascaPct, setRendimentoCascaPct] = useState<number>(25);
  const [rendimentoInteiraPct, setRendimentoInteiraPct] = useState<number>(75);
  const [teorAflatoxinaInputPpb, setTeorAflatoxinaInputPpb] = useState<number>(1.8);
  const [precoKgAmendoaInteiraReais, setPrecoKgAmendoaInteiraReais] = useState<number>(65.0);
  const [precoKgPedacosReais, setPrecoKgPedacosReais] = useState<number>(35.0);
  const [custoOperacionalTotalReais, setCustoOperacionalTotalReais] = useState<number>(240000);

  const [lotes, setLotes] = useState<LoteCastanha[]>([
    {
      id: 'LT-CAST-01',
      codigoLote: 'LT-2026-RESEX-CM01',
      resexOrigem: 'Resex Chico Mendes (Xapuri - AC)',
      castanheirasMapeadas: 420,
      ouricosColetadosKg: 35000,
      castanhaCascaKg: 8750,
      amendoaInteiraKg: 2625,
      teorAflatoxinaPpb: 1.4,
      status: 'CERTIFICADO_EXPORTACAO',
    },
    {
      id: 'LT-CAST-02',
      codigoLote: 'LT-2026-FLONA-TAP02',
      resexOrigem: 'Flona do Tapajós (Belterra - PA)',
      castanheirasMapeadas: 310,
      ouricosColetadosKg: 28000,
      castanhaCascaKg: 7000,
      amendoaInteiraKg: 2100,
      teorAflatoxinaPpb: 2.1,
      status: 'CERTIFICADO_EXPORTACAO',
    },
    {
      id: 'LT-CAST-03',
      codigoLote: 'LT-2026-MEDIO-JURUA03',
      resexOrigem: 'Resex Médio Juruá (Carauari - AM)',
      castanheirasMapeadas: 540,
      ouricosColetadosKg: 45000,
      castanhaCascaKg: 11250,
      amendoaInteiraKg: 3375,
      teorAflatoxinaPpb: 1.6,
      status: 'ANALISE_MICOTOXINA',
    },
  ]);

  const metricas = useMemo(() => {
    const castanhaEmCascaKg = Number((ouricosTotalKg * (rendimentoCascaPct / 100)).toFixed(1));
    const amendoaTotalKg = Number((castanhaEmCascaKg * 0.4).toFixed(1));
    const amendoaInteiraExportKg = Number((amendoaTotalKg * (rendimentoInteiraPct / 100)).toFixed(1));
    const amendoaPedacosKg = Number((amendoaTotalKg - amendoaInteiraExportKg).toFixed(1));

    const isConformeExportacao = teorAflatoxinaInputPpb <= 4.0;

    const receitaBrutaReais = Number(
      (
        amendoaInteiraExportKg * precoKgAmendoaInteiraReais +
        amendoaPedacosKg * precoKgPedacosReais
      ).toFixed(2)
    );

    const lucroLiquidoReais = Number((receitaBrutaReais - custoOperacionalTotalReais).toFixed(2));
    const margemLiquidaPct = receitaBrutaReais > 0 ? Number(((lucroLiquidoReais / receitaBrutaReais) * 100).toFixed(1)) : 0;

    return {
      castanhaEmCascaKg,
      amendoaTotalKg,
      amendoaInteiraExportKg,
      amendoaPedacosKg,
      isConformeExportacao,
      receitaBrutaReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    ouricosTotalKg,
    rendimentoCascaPct,
    rendimentoInteiraPct,
    teorAflatoxinaInputPpb,
    precoKgAmendoaInteiraReais,
    precoKgPedacosReais,
    custoOperacionalTotalReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-200 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-700 to-lime-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Trees className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Castanha-do-Brasil & Extrativismo 4.0
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Módulo 113 • Bertholletia excelsa & Aflatoxina Livre
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Rastreabilidade georreferenciada em Reservas Extrativistas (Resex), controle de umidade crítica e certificação de exportação UE/MAPA.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador Resex
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Castanha em Casca</span>
            <Trees className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.castanhaEmCascaKg.toLocaleString('pt-BR')} kg
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Rendimento 25% de ouriços
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Amêndoas Inteiras Export</span>
            <Sparkles className="w-5 h-5 text-lime-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.amendoaInteiraExportKg.toLocaleString('pt-BR')} kg
          </p>
          <span className="text-xs text-lime-400 mt-1 block">
            R$ {precoKgAmendoaInteiraReais.toFixed(2)}/kg
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Faturamento Bruto</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.receitaBrutaReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            Inteiras + Pedaços
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Lucro Líquido Cooperativa</span>
            <Award className="w-5 h-5 text-emerald-400" />
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
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('lotes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'lotes'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Rastreabilidade por Lote
        </button>

        <button
          onClick={() => setActiveTab('sanidade')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'sanidade'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Controle de Aflatoxinas
        </button>

        <button
          onClick={() => setActiveTab('resex')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'resex'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Manejo Florestal Resex
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'lotes' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Trees className="w-5 h-5 text-emerald-400" />
            Lotes Rastreáveis de Castanhais Centenários
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="text-xs uppercase bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Código do Lote</th>
                  <th className="px-4 py-3">Resex / Comunidade</th>
                  <th className="px-4 py-3">Árvores GPS</th>
                  <th className="px-4 py-3">Ouriços (kg)</th>
                  <th className="px-4 py-3">Casca (kg)</th>
                  <th className="px-4 py-3">Aflatoxina (ppb)</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lotes.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-white">{l.codigoLote}</td>
                    <td className="px-4 py-3">{l.resexOrigem}</td>
                    <td className="px-4 py-3 text-emerald-400">{l.castanheirasMapeadas} árvores</td>
                    <td className="px-4 py-3">{l.ouricosColetadosKg.toLocaleString('pt-BR')} kg</td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {l.castanhaCascaKg.toLocaleString('pt-BR')} kg
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {l.teorAflatoxinaPpb} ppb
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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

      {activeTab === 'sanidade' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Secagem Rápida Pós-Coleta</h4>
            </div>
            <p className="text-xs text-slate-600">
              Desencasque dos ouriços na mata em menos de 48h e lavagem superficial para inibição de esporos de Aspergillus flavus e parasiticus.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Tempo Máximo no Chão:</span>
              <span className="text-sm font-bold text-emerald-400 block">menor que 5 dias pós-queda</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-lime-400" />
              <h4 className="text-sm font-semibold text-white">Padrão Sanitário UE / MAPA</h4>
            </div>
            <p className="text-xs text-slate-600">
              Aflatoxina total controlada por cromatografia líquida HPLC. Limite europeu rígido para desembaraço aduaneiro sem bloqueio sanitário.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Teto Máximo Permitido:</span>
              <span className="text-sm font-bold text-lime-400 block">menor ou igual a 4.0 ppb total</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Umidade da Amêndoa</h4>
            </div>
            <p className="text-xs text-slate-600">
              Desidratação final das amêndoas para 4.5% a 5.5% e envase a vácuo aluminizado para preservar o perfil lipídico nobre rico em selênio.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Atividade de Água (aw):</span>
              <span className="text-sm font-bold text-yellow-400 block">menor que 0.65 aw</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resex' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            Polígonos de Coleta & Manejo Sustentável em Floresta Nativa
          </h3>
          <p className="text-sm text-slate-600">
            A colheita de castanha-do-brasil é a espinha dorsal da bioeconomia amazônica. A preservação da castanheira centenária garante floresta em pé, proteção de bacias hidrográficas e sustento direto para comunidades tradicionais.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Polinização Natural</span>
              <p className="text-lg font-bold text-white mt-1">Abelhas Bombus & Euglossa</p>
              <span className="text-[11px] text-slate-500">Dependência estrita da floresta nativa</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Teor Natural de Selênio</span>
              <p className="text-lg font-bold text-lime-400 mt-1">superior a 2.500 mcg/100g</p>
              <span className="text-[11px] text-lime-500/80">Superalimento antioxidante</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Selos de Origem</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">FSC & Orgânico Brasil</p>
              <span className="text-[11px] text-slate-500">Prêmio de R$ 15,00/kg no mercado externo</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Simulador de Beneficiamento & Receita de Exportação
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Ouriços Coletados (kg)</label>
              <input
                type="number"
                value={ouricosTotalKg}
                onChange={(e) => setOuricosTotalKg(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Rendimento Inteiras (%)</label>
              <input
                type="number"
                value={rendimentoInteiraPct}
                onChange={(e) => setRendimentoInteiraPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Aflatoxina Total (ppb)</label>
              <input
                type="number"
                step="0.1"
                value={teorAflatoxinaInputPpb}
                onChange={(e) => setTeorAflatoxinaInputPpb(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Preço Inteira (R$/kg)</label>
              <input
                type="number"
                value={precoKgAmendoaInteiraReais}
                onChange={(e) => setPrecoKgAmendoaInteiraReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-600 block">Classificação de Exportação:</span>
              <span className={`text-base font-bold ${metricas.isConformeExportacao ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metricas.isConformeExportacao ? '✓ CONFORME PADRÃO UE / MAPA (ELEGÍVEL EXPORTAÇÃO)' : '⚠ RESTRITO A MERCADO INTERNO'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-600 block">Lucro Líquido Projetado:</span>
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
