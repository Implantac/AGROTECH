import React, { useState } from 'react';
import {
  Microscope,
  AlertTriangle,
  Download,
  Calculator,
  Coins
} from 'lucide-react';

interface LaudoNematologico {
  id: string;
  talhaoNome: string;
  areaHa: number;
  especiePredominante: string;
  populacao10gRaiz: number;
  populacao200cm3Solo: number;
  limiarCritico10gRaiz: number;
  fatorReproducaoFR: number;
  danoVisualRaiz: string;
  culturaAtual: string;
  historicoManejo: string;
}

const LAUDOS_INICIAIS: LaudoNematologico[] = [
  {
    id: 'nem-01',
    talhaoNome: 'Talhão T-04 (Pivô Sul - Histórico de Soja Contínua)',
    areaHa: 130,
    especiePredominante: 'Pratylenchus brachyurus (Nematóide-das-lesões-radiculares)',
    populacao10gRaiz: 1850,
    populacao200cm3Solo: 420,
    limiarCritico10gRaiz: 1000,
    fatorReproducaoFR: 2.8,
    danoVisualRaiz: 'Necrose severa de raízes absorventes, galhas ausentes, menor volume de radicelas',
    culturaAtual: 'Soja (BMX Bônus IPRO)',
    historicoManejo: 'Monocultivo soja/milho sem rotação de crotalária',
  },
  {
    id: 'nem-02',
    talhaoNome: 'Talhão T-01 (Sede - Rotação com Crotalaria spectabilis)',
    areaHa: 420,
    especiePredominante: 'Heterodera glycines (Nematóide-do-cisto da soja - Raça 3)',
    populacao10gRaiz: 320,
    populacao200cm3Solo: 85,
    limiarCritico10gRaiz: 500,
    fatorReproducaoFR: 0.4,
    danoVisualRaiz: 'Cistos diminutos isolados, raízes com boa arquitetura e sem sintomas de nanismo',
    culturaAtual: 'Soja (TMG 2381 IPRO resistente)',
    historicoManejo: 'Sucessão com Crotalaria spectabilis no outono anterior',
  },
  {
    id: 'nem-03',
    talhaoNome: 'Talhão T-02 (Cerrado Alto)',
    areaHa: 280,
    especiePredominante: 'Meloidogyne incognita (Nematóide-das-galhas)',
    populacao10gRaiz: 940,
    populacao200cm3Solo: 190,
    limiarCritico10gRaiz: 800,
    fatorReproducaoFR: 1.6,
    danoVisualRaiz: 'Presença moderada de galhas esféricas nas raízes secundárias',
    culturaAtual: 'Soja (DM 66X68 I2X)',
    historicoManejo: 'Plantio direto consolidado com braquiária ruziziensis',
  },
];

export const NematoidesManejoModule: React.FC = () => {
  const [laudos] = useState<LaudoNematologico[]>(LAUDOS_INICIAIS);
  const [laudoAtivo, setLaudoAtivo] = useState<LaudoNematologico>(LAUDOS_INICIAIS[0]);

  // Simulador de Tratamento Biológico (Nematicida On-Farm vs Danos)
  const [custoNematicidaBiolHa, setCustoNematicidaBiolHa] = useState<number>(85.0); // R$ 85 / ha
  const [precoSacaSoja, setPrecoSacaSoja] = useState<number>(130.0);
  const [perdaEstimadaSemControleScHa, setPerdaEstimadaSemControleScHa] = useState<number>(8.5); // 8.5 sc/ha de quebra
  const [eficienciaControlePct, setEficienciaControlePct] = useState<number>(70); // 70% de controle

  // Cálculos Técnicos e Financeiros
  const ehCritico = laudoAtivo.populacao10gRaiz >= laudoAtivo.limiarCritico10gRaiz;
  const sacasSalvasHa = Number(((perdaEstimadaSemControleScHa * eficienciaControlePct) / 100).toFixed(2));
  const beneficioFinanceiroHa = Number((sacasSalvasHa * precoSacaSoja).toFixed(2));
  const beneficioLiquidoHa = Number((beneficioFinanceiroHa - custoNematicidaBiolHa).toFixed(2));
  const beneficioTotalTalhaoReais = Number((beneficioLiquidoHa * laudoAtivo.areaHa).toFixed(2));
  const roiTratamento = Number((beneficioFinanceiroHa / custoNematicidaBiolHa).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl">
              <Microscope className="w-6 h-6 text-rose-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Manejo Integrado de Nematóides (Pratylenchus & Cisto)
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 rounded-full">
                  Fitossanidade & Solo
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Auditoria populacional em raízes (Pratylenchus, Cisto e Galha) e ROI de biológicos no sulco de plantio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laudo Nematológico Completo emitido com prescrição de Crotalária e Nematicida Biológico!')}
              className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              Laudo Nematológico
            </button>
            <div className="text-right pl-4 border-l border-slate-200 hidden sm:block">
              <div className="text-[11px] text-slate-500">Benefício Líquido</div>
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
          <div className="text-xs font-medium text-slate-500">População em 10g de Raiz</div>
          <div className={`text-2xl font-bold mt-1 ${ehCritico ? 'text-rose-700' : 'text-emerald-700'}`}>
            {laudoAtivo.populacao10gRaiz.toLocaleString('pt-BR')} <span className="text-sm font-normal text-slate-400">indivíduos</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Limiar de dano econômico: {laudoAtivo.limiarCritico10gRaiz}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Fator de Reprodução (FR)</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {laudoAtivo.fatorReproducaoFR.toFixed(1)} <span className="text-sm font-normal text-slate-400">FR</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {laudoAtivo.fatorReproducaoFR > 1.0 ? 'População em Multiplicação' : 'População em Supressão'}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Produtividade Salva pelo Biológico</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            +{sacasSalvasHa} <span className="text-sm font-normal text-slate-400">sc/ha</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            R$ {beneficioFinanceiroHa.toFixed(2)}/ha faturados a mais
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Retorno do Investimento (ROI)</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {roiTratamento}x <span className="text-sm font-normal text-slate-400">ROI</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Custo R$ {custoNematicidaBiolHa}/ha no sulco
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Laudo Laboratorial vs Simulador Econômico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Laudo Nematológico por Talhão (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Microscope className="w-5 h-5 text-rose-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Laudos Laboratoriais de Nematologia
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Extração por Flutuação Centrífuga</span>
            </div>

            {/* Selector of Sample Plots */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
              {laudos.map((l) => {
                const isSelected = l.id === laudoAtivo.id;
                const isOverLimit = l.populacao10gRaiz >= l.limiarCritico10gRaiz;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLaudoAtivo(l)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50/70 border-rose-300 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{l.talhaoNome.split(' - ')[0]}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isOverLimit ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOverLimit ? 'Crítico' : 'Baixo'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 truncate">{l.especiePredominante.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Details Card */}
            <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Espécie de Nematóide Identificada:</span>
                <span className="font-bold text-slate-900">{laudoAtivo.especiePredominante}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">População em 200 cm³ de Solo:</span>
                <span className="font-mono text-sky-700 font-bold">{laudoAtivo.populacao200cm3Solo} espécimes</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Diagnóstico Visual de Raízes:</span>
                <span className="text-slate-700">{laudoAtivo.danoVisualRaiz}</span>
              </div>

              <div className="p-3 bg-rose-50/60 border border-rose-200/80 rounded-lg text-slate-600 leading-relaxed text-[11px]">
                <strong className="text-rose-900 block mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  Prescrição de Manejo Integrado:
                </strong>
                Recomenda-se a inoculação no sulco de semeadura com consórcio de <strong>Bacillus firmus (1.0 L/ha) + Purpureocillium lilacinum (fungo parasita de ovos)</strong>. Na entressafra, rotacionar com <strong>Crotalaria spectabilis pura (FR &lt; 0.2)</strong> para limpeza biológica do perfil radicular.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Nematicide Treatment Financial Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-rose-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Simulador de Proteção de Safra
                </h2>
              </div>
              <span className="text-xs bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded font-semibold">
                ROI Biológico
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Calcule a produtividade preservada e a receita líquida do controle biológico no sulco de plantio.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Perda Estimada sem Tratamento (sc/ha)</label>
                <input
                  type="number"
                  step="0.5"
                  value={perdaEstimadaSemControleScHa}
                  onChange={(e) => setPerdaEstimadaSemControleScHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Custo do Tratamento Biológico no Sulco (R$/ha)</label>
                <input
                  type="number"
                  step="5"
                  value={custoNematicidaBiolHa}
                  onChange={(e) => setCustoNematicidaBiolHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-600 font-medium">Eficiência do Controle Biológico (%)</label>
                  <span className="text-emerald-700 font-bold">{eficienciaControlePct}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="90"
                  step="5"
                  value={eficienciaControlePct}
                  onChange={(e) => setEficienciaControlePct(Number(e.target.value))}
                  className="w-full accent-rose-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Preço Projetado da Soja (R$/sc)</label>
                <input
                  type="number"
                  step="1"
                  value={precoSacaSoja}
                  onChange={(e) => setPrecoSacaSoja(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Substitution Results Output Box */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Sacas Preservadas:</span>
                <span className="text-emerald-700 font-bold">+{sacasSalvasHa} sc/ha</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Ganho Bruto por Hectare:</span>
                <span className="text-slate-900 font-semibold">R$ {beneficioFinanceiroHa.toFixed(2)} /ha</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Lucro Líquido Adicional:</span>
                <span className="text-emerald-700 font-bold text-base">
                  R$ {beneficioLiquidoHa.toFixed(2)} /ha
                </span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Benefício Total no Talhão ({laudoAtivo.areaHa} ha)</div>
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
export default NematoidesManejoModule;
