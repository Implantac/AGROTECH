import React, { useState } from 'react';
import {
  Recycle,
  Thermometer,
  Flame,
  CheckCircle2,
  Calculator,
  Download,
  Layers
} from 'lucide-react';

interface LeiraCompostagem {
  id: string;
  identificacao: string;
  composicaoMatriz: string;
  volumeTotalTon: number;
  diasCompostagem: number;
  temperaturaC: number;
  umidadePct: number;
  relacaoCN: string;
  teorNpct: number;
  teorP2O5pct: number;
  teorK2Opct: number;
  teorMateriaOrganicaPct: number;
  statusProcesso: 'FASE_TERMOFILICA' | 'MATURACAO' | 'PRONTO_APLICACAO';
}

const LEIRAS_INICIAIS: LeiraCompostagem[] = [
  {
    id: 'lei-01',
    identificacao: 'Leira 01 - Cama de Frango + Pó de Rocha Basáltico',
    composicaoMatriz: '60% Cama de Frango + 25% Palha de Milho + 15% Remineralizador',
    volumeTotalTon: 1500,
    diasCompostagem: 65,
    temperaturaC: 58.5,
    umidadePct: 52,
    relacaoCN: '26:1 (Ideal)',
    teorNpct: 2.2,
    teorP2O5pct: 3.5,
    teorK2Opct: 2.8,
    teorMateriaOrganicaPct: 38.0,
    statusProcesso: 'PRONTO_APLICACAO',
  },
  {
    id: 'lei-02',
    identificacao: 'Leira 02 - Esterco Bovino Confinamento + Torta de Filtro',
    composicaoMatriz: '50% Esterco de Confinamento + 35% Torta de Filtro + 15% Cinzas',
    volumeTotalTon: 2200,
    diasCompostagem: 42,
    temperaturaC: 63.0,
    umidadePct: 56,
    relacaoCN: '28:1 (Termofílica)',
    teorNpct: 1.9,
    teorP2O5pct: 2.8,
    teorK2Opct: 2.1,
    teorMateriaOrganicaPct: 34.5,
    statusProcesso: 'FASE_TERMOFILICA',
  },
  {
    id: 'lei-03',
    identificacao: 'Leira 03 - Biofertilizante DLS + Bagaço Enriquecido',
    composicaoMatriz: '40% Dejetos Suínos + 40% Bagaço de Cana + 20% Fosfato Natural',
    volumeTotalTon: 1800,
    diasCompostagem: 80,
    temperaturaC: 45.0,
    umidadePct: 48,
    relacaoCN: '22:1 (Humificada)',
    teorNpct: 2.4,
    teorP2O5pct: 3.8,
    teorK2Opct: 1.8,
    teorMateriaOrganicaPct: 42.0,
    statusProcesso: 'MATURACAO',
  },
];

export const CompostagemCircularModule: React.FC = () => {
  const [leiras] = useState<LeiraCompostagem[]>(LEIRAS_INICIAIS);
  const [leiraSelecionada, setLeiraSelecionada] = useState<LeiraCompostagem>(LEIRAS_INICIAIS[0]);

  // Simulador de Economia e Substituição de NPK Mineral
  const [doseAplicacaoTha, setDoseAplicacaoTha] = useState<number>(4.0); // t/ha
  const [areaDestinoHa, setAreaDestinoHa] = useState<number>(300); // ha
  const [precoKgMAP, setPrecoKgMAP] = useState<number>(4.20); // R$/kg MAP 11-52
  const [precoKgKCl, setPrecoKgKCl] = useState<number>(3.10); // R$/kg KCl 60%
  const [precoKgUreia] = useState<number>(2.80); // R$/kg Ureia 45%
  const [custoCompostoTon, setCustoCompostoTon] = useState<number>(160.0); // R$/t posto no talhão

  // Cálculos Técnicos do Aporte Nutricional
  const kgCompostoHa = doseAplicacaoTha * 1000;
  const aporteN = Number((kgCompostoHa * (leiraSelecionada.teorNpct / 100)).toFixed(1));
  const aporteP2O5 = Number((kgCompostoHa * (leiraSelecionada.teorP2O5pct / 100)).toFixed(1));
  const aporteK2O = Number((kgCompostoHa * (leiraSelecionada.teorK2Opct / 100)).toFixed(1));

  // Equivalentes em Adubo Mineral
  const eqMAPkg = Number((aporteP2O5 / 0.52).toFixed(1));
  const valorEqMAP = eqMAPkg * precoKgMAP;
  
  const eqKClkg = Number((aporteK2O / 0.60).toFixed(1));
  const valorEqKCl = eqKClkg * precoKgKCl;

  const eqUreiakg = Number(((aporteN * 0.45) / 0.45).toFixed(1));
  const valorEqUreia = Number((eqUreiakg * precoKgUreia).toFixed(2));

  const economiaMineralHa = Number((valorEqMAP + valorEqKCl + valorEqUreia).toFixed(2));
  const custoCompostoHa = Number((doseAplicacaoTha * custoCompostoTon).toFixed(2));
  
  const lucroLiquidoHa = Number((economiaMineralHa - custoCompostoHa).toFixed(2));
  const economiaTotalTalhao = Number((lucroLiquidoHa * areaDestinoHa).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl">
              <Recycle className="w-6 h-6 text-amber-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Compostagem Termofílica & Biofertilizantes Circulares
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  Economia Circular
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Valorização de cama de frango, dejetos suínos e esterco com pó de rocha para substituição de adubação química NPK.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laudo Laboratorial de Análise de Composto Orgânico exportado com sucesso!')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              Laudo do Composto
            </button>
            <div className="text-right pl-4 border-l border-slate-200 hidden sm:block">
              <div className="text-[11px] text-slate-500">Economia NPK</div>
              <div className="text-lg font-bold text-emerald-700">R$ {lucroLiquidoHa.toFixed(2)}/ha</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Aporte de Fósforo (P₂O₅)</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {aporteP2O5} <span className="text-sm font-normal text-slate-400">kg/ha</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Equivale a {eqMAPkg} kg/ha de MAP 11-52
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Aporte de Potássio (K₂O)</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {aporteK2O} <span className="text-sm font-normal text-slate-400">kg/ha</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Equivale a {eqKClkg} kg/ha de Cloreto de Potássio KCl
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Economia Total ({areaDestinoHa} ha)</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            R$ {economiaTotalTalhao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Lucro líquido sobre o custo do composto
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Status da Leira</div>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                leiraSelecionada.statusProcesso === 'PRONTO_APLICACAO'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {leiraSelecionada.statusProcesso === 'PRONTO_APLICACAO' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PRONTO P/ DISPERSÃO
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5" />
                  FASE TERMOFÍLICA ({leiraSelecionada.temperaturaC}°C)
                </>
              )}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            {leiraSelecionada.volumeTotalTon.toLocaleString('pt-BR')} t maturadas
          </div>
        </div>
      </div>

      {/* Main Dual Column: Leiras vs Calculadora */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Leiras & Biologia da Compostagem (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Pátio de Compostagem & Leiras Termofílicas
                </h2>
              </div>
              <span className="text-xs text-slate-500">Monitoramento IoT de Temperatura</span>
            </div>

            {/* List of Windrows */}
            <div className="space-y-3 mb-6">
              {leiras.map((leira) => {
                const isSelected = leira.id === leiraSelecionada.id;
                return (
                  <div
                    key={leira.id}
                    onClick={() => setLeiraSelecionada(leira)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-400 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                          <Recycle className="w-4 h-4 text-amber-700" />
                          {leira.identificacao}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {leira.composicaoMatriz}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Volume</div>
                          <div className="text-sm font-bold text-slate-900">{leira.volumeTotalTon.toLocaleString('pt-BR')} t</div>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                            leira.statusProcesso === 'PRONTO_APLICACAO'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {leira.statusProcesso === 'PRONTO_APLICACAO' ? 'Pronto' : 'Ativa'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Physical & Chemical Parameters */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-700" />
                Parâmetros Físico-Químicos da Leira ({leiraSelecionada.identificacao})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Temperatura Termofílica</div>
                  <div className="text-lg font-bold text-amber-700 mt-1">
                    {leiraSelecionada.temperaturaC}°C
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">&gt; 55°C elimina sementes de pragas</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Umidade Atual</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {leiraSelecionada.umidadePct}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Faixa ideal: 50 a 60%</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Relação C:N</div>
                  <div className="text-lg font-bold text-emerald-700 mt-1">
                    {leiraSelecionada.relacaoCN}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Sem volatilização de amônia</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Matéria Orgânica</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {leiraSelecionada.teorMateriaOrganicaPct}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Húmus e microbiota rica</div>
                </div>
              </div>

              <div className="p-3 bg-white border border-emerald-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Enriquecido com <strong>Pó de Rocha Basáltico (Rochagem)</strong> para liberação gradual de silício e micronutrientes.</span>
                </span>
                <span className="text-emerald-700 font-semibold shrink-0 ml-2">{leiraSelecionada.diasCompostagem} dias de ciclo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: NPK Substitution Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Simulador de Substituição de Adubo Mineral
                </h2>
              </div>
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                Economia Real
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Calcule a economia em fertilizantes minerais importados ao espalhar composto orgânico maturado na lavoura.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Dose de Aplicação a Lanço (t/ha)</label>
                <input
                  type="number"
                  step="0.5"
                  value={doseAplicacaoTha}
                  onChange={(e) => setDoseAplicacaoTha(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Área Total de Destino (ha)</label>
                <input
                  type="number"
                  step="50"
                  value={areaDestinoHa}
                  onChange={(e) => setAreaDestinoHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">MAP 11-52 (R$/kg)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={precoKgMAP}
                    onChange={(e) => setPrecoKgMAP(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-medium block mb-1">KCl 60% (R$/kg)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={precoKgKCl}
                    onChange={(e) => setPrecoKgKCl(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Custo Total Composto Posto (R$/t)</label>
                <input
                  type="number"
                  step="10"
                  value={custoCompostoTon}
                  onChange={(e) => setCustoCompostoTon(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Financial Result Card */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Valor Adubo Mineral Substituído:</span>
                <span className="text-rose-700 font-semibold line-through">
                  R$ {(economiaMineralHa * areaDestinoHa).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">(-) Custo do Composto Aplicado:</span>
                <span className="text-slate-700 font-semibold">
                  R$ {(custoCompostoHa * areaDestinoHa).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Economia Líquida da Lavoura:</span>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-700">
                    R$ {economiaTotalTalhao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">
                    R$ {lucroLiquidoHa.toFixed(2)}/ha de economia direta
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
export default CompostagemCircularModule;
