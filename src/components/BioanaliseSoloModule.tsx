import React, { useState } from 'react';
import {
  Dna,
  Sparkles,
  Download,
  Microscope,
  Leaf,
  FlaskConical,
  Calculator,
  ShieldCheck,
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
  const p2o5EquivKgHa = laudoAtivo.fosfatoOrgMineralizadoKgHa * 2.29;
  const mapSubstituidoKgHa = (p2o5EquivKgHa / 0.52);
  const economiaMAPReaisHa = (mapSubstituidoKgHa / 1000) * cotacaoMAPTon;

  const gessoSubstituidoKgHa = (laudoAtivo.enxofreOrgMineralizadoKgHa / 0.15);
  const economiaGessoReaisHa = (gessoSubstituidoKgHa / 1000) * cotacaoGessoTon;

  const economiaBiologicaTotalHa = economiaMAPReaisHa + economiaGessoReaisHa;
  const economiaBiologicaTalhaoReais = economiaBiologicaTotalHa * laudoAtivo.areaHa;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
              <Dna className="w-6 h-6 text-emerald-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Bioanálise de Solo (BioAS Embrapa & Saúde Biológica)
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  Embrapa Cerrados
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Avaliação das enzimas Beta-Glicosidase, Arilsulfatase e Fosfatase Ácida para mensurar a fertilidade biológica oculta do solo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Certificado Oficial de Bioanálise de Solo (BioAS) emitido!')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              Laudo Oficial BioAS
            </button>
            <div className="text-right pl-4 border-l border-slate-200 hidden sm:block">
              <div className="text-[11px] text-slate-500">Economia em Fertilizantes</div>
              <div className="text-lg font-bold text-emerald-700">
                R$ {economiaBiologicaTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Índice BioAS (IQS Biológico)</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {laudoAtivo.iqsBiologico.toFixed(2)} <span className="text-sm font-normal text-slate-400">/ 1.00</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Classificação: <strong className="text-emerald-700">{laudoAtivo.classeSaude}</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Fósforo Orgânico Mineralizado</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {laudoAtivo.fosfatoOrgMineralizadoKgHa} <span className="text-sm font-normal text-slate-400">kg P/ha/ano</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Equivale a {mapSubstituidoKgHa.toFixed(1)} kg MAP/ha
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Enxofre Orgânico Mineralizado</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {laudoAtivo.enxofreOrgMineralizadoKgHa} <span className="text-sm font-normal text-slate-400">kg S/ha/ano</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Equivale a {gessoSubstituidoKgHa.toFixed(1)} kg gesso/ha
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Economia Biológica Total</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            R$ {economiaBiologicaTotalHa.toFixed(2)} <span className="text-sm font-normal text-slate-400">/ha</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Substituição natural de adubação solúvel
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Enzimas BioAS vs Calculadora de Economia Química */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Atividades Enzimáticas BioAS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Microscope className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Diagnóstico Enzimático por Talhão
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Padrão Embrapa Cerrados</span>
            </div>

            {/* Selector of Talhões */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
              {laudos.map((l) => {
                const isSelected = l.id === laudoAtivo.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLaudoAtivo(l)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{l.talhao.split(' - ')[0]}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          l.classeSaude === 'ALTA'
                            ? 'bg-emerald-100 text-emerald-800'
                            : l.classeSaude === 'MEDIA'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {l.classeSaude}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 truncate">{l.areaHa} ha • {l.argilaPct}% argila</div>
                  </button>
                );
              })}
            </div>

            {/* Three BioAS Enzyme Indicators */}
            <div className="space-y-4 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
              {/* Beta-Glicosidase */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    Beta-Glicosidase (Ciclo do Carbono e Matéria Orgânica)
                  </span>
                  <span className="font-mono font-bold text-emerald-800">
                    {laudoAtivo.betaGlicosidase} mg PNP/kg/h <span className="text-slate-400 text-[10px]">(Ref: 180)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, (laudoAtivo.betaGlicosidase / 180) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Arilsulfatase */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                    Arilsulfatase (Ciclo do Enxofre e Palhada)
                  </span>
                  <span className="font-mono font-bold text-amber-800">
                    {laudoAtivo.arilsulfatase} mg PNP/kg/h <span className="text-slate-400 text-[10px]">(Ref: 70)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, (laudoAtivo.arilsulfatase / 70) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Fosfatase Ácida */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    Fosfatase Ácida (Solubilização de Fósforo Orgânico)
                  </span>
                  <span className="font-mono font-bold text-sky-800">
                    {laudoAtivo.fosfataseAcida} mg PNP/kg/h <span className="text-slate-400 text-[10px]">(Ref: 450)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-sky-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, (laudoAtivo.fosfataseAcida / 450) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Manejo Contextual & Resiliência ao Veranico */}
            <div className="mt-4 p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Resiliência Agronômica ao Estresse Hídrico
                </span>
                <span className="text-[11px] font-bold text-slate-800">{laudoAtivo.resilienciaEstresseHidrico}</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Histórico de manejo: <strong className="text-slate-900">{laudoAtivo.tipoManejo}</strong>. A rotação continuada com braquiária e inoculação biológica promoveu abundante rede de hifas de fungos micorrízicos arbusculares (FMA) e exsudação radicular rica em açúcares, alimentando o microbioma benéfico que recicla fósforo e enxofre em profundidade.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Fertilizer Economic Replacement Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Valoração da Fertilidade Biológica
                </h2>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                Economia Real
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Simule a substituição de fertilizantes solúveis de alto custo (MAP e Gesso) pelos nutrientes disponibilizados biologicamente.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Cotação do Fertilizante Fosfatado MAP (R$/t)</label>
                <input
                  type="number"
                  step="100"
                  value={cotacaoMAPTon}
                  onChange={(e) => setCotacaoMAPTon(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Cotação do Gesso Agrícola (R$/t)</label>
                <input
                  type="number"
                  step="20"
                  value={cotacaoGessoTon}
                  onChange={(e) => setCotacaoGessoTon(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Substitution Results Output Box */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Economia de Fósforo (MAP):</span>
                <span className="text-sky-800 font-bold">
                  {mapSubstituidoKgHa.toFixed(1)} kg MAP/ha (R$ {economiaMAPReaisHa.toFixed(2)}/ha)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Economia de Enxofre (Gesso):</span>
                <span className="text-amber-800 font-bold">
                  {gessoSubstituidoKgHa.toFixed(1)} kg Gesso/ha (R$ {economiaGessoReaisHa.toFixed(2)}/ha)
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Economia Biológica Total:</span>
                <span className="text-emerald-700 font-bold text-base">
                  R$ {economiaBiologicaTotalHa.toFixed(2)} /ha
                </span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Economia Total no Talhão ({laudoAtivo.areaHa} ha)</div>
                  <div className="text-xl font-black text-emerald-900">
                    R$ {economiaBiologicaTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <Coins className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default BioanaliseSoloModule;
