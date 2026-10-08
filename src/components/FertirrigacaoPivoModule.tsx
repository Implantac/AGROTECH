import React, { useState, useMemo } from 'react';
import {
  Droplets,
  RotateCw,
  Gauge,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  Sparkles,
  Info
} from 'lucide-react';

interface PivoCentralInfo {
  id: string;
  nome: string;
  areaHa: number;
  cultura: string;
  vazaoAguaM3H: number;
  tempoRotacaoHoras: number;
  pressaoTrabalhoBar: number;
}

export const FertirrigacaoPivoModule: React.FC = () => {
  // Parâmetros do Pivô Selecionado
  const [pivos, setPivos] = useState<PivoCentralInfo[]>([
    {
      id: 'PIVO-01',
      nome: 'Pivô 01 • Sede Central',
      areaHa: 130,
      cultura: 'Milho Safrinha (V6)',
      vazaoAguaM3H: 390,
      tempoRotacaoHoras: 21,
      pressaoTrabalhoBar: 3.2,
    },
    {
      id: 'PIVO-02',
      nome: 'Pivô 02 • Represa Norte',
      areaHa: 95,
      cultura: 'Feijão Irrigado (R1)',
      vazaoAguaM3H: 285,
      tempoRotacaoHoras: 18,
      pressaoTrabalhoBar: 3.0,
    },
  ]);

  const [pivoSelecionadoId, setPivoSelecionadoId] = useState<string>('PIVO-01');
  const [fertilizanteLiquido, setFertilizanteLiquido] = useState<'UAN_32' | 'KCL_SOLUVEL' | 'ATS_ENXOFRE' | 'ACIDO_FOSFORICO'>('UAN_32');
  const [doseAlvoKgHa, setDoseAlvoKgHa] = useState<number>(35); // 35 kg N/ha
  const [ceAguaPocoDsM, setCeAguaPocoDsM] = useState<number>(0.28); // 0.28 dS/m da água bruta
  const [laminaAguaMm, setLaminaAguaMm] = useState<number>(8.0); // 8 mm de lâmina
  const [custoAduboReaisKg, setCustoAduboReaisKg] = useState<number>(4.80);

  const pivoAtivo = useMemo(
    () => pivos.find((p) => p.id === pivoSelecionadoId) || pivos[0],
    [pivos, pivoSelecionadoId]
  );

  // Parâmetros Físico-Químicos do Insumo
  const dadosNutriente = useMemo(() => {
    switch (fertilizanteLiquido) {
      case 'UAN_32':
        return {
          nome: 'UAN 32% (Nitrato de Amônio + Ureia)',
          teorNutrientePct: 32.0,
          densidadeKgL: 1.32,
          kgNutrientePorLitro: 0.422, // 1.32 * 0.32
          fatorCe: 12.0,
        };
      case 'KCL_SOLUVEL':
        return {
          nome: 'Cloreto de Potássio Solúvel 60% K₂O',
          teorNutrientePct: 60.0,
          densidadeKgL: 1.18,
          kgNutrientePorLitro: 0.354,
          fatorCe: 14.5,
        };
      case 'ATS_ENXOFRE':
        return {
          nome: 'Tiosulfato de Amônio (12% N + 26% S)',
          teorNutrientePct: 26.0,
          densidadeKgL: 1.33,
          kgNutrientePorLitro: 0.345,
          fatorCe: 11.2,
        };
      case 'ACIDO_FOSFORICO':
        return {
          nome: 'Ácido Fosfórico Purificado (52% P₂O₅)',
          teorNutrientePct: 52.0,
          densidadeKgL: 1.58,
          kgNutrientePorLitro: 0.821,
          fatorCe: 9.8,
        };
    }
  }, [fertilizanteLiquido]);

  // Cálculos de Calibração da Bomba Injetora e Salinidade da Calda
  const fertiMetrics = useMemo(() => {
    // 1. Volume total de calda requerido (L)
    const volumeTotalSolucaoLitros =
      (pivoAtivo.areaHa * doseAlvoKgHa) / dadosNutriente.kgNutrientePorLitro;

    // 2. Taxa de injeção da bomba dosadora (L/h)
    const taxaInjecaoBombaLH = volumeTotalSolucaoLitros / pivoAtivo.tempoRotacaoHoras;

    // 3. Concentração de calda na lâmina d'água (%)
    const vazaoAguaLH = pivoAtivo.vazaoAguaM3H * 1000;
    const concentracaoPct = (taxaInjecaoBombaLH / vazaoAguaLH) * 100;

    // 4. Condutividade Elétrica estimada da calda (dS/m)
    const ceCaldaDsM = ceAguaPocoDsM + (concentracaoPct * dadosNutriente.fatorCe);

    // 5. Diagnóstico de Risco de Queima Foliar / Salinidade Osmótica
    let statusSalinidade: 'SEGURO_EXCELENTE' | 'MODERADO_ATENCAO' | 'CRITICO_QUEIMA_FOLIAR' = 'SEGURO_EXCELENTE';
    if (ceCaldaDsM > 2.0) {
      statusSalinidade = 'CRITICO_QUEIMA_FOLIAR';
    } else if (ceCaldaDsM > 1.6) {
      statusSalinidade = 'MODERADO_ATENCAO';
    }

    // 6. Custo financeiro total da aplicação
    const custoTotalReais = (pivoAtivo.areaHa * doseAlvoKgHa) * custoAduboReaisKg;
    const custoPorHa = doseAlvoKgHa * custoAduboReaisKg;

    // 7. Economia de Tratores (ao não entrar com trator na lavoura fechada em V6/R1)
    // Economiza 4.5 L diesel/ha + desgaste de pneus e amassamento de plantas (estimado em 2.2 sc/ha preservadas)
    const amassamentoEvitadoSacas = pivoAtivo.areaHa * 2.2;
    const economiaAmassamentoReais = amassamentoEvitadoSacas * 130.0;

    return {
      volumeTotalSolucaoLitros,
      taxaInjecaoBombaLH,
      concentracaoPct,
      ceCaldaDsM,
      statusSalinidade,
      custoTotalReais,
      custoPorHa,
      amassamentoEvitadoSacas,
      economiaAmassamentoReais,
    };
  }, [pivoAtivo, doseAlvoKgHa, dadosNutriente, ceAguaPocoDsM, custoAduboReaisKg]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-sky-700">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Fertirrigação & Injeção em Pivô Central
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-sky-800 font-mono border border-cyan-500/30">
                    Quimigação 4.0
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Calibração da bomba injetora (L/h), condutividade elétrica da calda (CE) e eliminação do amassamento de plantas.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border flex items-center gap-1.5 ${
                fertiMetrics.statusSalinidade === 'SEGURO_EXCELENTE'
                  ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/40'
                  : fertiMetrics.statusSalinidade === 'MODERADO_ATENCAO'
                  ? 'bg-amber-500/20 text-amber-800 border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              }`}
            >
              CE: {fertiMetrics.statusSalinidade.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Taxa de Injeção da Bomba */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Taxa Injeção Bomba</span>
            <Gauge className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-sky-700">
            {fertiMetrics.taxaInjecaoBombaLH.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-600">L/h</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Volume total: {fertiMetrics.volumeTotalSolucaoLitros.toFixed(0)} L em {pivoAtivo.tempoRotacaoHoras}h.
          </p>
        </div>

        {/* KPI 2: Condutividade Elétrica da Calda */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Condutividade (CE Calda)</span>
            <Zap className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono flex items-baseline gap-2">
            <span
              className={
                fertiMetrics.ceCaldaDsM <= 1.6
                  ? 'text-emerald-700'
                  : fertiMetrics.ceCaldaDsM <= 2.0
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }
            >
              {fertiMetrics.ceCaldaDsM.toFixed(2)}
            </span>
            <span className="text-xs font-normal text-slate-600">dS/m</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Meta segura: &lt; 1.80 dS/m (sem risco de queima).
          </p>
        </div>

        {/* KPI 3: Amassamento Evitado */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Amassamento Evitado</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-700">
            +{fertiMetrics.amassamentoEvitadoSacas.toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-600">sacas (+2.2 sc/ha)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Economia: +R$ {fertiMetrics.economiaAmassamentoReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} sem trator.
          </p>
        </div>

        {/* KPI 4: Investimento Nutricional */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Custo da Operação</span>
            <Droplets className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-slate-800">
            R$ {fertiMetrics.custoTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            R$ {fertiMetrics.custoPorHa.toFixed(2)}/ha ({doseAlvoKgHa} kg/ha).
          </p>
        </div>
      </div>

      {/* Grid Principal: Seletor de Pivô e Parâmetros de Injeção */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Lista de Pivôs e Detalhes Hidráulicos */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-sky-700" />
                Pivôs Centrais Cadastrados & Regime Hidráulico
              </h3>
              <p className="text-xs text-slate-600">
                Selecione o equipamento para sincronizar a taxa de injeção da bomba com o tempo de giro.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              {pivos.length} Pivôs Conectados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pivos.map((p) => {
              const isSelected = p.id === pivoSelecionadoId;
              return (
                <div
                  key={p.id}
                  onClick={() => setPivoSelecionadoId(p.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-900">{p.nome}</h4>
                    <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-800 text-[10px] font-mono">
                      {p.cultura}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
                    <div>Área: <span className="text-white">{p.areaHa} ha</span></div>
                    <div>Vazão: <span className="text-white">{p.vazaoAguaM3H} m³/h</span></div>
                    <div>Giro: <span className="text-white">{p.tempoRotacaoHoras}h (100%)</span></div>
                    <div>Pressão: <span className="text-white">{p.pressaoTrabalhoBar} bar</span></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner de Boas Práticas Agronômicas de Quimigação */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-sky-700 font-semibold">
              <Sparkles className="w-4 h-4" />
              Recomendações Técnicas de Fertirrigação:
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>
                <strong>Tempo de Limpeza da Tubulação (Flushing):</strong> Deixe o pivô funcionar apenas com água pura por 20 a 30 minutos após o término da injeção do adubo para purgar resíduos dos bocais.
              </li>
              <li>
                <strong>Válvula de Retenção e Anti-Sifão:</strong> Obrigatória na tubulação para impedir contaminação do lençol freático e do poço artesiano caso a bomba pare inesperadamente.
              </li>
              <li>
                <strong>Compatibilidade Química:</strong> Nunca misture fontes ricas em Fósforo (Ácido Fosfórico/MAP) com Fontes Ricas em Cálcio ou Magnésio no mesmo tanque, sob risco de entupimento imediato de aspersores.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros do Insumo e Bomba Injetora */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-700" />
            Configuração da Calda
          </h3>

          <div className="space-y-4 text-xs">
            {/* Seletor de Fertilizante Líquido */}
            <div>
              <label className="text-slate-600 font-medium block mb-1">Fonte Solúvel / Líquida</label>
              <select
                value={fertilizanteLiquido}
                onChange={(e) => setFertilizanteLiquido(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="UAN_32">UAN 32% (Nitrato + Ureia Líquida)</option>
                <option value="KCL_SOLUVEL">KCl Branco Solúvel 60%</option>
                <option value="ATS_ENXOFRE">Tiosulfato de Amônio (ATS)</option>
                <option value="ACIDO_FOSFORICO">Ácido Fosfórico Purificado</option>
              </select>
            </div>

            {/* Dose Alvo */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Dose Desejada (kg/ha)</span>
                <span className="text-sky-700 font-mono font-bold">{doseAlvoKgHa} kg/ha</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={doseAlvoKgHa}
                onChange={(e) => setDoseAlvoKgHa(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Lâmina d'água */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Lâmina de Irrigação</span>
                <span className="text-sky-700 font-mono font-bold">{laminaAguaMm} mm</span>
              </div>
              <input
                type="range"
                min="4"
                max="18"
                step="1"
                value={laminaAguaMm}
                onChange={(e) => setLaminaAguaMm(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Condutividade da água do poço */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">CE Água Bruta do Poço</span>
                <span className="text-amber-700 font-mono font-bold">{ceAguaPocoDsM} dS/m</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.80"
                step="0.02"
                value={ceAguaPocoDsM}
                onChange={(e) => setCeAguaPocoDsM(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Custo do Adubo por kg */}
            <div>
              <label className="text-slate-600 block mb-1">Custo Insumo (R$/kg nutriente)</label>
              <input
                type="number"
                value={custoAduboReaisKg}
                onChange={(e) => setCustoAduboReaisKg(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-white font-mono"
              />
            </div>

            {/* Resumo da Regulagem */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Concentração na Calda:</span>
                <span className="text-slate-900 font-mono">
                  {fertiMetrics.concentracaoPct.toFixed(3)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Regulagem da Bomba:</span>
                <span className="text-sky-700 font-mono font-bold">
                  {fertiMetrics.taxaInjecaoBombaLH.toFixed(1)} L/hora
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-white">Condutividade Final:</span>
                <span
                  className={
                    fertiMetrics.ceCaldaDsM <= 1.8 ? 'text-emerald-700 font-mono' : 'text-rose-700 font-mono'
                  }
                >
                  {fertiMetrics.ceCaldaDsM.toFixed(2)} dS/m (Seguro)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
