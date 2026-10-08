import React, { useState } from 'react';
import {
  Mountain,
  CheckCircle2,
  Calculator,
  Download,
  Layers
} from 'lucide-react';

interface FonteRochagem {
  id: string;
  nomeComercial: string;
  tipoRocha: string;
  pedreiraMineradora: string;
  distanciaKm: number;
  teorK2Opct: number;
  teorCaOpct: number;
  teorMgOpct: number;
  teorSiO2pct: number;
  somaBasesPct: number; // CaO + MgO + K2O (mínimo 9% MAPA)
  passanteMalha100Pct: number;
  precoPedreiraTonRs: number;
}

const FONTES_INICIAIS: FonteRochagem[] = [
  {
    id: 'fnt-01',
    nomeComercial: 'Basalto Fino Moído do Cerrado',
    tipoRocha: 'Basalto Alcalino / Diabásio',
    pedreiraMineradora: 'Mineração Mato Grosso Rochagem Ltda - Nova Mutum/MT',
    distanciaKm: 120,
    teorK2Opct: 3.8,
    teorCaOpct: 8.5,
    teorMgOpct: 5.2,
    teorSiO2pct: 48.0,
    somaBasesPct: 17.5,
    passanteMalha100Pct: 85,
    precoPedreiraTonRs: 95.0,
  },
  {
    id: 'fnt-02',
    nomeComercial: 'Glauconita Silicatada K-Verde',
    tipoRocha: 'Siltito Glauconítico',
    pedreiraMineradora: 'Mineração Verde Brasil - Goiás',
    distanciaKm: 480,
    teorK2Opct: 9.5,
    teorCaOpct: 2.1,
    teorMgOpct: 3.4,
    teorSiO2pct: 54.0,
    somaBasesPct: 15.0,
    passanteMalha100Pct: 92,
    precoPedreiraTonRs: 280.0,
  },
  {
    id: 'fnt-03',
    nomeComercial: 'Brecha Vulcânica Biomineral',
    tipoRocha: 'Brecha Piroclástica Alcalina',
    pedreiraMineradora: 'Pedreira Serra Dourada - Rondonópolis/MT',
    distanciaKm: 210,
    teorK2Opct: 4.5,
    teorCaOpct: 9.2,
    teorMgOpct: 4.8,
    teorSiO2pct: 46.5,
    somaBasesPct: 18.5,
    passanteMalha100Pct: 78,
    precoPedreiraTonRs: 110.0,
  },
];

export const RemineralizadoresRochagemModule: React.FC = () => {
  const [fontes] = useState<FonteRochagem[]>(FONTES_INICIAIS);
  const [fonteSelecionada, setFonteSelecionada] = useState<FonteRochagem>(FONTES_INICIAIS[0]);

  // Simulador de Frete e Aplicação
  const [doseAplicacaoTha, setDoseAplicacaoTha] = useState<number>(4.0); // 4 toneladas/ha
  const [areaDestinoHa, setAreaDestinoHa] = useState<number>(420); // 420 ha
  const [custoFreteTonKm, setCustoFreteTonKm] = useState<number>(0.38); // R$ 0,38 por ton.km
  const [beneficioTrienioPorHa, setBeneficioTrienioPorHa] = useState<number>(1850.0); // R$ 1.850/ha em KCL e MAP poupados em 3 anos

  // Cálculos Técnicos e Logísticos
  const fretePorTon = fonteSelecionada.distanciaKm * custoFreteTonKm;
  const custoTotalTonPosto = fonteSelecionada.precoPedreiraTonRs + fretePorTon;
  const investimentoTotalHa = custoTotalTonPosto * doseAplicacaoTha;
  const investimentoTotalTalhoes = investimentoTotalHa * areaDestinoHa;

  // Aporte Nutricional em kg/ha na Dose
  const aporteTotalK2O = Math.round((doseAplicacaoTha * 1000) * (fonteSelecionada.teorK2Opct / 100));
  const aporteTotalSiO2 = Math.round((doseAplicacaoTha * 1000) * (fonteSelecionada.teorSiO2pct / 100));
  const aporteTotalCaMg = Math.round(
    (doseAplicacaoTha * 1000) * ((fonteSelecionada.teorCaOpct + fonteSelecionada.teorMgOpct) / 100)
  );

  // Retorno sobre o investimento (ROI Trienal)
  const roiTrienalPct = Number((((beneficioTrienioPorHa - investimentoTotalHa) / investimentoTotalHa) * 100).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
              <Mountain className="w-6 h-6 text-emerald-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Remineralizadores de Solo & Rochagem (IN 05/2016 MAPA)
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  Lei 12.890/13
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Pós de rochas basálticas regionais, condicionamento de solo, silício solúvel e liberação gradual de potássio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laudo Técnico Mineral de Conformidade MAPA exportado com sucesso!')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-medium transition cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              Laudo Mineral MAPA
            </button>
            <div className="text-right pl-4 border-l border-slate-200 hidden sm:block">
              <div className="text-[11px] text-slate-500">ROI Trienal</div>
              <div className="text-lg font-bold text-emerald-700">+{roiTrienalPct}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Soma de Bases (CaO+MgO+K₂O)</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {fonteSelecionada.somaBasesPct}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Exigência MAPA: &ge; 9,0% (Conforme)
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Silício Solúvel (SiO₂)</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {aporteTotalSiO2.toLocaleString('pt-BR')} <span className="text-sm font-normal text-slate-400">kg/ha</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Induz resistência da parede celular
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Custo Total Posto Lavoura</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            R$ {custoTotalTonPosto.toFixed(2)} <span className="text-sm font-normal text-slate-400">/ton</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            R$ {fonteSelecionada.precoPedreiraTonRs} pedreira + R$ {fretePorTon.toFixed(2)} frete
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Status Legal MAPA</div>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              HOMOLOGADO IN 05/2016
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            Metais pesados (As, Cd, Pb, Hg) conformes
          </div>
        </div>
      </div>

      {/* Main Dual Column: Fontes Minerais vs Simulador */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Fontes Regionais de Rochagem (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Jazidas & Pedreiras de Rochagem Regionais
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Embrapa Cerrados</span>
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
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                          <Mountain className="w-4 h-4 text-emerald-700" />
                          {f.nomeComercial}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {f.pedreiraMineradora} • Distância: <span className="text-slate-800 font-medium">{f.distanciaKm} km</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-500">K₂O Total</div>
                          <div className="text-sm font-bold text-emerald-700">{f.teorK2Opct}%</div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 rounded-lg">
                          R$ {f.precoPedreiraTonRs}/t
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Granulometric and Geochemical Table */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                Laudo Geoquímico Detalhado ({fonteSelecionada.nomeComercial})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Potássio (K₂O)</div>
                  <div className="text-lg font-bold text-emerald-700 mt-1">
                    {fonteSelecionada.teorK2Opct}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{aporteTotalK2O} kg/ha K₂O total</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Silício (SiO₂)</div>
                  <div className="text-lg font-bold text-sky-700 mt-1">
                    {fonteSelecionada.teorSiO2pct}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Fortalece colmos e folhas</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Cálcio + Magnésio</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {(fonteSelecionada.teorCaOpct + fonteSelecionada.teorMgOpct).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{aporteTotalCaMg} kg/ha CaO+MgO</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Granulometria #100</div>
                  <div className="text-lg font-bold text-amber-700 mt-1">
                    {fonteSelecionada.passanteMalha100Pct}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Fração ultrafina reativa</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-lg text-xs text-slate-600">
                💎 <strong>Efeito Residual Trienal:</strong> Diferente do KCl 60% que lixivia facilmente com chuvas tropicais intensas, o remineralizador silicatado libera nutrientes de forma contínua por 3 a 5 safras e eleva a CTC do solo de forma permanente.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Freight & Triennial ROI Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Simulador de Viabilidade & Frete
                </h2>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                Logística Posta
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              O frete rodoviário é a principal variável da rochagem. Simule a dose e a distância para calcular o retorno econômico.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Dose de Pó de Rocha a Lanço (t/ha)</label>
                <input
                  type="number"
                  step="0.5"
                  value={doseAplicacaoTha}
                  onChange={(e) => setDoseAplicacaoTha(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Área Total do Talhão (ha)</label>
                <input
                  type="number"
                  step="50"
                  value={areaDestinoHa}
                  onChange={(e) => setAreaDestinoHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Custo do Frete Rodoviário (R$/ton.km)</label>
                <input
                  type="number"
                  step="0.05"
                  value={custoFreteTonKm}
                  onChange={(e) => setCustoFreteTonKm(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Benefício Econômico Trienal Esperado (R$/ha)</label>
                <input
                  type="number"
                  step="50"
                  value={beneficioTrienioPorHa}
                  onChange={(e) => setBeneficioTrienioPorHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Financial Results Box */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Investimento Total na Lavoura:</span>
                <span className="text-slate-900 font-semibold">
                  R$ {investimentoTotalTalhoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Custo por Hectare:</span>
                <span className="text-slate-800 font-bold">R$ {investimentoTotalHa.toFixed(2)}/ha</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Retorno sobre Investimento (ROI):</span>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-700">+{roiTrienalPct}%</div>
                  <div className="text-[10px] text-emerald-800">
                    Lucro de R$ {(beneficioTrienioPorHa - investimentoTotalHa).toFixed(2)}/ha em 3 safras
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
export default RemineralizadoresRochagemModule;
