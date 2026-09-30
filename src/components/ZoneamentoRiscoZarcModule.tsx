import React, { useState, useMemo } from 'react';
import {
  Compass,
  CloudRain,
  ShieldAlert,
  ShieldCheck,
  Award,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface RecomendacaoZarc {
  id: string;
  municipio: string;
  uf: string;
  cultura: string;
  cultivarCiclo: string;
  tipoSoloAD: 'AD1_ARENOSO' | 'AD2_MEDIO' | 'AD3_ARGILOSO';
  decendioOtimo: string;
  riscoHidricoPct: number;
  enquadramentoSeguro: 'RISCO_20_BAIXO' | 'RISCO_30_MEDIO' | 'RISCO_40_ALTO' | 'INAPTO_FORA_JANELA';
}

export const ZoneamentoRiscoZarcModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'janelas' | 'solos' | 'seguro' | 'simulador'>('janelas');

  // Parâmetros do Simulador ZARC
  const [cultura, setCultura] = useState<string>('Soja Grão');
  const [municipio, setMunicipio] = useState<string>('Sorriso (MT) - IBGE 5107909');
  const [tipoSoloAD, setTipoSoloAD] = useState<'AD1' | 'AD2' | 'AD3'>('AD3');
  const [probabilidadeDeficitInputPct, setProbabilidadeDeficitInputPct] = useState<number>(16.5);
  const [areaFinanciadaHa, setAreaFinanciadaHa] = useState<number>(600);
  const [custoImplantacaoHaReais, setCustoImplantacaoHaReais] = useState<number>(5500.0);

  const [recomendacoes, setRecomendacoes] = useState<RecomendacaoZarc[]>([
    {
      id: 'ZARC-01',
      municipio: 'Sorriso',
      uf: 'MT',
      cultura: 'Soja Safra Cheia',
      cultivarCiclo: 'Precoce (Ciclo 110d)',
      tipoSoloAD: 'AD3_ARGILOSO',
      decendioOtimo: 'Decêndio 28 (01 a 10 de Outubro)',
      riscoHidricoPct: 15.2,
      enquadramentoSeguro: 'RISCO_20_BAIXO',
    },
    {
      id: 'ZARC-02',
      municipio: 'Rio Verde',
      uf: 'GO',
      cultura: 'Milho Segunda Safra (Safrinha)',
      cultivarCiclo: 'Superprecoce',
      tipoSoloAD: 'AD2_MEDIO',
      decendioOtimo: 'Decêndio 05 (11 a 20 de Fevereiro)',
      riscoHidricoPct: 24.8,
      enquadramentoSeguro: 'RISCO_30_MEDIO',
    },
    {
      id: 'ZARC-03',
      municipio: 'Luís Eduardo Magalhães',
      uf: 'BA',
      cultura: 'Algodão Safra',
      cultivarCiclo: 'Médio / Tardio',
      tipoSoloAD: 'AD1_ARENOSO',
      decendioOtimo: 'Decêndio 33 (21 a 30 de Novembro)',
      riscoHidricoPct: 34.0,
      enquadramentoSeguro: 'RISCO_40_ALTO',
    },
  ]);

  const metricas = useMemo(() => {
    let enquadramento = '';
    let taxaFranquia = 0;
    let statusClass = '';

    if (probabilidadeDeficitInputPct <= 20.0) {
      enquadramento = 'RISCO BAIXO (SUBVENÇÃO FEDERAL PSR MÁXIMA 40%)';
      taxaFranquia = 10.0;
      statusClass = 'text-emerald-400';
    } else if (probabilidadeDeficitInputPct <= 30.0) {
      enquadramento = 'RISCO MÉDIO (SUBVENÇÃO PADRÃO PROAGRO)';
      taxaFranquia = 15.0;
      statusClass = 'text-yellow-400';
    } else if (probabilidadeDeficitInputPct <= 40.0) {
      enquadramento = 'RISCO ELEVADO (CRÉDITO COM RETENÇÃO MAIOR)';
      taxaFranquia = 25.0;
      statusClass = 'text-orange-400';
    } else {
      enquadramento = 'FORA DA JANELA ZARC (INAPTO A FINANCIAMENTO OFICIAL)';
      taxaFranquia = 0;
      statusClass = 'text-rose-400';
    }

    const isElegivelPlanoSafra = probabilidadeDeficitInputPct <= 40.0;
    const capitalFinanciadoTotal = Number((areaFinanciadaHa * custoImplantacaoHaReais).toFixed(2));
    const valorFranquiaSeguroReais = isElegivelPlanoSafra
      ? Number(((capitalFinanciadoTotal * taxaFranquia) / 100).toFixed(2))
      : 0;

    return {
      enquadramento,
      taxaFranquia,
      statusClass,
      isElegivelPlanoSafra,
      capitalFinanciadoTotal,
      valorFranquiaSeguroReais,
    };
  }, [probabilidadeDeficitInputPct, areaFinanciadaHa, custoImplantacaoHaReais]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Compass className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Zoneamento de Risco Climático & ZARC 2.0
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Módulo 120 • Portarias MAPA, Solos AD1/AD2/AD3 & Seguro Rural
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Enquadramento decendial de semeadura por município e tipo de solo para habilitação ao Proagro e subvenção do Seguro Rural Privado.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20"
          >
            <ShieldCheck className="w-4 h-4" />
            Auditor de Janela ZARC
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Risco Hídrico Projetado</span>
            <CloudRain className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {probabilidadeDeficitInputPct.toFixed(1)}%
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Solo Classe {tipoSoloAD} (Argiloso)
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Elegibilidade Plano Safra</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.isElegivelPlanoSafra ? '100% Apto' : 'Bloqueado'}
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Crédito Rural Oficial MAPA
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Capital Financiado Total</span>
            <DollarSign className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.capitalFinanciadoTotal / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            {areaFinanciadaHa} hectares sob custeio
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Franquia de Seguro Estipulada</span>
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.taxaFranquia}%
          </p>
          <span className="text-xs text-blue-400 mt-1 block">
            R$ {(metricas.valorFranquiaSeguroReais / 1000).toFixed(1)}k retidos
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('janelas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'janelas'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Janelas Decendiais ZARC
        </button>

        <button
          onClick={() => setActiveTab('solos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'solos'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Classes de Solo (AD1, AD2, AD3)
        </button>

        <button
          onClick={() => setActiveTab('seguro')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'seguro'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Níveis de Risco & Subvenção PSR
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'janelas' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Portarias de Zoneamento Publicadas no Diário Oficial da União (DOU)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Município / UF</th>
                  <th className="px-4 py-3">Cultura & Ciclo</th>
                  <th className="px-4 py-3">Tipo de Solo</th>
                  <th className="px-4 py-3">Janela Ótima</th>
                  <th className="px-4 py-3">Risco Hídrico</th>
                  <th className="px-4 py-3">Enquadramento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recomendacoes.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-white">{r.municipio} - {r.uf}</td>
                    <td className="px-4 py-3">{r.cultura} ({r.cultivarCiclo})</td>
                    <td className="px-4 py-3 font-mono text-xs">{r.tipoSoloAD}</td>
                    <td className="px-4 py-3 text-blue-400 font-semibold">{r.decendioOtimo}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{r.riscoHidricoPct}%</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {r.enquadramentoSeguro}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'solos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Solo Tipo AD1 (Arenoso)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Teor de argila inferior a 15% ou baixa retenção hídrica (água disponível menor que 0.35 mm/cm). Janela de plantio mais estreita devido à rápida dessecação.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Capacidade de Retenção:</span>
              <span className="text-sm font-bold text-yellow-400 block">menor que 35 mm de CAD</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-blue-400" />
              <h4 className="text-sm font-semibold text-white">Solo Tipo AD2 (Médio)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Textura média entre 15% e 35% de argila (água disponível entre 0.35 e 0.55 mm/cm). Retenção equilibrada com boa drenagem superficial.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Capacidade de Retenção:</span>
              <span className="text-sm font-bold text-blue-400 block">35 mm a 55 mm de CAD</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Solo Tipo AD3 (Argiloso)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Latossolos vermelhos e amarelos com mais de 35% de argila e alto teor de matéria orgânica. Máxima segurança contra veranicos de até 15 dias.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Capacidade de Retenção:</span>
              <span className="text-sm font-bold text-emerald-400 block">superior a 55 mm de CAD</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'seguro' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Classificação de Risco e Subvenção Federal ao Prêmio do Seguro (PSR)
          </h3>
          <p className="text-sm text-slate-400">
            A contratação de seguro agrícola vinculada às portarias do ZARC garante descontos federais de até 40% na apólice do produtor através do Programa de Subvenção ao Prêmio do Seguro Rural (PSR).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Risco Baixo (≤ 20%)</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">Subvenção 40%</p>
              <span className="text-[11px] text-emerald-500/80">Menor custo de prêmio e franquia reduzida</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Risco Médio (21% a 30%)</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">Subvenção 25%</p>
              <span className="text-[11px] text-slate-500">Exige histórico positivo de produtividade</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Risco Elevado (31% a 40%)</span>
              <p className="text-lg font-bold text-orange-400 mt-1">Sem Subvenção PSR</p>
              <span className="text-[11px] text-slate-500">Contratação apenas em seguradoras privadas</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            Simulador de Enquadramento ZARC & Franquia de Seguro Rural
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Área Financiada (ha)</label>
              <input
                type="number"
                value={areaFinanciadaHa}
                onChange={(e) => setAreaFinanciadaHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Custo Implantação (R$/ha)</label>
              <input
                type="number"
                value={custoImplantacaoHaReais}
                onChange={(e) => setCustoImplantacaoHaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Tipo de Solo (CAD)</label>
              <select
                value={tipoSoloAD}
                onChange={(e) => setTipoSoloAD(e.target.value as 'AD1' | 'AD2' | 'AD3')}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="AD1">Solo AD1 (Arenoso)</option>
                <option value="AD2">Solo AD2 (Médio)</option>
                <option value="AD3">Solo AD3 (Argiloso)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Probabilidade Frustração (%)</label>
              <input
                type="number"
                step="0.5"
                value={probabilidadeDeficitInputPct}
                onChange={(e) => setProbabilidadeDeficitInputPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Parecer Oficial de Zoneamento MAPA:</span>
              <span className={`text-base font-bold ${metricas.statusClass}`}>
                {metricas.enquadramento}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Franquia Calculada da Apólice:</span>
              <span className="text-xl font-bold text-blue-400">
                R$ {metricas.valorFranquiaSeguroReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
