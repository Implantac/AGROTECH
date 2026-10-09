/**
 * AGROTECH ENTERPRISE - MOTOR DE SENSORIAMENTO REMOTO & ÍNDICES ESPECTRAIS
 * Processamento de bandas multiespectrais ópticas (Sentinel-2 L2A / Landsat-9 / Drones Multiespectrais)
 * Bandas:
 * - RED: ~665 nm (Sentinel-2 B04)
 * - RED EDGE: ~705 nm (Sentinel-2 B05)
 * - NIR (Near-Infrared): ~842 nm (Sentinel-2 B08)
 */

function calcularNdvi(nir, red) {
  const denominador = nir + red;
  if (denominador === 0) return 0;
  const val = (nir - red) / denominador;
  return Number(Math.max(-1, Math.min(1, val)).toFixed(4));
}

function calcularNdre(nir, redEdge) {
  const denominador = nir + redEdge;
  if (denominador === 0) return 0;
  const val = (nir - redEdge) / denominador;
  return Number(Math.max(-1, Math.min(1, val)).toFixed(4));
}

function calcularMsavi(nir, red) {
  const termo = (2 * nir + 1) ** 2 - 8 * (nir - red);
  if (termo < 0) return 0;
  const val = (2 * nir + 1 - Math.sqrt(termo)) / 2;
  return Number(Math.max(0, Math.min(1, val)).toFixed(4));
}

function calcularEvi2(nir, red) {
  const denominador = nir + 2.4 * red + 1;
  if (denominador === 0) return 0;
  const val = 2.5 * ((nir - red) / denominador);
  return Number(Math.max(0, Math.min(1, val)).toFixed(4));
}

function classificarVigorNdvi(ndvi) {
  if (ndvi < 0.20) return { classe: 'MUITO_BAIXO', corHex: '#DC2626', descricao: 'Solo Exposto ou Estresse Hídrico Severo' };
  if (ndvi < 0.40) return { classe: 'BAIXO', corHex: '#F59E0B', descricao: 'Baixa Biomassa / Emergência de Plântulas' };
  if (ndvi < 0.65) return { classe: 'MEDIO', corHex: '#EAB308', descricao: 'Desenvolvimento Vegetativo Intermediário' };
  if (ndvi < 0.80) return { classe: 'ALTO', corHex: '#10B981', descricao: 'Dossel Vegetativo Fechado e Ativo' };
  return { classe: 'MUITO_ALTO', corHex: '#047857', descricao: 'Vigor Fotossintético Máximo (Pico de Biomassa)' };
}

/**
 * Análise multiespectral de um talhão com síntese temporal
 */
function processarSensoriamentoTalhao({
  talhaoId = 'TAL-01',
  nomeTalhao = 'Talhão 01 - Pivô Central Norte',
  cultura = 'Soja',
  faseFenologica = 'R5.1 (Enchimento de Grãos)',
  amostrasBanda = null
}) {
  // Amostras padrão de reflectância (Sentinel-2 BOA - Bottom-Of-Atmosphere)
  const amostras = amostrasBanda || [
    { ponto: 'P1-Norte', nir: 0.58, red: 0.08, redEdge: 0.24 },
    { ponto: 'P2-Centro', nir: 0.62, red: 0.07, redEdge: 0.22 },
    { ponto: 'P3-Sul', nir: 0.48, red: 0.12, redEdge: 0.28 },
    { ponto: 'P4-Leste', nir: 0.65, red: 0.06, redEdge: 0.21 },
    { ponto: 'P5-Oeste', nir: 0.42, red: 0.15, redEdge: 0.31 }
  ];

  const resultadosPontos = amostras.map(a => {
    const ndvi = calcularNdvi(a.nir, a.red);
    const ndre = calcularNdre(a.nir, a.redEdge);
    const msavi = calcularMsavi(a.nir, a.red);
    const evi2 = calcularEvi2(a.nir, a.red);
    const classificacao = classificarVigorNdvi(ndvi);

    return {
      ponto: a.ponto,
      reflectancia: a,
      ndvi,
      ndre,
      msavi,
      evi2,
      classificacao: classificacao.classe,
      corHex: classificacao.corHex,
      interpretacao: classificacao.descricao
    };
  });

  const somaNdvi = resultadosPontos.reduce((acc, p) => acc + p.ndvi, 0);
  const mediaNdvi = Number((somaNdvi / resultadosPontos.length).toFixed(3));
  const somaNdre = resultadosPontos.reduce((acc, p) => acc + p.ndre, 0);
  const mediaNdre = Number((somaNdre / resultadosPontos.length).toFixed(3));

  const classificacaoGeral = classificarVigorNdvi(mediaNdvi);

  return {
    sucesso: true,
    talhaoId,
    nomeTalhao,
    cultura,
    faseFenologica,
    constelacao: 'Sentinel-2 Multispectral Instrument (MSI) / Copernicus',
    resolucaoEspacialMetros: 10,
    coberturaNuvensPercent: 2.1,
    dataPassagemSatelite: new Date().toISOString().split('T')[0],
    indicesMedios: {
      ndvi: mediaNdvi,
      ndre: mediaNdre,
      classificacao: classificacaoGeral.classe,
      statusVigor: classificacaoGeral.descricao
    },
    recomendacoesAgronomicas: mediaNdvi >= 0.70
      ? ['Manter plano de monitoramento preventivo de fungicidas', 'Potencial produtivo estimado acima de 68 sc/ha']
      : ['Realizar varredura MIP para verificar focos de nematoides ou ferrugem asiática', 'Avaliar reforço de adubação foliar com potássio no terço sul'],
    amostragemZonal: resultadosPontos
  };
}

module.exports = {
  calcularNdvi,
  calcularNdre,
  calcularMsavi,
  calcularEvi2,
  classificarVigorNdvi,
  processarSensoriamentoTalhao
};
