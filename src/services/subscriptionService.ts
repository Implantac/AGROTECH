/**
 * Super AgTech Platform - Gerenciador de Subscrição Modular & Atividades do Produtor
 * Permite habilitar e filtrar módulos de acordo com o contrato e atividade operacional
 * do cliente (Pecuarista, Agricultor de Grãos, HF/Hortifrúti, Sucroalcooleiro, Misto/ILPF, etc.)
 */

export interface AgriculturalCulture {
  id: string;
  name: string;
  category: 'GRAOS' | 'FIBRAS' | 'PECUARIA' | 'FRUTICULTURA' | 'HORTIFRUTI' | 'BIOENERGIA' | 'AQUICULTURA' | 'FLORESTAL' | 'ESPECIAIS';
  icon: string;
  associatedModules: string[];
}

export interface OperationalProfile {
  id: string;
  name: string;
  shortLabel: string;
  badge: string;
  icon: string;
  description: string;
  defaultModules: string[];
  suggestedCultures: string[];
}

export interface SubscriptionConfig {
  profileId: string;
  customModuleIds: string[];
  selectedCultures: string[];
  updatedAt: string;
}

// Módulos corporativos transversais (essenciais para qualquer negócio rural)
export const CORE_FOUNDATION_MODULES = [
  'BI',
  'COPILOT',
  'MOBILE',
  'CLIMA',
  'SIG',
  'FROTA',
  'OFICINA',
  'NR31',
  'FISCAL',
  'ESTOQUE',
  'DRE_COMBOIO',
  'RELATORIO',
  'CREDITO',
  'SEGURO',
];

// Culturas agrícolas e pecuárias disponíveis para ativação
export const AVAILABLE_CULTURES: AgriculturalCulture[] = [
  {
    id: 'SOJA',
    name: 'Soja',
    category: 'GRAOS',
    icon: '🌱',
    associatedModules: [
      'PRECISAO', 'MIP', 'SEMENTES', 'CARBONO', 'NUTRICAO', 'PERDAS_COLHEITA',
      'BIOFABRICA', 'ROCHAGEM', 'FBN_NITROGENIO', 'NEMATOIDES', 'DANINHAS_RESISTENTES',
      'FUNGICIDAS_MANEJO', 'DESCONTAMINACAO', 'PONTAS_PULVERIZACAO', 'UNIFORMIDADE_PLANTIO',
      'PRODUTIVIDADE_PREDITIVA', 'ZONEAMENTO_RISCO_ZARC', 'MICORRIZAS_BIOINSUMOS',
      'COLHEITA', 'SILOS', 'BARTER', 'HEDGE_CAMBIAL', 'ARMAZENAGEM_TERMOMETRIA_ORVALHO',
      'BARTER_MULTI_COMMODITY_CPR'
    ]
  },
  {
    id: 'MILHO',
    name: 'Milho (Safra & Safrinha)',
    category: 'GRAOS',
    icon: '🌽',
    associatedModules: [
      'PRECISAO', 'MIP', 'SEMENTES', 'SILAGEM_FORRAGEM', 'PERDAS_COLHEITA',
      'COMPACTACAO_SOLO', 'ENSAIO_VARIEDADES', 'ZONEAMENTO_RISCO_ZARC', 'COLHEITA',
      'SILOS', 'BARTER', 'HEDGE_CAMBIAL', 'ARMAZENAGEM_TERMOMETRIA_ORVALHO', 'ILPF'
    ]
  },
  {
    id: 'ALGODAO',
    name: 'Algodão em Pluma',
    category: 'FIBRAS',
    icon: '☁️',
    associatedModules: [
      'PRECISAO', 'MIP', 'ALGODAO_HVI', 'ALGODAO_HVI_CLASSIFICACAO', 'REGULADORES_CRESCIMENTO',
      'PONTAS_PULVERIZACAO', 'COLHEITA', 'PERDAS_COLHEITA', 'HEDGE_CAMBIAL', 'BARTER'
    ]
  },
  {
    id: 'BOVINO_CORTE',
    name: 'Bovinocultura de Corte & Confinamento',
    category: 'PECUARIA',
    icon: '🐂',
    associatedModules: [
      'ZOOTECNIA', 'CONFINAMENTO', 'BOVINOCULTURA_SISBOV_RFID', 'ILPF',
      'SILAGEM_FORRAGEM', 'PALMA_FORRAGEIRA', 'SOLAR', 'COMPOSTAGEM'
    ]
  },
  {
    id: 'BOVINO_LEITE',
    name: 'Bovinocultura de Leite',
    category: 'PECUARIA',
    icon: '🥛',
    associatedModules: [
      'BOVINOCULTURA_LEITE', 'ZOOTECNIA', 'SILAGEM_FORRAGEM', 'BUBALINOCULTURA_QUEIJO',
      'COMPOSTAGEM', 'SOLAR'
    ]
  },
  {
    id: 'CANA',
    name: 'Cana-de-Açúcar, Etanol & CBIO',
    category: 'BIOENERGIA',
    icon: '🎋',
    associatedModules: [
      'CANA_DE_ACUCAR_ATR', 'MOENDA_DIFUSOR_CANA_EXTRACAO', 'RENOVABIO_CBIOS',
      'RENOVABIO_CALCULADORA_CBIO', 'BIODIGESTOR_BIOMETANO', 'FERTIRRIGACAO_PIVO',
      'OEE_FROTAS', 'MERCADO_CARBONO_SBCE'
    ]
  },
  {
    id: 'CAFE',
    name: 'Café Especial & Conilon',
    category: 'FRUTICULTURA',
    icon: '☕',
    associatedModules: [
      'CAFEICULTURA_ESPECIAL', 'IRRIGACAO', 'NUTRICAO', 'PONTAS_PULVERIZACAO',
      'PERDAS_COLHEITA', 'BARTER', 'SOLAR'
    ]
  },
  {
    id: 'CACAU',
    name: 'Cacau Fino & Cabruca',
    category: 'FRUTICULTURA',
    icon: '🍫',
    associatedModules: [
      'CACAULICULTURA_CABRUCA', 'CACAU_FINO_FERMENTACAO', 'ESG', 'CARBONO', 'IRRIGACAO'
    ]
  },
  {
    id: 'SUINOS',
    name: 'Suinocultura Integrada',
    category: 'PECUARIA',
    icon: '🐖',
    associatedModules: [
      'SUINOCULTURA_PRECISAO', 'SUINOCULTURA_MATERNIDADE', 'DEJETOS_SUINOS',
      'BIODIGESTOR_BIOMETANO', 'COMPOSTAGEM'
    ]
  },
  {
    id: 'AVES',
    name: 'Avicultura (Corte & Postura)',
    category: 'PECUARIA',
    icon: '🐔',
    associatedModules: [
      'AVICULTURA_CLIMATIZADA', 'AVICULTURA_POSTURA_OVOS', 'COMPOSTAGEM', 'SOLAR'
    ]
  },
  {
    id: 'OVINOS_CAPRINOS',
    name: 'Ovinos & Caprinos (Corte & Queijo)',
    category: 'PECUARIA',
    icon: '🐐',
    associatedModules: [
      'OVINOCULTURA_CAPRINOS', 'CONFINAMENTO_CORDEIROS', 'CAPRINOCULTURA_QUEIJOS',
      'CAPRINOCULTURA_QUEIJOS_MATURADOS'
    ]
  },
  {
    id: 'HF_HORTIFRUTI',
    name: 'Hortifrúti, Olericultura & Estufas',
    category: 'HORTIFRUTI',
    icon: '🥬',
    associatedModules: [
      'OLERICULTURA_HF', 'CULTIVO_PROTEGIDO_HIDROPONIA', 'FAZENDAS_VERTICAIS_AEROPONIA',
      'BATATICULTURA_CHIPS', 'CEBOLA_ALHO_CURA', 'BANANICULTURA_CLIMATIZADA',
      'PITAIA_PRECISAO', 'CITRICULTURA_PRECISAO', 'AZEITONAS_MESA_PROCESSAMENTO',
      'OLIVICULTURA_AZEITE', 'FERTIRRIGACAO_INJECAO_MULTICANAL', 'IRRIGACAO'
    ]
  },
  {
    id: 'UVA_VINHO',
    name: 'Vitivinicultura & Vinhos',
    category: 'FRUTICULTURA',
    icon: '🍇',
    associatedModules: [
      'VITIVINICULTURA_PRECISAO', 'VINHOS_FINOS_DUPLA_PODA', 'IRRIGACAO', 'REGULADORES_CRESCIMENTO'
    ]
  },
  {
    id: 'AQUICULTURA',
    name: 'Aquicultura (Peixes, Camarão & Ostras)',
    category: 'AQUICULTURA',
    icon: '🐟',
    associatedModules: [
      'PISCICULTURA_AQUICULTURA', 'CARCINICULTURA_BIOFLOCOS', 'TAINHA_AQUICULTURA_ESTUARINA',
      'MARICULTURA_OSTRAS', 'CARBONO_AZUL_MARINHO', 'RANICULTURA_SUSTENTAVEL'
    ]
  },
  {
    id: 'SILVICULTURA',
    name: 'Silvicultura & Eucalipto',
    category: 'FLORESTAL',
    icon: '🌲',
    associatedModules: [
      'SILVICULTURA_IMA', 'CARBONO', 'MERCADO_CARBONO_SBCE', 'ILPF'
    ]
  },
  {
    id: 'ARROZ',
    name: 'Orizicultura (Arroz Irrigado)',
    category: 'GRAOS',
    icon: '🌾',
    associatedModules: [
      'ORIZICULTURA_ARROZ', 'IRRIGACAO', 'COLHEITA', 'SILOS'
    ]
  },
  {
    id: 'GERGELIM',
    name: 'Gergelim Segunda Safra',
    category: 'GRAOS',
    icon: '⚪',
    associatedModules: [
      'GERGELIM_SEGUNDA_SAFRA', 'COLHEITA', 'SILOS', 'BARTER'
    ]
  },
  {
    id: 'MEL_ABELHAS',
    name: 'Apicultura & Abelhas Nativas (ASF)',
    category: 'ESPECIAIS',
    icon: '🐝',
    associatedModules: [
      'APICULTURA_POLINIZACAO', 'MELIPONICULTURA_ASF'
    ]
  }
];

// Perfis Operacionais de Clientes (Pacotes de Contratação Modular)
export const OPERATIONAL_PROFILES: OperationalProfile[] = [
  {
    id: 'AGRICULTURA_GRAOS',
    name: 'Produtor de Grãos & Commodities',
    shortLabel: 'Agricultor de Grãos',
    badge: 'Soja, Milho & Algodão',
    icon: '🌾',
    description: 'Interface limpa para lavouras de grande escala. Foco em manejo de solo, dessecação, taxa variável VRA, colheita, silos, hedge cambial e barter.',
    suggestedCultures: ['SOJA', 'MILHO', 'ALGODAO'],
    defaultModules: [
      ...CORE_FOUNDATION_MODULES,
      'PRECISAO', 'DRONE', 'IRRIGACAO', 'SOLAR', 'RECEITUARIO', 'INPEV', 'MIP',
      'ESG', 'SEMENTES', 'CARBONO', 'NUTRICAO', 'PERDAS_COLHEITA', 'BIOFABRICA',
      'COMPOSTAGEM', 'ROCHAGEM', 'COBERTURA', 'PRODUTIVIDADE_PREDITIVA', 'COMPACTACAO_SOLO',
      'BIOANALISE_SOLO', 'ENSAIO_VARIEDADES', 'FBN_NITROGENIO', 'NEMATOIDES',
      'DANINHAS_RESISTENTES', 'FUNGICIDAS_MANEJO', 'FERTIRRIGACAO_PIVO', 'ALGODAO_HVI',
      'ALGODAO_HVI_CLASSIFICACAO', 'ORIZICULTURA_ARROZ', 'GERGELIM_SEGUNDA_SAFRA',
      'DESCONTAMINACAO', 'PONTAS_PULVERIZACAO', 'UNIFORMIDADE_PLANTIO', 'OEE_FROTAS',
      'DISTRIBUICAO_ADUBO', 'BARTER', 'BARTER_MULTI_COMMODITY_CPR', 'HEDGE_CAMBIAL',
      'COLHEITA', 'SILOS', 'ARMAZENAGEM_TERMOMETRIA_ORVALHO', 'LOGISTICA', 'SENSIBILIDADE',
      'ARRENDAMENTO', 'OEM_TELEMATICS_GATEWAY', 'SEFAZ_GEO_AUDITOR',
      'ORQUESTRADOR_AUTONOMO_40', 'ZONEAMENTO_RISCO_ZARC', 'MICORRIZAS_BIOINSUMOS',
      'FERTILIZANTES_ORGANOMINERAIS'
    ]
  },
  {
    id: 'PECUARIA_CORTE_LEITE',
    name: 'Pecuarista (Corte, Leite & Confinamento)',
    shortLabel: 'Pecuarista',
    badge: 'Gado de Corte & Leite',
    icon: '🐂',
    description: 'Interface exclusiva para pecuária extensiva e intensiva. Exclui módulos agrícolas desnecessários e foca em zootecnia, cocho, pesagem, RFID e silagem.',
    suggestedCultures: ['BOVINO_CORTE', 'BOVINO_LEITE'],
    defaultModules: [
      ...CORE_FOUNDATION_MODULES,
      'ZOOTECNIA', 'CONFINAMENTO', 'BOVINOCULTURA_LEITE', 'BOVINOCULTURA_SISBOV_RFID',
      'ILPF', 'SILAGEM_FORRAGEM', 'PALMA_FORRAGEIRA', 'OVINOCULTURA_CAPRINOS',
      'CONFINAMENTO_CORDEIROS', 'EQUINOCULTURA_MANEJO', 'BUBALINOCULTURA_QUEIJO',
      'CAPRINOCULTURA_QUEIJOS', 'CAPRINOCULTURA_QUEIJOS_MATURADOS', 'SENSIBILIDADE',
      'ARRENDAMENTO', 'SOLAR', 'CARBONO', 'COMPOSTAGEM', 'BIOFABRICA'
    ]
  },
  {
    id: 'AGROPECUARIA_MISTA',
    name: 'Agropecuária Mista (Lavoura + Pecuária / ILPF)',
    shortLabel: 'Misto / ILPF',
    badge: 'Grãos + Pecuária',
    icon: '🚜',
    description: 'Para propriedades integradas que alternam safra de grãos com boi safrinha, silagem e pastagens rotacionadas.',
    suggestedCultures: ['SOJA', 'MILHO', 'BOVINO_CORTE'],
    defaultModules: [
      ...CORE_FOUNDATION_MODULES,
      'PRECISAO', 'DRONE', 'MIP', 'SEMENTES', 'CARBONO', 'NUTRICAO', 'PERDAS_COLHEITA',
      'COBERTURA', 'FBN_NITROGENIO', 'ZOOTECNIA', 'CONFINAMENTO', 'BOVINOCULTURA_SISBOV_RFID',
      'ILPF', 'SILAGEM_FORRAGEM', 'PALMA_FORRAGEIRA', 'COLHEITA', 'SILOS', 'BARTER',
      'HEDGE_CAMBIAL', 'ARMAZENAGEM_TERMOMETRIA_ORVALHO', 'SENSIBILIDADE', 'ARRENDAMENTO',
      'COMPOSTAGEM', 'BIOFABRICA', 'ROCHAGEM', 'SOLAR', 'ZONEAMENTO_RISCO_ZARC'
    ]
  },
  {
    id: 'HORTIFRUTI_FLORICULTURA',
    name: 'Hortifrúti, HF & Fruticultura Especial',
    shortLabel: 'Hortifrúti & Frutas',
    badge: 'HF, Citrus & Estufas',
    icon: '🍓',
    description: 'Focado em hortaliças, frutas nobres, estufas climatizadas, hidroponia e sistemas avançados de fertirrigação por condutividade elétrica e pH.',
    suggestedCultures: ['HF_HORTIFRUTI', 'UVA_VINHO'],
    defaultModules: [
      ...CORE_FOUNDATION_MODULES,
      'OLERICULTURA_HF', 'CITRICULTURA_PRECISAO', 'BANANICULTURA_CLIMATIZADA',
      'BATATICULTURA_CHIPS', 'CEBOLA_ALHO_CURA', 'PITAIA_PRECISAO', 'ACAI_TERRA_FIRME',
      'REGULADORES_CRESCIMENTO', 'FLORICULTURA_FLORES_NOBRES', 'AZEITONAS_MESA_PROCESSAMENTO',
      'OLIVICULTURA_AZEITE', 'CULTIVO_PROTEGIDO_HIDROPONIA', 'FAZENDAS_VERTICAIS_AEROPONIA',
      'FERTIRRIGACAO_INJECAO_MULTICANAL', 'FERTIRRIGACAO_PIVO', 'IRRIGACAO', 'RECEITUARIO',
      'INPEV', 'MIP', 'FUNGICIDAS_MANEJO', 'PONTAS_PULVERIZACAO', 'BIOFABRICA',
      'COMPOSTAGEM', 'SOLAR', 'VITIVINICULTURA_PRECISAO', 'VINHOS_FINOS_DUPLA_PODA'
    ]
  },
  {
    id: 'SUINOCULTURA_AVICULTURA',
    name: 'Suinocultura & Granjas Avícolas',
    shortLabel: 'Suínos & Aves',
    badge: 'Granjas & Biometano',
    icon: '🐖',
    description: 'Ambiente especializado em maternidade suína, controle de amamentação, dejetos líquidos DLS, biodigestores biometano e ambiência de galpões avícolas.',
    suggestedCultures: ['SUINOS', 'AVES'],
    defaultModules: [
      ...CORE_FOUNDATION_MODULES,
      'SUINOCULTURA_PRECISAO', 'SUINOCULTURA_MATERNIDADE', 'DEJETOS_SUINOS',
      'BIODIGESTOR_BIOMETANO', 'AVICULTURA_CLIMATIZADA', 'AVICULTURA_POSTURA_OVOS',
      'COMPOSTAGEM', 'SOLAR', 'SENSIBILIDADE'
    ]
  },
  {
    id: 'BIOENERGIA_SUCROALCOOLEIRO',
    name: 'Bioenergia & Sucroalcooleiro',
    shortLabel: 'Cana & Etanol',
    badge: 'Cana, Etanol & CBIO',
    icon: '🎋',
    description: 'Para usinas de cana-de-açúcar, destilarias e cooperativas sucroalcooleiras com controle de ATR, moenda, difusores e emissão de créditos RenovaBio CBIO.',
    suggestedCultures: ['CANA'],
    defaultModules: [
      ...CORE_FOUNDATION_MODULES,
      'CANA_DE_ACUCAR_ATR', 'MOENDA_DIFUSOR_CANA_EXTRACAO', 'RENOVABIO_CBIOS',
      'RENOVABIO_CALCULADORA_CBIO', 'BIODIGESTOR_BIOMETANO', 'FERTIRRIGACAO_PIVO',
      'OEE_FROTAS', 'MERCADO_CARBONO_SBCE', 'LOGISTICA', 'COLHEITA', 'ESG',
      'OEM_TELEMATICS_GATEWAY', 'SEFAZ_GEO_AUDITOR', 'SOLAR'
    ]
  },
  {
    id: 'CADEIAS_ESPECIAIS',
    name: 'Cadeias Perenes & Agroindústria Especial',
    shortLabel: 'Café, Cacau & Especiais',
    badge: 'Café, Cacau & Florestas',
    icon: '☕',
    description: 'Gestão de culturas perenes nobres: cafés especiais pontuados SCA, cacau fino bean-to-bar, silvicultura sustentável, borracha e nozes.',
    suggestedCultures: ['CAFE', 'CACAU', 'SILVICULTURA'],
    defaultModules: [
      ...CORE_FOUNDATION_MODULES,
      'CAFEICULTURA_ESPECIAL', 'CACAULICULTURA_CABRUCA', 'CACAU_FINO_FERMENTACAO',
      'ERVA_MATE_SAPECO', 'HEVEICULTURA_BORRACHA', 'LUPULICULTURA_CERVEJA',
      'NOZ_PECAN_POMARES', 'MACADAMIA_PROCESSAMENTO', 'GUARANICULTURA_AMAZONIA',
      'PIMENTA_DO_REINO_QUALIDADE', 'CASTANHA_BRASIL_EXTRATIVISMO', 'MANDIOCULTURA_AMIDO',
      'DENDEICULTURA_RSPO', 'CAJUCULTURA_DOC', 'SILVICULTURA_IMA', 'ESG', 'CARBONO',
      'BARTER', 'HEDGE_CAMBIAL', 'IRRIGACAO'
    ]
  },
  {
    id: 'AQUICULTURA_CULTURAS_VIVAS',
    name: 'Aquicultura & Pequenos Animais',
    shortLabel: 'Piscicultura & Aquicultura',
    badge: 'Peixes, Camarão & Ostras',
    icon: '🐟',
    description: 'Plataforma para tanques escavados, raceways, maricultura de ostras em longlines, bioflocos para camarão e espécies zootécnicas especiais.',
    suggestedCultures: ['AQUICULTURA', 'MEL_ABELHAS'],
    defaultModules: [
      ...CORE_FOUNDATION_MODULES,
      'PISCICULTURA_AQUICULTURA', 'CARCINICULTURA_BIOFLOCOS', 'TAINHA_AQUICULTURA_ESTUARINA',
      'MARICULTURA_OSTRAS', 'CARBONO_AZUL_MARINHO', 'RANICULTURA_SUSTENTAVEL',
      'MELIPONICULTURA_ASF', 'APICULTURA_POLINIZACAO', 'FUNGICULTURA_COGUMELOS',
      'HELICICULTURA_ESCARGOT', 'CUNICULTURA_INDUSTRIAL', 'SERICICULTURA_SEDA',
      'ALGOTECNOLOGIA_MICROALGAS', 'MINHOCULTURA_HUMUS', 'SOLAR'
    ]
  },
  {
    id: 'LOGISTICA_TRADING_COOPERATIVA',
    name: 'Cooperativas, Armazenagem & Logística',
    shortLabel: 'Logística & Silos',
    badge: 'Porto, Fretes & Fila',
    icon: '🚛',
    description: 'Para terminais graneleiros, silos centrais e operadores logísticos: controle de filas, paridade portuária, termometria de armazéns e fretes ANTT.',
    suggestedCultures: ['SOJA', 'MILHO'],
    defaultModules: [
      ...CORE_FOUNDATION_MODULES,
      'SILOS', 'ARMAZENAGEM_TERMOMETRIA_ORVALHO', 'LOGISTICA',
      'TORRE_CONTROLE_LOGISTICO_COC', 'MONITORAMENTO_FILA_TERMINAIS',
      'INTELIGENCIA_BASIS_PORTUARIO', 'SEFAZ_GEO_AUDITOR', 'BARTER',
      'BARTER_MULTI_COMMODITY_CPR', 'HEDGE_CAMBIAL', 'COLHEITA', 'ESG',
      'CARBONO', 'OEM_TELEMATICS_GATEWAY'
    ]
  },
  {
    id: 'CUSTOM_CULTURAS',
    name: 'Personalizado (Seleção por Culturas e Atividades)',
    shortLabel: 'Personalizado',
    badge: 'Configuração sob medida',
    icon: '⚙️',
    description: 'Configure sob medida ativando exatamente as culturas cultivadas na fazenda ou marcando módulos individuais.',
    suggestedCultures: [],
    defaultModules: [...CORE_FOUNDATION_MODULES]
  },
  {
    id: 'ENTERPRISE_FULL',
    name: 'Enterprise Completo (Todos os 135 Módulos)',
    shortLabel: 'Enterprise Full',
    badge: '135 Módulos Ativos',
    icon: '🌐',
    description: 'Acesso irrestrito a todas as funcionalidades, cadeias agropecuárias e ferramentas da plataforma Super AgTech.',
    suggestedCultures: [],
    defaultModules: ['*'] // wildcard: todos
  }
];

const STORAGE_KEY = 'agtech_subscription_config';

/**
 * Carrega a configuração de módulos salva no localStorage ou retorna o perfil padrão
 */
export function getSavedSubscriptionConfig(): SubscriptionConfig {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.profileId) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.error('[SubscriptionService] Erro ao carregar config:', e);
  }

  // Padrão inicial: AGRICULTURA_GRAOS (ou configurável)
  return {
    profileId: 'AGRICULTURA_GRAOS',
    customModuleIds: [],
    selectedCultures: ['SOJA', 'MILHO'],
    updatedAt: new Date().toISOString()
  };
}

/**
 * Salva a configuração no localStorage e sincroniza de forma assíncrona com o backend
 */
export function saveSubscriptionConfig(config: SubscriptionConfig): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
    // Sincroniza em background com o backend se disponível
    if (typeof fetch !== 'undefined') {
      fetch('/api/v1/subscription/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      }).catch(() => {
        // Falha silenciosa em caso offline (PWA)
      });
    }
  } catch (e) {
    console.error('[SubscriptionService] Erro ao salvar config:', e);
  }
}

/**
 * Resolve o conjunto de IDs de módulos ativos baseado no perfil, culturas e personalizações
 */
export function resolveActiveModuleIds(
  config: SubscriptionConfig,
  allModuleIds: string[]
): Set<string> {
  const { profileId, customModuleIds, selectedCultures } = config;

  // 1. Se for Enterprise Full, retorna todos
  if (profileId === 'ENTERPRISE_FULL') {
    return new Set(allModuleIds);
  }

  const activeSet = new Set<string>();

  // 2. Módulos base do perfil selecionado
  const profile = OPERATIONAL_PROFILES.find((p) => p.id === profileId);
  if (profile) {
    if (profile.defaultModules.includes('*')) {
      return new Set(allModuleIds);
    }
    profile.defaultModules.forEach((id) => activeSet.add(id));
  } else {
    // Fallback: módulos transversais
    CORE_FOUNDATION_MODULES.forEach((id) => activeSet.add(id));
  }

  // 3. Adicionar módulos derivados das culturas selecionadas
  if (selectedCultures && selectedCultures.length > 0) {
    selectedCultures.forEach((cultId) => {
      const cult = AVAILABLE_CULTURES.find((c) => c.id === cultId);
      if (cult) {
        cult.associatedModules.forEach((modId) => activeSet.add(modId));
      }
    });
  }

  // 4. Adicionar módulos personalizados marcados manualmente pelo usuário
  if (customModuleIds && customModuleIds.length > 0) {
    customModuleIds.forEach((id) => activeSet.add(id));
  }

  // Garante que os módulos core sempre estejam acessíveis para não quebrar a navegação básica
  CORE_FOUNDATION_MODULES.forEach((id) => activeSet.add(id));

  return activeSet;
}
