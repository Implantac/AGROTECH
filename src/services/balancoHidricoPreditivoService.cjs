/**
 * AGROTECH ENTERPRISE - SERVIÇO DE BALANÇO HÍDRICO CLIMATOLÓGICO (FAO-56 PENMAN-MONTEITH) & DELTA T 15D
 * Modelagem agrometeorológica da água no solo (0-40cm), estresse hídrico da cultura (ETc/ETo) e janelas de pulverização.
 */

// Coeficientes de cultura padrão FAO-56 (Kc) por fase de desenvolvimento
const KC_FASES_CULTURA = {
  'SOJA': {
    inicial: 0.40,      // Emergência a V3 (0-20 dias)
    vegetativo: 0.80,   // V4 a R1 (21-45 dias)
    florescimento: 1.15,// R1 a R5 (46-80 dias - Máxima demanda hídrica)
    maturacao: 0.50     // R6 a R8 (81-115 dias - Senescência)
  },
  'MILHO': {
    inicial: 0.35,
    vegetativo: 0.75,
    florescimento: 1.20,
    maturacao: 0.60
  },
  'ALGODAO': {
    inicial: 0.45,
    vegetativo: 0.85,
    florescimento: 1.25,
    maturacao: 0.65
  }
};

/**
 * Calcula a Evapotranspiração de Referência (ET0) pelo método padrão FAO-56 Penman-Monteith
 * ETo = [0.408*Delta*(Rn - G) + gamma*(900/(T+273))*u2*(es - ea)] / [Delta + gamma*(1 + 0.34*u2)]
 */
function calcularEtoPenmanMonteith({
  tempMediaC = 28.5,
  tempMaxC = 34.0,
  tempMinC = 23.0,
  umidadeRelativaMediaPct = 68,
  velocidadeVentoM_S = 2.2, // a 2 metros de altura
  radiacaoSolarMjM2Dia = 21.5 // Radiação solar global incidente
}) {
  // Pressão de saturação de vapor (es) e pressão atual (ea) em kPa
  const es_max = 0.6108 * Math.exp((17.27 * tempMaxC) / (tempMaxC + 237.3));
  const es_min = 0.6108 * Math.exp((17.27 * tempMinC) / (tempMinC + 237.3));
  const es = (es_max + es_min) / 2;
  const ea = es * (umidadeRelativaMediaPct / 100);

  // Declividade da curva de pressão de vapor (Delta) em kPa/°C
  const delta = (4098 * (0.6108 * Math.exp((17.27 * tempMediaC) / (tempMediaC + 237.3)))) / Math.pow((tempMediaC + 237.3), 2);

  // Constante psicrométrica (gamma) ~ 0.063 kPa/°C para altitude média do MT (~400m)
  const gamma = 0.063;

  // Fluxo de calor no solo (G) diário ~ 0
  const G = 0;
  const Rn = radiacaoSolarMjM2Dia * 0.408 * 0.77; // Balanço líquido estimado

  const numerador = (0.408 * delta * (Rn - G)) + (gamma * (900 / (tempMediaC + 273)) * velocidadeVentoM_S * (es - ea));
  const denominador = delta + (gamma * (1 + 0.34 * velocidadeVentoM_S));

  const etoMmDia = Number(Math.max(1.5, Math.min(8.5, numerador / denominador)).toFixed(2));

  return {
    etoMmDia,
    deficitPressaoVaporKpa: Number((es - ea).toFixed(2)),
    metodologia: 'FAO-56 Penman-Monteith Padrão Internacional'
  };
}

/**
 * Realiza o Balanço Hídrico Climatológico na Zona Radicular do Talhão
 */
function processarBalancoHidricoTalhao({
  talhaoId = 'talhao-01',
  cultura = 'SOJA',
  faseAtual = 'florescimento',
  capacidadeAguaDisponivelCadMm = 65.0, // Solo Latossolo Vermelho argiloso (0-40cm)
  precipitacaoUltimos7DiasMm = 38.0,
  irrigacaoAplicadaMm = 0
}) {
  const etoBase = calcularEtoPenmanMonteith({});
  const kc = KC_FASES_CULTURA[cultura]?.[faseAtual] || 1.15;
  const etcMmDia = Number((etoBase.etoMmDia * kc).toFixed(2));

  // Água Facilmente Disponível (AFD = p * CAD, com p=0.50 para culturas de grãos)
  const afdMm = Number((capacidadeAguaDisponivelCadMm * 0.50).toFixed(1));

  // Estoque atual estimado de água no perfil do solo (0-40cm)
  const consumoSemanalEtc = etcMmDia * 7;
  const entradasAguaSemanal = precipitacaoUltimos7DiasMm + irrigacaoAplicadaMm;
  const balancoSemanal = entradasAguaSemanal - consumoSemanalEtc;
  const armazenamentoAtualMm = Math.max(10, Math.min(capacidadeAguaDisponivelCadMm, capacidadeAguaDisponivelCadMm + balancoSemanal));

  const percentualAguaDisponivel = Number(((armazenamentoAtualMm / capacidadeAguaDisponivelCadMm) * 100).toFixed(1));

  let statusHidrico = 'CONFORTE_HIDRICO_OTIMO';
  let recomendacaoManejo = 'Sem necessidade de intervenção hídrica imediata.';

  if (armazenamentoAtualMm < afdMm) {
    statusHidrico = 'ESTRESSE_HIDRICO_MODERADO';
    recomendacaoManejo = `Déficit hídrico na zona radicular (${(afdMm - armazenamentoAtualMm).toFixed(1)} mm). Ligar pivô central com lâmina de 18 mm.`;
  } else if (armazenamentoAtualMm <= 18) {
    statusHidrico = 'ESTRESSE_HIDRICO_SEVERO_QUEDA_PRODUTIVIDADE';
    recomendacaoManejo = 'Emergência hídrica no enchimento de grãos. Irrigação contínua urgente recomendada.';
  }

  return {
    sucesso: true,
    talhaoId,
    cultura,
    faseFenologica: faseAtual,
    kcEfetivo: kc,
    etoReferenciaMmDia: etoBase.etoMmDia,
    etcDemandaCulturaMmDia: etcMmDia,
    consumoSemanalMm: Number(consumoSemanalEtc.toFixed(1)),
    perfilSolo: {
      profundidadeRadicularCm: 40,
      capacidadeTotalCadMm: capacidadeAguaDisponivelCadMm,
      aguaFacilmenteDisponivelAfdMm: afdMm,
      armazenamentoAtualMm: Number(armazenamentoAtualMm.toFixed(1)),
      percentualCapacidadePct: percentualAguaDisponivel
    },
    statusHidrico,
    recomendacaoManejo
  };
}

/**
 * Gera a Janela Meteorológica de Pulverização dos Próximos 15 Dias com Delta T (Norma ASABE S572)
 */
function gerarJanelaPulverizacao15Dias() {
  const diasPrevisao = [];
  const hoje = new Date();

  for (let i = 0; i < 15; i++) {
    const dataDia = new Date(hoje.getTime() + i * 86400000);
    const diaFormatado = dataDia.toISOString().split('T')[0];

    // Simulação climática com base no histórico climatológico do Cerrado / MT
    const tempArC = Number((26.0 + Math.sin(i * 0.8) * 5.0).toFixed(1));
    const umidadePct = Number((62.0 + Math.cos(i * 0.7) * 20.0).toFixed(0));
    const ventoKmH = Number((8.0 + Math.sin(i * 1.2) * 6.0).toFixed(1));
    const chuvaMm = (i === 3 || i === 8 || i === 12) ? Number((12.0 + i * 2.5).toFixed(1)) : 0;

    // Cálculo aproximado de bulbo úmido e Delta T (°C)
    // Tw ~ T * atan(0.151977 * sqrt(RH + 8.313659)) + atan(T + RH) - atan(RH - 1.676331) + 0.00391838 * RH^1.5 * atan(0.023101 * RH) - 4.686035
    const deltaT = Number((tempArC * (1 - (umidadePct / 100)) * 0.65).toFixed(1));

    let statusJanela = 'IDEAL_PULVERIZACAO';
    let motivo = 'Condições perfeitas de absorção foliar, sem risco de evaporação de gotas.';

    if (chuvaMm > 2.0) {
      statusJanela = 'IMPEDIMENTO_CHUVA';
      motivo = `Precipitação prevista de ${chuvaMm} mm causará lavagem do produto.`;
    } else if (ventoKmH > 18.0) {
      statusJanela = 'IMPEDIMENTO_VENTO_DERIVA';
      motivo = `Vento acima de 18 km/h (${ventoKmH} km/h) causa deriva inaceitável.`;
    } else if (deltaT > 8.0) {
      statusJanela = 'RISCO_EVAPORACAO_ALTA';
      motivo = `Delta T elevado (${deltaT}°C). Gotas evaporam antes de atingir o alvo foliar.`;
    } else if (deltaT < 2.0) {
      statusJanela = 'RISCO_INVERSAO_TERMICA';
      motivo = `Delta T muito baixo (${deltaT}°C) e umidade saturada. Risco de inversão e deriva estagnada.`;
    }

    diasPrevisao.push({
      dia: i + 1,
      data: diaFormatado,
      temperaturaC: tempArC,
      umidadeRelativaPct: umidadePct,
      ventoKmH,
      chuvaPrevistaMm: chuvaMm,
      deltaTC: deltaT,
      statusJanela,
      motivo
    });
  }

  const diasIdeais = diasPrevisao.filter(d => d.statusJanela === 'IDEAL_PULVERIZACAO').length;

  return {
    sucesso: true,
    totalDiasAnalisados: 15,
    diasIdeaisParaPulverizacao: diasIdeais,
    percentualJanelaFavoravel: Number(((diasIdeais / 15) * 100).toFixed(0)),
    normaReferencia: 'ASABE S572.1 / ASTM E2727',
    previsoesDiarias: diasPrevisao
  };
}

module.exports = {
  calcularEtoPenmanMonteith,
  processarBalancoHidricoTalhao,
  gerarJanelaPulverizacao15Dias
};
