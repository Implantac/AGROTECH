import React, { useState } from 'react';
import {
  Droplets,
  Gauge,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  Download,
  Layers,
  Wrench,
  Sparkles,
  Tractor,
  RotateCcw
} from 'lucide-react';

interface PontaPulverizacao {
  id: string;
  codigoISO: string;
  fabricanteModelo: string;
  tipoJato: string;
  classeGotas: string;
  corNormaISO: string;
  vazaoNominal3BarLMin: number;
  pressaoMinimaBar: number;
  pressaoMaximaBar: number;
  indicacaoAgronomica: string;
}

interface BicoBarraAmostrado {
  numeroBico: number;
  posicaoBarra: string;
  vazaoColetadaLMin: number;
  desvioPct: number;
  status: 'CONFORME' | 'DESGASTADO_SUBSTITUIR' | 'ENTUPIDO';
}

const PONTAS_CATALOGO: PontaPulverizacao[] = [
  {
    id: 'pnt-01',
    codigoISO: 'AIXR 11004',
    fabricanteModelo: 'TeeJet AIXR Air Induction Extended Range',
    tipoJato: 'Leque Simples 110° com Indução de Ar',
    classeGotas: 'Gotas Ultra-Grossas (UG) / Extremamente Grossas (EG)',
    corNormaISO: 'Azul (Padrão ISO 04)',
    vazaoNominal3BarLMin: 1.58,
    pressaoMinimaBar: 1.5,
    pressaoMaximaBar: 6.0,
    indicacaoAgronomica: 'Dessecação Pré-Plantio com 2,4-D / Glifosato (Deriva Zero)',
  },
  {
    id: 'pnt-02',
    codigoISO: 'TTJ60-11003',
    fabricanteModelo: 'TeeJet Turbo TwinJet Leque Duplo',
    tipoJato: 'Leque Duplo 110° com 60° entre jatos',
    classeGotas: 'Gotas Médias a Finas (M/F)',
    corNormaISO: 'Cinza (Padrão ISO 03)',
    vazaoNominal3BarLMin: 1.18,
    pressaoMinimaBar: 2.0,
    pressaoMaximaBar: 6.0,
    indicacaoAgronomica: 'Fungicidas Sistêmicos e de Contato na Soja (Penetração Baixeiro)',
  },
  {
    id: 'pnt-03',
    codigoISO: 'TXA 8002',
    fabricanteModelo: 'Magnojet Cone Vazio Cerâmica',
    tipoJato: 'Cone Vazio 80° Cerâmico',
    classeGotas: 'Gotas Muito Finas (VF) a Finas (F)',
    corNormaISO: 'Amarela (Padrão ISO 02)',
    vazaoNominal3BarLMin: 0.79,
    pressaoMinimaBar: 3.0,
    pressaoMaximaBar: 12.0,
    indicacaoAgronomica: 'Inseticidas de Contato para Lagartas e Percevejos em Dossel Fechado',
  },
];

const BICOS_AUDITORIA_INICIAIS: BicoBarraAmostrado[] = [
  { numeroBico: 1, posicaoBarra: 'Extremidade Esquerda', vazaoColetadaLMin: 1.51, desvioPct: 0.7, status: 'CONFORME' },
  { numeroBico: 8, posicaoBarra: 'Seção 1 (Esquerda)', vazaoColetadaLMin: 1.50, desvioPct: 0.0, status: 'CONFORME' },
  { numeroBico: 18, posicaoBarra: 'Seção 2 (Esquerda)', vazaoColetadaLMin: 1.49, desvioPct: -0.7, status: 'CONFORME' },
  { numeroBico: 28, posicaoBarra: 'Centro-Esquerda', vazaoColetadaLMin: 1.52, desvioPct: 1.3, status: 'CONFORME' },
  { numeroBico: 36, posicaoBarra: 'Centro da Barra (Eixo)', vazaoColetadaLMin: 1.48, desvioPct: -1.3, status: 'CONFORME' },
  { numeroBico: 44, posicaoBarra: 'Centro-Direita', vazaoColetadaLMin: 1.51, desvioPct: 0.7, status: 'CONFORME' },
  { numeroBico: 54, posicaoBarra: 'Seção 5 (Direita)', vazaoColetadaLMin: 1.71, desvioPct: 14.0, status: 'DESGASTADO_SUBSTITUIR' },
  { numeroBico: 64, posicaoBarra: 'Seção 6 (Direita)', vazaoColetadaLMin: 1.53, desvioPct: 2.0, status: 'CONFORME' },
  { numeroBico: 72, posicaoBarra: 'Extremidade Direita', vazaoColetadaLMin: 1.50, desvioPct: 0.0, status: 'CONFORME' },
];

export const PontasPulverizacaoModule: React.FC = () => {
  const [pontasCatalogo] = useState<PontaPulverizacao[]>(PONTAS_CATALOGO);
  const [pontaSelecionada, setPontaSelecionada] = useState<PontaPulverizacao>(PONTAS_CATALOGO[0]);
  const [amostrasBicos] = useState<BicoBarraAmostrado[]>(BICOS_AUDITORIA_INICIAIS);

  // Variáveis Operacionais da Pulverização
  const [taxaAplicacaoLHa, setTaxaAplicacaoLHa] = useState<number>(100);
  const [velocidadeKmH, setVelocidadeKmH] = useState<number>(18.0);
  const [espacamentoBicosCm, setEspacamentoBicosCm] = useState<number>(50);

  // Fórmula Oficial de Engenharia: Q (L/min) = (L/ha * km/h * esp_cm) / 60000
  const vazaoNominalCalculada = Number(((taxaAplicacaoLHa * velocidadeKmH * espacamentoBicosCm) / 60000).toFixed(2));

  // Contagem de Bicos com Desvio Crítico (> 10% norma ISO 10625)
  const bicosComProblema = amostrasBicos.filter((b) => b.status !== 'CONFORME').length;
  const barraConforme = bicosComProblema === 0;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-stone-950 border border-blue-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl">
                <Droplets className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Pontas de Pulverização & Calibração Hidráulica (ISO 10625)
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                    Tecnologia de Aplicação
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Cálculo milimétrico de vazão (L/min), auditoria de desgaste em proveta graduada e controle de espectro de gotas.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laudo de Calibração de Bicos e Barra emitido para a equipe de aplicação!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-950/40"
            >
              <Download className="w-4 h-4" />
              Laudo de Calibração
            </button>
            <div className="text-right pl-4 border-l border-blue-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Vazão Requerida</div>
              <div className="text-xl font-bold text-cyan-300">{vazaoNominalCalculada} L/min</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Vazão Nominal Necessária</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">
            {vazaoNominalCalculada} <span className="text-sm font-normal text-stone-400">L/min</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            @ {velocidadeKmH} km/h e taxa {taxaAplicacaoLHa} L/ha
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Pressão Hidráulica Estimada</div>
          <div className="text-2xl font-bold text-white mt-1">
            3.2 <span className="text-sm font-normal text-stone-400">bar</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            ~46.4 PSI (Faixa segura: 1.5 a 6.0 bar)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Desgaste da Barra (ISO 10625)</div>
          <div className={`text-2xl font-bold mt-1 ${barraConforme ? 'text-emerald-400' : 'text-rose-400'}`}>
            {barraConforme ? '100% Conforme' : `${bicosComProblema} Bico Reprovado`}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Tolerância máxima permitida: &plusmn;10%
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Espectro de Gotas Selecionado</div>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {pontaSelecionada.codigoISO}
            </span>
          </div>
          <div className="text-xs text-stone-500 mt-1 truncate">
            {pontaSelecionada.classeGotas}
          </div>
        </div>
      </div>

      {/* Main Dual Column: Catálogo de Pontas vs Auditoria da Barra */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Catálogo de Pontas Homologadas (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">
                  Pontas de Pulverização Homologadas
                </h2>
              </div>
              <span className="text-xs text-stone-400">Código de Cores ISO 10625</span>
            </div>

            {/* List of Nozzles */}
            <div className="space-y-3 mb-6">
              {pontasCatalogo.map((pnt) => {
                const isSelected = pnt.id === pontaSelecionada.id;
                return (
                  <div
                    key={pnt.id}
                    onClick={() => setPontaSelecionada(pnt)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500/80 shadow-md'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-blue-400" />
                          {pnt.fabricanteModelo}
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          Cor: <span className="text-stone-300 font-medium">{pnt.corNormaISO}</span> • {pnt.tipoJato}
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          Uso: <span className="text-cyan-300">{pnt.indicacaoAgronomica}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-stone-400">Nominal 3 bar</div>
                          <div className="text-sm font-bold text-white">{pnt.vazaoNominal3BarLMin} L/min</div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 rounded-lg">
                          {pnt.pressaoMinimaBar}-{pnt.pressaoMaximaBar} bar
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Spray Boom Test Sampling Table */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                Auditoria de Proveta Graduada (Amostragem de Bicos da Barra de 36m)
              </h3>

              <div className="overflow-x-auto rounded-lg border border-stone-800 mb-3">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-800/80 text-[11px] text-stone-400 uppercase">
                    <tr>
                      <th className="p-2.5">Bico #</th>
                      <th className="p-2.5">Posição na Barra</th>
                      <th className="p-2.5">Vazão Medida (1 min)</th>
                      <th className="p-2.5">Desvio Relativo</th>
                      <th className="p-2.5 text-right">Diagnóstico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 bg-stone-900/40">
                    {amostrasBicos.map((b) => (
                      <tr key={b.numeroBico}>
                        <td className="p-2.5 font-bold text-white">Bico {b.numeroBico}</td>
                        <td className="p-2.5 text-stone-400">{b.posicaoBarra}</td>
                        <td className="p-2.5 font-semibold text-white">{b.vazaoColetadaLMin} L/min</td>
                        <td className={`p-2.5 font-bold ${b.status === 'CONFORME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {b.desvioPct > 0 ? `+${b.desvioPct}` : b.desvioPct}%
                        </td>
                        <td className="p-2.5 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.status === 'CONFORME'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {b.status === 'CONFORME' ? 'Aprovado' : 'Substituir Imediato'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-900/40 rounded-lg text-xs text-stone-300 flex items-center justify-between">
                <span className="flex items-center gap-2 text-amber-300 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  Bico 54 está desgastado (+14.0% de sobretaxa). Substitua a ponta para eliminar risco de fitotoxicidade em faixas.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Flow & Pressure Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">
                  Calculadora de Calibração Hidráulica
                </h2>
              </div>
              <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded">
                Engenharia de Pulverização
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Altere a velocidade de avanço e taxa de calda para recalcular a vazão unitária necessária em cada ponta.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Taxa de Aplicação Desejada (L/ha)</label>
                <input
                  type="number"
                  step="5"
                  value={taxaAplicacaoLHa}
                  onChange={(e) => setTaxaAplicacaoLHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Velocidade de Trabalho da Máquina (km/h)</label>
                <input
                  type="number"
                  step="0.5"
                  value={velocidadeKmH}
                  onChange={(e) => setVelocidadeKmH(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Espaçamento Entre Bicos na Barra (cm)</label>
                <input
                  type="number"
                  step="5"
                  value={espacamentoBicosCm}
                  onChange={(e) => setEspacamentoBicosCm(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-blue-500"
                />
              </div>
            </div>

            {/* Engineering Results Output Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Vazão Calculada:</span>
                <span className="text-cyan-300 font-bold text-base">
                  {vazaoNominalCalculada} L/min
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Vazão Total da Barra (72 bicos):</span>
                <span className="text-white font-semibold">
                  {(vazaoNominalCalculada * 72).toFixed(1)} L/min
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Recomendação Técnica:</span>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">
                    Ponta {pontaSelecionada.codigoISO} Apta
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Altura recomendada: 50 cm sobre o dossel foliar
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
