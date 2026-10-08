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
  Zap,
  Droplets,
  Sun
} from 'lucide-react';

interface CamadaVertical {
  id: string;
  identificacao: string;
  cultura: string;
  camadas: number;
  diasCiclo: number;
  ppfdUmolM2S: number;
  temperaturaC: number;
  vpdKpa: number;
  pressaoBicosPsi: number;
  status: 'EM_CRESCIMENTO' | 'COLHEITA_PROGRAMADA' | 'SANITIZACAO_CAMADA';
}

export const FazendasVerticaisAeroponiaModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'camadas' | 'led_espectro' | 'aeroponia' | 'simulador'>('camadas');

  // Camadas Verticais da Instalação Indoor
  const [camadas] = useState<CamadaVertical[]>([
    {
      id: 'RACK-VERTICAL-01',
      identificacao: 'Torre Vertical A • Rúcula Baby Leaf Selvagem',
      cultura: 'Rúcula Baby Leaf',
      camadas: 8,
      diasCiclo: 12,
      ppfdUmolM2S: 320,
      temperaturaC: 21.0,
      vpdKpa: 0.95,
      pressaoBicosPsi: 80,
      status: 'COLHEITA_PROGRAMADA',
    },
    {
      id: 'RACK-VERTICAL-02',
      identificacao: 'Torre Vertical B • Manjericão Roxo & Microverdes',
      cultura: 'Manjericão Italiano & Microverdes',
      camadas: 8,
      diasCiclo: 14,
      ppfdUmolM2S: 380,
      temperaturaC: 22.5,
      vpdKpa: 1.05,
      pressaoBicosPsi: 85,
      status: 'EM_CRESCIMENTO',
    },
  ]);

  // Simulador Econômico da Fazenda Vertical
  const [areaPegadaFisicaM2, setAreaPegadaFisicaM2] = useState<number>(450);
  const [camadasVerticais, setCamadasVerticais] = useState<number>(8);
  const [ciclosPorAno, setCiclosPorAno] = useState<number>(28);
  const [produtividadeGramasM2Ciclo, setProdutividadeGramasM2Ciclo] = useState<number>(1200);
  const [precoKgBabyLeafReais, setPrecoKgBabyLeafReais] = useState<number>(32.0);
  const [custoKwhEnergiaMaoObraAnoReais, setCustoKwhEnergiaMaoObraAnoReais] = useState<number>(1450000.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const areaCultivoEquivalenteM2 = areaPegadaFisicaM2 * camadasVerticais;
    const producaoPorCicloKg = (areaCultivoEquivalenteM2 * produtividadeGramasM2Ciclo) / 1000;
    const producaoTotalAnoKg = Number((producaoPorCicloKg * ciclosPorAno).toFixed(1));

    const receitaBrutaReais = Number((producaoTotalAnoKg * precoKgBabyLeafReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoKwhEnergiaMaoObraAnoReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaReais || 1)) * 100).toFixed(1));

    return {
      areaCultivoEquivalenteM2,
      producaoTotalAnoKg,
      receitaBrutaReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaPegadaFisicaM2,
    camadasVerticais,
    ciclosPorAno,
    produtividadeGramasM2Ciclo,
    precoKgBabyLeafReais,
    custoKwhEnergiaMaoObraAnoReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-violet-950/80 via-slate-900 to-indigo-950/70 border border-violet-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-violet-500/20 text-violet-300 border border-violet-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Módulo 96 • Fazendas Verticais & Aeroponia Indoor 4.0
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-cyan-500/20 text-sky-800 border border-cyan-500/30 rounded-full">
                8 Camadas • 98% Menos Água • LED PPFD
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              🏢 Fazendas Verticais CEA & Aeroponia em Alta Pressão
            </h2>
            <p className="text-sm text-slate-900 max-w-3xl leading-relaxed">
              Agricultura de Ambiente Controlado (CEA) em galpões urbanos/rurais com aeroponia de alta pressão (névoa de 30 a 50 micras aplicada diretamente nas raízes suspensas), iluminação espectral LED dinâmica e 28 ciclos anuais sem defensivos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Área Efetiva</span>
              <span className="text-xl font-black text-violet-400">3.600 m²</span>
              <span className="text-[10px] text-slate-600 block mt-0.5">Em 450 m² solo</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Produção Anual</span>
              <span className="text-xl font-black text-emerald-700">120.960 kg</span>
              <span className="text-[10px] text-emerald-700/80 block mt-0.5">Baby Leaf Limpa</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ciclos por Ano</span>
            <Activity className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">28 colheitas / ano</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            13 dias da semente ao prato
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Economia Hídrica</span>
            <Droplets className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black text-sky-700">98.0%</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Recirculação Fechada e Condensação
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faturamento Anual</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-700">R$ 3.870.720,00</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Preço Médio R$ 32,00/kg
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <Award className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-black text-teal-700">R$ 2.420.720,00</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Margem Líquida de 62.5%
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('camadas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'camadas'
              ? 'bg-violet-500 text-white shadow-md font-black'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Layers className="w-4 h-4" />
          1. Torres Verticais & Racks
        </button>

        <button
          onClick={() => setActiveTab('led_espectro')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'led_espectro'
              ? 'bg-violet-500 text-white shadow-md font-black'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Sun className="w-4 h-4" />
          2. Iluminação Espectral LED (PPFD)
        </button>

        <button
          onClick={() => setActiveTab('aeroponia')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'aeroponia'
              ? 'bg-violet-500 text-white shadow-md font-black'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Droplets className="w-4 h-4" />
          3. Aeroponia em Alta Pressão (HPA)
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-violet-500 text-white shadow-md font-black'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico Indoor
        </button>
      </div>

      {/* Conteúdo Aba 1: Camadas */}
      {activeTab === 'camadas' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-violet-400" />
              Torres e Racks com Controle Dinâmico de Clima
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Cada nível possui controle individual de fotoperíodo, vazão de bicos aeropônicos e fluxo de ar laminar para evitar bolsões de estagnação de umidade sobre as folhas.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Torre / Rack</th>
                    <th className="py-3 px-3">Cultura</th>
                    <th className="py-3 px-3">Camadas</th>
                    <th className="py-3 px-3">Dias Ciclo</th>
                    <th className="py-3 px-3">PPFD</th>
                    <th className="py-3 px-3">Temp / VPD</th>
                    <th className="py-3 px-3">Pressão Bicos</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {camadas.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{c.identificacao}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{c.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-violet-300 font-semibold">{c.cultura}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-800">{c.camadas} andares</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-700 font-bold">{c.diasCiclo} dias</td>
                      <td className="py-3.5 px-3 font-mono text-sky-700 font-bold">{c.ppfdUmolM2S} µmol/m²/s</td>
                      <td className="py-3.5 px-3 font-mono text-slate-900">{c.temperaturaC}°C • {c.vpdKpa} kPa</td>
                      <td className="py-3.5 px-3 font-mono text-amber-800">{c.pressaoBicosPsi} PSI</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30">
                          {c.status}
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

      {/* Conteúdo Aba 2: LED Espectro */}
      {activeTab === 'led_espectro' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-700" />
              Espectro Luminoso Customizado por Fase Fenológica
            </h3>
            <p className="text-xs text-slate-600">
              Receitas de luz (Light Recipes) combinando chips LED Samsung Horticultura com canais independentes:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Azul Royal (450 nm - 20%)</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Estimula abertura estomática, densidade de clorofila e evita o estiolamento.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Vermelho Profundo (660 nm - 70%)</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Pico de absorção dos fotossistemas PSI e PSII para ganho acelerado de massa fresca.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Vermelho Distante / Far-Red (730 nm - 10%)</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Efeito Emerson: acelera a taxa fotossintética e expansão da área foliar.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              Eficiência Energética Fotônica
            </h3>
            <p className="text-xs text-slate-600">
              Métricas de conversão de energia elétrica em fótons úteis:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Eficácia Fotônica dos LEDs:</span>
                <span className="font-mono font-bold text-emerald-700">3.1 µmol / Joule</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Duração do Fotoperíodo:</span>
                <span className="font-mono font-bold text-sky-700">18 horas de luz / 6h escuro</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Aeroponia */}
      {activeTab === 'aeroponia' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-sky-700" />
              Aeroponia em Alta Pressão (High-Pressure Aeroponics - HPA)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Ao contrário da hidroponia tradicional onde a raiz fica imersa na água com menor oxigenação, na aeroponia a raiz fica 100% suspensa no ar e recebe pulsos de névoa de 3 segundos a cada 5 minutos, garantindo oxigenação radical de 100% e absorção iônica máxima.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Tamanho da Gota</span>
                <span className="text-2xl font-black text-slate-900 font-mono">30 a 50 µm</span>
                <span className="text-[11px] text-sky-700 block">Penetra os pelos radiculares</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Oxigenação Radical</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">100%</span>
                <span className="text-[11px] text-slate-600 block">Sem asfixia ou podridão de raiz</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Uso de Agrotóxicos</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">0.0%</span>
                <span className="text-[11px] text-slate-600 block">Salas limpas com filtro HEPA</span>
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
              <BarChart3 className="w-5 h-5 text-violet-400" />
              Parâmetros da Fazenda Vertical
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Área Pegada no Solo (m²)</span>
                <span className="font-mono text-violet-400">{areaPegadaFisicaM2} m²</span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={areaPegadaFisicaM2}
                onChange={(e) => setAreaPegadaFisicaM2(Number(e.target.value))}
                className="w-full accent-violet-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Andares / Camadas Verticais</span>
                <span className="font-mono text-sky-700">{camadasVerticais} andares</span>
              </div>
              <input
                type="range"
                min="4"
                max="16"
                step="1"
                value={camadasVerticais}
                onChange={(e) => setCamadasVerticais(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Preço Venda Baby Leaf (R$/kg)</span>
                <span className="font-mono text-emerald-700">R$ {precoKgBabyLeafReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="20.0"
                max="55.0"
                step="1.0"
                value={precoKgBabyLeafReais}
                onChange={(e) => setPrecoKgBabyLeafReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Custo com Energia e Operações (R$)</span>
                <span className="font-mono text-rose-700">R$ {custoKwhEnergiaMaoObraAnoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="3000000"
                step="50000"
                value={custoKwhEnergiaMaoObraAnoReais}
                onChange={(e) => setCustoKwhEnergiaMaoObraAnoReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              Retorno Financeiro do Cultivo Vertical Indoor
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Área Cultivada</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {metricas.areaCultivoEquivalenteM2} m²
                </span>
                <span className="text-[10px] text-slate-600 block">{camadasVerticais}x multiplicação</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Produção Total</span>
                <span className="font-mono font-bold text-violet-400 text-base">
                  {(metricas.producaoTotalAnoKg / 1000).toFixed(1)} ton
                </span>
                <span className="text-[10px] text-violet-400/80 block">{ciclosPorAno} ciclos/ano</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  R$ {(metricas.receitaBrutaReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-slate-600 block">Venda Direta</span>
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
                <span className="text-slate-600">Receita com Venda de Folhosas ({metricas.producaoTotalAnoKg.toLocaleString()} kg @ R$ {precoKgBabyLeafReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-slate-900">
                  R$ {metricas.receitaBrutaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custo com Eletricidade dos LEDs, Ar Condicionado e Nutrientes:</span>
                <span className="font-mono font-bold text-rose-700">
                  - R$ {custoKwhEnergiaMaoObraAnoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-50 px-3 rounded-lg border border-emerald-200">
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

export default FazendasVerticaisAeroponiaModule;
