import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  Battery,
  Signal,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Plus,
  Compass,
  Wind,
  Thermometer,
  Droplets,
  Camera,
  Fuel,
  Activity,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  Database,
  Layers,
  ArrowLeft,
  Scale,
  Sparkles
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { TALHOES_INICIAIS, INSUMOS_INICIAIS, MAQUINAS_INICIAIS } from '../data/mockAgroData';

interface SyncQueueItem {
  id: string; // UUIDv7 simulado
  tipo: string;
  resumo: string;
  dataHora: string;
  status: 'PENDENTE' | 'SINCRONIZADO';
}

interface MobileCockpitSimulatorProps {
  profileId?: string;
}

export const MobileCockpitSimulator: React.FC<MobileCockpitSimulatorProps> = ({ profileId = 'AGRICULTURA_GRAOS' }) => {
  // Estado do celular
  const [isOnline, setIsOnline] = useState<boolean>(false); // Começa offline para demonstrar o offline-first!
  const [currentScreen, setCurrentScreen] = useState<
    'HOME' | 'APONTAMENTO_CALDA' | 'PRAGAS' | 'ABASTECIMENTO' | 'ZOOTECNIA' | 'COCHO' | 'HORTIFRUTI' | 'SYNC_STATUS'
  >('HOME');

  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([
    {
      id: '018ebb20-a841-7104-9844-019284102841',
      tipo: profileId === 'PECUARIA_CORTE_LEITE' ? 'LEITURA DE COCHO' : 'PULVERIZAÇÃO',
      resumo: profileId === 'PECUARIA_CORTE_LEITE' ? 'Confinamento Piquete C-04 - Escore 0 (Lambido +10% MS)' : 'Talhão 01 - Calda Inseticida + Adjuvante (420 ha)',
      dataHora: '25/09 08:30',
      status: 'PENDENTE',
    },
    {
      id: '018ebb25-f320-7412-a129-918273645120',
      tipo: profileId === 'PECUARIA_CORTE_LEITE' ? 'PESAGEM RFID' : 'PRAGAS',
      resumo: profileId === 'PECUARIA_CORTE_LEITE' ? 'Novilho RFID #076.984 - 542 kg (18.1 @)' : 'Talhão 02 - Percevejo Marrom (3.5 alvos/m - CRÍTICO)',
      dataHora: '25/09 09:15',
      status: 'PENDENTE',
    },
  ]);

  // Form de Apontamento de Calda
  const [selectedTalhaoId, setSelectedTalhaoId] = useState<string>('talhao-02');
  const [selectedMaquinaId, setSelectedMaquinaId] = useState<string>('maq-01');
  const [temperatura, setTemperatura] = useState<number>(27);
  const [ventoKmh, setVentoKmh] = useState<number>(8);
  const [umidadePct, setUmidadePct] = useState<number>(68);
  const [horimetroInicial, setHorimetroInicial] = useState<number>(1845.2);
  const [horimetroFinal, setHorimetroFinal] = useState<number>(1851.6);
  const [alertaVentoDeriva, setAlertaVentoDeriva] = useState<boolean>(false);

  // Monitoramento de Pragas Form
  const [alvoBiologico, setAlvoBiologico] = useState<string>('Percevejo Marrom (Euschistus heros)');
  const [intensidadeDano, setIntensidadeDano] = useState<'BAIXO' | 'MEDIO' | 'CRITICO'>('CRITICO');
  const [amostragemCount, setAmostragemCount] = useState<number>(4.2);

  // Abastecimento Form
  const [litrosAbastecidos, setLitrosAbastecidos] = useState<number>(280);

  // Estados Pecuária
  const [escoreCocho, setEscoreCocho] = useState<number>(0);
  const [loteCocho, setLoteCocho] = useState<string>('Confinamento Piquete C-04 (280 Garrotes)');
  const [brincoRfid, setBrincoRfid] = useState<string>('BR-076.984.120.441');
  const [pesoBovinoKg, setPesoBovinoKg] = useState<number>(542);

  // Estados Hortifrúti
  const [estufaHF, setEstufaHF] = useState<string>('Estufa 02 - Tomate Grape Gourmet');
  const [caixasHF, setCaixasHF] = useState<number>(45);
  const [grauBrixHF, setGrauBrixHF] = useState<number>(9.8);

  // Efeito do vento na pulverização
  const handleVentoChange = (val: number) => {
    setVentoKmh(val);
    if (val > 10) {
      setAlertaVentoDeriva(true);
    } else {
      setAlertaVentoDeriva(false);
    }
  };

  // Salvar registro offline com UUIDv7
  const handleSalvarOperacaoCalda = () => {
    const novoUuid = uuidv4();
    const talhao = TALHOES_INICIAIS.find((t) => t.id === selectedTalhaoId);
    const novoItem: SyncQueueItem = {
      id: novoUuid,
      tipo: 'PULVERIZAÇÃO (CALDA)',
      resumo: `${talhao?.codigo || 'Talhão'} - ${(horimetroFinal - horimetroInicial).toFixed(1)}h aplicadas`,
      dataHora: 'Hoje ' + new Date().toLocaleTimeString().slice(0, 5),
      status: 'PENDENTE',
    };

    setSyncQueue([novoItem, ...syncQueue]);
    alert(`✓ Registro salvo com sucesso no banco SQLite local (Drift)!
ID Local (UUID): ${novoUuid}
Status: Fila assíncrona aguardando conectividade.`);
    setCurrentScreen('HOME');
  };

  const handleSalvarPraga = () => {
    const novoUuid = uuidv4();
    const novoItem: SyncQueueItem = {
      id: novoUuid,
      tipo: 'MONITORAMENTO FITO',
      resumo: `${alvoBiologico.split(' ')[0]} - Dano: ${intensidadeDano}`,
      dataHora: 'Hoje ' + new Date().toLocaleTimeString().slice(0, 5),
      status: 'PENDENTE',
    };
    setSyncQueue([novoItem, ...syncQueue]);
    alert('✓ Praga georreferenciada gravada no banco offline!');
    setCurrentScreen('HOME');
  };

  const handleSalvarCocho = () => {
    const novoUuid = uuidv4();
    const ajusteTexto = escoreCocho === 0 ? '+10% MS (+1.1 kg/cab)' : escoreCocho === 1 ? '+5% MS' : escoreCocho === 2 ? 'Manter' : '-10% MS';
    const novoItem: SyncQueueItem = {
      id: novoUuid,
      tipo: 'LEITURA DE COCHO',
      resumo: `${loteCocho.split(' ')[0]} - Nota ${escoreCocho} (${ajusteTexto})`,
      dataHora: 'Hoje ' + new Date().toLocaleTimeString().slice(0, 5),
      status: 'PENDENTE',
    };
    setSyncQueue([novoItem, ...syncQueue]);
    alert('✓ Leitura de cocho registrada no SQLite local (Drift)!');
    setCurrentScreen('HOME');
  };

  const handleSalvarZootecnia = () => {
    const novoUuid = uuidv4();
    const arrobas = (pesoBovinoKg / 30).toFixed(1);
    const novoItem: SyncQueueItem = {
      id: novoUuid,
      tipo: 'PESAGEM RFID',
      resumo: `${brincoRfid} - ${pesoBovinoKg} kg (${arrobas} @) SISBOV OK`,
      dataHora: 'Hoje ' + new Date().toLocaleTimeString().slice(0, 5),
      status: 'PENDENTE',
    };
    setSyncQueue([novoItem, ...syncQueue]);
    alert('✓ Pesagem zootécnica com brinco RFID gravada localmente!');
    setCurrentScreen('HOME');
  };

  const handleSalvarHF = () => {
    const novoUuid = uuidv4();
    const novoItem: SyncQueueItem = {
      id: novoUuid,
      tipo: 'COLHEITA HF',
      resumo: `${estufaHF.split(' ')[0]} - ${caixasHF} cx (${grauBrixHF}°Bx Gourmet)`,
      dataHora: 'Hoje ' + new Date().toLocaleTimeString().slice(0, 5),
      status: 'PENDENTE',
    };
    setSyncQueue([novoItem, ...syncQueue]);
    alert('✓ Apontamento de Colheita HF e Brix registrado no banco offline!');
    setCurrentScreen('HOME');
  };

  const handleForcarSincronizacao = () => {
    if (!isOnline) {
      alert('⚠️ Sem conectividade. O app está em "Modo Campo". Ative a chave de conexão no topo para simular envio via 4G/Wi-Fi da sede.');
      return;
    }

    const pendentes = syncQueue.filter((i) => i.status === 'PENDENTE').length;
    if (pendentes === 0) {
      alert('Nenhum dado pendente de envio na fila.');
      return;
    }

    // Simula sincronização assíncrona com RabbitMQ / Go Gateway
    setTimeout(() => {
      setSyncQueue((prev) =>
        prev.map((item) => ({ ...item, status: 'SINCRONIZADO' }))
      );
      alert(`✓ Sincronização concluída com sucesso!
HTTP 202 Accepted retornado pelo Gateway Go.
${pendentes} registros transferidos para o PostgreSQL central.`);
    }, 600);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center p-4">
      {/* Mockup do Smartphone */}
      <div className="w-[380px] h-[760px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col justify-between shrink-0">
        {/* Notch e Câmera */}
        <div className="w-full flex justify-center absolute top-4 left-0 right-0 z-50">
          <div className="w-28 h-5 bg-black rounded-full flex items-center justify-end px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
          </div>
        </div>

        {/* Barra de Status do Celular */}
        <div className="w-full px-6 pt-3 pb-1 flex justify-between items-center text-[11px] text-slate-300 font-semibold z-40">
          <span>09:41</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            {isOnline ? (
              <span className="flex items-center text-emerald-400 gap-1 text-[10px]">
                <Wifi className="w-3.5 h-3.5" /> 4G Sede
              </span>
            ) : (
              <span className="flex items-center text-amber-400 gap-1 text-[10px]">
                <WifiOff className="w-3.5 h-3.5" /> Modo Campo
              </span>
            )}
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Display do App Mobile (Drift / Flutter UI) */}
        <div className="w-full h-[660px] bg-slate-900 rounded-[36px] overflow-y-auto overflow-x-hidden flex flex-col border border-slate-800 text-slate-100 p-4">
          {/* Header do App */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            {currentScreen !== 'HOME' ? (
              <button
                onClick={() => setCurrentScreen('HOME')}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 text-xs"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-sm shadow">
                  AG
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-none text-white">Super AgTech Campo</h4>
                  <span className="text-[10px] text-slate-400">
                    {profileId === 'PECUARIA_CORTE_LEITE'
                      ? 'Op: Carlos Vaqueiro (Pec-08)'
                      : profileId === 'HORTIFRUTI_FLORICULTURA'
                      ? 'Op: Mariana Técnica HF'
                      : 'Op: João Tratorista (Op-44)'}
                  </span>
                </div>
              </div>
            )}

            {/* Status Pill */}
            <div
              className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                isOnline ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
              {isOnline ? 'Online' : '100% Offline'}
            </div>
          </div>

          {/* SCREEN: HOME (M2) */}
          {currentScreen === 'HOME' && (
            <div className="flex flex-col space-y-3">
              {/* Card de GPS e Talhão / Piquete Próximo */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-800/80 p-3 rounded-xl border border-emerald-900/50">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Compass className="w-3.5 h-3.5 animate-spin" /> GPS Local Ativo
                  </span>
                  <span className="text-[10px] text-slate-400">Georreferenciado</span>
                </div>
                <p className="text-xs font-bold text-white">
                  {profileId === 'PECUARIA_CORTE_LEITE'
                    ? 'Piquete 04 • Confinamento Leste'
                    : profileId === 'HORTIFRUTI_FLORICULTURA'
                    ? 'Estufa 02 • Módulo Hidropônico'
                    : 'Talhão Atual: TAL-02 (Represa Leste)'}
                </p>
                <p className="text-[10px] text-slate-400">Precisão RTK: ± 2.5 cm no raio operacional</p>
              </div>

              {/* Grid com os 4 Botões da Tela Mobile adaptados ao perfil ativo */}
              {profileId === 'PECUARIA_CORTE_LEITE' ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setCurrentScreen('COCHO')}
                    className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-lg transition-all min-h-[96px]"
                  >
                    <Activity className="w-7 h-7 mb-1 text-amber-100" />
                    <span className="text-xs font-bold leading-tight">Leitura de Cocho</span>
                    <span className="text-[9px] text-amber-200 mt-0.5">Escores 0 a 4</span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('ZOOTECNIA')}
                    className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-lg transition-all min-h-[96px]"
                  >
                    <Scale className="w-7 h-7 mb-1 text-emerald-100" />
                    <span className="text-xs font-bold leading-tight">Pesagem & RFID</span>
                    <span className="text-[9px] text-emerald-200 mt-0.5">SISBOV e GMD</span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('ABASTECIMENTO')}
                    className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-lg transition-all min-h-[96px]"
                  >
                    <Fuel className="w-7 h-7 mb-1 text-blue-100" />
                    <span className="text-xs font-bold leading-tight">Abastecimento Frota</span>
                    <span className="text-[9px] text-blue-200 mt-0.5">Tratores & Comboio</span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('SYNC_STATUS')}
                    className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-white p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-lg transition-all min-h-[96px] border border-slate-700 relative"
                  >
                    <Database className="w-7 h-7 mb-1 text-cyan-400" />
                    <span className="text-xs font-bold leading-tight">Sincronizar Dados</span>
                    <span className="text-[9px] text-slate-300 mt-0.5">
                      {syncQueue.filter((i) => i.status === 'PENDENTE').length} pendentes
                    </span>
                    {syncQueue.filter((i) => i.status === 'PENDENTE').length > 0 && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
                    )}
                  </button>
                </div>
              ) : profileId === 'HORTIFRUTI_FLORICULTURA' ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setCurrentScreen('HORTIFRUTI')}
                    className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-lg transition-all min-h-[96px]"
                  >
                    <Sparkles className="w-7 h-7 mb-1 text-emerald-100" />
                    <span className="text-xs font-bold leading-tight">Colheita HF & Brix</span>
                    <span className="text-[9px] text-emerald-200 mt-0.5">Caixas e Refratômetro</span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('PRAGAS')}
                    className="bg-red-600 hover:bg-red-500 active:scale-95 text-white p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-lg transition-all min-h-[96px]"
                  >
                    <AlertTriangle className="w-7 h-7 mb-1 text-red-100" />
                    <span className="text-xs font-bold leading-tight">MIP em Estufas</span>
                    <span className="text-[9px] text-red-200 mt-0.5">Ácaros e Mosca-Branca</span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('ABASTECIMENTO')}
                    className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-lg transition-all min-h-[96px]"
                  >
                    <Fuel className="w-7 h-7 mb-1 text-amber-100" />
                    <span className="text-xs font-bold leading-tight">Abastecimento & Frota</span>
                    <span className="text-[9px] text-amber-200 mt-0.5">Microtratores e Vans</span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('SYNC_STATUS')}
                    className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-white p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-lg transition-all min-h-[96px] border border-slate-700 relative"
                  >
                    <Database className="w-7 h-7 mb-1 text-cyan-400" />
                    <span className="text-xs font-bold leading-tight">Sincronizar Dados</span>
                    <span className="text-[9px] text-slate-300 mt-0.5">
                      {syncQueue.filter((i) => i.status === 'PENDENTE').length} pendentes
                    </span>
                    {syncQueue.filter((i) => i.status === 'PENDENTE').length > 0 && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setCurrentScreen('APONTAMENTO_CALDA')}
                    className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-lg transition-all min-h-[96px]"
                  >
                    <Activity className="w-7 h-7 mb-1 text-emerald-100" />
                    <span className="text-xs font-bold leading-tight">Lançar Calda / Aplicação</span>
                    <span className="text-[9px] text-emerald-200 mt-0.5">Defensivos e Doses</span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('PRAGAS')}
                    className="bg-red-600 hover:bg-red-500 active:scale-95 text-white p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-lg transition-all min-h-[96px]"
                  >
                    <AlertTriangle className="w-7 h-7 mb-1 text-red-100" />
                    <span className="text-xs font-bold leading-tight">Monitorar Pragas (GPS)</span>
                    <span className="text-[9px] text-red-200 mt-0.5">Fotos e NDE</span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('ABASTECIMENTO')}
                    className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-lg transition-all min-h-[96px]"
                  >
                    <Fuel className="w-7 h-7 mb-1 text-amber-100" />
                    <span className="text-xs font-bold leading-tight">Abastecimento & Frota</span>
                    <span className="text-[9px] text-amber-200 mt-0.5">Horímetro e Litros</span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('SYNC_STATUS')}
                    className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-white p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-lg transition-all min-h-[96px] border border-slate-700 relative"
                  >
                    <Database className="w-7 h-7 mb-1 text-cyan-400" />
                    <span className="text-xs font-bold leading-tight">Sincronizar Dados</span>
                    <span className="text-[9px] text-slate-300 mt-0.5">
                      {syncQueue.filter((i) => i.status === 'PENDENTE').length} pendentes
                    </span>
                    {syncQueue.filter((i) => i.status === 'PENDENTE').length > 0 && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
                    )}
                  </button>
                </div>
              )}

              {/* Ordens de Serviço do Dia */}
              <div className="pt-2">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ordens de Serviço do Dia (OS)
                </h5>
                <div className="space-y-2">
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">
                        {profileId === 'PECUARIA_CORTE_LEITE'
                          ? 'OS #2041 - Distribuição de Ração Trato 1'
                          : profileId === 'HORTIFRUTI_FLORICULTURA'
                          ? 'OS #3018 - Colheita Seletiva Grape Matinal'
                          : 'OS #1084 - Pulverização Fungicida'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {profileId === 'PECUARIA_CORTE_LEITE'
                          ? 'Vagão Misturador Kuhn • 4 tratos'
                          : profileId === 'HORTIFRUTI_FLORICULTURA'
                          ? 'Estufa 02 • Bônus Gourmet Brix'
                          : 'Talhão 01 • Pulverizador JD 4030'}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] rounded font-bold">
                      Executando
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: LEITURA DE COCHO (PECUÁRIA) */}
          {currentScreen === 'COCHO' && (
            <div className="flex flex-col space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-400" /> Leitura Matinal de Cocho
              </h4>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Lote / Piquete</label>
                <select
                  value={loteCocho}
                  onChange={(e) => setLoteCocho(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs mt-1"
                >
                  <option>Confinamento Piquete C-04 (280 Garrotes)</option>
                  <option>Confinamento Piquete C-02 (250 Bois Nelore)</option>
                  <option>Lote 01 Lactação (80 Vacas Holandesas)</option>
                </select>
              </div>

              <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                <label className="text-[11px] text-slate-300 font-semibold">Escore de Sobras (0 a 4)</label>
                <div className="grid grid-cols-5 gap-1.5 my-2">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setEscoreCocho(n)}
                      className={`py-2 rounded-lg font-bold text-center text-xs transition-all ${
                        escoreCocho === n ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Nota {n}
                    </button>
                  ))}
                </div>
                <div className="p-2 bg-slate-900/90 rounded text-[11px] text-amber-300">
                  {escoreCocho === 0 && '⚠️ Nota 0: Cocho vazio com lambedura rápida. Aumentar +10% de Matéria Seca (+1.1 kg MS/cab/dia).'}
                  {escoreCocho === 1 && 'Nota 1: Fundo coberto (grãos esparsos). Aumentar +5% de Matéria Seca.'}
                  {escoreCocho === 2 && '✓ Nota 2: Escore Ideal (fita fina de 2 a 5% de sobra). Manter dieta estável.'}
                  {escoreCocho === 3 && 'Nota 3: Sobra considerável (5 a 10%). Reduzir -5% de Matéria Seca.'}
                  {escoreCocho === 4 && '⚠️ Nota 4: Sobra excessiva (>10%). Risco de deterioração. Reduzir -10% MS.'}
                </div>
              </div>

              <button
                onClick={handleSalvarCocho}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg mt-2 text-xs transition-transform active:scale-95"
              >
                Gravar Leitura de Cocho Offline
              </button>
            </div>
          )}

          {/* SCREEN: ZOOTECNIA & PESAGEM RFID */}
          {currentScreen === 'ZOOTECNIA' && (
            <div className="flex flex-col space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-400" /> Pesagem Individual SISBOV
              </h4>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Brinco Eletrônico RFID</label>
                <input
                  type="text"
                  value={brincoRfid}
                  onChange={(e) => setBrincoRfid(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Peso na Balança (kg)</label>
                <input
                  type="number"
                  value={pesoBovinoKg}
                  onChange={(e) => setPesoBovinoKg(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-emerald-400 font-black text-sm mt-1"
                />
              </div>

              <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Arrobas (@) Líquidas</span>
                  <span className="font-black text-white text-sm">{(pesoBovinoKg / 30).toFixed(2)} @</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Cota Hilton</span>
                  <span className="font-bold text-emerald-400 text-xs">✓ Habilitado (+R$ 8/@)</span>
                </div>
              </div>

              <button
                onClick={handleSalvarZootecnia}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg mt-2 text-xs transition-transform active:scale-95"
              >
                Registrar Pesagem Offline
              </button>
            </div>
          )}

          {/* SCREEN: HORTIFRUTI COLHEITA & BRIX */}
          {currentScreen === 'HORTIFRUTI' && (
            <div className="flex flex-col space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Colheita HF & Refratometria
              </h4>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Estufa / Setor</label>
                <select
                  value={estufaHF}
                  onChange={(e) => setEstufaHF(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs mt-1"
                >
                  <option>Estufa 02 - Tomate Grape Gourmet</option>
                  <option>Estufa 01 - Tomate Italiano Hidropônico</option>
                  <option>Estufa 03 - Morango Semi-Hidropônico</option>
                  <option>Estufa 04 - Alface Americana Hidropônica</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold">Caixas Colhidas</label>
                  <input
                    type="number"
                    value={caixasHF}
                    onChange={(e) => setCaixasHF(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-bold text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold">Teor Brix (°Bx)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={grauBrixHF}
                    onChange={(e) => setGrauBrixHF(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-amber-400 font-black text-xs mt-1"
                  />
                </div>
              </div>

              <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-[11px] text-emerald-300">
                {grauBrixHF >= 9.0 ? '✓ Classificação: Padrão Gourmet / Premium (+30% no preço Ceasa).' : 'Classificação: Padrão Comercial Convencional.'}
              </div>

              <button
                onClick={handleSalvarHF}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg mt-2 text-xs transition-transform active:scale-95"
              >
                Gravar Colheita HF Offline
              </button>
            </div>
          )}

          {/* SCREEN: APONTAMENTO DE CALDA (GRÃOS) */}
          {currentScreen === 'APONTAMENTO_CALDA' && (
            <div className="flex flex-col space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" /> Registro de Calda Agrícola
              </h4>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Talhão Selecionado (GPS)</label>
                <select
                  value={selectedTalhaoId}
                  onChange={(e) => setSelectedTalhaoId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs mt-1"
                >
                  {TALHOES_INICIAIS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.codigo} - {t.nome} ({t.areaHa} ha)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Máquina / Pulverizador</label>
                <select
                  value={selectedMaquinaId}
                  onChange={(e) => setSelectedMaquinaId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs mt-1"
                >
                  {MAQUINAS_INICIAIS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordem de Mistura no Tanque da Calda */}
              <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700">
                <p className="font-bold text-[11px] text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Receita de Calda (Ordem de Tanque)</span>
                  <span className="text-[10px] text-emerald-400">Volume: 80 L/ha</span>
                </p>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between bg-slate-900/80 p-1.5 rounded">
                    <span className="font-bold text-amber-400">1º Adjuvante: Aureo</span>
                    <span>0.25 L/ha</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900/80 p-1.5 rounded">
                    <span className="font-bold text-blue-400">2º Fungicida: Fox Xpro</span>
                    <span>0.50 L/ha</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900/80 p-1.5 rounded">
                    <span className="font-bold text-purple-400">3º Foliar: Complexo Zn-Mn</span>
                    <span>1.00 L/ha</span>
                  </div>
                </div>
              </div>

              {/* Variáveis Meteorológicas Obrigatórias */}
              <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[11px] text-slate-300 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-cyan-400" /> Condições Climáticas (Anemômetro)
                  </span>
                  {alertaVentoDeriva && (
                    <span className="text-[10px] text-red-400 font-bold flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> Risco de Deriva!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-slate-900 p-1.5 rounded">
                    <span className="text-slate-400 block">Vento</span>
                    <input
                      type="number"
                      value={ventoKmh}
                      onChange={(e) => handleVentoChange(Number(e.target.value))}
                      className="w-full bg-transparent text-center font-bold text-white text-xs mt-0.5"
                    />
                    <span className="text-[9px] text-slate-500">km/h</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded">
                    <span className="text-slate-400 block">Temp</span>
                    <input
                      type="number"
                      value={temperatura}
                      onChange={(e) => setTemperatura(Number(e.target.value))}
                      className="w-full bg-transparent text-center font-bold text-white text-xs mt-0.5"
                    />
                    <span className="text-[9px] text-slate-500">°C</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded">
                    <span className="text-slate-400 block">Umidade</span>
                    <input
                      type="number"
                      value={umidadePct}
                      onChange={(e) => setUmidadePct(Number(e.target.value))}
                      className="w-full bg-transparent text-center font-bold text-white text-xs mt-0.5"
                    />
                    <span className="text-[9px] text-slate-500">%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSalvarOperacaoCalda}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg mt-2 text-xs transition-transform active:scale-95"
              >
                Gravar Aplicação Offline (SQLite)
              </button>
            </div>
          )}

          {/* SCREEN: MONITORAMENTO DE PRAGAS */}
          {currentScreen === 'PRAGAS' && (
            <div className="flex flex-col space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Monitoramento MIP
              </h4>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Alvo Biológico</label>
                <select
                  value={alvoBiologico}
                  onChange={(e) => setAlvoBiologico(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs mt-1"
                >
                  <option>Percevejo Marrom (Euschistus heros)</option>
                  <option>Lagarta da Soja (Anticarsia gemmatalis)</option>
                  <option>Ferrugem Asiática (Phakopsora pachyrhizi)</option>
                  <option>Mosca Branca (Bemisia tabaci)</option>
                  <option>Ácaro Rajado (Tetranychus urticae)</option>
                </select>
              </div>

              <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                <label className="text-[11px] text-slate-300 font-semibold">Contagem por Amostragem</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={amostragemCount}
                    onChange={(e) => setAmostragemCount(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                  <span className="font-black text-red-400 text-sm w-10 text-right">{amostragemCount}</span>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                  <span>Limite Seguro: 2.0/m</span>
                  <span className="text-red-400 font-bold">NDE Crítico: 4.0/m</span>
                </div>
              </div>

              <button
                onClick={handleSalvarPraga}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg mt-2 text-xs transition-transform active:scale-95"
              >
                Registrar Infestação Offline
              </button>
            </div>
          )}

          {/* SCREEN: ABASTECIMENTO */}
          {currentScreen === 'ABASTECIMENTO' && (
            <div className="flex flex-col space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-amber-400" /> Abastecimento de Máquina
              </h4>

              <div>
                <label className="text-[11px] text-slate-400">Trator / Máquina Agrícola</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs mt-1">
                  <option>Trator John Deere 8R 370</option>
                  <option>Pulverizador JD 4030</option>
                  <option>Colheitadeira Case 8250</option>
                  <option>Vagão Misturador Kuhn Confinamento</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400">Volume Abastecido (Litros Diesel S10)</label>
                <input
                  type="number"
                  value={litrosAbastecidos}
                  onChange={(e) => setLitrosAbastecidos(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-bold text-sm mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400">Tanque / Comboio de Origem</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs mt-1">
                  <option>Tanque Principal Sede (30.000 L)</option>
                  <option>Caminhão Comboio Móvel Melosa 01</option>
                </select>
              </div>

              <button
                onClick={() => {
                  alert('✓ Abastecimento registrado no banco local!');
                  setCurrentScreen('HOME');
                }}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg mt-2 text-xs"
              >
                Confirmar Abastecimento
              </button>
            </div>
          )}

          {/* SCREEN: FILA DE SINCRONIZAÇÃO */}
          {currentScreen === 'SYNC_STATUS' && (
            <div className="flex flex-col space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-cyan-400" /> Fila SQLite Local
                </h4>
                <button
                  onClick={handleForcarSincronizacao}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow"
                >
                  <RotateCw className="w-3 h-3" /> Sincronizar Agora
                </button>
              </div>

              <div className="space-y-2">
                {syncQueue.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 text-slate-200"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">{item.tipo}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          item.status === 'SINCRONIZADO'
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-amber-950 text-amber-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300">{item.resumo}</p>
                    <p className="text-[8px] font-mono text-slate-500 mt-1 truncate">UUIDv7: {item.id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Barra Inferior do Smartphone */}
        <div className="w-full flex justify-center py-2">
          <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
        </div>
      </div>

      {/* Painel de Controle da Simulação (Lado Direito) */}
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-slate-200">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-emerald-400" /> Controle da Simulação Offline-First
        </h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Este simulador permite testar a experiência real do operador em campo sem conectividade, adaptado ao perfil operacional contratado: <strong className="text-indigo-400">{profileId.replace(/_/g, ' ')}</strong>.
        </p>

        {/* Chave de Conectividade */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
                Estado da Conexão de Borda
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isOnline ? 'Conectado à nuvem (Wi-Fi Sede / 4G)' : 'Modo Campo (100% Offline)'}
              </p>
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow ${
                isOnline
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isOnline ? 'Desconectar (Ir para Campo)' : 'Conectar à Internet'}
            </button>
          </div>
        </div>

        {/* Garantias Arquiteturais em Ação */}
        <div className="space-y-2.5 text-xs">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
            Garantias Técnicas Testadas:
          </h4>
          <div className="flex items-start gap-2 bg-slate-800/50 p-2 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">UUIDv7 Cronológico:</span>
              <p className="text-[11px] text-slate-400">
                Evita colisões ao sincronizar e mantém ordenação temporal natural em índices PostgreSQL B-Tree.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-800/50 p-2 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Adaptação Contextual do Cockpit:</span>
              <p className="text-[11px] text-slate-400">
                A interface e os fluxos de trabalho do dispositivo móvel espelham exatamente os módulos da atividade do produtor.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-800/50 p-2 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Recepção Assíncrona via RabbitMQ:</span>
              <p className="text-[11px] text-slate-400">
                O gateway responde HTTP 202 instantaneamente, liberando a memória do aparelho sem retenção de rede.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
