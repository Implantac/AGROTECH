import React, { useState, useMemo } from 'react';
import {
  X,
  Fuel,
  Droplets,
  Bug,
  Scale,
  Wrench,
  DollarSign,
  Plus,
  CheckCircle2,
  AlertTriangle,
  History,
  Copy,
  Trash2,
  Clock,
  Sparkles,
  Thermometer,
  Wind,
  ShieldCheck,
  Send,
  Save,
  RotateCcw
} from 'lucide-react';
import { TALHOES_INICIAIS, MAQUINAS_INICIAIS, INSUMOS_INICIAIS, CONDOMINOS_FAZENDA } from '../data/mockAgroData';

export type LaunchType =
  | 'ABASTECIMENTO'
  | 'CALDA'
  | 'MIP'
  | 'ROMANEIO'
  | 'MANUTENCAO'
  | 'FINANCEIRO'
  | 'PESAGEM_PECUARIA'
  | 'LEITURA_COCHO'
  | 'COLHEITA_HF';

export interface RecentLaunch {
  id: string;
  tipo: LaunchType;
  titulo: string;
  detalhes: string;
  horario: string;
  tag: string;
  status: 'SINCRONIZADO' | 'PENDENTE_OFFLINE';
}

interface GlobalQuickEntryModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (message: string) => void;
  profileId?: string;
}

export const GlobalQuickEntryModal: React.FC<GlobalQuickEntryModalProps> = ({
  isOpen = true,
  onClose = () => {},
  onSuccess = () => {},
  profileId = 'AGRICULTURA_GRAOS',
}) => {
  const isPecuaria = profileId === 'PECUARIA_CORTE_LEITE';
  const isHF = profileId === 'HORTIFRUTI_FLORICULTURA';

  const [activeTab, setActiveTab] = useState<LaunchType>(() => {
    if (profileId === 'PECUARIA_CORTE_LEITE') return 'PESAGEM_PECUARIA';
    if (profileId === 'HORTIFRUTI_FLORICULTURA') return 'COLHEITA_HF';
    return 'ABASTECIMENTO';
  });
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // --- FORM STATES: PECUÁRIA (PESAGEM & GMD) ---
  const [pesagemLote, setPesagemLote] = useState<string>('Curral A1 - Confinamento');
  const [pesagemCabecas, setPesagemCabecas] = useState<number>(450);
  const [pesagemPesoMedio, setPesagemPesoMedio] = useState<number>(534.5);
  const [pesagemPesoAnterior, setPesagemPesoAnterior] = useState<number>(482.0);
  const [pesagemDias, setPesagemDias] = useState<number>(34);
  const [pesagemDestino, setPesagemDestino] = useState<string>('Terminação Cota Hilton');

  const gmdCalculado = useMemo(() => {
    if (pesagemDias <= 0) return 0;
    return Number(((pesagemPesoMedio - pesagemPesoAnterior) / pesagemDias).toFixed(2));
  }, [pesagemPesoMedio, pesagemPesoAnterior, pesagemDias]);

  const ganhoArrobasTotal = useMemo(() => {
    return Number((((pesagemPesoMedio - pesagemPesoAnterior) / 30) * pesagemCabecas).toFixed(1));
  }, [pesagemPesoMedio, pesagemPesoAnterior, pesagemCabecas]);

  // --- FORM STATES: PECUÁRIA (LEITURA DE COCHO) ---
  const [cochoCurral, setCochoCurral] = useState<string>('Curral A1 - Terminação');
  const [cochoNota, setCochoNota] = useState<number>(0);
  const [cochoFornecimentoKg, setCochoFornecimentoKg] = useState<number>(11.8);
  const [cochoAjustePct, setCochoAjustePct] = useState<number>(0);

  // --- FORM STATES: HORTIFRÚTI (COLHEITA & BRIX) ---
  const [hfGleba, setHfGleba] = useState<string>('Estufa E01 - Tomate Especial');
  const [hfCaixas, setHfCaixas] = useState<number>(380);
  const [hfPesoTotalTon, setHfPesoTotalTon] = useState<number>(7.6);
  const [hfBrix, setHfBrix] = useState<number>(9.8);
  const [hfClassificacao, setHfClassificacao] = useState<string>('Classe Extra Gourmet');

  // Lista de lançamentos recentes da sessão
  const [recentLaunches, setRecentLaunches] = useState<RecentLaunch[]>([
    {
      id: 'LNC-01',
      tipo: 'ABASTECIMENTO',
      titulo: 'Trator John Deere 8400R (TRAT-01)',
      detalhes: '320 Litros Diesel S10 • Horímetro: 3.421,5 h • Consumo: 27,8 L/h',
      horario: 'Hoje às 10:45',
      tag: 'Comboio 01',
      status: 'SINCRONIZADO',
    },
    {
      id: 'LNC-02',
      tipo: 'MIP',
      titulo: 'Talhão 04 - Soja BRS 539',
      detalhes: 'Percevejo Marrom: 3.8 alvos/m (CRÍTICO) • NDE ultrapassado',
      horario: 'Hoje às 09:20',
      tag: 'MIP Digital',
      status: 'SINCRONIZADO',
    },
    {
      id: 'LNC-03',
      tipo: 'CALDA',
      titulo: 'Pulverizador Patriot 3330 (PULV-01)',
      detalhes: 'Talhão 02 (420 ha) • Volume: 42.000 L • Delta T: 4.8°C (Seguro)',
      horario: 'Hoje às 08:15',
      tag: 'Calda Herbicida',
      status: 'SINCRONIZADO',
    },
  ]);

  // --- FORM STATES: ABASTECIMENTO ---
  const [abastMaquinaId, setAbastMaquinaId] = useState<string>('maq-01');
  const [abastHorimetro, setAbastHorimetro] = useState<number>(3421.5);
  const [abastHorimetroAnterior, setAbastHorimetroAnterior] = useState<number>(3409.8);
  const [abastLitros, setAbastLitros] = useState<number>(320);
  const [abastTanque, setAbastTanque] = useState<string>('Comboio Móvel 01');
  const [abastOperador, setAbastOperador] = useState<string>('Carlos Eduardo (Operador Senior)');

  // Cálculos automáticos de abastecimento
  const horasTrabalhadas = useMemo(() => {
    const diff = abastHorimetro - abastHorimetroAnterior;
    return diff > 0 ? Number(diff.toFixed(1)) : 0;
  }, [abastHorimetro, abastHorimetroAnterior]);

  const consumoMedioLh = useMemo(() => {
    if (horasTrabalhadas <= 0 || abastLitros <= 0) return 0;
    return Number((abastLitros / horasTrabalhadas).toFixed(2));
  }, [abastLitros, horasTrabalhadas]);

  // --- FORM STATES: CALDA / PULVERIZAÇÃO ---
  const [caldaTalhaoId, setCaldaTalhaoId] = useState<string>('talhao-02');
  const [caldaMaquinaId, setCaldaMaquinaId] = useState<string>('maq-03');
  const [caldaInsumoId, setCaldaInsumoId] = useState<string>('ins-01');
  const [caldaTaxaLha, setCaldaTaxaLha] = useState<number>(100);
  const [caldaTemp, setCaldaTemp] = useState<number>(27);
  const [caldaUR, setCaldaUR] = useState<number>(65);
  const [caldaVento, setCaldaVento] = useState<number>(7);

  const selectedCaldaTalhao = useMemo(() => {
    return TALHOES_INICIAIS.find((t) => t.id === caldaTalhaoId) || TALHOES_INICIAIS[0];
  }, [caldaTalhaoId]);

  const volumeTotalCaldaLitros = useMemo(() => {
    return Math.round(selectedCaldaTalhao.areaHa * caldaTaxaLha);
  }, [selectedCaldaTalhao, caldaTaxaLha]);

  const deltaTEstimado = useMemo(() => {
    // Estimativa simples de Delta T a partir da temperatura e UR: Delta T ≈ T - (T_bulbo_úmido)
    // T - (T * (1 - (100 - UR)/100 * 0.4))
    const deltaT = caldaTemp - (caldaTemp * (caldaUR / 100));
    return Number(Math.max(1.5, Math.min(12, deltaT * 0.6 + 2)).toFixed(1));
  }, [caldaTemp, caldaUR]);

  const isDeltaTSeguro = deltaTEstimado >= 2.0 && deltaTEstimado <= 8.0 && caldaVento >= 3 && caldaVento <= 10;

  // --- FORM STATES: MIP ---
  const [mipTalhaoId, setMipTalhaoId] = useState<string>('talhao-04');
  const [mipPraga, setMipPraga] = useState<string>('Percevejo Marrom (Euschistus heros)');
  const [mipContagem, setMipContagem] = useState<number>(3.5);
  const [mipEstadioCultura, setMipEstadioCultura] = useState<string>('R5.2 (Enchimento de Grãos)');

  const mipStatus = useMemo(() => {
    if (mipContagem >= 3.0) return { label: 'CRÍTICO - Nível de Ação Ultrapassado', color: 'text-rose-400 bg-rose-500/20 border-rose-500/40' };
    if (mipContagem >= 1.5) return { label: 'ALERTA - Monitorar a cada 48h', color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' };
    return { label: 'SEGURO - Abaixo do NDE', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' };
  }, [mipContagem]);

  // --- FORM STATES: ROMANEIO BALANÇA ---
  const [romTalhaoId, setRomTalhaoId] = useState<string>('talhao-06');
  const [romPlaca, setRomPlaca] = useState<string>('BRA-9X21 (Bitrem 9 Eixos)');
  const [romMotorista, setRomMotorista] = useState<string>('Valdir Ferreira');
  const [romPesoBruto, setRomPesoBruto] = useState<number>(57400);
  const [romTara, setRomTara] = useState<number>(18800);
  const [romUmidade, setRomUmidade] = useState<number>(14.8);
  const [romImpureza, setRomImpureza] = useState<number>(1.2);
  const [romArmazem, setRomArmazem] = useState<string>('Silo Central Fazenda Santa Helena');

  const romPesoLiquidoInicial = useMemo(() => romPesoBruto - romTara, [romPesoBruto, romTara]);
  const romDescUmidadeKg = useMemo(() => {
    return romUmidade > 14.0 ? Math.round(romPesoLiquidoInicial * ((romUmidade - 14.0) / 100) * 1.25) : 0;
  }, [romPesoLiquidoInicial, romUmidade]);
  const romDescImpurezaKg = useMemo(() => {
    return romImpureza > 1.0 ? Math.round(romPesoLiquidoInicial * ((romImpureza - 1.0) / 100)) : 0;
  }, [romPesoLiquidoInicial, romImpureza]);
  const romPesoLiquidoFinal = useMemo(() => romPesoLiquidoInicial - romDescUmidadeKg - romDescImpurezaKg, [romPesoLiquidoInicial, romDescUmidadeKg, romDescImpurezaKg]);
  const romSacasLiquidas = useMemo(() => Number((romPesoLiquidoFinal / 60).toFixed(1)), [romPesoLiquidoFinal]);

  // --- FORM STATES: MANUTENÇÃO / OFICINA ---
  const [manutMaquinaId, setManutMaquinaId] = useState<string>('colh-01');
  const [manutTipo, setManutTipo] = useState<string>('Preventiva (Troca de Filtros e Óleo)');
  const [manutHorimetro, setManutHorimetro] = useState<number>(1845.0);
  const [manutCriticidade, setManutCriticidade] = useState<'BAIXA' | 'MEDIA' | 'URGENTE'>('MEDIA');
  const [manutMecanico, setManutMecanico] = useState<string>('Roberto (Oficina Central)');
  const [manutDescricao, setManutDescricao] = useState<string>('Troca dos filtros primário/secundário de combustível e óleo lubrificante 15W40.');

  // --- FORM STATES: FINANCEIRO / LCDPR ---
  const [finTipo, setFinTipo] = useState<'RECEITA' | 'DESPESA_CUSTEIO'>('DESPESA_CUSTEIO');
  const [finValor, setFinValor] = useState<number>(18500.0);
  const [finDocumento, setFinDocumento] = useState<string>('NF-e 84.192');
  const [finHistorico, setFinHistorico] = useState<string>('Aquisição de Óleo Diesel S10 para Plantio');
  const [finConta, setFinConta] = useState<string>('Banco do Brasil S.A. (Ag: 1284-5 C/C: 98412-0)');

  // Submit Handler
  const handleSubmitLaunch = (keepOpen: boolean = false) => {
    let titulo = '';
    let detalhes = '';
    let tag = '';

    if (activeTab === 'ABASTECIMENTO') {
      const maq = MAQUINAS_INICIAIS.find((m) => m.id === abastMaquinaId);
      titulo = maq?.nome || 'Máquina Agrícola';
      detalhes = `${abastLitros} L Diesel • Horímetro: ${abastHorimetro.toFixed(1)} h • Consumo: ${consumoMedioLh} L/h`;
      tag = abastTanque;
    } else if (activeTab === 'CALDA') {
      titulo = `Aplicação ${selectedCaldaTalhao.nome}`;
      detalhes = `${volumeTotalCaldaLitros.toLocaleString('pt-BR')} L Calda (${caldaTaxaLha} L/ha) • Delta T: ${deltaTEstimado}°C`;
      tag = 'Pulverização';
    } else if (activeTab === 'MIP') {
      const talhao = TALHOES_INICIAIS.find((t) => t.id === mipTalhaoId);
      titulo = `${talhao?.nome || 'Talhão'} - ${mipPraga}`;
      detalhes = `${mipContagem} alvos/m • ${mipStatus.label} • ${mipEstadioCultura}`;
      tag = 'MIP Digital';
    } else if (activeTab === 'ROMANEIO') {
      const talhao = TALHOES_INICIAIS.find((t) => t.id === romTalhaoId);
      titulo = `Romaneio Balança • ${talhao?.nome}`;
      detalhes = `${romSacasLiquidas.toLocaleString('pt-BR')} sc Líquidas (${(romPesoLiquidoFinal/1000).toFixed(1)} ton) • Placa ${romPlaca}`;
      tag = 'Carga Grãos';
    } else if (activeTab === 'MANUTENCAO') {
      const maq = MAQUINAS_INICIAIS.find((m) => m.id === manutMaquinaId);
      titulo = `OS: ${maq?.nome} - ${manutTipo}`;
      detalhes = `Horímetro: ${manutHorimetro} h • Mecânico: ${manutMecanico} • Criticidade: ${manutCriticidade}`;
      tag = 'Oficina';
    } else if (activeTab === 'FINANCEIRO') {
      titulo = `${finTipo === 'RECEITA' ? 'Receita' : 'Despesa'}: ${finDocumento}`;
      detalhes = `R$ ${finValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} • ${finHistorico}`;
      tag = 'LCDPR Rural';
    } else if (activeTab === 'PESAGEM_PECUARIA') {
      titulo = `Pesagem ${pesagemLote}`;
      detalhes = `${pesagemCabecas} cab • Peso: ${pesagemPesoMedio} kg • GMD: ${gmdCalculado} kg/dia • +${ganhoArrobasTotal} @ ganhas`;
      tag = 'Zootecnia GMD';
    } else if (activeTab === 'LEITURA_COCHO') {
      titulo = `Leitura Cocho: ${cochoCurral}`;
      detalhes = `Nota Cocho: ${cochoNota} • Fornecimento: ${cochoFornecimentoKg} kg MS/cab • Ajuste: ${cochoAjustePct >= 0 ? '+' : ''}${cochoAjustePct}%`;
      tag = 'Confinamento';
    } else if (activeTab === 'COLHEITA_HF') {
      titulo = `Colheita HF: ${hfGleba}`;
      detalhes = `${hfCaixas} cx (${hfPesoTotalTon} ton) • Grau Brix: ${hfBrix}°Bx • ${hfClassificacao}`;
      tag = 'Hortifrúti HF';
    }

    const novoItem: RecentLaunch = {
      id: `LNC-${Date.now().toString().slice(-4)}`,
      tipo: activeTab,
      titulo,
      detalhes,
      horario: 'Agora mesmo',
      tag,
      status: 'SINCRONIZADO',
    };

    setRecentLaunches([novoItem, ...recentLaunches]);
    onSuccess(`Lançamento de ${activeTab.toLowerCase()} registrado com sucesso e sincronizado no banco de dados.`);

    if (!keepOpen) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-[#EAF4E7] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#26332A]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAF4E7] flex items-center justify-between bg-[#F7F9F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <Plus className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#1D4B38] tracking-tight">
                  Central de Lançamentos Rápidos
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Offline-First & Validação Instantânea
                </span>
              </div>
              <p className="text-xs text-[#66736A]">
                Apontamento ágil de campo com cálculos automáticos, telemetria integrada e histórico da sessão.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
                showHistory
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#EAF4E7] text-[#1D4B38] border-[#8FBF88] hover:text-[#1D4B38]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Histórico ({recentLaunches.length})</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#66736A] hover:text-[#1D4B38] rounded-xl hover:bg-slate-800 transition"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {showHistory ? (
            /* Visualização do Histórico da Sessão */
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
                    <History className="w-4 h-4 text-amber-400" />
                    Lançamentos Realizados Nesta Sessão
                  </h3>
                  <p className="text-xs text-[#66736A]">
                    Registros salvos localmente e propagados para os módulos da plataforma.
                  </p>
                </div>
                <button
                  onClick={() => setRecentLaunches([])}
                  className="text-xs text-[#66736A] hover:text-rose-400 flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Limpar Histórico
                </button>
              </div>

              <div className="space-y-2">
                {recentLaunches.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#F7F9F5] border-[#EAF4E7] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#8FBF88] transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {item.id}
                        </span>
                        <h4 className="text-xs font-bold text-[#1D4B38]">{item.titulo}</h4>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#EAF4E7] text-[#1D4B38]">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs text-[#66736A]">{item.detalhes}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-[#66736A] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {item.horario}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Seletor de Tipo de Lançamento Adaptativo por Atividade */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {isPecuaria ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveTab('PESAGEM_PECUARIA')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'PESAGEM_PECUARIA'
                          ? 'bg-[#EAF4E7] border-[#285943] text-[#1D4B38] shadow-lg shadow-emerald-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <Scale className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-bold">Pesagem / GMD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('LEITURA_COCHO')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'LEITURA_COCHO'
                          ? 'bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <Sparkles className="w-5 h-5 text-rose-400" />
                      <span className="text-xs font-bold">Leitura Cocho</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('ABASTECIMENTO')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'ABASTECIMENTO'
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <Fuel className="w-5 h-5 text-amber-400" />
                      <span className="text-xs font-bold">Abastecimento</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('MANUTENCAO')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'MANUTENCAO'
                          ? 'bg-blue-500/15 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <Wrench className="w-5 h-5 text-blue-400" />
                      <span className="text-xs font-bold">Oficina / Trator</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('FINANCEIRO')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'FINANCEIRO'
                          ? 'bg-purple-500/15 border-purple-500/50 text-purple-300 shadow-lg shadow-purple-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <DollarSign className="w-5 h-5 text-purple-400" />
                      <span className="text-xs font-bold">LCDPR Rural</span>
                    </button>
                  </>
                ) : isHF ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveTab('COLHEITA_HF')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'COLHEITA_HF'
                          ? 'bg-[#EAF4E7] border-[#285943] text-[#1D4B38] shadow-lg shadow-emerald-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-bold">Colheita HF / Brix</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('CALDA')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'CALDA'
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <Droplets className="w-5 h-5 text-cyan-400" />
                      <span className="text-xs font-bold">Fertirrigação</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('MIP')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'MIP'
                          ? 'bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <Bug className="w-5 h-5 text-rose-400" />
                      <span className="text-xs font-bold">MIP / Estufas</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('ABASTECIMENTO')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'ABASTECIMENTO'
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <Fuel className="w-5 h-5 text-amber-400" />
                      <span className="text-xs font-bold">Abastecimento</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('FINANCEIRO')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'FINANCEIRO'
                          ? 'bg-purple-500/15 border-purple-500/50 text-purple-300 shadow-lg shadow-purple-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <DollarSign className="w-5 h-5 text-purple-400" />
                      <span className="text-xs font-bold">LCDPR / NF-e</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveTab('ABASTECIMENTO')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'ABASTECIMENTO'
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <Fuel className="w-5 h-5 text-amber-400" />
                      <span className="text-xs font-bold">Abastecimento</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('CALDA')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'CALDA'
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <Droplets className="w-5 h-5 text-cyan-400" />
                      <span className="text-xs font-bold">Pulverização</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('MIP')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'MIP'
                          ? 'bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <Bug className="w-5 h-5 text-rose-400" />
                      <span className="text-xs font-bold">MIP / Pragas</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('ROMANEIO')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'ROMANEIO'
                          ? 'bg-[#EAF4E7] border-[#285943] text-[#1D4B38] shadow-lg shadow-emerald-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <Scale className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-bold">Romaneio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('MANUTENCAO')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'MANUTENCAO'
                          ? 'bg-blue-500/15 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <Wrench className="w-5 h-5 text-blue-400" />
                      <span className="text-xs font-bold">Manutenção</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('FINANCEIRO')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                        activeTab === 'FINANCEIRO'
                          ? 'bg-purple-500/15 border-purple-500/50 text-purple-300 shadow-lg shadow-purple-950/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] text-[#66736A] hover:text-[#1D4B38] hover:border-[#8FBF88]'
                      }`}
                    >
                      <DollarSign className="w-5 h-5 text-purple-400" />
                      <span className="text-xs font-bold">LCDPR / NF-e</span>
                    </button>
                  </>
                )}
              </div>

              {/* 0.1 PESAGEM PECUÁRIA & GMD FORM */}
              {activeTab === 'PESAGEM_PECUARIA' && (
                <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAF4E7] pb-3">
                    <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-400" />
                      Lançamento de Pesagem de Lote & Cálculo Automático de GMD
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#66736A] font-mono">
                        GMD Calculado:{' '}
                        <strong className="text-emerald-400 text-sm">{gmdCalculado} kg/dia</strong>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Curral / Lote Alvo</label>
                      <input
                        type="text"
                        value={pesagemLote}
                        onChange={(e) => setPesagemLote(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Cabeças no Lote</label>
                      <input
                        type="number"
                        value={pesagemCabecas}
                        onChange={(e) => setPesagemCabecas(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Destino Comercial</label>
                      <select
                        value={pesagemDestino}
                        onChange={(e) => setPesagemDestino(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        <option value="Terminação Cota Hilton">Terminação Cota Hilton (Brinco SISBOV)</option>
                        <option value="Mercado Interno B3">Mercado Interno (Arroba B3)</option>
                        <option value="Recria Novilhas Reposição">Recria Novilhas Reposição</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Peso Médio Atual (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={pesagemPesoMedio}
                        onChange={(e) => setPesagemPesoMedio(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Peso Médio Anterior (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={pesagemPesoAnterior}
                        onChange={(e) => setPesagemPesoAnterior(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Intervalo de Dias</label>
                      <input
                        type="number"
                        value={pesagemDias}
                        onChange={(e) => setPesagemDias(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium font-mono"
                      />
                    </div>
                  </div>

                  {/* Resumo da Pesagem */}
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-[#EAF4E7] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#66736A]">Ganho Médio:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                        +{gmdCalculado} kg/animal/dia
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[#66736A]">Total Produzido no Lote:</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold font-mono">
                        +{ganhoArrobasTotal} @ líquidas
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[#66736A]">Peso Total Lote:</span>
                      <span className="text-white font-mono font-bold">
                        {((pesagemCabecas * pesagemPesoMedio) / 1000).toFixed(1)} toneladas
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 0.2 LEITURA DE COCHO FORM */}
              {activeTab === 'LEITURA_COCHO' && (
                <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAF4E7] pb-3">
                    <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      Apontamento de Leitura de Cocho & Fornecimento de Matéria Seca
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Curral / Confinamento</label>
                      <input
                        type="text"
                        value={cochoCurral}
                        onChange={(e) => setCochoCurral(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Nota de Cocho</label>
                      <select
                        value={cochoNota}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCochoNota(val);
                          if (val === -1) setCochoAjustePct(5);
                          else if (val === 0) setCochoAjustePct(0);
                          else if (val === 1) setCochoAjustePct(0);
                          else if (val === 2) setCochoAjustePct(-10);
                        }}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        <option value={-1}>-1 (Cocho Rapado / Fome)</option>
                        <option value={0}>0 (Cocho Limpo com Lambida - Ideal)</option>
                        <option value={1}>+1 (Sobra Fina 3-5% - Adequado)</option>
                        <option value={2}>+2 (Sobra Excessiva &gt;10% - Desperdício)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Fornecimento (kg MS/cab/dia)</label>
                      <input
                        type="number"
                        step="0.2"
                        value={cochoFornecimentoKg}
                        onChange={(e) => setCochoFornecimentoKg(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-rose-400 font-mono font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Ajuste de Trato Recomendado</label>
                      <div className="px-3 py-2 rounded-xl bg-white border border-[#EAF4E7] font-mono font-bold text-emerald-400">
                        {cochoAjustePct > 0 ? `+${cochoAjustePct}% (Aumentar Trato)` : cochoAjustePct < 0 ? `${cochoAjustePct}% (Reduzir Trato)` : 'Manter Fornecimento'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 0.3 COLHEITA HF FORM */}
              {activeTab === 'COLHEITA_HF' && (
                <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAF4E7] pb-3">
                    <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Lançamento de Colheita de Hortifrúti & Controle de Grau Brix
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Estufa / Gleba HF</label>
                      <input
                        type="text"
                        value={hfGleba}
                        onChange={(e) => setHfGleba(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Caixas Colhidas</label>
                      <input
                        type="number"
                        value={hfCaixas}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setHfCaixas(val);
                          setHfPesoTotalTon(Number(((val * 20) / 1000).toFixed(2)));
                        }}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-mono font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Teor de Brix Médio (°Bx)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={hfBrix}
                        onChange={(e) => setHfBrix(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-amber-400 font-mono font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Classificação Comercial</label>
                      <select
                        value={hfClassificacao}
                        onChange={(e) => setHfClassificacao(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        <option value="Classe Extra Gourmet">Classe Extra Gourmet (Alto Brix)</option>
                        <option value="Classe Especial">Classe Especial (Mercado Livre)</option>
                        <option value="Indústria / Processamento">Indústria / Processamento</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 1. ABASTECIMENTO FORM */}
              {activeTab === 'ABASTECIMENTO' && (
                <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAF4E7] pb-3">
                    <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-amber-400" />
                      Lançamento de Abastecimento & Horímetro CAN Bus
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#66736A]">Presets de Litros:</span>
                      {[150, 250, 320, 450].map((qtd) => (
                        <button
                          key={qtd}
                          type="button"
                          onClick={() => setAbastLitros(qtd)}
                          className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition ${
                            abastLitros === qtd
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-[#EAF4E7] text-[#1D4B38] hover:bg-slate-700'
                          }`}
                        >
                          +{qtd}L
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Máquina / Equipamento</label>
                      <select
                        value={abastMaquinaId}
                        onChange={(e) => setAbastMaquinaId(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        {MAQUINAS_INICIAIS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nome} ({m.tipo})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Ponto de Abastecimento</label>
                      <select
                        value={abastTanque}
                        onChange={(e) => setAbastTanque(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        <option value="Comboio Móvel 01">Comboio Móvel 01 (Caminhão Mercedes Axor)</option>
                        <option value="Comboio Móvel 02">Comboio Móvel 02 (Caminhão VW Constellation)</option>
                        <option value="Tanque Central Fazenda">Tanque Fixo Sede (30.000 L)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Motorista / Abastecedor</label>
                      <input
                        type="text"
                        value={abastOperador}
                        onChange={(e) => setAbastOperador(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Horímetro Anterior (h)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={abastHorimetroAnterior}
                        onChange={(e) => setAbastHorimetroAnterior(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Horímetro Atual no Abastecimento (h)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={abastHorimetro}
                        onChange={(e) => setAbastHorimetro(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Volume Abastecido (Litros)</label>
                      <input
                        type="number"
                        value={abastLitros}
                        onChange={(e) => setAbastLitros(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-amber-400 font-mono font-bold text-sm"
                      />
                    </div>
                  </div>

                  {/* Resumo da Telemetria Calculada */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-[#EAF4E7] flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="text-[#66736A]">Horas Trabalhadas:</span>
                      <strong className="text-white font-mono ml-1.5">{horasTrabalhadas} h</strong>
                    </div>
                    <div>
                      <span className="text-[#66736A]">Consumo Efetivo:</span>
                      <strong className="text-amber-400 font-mono ml-1.5 text-sm">{consumoMedioLh} L/h</strong>
                    </div>
                    <div>
                      <span className="text-[#66736A]">Meta Estabelecida:</span>
                      <span className="text-[#26332A] font-mono ml-1.5">28.00 L/h</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
                        consumoMedioLh <= 28.0
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {consumoMedioLh <= 28.0 ? '✓ Consumo Eficiente na Meta' : '⚠ Desvio Acima da Meta'}
                    </span>
                  </div>
                </div>
              )}

              {/* 2. CALDA & PULVERIZAÇÃO FORM */}
              {activeTab === 'CALDA' && (
                <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAF4E7] pb-3">
                    <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-cyan-400" />
                      Apontamento de Calda & Janela de Aplicação
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                        isDeltaTSeguro
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      Delta T: {deltaTEstimado}°C ({isDeltaTSeguro ? 'Janela Segura' : 'Risco de Evaporação/Deriva'})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Talhão de Destino</label>
                      <select
                        value={caldaTalhaoId}
                        onChange={(e) => setCaldaTalhaoId(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        {TALHOES_INICIAIS.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nome} ({t.areaHa} ha - {t.cultura})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Insumo / Receita da Calda</label>
                      <select
                        value={caldaInsumoId}
                        onChange={(e) => setCaldaInsumoId(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        {INSUMOS_INICIAIS.map((ins) => (
                          <option key={ins.id} value={ins.id}>
                            {ins.nomeComercial} ({ins.categoria})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Pulverizador</label>
                      <select
                        value={caldaMaquinaId}
                        onChange={(e) => setCaldaMaquinaId(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        <option value="maq-03">PULV-01 - Case Patriot 3330 (Barra 36m)</option>
                        <option value="maq-04">DRONE-01 - DJI Agras T40 (Tanque 40L)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Taxa de Aplicação (L/ha)</label>
                      <input
                        type="number"
                        value={caldaTaxaLha}
                        onChange={(e) => setCaldaTaxaLha(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Temperatura Atual (°C)</label>
                      <input
                        type="number"
                        value={caldaTemp}
                        onChange={(e) => setCaldaTemp(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Umidade Relativa (%)</label>
                      <input
                        type="number"
                        value={caldaUR}
                        onChange={(e) => setCaldaUR(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-[#EAF4E7] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#66736A]">Volume Total de Calda:</span>
                      <strong className="text-cyan-400 font-mono text-sm ml-2">
                        {volumeTotalCaldaLitros.toLocaleString('pt-BR')} Litros
                      </strong>
                    </div>
                    <div className="text-[#66736A]">
                      Área Coberta: <strong className="text-white">{selectedCaldaTalhao.areaHa} ha</strong>
                    </div>
                    <div className="text-[#66736A]">
                      Tanques Estimados (3.000 L): <strong className="text-white font-mono">{(volumeTotalCaldaLitros / 3000).toFixed(1)} recargas</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. MIP & BATIDA DE PANO FORM */}
              {activeTab === 'MIP' && (
                <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAF4E7] pb-3">
                    <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
                      <Bug className="w-4 h-4 text-rose-400" />
                      Amostragem Fitossanitária MIP (Batida de Pano Embrapa)
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${mipStatus.color}`}>
                      {mipStatus.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Talhão Amostrado</label>
                      <select
                        value={mipTalhaoId}
                        onChange={(e) => setMipTalhaoId(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        {TALHOES_INICIAIS.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nome} ({t.variedade})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Praga Alvo Monitorada</label>
                      <select
                        value={mipPraga}
                        onChange={(e) => setMipPraga(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        <option value="Percevejo Marrom (Euschistus heros)">Percevejo Marrom (Euschistus heros)</option>
                        <option value="Lagarta Falsa-Medideira (Chrysodeixis includens)">Lagarta Falsa-Medideira (Chrysodeixis)</option>
                        <option value="Spodoptera frugiperda">Spodoptera frugiperda</option>
                        <option value="Mosca-Branca (Bemisia tabaci)">Mosca-Branca (Bemisia tabaci)</option>
                        <option value="Bicudo-do-Algodoeiro">Bicudo-do-Algodoeiro (Anthonomus grandis)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Estádio Fenológico da Lavoura</label>
                      <input
                        type="text"
                        value={mipEstadioCultura}
                        onChange={(e) => setMipEstadioCultura(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      />
                    </div>
                  </div>

                  {/* Incremento Rápido de Contagem */}
                  <div className="p-4 bg-slate-900 rounded-xl border border-[#EAF4E7] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#66736A] font-medium">Contagem de Pragas (Alvos por Metro Linear de Pano):</span>
                      <span className="text-rose-400 font-mono font-bold text-lg">{mipContagem} alvos/m</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {[0, 1.0, 2.0, 3.5, 5.0, 8.0].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setMipContagem(val)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                            mipContagem === val
                              ? 'bg-rose-500 text-white'
                              : 'bg-[#F7F9F5] text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. ROMANEIO BALANÇA FORM */}
              {activeTab === 'ROMANEIO' && (
                <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAF4E7] pb-3">
                    <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-400" />
                      Entrada de Balança & Romaneio de Carga
                    </h3>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Líquido: {romSacasLiquidas.toLocaleString('pt-BR')} sacas 60kg
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Talhão de Origem</label>
                      <select
                        value={romTalhaoId}
                        onChange={(e) => setRomTalhaoId(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        {TALHOES_INICIAIS.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nome} ({t.cultura})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Placa do Caminhão</label>
                      <input
                        type="text"
                        value={romPlaca}
                        onChange={(e) => setRomPlaca(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Motorista</label>
                      <input
                        type="text"
                        value={romMotorista}
                        onChange={(e) => setRomMotorista(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Peso Bruto (kg)</label>
                      <input
                        type="number"
                        value={romPesoBruto}
                        onChange={(e) => setRomPesoBruto(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Tara Caminhão (kg)</label>
                      <input
                        type="number"
                        value={romTara}
                        onChange={(e) => setRomTara(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Armazém de Destino</label>
                      <input
                        type="text"
                        value={romArmazem}
                        onChange={(e) => setRomArmazem(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Umidade (%) - Padrão 14%</label>
                      <input
                        type="number"
                        step="0.1"
                        value={romUmidade}
                        onChange={(e) => setRomUmidade(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Impureza (%) - Padrão 1%</label>
                      <input
                        type="number"
                        step="0.1"
                        value={romImpureza}
                        onChange={(e) => setRomImpureza(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-[#EAF4E7] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[#66736A]">Peso Líquido Bruto:</span>
                      <strong className="text-white font-mono ml-1.5">{romPesoLiquidoInicial.toLocaleString('pt-BR')} kg</strong>
                    </div>
                    <div>
                      <span className="text-[#66736A]">Desconto Umidade:</span>
                      <strong className="text-rose-400 font-mono ml-1.5">-{romDescUmidadeKg.toLocaleString('pt-BR')} kg</strong>
                    </div>
                    <div>
                      <span className="text-[#66736A]">Desconto Impureza:</span>
                      <strong className="text-rose-400 font-mono ml-1.5">-{romDescImpurezaKg.toLocaleString('pt-BR')} kg</strong>
                    </div>
                    <div>
                      <span className="text-[#66736A]">Peso Líquido Pago:</span>
                      <strong className="text-emerald-400 font-mono text-sm ml-1.5">
                        {romPesoLiquidoFinal.toLocaleString('pt-BR')} kg
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. MANUTENÇÃO & OFICINA FORM */}
              {activeTab === 'MANUTENCAO' && (
                <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EAF4E7] pb-3">
                    <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-blue-400" />
                      Abertura de Ordem de Serviço & Oficina
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Máquina</label>
                      <select
                        value={manutMaquinaId}
                        onChange={(e) => setManutMaquinaId(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        {MAQUINAS_INICIAIS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Tipo de Manutenção</label>
                      <select
                        value={manutTipo}
                        onChange={(e) => setManutTipo(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        <option value="Preventiva 250h / 500h">Preventiva Programada (Filtros & Lubrificação)</option>
                        <option value="Corretiva de Campo">Corretiva Emergencial (Parada Mecânica)</option>
                        <option value="Borracharia / Pneus">Borracharia / Reparo de Rodado</option>
                        <option value="Elétrica & Telemetria">Elétrica & Sensores CAN Bus</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Criticidade</label>
                      <select
                        value={manutCriticidade}
                        onChange={(e) => setManutCriticidade(e.target.value as any)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        <option value="BAIXA">Baixa (Programar para fim do turno)</option>
                        <option value="MEDIA">Média (Atenção operacional)</option>
                        <option value="URGENTE">Urgente (Máquina parada em campo)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Horímetro Atual (h)</label>
                      <input
                        type="number"
                        value={manutHorimetro}
                        onChange={(e) => setManutHorimetro(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Mecânico Responsável</label>
                      <input
                        type="text"
                        value={manutMecanico}
                        onChange={(e) => setManutMecanico(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="text-[#66736A] font-medium block mb-1">Descrição do Serviço / Diagnóstico</label>
                      <input
                        type="text"
                        value={manutDescricao}
                        onChange={(e) => setManutDescricao(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 6. FINANCEIRO & LCDPR FORM */}
              {activeTab === 'FINANCEIRO' && (
                <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EAF4E7] pb-3">
                    <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-purple-400" />
                      Lançamento Financeiro & Fiscal LCDPR Oficial
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Tipo de Operação</label>
                      <select
                        value={finTipo}
                        onChange={(e) => setFinTipo(e.target.value as any)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        <option value="DESPESA_CUSTEIO">Despesa de Custeio (Insumos, Diesel, Peças)</option>
                        <option value="RECEITA">Receita de Comercialização (Grãos, Pecuária)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Número do Documento / NF-e</label>
                      <input
                        type="text"
                        value={finDocumento}
                        onChange={(e) => setFinDocumento(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Valor Total (R$)</label>
                      <input
                        type="number"
                        step="100.00"
                        value={finValor}
                        onChange={(e) => setFinValor(Number(e.target.value))}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-purple-400 font-mono font-bold text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[#66736A] font-medium block mb-1">Histórico Descritivo (LCDPR)</label>
                      <input
                        type="text"
                        value={finHistorico}
                        onChange={(e) => setFinHistorico(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[#66736A] font-medium block mb-1">Conta Bancária Rural</label>
                      <select
                        value={finConta}
                        onChange={(e) => setFinConta(e.target.value)}
                        className="w-full bg-white border border-[#EAF4E7] rounded-xl px-3 py-2 text-[#26332A] font-medium"
                      >
                        <option value="Banco do Brasil S.A.">Banco do Brasil S.A. (Ag: 1284-5 C/C: 98412-0)</option>
                        <option value="Sicredi União MT">Sicredi União MT (Ag: 0120-1 C/C: 54129-8)</option>
                      </select>
                    </div>
                  </div>

                  {/* Rateio Automático Condôminos */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-[#EAF4E7] text-xs space-y-1.5">
                    <span className="text-[#66736A] font-medium block mb-1">Rateio Societário Automático (Registro Q100 LCDPR):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {CONDOMINOS_FAZENDA.map((c) => (
                        <div key={c.cpf} className="p-2 rounded bg-[#F7F9F5] border-[#EAF4E7] flex justify-between">
                          <span className="text-[#66736A]">{c.nome.split(' ')[0]} ({c.percentual}%):</span>
                          <span className="text-purple-400 font-mono font-bold">
                            R$ {(finValor * (c.percentual / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-4 sm:p-5 border-t border-[#EAF4E7] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F7F9F5]">
          <div className="flex items-center gap-2 text-xs text-[#66736A]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Atalho rápido: pressione <kbd className="px-1.5 py-0.5 rounded bg-[#EAF4E7] text-[#1D4B38] font-mono text-[10px]">N</kbd> no teclado para lançar</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#8FBF88] bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => handleSubmitLaunch(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-emerald-600/50 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Salvar & Lançar Outro
            </button>
            <button
              type="button"
              onClick={() => handleSubmitLaunch(false)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Salvar Lançamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
