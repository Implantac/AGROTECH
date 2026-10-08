import React, { useState, useMemo } from 'react';
import {
  Flame,
  Zap,
  TrendingUp,
  Leaf,
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  Droplets,
  Coins,
  Info
} from 'lucide-react';

interface BiodigestorUnidade {
  id: string;
  nome: string;
  tipoPlantel: 'SUINOS_TERMINACAO' | 'CONFINAMENTO_BOVINO' | 'LEITE_CONFINADO';
  numeroCabecas: number;
  volumeBiodigestorM3: number;
  geradorPotenciaKw: number;
}

export const BiodigestorBiometanoModule: React.FC = () => {
  const [unidades, setUnidades] = useState<BiodigestorUnidade[]>([
    {
      id: 'BIO-01',
      nome: 'Biodigestor Central • Granja Suína',
      tipoPlantel: 'SUINOS_TERMINACAO',
      numeroCabecas: 5500,
      volumeBiodigestorM3: 4200,
      geradorPotenciaKw: 150,
    },
    {
      id: 'BIO-02',
      nome: 'Biodigestor II • Confinamento Bovino',
      tipoPlantel: 'CONFINAMENTO_BOVINO',
      numeroCabecas: 1800,
      volumeBiodigestorM3: 6500,
      geradorPotenciaKw: 250,
    },
  ]);

  const [unidadeSelecionadaId, setUnidadeSelecionadaId] = useState<string>('BIO-01');
  const [teorMetanoCh4Pct, setTeorMetanoCh4Pct] = useState<number>(63.0); // 63% CH4 no biogás
  const [eficienciaGeradorPct, setEficienciaGeradorPct] = useState<number>(36.0); // 36% rendimento elétrico
  const [tarifaEnergiaKwhReais, setTarifaEnergiaKwhReais] = useState<number>(0.74); // R$ 0,74/kWh
  const [precoCreditoMetanoTonCo2, setPrecoCreditoMetanoTonCo2] = useState<number>(75.0); // R$ 75/t CO2eq

  const unidadeAtiva = useMemo(
    () => unidades.find((u) => u.id === unidadeSelecionadaId) || unidades[0],
    [unidades, unidadeSelecionadaId]
  );

  // Cálculos do Motor de Biometano e Geração de Energia
  const bioMetrics = useMemo(() => {
    // 1. Produção de Sólidos Voláteis (SV) por cabeça/dia
    // Suíno ~0.45 kg SV/dia | Bovino de corte ~2.2 kg SV/dia | Leite ~2.8 kg SV/dia
    let svPorCabecaKgDia = 0.45;
    if (unidadeAtiva.tipoPlantel === 'CONFINAMENTO_BOVINO') svPorCabecaKgDia = 2.2;
    else if (unidadeAtiva.tipoPlantel === 'LEITE_CONFINADO') svPorCabecaKgDia = 2.8;

    const solidosVolateisTotaisKgDia = unidadeAtiva.numeroCabecas * svPorCabecaKgDia;

    // 2. Produção de Biogás (m³/dia)
    // Rendimento: ~0.45 m³ biogás por kg de SV
    const volumeBiogasDiaM3 = solidosVolateisTotaisKgDia * 0.45;
    const volumeMetanoDiaM3 = (volumeBiogasDiaM3 * teorMetanoCh4Pct) / 100.0;

    // 3. Potencial Energético e Eletricidade Gerada
    // Poder Calorífico Inferior do Biogás ~ 6.0 kWh/m³
    const energiaTermicaKwhDia = volumeBiogasDiaM3 * 6.0;
    const energiaEletricaKwhDia = energiaTermicaKwhDia * (eficienciaGeradorPct / 100.0);
    const energiaEletricaMesKwh = energiaEletricaKwhDia * 30.0;
    const energiaEletricaAnoKwh = energiaEletricaMesKwh * 12.0;

    // 4. Economia Financeira na Conta de Energia (Geração Distribuída GD)
    const economiaMensalReais = energiaEletricaMesKwh * tarifaEnergiaKwhReais;
    const economiaAnualReais = economiaMensalReais * 12.0;

    // 5. Créditos de Mitigação de Metano (Methane Abatement)
    // 1 m³ de CH4 = 0.717 kg de CH4. GWP do CH4 = 28x CO2eq.
    const metanoMassaKgDia = volumeMetanoDiaM3 * 0.717;
    const co2AbatidoTonAno = (metanoMassaKgDia * 365.0 * 28.0) / 1000.0;
    const receitaCreditosCarbonoReais = co2AbatidoTonAno * precoCreditoMetanoTonCo2;

    // 6. Biofertilizante Efluente (m³/dia) rico em NPK orgânico
    const biofertilizanteDiaM3 = volumeBiogasDiaM3 * 0.85;

    return {
      solidosVolateisTotaisKgDia,
      volumeBiogasDiaM3,
      volumeMetanoDiaM3,
      energiaEletricaKwhDia,
      energiaEletricaMesKwh,
      energiaEletricaAnoKwh,
      economiaMensalReais,
      economiaAnualReais,
      co2AbatidoTonAno,
      receitaCreditosCarbonoReais,
      biofertilizanteDiaM3,
    };
  }, [
    unidadeAtiva,
    teorMetanoCh4Pct,
    eficienciaGeradorPct,
    tarifaEnergiaKwhReais,
    precoCreditoMetanoTonCo2,
  ]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-700">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Biodigestores, Biometano & Geração Distribuída (GD)
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono border border-teal-500/30">
                    Lei 14.300 • Cogen Biogás
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Conversão anaeróbia de dejetos pecuários em eletricidade limpa, biofertilizante e créditos de abatimento de metano.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-800 border-emerald-500/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Autossuficiência Energética Rural
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Eletricidade Mensal Gerada */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Eletricidade Limpa</span>
            <Zap className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-700">
            {bioMetrics.energiaEletricaMesKwh.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-slate-600">kWh/mês</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Produção: {bioMetrics.energiaEletricaKwhDia.toFixed(0)} kWh/dia no motogerador.
          </p>
        </div>

        {/* KPI 2: Economia na Conta de Luz */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Economia Energética</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-700">
            R$ {bioMetrics.economiaAnualReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-slate-600">/ ano</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            R$ {bioMetrics.economiaMensalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês compensados.
          </p>
        </div>

        {/* KPI 3: Volume de Biogás Diário */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Biogás Gerado</span>
            <Flame className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-teal-700">
            {bioMetrics.volumeBiogasDiaM3.toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-600">m³/dia ({teorMetanoCh4Pct}% CH₄)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Metano líquido: {bioMetrics.volumeMetanoDiaM3.toFixed(0)} m³/dia.
          </p>
        </div>

        {/* KPI 4: Abatimento de Metano */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Mitigação de Metano</span>
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-slate-800">
            {bioMetrics.co2AbatidoTonAno.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-teal-700">t CO₂eq/ano</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Receita carbono: +R$ {bioMetrics.receitaCreditosCarbonoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/ano.
          </p>
        </div>
      </div>

      {/* Grid Principal: Seletor de Unidade e Parâmetros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Unidades de Biodigestão Cadastradas */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-700" />
                Unidades de Biodigestão & Plantel Ativo
              </h3>
              <p className="text-xs text-slate-600">
                Selecione o sistema para calcular a produção de biogás e potência de despacho.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              {unidades.length} Plantas Conectadas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unidades.map((u) => {
              const isSelected = u.id === unidadeSelecionadaId;
              return (
                <div
                  key={u.id}
                  onClick={() => setUnidadeSelecionadaId(u.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-950/30 border-teal-500/50 shadow-lg'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-900">{u.nome}</h4>
                    <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-mono">
                      {u.tipoPlantel.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
                    <div>Plantel: <span className="text-white">{u.numeroCabecas.toLocaleString('pt-BR')} cab.</span></div>
                    <div>Volume: <span className="text-white">{u.volumeBiodigestorM3} m³</span></div>
                    <div>Gerador: <span className="text-white">{u.geradorPotenciaKw} kW</span></div>
                    <div>Status: <span className="text-emerald-700">Operação Contínua</span></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Técnico da Economia Circular */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-teal-700 font-semibold">
              <Sparkles className="w-4 h-4" />
              Economia Circular & Benefícios Agronômicos:
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>
                <strong>Biofertilizante Mineralizado:</strong> O efluente digerido ({bioMetrics.biofertilizanteDiaM3.toFixed(0)} m³/dia) apresenta NPK prontamente assimilável pelas plantas, sem odor e com 99% de eliminação de patógenos entéricos.
              </li>
              <li>
                <strong>Compensação Energética no Consórcio GD:</strong> A energia excedente é injetada na rede da concessionária e compensa as contas de luz dos silos, pivôs de irrigação e residências da fazenda.
              </li>
              <li>
                <strong>Créditos de Carbono de Alta Integridade:</strong> A destruição do metano atende aos padrões Verra (VCS) e Gold Standard para remuneração via mercado voluntário de carbono.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros do Biodigestor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-700" />
            Parâmetros do Biodigestor
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Teor de Metano no Biogás (CH₄)</span>
                <span className="text-teal-700 font-mono font-bold">{teorMetanoCh4Pct}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="75"
                step="0.5"
                value={teorMetanoCh4Pct}
                onChange={(e) => setTeorMetanoCh4Pct(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Eficiência Elétrica do Motogerador</span>
                <span className="text-amber-700 font-mono font-bold">{eficienciaGeradorPct}%</span>
              </div>
              <input
                type="range"
                min="28"
                max="42"
                step="0.5"
                value={eficienciaGeradorPct}
                onChange={(e) => setEficienciaGeradorPct(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Tarifa de Energia Rural (R$/kWh)</label>
              <input
                type="number"
                value={tarifaEnergiaKwhReais}
                onChange={(e) => setTarifaEnergiaKwhReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Preço Crédito de Metano (R$/t CO₂eq)</label>
              <input
                type="number"
                value={precoCreditoMetanoTonCo2}
                onChange={(e) => setPrecoCreditoMetanoTonCo2(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Economia Elétrica Anual:</span>
                <span className="text-emerald-700 font-mono font-bold">
                  R$ {bioMetrics.economiaAnualReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Receita Créditos Metano:</span>
                <span className="text-teal-700 font-mono font-bold">
                  +R$ {bioMetrics.receitaCreditosCarbonoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-white">Benefício Anual Total:</span>
                <span className="text-white font-mono">
                  R$ {(bioMetrics.economiaAnualReais + bioMetrics.receitaCreditosCarbonoReais).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
