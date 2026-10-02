import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Milk,
  ShieldCheck,
  TrendingUp,
  Coins,
  Layers,
  Award,
  Activity,
  HeartPulse,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface LoteLeiteiro {
  id: string;
  nome: string;
  raca: string;
  sistemaOrdenha: 'ROBOTIZADA_LELY' | 'CARROSSEL_ROTATIVO' | 'ESPINHA_PEIXE_AUTO';
  vacasLactacao: number;
  delMedioDias: number; // Dias em Lactação (DEL)
  producaoMediaLitroDia: number;
  ccsCelulasMl: number; // Contagem de Células Somáticas (< 400.000 IN 76/77)
  cbtUfcMl: number; // Contagem Bacteriana Total (< 100.000)
  gorduraPct: number;
  proteinaPct: number;
  custoAlimentarVacaDiaReais: number;
}

export const BovinoculturaLeiteModule: React.FC = () => {
  const [lotes, setLotes] = useState<LoteLeiteiro[]>([
    {
      id: 'LEI-01',
      nome: 'Lote Alta Produção (Ordenha Robotizada)',
      raca: 'Holandês PO Puro (Compost Barn)',
      sistemaOrdenha: 'ROBOTIZADA_LELY',
      vacasLactacao: 85,
      delMedioDias: 120,
      producaoMediaLitroDia: 38.5,
      ccsCelulasMl: 165000,
      cbtUfcMl: 18000,
      gorduraPct: 3.85,
      proteinaPct: 3.25,
      custoAlimentarVacaDiaReais: 44.20,
    },
    {
      id: 'LEI-02',
      nome: 'Lote Médio (Compost Barn)',
      raca: 'Girolando 5/8 (Alta Rusticidade)',
      sistemaOrdenha: 'ROBOTIZADA_LELY',
      vacasLactacao: 65,
      delMedioDias: 185,
      producaoMediaLitroDia: 28.0,
      ccsCelulasMl: 210000,
      cbtUfcMl: 22000,
      gorduraPct: 3.92,
      proteinaPct: 3.30,
      custoAlimentarVacaDiaReais: 32.50,
    },
    {
      id: 'LEI-03',
      nome: 'Lote Pastejo Rotacionado (Tifton 85)',
      raca: 'Jersey Pura (Alto Teor de Sólidos)',
      sistemaOrdenha: 'ESPINHA_PEIXE_AUTO',
      areaPastagemHa: 25,
      vacasLactacao: 40,
      delMedioDias: 160,
      producaoMediaLitroDia: 22.5,
      ccsCelulasMl: 140000,
      cbtUfcMl: 15000,
      gorduraPct: 4.65,
      proteinaPct: 3.75,
      custoAlimentarVacaDiaReais: 24.80,
    } as any,
  ]);

  const [precoBaseLitroReais, setPrecoBaseLitroReais] = useState<number>(2.45);
  const [bonusQualidadeReais, setBonusQualidadeReais] = useState<number>(0.25); // +R$ 0,25/L bônus baixa CCS/CBT

  // Cálculos Consolidados
  const leiteMetrics = useMemo(() => {
    const totalVacasLactacao = lotes.reduce((acc, l) => acc + l.vacasLactacao, 0);

    let producaoDiariaLitros = 0;
    let custoAlimentarTotalDiaReais = 0;
    let somaPonderadaCcs = 0;
    let somaPonderadaCbt = 0;

    lotes.forEach((l) => {
      const prodLote = l.vacasLactacao * l.producaoMediaLitroDia;
      const custoLote = l.vacasLactacao * l.custoAlimentarVacaDiaReais;
      producaoDiariaLitros += prodLote;
      custoAlimentarTotalDiaReais += custoLote;
      somaPonderadaCcs += l.ccsCelulasMl * prodLote;
      somaPonderadaCbt += l.cbtUfcMl * prodLote;
    });

    const precoEfetivoLitro = precoBaseLitroReais + bonusQualidadeReais;
    const faturamentoDiarioReais = producaoDiariaLitros * precoEfetivoLitro;
    const faturamentoMensalReais = faturamentoDiarioReais * 30;

    const mediaCcs = producaoDiariaLitros > 0 ? somaPonderadaCcs / producaoDiariaLitros : 0;
    const mediaCbt = producaoDiariaLitros > 0 ? somaPonderadaCbt / producaoDiariaLitros : 0;
    const mediaLitrosPorVaca = totalVacasLactacao > 0 ? producaoDiariaLitros / totalVacasLactacao : 0;

    // IOFC = Income Over Feed Cost diário por vaca
    const receitaMediaVacaDia = mediaLitrosPorVaca * precoEfetivoLitro;
    const custoMedioVacaDia = totalVacasLactacao > 0 ? custoAlimentarTotalDiaReais / totalVacasLactacao : 0;
    const iofcVacaDia = receitaMediaVacaDia - custoMedioVacaDia;
    const margemAlimentarMensalReais = (faturamentoDiarioReais - custoAlimentarTotalDiaReais) * 30;

    return {
      totalVacasLactacao,
      producaoDiariaLitros,
      precoEfetivoLitro,
      faturamentoDiarioReais,
      faturamentoMensalReais,
      mediaCcs,
      mediaCbt,
      mediaLitrosPorVaca,
      iofcVacaDia,
      custoMedioVacaDia,
      margemAlimentarMensalReais,
    };
  }, [lotes, precoBaseLitroReais, bonusQualidadeReais]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-900 border border-sky-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400">
                <Milk className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Bovinocultura de Leite 4.0 & Ordenha Robotizada
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono border border-sky-500/30">
                    IN 76/77 MAPA • IOFC • Compost Barn • Lely
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Rastreabilidade por quarto mamário, contagem de células somáticas (CCS), CBT e margem sobre o custo alimentar (IOFC).
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Padrão IN 76/77 Excelente (CCS: {Math.round(leiteMetrics.mediaCcs / 1000)}k cel/mL)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Produção Diária */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Produção Diária</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-sky-400">
            {leiteMetrics.producaoDiariaLitros.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-slate-600">L/dia</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Média: {leiteMetrics.mediaLitrosPorVaca.toFixed(1)} L/vaca/dia em {leiteMetrics.totalVacasLactacao} vacas em lactação.
          </p>
        </div>

        {/* KPI 2: IOFC */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>IOFC (Margem / Dieta)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            R$ {leiteMetrics.iofcVacaDia.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-600">/ vaca / dia</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Receita: R$ {(leiteMetrics.mediaLitrosPorVaca * leiteMetrics.precoEfetivoLitro).toFixed(2)} vs R$ {leiteMetrics.custoMedioVacaDia.toFixed(2)} ração.
          </p>
        </div>

        {/* KPI 3: Faturamento Mensal */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Faturamento Mensal</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            R$ {leiteMetrics.faturamentoMensalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Preço efetivo: R$ {leiteMetrics.precoEfetivoLitro.toFixed(2)}/L (inclui +R$ {bonusQualidadeReais.toFixed(2)} bônus).
          </p>
        </div>

        {/* KPI 4: Qualidade Sanitária */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Qualidade IN 76/77</span>
            <HeartPulse className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            {Math.round(leiteMetrics.mediaCcs / 1000)}k{' '}
            <span className="text-xs font-normal text-slate-600">CCS • {Math.round(leiteMetrics.mediaCbt / 1000)}k CBT</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            100% conforme: CCS &lt; 400k cel/mL e CBT &lt; 100k UFC/mL.
          </p>
        </div>
      </div>

      {/* Grid de Lotes e Painel de Simulação */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Lotes Leiteiros */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-400" />
                Lotes de Lactação & Telemetria do Robô
              </h3>
              <p className="text-xs text-slate-600">
                Acompanhamento individual de condutividade elétrica, tempo de ruminação e pesagem de leite.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              {lotes.length} Lotes Ativos
            </span>
          </div>

          <div className="space-y-3">
            {lotes.map((l) => {
              const prodLote = l.vacasLactacao * l.producaoMediaLitroDia;
              const faturamentoLoteDia = prodLote * leiteMetrics.precoEfetivoLitro;

              return (
                <div
                  key={l.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-xs font-bold border border-sky-500/30">
                        {l.id}
                      </span>
                      <h4 className="text-xs font-bold text-white">{l.nome}</h4>
                      <span className="text-[11px] text-slate-600 font-mono">({l.raca})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                      {l.sistemaOrdenha.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-600">
                    <span>Vacas: <strong className="text-white">{l.vacasLactacao} cab</strong> (DEL {l.delMedioDias}d)</span>
                    <span>Produção: <strong className="text-sky-400">{l.producaoMediaLitroDia} L/vaca</strong></span>
                    <span>Sólidos: <strong className="text-amber-400">{l.gorduraPct}% Gord • {l.proteinaPct}% Prot</strong></span>
                    <span>CCS: <strong className="text-emerald-400">{Math.round(l.ccsCelulasMl / 1000)}k</strong></span>
                    <span>Receita/Dia: <strong className="text-emerald-400">R$ {faturamentoLoteDia.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Técnico de Boas Práticas Leiteiras */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-sky-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes de Qualidade do Leite e Gestão IOFC (Embrapa Gado de Leite & MAPA):
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>
                <strong>Indicador IOFC (Income Over Feed Cost):</strong> Representa o valor líquido disponível por vaca após pagar a ração para cobrir mão de obra, maquinário, instalações e lucro do pecuarista.
              </li>
              <li>
                <strong>Condutividade Elétrica & Mastite:</strong> O robô de ordenha mede a concentração iônica de sódio e cloro em cada teto a cada segundo; desvios acima de 15% acionam descarte automático do leite.
              </li>
              <li>
                <strong>Bônus de Laticínio por Sólidos:</strong> A remuneração moderna paga prêmios substanciais (+10% a +15%) por leite com gordura acima de 3.8% e proteína acima de 3.2%.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Comerciais */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Parâmetros Comerciais do Leite
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Preço Base do Litro de Leite (R$)</label>
              <input
                type="number"
                step="0.05"
                value={precoBaseLitroReais}
                onChange={(e) => setPrecoBaseLitroReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Bônus por Qualidade CCS/CBT e Sólidos (R$/L)</label>
              <input
                type="number"
                step="0.05"
                value={bonusQualidadeReais}
                onChange={(e) => setBonusQualidadeReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Preço Efetivo Faturado:</span>
                <span className="text-sky-400 font-mono font-bold">
                  R$ {leiteMetrics.precoEfetivoLitro.toFixed(2)} / L
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Faturamento Mensal (30d):</span>
                <span className="text-amber-400 font-mono font-bold">
                  R$ {leiteMetrics.faturamentoMensalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-white">Margem sobre a Dieta (Mês):</span>
                <span className="text-emerald-400 font-mono">
                  R$ {leiteMetrics.margemAlimentarMensalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / mês
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
