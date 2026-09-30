import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

export interface ViagemFrete {
  id: string;
  numeroMdfe: string;
  placaCavalo: string;
  motoristaNome: string;
  transportadora: string;
  tipoVeiculo: 'RODOTREM_9_EIXOS' | 'BITREM_7_EIXOS' | 'VANDERLEIA_3_EIXOS';
  rotaDestino: string;
  distanciaKm: number;
  pesoCargaTon: number;
  tarifaTonKm: number;
  valorPedagio: number;
  custoTotalFrete: number;
  fretePorSaca: number;
  statusFila: 'PATIO_AGUARDANDO' | 'CARREGANDO' | 'PESAGEM_FINAL' | 'EXPEDIDO_EM_TRANSITO';
  chaveAcessoMdfe: string;
}

const VIAGENS_INICIAIS: ViagemFrete[] = [
  {
    id: 'frete-01',
    numeroMdfe: 'MDFE-5126-00412',
    placaCavalo: 'RAZ-8H19',
    motoristaNome: 'Sebastião Barreto',
    transportadora: 'TransGrãos Logística do Centro-Oeste',
    tipoVeiculo: 'RODOTREM_9_EIXOS',
    rotaDestino: 'Sorriso/MT ➔ Terminal Ferroviário Rondonópolis/MT',
    distanciaKm: 820,
    pesoCargaTon: 37.0,
    tarifaTonKm: 0.285,
    valorPedagio: 420.0,
    custoTotalFrete: 9066.90,
    fretePorSaca: 14.70,
    statusFila: 'EXPEDIDO_EM_TRANSITO',
    chaveAcessoMdfe: '51260918491029000188580010000041281001928410',
  },
  {
    id: 'frete-02',
    numeroMdfe: 'MDFE-5126-00413',
    placaCavalo: 'QWI-4A82',
    motoristaNome: 'Marcos Aurelio Pires',
    transportadora: 'Expresso Soja Brasil',
    tipoVeiculo: 'RODOTREM_9_EIXOS',
    rotaDestino: 'Sorriso/MT ➔ Porto de Miritituba/PA (BR-163 Arco Norte)',
    distanciaKm: 1050,
    pesoCargaTon: 37.5,
    tarifaTonKm: 0.290,
    valorPedagio: 580.0,
    custoTotalFrete: 12012.50,
    fretePorSaca: 19.22,
    statusFila: 'EXPEDIDO_EM_TRANSITO',
    chaveAcessoMdfe: '51260918491029000188580010000041291001928411',
  },
  {
    id: 'frete-03',
    numeroMdfe: 'MDFE-5126-00414',
    placaCavalo: 'JZZ-9012',
    motoristaNome: 'Darci Schmidt',
    transportadora: 'Transportes Schmidt Cargas',
    tipoVeiculo: 'BITREM_7_EIXOS',
    rotaDestino: 'Sorriso/MT ➔ Terminal Ferroviário Rondonópolis/MT',
    distanciaKm: 820,
    pesoCargaTon: 32.0,
    tarifaTonKm: 0.295,
    valorPedagio: 380.0,
    custoTotalFrete: 8118.80,
    fretePorSaca: 15.22,
    statusFila: 'PESAGEM_FINAL',
    chaveAcessoMdfe: '51260918491029000188580010000041301001928412',
  },
  {
    id: 'frete-04',
    numeroMdfe: 'MDFE-5126-00415',
    placaCavalo: 'NXX-3281',
    motoristaNome: 'Edilson Rodrigues',
    transportadora: 'Cooperativa de Transportes Vale do Teles Pires',
    tipoVeiculo: 'RODOTREM_9_EIXOS',
    rotaDestino: 'Sorriso/MT ➔ Terminal Ferroviário Rondonópolis/MT',
    distanciaKm: 820,
    pesoCargaTon: 37.0,
    tarifaTonKm: 0.285,
    valorPedagio: 420.0,
    custoTotalFrete: 9066.90,
    fretePorSaca: 14.70,
    statusFila: 'CARREGANDO',
    chaveAcessoMdfe: '51260918491029000188580010000041311001928413',
  },
  {
    id: 'frete-05',
    numeroMdfe: 'MDFE-5126-00416',
    placaCavalo: 'OOG-7721',
    motoristaNome: 'Ailton Souza',
    transportadora: 'TransGrãos Logística',
    tipoVeiculo: 'RODOTREM_9_EIXOS',
    rotaDestino: 'Sorriso/MT ➔ Porto de Miritituba/PA (BR-163 Arco Norte)',
    distanciaKm: 1050,
    pesoCargaTon: 37.0,
    tarifaTonKm: 0.290,
    valorPedagio: 580.0,
    custoTotalFrete: 11860.00,
    fretePorSaca: 19.23,
    statusFila: 'PATIO_AGUARDANDO',
    chaveAcessoMdfe: '51260918491029000188580010000041321001928414',
  },
];

export const LogisticaFretesModule: React.FC = () => {
  const [viagens, setViagens] = useState<ViagemFrete[]>(VIAGENS_INICIAIS);
  const [mostrarModalNovo, setMostrarModalNovo] = useState<boolean>(false);
  const [sucessoMsg, setSucessoMsg] = useState<string | null>(null);

  // Calculadora Interativa de Frete ANTT
  const [calcDistancia, setCalcDistancia] = useState<number>(820);
  const [calcPesoTon, setCalcPesoTon] = useState<number>(37.0);
  const [calcTarifaTonKm, setCalcTarifaTonKm] = useState<number>(0.285);
  const [calcPedagio, setCalcPedagio] = useState<number>(420.0);

  const calcFreteTotal = calcDistancia * calcPesoTon * calcTarifaTonKm + calcPedagio;
  const calcSacas = (calcPesoTon * 1000) / 60;
  const calcFreteSaca = calcFreteTotal / calcSacas;

  // Formulário Nova Carga / Caminhão
  const [formPlaca, setFormPlaca] = useState<string>('RAZ-9A44');
  const [formMotorista, setFormMotorista] = useState<string>('Cleber Mendonça');
  const [formTransportadora, setFormTransportadora] = useState<string>('TransGrãos Logística');
  const [formDestino, setFormDestino] = useState<string>('Sorriso/MT ➔ Terminal Ferroviário Rondonópolis/MT');
  const [formPeso, setFormPeso] = useState<number>(37.0);

  const totalCargasExpedidas = viagens.length;
  const totalVolumeTransportadoTon = viagens.reduce((acc, curr) => acc + curr.pesoCargaTon, 0);
  const totalGastoFretes = viagens.reduce((acc, curr) => acc + curr.custoTotalFrete, 0);
  const mediaFreteSaca =
    viagens.reduce((acc, curr) => acc + curr.fretePorSaca, 0) / viagens.length;

  const handleSalvarViagem = (e: React.FormEvent) => {
    e.preventDefault();
    const dist = formDestino.includes('Miritituba') ? 1050 : 820;
    const tarifa = formDestino.includes('Miritituba') ? 0.290 : 0.285;
    const ped = formDestino.includes('Miritituba') ? 580.0 : 420.0;
    const custoTot = dist * formPeso * tarifa + ped;
    const scs = (formPeso * 1000) / 60;
    const freteSc = custoTot / scs;

    const nova: ViagemFrete = {
      id: `frete-${Date.now()}`,
      numeroMdfe: `MDFE-5126-00${416 + viagens.length}`,
      placaCavalo: formPlaca,
      motoristaNome: formMotorista,
      transportadora: formTransportadora,
      tipoVeiculo: 'RODOTREM_9_EIXOS',
      rotaDestino: formDestino,
      distanciaKm: dist,
      pesoCargaTon: formPeso,
      tarifaTonKm: tarifa,
      valorPedagio: ped,
      custoTotalFrete: Number(custoTot.toFixed(2)),
      fretePorSaca: Number(freteSc.toFixed(2)),
      statusFila: 'CARREGANDO',
      chaveAcessoMdfe: `512609184910290001885800100000413${viagens.length}1001928415`,
    };

    setViagens([nova, ...viagens]);
    setMostrarModalNovo(false);
    setSucessoMsg(`Caminhão placa ${formPlaca} alocado no pátio para carregamento e emissão de MDF-e!`);
    setTimeout(() => setSucessoMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <Route className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">Logística de Fretes, MDF-e & Escoamento</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  Piso Mínimo ANTT
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  MDF-e SEFAZ
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                Gestão da fila de caminhões na fazenda, cálculo de frete por tonelada/saca e emissão de Manifesto Eletrônico.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMostrarModalNovo(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-900/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Registrar Entrada de Caminhão no Pátio
        </button>
      </div>

      {sucessoMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-700/50 rounded-xl text-emerald-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{sucessoMsg}</span>
          </div>
          <button onClick={() => setSucessoMsg(null)} className="text-xs text-emerald-400 hover:underline">
            Fechar
          </button>
        </div>
      )}

      {/* Cards de Métricas Logísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Cargas em Operação</span>
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{totalCargasExpedidas} caminhões</div>
          <p className="text-xs text-slate-500 mt-1">Bitrens e Rodotrens 9 eixos</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Volume Escoado</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 font-mono">
            {totalVolumeTransportadoTon.toFixed(1)} toneladas
          </div>
          <p className="text-xs text-slate-500 mt-1">~{((totalVolumeTransportadoTon * 1000) / 60).toFixed(0)} sacas 60kg</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Frete Médio por Saca</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">
            R$ {mediaFreteSaca.toFixed(2)} / sc
          </div>
          <p className="text-xs text-slate-500 mt-1">R$ {(totalGastoFretes / 1000).toFixed(1)}k desembolsados</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">MDF-e Autorizados SEFAZ</span>
            <FileCheck2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-200 font-mono">100% Válidos</div>
          <p className="text-xs text-emerald-400/80 mt-1">Com seguro RCTR-C e CIOT vinculado</p>
        </div>
      </div>

      {/* Grid: Fila de Caminhões no Pátio & Emissão MDF-e + Calculadora Piso ANTT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Viagens & Fila de Pátio (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                Fila de Carregamento & Viagens Expedidas (MDF-e)
              </h2>
              <p className="text-xs text-slate-400">Rastreabilidade da pesagem na balança até a emissão do manifesto fiscal</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-3.5 py-3">Placa & Motorista</th>
                  <th className="px-3.5 py-3">Rota & Distância</th>
                  <th className="px-3.5 py-3">Carga & Sacas</th>
                  <th className="px-3.5 py-3">Frete (Total / sc)</th>
                  <th className="px-3.5 py-3">Status do Pátio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {viagens.map((v) => {
                  let badge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1 w-fit">
                      <Navigation className="w-3 h-3 text-blue-400" /> Em Trânsito
                    </span>
                  );

                  if (v.statusFila === 'CARREGANDO') {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3 text-amber-400" /> Carregando Silo
                      </span>
                    );
                  } else if (v.statusFila === 'PESAGEM_FINAL') {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <Scale className="w-3 h-3 text-emerald-400" /> Pesagem Final
                      </span>
                    );
                  } else if (v.statusFila === 'PATIO_AGUARDANDO') {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3 text-slate-400" /> Fila do Pátio
                      </span>
                    );
                  }

                  return (
                    <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-3.5 py-3.5">
                        <div className="font-bold text-slate-200">{v.placaCavalo}</div>
                        <div className="text-[11px] text-slate-400">{v.motoristaNome}</div>
                        <div className="text-[10px] text-slate-500">{v.transportadora}</div>
                      </td>

                      <td className="px-3.5 py-3.5">
                        <div className="text-slate-200 font-medium text-[11px]">{v.rotaDestino}</div>
                        <div className="text-[10px] text-indigo-400 font-mono mt-0.5">{v.distanciaKm} km</div>
                      </td>

                      <td className="px-3.5 py-3.5">
                        <div className="font-mono font-bold text-slate-100">{v.pesoCargaTon} ton</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {((v.pesoCargaTon * 1000) / 60).toFixed(0)} sacas
                        </div>
                      </td>

                      <td className="px-3.5 py-3.5">
                        <div className="font-mono font-bold text-slate-200">
                          R$ {v.custoTotalFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[11px] font-bold text-emerald-400 font-mono">
                          R$ {v.fretePorSaca.toFixed(2)} / sc
                        </div>
                      </td>

                      <td className="px-3.5 py-3.5">{badge}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculadora Piso Mínimo ANTT (1 col) */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-slate-100">Calculadora de Frete ANTT</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Piso mínimo regulamentado para transporte rodoviário de granel sólido agrícola (Lei 13.703):
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Distância do Trecho (km):</label>
                <input
                  type="number"
                  value={calcDistancia}
                  onChange={(e) => setCalcDistancia(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Peso da Carga (toneladas):</label>
                <input
                  type="number"
                  step="0.5"
                  value={calcPesoTon}
                  onChange={(e) => setCalcPesoTon(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Tarifa ANTT (R$ / ton.km):</label>
                <input
                  type="number"
                  step="0.005"
                  value={calcTarifaTonKm}
                  onChange={(e) => setCalcTarifaTonKm(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Pedágio Total do Percurso (R$):</label>
                <input
                  type="number"
                  value={calcPedagio}
                  onChange={(e) => setCalcPedagio(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-950/30 border border-blue-800/40 rounded-xl text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span>Custo Total do Frete da Viagem:</span>
              <span className="font-mono font-bold text-slate-100">
                R$ {calcFreteTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-t border-blue-900/50 pt-2 flex justify-between items-center">
              <span className="font-bold text-slate-100">Custo do Frete por Saca:</span>
              <span className="font-mono font-extrabold text-sm text-emerald-300">
                R$ {calcFreteSaca.toFixed(2)} / saca
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Equivalente a {(calcFreteTotal / 132).toFixed(1)} sacas de soja para cobrir o transporte
            </span>
          </div>
        </div>
      </div>

      {/* Modal Novo Caminhão no Pátio */}
      {mostrarModalNovo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                Registrar Entrada de Caminhão no Pátio
              </h3>
              <button
                onClick={() => setMostrarModalNovo(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarViagem} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Placa do Cavalo Mecânico:</label>
                  <input
                    type="text"
                    required
                    value={formPlaca}
                    onChange={(e) => setFormPlaca(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Motorista Responsável:</label>
                  <input
                    type="text"
                    required
                    value={formMotorista}
                    onChange={(e) => setFormMotorista(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Transportadora / Operador Logístico:</label>
                <input
                  type="text"
                  value={formTransportadora}
                  onChange={(e) => setFormTransportadora(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Rota & Destino da Safra:</label>
                <select
                  value={formDestino}
                  onChange={(e) => setFormDestino(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
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

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Capacidade de Carga Líquida (toneladas):</label>
                <input
                  type="number"
                  step="0.5"
                  value={formPeso}
                  onChange={(e) => setFormPeso(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                Após o carregamento e pesagem na balança rodoviária, o MDF-e será emitido e transmitido diretamente à SEFAZ-MT.
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setMostrarModalNovo(false)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Autorizar Entrada no Pátio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticaFretesModule;
