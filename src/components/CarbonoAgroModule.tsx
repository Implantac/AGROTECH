import React, { useState } from 'react';
import {
  Leaf,
  Trees,
  Recycle,
  Globe2,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Plus,
  Scale,
  Sparkles,
  FileBadge,
  ShieldCheck
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

export interface InventarioCarbonoTalhao {
  talhaoId: string;
  codigo: string;
  nome: string;
  areaHa: number;
  litrosDieselConsumidos: number;
  tonCalcarioAplicadas: number;
  kgNitrogenioSintetico: number;
  praticaRegenerativa: string;
  taxaSequestroTonHaAno: number; // Ex: 1.45 t CO2e/ha/ano no SPD consolidado com braquiária
}

const INVENTARIO_INICIAL: InventarioCarbonoTalhao[] = [
  {
    talhaoId: 'talhao-01',
    codigo: 'TAL-01',
    nome: 'Talhão Sede Norte',
    areaHa: 420.5,
    litrosDieselConsumidos: 20184, // ~48 L/ha
    tonCalcarioAplicadas: 420.0,
    kgNitrogenioSintetico: 8410,
    praticaRegenerativa: 'Plantio Direto Consolidado (12 anos) + FBN',
    taxaSequestroTonHaAno: 1.45,
  },
  {
    talhaoId: 'talhao-02',
    codigo: 'TAL-02',
    nome: 'Talhão Represa Leste',
    areaHa: 380.0,
    litrosDieselConsumidos: 18620,
    tonCalcarioAplicadas: 380.0,
    kgNitrogenioSintetico: 7600,
    praticaRegenerativa: 'Plantio Direto + Braquiária Ruziziensis',
    taxaSequestroTonHaAno: 1.50,
  },
  {
    talhaoId: 'talhao-03',
    codigo: 'TAL-03',
    nome: 'Talhão Pivô Central 01',
    areaHa: 510.0,
    litrosDieselConsumidos: 21930,
    tonCalcarioAplicadas: 510.0,
    kgNitrogenioSintetico: 10200,
    praticaRegenerativa: 'Irrigação Eficiente + Rotação Soja/Feijão/Milho',
    taxaSequestroTonHaAno: 1.55,
  },
  {
    talhaoId: 'talhao-04',
    codigo: 'TAL-04',
    nome: 'Talhão Platô Sul',
    areaHa: 450.0,
    litrosDieselConsumidos: 22950,
    tonCalcarioAplicadas: 450.0,
    kgNitrogenioSintetico: 9000,
    praticaRegenerativa: 'Plantio Direto na Palha + Adubação Verde',
    taxaSequestroTonHaAno: 1.40,
  },
  {
    talhaoId: 'talhao-05',
    codigo: 'TAL-05',
    nome: 'Talhão Córrego Fundo',
    areaHa: 360.0,
    litrosDieselConsumidos: 19440,
    tonCalcarioAplicadas: 360.0,
    kgNitrogenioSintetico: 18000, // Milho safrinha consome mais N
    praticaRegenerativa: 'Consórcio Milho Safrinha com Braquiária',
    taxaSequestroTonHaAno: 1.60,
  },
];

export const CarbonoAgroModule: React.FC = () => {
  const [inventario] = useState<InventarioCarbonoTalhao[]>(INVENTARIO_INICIAL);
  const [precoCreditoCarbonoBRL, setPrecoCreditoCarbonoBRL] = useState<number>(85.00); // R$ 85,00 por t CO2e (~US$ 15,50)

  // Cálculos do GHG Protocol Agro
  const dadosCalculados = inventario.map((item) => {
    const emissaoDiesel = (item.litrosDieselConsumidos * 2.68) / 1000;
    const emissaoCalcario = item.tonCalcarioAplicadas * 0.44;
    const emissaoN = (item.kgNitrogenioSintetico * 5.43) / 1000;
    const totalEmissoesTon = emissaoDiesel + emissaoCalcario + emissaoN;

    const totalSequestroTon = item.areaHa * item.taxaSequestroTonHaAno;
    const balancoLiquidoTon = totalEmissoesTon - totalSequestroTon;
    const saldoCprVerdeTon = balancoLiquidoTon < 0 ? Math.abs(balancoLiquidoTon) : 0;
    const receitaPotencialCprVerde = saldoCprVerdeTon * precoCreditoCarbonoBRL;

    return {
      ...item,
      emissaoDiesel,
      emissaoCalcario,
      emissaoN,
      totalEmissoesTon,
      totalSequestroTon,
      balancoLiquidoTon,
      saldoCprVerdeTon,
      receitaPotencialCprVerde,
    };
  });

  const totalAreaAuditada = dadosCalculados.reduce((acc, curr) => acc + curr.areaHa, 0);
  const totalEmissoes = dadosCalculados.reduce((acc, curr) => acc + curr.totalEmissoesTon, 0);
  const totalSequestro = dadosCalculados.reduce((acc, curr) => acc + curr.totalSequestroTon, 0);
  const balancoGeral = totalEmissoes - totalSequestro;
  const totalCprVerdeTon = balancoGeral < 0 ? Math.abs(balancoGeral) : 0;
  const receitaTotalCprVerde = totalCprVerdeTon * precoCreditoCarbonoBRL;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#1D4B38]">Balanço de Carbono GHG Protocol & CPR Verde</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 rounded-full">
                  Carbon Negative (Sumidouro)
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-cyan-500/20 text-sky-800 border border-cyan-500/30 rounded-full">
                  Lei 13.986 (CPR Verde)
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-0.5">
                Inventário de Escopo 1 (diesel, calcário, N₂O) vs sequestro no solo por Plantio Direto e palhada de braquiária.
              </p>
            </div>
          </div>
        </div>

        {/* Cotação do Crédito de Carbono */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-600">Cotação do Crédito:</span>
          <input
            type="number"
            value={precoCreditoCarbonoBRL}
            onChange={(e) => setPrecoCreditoCarbonoBRL(Number(e.target.value))}
            className="w-16 bg-white border border-slate-300 rounded px-2 py-0.5 text-emerald-700 font-mono font-bold"
          />
          <span className="text-slate-600 font-mono">R$/t CO₂e</span>
        </div>
      </div>

      {/* Cards de Métricas Climáticas & CPR Verde */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Emissões de Escopo 1</span>
            <TrendingDown className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-bold text-[#1D4B38] font-mono">
            {totalEmissoes.toFixed(1)} t CO₂e
          </div>
          <p className="text-xs text-slate-500 mt-1">Diesel frotas + Calcário + Fertilizantes N</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Sequestro no Solo</span>
            <Trees className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 font-mono">
            {totalSequestro.toFixed(1)} t CO₂e
          </div>
          <p className="text-xs text-slate-500 mt-1">Plantio Direto na Palha + Braquiária</p>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-xl">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Balanço Líquido (Sumidouro)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-emerald-200 font-mono">
            {balancoGeral.toFixed(1)} t CO₂e
          </div>
          <p className="text-xs text-emerald-700/80 mt-1">A fazenda sequestra 2.1x mais do que emite</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-800/60 p-4 rounded-xl">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Potencial CPR Verde</span>
            <DollarSign className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-bold text-sky-800 font-mono">
            R$ {(receitaTotalCprVerde / 1000).toFixed(1)}k
          </div>
          <p className="text-xs text-sky-700/80 mt-1">{totalCprVerdeTon.toFixed(1)} créditos monetizáveis</p>
        </div>
      </div>

      {/* Tabela do Inventário por Talhão */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
              <Recycle className="w-5 h-5 text-emerald-700" />
              Inventário de Emissões & Sequestro Talhão a Talhão
            </h2>
            <p className="text-xs text-slate-600">Metodologia oficial GHG Protocol Agropecuário e Embrapa Meio Ambiente</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Talhão & Área</th>
                <th className="px-4 py-3.5">Manejo Regenerativo</th>
                <th className="px-4 py-3.5">Emissão Escopo 1 (t CO₂e)</th>
                <th className="px-4 py-3.5">Sequestro Solo (t CO₂e)</th>
                <th className="px-4 py-3.5">Balanço Líquido</th>
                <th className="px-4 py-3.5">Crédito CPR Verde (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dadosCalculados.map((item) => (
                <tr key={item.talhaoId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">{item.codigo} - {item.nome}</div>
                    <div className="text-[11px] text-slate-600 font-mono">{item.areaHa} ha</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="text-slate-900 font-medium">{item.praticaRegenerativa}</div>
                    <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                      Taxa: {item.taxaSequestroTonHaAno} t CO₂e/ha/ano
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-mono">
                    <div className="font-bold text-amber-800">
                      {item.totalEmissoesTon.toFixed(2)} t CO₂e
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Diesel: {item.emissaoDiesel.toFixed(1)}t • Calc: {item.emissaoCalcario.toFixed(1)}t
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-mono">
                    <div className="font-bold text-emerald-800">
                      {item.totalSequestroTon.toFixed(2)} t CO₂e
                    </div>
                    <span className="text-[10px] text-slate-500">Fixado na Matéria Orgânica</span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-800 border border-emerald-500/40 flex items-center gap-1 w-fit font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      {item.balancoLiquidoTon.toFixed(2)} t CO₂e (Negativo)
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-mono font-bold text-sky-800">
                    R$ {item.receitaPotencialCprVerde.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CarbonoAgroModule;
