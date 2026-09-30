import React, { useState } from 'react';
import {
  Umbrella,
  ShieldCheck,
  ShieldAlert,
  CloudLightning,
  AlertTriangle,
  FileWarning,
  CheckCircle2,
  Calculator,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

interface ApoliceSeguro {
  id: string;
  seguradora: string;
  numeroApolice: string;
  cultura: string;
  safra: string;
  areaSeguradaHa: number;
  produtividadeHistoricaScHa: number;
  nivelCoberturaPct: number;
  produtividadeGarantidaScHa: number;
  precoSacaGarantidoRs: number;
  taxaPremioPct: number;
  subvencaoGovernoPct: number; // PSR MAPA
  statusApolice: 'VIGENTE' | 'SINISTRO_EM_ANALISE' | 'INDENIZADO';
}

const APOLICES_INICIAIS: ApoliceSeguro[] = [
  {
    id: 'seg-01',
    seguradora: 'Brasilseg (Banco do Brasil Agro)',
    numeroApolice: 'AP-849021/26',
    cultura: 'Soja Grão',
    safra: 'Safra 2026/27',
    areaSeguradaHa: 1000,
    produtividadeHistoricaScHa: 65.0,
    nivelCoberturaPct: 70,
    produtividadeGarantidaScHa: 45.5,
    precoSacaGarantidoRs: 130.0,
    taxaPremioPct: 5.5,
    subvencaoGovernoPct: 40,
    statusApolice: 'SINISTRO_EM_ANALISE',
  },
  {
    id: 'seg-02',
    seguradora: 'Porto Seguro Agro',
    numeroApolice: 'AP-332140/26',
    cultura: 'Milho Safrinha',
    safra: 'Safrinha 2026',
    areaSeguradaHa: 800,
    produtividadeHistoricaScHa: 110.0,
    nivelCoberturaPct: 65,
    produtividadeGarantidaScHa: 71.5,
    precoSacaGarantidoRs: 55.0,
    taxaPremioPct: 6.0,
    subvencaoGovernoPct: 40,
    statusApolice: 'VIGENTE',
  },
  {
    id: 'seg-03',
    seguradora: 'Mapfre Seguros Paramétricos',
    numeroApolice: 'PARAM-99142/26',
    cultura: 'Soja Grão (Índice Pluviométrico)',
    safra: 'Safra 2026/27',
    areaSeguradaHa: 600,
    produtividadeHistoricaScHa: 62.0,
    nivelCoberturaPct: 75,
    produtividadeGarantidaScHa: 46.5,
    precoSacaGarantidoRs: 128.0,
    taxaPremioPct: 4.8,
    subvencaoGovernoPct: 35,
    statusApolice: 'VIGENTE',
  },
];

export const SeguroAgricolaSinistrosModule: React.FC = () => {
  const [apolices] = useState<ApoliceSeguro[]>(APOLICES_INICIAIS);
  const [apoliceSelecionada, setApoliceSelecionada] = useState<ApoliceSeguro>(APOLICES_INICIAIS[0]);

  // Simulador de Peritagem e Liquidação de Sinistro
  const [produtividadeColhidaSinistro, setProdutividadeColhidaSinistro] = useState<number>(34.0); // sc/ha constatada
  const [eventoClimatico, setEventoClimatico] = useState<string>('Veranico / Seca Prolongada na Florada (28 dias sem chuva)');

  // Cálculos Técnicos Financeiros da Apólice
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
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-stone-950 border border-blue-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl">
                <Umbrella className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Seguro Agrícola Multirrisco & Sinistros Climáticos
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                    PSR / MAPA 40%
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Gestão de apólices rurais, subvenção federal, laudos periciais de veranico e indenização de quebras de safra.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Dossiê Pericial de Sinistro Climático gerado com fotos e dados de satélite!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-950/40"
            >
              <FileCheck className="w-4 h-4" />
              Emitir Aviso de Sinistro
            </button>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Capital Segurado Total</div>
          <div className="text-2xl font-bold text-white mt-1">
            R$ {capitalSeguradoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Garantia: {apoliceSelecionada.produtividadeGarantidaScHa} sc/ha ({apoliceSelecionada.nivelCoberturaPct}%)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Subvenção Federal (PSR MAPA)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            R$ {subvencaoGov.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-500 mt-1">
            Governo paga {apoliceSelecionada.subvencaoGovernoPct}% do prêmio
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Indenização Estimada de Sinistro</div>
          <div className={`text-2xl font-bold mt-1 ${sinistroProcedente ? 'text-amber-400' : 'text-stone-400'}`}>
            R$ {valorIndenizacaoRs.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Quebra pericial de {quebraScHa} sc/ha em {apoliceSelecionada.areaSeguradaHa} ha
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Status da Apólice</div>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                apoliceSelecionada.statusApolice === 'SINISTRO_EM_ANALISE'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
            >
              {apoliceSelecionada.statusApolice === 'SINISTRO_EM_ANALISE' ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  SINISTRO EM VISTORIA
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  APÓLICE ATIVA
                </>
              )}
            </span>
          </div>
          <div className="text-xs text-stone-500 mt-1 truncate">
            {apoliceSelecionada.seguradora}
          </div>
        </div>
      </div>

      {/* Main Grid: Apólices vs Simulador de Sinistro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lista de Apólices (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Umbrella className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">
                  Apólices de Seguro Agrícola Contratadas
                </h2>
              </div>
              <span className="text-xs text-stone-400">SUSEP / MAPA Homologadas</span>
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
                        ? 'bg-blue-950/40 border-blue-500/80 shadow-md'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-blue-400" />
                          {ap.seguradora}
                          <span className="text-xs text-stone-400 font-normal">({ap.numeroApolice})</span>
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          {ap.cultura} • {ap.safra} • {ap.areaSeguradaHa} ha
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-stone-400">Garantia</div>
                          <div className="text-sm font-bold text-white">{ap.produtividadeGarantidaScHa} sc/ha</div>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                            ap.statusApolice === 'SINISTRO_EM_ANALISE'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
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
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-400" />
                Estrutura de Custos do Prêmio & Subvenção (PSR)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Prêmio Bruto Seguradora</div>
                  <div className="text-lg font-bold text-stone-200 mt-1">
                    R$ {premioBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Taxa de {apoliceSelecionada.taxaPremioPct}%</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Subvenção PSR (Governo)</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">
                    - R$ {subvencaoGov.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Subsídio de 40% a fundo perdido</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Custo Líquido Produtor</div>
                  <div className="text-lg font-bold text-blue-400 mt-1">
                    R$ {premioLiquidoProdutor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    R$ {(premioLiquidoProdutor / apoliceSelecionada.areaSeguradaHa).toFixed(2)}/ha
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Simulador de Sinistro Climático (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CloudLightning className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">
                  Simulador de Liquidação de Sinistro
                </h2>
              </div>
              <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                Laudo de Peritagem
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Simule a produtividade real colhida constatada pelo perito da seguradora para apurar a quebra indenizável.
            </p>

            <div className="space-y-4 text-xs">
              {/* Evento Climático */}
              <div>
                <label className="text-stone-400 font-medium block mb-1">Causa do Sinistro Climático</label>
                <input
                  type="text"
                  value={eventoClimatico}
                  onChange={(e) => setEventoClimatico(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-medium focus:border-blue-500"
                />
              </div>

              {/* Produtividade Colhida Slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-300 font-medium">Produtividade Colhida no Talhão</span>
                  <span className="text-amber-300 font-bold">{produtividadeColhidaSinistro.toFixed(1)} sc/ha</span>
                </div>
                <input
                  type="range"
                  min="20.0"
                  max="65.0"
                  step="0.5"
                  value={produtividadeColhidaSinistro}
                  onChange={(e) => setProdutividadeColhidaSinistro(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-stone-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>20 sc/ha (Perda severa)</span>
                  <span>Garantia: {apoliceSelecionada.produtividadeGarantidaScHa} sc/ha</span>
                  <span>65 sc/ha (Sem perda)</span>
                </div>
              </div>

              <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-400">Produtividade Garantida:</span>
                  <span className="text-white font-semibold">{apoliceSelecionada.produtividadeGarantidaScHa} sc/ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Quebra Indenizável:</span>
                  <span className={`font-bold ${quebraScHa > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {quebraScHa} sc/ha
                  </span>
                </div>
              </div>
            </div>

            {/* Claim Settlement Result Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Valor Bruto da Indenização:</span>
                <span className="text-amber-300 font-bold text-base">
                  R$ {valorIndenizacaoRs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">(-) Prêmio Pago pelo Produtor:</span>
                <span className="text-stone-400">
                  R$ {premioLiquidoProdutor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Resultado Líquido do Seguro:</span>
                <div className="text-right">
                  <div className={`text-base font-bold ${saldoLiquidoProdutor >= 0 ? 'text-emerald-400' : 'text-stone-400'}`}>
                    {saldoLiquidoProdutor >= 0 ? '+' : ''}R$ {saldoLiquidoProdutor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-stone-500">
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
