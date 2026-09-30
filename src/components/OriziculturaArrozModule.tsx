import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Waves,
  ShieldCheck,
  TrendingUp,
  Coins,
  Layers,
  Award,
  Droplets,
  Leaf,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface QuadroArroz {
  id: string;
  nome: string;
  cultivar: string;
  areaHa: number;
  manejoIrrigacao: 'AWD_INTERMITENTE' | 'INUNDACAO_CONTINUA';
  laminaAguaCm: number;
  produtividadeScHa: number; // sc 50kg
  rendimentoInteirosPct: number; // Renda de engenho
  metanoEvitadoKgHa: number;
}

export const OriziculturaArrozModule: React.FC = () => {
  const [quadros, setQuadros] = useState<QuadroArroz[]>([
    {
      id: 'QDR-01',
      nome: 'Quadro 1 - Várzea Sul (Nivelado a Laser)',
      cultivar: 'IRGA 424 RI (Clearfield)',
      areaHa: 75,
      manejoIrrigacao: 'AWD_INTERMITENTE',
      laminaAguaCm: 6.0,
      produtividadeScHa: 175,
      rendimentoInteirosPct: 63.5,
      metanoEvitadoKgHa: 580,
    },
    {
      id: 'QDR-02',
      nome: 'Quadro 2 - Baixada Central (AWD Monitorado)',
      cultivar: 'BRS Pampeira (Alto Potencial)',
      areaHa: 65,
      manejoIrrigacao: 'AWD_INTERMITENTE',
      laminaAguaCm: 5.5,
      produtividadeScHa: 168,
      rendimentoInteirosPct: 62.0,
      metanoEvitadoKgHa: 540,
    },
    {
      id: 'QDR-03',
      nome: 'Quadro 3 - Taipa Tradicional',
      cultivar: 'Guri INTA CL',
      areaHa: 60,
      manejoIrrigacao: 'INUNDACAO_CONTINUA',
      laminaAguaCm: 12.0,
      produtividadeScHa: 160,
      rendimentoInteirosPct: 59.5,
      metanoEvitadoKgHa: 0,
    },
  ]);

  const [precoSaca50kgReais, setPrecoSaca50kgReais] = useState<number>(118.0); // R$/sc 50kg arroz em casca
  const [custoBombeamentoAguaHa, setCustoBombeamentoAguaHa] = useState<number>(1450); // R$/ha diesel/eletricidade de bombeamento

  // Cálculos Consolidados da Lavoura de Arroz
  const oriziMetrics = useMemo(() => {
    const areaTotalHa = quadros.reduce((acc, q) => acc + q.areaHa, 0);

    let producaoTotalSacas = 0;
    let somaPonderadaInteiros = 0;
    let totalMetanoEvitadoKg = 0;

    quadros.forEach((q) => {
      const sacasQuadro = q.produtividadeScHa * q.areaHa;
      producaoTotalSacas += sacasQuadro;
      somaPonderadaInteiros += q.rendimentoInteirosPct * sacasQuadro;
      totalMetanoEvitadoKg += q.metanoEvitadoKgHa * q.areaHa;
    });

    const rendimentoMedioInteiros = producaoTotalSacas > 0 ? somaPonderadaInteiros / producaoTotalSacas : 0;
    const produtividadeMediaScHa = areaTotalHa > 0 ? producaoTotalSacas / areaTotalHa : 0;

    const faturamentoBrutoReais = producaoTotalSacas * precoSaca50kgReais;
    const faturamentoPorHaReais = areaTotalHa > 0 ? faturamentoBrutoReais / areaTotalHa : 0;

    // Economia hídrica média do AWD
    const quadrosAwd = quadros.filter((q) => q.manejoIrrigacao === 'AWD_INTERMITENTE');
    const areaAwdHa = quadrosAwd.reduce((acc, q) => acc + q.areaHa, 0);
    const economiaAguaM3Total = areaAwdHa * 3360; // 3.360 m³/ha economizados
    const carbonoEvitadoTon = totalMetanoEvitadoKg / 1000;

    return {
      areaTotalHa,
      producaoTotalSacas,
      produtividadeMediaScHa,
      rendimentoMedioInteiros,
      faturamentoBrutoReais,
      faturamentoPorHaReais,
      areaAwdHa,
      economiaAguaM3Total,
      carbonoEvitadoTon,
    };
  }, [quadros, precoSaca50kgReais, custoBombeamentoAguaHa]);

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
                <Waves className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Orizicultura de Precisão & Arroz Irrigado
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                    AWD • Lâmina Intermitente • Descarbonização CH₄
                  </span>
                </h2>
                <p className="text-sm text-slate-400">
                  Manejo de água por taipa nivelada a laser, redução de metano anaeróbico e controle de renda de engenho (% grãos inteiros).
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              {oriziMetrics.carbonoEvitadoTon.toFixed(1)} t CO₂eq abatidas (AWD)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Produtividade Média */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Produtividade Média</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            {oriziMetrics.produtividadeMediaScHa.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">sc/ha (50 kg)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Produção total de {oriziMetrics.producaoTotalSacas.toLocaleString('pt-BR')} sacas em {oriziMetrics.areaTotalHa} ha.
          </p>
        </div>

        {/* KPI 2: Renda de Engenho */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Grãos Inteiros (Engenho)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            {oriziMetrics.rendimentoMedioInteiros.toFixed(1)}%{' '}
            <span className="text-xs font-normal text-slate-400">(Tipo 1 Nobre)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Qualidade industrial com quebra reduzida na colheita e secagem.
          </p>
        </div>

        {/* KPI 3: Faturamento Bruto */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Faturamento da Safra</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            R$ {oriziMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Cotação: R$ {precoSaca50kgReais.toFixed(2)}/sc de 50 kg em casca.
          </p>
        </div>

        {/* KPI 4: Economia Hídrica AWD */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Água Poupada (AWD)</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-blue-400">
            {(oriziMetrics.economiaAguaM3Total / 1000).toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-400">mil m³</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Em {oriziMetrics.areaAwdHa} ha sob alternância hídrica inteligente.
          </p>
        </div>
      </div>

      {/* Grid de Quadros e Parâmetros Comerciais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Quadros e Taipas */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Quadros de Irrigação & Nível de Lâmina d&apos;Água
              </h3>
              <p className="text-xs text-slate-400">
                Monitoramento por tubos piezométricos perfurados e telemetria de nível em tempo real.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {quadros.length} Quadros Monitorados
            </span>
          </div>

          <div className="space-y-3">
            {quadros.map((q) => {
              const sacasQuadro = q.produtividadeScHa * q.areaHa;
              const faturamentoQuadro = sacasQuadro * precoSaca50kgReais;

              return (
                <div
                  key={q.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                        {q.id}
                      </span>
                      <h4 className="text-xs font-bold text-white">{q.nome}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">({q.cultivar})</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        q.manejoIrrigacao === 'AWD_INTERMITENTE'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {q.manejoIrrigacao === 'AWD_INTERMITENTE' ? 'AWD Intermitente' : 'Inundação Contínua'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-400">
                    <span>Área: <strong className="text-white">{q.areaHa} ha</strong></span>
                    <span>Lâmina: <strong className="text-cyan-400">{q.laminaAguaCm} cm</strong></span>
                    <span>Inteiros: <strong className="text-emerald-400">{q.rendimentoInteirosPct}%</strong></span>
                    <span>Sacas: <strong className="text-white">{sacasQuadro.toLocaleString('pt-BR')} sc</strong></span>
                    <span>Faturamento: <strong className="text-amber-400">R$ {faturamentoQuadro.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Técnico de Boas Práticas Orizícolas */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes Técnicas de Orizicultura & Metodologia AWD (IRGA & Embrapa Arroz):
            </div>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li>
                <strong>Nivelamento de Precisão a Laser:</strong> A uniformização topográfica do solo reduz o volume de água em até 40% e elimina bolsões profundos que sufocam o perfilhamento.
              </li>
              <li>
                <strong>Tecnologia AWD (Molhamento e Secagem):</strong> Permitir que a lâmina desça até 15 cm abaixo da superfície antes de reinundar oxigena a rizosfera, cortando drasticamente a metanogênese anaeróbica.
              </li>
              <li>
                <strong>Créditos de Carbono em Arroz:</strong> O método AWD qualifica a propriedade para o mercado de carbono do Artigo 6 do Acordo de Paris, gerando ativos ambientais monetizáveis.
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
              <label className="text-slate-400 font-medium block mb-1">Preço da Saca de Arroz em Casca (R$/50kg)</label>
              <input
                type="number"
                step="0.50"
                value={precoSaca50kgReais}
                onChange={(e) => setPrecoSaca50kgReais(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Custo de Bombeamento e Energia (R$/ha)</label>
              <input
                type="number"
                step="100"
                value={custoBombeamentoAguaHa}
                onChange={(e) => setCustoBombeamentoAguaHa(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Faturamento da Safra:</span>
                <span className="text-amber-400 font-mono font-bold">
                  R$ {oriziMetrics.faturamentoBrutoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Faturamento por Hectare:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  R$ {oriziMetrics.faturamentoPorHaReais.toFixed(2)} / ha
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                <span className="text-white">Créditos de Carbono:</span>
                <span className="text-cyan-400 font-mono">
                  +{oriziMetrics.carbonoEvitadoTon.toFixed(1)} t CO₂eq
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
