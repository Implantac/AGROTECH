/**
 * AGROTECH ENTERPRISE v9.5 - CORE ERP
 * Barter & Cédula de Produto Rural (CPR) Valuation Service
 * Conformidade com a Lei 13.986/2020 (Nova Lei do Agro) e Registro na B3 / CERC
 */

export interface BarterInputPackage {
  id: string;
  descricao: string;
  valorTotalReais: number;
}

export interface ParidadeExportacaoParams {
  precoCbotUsdPorBushel: number; // Ex: 11.83 USD/bu
  taxaCambioPtaxBacen: number;   // Ex: 5.4150 R$/USD
  premioFobUsdPorBushel: number; // Ex: +0.45 USD/bu (Paranaguá / Santos)
  custoFreteInteriorPorSaca: number; // Ex: R$ 14.50/sc (Mato Grosso -> Santos)
  despesasElevacaoPortuariaPorSaca: number; // Ex: R$ 3.20/sc (Terminais)
  impostosTaxasPorSaca: number; // Ex: R$ 0.85/sc
}

export interface BarterContractParams {
  numeroContrato: string;
  compradorOuTrading: string;
  pacoteInsumos: BarterInputPackage;
  precoTravadoSaca: number; // R$/saca acordado no Barter
  margemSegurancaPct?: number; // Ex: 10% adicional de garantia
  areaPenhorHectares: number;
  produtividadeEsperadaSacasHa: number;
}

export interface BarterValuationResult {
  numeroContrato: string;
  valorTotalInsumos: number;
  precoTravadoSaca: number;
  sacasComprometidas: number;
  sacasComMargemGarantia: number;
  volumeTotalKg: number;
  percentualSafraComprometido: number;
  volumeProducaoTotalEsperadoSacas: number;
  saldoSacasDisponivelParaMercado: number;
  statusRiscoBarter: 'SEGURO' | 'MODERADO' | 'ALAVANCADO_CRITICO';
}

export class BarterCPRValuationService {
  /**
   * Converte cotação CBOT (USD/bushel) em R$/saca (60kg) na Paridade FOB Porto
   * Fator padrão de conversão internacional: 1 bushel de soja = 27,2155 kg.
   * Logo, 1 saca de 60 kg = 60 / 27.2155 = 2.20462 bushels.
   */
  public static readonly FATOR_BUSHEL_PARA_SACA_60KG = 2.20462262;

  /**
   * Calcula a Paridade de Exportação Líquida na Fazenda (Farm Gate Price)
   */
  public calcularParidadeExportacao(params: ParidadeExportacaoParams) {
    const {
      precoCbotUsdPorBushel,
      taxaCambioPtaxBacen,
      premioFobUsdPorBushel,
      custoFreteInteriorPorSaca,
      despesasElevacaoPortuariaPorSaca,
      impostosTaxasPorSaca
    } = params;

    // Preço FOB Porto em USD/bu
    const precoFobUsdPorBushel = precoCbotUsdPorBushel + premioFobUsdPorBushel;

    // Preço FOB Porto em USD por tonelada (1 t = 36.7437 bu)
    const precoFobUsdPorTonelada = Number((precoFobUsdPorBushel * 36.7437).toFixed(2));

    // Preço FOB Porto em R$ por saca de 60 kg
    const precoFobReaisPorSaca = Number(
      (precoFobUsdPorBushel * BarterCPRValuationService.FATOR_BUSHEL_PARA_SACA_60KG * taxaCambioPtaxBacen).toFixed(2)
    );

    // Preço Líquido na Fazenda descontando frete e custos de elevação portuária
    const paridadeFazendaLiquidaPorSaca = Number(
      (precoFobReaisPorSaca - custoFreteInteriorPorSaca - despesasElevacaoPortuariaPorSaca - impostosTaxasPorSaca).toFixed(2)
    );

    return {
      precoFobUsdPorBushel,
      precoFobUsdPorTonelada,
      precoFobReaisPorSaca,
      paridadeFazendaLiquidaPorSaca,
      custoLogisticaTotalPorSaca: Number((custoFreteInteriorPorSaca + despesasElevacaoPortuariaPorSaca + impostosTaxasPorSaca).toFixed(2))
    };
  }

  /**
   * Avalia a operação de Barter, volume de sacas exigidas e índice de comprometimento da safra
   */
  public avaliarContratoBarter(params: BarterContractParams): BarterValuationResult {
    const {
      numeroContrato,
      pacoteInsumos,
      precoTravadoSaca,
      margemSegurancaPct = 10,
      areaPenhorHectares,
      produtividadeEsperadaSacasHa
    } = params;

    if (precoTravadoSaca <= 0) {
      throw new Error('Preço travado por saca deve ser maior que zero.');
    }

    // Quantidade base de sacas para quitar o pacote de insumos
    const sacasComprometidas = Number((pacoteInsumos.valorTotalReais / precoTravadoSaca).toFixed(1));

    // Sacas com margem de segurança de penhor agrícola (ex: +10% exigido pela trading para hedge de quebra)
    const sacasComMargemGarantia = Number((sacasComprometidas * (1 + margemSegurancaPct / 100)).toFixed(1));

    // Volume total em kg
    const volumeTotalKg = Math.round(sacasComprometidas * 60);

    // Produção total esperada na área vinculada
    const volumeProducaoTotalEsperadoSacas = Math.round(areaPenhorHectares * produtividadeEsperadaSacasHa);

    // Percentual da produção da área comprometida
    const percentualSafraComprometido = Number(
      ((sacasComprometidas / (volumeProducaoTotalEsperadoSacas || 1)) * 100).toFixed(1)
    );

    // Saldo livre para comercialização spot ou futuros adicionais
    const saldoSacasDisponivelParaMercado = Math.max(0, volumeProducaoTotalEsperadoSacas - sacasComprometidas);

    // Status de risco agronômico/financeiro
    let statusRiscoBarter: 'SEGURO' | 'MODERADO' | 'ALAVANCADO_CRITICO' = 'SEGURO';
    if (percentualSafraComprometido > 50) {
      statusRiscoBarter = 'ALAVANCADO_CRITICO';
    } else if (percentualSafraComprometido > 35) {
      statusRiscoBarter = 'MODERADO';
    }

    return {
      numeroContrato,
      valorTotalInsumos: pacoteInsumos.valorTotalReais,
      precoTravadoSaca,
      sacasComprometidas,
      sacasComMargemGarantia,
      volumeTotalKg,
      percentualSafraComprometido,
      volumeProducaoTotalEsperadoSacas,
      saldoSacasDisponivelParaMercado,
      statusRiscoBarter
    };
  }

  /**
   * Gera a estrutura de metadados para registro de CPR Física/Financeira na B3 ou CERC
   */
  public gerarPayloadRegistroCPR(
    params: BarterContractParams,
    dadosPropriedade: { carNumero: string; matriculaCRI: string; comarca: string }
  ) {
    const valuation = this.avaliarContratoBarter(params);

    return {
      tipoTitulo: 'CPR_FISICA_COM_PENHOR',
      numeroIdentificador: `CPR-${params.numeroContrato}`,
      emissorResponsavel: 'PRODUTOR_RURAL',
      credorBeneficiario: params.compradorOuTrading,
      dataEmissao: new Date().toISOString().split('T')[0],
      objetoNegociacao: {
        commodity: 'SOJA_EM_GRAO_PADRAO_EXPORTACAO',
        quantidadeSacas60kg: valuation.sacasComprometidas,
        pesoLiquidoQuilos: valuation.volumeTotalKg,
        safra: '2026/2027',
        garantiaPenhor: {
          areaVinculadaHectares: params.areaPenhorHectares,
          carNumero: dadosPropriedade.carNumero,
          matriculaCRI: dadosPropriedade.matriculaCRI,
          comarca: dadosPropriedade.comarca
        }
      },
      liquidacao: {
        tipoLiquidacao: 'ENTREGA_FISICA_ARMAZEM',
        prazoLimiteEntrega: '2027-04-30',
        valorTotalEquivalenteReais: valuation.valorTotalInsumos
      },
      normativaRegulatoria: 'LEI_13986_2020_B3_REGISTRADA'
    };
  }
}
