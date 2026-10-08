import React, { useState } from 'react';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  Scale,
  DollarSign,
  Lock,
  ArrowRight,
  Download,
  AlertCircle,
  HelpCircle,
  Info,
} from 'lucide-react';

interface ContratoNDF {
  id: string;
  contraparteBanco: string;
  numeroContrato: string;
  volumeUSD: number;
  taxaNdfContratada: number;
  vencimento: string;
  finalidade: string;
  status: 'ATIVO' | 'LIQUIDADO';
}

const CONTRATOS_NDF_INICIAIS: ContratoNDF[] = [
  {
    id: 'ndf-01',
    contraparteBanco: 'Banco Santander Agro',
    numeroContrato: 'NDF-2026-0481',
    volumeUSD: 350000,
    taxaNdfContratada: 5.38,
    vencimento: '15/04/2027',
    finalidade: 'Adubo Fosfatado (MAP 11-52 - 800t)',
    status: 'ATIVO',
  },
  {
    id: 'ndf-02',
    contraparteBanco: 'Rabobank Brasil',
    numeroContrato: 'NDF-2026-0922',
    volumeUSD: 280000,
    taxaNdfContratada: 5.42,
    vencimento: '30/05/2027',
    finalidade: 'Cloreto de Potássio (KCl 60% - 650t)',
    status: 'ATIVO',
  },
  {
    id: 'ndf-03',
    contraparteBanco: 'Banco Itaú BBA',
    numeroContrato: 'NDF-2026-1144',
    volumeUSD: 190000,
    taxaNdfContratada: 5.46,
    vencimento: '10/06/2027',
    finalidade: 'Fungicidas Sítio-Específicos & Protioconazol',
    status: 'ATIVO',
  },
];

export const HedgeCambialNDFModule: React.FC = () => {
  const [contratos] = useState<ContratoNDF[]>(CONTRATOS_NDF_INICIAIS);

  // Variáveis Dinâmicas de Mercado e Simulação
  const [ptaxSpotAtual, setPtaxSpotAtual] = useState<number>(5.68);
  const [passivoTotalUSD, setPassivoTotalUSD] = useState<number>(1050000); // 1.05 milhão USD de insumos
  const [precoSacaSoja, setPrecoSacaSoja] = useState<number>(132.5); // R$/saca

  // Cálculos do Hedge NDF
  const volumeTravadoTotalUSD = contratos.reduce((acc, c) => acc + c.volumeUSD, 0);
  const exposicaoAbertaUSD = Math.max(0, passivoTotalUSD - volumeTravadoTotalUSD);
  const hedgeRatioPct = Number(((volumeTravadoTotalUSD / passivoTotalUSD) * 100).toFixed(1));

  // Taxa média ponderada contratada no NDF
  const taxaMediaNdf =
    contratos.reduce((acc, c) => acc + c.volumeUSD * c.taxaNdfContratada, 0) / volumeTravadoTotalUSD;

  // Marcação a Mercado (MtM - Mark-to-Market)
  // Se PTAX Spot atual > taxa contratada, temos ganho financeiro na trava NDF que compensa a alta do insumo
  const mtmTotalRs = volumeTravadoTotalUSD * (ptaxSpotAtual - taxaMediaNdf);

  // Custo em R$ com e sem Hedge
  const desembolsoSemHedgeRs = passivoTotalUSD * ptaxSpotAtual;
  const desembolsoComHedgeRs =
    volumeTravadoTotalUSD * taxaMediaNdf + exposicaoAbertaUSD * ptaxSpotAtual;
  const economiaPeloHedgeRs = desembolsoSemHedgeRs - desembolsoComHedgeRs;

  // Impacto na Relação de Troca Barter (Sacas de soja necessárias para comprar insumos)
  const precoMapUSD = 620; // US$/tonelada
  const precoKclUSD = 410; // US$/tonelada

  const sacasPorTonMapSemHedge = Number(((precoMapUSD * ptaxSpotAtual) / precoSacaSoja).toFixed(1));
  const sacasPorTonMapComHedge = Number(((precoMapUSD * taxaMediaNdf) / precoSacaSoja).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="p-2 bg-amber-100 text-amber-800 border border-amber-300 rounded-xl">
              <Coins className="w-5 h-5" />
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Hedge Cambial NDF & Gestão de Risco Dólar
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded-full">
                Derivativos Agro
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Blindagem cambial de insumos dolarizados (adubos e químicos), marcação a mercado (MtM) e relação de troca barter.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right pr-4 border-r border-slate-200 hidden sm:block">
            <div className="text-xs text-slate-500 font-medium">Hedge Ratio</div>
            <div className="text-xl font-black text-emerald-800">{hedgeRatioPct}% Coberto</div>
          </div>
          <button
            onClick={() => alert('Relatório de Hedge e Posição NDF exportado com sucesso!')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Posição de Risco</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Passivo Dolarizado Total</div>
          <div className="text-3xl font-black text-slate-900 mt-1">
            US$ {passivoTotalUSD.toLocaleString('en-US')}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Fertilizantes KCl, MAP e Químicos
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Volume Travado em NDF</div>
          <div className="text-3xl font-black text-amber-800 mt-1">
            US$ {volumeTravadoTotalUSD.toLocaleString('en-US')}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Taxa Média NDF: R$ {taxaMediaNdf.toFixed(4)}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Mark-to-Market (MtM)</div>
          <div className={`text-3xl font-black mt-1 ${mtmTotalRs >= 0 ? 'text-emerald-800' : 'text-rose-700'}`}>
            {mtmTotalRs >= 0 ? '+' : ''}R$ {mtmTotalRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-800 mt-1 font-semibold">
            Ganho de proteção com PTAX a R$ {ptaxSpotAtual.toFixed(2)}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Economia Efetiva do Hedge</div>
          <div className="text-3xl font-black text-emerald-800 mt-1">
            R$ {economiaPeloHedgeRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Prejuízo evitado contra alta cambial
          </div>
        </div>
      </div>

      {/* Main Dual Column: Contratos NDF vs Stress Test Cambial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: NDF Contracts List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-extrabold text-slate-900">
                  Contratos NDF em Aberto (Non-Deliverable Forward)
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">Registro B3 / Bancos</span>
            </div>

            {/* List of NDF Contracts */}
            <div className="space-y-3 mb-6">
              {contratos.map((c) => {
                const ganhoContrato = (ptaxSpotAtual - c.taxaNdfContratada) * c.volumeUSD;
                return (
                  <div
                    key={c.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-100 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Coins className="w-4 h-4 text-amber-600" />
                          <span>{c.contraparteBanco}</span>
                          <span className="text-xs text-slate-500 font-normal">({c.numeroContrato})</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Finalidade: <span className="font-semibold text-slate-800">{c.finalidade}</span> • Venc: {c.vencimento}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-[11px] text-slate-500 font-medium">Volume</div>
                          <div className="text-sm font-bold text-slate-900">US$ {c.volumeUSD.toLocaleString('en-US')}</div>
                        </div>
                        <div className="text-right pl-3 border-l border-slate-200">
                          <div className="text-[11px] text-slate-500 font-medium">Taxa Trava</div>
                          <div className="text-sm font-black text-amber-800">R$ {c.taxaNdfContratada.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Marcação a Mercado (MtM):</span>
                      <span className={`font-bold font-mono ${ganhoContrato >= 0 ? 'text-emerald-800' : 'text-rose-700'}`}>
                        {ganhoContrato >= 0 ? '+' : ''}R$ {ganhoContrato.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Barter Ratio / Relação de Troca */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-700" />
                <span>Relação de Troca Barter (Soja x Fertilizantes)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="text-slate-500 font-medium">MAP 11-52 (Fosfatado)</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-black text-emerald-800">{sacasPorTonMapComHedge} sc/t</span>
                    <span className="text-slate-400 line-through text-xs">({sacasPorTonMapSemHedge} sc/t sem trava)</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Economia de {(sacasPorTonMapSemHedge - sacasPorTonMapComHedge).toFixed(1)} sacas por tonelada</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="text-slate-500 font-medium">KCl 60% (Potássico)</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-black text-emerald-800">
                      {((precoKclUSD * taxaMediaNdf) / precoSacaSoja).toFixed(1)} sc/t
                    </span>
                    <span className="text-slate-400 line-through text-xs">
                      ({((precoKclUSD * ptaxSpotAtual) / precoSacaSoja).toFixed(1)} sc/t)
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Proteção contratual contra repasse cambial</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stress Test Cambial & Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-extrabold text-slate-900">
                  Simulador de Estresse Cambial
                </h2>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
                Cenários PTAX
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-5">
              Altere a cotação PTAX do dólar para simular a eficácia da proteção NDF no custo final da lavoura.
            </p>

            <div className="space-y-4">
              {/* PTAX Spot Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-semibold text-slate-700">
                  <span>Cotação Dólar PTAX Spot</span>
                  <span className="text-amber-800 font-bold font-mono">R$ {ptaxSpotAtual.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="4.80"
                  max="6.50"
                  step="0.02"
                  value={ptaxSpotAtual}
                  onChange={(e) => setPtaxSpotAtual(Number(e.target.value))}
                  className="w-full accent-amber-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>R$ 4,80</span>
                  <span>R$ 5,68 (Atual)</span>
                  <span>R$ 6,50</span>
                </div>
              </div>

              {/* Passivo Total Input */}
              <div className="text-xs">
                <label className="text-slate-700 font-semibold block mb-1.5">Passivo Dolarizado Total (US$)</label>
                <input
                  type="number"
                  step="50000"
                  value={passivoTotalUSD}
                  onChange={(e) => setPassivoTotalUSD(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Preço Soja Input */}
              <div className="text-xs">
                <label className="text-slate-700 font-semibold block mb-1.5">Preço da Soja (R$/saca)</label>
                <input
                  type="number"
                  step="1"
                  value={precoSacaSoja}
                  onChange={(e) => setPrecoSacaSoja(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Financial Results Under Tested Scenario */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Desembolso sem NDF:</span>
                <span className="text-rose-700 font-bold line-through">
                  R$ {desembolsoSemHedgeRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Desembolso com NDF:</span>
                <span className="text-emerald-800 font-black text-sm">
                  R$ {desembolsoComHedgeRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900">Vantagem do Hedge:</span>
                <div className="text-right">
                  <div className="text-base font-black text-emerald-800">
                    R$ {economiaPeloHedgeRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    {exposicaoAbertaUSD > 0
                      ? `US$ ${exposicaoAbertaUSD.toLocaleString('en-US')} ainda a descoberto`
                      : 'Carteira 100% imunizada'}
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
