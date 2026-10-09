/**
 * AGROTECH ENTERPRISE - MOTOR RENOVABIO CBIO AVANÇADO (CERTIFICAGRO)
 * Política Nacional de Biocombustíveis (Lei nº 13.576/2017) e Resolução ANP nº 758/2018.
 * Cálculo da Nota de Eficiência Energético-Ambiental (NEEA) e Emissão de CBIOs na B3.
 */

const crypto = require('crypto');

// Fator fóssil de referência ANP (intensidade de carbono do combustível fóssil substituído em g CO2eq/MJ)
const FOSSIL_REFERENCIA = {
  gasolina: 87.4, // g CO2eq/MJ (substituída por etanol hidratado/anidro)
  dieselFossil: 86.5 // g CO2eq/MJ (substituído por biodiesel de soja / palma)
};

/**
 * Audita a Elegibilidade da Propriedade Rural para o RenovaBio (Critérios da ANP)
 * Critério 1: Não desmatamento pós-2018 (PRODES / CAR)
 * Critério 2: CAR 100% ativo e sem sobreposição com Unidades de Conservação ou Terras Indígenas
 */
function auditarElegibilidadeRenovabio({
  carNumero = 'MT-5107909-E8192841029',
  anoAberturaArea = 2012, // Deve ser anterior a 01/01/2018
  sobreposicaoTerrasProtegidas = false,
  regularidadeTrabalhista = true
}) {
  const marcoTemporalMarcoZero = 2018;
  const elegivelPorMarcoZero = anoAberturaArea < marcoTemporalMarcoZero;
  const elegivelIntegral = elegivelPorMarcoZero && !sobreposicaoTerrasProtegidas && regularidadeTrabalhista;

  const fatoresAuditoria = [
    {
      criterio: 'Marco Temporal Desmatamento Zero (pós-2018)',
      status: elegivelPorMarcoZero ? 'CONFORME' : 'NAO_CONFORME',
      detalhes: `Área antropizada em ${anoAberturaArea}. Cumpre o marco temporal da Lei 13.576/2017.`
    },
    {
      criterio: 'Sobreposição com Terras Indígenas / UCs (FUNAI/ICMBio)',
      status: !sobreposicaoTerrasProtegidas ? 'CONFORME' : 'BLOQUEIO_SOBREPOSICAO',
      detalhes: 'Nenhuma sobreposição detectada na malha fundiária.'
    },
    {
      criterio: 'Conformidade Trabalhista e Ambiental (CAR / SICAR)',
      status: regularidadeTrabalhista ? 'CONFORME' : 'IRREGULARIDADE_SICAR',
      detalhes: 'CAR validado na base estadual sem pendências impeditivas.'
    }
  ];

  return {
    sucesso: true,
    carNumero,
    statusElegibilidade: elegivelIntegral ? 'FAZENDA_100_PORCENTO_ELEGIVEL_RENOVABIO' : 'INELEGIVEL_BLOQUEIO_AMBIENTAL',
    fatorElegibilidadePercentual: elegivelIntegral ? 100.0 : 0.0,
    criteriosAvaliados: fatoresAuditoria,
    orgaoRegulador: 'ANP (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis)',
    dataVerificacao: new Date().toISOString()
  };
}

/**
 * Calcula a Nota de Eficiência Energético-Ambiental (NEEA) e os CBIOs gerados
 * 1 CBIO = 1 tonelada de CO2 equivalente evitada na atmosfera
 */
function calcularEmissaoCbios({
  culturaBiomassa = 'SOJA_PARA_BIODIESEL', // ou CANA_DE_ACUCAR_ETANOL, MILHO_ETANOL
  volumeProducaoTon = 28000.0,
  intensidadeCarbonoAgricolaGCo2Mj = 24.8, // Medido pela calculadora RenovaCalc
  cotacaoCbioB3Brl = 105.00 // Cotação média do crédito de carbono na B3
}) {
  const fossilRef = culturaBiomassa.includes('BIODIESEL') ? FOSSIL_REFERENCIA.dieselFossil : FOSSIL_REFERENCIA.gasolina;

  // NEEA = Emissão Fóssil de Referência - Emissão do Biocombustível (g CO2eq/MJ)
  const neea = Math.max(0, Number((fossilRef - intensidadeCarbonoAgricolaGCo2Mj).toFixed(2)));

  // Fator de conversão: Tonelada de Grão -> Litros de Biocombustível -> Megajoules (MJ)
  // Para soja: ~1 ton soja gera aprox. 190 litros de óleo vegetal = 6.840 MJ de biodiesel
  const energiaGeradaMjPorTon = 6840.0;
  const totalEnergiaBiomassaMj = volumeProducaoTon * energiaGeradaMjPorTon;

  // Toneladas de CO2 evitadas = (Total MJ * NEEA em g) / 1.000.000 (g/ton)
  const toneladasCo2Evitadas = Number(((totalEnergiaBiomassaMj * neea) / 1000000).toFixed(0));
  const totalCbiosElegiveis = toneladasCo2Evitadas;

  // Projeção financeira na B3
  const receitaBrutaB3Brl = Number((totalCbiosElegiveis * cotacaoCbioB3Brl).toFixed(2));
  const taxaEscrituracaoB3Pct = 1.5; // Emolumentos e taxa da registradora
  const receitaLiquidaB3Brl = Number((receitaBrutaB3Brl * (1 - taxaEscrituracaoB3Pct / 100)).toFixed(2));

  const protocoloCertificAgro = `CERTIFIC-AGRO-ANP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    sucesso: true,
    protocoloCertificAgro,
    culturaBiomassa,
    volumeProducaoTon,
    calculoNeea: {
      fossilReferenciaGCo2Mj: fossilRef,
      intensidadeCarbonoBiomassaGCo2Mj: intensidadeCarbonoAgricolaGCo2Mj,
      neeaGCo2Mj: neea,
      reducaoEmissoesPct: Number(((neea / fossilRef) * 100).toFixed(1))
    },
    saldoCbios: {
      totalCbiosEmitidos: totalCbiosElegiveis,
      unidadeEquivalente: '1 CBIO = 1 ton CO2eq evitada na atmosfera',
      cotacaoUnitariaB3Brl: cotacaoCbioB3Brl,
      receitaBrutaEstimadaB3Brl: receitaBrutaB3Brl,
      receitaLiquidaProdutorBrl: receitaLiquidaB3Brl
    },
    mercadoNegociacao: 'B3 S.A. - Brasil, Bolsa, Balcão (Mercado Organizado de Créditos de Descarbonização)',
    emitidoEm: new Date().toISOString()
  };
}

module.exports = {
  FOSSIL_REFERENCIA,
  auditarElegibilidadeRenovabio,
  calcularEmissaoCbios
};
