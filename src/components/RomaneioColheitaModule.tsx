import React, { useState } from 'react';
import {
  Truck,
  Scale,
  Droplets,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Plus,
  ArrowRight,
  TrendingUp,
  MapPin,
  Play,
  RotateCcw,
  Sparkles,
  FileCheck2,
  AlertTriangle,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';
import { ROMANEIOS_COLHEITA_INICIAIS, RomaneioColheitaData, TALHOES_INICIAIS } from '../data/mockAgroData';

export const RomaneioColheitaModule: React.FC = () => {
  const [romaneios, setRomaneios] = useState<RomaneioColheitaData[]>(ROMANEIOS_COLHEITA_INICIAIS);
  const [modalNovoOpen, setModalNovoOpen] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'romaneios' | 'balanca'>('romaneios');
  const [romaneioParaImprimir, setRomaneioParaImprimir] = useState<RomaneioColheitaData | null>(null);

  // Form states para pesagem do caminhão
  const [talhaoOrigemId, setTalhaoOrigemId] = useState('talhao-04');
  const [placa, setPlaca] = useState('BRA-9X21 (Bitrem 9 Eixos)');
  const [motorista, setMotorista] = useState('Edson Arantes');
  const [pesoBruto, setPesoBruto] = useState<number>(56800);
  const [tara, setTara] = useState<number>(18900);
  const [umidade, setUmidade] = useState<number>(14.5);
  const [impureza, setImpureza] = useState<number>(1.1);
  const [loadingEmissao, setLoadingEmissao] = useState(false);

  // Estados do Simulador de Balança Rodoviária
  const [caminhaoNaPlataforma, setCaminhaoNaPlataforma] = useState(true);
  const [pesoDigitalAoVivo, setPesoDigitalAoVivo] = useState<number>(56820);
  const [balancaEstabilizada, setBalancaEstabilizada] = useState<boolean>(true);
  const [leitorUmidadeMotomco, setLeitorUmidadeMotomco] = useState<number>(14.2);
  const [leitorImpurezaPeneira, setLeitorImpurezaPeneira] = useState<number>(0.9);

  // Cálculos automáticos de desconto de armazém (Padrão Oficial CONAB)
  const pesoLiquidoInicial = pesoBruto - tara;
  const descontoUmidadeKg =
    umidade > 14.0 ? Math.round(pesoLiquidoInicial * ((umidade - 14.0) / 100) * 1.25) : 0;
  const descontoImpurezaKg =
    impureza > 1.0 ? Math.round(pesoLiquidoInicial * ((impureza - 1.0) / 100)) : 0;
  const pesoLiquidoFinal = pesoLiquidoInicial - descontoUmidadeKg - descontoImpurezaKg;
  const sacas60kgCalculadas = Number((pesoLiquidoFinal / 60).toFixed(1));

  // Tocar som de bipe de estabilização da balança
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // Ignora erro se navegador bloquear áudio
    }
  };

  // Simular passagem de novo caminhão na ponte de pesagem
  const simularEntradaCaminhao = () => {
    setBalancaEstabilizada(false);
    const novoBruto = Math.floor(52000 + Math.random() * 8000);
    const novaUmid = parseFloat((13.5 + Math.random() * 2.2).toFixed(1));
    const novaImp = parseFloat((0.8 + Math.random() * 1.1).toFixed(1));

    setPesoDigitalAoVivo(novoBruto);
    setLeitorUmidadeMotomco(novaUmid);
    setLeitorImpurezaPeneira(novaImp);

    setTimeout(() => {
      setBalancaEstabilizada(true);
      playBeep();
      setPesoBruto(novoBruto);
      setUmidade(novaUmid);
      setImpureza(novaImp);
    }, 500);
  };

  const handleEmitirRomaneio = async () => {
    setLoadingEmissao(true);
    try {
      const resp = await fetch('/api/v1/balanca/romaneio/emitir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placaCaminhao: placa,
          motoristaNome: motorista,
          talhaoOrigemId,
          pesoBrutoKg: pesoBruto,
          taraCaminhaoKg: tara,
          umidadePercentual: umidade,
          impurezaPercentual: impureza,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.romaneio) {
          setRomaneios([data.romaneio, ...romaneios]);
          setRomaneioParaImprimir(data.romaneio);
        }
      } else {
        const novo: RomaneioColheitaData = {
          id: `rom-0${romaneios.length + 1}`,
          numeroRomaneio: `ROM-2026-0019${romaneios.length + 1}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          talhaoOrigemId,
          placaCaminhao: placa,
          motoristaNome: motorista,
          pesoBrutoKg: pesoBruto,
          taraCaminhaoKg: tara,
          pesoLiquidoKg: pesoLiquidoInicial,
          umidadePercentual: umidade,
          descontoUmidadeKg,
          impurezaPercentual: impureza,
          descontoImpurezaKg,
          pesoLiquidoFinalKg: pesoLiquidoFinal,
          sacas60kgFinal: sacas60kgCalculadas,
          armazemDestino: 'Terminal Ferroviário Rumo / Cargill Sinop',
          status: 'EM_TRANSITO',
        };
        setRomaneios([novo, ...romaneios]);
        setRomaneioParaImprimir(novo);
      }
    } catch {
      const novo: RomaneioColheitaData = {
        id: `rom-0${romaneios.length + 1}`,
        numeroRomaneio: `ROM-2026-0019${romaneios.length + 1}`,
        dataHora: new Date().toLocaleString('pt-BR'),
        talhaoOrigemId,
        placaCaminhao: placa,
        motoristaNome: motorista,
        pesoBrutoKg: pesoBruto,
        taraCaminhaoKg: tara,
        pesoLiquidoKg: pesoLiquidoInicial,
        umidadePercentual: umidade,
        descontoUmidadeKg,
        impurezaPercentual: impureza,
        descontoImpurezaKg,
        pesoLiquidoFinalKg: pesoLiquidoFinal,
        sacas60kgFinal: sacas60kgCalculadas,
        armazemDestino: 'Terminal Ferroviário Rumo / Cargill Sinop',
        status: 'EM_TRANSITO',
      };
      setRomaneios([novo, ...romaneios]);
      setRomaneioParaImprimir(novo);
    } finally {
      setLoadingEmissao(false);
      setModalNovoOpen(false);
    }
  };

  const totalSacasRomaneadas = romaneios.reduce((acc, curr) => acc + curr.sacas60kgFinal, 0);
  const totalCargas = romaneios.length;

  return (
    <div className="space-y-6">
      {/* Top Banner de Romaneios e Balança */}
      <div className="bg-white border border-[#EAF4E7] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-800 rounded text-xs font-bold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" /> Balança Rodoviária & Rastreabilidade de Grãos
            </span>
            <span className="text-xs text-[#66736A]">Escoamento da Safra • Fazenda Santa Helena</span>
          </div>
          <h2 className="text-xl font-bold text-[#1D4B38] flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" /> Romaneios de Carga, Pesagem e Descontos Técnicos CONAB
          </h2>
          <p className="text-xs text-[#66736A] mt-1">
            Cálculo automático de descontos por umidade (base 14%) e impureza (base 1%) para acompanhar a NFP-e de transporte.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setAbaAtiva('balanca')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              abaAtiva === 'balanca'
                ? 'bg-blue-600 text-[#1D4B38] border-blue-500 shadow-lg shadow-blue-950/40'
                : 'bg-[#F7F9F5] hover:bg-slate-700 text-[#26332A] border-[#8FBF88]'
            }`}
          >
            <Scale className="w-4 h-4 text-blue-400" /> Balança Digital Toledo
          </button>
          <button
            onClick={() => setModalNovoOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-[#1D4B38] rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Pesar Caminhão na Balança
          </button>
        </div>
      </div>

      {/* Cards de Resumo da Colheita do Dia */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EAF4E7] p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-[#66736A] mb-1">
            <span>Cargas Romaneadas Hoje</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-[#1D4B38]">
            {totalCargas} <span className="text-xs font-normal text-[#66736A]">caminhões</span>
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 block font-medium">Balança Rodoviária 80t Ativa</span>
        </div>

        <div className="bg-white border border-[#EAF4E7] p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-[#66736A] mb-1">
            <span>Volume Líquido Limpo e Seco</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {totalSacasRomaneadas.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} <span className="text-xs font-normal text-[#66736A]">sc</span>
          </p>
          <span className="text-[11px] text-[#66736A] mt-1 block">{(totalSacasRomaneadas * 60 / 1000).toFixed(1)} toneladas líquidas</span>
        </div>

        <div className="bg-white border border-[#EAF4E7] p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-[#66736A] mb-1">
            <span>Média de Umidade Recebida</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-blue-400 font-mono">
            14.3%
          </p>
          <span className="text-[11px] text-[#66736A] mt-1 block">Dentro da margem de segurança</span>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex items-center gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setAbaAtiva('romaneios')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            abaAtiva === 'romaneios'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-[#66736A] hover:text-[#1D4B38] hover:bg-[#F7F9F5]/40'
          }`}
        >
          <Truck className="w-4 h-4" />
          Romaneios Emitidos ({romaneios.length})
        </button>

        <button
          onClick={() => setAbaAtiva('balanca')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            abaAtiva === 'balanca'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              : 'text-[#66736A] hover:text-[#1D4B38] hover:bg-[#F7F9F5]/40'
          }`}
        >
          <Scale className="w-4 h-4" />
          Cockpit da Balança Rodoviária Toledo 80t
        </button>
      </div>

      {/* Aba Cockpit da Balança Rodoviária */}
      {abaAtiva === 'balanca' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Display Digital da Balança */}
            <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#EAF4E7] pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1D4B38]">Indicador Digital Toledo Prix 8200 (80 Toneladas)</h3>
                    <p className="text-xs text-[#66736A]">Ponte de Pesagem 30m • Células de Carga Digitais em Inox</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                  balancaEstabilizada
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${balancaEstabilizada ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  {balancaEstabilizada ? 'PESO ESTABILIZADO' : 'PESANDO EIXOS...'}
                </span>
              </div>

              {/* Display de Peso Digital Fluorescente */}
              <div className="bg-[#F7F9F5] rounded-2xl p-6 border border-[#EAF4E7] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner">
                <div>
                  <span className="text-xs font-mono uppercase text-[#66736A] tracking-wider">Peso Bruto Registrado</span>
                  <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-emerald-400 mt-1 flex items-baseline gap-2">
                    {pesoDigitalAoVivo.toLocaleString('pt-BR')} <span className="text-2xl text-slate-500 font-normal">kg</span>
                  </div>
                  <div className="text-xs text-[#66736A] mt-1">
                    Tara Padrão do Bitrem: <b className="text-[#26332A] font-mono">{tara.toLocaleString('pt-BR')} kg</b> • Peso Líquido Inicial: <b className="text-amber-400 font-mono">{(pesoDigitalAoVivo - tara).toLocaleString('pt-BR')} kg</b>
                  </div>
                </div>

                {/* Qualidade do Grão */}
                <div className="bg-slate-900 p-4 rounded-xl border border-[#EAF4E7] min-w-[240px] space-y-2 text-xs">
                  <span className="text-[10px] text-[#66736A] uppercase tracking-wider block font-semibold">Análise de Amostra CONAB</span>
                  <div className="flex justify-between items-center">
                    <span className="text-[#66736A]">Umidade (Motomco 919):</span>
                    <b className={leitorUmidadeMotomco > 14 ? 'text-amber-400' : 'text-emerald-400'}>{leitorUmidadeMotomco}%</b>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#66736A]">Impureza (Peneira):</span>
                    <b className={leitorImpurezaPeneira > 1 ? 'text-amber-400' : 'text-emerald-400'}>{leitorImpurezaPeneira}%</b>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-[#EAF4E7]">
                    <span className="text-[#66736A]">Desconto Calculado:</span>
                    <b className="text-rose-400 font-mono">
                      -{Math.round((pesoDigitalAoVivo - tara) * (Math.max(0, leitorUmidadeMotomco - 14) / 100 * 1.25 + Math.max(0, leitorImpurezaPeneira - 1) / 100))} kg
                    </b>
                  </div>
                </div>
              </div>

              {/* Ação do Balancista */}
              <div className="mt-6 p-4 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="text-xs text-[#66736A]">Veículo na Balança:</span>
                    <p className="text-sm font-bold text-[#1D4B38]">Scania R540 6x4 • Bitrem Graneleiro 9 Eixos</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={simularEntradaCaminhao}
                    className="px-4 py-2.5 bg-[#F7F9F5] hover:bg-slate-700 text-[#26332A] font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-[#8FBF88]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Simular Próximo Caminhão
                  </button>
                  <button
                    onClick={() => {
                      setPesoBruto(pesoDigitalAoVivo);
                      setUmidade(leitorUmidadeMotomco);
                      setImpureza(leitorImpurezaPeneira);
                      setModalNovoOpen(true);
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-[#1D4B38] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
                  >
                    <FileCheck2 className="w-4 h-4" /> Emitir Romaneio Desta Pesagem
                  </button>
                </div>
              </div>
            </div>

            {/* Painel de Regras CONAB */}
            <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 space-y-4 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#66736A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tabela Oficial CONAB (Soja Padrão)
              </h4>

              <div className="space-y-3">
                <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]">
                  <span className="text-[#66736A] block text-[11px]">Tolerância de Umidade</span>
                  <b className="text-[#1D4B38] text-sm">Até 14.0%</b>
                  <p className="text-[10px] text-slate-500 mt-0.5">Acima de 14%, desconto de 1.25% para cada 1% excedente (secagem).</p>
                </div>

                <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]">
                  <span className="text-[#66736A] block text-[11px]">Tolerância de Impureza</span>
                  <b className="text-[#1D4B38] text-sm">Até 1.0%</b>
                  <p className="text-[10px] text-slate-500 mt-0.5">Desconto direto de 1:1 sobre o peso líquido para impurezas de colheita.</p>
                </div>

                <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]">
                  <span className="text-[#66736A] block text-[11px]">Grãos Ardidos e Avariados</span>
                  <b className="text-[#1D4B38] text-sm">Máximo 8.0%</b>
                  <p className="text-[10px] text-slate-500 mt-0.5">Desconto comercial tabelado ou recusa de recebimento no porto.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aba Tabela de Romaneios de Carga */}
      {abaAtiva === 'romaneios' && (
        <div className="bg-white border border-[#EAF4E7] rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-[#EAF4E7] flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[#1D4B38]">Romaneios Emitidos (Balança da Fazenda)</h3>
              <p className="text-xs text-[#66736A]">Rastreabilidade ponta a ponta desde o talhão até o armazém geral</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#26332A]">
              <thead className="bg-[#F7F9F5] text-[#66736A] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Romaneio / Data</th>
                  <th className="px-4 py-3">Veículo / Motorista</th>
                  <th className="px-4 py-3">Talhão Origem</th>
                  <th className="px-4 py-3 text-right">Peso Líquido Inicial</th>
                  <th className="px-4 py-3 text-center">Umidade / Impureza</th>
                  <th className="px-4 py-3 text-right text-emerald-400">Peso Final (Limpo/Seco)</th>
                  <th className="px-4 py-3 text-right text-amber-400 font-bold">Sacas (60kg)</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF4E7] font-sans">
                {romaneios.map((rom) => {
                  const talhao = TALHOES_INICIAIS.find((t) => t.id === rom.talhaoOrigemId);

                  return (
                    <tr key={rom.id} className="hover:bg-[#F7F9F5]">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-[#1D4B38] block">{rom.numeroRomaneio}</span>
                        <span className="text-[10px] text-[#66736A]">{rom.dataHora}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-[#26332A] block">{rom.placaCaminhao}</span>
                        <span className="text-[10px] text-[#66736A]">{rom.motoristaNome}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-emerald-400">{talhao?.codigo || 'TAL-04'}</span>
                        <span className="text-[10px] text-[#66736A] block">{talhao?.nome || 'Talhão 04'}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[#26332A]">
                        {rom.pesoLiquidoKg.toLocaleString('pt-BR')} kg
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        <span className={rom.umidadePercentual > 14 ? 'text-amber-400 font-bold' : 'text-[#26332A]'}>
                          {rom.umidadePercentual}% U
                        </span>
                        <span className="text-slate-500 mx-1">|</span>
                        <span className={rom.impurezaPercentual > 1 ? 'text-amber-400' : 'text-[#26332A]'}>
                          {rom.impurezaPercentual}% Imp
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                        {rom.pesoLiquidoFinalKg.toLocaleString('pt-BR')} kg
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-amber-400">
                        {rom.sacas60kgFinal.toFixed(1)} sc
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            rom.status === 'DESCARREGADO_ARMAZEM'
                              ? 'bg-emerald-950 text-emerald-400'
                              : 'bg-blue-950 text-blue-400'
                          }`}
                        >
                          {rom.status === 'DESCARREGADO_ARMAZEM' ? 'Descarregado' : 'Em Trânsito'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setRomaneioParaImprimir(rom)}
                          className="px-2.5 py-1 bg-[#F7F9F5] hover:bg-slate-700 text-[#26332A] rounded text-[10px] font-bold border border-[#8FBF88] flex items-center gap-1 mx-auto"
                        >
                          <Printer className="w-3 h-3 text-[#66736A]" /> Imprimir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Nova Pesagem */}
      {modalNovoOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-[#8FBF88] p-6 rounded-2xl max-w-lg w-full shadow-2xl text-[#26332A] space-y-4">
            <h3 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" /> Nova Pesagem na Balança Rodoviária
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#66736A] block mb-1">Placa do Caminhão</label>
                  <input
                    type="text"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    className="w-full bg-[#F7F9F5] border border-[#8FBF88] rounded-lg p-2 text-[#1D4B38] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#66736A] block mb-1">Motorista</label>
                  <input
                    type="text"
                    value={motorista}
                    onChange={(e) => setMotorista(e.target.value)}
                    className="w-full bg-[#F7F9F5] border border-[#8FBF88] rounded-lg p-2 text-[#1D4B38]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#66736A] block mb-1">Talhão de Origem (Colheita)</label>
                <select
                  value={talhaoOrigemId}
                  onChange={(e) => setTalhaoOrigemId(e.target.value)}
                  className="w-full bg-[#F7F9F5] border border-[#8FBF88] rounded-lg p-2 text-[#1D4B38]"
                >
                  {TALHOES_INICIAIS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.codigo} - {t.nome} ({t.cultura})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#66736A] block mb-1">Peso Bruto (kg)</label>
                  <input
                    type="number"
                    value={pesoBruto}
                    onChange={(e) => setPesoBruto(Number(e.target.value))}
                    className="w-full bg-[#F7F9F5] border border-[#8FBF88] rounded-lg p-2 text-[#1D4B38] font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#66736A] block mb-1">Tara do Caminhão (kg)</label>
                  <input
                    type="number"
                    value={tara}
                    onChange={(e) => setTara(Number(e.target.value))}
                    className="w-full bg-[#F7F9F5] border border-[#8FBF88] rounded-lg p-2 text-[#1D4B38] font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#66736A] block mb-1">Umidade (% sensor Motomco)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={umidade}
                    onChange={(e) => setUmidade(Number(e.target.value))}
                    className="w-full bg-[#F7F9F5] border border-[#8FBF88] rounded-lg p-2 text-[#1D4B38] font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#66736A] block mb-1">Impureza (% peneira)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={impureza}
                    onChange={(e) => setImpureza(Number(e.target.value))}
                    className="w-full bg-[#F7F9F5] border border-[#8FBF88] rounded-lg p-2 text-[#1D4B38] font-bold"
                  />
                </div>
              </div>

              {/* Prévia dos Cálculos de Desconto */}
              <div className="bg-[#F7F9F5] p-3 rounded-xl border border-[#EAF4E7] space-y-1 text-[#26332A]">
                <div className="flex justify-between">
                  <span>Peso Líquido Inicial:</span>
                  <span className="font-mono">{pesoLiquidoInicial.toLocaleString('pt-BR')} kg</span>
                </div>
                <div className="flex justify-between text-amber-400 text-[11px]">
                  <span>Desconto de Umidade + Impureza:</span>
                  <span className="font-mono">-{descontoUmidadeKg + descontoImpurezaKg} kg</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 border-t border-[#EAF4E7] pt-1">
                  <span>Peso Líquido Final:</span>
                  <span className="font-mono">{pesoLiquidoFinal.toLocaleString('pt-BR')} kg ({sacas60kgCalculadas} sc)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EAF4E7]">
              <button
                onClick={() => setModalNovoOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs bg-[#F7F9F5] hover:bg-slate-700 text-[#26332A] font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleEmitirRomaneio}
                disabled={loadingEmissao}
                className="px-4 py-2 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-500 text-[#1D4B38] font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                {loadingEmissao ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Scale className="w-3.5 h-3.5" />}
                Emitir Ticket & Romaneio Oficial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Impressão A4/A5 do Ticket Oficial de Balança */}
      {romaneioParaImprimir && (
        <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-xl w-full p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">Fazenda Santa Helena do Araguaia</span>
                <h2 className="text-xl font-black text-slate-950 tracking-tight">TICKET DE PESAGEM & ROMANEIO</h2>
                <p className="text-xs font-mono font-bold text-blue-800 mt-0.5">PADRÃO CONAB • CLASSIFICAÇÃO DE GRÃOS</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-900 block">Nº {romaneioParaImprimir.numeroRomaneio}</span>
                <span className="text-[10px] text-slate-500">{romaneioParaImprimir.dataHora}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-300 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Veículo / Placa</span>
                  <p className="font-bold text-slate-900">{romaneioParaImprimir.placaCaminhao}</p>
                  <span className="text-[10px] text-slate-600">Condutor: {romaneioParaImprimir.motoristaNome}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Origem & Cultura</span>
                  <p className="font-semibold text-slate-900">Talhão 04 (380 ha)</p>
                  <span className="text-[10px] text-slate-600">Soja em Grãos Comercial</span>
                </div>
              </div>

              {/* Tabela de Pesagem Bruto / Tara / Líquido */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2">Pesagem</th>
                      <th className="p-2 text-right">Peso (kg)</th>
                      <th className="p-2 text-center">Classificação</th>
                      <th className="p-2 text-right">Desconto (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 font-medium">Peso Bruto</td>
                      <td className="p-2 text-right font-mono font-bold">{romaneioParaImprimir.pesoBrutoKg.toLocaleString('pt-BR')} kg</td>
                      <td className="p-2 text-center">-</td>
                      <td className="p-2 text-right">-</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Tara Veículo</td>
                      <td className="p-2 text-right font-mono">-{romaneioParaImprimir.taraCaminhaoKg.toLocaleString('pt-BR')} kg</td>
                      <td className="p-2 text-center">-</td>
                      <td className="p-2 text-right">-</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2">Peso Líquido</td>
                      <td className="p-2 text-right font-mono">{(romaneioParaImprimir.pesoBrutoKg - romaneioParaImprimir.taraCaminhaoKg).toLocaleString('pt-BR')} kg</td>
                      <td className="p-2 text-center">-</td>
                      <td className="p-2 text-right">-</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-slate-600">Umidade</td>
                      <td className="p-2 text-right font-mono">{romaneioParaImprimir.umidadePercentual}%</td>
                      <td className="p-2 text-center">Tolerância 14%</td>
                      <td className="p-2 text-right font-mono text-rose-700">-{romaneioParaImprimir.descontoUmidadeKg} kg</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-slate-600">Impureza</td>
                      <td className="p-2 text-right font-mono">{romaneioParaImprimir.impurezaPercentual}%</td>
                      <td className="p-2 text-center">Tolerância 1%</td>
                      <td className="p-2 text-right font-mono text-rose-700">-{romaneioParaImprimir.descontoImpurezaKg} kg</td>
                    </tr>
                    <tr className="bg-emerald-50 text-emerald-950 font-black text-sm">
                      <td className="p-2.5">PESO LÍQUIDO FINAL (SECO/LIMPO)</td>
                      <td className="p-2.5 text-right font-mono" colSpan={2}>
                        {romaneioParaImprimir.pesoLiquidoFinalKg.toLocaleString('pt-BR')} kg
                      </td>
                      <td className="p-2.5 text-right font-mono text-amber-800">
                        {romaneioParaImprimir.sacas60kgFinal.toFixed(1)} SC
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600 block uppercase">Destino da Carga</span>
                <p className="font-medium text-slate-900">{romaneioParaImprimir.armazemDestino}</p>
              </div>

              <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="border-b border-slate-400 pb-1 mb-1 font-mono text-[10px] text-slate-700">
                    Marcos Vinicius Ribeiro (Balancista)
                  </div>
                  <span className="text-[9px] text-slate-500 uppercase block">Operador da Balança</span>
                </div>
                <div>
                  <div className="border-b border-slate-400 pb-1 mb-1 font-mono text-[10px] text-slate-700">
                    {romaneioParaImprimir.motoristaNome}
                  </div>
                  <span className="text-[9px] text-slate-500 uppercase block">Motorista Transportador</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 mt-6 print:hidden">
              <button
                onClick={() => setRomaneioParaImprimir(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-[#1D4B38] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" /> Imprimir Ticket Oficial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
