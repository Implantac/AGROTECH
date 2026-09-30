import React, { useState } from 'react';
import {
  Dna,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  Microscope,
  Leaf,
  FlaskConical,
  Calculator,
  ShieldCheck,
  TrendingUp,
  Coins
} from 'lucide-react';

interface LaudoBioAS {
  id: string;
  talhao: string;
  areaHa: number;
  tipoManejo: string;
  texturaSolo: string;
  argilaPct: number;
  betaGlicosidase: number; // mg PNP/kg solo/h (ref: 180)
  arilsulfatase: number;   // mg PNP/kg solo/h (ref: 70)
  fosfataseAcida: number;  // mg PNP/kg solo/h (ref: 450)
  iqsBiologico: number;    // 0.00 a 1.00
  classeSaude: 'ALTA' | 'MEDIA' | 'BAIXA';
  resilienciaEstresseHidrico: string;
  fosfatoOrgMineralizadoKgHa: number;
  enxofreOrgMineralizadoKgHa: number;
}

const LAUDOS_BIOAS_INICIAIS: LaudoBioAS[] = [
  {
    id: 'bio-01',
    talhao: 'Talhão T-01 (Sede - 12 anos Plantio Direto + Braquiária)',
    areaHa: 420.5,
    tipoManejo: 'Plantio Direto Consolidado com Rotação Soja/Milho+Braquiária',
    texturaSolo: 'Latossolo Vermelho-Escuro Muito Argiloso',
    argilaPct: 58,
    betaGlicosidase: 162.0,
    arilsulfatase: 59.5,
    fosfataseAcida: 382.5,
    iqsBiologico: 0.87,
    classeSaude: 'ALTA',
    resilienciaEstresseHidrico: 'Excelente (Tolera até 18 dias de veranico sem quebra severa)',
    fosfatoOrgMineralizadoKgHa: 28.5,
    enxofreOrgMineralizadoKgHa: 16.2,
  },
  {
    id: 'bio-02',
    talhao: 'Talhão T-04 (Pivô Sul - Histórico de Gradagem Anual)',
    areaHa: 130.0,
    tipoManejo: 'Preparo Convencional / Baixa Cobertura de Solo',
    texturaSolo: 'Latossolo Vermelho Argiloso',
    argilaPct: 44,
    betaGlicosidase: 85.0,
    arilsulfatase: 28.0,
    fosfataseAcida: 195.0,
    iqsBiologico: 0.45,
    classeSaude: 'BAIXA',
    resilienciaEstresseHidrico: 'Crítica (Sintomas de murcha após 5 dias sem chuva)',
    fosfatoOrgMineralizadoKgHa: 9.2,
    enxofreOrgMineralizadoKgHa: 5.4,
  },
  {
    id: 'bio-03',
    talhao: 'Talhão T-02 (Cerrado Alto - Transição Agroecológica 3 anos)',
    areaHa: 280.0,
    tipoManejo: 'Plantio Direto + Mix de Cobertura + Inoculação On-Farm',
    texturaSolo: 'Latossolo Vermelho-Amarelo Argiloso',
    argilaPct: 48,
    betaGlicosidase: 128.0,
    arilsulfatase: 46.0,
    fosfataseAcida: 295.0,
    iqsBiologico: 0.68,
    classeSaude: 'MEDIA',
    resilienciaEstresseHidrico: 'Moderada (Estrutura biológica em rápida regeneração)',
    fosfatoOrgMineralizadoKgHa: 19.8,
    enxofreOrgMineralizadoKgHa: 11.0,
  },
];

export const BioanaliseSoloModule: React.FC = () => {
  const [laudos] = useState<LaudoBioAS[]>(LAUDOS_BIOAS_INICIAIS);
  const [laudoAtivo, setLaudoAtivo] = useState<LaudoBioAS>(LAUDOS_BIOAS_INICIAIS[0]);

  // Cotações e Conversões de Economia Química de Adubação
  const [cotacaoMAPTon, setCotacaoMAPTon] = useState<number>(4200.0); // R$ 4.200 / ton (MAP com 52% P2O5)
  const [cotacaoGessoTon, setCotacaoGessoTon] = useState<number>(380.0); // R$ 380 / ton (Gesso agrícola com 15% S)

  // Cálculos de Equivalência em Fertilizantes Químicos Minerais
  // P orgânico mineralizado (kg/ha) convertido em P2O5 (fator 2.29): P2O5_equiv = P * 2.29
  const p2o5EquivKgHa = laudoAtivo.fosfatoOrgMineralizadoKgHa * 2.29;
  // Quantidade de MAP (52% P2O5) substituída:
  const mapSubstituidoKgHa = (p2o5EquivKgHa / 0.52);
  const economiaMAPReaisHa = (mapSubstituidoKgHa / 1000) * cotacaoMAPTon;

  // Enxofre orgânico (kg/ha) substituído de gesso (15% S):
  const gessoSubstituidoKgHa = (laudoAtivo.enxofreOrgMineralizadoKgHa / 0.15);
  const economiaGessoReaisHa = (gessoSubstituidoKgHa / 1000) * cotacaoGessoTon;

  const economiaBiologicaTotalHa = economiaMAPReaisHa + economiaGessoReaisHa;
  const economiaBiologicaTalhaoReais = economiaBiologicaTotalHa * laudoAtivo.areaHa;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl">
                <Dna className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Bioanálise de Solo (BioAS Embrapa & Saúde Biológica)
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Tecnologia Embrapa Cerrados
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Avaliação das enzimas Beta-Glicosidase, Arilsulfatase e Fosfatase Ácida para mensurar a fertilidade biológica oculta do solo.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Certificado Oficial de Bioanálise de Solo (BioAS) emitido!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-950/40"
            >
              <Download className="w-4 h-4" />
              Laudo Oficial BioAS
            </button>
            <div className="text-right pl-4 border-l border-emerald-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Economia em Fertilizantes</div>
              <div className="text-xl font-bold text-emerald-300">
                R$ {economiaBiologicaTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Índice BioAS (IQS Biológico)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {laudoAtivo.iqsBiologico.toFixed(2)} <span className="text-sm font-normal text-stone-400">/ 1.00</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Classificação: <strong className="text-white">{laudoAtivo.classeSaude}</strong>
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Fósforo Orgânico Mineralizado</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">
            {laudoAtivo.fosfatoOrgMineralizadoKgHa} <span className="text-sm font-normal text-stone-400">kg P/ha/ano</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Equivale a {mapSubstituidoKgHa.toFixed(1)} kg MAP/ha
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Enxofre Orgânico Mineralizado</div>
          <div className="text-2xl font-bold text-amber-300 mt-1">
            {laudoAtivo.enxofreOrgMineralizadoKgHa} <span className="text-sm font-normal text-stone-400">kg S/ha/ano</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Equivale a {gessoSubstituidoKgHa.toFixed(1)} kg gesso/ha
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Economia Biológica Total</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            R$ {economiaBiologicaTotalHa.toFixed(2)} <span className="text-sm font-normal text-stone-400">/ha</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Substituição natural de adubação química solúvel
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Enzimas BioAS vs Calculadora de Economia Química */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Atividades Enzimáticas BioAS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Microscope className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Diagnóstico Enzimático por Talhão
                </h2>
              </div>
              <span className="text-xs text-stone-400 font-mono">Padrão Embrapa Cerrados</span>
            </div>

            {/* Selector of Talhões */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
              {laudos.map((l) => {
                const isSelected = l.id === laudoAtivo.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLaudoAtivo(l)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/50'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{l.talhao.split(' - ')[0]}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          l.classeSaude === 'ALTA'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : l.classeSaude === 'MEDIA'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {l.classeSaude}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1 truncate">{l.areaHa} ha • {l.argilaPct}% argila</div>
                  </button>
                );
              })}
            </div>

            {/* Three BioAS Enzyme Indicators */}
            <div className="space-y-4 bg-stone-950/70 border border-stone-800 rounded-xl p-4">
              {/* Beta-Glicosidase */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    Beta-Glicosidase (Ciclo do Carbono e Matéria Orgânica)
                  </span>
                  <span className="font-mono font-bold text-emerald-300">
                    {laudoAtivo.betaGlicosidase} mg PNP/kg/h <span className="text-stone-500 text-[10px]">(Ref: 180)</span>
                  </span>
                </div>
                <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (laudoAtivo.betaGlicosidase / 180) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Arilsulfatase */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
                    Arilsulfatase (Ciclo do Enxofre e Palhada)
                  </span>
                  <span className="font-mono font-bold text-amber-300">
                    {laudoAtivo.arilsulfatase} mg PNP/kg/h <span className="text-stone-500 text-[10px]">(Ref: 70)</span>
                  </span>
                </div>
                <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (laudoAtivo.arilsulfatase / 70) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Fosfatase Ácida */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Fosfatase Ácida (Solubilização de Fósforo Orgânico)
                  </span>
                  <span className="font-mono font-bold text-cyan-300">
                    {laudoAtivo.fosfataseAcida} mg PNP/kg/h <span className="text-stone-500 text-[10px]">(Ref: 450)</span>
                  </span>
                </div>
                <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (laudoAtivo.fosfataseAcida / 450) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Manejo Contextual & Resiliência ao Veranico */}
            <div className="mt-4 p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Resiliência Agronômica ao Estresse Hídrico
                </span>
                <span className="text-[11px] font-bold text-white">{laudoAtivo.resilienciaEstresseHidrico}</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                Histórico de manejo: <strong>{laudoAtivo.tipoManejo}</strong>. A rotação continuada com braquiária e inoculação biológica promoveu abundante rede de hifas de fungos micorrízicos arbusculares (FMA) e exsudação radicular rica em açúcares, alimentando o microbioma benéfico que recicla fósforo e enxofre em profundidade.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Fertilizer Economic Replacement Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Valoração da Fertilidade Biológica
                </h2>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
                Economia Real
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Simule a substituição de fertilizantes solúveis de alto custo (MAP e Gesso) pelos nutrientes disponibilizados biologicamente.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Cotação do Fertilizante Fosfatado MAP (R$/t)</label>
                <input
                  type="number"
                  step="100"
                  value={cotacaoMAPTon}
                  onChange={(e) => setCotacaoMAPTon(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Cotação do Gesso Agrícola (R$/t)</label>
                <input
                  type="number"
                  step="20"
                  value={cotacaoGessoTon}
                  onChange={(e) => setCotacaoGessoTon(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Substitution Results Output Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Economia de Fósforo (MAP):</span>
                <span className="text-cyan-300 font-bold">
                  {mapSubstituidoKgHa.toFixed(1)} kg MAP/ha (R$ {economiaMAPReaisHa.toFixed(2)}/ha)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Economia de Enxofre (Gesso):</span>
                <span className="text-amber-300 font-bold">
                  {gessoSubstituidoKgHa.toFixed(1)} kg Gesso/ha (R$ {economiaGessoReaisHa.toFixed(2)}/ha)
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Economia Biológica Total:</span>
                <span className="text-emerald-400 font-bold text-base">
                  R$ {economiaBiologicaTotalHa.toFixed(2)} /ha
                </span>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-900/40 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Economia Total no Talhão ({laudoAtivo.areaHa} ha)</div>
                  <div className="text-xl font-black text-white">
                    R$ {economiaBiologicaTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <Coins className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
