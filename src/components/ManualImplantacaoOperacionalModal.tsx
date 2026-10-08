import React, { useState } from 'react';
import {
  BookOpen,
  Wrench,
  Cpu,
  CheckCircle2,
  X,
  Search,
  Download,
  AlertTriangle,
  Zap,
  Radio,
  FileText,
  ShieldCheck,
  Droplet,
  WifiOff,
  Flame,
  Gauge,
  Navigation,
  ChevronRight,
  Printer,
  Server,
  Globe,
  Image as ImageIcon
} from 'lucide-react';

interface ManualImplantacaoOperacionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify?: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

export const ManualImplantacaoOperacionalModal: React.FC<ManualImplantacaoOperacionalModalProps> = ({
  isOpen,
  onClose,
  onNotify
}) => {
  const [activeTab, setActiveTab] = useState<'implantacao' | 'canbus' | 'comissionamento' | 'modulos' | 'telas' | 'servidor'>('canbus');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'c1': true,
    'c2': true,
    'c3': false
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrintOrDownload = () => {
    window.print();
    if (onNotify) onNotify('Preparando versão para impressão / PDF do manual...', 'info');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#F7F9F5] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal - Padrão 60-30-10 Enterprise */}
        <div className="px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D4B38] flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-white">
                  Manual de Implantação & Instalação Telemática CAN Bus
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                  Guia Oficial v2.6
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Instruções operacionais para implantação da fazenda, chicote SAE J1939/ISOBUS e validação em campo com operadores.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintOrDownload}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              title="Imprimir ou Salvar em PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-800/80 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-white gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('canbus')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'canbus'
                ? 'border-[#1D4B38] text-[#1D4B38] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-700" />
            <span>Instalação Chicote CAN Bus (J1939)</span>
          </button>

          <button
            onClick={() => setActiveTab('comissionamento')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'comissionamento'
                ? 'border-[#1D4B38] text-[#1D4B38] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4 text-amber-700" />
            <span>Validação In Loco com Operadores</span>
          </button>

          <button
            onClick={() => setActiveTab('implantacao')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'implantacao'
                ? 'border-[#1D4B38] text-[#1D4B38] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Implantação Passo a Passo da Fazenda</span>
          </button>

          <button
            onClick={() => setActiveTab('modulos')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'modulos'
                ? 'border-[#1D4B38] text-[#1D4B38] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-700" />
            <span>Módulos Estratégicos (Fiscal, EUDR, ZARC)</span>
          </button>

          <button
            onClick={() => setActiveTab('telas')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'telas'
                ? 'border-[#1D4B38] text-[#1D4B38] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-emerald-700" />
            <span>Telas Ilustradas do Sistema</span>
          </button>

          <button
            onClick={() => setActiveTab('servidor')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'servidor'
                ? 'border-[#1D4B38] text-[#1D4B38] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="w-4 h-4 text-emerald-700" />
            <span>Instalação Local & Nuvem Brasil</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs leading-relaxed">
          {/* TAB 1: INSTALAÇÃO CHICOTE CAN BUS */}
          {activeTab === 'canbus' && (
            <div className="space-y-6">
              {/* Alerta de Segurança e Boas Práticas */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 text-xs">Atenção Crítica de Segurança Elétrica</h4>
                  <p className="text-amber-800 text-[11px] mt-0.5">
                    Antes de tocar em qualquer fiação da máquina, <strong>desligue a chave geral</strong> e desconecte o polo negativo da bateria. Nunca realize conexões diretas na rede CAN com a máquina ligada.
                  </p>
                </div>
              </div>

              {/* Pinagem Deutsch HD10 9 Pinos */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#1D4B38]" />
                    <span>1. Pinagem do Conector Deutsch HD10 de 9 Pinos (SAE J1939-13)</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    250 kbps / 500 kbps
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Diagrama Visual Deutsch */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px] leading-tight">
                    <div className="text-slate-400 text-center pb-2 text-[10px] uppercase tracking-wider font-bold">
                      Vista Frontal do Conector Macho
                    </div>
                    <pre className="text-center font-bold text-emerald-300">
{`          [ B: VCC ]       [ A: GND ]
               \\             /
      [ C: CAN_H ]---\\-------/--- [ J: Ignição ]
                      \\     /
      [ D: CAN_L ]-----( O )----- [ H: OEM ]
                      /     \\
      [ E: SHLD ]----/-------\\--- [ G: ISOBUS ]
                    /         \\
                 [ F: ISOBUS ]`}
                    </pre>
                    <div className="text-[10px] text-slate-400 text-center pt-2">
                      Conector Tipo 1 (Preto) ou Tipo 2 (Verde Flangeado)
                    </div>
                  </div>

                  {/* Tabela de Pinos */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] border border-slate-200 rounded-lg overflow-hidden">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2 text-left">Pino</th>
                          <th className="p-2 text-left">Função</th>
                          <th className="p-2 text-left">Cor Típica</th>
                          <th className="p-2 text-left">Especificação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="bg-white hover:bg-slate-50">
                          <td className="p-2 font-bold text-slate-900 font-mono">Pino A</td>
                          <td className="p-2">GND (Terra)</td>
                          <td className="p-2 text-slate-600 font-mono">Preto</td>
                          <td className="p-2 text-slate-500">Chassi da Máquina</td>
                        </tr>
                        <tr className="bg-slate-50/50 hover:bg-slate-50">
                          <td className="p-2 font-bold text-slate-900 font-mono">Pino B</td>
                          <td className="p-2 font-semibold text-rose-700">VCC (+12V/+24V)</td>
                          <td className="p-2 text-slate-600 font-mono">Vermelho</td>
                          <td className="p-2 text-slate-500">Fusível 3A obrigatório</td>
                        </tr>
                        <tr className="bg-emerald-50/40 hover:bg-emerald-50/70">
                          <td className="p-2 font-bold text-emerald-800 font-mono">Pino C</td>
                          <td className="p-2 font-bold text-emerald-900">CAN_H (High)</td>
                          <td className="p-2 text-slate-600 font-mono">Amarelo</td>
                          <td className="p-2 text-slate-500">2.5V a 3.5V diferencial</td>
                        </tr>
                        <tr className="bg-emerald-50/40 hover:bg-emerald-50/70">
                          <td className="p-2 font-bold text-emerald-800 font-mono">Pino D</td>
                          <td className="p-2 font-bold text-emerald-900">CAN_L (Low)</td>
                          <td className="p-2 text-slate-600 font-mono">Verde</td>
                          <td className="p-2 text-slate-500">1.5V a 2.5V diferencial</td>
                        </tr>
                        <tr className="bg-white hover:bg-slate-50">
                          <td className="p-2 font-bold text-slate-900 font-mono">Pino E</td>
                          <td className="p-2">CAN_SHLD</td>
                          <td className="p-2 text-slate-600 font-mono">Malha Nua</td>
                          <td className="p-2 text-slate-500">Aterrar em ponto único</td>
                        </tr>
                        <tr className="bg-slate-50/50 hover:bg-slate-50">
                          <td className="p-2 font-bold text-slate-900 font-mono">Pino J</td>
                          <td className="p-2">Ignição (KL15)</td>
                          <td className="p-2 text-slate-600 font-mono">Branco</td>
                          <td className="p-2 text-slate-500">Sentido pós-chave</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Regras de Cabeamento e Impedância */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#1D4B38] font-bold text-xs">
                    <Zap className="w-4 h-4" />
                    <span>Par Trançado (Twisted Pair)</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Os condutores CAN_H e CAN_L <strong>devem ter no mínimo 33 a 50 voltas por metro</strong>. Isso anula a indução de ruídos eletromagnéticos provenientes do alternador e solenoides hidráulicos.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#1D4B38] font-bold text-xs">
                    <Gauge className="w-4 h-4" />
                    <span>Terminação de 60 Ohms</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Com a máquina desligada, meça entre Pino C e D com multímetro: o valor <strong>deve ser exatamente ~60Ω</strong> (dois resistores de 120Ω em paralelo nas pontas do barramento).
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#1D4B38] font-bold text-xs">
                    <Navigation className="w-4 h-4" />
                    <span>Antena GNSS / RTK no Teto</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Fixe a antena GNSS no centro do teto metálico da cabine para visada límpida de 360°. Mantenha distância de 1m das antenas de rádio VHF/UHF da fazenda.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VALIDAÇÃO IN LOCO COM OPERADORES */}
          {activeTab === 'comissionamento' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1D4B38]" />
                  <span>Protocolo de Comissionamento em Campo (Checklist Operacional)</span>
                </h3>

                <p className="text-slate-600 text-[11px]">
                  Marque cada item à medida que validar com o operador na cabine da máquina antes de liberar para o talhão:
                </p>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'c1',
                      titulo: '1. Conexão Física & Alimentação',
                      desc: 'Conector Deutsch travado com o anel de segurança girado. Fusível de 3A instalado no positivo. LED do gateway em verde contínuo.'
                    },
                    {
                      id: 'c2',
                      titulo: '2. Leitura de Tacômetro & RPM (PGN 61444 EEC1)',
                      desc: 'Ligue o motor. Acelere até 1.800 RPM. A tela do AGROTECH deve bater com o painel da máquina com tolerância máxima de ±5 RPM.'
                    },
                    {
                      id: 'c3',
                      titulo: '3. Pressão de Óleo & Temperatura (PGN 65263 / 65262)',
                      desc: 'Verifique se a pressão do óleo exibe entre 3.0 e 5.5 bar e a temperatura do motor se estabiliza entre 82°C e 94°C.'
                    },
                    {
                      id: 'c4',
                      titulo: '4. Posicionamento GPS Cinemático no Talhão (PGN 65267)',
                      desc: 'Movimente a máquina por 50 metros. O ícone de trator deve acompanhar a trajetória com precisão submétrica sobre o talhão correto.'
                    },
                    {
                      id: 'c5',
                      titulo: '5. Teste de Zona de Sombra Offline (Princípio 12)',
                      desc: 'Simule falta de sinal colocando o tablet em modo avião. Faça um apontamento de abastecimento: deve salvar como PENDING e sincronizar sozinho ao religar.'
                    }
                  ].map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        checkedItems[item.id]
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!checkedItems[item.id]}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-[#1D4B38] focus:ring-[#1D4B38]"
                      />
                      <div>
                        <p className="font-bold text-xs text-slate-900">{item.titulo}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabela de Parâmetros Normais vs Alertas */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <h4 className="font-bold text-xs text-slate-900">
                  Tabela de Parâmetros Operacionais & Limiares de Alerta Automático
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] border border-slate-200 rounded-lg">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-2 text-left">Métrica</th>
                        <th className="p-2 text-left">Faixa Nominal</th>
                        <th className="p-2 text-left">Gatilho de Alerta AGROTECH</th>
                        <th className="p-2 text-left">Ação do Operador</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-medium">Temperatura Motor</td>
                        <td className="p-2 text-emerald-800 font-mono">82°C – 94°C</td>
                        <td className="p-2 text-rose-700 font-bold font-mono">&gt; 102°C</td>
                        <td className="p-2 text-slate-600">Reduzir carga, parar em marcha lenta, checar tela do radiador</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Pressão de Óleo</td>
                        <td className="p-2 text-emerald-800 font-mono">3.0 – 5.5 bar</td>
                        <td className="p-2 text-rose-700 font-bold font-mono">&lt; 1.5 bar</td>
                        <td className="p-2 text-slate-600">Parar o motor imediatamente (risco iminente de fundir)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Rotação do Motor</td>
                        <td className="p-2 text-emerald-800 font-mono">1.600 – 2.100 rpm</td>
                        <td className="p-2 text-rose-700 font-bold font-mono">&gt; 2.250 rpm</td>
                        <td className="p-2 text-slate-600">Aliviar acelerador de mão e selecionar marcha superior</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Tensão Alternador</td>
                        <td className="p-2 text-emerald-800 font-mono">13.8V – 14.4V (28V)</td>
                        <td className="p-2 text-amber-700 font-bold font-mono">&lt; 12.2V (&lt; 24V)</td>
                        <td className="p-2 text-slate-600">Checar correia do alternador ao final do turno</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMPLANTAÇÃO PASSO A PASSO DA FAZENDA */}
          {activeTab === 'implantacao' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1D4B38]" />
                  <span>Roteiro de Implantação do AGROTECH na Propriedade Rural</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      FASE 1: CADASTRO INSTITUCIONAL
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">Propriedade & Inscrição Estadual</h4>
                    <p className="text-slate-600 text-[11px]">
                      Cadastre a Razão Social da Fazenda, Inscrição Estadual (IE) vinculada à SEFAZ da respectiva UF, Matrículas no Cartório de Registro de Imóveis (CRI) e coordenadas geográficas da sede.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      FASE 2: GOVERNANÇA RBAC
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">Perfis & Delegação Estrita</h4>
                    <p className="text-slate-600 text-[11px]">
                      Crie os usuários da equipe rural vinculando cada um rigorosamente ao seu papel: Superadmin (proprietário), Produtor, Agrônomo RT, Operadores de frota, Contador fiscal e Veterinário.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      FASE 3: IMPORTAÇÃO DO CAR
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">Geodésia WGS84 & Talhões</h4>
                    <p className="text-slate-600 text-[11px]">
                      Faça o upload do arquivo GeoJSON ou Shapefile do Cadastro Ambiental Rural (SICAR). O sistema calcula a área agricultável, Reserva Legal e APPs, subdividindo em talhões com centróides georreferenciados.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      FASE 4: CERTIFICADO A1 & APIS
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">SEFAZ, PIX BACEN & WhatsApp</h4>
                    <p className="text-slate-600 text-[11px]">
                      No painel de Credenciais, carregue o arquivo .pfx do Certificado Digital A1 com chave privada ICP-Brasil, teste o status SEFAZ MT/PR/GO e ative o telefone de plantão para envio de alertas via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MÓDULOS ESTRATÉGICOS */}
          {activeTab === 'modulos' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1D4B38]" />
                  <span>Instruções de Uso dos Módulos Estratégicos</span>
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Monitor Psicrométrico Delta T (ASABE S572)</span>
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        2.0°C a 8.0°C IDEAL
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Acompanhe o indicador no topo do sistema antes de qualquer pulverização. Evite aplicar com ΔT abaixo de 2.0°C (risco de inversão térmica e deriva) ou acima de 8.0°C (evaporação rápida da gota antes de absorver na folha).
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                        <span>ESG & Due Diligence EUDR (Regulamento UE 2023/1115)</span>
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-blue-100 text-blue-800">
                        TRACES NT
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Emita o dossiê de exportação de grãos e carne para a Europa. O motor geoespacial valida a ausência de desmatamento posterior a 31/12/2020 e gera hash SHA-256 aceito pelas tradings internacionais.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-purple-700" />
                        <span>Fiscal: NF-e do Produtor (Mod. 55) & LCDPR SPED 0013</span>
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-purple-100 text-purple-800">
                        SEFAZ Nacional
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Gere notas fiscais eletrônicas de venda de grãos e remessa para armazém com cálculo automático de ICMS diferido e Funrural. O Livro Caixa Digital é exportado diretamente no layout 0013 para o programa validador da Receita Federal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TELAS ILUSTRADAS DO SISTEMA */}
          {activeTab === 'telas' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#1D4B38]" />
                    <span>Galeria Ilustrada de Telas do Sistema com Instruções Passo a Passo</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Clique em qualquer tela para expandir
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      img: '/screenshots/screenshot_platform_overview.png',
                      titulo: '1. Visão Geral da Plataforma',
                      desc: 'Layout corporativo 60-30-10, Topbar de 50px com cotações B3 e navegação lateral.'
                    },
                    {
                      img: '/screenshots/screenshot_login_design.png',
                      titulo: '2. Login & Seleção de Perfis RBAC',
                      desc: 'Acesso seguro por JWT com alternância rápida entre Superadmin, Produtor, Agrônomo e Operador.'
                    },
                    {
                      img: '/screenshots/screenshot_module_config_culturas.png',
                      titulo: '3. Seleção de Culturas da Safra',
                      desc: 'Customização de culturas (Soja, Milho, Algodão, Café, Cana) para adaptação dinâmica do sistema.'
                    },
                    {
                      img: '/screenshots/screenshot_gis_map.png',
                      titulo: '4. Mapeamento Geoespacial & CAR',
                      desc: 'Cálculo de Reserva Legal e APP com centróides WGS84 e camadas satelitais Sentinel-2.'
                    },
                    {
                      img: '/screenshots/screenshot_domain_frotas.png',
                      titulo: '5. Telemetria CAN Bus J1939',
                      desc: 'Leitura em tempo real de rotação do motor, horímetro acumulado, pressão de óleo e temperatura.'
                    },
                    {
                      img: '/screenshots/screenshot_modal_delta_t.png',
                      titulo: '6. Monitor Psicrométrico Delta T',
                      desc: 'Classificação da janela ideal de pulverização (2.0°C a 8.0°C) conforme a norma ASABE S572.'
                    },
                    {
                      img: '/screenshots/screenshot_modal_sync.png',
                      titulo: '7. Fila de Sincronização Outbox',
                      desc: 'Operação garantida no talhão sem internet com reconciliação automática ao restabelecer o sinal.'
                    },
                    {
                      img: '/screenshots/screenshot_domain_fiscal.png',
                      titulo: '8. Emissor Fiscal NF-e & LCDPR',
                      desc: 'Transmissão autorizada de NF-e Mod. 55 e geração de arquivo oficial SPED Layout 0013.'
                    },
                    {
                      img: '/screenshots/screenshot_domain_hedge.png',
                      titulo: '9. CPR de Barter & Trava NDF',
                      desc: 'Gestão de contratos físicos vinculados à B3 e proteção cambial contra volatilidade.'
                    },
                    {
                      img: '/screenshots/screenshot_rbac_superadmin_matrix.png',
                      titulo: '10. Matriz de Governança RBAC',
                      desc: 'Controle estrito de permissões delegado com exclusividade pelo usuário Superadmin.'
                    }
                  ].map((tela, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedScreenshot(tela.img)}
                      className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer bg-slate-50 group"
                    >
                      <div className="relative h-44 bg-slate-900 overflow-hidden">
                        <img
                          src={tela.img}
                          alt={tela.titulo}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                      </div>
                      <div className="p-3 bg-white">
                        <h4 className="font-bold text-xs text-slate-900">{tela.titulo}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{tela.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lightbox / Modal de Imagem Expandida */}
              {selectedScreenshot && (
                <div
                  className="fixed inset-0 z-60 bg-slate-950/90 flex flex-col items-center justify-center p-4 backdrop-blur-md"
                  onClick={() => setSelectedScreenshot(null)}
                >
                  <div className="relative max-w-5xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                    <button
                      onClick={() => setSelectedScreenshot(null)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 transition-colors z-10 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <img
                      src={selectedScreenshot}
                      alt="Tela Expandida"
                      className="w-full h-auto max-h-[85vh] object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: INSTALAÇÃO LOCAL & NUVEM BRASIL */}
          {activeTab === 'servidor' && (
            <div className="space-y-6">
              {/* Instalação Local na Sede */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#1D4B38]" />
                    <span>1. Instalação Local (Servidor On-Premises na Sede da Fazenda)</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    Latência &lt; 2ms
                  </span>
                </div>

                <p className="text-slate-600 text-[11px]">
                  Garanta autonomia operacional completa no escritório e balança rodoviária, operando mesmo sem conexão externa com a internet ou sob chuvas fortes.
                </p>

                <div className="bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-[11px] space-y-1">
                  <div className="text-slate-400 text-[10px]"># Passo 1: Instalação rápida via Docker Compose no Ubuntu Server</div>
                  <div>sudo apt update &amp;&amp; sudo apt install -y docker.io docker-compose git</div>
                  <div>cd /opt &amp;&amp; sudo git clone https://github.com/empresa-rural/agtech-platform.git</div>
                  <div>cd agtech-platform &amp;&amp; sudo docker compose up -d --build</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <h5 className="font-bold text-slate-900 text-xs">IP Estático da Sede</h5>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Configure IP fixo (ex: <code>192.168.1.100</code>) para acesso permanente via <code>http://192.168.1.100:5173</code>.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <h5 className="font-bold text-slate-900 text-xs">Wi-Fi nos Barracões</h5>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Conecte antenas Ubiquiti / Mikrotik ou Starlink no mesmo switch para sincronização ao guardar os tratores.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <h5 className="font-bold text-slate-900 text-xs">Backup Diário Automático</h5>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Cron job diário às 02:00 compacta o banco de dados e replica para pendrive ou storage NAS com 30 dias de retenção.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hospedagem nas Principais Nuvens do Brasil */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#1D4B38]" />
                    <span>2. Hospedagem em Nuvem Nacional (Data Centers no Brasil)</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    LGPD &amp; Baixa Latência
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 text-left">Provedor</th>
                        <th className="p-2 text-left">Data Center</th>
                        <th className="p-2 text-left">Modalidade</th>
                        <th className="p-2 text-left">Custo Estimado</th>
                        <th className="p-2 text-left">Vantagem Principal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-bold text-slate-900">Locaweb</td>
                        <td className="p-2">São Paulo (SP)</td>
                        <td className="p-2">VPS Linux SSD</td>
                        <td className="p-2 text-emerald-800 font-mono">R$ 80 a R$ 220/mês</td>
                        <td className="p-2 text-slate-600">NF e faturamento em Reais via boleto; suporte nacional 24/7.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-900">KingHost</td>
                        <td className="p-2">Porto Alegre / Curitiba</td>
                        <td className="p-2">Cloud VPS</td>
                        <td className="p-2 text-emerald-800 font-mono">R$ 75 a R$ 190/mês</td>
                        <td className="p-2 text-slate-600">Excelente rota de tráfego para estados do Sul e Centro-Oeste.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-900">HostGator Brasil</td>
                        <td className="p-2">São Paulo (SP)</td>
                        <td className="p-2">VPS KVM</td>
                        <td className="p-2 text-emerald-800 font-mono">R$ 90 a R$ 250/mês</td>
                        <td className="p-2 text-slate-600">Custo-benefício equilibrado e fácil gerenciamento.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-900">AWS América do Sul</td>
                        <td className="p-2">sa-east-1 (São Paulo)</td>
                        <td className="p-2">EC2 / Fargate</td>
                        <td className="p-2 text-emerald-800 font-mono">US$ 30 a US$ 90/mês</td>
                        <td className="p-2 text-slate-600">Alta escalabilidade com RDS PostgreSQL PostGIS e S3.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-900">Oracle Cloud (OCI)</td>
                        <td className="p-2">Vinhedo / São Paulo</td>
                        <td className="p-2">Ampere Always Free</td>
                        <td className="p-2 text-emerald-800 font-mono">Gratuito / R$ 150/mês</td>
                        <td className="p-2 text-slate-600">Plano gratuito generoso (4 OCPUs, 24GB RAM) em solo brasileiro.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Configuração de Domínio e SSL Let's Encrypt</h4>
                  <p className="text-[11px] text-slate-600">
                    1. Registre seu domínio no <strong>Registro.br</strong> (ex: <code>fazendasantaluzia.com.br</code>) apontando o DNS tipo <strong>A</strong> para o IP do VPS.<br />
                    2. Instale o Nginx reverso e ative o certificado gratuito com renovação automática executando:<br />
                    <code className="px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded font-mono text-[10px]">
                      sudo certbot --nginx -d sistema.fazendasantaluzia.com.br
                    </code>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Documento: MANUAL_IMPLANTACAO_E_USO_AGROTECH.md
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1D4B38] hover:bg-[#285943] text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Entendido & Concluir Leitura</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
