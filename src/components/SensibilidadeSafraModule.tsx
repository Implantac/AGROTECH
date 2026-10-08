import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Sliders,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Percent,
  Calculator,
  RotateCcw
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

export const SensibilidadeSafraModule: React.FC = () => {
  // Estado dos parâmetros de simulação
  const [produtividadeScHa, setProdutividadeScHa] = useState<number>(68.0); // Meta padrão
  const [precoSacaVenda, setPrecoSacaVenda] = useState<number>(132.0); // R$ por saca de soja 60kg
  const [dolarPtax, setDolarPtax] = useState<number>(5.45);

  const totalAreaHa = TALHOES_INICIAIS.reduce((acc, curr) => acc + curr.areaHa, 0); // 2.450 ha
  const custoTotalABC = TALHOES_INICIAIS.reduce((acc, curr) => acc + curr.custoTotalABC, 0); // R$ 3.633.900

  // Cálculos dinâmicos da safra
  const totalSacasProduzidas = totalAreaHa * produtividadeScHa;
  const receitaBrutaTotal = totalSacasProduzidas * precoSacaVenda;
  const lucroLiquidoSafra = receitaBrutaTotal - custoTotalABC;
  const margemEbitda = receitaBrutaTotal > 0 ? (lucroLiquidoSafra / receitaBrutaTotal) * 100 : 0;
  const breakEvenScHa = precoSacaVenda > 0 ? (custoTotalABC / totalAreaHa) / precoSacaVenda : 0;
  const lucroPorHectare = totalAreaHa > 0 ? lucroLiquidoSafra / totalAreaHa : 0;

  // Grade da Matriz de Sensibilidade: Variação de Produtividade vs Variação de Preço
  const cenariosProdutividade = [55, 62, 68, 74, 80]; // sc/ha
  const cenariosPreco = [110, 120, 130, 140, 150]; // R$/sc

  return (
    <div className="space-y-6">
      {/* Top Banner de Sensibilidade Financeira */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-700 border border-emerald-800 rounded text-xs font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Stress Test & Modelagem Preditiva
            </span>
            <span className="text-xs text-slate-600">Safra 2025/2026 • 2.450 Hectares Monitorados</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-700" /> Análise de Sensibilidade Financeira & Matriz de Risco
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Simule o impacto de quebra de safra, seca ou oscilação da bolsa de Chicago (CBOT) no lucro líquido da fazenda.
          </p>
        </div>

        <button
          onClick={() => {
            setProdutividadeScHa(68.0);
            setPrecoSacaVenda(132.0);
            setDolarPtax(5.45);
          }}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-200 shadow-2xs transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Restaurar Padrões
        </button>
      </div>

      {/* Controles Interativos (Sliders) */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-700" /> Variáveis Críticas de Mercado e Campo
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Produtividade Esperada */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-900">Produtividade Esperada</span>
              <span className="text-lg font-black text-emerald-700 font-mono">
                {produtividadeScHa.toFixed(1)} <span className="text-xs font-normal text-slate-600">sc/ha</span>
              </span>
            </div>
            <input
              type="range"
              min="45"
              max="85"
              step="0.5"
              value={produtividadeScHa}
              onChange={(e) => setProdutividadeScHa(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>45 sc/ha (Quebra)</span>
              <span>65 sc/ha (Média Brasil)</span>
              <span>85 sc/ha (Recorde)</span>
            </div>
          </div>

          {/* Slider 2: Preço da Saca */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-900">Cotação Saca Soja (FOB MT)</span>
              <span className="text-lg font-black text-amber-700 font-mono">
                R$ {precoSacaVenda.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="95"
              max="165"
              step="1"
              value={precoSacaVenda}
              onChange={(e) => setPrecoSacaVenda(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>R$ 95,00 (Baixa)</span>
              <span>R$ 130,00 (Base)</span>
              <span>R$ 165,00 (Alta)</span>
            </div>
          </div>

          {/* Slider 3: Câmbio USD/BRL */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-900">Taxa de Câmbio Dólar PTAX</span>
              <span className="text-lg font-black text-blue-700 font-mono">
                R$ {dolarPtax.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="4.80"
              max="6.20"
              step="0.05"
              value={dolarPtax}
              onChange={(e) => setDolarPtax(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>R$ 4,80</span>
              <span>R$ 5,45</span>
              <span>R$ 6,20</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados do Stress Test */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <span className="text-xs text-slate-600 block font-medium">Receita Bruta Total</span>
          <p className="text-xl font-black text-white mt-1">
            R$ {receitaBrutaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {totalSacasProduzidas.toLocaleString('pt-BR')} sacas colhidas
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <span className="text-xs text-slate-600 block font-medium">Lucro Líquido Projetado</span>
          <p
            className={`text-xl font-black mt-1 ${
              lucroLiquidoSafra >= 0 ? 'text-emerald-700' : 'text-red-400'
            }`}
          >
            R$ {lucroLiquidoSafra.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {lucroLiquidoSafra >= 0 ? 'Lucro de ' : 'Prejuízo de '}
            R$ {lucroPorHectare.toFixed(2)} / ha
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <span className="text-xs text-slate-600 block font-medium">Margem EBITDA da Safra</span>
          <p
            className={`text-xl font-black mt-1 ${
              margemEbitda >= 20 ? 'text-emerald-700' : margemEbitda >= 0 ? 'text-amber-700' : 'text-red-400'
            }`}
          >
            {margemEbitda.toFixed(1)}%
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {margemEbitda >= 25 ? 'Excelente Rentabilidade' : 'Margem Comprimida'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <span className="text-xs text-slate-600 block font-medium">Ponto de Equilíbrio</span>
          <p className="text-xl font-black text-amber-700 mt-1 font-mono">
            {breakEvenScHa.toFixed(1)} <span className="text-xs text-slate-600 font-normal">sc/ha</span>
          </p>
          <span className="text-[11px] text-emerald-700 mt-1 block font-semibold">
            Folga: +{(produtividadeScHa - breakEvenScHa).toFixed(1)} sc/ha
          </span>
        </div>
      </div>

      {/* Matriz de Sensibilidade (Tabela Bidimensional) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">
            Matriz de Lucro Líquido Cruzado (Produtividade × Cotação da Saca)
          </h3>
          <p className="text-xs text-slate-600">
            Valores em R$ Milhões calculados para os 2.450 hectares da Fazenda Santa Helena
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center text-slate-900">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Produtividade \ Preço</th>
                {cenariosPreco.map((p) => (
                  <th key={p} className="px-4 py-3 text-white font-bold">
                    R$ {p},00
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {cenariosProdutividade.map((prod) => (
                <tr key={prod} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-left font-bold text-slate-900 font-sans">
                    {prod} sc / ha
                  </td>
                  {cenariosPreco.map((preco) => {
                    const receita = totalAreaHa * prod * preco;
                    const lucroMilhoes = (receita - custoTotalABC) / 1000000;
                    const isPositive = lucroMilhoes >= 0;

                    return (
                      <td
                        key={preco}
                        className={`px-4 py-3 font-bold ${
                          lucroMilhoes > 1.5
                            ? 'bg-emerald-950/70 text-emerald-800 font-black'
                            : isPositive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-950/50 text-red-400'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {lucroMilhoes.toFixed(2)} M
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
