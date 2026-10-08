import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  X,
  Search,
  Filter,
  Layers,
  ArrowRight,
  UserCheck,
  Sliders,
  History
} from 'lucide-react';
import {
  UserRole,
  ROLE_DEFINITIONS,
  RoleGrantsMap,
  loadSavedRoleGrants,
  updateRoleGrantsBySuperadmin,
  syncGrantsWithBackend
} from '../services/rbacService';
import { ALL_MODULES, ModuleItem } from './QuickAccessModal';

interface PerfilAcessoSuperadminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: string;
  onApplyGrants: (updatedGrants: RoleGrantsMap) => void;
  onSimulateRole?: (targetRole: UserRole, targetName: string) => void;
  addToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

export const PerfilAcessoSuperadminModal: React.FC<PerfilAcessoSuperadminModalProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  onApplyGrants,
  onSimulateRole,
  addToast,
}) => {
  const isSuperadmin = currentUserRole.toUpperCase().includes('SUPERADMIN') ||
    currentUserRole.toUpperCase().includes('ADMINISTRADOR GERAL');

  const [activeTab, setActiveTab] = useState<'matriz' | 'usuarios' | 'auditoria'>('matriz');
  const [selectedTargetRole, setSelectedTargetRole] = useState<UserRole>('AGRONOMO');
  const [grants, setGrants] = useState<RoleGrantsMap>(() => loadSavedRoleGrants());
  const [filterCategory, setFilterCategory] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [justificativa, setJustificativa] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Lista de usuários simulados do sistema
  const [usuariosSistema, setUsuariosSistema] = useState([
    {
      id: 'usr-admin',
      nome: 'Dr. Roberto Schneider',
      email: 'admin@superagtech.com.br',
      role: 'SUPERADMIN' as UserRole,
      cargo: 'Superadministrador & Diretor de TI Rural',
      fazenda: 'Diretoria Corporativa AgTech'
    },
    {
      id: 'usr-01',
      nome: 'Carlos Eduardo Silva',
      email: 'produtor@superagtech.com.br',
      role: 'PRODUTOR' as UserRole,
      cargo: 'Produtor Titular & Gestor da Fazenda',
      fazenda: 'Fazenda Santa Maria (Sorriso/MT)'
    },
    {
      id: 'usr-02',
      nome: 'Engª Juliana Prado',
      email: 'agronoma@superagtech.com.br',
      role: 'AGRONOMO' as UserRole,
      cargo: 'Agrônoma Responsável Técnica (RT)',
      fazenda: 'Fazenda Santa Maria (Sorriso/MT)'
    },
    {
      id: 'usr-03',
      nome: 'Valmor Bertoncelli',
      email: 'operador@superagtech.com.br',
      role: 'OPERADOR' as UserRole,
      cargo: 'Chefe de Oficina Mecânica & Frotas',
      fazenda: 'Fazenda Santa Maria (Sorriso/MT)'
    },
    {
      id: 'usr-04',
      nome: 'Dra. Valéria Campos (CRC)',
      email: 'contadora@superagtech.com.br',
      role: 'CONTADOR' as UserRole,
      cargo: 'Contadora Rural & Auditora Fiscal',
      fazenda: 'Fazenda Santa Maria (Sorriso/MT)'
    },
    {
      id: 'usr-05',
      nome: 'Dr. Marcelo Arantes',
      email: 'veterinario@superagtech.com.br',
      role: 'VETERINARIO' as UserRole,
      cargo: 'Médico Veterinário SISBOV',
      fazenda: 'Estância Boi Gordo (Araguaia/GO)'
    }
  ]);

  // Carrega permissões atualizadas
  useEffect(() => {
    if (isOpen) {
      syncGrantsWithBackend().then((backendGrants) => {
        setGrants(backendGrants);
      });
    }
  }, [isOpen]);

  // Definição do papel selecionado
  const targetRoleDef = ROLE_DEFINITIONS[selectedTargetRole] || ROLE_DEFINITIONS.AGRONOMO;
  const currentExtrasForRole = grants[selectedTargetRole]?.extraModuleIds || [];

  // Módulos filtrados para a tabela
  const filteredModules = useMemo(() => {
    return ALL_MODULES.filter((mod) => {
      const matchCategory = filterCategory === 'TODOS' || mod.category === filterCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [filterCategory, searchQuery]);

  // Alterna liberação de um módulo para o perfil atual
  const handleToggleModuleGrant = (moduleId: string) => {
    const isAlreadyExtra = currentExtrasForRole.includes(moduleId);
    const isDefault = targetRoleDef.defaultModuleIds.includes(moduleId);

    if (isDefault) {
      addToast(`O módulo ${moduleId} já é padrão nativo deste perfil.`, 'info');
      return;
    }

    let updatedExtras: string[];
    if (isAlreadyExtra) {
      updatedExtras = currentExtrasForRole.filter((id) => id !== moduleId);
      addToast(`Recurso ${moduleId} revogado do perfil ${targetRoleDef.shortLabel}.`, 'warning');
    } else {
      updatedExtras = [...currentExtrasForRole, moduleId];
      addToast(`Recurso ${moduleId} liberado com sucesso para o perfil ${targetRoleDef.shortLabel}.`, 'success');
    }

    setGrants((prev) => ({
      ...prev,
      [selectedTargetRole]: {
        extraModuleIds: updatedExtras,
        grantedBy: 'SUPERADMIN',
        notes: justificativa || 'Concessão direta pelo Superadmin',
        updatedAt: new Date().toISOString()
      }
    }));
  };

  // Salva e aplica a matriz no backend e localStorage
  const handleSaveGrants = async () => {
    setIsSaving(true);
    try {
      const updated = await updateRoleGrantsBySuperadmin(
        selectedTargetRole,
        currentExtrasForRole,
        justificativa || 'Atualização de permissões pelo Superadmin'
      );
      setGrants(updated);
      onApplyGrants(updated);
      addToast(`Permissões do perfil ${targetRoleDef.shortLabel} salvas e propagadas com sucesso!`, 'success');
    } catch {
      addToast('Erro ao sincronizar com o servidor, mas salvo localmente.', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  // Se não for Superadmin, exibe bloqueio de segurança intransponível
  if (!isSuperadmin) {
    return (
      <div className="fixed inset-0 z-[1200] bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 border border-rose-200 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Acesso Restrito ao Superadmin</h3>
            <p className="text-xs text-slate-600 mt-1">
              O gerenciamento de perfis de acesso e a liberação de recursos é uma atribuição exclusiva
              de usuários com papel <strong>SUPERADMIN</strong>. Seu usuário atual possui privilégios de{' '}
              <span className="font-semibold text-slate-900">{currentUserRole}</span>.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] my-6 overflow-hidden">
        {/* Cabeçalho do Modal Superadmin */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-sm shrink-0">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Governança &amp; Matriz de Perfis de Acesso (RBAC)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 tracking-wide">
                  EXCLUSIVO SUPERADMIN
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Controle estrito de módulos visíveis por perfil e concessão autorizada de recursos entre funções rurais.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Abas Superadmin */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('matriz')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'matriz'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-emerald-700" />
            Matriz de Liberação de Recursos
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'usuarios'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-700" />
            Usuários Cadastrados &amp; Simulação
          </button>

          <button
            onClick={() => setActiveTab('auditoria')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'auditoria'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4 text-emerald-700" />
            Logs de Concessão de Privilégios
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'matriz' && (
            <div className="space-y-6">
              {/* Barra de Seleção do Perfil Alvo */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                  1. Selecione o Perfil para Auditar e Liberar Recursos Extras:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(['PRODUTOR', 'AGRONOMO', 'OPERADOR', 'CONTADOR', 'VETERINARIO'] as UserRole[]).map((roleKey) => {
                    const rDef = ROLE_DEFINITIONS[roleKey];
                    const isSelected = selectedTargetRole === roleKey;
                    const extrasCount = (grants[roleKey]?.extraModuleIds || []).length;

                    return (
                      <button
                        key={roleKey}
                        onClick={() => setSelectedTargetRole(roleKey)}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer relative ${
                          isSelected
                            ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/30'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {rDef.shortLabel}
                          </span>
                          {extrasCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-sky-100 text-sky-800 border border-sky-300">
                              +{extrasCount}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{rDef.badge}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card de Resumo do Perfil Selecionado */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Perfil Ativo: {targetRoleDef.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {targetRoleDef.defaultModuleIds.length} módulos padrão
                    </span>
                    {currentExtrasForRole.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-900 border border-sky-300">
                        {currentExtrasForRole.length} extras liberados
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600">{targetRoleDef.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleSaveGrants}
                    disabled={isSaving}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-2xs transition cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSaving ? 'Salvando...' : 'Salvar Alterações do Perfil'}
                  </button>
                </div>
              </div>

              {/* Justificativa da Liberação */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Justificativa / Observação do Superadmin para este Perfil:
                </label>
                <input
                  type="text"
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  placeholder="Ex: Liberação do módulo de Barter & CPR para apoio técnico na safra 2026..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Filtros e Busca de Módulos */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrar módulo por nome, sigla ou palavra-chave..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {['TODOS', 'CAMPO', 'FROTA', 'MERCADO', 'FISCAL', 'PECUARIA'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer shrink-0 ${
                        filterCategory === cat
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabela da Matriz de Recursos */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-2.5">Módulo da Plataforma</th>
                        <th className="px-4 py-2.5">Domínio</th>
                        <th className="px-4 py-2.5">Status para {targetRoleDef.shortLabel}</th>
                        <th className="px-4 py-2.5 text-right">Ação do Superadmin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredModules.map((mod) => {
                        const isDefault = targetRoleDef.defaultModuleIds.includes(mod.id);
                        const isExtra = currentExtrasForRole.includes(mod.id);
                        const Icon = mod.icon;

                        return (
                          <tr key={mod.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                                  <Icon className="w-4 h-4 text-emerald-700" />
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block leading-tight">
                                    {mod.name}
                                  </span>
                                  <span className="text-[10px] text-slate-500 truncate block">
                                    {mod.fullName}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-2.5">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                {mod.category}
                              </span>
                            </td>

                            <td className="px-4 py-2.5">
                              {isDefault ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                  Nativo do Perfil
                                </span>
                              ) : isExtra ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-900 border border-sky-300">
                                  <Unlock className="w-3 h-3 text-sky-700" />
                                  Liberado pelo Superadmin
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                  <Lock className="w-3 h-3 text-slate-400" />
                                  Bloqueado
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-2.5 text-right">
                              {isDefault ? (
                                <span className="text-[10px] text-slate-400 italic">
                                  Incluso por padrão
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleToggleModuleGrant(mod.id)}
                                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                                    isExtra
                                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                                  }`}
                                >
                                  {isExtra ? 'Revogar Acesso' : 'Liberar Recurso'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usuarios' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Contas e Atribuição de Funções Rurais
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Cada usuário acessa estritamente os recursos vinculados ao seu perfil.
                    Como Superadmin, você pode simular a visão de qualquer conta para validar a experiência.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Usuário &amp; E-mail</th>
                      <th className="px-4 py-3">Papel Operacional</th>
                      <th className="px-4 py-3">Fazenda Vinculada</th>
                      <th className="px-4 py-3">Privilégios Extras</th>
                      <th className="px-4 py-3 text-right">Auditar Visão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {usuariosSistema.map((usr) => {
                      const rDef = ROLE_DEFINITIONS[usr.role];
                      const extras = grants[usr.role]?.extraModuleIds || [];

                      return (
                        <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900 block">{usr.nome}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{usr.email}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                              {rDef?.shortLabel || usr.role}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{usr.cargo}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {usr.fazenda}
                          </td>
                          <td className="px-4 py-3">
                            {extras.length > 0 ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                                {extras.length} recursos extras
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Padrão do perfil</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {onSimulateRole && usr.role !== 'SUPERADMIN' ? (
                              <button
                                onClick={() => {
                                  onSimulateRole(usr.role, usr.nome);
                                  onClose();
                                  addToast(`Simulando visão do perfil ${usr.role} (${usr.nome}).`, 'info');
                                }}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold border border-slate-200 transition cursor-pointer flex items-center gap-1.5 ml-auto"
                              >
                                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                                Testar Visão
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-mono">Conta Mestra</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'auditoria' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-900">
                  Registro Imutável de Concessão de Privilégios RBAC
                </h4>
                <p className="text-[11px] text-slate-600">
                  Histórico de recursos adicionais liberados exclusivamente pelo Superadmin da plataforma.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {(['PRODUTOR', 'AGRONOMO', 'OPERADOR', 'CONTADOR', 'VETERINARIO'] as UserRole[]).map((r) => {
                  const grantItem = grants[r];
                  const extras = grantItem?.extraModuleIds || [];
                  const rDef = ROLE_DEFINITIONS[r];

                  return (
                    <div key={r} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-700" />
                          Perfil: {rDef.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {grantItem?.updatedAt ? new Date(grantItem.updatedAt).toLocaleString('pt-BR') : 'Sem alterações'}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600">
                        {extras.length === 0 ? (
                          <span className="text-slate-400 italic">
                            Nenhum recurso extra liberado. Usuário opera apenas com permissões nativas de fábrica.
                          </span>
                        ) : (
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-800">
                              Módulos extras autorizados:
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {extras.map((id) => (
                                <span
                                  key={id}
                                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200"
                                >
                                  {id}
                                </span>
                              ))}
                            </div>
                            <p className="text-[10px] text-slate-500 pt-1 italic">
                              Autorizado por: <strong>{grantItem.grantedBy}</strong> • Motivo: "{grantItem.notes || 'Sem observações'}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 font-mono">
            SUPER AGTECH RBAC • ISO 27001 / LGPD Em Conformidade
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
};
