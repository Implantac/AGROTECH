import React, { useState } from 'react';
import {
  Mountain,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  Download,
  Layers,
  Scale,
  DollarSign,
  TrendingUp,
  Truck
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

interface FonteRemineralizador {
  id: string;
  nomeComercial: string;
  origemGeologica: string;
  pedreiraMineradora: string;
  distanciaKm: number;
  precoPedreiraTonRs: number;
  teorK2Opct: number;
  teorCaOpct: number;
  teorMgOpct: number;
  teorSiO2pct: number;
  somaBasesPct: number;
  passanteMalha100Pct: number;
  metaisPesadosConformes: boolean;
  statusRegistroMAPA: 'HOMOLOGADO_IN_05' | 'EM_ANALISE';
}

const FONTES_INICIAIS: FonteRemineralizador[] = [
  {
    id: 'rem-01',
    nomeComercial: 'Basalto Silicático Fino (Cerrado Rock)',
    origemGeologica: 'Basalto Toleítico Continental',
    pedreiraMineradora: 'Mineração Vale do Teles Pires - Sorriso/MT',
    distanciaKm: 80,
    precoPedreiraTonRs: 65.0,
    teorK2Opct: 4.2,
    teorCaOpct: 8.5,
    teorMgOpct: 4.8,
    teorSiO2pct: 48.0,
    somaBasesPct: 17.5,
    passanteMalha100Pct: 78.5,
    metaisPesadosConformes: true,
    statusRegistroMAPA: 'HOMOLOGADO_IN_05',
  },
  {
    id: 'rem-02',
    nomeComercial: 'Flogopitito Potássico K-Rock',
    origemGeologica: 'Rocha Ultramáfica Alcalina',
    pedreiraMineradora: 'Complexo Mineroindustrial Ipirá/BA',
    distanciaKm: 650,
    precoPedreiraTonRs: 110.0,
    teorK2Opct: 8.8,
    teorCaOpct: 4.2,
    teorMgOpct: 12.0,
    teorSiO2pct: 41.5,
    somaBasesPct: 25.0,
    passanteMalha100Pct: 84.0,
    metaisPesadosConformes: true,
    statusRegistroMAPA: 'HOMOLOGADO_IN_05',
  },
  {
    id: 'rem-03',
    nomeComercial: 'Brecha Vulcânica Biocálcica',
    origemGeologica: 'Piroclasto Vulcânico Intrusivo',
    pedreiraMineradora: 'Mineração Serra Dourada - Goiás',
    distanciaKm: 320,
    precoPedreiraTonRs: 75.0,
    teorK2Opct: 3.2,
    teorCaOpct: 11.0,
    teorMgOpct: 5.5,
    teorSiO2pct: 44.0,
    somaBasesPct: 19.7,
    passanteMalha100Pct: 72.0,
    metaisPesadosConformes: true,
    statusRegistroMAPA: 'HOMOLOGADO_IN_05',
  },
];

export const RemineralizadoresRochagemModule: React.FC = () => {
  const [fontes] = useState<FonteRemineralizador[]>(FONTES_INICIAIS);
  const [fonteSelecionada, setFonteSelecionada] = useState<FonteRemineralizador>(FONTES_INICIAIS[0]);

  // Simulador de Frete, Dose e ROI Trienal
  const [doseAplicacaoTha, setDoseAplicacaoTha] = useState<number>(4.0); // t/ha
  const [areaDestinoHa, setAreaDestinoHa] = useState<number>(500); // ha
  const [custoFreteTonKm, setCustoFreteTonKm] = useState<number>(0.5625); // R$/t.km (~R$ 45/t para 80km)
  const [beneficioTrienioPorHa, setBeneficioTrienioPorHa] = useState<number>(890.0); // R$/ha em KCl economizado e silício

  // Cálculos Técnicos do Remineralizador
  const fretePorTon = Number((fonteSelecionada.distanciaKm * custoFreteTonKm).toFixed(2));
  const custoTotalTonPosto = Number((fonteSelecionada.precoPedreiraTonRs + fretePorTon).toFixed(2));
  const investimentoTotalHa = Number((doseAplicacaoTha * custoTotalTonPosto).toFixed(2));
  const investimentoTotalTalhoes = Number((investimentoTotalHa * areaDestinoHa).toFixed(2));

  // Aporte Nutricional Total (kg/ha)
  const aporteTotalK2O = Number((doseAplicacaoTha * 1000 * (fonteSelecionada.teorK2Opct / 100)).toFixed(1));
  const aporteTotalSiO2 = Number((doseAplicacaoTha * 1000 * (fonteSelecionada.teorSiO2pct / 100)).toFixed(1));
  const aporteTotalCaMg = Number((doseAplicacaoTha * 1000 * ((fonteSelecionada.teorCaOpct + fonteSelecionada.teorMgOpct) / 100)).toFixed(1));

  // ROI Trienal (Residual de 3 anos de liberação)
  const roiTrienalPct = Number((((beneficioTrienioPorHa - investimentoTotalHa) / investimentoTotalHa) * 100).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-emerald-950 border border-stone-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl">
                <Mountain className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Remineralizadores de Solo & Rochagem (IN 05/2016 MAPA)
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Lei 12.890/13
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Pós de rochas basálticas regionais, condicionamento de solo, silício solúvel e liberação gradual de potássio.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laudo Técnico Mineral de Conformidade MAPA exportado com sucesso!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 rounded-xl text-sm font-medium transition shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Laudo Mineral MAPA
            </button>
            <div className="text-right pl-4 border-l border-emerald-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">ROI Trienal</div>
              <div className="text-xl font-bold text-emerald-300">+{roiTrienalPct}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Soma de Bases (CaO+MgO+K₂O)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {fonteSelecionada.somaBasesPct}%
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Exigência MAPA: &ge; 9,0% (Aprovado com folga)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Silício Solúvel (SiO₂)</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">
            {aporteTotalSiO2.toLocaleString('pt-BR')} <span className="text-sm font-normal text-stone-400">kg/ha</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Induz resistência da parede celular a fungos
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Custo Total Posto Lavoura</div>
          <div className="text-2xl font-bold text-white mt-1">
            R$ {custoTotalTonPosto.toFixed(2)} <span className="text-sm font-normal text-stone-400">/ton</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            R$ {fonteSelecionada.precoPedreiraTonRs} pedreira + R$ {fretePorTon.toFixed(2)} frete
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Status Legal MAPA</div>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              HOMOLOGADO IN 05/2016
            </span>
          </div>
          <div className="text-xs text-stone-500 mt-1 truncate">
            Metais pesados (As, Cd, Pb, Hg) dentro da norma
          </div>
        </div>
      </div>

      {/* Main Dual Column: Fontes Minerais vs Simulador */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Fontes Regionais de Rochagem (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Jazidas & Pedreiras de Rochagem Regionais
                </h2>
              </div>
              <span className="text-xs text-stone-400">Embrapa Cerrados / AGROMINERAIS</span>
            </div>

            {/* List of Quarries */}
            <div className="space-y-3 mb-6">
              {fontes.map((f) => {
                const isSelected = f.id === fonteSelecionada.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setFonteSelecionada(f)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          <Mountain className="w-4 h-4 text-emerald-400" />
                          {f.nomeComercial}
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          {f.pedreiraMineradora} • Distância: <span className="text-white font-medium">{f.distanciaKm} km</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-stone-400">K₂O Total</div>
                          <div className="text-sm font-bold text-emerald-400">{f.teorK2Opct}%</div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-stone-800 text-stone-200 border border-stone-700 rounded-lg">
                          R$ {f.precoPedreiraTonRs}/t
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Granulometric and Geochemical Table */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Laudo Geoquímico Detalhado ({fonteSelecionada.nomeComercial})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Potássio (K₂O)</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">
                    {fonteSelecionada.teorK2Opct}%
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{aporteTotalK2O} kg/ha K₂O total</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Silício (SiO₂)</div>
                  <div className="text-lg font-bold text-cyan-300 mt-1">
                    {fonteSelecionada.teorSiO2pct}%
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Fortalece colmos e folhas</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Cálcio + Magnésio</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {(fonteSelecionada.teorCaOpct + fonteSelecionada.teorMgOpct).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{aporteTotalCaMg} kg/ha CaO+MgO</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Granulometria #100</div>
                  <div className="text-lg font-bold text-amber-300 mt-1">
                    {fonteSelecionada.passanteMalha100Pct}%
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Fração ultrafina reativa</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-lg text-xs text-stone-300">
                💎 <strong>Efeito Residual Trienal:</strong> Diferente do KCl 60% que lixivia facilmente com chuvas tropicais intensas, o remineralizador silicatado libera nutrientes de forma contínua por 3 a 5 safras e eleva a CTC do solo de forma permanente.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Freight & Triennial ROI Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Simulador de Viabilidade & Frete
                </h2>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
                Logística Posta
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              O frete rodoviário é a principal variável da rochagem. Simule a dose e a distância para calcular o retorno econômico.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Dose de Pó de Rocha a Lanço (t/ha)</label>
                <input
                  type="number"
                  step="0.5"
                  value={doseAplicacaoTha}
                  onChange={(e) => setDoseAplicacaoTha(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Área Total do Talhão (ha)</label>
                <input
                  type="number"
                  step="50"
                  value={areaDestinoHa}
                  onChange={(e) => setAreaDestinoHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Custo do Frete Rodoviário (R$/ton.km)</label>
                <input
                  type="number"
                  step="0.05"
                  value={custoFreteTonKm}
                  onChange={(e) => setCustoFreteTonKm(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Benefício Econômico Trienal Esperado (R$/ha)</label>
                <input
                  type="number"
                  step="50"
                  value={beneficioTrienioPorHa}
                  onChange={(e) => setBeneficioTrienioPorHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Financial Results Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Investimento Total na Lavoura:</span>
                <span className="text-white font-semibold">
                  R$ {investimentoTotalTalhoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Custo por Hectare:</span>
                <span className="text-stone-300 font-bold">R$ {investimentoTotalHa.toFixed(2)}/ha</span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Retorno sobre Investimento (ROI):</span>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-300">+{roiTrienalPct}%</div>
                  <div className="text-[10px] text-emerald-500">
                    Lucro líquido de R$ {(beneficioTrienioPorHa - investimentoTotalHa).toFixed(2)}/ha em 3 safras
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
