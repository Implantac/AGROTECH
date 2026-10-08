import React, { useState } from 'react';
import {
  Activity,
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Scale,
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
  Calculator,
} from 'lucide-react';

interface LoteConfinamento {
  id: string;
  nomeLote: string;
  raca: string;
  cabecas: number;
  diasCochoAtual: number;
  diasCochoTotal: number;
  pesoEntradaKg: number;
  pesoAtualKg: number;
  gmdProjetadoKg: number;
  consumoMsKgDia: number; // Matéria Seca kg/dia
  custoDietaDiaRs: number;
  custoOperacionalDiaRs: number;
  rendimentoCarcacaPct: number;
  statusSanitario: 'APTO_ABATE' | 'QUARENTENA' | 'EM_ENGORDA';
}

const LOTES_INICIAIS: LoteConfinamento[] = [
  {
    id: 'lote-01',
    nomeLote: 'Curral 04 - Nelore Boi China',
    raca: 'Nelore Mocho PO/CEIP',
    cabecas: 220,
    diasCochoAtual: 68,
    diasCochoTotal: 90,
    pesoEntradaKg: 385,
    pesoAtualKg: 495,
    gmdProjetadoKg: 1.62,
    consumoMsKgDia: 10.8,
    custoDietaDiaRs: 11.4,
    custoOperacionalDiaRs: 1.85,
    rendimentoCarcacaPct: 55.4,
    statusSanitario: 'EM_ENGORDA',
  },
  {
    id: 'lote-02',
    nomeLote: 'Curral 08 - Cruzamento Angus F1',
    raca: 'Meio-Sangue Angus x Nelore',
    cabecas: 180,
    diasCochoAtual: 82,
    diasCochoTotal: 95,
    pesoEntradaKg: 410,
    pesoAtualKg: 545,
    gmdProjetadoKg: 1.78,
    consumoMsKgDia: 12.2,
    custoDietaDiaRs: 12.8,
    custoOperacionalDiaRs: 1.85,
    rendimentoCarcacaPct: 56.8,
    statusSanitario: 'APTO_ABATE',
  },
  {
    id: 'lote-03',
    nomeLote: 'Curral 12 - Machos Castrados Brangus',
    raca: 'Brangus IATF',
    cabecas: 160,
    diasCochoAtual: 45,
    diasCochoTotal: 90,
    pesoEntradaKg: 370,
    pesoAtualKg: 442,
    gmdProjetadoKg: 1.58,
    consumoMsKgDia: 10.2,
    custoDietaDiaRs: 10.9,
    custoOperacionalDiaRs: 1.85,
    rendimentoCarcacaPct: 54.8,
    statusSanitario: 'EM_ENGORDA',
  },
];

export const ConfinamentoBovinoModule: React.FC = () => {
  const [lotes] = useState<LoteConfinamento[]>(LOTES_INICIAIS);
  const [loteSelecionado, setLoteSelecionado] = useState<LoteConfinamento>(LOTES_INICIAIS[0]);

  // Simulador de Mercado e Margem
  const [precoCompraArrobaMagra, setPrecoCompraArrobaMagra] = useState<number>(230); // R$/@ de reposição
  const [precoVendaArrobaGorda, setPrecoVendaArrobaGorda] = useState<number>(255); // R$/@ Boi China

  // Cálculos Zootécnicos do Lote Selecionado
  const ganhoTotalPesoKg = loteSelecionado.diasCochoTotal * loteSelecionado.gmdProjetadoKg;
  const pesoFinalKg = loteSelecionado.pesoEntradaKg + ganhoTotalPesoKg;
  const arrobasFinais = Number(
    ((pesoFinalKg * (loteSelecionado.rendimentoCarcacaPct / 100)) / 15).toFixed(1)
  );
  const arrobasIniciais = Number(
    ((loteSelecionado.pesoEntradaKg * 0.5) / 15).toFixed(1)
  );
  const arrobasGanhasCocho = Number((arrobasFinais - arrobasIniciais).toFixed(1));

  // Custos e Margem do Cocho
  const custoDiarioTotal =
    loteSelecionado.custoDietaDiaRs + loteSelecionado.custoOperacionalDiaRs;
  const custoTotalCocho = custoDiarioTotal * loteSelecionado.diasCochoTotal;
  const custoPorArrobaProduzida =
    arrobasGanhasCocho > 0 ? custoTotalCocho / arrobasGanhasCocho : 0;

  // Resultado Econômico Completo (Boi Magro + Cocho = Boi Gordo)
  const custoBoiMagro = arrobasIniciais * precoCompraArrobaMagra;
  const desembolsoTotalPorBoi = custoBoiMagro + custoTotalCocho;
  const receitaBoiGordo = arrobasFinais * precoVendaArrobaGorda;
  const lucroLiquidoPorBoi = Number((receitaBoiGordo - desembolsoTotalPorBoi).toFixed(2));
  const lucroTotalLote = Number((lucroLiquidoPorBoi * loteSelecionado.cabecas).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="p-2 bg-amber-100 text-amber-800 border border-amber-300 rounded-xl">
              <Activity className="w-5 h-5" />
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Confinamento Intensivo Bovino & Gestão de Cocho
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full">
                Feedlot 4.0
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Nutrição de alto grão, consumo de matéria seca (CMS), conversão alimentar e apuração de margem líquida por cabeça.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right pr-4 border-r border-slate-200 hidden sm:block">
            <div className="text-xs text-slate-500 font-medium">GMD Projetado</div>
            <div className="text-xl font-black text-amber-800">{loteSelecionado.gmdProjetadoKg} kg/dia</div>
          </div>
          <button
            onClick={() => alert('Boletim Zootécnico e Relatório de Cocho exportado com sucesso!')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Boletim do Confinamento</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Arrobas Produzidas no Cocho</div>
          <div className="text-3xl font-black text-amber-800 mt-1">
            {arrobasGanhasCocho} <span className="text-xs font-bold text-slate-500">@/boi</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Peso final: {pesoFinalKg.toFixed(1)} kg PV ({arrobasFinais} @)
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Custo da @ Produzida (Cocho)</div>
          <div className="text-3xl font-black text-slate-900 mt-1">
            R$ {custoPorArrobaProduzida.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Dieta: R$ {loteSelecionado.custoDietaDiaRs.toFixed(2)}/dia ({loteSelecionado.consumoMsKgDia} kg MS)
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Lucro Líquido por Cabeça</div>
          <div className="text-3xl font-black text-emerald-800 mt-1">
            R$ {lucroLiquidoPorBoi.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-700 mt-1 font-semibold">
            Margem líquida sobre custo total
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Lucro Total do Lote ({loteSelecionado.cabecas} cab)</div>
          <div className="text-3xl font-black text-emerald-800 mt-1">
            R$ {lucroTotalLote.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Venda a R$ {precoVendaArrobaGorda.toFixed(2)}/@ (Boi China)
          </div>
        </div>
      </div>

      {/* Main Dual Column: Currais vs Simulador */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Currais e Desempenho (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-extrabold text-slate-900">
                  Currais de Confinamento & Lotes Ativos
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">Pesagem Caneta / RFID</span>
            </div>

            {/* List of Lots */}
            <div className="space-y-3 mb-6">
              {lotes.map((lote) => {
                const isSelected = lote.id === loteSelecionado.id;
                return (
                  <div
                    key={lote.id}
                    onClick={() => setLoteSelecionado(lote)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 shadow-2xs ring-1 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Activity className="w-4 h-4 text-amber-700" />
                          <span>{lote.nomeLote}</span>
                          <span className="text-xs text-slate-500 font-normal">({lote.raca})</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Entrada: {lote.pesoEntradaKg} kg • Atual: <span className="text-slate-900 font-bold">{lote.pesoAtualKg} kg</span> • {lote.diasCochoAtual}/{lote.diasCochoTotal} dias
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[11px] text-slate-500 font-medium">GMD</div>
                          <div className="text-sm font-bold text-emerald-800">{lote.gmdProjetadoKg} kg/dia</div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 rounded-lg">
                          {lote.cabecas} cab
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nutritional & Feed Breakdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Dieta Nutricional de Terminação ({loteSelecionado.nomeLote})</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="text-slate-500 font-medium">Consumo Matéria Seca</div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {loteSelecionado.consumoMsKgDia} kg MS/dia
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">2.2% do Peso Vivo</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="text-slate-500 font-medium">Rendimento Carcaça</div>
                  <div className="text-lg font-black text-emerald-800 mt-1">
                    {loteSelecionado.rendimentoCarcacaPct}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Acabamento gordura 3+</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="text-slate-500 font-medium">Custo Diário Total</div>
                  <div className="text-lg font-black text-amber-800 mt-1">
                    R$ {(loteSelecionado.custoDietaDiaRs + loteSelecionado.custoOperacionalDiaRs).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Dieta + Operacional</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="text-slate-500 font-medium">Conversão Alimentar</div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {(loteSelecionado.consumoMsKgDia / loteSelecionado.gmdProjetadoKg).toFixed(1)} : 1
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">kg MS por kg ganho</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 font-medium">
                🌽 <strong>Ingredientes da Ração de Alto Grão:</strong> Silagem de Milho Planta Inteira (25%), Milho Moído / Grão Úmido (48%), Farelo de Soja 46% (12%), Caroço de Algodão (11%) e Núcleo Mineral com Virginiamicina & Monensina Sódica (4%).
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-extrabold text-slate-900">
                  Simulador de Margem de Confinamento
                </h2>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full">
                Break-Even
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-5">
              Ajuste as cotações da arroba magra na compra e gorda na venda para simular o resultado econômico do lote.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1.5">Preço Compra Boi Magro (R$/@)</label>
                <input
                  type="number"
                  step="2"
                  value={precoCompraArrobaMagra}
                  onChange={(e) => setPrecoCompraArrobaMagra(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1.5">Preço Venda Boi Gordo (R$/@ Boi China)</label>
                <input
                  type="number"
                  step="2"
                  value={precoVendaArrobaGorda}
                  onChange={(e) => setPrecoVendaArrobaGorda(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Custo Compra Boi Magro:</span>
                  <span className="text-slate-900 font-bold">R$ {custoBoiMagro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Custo Total de Cocho (90d):</span>
                  <span className="text-amber-800 font-bold">R$ {custoTotalCocho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-700 font-semibold">Desembolso Total/Boi:</span>
                  <span className="text-slate-900 font-black">R$ {desembolsoTotalPorBoi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Financial Margin Box */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Receita Bruta Venda (Frigorífico):</span>
                <span className="text-emerald-800 font-black text-sm">
                  R$ {receitaBoiGordo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900">Lucro Líquido por Cabeça:</span>
                <div className="text-right">
                  <div className="text-base font-black text-emerald-800">
                    R$ {lucroLiquidoPorBoi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    Lucro no lote: R$ {lucroTotalLote.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
