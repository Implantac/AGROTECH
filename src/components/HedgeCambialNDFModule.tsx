import React, { useState } from 'react';
import {
  Coins,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Lock,
  ArrowUpRight,
  Scale,
  DollarSign,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2
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

const CONTRATOS_INICIAIS: ContratoNDF[] = [
  {
    id: 'ndf-01',
    contraparteBanco: 'Itaú BBA Agro',
    numeroContrato: 'NDF-94012/26',
    volumeUSD: 500000,
    taxaNdfContratada: 5.42,
    vencimento: '2026-11-30',
    finalidade: 'Trava de Adubo Fosfatado (MAP 11-52)',
    status: 'ATIVO',
  },
  {
    id: 'ndf-02',
    contraparteBanco: 'Santander Brasil',
    numeroContrato: 'NDF-78210/26',
    volumeUSD: 300000,
    taxaNdfContratada: 5.50,
    vencimento: '2026-12-15',
    finalidade: 'Trava de Cloreto de Potássio (KCl 60%)',
    status: 'ATIVO',
  },
  {
    id: 'ndf-03',
    contraparteBanco: 'Rabobank Brasil',
    numeroContrato: 'NDF-61294/27',
    volumeUSD: 400000,
    taxaNdfContratada: 5.48,
    vencimento: '2027-01-20',
    finalidade: 'Trava de Defensivos Importados',
    status: 'ATIVO',
  },
];

export const HedgeCambialNDFModule: React.FC = () => {
  const [contratos] = useState<ContratoNDF[]>(CONTRATOS_INICIAIS);

  // Parâmetros Globais de Risco Cambial
  const [passivoTotalUSD, setPassivoTotalUSD] = useState<number>(1500000); // US$ 1.5M em insumos
  const [ptaxSpotAtual, setPtaxSpotAtual] = useState<number>(5.68); // Cotação PTAX atual
  const [precoSacaSoja, setPrecoSacaSoja] = useState<number>(130.0);

  // Agregações de Volume NDF
  const volumeTravadoTotalUSD = contratos.reduce((acc, c) => acc + c.volumeUSD, 0);
  const exposicaoAbertaUSD = Math.max(0, passivoTotalUSD - volumeTravadoTotalUSD);
  const hedgeRatioPct = Number(((volumeTravadoTotalUSD / passivoTotalUSD) * 100).toFixed(1));

  // Cálculo de Custo Médio Ponderado da Taxa NDF Contratada
  const somaPonderadaTaxas = contratos.reduce((acc, c) => acc + c.volumeUSD * c.taxaNdfContratada, 0);
  const taxaMediaNdf = Number((somaPonderadaTaxas / volumeTravadoTotalUSD).toFixed(4));

  // Mark-to-Market (MtM) Total da Carteira de Derivativos
  const mtmTotalRs = Number(((ptaxSpotAtual - taxaMediaNdf) * volumeTravadoTotalUSD).toFixed(2));

  // Comparativo de Desembolso com Hedge vs Sem Hedge
  const desembolsoSemHedgeRs = Number((passivoTotalUSD * ptaxSpotAtual).toFixed(2));
  const desembolsoComHedgeRs = Number((somaPonderadaTaxas + exposicaoAbertaUSD * ptaxSpotAtual).toFixed(2));
  const economiaPeloHedgeRs = Number((desembolsoSemHedgeRs - desembolsoComHedgeRs).toFixed(2));

  // Relação de Troca (Barter Ratio)
  // Fertilizante MAP: US$ 720/t -> em BRL na taxa spot vs taxa NDF
  const precoMapUSD = 720;
  const precoKclUSD = 540;
  const sacasPorTonMapComHedge = Number(((precoMapUSD * taxaMediaNdf) / precoSacaSoja).toFixed(1));
  const sacasPorTonMapSemHedge = Number(((precoMapUSD * ptaxSpotAtual) / precoSacaSoja).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-stone-950 border border-amber-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl">
                <Coins className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Hedge Cambial NDF & Gestão de Risco Dólar
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Derivativos Agro
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Blindagem cambial de insumos dolarizados (adubos e químicos), marcação a mercado (MtM) e relação de troca barter.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Relatório de Hedge e Posição NDF exportado com sucesso!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 rounded-xl text-sm font-medium transition shadow-sm"
            >
              <Download className="w-4 h-4 text-amber-400" />
              Posição de Risco
            </button>
            <div className="text-right pl-4 border-l border-amber-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Hedge Ratio</div>
              <div className="text-xl font-bold text-emerald-300">{hedgeRatioPct}% Coberto</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Passivo Dolarizado Total</div>
          <div className="text-2xl font-bold text-white mt-1">
            US$ {passivoTotalUSD.toLocaleString('en-US')}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Fertilizantes KCl, MAP e Químicos
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Volume Travado em NDF</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            US$ {volumeTravadoTotalUSD.toLocaleString('en-US')}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Taxa Média NDF: R$ {taxaMediaNdf.toFixed(4)}
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Mark-to-Market (MtM)</div>
          <div className={`text-2xl font-bold mt-1 ${mtmTotalRs >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {mtmTotalRs >= 0 ? '+' : ''}R$ {mtmTotalRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-400 mt-1">
            Ganho de proteção com PTAX a R$ {ptaxSpotAtual.toFixed(2)}
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Economia Efetiva do Hedge</div>
          <div className="text-2xl font-bold text-emerald-300 mt-1">
            R$ {economiaPeloHedgeRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Prejuízo evitado contra alta cambial
          </div>
        </div>
      </div>

      {/* Main Dual Column: Contratos NDF vs Stress Test Cambial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: NDF Contracts List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">
                  Contratos NDF em Aberto (Non-Deliverable Forward)
                </h2>
              </div>
              <span className="text-xs text-stone-400">Registro B3 / Bancos</span>
            </div>

            {/* List of NDF Contracts */}
            <div className="space-y-3 mb-6">
              {contratos.map((c) => {
                const ganhoContrato = (ptaxSpotAtual - c.taxaNdfContratada) * c.volumeUSD;
                return (
                  <div
                    key={c.id}
                    className="p-4 bg-stone-950/70 border border-stone-800/80 rounded-xl hover:border-amber-500/50 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          <Coins className="w-4 h-4 text-amber-400" />
                          {c.contraparteBanco}
                          <span className="text-xs text-stone-400 font-normal">({c.numeroContrato})</span>
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          Finalidade: <span className="text-stone-300">{c.finalidade}</span> • Venc: {c.vencimento}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-stone-400">Volume</div>
                          <div className="text-sm font-bold text-white">US$ {c.volumeUSD.toLocaleString('en-US')}</div>
                        </div>
                        <div className="text-right pl-3 border-l border-stone-800">
                          <div className="text-xs text-stone-400">Taxa Trava</div>
                          <div className="text-sm font-bold text-amber-300">R$ {c.taxaNdfContratada.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-900 flex justify-between items-center text-xs">
                      <span className="text-stone-400">Marcação a Mercado (MtM):</span>
                      <span className={`font-semibold ${ganhoContrato >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {ganhoContrato >= 0 ? '+' : ''}R$ {ganhoContrato.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Barter Ratio / Relação de Troca */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                Relação de Troca Barter (Soja x Fertilizantes)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">MAP 11-52 (Fosfatado)</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-emerald-400">{sacasPorTonMapComHedge} sc/t</span>
                    <span className="text-stone-500 line-through">({sacasPorTonMapSemHedge} sc/t sem trava)</span>
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Economia de {(sacasPorTonMapSemHedge - sacasPorTonMapComHedge).toFixed(1)} sacas por tonelada</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">KCl 60% (Potássico)</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-emerald-400">
                      {((precoKclUSD * taxaMediaNdf) / precoSacaSoja).toFixed(1)} sc/t
                    </span>
                    <span className="text-stone-500 line-through">
                      ({((precoKclUSD * ptaxSpotAtual) / precoSacaSoja).toFixed(1)} sc/t)
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Proteção contratual contra repasse cambial</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stress Test Cambial & Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">
                  Simulador de Estresse Cambial
                </h2>
              </div>
              <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                Cenários PTAX
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Altere a cotação PTAX do dólar para simular a eficácia da proteção NDF no custo final da lavoura.
            </p>

            <div className="space-y-4">
              {/* PTAX Spot Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-300 font-medium">Cotação Dólar PTAX Spot</span>
                  <span className="text-amber-300 font-bold">R$ {ptaxSpotAtual.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="4.80"
                  max="6.50"
                  step="0.02"
                  value={ptaxSpotAtual}
                  onChange={(e) => setPtaxSpotAtual(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-stone-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>R$ 4,80</span>
                  <span>R$ 5,68 (Atual)</span>
                  <span>R$ 6,50</span>
                </div>
              </div>

              {/* Passivo Total Input */}
              <div className="text-xs">
                <label className="text-stone-400 font-medium block mb-1">Passivo Dolarizado Total (US$)</label>
                <input
                  type="number"
                  step="50000"
                  value={passivoTotalUSD}
                  onChange={(e) => setPassivoTotalUSD(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-amber-500"
                />
              </div>

              {/* Preço Soja Input */}
              <div className="text-xs">
                <label className="text-stone-400 font-medium block mb-1">Preço da Soja (R$/saca)</label>
                <input
                  type="number"
                  step="1"
                  value={precoSacaSoja}
                  onChange={(e) => setPrecoSacaSoja(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-amber-500"
                />
              </div>
            </div>

            {/* Financial Results Under Tested Scenario */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Desembolso sem NDF:</span>
                <span className="text-rose-400 font-semibold line-through">
                  R$ {desembolsoSemHedgeRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Desembolso com NDF:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  R$ {desembolsoComHedgeRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Vantagem do Hedge:</span>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-300">
                    R$ {economiaPeloHedgeRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-emerald-500">
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
