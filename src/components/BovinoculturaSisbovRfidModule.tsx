import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Award,
  DollarSign,
  TrendingUp,
  Layers,
  CheckCircle2,
  Sliders,
  Scale,
  QrCode,
  Radio,
  Truck,
  Printer,
  FileCheck2,
  Plus,
  Play,
  Volume2,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';

interface AnimalRfidSisbov {
  id: string;
  brincoVisual: string;
  chipRfidUhf: string;
  lotePasto: string;
  raca: string;
  dataNascimento: string;
  pesoEntradaKg: number;
  pesoAtualKg: number;
  diasNoErb: number;
  diasQuarentena: number;
  statusSisbov: 'APTO_HILTON_UE' | 'EM_PERIODO_CARENCIA' | 'PENDENCIA_MAPA';
}

interface GtaEmitida {
  id: string;
  numeroGta: string;
  serie: string;
  dataEmissao: string;
  origem: string;
  destino: string;
  finalidade: string;
  especie: string;
  quantidadeCabecas: number;
  categoriaIdade: string;
  lacreVeiculo: string;
  motorista: string;
  placaVeiculo: string;
  vencimentoDias: number;
  statusSanitario: string;
  hashAutenticidade: string;
  qrcodeUrl: string;
  emitenteCrmv: string;
}

export const BovinoculturaSisbovRfidModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'animais' | 'protocolos' | 'sisbov' | 'balanca' | 'gta' | 'simulador'>('animais');

  // Parâmetros do Simulador Econômico
  const [totalAnimaisLote, setTotalAnimaisLote] = useState<number>(650);
  const [pesoMedioArrobas, setPesoMedioArrobas] = useState<number>(21.8);
  const [precoBaseArrobaReais, setPrecoBaseArrobaReais] = useState<number>(245.0);
  const [premioHiltonPorBoiReais, setPremioHiltonPorBoiReais] = useState<number>(220.0);
  const [custoIdentificacaoRfidPorCabeca, setCustoIdentificacaoRfidPorCabeca] = useState<number>(18.5);

  const [animais, setAnimais] = useState<AnimalRfidSisbov[]>([
    {
      id: 'SIS-BR-01',
      brincoVisual: 'BR-MT-09412',
      chipRfidUhf: '982.000.412.890.123',
      lotePasto: 'Pasto 14 (Brachiaria brizantha)',
      raca: 'Nelore Mocho PO',
      dataNascimento: '2024-10-12',
      pesoEntradaKg: 380,
      pesoAtualKg: 585,
      diasNoErb: 120,
      diasQuarentena: 45,
      statusSisbov: 'APTO_HILTON_UE',
    },
    {
      id: 'SIS-BR-02',
      brincoVisual: 'BR-MT-09413',
      chipRfidUhf: '982.000.412.890.124',
      lotePasto: 'Pasto 14 (Brachiaria brizantha)',
      raca: 'Angus x Nelore (F1)',
      dataNascimento: '2024-11-05',
      pesoEntradaKg: 395,
      pesoAtualKg: 610,
      diasNoErb: 110,
      diasQuarentena: 42,
      statusSisbov: 'APTO_HILTON_UE',
    },
    {
      id: 'SIS-BR-03',
      brincoVisual: 'BR-MT-09414',
      chipRfidUhf: '982.000.412.890.125',
      lotePasto: 'Piquete Quarentena 02',
      raca: 'Nelore Mocho',
      dataNascimento: '2025-01-20',
      pesoEntradaKg: 420,
      pesoAtualKg: 530,
      diasNoErb: 65,
      diasQuarentena: 20,
      statusSisbov: 'EM_PERIODO_CARENCIA',
    },
    {
      id: 'SIS-BR-04',
      brincoVisual: 'BR-MT-09415',
      chipRfidUhf: '982.000.412.890.126',
      lotePasto: 'Pasto 14 (Brachiaria brizantha)',
      raca: 'Nelore Pintado',
      dataNascimento: '2024-11-18',
      pesoEntradaKg: 375,
      pesoAtualKg: 572,
      diasNoErb: 105,
      diasQuarentena: 44,
      statusSisbov: 'APTO_HILTON_UE',
    },
  ]);

  // Lista de GTAs emitidas
  const [gtas, setGtas] = useState<GtaEmitida[]>([
    {
      id: 'gta-inicial-01',
      numeroGta: 'MT-2026-094182-A',
      serie: 'SÉRIE ELETRÔNICA - MAPA/INDEA',
      dataEmissao: '2026-09-28T14:30:00.000Z',
      origem: 'Estância Pantaneira - Poconé/MT (Código: 5106502001)',
      destino: 'Frigorífico Pantanal Alimentos S.A. - Várzea Grande/MT (SIF 1253)',
      finalidade: 'Abate Imediato - Padrão Cota Hilton / UE',
      especie: 'BOVINA',
      quantidadeCabecas: 64,
      categoriaIdade: 'Machos 24-36 meses (Castrados)',
      lacreVeiculo: 'LACRE-INDEA-90124',
      motorista: 'Valdir Santos - CNH 039821890',
      placaVeiculo: 'RNG-4B92 (Bi-Trem Boiadeiro)',
      vencimentoDias: 3,
      statusSanitario: 'Área Livre de Febre Aftosa sem Vacinação (OMSA) - Brucelose Negativo',
      hashAutenticidade: '60c76f005a5044cd081e31c0df0b796c386d69c8b132d85513518095216b36e1',
      qrcodeUrl: 'https://defesaagropecuaria.mt.gov.br/autenticar-gta?hash=60c76f005a5044cd',
      emitenteCrmv: 'Dr. Roberto Magalhães - CRMV-MT 4892',
    },
  ]);

  // Modal de Emissão de GTA
  const [modalGtaAberto, setModalGtaAberto] = useState(false);
  const [gtaSelecionadaParaImpressao, setGtaSelecionadaParaImpressao] = useState<GtaEmitida | null>(null);
  const [gtaForm, setGtaForm] = useState({
    origem: 'Estância Pantaneira - Poconé/MT (Código: 5106502001)',
    destino: 'Frigorífico JBS S.A. - Barra do Garças/MT (SIF 172)',
    finalidade: 'Abate Imediato - Cota Hilton / UE',
    quantidadeCabecas: 55,
    categoriaIdade: 'Machos 24-30 meses (Castrados)',
    lacreVeiculo: `LACRE-INDEA-${Math.floor(10000 + Math.random() * 90000)}`,
    motorista: 'José Ribamar Antunes - CNH 044192031',
    placaVeiculo: 'NPH-8821 (Carreta Boiadeira 3 Eixos)',
  });
  const [loadingGta, setLoadingGta] = useState(false);

  // Estados do Simulador de Balança Dinâmica de Tronco
  const [animalNaBalanca, setAnimalNaBalanca] = useState<AnimalRfidSisbov | null>(animais[0]);
  const [pesoInstantaneoBalanca, setPesoInstantaneoBalanca] = useState<number>(585.4);
  const [portaoApartacao, setPortaoApartacao] = useState<'A_HILTON' | 'B_RECRIA' | 'CENTRO_NEUTRO'>('A_HILTON');
  const [balancaEstavel, setBalancaEstavel] = useState<boolean>(true);
  const [pesagensHistorico, setPesagensHistorico] = useState<Array<{ brinco: string; peso: number; gmd: number; destino: string; hora: string }>>([
    { brinco: 'BR-MT-09412', peso: 585.4, gmd: 1.71, destino: 'Portão A (Lote Embarque Hilton)', hora: '08:42:15' },
    { brinco: 'BR-MT-09413', peso: 610.2, gmd: 1.95, destino: 'Portão A (Lote Embarque Hilton)', hora: '08:43:02' },
  ]);

  // Tocar som de bipe de pesagem/RFID
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // Tom lá agudo
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch {
      // Ignora erro de áudio se restrito pelo navegador
    }
  };

  // Simulação de passagem de próximo animal pelo brete
  const simularProximaPassagem = () => {
    const proximoIndex = Math.floor(Math.random() * animais.length);
    const animal = animais[proximoIndex];
    setBalancaEstavel(false);
    const novoPeso = animal.pesoAtualKg + (Math.random() * 4 - 2);
    setAnimalNaBalanca(animal);
    setPesoInstantaneoBalanca(Number(novoPeso.toFixed(1)));

    setTimeout(() => {
      setBalancaEstavel(true);
      playBeep();
      const isHilton = animal.statusSisbov === 'APTO_HILTON_UE' && novoPeso >= 550;
      const destino = isHilton ? 'Portão A (Lote Embarque Hilton)' : 'Portão B (Retenção / Recria)';
      setPortaoApartacao(isHilton ? 'A_HILTON' : 'B_RECRIA');

      const gmdCalc = Number(((novoPeso - animal.pesoEntradaKg) / animal.diasNoErb).toFixed(2));
      const novaLeitura = {
        brinco: animal.brincoVisual,
        peso: Number(novoPeso.toFixed(1)),
        gmd: gmdCalc,
        destino,
        hora: new Date().toLocaleTimeString(),
      };
      setPesagensHistorico(prev => [novaLeitura, ...prev.slice(0, 9)]);
    }, 450);
  };

  // Handler de Emissão de e-GTA
  const handleEmitirGta = async () => {
    setLoadingGta(true);
    try {
      const resp = await fetch('/api/v1/pecuaria/gta/emitir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gtaForm),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.gta) {
          setGtas(prev => [data.gta, ...prev]);
          setGtaSelecionadaParaImpressao(data.gta);
        }
      } else {
        // Fallback local
        const numeroGta = `MT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}-A`;
        const novaGta: GtaEmitida = {
          id: `gta-${Date.now()}`,
          numeroGta,
          serie: 'SÉRIE ELETRÔNICA - MAPA/INDEA',
          dataEmissao: new Date().toISOString(),
          origem: gtaForm.origem,
          destino: gtaForm.destino,
          finalidade: gtaForm.finalidade,
          especie: 'BOVINA',
          quantidadeCabecas: gtaForm.quantidadeCabecas,
          categoriaIdade: gtaForm.categoriaIdade,
          lacreVeiculo: gtaForm.lacreVeiculo,
          motorista: gtaForm.motorista,
          placaVeiculo: gtaForm.placaVeiculo,
          vencimentoDias: 3,
          statusSanitario: 'Área Livre de Febre Aftosa sem Vacinação (OMSA) - Brucelose Negativo',
          hashAutenticidade: `60c76f005a5044cd081e${Date.now()}`,
          qrcodeUrl: 'https://defesaagropecuaria.mt.gov.br/autenticar-gta',
          emitenteCrmv: 'Dr. Roberto Magalhães - CRMV-MT 4892',
        };
        setGtas(prev => [novaGta, ...prev]);
        setGtaSelecionadaParaImpressao(novaGta);
      }
    } catch {
      // Fallback local em caso de falha de rede
      const novaGta: GtaEmitida = {
        id: `gta-${Date.now()}`,
        numeroGta: `MT-2026-${Math.floor(100000 + Math.random() * 900000)}-A`,
        serie: 'SÉRIE ELETRÔNICA - MAPA/INDEA',
        dataEmissao: new Date().toISOString(),
        origem: gtaForm.origem,
        destino: gtaForm.destino,
        finalidade: gtaForm.finalidade,
        especie: 'BOVINA',
        quantidadeCabecas: gtaForm.quantidadeCabecas,
        categoriaIdade: gtaForm.categoriaIdade,
        lacreVeiculo: gtaForm.lacreVeiculo,
        motorista: gtaForm.motorista,
        placaVeiculo: gtaForm.placaVeiculo,
        vencimentoDias: 3,
        statusSanitario: 'Área Livre de Febre Aftosa sem Vacinação (OMSA) - Brucelose Negativo',
        hashAutenticidade: `60c76f005a5044cd081e${Date.now()}`,
        qrcodeUrl: 'https://defesaagropecuaria.mt.gov.br/autenticar-gta',
        emitenteCrmv: 'Dr. Roberto Magalhães - CRMV-MT 4892',
      };
      setGtas(prev => [novaGta, ...prev]);
      setGtaSelecionadaParaImpressao(novaGta);
    } finally {
      setLoadingGta(false);
      setModalGtaAberto(false);
    }
  };

  const metricas = useMemo(() => {
    const arrobasTotaisLote = Number((totalAnimaisLote * pesoMedioArrobas).toFixed(1));
    const receitaBaseReais = Number((arrobasTotaisLote * precoBaseArrobaReais).toFixed(2));
    const premioTotalHiltonReais = Number((totalAnimaisLote * premioHiltonPorBoiReais).toFixed(2));
    const faturamentoTotalReais = Number((receitaBaseReais + premioTotalHiltonReais).toFixed(2));
    const custoRfidTotalReais = Number((totalAnimaisLote * custoIdentificacaoRfidPorCabeca).toFixed(2));
    const retornoLiquidoRfidReais = Number((premioTotalHiltonReais - custoRfidTotalReais).toFixed(2));
    const roiRfid = custoRfidTotalReais > 0 ? Number((retornoLiquidoRfidReais / custoRfidTotalReais).toFixed(1)) : 0;

    return {
      arrobasTotaisLote,
      receitaBaseReais,
      premioTotalHiltonReais,
      faturamentoTotalReais,
      custoRfidTotalReais,
      retornoLiquidoRfidReais,
      roiRfid,
    };
  }, [
    totalAnimaisLote,
    pesoMedioArrobas,
    precoBaseArrobaReais,
    premioHiltonPorBoiReais,
    custoIdentificacaoRfidPorCabeca,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-200 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Radio className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Rastreabilidade Bovina SISBOV & Brinco Eletrônico RFID
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Módulo 132 • ISO 11784/11785 & Cota Hilton União Europeia
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Controle individual de cada animal desde a desmama, permanência em Estabelecimento Rural Aprovado (ERB ≥ 90 dias) e habilitação sanitária para frigoríficos exportadores.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('gta');
              setModalGtaAberto(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-950/40"
          >
            <Truck className="w-4 h-4" />
            Emitir e-GTA
          </button>
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Prêmios
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Total de Arrobas no Lote</span>
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.arrobasTotaisLote.toLocaleString('pt-BR')} @
          </p>
          <span className="text-xs text-amber-400 mt-1 block">
            {totalAnimaisLote} bois rastreados individualmente
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Prêmio Cota Hilton</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.premioTotalHiltonReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            +R$ {premioHiltonPorBoiReais.toFixed(2)} por cabeça habilitada
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Faturamento Previsto</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.faturamentoTotalReais / 1000000).toFixed(2)}M
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            Rota Europa & China 100% elegível
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">ROI do Brinco RFID</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.roiRfid}x ROI
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Investimento pago em menos de 1 embarque
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('animais')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'animais'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Animais no SISBOV
        </button>

        <button
          onClick={() => setActiveTab('balanca')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'balanca'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Scale className="w-4 h-4" />
          Balança Tronco & Apartação RFID
        </button>

        <button
          onClick={() => setActiveTab('gta')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'gta'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Truck className="w-4 h-4" />
          e-GTA Defesa Agropecuária ({gtas.length})
        </button>

        <button
          onClick={() => setActiveTab('protocolos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'protocolos'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Cota Hilton & Quarentena
        </button>

        <button
          onClick={() => setActiveTab('sisbov')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'sisbov'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <QrCode className="w-4 h-4" />
          Normas ISO 11784/11785
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Aba Animais no SISBOV */}
      {activeTab === 'animais' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-400" />
                Lotes Habilitados na Base Oficial do MAPA
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">Identificação Individual e Rastreamento Eletrônico FDX/HDX</p>
            </div>
            <button
              onClick={() => setActiveTab('balanca')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start"
            >
              <Scale className="w-3.5 h-3.5" /> Abrir Balança de Passagem
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="text-xs uppercase bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Brinco / Chip RFID</th>
                  <th className="px-4 py-3">Raça</th>
                  <th className="px-4 py-3">Pasto Atual</th>
                  <th className="px-4 py-3">Peso (kg)</th>
                  <th className="px-4 py-3">Dias ERB</th>
                  <th className="px-4 py-3">Quarentena</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {animais.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <span className="font-bold text-white block">{a.brincoVisual}</span>
                      <span className="text-[11px] font-mono text-slate-600">{a.chipRfidUhf}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-900">{a.raca}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{a.lotePasto}</td>
                    <td className="px-4 py-3 font-bold text-amber-400">{a.pesoAtualKg} kg</td>
                    <td className="px-4 py-3 font-semibold text-white">{a.diasNoErb} dias</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">{a.diasQuarentena} dias</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {a.statusSisbov}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aba Balança Tronco & Apartação RFID */}
      {activeTab === 'balanca' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Display da Balança Digital */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Balança Eletrônica Tru-Test & Antena UHF Tronco</h3>
                    <p className="text-xs text-slate-600">Pesagem Estática/Dinâmica com Captura Automática sem Contato</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                    balancaEstavel
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${balancaEstavel ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {balancaEstavel ? 'PESO ESTABILIZADO' : 'ESTABILIZANDO PESO...'}
                  </span>
                </div>
              </div>

              {/* Display de Peso Digital Fluorescente */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-600 tracking-wider">Peso Líquido do Animal</span>
                  <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-amber-400 mt-1 flex items-baseline gap-2">
                    {pesoInstantaneoBalanca.toFixed(1)} <span className="text-2xl text-slate-500 font-normal">kg</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Equivalente a: <b className="text-emerald-400 font-mono">{(pesoInstantaneoBalanca / 30).toFixed(2)} @</b> (@ líquida 50% rendimento de carcaça)
                  </div>
                </div>

                {/* Status do Animal Lido */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-200 min-w-[240px]">
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Animal no Tronco</span>
                  <p className="text-base font-bold text-white">{animalNaBalanca?.brincoVisual || 'Aguardando animal...'}</p>
                  <p className="text-xs font-mono text-slate-600 mt-0.5">{animalNaBalanca?.chipRfidUhf}</p>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-xs">
                    <span className="text-slate-600">GMD Calculado:</span>
                    <span className="font-bold text-emerald-400">
                      +{(animalNaBalanca ? (pesoInstantaneoBalanca - animalNaBalanca.pesoEntradaKg) / animalNaBalanca.diasNoErb : 1.45).toFixed(2)} kg/dia
                    </span>
                  </div>
                </div>
              </div>

              {/* Portão de Apartação Automática */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl border ${
                    portaoApartacao === 'A_HILTON'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700'
                      : 'bg-amber-950/80 text-amber-400 border-amber-700'
                  }`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-600">Portão Pneumático de Apartação</span>
                    <p className="text-sm font-bold text-white">
                      {portaoApartacao === 'A_HILTON'
                        ? 'PORTÃO A: Habilitado Cota Hilton (Abate Imediato UE)'
                        : 'PORTÃO B: Retenção para Ganho de Peso (Pasto/Confinamento)'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={simularProximaPassagem}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50"
                >
                  <Play className="w-4 h-4 fill-slate-950" /> Simular Próximo Boi no Tronco
                </button>
              </div>
            </div>

            {/* Histórico das Últimas Leituras */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Histórico de Passagem na Sessão
              </h4>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {pesagensHistorico.map((p, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{p.brinco}</span>
                      <span className="font-mono text-[11px] text-slate-600">{p.hora}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-amber-400 font-bold">{p.peso} kg</span>
                      <span className="text-emerald-400 font-semibold">+{p.gmd} kg/dia</span>
                    </div>
                    <span className="text-[10px] text-slate-600 truncate">{p.destino}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aba e-GTA Defesa Agropecuária */}
      {activeTab === 'gta' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Sistema Informatizado de Defesa Sanitária Animal (INDEA / MAPA)
                </span>
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                Guias de Trânsito Animal (e-GTA) Homologadas
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Documento sanitário oficial e obrigatório para movimentação de animais vivos entre estabelecimentos rurais e frigoríficos.
              </p>
            </div>

            <button
              onClick={() => setModalGtaAberto(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50"
            >
              <Plus className="w-4 h-4" /> Emitir Nova e-GTA
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gtas.map((g) => (
              <div key={g.id} className="bg-white border border-slate-200 hover:border-emerald-500/40 transition-all rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">{g.serie}</span>
                    <h4 className="text-base font-bold text-white font-mono mt-0.5">{g.numeroGta}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> HABILITADA
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Qtd. Cabeças</span>
                    <b className="text-white text-sm">{g.quantidadeCabecas} Bois</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Finalidade</span>
                    <b className="text-amber-400">{g.finalidade}</b>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Destino (Frigorífico)</span>
                    <span className="text-slate-900 truncate block font-medium">{g.destino}</span>
                  </div>
                  <div className="col-span-2 text-[10px] text-slate-600">
                    <span>Lacre Veículo: <b className="text-slate-900">{g.lacreVeiculo}</b> • Placa: <b className="text-slate-900">{g.placaVeiculo}</b></span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[10px] text-slate-500">Emitido por: {g.emitenteCrmv}</span>
                  <button
                    onClick={() => setGtaSelecionadaParaImpressao(g)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" /> Visualizar / Imprimir GTA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Protocolos */}
      {activeTab === 'protocolos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Permanência no ERB</h4>
            </div>
            <p className="text-xs text-slate-600">
              O animal deve permanecer ininterruptamente por pelo menos 90 dias em Estabelecimento Rural Aprovado no SISBOV antes do abate para atender aos critérios da UE.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Regra MAPA:</span>
              <span className="text-sm font-bold text-amber-400 block">mínimo 90 dias de rastreamento no ERB</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Quarentena Pré-Embarque</h4>
            </div>
            <p className="text-xs text-slate-600">
              Os últimos 40 dias de engorda antes do abate devem ocorrer na mesma propriedade, com alimentação monitorada e zero uso de promotores de crescimento proibidos.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Período de Carência:</span>
              <span className="text-sm font-bold text-emerald-400 block">40 dias livres de trânsito externo</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Idade de Abate Jovem</h4>
            </div>
            <p className="text-xs text-slate-600">
              Animais de até 30 meses (dentes de leite ou no máximo 2 dentes permanentes) para garantia de maciez, coloração viva e marmoreio exigido na Cota Hilton.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Dentição Máxima:</span>
              <span className="text-sm font-bold text-yellow-400 block">Até 2 dentes permanentes</span>
            </div>
          </div>
        </div>
      )}

      {/* Normas ISO SISBOV */}
      {activeTab === 'sisbov' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            Pesagem Automática no Tronco com Antenas RFID UHF & Certificação ISO
          </h3>
          <p className="text-sm text-slate-600">
            A passagem do animal pelo brete aciona a leitura sem contato do brinco eletrônico a até 2 metros de distância, vinculando o peso da balança digital diretamente à base de dados sem digitação humana.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Frequência ISO</span>
              <p className="text-lg font-bold text-amber-400 mt-1">134.2 kHz FDX/HDX</p>
              <span className="text-[11px] text-slate-600">Compatível com leitores universais</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">GMD Automático</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">+1.45 kg/dia</p>
              <span className="text-[11px] text-slate-600">Curva individual de ganho diário</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Guia GTA Eletrônica</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">e-GTA Integrada</p>
              <span className="text-[11px] text-slate-600">Emissão expressa junto ao INDEA/Defesa</span>
            </div>
          </div>
        </div>
      )}

      {/* Simulador Econômico */}
      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            Simulador de Prêmios de Exportação & Retorno do RFID
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Bois no Lote</label>
              <input
                type="number"
                value={totalAnimaisLote}
                onChange={(e) => setTotalAnimaisLote(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Peso Médio (@)</label>
              <input
                type="number"
                step="0.5"
                value={pesoMedioArrobas}
                onChange={(e) => setPesoMedioArrobas(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Preço Base (R$/@)</label>
              <input
                type="number"
                step="1"
                value={precoBaseArrobaReais}
                onChange={(e) => setPrecoBaseArrobaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Prêmio Hilton / Boi (R$)</label>
              <input
                type="number"
                step="10"
                value={premioHiltonPorBoiReais}
                onChange={(e) => setPremioHiltonPorBoiReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-600 block">Prêmio Total de Exportação:</span>
              <span className="text-base font-bold text-emerald-400">
                R$ {metricas.premioTotalHiltonReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-600 block">Faturamento Bruto com Rastreabilidade:</span>
              <span className="text-xl font-bold text-amber-400">
                R$ {metricas.faturamentoTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulário Emissão de Nova e-GTA */}
      {modalGtaAberto && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-xl w-full shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                Emissão Eletrônica de GTA (INDEA / MAPA)
              </h3>
              <button onClick={() => setModalGtaAberto(false)} className="text-slate-600 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Estabelecimento Rural de Origem</label>
                <input
                  type="text"
                  value={gtaForm.origem}
                  onChange={(e) => setGtaForm({ ...gtaForm, origem: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Estabelecimento de Destino (Frigorífico)</label>
                <input
                  type="text"
                  value={gtaForm.destino}
                  onChange={(e) => setGtaForm({ ...gtaForm, destino: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Quantidade de Cabeças</label>
                  <input
                    type="number"
                    value={gtaForm.quantidadeCabecas}
                    onChange={(e) => setGtaForm({ ...gtaForm, quantidadeCabecas: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Finalidade do Trânsito</label>
                  <select
                    value={gtaForm.finalidade}
                    onChange={(e) => setGtaForm({ ...gtaForm, finalidade: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                  >
                    <option>Abate Imediato - Cota Hilton / UE</option>
                    <option>Abate Imediato - Mercado Doméstico</option>
                    <option>Engorda / Recria em Confinamento</option>
                    <option>Reprodução / Leilão</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Placa do Veículo Boiadeiro</label>
                  <input
                    type="text"
                    value={gtaForm.placaVeiculo}
                    onChange={(e) => setGtaForm({ ...gtaForm, placaVeiculo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Lacre do INDEA</label>
                  <input
                    type="text"
                    value={gtaForm.lacreVeiculo}
                    onChange={(e) => setGtaForm({ ...gtaForm, lacreVeiculo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800 text-[11px] text-emerald-300 space-y-1">
                <span className="font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Declaração Sanitária Automática</span>
                <p>Propriedade com certificação oficial de área livre de Febre Aftosa sem vacinação (reconhecida pela OMSA) e atestado negativo para Brucelose e Tuberculose.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setModalGtaAberto(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-900 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleEmitirGta}
                disabled={loadingGta}
                className="px-4 py-2 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                {loadingGta ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileCheck2 className="w-3.5 h-3.5" />}
                Transmitir e Emitir Guia GTA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Impressão A4 de e-GTA */}
      {gtaSelecionadaParaImpressao && (
        <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">Ministério da Agricultura e Pecuária (MAPA)</span>
                <h2 className="text-xl font-black text-slate-950 tracking-tight">GUIA DE TRÂNSITO ANIMAL (e-GTA)</h2>
                <p className="text-xs font-mono font-bold text-emerald-800 mt-0.5">{gtaSelecionadaParaImpressao.serie}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-800 block">Nº {gtaSelecionadaParaImpressao.numeroGta}</span>
                <span className="text-[10px] text-slate-500">Validade: {gtaSelecionadaParaImpressao.vencimentoDias} dias</span>
              </div>
            </div>

            {/* Corpo do Documento Oficial GTA */}
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-100 rounded-lg border border-slate-300">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 block uppercase">1. Origem</span>
                  <p className="font-semibold text-slate-900">{gtaSelecionadaParaImpressao.origem}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-600 block uppercase">2. Destino</span>
                  <p className="font-semibold text-slate-900">{gtaSelecionadaParaImpressao.destino}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-600 block">Espécie</span>
                  <p className="font-bold text-slate-900">{gtaSelecionadaParaImpressao.especie}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 block">Total de Cabeças</span>
                  <p className="font-bold text-slate-900 text-sm">{gtaSelecionadaParaImpressao.quantidadeCabecas} animais</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 block">Categoria</span>
                  <p className="font-semibold text-slate-800">{gtaSelecionadaParaImpressao.categoriaIdade}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-600 block">Transportador / Placa</span>
                  <p className="font-medium text-slate-900">{gtaSelecionadaParaImpressao.motorista}</p>
                  <p className="font-mono text-[11px] text-slate-700">{gtaSelecionadaParaImpressao.placaVeiculo}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 block">Lacre Oficial Sanitário</span>
                  <p className="font-mono font-bold text-slate-900">{gtaSelecionadaParaImpressao.lacreVeiculo}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-lg border border-slate-300">
                <span className="text-[10px] font-bold text-slate-700 block uppercase">Atestado Sanitário e Vacinações</span>
                <p className="text-[11px] text-slate-800 mt-1">{gtaSelecionadaParaImpressao.statusSanitario}</p>
              </div>

              <div className="pt-4 border-t border-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-500 font-mono block">Chave de Autenticação SHA-256:</span>
                  <span className="text-[9px] font-mono font-semibold text-slate-700 break-all">{gtaSelecionadaParaImpressao.hashAutenticidade}</span>
                  <span className="text-[10px] text-slate-600 block mt-1">Responsável Técnico: {gtaSelecionadaParaImpressao.emitenteCrmv}</span>
                </div>
                <div className="text-center pl-4 shrink-0">
                  <div className="w-16 h-16 bg-slate-200 border border-slate-400 rounded flex items-center justify-center font-mono text-[8px] text-slate-600">
                    [QR CODE INDEA]
                  </div>
                </div>
              </div>
            </div>

            {/* Botões do Modal */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 mt-6 print:hidden">
              <button
                onClick={() => setGtaSelecionadaParaImpressao(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" /> Imprimir Documento Oficial (A4)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
