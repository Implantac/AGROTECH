import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  Box,
  Truck,
  Leaf,
  Filter,
  DollarSign,
  Activity,
  Award,
  Globe,
  TrendingUp,
  Anchor,
  Compass
} from 'lucide-react';

interface PracaPortuaria {
  porto: string;
  basisCentsBushel: number;
  cotacaoFobUsdTon: number;
  freteMedioReaisSaca: number;
  tempoEsperaNaviosDias: number;
  statusFila: 'FLUXO_NORMAL' | 'FILA_MODERADA' | 'RISCO_DEMURRAGE';
}

export const InteligenciaBasisPortuarioModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'paridade' | 'portos' | 'fretes' | 'simulador'>('paridade');

  // Praças Portuárias Principais
  const [pracas] = useState<PracaPortuaria[]>([
    {
      porto: 'Porto de Paranaguá (PR)',
      basisCentsBushel: 65,
      cotacaoFobUsdTon: 483.18,
      freteMedioReaisSaca: 18.50,
      tempoEsperaNaviosDias: 12,
      statusFila: 'FLUXO_NORMAL',
    },
    {
      porto: 'Porto de Santos (SP)',
      basisCentsBushel: 70,
      cotacaoFobUsdTon: 485.02,
      freteMedioReaisSaca: 19.80,
      tempoEsperaNaviosDias: 16,
      statusFila: 'FILA_MODERADA',
    },
    {
      porto: 'Arco Norte • Barcarena (PA)',
      basisCentsBushel: 58,
      cotacaoFobUsdTon: 480.61,
      freteMedioReaisSaca: 16.20,
      tempoEsperaNaviosDias: 8,
      statusFila: 'FLUXO_NORMAL',
    },
    {
      porto: 'Arco Norte • Itaqui (MA)',
      basisCentsBushel: 62,
      cotacaoFobUsdTon: 482.08,
      freteMedioReaisSaca: 17.00,
      tempoEsperaNaviosDias: 10,
      statusFila: 'FLUXO_NORMAL',
    },
  ]);

  // Simulador de Paridade de Exportação
  const [cbotCentsBushel, setCbotCentsBushel] = useState<number>(1250.0);
  const [basisCentsBushel, setBasisCentsBushel] = useState<number>(65.0);
  const [cambioUsdBrl, setCambioUsdBrl] = useState<number>(5.40);
  const [freteFazendaPortoSacaReais, setFreteFazendaPortoSacaReais] = useState<number>(18.50);
  const [elevacaoPortuariaSacaReais, setElevacaoPortuariaSacaReais] = useState<number>(4.20);
  const [volumeVendaSacas, setVolumeVendaSacas] = useState<number>(50000);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    // 36.7437 bushels por tonelada métrica
    const precoFobCentsBushel = cbotCentsBushel + basisCentsBushel;
    const precoFobUsdBushel = precoFobCentsBushel / 100;
    const precoFobUsdTon = Number((precoFobUsdBushel * 36.7437).toFixed(2));

    // 1 saca de soja = 60 kg = 0.06 ton
    const precoFobReaisSaca = Number((precoFobUsdTon * cambioUsdBrl * 0.06).toFixed(2));
    const paridadeFazendaLiquidaSaca = Number((precoFobReaisSaca - freteFazendaPortoSacaReais - elevacaoPortuariaSacaReais).toFixed(2));
    const receitaTotalVendaReais = Number((paridadeFazendaLiquidaSaca * volumeVendaSacas).toFixed(2));

    return {
      precoFobUsdTon,
      precoFobReaisSaca,
      paridadeFazendaLiquidaSaca,
      receitaTotalVendaReais,
    };
  }, [
    cbotCentsBushel,
    basisCentsBushel,
    cambioUsdBrl,
    freteFazendaPortoSacaReais,
    elevacaoPortuariaSacaReais,
    volumeVendaSacas,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/80 border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Módulo 110 • Inteligência de Basis & Arbitragem Portuária
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                FOB Santos/Paranaguá • CBOT • Paridade de Exportação
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🚢 Arbitragem de Basis Portuário & Paridade de Exportação
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Cálculo contínuo da paridade de exportação fazenda-porto: cotações em tempo real na Bolsa de Chicago (CME/CBOT), prêmios de exportação (basis Paranaguá, Santos, Itaqui e Barcarena), câmbio PTAX, fretes rodoviários e riscos de demurrage na fila de navios.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FOB Porto</span>
              <span className="text-xl font-black text-blue-400">R$ 156,55</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Por Saca 60kg</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paridade Fazenda</span>
              <span className="text-xl font-black text-emerald-400">R$ 133,85</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">Líquido no Interior</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cotação CBOT Soja</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">1.250,0 ¢/bu</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Vencimento Safra Ativo
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Basis Paranaguá</span>
            <Anchor className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">+ 65,0 ¢/bu</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Prêmio Firme para Embarque Rápido
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Dólar PTAX Comercial</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">R$ 5,4000</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Taxa Referencial de Câmbio
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lote Simulado (50k sc)</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">R$ 6.692.500,00</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Receita Líquida na Fazenda
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('paridade')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'paridade'
              ? 'bg-blue-600 text-white shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          1. Paridade de Exportação
        </button>

        <button
          onClick={() => setActiveTab('portos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'portos'
              ? 'bg-blue-600 text-white shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Anchor className="w-4 h-4" />
          2. Matriz de Portos & Basis
        </button>

        <button
          onClick={() => setActiveTab('fretes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'fretes'
              ? 'bg-blue-600 text-white shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          3. Corredores de Frete & Fila
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-blue-600 text-white shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Dinâmico
        </button>
      </div>

      {/* Conteúdo Aba 1: Paridade */}
      {activeTab === 'paridade' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Cálculo Passo a Passo da Paridade de Exportação
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              A paridade de exportação estabelece o preço justo da commodity na fazenda, descontando da cotação internacional FOB os custos logísticos de transporte terrestre e taxas portuárias.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">1. Formação do Preço FOB</span>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">CBOT Chicago:</span>
                  <span className="text-white font-bold">{cbotCentsBushel.toFixed(1)} ¢/bu</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Basis Paranaguá:</span>
                  <span className="text-blue-400 font-bold">+{basisCentsBushel.toFixed(1)} ¢/bu</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-bold">
                  <span className="text-slate-200 font-sans">FOB USD/Ton:</span>
                  <span className="text-emerald-400 font-bold">USD {metricas.precoFobUsdTon.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">2. Conversão Cambial</span>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Câmbio USD/BRL:</span>
                  <span className="text-amber-400 font-bold">R$ {cambioUsdBrl.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Fator Saca (60kg):</span>
                  <span className="text-slate-300">0.0600</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-bold">
                  <span className="text-slate-200 font-sans">FOB Reais/Saca:</span>
                  <span className="text-cyan-400 font-bold">R$ {metricas.precoFobReaisSaca.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">3. Descontos Logísticos</span>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Frete Rodoviário:</span>
                  <span className="text-rose-400 font-bold">- R$ {freteFazendaPortoSacaReais.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Elevação Portuária:</span>
                  <span className="text-rose-400 font-bold">- R$ {elevacaoPortuariaSacaReais.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-bold">
                  <span className="text-slate-200 font-sans">Líquido na Fazenda:</span>
                  <span className="text-emerald-400 font-black">R$ {metricas.paridadeFazendaLiquidaSaca.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Portos */}
      {activeTab === 'portos' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Anchor className="w-5 h-5 text-blue-400" />
              Matriz Comparativa de Basis nos Portos Brasileiros
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              A decisão de direcionar a carga para Santos, Paranaguá ou portos do Arco Norte (Barcarena/Itaqui) depende do diferencial de basis versus a economia de frete rodoviário por tonelada.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Porto de Exportação</th>
                    <th className="py-3 px-3">Basis (¢/bu)</th>
                    <th className="py-3 px-3">FOB USD/Ton</th>
                    <th className="py-3 px-3">Frete Médio/Sc</th>
                    <th className="py-3 px-3">Fila Navios</th>
                    <th className="py-3 px-3">Status Logístico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {pracas.map((p) => (
                    <tr key={p.porto} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{p.porto}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-blue-400 font-bold">+{p.basisCentsBushel} ¢/bu</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">USD {p.cotacaoFobUsdTon.toFixed(2)}</td>
                      <td className="py-3.5 px-3 font-mono text-white">R$ {p.freteMedioReaisSaca.toFixed(2)}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">{p.tempoEsperaNaviosDias} dias</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {p.statusFila}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Fretes */}
      {activeTab === 'fretes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-400" />
              Corredores de Exportação do Arco Norte
            </h3>
            <p className="text-xs text-slate-400">
              Economia logística para cargas originadas acima do Paralelo 16°S (Norte do MT, PA, TO, MA):
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Barcarena / Miritituba (Hidrovia Tapajós)</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Redução de até R$ 4,00 por saca no frete e 4 dias a menos de navegação marítima até a Europa e Canal do Panamá.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-bold text-white block">Ferrovia Norte-Sul para o Porto do Itaqui</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Terminais de transbordo rodoferroviário de alta capacidade com calado natural profundo para navios Capesize.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Controle de Risco de Demurrage
            </h3>
            <p className="text-xs text-slate-400">
              Custo diário por estadia excedente de navios graneleiros:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Diária Média Navio Panamax:</span>
                <span className="font-mono font-bold text-rose-400">USD 22.000 / dia</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Janela de Nomeação Segura:</span>
                <span className="font-mono font-bold text-emerald-400">Slot pré-agendado no line-up</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Variáveis de Mercado Internacional
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>CBOT Chicago (¢/bushel)</span>
                <span className="font-mono text-emerald-400">{cbotCentsBushel.toFixed(1)} ¢/bu</span>
              </div>
              <input
                type="range"
                min="950"
                max="1600"
                step="10"
                value={cbotCentsBushel}
                onChange={(e) => setCbotCentsBushel(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Basis Paranaguá (¢/bushel)</span>
                <span className="font-mono text-blue-400">+{basisCentsBushel.toFixed(1)} ¢/bu</span>
              </div>
              <input
                type="range"
                min="-50"
                max="180"
                step="5"
                value={basisCentsBushel}
                onChange={(e) => setBasisCentsBushel(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Taxa de Câmbio USD/BRL</span>
                <span className="font-mono text-amber-400">R$ {cambioUsdBrl.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="4.50"
                max="6.50"
                step="0.05"
                value={cambioUsdBrl}
                onChange={(e) => setCambioUsdBrl(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Frete Rodoviário Fazenda-Porto (R$/sc)</span>
                <span className="font-mono text-rose-400">R$ {freteFazendaPortoSacaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="10.0"
                max="32.0"
                step="0.5"
                value={freteFazendaPortoSacaReais}
                onChange={(e) => setFreteFazendaPortoSacaReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Resultado da Comercialização Programada
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">FOB USD</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  USD {metricas.precoFobUsdTon.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block">por tonelada</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">FOB Reais</span>
                <span className="font-mono font-bold text-blue-400 text-base">
                  R$ {metricas.precoFobReaisSaca.toFixed(2)}
                </span>
                <span className="text-[10px] text-blue-400/80 block">no costado navio</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Paridade Fazenda</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {metricas.paridadeFazendaLiquidaSaca.toFixed(2)}
                </span>
                <span className="text-[10px] text-emerald-400 block">livre de frete</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Faturamento Lote</span>
                <span className="font-mono font-bold text-teal-400 text-base">
                  R$ {(metricas.receitaTotalVendaReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-teal-400/80 block">{volumeVendaSacas.toLocaleString()} sacas</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Preço Bruto FOB no Porto ({volumeVendaSacas.toLocaleString()} sacas @ R$ {metricas.precoFobReaisSaca.toFixed(2)}):</span>
                <span className="font-mono font-bold text-white">
                  R$ {(metricas.precoFobReaisSaca * volumeVendaSacas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Desconto do Frete Rodoviário Fazenda-Porto:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {(freteFazendaPortoSacaReais * volumeVendaSacas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Desconto da Elevação Portuária e Agendamento:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {(elevacaoPortuariaSacaReais * volumeVendaSacas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-blue-950/30 px-3 rounded-lg border border-blue-800/50">
                <span className="text-white">Receita Líquida Creditada na Fazenda:</span>
                <span className="font-mono text-emerald-300">
                  R$ {metricas.receitaTotalVendaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteligenciaBasisPortuarioModule;
