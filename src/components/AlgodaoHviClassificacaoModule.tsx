import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Scale,
  Award,
  DollarSign,
  TrendingUp,
  Layers,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

interface FardoAlgodaoHvi {
  id: string;
  codigoFardo: string;
  talhaoOrigem: string;
  pesoLiquidoKg: number;
  micronaire: number;
  resistenciaGPerTex: number;
  comprimentoUhmlPol: number;
  uniformidadePct: number;
  indiceFibrasCurtasSfiPct: number;
  tipoVisual: 'MIDDLING_31' | 'STRICT_LOW_MIDDLING_41' | 'STRICT_MIDDLING_21';
  certificacao: 'ABR_BCI' | 'CONVENCIONAL';
  statusClassificacao: 'PREMIUM_EXPORTACAO' | 'TIPO_PADRAO' | 'DESCONTO_APLICADO';
}

export const AlgodaoHviClassificacaoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fardos' | 'hvi' | 'certificacoes' | 'simulador'>('fardos');

  // Parâmetros do Simulador
  const [totalFardosSafra, setTotalFardosSafra] = useState<number>(4500);
  const [pesoMedioFardoKg, setPesoMedioFardoKg] = useState<number>(225.0);
  const [precoBaseArrobaReais, setPrecoBaseArrobaReais] = useState<number>(148.0);
  const [premioHviQualidadePct, setPremioHviQualidadePct] = useState<number>(5.5);
  const [custoDescarocamentoPorKg, setCustoDescarocamentoPorKg] = useState<number>(0.35);

  const [fardos, setFardos] = useState<FardoAlgodaoHvi[]>([
    {
      id: 'FRD-10291',
      codigoFardo: 'FARDO-BR-MT-2026-10291',
      talhaoOrigem: 'Talhão 04 - Chapadão do Céu',
      pesoLiquidoKg: 226.4,
      micronaire: 4.25,
      resistenciaGPerTex: 32.1,
      comprimentoUhmlPol: 1.20,
      uniformidadePct: 83.4,
      indiceFibrasCurtasSfiPct: 6.8,
      tipoVisual: 'STRICT_MIDDLING_21',
      certificacao: 'ABR_BCI',
      statusClassificacao: 'PREMIUM_EXPORTACAO',
    },
    {
      id: 'FRD-10292',
      codigoFardo: 'FARDO-BR-MT-2026-10292',
      talhaoOrigem: 'Talhão 04 - Chapadão do Céu',
      pesoLiquidoKg: 224.8,
      micronaire: 4.10,
      resistenciaGPerTex: 31.8,
      comprimentoUhmlPol: 1.18,
      uniformidadePct: 82.8,
      indiceFibrasCurtasSfiPct: 7.2,
      tipoVisual: 'MIDDLING_31',
      certificacao: 'ABR_BCI',
      statusClassificacao: 'PREMIUM_EXPORTACAO',
    },
    {
      id: 'FRD-10293',
      codigoFardo: 'FARDO-BR-BA-2026-08144',
      talhaoOrigem: 'Talhão 11 - Luís Eduardo Magalhães',
      pesoLiquidoKg: 225.0,
      micronaire: 3.85,
      resistenciaGPerTex: 30.5,
      comprimentoUhmlPol: 1.16,
      uniformidadePct: 81.9,
      indiceFibrasCurtasSfiPct: 8.5,
      tipoVisual: 'STRICT_LOW_MIDDLING_41',
      certificacao: 'ABR_BCI',
      statusClassificacao: 'TIPO_PADRAO',
    },
  ]);

  const metricas = useMemo(() => {
    const plumaTotalKg = Number((totalFardosSafra * pesoMedioFardoKg).toFixed(1));
    const arrobasTotal = Number((plumaTotalKg / 15.0).toFixed(2));
    const precoEfetivoArroba = Number((precoBaseArrobaReais * (1 + premioHviQualidadePct / 100)).toFixed(2));
    const faturamentoBrutoReais = Number((arrobasTotal * precoEfetivoArroba).toFixed(2));
    const premioTotalQualidadeReais = Number((faturamentoBrutoReais - arrobasTotal * precoBaseArrobaReais).toFixed(2));
    const custoIndustrialReais = Number((plumaTotalKg * custoDescarocamentoPorKg).toFixed(2));
    const margemLiquidaReais = Number((faturamentoBrutoReais - custoIndustrialReais).toFixed(2));

    return {
      plumaTotalKg,
      arrobasTotal,
      precoEfetivoArroba,
      faturamentoBrutoReais,
      premioTotalQualidadeReais,
      custoIndustrialReais,
      margemLiquidaReais,
    };
  }, [
    totalFardosSafra,
    pesoMedioFardoKg,
    precoBaseArrobaReais,
    premioHviQualidadePct,
    custoDescarocamentoPorKg,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Algodão em Pluma & Classificação Instrumental HVI Plus
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Módulo 126 • Padrão ABRAPA / ABR & BCI Sustentável
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Análise instrumental fardo a fardo: Micronaire, Resistência à Tração (g/tex), Comprimento de Fibra (UHML), Uniformidade e Índice de Fibras Curtas (SFI).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Prêmios HVI
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Volume Total em Pluma</span>
            <Scale className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.arrobasTotal.toLocaleString('pt-BR')} @
          </p>
          <span className="text-xs text-sky-400 mt-1 block">
            {(metricas.plumaTotalKg / 1000).toFixed(1)} toneladas de fibra
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Preço Efetivo / @</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {metricas.precoEfetivoArroba.toFixed(2)}
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            +{premioHviQualidadePct}% de prêmio por excelência HVI
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Prêmio HVI Agregado</span>
            <Award className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.premioTotalQualidadeReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            Ganho adicional sobre a cotação base
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Faturamento da Safra</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.faturamentoBrutoReais / 1000000).toFixed(2)}M
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Lote 100% certificado ABR/BCI
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('fardos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'fardos'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Fardos & Análise Instrumental
        </button>

        <button
          onClick={() => setActiveTab('hvi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'hvi'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Parâmetros HVI & Tolerâncias
        </button>

        <button
          onClick={() => setActiveTab('certificacoes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'certificacoes'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Certificações ABR & BCI
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'fardos' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            Leitura Óptica e Instrumental por Código de Barras Único (ABRAPA)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Código do Fardo</th>
                  <th className="px-4 py-3">Talhão</th>
                  <th className="px-4 py-3">Peso (kg)</th>
                  <th className="px-4 py-3">Micronaire</th>
                  <th className="px-4 py-3">Resistência</th>
                  <th className="px-4 py-3">UHML (pol)</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {fardos.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-white">{f.codigoFardo}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{f.talhaoOrigem}</td>
                    <td className="px-4 py-3">{f.pesoLiquidoKg} kg</td>
                    <td className="px-4 py-3 font-bold text-sky-400">{f.micronaire}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{f.resistenciaGPerTex} g/tex</td>
                    <td className="px-4 py-3">{f.comprimentoUhmlPol}&quot;</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {f.statusClassificacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'hvi' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-sky-400" />
              <h4 className="text-sm font-semibold text-white">Micronaire (Finura e Maturidade)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Faixa base de comercialização sem desconto entre 3.5 e 4.9. Abaixo de 3.5 indica fibras imaturas (propensas a neps); acima de 4.9 indica fibras excessivamente grosseiras.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Faixa Premium Ideal:</span>
              <span className="text-sm font-bold text-sky-400 block">3.8 a 4.5 Micronaire</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Resistência de Fibra (Strength)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Mede a tenacidade à ruptura em gramas por tex. Valores acima de 30.0 g/tex são exigidos pela indústria têxtil de fiação open-end e vortex de alta rotação.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Classificação ABRAPA:</span>
              <span className="text-sm font-bold text-emerald-400 block">superior a 30.0 g/tex (Muito Forte)</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <FileCheck className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Comprimento de Fibra (UHML)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Upper Half Mean Length expressa em polegadas. Fibras superiores a 1.18 polegadas (30 mm) recebem ágio imediato nas trades globais asiáticas.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Padrão Exportação:</span>
              <span className="text-sm font-bold text-yellow-400 block">UHML superior a 1.18 pol</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'certificacoes' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            Certificação Socioambiental ABR (Algodão Brasileiro Responsável) & BCI
          </h3>
          <p className="text-sm text-slate-400">
            A conformidade com o protocolo ABR unifica auditorias trabalhistas, ambientais e de rastreabilidade com equivalência direta ao Better Cotton Initiative (BCI), viabilizando exportações prioritárias para Europa e Ásia.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Conformidade ABR</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">100% Auditado</p>
              <span className="text-[11px] text-slate-400">Critérios de saúde, segurança e CLT</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Benchmark BCI Global</span>
              <p className="text-lg font-bold text-sky-400 mt-1">Better Cotton Licenciado</p>
              <span className="text-[11px] text-slate-400">Reconhecido pelas maiores marcas</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Rastreabilidade em Nuvem</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">QR Code por Fardo</p>
              <span className="text-[11px] text-slate-400">Histórico de talhão e colheita</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-sky-400" />
            Simulador de Prêmios HVI & Balanço Financeiro da Pluma
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Total de Fardos</label>
              <input
                type="number"
                value={totalFardosSafra}
                onChange={(e) => setTotalFardosSafra(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Preço Base (R$/@)</label>
              <input
                type="number"
                step="1"
                value={precoBaseArrobaReais}
                onChange={(e) => setPrecoBaseArrobaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Prêmio HVI (%)</label>
              <input
                type="number"
                step="0.5"
                value={premioHviQualidadePct}
                onChange={(e) => setPremioHviQualidadePct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Descaroçamento (R$/kg)</label>
              <input
                type="number"
                step="0.05"
                value={custoDescarocamentoPorKg}
                onChange={(e) => setCustoDescarocamentoPorKg(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Preço Final com Prêmio HVI:</span>
              <span className="text-base font-bold text-sky-400">
                R$ {metricas.precoEfetivoArroba.toFixed(2)} por @ de pluma
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Margem Líquida da Pluma:</span>
              <span className="text-xl font-bold text-emerald-400">
                R$ {metricas.margemLiquidaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
