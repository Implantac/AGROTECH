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
  Scale,
  Heart
} from 'lucide-react';

interface LoteCunicultura {
  id: string;
  identificacao: string;
  raca: string;
  matrizes: number;
  estagio: 'GESTACAO' | 'MATERNIDADE' | 'ENGORDA' | 'ABATE_PROGRAMADO';
  diasGestacaoOuEngorda: number;
  laparosVivos: number;
  pesoMedioKg: number;
  taxaOcupacaoGaiolaPct: number;
  temperaturaGalpaoC: number;
}

export const CuniculturaIndustrialModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plantel' | 'reproducao' | 'carcaca_peles' | 'simulador'>('plantel');

  // Lotes do Galpão de Cunicultura
  const [lotes] = useState<LoteCunicultura[]>([
    {
      id: 'LOTE-CUNI-01',
      identificacao: 'Galpão 01 • Matrizes Nova Zelândia Branco',
      raca: 'Nova Zelândia Branco (NZB)',
      matrizes: 120,
      estagio: 'MATERNIDADE',
      diasGestacaoOuEngorda: 18,
      laparosVivos: 1020,
      pesoMedioKg: 0.45,
      taxaOcupacaoGaiolaPct: 88,
      temperaturaGalpaoC: 19.5,
    },
    {
      id: 'LOTE-CUNI-02',
      identificacao: 'Galpão 02 • Terminação de Corte Californiano',
      raca: 'Californiano Puro',
      matrizes: 140,
      estagio: 'ENGORDA',
      diasGestacaoOuEngorda: 68,
      laparosVivos: 1120,
      pesoMedioKg: 2.55,
      taxaOcupacaoGaiolaPct: 92,
      temperaturaGalpaoC: 20.0,
    },
    {
      id: 'LOTE-CUNI-03',
      identificacao: 'Galpão 03 • Banda de IA Reprodutiva',
      raca: 'Híbrido Hi-Plus Comercial',
      matrizes: 140,
      estagio: 'GESTACAO',
      diasGestacaoOuEngorda: 24,
      laparosVivos: 0,
      pesoMedioKg: 4.10,
      taxaOcupacaoGaiolaPct: 85,
      temperaturaGalpaoC: 18.8,
    },
  ]);

  // Simulador Econômico Cunícola
  const [matrizesAtivas, setMatrizesAtivas] = useState<number>(400);
  const [partosPorMatrizAno, setPartosPorMatrizAno] = useState<number>(6.5);
  const [laparosDesmamadosPorParto, setLaparosDesmamadosPorParto] = useState<number>(8.0);
  const [taxaSobrevivenciaEngordaPct, setTaxaSobrevivenciaEngordaPct] = useState<number>(94.0);
  const [pesoVivoAbateKg, setPesoVivoAbateKg] = useState<number>(2.6);
  const [rendimentoCarcacaPct, setRendimentoCarcacaPct] = useState<number>(58.0);
  const [precoKgCarcacaReais, setPrecoKgCarcacaReais] = useState<number>(38.0);
  const [precoPeleCurtidaReais, setPrecoPeleCurtidaReais] = useState<number>(14.0);
  const [custoTotalPorCoelhoAbatidoReais, setCustoTotalPorCoelhoAbatidoReais] = useState<number>(29.50);

  // Métricas do Simulador
  const metricas = useMemo(() => {
    const totalNascidosVivosAno = matrizesAtivas * partosPorMatrizAno * laparosDesmamadosPorParto;
    const coelhosAbatidosAno = Math.round(totalNascidosVivosAno * (taxaSobrevivenciaEngordaPct / 100));
    const carneCarcacaKgAno = Number((coelhosAbatidosAno * pesoVivoAbateKg * (rendimentoCarcacaPct / 100)).toFixed(1));

    const receitaCarneReais = Number((carneCarcacaKgAno * precoKgCarcacaReais).toFixed(2));
    const receitaPelesReais = Number((coelhosAbatidosAno * precoPeleCurtidaReais).toFixed(2));
    const receitaBrutaTotalReais = Number((receitaCarneReais + receitaPelesReais).toFixed(2));

    const custoTotalAnoReais = Number((coelhosAbatidosAno * custoTotalPorCoelhoAbatidoReais).toFixed(2));
    const lucroLiquidoAnoReais = Number((receitaBrutaTotalReais - custoTotalAnoReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoAnoReais / (receitaBrutaTotalReais || 1)) * 100).toFixed(1));

    return {
      totalNascidosVivosAno,
      coelhosAbatidosAno,
      carneCarcacaKgAno,
      receitaCarneReais,
      receitaPelesReais,
      receitaBrutaTotalReais,
      custoTotalAnoReais,
      lucroLiquidoAnoReais,
      margemLiquidaPct,
    };
  }, [
    matrizesAtivas,
    partosPorMatrizAno,
    laparosDesmamadosPorParto,
    taxaSobrevivenciaEngordaPct,
    pesoVivoAbateKg,
    rendimentoCarcacaPct,
    precoKgCarcacaReais,
    precoPeleCurtidaReais,
    custoTotalPorCoelhoAbatidoReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                Módulo 87 • Cunicultura Industrial & Comercial
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Banda de IA 42 Dias • 58% Rendimento Carcaça
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🐇 Cunicultura de Precisão, Carne Nobre & Peles
            </h2>
            <p className="text-sm text-slate-900 max-w-3xl leading-relaxed">
              Manejo zootécnico intensivo em gaiolas suspensas climatizadas com bandas de Inseminação Artificial (IA), nutrição de alta fibra digestível, desmame precoce aos 32 dias e aproveitamento integral: carcaça com altíssimo valor biológico e peles curtidas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Matrizes Ativas</span>
              <span className="text-xl font-black text-amber-400">400 cab</span>
              <span className="text-[10px] text-slate-600 block mt-0.5">Nova Zelândia & Calif.</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Abate Anual</span>
              <span className="text-xl font-black text-emerald-400">19.552 cab</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">29,4 ton carcaça</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Produtividade Matriz</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">52 coelhos / ano</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            6.5 partos • 8.0 desmamados
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Rendimento de Carcaça</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">58.0%</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            1,51 kg carcaça limpa por animal
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Conversão Alimentar</span>
            <Box className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">2.85 kg/kg</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Ração Peletizada com Alfafa
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">R$ 817.351,20</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Margem Líquida de 58.6%
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('plantel')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'plantel'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          1. Plantel & Gaiolas Climatizadas
        </button>

        <button
          onClick={() => setActiveTab('reproducao')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'reproducao'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          2. Bandas de IA & Reprodução
        </button>

        <button
          onClick={() => setActiveTab('carcaca_peles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'carcaca_peles'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          3. Rendimento de Carcaça & Peles
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico Cunícola
        </button>
      </div>

      {/* Conteúdo Aba 1: Plantel */}
      {activeTab === 'plantel' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-amber-400" />
              Lotes de Coelhos e Monitoramento de Ambiência dos Galpões
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Gaiolas de arame galvanizado suspensas com sistema automático de bebedouros tipo nipple, raspadores mecânicos de dejetos e ventilação evaporativa para manter temperatura entre 18°C e 22°C.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Lote / Setor</th>
                    <th className="py-3 px-3">Raça / Linhagem</th>
                    <th className="py-3 px-3">Estágio</th>
                    <th className="py-3 px-3">Animais / Ninhada</th>
                    <th className="py-3 px-3">Peso Médio</th>
                    <th className="py-3 px-3">Temp. Galpão</th>
                    <th className="py-3 px-3">Status Gaiola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {lotes.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{l.identificacao}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{l.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-900">{l.raca}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {l.estagio}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-white">
                        {l.laparosVivos > 0 ? `${l.laparosVivos} láparos` : `${l.matrizes} matrizes`}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400">{l.pesoMedioKg} kg</td>
                      <td className="py-3.5 px-3 font-mono text-cyan-400">{l.temperaturaGalpaoC}°C</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {l.taxaOcupacaoGaiolaPct}% Ocupado
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

      {/* Conteúdo Aba 2: Reprodução */}
      {activeTab === 'reproducao' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              Cronograma de Banda Única (IA a Cada 42 Dias)
            </h3>
            <p className="text-xs text-slate-600">
              O manejo em bandas permite sincronizar todas as fêmeas com indução de ovulação por GnRH e inseminação artificial com sêmen heterospérmico diluído em lote único:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-white block">Dia 0: Inseminação Artificial (IA)</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Inseminação simultânea das matrizes 11 dias pós-parto anterior (ritmo semi-intensivo).
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-white block">Dia 12 a 14: Palpação Abdominal</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Diagnóstico precoce de gestação com acurácia superior a 95%.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-white block">Dia 28: Instalação do Ninho com Maravalha</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  A coelha arranca os próprios pelos para forrar o ninho antes do parto no dia 31.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-white block">Dia 32 a 35: Desmame dos Láparos</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Transferência dos láparos para galpão de engorda com peso de 850 a 950g.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Índices Zootécnicos Médios Obtidos
            </h3>
            <p className="text-xs text-slate-600">
              Desempenho com matrizes F1 selecionadas para prolificidade e habilidade materna:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Taxa de Fertilidade à IA:</span>
                <span className="font-mono font-bold text-emerald-400">86.5%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Láparos Nascidos Vivos por Parto:</span>
                <span className="font-mono font-bold text-amber-400">9.2 cabeças</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Idade ao Abate:</span>
                <span className="font-mono font-bold text-cyan-400">70 a 75 dias</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Peso Vivo Final:</span>
                <span className="font-mono font-bold text-white">2.50 a 2.70 kg</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Carcaça & Peles */}
      {activeTab === 'carcaca_peles' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Scale className="w-5 h-5 text-amber-400" />
              Características Nutricionais da Carne de Coelho e Agregação de Valor
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              A carne de coelho é classificada pela FAO/OMS como a proteína animal mais saudável para consumo humano:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Proteína Bruta</span>
                <span className="text-2xl font-black text-white font-mono">22.0%</span>
                <span className="text-[11px] text-amber-400 block">Superior a frango e bovino</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Gordura Total</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">3.8%</span>
                <span className="text-[11px] text-slate-600 block">Altamente magra e digestível</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Colesterol</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">50 mg / 100g</span>
                <span className="text-[11px] text-slate-600 block">Recomendada para dietas cardíacas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              Parâmetros Zootécnicos do Plantel
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Matrizes Ativas</span>
                <span className="font-mono text-amber-400">{matrizesAtivas} matrizes</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={matrizesAtivas}
                onChange={(e) => setMatrizesAtivas(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Partos por Matriz / Ano</span>
                <span className="font-mono text-amber-400">{partosPorMatrizAno} partos</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="8.0"
                step="0.5"
                value={partosPorMatrizAno}
                onChange={(e) => setPartosPorMatrizAno(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Preço Carcaça (R$/kg)</span>
                <span className="font-mono text-emerald-400">R$ {precoKgCarcacaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="28.0"
                max="55.0"
                step="1.0"
                value={precoKgCarcacaReais}
                onChange={(e) => setPrecoKgCarcacaReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Preço Pele Curtida (R$/pele)</span>
                <span className="font-mono text-emerald-400">R$ {precoPeleCurtidaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="8.0"
                max="25.0"
                step="1.0"
                value={precoPeleCurtidaReais}
                onChange={(e) => setPrecoPeleCurtidaReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              DRE Econômico da Cunicultura Comercial
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Abates Anuais</span>
                <span className="font-mono font-bold text-white text-base">
                  {metricas.coelhosAbatidosAno.toLocaleString()} cab
                </span>
                <span className="text-[10px] text-slate-600 block">{taxaSobrevivenciaEngordaPct}% engorda</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Carne Limpa</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {(metricas.carneCarcacaKgAno / 1000).toFixed(1)} ton
                </span>
                <span className="text-[10px] text-amber-400/80 block">{rendimentoCarcacaPct}% rendimento</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricas.receitaBrutaTotalReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-slate-600 block">Carne + Peles</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricas.lucroLiquidoAnoReais / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Venda de Carne de Coelho ({metricas.carneCarcacaKgAno.toLocaleString()} kg @ R$ {precoKgCarcacaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-white">
                  R$ {metricas.receitaCarneReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Venda de Peles Curtidas ({metricas.coelhosAbatidosAno.toLocaleString()} peles @ R$ {precoPeleCurtidaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-amber-400">
                  + R$ {metricas.receitaPelesReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custo Total de Alimentação, Sanidade e Ambiência:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {metricas.custoTotalAnoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-950/30 px-3 rounded-lg border border-emerald-800/50">
                <span className="text-white">Lucro Líquido Anual Consolidado:</span>
                <span className="font-mono text-emerald-300">
                  R$ {metricas.lucroLiquidoAnoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuniculturaIndustrialModule;
