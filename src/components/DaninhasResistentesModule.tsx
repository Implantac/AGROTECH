import React, { useState } from 'react';
import {
  Skull,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calculator,
  Layers,
  Coins
} from 'lucide-react';

interface EstrategiaManejoHRAC {
  id: string;
  especieDaninha: string;
  nomeCientifico: string;
  talhaoAlvo: string;
  areaHa: number;
  densidadeInfestacaoM2: number;
  perdaPotencialMatocompeticaoPct: number;
  gruposHracUtilizados: {
    grupoNumero: string;
    mecanismoAcao: string;
    ingredienteAtivo: string;
    momento: 'DESSECACAO_1' | 'DESSECACAO_2' | 'PRE_EMERGENTE_PLANTIO';
  }[];
  diasResidualPreEmergente: number;
  custoTratamentoHa: number;
}

const ESTRATEGIAS_INICIAIS: EstrategiaManejoHRAC[] = [
  {
    id: 'est-01',
    especieDaninha: 'Capim-Amargoso Resistente ao Glifosato',
    nomeCientifico: 'Digitaria insularis',
    talhaoAlvo: 'Talhão T-04 (Pivô Sul - Cabeceiras)',
    areaHa: 130,
    densidadeInfestacaoM2: 8.5,
    perdaPotencialMatocompeticaoPct: 32,
    gruposHracUtilizados: [
      { grupoNumero: '9', mecanismoAcao: 'Inibidores da EPSPs', ingredienteAtivo: 'Glifosato Sal Dimetilamina (1.800 g i.a./ha)', momento: 'DESSECACAO_1' },
      { grupoNumero: '1', mecanismoAcao: 'Inibidores da ACCase (FOP/DIM)', ingredienteAtivo: 'Cletodim 240 EC (120 g i.a./ha)', momento: 'DESSECACAO_1' },
      { grupoNumero: '14', mecanismoAcao: 'Inibidores da PROTOX', ingredienteAtivo: 'Saflufenacil 700 WG (35 g i.a./ha)', momento: 'DESSECACAO_2' },
      { grupoNumero: '15', mecanismoAcao: 'Inibidores de VLCFA (Pré-Emergente)', ingredienteAtivo: 'S-Metolacloro 960 EC (1.440 g i.a./ha)', momento: 'PRE_EMERGENTE_PLANTIO' },
    ],
    diasResidualPreEmergente: 35,
    custoTratamentoHa: 245.0,
  },
  {
    id: 'est-02',
    especieDaninha: 'Buva com Resistência Múltipla (EPSPs + ALS)',
    nomeCientifico: 'Conyza sumatrensis',
    talhaoAlvo: 'Talhão T-01 (Sede)',
    areaHa: 420,
    densidadeInfestacaoM2: 4.2,
    perdaPotencialMatocompeticaoPct: 22,
    gruposHracUtilizados: [
      { grupoNumero: '4', mecanismoAcao: 'Mimetizadores de Auxina', ingredienteAtivo: '2,4-D Colina (806 g i.a./ha)', momento: 'DESSECACAO_1' },
      { grupoNumero: '10', mecanismoAcao: 'Inibidores da Glutamina Sintetase', ingredienteAtivo: 'Glufosinato de Amônio 200 SL (400 g i.a./ha)', momento: 'DESSECACAO_2' },
      { grupoNumero: '14', mecanismoAcao: 'Inibidores da PROTOX (Pré-Emergente)', ingredienteAtivo: 'Flumioxazina 500 SC (50 g i.a./ha)', momento: 'PRE_EMERGENTE_PLANTIO' },
    ],
    diasResidualPreEmergente: 28,
    custoTratamentoHa: 210.0,
  },
  {
    id: 'est-03',
    especieDaninha: 'Capim-Pé-de-Galinha Resistente a Graminicidas',
    nomeCientifico: 'Eleusine indica',
    talhaoAlvo: 'Talhão T-02 (Cerrado Alto)',
    areaHa: 280,
    densidadeInfestacaoM2: 6.0,
    perdaPotencialMatocompeticaoPct: 26,
    gruposHracUtilizados: [
      { grupoNumero: '1', mecanismoAcao: 'Inibidores da ACCase (DIM)', ingredienteAtivo: 'Haloxifope-P-Metílico (62.4 g i.a./ha)', momento: 'DESSECACAO_1' },
      { grupoNumero: '15', mecanismoAcao: 'Inibidores de VLCFA (Pré-Emergente)', ingredienteAtivo: 'Piroxasulfona (100 g i.a./ha)', momento: 'PRE_EMERGENTE_PLANTIO' },
    ],
    diasResidualPreEmergente: 45,
    custoTratamentoHa: 280.0,
  },
];

export const DaninhasResistentesModule: React.FC = () => {
  const [estrategias] = useState<EstrategiaManejoHRAC[]>(ESTRATEGIAS_INICIAIS);
  const [estrategiaAtiva, setEstrategiaAtiva] = useState<EstrategiaManejoHRAC>(ESTRATEGIAS_INICIAIS[0]);

  // Simulador de Prejuízo de Matocompetição Evitado
  const [produtividadeEsperadaScHa, setProdutividadeEsperadaScHa] = useState<number>(68.0);
  const [precoSacaSoja, setPrecoSacaSoja] = useState<number>(130.0);

  // Cálculos Técnicos e Financeiros
  const perdaSacasHa = Number((produtividadeEsperadaScHa * (estrategiaAtiva.perdaPotencialMatocompeticaoPct / 100)).toFixed(1));
  const receitaPreservadaHa = Number((perdaSacasHa * precoSacaSoja).toFixed(2));
  const beneficioLiquidoHa = Number((receitaPreservadaHa - estrategiaAtiva.custoTratamentoHa).toFixed(2));
  const beneficioTotalTalhaoReais = Number((beneficioLiquidoHa * estrategiaAtiva.areaHa).toFixed(2));
  const roiEstrategia = Number((receitaPreservadaHa / estrategiaAtiva.custoTratamentoHa).toFixed(1));

  // Contagem de Mecanismos HRAC Distintos na Estratégia
  const mecanismosUnicos = new Set(estrategiaAtiva.gruposHracUtilizados.map((g) => g.grupoNumero)).size;
  const blindagemCompleta = mecanismosUnicos >= 3;
  const sacasSalvasHa = perdaSacasHa;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl">
              <Skull className="w-6 h-6 text-amber-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Manejo de Daninhas Resistentes & Rotação HRAC
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                  Amargoso & Buva
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Mapeamento de infestação, dessecação sequencial com rotação de mecanismos de ação e pré-emergentes residuais.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Prescrição de Dessecação Sequencial e Pré-Emergentes emitida para o pulverizador!')}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              Prescrição HRAC
            </button>
            <div className="text-right pl-4 border-l border-slate-200 hidden sm:block">
              <div className="text-[11px] text-slate-500">Benefício no Talhão</div>
              <div className="text-lg font-bold text-emerald-700">
                R$ {beneficioTotalTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Mecanismos HRAC Distintos</div>
          <div className={`text-2xl font-bold mt-1 ${blindagemCompleta ? 'text-emerald-700' : 'text-amber-700'}`}>
            {mecanismosUnicos} <span className="text-sm font-normal text-slate-400">grupos químicos</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {blindagemCompleta ? 'Blindagem Anti-Resistência Ativa' : 'Alerta: Risco de Seleção'}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Residual do Pré-Emergente</div>
          <div className="text-2xl font-bold text-sky-700 mt-1">
            {estrategiaAtiva.diasResidualPreEmergente} <span className="text-sm font-normal text-slate-400">dias</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Garante fechamento de dossel no limpo
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Sacas Salvas da Matocompetição</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            +{sacasSalvasHa} <span className="text-sm font-normal text-slate-400">sc/ha</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {estrategiaAtiva.perdaPotencialMatocompeticaoPct}% de quebra evitada
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Retorno da Estratégia (ROI)</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {roiEstrategia}x <span className="text-sm font-normal text-slate-400">ROI</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Custo R$ {estrategiaAtiva.custoTratamentoHa}/ha vs R$ {receitaPreservadaHa.toFixed(0)}/ha salvos
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Protocolo Sequencial vs Simulador de Matocompetição */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Protocolo Sequencial HRAC (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Protocolo de Aplicação Sequencial por Talhão
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Norma Global HRAC/WSSA</span>
            </div>

            {/* Selector of Target Weed Cases */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {estrategias.map((est) => {
                const isSelected = est.id === estrategiaAtiva.id;
                return (
                  <button
                    key={est.id}
                    onClick={() => setEstrategiaAtiva(est)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{est.especieDaninha.split(' (')[0]}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
                        {est.densidadeInfestacaoM2} pl/m²
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 truncate">{est.talhaoAlvo}</div>
                  </button>
                );
              })}
            </div>

            {/* Herbicide Stack Steps */}
            <div className="space-y-3 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Mecanismos de Ação Integrados na Calda
              </h3>

              {estrategiaAtiva.gruposHracUtilizados.map((item, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-mono font-bold text-[10px]">
                        Grupo HRAC {item.grupoNumero}
                      </span>
                      <span className="font-semibold text-slate-900">{item.mecanismoAcao}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-1">
                      {item.ingredienteAtivo}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-bold shrink-0">
                    {item.momento === 'DESSECACAO_1' ? '1ª Aplicação (-14 dias)' : item.momento === 'DESSECACAO_2' ? '2ª Aplicação (-2 dias)' : 'Plante-Aplique'}
                  </span>
                </div>
              ))}

              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg text-slate-600 text-xs flex items-center gap-2 mt-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>
                  O pré-emergente atua no banco de sementes criando uma película que impede novas plântulas durante os primeiros <strong>{estrategiaAtiva.diasResidualPreEmergente} dias</strong> cruciais.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Prevention Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Valoração da Matocompetição
                </h2>
              </div>
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                Quebra Evitada
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Simule o prejuízo potencial evitado ao impedir que as daninhas disputem água e nutrientes no período PAIW.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Produtividade Esperada da Soja (sc/ha)</label>
                <input
                  type="number"
                  step="1"
                  value={produtividadeEsperadaScHa}
                  onChange={(e) => setProdutividadeEsperadaScHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Preço Projetado da Soja (R$/sc)</label>
                <input
                  type="number"
                  step="1"
                  value={precoSacaSoja}
                  onChange={(e) => setPrecoSacaSoja(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Substitution Results Output Box */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Sacas Salvas por Hectare:</span>
                <span className="text-emerald-700 font-bold">+{sacasSalvasHa} sc/ha</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Custo da Estratégia Completa:</span>
                <span className="text-slate-700 font-semibold">- R$ {estrategiaAtiva.custoTratamentoHa.toFixed(2)}/ha</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Lucro Líquido Preservado:</span>
                <span className="text-emerald-700 font-bold text-base">
                  R$ {beneficioLiquidoHa.toFixed(2)} /ha
                </span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Benefício Total no Talhão ({estrategiaAtiva.areaHa} ha)</div>
                  <div className="text-xl font-black text-emerald-900">
                    R$ {beneficioTotalTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <Coins className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default DaninhasResistentesModule;
