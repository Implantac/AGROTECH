import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Star,
  X,
  LayoutDashboard,
  Map,
  Smartphone,
  FileSpreadsheet,
  Package,
  Activity,
  Tractor,
  FileCheck,
  TrendingUp,
  Sliders,
  Handshake,
  Truck,
  CloudRain,
  FileText,
  Layers,
  Wrench,
  ChevronRight,
  Sparkles,
  Bug,
  Fuel,
  Globe,
  Brain,
  Droplet,
  Warehouse,
  HardHat,
  Landmark,
  Route,
  FileSignature,
  Microscope,
  Leaf,
  Plane,
  Recycle,
  FlaskConical,
  Crosshair,
  Dna,
  Coins,
  Trees,
  Compass,
  Umbrella,
  Flame,
  Mountain,
  RotateCcw,
  Sun,
  Flower2,
  Droplets,
  Target,
  Trophy,
  Award,
  ShieldAlert,
  ShieldCheck,
  Wheat,
  Fish,
  Coffee,
  Factory,
  Wine,
  HeartPulse,
  Wind,
  Waves,
  TreeDeciduous,
  Apple,
  Beer,
  Scale,
  Milk,
  Heart,
  Scissors,
  Radio,
  Lock,
  Cpu,
  Egg,
} from 'lucide-react';

export interface ModuleItem {
  id: string;
  name: string;
  fullName: string;
  description: string;
  category: 'CAMPO' | 'FROTA' | 'MERCADO' | 'FISCAL' | 'PECUARIA';
  icon: React.ElementType;
  badge?: string;
  keywords: string[];
}

export const ALL_MODULES: ModuleItem[] = [
  // Categoria: Agronomia & Campo
  {
    id: 'SIG',
    name: 'SIG & Mapas',
    fullName: 'Central Geográfica SIG & Satélite',
    description: 'Polígonos vetoriais, NDVI Sentinel-2 e Heatmap de pragas georreferenciado.',
    category: 'CAMPO',
    icon: Map,
    badge: 'PostGIS',
    keywords: ['mapa', 'talhao', 'talhoes', 'satelite', 'ndvi', 'shapefile', 'car', 'praga'],
  },
  {
    id: 'PRECISAO',
    name: 'Taxa Variável VRA',
    fullName: 'Agricultura de Precisão & Prescrições VRA',
    description: 'Mapas de adubação e calagem em taxa variável exportáveis em ISO-XML.',
    category: 'CAMPO',
    icon: Layers,
    badge: 'ISO-XML',
    keywords: ['adubo', 'fertilizante', 'fosforo', 'potassio', 'calcario', 'piloto', 'isoxml'],
  },
  {
    id: 'CLIMA',
    name: 'Clima & Delta T',
    fullName: 'Agrometeorologia IoT & Janela Delta T',
    description: 'Sensores de temperatura, umidade, vento e cálculo de janela segura de pulverização.',
    category: 'CAMPO',
    icon: CloudRain,
    badge: 'IoT',
    keywords: ['clima', 'chuva', 'vento', 'delta t', 'temperatura', 'pulverizacao', 'deriva'],
  },
  {
    id: 'DRONE',
    name: 'Drones & UBV',
    fullName: 'Pulverização Aérea com Drones & Telemetria',
    description: 'Operações DJI Agras T50/XAG P100 Pro, telemetria DECEA/ANAC, UBV (10-15 L/ha) e análise hidrossensível.',
    category: 'CAMPO',
    icon: Plane,
    badge: 'ANAC/DECEA',
    keywords: ['drone', 'pulverizacao', 'agras', 't50', 'xag', 'ubv', 'deriva', 'hidrossensivel', 'decea', 'anac'],
  },
  {
    id: 'IRRIGACAO',
    name: 'Irrigação & Pivô',
    fullName: 'Manejo de Irrigação & Pivô Central',
    description: 'Balanço hídrico Penman-Monteith, sondas TDR, lâmina ETc e automação de tarifa noturna.',
    category: 'CAMPO',
    icon: Droplet,
    badge: 'Pivô 510ha',
    keywords: ['irrigacao', 'pivo', 'agua', 'lamina', 'solo', 'tdr', 'tarifa noturna', 'etc'],
  },
  {
    id: 'SOLAR',
    name: 'Energia Solar Rural',
    fullName: 'Energia Solar Rural & Eletrificação de Pivôs (Lei 14.300)',
    description: 'Usinas fotovoltaicas da fazenda, geração kWh/mês, compensação de créditos e payback.',
    category: 'CAMPO',
    icon: Sun,
    badge: 'Lei 14.300 GD',
    keywords: ['solar', 'fotovoltaica', 'energia', 'pivo', 'inversor', 'kwh', 'payback', 'energisa', 'geracao'],
  },
  {
    id: 'MOBILE',
    name: 'Cockpit Campo',
    fullName: 'App Mobile do Tratorista (Offline)',
    description: 'Apontamento de caldas, clima, fotos de pragas e horímetro sem sinal de internet.',
    category: 'CAMPO',
    icon: Smartphone,
    badge: '100% Offline',
    keywords: ['mobile', 'app', 'tratorista', 'offline', 'calda', 'sqlite', 'campo'],
  },
  {
    id: 'RECEITUARIO',
    name: 'Receituário CREA',
    fullName: 'Receituário Agronômico & ART Oficial',
    description: 'Emissão de receitas com ART do CREA-MT, intervalo de carência e logística inpEV.',
    category: 'CAMPO',
    icon: FileCheck,
    badge: 'Lei 7.802',
    keywords: ['receita', 'crea', 'art', 'agronomo', 'bula', 'inpev', 'agrotoxico'],
  },
  {
    id: 'INPEV',
    name: 'inpEV & Logística Reversa',
    fullName: 'inpEV Logística Reversa de Embalagens Vazias',
    description: 'Conformidade Lei 7.802/89 e 14.785/23, tríplice lavagem, prazo legal de 365 dias e agendamento Sorriso.',
    category: 'CAMPO',
    icon: Recycle,
    badge: 'Lei 14.785',
    keywords: ['inpev', 'embalagens', 'vazias', 'triplice lavagem', 'perfuracao', 'devolucao', 'reciclagem', 'indea', 'mapa'],
  },
  {
    id: 'MIP',
    name: 'MIP & Pragas',
    fullName: 'MIP & Proteção de Culturas (NDE Embrapa)',
    description: 'Amostragens georreferenciadas, cálculo de Nível de Dano Econômico e gatilho de pulverização.',
    category: 'CAMPO',
    icon: Bug,
    badge: 'NDE Embrapa',
    keywords: ['mip', 'praga', 'percevejo', 'lagarta', 'dano', 'nde', 'ferrugem', 'pulverizacao', 'amostragem'],
  },
  {
    id: 'ESG',
    name: 'ESG & EUDR',
    fullName: 'ESG, Rastreabilidade & Validador EUDR',
    description: 'Conformidade com o Marco 2020 PRODES/INPE, Due Diligence Statement (DDS) e Passaporte Verde.',
    category: 'CAMPO',
    icon: Globe,
    badge: 'EUDR Apto',
    keywords: ['esg', 'eudr', 'desmatamento', 'prodes', 'inpe', 'car', 'ibama', 'europa', 'passaporte verde'],
  },
  {
    id: 'SEMENTES',
    name: 'Sementes & TSI',
    fullName: 'Sementes, Vigor Tetrazólio & Tratamento Industrial (TSI)',
    description: 'Laudos de germinação, tetrazólio, inoculação biológica (FBN) e calibração de semeadora.',
    category: 'CAMPO',
    icon: Microscope,
    badge: 'Tetrazólio',
    keywords: ['semente', 'vigor', 'tetrazolio', 'germinacao', 'tsi', 'inoculante', 'plantadeira', 'pms'],
  },
  {
    id: 'CARBONO',
    name: 'Carbono & CPR Verde',
    fullName: 'Balanço de Carbono GHG Protocol & CPR Verde',
    description: 'Inventário de emissões Escopo 1 vs sequestro no solo por Plantio Direto e créditos verdes.',
    category: 'CAMPO',
    icon: Leaf,
    badge: 'CPR Verde',
    keywords: ['carbono', 'ghg', 'cpr verde', 'emissoes', 'sequestro', 'regenerativa', 'solo', 'diesel'],
  },
  {
    id: 'NUTRICAO',
    name: 'Nutrição & DRIS',
    fullName: 'Nutrição de Solo, Calagem & Diagnose Foliar DRIS',
    description: 'Laudos de fertilidade química, simulador de calagem (V%), gessagem Dematê e balanço DRIS.',
    category: 'CAMPO',
    icon: FlaskConical,
    badge: 'Fertilidade 4.0',
    keywords: ['nutricao', 'solo', 'calagem', 'calcario', 'gesso', 'dris', 'foliar', 'adubo', 'ctc', 'boro'],
  },
  {
    id: 'PERDAS_COLHEITA',
    name: 'Perdas na Colheita',
    fullName: 'Auditoria de Perdas na Colheita & Regulagem de Ceifadoras',
    description: 'Método armação Embrapa (sc/ha), perdas na plataforma/rotor, prejuízo financeiro e telemetria.',
    category: 'CAMPO',
    icon: Crosshair,
    badge: 'Embrapa Armação',
    keywords: ['perdas', 'colheita', 'ceifadora', 'draper', 'rotor', 'concavo', 'embrapa', 'soja', 'milho', 'regulagem'],
  },
  {
    id: 'BIOFABRICA',
    name: 'Biofábrica On-Farm',
    fullName: 'Biofábrica On-Farm & Multiplicação Biológica',
    description: 'Biorreatores automatizados, multiplicação de Bacillus/Trichoderma, contagem UFC e economia de 90%+.',
    category: 'CAMPO',
    icon: Dna,
    badge: 'Manejo Bio',
    keywords: ['biofabrica', 'biologico', 'bacillus', 'trichoderma', 'beauveria', 'onfarm', 'biorreator', 'ufc', 'mapa'],
  },
  {
    id: 'COMPOSTAGEM',
    name: 'Compostagem & Biofertilizantes',
    fullName: 'Compostagem Termofílica & Biofertilizantes Circulares',
    description: 'Valorização de cama de frango, dejetos suínos e esterco com pó de rocha para substituição de NPK.',
    category: 'CAMPO',
    icon: Recycle,
    badge: 'Bioeconomia',
    keywords: ['compostagem', 'cama de frango', 'esterco', 'biofertilizante', 'dejetos', 'suinos', 'rochagem', 'npk'],
  },
  {
    id: 'ROCHAGEM',
    name: 'Rochagem & Silício',
    fullName: 'Remineralizadores de Solo & Rochagem (IN 05/2016 MAPA)',
    description: 'Pós de rochas basálticas regionais, silício foliar, efeito residual trienal e frete.',
    category: 'CAMPO',
    icon: Mountain,
    badge: 'IN 05 MAPA',
    keywords: ['rochagem', 'po de rocha', 'basalto', 'remineralizador', 'silicio', 'potassio', 'frete', 'mapa'],
  },
  {
    id: 'COBERTURA',
    name: 'Plantas de Cobertura',
    fullName: 'Plantas de Cobertura, Biomassa & Descompactação Biológica',
    description: 'Mixes de cover crops para estruturação do solo, ciclagem de NPK e supressão de nematoides.',
    category: 'CAMPO',
    icon: Flower2,
    badge: 'Plantio Direto',
    keywords: ['cobertura', 'biomassa', 'crotalaria', 'nabo', 'milheto', 'palhada', 'descompactacao', 'ciclagem'],
  },
  {
    id: 'PRODUTIVIDADE_PREDITIVA',
    name: 'Produtividade IA',
    fullName: 'Previsão de Produtividade & Modelagem Monte Carlo (NDVI/GDD)',
    description: 'Estimativa de safra por satélite Sentinel-2, graus-dia e cálculo de teto seguro de Barter contra wash-out.',
    category: 'CAMPO',
    icon: Target,
    badge: 'Monte Carlo',
    keywords: ['produtividade', 'predicao', 'estimativa', 'safra', 'monte carlo', 'p50', 'barter', 'washout', 'gdd', 'ndvi'],
  },
  {
    id: 'COMPACTACAO_SOLO',
    name: 'Penetrômetro Solo',
    fullName: 'Compactação de Solo & Penetrômetro Digital (ASABE S313.3)',
    description: 'Mapeamento de pé de grade/arado, zona crítica >2.0 MPa e escarificação dirigida.',
    category: 'CAMPO',
    icon: Layers,
    badge: 'ASABE MPa',
    keywords: ['compactacao', 'penetrometro', 'mpa', 'pe de grade', 'escarificador', 'subsolador', 'raiz', 'solo'],
  },
  {
    id: 'BIOANALISE_SOLO',
    name: 'BioAS & Saúde Solo',
    fullName: 'Bioanálise de Solo (BioAS Embrapa & Saúde Biológica)',
    description: 'Enzimas Beta-Glicosidase, Arilsulfatase, Fosfatase Ácida e valoração da fertilidade biológica.',
    category: 'CAMPO',
    icon: Dna,
    badge: 'BioAS Embrapa',
    keywords: ['bioas', 'enzimas', 'beta-glicosidase', 'arilsulfatase', 'fosfatase', 'microbiologia', 'solo', 'embrapa'],
  },
  {
    id: 'ENSAIO_VARIEDADES',
    name: 'Ensaio Variedades',
    fullName: 'Ensaio de Variedades & Lado a Lado (Strip-Trials)',
    description: 'Comparação de cultivares, correção de umidade Conab 13% e estatística Tukey (DMS).',
    category: 'CAMPO',
    icon: Trophy,
    badge: 'Tukey DMS',
    keywords: ['ensaio', 'variedade', 'cultivar', 'lado a lado', 'strip trial', 'tukey', 'dms', 'soja', 'hibrido'],
  },
  {
    id: 'FBN_NITROGENIO',
    name: 'FBN & Inoculação',
    fullName: 'Fixação Biológica de Nitrogênio (FBN & Co-Inoculação)',
    description: 'Auditoria de nodulação radicular, leg-hemoglobina e substituição de adubação nitrogenada.',
    category: 'CAMPO',
    icon: Dna,
    badge: 'Bradyrhizobium',
    keywords: ['fbn', 'nitrogenio', 'nodulacao', 'bradyrhizobium', 'azospirillum', 'inoculante', 'ureia', 'biologico'],
  },
  {
    id: 'DEJETOS_SUINOS',
    name: 'Dejetos Suínos DLS',
    fullName: 'Dejetos Líquidos de Suínos (DLS & Fertirrigação Orgânica)',
    description: 'Aporte de NPK orgânico, conformidade com a cota ambiental SEMA de fósforo e economia.',
    category: 'CAMPO',
    icon: Droplets,
    badge: 'SEMA Ambiental',
    keywords: ['dejetos', 'suinos', 'dls', 'esterco', 'fertirrigacao', 'fosforo', 'sema', 'organico'],
  },
  {
    id: 'NEMATOIDES',
    name: 'Nematóides Solo',
    fullName: 'Mapeamento & Manejo Integrado de Nematóides',
    description: 'Auditoria populacional em raízes (Pratylenchus, Cisto e Galha) e ROI de biológicos.',
    category: 'CAMPO',
    icon: Bug,
    badge: 'Nematologia',
    keywords: ['nematoide', 'pratylenchus', 'cisto', 'galha', 'crotalaria', 'raiz', 'biologico', 'solo'],
  },
  {
    id: 'DANINHAS_RESISTENTES',
    name: 'Daninhas & HRAC',
    fullName: 'Manejo de Daninhas Resistentes & Pré-Emergentes (HRAC)',
    description: 'Dessecação sequencial, residual de pré-emergentes contra Capim-Amargoso e Buva.',
    category: 'CAMPO',
    icon: ShieldAlert,
    badge: 'HRAC WSSA',
    keywords: ['daninha', 'amargoso', 'buva', 'pre-emergente', 'glifosato', 'cletodim', 'saflufenacil', 'hrac'],
  },
  {
    id: 'FUNGICIDAS_MANEJO',
    name: 'Fungicidas FRAC',
    fullName: 'Manejo Antirresistência de Fungicidas & Multissítios Protetores',
    description: 'Diretrizes FRAC Brasil, proteção contra Ferrugem Asiática e blindagem foliar com Mancozeb.',
    category: 'CAMPO',
    icon: ShieldCheck,
    badge: 'FRAC Brasil',
    keywords: ['fungicida', 'ferrugem', 'frac', 'multissitio', 'mancozeb', 'mancha alvo', 'triazol', 'carboxamida'],
  },
  {
    id: 'FERTIRRIGACAO_PIVO',
    name: 'Fertirrigação Pivô',
    fullName: 'Fertirrigação & Injeção de Nutrientes via Pivô Central',
    description: 'Calibração de bomba dosadora (L/h), CE da calda e eliminação do amassamento de plantas.',
    category: 'CAMPO',
    icon: Droplets,
    badge: 'Quimigação',
    keywords: ['fertirrigacao', 'pivo', 'uan', 'nitrogenio', 'calda', 'ce', 'salinidade', 'bomba'],
  },
  {
    id: 'ALGODAO_HVI',
    name: 'Algodão & HVI',
    fullName: 'Classificação HVI de Algodão & Rendimento de Pluma',
    description: 'Descaroçamento, comprimento UHM, micronaire, resistência e bônus de exportação.',
    category: 'CAMPO',
    icon: Award,
    badge: 'HVI ABRAPA',
    keywords: ['algodao', 'pluma', 'caroco', 'hvi', 'uhm', 'micronaire', 'resistencia', 'fardo', 'abrapa'],
  },
  {
    id: 'CAFEICULTURA_ESPECIAL',
    name: 'Café & SCA',
    fullName: 'Cafeicultura de Precisão & Classificação SCA Especial',
    description: 'Maturação de frutos, pontuação SCA > 80 pts, secagem em terreiro suspenso e ágio.',
    category: 'CAMPO',
    icon: Coffee,
    badge: 'SCA Especial',
    keywords: ['cafe', 'sca', 'maturacao', 'cereja', 'bourbon', 'arara', 'terreiro', 'qualidade', 'bebida'],
  },
  {
    id: 'CANA_DE_ACUCAR_ATR',
    name: 'Cana & ATR Consecana',
    fullName: 'Cana-de-Açúcar • Modelo Consecana & Fertirrigação c/ Vinhaça',
    description: 'Açúcar Total Recuperável (ATR), curvas de maturação, TCH e reciclagem de vinhaça.',
    category: 'CAMPO',
    icon: Factory,
    badge: 'Consecana',
    keywords: ['cana', 'atr', 'consecana', 'vinhaca', 'pol', 'acucar', 'etanol', 'tch', 'cetesb'],
  },

  // Categoria: Frotas & Mecânica
  {
    id: 'FROTA',
    name: 'Telemetria CAN',
    fullName: 'Cockpit de Frotas & Sensores CAN Bus',
    description: 'RPM, velocidade de plantio, consumo de diesel instantâneo (L/h) e horas ociosas.',
    category: 'FROTA',
    icon: Tractor,
    badge: 'Tempo Real',
    keywords: ['trator', 'diesel', 'combustivel', 'horimetro', 'rpm', 'can bus', 'frota'],
  },
  {
    id: 'OFICINA',
    name: 'Oficina & OS',
    fullName: 'Manutenção Preventiva & Oficina Mecânica',
    description: 'Alertas automáticos de revisão de 250h/500h/1000h por horímetro e peças.',
    category: 'FROTA',
    icon: Wrench,
    badge: 'Preventiva',
    keywords: ['oficina', 'mecanico', 'revisao', 'filtro', 'oleo', 'ordem de servico', 'pecas'],
  },
  {
    id: 'NR31',
    name: 'NR-31 & eSocial',
    fullName: 'NR-31, eSocial Rural & Saúde Ocupacional',
    description: 'ASO periódico, Ficha de EPI com CA, treinamentos e bloqueio operacional de máquinas.',
    category: 'FROTA',
    icon: HardHat,
    badge: 'NR-31 MTE',
    keywords: ['nr31', 'nr-31', 'esocial', 'seguranca', 'epi', 'aso', 'tratorista', 'treinamento', 'bloqueio'],
  },
  {
    id: 'DESCONTAMINACAO',
    name: 'Descontaminação Pulverizador',
    fullName: 'Descontaminação de Pulverizadores & Prevenção de Fitotoxicidade',
    description: 'Protocolo de 4 fases para eliminação de resíduos hormonais (2,4-D/Dicamba) e trava LOTO.',
    category: 'FROTA',
    icon: RotateCcw,
    badge: 'Zero Carryover',
    keywords: ['pulverizador', 'limpeza', 'tanque', 'descontaminacao', 'fitotoxicidade', '24d', 'dicamba', 'loto'],
  },
  {
    id: 'PONTAS_PULVERIZACAO',
    name: 'Pontas & Calibração',
    fullName: 'Pontas de Pulverização & Calibração Hidráulica (ISO 10625)',
    description: 'Cálculo milimétrico de vazão (L/min), auditoria de proveta graduada e espectro de gotas (deriva zero).',
    category: 'FROTA',
    icon: Droplets,
    badge: 'ISO 10625',
    keywords: ['ponta', 'bico', 'pulverizacao', 'deriva', 'gota', 'calibracao', 'vazao', 'leque', 'cone', 'iso10625'],
  },
  {
    id: 'UNIFORMIDADE_PLANTIO',
    name: 'Singulação & CV%',
    fullName: 'Distribuição Espacial & Coeficiente de Variação (ISO 7256-1)',
    description: 'Auditoria de linhas de semeadura, duplas e falhas (Kurachi), vácuo e quebra evitada.',
    category: 'FROTA',
    icon: Tractor,
    badge: 'ISO 7256-1',
    keywords: ['singulacao', 'plantadeira', 'semeadora', 'cv', 'dupla', 'falha', 'kurachi', 'vacuo', 'plantio'],
  },
  {
    id: 'OEE_FROTAS',
    name: 'OEE de Frotas',
    fullName: 'Eficiência Operacional OEE de Frotas Agrícolas (ISO 22400)',
    description: 'Disponibilidade, desempenho e qualidade de colheitadeiras, tratores e pulverizadores.',
    category: 'FROTA',
    icon: Activity,
    badge: 'ISO 22400',
    keywords: ['oee', 'frota', 'disponibilidade', 'desempenho', 'qualidade', 'colheitadeira', 'trator', 'ociosidade'],
  },
  {
    id: 'DISTRIBUICAO_ADUBO',
    name: 'Adubo a Lanço CV%',
    fullName: 'Calibração de Adubação a Lanço & Coeficiente de Variação (CV%)',
    description: 'Perfil transversal de deposição, aletas dos discos e eliminação do efeito zebrado.',
    category: 'FROTA',
    icon: Sliders,
    badge: 'ASAE S341',
    keywords: ['adubo', 'lanco', 'cv', 'distribuicao', 'zebrado', 'aleta', 'ureia', 'kcl', 'bandeja'],
  },

  // Categoria: Financeiro & Mercado
  {
    id: 'COPILOT',
    name: 'Copilot IA',
    fullName: 'Copilot Safra • IA Agronômica Preditiva',
    description: 'Diagnósticos cruzados em tempo real de clima, pragas, frota, diesel e DRE com ações prescritivas.',
    category: 'MERCADO',
    icon: Brain,
    badge: 'IA Preditiva',
    keywords: ['ia', 'copilot', 'inteligencia', 'chat', 'preditivo', 'recomendacao', 'insight'],
  },
  {
    id: 'BI',
    name: 'BI Safra',
    fullName: 'Painel Executivo & Custeio ABC',
    description: 'Margem de contribuição, Custo ABC real por hectare e Break-Even em sacas/ha.',
    category: 'MERCADO',
    icon: LayoutDashboard,
    badge: 'Custeio ABC',
    keywords: ['bi', 'custo', 'break even', 'lucro', 'desembolso', 'margem', 'painel'],
  },
  {
    id: 'BARTER',
    name: 'Barter & CPR',
    fullName: 'Contratos de Barter, CPR & Tradings',
    description: 'Amortização de insumos via entrega de sacas de soja/milho para Cargill, Bunge e Amaggi.',
    category: 'MERCADO',
    icon: Handshake,
    badge: 'Hedge',
    keywords: ['barter', 'cpr', 'contrato', 'trading', 'cargill', 'bunge', 'amaggi', 'venda futura'],
  },
  {
    id: 'HEDGE_CAMBIAL',
    name: 'Hedge Cambial NDF',
    fullName: 'Hedge Cambial NDF & Gestão de Risco Dólar',
    description: 'Blindagem cambial de fertilizantes dolarizados, marcação a mercado (MtM) e relação de troca barter.',
    category: 'MERCADO',
    icon: Coins,
    badge: 'NDF B3',
    keywords: ['hedge', 'cambial', 'ndf', 'dolar', 'ptax', 'mtm', 'fertilizante', 'kcl', 'map', 'banco'],
  },
  {
    id: 'RENOVABIO_CBIOS',
    name: 'RenovaBio & CBIOs',
    fullName: 'RenovaBio & Créditos de Descarbonização (CBIOs na B3)',
    description: 'Certificação de biomassa de milho/soja para etanol, nota NEEA e bônus em CBIOs.',
    category: 'MERCADO',
    icon: Coins,
    badge: 'B3 RenovaBio',
    keywords: ['renovabio', 'cbio', 'etanol', 'milho', 'usina', 'carbono', 'anp', 'b3'],
  },
  {
    id: 'CREDITO',
    name: 'Crédito & Bancos',
    fullName: 'Crédito Rural & Financiamentos (Plano Safra)',
    description: 'Custeio Pronamp, Moderfrota, PCA, CPR Financeira e cronograma de pagamento balão.',
    category: 'MERCADO',
    icon: Landmark,
    badge: 'Plano Safra',
    keywords: ['credito', 'banco', 'financiamento', 'plano safra', 'pronamp', 'moderfrota', 'juros', 'balao'],
  },
  {
    id: 'SEGURO',
    name: 'Seguro & Sinistros',
    fullName: 'Seguro Agrícola Multirrisco & Sinistros Climáticos',
    description: 'Apólices rurais Brasilseg/Porto/Mapfre, subvenção federal PSR (40%) e laudos de seca/granizo.',
    category: 'MERCADO',
    icon: Umbrella,
    badge: 'PSR MAPA',
    keywords: ['seguro', 'sinistro', 'apolice', 'brasilseg', 'psr', 'subvencao', 'clima', 'estiagem', 'indenizacao'],
  },
  {
    id: 'COLHEITA',
    name: 'Balança & Cargas',
    fullName: 'Balança Rodoviária & Romaneios',
    description: 'Pesagem de caminhões na fazenda e cálculo de descontos por umidade e impureza.',
    category: 'MERCADO',
    icon: Truck,
    badge: 'Descontos',
    keywords: ['balanca', 'caminhao', 'romaneio', 'pesagem', 'umidade', 'impureza', 'carga'],
  },
  {
    id: 'SILOS',
    name: 'Silos & Secagem',
    fullName: 'Armazenagem, Termometria de Silos & Secadores',
    description: 'Monitoramento térmico da massa de grãos, aeração forçada e quebra técnica de secagem.',
    category: 'MERCADO',
    icon: Warehouse,
    badge: '135k sacas',
    keywords: ['silo', 'secador', 'termometria', 'graos', 'quebra', 'armazenagem', 'aeracao'],
  },
  {
    id: 'LOGISTICA',
    name: 'Logística & Fretes',
    fullName: 'Logística de Fretes, MDF-e & Escoamento',
    description: 'Fila de carregamento, cálculo de frete por tonelada/saca (piso ANTT) e Manifesto Eletrônico.',
    category: 'MERCADO',
    icon: Route,
    badge: 'Piso ANTT',
    keywords: ['frete', 'logistica', 'caminhao', 'mdfe', 'antt', 'transporte', 'escoamento', 'rodotrem'],
  },
  {
    id: 'SENSIBILIDADE',
    name: 'Stress Test',
    fullName: 'Matriz de Risco & Sensibilidade',
    description: 'Simulação de quebra de safra, seca e oscilação de cotação da saca de soja.',
    category: 'MERCADO',
    icon: Sliders,
    badge: 'Risco',
    keywords: ['stress test', 'sensibilidade', 'risco', 'cotacao', 'dolar', 'quebra'],
  },
  {
    id: 'DRE_COMBOIO',
    name: 'DRE & Comboio',
    fullName: 'DRE por Talhão & Gestão de Combustível / Comboio',
    description: 'Margem líquida em R$/ha e R$/sc por talhão e auditoria de diesel do comboio/melosa.',
    category: 'MERCADO',
    icon: Fuel,
    badge: 'Margem R$/sc',
    keywords: ['dre', 'lucro', 'margem', 'saca', 'combustivel', 'diesel', 'comboio', 'melosa', 'oee', 'talhao'],
  },

  // Categoria: Fiscal & Estoque
  {
    id: 'FISCAL',
    name: 'LCDPR Fiscal',
    fullName: 'Livro Caixa Digital do Produtor Rural',
    description: 'Rateio automático de despesas e receitas por CPF de Condomínio Rural Familiar.',
    category: 'FISCAL',
    icon: FileSpreadsheet,
    badge: 'Receita Federal',
    keywords: ['lcdpr', 'fiscal', 'imposto', 'livro caixa', 'condominio', 'receita federal'],
  },
  {
    id: 'ESTOQUE',
    name: 'Almoxarifado',
    fullName: 'Gestão de Estoque & Importador NF-e',
    description: 'Entrada via XML da SEFAZ com recálculo automático de Custo Médio Unitário Ponderado.',
    category: 'FISCAL',
    icon: Package,
    badge: 'Custo Médio',
    keywords: ['estoque', 'almoxarifado', 'insumo', 'nfe', 'xml', 'compra', 'defensivo'],
  },
  {
    id: 'ARRENDAMENTO',
    name: 'Arrendamentos',
    fullName: 'Arrendamentos Rurais & Parcerias Agrícolas',
    description: 'Contratos pactuados em sacas/ha, Estatuto da Terra e liquidação financeira integrada ao LCDPR.',
    category: 'FISCAL',
    icon: FileSignature,
    badge: 'Estatuto Terra',
    keywords: ['arrendamento', 'contrato', 'saca', 'terra', 'parceria', 'aluguel', 'recibo', 'gleba'],
  },
  {
    id: 'RELATORIO',
    name: 'Caderno Campo',
    fullName: 'Caderno de Campo & Auditoria Oficial',
    description: 'Relatório executivo para comprovação de crédito rural (Proagro), bancos e seguradoras.',
    category: 'FISCAL',
    icon: FileText,
    badge: 'Crédito Rural',
    keywords: ['relatorio', 'caderno de campo', 'proagro', 'auditoria', 'banco', 'seguro'],
  },

  // Categoria: Pecuária
  {
    id: 'ZOOTECNIA',
    name: 'Zootecnia',
    fullName: 'Pecuária de Precisão & Trava de Carência',
    description: 'Rastreabilidade com bastão RFID, pesagens com GMD e bloqueio de abate sob carência.',
    category: 'PECUARIA',
    icon: Activity,
    badge: 'RFID & MAPA',
    keywords: ['gado', 'boi', 'rfid', 'zootecnia', 'gmd', 'carencia', 'medicamento', 'peso'],
  },
  {
    id: 'ILPF',
    name: 'ILPF & Boi Safrinha',
    fullName: 'Integração Lavoura-Pecuária-Floresta (ILPF) & Boi Safrinha',
    description: 'Manejo de forrageiras de entressafra, pastejo rotacionado, @/ha e preservação de palhada.',
    category: 'PECUARIA',
    icon: Trees,
    badge: 'Embrapa ILPF',
    keywords: ['ilpf', 'boi', 'safrinha', 'braquiaria', 'pastagem', 'eucalipto', 'palhada', 'carne', 'arroba'],
  },
  {
    id: 'CONFINAMENTO',
    name: 'Confinamento & Cocho',
    fullName: 'Confinamento Intensivo Bovino & Gestão de Cocho',
    description: 'Nutrição de alto grão, consumo de matéria seca (CMS), conversão alimentar e margem líquida por boi.',
    category: 'PECUARIA',
    icon: Flame,
    badge: 'Feedlot 4.0',
    keywords: ['confinamento', 'cocho', 'feedlot', 'boi china', 'dieta', 'gmd', 'cms', 'arroba', 'nelore', 'angus'],
  },
  {
    id: 'SILAGEM_FORRAGEM',
    name: 'Silagem & KPS',
    fullName: 'Qualidade de Silagem, KPS & Compactação de Silo Trincheira',
    description: 'Kernel Processing Score (KPS), densidade em kg MS/m³ e perdas fermentativas.',
    category: 'PECUARIA',
    icon: Wheat,
    badge: 'KPS Bromatologia',
    keywords: ['silagem', 'kps', 'milho', 'trincheira', 'forragem', 'materia seca', 'confinamento', 'gado'],
  },
  {
    id: 'BIODIGESTOR_BIOMETANO',
    name: 'Biometano & GD',
    fullName: 'Biodigestores, Biometano & Geração Distribuída (GD)',
    description: 'Conversão de dejetos suínos/bovinos em biogás, motogerador (kWh) e créditos de metano.',
    category: 'PECUARIA',
    icon: Flame,
    badge: 'Biogás GD',
    keywords: ['biodigestor', 'biometano', 'biogas', 'metano', 'gerador', 'energia', 'dejetos', 'suinos', 'boi'],
  },
  {
    id: 'PISCICULTURA_AQUICULTURA',
    name: 'Piscicultura & O₂',
    fullName: 'Piscicultura de Precisão & Telemetria Aquícola',
    description: 'Biomassa em tanques-rede, oxigênio dissolvido em tempo real, arraçoamento e FCR.',
    category: 'PECUARIA',
    icon: Fish,
    badge: 'Aquicultura 4.0',
    keywords: ['piscicultura', 'aquicultura', 'peixe', 'tilapia', 'tambaqui', 'oxigenio', 'racao', 'fcr', 'tanque'],
  },
  {
    id: 'SILVICULTURA_IMA',
    name: 'Silvicultura & Eucalipto',
    fullName: 'Silvicultura de Precisão & Manejo Florestal (IMA & Spurr)',
    description: 'Dendrometria (DAP, altura), modelo volumétrico Spurr, IMA m³/ha/ano, certificação FSC e estoque de carbono.',
    category: 'CAMPO',
    icon: Trees,
    badge: 'IMA Spurr FSC',
    keywords: ['silvicultura', 'eucalipto', 'floresta', 'ima', 'dap', 'spurr', 'fsc', 'pefc', 'madeira', 'carbono'],
  },
  {
    id: 'MERCADO_CARBONO_SBCE',
    name: 'Mercado Carbono SBCE',
    fullName: 'Mercado Regulado de Carbono • SBCE & Finanças Verdes',
    description: 'Créditos auditados SBCE, remoções líquidas de solo/floresta e bonificação verde no custeio Plano Safra.',
    category: 'MERCADO',
    icon: Globe,
    badge: 'SBCE & CPR Verde',
    keywords: ['sbce', 'carbono', 'credito', 'cpr verde', 'plano safra', 'juros', 'desagio', 'bndes', 'artigo 6'],
  },
  {
    id: 'APICULTURA_POLINIZACAO',
    name: 'Apicultura & Polinização',
    fullName: 'Apicultura de Precisão & Polinização Dirigida (Bee-Safe)',
    description: 'Incremento de pegamento floral na soja/café (+14%), colmeias georreferenciadas e alerta contra deriva.',
    category: 'CAMPO',
    icon: Flower2,
    badge: 'Bee-Safe Embrapa',
    keywords: ['apicultura', 'abelhas', 'polinizacao', 'mel', 'propolis', 'soja', 'cafe', 'deriva', 'bee safe'],
  },
  {
    id: 'HEVEICULTURA_BORRACHA',
    name: 'Heveicultura & Borracha',
    fullName: 'Heveicultura de Precisão & Borracha Natural (DRC & Sangria)',
    description: 'Manejo de seringal, painéis de sangria d/3 1/2S, teor de borracha seca (DRC) e cotação GEB-10.',
    category: 'CAMPO',
    icon: Trees,
    badge: 'DRC GEB-10',
    keywords: ['heveicultura', 'seringueira', 'borracha', 'drc', 'sangria', 'ethephon', 'latex', 'coagulo'],
  },
  {
    id: 'VITIVINICULTURA_PRECISAO',
    name: 'Vitivinicultura & Vinhos',
    fullName: 'Vitivinicultura de Precisão & Enologia (°Brix & Huglin)',
    description: 'Acompanhamento de maturação °Brix, acidez titulável, índice Huglin, canópia e rastreabilidade de vinhedos.',
    category: 'CAMPO',
    icon: Wine,
    badge: '°Brix Huglin',
    keywords: ['vitivinicultura', 'uva', 'vinho', 'brix', 'huglin', 'enologia', 'vindima', 'canopia'],
  },
  {
    id: 'OVINOCULTURA_CAPRINOS',
    name: 'Ovinocultura & Caprinos',
    fullName: 'Ovinocultura & Caprinocultura de Precisão (FAMACHA© & ECC)',
    description: 'Controle seletivo de verminose Haemonchus pelo método FAMACHA, terminação de cordeiros e leite caprino.',
    category: 'PECUARIA',
    icon: HeartPulse,
    badge: 'FAMACHA© & GPD',
    keywords: ['ovinos', 'caprinos', 'famacha', 'cordeiro', 'dorper', 'santa ines', 'verminose', 'leite', 'creep'],
  },
  {
    id: 'CITRICULTURA_PRECISAO',
    name: 'Citricultura & Sanidade HLB',
    fullName: 'Citricultura de Precisão & Controle de Greening (HLB)',
    description: 'Monitoramento de psilídeo Diaphorina citri, erradicação compulsória IN 38 e ratio Brix/Acidez para suco.',
    category: 'CAMPO',
    icon: Factory,
    badge: 'HLB & Ratio',
    keywords: ['citros', 'laranja', 'greening', 'hlb', 'psilideo', 'suco', 'fcoj', 'nfc', 'brix', 'acidez'],
  },
  {
    id: 'AVICULTURA_CLIMATIZADA',
    name: 'Avicultura & Dark House',
    fullName: 'Avicultura Climatizada & Frango de Corte 4.0 (IEP & Dark House)',
    description: 'Ambiência automatizada em túnel de vento, pressão negativa, conversão alimentar e cálculo de IEP exportação.',
    category: 'PECUARIA',
    icon: Wind,
    badge: 'Dark House IEP',
    keywords: ['avicultura', 'frango', 'corte', 'dark house', 'iep', 'conversao', 'ambiencia', 'climatizacao'],
  },
  {
    id: 'ORIZICULTURA_ARROZ',
    name: 'Orizicultura & Arroz AWD',
    fullName: 'Orizicultura de Precisão & Arroz Irrigado (Manejo AWD)',
    description: 'Nivelamento a laser de taipas, alternância hídrica AWD, redução de metano CH₄ e renda de engenho.',
    category: 'CAMPO',
    icon: Waves,
    badge: 'AWD & Metano',
    keywords: ['arroz', 'orizicultura', 'awd', 'taipa', 'lamina', 'irrigado', 'metano', 'irga', 'engenho'],
  },
  {
    id: 'CACAULICULTURA_CABRUCA',
    name: 'Cacaulicultura & Cabruca',
    fullName: 'Cacaulicultura de Precisão & Sistema Cabruca (Cacau Fino)',
    description: 'SAF Cabruca sob Mata Atlântica, curva térmica de fermentação em cochos e ágio de cacau gourmet bean-to-bar.',
    category: 'CAMPO',
    icon: TreeDeciduous,
    badge: 'Cabruca & Bean-to-Bar',
    keywords: ['cacau', 'cabruca', 'chocolate', 'bean-to-bar', 'fermentacao', 'bahia', 'theobroma', 'saf'],
  },
  {
    id: 'BOVINOCULTURA_LEITE',
    name: 'Bovinocultura de Leite 4.0',
    fullName: 'Bovinocultura Leiteira & Ordenha Robotizada (IN 76/77 & IOFC)',
    description: 'Controle robotizado de ordenha, contagem bacteriana CBT, células somáticas CCS e margem líquida IOFC.',
    category: 'PECUARIA',
    icon: Activity,
    badge: 'IN 76/77 & IOFC',
    keywords: ['leite', 'bovinocultura', 'ordenha', 'robotica', 'ccs', 'cbt', 'iofc', 'vaca', 'holandesa', 'girolando', 'lactacao'],
  },
  {
    id: 'OLIVICULTURA_AZEITE',
    name: 'Olivicultura & Azeite EVOO',
    fullName: 'Olivicultura de Precisão & Azeite Extravirgem (Lagar & Acidez)',
    description: 'Índice de maturação Jaén, extração a frio < 27°C, acidez oleica livre < 0.20% e polifenóis totais.',
    category: 'CAMPO',
    icon: Droplet,
    badge: 'EVOO < 0.20%',
    keywords: ['oliva', 'azeite', 'extravirgem', 'evoo', 'olea', 'arbequina', 'koroneiki', 'picual', 'jaen', 'acidez', 'polifenois', 'lagar'],
  },
  {
    id: 'OLERICULTURA_HF',
    name: 'Olericultura & Hortifrúti',
    fullName: 'Olericultura de Precisão & Hortifrúti HF (Tomate, Batata & Cebola)',
    description: 'Fertirrigação por gotejamento, alerta de Requeima e Pinta Preta por molhamento foliar e classificação comercial de calibres.',
    category: 'CAMPO',
    icon: Apple,
    badge: 'HF & Requeima',
    keywords: ['olericultura', 'hortifruti', 'hf', 'tomate', 'batata', 'cebola', 'alho', 'requeima', 'ceagesp', 'calibre', 'gotejamento'],
  },
  {
    id: 'SUINOCULTURA_PRECISAO',
    name: 'Suinocultura 4.0 & Bem-Estar',
    fullName: 'Suinocultura de Precisão & Confinamento Climatizado (DFA & ITGH)',
    description: 'Ciclo completo, desmamados por fêmea/ano DFA > 32, ambiência com pressão negativa e margem sobre ração.',
    category: 'PECUARIA',
    icon: HeartPulse,
    badge: 'DFA & ITGH 4.0',
    keywords: ['suinocultura', 'suinos', 'porco', 'matriz', 'leitao', 'creche', 'dfa', 'gpd', 'itgh', 'confinamento', 'abpa'],
  },
  {
    id: 'MANDIOCULTURA_AMIDO',
    name: 'Mandiocultura & Fecularia',
    fullName: 'Mandiocultura de Precisão & Balança Hidrostática (Amido/Fécula)',
    description: 'Balança Grossmann de matéria seca, bonificação industrial em fecularias e controle de Mandarová com Baculovirus.',
    category: 'CAMPO',
    icon: Scale,
    badge: 'Grossmann > 32%',
    keywords: ['mandioca', 'fecularia', 'amido', 'fecula', 'grossmann', 'farinha', 'raiz', 'mandarova', 'baculovirus', 'iac'],
  },
  {
    id: 'LUPULICULTURA_CERVEJA',
    name: 'Lupulicultura & Cerveja',
    fullName: 'Lupulicultura Tropical & Peletização T-90 (Alpha-Ácidos & Craft Beer)',
    description: 'Espaldeira alta com fotoperíodo artificial LED, teor de alpha-ácidos e óleos essenciais para microcervejarias.',
    category: 'CAMPO',
    icon: Beer,
    badge: 'T-90 Alpha-Ácidos',
    keywords: ['lupulo', 'cerveja', 'craft beer', 'alpha acidos', 'humulus', 'cascade', 'chinook', 'pellet', 't90', 'fotoperiodo'],
  },
  {
    id: 'BANANICULTURA_CLIMATIZADA',
    name: 'Bananicultura & Climatização',
    fullName: 'Bananicultura de Precisão & Cadeia Climatizada (Stover & Gás Etileno)',
    description: 'Escala Stover de Sigatoka, desfolha cirúrgica, câmaras de maturação hermética com etileno e escala Von Loesecke.',
    category: 'CAMPO',
    icon: Apple,
    badge: 'Stover & Etileno C2H4',
    keywords: ['banana', 'bananicultura', 'sigatoka', 'stover', 'etileno', 'loesecke', 'prata', 'cavendish', 'climatizacao', 'exportacao'],
  },
  {
    id: 'CONFINAMENTO_CORDEIROS',
    name: 'Confinamento de Cordeiros',
    fullName: 'Terminação Intensiva de Cordeiros de Corte (Alto Grão & NRC Ovinos)',
    description: 'Dieta de grão inteiro (15:85), prevenção de acidose ruminal com monensina/tamponante e tipificação de cortes gourmet.',
    category: 'PECUARIA',
    icon: Award,
    badge: 'Alto Grão & French Rack',
    keywords: ['cordeiro', 'ovinos', 'confinamento', 'carneiro', 'alto grao', 'dorper', 'santa ines', 'french rack', 'carcaca', 'famacha'],
  },
  {
    id: 'CULTIVO_PROTEGIDO_HIDROPONIA',
    name: 'Estufas & Hidroponia NFT',
    fullName: 'Cultivo Protegido & Estufas Hidropônicas NFT (Solução Nutritiva & VPD)',
    description: 'Ambiente controlado (CEA), condutividade elétrica, oxigênio dissolvido, VPD e prevenção de tip burn.',
    category: 'CAMPO',
    icon: Droplets,
    badge: 'NFT & Solução Furlani',
    keywords: ['hidroponia', 'estufa', 'cultivo protegido', 'nft', 'alface', 'vpd', 'furlani', 'solucao nutritiva', 'rucula', 'cea'],
  },
  {
    id: 'EQUINOCULTURA_MANEJO',
    name: 'Equinocultura & Haras',
    fullName: 'Equinocultura de Precisão, Manejo Reprodutivo & Haras (TE & Henneke)',
    description: 'Biotécnicas reprodutivas em equinos (TE/IA), escore Henneke, nutrição NRC e sanidade oficial MAPA (AIE/Mormo).',
    category: 'PECUARIA',
    icon: Award,
    badge: 'Biotécnicas TE & MAPA',
    keywords: ['equinos', 'cavalo', 'haras', 'mangalarga', 'quarto de milha', 'reproducao', 'embriao', 'henneke', 'aie', 'mormo'],
  },
  {
    id: 'PALMA_FORRAGEIRA',
    name: 'Palma Forrageira & Seca',
    fullName: 'Palma Forrageira & Pecuária Resiliente no Semiárido (Cochonilha & Água Biológica)',
    description: 'Clones imunes à Cochonilha-do-Carmim, aporte hídrico vegetal nativo e balanceamento dietético com fibra e ureia.',
    category: 'CAMPO',
    icon: Leaf,
    badge: 'Água Biológica CAM',
    keywords: ['palma', 'semiarido', 'cochonilha', 'seca', 'forragem', 'opuntia', 'nopalea', 'sertao', 'nordeste', 'ureia'],
  },
  {
    id: 'BUBALINOCULTURA_QUEIJO',
    name: 'Bubalinocultura & Mozzarella',
    fullName: 'Bubalinocultura Leiteira & Derivados Lácteos A2A2 (Mozzarella & Burrata)',
    description: 'Rendimento queijeiro de 5.2 L/kg, 7.8% de gordura láctea, leite naturalmente A2A2 e agregação gourmet.',
    category: 'PECUARIA',
    icon: Milk,
    badge: 'Mozzarella 5.2 L/kg',
    keywords: ['bufalas', 'bubalinos', 'mozzarella', 'burrata', 'leite', 'a2a2', 'queijo', 'murrah', 'caseina', 'doc'],
  },
  {
    id: 'RANICULTURA_SUSTENTAVEL',
    name: 'Ranicultura & Anfigranja',
    fullName: 'Ranicultura Comercial & Sistema Anfigranja (Carne Nobre & Curtimento de Pele)',
    description: 'Criação intensiva de rã-touro, cochos vibratórios com atrativo vivo, conversão alimentar 1.30 e couro de rã.',
    category: 'PECUARIA',
    icon: Activity,
    badge: 'Anfigranja & Couro',
    keywords: ['ranicultura', 'ras', 'anfibios', 'anfigranja', 'pernas de ra', 'couro de ra', 'lithobates', 'cocho vibratorio'],
  },
  {
    id: 'CARCINICULTURA_BIOFLOCOS',
    name: 'Carcinicultura & Bioflocos',
    fullName: 'Carcinicultura de Precisão & Camarão BFT (Litopenaeus vannamei & C:N)',
    description: 'Tecnologia de bioflocos em circuito fechado, relação C:N 12-16, zero efluente e camarão superintensivo.',
    category: 'PECUARIA',
    icon: Waves,
    badge: 'BFT & Zero Efluente',
    keywords: ['camarao', 'carcinicultura', 'bioflocos', 'bft', 'vannamei', 'melaco', 'amonia', 'aquicultura', 'tanque'],
  },
  {
    id: 'CUNICULTURA_INDUSTRIAL',
    name: 'Cunicultura & Coelhos',
    fullName: 'Cunicultura Industrial & Comercial (Matrizes, IA 42d & Peles Curtidas)',
    description: 'Criação intensiva de coelhos de corte em gaiolas climatizadas, bandas de IA, 58% de carcaça e peles nobres.',
    category: 'PECUARIA',
    icon: Heart,
    badge: 'IA 42d & 58% Carcaça',
    keywords: ['coelhos', 'cunicultura', 'cunicultura industrial', 'carne branca', 'peles', 'californiano', 'nova zelandia'],
  },
  {
    id: 'FUNGICULTURA_COGUMELOS',
    name: 'Fungicultura & Shitake',
    fullName: 'Fungicultura de Precisão & Cogumelos Nobres (Shitake, Shimeji & EB%)',
    description: 'Câmaras de frutificação climatizadas com controle de umidade e CO₂, substrato axênico e 75% de eficiência biológica.',
    category: 'CAMPO',
    icon: Sparkles,
    badge: '75% Eficiência Biológica',
    keywords: ['cogumelos', 'fungicultura', 'shitake', 'shimeji', 'champignon', 'substrato', 'micelio', 'frutificacao'],
  },
  {
    id: 'SERICICULTURA_SEDA',
    name: 'Sericicultura & Seda',
    fullName: 'Sericicultura de Precisão & Casulos de Seda (Bombyx mori & Amoreira)',
    description: 'Manejo de amoreiras e criação de lagartas em sirgarias, subida em bosques rotativos e fiação de seda de exportação.',
    category: 'CAMPO',
    icon: Scissors,
    badge: 'Bratac Silk 18.5%',
    keywords: ['seda', 'sericicultura', 'bicho da seda', 'casulo', 'amoreira', 'morus alba', 'sirgaria', 'bosque', 'bratac'],
  },
  {
    id: 'ALGOTECNOLOGIA_MICROALGAS',
    name: 'Algotecnologia & Microalgas',
    fullName: 'Algotecnologia de Precisão & Microalgas (Spirulina, Chlorella & Fixação CO₂)',
    description: 'Cultivo contínuo em lagoas raceway, injeção de CO₂, 18 g/m²/dia de biomassa seca e bioestimulantes de solo.',
    category: 'CAMPO',
    icon: Leaf,
    badge: 'Fixação CO₂ Raceway',
    keywords: ['microalgas', 'algotecnologia', 'spirulina', 'chlorella', 'raceway', 'bioestimulante', 'co2', 'biomassa'],
  },
  {
    id: 'MINHOCULTURA_HUMUS',
    name: 'Minhocultura & Húmus',
    fullName: 'Minhocultura & Vermicompostagem Industrial (Eisenia fetida & Ácidos Húmicos)',
    description: 'Reciclagem acelerada de dejetos orgânicos, produção de húmus micropenetrável sólido e biofertilizante líquido concentrado.',
    category: 'CAMPO',
    icon: Leaf,
    badge: 'Húmus & Ácidos Húmicos',
    keywords: ['minhocas', 'vermicompostagem', 'humus', 'eisenia', 'california', 'biofertilizante', 'esterco', 'organico'],
  },
  {
    id: 'HELICICULTURA_ESCARGOT',
    name: 'Helicicultura & Escargot',
    fullName: 'Helicicultura Comercial & Mucina Cosmética (Cornu aspersum & Alta Gastronomia)',
    description: 'Criação intensiva de caracóis em parques sombreados, extração não letal por ozônio de mucina pura e carne gourmet.',
    category: 'PECUARIA',
    icon: Sparkles,
    badge: 'Mucina Pura & Escargot',
    keywords: ['caracol', 'escargot', 'helicicultura', 'mucina', 'snail mucin', 'cosmeticos', 'gourmet', 'alantoina'],
  },
  {
    id: 'OEM_TELEMATICS_GATEWAY',
    name: 'Telemetria OEM & MQTT',
    fullName: 'Gateway Universal OEM Telematics & Broker MQTT Edge (John Deere, Case IH & Balança)',
    description: 'Bridge multimarca para telemetria em nuvem (JDApi, AFS Connect), sniffer CAN J1939 e balança serial local.',
    category: 'FROTA',
    icon: Radio,
    badge: 'John Deere & Case IH',
    keywords: ['telemetria', 'oem', 'john deere', 'case ih', 'new holland', 'trimble', 'isobus', 'can bus', 'mqtt', 'balanca'],
  },
  {
    id: 'SEFAZ_GEO_AUDITOR',
    name: 'SEFAZ A1 & Auditor CAR',
    fullName: 'Emissor SEFAZ com Certificado A1 & Auditor Geoespacial CAR/SIGEF/IBAMA',
    description: 'Criptografia SHA-256 e DigestValue para NF-e/MDF-e, Módulo 11 e cruzamento territorial contra embargos ambientais.',
    category: 'FISCAL',
    icon: Lock,
    badge: 'SHA-256 & CAR/EUDR',
    keywords: ['sefaz', 'a1', 'certificado digital', 'nfe', 'mdfe', 'car', 'sigef', 'ibama', 'embargo', 'xml', 'eudr'],
  },
  {
    id: 'CAJUCULTURA_DOC',
    name: 'Cajucultura & Castanha DOC',
    fullName: 'Cajucultura de Precisão, Castanhas Nobres & Cajuína DOC',
    description: 'Clones de caju-anão precoce (CCP-76), classificação de amêndoas W1 a W4, suco clarificado com gelatina alimentícia e cajuína cristalina.',
    category: 'CAMPO',
    icon: Apple,
    badge: 'Caju-Anão & Cajuína DOC',
    keywords: ['caju', 'castanha', 'cajuina', 'pedunculo', 'ceara', 'piaui', 'amendoa', 'beneficiamento'],
  },
  {
    id: 'FAZENDAS_VERTICAIS_AEROPONIA',
    name: 'Fazendas Verticais & Aeroponia',
    fullName: 'Fazendas Verticais Indoor & Aeroponia 4.0 (Névoa Radicular & LED)',
    description: 'Controle ambiental CEA, iluminação espectral Samsung LED, névoa HPA de 30-50 micras diretamente nas raízes e 28 ciclos anuais.',
    category: 'CAMPO',
    icon: Layers,
    badge: '8 Andares & 98% Menos Água',
    keywords: ['vertical', 'indoor', 'aeroponia', 'cea', 'led', 'baby leaf', 'microverdes', 'hpa', 'sem solo'],
  },
  {
    id: 'ERVA_MATE_SAPECO',
    name: 'Erva-Mate & Sapeco',
    fullName: 'Erva-Mate de Precisão, Agrofloresta Sombreada & Sapeco Térmico',
    description: 'Ervais sob araucárias, choque térmico por sapeco a 450°C para inativação enzimática e maturação em barricas de cedro.',
    category: 'CAMPO',
    icon: Leaf,
    badge: 'Sapeco 450°C & Barricas',
    keywords: ['erva mate', 'chimarrao', 'terere', 'sapeco', 'cancheada', 'araucaria', 'ilex paraguariensis'],
  },
  {
    id: 'DENDEICULTURA_RSPO',
    name: 'Dendeicultura & Palma RSPO',
    fullName: 'Dendeicultura de Precisão, Óleo de Palma CPO & Certificação RSPO',
    description: 'Monitoramento de CFF em solos antropizados ZAE-Dendê, taxa de extração OER de 22.5%, rastreabilidade e prêmio verde RSPO.',
    category: 'CAMPO',
    icon: Trees,
    badge: 'RSPO & 22.5% OER',
    keywords: ['dende', 'palma', 'oleo de palma', 'cpo', 'rspo', 'cff', 'palmiste', 'para', 'zae'],
  },
  {
    id: 'MARICULTURA_OSTRAS',
    name: 'Maricultura & Ostras UV-C',
    fullName: 'Maricultura Oceânica de Precisão & Malacocultura (Ostras & Mexilhões)',
    description: 'Longlines e lanternas oceânicas, monitoramento de marés e ficotoxinas por boia IoT e estação terrestre de depuração UV-C.',
    category: 'PECUARIA',
    icon: Waves,
    badge: 'Longlines & UV-C 254nm',
    keywords: ['maricultura', 'ostras', 'mexilhoes', 'malacocultura', 'longline', 'depuracao', 'uv-c', 'marinho', 'aquicultura'],
  },
  {
    id: 'ORQUESTRADOR_AUTONOMO_40',
    name: 'Orquestrador Autônomo 4.0',
    fullName: 'Central Autônoma 4.0: Enxame Robótico & Gêmeo Digital (ISO 18497)',
    description: 'Orquestração de frotas autônomas nível 4: tratores elétricos, drones pesados e rovers guiados por RTK centimétrico e IA em borda.',
    category: 'FROTA',
    icon: Cpu,
    badge: 'Nível 4 Autônomo & RTK',
    keywords: ['autonomo', 'robo', 'enxame', 'drone', 'trator eletrico', 'digital twin', 'iso 18497', 'rtk', '5g', 'ia'],
  },
  {
    id: 'BATATICULTURA_CHIPS',
    name: 'Bataticultura & Chips GE',
    fullName: 'Bataticultura de Precisão, Gravidade Específica & Requeima (Phytophthora)',
    description: 'Gravidade específica > 1.080 na balança hidrostática, 21.6% de matéria seca para chips industriais e previsão de requeima.',
    category: 'CAMPO',
    icon: Leaf,
    badge: 'GE > 1.080 & Chips',
    keywords: ['batata', 'chips', 'fritas', 'gravidade especifica', 'materia seca', 'requeima', 'phytophthora', 'atlantic', 'asterix'],
  },
  {
    id: 'CEBOLA_ALHO_CURA',
    name: 'Cebolicultura & Alho Nobre',
    fullName: 'Cebolicultura & Alho Nobre: Cura Térmica 34°C & Frigoconservação',
    description: 'Túneis de ar forçado a 34°C para cicatrização do pescoço, túnicas douradas perfeitas e vernalização de alho-semente a 4°C.',
    category: 'CAMPO',
    icon: Flame,
    badge: 'Túnel 34°C & Vernalização',
    keywords: ['cebola', 'alho', 'allium', 'cura', 'vernalizacao', 'frigoconservacao', 'tunicas', 'pescoco', 'classe 3'],
  },
  {
    id: 'MELIPONICULTURA_ASF',
    name: 'Meliponicultura & ASFs',
    fullName: 'Meliponicultura 4.0: Abelhas Nativas Sem Ferrão & Polinização Dirigida',
    description: 'Manejo de Mandaçaia, Tiúba e Jataí para polinização por vibração em estufas (+28.5% vingamento) e mel medicinal R$ 180/L.',
    category: 'CAMPO',
    icon: Flower2,
    badge: 'Buzz Pollination & R$ 180/L',
    keywords: ['melipona', 'abelhas nativas', 'asf', 'mandacaia', 'jatai', 'tiuba', 'polinizacao', 'mel', 'morango', 'estufa'],
  },
  {
    id: 'CAPRINOCULTURA_QUEIJOS',
    name: 'Caprinocultura & Chèvre',
    fullName: 'Caprinocultura Leiteira de Precisão, Queijaria Artesanal & Chèvre Nobre',
    description: 'Aprisco suspenso Saanen/Alpina, lactação de 3.2 L/dia, calibração apócrina de CCS e maturação de queijo Chèvre a R$ 95/kg.',
    category: 'PECUARIA',
    icon: Milk,
    badge: 'Saanen & Chèvre R$ 95/kg',
    keywords: ['caprinos', 'cabras', 'leite de cabra', 'chevre', 'crottin', 'saanen', 'alpina', 'aprisco', 'queijo', 'apocrina'],
  },
  {
    id: 'CARBONO_AZUL_MARINHO',
    name: 'Carbono Azul & Créditos',
    fullName: 'Balanço de Carbono Azul Oceânico & Pagamento por Serviços Ambientais (PSA)',
    description: 'Fixação de CaCO₃ na concha de ostras (75.24 t CO₂eq), bioextração de 756 kg N costeiro e tokens de crédito de carbono marinho.',
    category: 'MERCADO',
    icon: Waves,
    badge: 'Blue Carbon & PSA Marinho',
    keywords: ['carbono azul', 'blue carbon', 'ostras', 'conchas', 'caco3', 'nitrogenio', 'psa', 'credito de carbono', 'oceano'],
  },
  {
    id: 'NOZ_PECAN_POMARES',
    name: 'Nozes Pecan & Amêndoas',
    fullName: 'Nozes Pecan de Precisão, Colheita Shaker & Amêndoas Halves',
    description: 'Manejo de Carya illinoinensis, nutrição foliar de zinco, colheita mecânica por vibração e 54% de rendimento de amêndoa.',
    category: 'CAMPO',
    icon: Trees,
    badge: '54% Amêndoa Halves',
    keywords: ['pecan', 'noz', 'carya', 'amendoa', 'shaker', 'barton', 'zinco', 'halves', 'rs'],
  },
  {
    id: 'MACADAMIA_PROCESSAMENTO',
    name: 'Macadâmia & Quebra NIS',
    fullName: 'Macadâmia de Precisão, Secagem em Silos NIS & Amêndoas Estilo 0 e 1',
    description: 'Despolpamento imediato da casca verde, secagem de noz com casca para 1.5% e quebra sem trinca para amêndoas inteiras.',
    category: 'CAMPO',
    icon: Trees,
    badge: 'NIS 1.5% & Estilo 0/1',
    keywords: ['macadamia', 'noz', 'nis', 'quebrador', 'estilo 0', 'estilo 1', 'haes', 'amendoa', 'sp'],
  },
  {
    id: 'GUARANICULTURA_AMAZONIA',
    name: 'Guaraná & IG Maués',
    fullName: 'Guaranicultura de Precisão: Clones BRS, Colheita & Torra Maués',
    description: 'Clones Embrapa de alta produtividade, colheita olho-de-boi, torrefação tradicional em forno de barro e 4.8% cafeína pura.',
    category: 'CAMPO',
    icon: Coffee,
    badge: 'IG Maués & 4.8% Cafeína',
    keywords: ['guarana', 'maues', 'amazonia', 'cafeina', 'olho de boi', 'forno de barro', 'brs', 'paullinia cupana'],
  },
  {
    id: 'PIMENTA_DO_REINO_QUALIDADE',
    name: 'Pimenta-do-Reino ASTA',
    fullName: 'Pimenta-do-Reino de Precisão: Tutores, Branqueamento & Padrão ASTA',
    description: 'Tutores vivos de gliricídia, choque hidrotérmico a 80°C para escurecimento enzimático e densidade > 550 g/L ASTA Grade 1.',
    category: 'CAMPO',
    icon: Leaf,
    badge: 'ASTA Grade 1 & 565 g/L',
    keywords: ['pimenta do reino', 'piper nigrum', 'piperina', 'asta', 'tome acu', 'gliricidia', 'branqueamento', 'espirito santo'],
  },
  {
    id: 'INTELIGENCIA_BASIS_PORTUARIO',
    name: 'Arbitragem Basis & Portos',
    fullName: 'Inteligência de Basis Portuário & Paridade de Exportação (FOB vs Fazenda)',
    description: 'Cotações CBOT em tempo real, prêmios de basis Paranaguá/Santos/Itaqui, fretes rodoviários e controle de risco de demurrage.',
    category: 'MERCADO',
    icon: TrendingUp,
    badge: 'FOB Santos/Paranaguá',
    keywords: ['basis', 'cbot', 'chicago', 'paranagua', 'santos', 'itaqui', 'paridade exportacao', 'fob', 'frete', 'demurrage'],
  },
  {
    id: 'CACAU_FINO_FERMENTACAO',
    name: 'Cacau Fino & Tree-to-Bar',
    fullName: 'Cacau Fino & Fermentação Tree-to-Bar: Cochos 50°C, Cut Test & Prêmio Especial',
    description: 'Controle de temperatura em cochos de madeira, viragens diárias, secagem solar em barcaças e 82% de amêndoas bem fermentadas.',
    category: 'CAMPO',
    icon: Sparkles,
    badge: 'Cut Test > 75% Fino',
    keywords: ['cacau', 'chocolate', 'tree to bar', 'fermentacao', 'cocho', 'cut test', 'barcaca', 'bahia', 'medicilandia'],
  },
  {
    id: 'TAINHA_AQUICULTURA_ESTUARINA',
    name: 'Tainha & Bottarga Nobre',
    fullName: 'Tainha & Aquicultura Estuarina Sustentável: Mugil liza & Bottarga Curada',
    description: 'Engorda em estuários e lagoas costeiras com maré natural, maturação gonadal a 22 ppt e cura de Bottarga a R$ 420/kg.',
    category: 'PECUARIA',
    icon: Fish,
    badge: 'Mugil liza & Bottarga',
    keywords: ['tainha', 'bottarga', 'mugil', 'estuario', 'peixe', 'ova', 'salga', 'cura', 'sc', 'sp'],
  },
  {
    id: 'CASTANHA_BRASIL_EXTRATIVISMO',
    name: 'Castanha-do-Brasil 4.0',
    fullName: 'Castanha-do-Brasil & Extrativismo 4.0: Resex, Aflatoxina Livre & Exportação',
    description: 'Georreferenciamento de castanheiras centenárias, desencasque rápido na mata, padrão UE < 4 ppb aflatoxina e amêndoas nobres.',
    category: 'CAMPO',
    icon: Trees,
    badge: 'Resex & < 4 ppb Aflatoxina',
    keywords: ['castanha do brasil', 'castanha do para', 'resex', 'chico mendes', 'aflatoxina', 'amazonia', 'selenio', 'extrativismo'],
  },
  {
    id: 'GERGELIM_SEGUNDA_SAFRA',
    name: 'Gergelim & Safrinha Cerrado',
    fullName: 'Gergelim de Segunda Safra & Exportação Asiática (Tipo 1 & > 50% Óleo)',
    description: 'Safrinha tolerante à seca no Cerrado (MT/GO), cultivares indeiscentes, desidratação uniforme e exportação para Ásia e Oriente Médio.',
    category: 'CAMPO',
    icon: Wheat,
    badge: 'Tipo 1 & > 50% Óleo',
    keywords: ['gergelim', 'safrinha', 'sesame', 'oleo', 'canarana', 'mato grosso', 'exportacao', 'tahine', 'cerrado'],
  },
  {
    id: 'MONITORAMENTO_FILA_TERMINAIS',
    name: 'Fila de Terminais & Grãos',
    fullName: 'Monitoramento de Tráfego de Grãos & Fila de Terminais: Lei da Estadia 13.103',
    description: 'Gestão de pátios reguladores (PAR), agendamento rodoviário prévio, ciclo de tombador em 15 min e mitigação de multas de estadia.',
    category: 'MERCADO',
    icon: Truck,
    badge: 'Lei 13.103 & Pátio PAR',
    keywords: ['fila terminais', 'patio regulador', 'lei da estadia', '13103', 'santos', 'paranagua', 'tombador', 'agendamento'],
  },
  {
    id: 'PITAIA_PRECISAO',
    name: 'Pitaiacultura & Luz LED',
    fullName: 'Pitaiacultura de Precisão: Iluminação Noturna LED, Polinização & 16.5°Bx',
    description: 'Indução fotoperiódica para floradas na entressafra (+35% rendimento), polinização noturna e frutos Classe Extra Gourmet.',
    category: 'CAMPO',
    icon: Sparkles,
    badge: 'LED Noturno & 16.5°Bx',
    keywords: ['pitaia', 'pitaya', 'hylocereus', 'led', 'fotoperiodo', 'polinizacao noturna', 'brix', 'ceara', 'gourmet'],
  },
  {
    id: 'SUINOCULTURA_MATERNIDADE',
    name: 'Maternidade Suína 4.0',
    fullName: 'Suinocultura de Precisão: Maternidade Hiperprolífica & Anti-Esmagamento',
    description: 'Escamoteadores térmicos sensorizados, redução de mortalidade por esmagamento (< 4%) e colostragem precoce com creep feeding.',
    category: 'PECUARIA',
    icon: Heart,
    badge: 'Anti-Esmagamento < 4%',
    keywords: ['suinos', 'maternidade', 'leitao', 'porca', 'esmagamento', 'escamoteador', 'creep feeding', 'colostro', 'danbred', 'topigs'],
  },
  {
    id: 'ACAI_TERRA_FIRME',
    name: 'Açaí de Terra Firme',
    fullName: 'Açaicultura Irrigada em Terra Firme: BRS Pai d’Égua & Safra na Entressafra',
    description: 'Microaspersão subcopa de 120 L/dia, quebra da sazonalidade de várzea (colheita fev-jul) e extração de Açaí Grosso (> 14% sólidos).',
    category: 'CAMPO',
    icon: Trees,
    badge: 'Entressafra & > 14% Sólidos',
    keywords: ['acai', 'terra firme', 'brs pai de egua', 'irrigacao', 'solidos totais', 'despolpamento', 'para', 'tome acu'],
  },
  {
    id: 'REGULADORES_CRESCIMENTO',
    name: 'Reguladores de Crescimento',
    fullName: 'Reguladores de Crescimento & Biorreguladores: PBZ, Giberelinas & Indução Floral',
    description: 'Manejo hormonal na manga (PBZ gotejo), uva sem semente (alongamento GA3) e algodão (mepiquat) com ROI de 2.7x.',
    category: 'CAMPO',
    icon: FlaskConical,
    badge: 'PBZ & GA3 Hormonal',
    keywords: ['reguladores', 'hormonios', 'pbz', 'paclobutrazol', 'giberelina', 'ga3', 'manga', 'uva', 'etefon', 'mepiquat'],
  },
  {
    id: 'ZONEAMENTO_RISCO_ZARC',
    name: 'Zoneamento ZARC 2.0',
    fullName: 'Zoneamento Agrícola de Risco Climático (ZARC 2.0): MAPA, Solos AD & Seguro',
    description: 'Janelas decendiais de plantio, classificação de solos AD1/AD2/AD3 e enquadramento automático para Proagro e subvenção PSR.',
    category: 'MERCADO',
    icon: Compass,
    badge: 'Portarias ZARC MAPA',
    keywords: ['zarc', 'zoneamento', 'risco climatico', 'proagro', 'seguro rural', 'psr', 'ad1', 'ad2', 'ad3', 'decendio', 'mapa'],
  },
  {
    id: 'FLORICULTURA_FLORES_NOBRES',
    name: 'Floricultura & Flores Nobres',
    fullName: 'Floricultura em Estufa Climatizada & Flores Nobres: Veiling Holambra & Longevidade',
    description: 'Controle microclimático VPD, fertirrigação por condutividade elétrica, pulsing pós-colheita STS e classificação A1 Veiling Holambra.',
    category: 'CAMPO',
    icon: Flower2,
    badge: 'Veiling Holambra A1',
    keywords: ['flores', 'floricultura', 'holambra', 'rosa', 'orquidea', 'lisianthus', 'estufa', 'pulsing', 'vaso', 'veiling'],
  },
  {
    id: 'AVICULTURA_POSTURA_OVOS',
    name: 'Postura Comercial & Ovos',
    fullName: 'Avicultura de Postura Comercial: Cage-Free, Conversão kg/dz & Gema Roche 14',
    description: 'Controle de taxa de postura diária (>92%), conversão alimentar por dúzia, pigmentação da gema e integridade de casca (>0.35 mm).',
    category: 'PECUARIA',
    icon: Egg,
    badge: 'Cage-Free & Roche 14',
    keywords: ['postura', 'ovos', 'galinha', 'cage free', 'avicultura', 'roche', 'gema', 'bastos', 'conversa alimentar', 'lohmann'],
  },
  {
    id: 'FERTILIZANTES_ORGANOMINERAIS',
    name: 'Fertilizantes Organominerais',
    fullName: 'Fertilizantes Organominerais & Bioeconomia Circular: MAPA IN 61/2020 & Granulação',
    description: 'Valorização de resíduos agroindustriais (torta de filtro, cama de frango), condicionamento físico-químico do solo e granulação.',
    category: 'CAMPO',
    icon: Recycle,
    badge: 'MAPA IN 61 & COT > 8%',
    keywords: ['organomineral', 'adubo', 'fertilizante', 'compostagem', 'torta de filtro', 'cama de frango', 'biochar', 'ctc', 'npk'],
  },
  {
    id: 'AZEITONAS_MESA_PROCESSAMENTO',
    name: 'Azeitonas de Mesa & Cura',
    fullName: 'Azeitonas de Mesa & Cura Hidroeletrolítica: Método Sevilhano & Fermentação Lática',
    description: 'Desamargamento alcalino controlado de oleuropeína, fermentação lática em salmoura (pH < 4.0) e envase gourmet de alto valor.',
    category: 'CAMPO',
    icon: Droplets,
    badge: 'Método Sevilhano',
    keywords: ['azeitona', 'azeitona de mesa', 'oliva', 'desamargamento', 'oleuropeina', 'salmoura', 'sevilhano', 'manzanilla', 'gordal'],
  },
  {
    id: 'TORRE_CONTROLE_LOGISTICO_COC',
    name: 'Torre Logística & COC',
    fullName: 'Torre de Controle Logístico (COC): Telemetria RTK & Sincronismo de Fita Logística',
    description: 'Despacho dinâmico de rodotrens e transbordos, eliminação de tempo ocioso em filas de moega e redução de consumo de diesel.',
    category: 'FROTA',
    icon: Radio,
    badge: 'COC RTK & Slot Moega',
    keywords: ['coc', 'torre de controle', 'logistica', 'fita logistica', 'rodotrem', 'transbordo', 'moega', 'telemetria', 'diesel', 'dijkstra'],
  },
  {
    id: 'ALGODAO_HVI_CLASSIFICACAO',
    name: 'Algodão HVI Plus & Pluma',
    fullName: 'Algodão em Pluma & Classificação Instrumental HVI Plus (ABRAPA & BCI)',
    description: 'Análise instrumental fardo a fardo: Micronaire (3.8-4.5), Resistência (>30 g/tex), UHML, índice de fibras curtas e prêmios têxteis.',
    category: 'MERCADO',
    icon: Sparkles,
    badge: 'HVI Plus & ABR/BCI',
    keywords: ['algodao', 'pluma', 'hvi', 'micronaire', 'uhml', 'fardo', 'abrapa', 'bci', 'descarocador', 'resistencia', 'bahia', 'mt'],
  },
  {
    id: 'VINHOS_FINOS_DUPLA_PODA',
    name: 'Vinhos Finos & Dupla Poda',
    fullName: 'Vitivinicultura de Vinhos Finos & Dupla Poda de Inverno (Mantiqueira / Cerrado)',
    description: 'Inversão do ciclo vegetativo para colheita em inverno seco (amplitude > 15°C), maturação fenólica (>23.5°Bx) e vinhos de guarda.',
    category: 'CAMPO',
    icon: Wine,
    badge: 'Vinhos de Inverno D.O.',
    keywords: ['vinho', 'vitivinicultura', 'uva', 'dupla poda', 'inverno', 'mantiqueira', 'syrah', 'cabernet franc', 'barrica', 'brix'],
  },
  {
    id: 'CAPRINOCULTURA_QUEIJOS_MATURADOS',
    name: 'Caprinocultura & Queijos Finos',
    fullName: 'Caprinocultura Leiteira & Queijos Artesanais Maturados (Saanen & Afinamento)',
    description: 'Rebanho Saanen/Anglo em lactação, rendimento queijeiro (8.5 L/kg), cura em câmara fria (12°C/85% UR) e fungos nobres.',
    category: 'PECUARIA',
    icon: Milk,
    badge: 'Chèvre & Mofos Brancos',
    keywords: ['cabra', 'caprino', 'leite caprino', 'queijo', 'chevre', 'crottin', 'saanen', 'afinamento', 'candidum', 'queijaria'],
  },
  {
    id: 'MICORRIZAS_BIOINSUMOS',
    name: 'Micorrizas FMA & Fósforo',
    fullName: 'Bioinsumos & Fungos Micorrízicos Arbusculares: Ciclagem de P & Glomalina',
    description: 'Associação simbiótica com ampliação de raízes em 100x, solubilização de fósforo no solo e redução de 30% em adubação fosfatada.',
    category: 'CAMPO',
    icon: Microscope,
    badge: 'FMA & -30% Adubo P',
    keywords: ['micorrizas', 'fma', 'glomalina', 'fosforo', 'bioinsumo', 'simbiose', 'raiz', 'inoculante', 'cerrado', 'adubo'],
  },
  {
    id: 'BARTER_MULTI_COMMODITY_CPR',
    name: 'Barter & CPR Eletrônica B3',
    fullName: 'Barter Multi-Commodity & Cédula de Produto Rural (CPR Eletrônica B3 / Cerc)',
    description: 'Trava antecipada de insumos por sacas de soja, milho ou algodão, hedge cambial embutido e emissão de CPR com penhor cedular.',
    category: 'MERCADO',
    icon: Handshake,
    badge: 'CPR B3 & Relação de Troca',
    keywords: ['barter', 'cpr', 'cedula produto rural', 'b3', 'cerc', 'hedge', 'relacao de troca', 'insumos', 'soja', 'milho', 'algodao'],
  },
  {
    id: 'FERTIRRIGACAO_INJECAO_MULTICANAL',
    name: 'Fertirrigação Multicanal CE/pH',
    fullName: 'Fertirrigação Proporcional & Injeção Multicanal (Venturi, CE & pH Automático)',
    description: 'Dosagem segregada dos Tanques A (Cálcio/Ferro), B (Sulfatos/Fosfatos) e Ácido com controle toroidal de CE (1.8-2.5 mS/cm) e pH.',
    category: 'CAMPO',
    icon: Droplets,
    badge: 'CE & pH Automático',
    keywords: ['fertirrigacao', 'dosatron', 'venturi', 'injecao multicanal', 'ce', 'ph', 'tanque a', 'tanque b', 'adubo liquido', 'hidroponia'],
  },
  {
    id: 'BOVINOCULTURA_SISBOV_RFID',
    name: 'SISBOV & Rastreabilidade RFID',
    fullName: 'Bovinocultura de Corte: Rastreabilidade Individual SISBOV & Cota Hilton UE',
    description: 'Identificação eletrônica individual por brinco RFID UHF ISO 11784/11785, permanência em ERB (≥ 90 dias) e habilitação Hilton.',
    category: 'PECUARIA',
    icon: Radio,
    badge: 'SISBOV & Cota Hilton',
    keywords: ['sisbov', 'rfid', 'brinco eletronico', 'cota hilton', 'uniao europeia', 'erb', 'rastreabilidade', 'nelore', 'angus', 'gmd'],
  },
  {
    id: 'MOENDA_DIFUSOR_CANA_EXTRACAO',
    name: 'Moenda & Difusor de Cana',
    fullName: 'Moenda, Difusores & Extração de Caldo de Cana: Eficiência RTC & Cogeração',
    description: 'Extração de sacarose em difusores contínuos (> 97.5%), taxa de embebição composta, controle de Pol do bagaço e vapor de 67 bar.',
    category: 'CAMPO',
    icon: Factory,
    badge: 'Extração > 97.5% & 67 bar',
    keywords: ['moenda', 'difusor', 'cana', 'extracao', 'sacarose', 'pol bagaco', 'embebição', 'atr', 'cogeracao', 'vapor'],
  },
  {
    id: 'ARMAZENAGEM_TERMOMETRIA_ORVALHO',
    name: 'Termometria Silos & Orvalho',
    fullName: 'Armazenagem de Grãos, Termometria Wireless & Aeração com Ponto de Orvalho',
    description: 'Pêndulos térmicos digitais, psicrometria do ar e acionamento inteligente de ventiladores contra condensação de teto e queima.',
    category: 'CAMPO',
    icon: Warehouse,
    badge: 'Ponto de Orvalho & Termometria',
    keywords: ['armazenagem', 'silo', 'termometria', 'ponto de orvalho', 'aeracao', 'psicrometria', 'soja', 'milho', 'caruncho', 'mofo'],
  },
  {
    id: 'RENOVABIO_CALCULADORA_CBIO',
    name: 'RenovaBio & Calculadora CBIO',
    fullName: 'Créditos de Descarbonização CBIO & RenovaBio: Calculadora RenovaCalc Integrada',
    description: 'Avaliação de ciclo de vida (ACV), nota de eficiência energética-ambiental (NEEA), elegibilidade CAR e escrituração na B3.',
    category: 'MERCADO',
    icon: Recycle,
    badge: 'RenovaCalc & B3 CBIO',
    keywords: ['renovabio', 'cbio', 'renovacalc', 'descarbonizacao', 'etanol', 'biodiesel', 'biometano', 'anp', 'b3', 'car elegivel'],
  },
];

interface QuickAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (moduleId: string) => void;
  activeModuleId: string;
  favoritos: string[];
  onToggleFavorito: (moduleId: string) => void;
  enabledModuleIds?: Set<string>;
  onOpenModuleConfig?: () => void;
  activeProfileName?: string;
}

export const QuickAccessModal: React.FC<QuickAccessModalProps> = ({
  isOpen,
  onClose,
  onSelectModule,
  activeModuleId,
  favoritos,
  onToggleFavorito,
  enabledModuleIds,
  onOpenModuleConfig,
  activeProfileName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [filterOnlySubscribed, setFilterOnlySubscribed] = useState<boolean>(true);

  // Fecha no ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filtra por habilitação contratada se ativado
  const baseModules = useMemo(() => {
    if (!enabledModuleIds || !filterOnlySubscribed) return ALL_MODULES;
    return ALL_MODULES.filter((m: ModuleItem) => enabledModuleIds.has(m.id));
  }, [enabledModuleIds, filterOnlySubscribed]);

  const filteredModules = baseModules.filter((mod: ModuleItem) => {
    const matchesSearch =
      mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.keywords.some((k: string) => k.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'TODOS' ||
      (selectedCategory === 'FAVORITOS' && favoritos.includes(mod.id)) ||
      mod.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Barra de Pesquisa Rápida (Command Palette) */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            placeholder="Digite o que deseja acessar (ex: clima, trator, romaneio, lcdpr, adubo, cpr)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 placeholder-[#66736A] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Faixa de Atividade Contratada & Filtro Modular */}
        {enabledModuleIds && (
          <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Atividade Contratada:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[11px]">
                {activeProfileName || 'Perfil Ativo'} ({enabledModuleIds.size}/{ALL_MODULES.length})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterOnlySubscribed}
                  onChange={(e) => setFilterOnlySubscribed(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Ocultar módulos não contratados</span>
              </label>

              {onOpenModuleConfig && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenModuleConfig();
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] underline cursor-pointer"
                >
                  Personalizar Módulos
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filtros de Categoria */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedCategory('TODOS')}
            className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'TODOS'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Exibindo ({baseModules.length})
          </button>
          <button
            onClick={() => setSelectedCategory('FAVORITOS')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              selectedCategory === 'FAVORITOS'
                ? 'bg-amber-500 text-slate-950'
                : 'text-amber-400 hover:bg-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" /> Favoritos ({favoritos.length})
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => setSelectedCategory('CAMPO')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'CAMPO' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌾 Campo ({baseModules.filter((m: ModuleItem) => m.category === 'CAMPO').length})
          </button>
          <button
            onClick={() => setSelectedCategory('FROTA')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'FROTA' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            🚜 Frotas ({baseModules.filter((m: ModuleItem) => m.category === 'FROTA').length})
          </button>
          <button
            onClick={() => setSelectedCategory('MERCADO')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'MERCADO' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            📈 Mercado ({baseModules.filter((m: ModuleItem) => m.category === 'MERCADO').length})
          </button>
          <button
            onClick={() => setSelectedCategory('FISCAL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'FISCAL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚖️ Fiscal ({baseModules.filter((m: ModuleItem) => m.category === 'FISCAL').length})
          </button>
          <button
            onClick={() => setSelectedCategory('PECUARIA')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'PECUARIA' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            🐂 Pecuária ({baseModules.filter((m: ModuleItem) => m.category === 'PECUARIA').length})
          </button>
        </div>

        {/* Lista de Módulos Grid */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredModules.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Nenhum módulo encontrado para "{searchTerm}". Tente pesquisar por outros termos.
            </div>
          ) : (
            filteredModules.map((mod: ModuleItem) => {
              const Icon = mod.icon;
              const isFav = favoritos.includes(mod.id);
              const isActive = activeModuleId === mod.id;

              return (
                <div
                  key={mod.id}
                  onClick={() => {
                    onSelectModule(mod.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-800 text-emerald-400 border border-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-emerald-800 truncate">{mod.fullName}</h4>
                        {mod.badge && (
                          <span className="px-1.5 py-0.2 bg-slate-800 text-emerald-400 text-[10px] font-mono rounded border border-slate-700 shrink-0">
                            {mod.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Botão de Estrela de Favorito */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorito(mod.id);
                      }}
                      className={`p-2 rounded-lg transition-all ${
                        isFav
                          ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                          : 'text-slate-600 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                      title={isFav ? 'Remover dos favoritos' : 'Fixar nos favoritos'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé com Atalhos de Teclado */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-600">
          <span>Dica: Use a estrela (⭐) para fixar os módulos que você mais utiliza no topo da tela.</span>
          <span className="font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-emerald-800">ESC para fechar</span>
        </div>
      </div>
    </div>
  );
};
