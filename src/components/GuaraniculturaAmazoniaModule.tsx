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
  Flame,
  Zap,
  Coffee
} from 'lucide-react';

interface LoteGuarana {
  id: string;
  identificacao: string;
  clone: 'BRS Maués (Indicação Geográfica)' | 'BRS Cereçaporanga' | 'BRS Andirá';
  areaHa: number;
  graoSecoKg: number;
  teorCafeinaPct: number;
  antocianinasTotaisMg: number;
  statusTorra: 'TORRADO_FORNO_BARRO' | 'FERMENTACAO_MUCO' | 'SECAGEM_SOLAR';
}

export const GuaraniculturaAmazoniaModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guaranazais' | 'torrefacao' | 'cafeina' | 'simulador'>('guaranazais');

  // Lotes de Guaranazeiro
  const [lotes] = useState<LoteGuarana[]>([
    {
      id: 'GUARANA-01',
      identificacao: 'Gleba Rio Urupadi 01 • Maués AM (BRS Maués)',
      clone: 'BRS Maués (Indicação Geográfica)',
      areaHa: 15,
      graoSecoKg: 12000,
      teorCafeinaPct: 4.85,
      antocianinasTotaisMg: 420,
      statusTorra: 'TORRADO_FORNO_BARRO',
    },
    {
      id: 'GUARANA-02',
      identificacao: 'Gleba Baixo Amazonas 02 • Maués AM (BRS Cereçaporanga)',
      clone: 'BRS Cereçaporanga',
      areaHa: 10,
      graoSecoKg: 8000,
      teorCafeinaPct: 4.75,
      antocianinasTotaisMg: 395,
      statusTorra: 'SECAGEM_SOLAR',
    },
  ]);

  // Simulador Econômico do Guaraná
  const [areaHa, setAreaHa] = useState<number>(25);
  const [produtividadeGraoSecoKgHa, setProdutividadeGraoSecoKgHa] = useState<number>(800);
  const [teorCafeinaPct, setTeorCafeinaPct] = useState<number>(4.8);
  const [precoKgGuaranaReais, setPrecoKgGuaranaReais] = useState<number>(45.0);
  const [custoManejoHaReais, setCustoManejoHaReais] = useState<number>(14500.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const producaoTotalKg = areaHa * produtividadeGraoSecoKgHa;
    const cafeinaTotalKg = Number((producaoTotalKg * (teorCafeinaPct / 100)).toFixed(1));
    const receitaBrutaReais = Number((producaoTotalKg * precoKgGuaranaReais).toFixed(2));
    const custoTotalReais = Number((areaHa * custoManejoHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaReais || 1)) * 100).toFixed(1));

    return {
      producaoTotalKg,
      cafeinaTotalKg,
      receitaBrutaReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaHa,
    produtividadeGraoSecoKgHa,
    teorCafeinaPct,
    precoKgGuaranaReais,
    custoManejoHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/70 border border-red-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-red-500/20 text-red-300 border border-red-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5" />
                Módulo 108 • Guaranicultura Sustentável da Amazônia
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-800 border border-amber-500/30 rounded-full">
                IG Maués • 4.8% Cafeína Pura
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              🔴 Guaranicultura de Precisão: Clones BRS, Colheita & Torra Maués
            </h2>
            <p className="text-sm text-slate-900 max-w-3xl leading-relaxed">
              Manejo do guaranazeiro (*Paullinia cupana*) com clones resistentes à antracnose, colheita seletiva de frutos maduros em deiscência ("olho de boi"), fermentação biológica e torrefação artesanal em fornos de barro a 140°C para Indicação Geográfica (IG Maués).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Grão Torrado</span>
              <span className="text-xl font-black text-red-400">20.000 kg</span>
              <span className="text-[10px] text-slate-600 block mt-0.5">25 ha Pomar</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Faturamento</span>
              <span className="text-xl font-black text-amber-700">R$ 900.000</span>
              <span className="text-[10px] text-amber-700/80 block mt-0.5">59.7% Margem</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-red-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Teor de Cafeína</span>
            <Zap className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">4.80% Natural</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            4x mais cafeína que o café
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-red-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cafeína Pura Extraível</span>
            <Activity className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">960.0 kg Puro</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Indústria Farmacêutica e Bebidas
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-red-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Preço IG Maués</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-700">R$ 45,00 / kg</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Selo de Origem Geográfica
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-red-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-black text-teal-700">R$ 537.500,00</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            R$ 21.500,00 por hectare
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('guaranazais')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'guaranazais'
              ? 'bg-red-500 text-white shadow-md font-black'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Leaf className="w-4 h-4" />
          1. Guaranazais & Clones BRS
        </button>

        <button
          onClick={() => setActiveTab('torrefacao')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'torrefacao'
              ? 'bg-red-500 text-white shadow-md font-black'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Flame className="w-4 h-4" />
          2. Colheita & Torra em Forno de Barro
        </button>

        <button
          onClick={() => setActiveTab('cafeina')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cafeina'
              ? 'bg-red-500 text-white shadow-md font-black'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Zap className="w-4 h-4" />
          3. Cafeína Pura & Taninos Nobres
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-red-500 text-white shadow-md font-black'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico
        </button>
      </div>

      {/* Conteúdo Aba 1: Guaranazais */}
      {activeTab === 'guaranazais' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-red-400" />
              Lotes de Guaranazeiros Clonares Embrapa Amazônia Ocidental
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              O guaranazeiro cultivado por sementes produz apenas 150 a 200 kg/ha devido à variabilidade genética e suscetibilidade à antracnose (*Colletotrichum guaranicola*). Os clones clonados por estaquia atingem mais de 800 kg/ha com alta tolerância a fungos.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Gleba / Comunidade</th>
                    <th className="py-3 px-3">Clone Embrapa</th>
                    <th className="py-3 px-3">Área (ha)</th>
                    <th className="py-3 px-3">Grão Torrado</th>
                    <th className="py-3 px-3">Cafeína</th>
                    <th className="py-3 px-3">Antocianinas</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {lotes.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{l.identificacao}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{l.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-red-300 font-semibold">{l.clone}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-800">{l.areaHa} ha</td>
                      <td className="py-3.5 px-3 font-mono text-amber-700 font-bold">{l.graoSecoKg.toLocaleString()} kg</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-700 font-bold">{l.teorCafeinaPct}%</td>
                      <td className="py-3.5 px-3 font-mono text-sky-800">{l.antocianinasTotaisMg} mg/kg</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30">
                          {l.statusTorra}
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

      {/* Conteúdo Aba 2: Torrefação */}
      {activeTab === 'torrefacao' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Torrefação Lenta em Fornos de Barro de Maués
            </h3>
            <p className="text-xs text-slate-600">
              Processamento tradicional que confere o aroma defumado característico e cor de chocolate escuro aos bastões de guaraná:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Fermentação de 3 Dias do Arilo Branco</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Facilita o despolpamento biológico mecânico e concentra precursores aromáticos voláteis no interior da amêndoa.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Torra por 4 a 5 Horas a 140°C</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Seca a umidade para 8.5% e carameliza os carboidratos sem volatizar as moléculas bioativas de teobromina e cafeína.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              Certificação de Indicação Geográfica (IG)
            </h3>
            <p className="text-xs text-slate-600">
              Rastreabilidade do território indígena Sateré-Mawé e cooperativas ribeirinhas:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Selo Oficial INPI:</span>
                <span className="font-mono font-bold text-amber-700">IG Maués • Denominação de Origem</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Ágio no Mercado Global:</span>
                <span className="font-mono font-bold text-emerald-700">+50% vs Guaraná Convencional</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Cafeína */}
      {activeTab === 'cafeina' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-amber-700" />
              Concentração Fitoquímica e Aporte Energético
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              O guaraná contém o maior percentual natural de cafeína do reino vegetal. Além disso, a presença de taninos condensados forma complexos moleculares que retardam a liberação da cafeína no organismo, garantindo efeito estimulante prolongado de até 6 horas sem taquicardia ou picos abruptos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Cafeína Natural</span>
                <span className="text-2xl font-black text-slate-900 font-mono">4.8% a 5.2%</span>
                <span className="text-[11px] text-amber-700 block">Contra 1.2% no café arábica</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Teofilina e Teobromina</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">0.45%</span>
                <span className="text-[11px] text-slate-600 block">Broncodilatador natural</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Destino Comercial</span>
                <span className="text-2xl font-black text-red-400 font-mono">Energy Drinks</span>
                <span className="text-[11px] text-slate-600 block">Cosméticos e suplementos esportivos</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-red-400" />
              Parâmetros da Guaranicultura
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Área Plantada (ha)</span>
                <span className="font-mono text-red-400">{areaHa} hectares</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={areaHa}
                onChange={(e) => setAreaHa(Number(e.target.value))}
                className="w-full accent-red-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Produtividade Grão Torrado (kg/ha)</span>
                <span className="font-mono text-sky-700">{produtividadeGraoSecoKgHa} kg/ha</span>
              </div>
              <input
                type="range"
                min="400"
                max="1200"
                step="50"
                value={produtividadeGraoSecoKgHa}
                onChange={(e) => setProdutividadeGraoSecoKgHa(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Preço Venda Grão IG Maués (R$/kg)</span>
                <span className="font-mono text-amber-700">R$ {precoKgGuaranaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="30.0"
                max="70.0"
                step="1.0"
                value={precoKgGuaranaReais}
                onChange={(e) => setPrecoKgGuaranaReais(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Custo de Manejo e Torra por Ha</span>
                <span className="font-mono text-rose-700">R$ {custoManejoHaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="8000"
                max="25000"
                step="500"
                value={custoManejoHaReais}
                onChange={(e) => setCustoManejoHaReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              Retorno Financeiro da Guaranicultura
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Grão Torrado</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {(metricas.producaoTotalKg / 1000).toFixed(1)} ton
                </span>
                <span className="text-[10px] text-slate-600 block">{areaHa} ha colhidos</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Cafeína Pura</span>
                <span className="font-mono font-bold text-amber-700 text-base">
                  {metricas.cafeinaTotalKg.toFixed(0)} kg
                </span>
                <span className="text-[10px] text-amber-700/80 block">4.8% ativo puro</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  R$ {(metricas.receitaBrutaReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-slate-600 block">Selo IG Maués</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  R$ {(metricas.lucroLiquidoReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-700/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Receita com Venda de Sementes Tostadas ({metricas.producaoTotalKg.toLocaleString()} kg @ R$ {precoKgGuaranaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-slate-900">
                  R$ {metricas.receitaBrutaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custos de Poda, Colheita Manual Seletiva e Fornos de Torra:</span>
                <span className="font-mono font-bold text-rose-700">
                  - R$ {metricas.custoTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-red-950/30 px-3 rounded-lg border border-red-800/50">
                <span className="text-slate-900">Lucro Líquido Anual Consolidado:</span>
                <span className="font-mono text-emerald-800">
                  R$ {metricas.lucroLiquidoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuaraniculturaAmazoniaModule;
