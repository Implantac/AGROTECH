import React, { useState, useMemo } from 'react';
import {
  Waves,
  Fish,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Layers,
  Thermometer,
  Gauge,
  Info
} from 'lucide-react';

interface TanqueRedeInfo {
  id: string;
  nome: string;
  especie: 'TILAPIA_GIFT' | 'TAMBAQUI' | 'PINTADO';
  numeroPeixes: number;
  pesoMedioG: number;
  volumeM3: number;
  temperaturaAguaC: number;
  oxigenioMgL: number;
  phAgua: number;
  statusAerador: 'LIGADO_AUTOMATICO' | 'STANDBY_OK';
}

export const PisciculturaAquiculturaModule: React.FC = () => {
  const [tanques, setTanques] = useState<TanqueRedeInfo[]>([
    {
      id: 'TR-01',
      nome: 'Bateria 01 • Tilápia GIFT (Fase Final)',
      especie: 'TILAPIA_GIFT',
      numeroPeixes: 15000,
      pesoMedioG: 720,
      volumeM3: 650,
      temperaturaAguaC: 27.5,
      oxigenioMgL: 5.4,
      phAgua: 7.2,
      statusAerador: 'STANDBY_OK',
    },
    {
      id: 'TR-02',
      nome: 'Bateria 02 • Tilápia GIFT (Crescimento)',
      especie: 'TILAPIA_GIFT',
      numeroPeixes: 18000,
      pesoMedioG: 450,
      volumeM3: 650,
      temperaturaAguaC: 27.2,
      oxigenioMgL: 4.8,
      phAgua: 7.1,
      statusAerador: 'STANDBY_OK',
    },
    {
      id: 'TR-03',
      nome: 'Bateria 03 • Tambaqui em Escavado',
      especie: 'TAMBAQUI',
      numeroPeixes: 8000,
      pesoMedioG: 1250,
      volumeM3: 1200,
      temperaturaAguaC: 28.0,
      oxigenioMgL: 3.6,
      phAgua: 6.9,
      statusAerador: 'LIGADO_AUTOMATICO',
    },
  ]);

  const [tanqueSelecionadoId, setTanqueSelecionadoId] = useState<string>('TR-01');
  const [precoKgPeixeReais, setPrecoKgPeixeReais] = useState<number>(9.40); // R$ 9,40/kg vivo
  const [custoRacaoKgReais, setCustoRacaoKgReais] = useState<number>(3.85); // R$ 3,85/kg ração 32% PB
  const [fcrZootecnico, setFcrZootecnico] = useState<number>(1.30); // 1.30 kg ração/kg peixe

  const tanqueAtivo = useMemo(
    () => tanques.find((t) => t.id === tanqueSelecionadoId) || tanques[0],
    [tanques, tanqueSelecionadoId]
  );

  // Cálculos Técnicos Zootécnicos e Hidroquímicos
  const aquaMetrics = useMemo(() => {
    // 1. Biomassa Total do Tanque (kg e ton)
    const biomassaTotalKg = (tanqueAtivo.numeroPeixes * tanqueAtivo.pesoMedioG) / 1000.0;
    const biomassaTotalTon = biomassaTotalKg / 1000.0;

    // 2. Densidade de Estocagem (kg/m³)
    const densidadeEstocagemKgM3 = biomassaTotalKg / tanqueAtivo.volumeM3;

    // 3. Taxa de Alimentação Diária (% do Peso Vivo)
    // Para peixes de 600-800g a 27-28°C, a taxa recomendada é de ~2.4% do PV/dia
    let taxaArracoamentoPct = 2.4;
    if (tanqueAtivo.pesoMedioG < 500) taxaArracoamentoPct = 3.2;
    else if (tanqueAtivo.pesoMedioG > 1000) taxaArracoamentoPct = 1.8;

    const racaoDiariaKg = (biomassaTotalKg * taxaArracoamentoPct) / 100.0;
    const custoRacaoDiariaReais = racaoDiariaKg * custoRacaoKgReais;

    // 4. Auditoria de Oxigênio e Alerta de Hipóxia
    const isOxigenioCritico = tanqueAtivo.oxigenioMgL < 4.0;
    const isOxigenioIdeal = tanqueAtivo.oxigenioMgL >= 5.0;

    // 5. Custo Unitário de Produção por kg de Peixe Vivo
    // Custo Ração = FCR * R$/kg ração + Outros (Alevino, Sanidade, Mão de Obra ~R$ 1.25/kg)
    const custoPorKgVivoReais = fcrZootecnico * custoRacaoKgReais + 1.25;
    const margemLiquidaKgReais = precoKgPeixeReais - custoPorKgVivoReais;
    const lucroEstimadoLoteReais = biomassaTotalKg * margemLiquidaKgReais;
    const faturamentoBrutoLoteReais = biomassaTotalKg * precoKgPeixeReais;

    return {
      biomassaTotalKg,
      biomassaTotalTon,
      densidadeEstocagemKgM3,
      taxaArracoamentoPct,
      racaoDiariaKg,
      custoRacaoDiariaReais,
      isOxigenioCritico,
      isOxigenioIdeal,
      custoPorKgVivoReais,
      margemLiquidaKgReais,
      lucroEstimadoLoteReais,
      faturamentoBrutoLoteReais,
    };
  }, [tanqueAtivo, precoKgPeixeReais, custoRacaoKgReais, fcrZootecnico]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                <Fish className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Piscicultura de Precisão & Telemetria Aquícola
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                    Tilápia & Tambaqui
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Biomassa em tanques-rede, oxigênio dissolvido em tempo real, arraçoamento automático e Conversão Alimentar (FCR).
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border flex items-center gap-1.5 ${
                !aquaMetrics.isOxigenioCritico
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              }`}
            >
              <Activity className="w-4 h-4" />
              Oxigênio: {tanqueAtivo.oxigenioMgL.toFixed(1)} mg/L (
              {aquaMetrics.isOxigenioCritico ? 'Alerta Aerador Ligado' : 'Excelente'})
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Biomassa Estocada */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Biomassa Total</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-blue-400">
            {aquaMetrics.biomassaTotalTon.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-600">toneladas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {tanqueAtivo.numeroPeixes.toLocaleString('pt-BR')} peixes • {tanqueAtivo.pesoMedioG}g médio.
          </p>
        </div>

        {/* KPI 2: Densidade de Estocagem */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Densidade de Carga</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            {aquaMetrics.densidadeEstocagemKgM3.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-600">kg/m³</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Volume: {tanqueAtivo.volumeM3} m³ (Tanques-Rede 7x7m).
          </p>
        </div>

        {/* KPI 3: Ração Diária & Custo */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Ração Fornecida</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            {aquaMetrics.racaoDiariaKg.toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-600">kg/dia ({aquaMetrics.taxaArracoamentoPct}%)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Custo: R$ {aquaMetrics.custoRacaoDiariaReais.toFixed(2)}/dia em ração 32% PB.
          </p>
        </div>

        {/* KPI 4: Margem Líquida */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Margem no Lote</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            R$ {aquaMetrics.lucroEstimadoLoteReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-emerald-400">
              (+R$ {aquaMetrics.margemLiquidaKgReais.toFixed(2)}/kg)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Faturamento: R$ {aquaMetrics.faturamentoBrutoLoteReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}.
          </p>
        </div>
      </div>

      {/* Grid Principal: Lista de Baterias e Configuração Zootécnica */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Lista de Tanques e Sensores de Água */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Waves className="w-5 h-5 text-blue-400" />
                Baterias de Tanques & Monitoramento Hidroquímico
              </h3>
              <p className="text-xs text-slate-600">
                Sondas multiparâmetros (O₂, pH, Temperatura) com automação de aeradores de emergência.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              {tanques.length} Baterias Operando
            </span>
          </div>

          <div className="space-y-3">
            {tanques.map((t) => {
              const isSelected = t.id === tanqueSelecionadoId;
              return (
                <div
                  key={t.id}
                  onClick={() => setTanqueSelecionadoId(t.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-blue-950/30 border-blue-500/50 shadow-lg'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-500/30">
                        {t.id}
                      </span>
                      <h4 className="text-xs font-bold text-white">{t.nome}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border self-start sm:self-auto ${
                        t.statusAerador === 'STANDBY_OK'
                          ? 'bg-slate-800 text-slate-600 border-slate-700'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                      }`}
                    >
                      Aerador: {t.statusAerador.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono">
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Oxigênio (O₂)</span>
                      <span className={t.oxigenioMgL >= 4.5 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {t.oxigenioMgL.toFixed(1)} mg/L
                      </span>
                    </div>
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">pH da Água</span>
                      <span className="text-cyan-400 font-bold">{t.phAgua.toFixed(1)}</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Temperatura</span>
                      <span className="text-amber-400 font-bold">{t.temperaturaAguaC}°C</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Biomassa Estimada</span>
                      <span className="text-white font-bold">
                        {((t.numeroPeixes * t.pesoMedioG) / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kg
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner de Boas Práticas Aquícolas */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes de Manejo Zootécnico & Sanidade Aquícola:
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>
                <strong>Oxigênio Dissolvido Crítico:</strong> Quando o O₂ cai abaixo de 3.5 mg/L (especialmente na madrugada), a conversão alimentar é suspensa e os aeradores de pás ligam automaticamente.
              </li>
              <li>
                <strong>Fator de Conversão Alimentar (FCR):</strong> Manter o FCR abaixo de 1.35 garante a maior rentabilidade da fazenda, já que a ração representa 65% a 70% do custo total da piscicultura.
              </li>
              <li>
                <strong>Despesca e Jejum Pré-Abate:</strong> Suspender a alimentação 24 a 36 horas antes da colheita para limpeza do trato digestivo e melhoria do rendimento de filé.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Zootécnicos e Financeiros */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Fish className="w-5 h-5 text-blue-400" />
            Parâmetros do Lote
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Preço de Venda do Peixe Vivo (R$/kg)</label>
              <input
                type="number"
                value={precoKgPeixeReais}
                onChange={(e) => setPrecoKgPeixeReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Custo da Ração Peixe (R$/kg)</label>
              <input
                type="number"
                value={custoRacaoKgReais}
                onChange={(e) => setCustoRacaoKgReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Conversão Alimentar (FCR)</span>
                <span className="text-blue-400 font-mono font-bold">{fcrZootecnico.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.15"
                max="1.60"
                step="0.01"
                value={fcrZootecnico}
                onChange={(e) => setFcrZootecnico(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Quadro de Resumo de Custos e Margens */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Custo Total por kg:</span>
                <span className="text-slate-900 font-mono font-bold">
                  R$ {aquaMetrics.custoPorKgVivoReais.toFixed(2)} / kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Margem Líquida por kg:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  +R$ {aquaMetrics.margemLiquidaKgReais.toFixed(2)} / kg
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-white">Lucro Líquido no Lote:</span>
                <span className="text-cyan-400 font-mono">
                  R$ {aquaMetrics.lucroEstimadoLoteReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
