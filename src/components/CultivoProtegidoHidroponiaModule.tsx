import React, { useState, useMemo } from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
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
  Sun,
  Flame
} from 'lucide-react';

interface BancadaHidroponica {
  id: string;
  identificacao: string;
  cultivar: 'Alface Crespa (Vanda)' | 'Alface Americana' | 'Rúcula Gigante' | 'Agrião da Água';
  estagio: 'BERCARIO' | 'CRESCIMENTO_INICIAL' | 'ENGORDA_FINAL' | 'COLHEITA_HOJE';
  diasNoCanal: number;
  totalPlantas: number;
  ceDsM: number;
  phAtual: number;
  oxigenioMgL: number;
  temperaturaSolucaoC: number;
  statusSanitario: 'EXCELENTE' | 'ALERTA_TEMPERATURA' | 'AJUSTE_PH';
}

export const CultivoProtegidoHidroponiaModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'solucao_iot' | 'ambianca_vpd' | 'bancadas' | 'simulador'>('solucao_iot');

  // Dados das Bancadas NFT
  const [bancadas] = useState<BancadaHidroponica[]>([
    {
      id: 'BANC-01',
      identificacao: 'Bancada NFT 01 • Estufa Principal',
      cultivar: 'Alface Crespa (Vanda)',
      estagio: 'ENGORDA_FINAL',
      diasNoCanal: 21,
      totalPlantas: 15000,
      ceDsM: 1.62,
      phAtual: 5.85,
      oxigenioMgL: 6.8,
      temperaturaSolucaoC: 22.4,
      statusSanitario: 'EXCELENTE',
    },
    {
      id: 'BANC-02',
      identificacao: 'Bancada NFT 02 • Maternidade & Berçário',
      cultivar: 'Alface Americana',
      estagio: 'CRESCIMENTO_INICIAL',
      diasNoCanal: 12,
      totalPlantas: 20000,
      ceDsM: 1.35,
      phAtual: 5.92,
      oxigenioMgL: 7.1,
      temperaturaSolucaoC: 21.8,
      statusSanitario: 'EXCELENTE',
    },
    {
      id: 'BANC-03',
      identificacao: 'Bancada NFT 03 • Rúculas Especiais',
      cultivar: 'Rúcula Gigante',
      estagio: 'COLHEITA_HOJE',
      diasNoCanal: 24,
      totalPlantas: 12500,
      ceDsM: 1.70,
      phAtual: 6.10,
      oxigenioMgL: 6.4,
      temperaturaSolucaoC: 23.1,
      statusSanitario: 'EXCELENTE',
    },
    {
      id: 'BANC-04',
      identificacao: 'Bancada NFT 04 • Agroecologia Protegida',
      cultivar: 'Agrião da Água',
      estagio: 'ENGORDA_FINAL',
      diasNoCanal: 18,
      totalPlantas: 12500,
      ceDsM: 1.58,
      phAtual: 5.75,
      oxigenioMgL: 6.9,
      temperaturaSolucaoC: 22.0,
      statusSanitario: 'EXCELENTE',
    },
  ]);

  // Simulador Econômico & Produtivo
  const [areaEstufaM2, setAreaEstufaM2] = useState<number>(2500);
  const [densidadeM2, setDensidadeM2] = useState<number>(24);
  const [ciclosAno, setCiclosAno] = useState<number>(11.5);
  const [descartePct, setDescartePct] = useState<number>(4.0);
  const [precoMacoReais, setPrecoMacoReais] = useState<number>(2.80);
  const [custoProducaoMacoReais, setCustoProducaoMacoReais] = useState<number>(1.15);

  // Cálculos do Simulador
  const metricasSimuladas = useMemo(() => {
    const capacidadeBancadas = areaEstufaM2 * densidadeM2;
    const producaoBruta = capacidadeBancadas * ciclosAno;
    const producaoComercial = Math.round(producaoBruta * (1 - descartePct / 100));

    const receitaBruta = Number((producaoComercial * precoMacoReais).toFixed(2));
    const custoTotal = Number((producaoComercial * custoProducaoMacoReais).toFixed(2));
    const margemLiquidaTotal = Number((receitaBruta - custoTotal).toFixed(2));
    const margemPorM2 = Number((margemLiquidaTotal / areaEstufaM2).toFixed(2));

    return {
      capacidadeBancadas,
      producaoComercial,
      receitaBruta,
      custoTotal,
      margemLiquidaTotal,
      margemPorM2,
    };
  }, [areaEstufaM2, densidadeM2, ciclosAno, descartePct, precoMacoReais, custoProducaoMacoReais]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-emerald-500/20 text-emerald-800 border border-emerald-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5" />
                Módulo 81 • Cultivo Protegido & Hidroponia NFT de Precisão
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-cyan-500/20 text-sky-800 border border-cyan-500/30 rounded-full">
                CEA • Ambiência & VPD Controlado
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              🥬 Estufas Hidropônicas NFT & Soluções Nutritivas
            </h2>
            <p className="text-sm text-slate-900 max-w-3xl leading-relaxed">
              Automação completa de cultivo protegido em fluxo laminar de nutrientes (NFT): monitoramento contínuo de Condutividade Elétrica (CE), pH, oxigênio dissolvido, microclima térmico e Déficit de Pressão de Vapor (VPD) para prevenção de <em>tip burn</em>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Área Coberta</span>
              <span className="text-xl font-black text-emerald-700">2.500 m²</span>
              <span className="text-[10px] text-slate-600 block mt-0.5">Arcos Geminados</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Produção Anual</span>
              <span className="text-xl font-black text-sky-700">662k maços</span>
              <span className="text-[10px] text-emerald-700/80 block mt-0.5">11.5 Ciclos/Ano</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">CE & pH da Calda</span>
            <Droplets className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">1.62 dS/m • 5.85 pH</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Biodisponibilidade Ótima (Fe-EDDHA e P)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">VPD & Climatização</span>
            <Wind className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">0.95 kPa</div>
          <div className="text-[11px] text-sky-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Faixa Ideal (0.8 a 1.2 kPa) • Sem Tip Burn
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Oxigênio Dissolvido</span>
            <Activity className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">6.8 mg/L</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Temp. Calda 22.4°C • Prevenção de Pythium
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Margem Líquida / m²</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-700">R$ 437,18 / m²</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Lucro Anual: R$ 1.092.960,00
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('solucao_iot')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'solucao_iot'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Droplets className="w-4 h-4" />
          1. Solução Nutritiva & Sensores IoT
        </button>

        <button
          onClick={() => setActiveTab('ambianca_vpd')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ambianca_vpd'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Wind className="w-4 h-4" />
          2. Microclima, Telas & VPD
        </button>

        <button
          onClick={() => setActiveTab('bancadas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'bancadas'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Layers className="w-4 h-4" />
          3. Bancadas & Cultivares
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico & DRE
        </button>
      </div>

      {/* Conteúdo Aba 1: Solução Nutritiva IoT */}
      {activeTab === 'solucao_iot' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-emerald-700" />
              Telemetria dos Reservatórios de Recirculação (Solução Furlani / Castellane)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Controle automático de dosagem A/B com bombas peristálticas industriais, injeção de ácido fosfórico para neutralização de bicarbonatos da água de poço e aeração forçada Venturi.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Condutividade Elétrica</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">1.62 dS/m</span>
                <span className="text-[11px] text-slate-600 block">Alvo: 1.40 a 1.80 dS/m</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Potencial Hidrogeniônico (pH)</span>
                <span className="text-2xl font-black text-sky-700 font-mono">5.85 pH</span>
                <span className="text-[11px] text-slate-600 block">Alvo: 5.50 a 6.20 pH</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Temperatura da Água</span>
                <span className="text-2xl font-black text-slate-900 font-mono">22.4°C</span>
                <span className="text-[11px] text-emerald-700 block">&lt; 24°C Seguro contra Pythium</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Oxigenação Dissolvida</span>
                <span className="text-2xl font-black text-blue-700 font-mono">6.8 mg/L</span>
                <span className="text-[11px] text-blue-700/80 block">Super saturado (&gt;6 mg/L)</span>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-slate-50/70 border border-slate-200 text-xs text-slate-900 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                Composição Macro e Micronutrientes (Solução Padrão Alface)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-700">
                <div className="p-2 rounded-lg bg-white border border-slate-200 font-medium">Nitrogênio (N): 180 ppm</div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 font-medium">Fósforo (P): 45 ppm</div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 font-medium">Potássio (K): 220 ppm</div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 font-medium">Cálcio (Ca): 160 ppm</div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 font-medium">Magnésio (Mg): 40 ppm</div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 font-medium">Enxofre (S): 45 ppm</div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 font-medium">Ferro Fe-EDDHA: 2.5 ppm</div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 font-medium">Boro (B): 0.5 ppm</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Ambiência & VPD */}
      {activeTab === 'ambianca_vpd' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wind className="w-5 h-5 text-sky-700" />
              Equilíbrio do VPD (Déficit de Pressão de Vapor)
            </h3>
            <p className="text-xs text-slate-600">
              O VPD governa a taxa transpiratória e a absorção de cálcio pelo xilema até as folhas mais jovens. Valores &lt; 0.4 kPa provocam queima apical (*tip burn*) e podridão mole; valores &gt; 1.5 kPa forçam fechamento estomático.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Temperatura Interna Estufa:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">26.5°C</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Umidade Relativa do Ar (UR):</span>
                <span className="font-mono font-bold text-sky-700 text-sm">72%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Radiação Fotossinteticamente Ativa (PAR):</span>
                <span className="font-mono font-bold text-amber-700 text-sm">850 µmol/m²/s</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex justify-between items-center text-xs font-bold text-emerald-800">
                <span>VPD Atual Calculado:</span>
                <span className="text-sm font-mono font-black">0.95 kPa (Zona Ótima)</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-700" />
              Atuadores & Climatização Automatizada
            </h3>
            <p className="text-xs text-slate-600">
              Controle eletrônico conectado ao microclima:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Tela Termorrefletora Aluminet (50%)</span>
                  <span className="text-slate-600 text-[11px]">Acionamento automático com radiação &gt; 900 W/m²</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 font-bold">ATIVA (FECHADA)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Painel Evaporativo Pad & Fan</span>
                  <span className="text-slate-600 text-[11px]">Resfriamento adiabático de ar com exaustores axiais</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-sky-700 font-bold">VELOCIDADE 2</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Nebulizadores de Alta Pressão (Foggers)</span>
                  <span className="text-slate-600 text-[11px]">Gotas de 20 micras para rápida evaporação sem molhar folhas</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold">STANDBY</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Bancadas & Cultivares */}
      {activeTab === 'bancadas' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-emerald-700" />
              Gestão de Canais de Cultivo NFT & Ciclos Escalonados
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Controle de colheita contínua 365 dias por ano: transplante da maternidade para as bancadas definitivas com espaçamento de 25x25 cm.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Bancada / Identificação</th>
                    <th className="py-3 px-3">Cultivar</th>
                    <th className="py-3 px-3">Estágio</th>
                    <th className="py-3 px-3">Plantas</th>
                    <th className="py-3 px-3">Dias no Canal</th>
                    <th className="py-3 px-3">CE (dS/m)</th>
                    <th className="py-3 px-3">pH</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {bancadas.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{b.identificacao}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{b.id}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded font-bold text-emerald-800 bg-emerald-950/50 border border-emerald-200">
                          {b.cultivar}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-slate-900">{b.estagio}</span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                        {b.totalPlantas.toLocaleString()} un
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-900">{b.diasNoCanal} dias</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">{b.ceDsM.toFixed(2)}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-sky-700">{b.phAtual.toFixed(2)}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                          {b.statusSanitario}
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

      {/* Conteúdo Aba 4: Simulador Econômico & DRE */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              Parâmetros da Estufa & Custos
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Área Total da Estufa</span>
                <span className="font-mono text-emerald-700">{areaEstufaM2.toLocaleString()} m²</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={areaEstufaM2}
                onChange={(e) => setAreaEstufaM2(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Densidade de Plantas</span>
                <span className="font-mono text-emerald-700">{densidadeM2} plantas/m²</span>
              </div>
              <input
                type="range"
                min="16"
                max="32"
                step="2"
                value={densidadeM2}
                onChange={(e) => setDensidadeM2(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Ciclos Produtivos por Ano</span>
                <span className="font-mono text-sky-700">{ciclosAno} giros/ano</span>
              </div>
              <input
                type="range"
                min="8"
                max="14"
                step="0.5"
                value={ciclosAno}
                onChange={(e) => setCiclosAno(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Preço Médio por Maço Embalado</span>
                <span className="font-mono text-emerald-700">R$ {precoMacoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.80"
                max="4.50"
                step="0.10"
                value={precoMacoReais}
                onChange={(e) => setPrecoMacoReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Custo Unitário de Produção</span>
                <span className="font-mono text-rose-700">R$ {custoProducaoMacoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.70"
                max="2.00"
                step="0.05"
                value={custoProducaoMacoReais}
                onChange={(e) => setCustoProducaoMacoReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              DRE Hidropônica Anual & Margem por Metro Quadrado
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Capacidade Estática</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {metricasSimuladas.capacidadeBancadas.toLocaleString()} pl
                </span>
                <span className="text-[10px] text-slate-600 block">{areaEstufaM2} m²</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Produção Comercial</span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  {metricasSimuladas.producaoComercial.toLocaleString()} un
                </span>
                <span className="text-[10px] text-emerald-700/80 block">96% Aproveitamento</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Faturamento Bruto</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  R$ {(metricasSimuladas.receitaBruta / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-slate-600 block">Venda Direta / Super</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Lucro Líquido Anual</span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  R$ {(metricasSimuladas.margemLiquidaTotal / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-emerald-700/80 block">Margem Alta</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Receita Bruta Total ({metricasSimuladas.producaoComercial.toLocaleString()} maços @ R$ {precoMacoReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-emerald-700">
                  R$ {metricasSimuladas.receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custo Total de Produção (Insumos, Fertilizantes e Energia):</span>
                <span className="font-mono font-bold text-rose-700">
                  - R$ {metricasSimuladas.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-50 px-3 rounded-lg border border-emerald-200">
                <span className="text-white">Margem Líquida por Metro Quadrado / Ano:</span>
                <span className="font-mono text-emerald-800">
                  R$ {metricasSimuladas.margemPorM2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / m²
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CultivoProtegidoHidroponiaModule;
