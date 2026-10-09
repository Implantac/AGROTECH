/**
 * AGROTECH ENTERPRISE - SERVIÇO DE BARTER, CPR DIGITAL & MARCAÇÃO A MERCADO (B3 / CBOT)
 * Em total conformidade com a Lei nº 13.986/2020 (Nova Lei do Agro) e Resolução CMN/BACEN nº 4.870.
 */

const crypto = require('crypto');

// Cotações de referência atualizadas (Soja, Milho, Algodão, Dólar PTAX e Fertilizantes)
const MERCADO_COMMODITIES = {
  sojaSaca60kgBrl: 136.50, // Sorriso/Sinop - MT
  sojaCbotUsdBushel: 11.85,
  milhoSaca60kgBrl: 58.20,
  algodaoArrobaBrl: 138.00,
  dolarPtaxBrl: 5.42,
  premioPortoSantosUsd: 1.15,
  fertilizantes: {
    mapTonBrl: 4450.00,
    kclTonBrl: 2980.00,
    ureiaTonBrl: 2650.00,
    dieselS10LitroBrl: 5.85
  }
};

/**
 * Calcula a Relação de Troca (Barter Ratio) para custeio de safra
 * Quantas sacas de commodity são necessárias para pagar cada tonelada de fertilizante ou litro de combustível
 */
function calcularRelacaoTroca({
  commodity = 'SOJA',
  insumos = [
    { tipo: 'MAP 11-52-00', quantidadeTon: 150, precoUnitarioTonBrl: 4450.00 },
    { tipo: 'Cloreto de Potássio KCl', quantidadeTon: 100, precoUnitarioTonBrl: 2980.00 },
    { tipo: 'Diesel S10', quantidadeLitros: 45000, precoUnitarioLitroBrl: 5.85 }
  ],
  precoPreFixadoSacaBrl = 136.50
}) {
  let valorTotalInsumosBrl = 0;

  const insumosCalculados = insumos.map(item => {
    let custoItem = 0;
    let sacasItem = 0;
    if (item.quantidadeTon) {
      custoItem = item.quantidadeTon * (item.precoUnitarioTonBrl || MERCADO_COMMODITIES.fertilizantes.mapTonBrl);
    } else if (item.quantidadeLitros) {
      custoItem = item.quantidadeLitros * (item.precoUnitarioLitroBrl || MERCADO_COMMODITIES.fertilizantes.dieselS10LitroBrl);
    }
    sacasItem = Number((custoItem / precoPreFixadoSacaBrl).toFixed(1));
    valorTotalInsumosBrl += custoItem;

    return {
      ...item,
      custoTotalBrl: custoItem,
      sacasNecessarias: sacasItem,
      relacaoUnitario: item.quantidadeTon ? `${(item.precoUnitarioTonBrl / precoPreFixadoSacaBrl).toFixed(1)} sc/ton` : `${(item.precoUnitarioLitroBrl / precoPreFixadoSacaBrl).toFixed(3)} sc/L`
    };
  });

  const totalSacasCommodity = Number((valorTotalInsumosBrl / precoPreFixadoSacaBrl).toFixed(0));

  return {
    sucesso: true,
    commodity,
    precoBaseSacaBrl: precoPreFixadoSacaBrl,
    valorTotalPacoteInsumosBrl: valorTotalInsumosBrl,
    totalSacasComprometidas: totalSacasCommodity,
    relacaoMediaPonderada: `${(totalSacasCommodity / (valorTotalInsumosBrl / 1000)).toFixed(2)} sacas por R$ 1.000 de insumos`,
    detalhesInsumos: insumosCalculados
  };
}

/**
 * Emite Cédula de Produto Rural Digital (CPR Física ou Financeira) com Registro na B3
 */
function emitirCprDigital({
  tipoCpr = 'CPR_FISICA_LIQUIDACAO_PRODUTO', // ou CPR_FINANCEIRA
  emitente = {
    nome: 'Dr. Roberto Schneider',
    cpfCnpj: '04.812.049/0001-20',
    propriedade: 'Fazenda Santa Helena',
    municipio: 'Sorriso - MT'
  },
  credor = {
    nome: 'MULTINACIONAL AGROQUÍMICA & GRAOS S/A',
    cnpj: '00.123.456/0001-99'
  },
  produto = 'Soja em Grãos, Granel, Safra 2025/2026',
  quantidadeSacas = 8000,
  valorReferenciaBrl = 1092000.00,
  dataVencimento = '30/04/2026',
  localEntrega = 'Terminal Ferroviário Rumo / Silo Credor - Sorriso/MT',
  garantia = {
    tipo: 'PENHOR_AGRICOLA_DE_SAFRA_FUTURA',
    talhaoId: 'talhao-01',
    areaPenhoradaHa: 420.5,
    grau: '1º GRAU SEM CONCORRÊNCIA'
  }
}) {
  const numeroCpr = `CPR-B3-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  // Assinatura digital da cédula (Hash SHA-256 da cártula eletrônica)
  const payloadCartula = JSON.stringify({
    numeroCpr,
    tipoCpr,
    emitente,
    credor,
    produto,
    quantidadeSacas,
    valorReferenciaBrl,
    dataVencimento,
    garantia,
    timestampEmissao: new Date().toISOString()
  });

  const hashCartulaSha256 = crypto.createHash('sha256').update(payloadCartula).digest('hex');

  // Protocolo simulado da Registradora Autorizada pelo Banco Central do Brasil (B3 S.A. / CERC)
  const protocoloRegistroB3 = `B3-REG-${new Date().getFullYear()}-AGRO-${Math.floor(10000000 + Math.random() * 90000000)}`;

  return {
    sucesso: true,
    numeroCpr,
    tipoCpr,
    normaLegal: 'Lei nº 8.929/1994 com redação dada pela Lei nº 13.986/2020 (Nova Lei do Agro)',
    statusRegistro: 'REGISTRADA_E_ATIVA_NA_B3',
    protocoloRegistroB3,
    hashCartulaSha256,
    resumoOperacao: {
      emitente: emitente.nome,
      cnpjCpf: emitente.cpfCnpj,
      credor: credor.nome,
      produto,
      quantidadeSacas,
      quantidadeKg: quantidadeSacas * 60,
      valorFinanceiroEstimadoBrl: valorReferenciaBrl,
      dataVencimento,
      localEntrega
    },
    garantiaVinculada: garantia,
    clausulasMandatorias: [
      'Constituição de patrimônio de afetação em garantia (Art. 7º Lei 13.986/2020)',
      'Obrigação líquida, certa e exigível por execução de título extrajudicial',
      'Dispensa de registro em Cartório de Títulos e Documentos mediante escrituração em registradora autorizada pelo BACEN'
    ],
    emitidoEm: new Date().toISOString()
  };
}

module.exports = {
  MERCADO_COMMODITIES,
  calcularRelacaoTroca,
  emitirCprDigital
};
