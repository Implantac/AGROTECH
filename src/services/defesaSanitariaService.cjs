/**
 * AGROTECH ENTERPRISE - SERVIÇO DE DEFESA SANITÁRIA VEGETAL E ANIMAL
 * Emissão de CFO (Certificado Fitossanitário de Origem) e GTA (Guia de Trânsito Animal)
 * Conforme Instrução Normativa MAPA nº 33/2016 e Lei nº 12.873/2013.
 */

const crypto = require('crypto');

/**
 * Emite Certificado Fitossanitário de Origem (CFO) para cargas agrícolas, sementes e grãos
 */
function emitirCfoDigital({
  tipo = 'CFO_ORIGEM_PROPRIEDADE', // ou CFOC_CONSOLIDADO
  produtor = 'Schneider Agricultura e Pecuária Ltda',
  cnpjCpf = '04.812.049/0001-20',
  propriedade = 'Fazenda Santa Helena - MT',
  carNumero = 'MT-5107909-E8192841029',
  produtoVegetal = 'Soja em Grãos (Glycine max)',
  volumeCargaKg = 48000, // Carga típica de bitrem 9 eixos
  pragasQuarentenariasAusentes = [
    'Helicoverpa armigera (Ausente / Monitoramento MIP abaixo do NDE)',
    'Phakopsora pachyrhizi (Área com vazio sanitário cumprido e manejo registrado)',
    'Amaranthus palmeri (Caruru-gigante - Área Livre Oficial)'
  ],
  responsavelTecnico = {
    nome: 'Eng. Agrônomo Marcelo Prado',
    crea: 'CREA-MT 18.420/D',
    habilitacaoMapaCfo: 'BR-MT-9812-CFO'
  },
  destino = 'Terminal Portuário Graneleiro de Santos - Exportação'
}) {
  const numeroCfo = `CFO-MT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const payload = JSON.stringify({
    numeroCfo,
    tipo,
    produtor,
    cnpjCpf,
    propriedade,
    carNumero,
    produtoVegetal,
    volumeCargaKg,
    pragasQuarentenariasAusentes,
    responsavelTecnico,
    destino,
    emitidoEm: new Date().toISOString()
  });

  const hashCertificado = crypto.createHash('sha256').update(payload).digest('hex');

  return {
    sucesso: true,
    numeroCfo,
    tipoCertificado: tipo,
    normativa: 'Instrução Normativa MAPA nº 33/2016',
    statusSanitario: 'APROVADO_TRANSITO_INTERESTADUAL_E_EXPORTACAO',
    hashIntegridadeSha256: hashCertificado,
    dadosCarga: {
      produtor,
      cnpjCpf,
      propriedade,
      carNumero,
      produto: produtoVegetal,
      volumeTotalKg: volumeCargaKg,
      volumeSacas: Math.round(volumeCargaKg / 60),
      destino
    },
    declaracaoAdicionalFitossanitaria: 'A partida vegetal foi inspecionada na Unidade de Produção e encontra-se livre de pragas quarentenárias de relevância agronômica.',
    laudoPragas: pragasQuarentenariasAusentes,
    responsavelTecnicoHabilitado: responsavelTecnico,
    validadeDias: 30,
    emitidoEm: new Date().toISOString()
  };
}

/**
 * Emite Guia de Trânsito Animal (e-GTA) para bovinos de corte, confinamento e cria
 */
function emitirGtaDigital({
  especie = 'BOVINA',
  produtorOrigem = 'Schneider Agricultura e Pecuária Ltda',
  cnpjCpf = '04.812.049/0001-20',
  propriedadeOrigem = 'Fazenda Santa Helena - Confinamento',
  municipioOrigem = 'Sorriso - MT',
  finalidadeTransito = 'ABATE_FRIGORIFICO', // ou REPRODUCAO, ENGORDA, EXPOSICAO
  estabelecimentoDestino = 'JBS / MARFRIG FRIGORÍFICO REGIONAL',
  municipioDestino = 'Sinop - MT',
  quantidadeAnimais = 90, // Lote carreta boiadeira 3 andares
  sexoFaixaEtaria = 'Machos Inteiros de 24 a 36 meses',
  vacinacaoSanitaria = {
    febreAftosa: 'Área Livre Sem Vacinação (Conforme Portaria MAPA 665/2024)',
    bruceloseB19: '100% fêmeas vacinadas no rebanho de origem',
    raivaHerbivoros: 'Vacinado com dose anual obrigatória'
  },
  veterinarioResponsavel = {
    nome: 'Dr. Fernando Arantes',
    crmv: 'CRMV-MT 4.912',
    portariaHabilitacao: 'INDEA/MT nº 104/2024'
  }
}) {
  const numeroGta = `GTA-MT-${new Date().getFullYear()}-${Math.floor(1000000 + Math.random() * 9000000)}`;

  const payload = JSON.stringify({
    numeroGta,
    especie,
    produtorOrigem,
    finalidadeTransito,
    quantidadeAnimais,
    vacinacaoSanitaria,
    emitidoEm: new Date().toISOString()
  });

  const hashGta = crypto.createHash('sha256').update(payload).digest('hex');

  return {
    sucesso: true,
    numeroGta,
    padrao: 'Guia de Trânsito Animal Eletrônica (e-GTA) MAPA / INDEA',
    statusEmissao: 'AUTORIZADA_TRANSITO_SANITARIO_VIGENTE',
    hashAutenticidade: hashGta,
    dadosOrigem: {
      produtor: produtorOrigem,
      cpfCnpj: cnpjCpf,
      propriedade: propriedadeOrigem,
      municipio: municipioOrigem
    },
    dadosDestino: {
      estabelecimento: estabelecimentoDestino,
      municipio: municipioDestino,
      finalidade: finalidadeTransito
    },
    rebanho: {
      especie,
      quantidadeCabecas: quantidadeAnimais,
      categoria: sexoFaixaEtaria
    },
    controleSanitario: vacinacaoSanitaria,
    responsavelTecnico: veterinarioResponsavel,
    validadeDias: 3,
    emitidoEm: new Date().toISOString()
  };
}

module.exports = {
  emitirCfoDigital,
  emitirGtaDigital
};
