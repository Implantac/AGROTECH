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
  ThermometerSnowflake,
  Wind
} from 'lucide-react';

interface LoteAllium {
  id: string;
  identificacao: string;
  cultura: 'Cebola Híbrida Amarela (Classe 3)' | 'Alho Roxo Nobre (Classe 6/7)' | 'Cebola Roxa Especial';
  areaHa: number;
  massaVerdeTon: number;
  temperaturaCuraC: number;
  diasCura: number;
  massaCuradaTon: number;
  statusCura: 'CURA_CONCLUIDA_TUNICAS_DOURADAS' | 'EM_TUNEL_DE_CURA' | 'FRIGOCONSERVACAO_4C';
}

export const CebolaAlhoCuraModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lotes' | 'cura' | 'vernalizacao' | 'simulador'>('lotes');

  // Lotes de Allium
  const [lotes] = useState<LoteAllium[]>([
    {
      id: 'ALLIUM-01',
      identificacao: 'Gleba Cebola 01 • Cristalina GO (Híbrido Baia Periforme)',
      cultura: 'Cebola Híbrida Amarela (Classe 3)',
      areaHa: 25,
      massaVerdeTon: 875,
      temperaturaCuraC: 34,
      diasCura: 5,
      massaCuradaTon: 833.0,
      statusCura: 'CURA_CONCLUIDA_TUNICAS_DOURADAS',
    },
    {
      id: 'ALLIUM-02',
      identificacao: 'Gleba Alho 02 • São Gotardo MG (Alho Roxo Nobre Chonan)',
      cultura: 'Alho Roxo Nobre (Classe 6/7)',
      areaHa: 15,
      massaVerdeTon: 210,
      temperaturaCuraC: 32,
      diasCura: 6,
      massaCuradaTon: 199.5,
      statusCura: 'FRIGOCONSERVACAO_4C',
    },
  ]);

  // Simulador Econômico
  const [areaCebolaHa, setAreaCebolaHa] = useState<number>(30);
  const [produtividadeTonHa, setProdutividadeTonHa] = useState<number>(35.0);
  const [quebraCuraPct, setQuebraCuraPct] = useState<number>(4.8);
  const [precoTonComercialReais, setPrecoTonComercialReais] = useState<number>(2400.0);
  const [custoTotalHaReais, setCustoTotalHaReais] = useState<number>(38000.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const massaVerdeTotalTon = areaCebolaHa * produtividadeTonHa;
    const quebraTon = (massaVerdeTotalTon * quebraCuraPct) / 100;
    const massaComercialCuradaTon = Number((massaVerdeTotalTon - quebraTon).toFixed(1));

    const receitaBrutaReais = Number((massaComercialCuradaTon * precoTonComercialReais).toFixed(2));
    const custoTotalReais = Number((areaCebolaHa * custoTotalHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaReais || 1)) * 100).toFixed(1));

    return {
      massaVerdeTotalTon,
      massaComercialCuradaTon,
      receitaBrutaReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaCebolaHa,
    produtividadeTonHa,
    quebraCuraPct,
    precoTonComercialReais,
    custoTotalHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-orange-950/60 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                Módulo 102 • Cebolicultura & Alho Nobre
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Cura em Túnel Térmico 34°C • Vernalização 4°C
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🧅 Cebolicultura & Alho Nobre: Cura Térmica & Frigoconservação
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Manejo de precisão para Allium: indução fotoperiódica para bulbificação, cura acelerada em túneis de ar aquecido a 34°C para cicatrização do pescoço (pseudocaule) e vernalização de alho-semente a 4°C para superação de dormência.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bulbos Curados</span>
              <span className="text-xl font-black text-amber-400">999.6 ton</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">30 ha Cebola</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Faturamento</span>
              <span className="text-xl font-black text-emerald-400">R$ 2,40M</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">52.5% Margem</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Temperatura de Cura</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-white">34.0°C Túnel</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Ventilação 1.5 m/s por 5 dias
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cicatrização do Pescoço</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">100% Selado</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Zero Podridão Bacteriana (Pectobacterium)
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Vernalização do Alho</span>
            <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">4.0°C / 40 Dias</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Indução Floral & Dentes Nobres
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">R$ 1.259.040,00</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            R$ 41.968,00 por hectare
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('lotes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'lotes'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Leaf className="w-4 h-4" />
          1. Lotes & Classes de Bulbo
        </button>

        <button
          onClick={() => setActiveTab('cura')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cura'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          2. Túneis de Cura Térmica
        </button>

        <button
          onClick={() => setActiveTab('vernalizacao')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'vernalizacao'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <ThermometerSnowflake className="w-4 h-4" />
          3. Vernalização & Frigoconservação
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico
        </button>
      </div>

      {/* Conteúdo Aba 1: Lotes */}
      {activeTab === 'lotes' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-amber-400" />
              Lotes em Cultivo e Classificação Comercial
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Cebolas Classe 3 (calibre 50-70 mm) e Alho Roxo Nobre Classe 6/7 alcançam cotações máximas nos entrepostos de abastecimento (CEAGESP / CEASA).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Lote / Local</th>
                    <th className="py-3 px-3">Cultura / Padrão</th>
                    <th className="py-3 px-3">Área (ha)</th>
                    <th className="py-3 px-3">Massa Verde</th>
                    <th className="py-3 px-3">Temp Cura</th>
                    <th className="py-3 px-3">Massa Curada</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {lotes.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{l.identificacao}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{l.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-amber-300 font-semibold">{l.cultura}</td>
                      <td className="py-3.5 px-3 font-mono text-white">{l.areaHa} ha</td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">{l.massaVerdeTon} ton</td>
                      <td className="py-3.5 px-3 font-mono text-orange-400 font-bold">{l.temperaturaCuraC}°C ({l.diasCura}d)</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">{l.massaCuradaTon} ton</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {l.statusCura}
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

      {/* Conteúdo Aba 2: Cura */}
      {activeTab === 'cura' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Túneis de Cura Térmica Forçada
            </h3>
            <p className="text-xs text-slate-400">
              A cura adequada é a chave para transformar um bulbo perecível em um produto capaz de durar até 6 meses em prateleira:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Fechamento do Pescoço (Pescocinho)</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Desidrata o tecido vascular esponjoso do pseudocaule, impedindo a penetração de fungos de solo como Aspergillus niger e Botrytis aclada.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Formação de Escamas Douradas Firmes</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Oxidação enzimática dos polifenóis na túnica externa formando coloração amarelo-ouro brilhante e retenção osmótica.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Parâmetros de Operação dos Sopradores
            </h3>
            <p className="text-xs text-slate-400">
              Controle termo-aerodinâmico no galpão de cura:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Velocidade do Ar na Massa de Bulbos:</span>
                <span className="font-mono font-bold text-emerald-400">1.2 a 1.8 m/s</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Umidade Relativa do Ar Insulflado:</span>
                <span className="font-mono font-bold text-cyan-400">60% a 65% UR</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Vernalização */}
      {activeTab === 'vernalizacao' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <ThermometerSnowflake className="w-5 h-5 text-cyan-400" />
              Frigoconservação & Vernalização do Alho-Semente
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              O alho nobre (*Allium sativum*) exige acúmulo de horas de frio para induzir a diferenciação dos bulbilhos (dentes). O tratamento térmico a 4°C por 35 a 50 dias quebra a dormência natural e garante 100% de plantas com cabeças graúdas e dentes bem definidos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Temperatura de Câmara</span>
                <span className="text-2xl font-black text-white font-mono">4.0°C ± 0.5°C</span>
                <span className="text-[11px] text-cyan-400 block">Precisão PID</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Índice Visual de Superação (IVS)</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">75% a 80%</span>
                <span className="text-[11px] text-slate-400 block">Ponto exato de plantio</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Prevenção de Charutos</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">99.8% Eficácia</span>
                <span className="text-[11px] text-slate-400 block">Bulbos com 8 a 12 dentes</span>
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
              <BarChart3 className="w-5 h-5 text-amber-400" />
              Parâmetros da Safra de Cebola/Alho
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Área Plantada (ha)</span>
                <span className="font-mono text-amber-400">{areaCebolaHa} hectares</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={areaCebolaHa}
                onChange={(e) => setAreaCebolaHa(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Produtividade Bruta (t/ha)</span>
                <span className="font-mono text-cyan-400">{produtividadeTonHa} t/ha</span>
              </div>
              <input
                type="range"
                min="20"
                max="55"
                step="1"
                value={produtividadeTonHa}
                onChange={(e) => setProdutividadeTonHa(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Preço Comercial Curada (R$/ton)</span>
                <span className="font-mono text-emerald-400">R$ {precoTonComercialReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1500"
                max="4500"
                step="50"
                value={precoTonComercialReais}
                onChange={(e) => setPrecoTonComercialReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Custo de Manejo e Cura por Ha</span>
                <span className="font-mono text-rose-400">R$ {custoTotalHaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="60000"
                step="1000"
                value={custoTotalHaReais}
                onChange={(e) => setCustoTotalHaReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Retorno Financeiro da Cebolicultura Curada
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Massa Verde</span>
                <span className="font-mono font-bold text-white text-base">
                  {metricas.massaVerdeTotalTon.toLocaleString()} ton
                </span>
                <span className="text-[10px] text-slate-400 block">{areaCebolaHa} ha colhidos</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Bulbos Comerciais</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {metricas.massaComercialCuradaTon.toLocaleString()} ton
                </span>
                <span className="text-[10px] text-amber-400/80 block">4.8% quebra cura</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricas.receitaBrutaReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-slate-400 block">Classe 3 Selecionada</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricas.lucroLiquidoReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Receita Bruta com Bulbos Curados ({metricas.massaComercialCuradaTon.toLocaleString()} t @ R$ {precoTonComercialReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-white">
                  R$ {metricas.receitaBrutaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Custos Totais de Sementes Híbridas, Irrigação e Cura Térmica:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {metricas.custoTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-amber-950/30 px-3 rounded-lg border border-amber-800/50">
                <span className="text-white">Lucro Líquido Consolidado da Safra:</span>
                <span className="font-mono text-emerald-300">
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

export default CebolaAlhoCuraModule;
