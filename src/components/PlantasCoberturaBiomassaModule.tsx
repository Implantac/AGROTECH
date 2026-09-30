import React, { useState } from 'react';
import {
  Flower2,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  Download,
  Layers,
  TrendingUp,
  Sparkles,
  Thermometer,
  Wheat
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

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
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-950 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl">
                <Flower2 className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Plantas de Cobertura, Biomassa & Descompactação Biológica
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Sistema Plantio Direto
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Mixes de cover crops para estruturação do solo, ciclagem de NPK, controle de nematoides e supressão de invasoras.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Plano de Manejo de Plantas de Cobertura e Ciclagem de NPK exportado com sucesso!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-950/40"
            >
              <Download className="w-4 h-4" />
              Plano de Cobertura
            </button>
            <div className="text-right pl-4 border-l border-emerald-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Nutrientes Ciclados</div>
              <div className="text-xl font-bold text-emerald-300">R$ {valorTotalCicladoHa.toFixed(2)}/ha</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Fitomassa Seca Acumulada</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {mixSelecionado.fitomassaSecaTha} <span className="text-sm font-normal text-stone-400">t/ha MS</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Solo protegido a 28°C no verão (vs 46°C exposto)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Descompactação Biológica</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">
            {mixSelecionado.profundidadeRaizesMetros} <span className="text-sm font-normal text-stone-400">metros</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Raiz pivotante dispensa uso de escarificador mecânico
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Benefício Líquido Total ({areaPlantioHa} ha)</div>
          <div className="text-2xl font-bold text-white mt-1">
            R$ {economiaTotalTalhao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-400 mt-1">
            R$ {beneficioLiquidoHa.toFixed(2)}/ha de adubo químico economizado
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Controle Biológico Sanitário</div>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              -{mixSelecionado.reducaoNematoidesPct}% NEMATOIDES
            </span>
          </div>
          <div className="text-xs text-stone-500 mt-1 truncate">
            {mixSelecionado.supressaoDaninhasPct}% supressão de Buva e Amargoso
          </div>
        </div>
      </div>

      {/* Main Dual Column: Mixes vs Calculadora */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lista de Mixes de Cobertura (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Consórcios e Mixes de Entressafra
                </h2>
              </div>
              <span className="text-xs text-stone-400">Manejo Biológico de Solo</span>
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
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          <Flower2 className="w-4 h-4 text-emerald-400" />
                          {m.nomeMix}
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          {m.especiesConsorciadas}
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          Alvo: <span className="text-stone-300">{m.finalidadePrincipal}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-stone-400">Fitomassa</div>
                          <div className="text-sm font-bold text-emerald-400">{m.fitomassaSecaTha} t/ha</div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg">
                          R$ {m.custoSementeHaRs}/ha
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nutrient Cycling Detail Card */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Ciclagem Biológica de Nutrientes ({mixSelecionado.nomeMix})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Nitrogênio Biológico (FBN)</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">
                    {mixSelecionado.nFixadoBiologicoKgHa} kg/ha N
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Equivale a {eqUreia} kg/ha de Ureia</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Potássio Ciclado Profundo</div>
                  <div className="text-lg font-bold text-cyan-300 mt-1">
                    {mixSelecionado.kCicladoProfundoKgHa} kg/ha K₂O
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Equivale a {eqKCl} kg/ha de KCl 60%</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Fósforo Mobilizado</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">
                    {mixSelecionado.pMobilizadoRizosferaKgHa} kg/ha P₂O₅
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Equivale a {eqMAP} kg/ha de MAP 11-52</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-lg text-xs text-stone-300">
                🌱 <strong>Alelopatia Natural:</strong> A cobertura morta densa do mix de plantas libera glucosinolatos e ácidos orgânicos que inibem a germinação de sementes invasoras fotoblásticas positivas, reduzindo em até 2 aplicações de herbicidas na dessecação da soja.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fertilizer Savings Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Simulador de Economia em Adubo
                </h2>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
                Adubação Verde
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Calcule a economia em adubação de plantio gerada pela reciclagem biológica de NPK na rizosfera.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Área Total Plantada (ha)</label>
                <input
                  type="number"
                  step="50"
                  value={areaPlantioHa}
                  onChange={(e) => setAreaPlantioHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-stone-400 font-medium block mb-1">Ureia (R$/kg)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={precoKgUreia}
                    onChange={(e) => setPrecoKgUreia(Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2 py-1.5 text-white font-semibold focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-stone-400 font-medium block mb-1">KCl 60% (R$/kg)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={precoKgKCl}
                    onChange={(e) => setPrecoKgKCl(Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2 py-1.5 text-white font-semibold focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-stone-400 font-medium block mb-1">MAP (R$/kg)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={precoKgMAP}
                    onChange={(e) => setPrecoKgMAP(Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2 py-1.5 text-white font-semibold focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Economic Results Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Valor de NPK Ciclado por Hectare:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  R$ {valorTotalCicladoHa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ha
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">(-) Custo Sementes do Mix:</span>
                <span className="text-stone-300 font-semibold">
                  R$ {mixSelecionado.custoSementeHaRs.toFixed(2)}/ha
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Lucro Líquido Biológico:</span>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-300">
                    R$ {economiaTotalTalhao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-emerald-500">
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
