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

export const BovinoculturaSisbovRfidModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'animais' | 'protocolos' | 'sisbov' | 'simulador'>('animais');

  // Parâmetros do Simulador
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
  ]);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Radio className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Rastreabilidade Bovina SISBOV & Brinco Eletrônico RFID
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Módulo 132 • ISO 11784/11785 & Cota Hilton União Europeia
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Controle individual de cada animal desde a desmama, permanência em Estabelecimento Rural Aprovado (ERB ≥ 90 dias) e habilitação sanitária para frigoríficos exportadores.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total de Arrobas no Lote</span>
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.arrobasTotaisLote.toLocaleString('pt-BR')} @
          </p>
          <span className="text-xs text-amber-400 mt-1 block">
            {totalAnimaisLote} bois rastreados individualmente
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Prêmio Cota Hilton</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.premioTotalHiltonReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            +R$ {premioHiltonPorBoiReais.toFixed(2)} por cabeça habilitada
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Faturamento Previsto</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.faturamentoTotalReais / 1000000).toFixed(2)}M
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            Rota Europa & China 100% elegível
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">ROI do Brinco RFID</span>
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
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('animais')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'animais'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Animais no SISBOV
        </button>

        <button
          onClick={() => setActiveTab('protocolos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'protocolos'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
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
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <QrCode className="w-4 h-4" />
          RFID & Leitura na Balança
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'animais' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            Lotes Habilitados na Base Oficial do MAPA
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400">
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
                      <span className="text-[11px] font-mono text-slate-400">{a.chipRfidUhf}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{a.raca}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{a.lotePasto}</td>
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

      {activeTab === 'protocolos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Permanência no ERB</h4>
            </div>
            <p className="text-xs text-slate-400">
              O animal deve permanecer ininterruptamente por pelo menos 90 dias em Estabelecimento Rural Aprovado no SISBOV antes do abate para atender aos critérios da UE.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Regra MAPA:</span>
              <span className="text-sm font-bold text-amber-400 block">mínimo 90 dias de rastreamento no ERB</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Quarentena Pré-Embarque</h4>
            </div>
            <p className="text-xs text-slate-400">
              Os últimos 40 dias de engorda antes do abate devem ocorrer na mesma propriedade, com alimentação monitorada e zero uso de promotores de crescimento proibidos.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Período de Carência:</span>
              <span className="text-sm font-bold text-emerald-400 block">40 dias livres de trânsito externo</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Idade de Abate Jovem</h4>
            </div>
            <p className="text-xs text-slate-400">
              Animais de até 30 meses (dentes de leite ou no máximo 2 dentes permanentes) para garantia de maciez, coloração viva e marmoreio exigido na Cota Hilton.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Dentição Máxima:</span>
              <span className="text-sm font-bold text-yellow-400 block">Até 2 dentes permanentes</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sisbov' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            Pesagem Automática no Tronco com Antenas RFID UHF
          </h3>
          <p className="text-sm text-slate-400">
            A passagem do animal pelo brete aciona a leitura sem contato do brinco eletrônico a até 2 metros de distância, vinculando o peso da balança digital diretamente à base de dados sem digitação humana.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Frequência ISO</span>
              <p className="text-lg font-bold text-amber-400 mt-1">134.2 kHz FDX/HDX</p>
              <span className="text-[11px] text-slate-400">Compatível com leitores universais</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">GMD Automático</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">+1.45 kg/dia</p>
              <span className="text-[11px] text-slate-400">Curva individual de ganho diário</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Guia GTA Eletrônica</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">e-GTA Integrada</p>
              <span className="text-[11px] text-slate-400">Emissão expressa junto ao INDEA/Defesa</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            Simulador de Prêmios de Exportação & Retorno do RFID
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Bois no Lote</label>
              <input
                type="number"
                value={totalAnimaisLote}
                onChange={(e) => setTotalAnimaisLote(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Peso Médio (@)</label>
              <input
                type="number"
                step="0.5"
                value={pesoMedioArrobas}
                onChange={(e) => setPesoMedioArrobas(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Preço Base (R$/@)</label>
              <input
                type="number"
                step="1"
                value={precoBaseArrobaReais}
                onChange={(e) => setPrecoBaseArrobaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Prêmio Hilton / Boi (R$)</label>
              <input
                type="number"
                step="10"
                value={premioHiltonPorBoiReais}
                onChange={(e) => setPremioHiltonPorBoiReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Prêmio Total de Exportação:</span>
              <span className="text-base font-bold text-emerald-400">
                R$ {metricas.premioTotalHiltonReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Faturamento Bruto com Rastreabilidade:</span>
              <span className="text-xl font-bold text-amber-400">
                R$ {metricas.faturamentoTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
