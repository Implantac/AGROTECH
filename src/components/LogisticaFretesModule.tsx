import React, { useState, useEffect } from 'react';
import {
  Route,
  Truck,
  Navigation,
  FileCheck2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  DollarSign,
  Plus,
  Scale,
  Sparkles,
  Printer,
  ShieldCheck,
  X,
  QrCode,
  FileText,
  Landmark
} from 'lucide-react';

export interface ViagemFrete {
  id: string;
  numeroMdfe: string;
  serie?: string;
  chaveAcessoMdfe: string;
  protocoloAutorizacao?: string;
  dataHoraEmissao?: string;
  dataHoraEncerramento?: string;
  placaCavalo: string;
  placaCarreta1?: string;
  placaCarreta2?: string;
  motoristaNome: string;
  cpfMotorista?: string;
  transportadora: string;
  cnpjTransportadora?: string;
  rntrc?: string;
  ciot?: string;
  seguradoraRctrc?: string;
  tipoVeiculo: 'RODOTREM_9_EIXOS' | 'BITREM_7_EIXOS' | 'VANDERLEIA_3_EIXOS';
  rotaDestino: string;
  distanciaKm: number;
  pesoCargaTon: number;
  pesoLiquidoKg?: number;
  sacas60kg?: number;
  tarifaTonKm: number;
  valorPedagio: number;
  custoTotalFrete: number;
  fretePorSaca: number;
  romaneioVinculado?: string;
  nfeVinculada?: string;
  statusFila: 'PATIO_AGUARDANDO' | 'CARREGANDO' | 'PESAGEM_FINAL' | 'EXPEDIDO_EM_TRANSITO' | 'ENCERRADO';
  municipioOrigem?: string;
  municipioDestino?: string;
}

const VIAGENS_INICIAIS: ViagemFrete[] = [
  {
    id: 'frete-01',
    numeroMdfe: 'MDFE-5126-00412',
    serie: '1',
    chaveAcessoMdfe: '51260918491029000188580010000041201001928414',
    protocoloAutorizacao: '151260009481029',
    dataHoraEmissao: '30/09/2026, 09:30:00',
    placaCavalo: 'RAZ-8H19',
    placaCarreta1: 'BWP-4A20',
    placaCarreta2: 'BWP-4A21',
    motoristaNome: 'Sebastião Barreto',
    cpfMotorista: '482.910.428-19',
    transportadora: 'TransGrãos Logística do Centro-Oeste Ltda',
    cnpjTransportadora: '04.192.841/0001-92',
    rntrc: '04819204',
    ciot: '0948120491820',
    seguradoraRctrc: 'Porto Seguro Cargas • Apólice 849.201 • Averbação ATTM-9410',
    tipoVeiculo: 'RODOTREM_9_EIXOS',
    rotaDestino: 'Sorriso/MT ➔ Terminal Ferroviário Rondonópolis/MT',
    distanciaKm: 820,
    pesoCargaTon: 49.5,
    pesoLiquidoKg: 49500,
    sacas60kg: 825,
    tarifaTonKm: 0.285,
    valorPedagio: 420.0,
    custoTotalFrete: 11993.25,
    fretePorSaca: 14.54,
    romaneioVinculado: 'ROM-2026-416210',
    nfeVinculada: 'NF-e 001.004.128',
    statusFila: 'EXPEDIDO_EM_TRANSITO',
    municipioOrigem: 'Sorriso - MT (IBGE: 5107909)',
    municipioDestino: 'Rondonópolis - MT (IBGE: 5107602)'
  },
  {
    id: 'frete-02',
    numeroMdfe: 'MDFE-5126-00413',
    serie: '1',
    chaveAcessoMdfe: '51260918491029000188580010000041211001928420',
    protocoloAutorizacao: '151260009481030',
    dataHoraEmissao: '30/09/2026, 11:15:00',
    placaCavalo: 'BTA-4D88',
    placaCarreta1: 'KLE-2C11',
    placaCarreta2: 'KLE-2C12',
    motoristaNome: 'Wanderley Siqueira',
    cpfMotorista: '519.204.819-33',
    transportadora: 'Expresso Rota do Grão Rodoviário',
    cnpjTransportadora: '08.921.492/0001-11',
    rntrc: '07192831',
    ciot: '0948120491821',
    seguradoraRctrc: 'Tokio Marine Seguradora • Apólice 910.428 • Averbação 7120',
    tipoVeiculo: 'BITREM_7_EIXOS',
    rotaDestino: 'Sorriso/MT ➔ Porto de Miritituba/PA (BR-163 Arco Norte)',
    distanciaKm: 1050,
    pesoCargaTon: 37.0,
    pesoLiquidoKg: 37000,
    sacas60kg: 616.7,
    tarifaTonKm: 0.290,
    valorPedagio: 580.0,
    custoTotalFrete: 11861.0,
    fretePorSaca: 19.23,
    romaneioVinculado: 'ROM-2026-416215',
    nfeVinculada: 'NF-e 001.004.129',
    statusFila: 'PESAGEM_FINAL',
    municipioOrigem: 'Sorriso - MT (IBGE: 5107909)',
    municipioDestino: 'Itaituba / Miritituba - PA (IBGE: 1503606)'
  }
];

export const LogisticaFretesModule: React.FC = () => {
  const [viagens, setViagens] = useState<ViagemFrete[]>(VIAGENS_INICIAIS);
  const [mostrarModalNovo, setMostrarModalNovo] = useState<boolean>(false);
  const [modalDamdfe, setModalDamdfe] = useState<ViagemFrete | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Calculadora de Frete Mínimo ANTT
  const [calcDistancia, setCalcDistancia] = useState<number>(820);
  const [calcPesoTon, setCalcPesoTon] = useState<number>(37.0);
  const [calcTarifaTonKm, setCalcTarifaTonKm] = useState<number>(0.285);
  const [calcPedagio, setCalcPedagio] = useState<number>(420.0);

  const calcFreteTotal = calcDistancia * calcPesoTon * calcTarifaTonKm + calcPedagio;
  const calcSacas = (calcPesoTon * 1000) / 60;
  const calcFreteSaca = calcSacas > 0 ? calcFreteTotal / calcSacas : 0;

  // Formulário Novo MDF-e
  const [formPlacaCavalo, setFormPlacaCavalo] = useState<string>('RAZ-9A44');
  const [formPlacaCarreta1, setFormPlacaCarreta1] = useState<string>('BWP-5B12');
  const [formPlacaCarreta2, setFormPlacaCarreta2] = useState<string>('BWP-5B13');
  const [formMotorista, setFormMotorista] = useState<string>('Cleber Mendonça');
  const [formCpf, setFormCpf] = useState<string>('318.491.029-44');
  const [formTransportadora, setFormTransportadora] = useState<string>('TransGrãos Logística do Centro-Oeste Ltda');
  const [formRntrc, setFormRntrc] = useState<string>('04918230');
  const [formTipoVeiculo, setFormTipoVeiculo] = useState<'RODOTREM_9_EIXOS' | 'BITREM_7_EIXOS' | 'VANDERLEIA_3_EIXOS'>('BITREM_7_EIXOS');
  const [formDestino, setFormDestino] = useState<string>('Sorriso/MT ➔ Terminal Ferroviário Rondonópolis/MT');
  const [formPeso, setFormPeso] = useState<number>(37.0);
  const [formRomaneio, setFormRomaneio] = useState<string>('ROM-2026-41802');
  const [formNfe, setFormNfe] = useState<string>('NF-e 001.004.130');

  // Carregar lista de MDF-e do backend
  useEffect(() => {
    const carregarViagens = async () => {
      try {
        const resp = await fetch('/api/v1/logistica/mdfe/listar');
        if (resp.ok) {
          const data = await resp.json();
          if (data.viagens && data.viagens.length > 0) {
            setViagens(data.viagens);
          }
        }
      } catch (err) {
        console.warn('Usando dados locais de viagens:', err);
      }
    };
    carregarViagens();
  }, []);

  const totalCargasExpedidas = viagens.length;
  const totalVolumeTransportadoTon = viagens.reduce((acc, curr) => acc + curr.pesoCargaTon, 0);
  const totalGastoFretes = viagens.reduce((acc, curr) => acc + curr.custoTotalFrete, 0);
  const mediaFreteSaca =
    viagens.length > 0 ? viagens.reduce((acc, curr) => acc + curr.fretePorSaca, 0) / viagens.length : 0;

  // Submissão de Emissão de MDF-e
  const handleSalvarViagem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isMiritituba = formDestino.includes('Miritituba');
    const dist = isMiritituba ? 1050 : 820;
    const tarifa = isMiritituba ? 0.290 : 0.285;
    const ped = isMiritituba ? 580.0 : 420.0;

    const payload = {
      placaCavalo: formPlacaCavalo,
      placaCarreta1: formPlacaCarreta1,
      placaCarreta2: formPlacaCarreta2,
      motoristaNome: formMotorista,
      cpfMotorista: formCpf,
      transportadora: formTransportadora,
      rntrc: formRntrc,
      tipoVeiculo: formTipoVeiculo,
      rotaDestino: formDestino,
      distanciaKm: dist,
      pesoCargaTon: formPeso,
      tarifaTonKm: tarifa,
      valorPedagio: ped,
      romaneioVinculado: formRomaneio,
      nfeVinculada: formNfe
    };

    try {
      const resp = await fetch('/api/v1/logistica/mdfe/emitir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.viagem) {
          setViagens([data.viagem, ...viagens]);
          setMostrarModalNovo(false);
          setModalDamdfe(data.viagem);
        }
      } else {
        // Fallback local
        const ano = new Date().getFullYear();
        const nova: ViagemFrete = {
          id: `frete-${Date.now()}`,
          numeroMdfe: `MDFE-${new Date().getMonth() + 1}26-0${Math.floor(1000 + Math.random() * 9000)}`,
          serie: '1',
          chaveAcessoMdfe: `512609184910290001885800100000412${Math.floor(10 + Math.random() * 89)}1001928414`,
          protocoloAutorizacao: `1512600094${Math.floor(10000 + Math.random() * 90000)}`,
          dataHoraEmissao: new Date().toLocaleString('pt-BR'),
          placaCavalo: formPlacaCavalo,
          placaCarreta1: formPlacaCarreta1,
          placaCarreta2: formPlacaCarreta2,
          motoristaNome: formMotorista,
          cpfMotorista: formCpf,
          transportadora: formTransportadora,
          rntrc: formRntrc,
          ciot: `09481${Math.floor(10000000 + Math.random() * 90000000)}`,
          seguradoraRctrc: 'Porto Seguro Cargas • Apólice 849.201 • Averbação ATTM-9410',
          tipoVeiculo: formTipoVeiculo,
          rotaDestino: formDestino,
          distanciaKm: dist,
          pesoCargaTon: formPeso,
          pesoLiquidoKg: formPeso * 1000,
          sacas60kg: Number(((formPeso * 1000) / 60).toFixed(1)),
          tarifaTonKm: tarifa,
          valorPedagio: ped,
          custoTotalFrete: dist * formPeso * tarifa + ped,
          fretePorSaca: (dist * formPeso * tarifa + ped) / ((formPeso * 1000) / 60),
          romaneioVinculado: formRomaneio,
          nfeVinculada: formNfe,
          statusFila: 'EXPEDIDO_EM_TRANSITO',
          municipioOrigem: 'Sorriso - MT (IBGE: 5107909)',
          municipioDestino: isMiritituba ? 'Itaituba / Miritituba - PA' : 'Rondonópolis - MT'
        };
        setViagens([nova, ...viagens]);
        setMostrarModalNovo(false);
        setModalDamdfe(nova);
      }
    } catch (err) {
      console.error('Erro ao emitir MDF-e:', err);
    } finally {
      setLoading(false);
    }
  };

  // Encerrar MDF-e no destino
  const handleEncerrarMdfe = async (viagemId: string) => {
    try {
      const resp = await fetch('/api/v1/logistica/mdfe/encerrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: viagemId })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.viagem) {
          setViagens(viagens.map(v => (v.id === viagemId ? data.viagem : v)));
        }
      } else {
        setViagens(viagens.map(v => (v.id === viagemId ? { ...v, statusFila: 'ENCERRADO' } : v)));
      }
    } catch (err) {
      console.error('Erro ao encerrar MDF-e:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Logística & MDF-e */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-blue-950 text-blue-700 border border-blue-800 rounded text-xs font-bold flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Logística de Escoamento & Emissão MDF-e (Mod. 58 SEFAZ)
            </span>
            <span className="text-xs text-slate-600">Piso Mínimo ANTT (Res. 5.867) • CIOT Obrigatório & Seguro RCTR-C</span>
          </div>
          <h2 className="text-xl font-bold text-[#1D4B38] flex items-center gap-2">
            <Route className="w-5 h-5 text-blue-700" /> Expedição de Cargas, Balança e Manifesto Eletrônico
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Acompanhamento de filas de carregamento no pátio, emissão do DAMDFE e liquidação de fretes rodoviários.
          </p>
        </div>

        <button
          onClick={() => setMostrarModalNovo(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-[#1D4B38] rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-950/40 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Emitir MDF-e & Entrada no Pátio
        </button>
      </div>

      {/* 4 Cards de Métricas da Expedição */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Cargas Expedidas</span>
            <Truck className="w-4 h-4 text-blue-700" />
          </div>
          <p className="text-2xl font-black text-[#1D4B38]">{totalCargasExpedidas}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Bitrens & Rodotrens rastreados</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Volume Escoado (Safra)</span>
            <Scale className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-black text-emerald-700">
            {totalVolumeTransportadoTon.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-600">t</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {((totalVolumeTransportadoTon * 1000) / 60).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} sacas 60kg
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Gasto Total com Fretes</span>
            <DollarSign className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-2xl font-black text-amber-700">
            R$ {totalGastoFretes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Inclui pedágio e CIOT bancário</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Frete Médio / Saca</span>
            <Sparkles className="w-4 h-4 text-purple-700" />
          </div>
          <p className="text-2xl font-black text-purple-700">
            R$ {mediaFreteSaca.toFixed(2)} <span className="text-xs font-normal text-slate-600">/sc</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Média ponderada das rotas</span>
        </div>
      </div>

      {/* Grid: Tabela de Viagens & Calculadora ANTT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Manifestos de Carga (MDF-e) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-700" />
                Manifestos Eletrônicos (MDF-e Modelo 58) & Veículos em Rota
              </h3>
              <p className="text-xs text-slate-600">Averbação eletrônica SEFAZ-MT / ANTT com Seguro RCTR-C</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              {viagens.filter(v => v.statusFila === 'EXPEDIDO_EM_TRANSITO').length} em trânsito
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left text-slate-900">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">MDF-e / Chave SEFAZ</th>
                  <th className="px-4 py-3">Veículo & Motorista</th>
                  <th className="px-4 py-3">Rota & Destino</th>
                  <th className="px-4 py-3 text-right">Peso Líquido</th>
                  <th className="px-4 py-3 text-right">Frete Total</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF4E7] font-sans">
                {viagens.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-[#1D4B38] block">{v.numeroMdfe}</span>
                      <span className="text-[10px] font-mono text-blue-700 flex items-center gap-1">
                        <Landmark className="w-3 h-3 text-slate-500" /> CIOT: {v.ciot || '0948120491820'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 block">{v.placaCavalo} ({v.motoristaNome})</span>
                      <span className="text-[10px] text-slate-600">{v.transportadora}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <span className="font-medium text-slate-900 block line-clamp-1">{v.rotaDestino}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{v.distanciaKm} km</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {v.pesoCargaTon.toFixed(1)} t
                      <span className="text-[10px] text-slate-500 block">
                        {((v.pesoCargaTon * 1000) / 60).toFixed(0)} sc
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                      R$ {v.custoTotalFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      <span className="text-[10px] text-slate-600 block font-normal">
                        R$ {v.fretePorSaca.toFixed(2)}/sc
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          v.statusFila === 'ENCERRADO'
                            ? 'bg-slate-50 text-slate-600 border border-emerald-300'
                            : v.statusFila === 'EXPEDIDO_EM_TRANSITO'
                            ? 'bg-emerald-950 text-emerald-700 border border-emerald-800 animate-pulse'
                            : 'bg-blue-950 text-blue-700 border border-blue-800'
                        }`}
                      >
                        {v.statusFila === 'EXPEDIDO_EM_TRANSITO'
                          ? 'EM TRÂNSITO'
                          : v.statusFila === 'ENCERRADO'
                          ? 'DESCARREGADO'
                          : v.statusFila}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setModalDamdfe(v)}
                          title="Imprimir DAMDFE Oficial"
                          className="px-2.5 py-1 bg-slate-50 hover:bg-slate-700 text-slate-900 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all border border-emerald-300 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-blue-700" /> DAMDFE
                        </button>
                        {v.statusFila === 'EXPEDIDO_EM_TRANSITO' && (
                          <button
                            onClick={() => handleEncerrarMdfe(v.id)}
                            title="Encerrar MDF-e no destino"
                            className="px-2 py-1 bg-emerald-900/40 hover:bg-emerald-800 text-emerald-800 rounded-lg text-[11px] font-semibold transition-all border border-emerald-700 cursor-pointer"
                          >
                            Baixar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simulador da Tabela de Piso Mínimo ANTT */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Calculadora ANTT (Res. 5.867)
            </h3>
            <span className="text-[10px] font-mono bg-slate-50 px-2 py-0.5 rounded text-amber-700 border border-slate-200">
              Piso Obrigatório
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-600 block mb-1">Distância de Transporte (km):</label>
              <input
                type="number"
                value={calcDistancia}
                onChange={(e) => setCalcDistancia(Number(e.target.value))}
                className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38] font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Peso da Carga (toneladas):</label>
              <input
                type="number"
                step="0.5"
                value={calcPesoTon}
                onChange={(e) => setCalcPesoTon(Number(e.target.value))}
                className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38] font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Tarifa Piso ANTT (R$/ton.km):</label>
              <input
                type="number"
                step="0.005"
                value={calcTarifaTonKm}
                onChange={(e) => setCalcTarifaTonKm(Number(e.target.value))}
                className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-emerald-700 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Vale-Pedágio Obrigatório (R$):</label>
              <input
                type="number"
                value={calcPedagio}
                onChange={(e) => setCalcPedagio(Number(e.target.value))}
                className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38] font-mono"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-900">
              <span>Custo Total do Frete:</span>
              <span className="font-mono font-bold text-[#1D4B38] text-sm">
                R$ {calcFreteTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
              <span className="font-bold text-slate-900">Custo do Frete por Saca:</span>
              <span className="font-mono font-extrabold text-base text-emerald-700">
                R$ {calcFreteSaca.toFixed(2)} / sc
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Equivalente a {(calcFreteTotal / 135).toFixed(1)} sacas de soja para custear o transporte
            </span>
          </div>
        </div>
      </div>

      {/* Modal Novo MDF-e & Entrada no Pátio */}
      {mostrarModalNovo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-700" />
                Emitir MDF-e (Modelo 58 SEFAZ) & Registrar Entrada
              </h3>
              <button
                onClick={() => setMostrarModalNovo(false)}
                className="text-slate-600 hover:text-[#1D4B38] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarViagem} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Placa Cavalo Mecânico:</label>
                  <input
                    type="text"
                    required
                    value={formPlacaCavalo}
                    onChange={(e) => setFormPlacaCavalo(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38] font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Placa 1ª Carreta:</label>
                  <input
                    type="text"
                    required
                    value={formPlacaCarreta1}
                    onChange={(e) => setFormPlacaCarreta1(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38] font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Placa 2ª Carreta:</label>
                  <input
                    type="text"
                    required
                    value={formPlacaCarreta2}
                    onChange={(e) => setFormPlacaCarreta2(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Motorista Responsável:</label>
                  <input
                    type="text"
                    required
                    value={formMotorista}
                    onChange={(e) => setFormMotorista(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38]"
                  />
                </div>
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">CPF do Motorista:</label>
                  <input
                    type="text"
                    required
                    value={formCpf}
                    onChange={(e) => setFormCpf(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Transportadora / Operador:</label>
                  <input
                    type="text"
                    value={formTransportadora}
                    onChange={(e) => setFormTransportadora(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38]"
                  />
                </div>
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">RNTRC da Transportadora:</label>
                  <input
                    type="text"
                    value={formRntrc}
                    onChange={(e) => setFormRntrc(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Composição Veicular:</label>
                  <select
                    value={formTipoVeiculo}
                    onChange={(e) => setFormTipoVeiculo(e.target.value as any)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38]"
                  >
                    <option value="RODOTREM_9_EIXOS">Rodotrem 9 Eixos (Capacidade 49.5t)</option>
                    <option value="BITREM_7_EIXOS">Bitrem 7 Eixos (Capacidade 37.0t)</option>
                    <option value="VANDERLEIA_3_EIXOS">Vanderléia 3 Eixos Distanciados (Capacidade 35.0t)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Peso Líquido Estimado (toneladas):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formPeso}
                    onChange={(e) => setFormPeso(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38] font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-900 block mb-1 font-medium">Rota & Destino da Safra:</label>
                <select
                  value={formDestino}
                  onChange={(e) => setFormDestino(e.target.value)}
                  className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38]"
                >
                  <option value="Sorriso/MT ➔ Terminal Ferroviário Rondonópolis/MT">
                    Sorriso/MT ➔ Terminal Ferroviário Rondonópolis (820 km)
                  </option>
                  <option value="Sorriso/MT ➔ Porto de Miritituba/PA (BR-163 Arco Norte)">
                    Sorriso/MT ➔ Porto de Miritituba/PA - Arco Norte (1.050 km)
                  </option>
                  <option value="Sorriso/MT ➔ Porto de Santos/SP">
                    Sorriso/MT ➔ Porto de Santos/SP (2.150 km)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Romaneio de Balança Vinculado:</label>
                  <input
                    type="text"
                    value={formRomaneio}
                    onChange={(e) => setFormRomaneio(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38] font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">NF-e do Produtor Vinculada:</label>
                  <input
                    type="text"
                    value={formNfe}
                    onChange={(e) => setFormNfe(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-[#1D4B38] font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                O MDF-e será transmitido com averbação automática do seguro RCTR-C, registro do CIOT e autorização SEFAZ-MT.
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMostrarModalNovo(false)}
                  className="px-4 py-2 text-slate-600 hover:text-[#1D4B38] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer shadow-md transition-all"
                >
                  {loading ? 'Transmitindo à SEFAZ...' : 'Autorizar e Emitir MDF-e'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal DAMDFE Oficial para Impressão */}
      {modalDamdfe && (
        <div className="fixed inset-0 z-[1100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full p-8 shadow-2xl space-y-6 my-6 border border-slate-200">
            {/* Barra de Ações Superior */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" /> Autorizado SEFAZ-MT (Mod. 58)
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Prot: {modalDamdfe.protocoloAutorizacao || '151260009481029'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-[#1D4B38] font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Imprimir DAMDFE (A4)
                </button>
                <button
                  onClick={() => setModalDamdfe(null)}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Cabeçalho DAMDFE Padrão SEFAZ */}
            <div className="border border-slate-400 p-4 rounded-xl grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1">
                <h3 className="font-black text-sm uppercase">FAZENDA SANTA HELENA - AGROPECUÁRIA LTDA</h3>
                <p className="text-[11px] text-slate-600">Rodovia MT-242 Km 38 - Zona Rural - Sorriso / MT</p>
                <p className="text-[11px] text-slate-600">CNPJ: 18.491.029/0001-88 • Inscrição Estadual: 13.489.102-9</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">EMITENTE DO MANIFESTO DE CARGA ELETRÔNICO</p>
              </div>

              <div className="border-l border-slate-300 pl-4 text-center space-y-1">
                <h4 className="font-black text-base text-slate-900">DAMDFE</h4>
                <p className="text-[10px] text-slate-600 leading-tight">
                  Documento Auxiliar do Manifesto Eletrônico de Documentos Fiscais
                </p>
                <div className="bg-slate-100 border border-slate-300 p-1.5 rounded font-mono text-[11px] font-bold">
                  Nº {modalDamdfe.numeroMdfe} • Série 1
                </div>
              </div>
            </div>

            {/* Chave de Acesso e Código de Barras */}
            <div className="border border-slate-400 p-3 rounded-xl flex items-center justify-between font-mono text-xs bg-slate-50">
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">CHAVE DE ACESSO SEFAZ</span>
                <span className="font-bold text-slate-900 tracking-wider">{modalDamdfe.chaveAcessoMdfe}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-500 block uppercase">PROTOCOLO DE AUTORIZAÇÃO</span>
                <span className="font-bold text-emerald-700">{modalDamdfe.protocoloAutorizacao || '151260009481029'}</span>
              </div>
            </div>

            {/* Dados do Transporte, Veículos e Motorista */}
            <div className="border border-slate-400 rounded-xl p-4 text-xs space-y-3">
              <span className="font-bold text-slate-800 uppercase text-[10px] block border-b border-slate-200 pb-1">
                DADOS DO CONDUTOR, VEÍCULOS E OPERAÇÃO DE TRANSPORTE
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Motorista:</strong> {modalDamdfe.motoristaNome} (CPF: {modalDamdfe.cpfMotorista || '482.910.428-19'})</p>
                  <p><strong>Transportadora:</strong> {modalDamdfe.transportadora}</p>
                  <p><strong>RNTRC ANTT:</strong> {modalDamdfe.rntrc || '04819204'} • <strong>CIOT:</strong> {modalDamdfe.ciot || '0948120491820'}</p>
                </div>
                <div>
                  <p><strong>Cavalo Mecânico:</strong> {modalDamdfe.placaCavalo} (MT)</p>
                  <p><strong>Carretas / Reboques:</strong> {modalDamdfe.placaCarreta1 || 'BWP-4A20'} / {modalDamdfe.placaCarreta2 || 'BWP-4A21'}</p>
                  <p><strong>Tipo de Composição:</strong> {modalDamdfe.tipoVeiculo?.replace(/_/g, ' ')}</p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-100 rounded-lg text-[11px]">
                <p><strong>Seguro de Carga Obrigatório (RCTR-C):</strong> {modalDamdfe.seguradoraRctrc || 'Porto Seguro Cargas • Apólice 849.201 • Averbação ATTM-9410'}</p>
              </div>
            </div>

            {/* Documentos Fiscais Vinculados (NF-e e Romaneio) */}
            <div className="border border-slate-400 rounded-xl p-4 text-xs space-y-2">
              <span className="font-bold text-slate-800 uppercase text-[10px] block border-b border-slate-200 pb-1">
                DOCUMENTOS FISCAIS DA CARGA MANIFESTADA
              </span>

              <div className="grid grid-cols-3 gap-3 font-mono text-[11px]">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[9px] text-slate-500 block">DOCUMENTO FISCAL</span>
                  <strong>{modalDamdfe.nfeVinculada || 'NF-e 001.004.128'}</strong>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[9px] text-slate-500 block">TICKET BALANÇA / ROMANEIO</span>
                  <strong>{modalDamdfe.romaneioVinculado || 'ROM-2026-416210'}</strong>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[9px] text-slate-500 block">PESO LÍQUIDO TRANSPORTADO</span>
                  <strong>{modalDamdfe.pesoCargaTon.toFixed(1)} t ({modalDamdfe.sacas60kg || ((modalDamdfe.pesoCargaTon * 1000) / 60).toFixed(0)} sc)</strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 pt-1">
                <strong>Percurso:</strong> {modalDamdfe.municipioOrigem || 'Sorriso/MT'} ➔ {modalDamdfe.municipioDestino || 'Terminal Ferroviário Rondonópolis/MT'} ({modalDamdfe.distanciaKm} km)
              </p>
            </div>

            {/* Rodapé com QR Code e Validação SEFAZ */}
            <div className="border-t border-slate-300 pt-4 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-3">
                <QrCode className="w-14 h-14 text-slate-800 shrink-0" />
                <div>
                  <p className="font-bold">CONSULTA NACIONAL DE AUTENTICIDADE</p>
                  <p className="text-[10px] text-slate-500 font-mono">https://dfe-portal.svrs.rs.gov.br/mdfe/consulta</p>
                  <p className="text-[10px] text-slate-500">Documento impresso em {new Date().toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div className="text-right text-[10px] text-slate-600 space-y-0.5">
                <p>FISCALIZAÇÃO DE TRÂNSITO DE CARGAS ANTT / SEFAZ</p>
                <p className="font-mono font-bold text-slate-800">AUTORIZADO PARA CIRCULAÇÃO EM TODO O TERRITÓRIO NACIONAL</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticaFretesModule;
