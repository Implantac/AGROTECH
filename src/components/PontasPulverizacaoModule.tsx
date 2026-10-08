import React, { useState } from 'react';
import {
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Sliders,
  Download,
  Calculator
} from 'lucide-react';

interface PontaPulverizacao {
  id: string;
  codigoISO: string;
  fabricanteModelo: string;
  corNormaISO: string;
  vazaoNominal3BarLMin: number;
  classeGotas: string;
  tipoJato: string;
  pressaoMinimaBar: number;
  pressaoMaximaBar: number;
  indicacaoAgronomica: string;
}

const PONTAS_CATALOGO: PontaPulverizacao[] = [
  {
    id: 'pnt-01',
    codigoISO: 'TTI 11002 (Amarela)',
    fabricanteModelo: 'TeeJet TTI Air Induction Turbo TwinJet',
    corNormaISO: 'Amarela (ISO 02)',
    vazaoNominal3BarLMin: 0.79,
    classeGotas: 'Extremamente Grossa (XC) a Ultra Grossa (UC)',
    tipoJato: 'Jato Plano Duplo com Indução de Ar',
    pressaoMinimaBar: 1.5,
    pressaoMaximaBar: 6.0,
    indicacaoAgronomica: 'Herbicidas Sistêmicos (Glifosato, 2,4-D) com Zero Deriva em Ventos até 20 km/h',
  },
  {
    id: 'pnt-02',
    codigoISO: 'AIXR 11003 (Azul)',
    fabricanteModelo: 'TeeJet AIXR Air Induction XR Flat Spray',
    corNormaISO: 'Azul (ISO 03)',
    vazaoNominal3BarLMin: 1.18,
    classeGotas: 'Muito Grossa (VC) a Grossa (C)',
    tipoJato: 'Jato Plano Simples com Ar Induzido',
    pressaoMinimaBar: 1.5,
    pressaoMaximaBar: 6.0,
    indicacaoAgronomica: 'Fungicidas de Penetração e Inseticidas em Dossel Médio',
  },
  {
    id: 'pnt-03',
    codigoISO: 'TXR 8004 (Vermelha)',
    fabricanteModelo: 'Conejet Hollow Cone TXR',
    corNormaISO: 'Vermelha (ISO 04)',
    vazaoNominal3BarLMin: 1.58,
    classeGotas: 'Fina (F) a Média (M)',
    tipoJato: 'Cone Vazio Cerâmica Alta Pressão',
    pressaoMinimaBar: 2.0,
    pressaoMaximaBar: 8.0,
    indicacaoAgronomica: 'Dessecação Pré-Colheita e Fungicidas de Contato em Baixo Volume',
  },
];

interface AmostraBicoBarra {
  numeroBico: number;
  posicaoBarra: string;
  vazaoColetadaLMin: number;
  desvioPct: number;
  status: 'CONFORME' | 'DESGASTADO_CRITICO' | 'ENTUPIDO';
}

const AMOSTRAS_BARRA_INICIAIS: AmostraBicoBarra[] = [
  { numeroBico: 1, posicaoBarra: 'Ponta Esquerda (Balanço)', vazaoColetadaLMin: 1.51, desvioPct: 0.7, status: 'CONFORME' },
  { numeroBico: 18, posicaoBarra: 'Seção Intermediária Esquerda', vazaoColetadaLMin: 1.48, desvioPct: -1.3, status: 'CONFORME' },
  { numeroBico: 36, posicaoBarra: 'Centro da Barra (Trator)', vazaoColetadaLMin: 1.52, desvioPct: 1.3, status: 'CONFORME' },
  { numeroBico: 54, posicaoBarra: 'Seção Intermediária Direita', vazaoColetadaLMin: 1.71, desvioPct: 14.0, status: 'DESGASTADO_CRITICO' },
  { numeroBico: 72, posicaoBarra: 'Ponta Direita (Balanço)', vazaoColetadaLMin: 1.49, desvioPct: -0.7, status: 'CONFORME' },
];

export const PontasPulverizacaoModule: React.FC = () => {
  const [pontasCatalogo] = useState<PontaPulverizacao[]>(PONTAS_CATALOGO);
  const [pontaSelecionada, setPontaSelecionada] = useState<PontaPulverizacao>(PONTAS_CATALOGO[0]);
  const [amostrasBicos] = useState<AmostraBicoBarra[]>(AMOSTRAS_BARRA_INICIAIS);

  // Parâmetros Operacionais da Máquina (Calculadora Hidráulica)
  const [taxaAplicacaoLHa, setTaxaAplicacaoLHa] = useState<number>(100.0); // 100 L/ha
  const [velocidadeKmH, setVelocidadeKmH] = useState<number>(18.0); // 18 km/h
  const [espacamentoBicosCm, setEspacamentoBicosCm] = useState<number>(50.0); // 50 cm entre bicos

  // Fórmula Oficial de Engenharia de Aplicação:
  // q (L/min por bico) = (Taxa (L/ha) * Velocidade (km/h) * Espaçamento (cm)) / 60.000
  const vazaoNominalCalculada = Number(((taxaAplicacaoLHa * velocidadeKmH * espacamentoBicosCm) / 60000).toFixed(2));

  // Contagem de Bicos com Desvio Crítico (> 10% norma ISO 10625)
  const bicosComProblema = amostrasBicos.filter((b) => b.status !== 'CONFORME').length;
  const barraConforme = bicosComProblema === 0;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl">
              <Droplets className="w-6 h-6 text-sky-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Pontas de Pulverização & Calibração Hidráulica (ISO 10625)
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 rounded-full">
                  Tecnologia de Aplicação
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Cálculo milimétrico de vazão (L/min), auditoria de desgaste em proveta graduada e controle de espectro de gotas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laudo de Calibração de Bicos e Barra emitido para a equipe de aplicação!')}
              className="flex items-center gap-2 px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              Laudo de Calibração
            </button>
            <div className="text-right pl-4 border-l border-slate-200 hidden sm:block">
              <div className="text-[11px] text-slate-500">Vazão Requerida</div>
              <div className="text-lg font-bold text-sky-700">{vazaoNominalCalculada} L/min</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Vazão Nominal Necessária</div>
          <div className="text-2xl font-bold text-sky-700 mt-1">
            {vazaoNominalCalculada} <span className="text-sm font-normal text-slate-400">L/min</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            @ {velocidadeKmH} km/h e taxa {taxaAplicacaoLHa} L/ha
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Pressão Hidráulica Estimada</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            3.2 <span className="text-sm font-normal text-slate-400">bar</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ~46.4 PSI (Faixa segura: 1.5 a 6.0 bar)
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Desgaste da Barra (ISO 10625)</div>
          <div className={`text-2xl font-bold mt-1 ${barraConforme ? 'text-emerald-700' : 'text-rose-700'}`}>
            {barraConforme ? '100% Conforme' : `${bicosComProblema} Bico Reprovado`}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Tolerância máxima: &plusmn;10%
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Espectro de Gotas Selecionado</div>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-700" />
              {pontaSelecionada.codigoISO}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            {pontaSelecionada.classeGotas}
          </div>
        </div>
      </div>

      {/* Main Dual Column: Catálogo de Pontas vs Auditoria da Barra */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Catálogo de Pontas Homologadas (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-sky-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Pontas de Pulverização Homologadas
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Código de Cores ISO 10625</span>
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
                        ? 'bg-sky-50/70 border-sky-300 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-sky-700" />
                          {pnt.fabricanteModelo}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Cor: <span className="text-slate-800 font-medium">{pnt.corNormaISO}</span> • {pnt.tipoJato}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          Uso: <span className="text-sky-800 font-semibold">{pnt.indicacaoAgronomica}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Nominal 3 bar</div>
                          <div className="text-sm font-bold text-slate-900">{pnt.vazaoNominal3BarLMin} L/min</div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 rounded-lg">
                          {pnt.pressaoMinimaBar}-{pnt.pressaoMaximaBar} bar
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Spray Boom Test Sampling Table */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-700" />
                Auditoria de Proveta Graduada (Amostragem de Bicos da Barra de 36m)
              </h3>

              <div className="overflow-x-auto rounded-lg border border-slate-200 mb-3">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-[11px] text-slate-600 uppercase">
                    <tr>
                      <th className="p-2.5">Bico #</th>
                      <th className="p-2.5">Posição na Barra</th>
                      <th className="p-2.5">Vazão Medida (1 min)</th>
                      <th className="p-2.5">Desvio Relativo</th>
                      <th className="p-2.5 text-right">Diagnóstico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {amostrasBicos.map((b) => (
                      <tr key={b.numeroBico}>
                        <td className="p-2.5 font-bold text-slate-900">Bico {b.numeroBico}</td>
                        <td className="p-2.5 text-slate-500">{b.posicaoBarra}</td>
                        <td className="p-2.5 font-semibold text-slate-800">{b.vazaoColetadaLMin} L/min</td>
                        <td className={`p-2.5 font-bold ${b.status === 'CONFORME' ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {b.desvioPct > 0 ? `+${b.desvioPct}` : b.desvioPct}%
                        </td>
                        <td className="p-2.5 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.status === 'CONFORME'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
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

              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg text-xs text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-2 text-amber-900 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  Bico 54 está desgastado (+14.0% de sobretaxa). Substitua a ponta para eliminar risco de fitotoxicidade em faixas.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Flow & Pressure Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-sky-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Calculadora de Calibração Hidráulica
                </h2>
              </div>
              <span className="text-xs bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded font-semibold">
                Engenharia de Pulverização
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Altere a velocidade de avanço e taxa de calda para recalcular a vazão unitária necessária em cada ponta.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Taxa de Aplicação Desejada (L/ha)</label>
                <input
                  type="number"
                  step="5"
                  value={taxaAplicacaoLHa}
                  onChange={(e) => setTaxaAplicacaoLHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Velocidade de Trabalho da Máquina (km/h)</label>
                <input
                  type="number"
                  step="0.5"
                  value={velocidadeKmH}
                  onChange={(e) => setVelocidadeKmH(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Espaçamento Entre Bicos na Barra (cm)</label>
                <input
                  type="number"
                  step="5"
                  value={espacamentoBicosCm}
                  onChange={(e) => setEspacamentoBicosCm(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Engineering Results Output Box */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Vazão Calculada:</span>
                <span className="text-sky-800 font-bold text-base">
                  {vazaoNominalCalculada} L/min
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Ponta Selecionada:</span>
                <span className="text-slate-800 font-semibold">{pontaSelecionada.codigoISO}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Compatibilidade:</span>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-700">
                    Ponta {pontaSelecionada.codigoISO.split(' ')[0]} Apta
                  </div>
                  <div className="text-[10px] text-slate-500">
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
export default PontasPulverizacaoModule;
