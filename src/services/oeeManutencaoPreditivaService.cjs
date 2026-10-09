/**
 * AGROTECH ENTERPRISE - OEE AGRÍCOLA & MANUTENÇÃO PREDITIVA COM HORÍMETRO CAN BUS
 * Métricas de Disponibilidade, Desempenho, Qualidade, Consumo Diesel L/ha e Gatilhos de Revisão Preventiva.
 */

// Plano oficial de revisões preventivas de frotas agrícolas pesadas (John Deere, Case IH, New Holland, Valtra)
const PLANO_MANUTENCAO_PREVENTIVA = [
  {
    intervaloHoras: 250,
    titulo: 'Revisão Básica 250h - Lubrificação e Filtros de Motor',
    criticidade: 'MEDIA',
    itensInspecao: [
      'Drenagem e troca de óleo lubrificante do motor (15W-40 CI-4)',
      'Substituição do filtro de óleo de motor',
      'Substituição do filtro sedimentador e de combustível secundário',
      'Inspeção visual de correias e tensores do alternador e ventilador'
    ]
  },
  {
    intervaloHoras: 500,
    titulo: 'Revisão Intermediária 500h - Admissão e Rodado',
    criticidade: 'ALTA',
    itensInspecao: [
      'Todos os itens da revisão de 250h',
      'Substituição do elemento filtrante de ar primário e secundário',
      'Engraxe de mancais, cruzetas cardan e articulações da tração dianteira (4WD)',
      'Checagem do nível de óleo dos cubos de roda dianteiros e redutores finais',
      'Aperto de porcas de rodas com torquímetro (conforme manual técnico)'
    ]
  },
  {
    intervaloHoras: 1000,
    titulo: 'Revisão Completa 1.000h - Transmissão, Hidráulico e Injeção',
    criticidade: 'CRITICA',
    itensInspecao: [
      'Drenagem total e troca do óleo da transmissão Powershift / CVT (óleo UTTO)',
      'Substituição dos filtros hidráulicos de sucção e pressão',
      'Substituição do líquido de arrefecimento (Coolant com etilenoglicol 50/50)',
      'Calibração e teste de vazão da bomba de injeção Common Rail e bicos',
      'Regulagem de folga de válvulas do cabeçote do motor'
    ]
  }
];

/**
 * Calcula o OEE Agrícola (Overall Equipment Effectiveness) de acordo com a norma mundial adaptada ao campo
 * D (Disponibilidade) = Horas Produtivas / Horas Planejadas
 * P (Performance / Desempenho) = Hectares Realizados / Hectares Esperados pela Velocidade e Largura de Barra
 * Q (Qualidade) = Área Conforme sem Remonte ou Falha / Área Total
 */
function calcularOeeAgricola({
  horasPlanejadas = 12.0,
  horasTrabalhadas = 10.2, // Tempo com motor ligado e implemento engatado
  paradasNaoPlanejadasHoras = 1.8, // Manutenção corretiva, atolamento, falta de calda
  hectaresEsperados = 95.0,
  hectaresRealizados = 91.5,
  areaComFalhaOuRemonteHa = 1.8, // Medido pelo corte de seção GPS ISOBUS
  consumoDieselLitrosTotal = 270.0 // Extraído do PGN 65266 (LFE) J1939
}) {
  // 1. Disponibilidade
  const disponibilidade = Math.min(1.0, Math.max(0, (horasTrabalhadas) / horasPlanejadas));

  // 2. Desempenho
  const desempenho = Math.min(1.0, Math.max(0, hectaresRealizados / hectaresEsperados));

  // 3. Qualidade (taxa de acerto do piloto automático e corte de seções)
  const areaQualidadeOk = Math.max(0, hectaresRealizados - areaComFalhaOuRemonteHa);
  const qualidade = Math.min(1.0, Math.max(0, areaQualidadeOk / hectaresRealizados));

  // OEE Global
  const oeeGlobal = Number((disponibilidade * desempenho * qualidade * 100).toFixed(1));

  // Consumo específico de diesel por hectare trabalhado
  const dieselLitrosPorHa = Number((consumoDieselLitrosTotal / (hectaresRealizados || 1)).toFixed(2));
  const rendimentoOperacionalHaPorHora = Number((hectaresRealizados / (horasTrabalhadas || 1)).toFixed(2));

  // Classificação Mundial de Benchmark OEE
  let statusClassificacao = 'PADRAO_COMUM';
  if (oeeGlobal >= 85.0) {
    statusClassificacao = 'CLASSE_MUNDIAL_EXCELENCIA'; // World Class OEE (>85%)
  } else if (oeeGlobal >= 75.0) {
    statusClassificacao = 'BOM_DESEMPENHO_OPERACIONAL';
  } else {
    statusClassificacao = 'ATENCAO_PERDAS_ELEVADAS';
  }

  return {
    sucesso: true,
    oeeGlobalPercentual: oeeGlobal,
    classificacaoOee: statusClassificacao,
    fatores: {
      disponibilidadePercentual: Number((disponibilidade * 100).toFixed(1)),
      desempenhoPercentual: Number((desempenho * 100).toFixed(1)),
      qualidadePercentual: Number((qualidade * 100).toFixed(1))
    },
    metricasOperacionais: {
      horasPlanejadas,
      horasTrabalhadas,
      paradasNaoPlanejadasHoras,
      hectaresRealizados,
      rendimentoOperacionalHaPorHora,
      consumoTotalDieselLitros: consumoDieselLitrosTotal,
      consumoDieselLitrosPorHa: dieselLitrosPorHa,
      statusConsumoCombustivel: dieselLitrosPorHa <= 3.2 ? 'ECONOMICO_OTIMO' : (dieselLitrosPorHa <= 4.5 ? 'MODERADO' : 'ALTO_CONSUMO_INVESTIGAR')
    }
  };
}

/**
 * Avalia o horímetro J1939 de cada máquina da frota e gera gatilhos de manutenção preditiva e abertura de OS
 */
function avaliarManutencaoPreditivaFrota(maquinas = []) {
  if (!maquinas || maquinas.length === 0) {
    maquinas = [
      { id: 'frota-01', tag: 'TRAT-JD-8R', modelo: 'John Deere 8R 370', horimetroTotalHoras: 4235.0, status: 'EM_OPERACAO' },
      { id: 'frota-02', tag: 'COLH-S790', modelo: 'John Deere S790 Rotor', horimetroTotalHoras: 1985.0, status: 'EM_OPERACAO' },
      { id: 'frota-03', tag: 'PULV-PATRIOT', modelo: 'Case IH Patriot 350', horimetroTotalHoras: 2490.0, status: 'EM_OPERACAO' }
    ];
  }

  const planoAlertas = [];

  maquinas.forEach(maquina => {
    const horimetro = Number(maquina.horimetroTotalHoras || maquina.horimetro || 0);

    PLANO_MANUTENCAO_PREVENTIVA.forEach(plano => {
      const horasDesdeUltima = horimetro % plano.intervaloHoras;
      const horasFaltantes = plano.intervaloHoras - horasDesdeUltima;

      // Dispara se estiver a menos de 25 horas da revisão ou já tiver vencido
      if (horasFaltantes <= 25 || horasDesdeUltima < 5) {
        const jaVenceu = horasFaltantes <= 0 || horasDesdeUltima < 5;
        planoAlertas.push({
          idAlerta: `os-preditiva-${maquina.id}-${plano.intervaloHoras}`,
          maquinaId: maquina.id,
          maquinaTag: maquina.tag,
          modelo: maquina.modelo,
          horimetroAtual: horimetro,
          tipoManutencao: plano.titulo,
          criticidade: jaVenceu ? 'VENCIDA_URGENTE' : (horasFaltantes <= 10 ? 'IMINENTE' : 'PROGRAMADA'),
          horasFaltantes: Number(horasFaltantes.toFixed(1)),
          acaoRecomendada: jaVenceu ? 'ABRIR ORDEM DE SERVIÇO IMEDIATA NA OFICINA' : `Agendar parada em ${horasFaltantes.toFixed(0)} horas`,
          itensInspecao: plano.itensInspecao,
          sugestaoOS: {
            tipo: 'PREVENTIVA_CANBUS',
            oficina: 'Oficina Central da Fazenda',
            responsavelMecanica: 'Chefe de Manutenção Clóvis Antunes'
          }
        });
      }
    });
  });

  return {
    sucesso: true,
    totalMaquinasAvaliadas: maquinas.length,
    totalOrdensServicoSugeridas: planoAlertas.length,
    alertasManutencao: planoAlertas
  };
}

module.exports = {
  calcularOeeAgricola,
  avaliarManutencaoPreditivaFrota,
  PLANO_MANUTENCAO_PREVENTIVA
};
