import React, { useState } from 'react';
import {
  Flower2,
  CheckCircle2,
  Calculator,
  Download,
  Layers,
  Wheat
} from 'lucide-react';

interface MixCobertura {
  id: string;
  nomeMix: string;
  especiesConsorciadas: string;
  finalidadePrincipal: string;
  fitomassaSecaTha: number;
  profundidadeRaizesMetros: number;
  nFixadoBiologicoKgHa: number;
  kCicladoProfundoKgHa: number;
  pMobilizadoRizosferaKgHa: number;
  supressaoDaninhasPct: number;
  reducaoNematoidesPct: number;
  custoSementeHaRs: number;
  statusCiclo: 'PLENO_DESENVOLVIMENTO' | 'PONTO_DE_ROLAGEM' | 'MANEJO_DESSECACAO';
}

const MIXES_INICIAIS: MixCobertura[] = [
  {
    id: 'mix-01',
    nomeMix: 'Mix 01 - Crotalária + Nabo + Milheto ADR 300',
    especiesConsorciadas: 'Crotalaria spectabilis (12 kg) + Nabo Forrageiro (4 kg) + Milheto (8 kg/ha)',
    finalidadePrincipal: 'Descompactação Radicular Profunda & Controle de Nematoides',
    fitomassaSecaTha: 9.5,
    profundidadeRaizesMetros: 2.1,
    nFixadoBiologicoKgHa: 140,
    kCicladoProfundoKgHa: 185,
    pMobilizadoRizosferaKgHa: 28,
    supressaoDaninhasPct: 88,
    reducaoNematoidesPct: 75,
    custoSementeHaRs: 260.0,
    statusCiclo: 'PONTO_DE_ROLAGEM',
  },
  {
    id: 'mix-02',
    nomeMix: 'Mix 02 - Braquiária Ruziziensis + Guandu Anão',
    especiesConsorciadas: 'Brachiaria ruziziensis cv. Integra (10 kg) + Cajanus cajan (15 kg/ha)',
    finalidadePrincipal: 'Palhada de Longa Durabilidade (Alta C:N) & FBN para Soja',
    fitomassaSecaTha: 11.2,
    profundidadeRaizesMetros: 2.4,
    nFixadoBiologicoKgHa: 175,
    kCicladoProfundoKgHa: 210,
    pMobilizadoRizosferaKgHa: 32,
    supressaoDaninhasPct: 92,
    reducaoNematoidesPct: 60,
    custoSementeHaRs: 295.0,
    statusCiclo: 'PLENO_DESENVOLVIMENTO',
  },
  {
    id: 'mix-03',
    nomeMix: 'Mix 03 - Centeio + Nabo + Trevo Branco',
    especiesConsorciadas: 'Secale cereale (25 kg) + Raphanus sativus (5 kg) + Trifolium (3 kg/ha)',
    finalidadePrincipal: 'Alelopatia contra Capim-Amargoso & Buva Resistente',
    fitomassaSecaTha: 8.2,
    profundidadeRaizesMetros: 1.8,
    nFixadoBiologicoKgHa: 115,
    kCicladoProfundoKgHa: 160,
    pMobilizadoRizosferaKgHa: 24,
    supressaoDaninhasPct: 96,
    reducaoNematoidesPct: 50,
    custoSementeHaRs: 240.0,
    statusCiclo: 'MANEJO_DESSECACAO',
  },
];

export const PlantasCoberturaBiomassaModule: React.FC = () => {
  const [mixes] = useState<MixCobertura[]>(MIXES_INICIAIS);
  const [mixSelecionado, setMixSelecionado] = useState<MixCobertura>(MIXES_INICIAIS[0]);

  // Simulador de Área e Ciclagem Nutricional
  const [areaPlantioHa, setAreaPlantioHa] = useState<number>(600);
  const [precoKgUreia, setPrecoKgUreia] = useState<number>(2.80);
  const [precoKgKCl, setPrecoKgKCl] = useState<number>(3.10);
  const [precoKgMAP, setPrecoKgMAP] = useState<number>(4.20);

  // Cálculos Financeiros da Ciclagem
  const eqUreia = Number((mixSelecionado.nFixadoBiologicoKgHa / 0.45).toFixed(1));
  const valorEqUreia = Number((eqUreia * precoKgUreia).toFixed(2));

  const eqKCl = Number((mixSelecionado.kCicladoProfundoKgHa / 0.60).toFixed(1));
  const valorEqKCl = Number((eqKCl * precoKgKCl).toFixed(2));

  const eqMAP = Number((mixSelecionado.pMobilizadoRizosferaKgHa / 0.52).toFixed(1));
  const valorEqMAP = Number((eqMAP * precoKgMAP).toFixed(2));

  const valorTotalCicladoHa = Number((valorEqUreia + valorEqKCl + valorEqMAP).toFixed(2));
  const beneficioLiquidoHa = Number((valorTotalCicladoHa - mixSelecionado.custoSementeHaRs).toFixed(2));
  const economiaTotalTalhao = Number((beneficioLiquidoHa * areaPlantioHa).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
              <Flower2 className="w-6 h-6 text-emerald-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Plantas de Cobertura, Biomassa & Descompactação Biológica
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  Plantio Direto
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Mixes de cover crops para estruturação do solo, ciclagem de NPK, controle de nematoides e supressão de invasoras.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Plano de Manejo de Plantas de Cobertura e Ciclagem de NPK exportado com sucesso!')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              Plano de Cobertura
            </button>
            <div className="text-right pl-4 border-l border-slate-200 hidden sm:block">
              <div className="text-[11px] text-slate-500">Nutrientes Ciclados</div>
              <div className="text-lg font-bold text-emerald-700">R$ {valorTotalCicladoHa.toFixed(2)}/ha</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Fitomassa Seca Acumulada</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {mixSelecionado.fitomassaSecaTha} <span className="text-sm font-normal text-slate-400">t/ha MS</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Solo protegido a 28°C no verão
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Descompactação Biológica</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {mixSelecionado.profundidadeRaizesMetros} <span className="text-sm font-normal text-slate-400">metros</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Dispensa escarificador mecânico
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Benefício Líquido Total ({areaPlantioHa} ha)</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            R$ {economiaTotalTalhao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-700 mt-1">
            R$ {beneficioLiquidoHa.toFixed(2)}/ha economizados
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Controle Sanitário</div>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              -{mixSelecionado.reducaoNematoidesPct}% NEMATOIDES
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            {mixSelecionado.supressaoDaninhasPct}% supressão de invasoras
          </div>
        </div>
      </div>

      {/* Main Dual Column: Mixes vs Calculadora */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lista de Mixes de Cobertura (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Consórcios e Mixes de Entressafra
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Manejo Biológico de Solo</span>
            </div>

            {/* List of Mixes */}
            <div className="space-y-3 mb-6">
              {mixes.map((m) => {
                const isSelected = m.id === mixSelecionado.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setMixSelecionado(m)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                          <Flower2 className="w-4 h-4 text-emerald-700" />
                          {m.nomeMix}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {m.especiesConsorciadas}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          Alvo: <span className="text-slate-800 font-medium">{m.finalidadePrincipal}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Fitomassa</div>
                          <div className="text-sm font-bold text-emerald-700">{m.fitomassaSecaTha} t/ha</div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                          R$ {m.custoSementeHaRs}/ha
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nutrient Cycling Detail Card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                Ciclagem Biológica de Nutrientes ({mixSelecionado.nomeMix})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Nitrogênio Biológico (FBN)</div>
                  <div className="text-lg font-bold text-emerald-700 mt-1">
                    {mixSelecionado.nFixadoBiologicoKgHa} kg/ha N
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Equivale a {eqUreia} kg/ha de Ureia</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Potássio Ciclado Profundo</div>
                  <div className="text-lg font-bold text-sky-700 mt-1">
                    {mixSelecionado.kCicladoProfundoKgHa} kg/ha K₂O
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Equivale a {eqKCl} kg/ha de KCl 60%</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Fósforo Mobilizado</div>
                  <div className="text-lg font-bold text-amber-700 mt-1">
                    {mixSelecionado.pMobilizadoRizosferaKgHa} kg/ha P₂O₅
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Equivale a {eqMAP} kg/ha de MAP 11-52</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-lg text-xs text-slate-600">
                🌱 <strong>Alelopatia Natural:</strong> A cobertura morta densa do mix de plantas libera glucosinolatos e ácidos orgânicos que inibem a germinação de sementes invasoras fotoblásticas positivas, reduzindo em até 2 aplicações de herbicidas na dessecação da soja.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fertilizer Savings Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Simulador de Economia em Adubo
                </h2>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                Adubação Verde
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Calcule a economia em adubação de plantio gerada pela reciclagem biológica de NPK na rizosfera.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Área Total Plantada (ha)</label>
                <input
                  type="number"
                  step="50"
                  value={areaPlantioHa}
                  onChange={(e) => setAreaPlantioHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Ureia (R$/kg)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={precoKgUreia}
                    onChange={(e) => setPrecoKgUreia(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-medium block mb-1">KCl 60% (R$/kg)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={precoKgKCl}
                    onChange={(e) => setPrecoKgKCl(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-medium block mb-1">MAP (R$/kg)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={precoKgMAP}
                    onChange={(e) => setPrecoKgMAP(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Economic Results Box */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Valor de NPK Ciclado por Hectare:</span>
                <span className="text-emerald-700 font-bold text-sm">
                  R$ {valorTotalCicladoHa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ha
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">(-) Custo Sementes do Mix:</span>
                <span className="text-slate-800 font-semibold">
                  R$ {mixSelecionado.custoSementeHaRs.toFixed(2)}/ha
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Lucro Líquido Biológico:</span>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-700">
                    R$ {economiaTotalTalhao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-emerald-800">
                    R$ {beneficioLiquidoHa.toFixed(2)}/ha de retorno líquido
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
export default PlantasCoberturaBiomassaModule;
