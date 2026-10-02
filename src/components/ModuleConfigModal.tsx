import React, { useState, useMemo } from 'react';
import {
  X,
  Check,
  CheckCircle2,
  Sliders,
  Sparkles,
  Layers,
  Search,
  Filter,
  ShieldCheck,
  Wheat,
  Activity,
  ChevronRight,
  Info,
  RefreshCw,
} from 'lucide-react';
import {
  OPERATIONAL_PROFILES,
  AVAILABLE_CULTURES,
  CORE_FOUNDATION_MODULES,
  SubscriptionConfig,
  saveSubscriptionConfig,
  getSavedSubscriptionConfig,
  resolveActiveModuleIds,
} from '../services/subscriptionService';
import { ALL_MODULES, ModuleItem } from './QuickAccessModal';

interface ModuleConfigModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  config?: SubscriptionConfig;
  onConfigChange?: (newConfig: SubscriptionConfig) => void;
}

export const ModuleConfigModal: React.FC<ModuleConfigModalProps> = ({
  isOpen = true,
  onClose = () => {},
  config = getSavedSubscriptionConfig(),
  onConfigChange = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<'PERFIS' | 'CULTURAS' | 'MODULOS'>('PERFIS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('TODOS');

  // Todos os IDs de módulos disponíveis
  const allModuleIds = useMemo(() => ALL_MODULES.map((m) => m.id), []);

  // IDs de módulos atualmente resolvidos como ativos
  const activeModuleSet = useMemo(() => {
    return resolveActiveModuleIds(config, allModuleIds);
  }, [config, allModuleIds]);

  if (isOpen === false) return null;

  // Mudança de Perfil Operacional
  const handleSelectProfile = (profileId: string) => {
    const prof = OPERATIONAL_PROFILES.find((p) => p.id === profileId);
    const newConfig: SubscriptionConfig = {
      ...config,
      profileId,
      // Se tiver culturas sugeridas para este perfil, adota-as
      selectedCultures: prof ? [...prof.suggestedCultures] : config.selectedCultures,
      updatedAt: new Date().toISOString(),
    };
    saveSubscriptionConfig(newConfig);
    onConfigChange(newConfig);
  };

  // Alternância de Cultura Agrícola / Pecuária
  const handleToggleCulture = (cultureId: string) => {
    const exists = config.selectedCultures.includes(cultureId);
    let updatedCultures: string[];
    if (exists) {
      updatedCultures = config.selectedCultures.filter((c) => c !== cultureId);
    } else {
      updatedCultures = [...config.selectedCultures, cultureId];
    }

    const newConfig: SubscriptionConfig = {
      ...config,
      selectedCultures: updatedCultures,
      updatedAt: new Date().toISOString(),
    };
    saveSubscriptionConfig(newConfig);
    onConfigChange(newConfig);
  };

  // Alternância manual de módulo individual
  const handleToggleModule = (moduleId: string) => {
    const isCurrentlyActive = activeModuleSet.has(moduleId);
    let updatedCustom = [...config.customModuleIds];

    if (isCurrentlyActive) {
      // Para desativar quando é ativado por padrão de perfil:
      // Se já estava em customModuleIds, removemos
      updatedCustom = updatedCustom.filter((id) => id !== moduleId);
      // Se o perfil for ENTERPRISE_FULL e desmarcamos um, mudamos perfil para CUSTOM
      if (config.profileId === 'ENTERPRISE_FULL') {
        const remaining = allModuleIds.filter((id) => id !== moduleId);
        const newConfig: SubscriptionConfig = {
          profileId: 'CUSTOM_CULTURAS',
          customModuleIds: remaining,
          selectedCultures: config.selectedCultures,
          updatedAt: new Date().toISOString(),
        };
        saveSubscriptionConfig(newConfig);
        onConfigChange(newConfig);
        return;
      }
    } else {
      // Ativar módulo individualmente
      if (!updatedCustom.includes(moduleId)) {
        updatedCustom.push(moduleId);
      }
    }

    const newConfig: SubscriptionConfig = {
      ...config,
      customModuleIds: updatedCustom,
      updatedAt: new Date().toISOString(),
    };
    saveSubscriptionConfig(newConfig);
    onConfigChange(newConfig);
  };

  // Ativar todos os 135 módulos
  const handleEnableAll = () => {
    handleSelectProfile('ENTERPRISE_FULL');
  };

  // Módulos filtrados para busca na aba MODULOS
  const filteredModules = ALL_MODULES.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategoryFilter === 'TODOS' || m.category === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const activeProfile = OPERATIONAL_PROFILES.find((p) => p.id === config.profileId) || OPERATIONAL_PROFILES[0];
  const activeCount = activeModuleSet.size;
  const percentageActive = Math.round((activeCount / ALL_MODULES.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white border border-[#EAF4E7] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#26332A]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header do Modal */}
        <div className="px-6 py-4 bg-[#F7F9F5] border-b border-[#EAF4E7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1D4B38]">
                  Configuração Modular de Atividades & Módulos
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Atividade do Cliente
                </span>
              </div>
              <p className="text-xs text-[#66736A]">
                Personalize o sistema para exibir exclusivamente os módulos contratados e pertinentes à atividade da sua fazenda.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo do Status Atual (Indicador de Módulos Ativos) */}
        <div className="px-6 py-3 bg-[#F7F9F5] border-b border-[#EAF4E7] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Perfil em Uso:</span>
            <span className="px-2.5 py-1 rounded-md font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span>{activeProfile.icon}</span>
              <span>{activeProfile.name}</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-semibold">
              <strong className="text-emerald-400">{activeCount}</strong> de {ALL_MODULES.length} módulos ativos ({percentageActive}%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEnableAll}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-[#8FBF88] transition-all cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Habilitar Todos (135)</span>
            </button>
          </div>
        </div>

        {/* Abas de Configuração */}
        <div className="flex border-b border-[#EAF4E7] bg-white px-6 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('PERFIS')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'PERFIS'
                ? 'border-[#285943] text-[#1D4B38] font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>1. Perfis de Atividade ({OPERATIONAL_PROFILES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('CULTURAS')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'CULTURAS'
                ? 'border-[#285943] text-[#1D4B38] font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>2. Culturas & Criações ({AVAILABLE_CULTURES.length})</span>
            {config.selectedCultures.length > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full">
                {config.selectedCultures.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('MODULOS')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'MODULOS'
                ? 'border-[#285943] text-[#1D4B38] font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>3. Ajuste Fino por Módulo ({activeCount}/{ALL_MODULES.length})</span>
          </button>
        </div>

        {/* Conteúdo Dinâmico por Aba */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* ABA 1: PERFIS DE ATIVIDADE OPERACIONAL */}
          {activeTab === 'PERFIS' && (
            <div className="space-y-4">
              <div className="bg-[#F4F0E6] p-3.5 rounded-xl border border-[#EAF4E7] text-xs text-slate-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Selecione o perfil que melhor corresponde ao modelo de negócios e contrato da sua fazenda. O sistema automaticamente ocultará telas, gráficos e fluxos que não fazem parte da sua rotina diária.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {OPERATIONAL_PROFILES.map((prof) => {
                  const isSelected = config.profileId === prof.id;

                  return (
                    <div
                      key={prof.id}
                      onClick={() => handleSelectProfile(prof.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#EAF4E7] border-[#285943] shadow-md ring-1 ring-[#285943]/20'
                          : 'bg-[#F7F9F5] border-[#EAF4E7] hover:border-[#8FBF88] hover:bg-[#EAF4E7]/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{prof.icon}</span>
                            <div>
                              <h3 className="font-bold text-sm text-[#1D4B38]">{prof.name}</h3>
                              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                                {prof.badge}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="p-1 rounded-full bg-emerald-500 text-slate-950">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#66736A] leading-relaxed mb-3">
                          {prof.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#EAF4E7]/60 flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          {prof.defaultModules.includes('*')
                            ? '135 módulos ativos'
                            : `~${prof.defaultModules.length} módulos essenciais`}
                        </span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          {isSelected ? 'Perfil Ativo' : 'Ativar Este Perfil'}
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA 2: CULTURAS E CRIAÇÕES ESPECÍFICAS */}
          {activeTab === 'CULTURAS' && (
            <div className="space-y-4">
              <div className="bg-[#F4F0E6] p-3.5 rounded-xl border border-[#EAF4E7] text-xs text-slate-300 flex items-start gap-2.5">
                <Wheat className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Marque as culturas e criações exploradas nas suas unidades produtivas. Cada seleção habilita de forma inteligente os módulos técnicos correlatos (ex: Soja ativa Fixação Biológica e Nematóides; Bovinos ativa Zootecnia e SISBOV).
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {AVAILABLE_CULTURES.map((cult) => {
                  const isChecked = config.selectedCultures.includes(cult.id);

                  return (
                    <div
                      key={cult.id}
                      onClick={() => handleToggleCulture(cult.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/70 text-white shadow-sm'
                          : 'bg-[#F7F9F5]/40 border-[#EAF4E7] text-slate-400 hover:border-[#8FBF88] hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{cult.icon}</span>
                        <div>
                          <div className="font-bold text-xs text-white">{cult.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {cult.associatedModules.length} módulos técnicos
                          </div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-[#8FBF88] bg-slate-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA 3: AJUSTE FINO POR MÓDULO INDIVIDUAL */}
          {activeTab === 'MODULOS' && (
            <div className="space-y-4">
              {/* Filtros e Barra de Pesquisa */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filtrar módulos por nome ou tag..."
                    className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-2 text-slate-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filtro por categoria */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-[11px]">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Categoria:</span>
                  {(['TODOS', 'CAMPO', 'FROTA', 'MERCADO', 'FISCAL', 'PECUARIA'] as const).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={`px-2 py-1 rounded-md transition-all cursor-pointer font-semibold ${
                          selectedCategoryFilter === cat
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#F7F9F5] text-slate-400 hover:text-white border border-[#EAF4E7]'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Lista de Módulos com Toggle Individual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {filteredModules.map((mod) => {
                  const Icon = mod.icon;
                  const isEnabled = activeModuleSet.has(mod.id);
                  const isCore = CORE_FOUNDATION_MODULES.includes(mod.id);

                  return (
                    <div
                      key={mod.id}
                      onClick={() => !isCore && handleToggleModule(mod.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        isCore
                          ? 'bg-[#F7F9F5]/60 border-[#EAF4E7] opacity-90 cursor-default'
                          : isEnabled
                          ? 'bg-emerald-950/20 border-emerald-500/50 hover:border-emerald-500 cursor-pointer'
                          : 'bg-[#F7F9F5]/40 border-[#EAF4E7]/80 hover:border-[#8FBF88] opacity-60 hover:opacity-100 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isEnabled
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white truncate">
                              {mod.name}
                            </span>
                            {mod.badge && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-slate-800 text-slate-300 border border-[#8FBF88] shrink-0">
                                {mod.badge}
                              </span>
                            )}
                            {isCore && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800 shrink-0">
                                Essencial
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">
                            {mod.fullName}
                          </p>
                        </div>
                      </div>

                      {/* Switch Toggle */}
                      <div className="shrink-0 flex items-center">
                        {isCore ? (
                          <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded bg-slate-900 border border-[#EAF4E7]">
                            Fixo
                          </span>
                        ) : (
                          <div
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                              isEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                                isEnabled ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
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

        {/* Rodapé do Modal */}
        <div className="px-6 py-3.5 bg-[#F7F9F5] border-t border-[#EAF4E7] flex items-center justify-between text-xs">
          <div className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Configurações salvas localmente e sincronizadas com o banco de dados da fazenda.
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Aplicar e Visualizar Módulos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
