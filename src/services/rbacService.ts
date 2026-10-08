/**
 * Super AgTech Platform - RBAC (Role-Based Access Control) & Governança de Perfis
 * 
 * Regra de Negócio Enterprise:
 * 1. O perfil de acesso e gerenciamento de permissões está disponível APENAS para SUPERADMIN.
 * 2. Cada usuário visualiza apenas os módulos e recursos do sistema de acordo com o perfil cadastrado:
 *    - PRODUTOR: Apenas recursos para produtor rural (Gestão, Comercialização, Custos, Contratos, etc.)
 *    - AGRONOMO: Apenas recursos agronômicos (MIP, VRA, Solo, Nutrição, Clima, ZARC, Receituário, etc.)
 *    - OPERADOR: Apenas recursos de campo e frotas (Telemetria CAN bus, Cockpit Mobile, Oficina, OEE, etc.)
 *    - CONTADOR: Apenas recursos fiscais e contábeis (LCDPR, SEFAZ NF-e 55, DRE Custos, Funrural, etc.)
 *    - VETERINARIO: Apenas recursos pecuários (SISBOV RFID, Confinamento, Zootecnia, Dejetos, etc.)
 *    - SUPERADMIN: Acesso total irrestrito + Cockpit de Gestão de Perfis e Matriz de Liberação de Recursos.
 * 3. Caso algum perfil necessite de recursos presentes em outros perfis, estes devem ser
 *    LIBERADOS EXCLUSIVAMENTE pelo Usuário SUPERADMIN. Somente ele tem autoridade para conceder e revogar.
 */

export type UserRole =
  | 'SUPERADMIN'
  | 'PRODUTOR'
  | 'AGRONOMO'
  | 'OPERADOR'
  | 'CONTADOR'
  | 'VETERINARIO';

export interface RoleFeatureGrant {
  extraModuleIds: string[];
  grantedBy: string;
  notes?: string;
  updatedAt: string;
}

export type RoleGrantsMap = Record<string, RoleFeatureGrant>;

export interface RoleDefinition {
  id: UserRole;
  label: string;
  shortLabel: string;
  badge: string;
  description: string;
  avatarInitials: string;
  defaultEmail: string;
  defaultModuleIds: string[];
}

/**
 * Módulos nativos padrão atribuídos a cada papel operacional
 */
export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  SUPERADMIN: {
    id: 'SUPERADMIN',
    label: 'Superadministrador da Plataforma (Governança Total)',
    shortLabel: 'Superadmin',
    badge: 'Controle Total & Matriz RBAC',
    description: 'Acesso irrestrito a todos os módulos da plataforma, auditoria, concessão de permissões extras e governança.',
    avatarInitials: 'SA',
    defaultEmail: 'admin@superagtech.com.br',
    defaultModuleIds: [
      // SUPERADMIN tem acesso a todos os módulos nativamente
      'BI', 'COPILOT', 'SIG', 'MOBILE', 'CLIMA', 'FROTA', 'OFICINA', 'NR31',
      'FISCAL', 'ESTOQUE', 'DRE_COMBOIO', 'RELATORIO', 'CREDITO', 'SEGURO',
      'PRECISAO', 'DRONE', 'IRRIGACAO', 'SOLAR', 'RECEITUARIO', 'INPEV', 'MIP',
      'ESG', 'SEMENTES', 'CARBONO', 'NUTRICAO', 'PERDAS_COLHEITA', 'BIOFABRICA',
      'COMPOSTAGEM', 'ROCHAGEM', 'COBERTURA', 'PRODUTIVIDADE_PREDITIVA', 'COMPACTACAO_SOLO',
      'BIOANALISE_SOLO', 'ENSAIO_VARIEDADES', 'FBN_NITROGENIO', 'DEJETOS_SUINOS',
      'NEMATOIDES', 'DANINHAS_RESISTENTES', 'FUNGICIDAS_MANEJO', 'FERTIRRIGACAO_PIVO',
      'ALGODAO_HVI', 'CAFEICULTURA_ESPECIAL', 'CANA_DE_ACUCAR_ATR', 'DESCONTAMINACAO',
      'PONTAS_PULVERIZACAO', 'UNIFORMIDADE_PLANTIO', 'OEE_FROTAS', 'DISTRIBUICAO_ADUBO',
      'BARTER', 'HEDGE_CAMBIAL', 'RENOVABIO_CBIOS', 'COLHEITA', 'SILOS', 'LOGISTICA',
      'SENSIBILIDADE', 'ARRENDAMENTO', 'ZOOTECNIA', 'ILPF', 'CONFINAMENTO',
      'SILAGEM_FORRAGEM', 'BIODIGESTOR_BIOMETANO', 'PISCICULTURA_AQUICULTURA',
      'SILVICULTURA_IMA', 'MERCADO_CARBONO_SBCE', 'APICULTURA_POLINIZACAO',
      'HEVEICULTURA_BORRACHA', 'VITIVINICULTURA_PRECISAO', 'OVINOCULTURA_CAPRINOS',
      'CITRICULTURA_PRECISAO', 'AVICULTURA_CLIMATIZADA', 'ORIZICULTURA_ARROZ',
      'CACAULICULTURA_CABRUCA', 'BOVINOCULTURA_LEITE', 'OLIVICULTURA_AZEITE',
      'OLERICULTURA_HF', 'SUINOCULTURA_PRECISAO', 'MANDIOCULTURA_AMIDO',
      'LUPULICULTURA_CERVEJA', 'BANANICULTURA_CLIMATIZADA', 'CONFINAMENTO_CORDEIROS',
      'BOVINOCULTURA_SISBOV_RFID', 'SEFAZ_GEO_AUDITOR', 'BARTER_MULTI_COMMODITY_CPR',
      'TORRE_LOGISTICA', 'OEM_TELEMATICS', 'ZONEAMENTO_RISCO_ZARC', 'ARMAZENAGEM_TERMOMETRIA_ORVALHO'
    ]
  },

  PRODUTOR: {
    id: 'PRODUTOR',
    label: 'Produtor Rural & Gestor Titular',
    shortLabel: 'Produtor',
    badge: 'Gestão da Propriedade',
    description: 'Focado em governança da fazenda, viabilidade financeira, cotações, comercialização de safras, contratos e visão executiva.',
    avatarInitials: 'PR',
    defaultEmail: 'produtor@superagtech.com.br',
    defaultModuleIds: [
      'BI',
      'COPILOT',
      'SIG',
      'MOBILE',
      'CLIMA',
      'BARTER',
      'BARTER_MULTI_COMMODITY_CPR',
      'HEDGE_CAMBIAL',
      'CREDITO',
      'SEGURO',
      'COLHEITA',
      'SILOS',
      'ARMAZENAGEM_TERMOMETRIA_ORVALHO',
      'DRE_COMBOIO',
      'ARRENDAMENTO',
      'RELATORIO',
      'ESG',
      'CARBONO',
      'ZONEAMENTO_RISCO_ZARC',
      'ESTOQUE'
    ]
  },

  AGRONOMO: {
    id: 'AGRONOMO',
    label: 'Engenheiro Agrônomo & Responsável Técnico (RT)',
    shortLabel: 'Agrônomo',
    badge: 'Manejo de Lavouras & Solo',
    description: 'Focado em saúde vegetal, fertilidade do solo, prescrições de adubação VRA, MIP, receituário agronômico e estimativas de safra.',
    avatarInitials: 'AG',
    defaultEmail: 'agronoma@superagtech.com.br',
    defaultModuleIds: [
      'BI',
      'COPILOT',
      'SIG',
      'CLIMA',
      'PRECISAO',
      'MIP',
      'RECEITUARIO',
      'INPEV',
      'SEMENTES',
      'NUTRICAO',
      'BIOANALISE_SOLO',
      'ROCHAGEM',
      'COBERTURA',
      'FBN_NITROGENIO',
      'NEMATOIDES',
      'DANINHAS_RESISTENTES',
      'FUNGICIDAS_MANEJO',
      'PONTAS_PULVERIZACAO',
      'DESCONTAMINACAO',
      'UNIFORMIDADE_PLANTIO',
      'COMPACTACAO_SOLO',
      'ENSAIO_VARIEDADES',
      'PRODUTIVIDADE_PREDITIVA',
      'ZONEAMENTO_RISCO_ZARC',
      'BIOFABRICA',
      'MICORRIZAS_BIOINSUMOS',
      'DRONE',
      'IRRIGACAO',
      'FERTIRRIGACAO_PIVO',
      'PERDAS_COLHEITA'
    ]
  },

  OPERADOR: {
    id: 'OPERADOR',
    label: 'Chefe de Frotas & Operador de Máquinas',
    shortLabel: 'Operador / Frotas',
    badge: 'Maquinário & Oficina',
    description: 'Focado em telemetria CAN bus J1939, manutenção preventiva de máquinas, apontamento de campo e segurança do trabalho NR-31.',
    avatarInitials: 'OP',
    defaultEmail: 'operador@superagtech.com.br',
    defaultModuleIds: [
      'MOBILE',
      'FROTA',
      'OFICINA',
      'NR31',
      'OEE_FROTAS',
      'DRE_COMBOIO',
      'ESTOQUE',
      'DISTRIBUICAO_ADUBO',
      'PONTAS_PULVERIZACAO',
      'DESCONTAMINACAO',
      'OEM_TELEMATICS',
      'TORRE_LOGISTICA',
      'DRONE'
    ]
  },

  CONTADOR: {
    id: 'CONTADOR',
    label: 'Contador Rural & Auditor Fiscal Tributário',
    shortLabel: 'Contador / Fiscal',
    badge: 'Livro Caixa & SEFAZ NF-e',
    description: 'Focado em Livro Caixa Digital do Produtor Rural (LCDPR), emissão SEFAZ Modelo 55, Funrural/Senar e conciliação societária.',
    avatarInitials: 'CT',
    defaultEmail: 'contadora@superagtech.com.br',
    defaultModuleIds: [
      'FISCAL',
      'SEFAZ_GEO_AUDITOR',
      'DRE_COMBOIO',
      'ARRENDAMENTO',
      'BARTER',
      'BARTER_MULTI_COMMODITY_CPR',
      'CREDITO',
      'SEGURO',
      'RELATORIO',
      'ESTOQUE',
      'BI'
    ]
  },

  VETERINARIO: {
    id: 'VETERINARIO',
    label: 'Médico Veterinário & Zootecnista RT',
    shortLabel: 'Veterinário / Pecuária',
    badge: 'Zootecnia & SISBOV RFID',
    description: 'Focado em rastreabilidade animal individual SISBOV, manejo de confinamento, nutrição animal, sanidade e gestão de dejetos.',
    avatarInitials: 'VT',
    defaultEmail: 'veterinario@superagtech.com.br',
    defaultModuleIds: [
      'ZOOTECNIA',
      'CONFINAMENTO',
      'BOVINOCULTURA_SISBOV_RFID',
      'BOVINOCULTURA_LEITE',
      'CONFINAMENTO_CORDEIROS',
      'OVINOCULTURA_CAPRINOS',
      'SUINOCULTURA_PRECISAO',
      'SUINOCULTURA_MATERNIDADE',
      'DEJETOS_SUINOS',
      'AVICULTURA_CLIMATIZADA',
      'AVICULTURA_POSTURA_OVOS',
      'PISCICULTURA_AQUICULTURA',
      'CARCINICULTURA_BIOFLOCOS',
      'TAINHA_AQUICULTURA_ESTUARINA',
      'MARICULTURA_OSTRAS',
      'BUBALINOCULTURA_QUEIJO',
      'ILPF',
      'SILAGEM_FORRAGEM',
      'PALMA_FORRAGEIRA',
      'COMPOSTAGEM'
    ]
  }
};

const STORAGE_KEY_GRANTS = 'agtech_rbac_custom_grants_v2';

/**
 * Normaliza qualquer string de cargo/perfil para um UserRole válido
 */
export function normalizeUserRole(rawRole?: string): UserRole {
  if (!rawRole) return 'PRODUTOR';
  const upper = rawRole.toUpperCase();
  if (upper.includes('SUPERADMIN') || upper.includes('ADMINISTRADOR GERAL') || upper.includes('SUPER ADMIN')) {
    return 'SUPERADMIN';
  }
  if (upper.includes('AGRON') || upper.includes('MIP') || upper.includes('RT TECNICO')) {
    return 'AGRONOMO';
  }
  if (upper.includes('OPERADOR') || upper.includes('FROTA') || upper.includes('OFICINA') || upper.includes('MECANIC')) {
    return 'OPERADOR';
  }
  if (upper.includes('CONTAD') || upper.includes('FISCAL') || upper.includes('CRC') || upper.includes('LCDPR')) {
    return 'CONTADOR';
  }
  if (upper.includes('VETER') || upper.includes('ZOOTEC') || upper.includes('SISBOV') || upper.includes('PECUAR')) {
    return 'VETERINARIO';
  }
  return 'PRODUTOR';
}

/**
 * Verifica se o usuário autenticado possui poderes de Superadmin
 */
export function isSuperAdmin(role?: string): boolean {
  return normalizeUserRole(role) === 'SUPERADMIN';
}

/**
 * Carrega a matriz de permissões extras concedidas pelo Superadmin
 */
export function loadSavedRoleGrants(): RoleGrantsMap {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(STORAGE_KEY_GRANTS);
      if (data) {
        return JSON.parse(data);
      }
    }
  } catch (err) {
    console.warn('[RBAC] Falha ao carregar grants locais:', err);
  }

  // Padrão inicial vazio (cada perfil vê estritamente o seu)
  return {
    PRODUTOR: { extraModuleIds: [], grantedBy: 'SUPERADMIN', updatedAt: new Date().toISOString() },
    AGRONOMO: { extraModuleIds: [], grantedBy: 'SUPERADMIN', updatedAt: new Date().toISOString() },
    OPERADOR: { extraModuleIds: [], grantedBy: 'SUPERADMIN', updatedAt: new Date().toISOString() },
    CONTADOR: { extraModuleIds: [], grantedBy: 'SUPERADMIN', updatedAt: new Date().toISOString() },
    VETERINARIO: { extraModuleIds: [], grantedBy: 'SUPERADMIN', updatedAt: new Date().toISOString() }
  };
}

/**
 * Salva a matriz de permissões extras concedidas pelo Superadmin
 */
export function saveRoleGrants(grants: RoleGrantsMap): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY_GRANTS, JSON.stringify(grants));
    }
  } catch (err) {
    console.error('[RBAC] Erro ao persistir grants locais:', err);
  }
}

/**
 * Sincroniza a matriz de concessões com o backend persistente
 */
export async function syncGrantsWithBackend(): Promise<RoleGrantsMap> {
  try {
    const res = await fetch('/api/v1/rbac/grants');
    if (res.ok) {
      const json = await res.json();
      if (json.grants && Object.keys(json.grants).length > 0) {
        saveRoleGrants(json.grants);
        return json.grants;
      }
    }
  } catch (err) {
    console.warn('[RBAC] Backend offline, utilizando cache de permissões do navegador:', err);
  }
  return loadSavedRoleGrants();
}

/**
 * Atualiza e salva concessões extras de um perfil (Apenas Superadmin)
 */
export async function updateRoleGrantsBySuperadmin(
  targetRole: UserRole,
  extraModuleIds: string[],
  notes: string = 'Recursos extras liberados pelo Superadmin'
): Promise<RoleGrantsMap> {
  const currentGrants = loadSavedRoleGrants();
  currentGrants[targetRole] = {
    extraModuleIds,
    grantedBy: 'SUPERADMIN',
    notes,
    updatedAt: new Date().toISOString()
  };
  saveRoleGrants(currentGrants);

  try {
    await fetch('/api/v1/rbac/grant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: targetRole,
        extraModuleIds,
        grantedBy: 'SUPERADMIN',
        notes
      })
    });
  } catch (err) {
    console.warn('[RBAC] Falha ao sincronizar concessão com API remota:', err);
  }

  return currentGrants;
}

/**
 * Resolve o conjunto efetivo de módulos permitidos para um papel.
 * Se for SUPERADMIN, retorna allAvailableModuleIds.
 * Se for outro perfil, retorna defaultModules do perfil + extraModuleIds liberados pelo Superadmin.
 */
export function resolveEffectiveModulesForUser(
  rawRole: string | undefined,
  allAvailableModuleIds: string[],
  grantsMap?: RoleGrantsMap
): Set<string> {
  const role = normalizeUserRole(rawRole);
  if (role === 'SUPERADMIN') {
    return new Set(allAvailableModuleIds);
  }

  const grants = grantsMap || loadSavedRoleGrants();
  const def = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.PRODUTOR;
  const baseModules = def.defaultModuleIds;
  const extras = grants[role]?.extraModuleIds || [];

  return new Set([...baseModules, ...extras]);
}

/**
 * Verifica se um usuário com dado papel tem permissão para acessar um módulo específico
 */
export function canUserAccessModule(
  rawRole: string | undefined,
  moduleId: string,
  allAvailableModuleIds: string[],
  grantsMap?: RoleGrantsMap
): boolean {
  const allowedSet = resolveEffectiveModulesForUser(rawRole, allAvailableModuleIds, grantsMap);
  return allowedSet.has(moduleId);
}
