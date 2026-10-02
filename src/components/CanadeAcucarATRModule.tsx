import React, { useState, useMemo } from 'react';
import {
  Factory,
  Droplets,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Leaf,
  Layers,
  Info
} from 'lucide-react';

interface TalhaoCanavial {
  id: string;
  nome: string;
  variedade: string; // RB966928, CTC4, RB867515
  estagioCorte: 'CANA_PLANTA' | 'SOCA_1' | 'SOCA_2' | 'SOCA_3' | 'SOCA_4';
  tchEstimadoTonHa: number;
  polCaldoPct: number;
  arCaldoPct: number;
  areaHa: number;
  statusMaturacao: 'MATURA_COLHER' | 'EM_MATURACAO' | 'APLICAR_MATURADOR';
}

export const CanadeAcucarATRModule: React.FC = () => {
  const [talhoes, setTalhoes] = useState<TalhaoCanavial[]>([
    {
      id: 'TAL-CANA-01',
      nome: 'Gleba Usina Norte • Talhão 12',
      variedade: 'RB966928 (Precoce / Alto Teor)',
      estagioCorte: 'SOCA_2',
      tchEstimadoTonHa: 98.0,
      polCaldoPct: 15.2,
      arCaldoPct: 0.78,
      areaHa: 180,
      statusMaturacao: 'MATURA_COLHER',
    },
    {
      id: 'TAL-CANA-02',
      nome: 'Gleba Rio Claro • Talhão 08',
      variedade: 'CTC4 (Média / Rústica)',
      estagioCorte: 'SOCA_1',
      tchEstimadoTonHa: 105.0,
      polCaldoPct: 14.6,
      arCaldoPct: 0.85,
      areaHa: 220,
      statusMaturacao: 'MATURA_COLHER',
    },
    {
      id: 'TAL-CANA-03',
      nome: 'Gleba Chapadão • Talhão 05',
      variedade: 'RB867515 (Tardia / Produtiva)',
      estagioCorte: 'CANA_PLANTA',
      tchEstimadoTonHa: 118.0,
      polCaldoPct: 13.8,
      arCaldoPct: 0.95,
      areaHa: 150,
      statusMaturacao: 'APLICAR_MATURADOR',
    },
  ]);

  const [precoKgAtrReais, setPrecoKgAtrReais] = useState<number>(1.24); // R$ 1,24/kg ATR (Consecana)
  const [doseVinhacaM3Ha, setDoseVinhacaM3Ha] = useState<number>(150); // 150 m³/ha vinhaça localizada
  const [custoKclKgReais, setCustoKclKgReais] = useState<number>(3.30); // R$ 3,30/kg fertilizante mineral KCl

  // Cálculos do Modelo Consecana e Vinhaça
  const canaMetrics = useMemo(() => {
    // 1. Área Total e Toneladas Totais de Cana (TCH)
    const areaTotalHa = talhoes.reduce((acc, t) => acc + t.areaHa, 0);
    const toneladasCanaTotais = talhoes.reduce((acc, t) => acc + t.areaHa * t.tchEstimadoTonHa, 0);
    const tchMedio = areaTotalHa > 0 ? toneladasCanaTotais / areaTotalHa : 0;

    // 2. Cálculo do ATR Médio Ponderado Oficial (Consecana): ATR = (9.5263 * Pol) + (9.0 * AR)
    let totalAtrKg = 0;
    talhoes.forEach((t) => {
      const atrKgPorTon = 9.5263 * t.polCaldoPct + 9.0 * t.arCaldoPct;
      const tonCanaTalhao = t.areaHa * t.tchEstimadoTonHa;
      totalAtrKg += tonCanaTalhao * atrKgPorTon;
    });

    const atrMedioKgTon = toneladasCanaTotais > 0 ? totalAtrKg / toneladasCanaTotais : 140.0;

    // 3. Receita Bruta Consecana
    const receitaBrutaTotalReais = totalAtrKg * precoKgAtrReais;
    const receitaPorHaReais = areaTotalHa > 0 ? receitaBrutaTotalReais / areaTotalHa : 0;

    // 4. Benefício Ambiental e Econômico da Vinhaça Localizada (Norma CETESB P4.231)
    // Aporte de K2O da vinhaça: ~2.1 kg K2O / m³
    const k2oAportadoHaKg = doseVinhacaM3Ha * 2.1;
    const kclSubstituidoHaKg = k2oAportadoHaKg / 0.6; // KCl é 60% K2O
    const economiaAduboMineralPorHa = kclSubstituidoHaKg * custoKclKgReais;
    const economiaTotalVinhacaFazenda = economiaAduboMineralPorHa * areaTotalHa;

    return {
      areaTotalHa,
      toneladasCanaTotais,
      tchMedio,
      totalAtrKg,
      atrMedioKgTon,
      receitaBrutaTotalReais,
      receitaPorHaReais,
      k2oAportadoHaKg,
      kclSubstituidoHaKg,
      economiaAduboMineralPorHa,
      economiaTotalVinhacaFazenda,
    };
  }, [talhoes, precoKgAtrReais, doseVinhacaM3Ha, custoKclKgReais]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Cana-de-Açúcar • Modelo Consecana & Fertirrigação c/ Vinhaça
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                    ATR Consecana • CETESB P4.231
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Açúcar Total Recuperável (ATR), curvas de maturação, TCH e reciclagem agronômica de vinhaça localizada.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              ATR Médio: {canaMetrics.atrMedioKgTon.toFixed(2)} kg ATR/ton
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: ATR Médio */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>ATR Consecana</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            {canaMetrics.atrMedioKgTon.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-600">kg ATR/t cana</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Pol média: 14.6% • Açúcares Redutores: 0.84%.
          </p>
        </div>

        {/* KPI 2: Produtividade TCH */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Produtividade Canavial</span>
            <Scale className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            {canaMetrics.tchMedio.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-600">TCH (t/ha)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total: {canaMetrics.toneladasCanaTotais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} t cana colhidas.
          </p>
        </div>

        {/* KPI 3: Economia de Potássio (Vinhaça) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Economia de KCl (Vinhaça)</span>
            <Leaf className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            R$ {canaMetrics.economiaTotalVinhacaFazenda.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            R$ {canaMetrics.economiaAduboMineralPorHa.toFixed(2)}/ha economizados em KCl mineral.
          </p>
        </div>

        {/* KPI 4: Faturamento Consecana / ha */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Receita Consecana</span>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            R$ {canaMetrics.receitaPorHaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-emerald-400">/ ha</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total: R$ {canaMetrics.receitaBrutaTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} ({canaMetrics.areaTotalHa} ha).
          </p>
        </div>
      </div>

      {/* Grid Principal: Talhões de Cana e Parâmetros Consecana */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Lista de Talhões de Cana */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Talhões do Canavial & Rastreabilidade de Maturação
              </h3>
              <p className="text-xs text-slate-600">
                Pol do caldo, estágios de corte e cronograma de descarregamento na usina.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              {talhoes.length} Talhões Monitorados
            </span>
          </div>

          <div className="space-y-3">
            {talhoes.map((t) => {
              const atrTalhao = (9.5263 * t.polCaldoPct + 9.0 * t.arCaldoPct).toFixed(1);
              return (
                <div
                  key={t.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                        {t.id}
                      </span>
                      <h4 className="text-xs font-bold text-white">{t.nome}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border self-start sm:self-auto ${
                        t.statusMaturacao === 'MATURA_COLHER'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {t.statusMaturacao.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono">
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">ATR Calculado</span>
                      <span className="text-emerald-400 font-bold">{atrTalhao} kg/t</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">TCH Estimado</span>
                      <span className="text-cyan-400 font-bold">{t.tchEstimadoTonHa} t/ha</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Área & Corte</span>
                      <span className="text-white font-bold">{t.areaHa} ha • {t.estagioCorte}</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Variedade</span>
                      <span className="text-amber-300 font-bold truncate">{t.variedade.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Técnico Consecana e Vinhaça */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes Técnicas Consecana & Vinhaça Sustentável:
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>
                <strong>Fórmula Oficial Consecana:</strong> O ATR reflete os quilogramas de açúcares cristalizáveis por tonelada de cana líquida moída.
              </li>
              <li>
                <strong>Norma CETESB P4.231:</strong> A aplicação de vinhaça localizada não pode ultrapassar a capacidade de troca catiônica (CTC) de Potássio no solo, prevenindo contaminação de aquíferos subterrâneos.
              </li>
              <li>
                <strong>Economia Circular de Fertilizantes:</strong> 150 m³/ha de vinhaça devolvem 315 kg de K₂O por hectare, eliminando a dependência de fertilizantes potássicos importados.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros de Mercado Consecana */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            Parâmetros Consecana
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Preço do kg de ATR (R$/kg ATR)</label>
              <input
                type="number"
                step="0.01"
                value={precoKgAtrReais}
                onChange={(e) => setPrecoKgAtrReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Dose de Vinhaça Localizada</span>
                <span className="text-amber-400 font-mono font-bold">{doseVinhacaM3Ha} m³/ha</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="10"
                value={doseVinhacaM3Ha}
                onChange={(e) => setDoseVinhacaM3Ha(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Cotação do KCl Mineral (R$/kg)</label>
              <input
                type="number"
                step="0.10"
                value={custoKclKgReais}
                onChange={(e) => setCustoKclKgReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-white font-mono"
              />
            </div>

            {/* Quadro Resumo */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Total de ATR Entregue:</span>
                <span className="text-slate-900 font-mono">
                  {(canaMetrics.totalAtrKg / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} t ATR
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Substituição de KCl:</span>
                <span className="text-amber-400 font-mono font-bold">
                  {canaMetrics.kclSubstituidoHaKg.toFixed(0)} kg KCl/ha
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-white">Receita Líquida Estimada:</span>
                <span className="text-emerald-400 font-mono">
                  R$ {canaMetrics.receitaBrutaTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
