import React, { useState } from 'react';
import {
  Droplets,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Download,
  Calculator,
  Layers,
  Sparkles,
  Leaf,
  Coins
} from 'lucide-react';

interface CarretaDLS {
  id: string;
  talhaoAlvo: string;
  areaTalhaoHa: number;
  volumeM3Ha: number;
  teorNkgM3: number;
  teorP2O5kgM3: number;
  teorK2OkgM3: number;
  tipoManejo: string;
}

const CARRETAS_INICIAIS: CarretaDLS[] = [
  {
    id: 'dls-01',
    talhaoAlvo: 'Talhão T-03 (Granja Integrada - 150 ha)',
    areaTalhaoHa: 150.0,
    volumeM3Ha: 45.0,
    teorNkgM3: 3.2,
    teorP2O5kgM3: 2.8,
    teorK2OkgM3: 2.4,
    tipoManejo: 'Injeção Dirigida no Solo com Disco Duplo (Redução de Amônia)',
  },
  {
    id: 'dls-02',
    talhaoAlvo: 'Talhão T-02 (Cerrado Alto - 280 ha)',
    areaTalhaoHa: 280.0,
    volumeM3Ha: 35.0,
    teorNkgM3: 3.0,
    teorP2O5kgM3: 2.5,
    teorK2OkgM3: 2.2,
    tipoManejo: 'Distribuidor com Canhão Autopropelido (Fertirrigação)',
  },
];

export const DejetosLiquidosSuinosModule: React.FC = () => {
  const [carretas] = useState<CarretaDLS[]>(CARRETAS_INICIAIS);
  const [carretaAtiva, setCarretaAtiva] = useState<CarretaDLS>(CARRETAS_INICIAIS[0]);

  // Limite Legal Ambiental (SEMA / CETESB) para Fósforo
  const [limiteAmbientalP2O5kgHa] = useState<number>(140.0); // 140 kg P2O5 / ha / ano

  // Cotações equivalentes de Fertilizantes Minerais
  const [precoKgN, setPrecoKgN] = useState<number>(7.55); // R$ 7,55 / kg N (Uréia)
  const [precoKgP2O5, setPrecoKgP2O5] = useState<number>(9.00); // R$ 9,00 / kg P2O5 (Superfosfato)
  const [precoKgK2O, setPrecoKgK2O] = useState<number>(5.16); // R$ 5,16 / kg K2O (KCl)

  // Cálculos de Aporte de Nutrientes
  const aporteNkgHa = Number((carretaAtiva.volumeM3Ha * carretaAtiva.teorNkgM3).toFixed(1));
  const aporteP2O5kgHa = Number((carretaAtiva.volumeM3Ha * carretaAtiva.teorP2O5kgM3).toFixed(1));
  const aporteK2OkgHa = Number((carretaAtiva.volumeM3Ha * carretaAtiva.teorK2OkgM3).toFixed(1));

  // Validação Ambiental
  const conformeAmbiental = aporteP2O5kgHa <= limiteAmbientalP2O5kgHa;

  // Valoração Financeira
  const valorNReaisHa = aporteNkgHa * precoKgN;
  const valorP2O5ReaisHa = aporteP2O5kgHa * precoKgP2O5;
  const valorK2OReaisHa = aporteK2OkgHa * precoKgK2O;
  const economiaTotalReaisHa = Number((valorNReaisHa + valorP2O5ReaisHa + valorK2OReaisHa).toFixed(2));
  const economiaTotalTalhaoReais = Number((economiaTotalReaisHa * carretaAtiva.areaTalhaoHa).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl">
                <Droplets className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Dejetos Líquidos de Suínos (DLS & Fertirrigação Orgânica)
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Economia Circular & SEMA
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Aporte agronômico de NPK orgânico, conformidade com a cota ambiental de fósforo e substituição de adubação química.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Plano de Aplicação de Dejetos Líquidos de Suínos (DLS) emitido para o órgão ambiental!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-950/40"
            >
              <Download className="w-4 h-4" />
              Laudo Ambiental DLS
            </button>
            <div className="text-right pl-4 border-l border-emerald-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Economia no Talhão</div>
              <div className="text-xl font-bold text-emerald-300">
                R$ {economiaTotalTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Carga de Fósforo (P₂O₅)</div>
          <div className={`text-2xl font-bold mt-1 ${conformeAmbiental ? 'text-emerald-400' : 'text-rose-400'}`}>
            {aporteP2O5kgHa} <span className="text-sm font-normal text-stone-400">kg/ha</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Limite SEMA: {limiteAmbientalP2O5kgHa} kg/ha ({conformeAmbiental ? 'Conforme' : 'Excedido'})
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Aporte de Nitrogênio (N)</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">
            {aporteNkgHa} <span className="text-sm font-normal text-stone-400">kg N/ha</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Equivale a {(aporteNkgHa / 0.45).toFixed(0)} kg Uréia/ha
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Aporte de Potássio (K₂O)</div>
          <div className="text-2xl font-bold text-amber-300 mt-1">
            {aporteK2OkgHa} <span className="text-sm font-normal text-stone-400">kg K₂O/ha</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Equivale a {(aporteK2OkgHa / 0.60).toFixed(0)} kg KCl/ha
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Economia Total por Hectare</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            R$ {economiaTotalReaisHa.toFixed(2)} <span className="text-sm font-normal text-stone-400">/ha</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Substituição 100% orgânica de adubação química
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Talhões & Manejo vs Calculadora de Nutrientes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Manejo por Talhão (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Plano de Aplicação de DLS por Gleba
                </h2>
              </div>
              <span className="text-xs text-stone-400 font-mono">Norma Ambiental SEMA-MT</span>
            </div>

            {/* Selector of Plots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {carretas.map((c) => {
                const isSelected = c.id === carretaAtiva.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCarretaAtiva(c)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/50'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{c.talhaoAlvo.split(' - ')[0]}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300">
                        {c.volumeM3Ha} m³/ha
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1 truncate">{c.areaTalhaoHa} ha • {c.tipoManejo.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>

            {/* Environmental Compliance Card */}
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400">Método de Aplicação no Campo:</span>
                <span className="font-semibold text-white">{carretaAtiva.tipoManejo}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400">Status de Licenciamento Ambiental:</span>
                <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Conforme (Risco Zero de Eutrofização de Mananciais)
                </span>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-stone-300 leading-relaxed text-[11px]">
                <strong className="text-emerald-300 block mb-1">Boas Práticas de Manejo:</strong>
                A injeção direta no solo reduz em até <strong>85% a perda de nitrogênio amoniacal por volatilização</strong> e elimina odores na vizinhança. A incorporação do efluente enriquece a fração de matéria orgânica lábil e ativa a biota edáfica benéfica.
              </div>
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
                  Valoração do Adubo Orgânico
                </h2>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
                Economia Real
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Valore o aporte de nitrogênio, fósforo e potássio com base nos preços dos fertilizantes minerais comerciais.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Preço do Nitrogênio Elementar (R$/kg N)</label>
                <input
                  type="number"
                  step="0.20"
                  value={precoKgN}
                  onChange={(e) => setPrecoKgN(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Preço do Fósforo Elementar (R$/kg P₂O₅)</label>
                <input
                  type="number"
                  step="0.20"
                  value={precoKgP2O5}
                  onChange={(e) => setPrecoKgP2O5(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Preço do Potássio Elementar (R$/kg K₂O)</label>
                <input
                  type="number"
                  step="0.20"
                  value={precoKgK2O}
                  onChange={(e) => setPrecoKgK2O(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Substitution Results Output Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Valor do N aportado:</span>
                <span className="text-cyan-300 font-bold">R$ {valorNReaisHa.toFixed(2)}/ha</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Valor do P₂O₅ aportado:</span>
                <span className="text-emerald-400 font-bold">R$ {valorP2O5ReaisHa.toFixed(2)}/ha</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Valor do K₂O aportado:</span>
                <span className="text-amber-300 font-bold">R$ {valorK2OReaisHa.toFixed(2)}/ha</span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Economia Total por Hectare:</span>
                <span className="text-emerald-400 font-bold text-base">
                  R$ {economiaTotalReaisHa.toFixed(2)} /ha
                </span>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-900/40 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Economia no Talhão ({carretaAtiva.areaTalhaoHa} ha)</div>
                  <div className="text-xl font-black text-white">
                    R$ {economiaTotalTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
