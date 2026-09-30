export interface TalhaoData {
  id: string;
  codigo: string;
  nome: string;
  areaHa: number;
  cultura: string;
  variedade: string;
  dataPlantio: string;
  status: 'PREPARO' | 'PLANTADO' | 'PULVERIZADO' | 'COLHEITA';
  coordenadas: [number, number][]; // Polígono [lat, lng]
  custoTotalABC: number;
  breakEvenScHa: number;
  ndviMedio: number;
  pragasDetectadas: number;
}

export interface InsumoEstoqueData {
  id: string;
  nomeComercial: string;
  principioAtivo: string;
  categoria: 'DEFENSIVO' | 'FERTILIZANTE' | 'ADJUVANTE' | 'SEMENTE' | 'COMBUSTIVEL';
  unidade: string;
  saldoAtual: number;
  custoMedioUnitario: number;
  estoqueMinimo: number;
}

export interface MaquinaData {
  id: string;
  nome: string;
  tipo: 'TRATOR' | 'COLHEITADEIRA' | 'PULVERIZADOR' | 'CAMINHAO';
  horimetroAtual: number;
  custoHoraEstimado: number;
  // Campos de Telemetria em Tempo Real (CAN Bus / TimescaleDB)
  statusTelemetria: 'OPERANDO' | 'MANOBRA' | 'OCIOSO_LIGADO' | 'DESLIGADO';
  velocidadeKmh: number;
  rpmMotor: number;
  consumoInstantaneoLh: number;
  pressaoOleoBar: number;
  temperaturaMotorC: number;
  eficienciaTrabalhoPct: number;
  coordenadasAtual: [number, number];
  talhaoAlocadoId: string;
  operadorNome: string;
}

export interface CondominoData {
  id: string;
  nome: string;
  cpf: string;
  percentual: number;
  titular: boolean;
}

export interface LancamentoFiscalData {
  id: string;
  data: string;
  documento: string;
  historico: string;
  tipoLancamento: 'RECEITA' | 'DESPESA_CUSTEIO' | 'INVESTIMENTO';
  valorTotal: number;
  categoria: string;
}

export interface AnimalPecuariaData {
  id: string;
  brincoVisual: string;
  rfid: string;
  raca: string;
  categoria: string;
  pesoAtualKg: number;
  gmdDiarioKg: number;
  lotePasto: string;
  statusSanitario: 'LIBERADO' | 'EM_CARENCIA';
  carenciaAteData?: string;
  medicamentoAplicado?: string;
}

export interface ReceituarioAgronomicoData {
  id: string;
  numeroReceita: string;
  numeroArt: string;
  agronomoResponsavel: string;
  creaNumero: string;
  dataEmissao: string;
  validadeDias: number;
  talhaoAlvoId: string;
  produtoComercial: string;
  principioAtivo: string;
  doseRecomendada: string;
  alvoBiologico: string;
  intervaloSegurancaDias: number;
  periodoReentradaHoras: number;
  instrucoesInpev: string;
  status: 'EMITIDO' | 'APLICADO' | 'EXPIRADO';
}

export interface ContratoGraosBarterData {
  id: string;
  numeroContrato: string;
  tipoOperacao: 'BARTER_INSUMOS' | 'VENDA_FUTURA_FIXA' | 'A_FIXAR_CBOT';
  compradorTrader: string;
  cultura: string;
  quantidadeSacas60kg: number;
  precoUnitarioSaca: number;
  valorTotalContrato: number;
  dataEntregaLimite: string;
  localEntregaArmazem: string;
  statusEntrega: 'EM_ABERTO' | 'ENTREGA_PARCIAL' | 'LIQUIDADO';
  sacasEntregues: number;
  cprVinculadaNumero: string;
  pacoteInsumos?: string;
  talhaoPenhor?: string;
  areaVinculadaHa?: number;
  protocoloB3?: string;
  hashAutenticidade?: string;
  matriculaCRI?: string;
  historicoEntregas?: { id: string; data: string; romaneio: string; sacas: number; placa: string }[];
}

export interface RomaneioColheitaData {
  id: string;
  numeroRomaneio: string;
  dataHora: string;
  talhaoOrigemId: string;
  placaCaminhao: string;
  motoristaNome: string;
  pesoBrutoKg: number;
  taraCaminhaoKg: number;
  pesoLiquidoKg: number;
  umidadePercentual: number;
  descontoUmidadeKg: number;
  impurezaPercentual: number;
  descontoImpurezaKg: number;
  pesoLiquidoFinalKg: number;
  sacas60kgFinal: number;
  armazemDestino: string;
  status: 'EM_TRANSITO' | 'DESCARREGADO_ARMAZEM';
}

export interface PrescricaoTaxaVariavelData {
  id: string;
  talhaoId: string;
  nutrienteAlvo: 'FOSFORO_P' | 'POTASSIO_K' | 'CALCARIO_V' | 'GESSO';
  nomePrescricao: string;
  gradeAmostragem: string; // Ex: 'Grid de 2.5 ha'
  doseMinimaKgHa: number;
  doseMediaKgHa: number;
  doseMaximaKgHa: number;
  aduboRecomendado: string;
  economiaFinanceiraEstimada: number;
  statusExportacaoPiloto: 'GERADO_ISOXML' | 'PENDENTE' | 'APLICADO';
}

export interface OrdemServicoOficinaData {
  id: string;
  numeroOs: string;
  maquinaId: string;
  tipoManutencao: 'PREVENTIVA_HORIMETRO' | 'CORRETIVA_URGENTE' | 'REVISAO_SAFRA';
  horimetroProgramado: number;
  horimetroAtual: number;
  horasRestantes: number;
  servicosDescricao: string;
  pecasSubstituidas: string[];
  custoTotalPecasMaoObra: number;
  mecanicoResponsavel: string;
  status: 'AGENDADA' | 'EM_ANDAMENTO' | 'CONCLUIDA';
}

// Coordenadas reais de talhões na região de Sorriso/Sinop - MT (Centro Agrícola do Brasil)
export const TALHOES_INICIAIS: TalhaoData[] = [
  {
    id: 'talhao-01',
    codigo: 'TAL-01',
    nome: 'Talhão Sede Norte',
    areaHa: 420.5,
    cultura: 'Soja Monsoy 5947 IPRO',
    variedade: 'M5947',
    dataPlantio: '2025-10-15',
    status: 'PULVERIZADO',
    coordenadas: [
      [-12.542, -55.728],
      [-12.542, -55.715],
      [-12.555, -55.715],
      [-12.555, -55.728],
    ],
    custoTotalABC: 648500.0,
    breakEvenScHa: 32.8,
    ndviMedio: 0.82,
    pragasDetectadas: 1,
  },
  {
    id: 'talhao-02',
    codigo: 'TAL-02',
    nome: 'Talhão Represa Leste',
    areaHa: 380.0,
    cultura: 'Soja Brasmax Desafio',
    variedade: 'BMX Desafio',
    dataPlantio: '2025-10-18',
    status: 'PULVERIZADO',
    coordenadas: [
      [-12.542, -55.714],
      [-12.542, -55.701],
      [-12.555, -55.701],
      [-12.555, -55.714],
    ],
    custoTotalABC: 592800.0,
    breakEvenScHa: 33.5,
    ndviMedio: 0.76,
    pragasDetectadas: 4,
  },
  {
    id: 'talhao-03',
    codigo: 'TAL-03',
    nome: 'Talhão Pivô Central 01',
    areaHa: 510.0,
    cultura: 'Soja TMG 2381',
    variedade: 'TMG 2381',
    dataPlantio: '2025-10-12',
    status: 'PLANTADO',
    coordenadas: [
      [-12.556, -55.728],
      [-12.556, -55.715],
      [-12.569, -55.715],
      [-12.569, -55.728],
    ],
    custoTotalABC: 785400.0,
    breakEvenScHa: 31.9,
    ndviMedio: 0.84,
    pragasDetectadas: 0,
  },
  {
    id: 'talhao-04',
    codigo: 'TAL-04',
    nome: 'Talhão Platô Sul',
    areaHa: 450.0,
    cultura: 'Soja Monsoy 5947 IPRO',
    variedade: 'M5947',
    dataPlantio: '2025-10-22',
    status: 'PLANTADO',
    coordenadas: [
      [-12.556, -55.714],
      [-12.556, -55.701],
      [-12.569, -55.701],
      [-12.569, -55.714],
    ],
    custoTotalABC: 684000.0,
    breakEvenScHa: 34.1,
    ndviMedio: 0.68,
    pragasDetectadas: 3,
  },
  {
    id: 'talhao-05',
    codigo: 'TAL-05',
    nome: 'Talhão Córrego Fundo',
    areaHa: 360.0,
    cultura: 'Milho KWS 9010 VIP3',
    variedade: 'KWS 9010',
    dataPlantio: '2025-11-05',
    status: 'PREPARO',
    coordenadas: [
      [-12.570, -55.728],
      [-12.570, -55.715],
      [-12.583, -55.715],
      [-12.583, -55.728],
    ],
    custoTotalABC: 396000.0,
    breakEvenScHa: 48.5,
    ndviMedio: 0.35,
    pragasDetectadas: 0,
  },
  {
    id: 'talhao-06',
    codigo: 'TAL-06',
    nome: 'Talhão Divisa Oeste',
    areaHa: 329.5,
    cultura: 'Soja Brasmax Fibra',
    variedade: 'BMX Fibra',
    dataPlantio: '2025-10-25',
    status: 'COLHEITA',
    coordenadas: [
      [-12.570, -55.714],
      [-12.570, -55.701],
      [-12.583, -55.701],
      [-12.583, -55.714],
    ],
    custoTotalABC: 527200.0,
    breakEvenScHa: 35.0,
    ndviMedio: 0.52,
    pragasDetectadas: 1,
  },
];

export const INSUMOS_INICIAIS: InsumoEstoqueData[] = [
  {
    id: 'ins-01',
    nomeComercial: 'Engeo Pleno S (Inseticida)',
    principioAtivo: 'Tiametoxam + Lambda-cialotrina',
    categoria: 'DEFENSIVO',
    unidade: 'L',
    saldoAtual: 850.0,
    custoMedioUnitario: 145.5,
    estoqueMinimo: 200.0,
  },
  {
    id: 'ins-02',
    nomeComercial: 'Fox Xpro (Fungicida)',
    principioAtivo: 'Trifloxistrobina + Protioconazol + Bixafen',
    categoria: 'DEFENSIVO',
    unidade: 'L',
    saldoAtual: 620.0,
    custoMedioUnitario: 310.0,
    estoqueMinimo: 150.0,
  },
  {
    id: 'ins-03',
    nomeComercial: 'Aureo (Óleo Mineral Adjuvante)',
    principioAtivo: 'Éster metílico de óleo de soja',
    categoria: 'ADJUVANTE',
    unidade: 'L',
    saldoAtual: 1400.0,
    custoMedioUnitario: 32.0,
    estoqueMinimo: 300.0,
  },
  {
    id: 'ins-04',
    nomeComercial: 'Fertilizante Foliar Zinco & Manganês',
    principioAtivo: 'Complexo Nutricional Zn-Mn Quelatado',
    categoria: 'FERTILIZANTE',
    unidade: 'L',
    saldoAtual: 950.0,
    custoMedioUnitario: 68.0,
    estoqueMinimo: 250.0,
  },
  {
    id: 'ins-05',
    nomeComercial: 'Óleo Diesel S10 Rodoviário/Agrícola',
    principioAtivo: 'Combustível S10',
    categoria: 'COMBUSTIVEL',
    unidade: 'L',
    saldoAtual: 24500.0,
    custoMedioUnitario: 5.92,
    estoqueMinimo: 5000.0,
  },
  {
    id: 'ins-06',
    nomeComercial: 'Semente Soja Monsoy 5947 IPRO',
    principioAtivo: 'Semente Certificada Vigor 92%',
    categoria: 'SEMENTE',
    unidade: 'SC',
    saldoAtual: 120.0,
    custoMedioUnitario: 380.0,
    estoqueMinimo: 50.0,
  },
];

export const MAQUINAS_INICIAIS: MaquinaData[] = [
  {
    id: 'maq-01',
    nome: 'Pulverizador Autopropelido JD 4030',
    tipo: 'PULVERIZADOR',
    horimetroAtual: 1845.2,
    custoHoraEstimado: 220.0,
    statusTelemetria: 'OPERANDO',
    velocidadeKmh: 18.4,
    rpmMotor: 1980,
    consumoInstantaneoLh: 24.2,
    pressaoOleoBar: 4.8,
    temperaturaMotorC: 86,
    eficienciaTrabalhoPct: 88.5,
    coordenadasAtual: [-12.548, -55.708],
    talhaoAlocadoId: 'talhao-02',
    operadorNome: 'João Silva (Op-44)',
  },
  {
    id: 'maq-02',
    nome: 'Trator John Deere 8R 370 + Plantadeira 32L',
    tipo: 'TRATOR',
    horimetroAtual: 3410.8,
    custoHoraEstimado: 295.0,
    statusTelemetria: 'OPERANDO',
    velocidadeKmh: 7.6,
    rpmMotor: 1850,
    consumoInstantaneoLh: 32.8,
    pressaoOleoBar: 5.1,
    temperaturaMotorC: 89,
    eficienciaTrabalhoPct: 92.0,
    coordenadasAtual: [-12.562, -55.720],
    talhaoAlocadoId: 'talhao-03',
    operadorNome: 'Marcos Oliveira (Op-12)',
  },
  {
    id: 'maq-03',
    nome: 'Colheitadeira Case IH Axial-Flow 8250',
    tipo: 'COLHEITADEIRA',
    horimetroAtual: 1120.5,
    custoHoraEstimado: 480.0,
    statusTelemetria: 'MANOBRA',
    velocidadeKmh: 4.2,
    rpmMotor: 2100,
    consumoInstantaneoLh: 46.5,
    pressaoOleoBar: 4.9,
    temperaturaMotorC: 91,
    eficienciaTrabalhoPct: 76.2,
    coordenadasAtual: [-12.576, -55.706],
    talhaoAlocadoId: 'talhao-06',
    operadorNome: 'Tiago Santos (Op-08)',
  },
  {
    id: 'maq-04',
    nome: 'Caminhão Melosa / Comboio Diesel Mercedes 2729',
    tipo: 'CAMINHAO',
    horimetroAtual: 2180.0,
    custoHoraEstimado: 140.0,
    statusTelemetria: 'OCIOSO_LIGADO',
    velocidadeKmh: 0.0,
    rpmMotor: 900,
    consumoInstantaneoLh: 4.2,
    pressaoOleoBar: 3.5,
    temperaturaMotorC: 78,
    eficienciaTrabalhoPct: 54.0,
    coordenadasAtual: [-12.553, -55.718],
    talhaoAlocadoId: 'talhao-01',
    operadorNome: 'Cláudio Ferreira (Op-31)',
  },
];

export const RECEITUARIOS_INICIAIS: ReceituarioAgronomicoData[] = [
  {
    id: 'rec-01',
    numeroReceita: 'REC-2025-00481',
    numeroArt: 'ART-CREA-MT-2025-910248',
    agronomoResponsavel: 'Dra. Camila Nogueira de Barros',
    creaNumero: 'CREA-MT 18492-D',
    dataEmissao: '2025-10-10',
    validadeDias: 30,
    talhaoAlvoId: 'talhao-02',
    produtoComercial: 'Engeo Pleno S (Syngenta)',
    principioAtivo: 'Tiametoxam + Lambda-cialotrina',
    doseRecomendada: '0.20 L / ha (Calda: 100 L/ha)',
    alvoBiologico: 'Percevejo Marrom (Euschistus heros)',
    intervaloSegurancaDias: 21,
    periodoReentradaHoras: 24,
    instrucoesInpev: 'Tríplice lavagem obrigatória no abastecimento do pulverizador. Devolução de embalagens no Posto de Coleta inpEV Sorriso dentro de 365 dias.',
    status: 'APLICADO',
  },
  {
    id: 'rec-02',
    numeroReceita: 'REC-2025-00482',
    numeroArt: 'ART-CREA-MT-2025-910249',
    agronomoResponsavel: 'Dra. Camila Nogueira de Barros',
    creaNumero: 'CREA-MT 18492-D',
    dataEmissao: '2025-10-18',
    validadeDias: 30,
    talhaoAlvoId: 'talhao-04',
    produtoComercial: 'Fox Xpro (Bayer)',
    principioAtivo: 'Trifloxistrobina + Protioconazol + Bixafen',
    doseRecomendada: '0.50 L / ha + 0.25 L/ha Aureo',
    alvoBiologico: 'Ferrugem Asiática (Phakopsora pachyrhizi)',
    intervaloSegurancaDias: 20,
    periodoReentradaHoras: 24,
    instrucoesInpev: 'Perfurar o fundo das embalagens plásticas após tríplice lavagem e armazenar em local coberto e ventilado até entrega.',
    status: 'EMITIDO',
  },
];

export const CONTRATOS_BARTER_INICIAIS: ContratoGraosBarterData[] = [
  {
    id: 'ct-01',
    numeroContrato: 'CTR-CARGILL-2025-081',
    tipoOperacao: 'BARTER_INSUMOS',
    compradorTrader: 'Cargill Agrícola S.A. (Sorriso/MT)',
    cultura: 'Soja em Grãos Padrão Exportação',
    quantidadeSacas60kg: 45000,
    precoUnitarioSaca: 134.5,
    valorTotalContrato: 6052500.0,
    dataEntregaLimite: '2026-03-30',
    localEntregaArmazem: 'Terminal Ferroviário Rumo / Cargill Sinop',
    statusEntrega: 'ENTREGA_PARCIAL',
    sacasEntregues: 18200,
    cprVinculadaNumero: 'CPR-F-B3-MT-2025-9182',
    pacoteInsumos: 'Adubação NPK YaraBela (600 ton) + Pacote Herbicidas Syngenta',
    talhaoPenhor: 'Talhão 01 - Sede (Gleba Norte)',
    areaVinculadaHa: 650,
    protocoloB3: 'B3-REG-94812-MT',
    matriculaCRI: 'Matrícula 41.829 - CRI 1º Ofício de Sorriso/MT',
    hashAutenticidade: '8f43a9d20c151e89f41b2c451a92e104f32a76db90412803b90124fe8192a831',
    historicoEntregas: [
      { id: 'ent-1', data: '22/03/2026', romaneio: 'ROM-2026-10492', sacas: 9100, placa: 'RAX-4J19 (Bitrem)' },
      { id: 'ent-2', data: '25/03/2026', romaneio: 'ROM-2026-10518', sacas: 9100, placa: 'NDK-8E22 (Rodotrem)' },
    ]
  },
  {
    id: 'ct-02',
    numeroContrato: 'CTR-BUNGE-2025-114',
    tipoOperacao: 'VENDA_FUTURA_FIXA',
    compradorTrader: 'Bunge Alimentos S.A.',
    cultura: 'Soja em Grãos Padrão Exportação',
    quantidadeSacas60kg: 30000,
    precoUnitarioSaca: 136.0,
    valorTotalContrato: 4080000.0,
    dataEntregaLimite: '2026-04-15',
    localEntregaArmazem: 'Armazém Geral Bunge Sorriso',
    statusEntrega: 'EM_ABERTO',
    sacasEntregues: 0,
    cprVinculadaNumero: 'CPR-FIN-B3-MT-2025-0019',
    pacoteInsumos: 'Trava Financeira PTAX/CBOT com Antecipação de Custeio',
    talhaoPenhor: 'Talhão 02 - Pivô Central 01',
    areaVinculadaHa: 450,
    protocoloB3: 'B3-REG-77124-MT',
    matriculaCRI: 'Matrícula 41.830 - CRI 1º Ofício de Sorriso/MT',
    hashAutenticidade: '3e12f0a99182bc81726a1004923fca81902847120349b1a098492019481920ac',
    historicoEntregas: []
  },
  {
    id: 'ct-03',
    numeroContrato: 'CTR-AMAGGI-2025-045',
    tipoOperacao: 'BARTER_INSUMOS',
    compradorTrader: 'Amaggi Exportação & Importação',
    cultura: 'Milho Grão Safrinha',
    quantidadeSacas60kg: 25000,
    precoUnitarioSaca: 62.0,
    valorTotalContrato: 1550000.0,
    dataEntregaLimite: '2026-07-30',
    localEntregaArmazem: 'Terminal Fluvial Amaggi Miritituba/PA',
    statusEntrega: 'EM_ABERTO',
    sacasEntregues: 0,
    cprVinculadaNumero: 'CPR-F-B3-MT-2025-9190',
    pacoteInsumos: 'Sementes de Milho Híbrido VT PRO4 + Uréia Protegida',
    talhaoPenhor: 'Talhão 03 - Baixada',
    areaVinculadaHa: 380,
    protocoloB3: 'B3-REG-51928-MT',
    matriculaCRI: 'Matrícula 41.831 - CRI 1º Ofício de Sorriso/MT',
    hashAutenticidade: '7a9821ef340912cb8491823a049182ac71829304918230918203918209381029',
    historicoEntregas: []
  },
];

export const ROMANEIOS_COLHEITA_INICIAIS: RomaneioColheitaData[] = [
  {
    id: 'rom-01',
    numeroRomaneio: 'ROM-2026-00192',
    dataHora: '25/09/2026 10:15',
    talhaoOrigemId: 'talhao-06',
    placaCaminhao: 'RXT-4A82 (Bitrem Graneleiro)',
    motoristaNome: 'Carlos Menezes',
    pesoBrutoKg: 57400,
    taraCaminhaoKg: 19800,
    pesoLiquidoKg: 37600,
    umidadePercentual: 14.8,
    descontoUmidadeKg: 350,
    impurezaPercentual: 1.2,
    descontoImpurezaKg: 85,
    pesoLiquidoFinalKg: 37165,
    sacas60kgFinal: 619.4,
    armazemDestino: 'Terminal Rumo / Cargill Sinop',
    status: 'EM_TRANSITO',
  },
  {
    id: 'rom-02',
    numeroRomaneio: 'ROM-2026-00191',
    dataHora: '25/09/2026 08:30',
    talhaoOrigemId: 'talhao-06',
    placaCaminhao: 'QWS-8190 (Vanderleia)',
    motoristaNome: 'Valdir Silveira',
    pesoBrutoKg: 52100,
    taraCaminhaoKg: 17200,
    pesoLiquidoKg: 34900,
    umidadePercentual: 13.9,
    descontoUmidadeKg: 0,
    impurezaPercentual: 0.9,
    descontoImpurezaKg: 0,
    pesoLiquidoFinalKg: 34900,
    sacas60kgFinal: 581.6,
    armazemDestino: 'Terminal Rumo / Cargill Sinop',
    status: 'DESCARREGADO_ARMAZEM',
  },
];

export const PRESCRICOES_TAXA_VARIAVEL: PrescricaoTaxaVariavelData[] = [
  {
    id: 'vra-01',
    talhaoId: 'talhao-04',
    nutrienteAlvo: 'FOSFORO_P',
    nomePrescricao: 'Adubação Fosfatada (P2O5) - Talhão Platô Sul',
    gradeAmostragem: 'Grid Georreferenciado 2.5 ha (180 pontos)',
    doseMinimaKgHa: 180.0,
    doseMediaKgHa: 287.0,
    doseMaximaKgHa: 420.0,
    aduboRecomendado: 'Superfosfato Simples Granulado (00-18-00)',
    economiaFinanceiraEstimada: 85050.0,
    statusExportacaoPiloto: 'GERADO_ISOXML',
  },
  {
    id: 'vra-02',
    talhaoId: 'talhao-01',
    nutrienteAlvo: 'CALCARIO_V',
    nomePrescricao: 'Calagem por Saturação de Bases (V=70%) - Sede Norte',
    gradeAmostragem: 'Grid Georreferenciado 1.0 ha (420 pontos)',
    doseMinimaKgHa: 800.0,
    doseMediaKgHa: 1850.0,
    doseMaximaKgHa: 3200.0,
    aduboRecomendado: 'Calcário Dolomítico PRNT 85%',
    economiaFinanceiraEstimada: 42300.0,
    statusExportacaoPiloto: 'GERADO_ISOXML',
  },
];

export const ORDENS_SERVICO_OFICINA: OrdemServicoOficinaData[] = [
  {
    id: 'os-01',
    numeroOs: 'OS-MEC-2026-088',
    maquinaId: 'maq-02',
    tipoManutencao: 'PREVENTIVA_HORIMETRO',
    horimetroProgramado: 3500.0,
    horimetroAtual: 3410.8,
    horasRestantes: 89.2,
    servicosDescricao: 'Revisão de 3.500 horas: Troca de óleo de motor 15W40, filtro primário e secundário de diesel, filtro de ar e engraxamento geral da plantadeira.',
    pecasSubstituidas: ['Óleo John Deere Plus-50 II (28L)', 'Filtro Combustível Donaldson', 'Filtro de Ar Primário'],
    custoTotalPecasMaoObra: 3840.0,
    mecanicoResponsavel: 'Mec. Valmor Bertoncelli',
    status: 'AGENDADA',
  },
  {
    id: 'os-02',
    numeroOs: 'OS-MEC-2026-085',
    maquinaId: 'maq-01',
    tipoManutencao: 'PREVENTIVA_HORIMETRO',
    horimetroProgramado: 1850.0,
    horimetroAtual: 1845.2,
    horasRestantes: 4.8,
    servicosDescricao: 'Revisão de pulverizador: Troca de filtros de linha da barra de pulverização, verificação dos bicos cerâmicos anti-deriva e calibração de vazão do fluxômetro.',
    pecasSubstituidas: ['Conjunto de Pontas de Pulverização TeeJet AIXR', 'Filtros de Sucção de Calda'],
    custoTotalPecasMaoObra: 1950.0,
    mecanicoResponsavel: 'Mec. Rodrigo Furlan',
    status: 'EM_ANDAMENTO',
  },
];

export const CONDOMINOS_FAZENDA: CondominoData[] = [
  {
    id: 'cond-01',
    nome: 'Carlos Eduardo Silva',
    cpf: '284.910.828-44',
    percentual: 40.0,
    titular: true,
  },
  {
    id: 'cond-02',
    nome: 'Mariana Duarte Silva',
    cpf: '419.823.108-72',
    percentual: 30.0,
    titular: false,
  },
  {
    id: 'cond-03',
    nome: 'Roberto Duarte Silva',
    cpf: '512.744.938-19',
    percentual: 30.0,
    titular: false,
  },
];

export const LANCAMENTOS_FISCAIS_SAFRA: LancamentoFiscalData[] = [
  {
    id: 'lanc-01',
    data: '2025-09-10',
    documento: 'NF-e 184920',
    historico: 'Compra de Fungicida Fox Xpro - AgroGalaxy Sinop',
    tipoLancamento: 'DESPESA_CUSTEIO',
    valorTotal: 192200.0,
    categoria: 'Defensivos Agrícolas',
  },
  {
    id: 'lanc-02',
    data: '2025-09-25',
    documento: 'NF-e 847291',
    historico: 'Compra de Óleo Diesel S10 (30.000 Litros) - Posto Rota do Sol',
    tipoLancamento: 'DESPESA_CUSTEIO',
    valorTotal: 177600.0,
    categoria: 'Combustíveis e Lubrificantes',
  },
  {
    id: 'lanc-03',
    data: '2025-10-02',
    documento: 'NF-e 910243',
    historico: 'Sementes Soja Monsoy 5947 Tratadas - Boa Safra Sementes',
    tipoLancamento: 'DESPESA_CUSTEIO',
    valorTotal: 342000.0,
    categoria: 'Sementes e Mudas',
  },
  {
    id: 'lanc-04',
    data: '2025-11-14',
    documento: 'CT-e 449102',
    historico: 'Frete e Transporte de Calcário Dolomítico para Correção de Solo',
    tipoLancamento: 'DESPESA_CUSTEIO',
    valorTotal: 68400.0,
    categoria: 'Fretes e Serviços de Terceiros',
  },
  {
    id: 'lanc-05',
    data: '2026-01-20',
    documento: 'NFP-e 004128',
    historico: 'Adiantamento Venda Futura Soja Safra 25/26 (Cargill Agrícola)',
    tipoLancamento: 'RECEITA',
    valorTotal: 1850000.0,
    categoria: 'Venda de Produção Agrícola',
  },
];

export const ANIMAIS_PECUARIA: AnimalPecuariaData[] = [
  {
    id: 'ani-01',
    brincoVisual: 'SH-1042',
    rfid: '982000412891021',
    raca: 'Nelore Mocho PO',
    categoria: 'BOI_GORDO',
    pesoAtualKg: 542.5,
    gmdDiarioKg: 1.28,
    lotePasto: 'Pasto Rotacionado Mombaça 03',
    statusSanitario: 'LIBERADO',
  },
  {
    id: 'ani-02',
    brincoVisual: 'SH-1048',
    rfid: '982000412891027',
    raca: 'Angus x Nelore',
    categoria: 'BOI_GORDO',
    pesoAtualKg: 568.0,
    gmdDiarioKg: 1.45,
    lotePasto: 'Pasto Rotacionado Mombaça 03',
    statusSanitario: 'EM_CARENCIA',
    carenciaAteData: '2026-10-10',
    medicamentoAplicado: 'Dectomax Platinum (Ivermectina longa ação - Carência 28 dias)',
  },
  {
    id: 'ani-03',
    brincoVisual: 'SH-2104',
    rfid: '982000412891150',
    raca: 'Nelore Comercial',
    categoria: 'NOVILHA',
    pesoAtualKg: 412.0,
    gmdDiarioKg: 0.98,
    lotePasto: 'Pasto Piatã 02',
    statusSanitario: 'LIBERADO',
  },
  {
    id: 'ani-04',
    brincoVisual: 'SH-2115',
    rfid: '982000412891161',
    raca: 'Brangus',
    categoria: 'GARROTE',
    pesoAtualKg: 385.0,
    gmdDiarioKg: 1.12,
    lotePasto: 'Pasto Piatã 02',
    statusSanitario: 'EM_CARENCIA',
    carenciaAteData: '2026-10-04',
    medicamentoAplicado: 'Terramicina LA (Oxitetraciclina - Carência 21 dias)',
  },
];
