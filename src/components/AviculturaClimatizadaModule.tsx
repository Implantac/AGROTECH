import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Thermometer,
  Wind,
  Gauge,
  Activity,
  Layers,
  Coins,
  Award,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface GalpaoAviario {
  id: string;
  nome: string;
  linhagem: string;
  tipoGalpao: 'DARK_HOUSE' | 'PRESSAO_NEGATIVA' | 'CONVENCIONAL_CLIMATIZADO';
  avesAlojadas: number;
  idadeDias: number;
  pesoMedioKg: number;
  conversaoAlimentar: number;
  mortalidadePct: number;
  temperaturaAtual: number;
  umidadeRelativaPct: number;
  velocidadeArMs: number;
}

export const AviculturaClimatizadaModule: React.FC = () => {
  const [galpoes, setGalpoes] = useState<GalpaoAviario[]>([
    {
      id: 'GLP-01',
      nome: 'Aviário Núcleo 1 - Dark House',
      linhagem: 'Cobb 500 Slow',
      tipoGalpao: 'DARK_HOUSE',
      avesAlojadas: 34000,
      idadeDias: 41,
      pesoMedioKg: 2.92,
      conversaoAlimentar: 1.61,
      mortalidadePct: 2.6,
      temperaturaAtual: 22.4,
      umidadeRelativaPct: 62,
      velocidadeArMs: 2.4,
    },
    {
      id: 'GLP-02',
      nome: 'Aviário Núcleo 2 - Dark House',
      linhagem: 'Ross 308 AP',
      tipoGalpao: 'DARK_HOUSE',
      avesAlojadas: 32500,
      idadeDias: 42,
      pesoMedioKg: 3.05,
      conversaoAlimentar: 1.63,
      mortalidadePct: 2.9,
      temperaturaAtual: 21.8,
      umidadeRelativaPct: 65,
      velocidadeArMs: 2.5,
    },
    {
      id: 'GLP-03',
      nome: 'Aviário Núcleo 3 - Pressão Negativa',
      linhagem: 'Hubbard Efficiency',
      tipoGalpao: 'PRESSAO_NEGATIVA',
      avesAlojadas: 28000,
      idadeDias: 38,
      pesoMedioKg: 2.65,
      conversaoAlimentar: 1.58,
      mortalidadePct: 2.2,
      temperaturaAtual: 23.1,
      umidadeRelativaPct: 58,
      velocidadeArMs: 2.1,
    },
  ]);

  const [precoKgVivoFrangoReais, setPrecoKgVivoFrangoReais] = useState<number>(5.25); // R$/kg vivo integrado frigorífico
  const [custoEnergiaEletricaPorLote, setCustoEnergiaEletricaPorLote] = useState<number>(14500); // R$ exaustores e climatização por lote

  // Cálculos Consolidados de Eficiência Produtiva (IEP)
  const aviculturaMetrics = useMemo(() => {
    const totalAvesAlojadas = galpoes.reduce((acc, g) => acc + g.avesAlojadas, 0);

    let totalBiomassaKg = 0;
    let totalAvesVivas = 0;
    let somaPonderadaIep = 0;

    galpoes.forEach((g) => {
      const viabilidade = 100 - g.mortalidadePct;
      const avesVivas = Math.round(g.avesAlojadas * (viabilidade / 100));
      const biomassaGalpao = avesVivas * g.pesoMedioKg;
      
      // IEP = [ (Viabilidade * Peso Médio) / (Idade * CA) ] * 100
      const iepGalpao = ((viabilidade * g.pesoMedioKg) / (g.idadeDias * g.conversaoAlimentar)) * 100;

      totalAvesVivas += avesVivas;
      totalBiomassaKg += biomassaGalpao;
      somaPonderadaIep += iepGalpao * biomassaGalpao;
    });

    const iepMedioPonderado = totalBiomassaKg > 0 ? somaPonderadaIep / totalBiomassaKg : 0;
    const mortalidadeMediaPct = totalAvesAlojadas > 0 ? ((totalAvesAlojadas - totalAvesVivas) / totalAvesAlojadas) * 100 : 0;

    const faturamentoTotalReais = totalBiomassaKg * precoKgVivoFrangoReais;
    const custoEnergiaTotalReais = galpoes.length * custoEnergiaEletricaPorLote;
    const margemLoteReais = faturamentoTotalReais - custoEnergiaTotalReais;

    return {
      totalAvesAlojadas,
      totalAvesVivas,
      totalBiomassaKg,
      iepMedioPonderado,
      mortalidadeMediaPct,
      faturamentoTotalReais,
      custoEnergiaTotalReais,
      margemLoteReais,
    };
  }, [galpoes, precoKgVivoFrangoReais, custoEnergiaEletricaPorLote]);

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400">
                <Wind className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Avicultura Climatizada & Frango de Corte 4.0
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono border border-red-500/30">
                    Dark House • IEP Padrão Exportação • Biosseguridade
                  </span>
                </h2>
                <p className="text-sm text-slate-400">
                  Ambiência automatizada, pressão negativa, túnel de vento e apuração do Índice de Eficiência Produtiva (IEP).
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              IEP Geral: {aviculturaMetrics.iepMedioPonderado.toFixed(1)} (Alta Excelência)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: IEP Médio */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Índice de Eficiência (IEP)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            {aviculturaMetrics.iepMedioPonderado.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">pontos</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Meta exportação: &gt; 400 pts (Mortalidade: {aviculturaMetrics.mortalidadeMediaPct.toFixed(1)}%).
          </p>
        </div>

        {/* KPI 2: Biomassa Total */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Biomassa Abatida</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            {(aviculturaMetrics.totalBiomassaKg / 1000).toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">toneladas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {aviculturaMetrics.totalAvesVivas.toLocaleString('pt-BR')} aves em {galpoes.length} galpões climatizados.
          </p>
        </div>

        {/* KPI 3: Faturamento do Lote */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Faturamento Bruto</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            R$ {aviculturaMetrics.faturamentoTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Cotação: R$ {precoKgVivoFrangoReais.toFixed(2)}/kg vivo integrado.
          </p>
        </div>

        {/* KPI 4: Margem Líquida */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Margem Pós-Energia</span>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            R$ {aviculturaMetrics.margemLoteReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-emerald-400">/ ciclo</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Custo elétrico climatização: R$ {aviculturaMetrics.custoEnergiaTotalReais.toLocaleString('pt-BR')}.
          </p>
        </div>
      </div>

      {/* Grid de Aviários e Painel de Ambiência */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Galpões em Operação */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-red-400" />
                Núcleos Aviários & Telemetria Dark House
              </h3>
              <p className="text-xs text-slate-400">
                Monitoramento contínuo de exaustores, placas evaporativas e pesagem automática de aves.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {galpoes.length} Aviários Ativos
            </span>
          </div>

          <div className="space-y-3">
            {galpoes.map((g) => {
              const viabilidade = 100 - g.mortalidadePct;
              const iep = ((viabilidade * g.pesoMedioKg) / (g.idadeDias * g.conversaoAlimentar)) * 100;
              const biomassaTon = (g.avesAlojadas * (viabilidade / 100) * g.pesoMedioKg) / 1000;

              return (
                <div
                  key={g.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-xs font-bold border border-red-500/30">
                        {g.id}
                      </span>
                      <h4 className="text-xs font-bold text-white">{g.nome}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">({g.linhagem})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                      IEP: {iep.toFixed(1)} pts • CA: {g.conversaoAlimentar}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-400">
                    <span>Alojadas: <strong className="text-white">{g.avesAlojadas.toLocaleString('pt-BR')}</strong> ({g.idadeDias} dias)</span>
                    <span>Peso Médio: <strong className="text-cyan-400">{g.pesoMedioKg.toFixed(2)} kg</strong></span>
                    <span>Ambiência: <strong className="text-amber-400">{g.temperaturaAtual}°C</strong> ({g.umidadeRelativaPct}% UR • {g.velocidadeArMs} m/s)</span>
                    <span>Biomassa: <strong className="text-emerald-400">{biomassaTon.toFixed(1)} ton</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Técnico de Ambiência & Biosseguridade */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-red-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes de Ambiência e Biosseguridade Aviária (Embrapa & MAPA):
            </div>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li>
                <strong>Velocidade do Ar no Túnel de Vento:</strong> Para aves acima de 28 dias, a velocidade de ar de 2.2 a 2.5 m/s produz sensação térmica de até -6°C, evitando a mortalidade por choque calórico.
              </li>
              <li>
                <strong>Entalpia de Conforto:</strong> O equilíbrio entre bulbo seco e umidade relativa mantém a entalpia entre 65 e 73 kJ/kg de ar seco, otimizando o consumo de ração e a conversão alimentar.
              </li>
              <li>
                <strong>Biosseguridade Estrita:</strong> Telas antipássaros de malha não superior a 1 polegada, arco de desinfecção veicular e vazio sanitário mínimo de 15 dias entre lotes para prevenção de Influenza Aviária.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Comerciais */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Parâmetros Comerciais & Custos
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Preço do kg Vivo do Frango (R$)</label>
              <input
                type="number"
                step="0.05"
                value={precoKgVivoFrangoReais}
                onChange={(e) => setPrecoKgVivoFrangoReais(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Custo de Energia e Climatização por Aviário (R$)</label>
              <input
                type="number"
                step="1000"
                value={custoEnergiaEletricaPorLote}
                onChange={(e) => setCustoEnergiaEletricaPorLote(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Faturamento dos Lotes:</span>
                <span className="text-amber-400 font-mono font-bold">
                  R$ {aviculturaMetrics.faturamentoTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Custo Total de Energia:</span>
                <span className="text-rose-400 font-mono font-bold">
                  -R$ {aviculturaMetrics.custoEnergiaTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                <span className="text-white">Resultado Operacional:</span>
                <span className="text-emerald-400 font-mono">
                  R$ {aviculturaMetrics.margemLoteReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / ciclo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
