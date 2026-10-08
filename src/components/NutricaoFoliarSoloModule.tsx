import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Filter,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

interface AnaliseSolo {
  id: string;
  talhaoId: string;
  talhaoNome: string;
  profundidade: string; // '0-20 cm' | '20-40 cm'
  dataColeta: string;
  argilaPct: number;
  phH2O: number;
  moGKg: number; // Matéria Orgânica g/kg
  pResinaMgDm3: number;
  kCmolc: number;
  caCmolc: number;
  mgCmolc: number;
  alCmolc: number;
  hAlCmolc: number;
  ctcEfetiva: number;
  ctcTotal: number;
  vAtualPct: number;
  mSaturacaoAlPct: number;
  statusNutricional: 'OTIMO' | 'CORRECAO_URGENTE' | 'EQUILIBRADO';
}

interface ItemDRIS {
  nutriente: string;
  teorFoliar: number;
  unidade: string;
  faixaIdeal: string;
  indiceDRIS: number; // Negativo = deficiência relativa; Positivo = excesso relativo
  diagnostico: 'DEFICIT_CRITICO' | 'EQUILIBRADO' | 'EXCESSO_LUXO';
}

const ANALISES_SOLO_INICIAIS: AnaliseSolo[] = [
  {
    id: 'sol-01',
    talhaoId: 'tal-01',
    talhaoNome: 'Talhão 01 - Sede / Pivô Central',
    profundidade: '0-20 cm',
    dataColeta: '2026-08-15',
    argilaPct: 38,
    phH2O: 5.4,
    moGKg: 28.5,
    pResinaMgDm3: 14.2,
    kCmolc: 0.32,
    caCmolc: 2.80,
    mgCmolc: 1.10,
    alCmolc: 0.05,
    hAlCmolc: 4.80,
    ctcEfetiva: 4.27,
    ctcTotal: 9.02,
    vAtualPct: 46.8,
    mSaturacaoAlPct: 1.2,
    statusNutricional: 'CORRECAO_URGENTE',
  },
  {
    id: 'sol-02',
    talhaoId: 'tal-02',
    talhaoNome: 'Talhão 02 - Chapadão Alto',
    profundidade: '0-20 cm',
    dataColeta: '2026-08-18',
    argilaPct: 44,
    phH2O: 6.1,
    moGKg: 34.0,
    pResinaMgDm3: 26.8,
    kCmolc: 0.45,
    caCmolc: 4.20,
    mgCmolc: 1.60,
    alCmolc: 0.0,
    hAlCmolc: 3.10,
    ctcEfetiva: 6.25,
    ctcTotal: 9.35,
    vAtualPct: 66.8,
    mSaturacaoAlPct: 0.0,
    statusNutricional: 'OTIMO',
  },
  {
    id: 'sol-03',
    talhaoId: 'tal-03',
    talhaoNome: 'Talhão 03 - Vereda Baixa',
    profundidade: '20-40 cm',
    dataColeta: '2026-08-20',
    argilaPct: 32,
    phH2O: 4.9,
    moGKg: 18.0,
    pResinaMgDm3: 8.5,
    kCmolc: 0.18,
    caCmolc: 1.40,
    mgCmolc: 0.60,
    alCmolc: 0.45,
    hAlCmolc: 4.20,
    ctcEfetiva: 2.63,
    ctcTotal: 6.38,
    vAtualPct: 34.2,
    mSaturacaoAlPct: 17.1,
    statusNutricional: 'CORRECAO_URGENTE',
  },
];

const DRIS_SOJA_DATA: ItemDRIS[] = [
  { nutriente: 'Nitrogênio (N)', teorFoliar: 48.2, unidade: 'g/kg', faixaIdeal: '45 - 55 g/kg', indiceDRIS: -0.4, diagnostico: 'EQUILIBRADO' },
  { nutriente: 'Fósforo (P)', teorFoliar: 2.8, unidade: 'g/kg', faixaIdeal: '2.5 - 4.0 g/kg', indiceDRIS: -1.8, diagnostico: 'DEFICIT_CRITICO' },
  { nutriente: 'Potássio (K)', teorFoliar: 22.5, unidade: 'g/kg', faixaIdeal: '17 - 25 g/kg', indiceDRIS: 2.4, diagnostico: 'EXCESSO_LUXO' },
  { nutriente: 'Cálcio (Ca)', teorFoliar: 11.2, unidade: 'g/kg', faixaIdeal: '8 - 14 g/kg', indiceDRIS: 0.3, diagnostico: 'EQUILIBRADO' },
  { nutriente: 'Magnésio (Mg)', teorFoliar: 4.1, unidade: 'g/kg', faixaIdeal: '3 - 6 g/kg', indiceDRIS: 0.1, diagnostico: 'EQUILIBRADO' },
  { nutriente: 'Enxofre (S)', teorFoliar: 2.9, unidade: 'g/kg', faixaIdeal: '2.5 - 4.0 g/kg', indiceDRIS: -0.8, diagnostico: 'EQUILIBRADO' },
  { nutriente: 'Boro (B)', teorFoliar: 26.0, unidade: 'mg/kg', faixaIdeal: '30 - 50 mg/kg', indiceDRIS: -4.2, diagnostico: 'DEFICIT_CRITICO' },
  { nutriente: 'Zinco (Zn)', teorFoliar: 38.0, unidade: 'mg/kg', faixaIdeal: '35 - 60 mg/kg', indiceDRIS: 0.5, diagnostico: 'EQUILIBRADO' },
  { nutriente: 'Manganês (Mn)', teorFoliar: 62.0, unidade: 'mg/kg', faixaIdeal: '40 - 100 mg/kg', indiceDRIS: 1.1, diagnostico: 'EQUILIBRADO' },
];

export const NutricaoFoliarSoloModule: React.FC = () => {
  const [analisesSolo] = useState<AnaliseSolo[]>(ANALISES_SOLO_INICIAIS);
  const [analiseSelecionada, setAnaliseSelecionada] = useState<AnaliseSolo>(ANALISES_SOLO_INICIAIS[0]);
  
  // Parâmetros da Calculadora de Calagem e Gessagem
  const [v2Desejado, setV2Desejado] = useState<number>(70);
  const [prntCalcario, setPrntCalcario] = useState<number>(85);
  const [precoCalcario, setPrecoCalcario] = useState<number>(145); // R$/t posto fazenda
  const [precoGesso, setPrecoGesso] = useState<number>(195); // R$/t posto fazenda
  const [areaCalibradaHa, setAreaCalibradaHa] = useState<number>(420);

  // Cálculos Agronômicos Oficiais
  // NC (t/ha) = ((V2 - V1) * CTC) / (10 * PRNT)
  const calcarioTha = Number((((v2Desejado - analiseSelecionada.vAtualPct) * analiseSelecionada.ctcTotal) / (100 * (prntCalcario / 100))).toFixed(2));
  const calcarioEfetivoTha = Math.max(0, calcarioTha);
  
  // Dematê / Souza et al. (Cerrado): NG (kg/ha) = 50 * Argila%
  const gessoTha = Number(((50 * analiseSelecionada.argilaPct) / 1000).toFixed(2));
  
  const calcarioTotalTon = Number((calcarioEfetivoTha * areaCalibradaHa).toFixed(1));
  const gessoTotalTon = Number((gessoTha * areaCalibradaHa).toFixed(1));
  
  const custoCalcarioTotal = calcarioTotalTon * precoCalcario;
  const custoGessoTotal = gessoTotalTon * precoGesso;
  const custoCorrecaoTotal = custoCalcarioTotal + custoGessoTotal;

  // IBN (Índice de Balanço Nutricional DRIS)
  const somaAbsIndices = DRIS_SOJA_DATA.reduce((acc, item) => acc + Math.abs(item.indiceDRIS), 0);
  const ibnScore = Number((somaAbsIndices / DRIS_SOJA_DATA.length).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-stone-900 border border-teal-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl">
                <FlaskConical className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-[#1D4B38] tracking-wide">
                    Nutrição de Solo, Calagem & Diagnose Foliar DRIS
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 rounded-full">
                    Fertilidade 4.0
                  </span>
                </div>
                <p className="text-slate-900 text-sm mt-0.5">
                  Interpretação de laudos laboratoriais, elevação de V%, gessagem subsuperficial e balanço nutricional DRIS.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Relatório Agronômico de Fertilidade e Prescrição exportado em PDF/CSV!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-stone-700 text-stone-200 border border-stone-600 rounded-xl text-sm font-medium transition shadow-sm"
            >
              <Download className="w-4 h-4 text-teal-700" />
              Exportar Laudo
            </button>
            <div className="text-right pl-4 border-l border-teal-800/60 hidden sm:block">
              <div className="text-xs text-slate-600">IBN DRIS Médio</div>
              <div className="text-xl font-bold text-teal-300">{ibnScore} pts (Ótimo)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="text-xs font-medium text-slate-600">V% Atual do Talhão</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {analiseSelecionada.vAtualPct}%
          </div>
          <div className="text-xs text-slate-600 mt-1">
            Meta desejada: {v2Desejado}% (Cultura: Soja/Milho)
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="text-xs font-medium text-slate-600">Necessidade de Calagem</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {calcarioEfetivoTha} <span className="text-sm font-normal text-slate-600">t/ha</span>
          </div>
          <div className="text-xs text-slate-600 mt-1">
            PRNT {prntCalcario}% | Elevação Saturação por Bases
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="text-xs font-medium text-slate-600">Necessidade de Gessagem</div>
          <div className="text-2xl font-bold text-sky-700 mt-1">
            {gessoTha} <span className="text-sm font-normal text-slate-600">t/ha</span>
          </div>
          <div className="text-xs text-slate-600 mt-1">
            Dematê Cerrado ({analiseSelecionada.argilaPct}% de Argila)
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="text-xs font-medium text-slate-600">Investimento Total ({areaCalibradaHa} ha)</div>
          <div className="text-2xl font-bold text-[#1D4B38] mt-1">
            R$ {custoCorrecaoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            R$ {(custoCorrecaoTotal / areaCalibradaHa).toFixed(2)}/ha posto lavoura
          </div>
        </div>
      </div>

      {/* Main Dual Column: Solo + Calculadora vs DRIS Foliar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Soil Chemistry & Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-teal-700" />
                <h2 className="text-lg font-semibold text-[#1D4B38]">
                  Laudos Químicos de Fertilidade do Solo
                </h2>
              </div>
              <span className="text-xs text-slate-600">Método Resina IAC / Embrapa Cerrados</span>
            </div>

            {/* Selector of Talhões */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {analisesSolo.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setAnaliseSelecionada(item)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    analiseSelecionada.id === item.id
                      ? 'bg-teal-950/60 border-teal-500 text-[#1D4B38] shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-emerald-50'
                  }`}
                >
                  <div className="font-semibold text-sm truncate">{item.talhaoNome}</div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                    <span>Prof: {item.profundidade}</span>
                    <span className={item.vAtualPct < 50 ? 'text-amber-700 font-medium' : 'text-emerald-700'}>
                      V: {item.vAtualPct}%
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Detailed Soil Analysis Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6">
              <table className="w-full text-left text-sm text-slate-900">
                <thead className="bg-slate-50/80 text-xs text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Parâmetro Químico</th>
                    <th className="p-3">Valor Obtido</th>
                    <th className="p-3">Faixa Crítica</th>
                    <th className="p-3 text-right">Interpretação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 bg-white/50 text-xs">
                  <tr>
                    <td className="p-3 font-medium text-[#1D4B38]">pH em CaCl₂ / H₂O</td>
                    <td className="p-3 font-semibold text-teal-300">{analiseSelecionada.phH2O}</td>
                    <td className="p-3 text-slate-600">5.5 - 6.2</td>
                    <td className="p-3 text-right">
                      {analiseSelecionada.phH2O < 5.5 ? (
                        <span className="text-amber-700 font-medium">Ácido (Subótimo)</span>
                      ) : (
                        <span className="text-emerald-700 font-medium">Adequado</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#1D4B38]">Fósforo (P Resina)</td>
                    <td className="p-3 font-semibold text-teal-300">{analiseSelecionada.pResinaMgDm3} mg/dm³</td>
                    <td className="p-3 text-slate-600">&gt; 18.0 mg/dm³</td>
                    <td className="p-3 text-right">
                      {analiseSelecionada.pResinaMgDm3 < 18 ? (
                        <span className="text-amber-700 font-medium">Médio / Limitante</span>
                      ) : (
                        <span className="text-emerald-700 font-medium">Alto / Muito Bom</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#1D4B38]">Potássio Trocável (K⁺)</td>
                    <td className="p-3 font-semibold text-teal-300">{analiseSelecionada.kCmolc} cmol_c/dm³</td>
                    <td className="p-3 text-slate-600">&gt; 0.25 cmol_c</td>
                    <td className="p-3 text-right text-emerald-700 font-medium">Excelente</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#1D4B38]">Cálcio + Magnésio (Ca²⁺ + Mg²⁺)</td>
                    <td className="p-3 font-semibold text-teal-300">
                      {(analiseSelecionada.caCmolc + analiseSelecionada.mgCmolc).toFixed(2)} cmol_c/dm³
                    </td>
                    <td className="p-3 text-slate-600">&gt; 3.0 cmol_c</td>
                    <td className="p-3 text-right text-emerald-700 font-medium">Equilibrado (Ca/Mg 2.5:1)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#1D4B38]">Alumínio Trocável (m%)</td>
                    <td className="p-3 font-semibold text-teal-300">{analiseSelecionada.mSaturacaoAlPct}%</td>
                    <td className="p-3 text-slate-600">&lt; 5.0%</td>
                    <td className="p-3 text-right">
                      {analiseSelecionada.mSaturacaoAlPct > 5 ? (
                        <span className="text-rose-700 font-medium">Tóxico (Exige Gessagem)</span>
                      ) : (
                        <span className="text-emerald-700 font-medium">Não Tóxico</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#1D4B38]">CTC a pH 7,0 (T)</td>
                    <td className="p-3 font-semibold text-teal-300">{analiseSelecionada.ctcTotal} cmol_c/dm³</td>
                    <td className="p-3 text-slate-600">Textura Argilosa ({analiseSelecionada.argilaPct}%)</td>
                    <td className="p-3 text-right text-slate-600">Alta capacidade de troca</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Interactive Liming & Gypsum Calculator */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-semibold text-[#1D4B38]">
                  Simulador de Calagem (V%) & Gessagem (Dematê)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Meta V₂ Desejada (%)</label>
                  <input
                    type="number"
                    value={v2Desejado}
                    onChange={(e) => setV2Desejado(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-[#1D4B38] font-semibold focus:border-teal-500"
                    min="50"
                    max="85"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-medium block mb-1">PRNT Calcário (%)</label>
                  <input
                    type="number"
                    value={prntCalcario}
                    onChange={(e) => setPrntCalcario(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-[#1D4B38] font-semibold focus:border-teal-500"
                    min="60"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Calcário R$/t Posto</label>
                  <input
                    type="number"
                    value={precoCalcario}
                    onChange={(e) => setPrecoCalcario(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-[#1D4B38] font-semibold focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Gesso R$/t Posto</label>
                  <input
                    type="number"
                    value={precoGesso}
                    onChange={(e) => setPrecoGesso(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-[#1D4B38] font-semibold focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-white/80 border border-emerald-900/40 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                <div>
                  <span className="text-slate-600">Recomendação Técnica:</span>
                  <div className="text-emerald-800 font-semibold mt-0.5">
                    Aplicar {calcarioEfetivoTha} t/ha de Calcário Dolomítico + {gessoTha} t/ha de Gesso Agrícola
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-600">Total Necessário ({areaCalibradaHa} ha):</span>
                  <div className="text-[#1D4B38] font-bold text-sm">
                    {calcarioTotalTon} t Calcário | {gessoTotalTon} t Gesso
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: DRIS Foliar Diagnosis (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-semibold text-[#1D4B38]">
                  Diagnose Foliar DRIS (Soja R1/R2)
                </h2>
              </div>
              <span className="px-2 py-0.5 text-xs bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-md">
                Normas Embrapa Soja
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              O Sistema Integrado de Diagnose e Recomendação (DRIS) identifica desbalanços nutricionais relativos entre macro e micronutrientes.
            </p>

            {/* DRIS Nutrient Index List */}
            <div className="space-y-3">
              {DRIS_SOJA_DATA.map((item) => {
                const isDeficit = item.indiceDRIS < -1.5;
                const isExcesso = item.indiceDRIS > 1.5;
                return (
                  <div key={item.nutriente} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#1D4B38]">{item.nutriente}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">{item.teorFoliar} {item.unidade}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isDeficit
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : isExcesso
                              ? 'bg-amber-500/20 text-amber-800 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-800 border border-emerald-500/30'
                          }`}
                        >
                          Índice: {item.indiceDRIS > 0 ? `+${item.indiceDRIS}` : item.indiceDRIS}
                        </span>
                      </div>
                    </div>

                    {/* Visual Balance Bar centered at 0 */}
                    <div className="w-full bg-slate-50 rounded-full h-1.5 overflow-hidden flex">
                      <div
                        className="h-full bg-rose-500 transition-all duration-300"
                        style={{ width: `${Math.max(0, Math.min(50, 50 + item.indiceDRIS * 10))}%` }}
                      />
                      <div className="w-0.5 bg-white h-full" />
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${Math.max(0, Math.min(50, item.indiceDRIS * 10))}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-600 mt-1">
                      <span>Faixa ideal: {item.faixaIdeal}</span>
                      <span className={isDeficit ? 'text-rose-700 font-medium' : isExcesso ? 'text-amber-700' : 'text-slate-600'}>
                        {isDeficit ? 'Deficiência Relativa' : isExcesso ? 'Consumo de Luxo' : 'Equilíbrio'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prescrição Foliar Sugerida */}
            <div className="mt-5 p-4 bg-teal-950/40 border border-teal-800/50 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 mb-1">
                <CheckCircle2 className="w-4 h-4 text-teal-700" />
                Intervenção Foliar Recomendada:
              </div>
              <p className="text-xs text-slate-900">
                Correção de <strong>Boro (B)</strong> via pulverização com Octaborato de Sódio (1,5 kg/ha) no estágio R1 para garantir pegamento de florada e evitar abortamento de vagens.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
