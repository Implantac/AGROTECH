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
  Droplets,
  Scale
} from 'lucide-react';

interface BaiaRanario {
  id: string;
  identificacao: string;
  setor: 'GIRINAGEM' | 'RECRIA' | 'ENGORDA_CLIMATIZADA' | 'REPRODUCAO';
  populacaoAtual: number;
  diasNoSetor: number;
  pesoMedioGramas: number;
  conversaoAlimentar: number;
  temperaturaAguaC: number;
  statusAgua: 'OTIMA' | 'ATENCAO_TÉRMICA' | 'RENOVAÇÃO_NECESSARIA';
}

export const RaniculturaSustentavelModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'baias' | 'biometria' | 'coprodutos' | 'simulador'>('baias');

  // Setores do Ranário Anfigranja
  const [baias] = useState<BaiaRanario[]>([
    {
      id: 'BAIA-ANF-01',
      identificacao: 'Baia Engorda 01 • Cocho Vibratório Automático',
      setor: 'ENGORDA_CLIMATIZADA',
      populacaoAtual: 16000,
      diasNoSetor: 85,
      pesoMedioGramas: 215,
      conversaoAlimentar: 1.28,
      temperaturaAguaC: 25.8,
      statusAgua: 'OTIMA',
    },
    {
      id: 'BAIA-ANF-02',
      identificacao: 'Baia Engorda 02 • Terminação Rápida',
      setor: 'ENGORDA_CLIMATIZADA',
      populacaoAtual: 16000,
      diasNoSetor: 105,
      pesoMedioGramas: 228,
      conversaoAlimentar: 1.31,
      temperaturaAguaC: 26.2,
      statusAgua: 'OTIMA',
    },
    {
      id: 'BAIA-ANF-03',
      identificacao: 'Estufa Girinagem 03 • Metamorfose Acelerada',
      setor: 'GIRINAGEM',
      populacaoAtual: 25000,
      diasNoSetor: 45,
      pesoMedioGramas: 18,
      conversaoAlimentar: 1.15,
      temperaturaAguaC: 27.0,
      statusAgua: 'OTIMA',
    },
  ]);

  // Simulador Ranícola
  const [areaGalpaoM2, setAreaGalpaoM2] = useState<number>(800);
  const [densidadeM2, setDensidadeM2] = useState<number>(60);
  const [ciclosAno, setCiclosAno] = useState<number>(3.0);
  const [pesoAbateGramas, setPesoAbateGramas] = useState<number>(220);
  const [taxaSobrevivenciaPct, setTaxaSobrevivenciaPct] = useState<number>(88.0);
  const [rendimentoCarcacaPct, setRendimentoCarcacaPct] = useState<number>(58.0);
  const [precoKgCarneLimpaReais, setPrecoKgCarneLimpaReais] = useState<number>(75.0);
  const [precoPeleCurtidaReais, setPrecoPeleCurtidaReais] = useState<number>(8.50);
  const [custoTotalKgVivoReais, setCustoTotalKgVivoReais] = useState<number>(14.20);

  // Cálculos do Módulo
  const metricasRanario = useMemo(() => {
    const capacidadeEstatica = areaGalpaoM2 * densidadeM2;
    const rasAlojadasAno = capacidadeEstatica * ciclosAno;
    const rasAbatidasAno = Math.round(rasAlojadasAno * (taxaSobrevivenciaPct / 100));

    const biomassaVivaAbatidaKg = Number((rasAbatidasAno * (pesoAbateGramas / 1000)).toFixed(1));
    const carneLimpaKg = Math.round(biomassaVivaAbatidaKg * (rendimentoCarcacaPct / 100));

    const receitaCarne = Number((carneLimpaKg * precoKgCarneLimpaReais).toFixed(2));
    const receitaPeles = Number((rasAbatidasAno * precoPeleCurtidaReais).toFixed(2));
    const receitaTotal = Number((receitaCarne + receitaPeles).toFixed(2));

    const custoTotalProducao = Number((biomassaVivaAbatidaKg * custoTotalKgVivoReais).toFixed(2));
    const lucroLiquidoRanario = Number((receitaTotal - custoTotalProducao).toFixed(2));
    const margemPorM2Ano = Number((lucroLiquidoRanario / (areaGalpaoM2 || 1)).toFixed(2));

    return {
      capacidadeEstatica,
      rasAbatidasAno,
      biomassaVivaAbatidaKg,
      carneLimpaKg,
      receitaCarne,
      receitaPeles,
      receitaTotal,
      custoTotalProducao,
      lucroLiquidoRanario,
      margemPorM2Ano,
    };
  }, [areaGalpaoM2, densidadeM2, ciclosAno, pesoAbateGramas, taxaSobrevivenciaPct, rendimentoCarcacaPct, precoKgCarneLimpaReais, precoPeleCurtidaReais, custoTotalKgVivoReais]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Módulo 85 • Ranicultura Sustentável & Sistema Anfigranja
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                UFV / Viçosa • Carne Nobre & Couro
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🐸 Ranicultura Comercial & Aproveitamento Integral
            </h2>
            <p className="text-sm text-[#26332A] max-w-3xl leading-relaxed">
              Criação intensiva de rã-touro (*Lithobates catesbeianus*) em sistema Anfigranja climatizado: cochos vibratórios com atrativo vivo, conversão alimentar de 1,30, rendimento de pernas desossadas e agregação de valor com curtimento de peles para moda e biomedicina.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Plantel Estático</span>
              <span className="text-xl font-black text-emerald-400">48.000 rãs</span>
              <span className="text-[10px] text-[#66736A] block mt-0.5">800 m² Anfigranja</span>
            </div>
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Lucro Líquido Anual</span>
              <span className="text-xl font-black text-cyan-400">R$ 1,89M</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">R$ 2.367 / m²</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Produção Carne Limpa</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">16.169 kg / ano</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            58% Rendimento • Proteína Hipoalergênica
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Peles para Curtimento</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">126.720 peles</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            R$ 8,50/unidade • Couro Exótico e Medicina
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Conversão Alimentar (CA)</span>
            <Scale className="w-4 h-4 text-lime-400" />
          </div>
          <div className="text-2xl font-black text-lime-400">1.30 kg/kg</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Ração Extrusada 42% PB + Atrativo Móvel
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ciclo Engorda & Abate</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">100-110 dias</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Peso de Abate: 220 g (Rãs Juvenis Nobres)
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('baias')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'baias'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Activity className="w-4 h-4" />
          1. Baias & Sistema Anfigranja
        </button>

        <button
          onClick={() => setActiveTab('biometria')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'biometria'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Scale className="w-4 h-4" />
          2. Biometria & Cocho Vibratório
        </button>

        <button
          onClick={() => setActiveTab('coprodutos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'coprodutos'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Layers className="w-4 h-4" />
          3. Carne Nobre & Curtimento de Peles
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico Ranícola
        </button>
      </div>

      {/* Conteúdo Aba 1: Baias */}
      {activeTab === 'baias' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Setores Produtivos do Sistema Anfigranja Climatizado
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              O sistema divide o ranário em setor aquático com fluxo de água constante e setor seco de alimentação e abrigo térmico, eliminando doenças bacterianas como a "perna-vermelha" (*Aeromonas hydrophila*).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAF4E7] text-[#66736A] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Baia / Identificação</th>
                    <th className="py-3 px-3">Setor</th>
                    <th className="py-3 px-3">População</th>
                    <th className="py-3 px-3">Dias no Setor</th>
                    <th className="py-3 px-3">Peso Médio</th>
                    <th className="py-3 px-3">CA</th>
                    <th className="py-3 px-3">Temp. Água</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {baias.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{b.identificacao}</div>
                        <div className="text-[11px] text-[#66736A] font-mono">{b.id}</div>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-emerald-300">{b.setor}</td>
                      <td className="py-3.5 px-3 font-mono text-[#26332A]">{b.populacaoAtual.toLocaleString()} un</td>
                      <td className="py-3.5 px-3 font-mono text-[#26332A]">{b.diasNoSetor} dias</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-white">{b.pesoMedioGramas} g</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-cyan-400">{b.conversaoAlimentar.toFixed(2)}</td>
                      <td className="py-3.5 px-3 font-mono text-amber-300">{b.temperaturaAguaC}°C</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {b.statusAgua}
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

      {/* Conteúdo Aba 2: Biometria */}
      {activeTab === 'biometria' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              Alimentação Especializada & Estímulo Visual
            </h3>
            <p className="text-xs text-[#66736A]">
              Anfíbios não ingerem alimentos inertes e dependem de estímulo de movimento óptico para disparar o reflexo de apreensão lingual.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Cochos Vibratórios Eletromecânicos</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Microvibração regulada de 60 Hz que mantém os pellets de ração flutuante em constante tremor sem triturar a partícula.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Atrativo Vivo (Larvas / Tenébrios)</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Adição de 5% de larvas vivas sobre a ração extrusada, estimulando a voracidade e garantindo consumo de 100% da ração.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Ração Extrusada 42% Proteína Bruta</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Farinha de peixe e subprodutos avícolas de alta digestibilidade que resultam em ganho diário acelerado de 1,8 a 2,2 g/dia.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              Controle de Ambiência & Sanidade
            </h3>
            <p className="text-xs text-[#66736A]">
              Manutenção de parâmetros rigorosos de bem-estar:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Temperatura da Água:</span>
                <span className="font-mono font-bold text-emerald-400">25°C a 27°C (Ótima)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Renovação Contínua da Lâmina:</span>
                <span className="font-mono font-bold text-cyan-400">100% a cada 24h</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Umidade Relativa do Galpão:</span>
                <span className="font-mono font-bold text-white">80% a 90% UR</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Coprodutos */}
      {activeTab === 'coprodutos' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Agregação de Valor: Carne Nobre & Couro Exótico
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              A ranicultura moderna não descarta nenhum subproduto. O couro de rã curtido é comercializado para grifes de moda e centros médicos de tratamento de queimaduras.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-2">
                <span className="text-xs font-bold text-emerald-400 block">Pernas de Rã Congeladas (IQF)</span>
                <div className="text-xl font-black text-white">58% Rendimento</div>
                <p className="text-[11px] text-[#66736A]">
                  Carne branca nobre, rica em aminoácidos essenciais e colesterol quase nulo. Cotação: R$ 75,00 a R$ 85,00/kg.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-2">
                <span className="text-xs font-bold text-cyan-400 block">Pele Curtida para Artefatos & Moda</span>
                <div className="text-xl font-black text-white">100% de Aproveitamento</div>
                <p className="text-[11px] text-[#66736A]">
                  Couro fino, resistente e de desenho único. Cotação: R$ 8,00 a R$ 12,00 por pele processada.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-2">
                <span className="text-xs font-bold text-amber-400 block">Dorso & Fígado (Patês / Farinha)</span>
                <div className="text-xl font-black text-white">Subproduto Rico</div>
                <p className="text-[11px] text-[#66736A]">
                  Processamento para caldos gourmets, patês de rã franceses e insumo de alta proteína para pet food premium.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Parâmetros do Ranário & Produção
            </h3>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Área Total do Galpão</span>
                <span className="font-mono text-emerald-400">{areaGalpaoM2} m²</span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={areaGalpaoM2}
                onChange={(e) => setAreaGalpaoM2(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Densidade de Rãs por m²</span>
                <span className="font-mono text-emerald-400">{densidadeM2} rãs/m²</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="5"
                value={densidadeM2}
                onChange={(e) => setDensidadeM2(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Preço Carne Limpa (R$/kg)</span>
                <span className="font-mono text-emerald-400">R$ {precoKgCarneLimpaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="55.0"
                max="110.0"
                step="1.0"
                value={precoKgCarneLimpaReais}
                onChange={(e) => setPrecoKgCarneLimpaReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Valor Pele Curtida (R$/un)</span>
                <span className="font-mono text-cyan-400">R$ {precoPeleCurtidaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="16.0"
                step="0.50"
                value={precoPeleCurtidaReais}
                onChange={(e) => setPrecoPeleCurtidaReais(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Custo Produção por kg Vivo</span>
                <span className="font-mono text-rose-400">R$ {custoTotalKgVivoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="9.0"
                max="22.0"
                step="0.50"
                value={custoTotalKgVivoReais}
                onChange={(e) => setCustoTotalKgVivoReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              DRE Anual da Ranicultura & Rentabilidade por m²
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Rãs Abatidas</span>
                <span className="font-mono font-bold text-white text-base">
                  {(metricasRanario.rasAbatidasAno / 1000).toFixed(1)}k rãs
                </span>
                <span className="text-[10px] text-[#66736A] block">{taxaSobrevivenciaPct}% sobrevivência</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Carne Limpa</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  {(metricasRanario.carneLimpaKg / 1000).toFixed(1)} ton
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{rendimentoCarcacaPct}% rendimento</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricasRanario.receitaTotal / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-[#66736A] block">Carne + Peles</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricasRanario.lucroLiquidoRanario / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-emerald-400/80 block">Super Intensivo</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Receita com Carne Limpa ({metricasRanario.carneLimpaKg.toLocaleString()} kg @ R$ {precoKgCarneLimpaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-emerald-400">
                  R$ {metricasRanario.receitaCarne.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Receita com Peles Curtidas ({metricasRanario.rasAbatidasAno.toLocaleString()} un @ R$ {precoPeleCurtidaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-cyan-400">
                  R$ {metricasRanario.receitaPeles.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Custo Total de Produção ({metricasRanario.biomassaVivaAbatidaKg.toLocaleString()} kg vivo @ R$ {custoTotalKgVivoReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {metricasRanario.custoTotalProducao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-950/30 px-3 rounded-lg border border-emerald-800/50">
                <span className="text-white">Lucro Líquido Anual por Metro Quadrado de Galpão:</span>
                <span className="font-mono text-emerald-300">
                  R$ {metricasRanario.margemPorM2Ano.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / m²
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaniculturaSustentavelModule;
