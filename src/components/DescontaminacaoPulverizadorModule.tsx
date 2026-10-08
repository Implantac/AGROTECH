import React, { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Tractor,
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
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl">
              <RotateCcw className="w-6 h-6 text-sky-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Descontaminação de Pulverizadores & Prevenção de Fitotoxicidade
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  Zero Carryover
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Protocolo de 4 fases para eliminação de resíduos de 2,4-D/Dicamba, purga de filtros e bloqueio operacional LOTO.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Certificado Digital de Descontaminação de Barra emitido para o operador!')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <FileCheck className="w-4 h-4" />
              Certificado de Limpeza
            </button>
            <div className="text-right pl-4 border-l border-slate-200 hidden sm:block">
              <div className="text-[11px] text-slate-500">Risco Evitado</div>
              <div className="text-lg font-bold text-emerald-700">R$ {prejuizoPotencialFitotoxicidade.toLocaleString('pt-BR')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Resíduo Químico Atual</div>
          <div className={`text-2xl font-bold mt-1 ${ordemSelecionada.ppmFinalMedido <= 0.05 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {ordemSelecionada.ppmFinalMedido} <span className="text-sm font-normal text-slate-400">ppm</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Limiar seguro: &le; 0.05 ppm ({ordemSelecionada.ppmFinalMedido <= 0.05 ? 'Livre de contaminação' : 'Risco de queima!'})
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Volume Retido em Tubulações</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {ordemSelecionada.volumeResidualTubulacaoL} <span className="text-sm font-normal text-slate-400">Litros</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Retenção em filtros de linha, ramais e bicos
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Prejuízo Potencial Evitado</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            R$ {prejuizoPotencialFitotoxicidade.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Em {areaTalhaoProximaHa} ha de soja sensível
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Trava Eletrônica (Cockpit)</div>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                isSeguro
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
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
          <div className="text-xs text-slate-500 mt-1 truncate">
            {ordemSelecionada.pulverizadorNome}
          </div>
        </div>
      </div>

      {/* Main Dual Column: Ordens vs Checklist de 4 Fases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Ordens de Lavagem Ativas (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tractor className="w-5 h-5 text-sky-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Pulverizadores Autopropelidos em Manutenção de Calda
                </h2>
              </div>
              <span className="text-xs text-slate-500">Telemetria de Tanque</span>
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
                        ? 'bg-sky-50/70 border-sky-400 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                          <Tractor className="w-4 h-4 text-sky-700" />
                          {ordem.pulverizadorNome}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Op: {ordem.operador} • Anterior: <span className="text-rose-700 font-medium">{ordem.produtoAnterior}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Próximo: <span className="text-slate-700 font-medium">{ordem.proximaAplicacao}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Residual</div>
                          <div className={`text-sm font-bold ${ordem.ppmFinalMedido <= 0.05 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {ordem.ppmFinalMedido} ppm
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                            ordem.statusDescontaminacao === 'LIBERADO_SEGURO'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
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
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Por que a Tríplice Lavagem Simples não remove 2,4-D / Dicamba?
              </div>
              <p className="text-slate-600 leading-relaxed">
                Herbicidas hormonais sintéticos aderem às paredes de polietileno do tanque e mangueiras de borracha. Sem um <strong>desincrustante alcalino com pH &gt; 10</strong>, os resíduos se desprendem na calda seguinte ao adicionar surfactantes ou fertilizantes foliares, causando deformações nas folhas (&quot;efeito guarda-chuva&quot;) e abortamento de flores na soja sensível.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 4-Phase Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Checklist Digital de Descontaminação
                </h2>
              </div>
              <span className="text-xs bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded font-semibold">
                Procedimento Padrão
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              O operador deve atestar as 4 etapas sequenciais para desbloquear o computador de bordo do pulverizador.
            </p>

            <div className="space-y-3">
              {/* Fase 1 */}
              <div
                onClick={() => toggleEtapa('fase1')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  ordemSelecionada.fase1EnxagueInicial
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[10px]">
                      1
                    </span>
                    Enxágue Primário de Tanque
                  </span>
                  <input
                    type="checkbox"
                    checked={ordemSelecionada.fase1EnxagueInicial}
                    onChange={() => {}}
                    className="accent-emerald-600 w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 pl-7">
                  Drenar tanque e circular 500L de água limpa por 5 minutos via retorno.
                </p>
              </div>

              {/* Fase 2 */}
              <div
                onClick={() => toggleEtapa('fase2')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  ordemSelecionada.fase2DesincrustanteAlcalino
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[10px]">
                      2
                    </span>
                    Adição de Limp-Tanque Alcalino
                  </span>
                  <input
                    type="checkbox"
                    checked={ordemSelecionada.fase2DesincrustanteAlcalino}
                    onChange={() => {}}
                    className="accent-emerald-600 w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 pl-7">
                  Adicionar 2L de desincrustante alcalino (pH 10.5) com 1.000L de água e agitar 15 min.
                </p>
              </div>

              {/* Fase 3 */}
              <div
                onClick={() => toggleEtapa('fase3')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  ordemSelecionada.fase3PurgaFiltrosPontas
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[10px]">
                      3
                    </span>
                    Purga de Barra, Pontas e Filtros
                  </span>
                  <input
                    type="checkbox"
                    checked={ordemSelecionada.fase3PurgaFiltrosPontas}
                    onChange={() => {}}
                    className="accent-emerald-600 w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 pl-7">
                  Pulverizar a calda desincrustante pelas pontas e retirar malhas de bicos para lavagem manual.
                </p>
              </div>

              {/* Fase 4 */}
              <div
                onClick={() => toggleEtapa('fase4')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  ordemSelecionada.fase4EnxagueFinalCheckPpm
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[10px]">
                      4
                    </span>
                    Enxágue Final & Teste de PPM
                  </span>
                  <input
                    type="checkbox"
                    checked={ordemSelecionada.fase4EnxagueFinalCheckPpm}
                    onChange={() => {}}
                    className="accent-emerald-600 w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 pl-7">
                  Enxágue com água limpa e verificação com fita de detecção (ppm &le; 0.05).
                </p>
              </div>
            </div>

            {/* Lockout/Tagout Status Confirmation Box */}
            <div className={`mt-6 p-4 rounded-xl border text-xs ${
              isSeguro
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <div className="flex items-center justify-between font-bold text-sm mb-1">
                <span className="flex items-center gap-2">
                  {isSeguro ? <Unlock className="w-4 h-4 text-emerald-700" /> : <Lock className="w-4 h-4 text-rose-700" />}
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
export default DescontaminacaoPulverizadorModule;
