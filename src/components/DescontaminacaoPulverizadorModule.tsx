import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  Download,
  Filter,
  Tractor,
  Layers,
  Clock,
  Droplet,
  FileCheck,
  Lock,
  Unlock
} from 'lucide-react';

interface OrdemLimpezaPulverizador {
  id: string;
  pulverizadorNome: string;
  operador: string;
  dataHora: string;
  produtoAnterior: string; // Ex: Herbicida hormonal 2,4-D
  proximaAplicacao: string; // Ex: Inseticida em Soja Sensível V4
  volumeResidualTubulacaoL: number;
  concentracaoResidualPpm: number;
  fase1EnxagueInicial: boolean;
  fase2DesincrustanteAlcalino: boolean;
  fase3PurgaFiltrosPontas: boolean;
  fase4EnxagueFinalCheckPpm: boolean;
  ppmFinalMedido: number;
  statusDescontaminacao: 'BLOQUEADO_LOTO' | 'EM_LIMPEZA' | 'LIBERADO_SEGURO';
}

const ORDENS_INICIAIS: OrdemLimpezaPulverizador[] = [
  {
    id: 'des-01',
    pulverizadorNome: 'Jacto Uniport 3030 (Barra 36m)',
    operador: 'Marcos Aurélio Guedes',
    dataHora: '2026-09-28 08:30',
    produtoAnterior: '2,4-D Amina (Herbicida Hormonal Dessecação)',
    proximaAplicacao: 'Fungicida + Foliar em Soja Convencional V4',
    volumeResidualTubulacaoL: 18.5,
    concentracaoResidualPpm: 616.0,
    fase1EnxagueInicial: true,
    fase2DesincrustanteAlcalino: true,
    fase3PurgaFiltrosPontas: true,
    fase4EnxagueFinalCheckPpm: true,
    ppmFinalMedido: 0.015,
    statusDescontaminacao: 'LIBERADO_SEGURO',
  },
  {
    id: 'des-02',
    pulverizadorNome: 'Case Patriot 350 (Barra 36m)',
    operador: 'Edimilson Santana',
    dataHora: '2026-09-28 11:15',
    produtoAnterior: 'Dicamba DGA (Dessecação Pré-Plantio)',
    proximaAplicacao: 'Biológico Bacillus subtilis em Algodão B2',
    volumeResidualTubulacaoL: 22.0,
    concentracaoResidualPpm: 750.0,
    fase1EnxagueInicial: true,
    fase2DesincrustanteAlcalino: true,
    fase3PurgaFiltrosPontas: false,
    fase4EnxagueFinalCheckPpm: false,
    ppmFinalMedido: 0.42,
    statusDescontaminacao: 'EM_LIMPEZA',
  },
  {
    id: 'des-03',
    pulverizadorNome: 'John Deere M4040 (Barra 36m)',
    operador: 'Lucas Fagundes',
    dataHora: '2026-09-28 14:00',
    produtoAnterior: 'Clorimuron-etílico + Glifosato',
    proximaAplicacao: 'Graminicida Haloxifope em Soja RR',
    volumeResidualTubulacaoL: 20.0,
    concentracaoResidualPpm: 540.0,
    fase1EnxagueInicial: false,
    fase2DesincrustanteAlcalino: false,
    fase3PurgaFiltrosPontas: false,
    fase4EnxagueFinalCheckPpm: false,
    ppmFinalMedido: 540.0,
    statusDescontaminacao: 'BLOQUEADO_LOTO',
  },
];

export const DescontaminacaoPulverizadorModule: React.FC = () => {
  const [ordens, setOrdens] = useState<OrdemLimpezaPulverizador[]>(ORDENS_INICIAIS);
  const [ordemSelecionada, setOrdemSelecionada] = useState<OrdemLimpezaPulverizador>(ORDENS_INICIAIS[0]);

  // Simulador Dinâmico de Diluição Residual por Ciclo
  const [volumeEnxagueLitros, setVolumeEnxagueLitros] = useState<number>(500);
  const [doseLimpadorTanqueMl, setDoseLimpadorTanqueMl] = useState<number>(2000); // 2L limp-tanque alcalino
  const [areaTalhaoProximaHa] = useState<number>(600);
  const [prejuizoPotencialFitotoxicidade] = useState<number>(420000.0); // R$ 420 mil se queimar a lavoura

  const toggleEtapa = (etapa: 'fase1' | 'fase2' | 'fase3' | 'fase4') => {
    setOrdens((prev) =>
      prev.map((o) => {
        if (o.id !== ordemSelecionada.id) return o;
        const updated = { ...o };
        if (etapa === 'fase1') updated.fase1EnxagueInicial = !updated.fase1EnxagueInicial;
        if (etapa === 'fase2') updated.fase2DesincrustanteAlcalino = !updated.fase2DesincrustanteAlcalino;
        if (etapa === 'fase3') updated.fase3PurgaFiltrosPontas = !updated.fase3PurgaFiltrosPontas;
        if (etapa === 'fase4') updated.fase4EnxagueFinalCheckPpm = !updated.fase4EnxagueFinalCheckPpm;

        // Se todas as 4 fases estiverem checadas, libera a máquina
        const todasChecadas =
          updated.fase1EnxagueInicial &&
          updated.fase2DesincrustanteAlcalino &&
          updated.fase3PurgaFiltrosPontas &&
          updated.fase4EnxagueFinalCheckPpm;

        updated.statusDescontaminacao = todasChecadas ? 'LIBERADO_SEGURO' : 'EM_LIMPEZA';
        updated.ppmFinalMedido = todasChecadas ? 0.015 : 0.42;

        setOrdemSelecionada(updated);
        return updated;
      })
    );
  };

  const isSeguro = ordemSelecionada.statusDescontaminacao === 'LIBERADO_SEGURO';

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-950 via-stone-900 to-stone-950 border border-blue-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl">
                <RotateCcw className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Descontaminação de Pulverizadores & Prevenção de Fitotoxicidade
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Zero Carryover
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Protocolo de 4 fases para eliminação de resíduos de 2,4-D/Dicamba, purga de filtros e bloqueio operacional LOTO.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Certificado Digital de Descontaminação de Barra emitido para o operador!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-950/40"
            >
              <FileCheck className="w-4 h-4" />
              Certificado de Limpeza
            </button>
            <div className="text-right pl-4 border-l border-blue-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Risco Evitado</div>
              <div className="text-xl font-bold text-emerald-300">R$ {prejuizoPotencialFitotoxicidade.toLocaleString('pt-BR')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Resíduo Químico Atual</div>
          <div className={`text-2xl font-bold mt-1 ${ordemSelecionada.ppmFinalMedido <= 0.05 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {ordemSelecionada.ppmFinalMedido} <span className="text-sm font-normal text-stone-400">ppm</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Limiar seguro: &le; 0.05 ppm ({ordemSelecionada.ppmFinalMedido <= 0.05 ? 'Livre de contaminação' : 'Risco de queima!'})
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Volume Retido em Tubulações</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">
            {ordemSelecionada.volumeResidualTubulacaoL} <span className="text-sm font-normal text-stone-400">Litros</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Retenção em filtros de linha, ramais e bicos
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Prejuízo Potencial Evitado</div>
          <div className="text-2xl font-bold text-white mt-1">
            R$ {prejuizoPotencialFitotoxicidade.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-400 mt-1">
            Em {areaTalhaoProximaHa} ha de soja sensível
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Trava Eletrônica (Cockpit)</div>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                isSeguro
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isSeguro ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  MÁQUINA LIBERADA
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  BLOQUEIO ATIVO (LOTO)
                </>
              )}
            </span>
          </div>
          <div className="text-xs text-stone-500 mt-1 truncate">
            {ordemSelecionada.pulverizadorNome}
          </div>
        </div>
      </div>

      {/* Main Dual Column: Ordens vs Checklist de 4 Fases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Ordens de Lavagem Ativas (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tractor className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">
                  Pulverizadores Autopropelidos em Manutenção de Calda
                </h2>
              </div>
              <span className="text-xs text-stone-400">Telemetria de Tanque</span>
            </div>

            {/* List of Spraying Machines */}
            <div className="space-y-3 mb-6">
              {ordens.map((ordem) => {
                const isSelected = ordem.id === ordemSelecionada.id;
                return (
                  <div
                    key={ordem.id}
                    onClick={() => setOrdemSelecionada(ordem)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500/80 shadow-md'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          <Tractor className="w-4 h-4 text-blue-400" />
                          {ordem.pulverizadorNome}
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          Op: {ordem.operador} • Anterior: <span className="text-rose-400 font-medium">{ordem.produtoAnterior}</span>
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          Próximo: <span className="text-stone-300">{ordem.proximaAplicacao}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-stone-400">Residual</div>
                          <div className={`text-sm font-bold ${ordem.ppmFinalMedido <= 0.05 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {ordem.ppmFinalMedido} ppm
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                            ordem.statusDescontaminacao === 'LIBERADO_SEGURO'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {ordem.statusDescontaminacao === 'LIBERADO_SEGURO' ? 'Liberado' : 'Bloqueado'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Protocol Explanation Box */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Por que a Tríplice Lavagem Simples não remove 2,4-D / Dicamba?
              </div>
              <p className="text-stone-300 leading-relaxed">
                Herbicidas hormonais sintéticos aderem às paredes de polietileno do tanque e mangueiras de borracha. Sem um <strong>desincrustante alcalino com pH &gt; 10</strong>, os resíduos se desprendem na calda seguinte ao adicionar surfactantes ou fertilizantes foliares, causando deformações nas folhas ("efeito guarda-chuva") e abortamento de flores na soja sensível.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 4-Phase Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Checklist Digital de Descontaminação
                </h2>
              </div>
              <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded">
                Procedimento Operacional Padrão
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              O operador deve concluir e atestar as 4 etapas sequenciais para desbloquear o computador de bordo do pulverizador.
            </p>

            <div className="space-y-3">
              {/* Fase 1 */}
              <div
                onClick={() => toggleEtapa('fase1')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  ordemSelecionada.fase1EnxagueInicial
                    ? 'bg-emerald-950/30 border-emerald-500/60'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-[10px]">
                      1
                    </span>
                    Enxágue Primário de Tanque
                  </span>
                  <input
                    type="checkbox"
                    checked={ordemSelecionada.fase1EnxagueInicial}
                    onChange={() => {}}
                    className="accent-emerald-500 w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1 pl-7">
                  Drenar tanque e circular 500L de água limpa por 5 minutos via retorno.
                </p>
              </div>

              {/* Fase 2 */}
              <div
                onClick={() => toggleEtapa('fase2')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  ordemSelecionada.fase2DesincrustanteAlcalino
                    ? 'bg-emerald-950/30 border-emerald-500/60'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-[10px]">
                      2
                    </span>
                    Adição de Limp-Tanque Alcalino
                  </span>
                  <input
                    type="checkbox"
                    checked={ordemSelecionada.fase2DesincrustanteAlcalino}
                    onChange={() => {}}
                    className="accent-emerald-500 w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1 pl-7">
                  Adicionar 2L de desincrustante alcalino (pH 10.5) com 1.000L de água e agitar 15 min.
                </p>
              </div>

              {/* Fase 3 */}
              <div
                onClick={() => toggleEtapa('fase3')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  ordemSelecionada.fase3PurgaFiltrosPontas
                    ? 'bg-emerald-950/30 border-emerald-500/60'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-[10px]">
                      3
                    </span>
                    Purga de Barra, Pontas e Filtros
                  </span>
                  <input
                    type="checkbox"
                    checked={ordemSelecionada.fase3PurgaFiltrosPontas}
                    onChange={() => {}}
                    className="accent-emerald-500 w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1 pl-7">
                  Pulverizar a calda desincrustante pelas pontas e retirar malhas de bicos para lavagem manual.
                </p>
              </div>

              {/* Fase 4 */}
              <div
                onClick={() => toggleEtapa('fase4')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  ordemSelecionada.fase4EnxagueFinalCheckPpm
                    ? 'bg-emerald-950/30 border-emerald-500/60'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-[10px]">
                      4
                    </span>
                    Enxágue Final & Teste de PPM
                  </span>
                  <input
                    type="checkbox"
                    checked={ordemSelecionada.fase4EnxagueFinalCheckPpm}
                    onChange={() => {}}
                    className="accent-emerald-500 w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1 pl-7">
                  Enxágue com água limpa e verificação com fita de detecção (ppm &le; 0.05).
                </p>
              </div>
            </div>

            {/* Lockout/Tagout Status Confirmation Box */}
            <div className={`mt-6 p-4 rounded-xl border text-xs ${
              isSeguro
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            }`}>
              <div className="flex items-center justify-between font-bold text-sm mb-1">
                <span className="flex items-center gap-2">
                  {isSeguro ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-rose-400" />}
                  {isSeguro ? 'Sistema Desbloqueado com Sucesso' : 'Pulverizador Bloqueado por Segurança'}
                </span>
              </div>
              <p className="text-[11px] opacity-90">
                {isSeguro
                  ? 'A máquina está aprovada para operar em soja sensível. Certificado registrado na nuvem.'
                  : 'Conclua as etapas restantes do checklist para remover o bloqueio eletrônico no cockpit.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
