import React, { useState } from 'react';
import {
  Umbrella,
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  CloudLightning
} from 'lucide-react';

interface ApoliceSeguro {
  id: string;
  seguradora: string;
  numeroApolice: string;
  cultura: string;
  safra: string;
  areaSeguradaHa: number;
  produtividadeGarantidaScHa: number;
  precoSacaGarantidoRs: number;
  nivelCoberturaPct: number;
  taxaPremioPct: number;
  subvencaoGovernoPct: number; // 40% PSR MAPA
  statusApolice: 'ATIVA' | 'SINISTRO_EM_ANALISE' | 'INDENIZADA';
}

const APOLICES_INICIAIS: ApoliceSeguro[] = [
  {
    id: 'apol-01',
    seguradora: 'Brasilseg (BB Seguros Agro)',
    numeroApolice: 'AGR-2026-88412',
    cultura: 'Soja',
    safra: '2026/27',
    areaSeguradaHa: 500,
    produtividadeGarantidaScHa: 52.0,
    precoSacaGarantidoRs: 130.0,
    nivelCoberturaPct: 75,
    taxaPremioPct: 9.8,
    subvencaoGovernoPct: 40,
    statusApolice: 'SINISTRO_EM_ANALISE',
  },
  {
    id: 'apol-02',
    seguradora: 'Fairfax Brasil Seguros',
    numeroApolice: 'FFX-BR-0942',
    cultura: 'Soja',
    safra: '2026/27',
    areaSeguradaHa: 420,
    produtividadeGarantidaScHa: 50.0,
    precoSacaGarantidoRs: 130.0,
    nivelCoberturaPct: 70,
    taxaPremioPct: 8.5,
    subvencaoGovernoPct: 40,
    statusApolice: 'ATIVA',
  },
  {
    id: 'apol-03',
    seguradora: 'Porto Seguro Agro',
    numeroApolice: 'PSA-7719-01',
    cultura: 'Milho Safrinha',
    safra: '2026/27',
    areaSeguradaHa: 380,
    produtividadeGarantidaScHa: 70.0,
    precoSacaGarantidoRs: 58.0,
    nivelCoberturaPct: 70,
    taxaPremioPct: 11.2,
    subvencaoGovernoPct: 40,
    statusApolice: 'ATIVA',
  },
];

export const SeguroAgricolaSinistrosModule: React.FC = () => {
  const [apolices] = useState<ApoliceSeguro[]>(APOLICES_INICIAIS);
  const [apoliceSelecionada, setApoliceSelecionada] = useState<ApoliceSeguro>(APOLICES_INICIAIS[0]);

  // Simulador de Sinistro Climático
  const [produtividadeColhidaSinistro, setProdutividadeColhidaSinistro] = useState<number>(29.0); // sc/ha
  const [eventoClimatico, setEventoClimatico] = useState<string>('Veranico de 24 dias na floração');

  // Cálculos Financeiros da Apólice Selecionada
  const capitalSeguradoTotal = Number(
    (apoliceSelecionada.produtividadeGarantidaScHa * apoliceSelecionada.precoSacaGarantidoRs * apoliceSelecionada.areaSeguradaHa).toFixed(2)
  );

  const premioBruto = Number((capitalSeguradoTotal * (apoliceSelecionada.taxaPremioPct / 100)).toFixed(2));
  const subvencaoGov = Number((premioBruto * (apoliceSelecionada.subvencaoGovernoPct / 100)).toFixed(2));
  const premioLiquidoProdutor = Number((premioBruto - subvencaoGov).toFixed(2));

  // Apuração de Sinistro
  const quebraScHa = Math.max(0, Number((apoliceSelecionada.produtividadeGarantidaScHa - produtividadeColhidaSinistro).toFixed(1)));
  const sinistroProcedente = quebraScHa > 0;
  const valorIndenizacaoRs = Number(
    (quebraScHa * apoliceSelecionada.precoSacaGarantidoRs * apoliceSelecionada.areaSeguradaHa).toFixed(2)
  );
  const saldoLiquidoProdutor = Number((valorIndenizacaoRs - premioLiquidoProdutor).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl">
              <Umbrella className="w-6 h-6 text-sky-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Seguro Agrícola Multirrisco & Sinistros Climáticos
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 rounded-full">
                  PSR / MAPA 40%
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Gestão de apólices rurais, subvenção federal, laudos periciais de veranico e indenização de quebras de safra.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Dossiê Pericial de Sinistro Climático gerado com fotos e dados de satélite!')}
              className="flex items-center gap-2 px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <FileCheck className="w-4 h-4" />
              Emitir Aviso de Sinistro
            </button>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Capital Segurado Total</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            R$ {capitalSeguradoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Garantia: {apoliceSelecionada.produtividadeGarantidaScHa} sc/ha ({apoliceSelecionada.nivelCoberturaPct}%)
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Subvenção Federal (PSR MAPA)</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            R$ {subvencaoGov.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-800 mt-1">
            Governo paga {apoliceSelecionada.subvencaoGovernoPct}% do prêmio
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Indenização Estimada de Sinistro</div>
          <div className={`text-2xl font-bold mt-1 ${sinistroProcedente ? 'text-amber-700' : 'text-slate-400'}`}>
            R$ {valorIndenizacaoRs.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Quebra pericial de {quebraScHa} sc/ha em {apoliceSelecionada.areaSeguradaHa} ha
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Status da Apólice</div>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                apoliceSelecionada.statusApolice === 'SINISTRO_EM_ANALISE'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-sky-50 text-sky-800 border border-sky-200'
              }`}
            >
              {apoliceSelecionada.statusApolice === 'SINISTRO_EM_ANALISE' ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  SINISTRO EM VISTORIA
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
                  APÓLICE ATIVA
                </>
              )}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            {apoliceSelecionada.seguradora}
          </div>
        </div>
      </div>

      {/* Main Grid: Apólices vs Simulador de Sinistro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lista de Apólices (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Umbrella className="w-5 h-5 text-sky-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Apólices de Seguro Agrícola Contratadas
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">SUSEP / MAPA Homologadas</span>
            </div>

            {/* List of Policies */}
            <div className="space-y-3 mb-6">
              {apolices.map((ap) => {
                const isSelected = ap.id === apoliceSelecionada.id;
                return (
                  <div
                    key={ap.id}
                    onClick={() => setApoliceSelecionada(ap)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-50/70 border-sky-300 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-sky-700" />
                          {ap.seguradora}
                          <span className="text-xs text-slate-500 font-normal">({ap.numeroApolice})</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {ap.cultura} • {ap.safra} • {ap.areaSeguradaHa} ha
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Garantia</div>
                          <div className="text-sm font-bold text-slate-900">{ap.produtividadeGarantidaScHa} sc/ha</div>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                            ap.statusApolice === 'SINISTRO_EM_ANALISE'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-sky-50 text-sky-800 border border-sky-200'
                          }`}
                        >
                          {ap.statusApolice === 'SINISTRO_EM_ANALISE' ? 'Vistoria' : 'Ativa'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Details of the Selected Policy */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-sky-700" />
                Estrutura de Custos do Prêmio & Subvenção (PSR)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Prêmio Bruto Seguradora</div>
                  <div className="text-lg font-bold text-slate-800 mt-1">
                    R$ {premioBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Taxa de {apoliceSelecionada.taxaPremioPct}%</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Subvenção PSR (Governo)</div>
                  <div className="text-lg font-bold text-emerald-700 mt-1">
                    - R$ {subvencaoGov.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Subsídio de 40% a fundo perdido</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Custo Líquido Produtor</div>
                  <div className="text-lg font-bold text-sky-800 mt-1">
                    R$ {premioLiquidoProdutor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    R$ {(premioLiquidoProdutor / apoliceSelecionada.areaSeguradaHa).toFixed(2)}/ha
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Simulador de Sinistro Climático (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CloudLightning className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Simulador de Liquidação de Sinistro
                </h2>
              </div>
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                Laudo de Peritagem
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Simule a produtividade real colhida constatada pelo perito da seguradora para apurar a quebra indenizável.
            </p>

            <div className="space-y-4 text-xs">
              {/* Evento Climático */}
              <div>
                <label className="text-slate-600 font-medium block mb-1">Causa do Sinistro Climático</label>
                <input
                  type="text"
                  value={eventoClimatico}
                  onChange={(e) => setEventoClimatico(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Produtividade Colhida Slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 font-medium">Produtividade Colhida no Talhão</span>
                  <span className="text-amber-800 font-bold">{produtividadeColhidaSinistro.toFixed(1)} sc/ha</span>
                </div>
                <input
                  type="range"
                  min="20.0"
                  max="65.0"
                  step="0.5"
                  value={produtividadeColhidaSinistro}
                  onChange={(e) => setProdutividadeColhidaSinistro(Number(e.target.value))}
                  className="w-full accent-amber-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>20 sc/ha (Perda severa)</span>
                  <span>Garantia: {apoliceSelecionada.produtividadeGarantidaScHa} sc/ha</span>
                  <span>65 sc/ha (Sem perda)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Produtividade Garantida:</span>
                  <span className="text-slate-900 font-semibold">{apoliceSelecionada.produtividadeGarantidaScHa} sc/ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quebra Indenizável:</span>
                  <span className={`font-bold ${quebraScHa > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {quebraScHa} sc/ha
                  </span>
                </div>
              </div>
            </div>

            {/* Claim Settlement Result Box */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Valor Bruto da Indenização:</span>
                <span className="text-amber-800 font-bold text-base">
                  R$ {valorIndenizacaoRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">(-) Prêmio Pago pelo Produtor:</span>
                <span className="text-slate-600">
                  R$ {premioLiquidoProdutor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Resultado Líquido do Seguro:</span>
                <div className="text-right">
                  <div className={`text-base font-bold ${saldoLiquidoProdutor >= 0 ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {saldoLiquidoProdutor >= 0 ? '+' : ''}R$ {saldoLiquidoProdutor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {sinistroProcedente ? 'Indenização cobre os custos operacionais' : 'Safra dentro da normalidade'}
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
export default SeguroAgricolaSinistrosModule;
