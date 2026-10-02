/**
 * AGROTECH ENTERPRISE v9.5 - CORE ERP
 * Manejo de Irrigação & Balanço Hídrico FAO-56
 * Penman-Monteith, Lâmina de Pivô Central e Otimização de Tarifa Noturna (Resolução ANEEL 414/2010)
 */

export interface ParametrosSoloHidrico {
  capacidadeCampoPct: number;    // CC (% peso ou base volumétrica, ex: 32%)
  pontoMurchaPermanentePct: number; // PMP (% peso, ex: 18%)
  densidadeSoloGcm3: number;     // Densidade aparente do solo (ex: 1.25 g/cm³)
  profundidadeRaizMm: number;    // Profundidade efetiva do sistema radicular (ex: 400 mm)
  fatorDisponibilidadeP: number; // Fração de esgotamento de água sem estresse hídrico (p, ex: 0.50 para soja/milho)
}

export interface ParametrosClimaIrrigacao {
  etoReferenciaMmDia: number;    // ETo diária calculada por Penman-Monteith (ex: 5.8 mm/dia)
  coeficienteCulturaKc: number;  // Kc atual do estádio fenológico (ex: 1.15 para floração/enchimento de grãos)
  precipitacaoEfetivaMmDia: number; // Chuva aproveitada pelo solo (ex: 12.0 mm)
}

export interface ParametrosPivoEquipamento {
  pivoId: string;
  areaIrrigadaHectares: number;
  vazaoTotalM3Hora: number;      // Vazão nominal das motobombas (ex: 350 m³/h)
  eficienciaAplicacaoPct: number; // Eficiência do pivô (ex: 88%)
  potenciaTotalCv: number;       // Potência dos motores (ex: 150 CV)
  tarifaEnergiaDiurnaKwh: number; // Ex: R$ 0.72/kWh
  tarifaEnergiaNoturnaKwh: number;// Ex: R$ 0.19/kWh (Desconto de até 73% na Tarifa Rural Noturna 21h30 às 06h00)
}

export interface ResultadoBalancoHidrico {
  etcConsumoCulturaMmDia: number;
  cadCapacidadeAguaDisponivelMm: number;
  afdAguaFacilmenteDisponivelMm: number;
  deficienciaOuExcessoMm: number;
  necessitaIrrigacao: boolean;
  laminaLiquidaRecomendadaMm: number;
  laminaBrutaRecomendadaMm: number;
  horasOperacaoPivoNecessarias: number;
  volumeTotalAguaM3: number;
  custoEnergiaDiurnaReais: number;
  custoEnergiaNoturnaReais: number;
  economiaTarifaNoturnaReais: number;
  percentualEconomiaNoturnaPct: number;
}

export class IrrigacaoManejoHidricoService {
  /**
   * Converte potência em Cavalos-Vapor (CV) para Potência Elétrica em Kilowatts (kW)
   * 1 CV = 0.735499 kW
   */
  public static readonly FATOR_CV_PARA_KW = 0.735499;

  /**
   * Calcula o balanço hídrico diário de solo e recomendação de irrigação
   */
  public calcularBalancoHidrico(
    solo: ParametrosSoloHidrico,
    clima: ParametrosClimaIrrigacao,
    pivo: ParametrosPivoEquipamento
  ): ResultadoBalancoHidrico {
    // 1. Evapotranspiração da cultura ETc = ETo * Kc (FAO-56)
    const etcConsumoCulturaMmDia = Number((clima.etoReferenciaMmDia * clima.coeficienteCulturaKc).toFixed(2));

    // 2. Capacidade de Água Disponível no solo (CAD em mm)
    // CAD = ((CC - PMP) / 100) * densidadeSolo * profundidadeRaiz
    const cadCapacidadeAguaDisponivelMm = Number(
      (((solo.capacidadeCampoPct - solo.pontoMurchaPermanentePct) / 100) *
        solo.densidadeSoloGcm3 *
        solo.profundidadeRaizMm).toFixed(2)
    );

    // 3. Água Facilmente Disponível (AFD em mm)
    const afdAguaFacilmenteDisponivelMm = Number(
      (cadCapacidadeAguaDisponivelMm * solo.fatorDisponibilidadeP).toFixed(2)
    );

    // 4. Balanço hídrico líquido do dia: Chuva efetiva - Consumo ETc
    const balancoLiquidoMm = clima.precipitacaoEfetivaMmDia - etcConsumoCulturaMmDia;

    let laminaLiquidaRecomendadaMm = 0;
    let necessitaIrrigacao = false;

    // Se o balanço do dia for deficitário e a chuva não supriu a ETc
    if (balancoLiquidoMm < 0) {
      const deficitMm = Math.abs(balancoLiquidoMm);
      necessitaIrrigacao = true;
      laminaLiquidaRecomendadaMm = Number(deficitMm.toFixed(2));
    }

    // 5. Lâmina bruta considerando eficiência de aspersão do pivô
    const eficienciaDec = pivo.eficienciaAplicacaoPct / 100;
    const laminaBrutaRecomendadaMm = necessitaIrrigacao
      ? Number((laminaLiquidaRecomendadaMm / eficienciaDec).toFixed(2))
      : 0;

    // 6. Volume total de água necessário em m³
    // 1 mm de lâmina em 1 ha = 10 m³ de água
    const volumeTotalAguaM3 = Math.round(laminaBrutaRecomendadaMm * pivo.areaIrrigadaHectares * 10);

    // 7. Horas de funcionamento necessárias do pivô para aplicar a lâmina bruta
    const horasOperacaoPivoNecessarias = necessitaIrrigacao && pivo.vazaoTotalM3Hora > 0
      ? Number((volumeTotalAguaM3 / pivo.vazaoTotalM3Hora).toFixed(1))
      : 0;

    // 8. Análise de Custo Energético (Bandeira Tarifária Verde/Azul Rural)
    const potenciaKwh = pivo.potenciaTotalCv * IrrigacaoManejoHidricoService.FATOR_CV_PARA_KW;
    const consumoTotalKwh = potenciaKwh * horasOperacaoPivoNecessarias;

    const custoEnergiaDiurnaReais = Number((consumoTotalKwh * pivo.tarifaEnergiaDiurnaKwh).toFixed(2));
    const custoEnergiaNoturnaReais = Number((consumoTotalKwh * pivo.tarifaEnergiaNoturnaKwh).toFixed(2));
    const economiaTarifaNoturnaReais = Number((custoEnergiaDiurnaReais - custoEnergiaNoturnaReais).toFixed(2));

    const percentualEconomiaNoturnaPct = custoEnergiaDiurnaReais > 0
      ? Number(((economiaTarifaNoturnaReais / custoEnergiaDiurnaReais) * 100).toFixed(1))
      : 0;

    return {
      etcConsumoCulturaMmDia,
      cadCapacidadeAguaDisponivelMm,
      afdAguaFacilmenteDisponivelMm,
      deficienciaOuExcessoMm: Number(balancoLiquidoMm.toFixed(2)),
      necessitaIrrigacao,
      laminaLiquidaRecomendadaMm,
      laminaBrutaRecomendadaMm,
      horasOperacaoPivoNecessarias,
      volumeTotalAguaM3,
      custoEnergiaDiurnaReais,
      custoEnergiaNoturnaReais,
      economiaTarifaNoturnaReais,
      percentualEconomiaNoturnaPct
    };
  }
}
