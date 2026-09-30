import React, { useState } from 'react';
import {
  Activity,
  Flame,
  Scale,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  Download,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface LoteConfinamento {
  id: string;
  nomeLote: string;
  raca: string;
  cabecas: number;
  dataEntrada: string;
  diasCochoAtual: number;
  diasCochoTotal: number;
  pesoEntradaKg: number;
  pesoAtualKg: number;
  gmdProjetadoKg: number;
  consumoMsKgDia: number;
  custoDietaDiaRs: number;
  custoOperacionalDiaRs: number;
  rendimentoCarcacaPct: number;
  statusLote: 'ADAPTACAO' | 'CRESCIMENTO' | 'TERMINACAO';
}

const LOTES_INICIAIS: LoteConfinamento[] = [
  {
    id: 'conf-01',
    nomeLote: 'Curral 01 - Nelore PO Boi China',
    raca: 'Nelore Mocho',
    cabecas: 500,
    dataEntrada: '2026-07-15',
    diasCochoAtual: 75,
    diasCochoTotal: 90,
    pesoEntradaKg: 380,
    pesoAtualKg: 504,
    gmdProjetadoKg: 1.65,
    consumoMsKgDia: 10.8,
    custoDietaDiaRs: 13.50,
    custoOperacionalDiaRs: 2.50,
    rendimentoCarcacaPct: 55.0,
    statusLote: 'TERMINACAO',
  },
  {
    id: 'conf-02',
    nomeLote: 'Curral 02 - Cruzamento Angus F1',
    raca: 'Angus x Nelore',
    cabecas: 350,
    dataEntrada: '2026-08-01',
    diasCochoAtual: 58,
    diasCochoTotal: 85,
    pesoEntradaKg: 410,
    pesoAtualKg: 517,
    gmdProjetadoKg: 1.85,
    consumoMsKgDia: 11.5,
    custoDietaDiaRs: 15.20,
    custoOperacionalDiaRs: 2.50,
    rendimentoCarcacaPct: 56.5,
    statusLote: 'TERMINACAO',
  },
  {
    id: 'conf-03',
    nomeLote: 'Curral 03 - Novilhas Superprecoces',
    raca: 'Nelore x Senepol',
    cabecas: 280,
    dataEntrada: '2026-09-05',
    diasCochoAtual: 23,
    diasCochoTotal: 80,
    pesoEntradaKg: 340,
    pesoAtualKg: 374,
    gmdProjetadoKg: 1.50,
    consumoMsKgDia: 9.2,
    custoDietaDiaRs: 12.00,
    custoOperacionalDiaRs: 2.50,
    rendimentoCarcacaPct: 54.0,
    statusLote: 'CRESCIMENTO',
  },
];

export const ConfinamentoBovinoModule: React.FC = () => {
  const [lotes] = useState<LoteConfinamento[]>(LOTES_INICIAIS);
  const [loteSelecionado, setLoteSelecionado] = useState<LoteConfinamento>(LOTES_INICIAIS[0]);

  // Simulador Financeiro de Confinamento
  const [precoCompraArrobaMagra, setPrecoCompraArrobaMagra] = useState<number>(230.0);
  const [precoVendaArrobaGorda, setPrecoVendaArrobaGorda] = useState<number>(245.0); // Padrão Boi China

  // Cálculos Técnicos do Lote Selecionado
  // Entrada
  const arrobasEntrada = Number(((loteSelecionado.pesoEntradaKg * 0.50) / 15).toFixed(2));
  const custoBoiMagro = Number((arrobasEntrada * precoCompraArrobaMagra).toFixed(2));

  // Saída projetada ao final dos dias de cocho
  const ganhoTotalPesoVivoKg = Number((loteSelecionado.diasCochoTotal * loteSelecionado.gmdProjetadoKg).toFixed(1));
  const pesoFinalKg = loteSelecionado.pesoEntradaKg + ganhoTotalPesoVivoKg;
  const arrobasFinais = Number(((pesoFinalKg * (loteSelecionado.rendimentoCarcacaPct / 100)) / 15).toFixed(2));
  const arrobasGanhasCocho = Number((arrobasFinais - arrobasEntrada).toFixed(2));

  // Custos de confinamento
  const custoAlimentacaoTotal = Number((loteSelecionado.diasCochoTotal * loteSelecionado.custoDietaDiaRs).toFixed(2));
  const custoOperacionalTotal = Number((loteSelecionado.diasCochoTotal * loteSelecionado.custoOperacionalDiaRs).toFixed(2));
  const custoTotalCocho = custoAlimentacaoTotal + custoOperacionalTotal;

  // Custo por arroba produzida no cocho
  const custoPorArrobaProduzida = Number((custoTotalCocho / arrobasGanhasCocho).toFixed(2));

  // Resultado Econômico por Cabeça e Lote
  const receitaBoiGordo = Number((arrobasFinais * precoVendaArrobaGorda).toFixed(2));
  const desembolsoTotalPorBoi = custoBoiMagro + custoTotalCocho;
  const lucroLiquidoPorBoi = Number((receitaBoiGordo - desembolsoTotalPorBoi).toFixed(2));
  const lucroTotalLote = Number((lucroLiquidoPorBoi * loteSelecionado.cabecas).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-950 border border-amber-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl">
                <Activity className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Confinamento Intensivo Bovino & Gestão de Cocho
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Feedlot 4.0
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Nutrição de alto grão, consumo de matéria seca (CMS), conversão alimentar e apuração de margem líquida por cabeça.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Boletim Zootécnico e Relatório de Cocho exportado com sucesso!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 rounded-xl text-sm font-medium transition shadow-sm"
            >
              <Download className="w-4 h-4 text-amber-400" />
              Boletim do Confinamento
            </button>
            <div className="text-right pl-4 border-l border-amber-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">GMD Projetado</div>
              <div className="text-xl font-bold text-amber-300">{loteSelecionado.gmdProjetadoKg} kg/dia</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Arrobas Produzidas no Cocho</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {arrobasGanhasCocho} <span className="text-sm font-normal text-stone-400">@/boi</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Peso final: {pesoFinalKg.toFixed(1)} kg PV ({arrobasFinais} @)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Custo da @ Produzida (Cocho)</div>
          <div className="text-2xl font-bold text-teal-300 mt-1">
            R$ {custoPorArrobaProduzida.toFixed(2)}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Dieta: R$ {loteSelecionado.custoDietaDiaRs.toFixed(2)}/dia ({loteSelecionado.consumoMsKgDia} kg MS)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Lucro Líquido por Cabeça</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            R$ {lucroLiquidoPorBoi.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-500 mt-1">
            Margem líquida sobre custo total
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Lucro Total do Lote ({loteSelecionado.cabecas} cab)</div>
          <div className="text-2xl font-bold text-white mt-1">
            R$ {lucroTotalLote.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Venda a R$ {precoVendaArrobaGorda.toFixed(2)}/@ (Boi China)
          </div>
        </div>
      </div>

      {/* Main Dual Column: Currais vs Simulador */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Currais e Desempenho (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">
                  Currais de Confinamento & Lotes Ativos
                </h2>
              </div>
              <span className="text-xs text-stone-400">Pesagem Caneta / RFID</span>
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
                        ? 'bg-amber-950/40 border-amber-500/80 shadow-md'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          <Activity className="w-4 h-4 text-amber-400" />
                          {lote.nomeLote}
                          <span className="text-xs text-stone-400 font-normal">({lote.raca})</span>
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          Entrada: {lote.pesoEntradaKg} kg • Atual: <span className="text-white font-medium">{lote.pesoAtualKg} kg</span> • {lote.diasCochoAtual}/{lote.diasCochoTotal} dias
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-stone-400">GMD</div>
                          <div className="text-sm font-bold text-emerald-400">{lote.gmdProjetadoKg} kg/dia</div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg">
                          {lote.cabecas} cab
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nutritional & Feed Breakdown */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Dieta Nutricional de Terminação ({loteSelecionado.nomeLote})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Consumo Matéria Seca</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {loteSelecionado.consumoMsKgDia} kg MS/dia
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">2.2% do Peso Vivo</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Rendimento Carcaça</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">
                    {loteSelecionado.rendimentoCarcacaPct}%
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Acabamento de gordura 3+</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Custo Diário Total</div>
                  <div className="text-lg font-bold text-amber-300 mt-1">
                    R$ {(loteSelecionado.custoDietaDiaRs + loteSelecionado.custoOperacionalDiaRs).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Dieta + Operacional</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Conversão Alimentar</div>
                  <div className="text-lg font-bold text-teal-300 mt-1">
                    {(loteSelecionado.consumoMsKgDia / loteSelecionado.gmdProjetadoKg).toFixed(1)} : 1
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">kg MS por kg de ganho</div>
                </div>
              </div>

              <div className="p-3 bg-stone-900/90 border border-amber-900/30 rounded-lg text-xs text-stone-300">
                🌽 <strong>Ingredientes da Ração de Alto Grão:</strong> Silagem de Milho Planta Inteira (25%), Milho Moído / Grão Úmido (48%), Farelo de Soja 46% (12%), Caroço de Algodão (11%) e Núcleo Mineral com Virginiamicina & Monensina Sódica (4%).
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">
                  Simulador de Margem de Confinamento
                </h2>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
                Break-Even
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Ajuste as cotações da arroba magra na compra e gorda na venda para simular o resultado econômico do lote.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Preço Compra Boi Magro (R$/@)</label>
                <input
                  type="number"
                  step="2"
                  value={precoCompraArrobaMagra}
                  onChange={(e) => setPrecoCompraArrobaMagra(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Preço Venda Boi Gordo (R$/@ Boi China)</label>
                <input
                  type="number"
                  step="2"
                  value={precoVendaArrobaGorda}
                  onChange={(e) => setPrecoVendaArrobaGorda(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-400">Custo Compra Boi Magro:</span>
                  <span className="text-white font-semibold">R$ {custoBoiMagro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Custo Total de Cocho (90d):</span>
                  <span className="text-amber-400 font-semibold">R$ {custoTotalCocho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-800">
                  <span className="text-stone-300">Desembolso Total/Boi:</span>
                  <span className="text-white font-bold">R$ {desembolsoTotalPorBoi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Financial Margin Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Receita Bruta Venda (Frigorífico):</span>
                <span className="text-emerald-400 font-bold text-sm">
                  R$ {receitaBoiGordo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Lucro Líquido por Cabeça:</span>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-300">
                    R$ {lucroLiquidoPorBoi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-emerald-500">
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
