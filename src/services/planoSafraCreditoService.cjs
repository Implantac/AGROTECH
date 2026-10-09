/**
 * AGROTECH ENTERPRISE - SIMULADOR DO PLANO SAFRA & GERADOR DE DOSSIÊ BANCÁRIO (BACEN MCR)
 * Enquadramento em linhas oficiais: Pronaf, Pronamp, Moderfrota, Proirriga, PCA e Inovagro.
 * Manual de Crédito Rural (MCR / BACEN).
 */

const LINHAS_PLANO_SAFRA = [
  {
    codigo: 'PRONAF_CUSTEIO',
    nome: 'PRONAF Custeio (Agricultura Familiar)',
    taxaJurosAnualPct: 4.5,
    tetoFinanciamentoBrl: 500000.00,
    prazoMeses: 12,
    carenciaMeses: 0,
    publicoAlvo: 'Pequenos produtores com faturamento anual de até R$ 500 mil e DAP/CAF ativa.',
    finalidade: 'Aquisição de sementes, fertilizantes, defensivos e combustível para a safra.'
  },
  {
    codigo: 'PRONAMP_CUSTEIO',
    nome: 'PRONAMP Custeio (Médio Produtor Rural)',
    taxaJurosAnualPct: 8.0,
    tetoFinanciamentoBrl: 1500000.00,
    prazoMeses: 14,
    carenciaMeses: 0,
    publicoAlvo: 'Médios produtores rurais com receita operacional bruta anual de até R$ 3 milhões.',
    finalidade: 'Custeio agrícola e pecuário com taxas subsidiadas pelo Tesouro Nacional.'
  },
  {
    codigo: 'MODERFROTA_INVESTIMENTO',
    nome: 'MODERFROTA (Modernização da Frota de Tratores e Implementos)',
    taxaJurosAnualPct: 10.5,
    tetoFinanciamentoBrl: 3000000.00,
    prazoMeses: 84, // 7 anos
    carenciaMeses: 14,
    publicoAlvo: 'Produtores de qualquer porte para renovação de maquinário agrícola.',
    finalidade: 'Financiamento de tratores novos, colheitadeiras, plantadeiras e pulverizadores autopropelidos.'
  },
  {
    codigo: 'PROIRRIGA_INVESTIMENTO',
    nome: 'PROIRRIGA (Irrigação e Armazenamento Hídrico)',
    taxaJurosAnualPct: 10.5,
    tetoFinanciamentoBrl: 4000000.00,
    prazoMeses: 120, // 10 anos
    carenciaMeses: 24,
    publicoAlvo: 'Produtores com projetos de pivô central, gotejamento ou barragens de acumulação.',
    finalidade: 'Instalação de sistemas de irrigação, açudes, reservatórios e eletrificação rural.'
  },
  {
    codigo: 'PCA_ARMAZENAGEM',
    nome: 'PCA (Programa para Construção e Ampliação de Armazéns)',
    taxaJurosAnualPct: 7.0, // até 6.000 ton
    tetoFinanciamentoBrl: 25000000.00,
    prazoMeses: 144, // 12 anos
    carenciaMeses: 24,
    publicoAlvo: 'Produtores rurais e cooperativas agropecuárias para estocagem própria.',
    finalidade: 'Construção de silos graneleiros, secadores, termometria e moegas.'
  },
  {
    codigo: 'INOVAGRO_TECNOLOGIA',
    nome: 'INOVAGRO (Inovação Tecnológica na Agricultura)',
    taxaJurosAnualPct: 10.5,
    tetoFinanciamentoBrl: 2000000.00,
    prazoMeses: 60, // 5 anos
    carenciaMeses: 12,
    publicoAlvo: 'Produtores rurais investindo em agricultura de precisão e transição energética.',
    finalidade: 'Aquisição de drones de pulverização, sensores IoT, conectividade de campo e energia solar.'
  }
];

/**
 * Simula o financiamento do Plano Safra e indica o melhor enquadramento
 */
function simularCreditoRural({
  receitaBrutaAnualBrl = 2400000.00,
  valorDesejadoBrl = 800000.00,
  finalidadeSolicitada = 'CUSTEIO_LAVOURA', // ou MAQUINARIO, IRRIGACAO, ARMAZENAGEM, TECNOLOGIA
  prazoDesejadoAnos = 1
}) {
  let linhaRecomendada = null;

  if (finalidadeSolicitada === 'CUSTEIO_LAVOURA') {
    if (receitaBrutaAnualBrl <= 500000) {
      linhaRecomendada = LINHAS_PLANO_SAFRA.find(l => l.codigo === 'PRONAF_CUSTEIO');
    } else if (receitaBrutaAnualBrl <= 3000000) {
      linhaRecomendada = LINHAS_PLANO_SAFRA.find(l => l.codigo === 'PRONAMP_CUSTEIO');
    } else {
      linhaRecomendada = {
        codigo: 'CUSTEIO_LIVRE_LCA',
        nome: 'Custeio Livre / Recursos Obrigatórios LCA',
        taxaJurosAnualPct: 12.0,
        tetoFinanciamentoBrl: 50000000,
        prazoMeses: 14,
        carenciaMeses: 0,
        publicoAlvo: 'Grandes produtores corporativos e agroindústrias.',
        finalidade: 'Recursos com lastro em Letras de Crédito do Agronegócio.'
      };
    }
  } else if (finalidadeSolicitada === 'MAQUINARIO') {
    linhaRecomendada = LINHAS_PLANO_SAFRA.find(l => l.codigo === 'MODERFROTA_INVESTIMENTO');
  } else if (finalidadeSolicitada === 'IRRIGACAO') {
    linhaRecomendada = LINHAS_PLANO_SAFRA.find(l => l.codigo === 'PROIRRIGA_INVESTIMENTO');
  } else if (finalidadeSolicitada === 'ARMAZENAGEM') {
    linhaRecomendada = LINHAS_PLANO_SAFRA.find(l => l.codigo === 'PCA_ARMAZENAGEM');
  } else {
    linhaRecomendada = LINHAS_PLANO_SAFRA.find(l => l.codigo === 'INOVAGRO_TECNOLOGIA');
  }

  // Cálculo de parcelas e custo financeiro (Tabela Price com taxa anual equalizada)
  const taxaAnual = linhaRecomendada.taxaJurosAnualPct / 100;
  const meses = linhaRecomendada.prazoMeses;
  const valorFinanciado = Math.min(valorDesejadoBrl, linhaRecomendada.tetoFinanciamentoBrl);
  const totalJurosEstimados = valorFinanciado * taxaAnual * (meses / 12);
  const montanteFinal = valorFinanciado + totalJurosEstimados;

  return {
    sucesso: true,
    enquadramento: {
      linhaCodigo: linhaRecomendada.codigo,
      linhaNome: linhaRecomendada.nome,
      taxaJurosAnual: `${linhaRecomendada.taxaJurosAnualPct}% a.a.`,
      taxaJurosAnualPct: linhaRecomendada.taxaJurosAnualPct,
      tetoFinanciamentoBrl: linhaRecomendada.tetoFinanciamentoBrl,
      prazoMeses: linhaRecomendada.prazoMeses,
      carenciaMeses: linhaRecomendada.carenciaMeses,
      publicoAlvo: linhaRecomendada.publicoAlvo
    },
    simulacaoValores: {
      valorSolicitadoBrl: valorDesejadoBrl,
      valorAprovavelBrl: valorFinanciado,
      custoTotalJurosBrl: Number(totalJurosEstimados.toFixed(2)),
      montanteFinalEstimadoBrl: Number(montanteFinal.toFixed(2)),
      parcelaEstimadaAnualBrl: Number((montanteFinal / (meses / 12)).toFixed(2))
    },
    instituicoesParceirasCredenciadas: [
      'Banco do Brasil (Líder em Crédito Rural)',
      'Sicredi Agro',
      'Sicoob Agronegócio',
      'Caixa Econômica Federal',
      'Banco Santander Agro'
    ],
    timestamp: new Date().toISOString()
  };
}

/**
 * Gera Dossiê Técnico Padronizado pronto para protocolo bancário
 */
function gerarDossieBancario({
  produtorNome = 'Schneider Agricultura e Pecuária Ltda',
  cnpjCpf = '04.812.049/0001-20',
  propriedade = 'Fazenda Santa Helena',
  carNumero = 'MT-5107909-E8192841029',
  areaTotalHa = 755.99,
  areaCultivadaHa = 420.5,
  cultura = 'Soja em Grãos',
  safra = '2025/2026',
  linhaCredito = 'PRONAMP_CUSTEIO',
  valorSolicitadoBrl = 1200000.00
}) {
  const protocoloDossie = `DOSSIE-MCR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    sucesso: true,
    protocoloDossie,
    statusDossie: 'PRONTO_PARA_PROTOCOLO_BANCARIO',
    documentoFormatado: {
      cabecalho: {
        titulo: 'PROJETO TÉCNICO DE CUSTEIO AGRÍCOLA - PLANO SAFRA',
        normaRegulamentadora: 'Manual de Crédito Rural (BACEN MCR Seção 2-1)',
        emissor: 'AGROTECH Financial Engine'
      },
      identificacaoProponente: {
        produtor: produtorNome,
        cpfCnpj: cnpjCpf,
        fazenda: propriedade,
        carInscricao: carNumero,
        areaProdutivaHa: areaCultivadaHa,
        areaReservaLegalHa: Number((areaTotalHa * 0.20).toFixed(1))
      },
      planejamentoSafra: {
        cultura,
        safra,
        produtividadeEsperadaScHa: 68.5,
        producaoTotalEsperadaSc: Math.round(areaCultivadaHa * 68.5),
        receitaBrutaEsperadaBrl: Math.round(areaCultivadaHa * 68.5 * 136.50)
      },
      cronogramaDesembolsoBrl: [
        { etapa: 'Adubação de Base e Corretivos (Fase 1)', mes: 'Setembro', percentual: 45, valor: valorSolicitadoBrl * 0.45 },
        { etapa: 'Sementes TSI e Semeadura (Fase 2)', mes: 'Outubro', percentual: 30, valor: valorSolicitadoBrl * 0.30 },
        { etapa: 'Tratos Fitossanitários e Diesel (Fase 3)', mes: 'Novembro a Janeiro', percentual: 25, valor: valorSolicitadoBrl * 0.25 }
      ],
      checklistDocumentosAnexados: [
        'CAR (Cadastro Ambiental Rural Ativo e Regular)',
        'CCIR / ITR do Imóvel Rural em dia',
        'Outorga de Água ou Declaração de Uso Insignificante',
        'Zoneamento Agrícola de Risco Climático (ZARC Conforme Proagro)',
        'Declaração de Aptidão ao PRONAMP/PRONAF'
      ]
    },
    emitidoEm: new Date().toISOString()
  };
}

module.exports = {
  LINHAS_PLANO_SAFRA,
  simularCreditoRural,
  gerarDossieBancario
};
