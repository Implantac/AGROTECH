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
  HeartPulse,
  Flame,
  Search
} from 'lucide-react';

interface AnimalEquino {
  id: string;
  nome: string;
  registro: string;
  raca: 'Mangalarga Marchador' | 'Quarto de Milha' | 'Crioulo';
  categoria: 'GARANHAO_REPRODUTOR' | 'DOADORA_EMBRIAO' | 'RECEPTORA' | 'POTRO_MAMANDO' | 'TRABALHO_LIDA';
  idadeAnos: number;
  escoreHenneke: number; // 1 a 9
  statusReprodutivo: 'PRENHEZ_CONFIRMADA' | 'EM_FOLICULOGENESE' | 'PARIDA_LACTACAO' | 'APTO_COBERTURA';
  exameAIEMormoValidade: string;
}

export const EquinoculturaManejoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plantel' | 'reproducao_te' | 'nutricao_sanidade' | 'simulador'>('plantel');

  // Plantel de Equinos
  const [plantel] = useState<AnimalEquino[]>([
    {
      id: 'EQ-001',
      nome: 'Imperador da Santa Helena',
      registro: 'MM-2021-0419',
      raca: 'Mangalarga Marchador',
      categoria: 'GARANHAO_REPRODUTOR',
      idadeAnos: 7.5,
      escoreHenneke: 6.0,
      statusReprodutivo: 'APTO_COBERTURA',
      exameAIEMormoValidade: '2026-12-15',
    },
    {
      id: 'EQ-002',
      nome: 'Serenata da Cachoeira',
      registro: 'MM-2019-8812',
      raca: 'Mangalarga Marchador',
      categoria: 'DOADORA_EMBRIAO',
      idadeAnos: 9.0,
      escoreHenneke: 5.5,
      statusReprodutivo: 'EM_FOLICULOGENESE',
      exameAIEMormoValidade: '2026-11-20',
    },
    {
      id: 'EQ-003',
      nome: 'Receptora 14 (Barriga de Aluguel)',
      registro: 'REC-2024-0014',
      raca: 'Mangalarga Marchador',
      categoria: 'RECEPTORA',
      idadeAnos: 6.0,
      escoreHenneke: 5.5,
      statusReprodutivo: 'PRENHEZ_CONFIRMADA',
      exameAIEMormoValidade: '2027-01-10',
    },
    {
      id: 'EQ-004',
      nome: 'Pampa Flash Gunner',
      registro: 'QM-2023-5510',
      raca: 'Quarto de Milha',
      categoria: 'TRABALHO_LIDA',
      idadeAnos: 4.2,
      escoreHenneke: 5.8,
      statusReprodutivo: 'APTO_COBERTURA',
      exameAIEMormoValidade: '2026-10-30',
    },
  ]);

  // Simulador Econômico do Haras
  const [totalEquinos, setTotalEquinos] = useState<number>(85);
  const [eguasReproducao, setEguasReproducao] = useState<number>(35);
  const [taxaPrenhezPct, setTaxaPrenhezPct] = useState<number>(82.0);
  const [custoManutencaoCabecaMes, setCustoManutencaoCabecaMes] = useState<number>(850.0);
  const [valorMedioPotroDesmamado, setValorMedioPotroDesmamado] = useState<number>(22000.0);
  const [receitaCoberturasGaranhao, setReceitaCoberturasGaranhao] = useState<number>(300000.0);

  // Cálculos do Haras
  const metricasHaras = useMemo(() => {
    const potrosNascidos = Math.round(eguasReproducao * (taxaPrenhezPct / 100));
    const receitaAnualPotros = Number((potrosNascidos * valorMedioPotroDesmamado).toFixed(2));
    const receitaTotalAnual = Number((receitaAnualPotros + receitaCoberturasGaranhao).toFixed(2));
    const custoTotalPlantelAnual = Number((totalEquinos * custoManutencaoCabecaMes * 12).toFixed(2));
    const margemLiquidaHarasAnual = Number((receitaTotalAnual - custoTotalPlantelAnual).toFixed(2));

    return {
      potrosNascidos,
      receitaAnualPotros,
      receitaTotalAnual,
      custoTotalPlantelAnual,
      margemLiquidaHarasAnual,
    };
  }, [totalEquinos, eguasReproducao, taxaPrenhezPct, custoManutencaoCabecaMes, valorMedioPotroDesmamado, receitaCoberturasGaranhao]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-amber-500/20 text-amber-800 border border-amber-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Módulo 82 • Equinocultura de Precisão, Haras & Manejo Reprodutivo
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 rounded-full">
                Sanidade MAPA • GTA Oficial
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              🐎 Gestão Zootécnica de Haras & Biotécnicas Equinas
            </h2>
            <p className="text-sm text-slate-900 max-w-3xl leading-relaxed">
              Manejo reprodutivo de alta linhagem: transferência de embriões (TE), inseminação com sêmen fresco/resfriado, escore Henneke (1 a 9), nutrição balanceada (NRC Equinos) e controle sorológico obrigatório de AIE e Mormo.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Plantel Ativo</span>
              <span className="text-xl font-black text-amber-700">85 equinos</span>
              <span className="text-[10px] text-slate-600 block mt-0.5">35 Matrizes TE</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Faturamento Haras</span>
              <span className="text-xl font-black text-emerald-700">R$ 938k</span>
              <span className="text-[10px] text-emerald-700/80 block mt-0.5">Potros & Coberturas</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Taxa de Prenhez (TE/IA)</span>
            <Activity className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">82.0%</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            29 Potros TE Previstos / Nascidos
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Escore Henneke Médio</span>
            <Award className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">5.6 / 9.0</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Condição Corporal Moderada / Ideal
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sanidade MAPA Oficial</span>
            <ShieldCheck className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-black text-sky-700">100% Negativo</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            AIE (Coggins) & Mormo • GTA Liberada
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Margem Líquida Haras</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-700">R$ 71.000,00</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Custeio Anual: R$ 867k coberto
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('plantel')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'plantel'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Award className="w-4 h-4" />
          1. Plantel & Registro Genealógico
        </button>

        <button
          onClick={() => setActiveTab('reproducao_te')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'reproducao_te'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <Activity className="w-4 h-4" />
          2. Biotécnicas Reprodutivas & TE
        </button>

        <button
          onClick={() => setActiveTab('nutricao_sanidade')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'nutricao_sanidade'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          3. Nutrição (NRC) & Sanidade MAPA
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-2xs cursor-pointer'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold cursor-pointer'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Financeiro do Haras
        </button>
      </div>

      {/* Conteúdo Aba 1: Plantel */}
      {activeTab === 'plantel' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-700" />
              Animais Registrados & Categoria Zootécnica
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Controle individual por microchip ISO 11784/11785, filiação por DNA genotipado e controle de validade de exames oficiais de trânsito interestadual.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Nome do Animal</th>
                    <th className="py-3 px-3">Registro Associação</th>
                    <th className="py-3 px-3">Raça</th>
                    <th className="py-3 px-3">Categoria</th>
                    <th className="py-3 px-3">Idade</th>
                    <th className="py-3 px-3">Escore Henneke</th>
                    <th className="py-3 px-3">Status Reprodutivo</th>
                    <th className="py-3 px-3">Exame AIE / Mormo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {plantel.map((eq) => (
                    <tr key={eq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{eq.nome}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{eq.id}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-amber-700 font-bold">{eq.registro}</td>
                      <td className="py-3.5 px-3 text-slate-900">{eq.raca}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {eq.categoria}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-900">{eq.idadeAnos} anos</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">{eq.escoreHenneke.toFixed(1)}/9</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-800 border border-emerald-500/30">
                          {eq.statusReprodutivo}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-sky-700">
                        Válido até {eq.exameAIEMormoValidade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Reprodução & TE */}
      {activeTab === 'reproducao_te' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-700" />
              Protocolo de Transferência de Embriões (TE)
            </h3>
            <p className="text-xs text-slate-600">
              Sincronização estral entre Doadora de Elite e Éguas Receptoras com prostaglandina F2α e indução de ovulação com Acetato de Deslorelina ou hCG.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">1. Monitoramento Folicular por Ultrassom</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Identificação de folículo pré-ovulatório &gt; 35 mm e padrão de edema endometrial grau 3 ("roda de carroça").
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">2. Inseminação Artificial (IA) com Sêmen Certificado</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Dose inseminante com &gt; 500 milhões de espermatozoides móveis progressivos no corpo do útero.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">3. Lavagem Uterina (Flushing) no D8</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Colheita do blastocisto expandido com filtro de embrião de 75 µm em solução Ringer Lactato com BSA.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">4. Inovulação Transcervical na Receptora</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Deposição suave no corno ipsilateral à ovulação da receptora perfeitamente sincronizada (D6 a D8 pós-ovulação).
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              Taxa de Sucesso da Estação de Monta
            </h3>
            <p className="text-xs text-slate-600">
              Desempenho da central de reprodução na temporada atual:
            </p>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Coletas Realizadas</span>
                <span className="font-mono font-bold text-slate-900 text-lg">42 flushings</span>
                <span className="text-[10px] text-emerald-700 block">36 embriões (85.7%)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Prenhezes Confirmadas</span>
                <span className="font-mono font-bold text-emerald-700 text-lg">29 receptoras</span>
                <span className="text-[10px] text-slate-600 block">Diagnóstico precoce D14</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Nutrição & Sanidade */}
      {activeTab === 'nutricao_sanidade' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-700" />
              Nutrição Equina de Precisão (NRC Equinos)
            </h3>
            <p className="text-xs text-slate-600">
              Respeito estrito à fisiologia digestiva de herbívoro monogástrico com fermentação cecocólica:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Aporte Mínimo de Volumoso</span>
                  <span className="text-slate-600 text-[11px]">&gt; 1.5% do peso vivo em matéria seca de feno Coastcross</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 font-bold">ANTI-CÓLICA</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Fracionamento do Concentrado</span>
                  <span className="text-slate-600 text-[11px]">Máximo de 2.0 kg por trato para evitar sobrecarga de amido no ceco</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 font-bold">3 TRATOS/DIA</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Suplementação Mineral & Biotina</span>
                  <span className="text-slate-600 text-[11px]">Fortalecimento do estojo córneo do casco e pelagem</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-sky-700 font-bold">QUELATADOS</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-700" />
              Calendário Sanitário & Emissão de GTA MAPA
            </h3>
            <p className="text-xs text-slate-600">
              Protocolo para competições hípicas, leilões e trânsito interestadual:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Anemia Infecciosa Equina (AIE - Coggins)</span>
                  <span className="text-slate-600 text-[11px]">Validade de 60 dias (laboratório credenciado MAPA)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 font-bold">100% REGULAR</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Mormo (Fixação de Complemento / ELISA)</span>
                  <span className="text-slate-600 text-[11px]">Validade de 60 dias</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 font-bold">100% REGULAR</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Vacinação Quíntupla Equina</span>
                  <span className="text-slate-600 text-[11px]">Tétano, Encefalomielite, Raiva, Influenza e Rinopneumonite</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-sky-700 font-bold">IMUNIZADOS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador Financeiro */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-700" />
              Parâmetros Zootécnicos & Comerciais
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Plantel Total Mantido</span>
                <span className="font-mono text-amber-700">{totalEquinos} animais</span>
              </div>
              <input
                type="range"
                min="20"
                max="250"
                step="5"
                value={totalEquinos}
                onChange={(e) => setTotalEquinos(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Éguas em Reprodução (Matrizes)</span>
                <span className="font-mono text-amber-700">{eguasReproducao} éguas</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="1"
                value={eguasReproducao}
                onChange={(e) => setEguasReproducao(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Taxa de Prenhez TE</span>
                <span className="font-mono text-emerald-700">{taxaPrenhezPct}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="1"
                value={taxaPrenhezPct}
                onChange={(e) => setTaxaPrenhezPct(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Valor Médio do Potro Desmamado</span>
                <span className="font-mono text-emerald-700">R$ {valorMedioPotroDesmamado.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="12000"
                max="50000"
                step="1000"
                value={valorMedioPotroDesmamado}
                onChange={(e) => setValorMedioPotroDesmamado(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Receita com Coberturas Garanhão</span>
                <span className="font-mono text-amber-700">R$ {receitaCoberturasGaranhao.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="800000"
                step="25000"
                value={receitaCoberturasGaranhao}
                onChange={(e) => setReceitaCoberturasGaranhao(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-900 font-semibold mb-1">
                <span>Custo de Manutenção / Cabeça / Mês</span>
                <span className="font-mono text-rose-700">R$ {custoManutencaoCabecaMes.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="450"
                max="1600"
                step="25"
                value={custoManutencaoCabecaMes}
                onChange={(e) => setCustoManutencaoCabecaMes(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              DRE Zootécnica & Equilíbrio Econômico do Haras
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Potros Nascidos</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {metricasHaras.potrosNascidos} potros
                </span>
                <span className="text-[10px] text-slate-600 block">{taxaPrenhezPct}% Prenhez</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Receita Potros</span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  R$ {(metricasHaras.receitaAnualPotros / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-700/80 block">Leilão & Venda</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Receita Total Haras</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  R$ {(metricasHaras.receitaTotalAnual / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-slate-600 block">Potros + Sêmen</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Lucro Líquido Anual</span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  R$ {(metricasHaras.margemLiquidaHarasAnual / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-700/80 block">Após Manutenção</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Receita com Venda de Potros ({metricasHaras.potrosNascidos} un @ R$ {valorMedioPotroDesmamado.toLocaleString()}):</span>
                <span className="font-mono font-bold text-emerald-700">
                  R$ {metricasHaras.receitaAnualPotros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Receita com Coberturas e Doses de Sêmen do Garanhão Chefe:</span>
                <span className="font-mono font-bold text-amber-700">
                  R$ {receitaCoberturasGaranhao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Custo Total de Manutenção do Plantel ({totalEquinos} equinos @ R$ {custoManutencaoCabecaMes.toFixed(2)}/mês):</span>
                <span className="font-mono font-bold text-rose-700">
                  - R$ {metricasHaras.custoTotalPlantelAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-50 px-3 rounded-lg border border-emerald-200">
                <span className="text-white">Resultado Líquido do Haras:</span>
                <span className="font-mono text-emerald-800">
                  R$ {metricasHaras.margemLiquidaHarasAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / ano
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquinoculturaManejoModule;
