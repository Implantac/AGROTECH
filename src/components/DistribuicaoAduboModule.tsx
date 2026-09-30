import React, { useState, useMemo } from 'react';
import {
  Tractor,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  TrendingDown,
  Info,
  RotateCcw,
  Zap
} from 'lucide-react';

interface BandejaAmostra {
  id: number;
  posicaoMetros: number; // Distância do centro do distribuidor em metros (-18m a +18m)
  massaColetadaG: number;
}

export const DistribuicaoAduboModule: React.FC = () => {
  // Parâmetros de Aplicação
  const [doseAlvoKgHa, setDoseAlvoKgHa] = useState<number>(220); // ex: 220 kg/ha KCl ou Ureia
  const [larguraFaixaMetros, setLarguraFaixaMetros] = useState<number>(36); // 36 metros de faixa de trabalho
  const [velocidadeOperacaoKmH, setVelocidadeOperacaoKmH] = useState<number>(18); // 18 km/h com autopropelido
  const [tipoFertilizante, setTipoFertilizante] = useState<'KCL' | 'UREIA' | 'MAP_NPK' | 'CALCARIO'>('KCL');
  const [modeloDistribuidor, setModeloDistribuidor] = useState<string>('Autopropelido Duplo Disco Centrífugo (Hércules 6.0)');
  const [precoSojaSc, setPrecoSojaSc] = useState<number>(130.0);
  const [areaTalhaoHa, setAreaTalhaoHa] = useState<number>(450);

  // Amostras de bandejas de calibração transversal (20 bandejas de -18m a +18m)
  const [amostrasBandejas, setAmostrasBandejas] = useState<BandejaAmostra[]>([
    { id: 1, posicaoMetros: -18, massaColetadaG: 46 },
    { id: 2, posicaoMetros: -16, massaColetadaG: 49 },
    { id: 3, posicaoMetros: -14, massaColetadaG: 51 },
    { id: 4, posicaoMetros: -12, massaColetadaG: 52 },
    { id: 5, posicaoMetros: -10, massaColetadaG: 50 },
    { id: 6, posicaoMetros: -8, massaColetadaG: 53 },
    { id: 7, posicaoMetros: -6, massaColetadaG: 51 },
    { id: 8, posicaoMetros: -4, massaColetadaG: 52 },
    { id: 9, posicaoMetros: -2, massaColetadaG: 50 },
    { id: 10, posicaoMetros: 0, massaColetadaG: 54 },
    { id: 11, posicaoMetros: 2, massaColetadaG: 51 },
    { id: 12, posicaoMetros: 4, massaColetadaG: 52 },
    { id: 13, posicaoMetros: 6, massaColetadaG: 49 },
    { id: 14, posicaoMetros: 8, massaColetadaG: 53 },
    { id: 15, posicaoMetros: 10, massaColetadaG: 51 },
    { id: 16, posicaoMetros: 12, massaColetadaG: 50 },
    { id: 17, posicaoMetros: 14, massaColetadaG: 48 },
    { id: 18, posicaoMetros: 16, massaColetadaG: 47 },
    { id: 19, posicaoMetros: 18, massaColetadaG: 44 },
    { id: 20, posicaoMetros: 20, massaColetadaG: 42 },
  ]);

  // Cálculos Técnicos do Motor de Calibração
  const metrics = useMemo(() => {
    // 1. Vazão requerida nas comportas (kg/min)
    // Vazão = (Dose * Largura * Velocidade) / 600
    const vazaoRequeridaKgMin = (doseAlvoKgHa * larguraFaixaMetros * velocidadeOperacaoKmH) / 600;

    // 2. Coeficiente de Variação Transversal (CV%)
    const n = amostrasBandejas.length;
    const somaMassas = amostrasBandejas.reduce((acc, b) => acc + b.massaColetadaG, 0);
    const mediaMassaG = somaMassas / n;

    const somaQuadradosDesvios = amostrasBandejas.reduce(
      (acc, b) => acc + Math.pow(b.massaColetadaG - mediaMassaG, 2),
      0
    );
    const variancia = somaQuadradosDesvios / (n - 1);
    const desvioPadrao = Math.sqrt(variancia);
    const cvPct = (desvioPadrao / mediaMassaG) * 100;

    // 3. Classificação Técnica segundo Norma ASAE S341 / ABNT
    let classificacaoUniformidade: 'EXCELENTE' | 'ACEITAVEL' | 'REGULAR_ALERTA' | 'CRITICO_ZEBRADO' = 'EXCELENTE';
    let riscoZebrado = false;

    if (cvPct <= 12.0) {
      classificacaoUniformidade = 'EXCELENTE';
    } else if (cvPct <= 18.0) {
      classificacaoUniformidade = 'ACEITAVEL';
    } else if (cvPct <= 25.0) {
      classificacaoUniformidade = 'REGULAR_ALERTA';
      riscoZebrado = true;
    } else {
      classificacaoUniformidade = 'CRITICO_ZEBRADO';
      riscoZebrado = true;
    }

    // 4. Perda estimada por desuniformidade na produtividade (sc/ha)
    // Se CV > 12%, a perda média estimada pela literatura agronômica é de aproximadamente 0.22 sc/ha por ponto percentual de CV excedente
    const perdaProdutividadeScHa = cvPct > 12.0 ? (cvPct - 12.0) * 0.22 : 0;
    const prejuizoPorHa = perdaProdutividadeScHa * precoSojaSc;
    const prejuizoTotalTalhao = prejuizoPorHa * areaTalhaoHa;

    // Total de adubo aplicado no talhão
    const aduboTotalToneladas = (doseAlvoKgHa * areaTalhaoHa) / 1000;

    return {
      vazaoRequeridaKgMin,
      mediaMassaG,
      desvioPadrao,
      cvPct,
      classificacaoUniformidade,
      riscoZebrado,
      perdaProdutividadeScHa,
      prejuizoPorHa,
      prejuizoTotalTalhao,
      aduboTotalToneladas,
    };
  }, [doseAlvoKgHa, larguraFaixaMetros, velocidadeOperacaoKmH, amostrasBandejas, precoSojaSc, areaTalhaoHa]);

  // Função para simular desregulagem ou recalibração das palhetas
  const aplicarPerfilSimulado = (tipo: 'PERFEITO' | 'DESREGULADO_CENTRO' | 'VENTO_LATERAL') => {
    if (tipo === 'PERFEITO') {
      setAmostrasBandejas(
        amostrasBandejas.map((b) => ({
          ...b,
          massaColetadaG: Math.round(50 + (Math.random() * 4 - 2)),
        }))
      );
    } else if (tipo === 'DESREGULADO_CENTRO') {
      setAmostrasBandejas(
        amostrasBandejas.map((b) => {
          const distAbs = Math.abs(b.posicaoMetros);
          // Concentração no centro e queda nas bordas
          const massa = Math.round(75 - distAbs * 1.8 + (Math.random() * 4 - 2));
          return { ...b, massaColetadaG: Math.max(20, massa) };
        })
      );
    } else if (tipo === 'VENTO_LATERAL') {
      setAmostrasBandejas(
        amostrasBandejas.map((b) => {
          // Desvio para um dos lados
          const massa = Math.round(50 + b.posicaoMetros * 1.4 + (Math.random() * 4 - 2));
          return { ...b, massaColetadaG: Math.max(15, massa) };
        })
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <Tractor className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Calibração de Adubação a Lanço & Coeficiente de Variação (CV%)
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                    ASAE S341 • ABNT
                  </span>
                </h2>
                <p className="text-sm text-slate-400">
                  Auditoria de uniformidade transversal, regulagem de aletas e eliminação do efeito zebrado na lavoura.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => aplicarPerfilSimulado('PERFEITO')}
              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Perfil Calibrado (&lt;10% CV)
            </button>
            <button
              onClick={() => aplicarPerfilSimulado('DESREGULADO_CENTRO')}
              className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Simular Efeito Zebrado
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: CV% Transversal */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Coeficiente Variação (CV%)</span>
            <Sliders className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono flex items-baseline gap-2">
            <span
              className={
                metrics.cvPct <= 12
                  ? 'text-emerald-400'
                  : metrics.cvPct <= 18
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }
            >
              {metrics.cvPct.toFixed(1)}%
            </span>
            <span className="text-xs font-normal text-slate-400">
              {metrics.cvPct <= 12 ? 'Excelente' : metrics.cvPct <= 18 ? 'Aceitável' : 'Crítico'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Meta agronômica: CV &lt; 12.0% para adubos formulados.
          </p>
        </div>

        {/* KPI 2: Vazão Requerida */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Vazão Requerida</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            {metrics.vazaoRequeridaKgMin.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">kg/min</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {doseAlvoKgHa} kg/ha a {velocidadeOperacaoKmH} km/h em {larguraFaixaMetros}m.
          </p>
        </div>

        {/* KPI 3: Quebra Estimada por Zebrado */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Perda Estimada</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-rose-400">
            {metrics.perdaProdutividadeScHa > 0
              ? `${metrics.perdaProdutividadeScHa.toFixed(1)} sc/ha`
              : '0.0 sc/ha'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {metrics.perdaProdutividadeScHa > 0
              ? `Impacto: R$ ${metrics.prejuizoPorHa.toFixed(2)}/ha em manchas cloróticas`
              : 'Sem perdas por desuniformidade'}
          </p>
        </div>

        {/* KPI 4: Volume no Talhão */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Adubo Total no Talhão</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            {metrics.aduboTotalToneladas.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">t ({areaTalhaoHa} ha)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {metrics.prejuizoTotalTalhao > 0
              ? `Risco total: -R$ ${metrics.prejuizoTotalTalhao.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
              : 'Operação 100% blindada contra estresse nutricional'}
          </p>
        </div>
      </div>

      {/* Grid Principal: Gráfico do Perfil Transversal e Painel de Calibração */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Gráfico de Barras Transversal das Bandejas Coletoras */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                Perfil de Deposição Transversal (Faixa de {larguraFaixaMetros} metros)
              </h3>
              <p className="text-xs text-slate-400">
                Massa coletada em cada bandeja graduada ao longo do vão de trabalho do distribuidor.
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-bold font-mono rounded-lg border ${
                metrics.cvPct <= 12
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : metrics.cvPct <= 18
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              }`}
            >
              Status: {metrics.classificacaoUniformidade.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Gráfico Visual de Barras com Amostras */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="h-56 flex items-end justify-between gap-1.5 pt-6 pb-2">
              {amostrasBandejas.map((b) => {
                const alturaPct = Math.min(100, (b.massaColetadaG / 80) * 100);
                const desvioDaMedia = Math.abs(b.massaColetadaG - metrics.mediaMassaG);
                const isDesvioCritico = desvioDaMedia > 8;

                return (
                  <div
                    key={b.id}
                    className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
                  >
                    {/* Tooltip Hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[10px] text-white px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20 border border-slate-700">
                      Ponto {b.posicaoMetros}m: {b.massaColetadaG}g
                    </div>

                    <div
                      style={{ height: `${alturaPct}%` }}
                      className={`w-full rounded-t transition-all ${
                        isDesvioCritico
                          ? 'bg-rose-500/80 group-hover:bg-rose-400'
                          : 'bg-amber-500/70 group-hover:bg-amber-400'
                      }`}
                    />
                    <span className="text-[9px] font-mono text-slate-500 truncate w-full text-center">
                      {b.posicaoMetros}m
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Linha de Referência da Média */}
            <div className="border-t border-dashed border-amber-400/50 pt-2 flex justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-amber-400 inline-block" />
                Média Amostral: {metrics.mediaMassaG.toFixed(1)} g / bandeja
              </span>
              <span>Largura Efetiva: -{larguraFaixaMetros / 2}m a +{larguraFaixaMetros / 2}m</span>
            </div>
          </div>

          {/* Dicas de Regulagem Mecânica */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Recomendações de Regulagem de Aletas e Ponto de Queda:
            </div>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              {metrics.cvPct > 18 ? (
                <>
                  <li className="text-rose-300">
                    <strong>Risco de Efeito Zebrado:</strong> Ajuste o ângulo das palhetas nos discos centrífugos e desloque o funil de queda do adubo para corrigir a concentração central.
                  </li>
                  <li>
                    Verifique o desgaste das aletas em aço inox e a granulometria do fertilizante (grânulos desuniformes ou pó provocam segregação mecânica).
                  </li>
                </>
              ) : (
                <>
                  <li className="text-emerald-300">
                    <strong>Excelente Distribuição:</strong> O perfil trapezoidal de sobreposição garante distribuição homogênea sem faixas de subdosagem ou fitotoxicidade.
                  </li>
                  <li>
                    Mantenha a rotação da TDP/motores hidráulicos dos discos estável em 900–950 RPM durante toda a operação.
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros de Simulação e Configuração de Máquina */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Tractor className="w-5 h-5 text-amber-400" />
            Parâmetros da Operação
          </h3>

          <div className="space-y-4 text-xs">
            {/* Modelo do Distribuidor */}
            <div>
              <label className="text-slate-400 font-medium block mb-1">Equipamento Distribuidor</label>
              <select
                value={modeloDistribuidor}
                onChange={(e) => setModeloDistribuidor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Autopropelido Duplo Disco Centrífugo (Hércules 6.0)">
                  Autopropelido Duplo Disco (Hércules 6.0 / Tellus 10.000)
                </option>
                <option value="Distribuidor de Arrasto com Balança Dinâmica">
                  Distribuidor de Arrasto com Balança Dinâmica (Kuhn Accura)
                </option>
                <option value="Espalhador Pneumático de Barras (Air Assist)">
                  Espalhador Pneumático de Barras de 30m
                </option>
              </select>
            </div>

            {/* Tipo de Fertilizante */}
            <div>
              <label className="text-slate-400 font-medium block mb-1">Insumo Aplicado</label>
              <div className="grid grid-cols-2 gap-2">
                {(['KCL', 'UREIA', 'MAP_NPK', 'CALCARIO'] as const).map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setTipoFertilizante(tipo)}
                    className={`py-1.5 px-2 rounded-lg font-bold text-xs border transition-all ${
                      tipoFertilizante === tipo
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {tipo === 'KCL'
                      ? 'Cloreto (KCl)'
                      : tipo === 'UREIA'
                      ? 'Ureia 46% N'
                      : tipo === 'MAP_NPK'
                      ? 'MAP / Formulados'
                      : 'Calcário / Gesso'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dose Alvo (kg/ha) */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 font-medium">Dose Desejada (kg/ha)</span>
                <span className="text-amber-400 font-mono font-bold">{doseAlvoKgHa} kg/ha</span>
              </div>
              <input
                type="range"
                min="50"
                max="600"
                step="10"
                value={doseAlvoKgHa}
                onChange={(e) => setDoseAlvoKgHa(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Largura de Faixa (m) */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 font-medium">Largura de Faixa (Passada)</span>
                <span className="text-amber-400 font-mono font-bold">{larguraFaixaMetros} metros</span>
              </div>
              <input
                type="range"
                min="18"
                max="42"
                step="2"
                value={larguraFaixaMetros}
                onChange={(e) => setLarguraFaixaMetros(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Velocidade de Operação (km/h) */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 font-medium">Velocidade de Trabalho</span>
                <span className="text-amber-400 font-mono font-bold">{velocidadeOperacaoKmH} km/h</span>
              </div>
              <input
                type="range"
                min="8"
                max="25"
                step="1"
                value={velocidadeOperacaoKmH}
                onChange={(e) => setVelocidadeOperacaoKmH(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Área do Talhão e Preço da Soja */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-slate-400 block mb-1">Área do Talhão (ha)</label>
                <input
                  type="number"
                  value={areaTalhaoHa}
                  onChange={(e) => setAreaTalhaoHa(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Preço Soja (R$/sc)</label>
                <input
                  type="number"
                  value={precoSojaSc}
                  onChange={(e) => setPrecoSojaSc(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
