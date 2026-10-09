import React, { useState } from 'react';
import {
  HardHat,
  HeartPulse,
  FileBadge,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Users,
  Calendar,
  FileText,
  Plus,
  Send,
  Eye,
  Search,
  Lock,
  Unlock
} from 'lucide-react';

export interface ColaboradorRural {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  setor: 'LAVOURA' | 'OFICINA' | 'SILOS' | 'PECUARIA';
  dataASO: string;
  validadeASO: string;
  asoValido: boolean;
  treinamentos: {
    norma: string; // Ex: 'NR-31.7 Defensivos', 'NR-31.12 Tratores', 'NR-33 Espaço Confinado', 'NR-35 Altura'
    dataConclusao: string;
    validade: string;
    valido: boolean;
  }[];
  episEntregues: {
    item: string;
    caNumero: string;
    dataEntrega: string;
  }[];
  statusAptidao: 'APTO' | 'ALERTA_RENOVACAO' | 'BLOQUEADO';
}

const COLABORADORES_INICIAIS: ColaboradorRural[] = [
  {
    id: 'colab-01',
    nome: 'Valmir Santos',
    cpf: '412.891.028-14',
    cargo: 'Operador de Trator Pleno',
    setor: 'LAVOURA',
    dataASO: '2026-03-10',
    validadeASO: '2027-03-10',
    asoValido: true,
    treinamentos: [
      { norma: 'NR-31.12 (Máquinas e Tratores)', dataConclusao: '2025-05-12', validade: '2027-05-12', valido: true },
      { norma: 'NR-31.7 (Defensivos & EPIs)', dataConclusao: '2024-11-20', validade: '2026-11-20', valido: true },
    ],
    episEntregues: [
      { item: 'Botina de Segurança com Bico Composite', caNumero: 'CA 29.400', dataEntrega: '2026-01-15' },
      { item: 'Protetor Auricular Tipo Concha', caNumero: 'CA 15.400', dataEntrega: '2026-01-15' },
    ],
    statusAptidao: 'APTO',
  },
  {
    id: 'colab-02',
    nome: 'Antônio Silva',
    cpf: '582.109.481-90',
    cargo: 'Aplicador de Defensivos Químicos',
    setor: 'LAVOURA',
    dataASO: '2026-04-18',
    validadeASO: '2027-04-18',
    asoValido: true,
    treinamentos: [
      { norma: 'NR-31.7 (Agrotóxicos e EPI Hidro-repelente)', dataConclusao: '2025-02-10', validade: '2027-02-10', valido: true },
    ],
    episEntregues: [
      { item: 'Respirador Semi-Facial com Filtro Carvão', caNumero: 'CA 12.480', dataEntrega: '2026-02-01' },
      { item: 'Macacão Hidro-Repelente Nível 2', caNumero: 'CA 34.120', dataEntrega: '2026-02-01' },
      { item: 'Luvas de Borracha Nitrílica', caNumero: 'CA 18.900', dataEntrega: '2026-02-01' },
    ],
    statusAptidao: 'APTO',
  },
  {
    id: 'colab-03',
    nome: 'Carlos Eduardo',
    cpf: '671.902.341-22',
    cargo: 'Operador de Colheitadeira',
    setor: 'LAVOURA',
    dataASO: '2025-08-10',
    validadeASO: '2026-08-10', // Vencido!
    asoValido: false,
    treinamentos: [
      { norma: 'NR-31.12 (Máquinas e Implementos)', dataConclusao: '2025-04-10', validade: '2027-04-10', valido: true },
    ],
    episEntregues: [
      { item: 'Óculos de Proteção UV', caNumero: 'CA 19.820', dataEntrega: '2026-01-10' },
      { item: 'Protetor Auricular Plug Silicone', caNumero: 'CA 14.200', dataEntrega: '2026-01-10' },
    ],
    statusAptidao: 'BLOQUEADO',
  },
  {
    id: 'colab-04',
    nome: 'Marcos Vinícius',
    cpf: '782.341.092-55',
    cargo: 'Operador de Silos & Moega',
    setor: 'SILOS',
    dataASO: '2026-02-12',
    validadeASO: '2027-02-12',
    asoValido: true,
    treinamentos: [
      { norma: 'NR-33 (Espaço Confinado em Silos)', dataConclusao: '2025-10-15', validade: '2026-10-15', valido: true },
      { norma: 'NR-35 (Trabalho em Altura > 2m)', dataConclusao: '2025-10-16', validade: '2027-10-16', valido: true },
    ],
    episEntregues: [
      { item: 'Cinto Paraquedista com Talabarte Duplo', caNumero: 'CA 35.800', dataEntrega: '2025-10-15' },
      { item: 'Capacete com Jugular', caNumero: 'CA 28.100', dataEntrega: '2025-10-15' },
      { item: 'Detector de Gases Portátil 4 Gases', caNumero: 'CA 40.210', dataEntrega: '2025-10-15' },
    ],
    statusAptidao: 'ALERTA_RENOVACAO',
  },
];

export const NR31SegurancaTrabalhoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'colaboradores' | 'auditoriaCampo' | 'esocialS2240'>('colaboradores');
  const [colaboradores, setColaboradores] = useState<ColaboradorRural[]>(COLABORADORES_INICIAIS);
  const [busca, setBusca] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [mostrarModalNovo, setMostrarModalNovo] = useState<boolean>(false);
  const [sucessoMsg, setSucessoMsg] = useState<string | null>(null);

  // Formulário Novo Colaborador
  const [formNome, setFormNome] = useState<string>('');
  const [formCpf, setFormCpf] = useState<string>('');
  const [formCargo, setFormCargo] = useState<string>('Operador de Trator');
  const [formSetor, setFormSetor] = useState<ColaboradorRural['setor']>('LAVOURA');
  const [formDataAso, setFormDataAso] = useState<string>('2026-09-28');

  // Estado Auditoria NR-31 de Campo
  const [frenteTrabalhoAudit, setFrenteTrabalhoAudit] = useState<string>('Frente Agrícola 01 - Pulverização e Plantio');
  const [trabalhadoresAuditCount, setTrabalhadoresAuditCount] = useState<number>(18);
  const [itensAuditados, setItensAuditados] = useState<{ [key: string]: boolean }>({
    EPI_COMPLETO_AGROTOXICOS: true,
    AREA_VIVENCIA_MOVEL: true,
    PROTECAO_CARDAN_TDP: true,
    AGUA_POTAVEL_DISPONIVEL: true,
    TREINAMENTO_NR31_12: true,
    COMISSAO_CIPATR_OPERANTE: true
  });
  const [auditandoNr31, setAuditandoNr31] = useState<boolean>(false);
  const [resultadoAuditoriaNr31, setResultadoAuditoriaNr31] = useState<any>(null);

  // Estado Evento S-2240 eSocial
  const [colabSelecionadoS2240, setColabSelecionadoS2240] = useState<string>('Marcos Barreto de Oliveira');
  const [cpfS2240, setCpfS2240] = useState<string>('123.456.789-00');
  const [cargoS2240, setCargoS2240] = useState<string>('Operador de Máquinas Agrícolas');
  const [transmitindoS2240, setTransmitindoS2240] = useState<boolean>(false);
  const [resultadoS2240, setResultadoS2240] = useState<any>(null);

  const handleAuditarNr31 = async () => {
    setAuditandoNr31(true);
    try {
      const itensPayload = Object.entries(itensAuditados).map(([codigo, conforme]) => ({
        codigo,
        conforme
      }));
      const res = await fetch('/api/v1/trabalhista/nr31/auditoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frenteTrabalho: frenteTrabalhoAudit,
          totalTrabalhadoresPresentes: trabalhadoresAuditCount,
          itensAuditados: itensPayload
        })
      });
      const data = await res.json();
      setResultadoAuditoriaNr31(data);
    } catch (err) {
      console.error('Erro na auditoria NR-31:', err);
    } finally {
      setAuditandoNr31(false);
    }
  };

  const handleTransmitirS2240 = async () => {
    setTransmitindoS2240(true);
    try {
      const res = await fetch('/api/v1/trabalhista/esocial/evento-s2240', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trabalhadorNome: colabSelecionadoS2240,
          trabalhadorCpf: cpfS2240,
          cargo: cargoS2240
        })
      });
      const data = await res.json();
      setResultadoS2240(data);
    } catch (err) {
      console.error('Erro no envio S-2240:', err);
    } finally {
      setTransmitindoS2240(false);
    }
  };

  const aptosCount = colaboradores.filter((c) => c.statusAptidao === 'APTO').length;
  const alertaCount = colaboradores.filter((c) => c.statusAptidao === 'ALERTA_RENOVACAO').length;
  const bloqueadosCount = colaboradores.filter((c) => c.statusAptidao === 'BLOQUEADO').length;

  const colaboradoresFiltrados = colaboradores.filter((c) => {
    if (filtroStatus !== 'TODOS' && c.statusAptidao !== filtroStatus) return false;
    if (busca && !c.nome.toLowerCase().includes(busca.toLowerCase()) && !c.cpf.includes(busca)) return false;
    return true;
  });

  const handleSalvarColaborador = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome.trim()) return;

    const dataVenc = new Date(formDataAso);
    dataVenc.setFullYear(dataVenc.getFullYear() + 1);
    const validadeAsoStr = dataVenc.toISOString().split('T')[0];

    const novo: ColaboradorRural = {
      id: `colab-${Date.now()}`,
      nome: formNome,
      cpf: formCpf,
      cargo: formCargo,
      setor: formSetor,
      dataASO: formDataAso,
      validadeASO: validadeAsoStr,
      asoValido: true,
      treinamentos: [
        { norma: 'NR-31.12 (Máquinas e Implementos)', dataConclusao: formDataAso, validade: validadeAsoStr, valido: true },
      ],
      episEntregues: [
        { item: 'Botina com Bico Composite', caNumero: 'CA 29.400', dataEntrega: formDataAso },
        { item: 'Protetor Auricular', caNumero: 'CA 15.400', dataEntrega: formDataAso },
      ],
      statusAptidao: 'APTO',
    };

    setColaboradores([novo, ...colaboradores]);
    setMostrarModalNovo(false);
    setFormNome('');
    setFormCpf('');
    setSucessoMsg(`Colaborador ${formNome} cadastrado com conformidade NR-31 e ASO válido!`);
    setTimeout(() => setSucessoMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-700">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#1D4B38]">NR-31, eSocial & Saúde Ocupacional Rural</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-500/20 text-amber-800 border border-amber-500/30 rounded-full">
                  Norma NR-31 MTE
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  eSocial S-2220 / S-2240
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-0.5">
                Gestão de ASO, Ficha de EPI com CA, Treinamentos Obrigatórios e Bloqueio Operacional Preventivo no campo.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMostrarModalNovo(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Novo Colaborador / Ficha NR-31
        </button>
      </div>

      {sucessoMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-700/50 rounded-xl text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{sucessoMsg}</span>
          </div>
          <button onClick={() => setSucessoMsg(null)} className="text-xs text-emerald-700 hover:underline">
            Fechar
          </button>
        </div>
      )}

      {/* Tabs de Navegação */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('colaboradores')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'colaboradores'
              ? 'bg-[#285943] text-white shadow-md'
              : 'bg-slate-50 text-slate-900 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          1. Colaboradores & Fichas de EPI
        </button>

        <button
          onClick={() => setActiveTab('auditoriaCampo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'auditoriaCampo'
              ? 'bg-[#285943] text-white shadow-md'
              : 'bg-slate-50 text-slate-900 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          2. Checklist de Auditoria de Campo (NR-31)
        </button>

        <button
          onClick={() => setActiveTab('esocialS2240')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'esocialS2240'
              ? 'bg-[#285943] text-white shadow-md'
              : 'bg-slate-50 text-slate-900 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          3. Transmissão eSocial S-2240 (Ambiente & Riscos)
        </button>
      </div>

      {activeTab === 'colaboradores' && (
        <div className="space-y-6">
          {/* Cards de Conformidade NR-31 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Efetivo de Campo</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-[#1D4B38] font-mono">{colaboradores.length} operadores</div>
          <p className="text-xs text-slate-500 mt-1">Tratoristas, mecânicos e balanceiros</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-800/40 p-4 rounded-xl">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Aptos para Operação</span>
            <Unlock className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-emerald-200 font-mono">{aptosCount} aptos</div>
          <p className="text-xs text-emerald-700/80 mt-1">ASO e treinamentos 100% em dia</p>
        </div>

        <div className="bg-amber-50 border border-amber-800/40 p-4 rounded-xl">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Renovação Próxima (&lt; 30d)</span>
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-bold text-amber-200 font-mono">{alertaCount} colaboradores</div>
          <p className="text-xs text-amber-700/80 mt-1">Agendar reciclagem NR-33/NR-35</p>
        </div>

        <div className="bg-rose-50 border border-rose-800/40 p-4 rounded-xl">
          <div className="flex items-center justify-between text-rose-300 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Bloqueio Operacional</span>
            <Lock className="w-4 h-4 text-rose-700 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-rose-200 font-mono">{bloqueadosCount} bloqueado</div>
          <p className="text-xs text-rose-700/80 mt-1">ASO vencido: impedido de ligar máquina</p>
        </div>
      </div>

      {/* Tabela de Colaboradores e Matriz de Segurança */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
              <FileBadge className="w-5 h-5 text-amber-700" />
              Matriz de Conformidade NR-31 & ASO Periódico
            </h2>
            <p className="text-xs text-slate-600">
              Operadores com ASO ou treinamentos vencidos são bloqueados automaticamente no app de cabine
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-600" />
              <input
                type="text"
                placeholder="Buscar por nome ou CPF..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="bg-transparent text-slate-900 focus:outline-none w-40"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900">
              <span>Status:</span>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="bg-transparent text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="TODOS" className="bg-white text-slate-900">Todos</option>
                <option value="APTO" className="bg-white text-emerald-700">Aptos</option>
                <option value="ALERTA_RENOVACAO" className="bg-white text-amber-700">Alerta Renovação</option>
                <option value="BLOQUEADO" className="bg-white text-rose-700">Bloqueados</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Colaborador & CPF</th>
                <th className="px-4 py-3.5">Cargo & Setor</th>
                <th className="px-4 py-3.5">ASO Ocupacional</th>
                <th className="px-4 py-3.5">Treinamentos NR-31 Válidos</th>
                <th className="px-4 py-3.5">EPIs Ativos (com CA)</th>
                <th className="px-4 py-3.5">Status de Aptidão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {colaboradoresFiltrados.map((colab) => {
                let badge = (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-3 h-3" /> Apto para Operação
                  </span>
                );

                if (colab.statusAptidao === 'BLOQUEADO') {
                  badge = (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 w-fit animate-pulse">
                      <Lock className="w-3 h-3 text-rose-700" /> Bloqueio de Segurança
                    </span>
                  );
                } else if (colab.statusAptidao === 'ALERTA_RENOVACAO') {
                  badge = (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 border border-amber-500/40 flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3 text-amber-700" /> Renovar em &lt; 30d
                    </span>
                  );
                }

                return (
                  <tr key={colab.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{colab.nome}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{colab.cpf}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-slate-900 font-medium">{colab.cargo}</div>
                      <div className="text-[10px] text-emerald-700 uppercase font-semibold">{colab.setor}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className={`font-mono font-semibold ${colab.asoValido ? 'text-slate-900' : 'text-rose-700'}`}>
                        Venc: {colab.validadeASO}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {colab.asoValido ? 'ASO Periódico Válido' : '⚠️ ASO VENCIDO (Exige Exame)'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 space-y-1">
                      {colab.treinamentos.map((t, idx) => (
                        <div key={idx} className="text-[11px] text-slate-900 flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${t.valido ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                          <span>{t.norma}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({t.validade})</span>
                        </div>
                      ))}
                    </td>

                    <td className="px-4 py-3.5 space-y-1">
                      {colab.episEntregues.map((epi, idx) => (
                        <div key={idx} className="text-[11px] text-slate-900">
                          <span>{epi.item}</span>
                          <span className="text-[10px] text-indigo-400 font-mono ml-1 font-bold">[{epi.caNumero}]</span>
                        </div>
                      ))}
                    </td>

                    <td className="px-4 py-3.5">{badge}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}

  {/* Aba 2: Checklist de Auditoria de Campo (NR-31) */}
  {activeTab === 'auditoriaCampo' && (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            Auditoria Normativa de Frente de Trabalho (Portaria MTP nº 667/2021)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Inspeção de segurança in loco: EPIs, áreas de vivência móvel, proteção de tomada de força (TDP) e água potável.
          </p>
        </div>

        <button
          onClick={handleAuditarNr31}
          disabled={auditandoNr31}
          className="px-5 py-2.5 bg-[#285943] hover:bg-[#1D4B38] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          {auditandoNr31 ? 'Calculando Risco...' : 'Executar Laudo de Auditoria'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Frente de Operação Rural</label>
          <input
            type="text"
            value={frenteTrabalhoAudit}
            onChange={(e) => setFrenteTrabalhoAudit(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Trabalhadores em Atividade no Ponto</label>
          <input
            type="number"
            value={trabalhadoresAuditCount}
            onChange={(e) => setTrabalhadoresAuditCount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900"
          />
        </div>
      </div>

      {/* Checklist Interativo */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase text-slate-600 tracking-wider">Itens Críticos Obrigatórios da NR-31</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'EPI_COMPLETO_AGROTOXICOS', label: 'EPI Completo para Aplicação de Defensivos (NR-31.7)' },
            { id: 'AREA_VIVENCIA_MOVEL', label: 'Área de Vivência Móvel com Sanitários Higienizados (NR-31.23)' },
            { id: 'PROTECAO_CARDAN_TDP', label: 'Proteção Integral de Cardan e Tomada de Potência (NR-31.12)' },
            { id: 'AGUA_POTAVEL_DISPONIVEL', label: 'Água Potável Fresca em Recipiente Térmico Individual' },
            { id: 'TREINAMENTO_NR31_12', label: 'Operadores com Treinamento Teórico-Prático Concluído' },
            { id: 'COMISSAO_CIPATR_OPERANTE', label: 'Comissão Interna de Prevenção de Acidentes Rurais (CIPATR)' },
          ].map((item) => (
            <label
              key={item.id}
              className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                itensAuditados[item.id]
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/60 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={itensAuditados[item.id]}
                  onChange={(e) =>
                    setItensAuditados({ ...itensAuditados, [item.id]: e.target.checked })
                  }
                  className="rounded text-emerald-700 w-4 h-4 cursor-pointer"
                />
                <span>{item.label}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${itensAuditados[item.id] ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'}`}>
                {itensAuditados[item.id] ? 'CONFORME' : 'NÃO CONFORME'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Resultado da Auditoria */}
      {resultadoAuditoriaNr31 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Classificação de Risco MTP</span>
              <span className="text-base font-black text-emerald-900 flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                {resultadoAuditoriaNr31.statusGeral}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Conformidade Global</span>
              <span className="text-xl font-black text-emerald-700 font-mono">
                {resultadoAuditoriaNr31.percentualConformidade}%
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-700">
            <strong>Recomendação Técnica:</strong> {resultadoAuditoriaNr31.acoesRecomendadas.join(' • ')}
          </div>
        </div>
      )}
    </div>
  )}

  {/* Aba 3: Transmissão eSocial S-2240 */}
  {activeTab === 'esocialS2240' && (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-700" />
            Evento S-2240: Condições Ambientais do Trabalho (Layout S-1.2)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Mapeamento de riscos físicos, ruído em decibéis e exposição a defensivos com geração de XML e assinatura digital.
          </p>
        </div>

        <button
          onClick={handleTransmitirS2240}
          disabled={transmitindoS2240}
          className="px-5 py-2.5 bg-[#285943] hover:bg-[#1D4B38] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {transmitindoS2240 ? 'Assinando XML...' : 'Gerar e Validar Evento S-2240'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Nome do Trabalhador</label>
          <input
            type="text"
            value={colabSelecionadoS2240}
            onChange={(e) => setColabSelecionadoS2240(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">CPF</label>
          <input
            type="text"
            value={cpfS2240}
            onChange={(e) => setCpfS2240(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Cargo / Função Rural</label>
          <input
            type="text"
            value={cargoS2240}
            onChange={(e) => setCargoS2240(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
          />
        </div>
      </div>

      {resultadoS2240 && (
        <div className="bg-slate-50 border border-blue-200 rounded-xl p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
            <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Status: {resultadoS2240.statusValidacao}
            </span>
            <span className="text-[10px] font-mono text-slate-600 font-bold">
              Hash Assinatura: {resultadoS2240.hashAssinaturaXml.substring(0, 24)}...
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-600 uppercase font-bold block mb-1">
              XML Gerado Conforme Schema Oficial eSocial S-1.2:
            </span>
            <pre className="p-3 bg-white border border-slate-200 rounded-lg font-mono text-[10px] text-slate-800 overflow-x-auto whitespace-pre leading-relaxed">
              {resultadoS2240.xmlEvento}
            </pre>
          </div>
        </div>
      )}
    </div>
  )}

      {/* Modal Novo Colaborador */}
      {mostrarModalNovo && (
        <div className="fixed inset-0 z-50 bg-slate-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
                <HardHat className="w-5 h-5 text-amber-700" />
                Cadastrar Colaborador & Ficha NR-31
              </h3>
              <button
                onClick={() => setMostrarModalNovo(false)}
                className="text-slate-600 hover:text-slate-900 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarColaborador} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-900 block mb-1 font-medium">Nome Completo:</label>
                <input
                  type="text"
                  required
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Ex: João Ferreira da Silva"
                  className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">CPF:</label>
                  <input
                    type="text"
                    required
                    value={formCpf}
                    onChange={(e) => setFormCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-2 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Setor de Alocação:</label>
                  <select
                    value={formSetor}
                    onChange={(e) => setFormSetor(e.target.value as ColaboradorRural['setor'])}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-2 text-slate-900"
                  >
                    <option value="LAVOURA">Lavoura (Plantio/Colheita)</option>
                    <option value="OFICINA">Oficina Mecânica</option>
                    <option value="SILOS">Armazenagem & Silos</option>
                    <option value="PECUARIA">Pecuária / Pasto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Função / Cargo:</label>
                  <input
                    type="text"
                    value={formCargo}
                    onChange={(e) => setFormCargo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Data do Exame ASO:</label>
                  <input
                    type="date"
                    value={formDataAso}
                    onChange={(e) => setFormDataAso(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                O colaborador será incluído com vigência de ASO de 12 meses e treinamento de integração NR-31.12 cadastrado para envio automático ao eSocial Rural.
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMostrarModalNovo(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Salvar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NR31SegurancaTrabalhoModule;
