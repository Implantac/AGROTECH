import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  RotateCw,
  Bug,
  Sparkles,
  Layers,
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Info
} from 'lucide-react';

interface AplicacaoFungicida {
  id: string;
  estadioFenologico: string; // V4/V6, R1, R5.1, R5.4
  diasAposSemeadura: number;
  produtoComercial: string;
  sitiosEspecificos: string[]; // ['FRAC 3 (DMI)', 'FRAC 7 (SDHI)']
  multissitioAdicionado: 'MANCOZEB' | 'CLOROTALONIL' | 'COBRE' | 'NENHUM';
  intervaloAposUltimaDias: number;
  pressaoInoculo: 'ALTA' | 'MODERADA' | 'BAIXA';
}

export const FungicidasManejoModule: React.FC = () => {
  const [areaTalhaoHa, setAreaTalhaoHa] = useState<number>(450);
  const [produtividadeMetaScHa, setProdutividadeMetaScHa] = useState<number>(75);
  const [precoSojaSc, setPrecoSojaSc] = useState<number>(130.0);

  // Programa de 4 Aplicações de Fungicidas da Safra
  const [aplicacoes, setAplicacoes] = useState<AplicacaoFungicida[]>([
    {
      id: 'APL-1',
      estadioFenologico: 'V4 - Fechamento de Entrelinha',
      diasAposSemeadura: 35,
      produtoComercial: 'Fox Xpro (Trifloxistrobina + Protioconazol + Bixafen)',
      sitiosEspecificos: ['FRAC 11 (QoI)', 'FRAC 3 (DMI)', 'FRAC 7 (SDHI)'],
      multissitioAdicionado: 'MANCOZEB',
      intervaloAposUltimaDias: 0,
      pressaoInoculo: 'MODERADA',
    },
    {
      id: 'APL-2',
      estadioFenologico: 'R1 - Início do Florescimento',
      diasAposSemeadura: 50,
      produtoComercial: 'Cronnos (Picoxistrobina + Tebuconazol + Mancozeb)',
      sitiosEspecificos: ['FRAC 11 (QoI)', 'FRAC 3 (DMI)'],
      multissitioAdicionado: 'MANCOZEB',
      intervaloAposUltimaDias: 15,
      pressaoInoculo: 'ALTA',
    },
    {
      id: 'APL-3',
      estadioFenologico: 'R5.1 - Início de Formação de Vagens',
      diasAposSemeadura: 65,
      produtoComercial: 'Elatus (Azoxistrobina + Benzovindiflupir)',
      sitiosEspecificos: ['FRAC 11 (QoI)', 'FRAC 7 (SDHI)'],
      multissitioAdicionado: 'CLOROTALONIL',
      intervaloAposUltimaDias: 15,
      pressaoInoculo: 'ALTA',
    },
    {
      id: 'APL-4',
      estadioFenologico: 'R5.4 - Enchimento Pleno de Grãos',
      diasAposSemeadura: 80,
      produtoComercial: 'Aproach Prima (Ciproconazol + Picoxistrobina)',
      sitiosEspecificos: ['FRAC 3 (DMI)', 'FRAC 11 (QoI)'],
      multissitioAdicionado: 'COBRE',
      intervaloAposUltimaDias: 15,
      pressaoInoculo: 'MODERADA',
    },
  ]);

  // Auditoria do Comitê FRAC e Cálculos de Proteção
  const auditMetrics = useMemo(() => {
    // 1. Auditoria de Multissítios em todas as entradas
    const totalAplicacoes = aplicacoes.length;
    const aplicacoesComMultissitio = aplicacoes.filter(
      (a) => a.multissitioAdicionado !== 'NENHUM'
    ).length;
    const conformidadeMultissitioPct = (aplicacoesComMultissitio / totalAplicacoes) * 100;

    // 2. Auditoria de Intervalos (máximo 16 dias entre entradas)
    const aplicacoesComIntervaloEstourado = aplicacoes.filter(
      (a) => a.intervaloAposUltimaDias > 16
    ).length;

    // 3. Diversidade de Grupos FRAC
    const todosGruposUsados = new Set<string>();
    aplicacoes.forEach((a) => {
      a.sitiosEspecificos.forEach((s) => todosGruposUsados.add(s));
    });

    // 4. Eficácia projetada contra Ferrugem Asiática (Phakopsora) e Mancha Alvo (Corynespora)
    let eficaciaControlePct = 82.0;
    if (conformidadeMultissitioPct === 100) eficaciaControlePct += 12.0;
    else if (conformidadeMultissitioPct >= 75) eficaciaControlePct += 6.0;

    if (aplicacoesComIntervaloEstourado === 0) eficaciaControlePct += 4.0;
    else eficaciaControlePct -= aplicacoesComIntervaloEstourado * 6.0;

    eficaciaControlePct = Math.min(98.0, Math.max(45.0, eficaciaControlePct));

    // 5. Risco de Seleção de Resistência (FRAC)
    let riscoResistencia: 'BAIXO_CONTROLADO' | 'MODERADO' | 'ALTO_CRITICO' = 'BAIXO_CONTROLADO';
    if (conformidadeMultissitioPct < 50 || aplicacoesComIntervaloEstourado > 1) {
      riscoResistencia = 'ALTO_CRITICO';
    } else if (conformidadeMultissitioPct < 100 || aplicacoesComIntervaloEstourado === 1) {
      riscoResistencia = 'MODERADO';
    }

    // 6. Benefício Econômico e Sacas Preservadas da Desfolha Prematura
    // Em safras com alta pressão, a ferrugem desfolha e rouba até 30% a 40% da produtividade
    const sacasPreservadasHa = (produtividadeMetaScHa * (eficaciaControlePct / 100)) * 0.28;
    const receitaProtegidaHa = sacasPreservadasHa * precoSojaSc;
    const receitaProtegidaTotal = receitaProtegidaHa * areaTalhaoHa;

    // Custo estimado do manejo de multissítio (R$ 45/ha por entrada x 4 entradas = R$ 180/ha)
    const custoMultissitioHa = aplicacoesComMultissitio * 45.0;
    const beneficioLiquidoHa = receitaProtegidaHa - custoMultissitioHa;
    const roiManejo = custoMultissitioHa > 0 ? receitaProtegidaHa / custoMultissitioHa : 0;

    return {
      conformidadeMultissitioPct,
      aplicacoesComIntervaloEstourado,
      totalGruposFrac: todosGruposUsados.size,
      eficaciaControlePct,
      riscoResistencia,
      sacasPreservadasHa,
      receitaProtegidaHa,
      receitaProtegidaTotal,
      custoMultissitioHa,
      beneficioLiquidoHa,
      roiManejo,
    };
  }, [aplicacoes, produtividadeMetaScHa, precoSojaSc, areaTalhaoHa]);

  // Função para alternar o multissítio de uma aplicação
  const alternarMultissitio = (id: string, novoMultissitio: 'MANCOZEB' | 'CLOROTALONIL' | 'COBRE' | 'NENHUM') => {
    setAplicacoes(
      aplicacoes.map((a) => (a.id === id ? { ...a, multissitioAdicionado: novoMultissitio } : a))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Manejo Antirresistência de Fungicidas & Multissítios Protetores
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                    Diretrizes FRAC Brasil
                  </span>
                </h2>
                <p className="text-sm text-slate-400">
                  Proteção de área foliar contra Ferrugem Asiática e Mancha-Alvo, rotação de sítio-específicos e adição mandatória de multissítios.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border flex items-center gap-1.5 ${
                auditMetrics.riscoResistencia === 'BAIXO_CONTROLADO'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : auditMetrics.riscoResistencia === 'MODERADO'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Risco FRAC: {auditMetrics.riscoResistencia.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Eficácia Projetada */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Eficácia de Controle</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            {auditMetrics.eficaciaControlePct.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Contra Phakopsora pachyrhizi e Mancha Alvo.
          </p>
        </div>

        {/* KPI 2: Sacas Salvas da Desfolha */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Sacas Salvas da Desfolha</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            +{auditMetrics.sacasPreservadasHa.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">sc/ha</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            R$ {auditMetrics.receitaProtegidaHa.toFixed(2)}/ha em grãos preservados.
          </p>
        </div>

        {/* KPI 3: Cobertura Multissítio */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Blindagem Multissítio</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            {auditMetrics.conformidadeMultissitioPct.toFixed(0)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Mancozeb, Clorotalonil ou Cobre associados.
          </p>
        </div>

        {/* KPI 4: ROI Econômico */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Retorno Econômico (ROI)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            {auditMetrics.roiManejo.toFixed(1)}x{' '}
            <span className="text-xs font-normal text-emerald-400">
              (+R$ {auditMetrics.beneficioLiquidoHa.toFixed(2)}/ha)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total protegido: R$ {auditMetrics.receitaProtegidaTotal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Grid Principal: Timeline de Aplicações e Rotação FRAC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Linha do Tempo e Configuração das Aplicações */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Programa Sequencial de Fungicidas da Safra
              </h3>
              <p className="text-xs text-slate-400">
                Auditoria de sítios específicos (FRAC) e inclusão de multissítios em cada entrada.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {aplicacoes.length} Entradas Programadas
            </span>
          </div>

          <div className="space-y-3">
            {aplicacoes.map((app, idx) => (
              <div
                key={app.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30 shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{app.estadioFenologico}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {app.diasAposSemeadura} DAE • {app.produtoComercial}
                      </p>
                    </div>
                  </div>

                  {app.intervaloAposUltimaDias > 0 && (
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border self-start sm:self-auto ${
                        app.intervaloAposUltimaDias <= 16
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      Intervalo: {app.intervaloAposUltimaDias} dias
                    </span>
                  )}
                </div>

                {/* Tags FRAC e Seletor de Multissítio */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-900 text-xs">
                  {/* Sítios Específicos Usados */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">FRAC:</span>
                    {app.sitiosEspecificos.map((frac) => (
                      <span
                        key={frac}
                        className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-[10px] border border-slate-800"
                      >
                        {frac}
                      </span>
                    ))}
                  </div>

                  {/* Seletor de Multissítio Protetor */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">Multissítio:</span>
                    {(['MANCOZEB', 'CLOROTALONIL', 'COBRE', 'NENHUM'] as const).map((ms) => (
                      <button
                        key={ms}
                        onClick={() => alternarMultissitio(app.id, ms)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all border ${
                          app.multissitioAdicionado === ms
                            ? ms === 'NENHUM'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white'
                        }`}
                      >
                        {ms === 'MANCOZEB'
                          ? 'Mancozeb (M03)'
                          : ms === 'CLOROTALONIL'
                          ? 'Clorotalonil (M05)'
                          : ms === 'COBRE'
                          ? 'Cobre (M01)'
                          : 'Sem Protetor'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Técnico FRAC Brasil */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes Oficiais do Comitê de Ação a Resistência a Fungicidas (FRAC):
            </div>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li>
                <strong>Nunca aplique sítio-específicos isolados:</strong> Triazóis (FRAC 3), Estrobilurinas (FRAC 11) e Carboxamidas (FRAC 7) devem ser sempre associados a protetores multissítios.
              </li>
              <li>
                <strong>Intervalo Máximo de 14 a 16 dias:</strong> Em períodos de chuvas frequentes, o residual diminui rapidamente. Atrasos superiores a 18 dias resultam em escape da doença.
              </li>
              <li>
                <strong>Limite de Aplicações por Grupo:</strong> Não realizar mais de 2 aplicações de Carboxamidas (SDHI) na mesma safra para preservar a sensibilidade de mutações F129L.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros do Talhão e Simulador de Proteção */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bug className="w-5 h-5 text-emerald-400" />
            Parâmetros da Lavoura
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-medium block mb-1">
                Produtividade Alvo do Talhão (sc/ha)
              </label>
              <input
                type="number"
                value={produtividadeMetaScHa}
                onChange={(e) => setProdutividadeMetaScHa(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">
                Área do Talhão Auditado (ha)
              </label>
              <input
                type="number"
                value={areaTalhaoHa}
                onChange={(e) => setAreaTalhaoHa(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">
                Preço da Soja Comercial (R$/saca)
              </label>
              <input
                type="number"
                value={precoSojaSc}
                onChange={(e) => setPrecoSojaSc(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Quadro Resumo Econômico */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Investimento Multissítio:</span>
                <span className="text-slate-200 font-mono">
                  R$ {auditMetrics.custoMultissitioHa.toFixed(2)}/ha
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Receita Bruta Protegida:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  +R$ {auditMetrics.receitaProtegidaHa.toFixed(2)}/ha
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                <span className="text-white">Lucro Líquido Preservado:</span>
                <span className="text-cyan-400 font-mono">
                  +R$ {auditMetrics.beneficioLiquidoHa.toFixed(2)}/ha
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
