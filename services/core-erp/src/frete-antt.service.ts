/**
 * AGROTECH ENTERPRISE v9.5 - CORE ERP
 * Frete Rodoviário Agrícola & Piso Mínimo ANTT
 * Conformidade com a Lei 13.703/2018 (Política Nacional de Pisos Mínimos do Transporte Rodoviário de Cargas)
 */

export type TipoVeiculoCarga =
  | 'TOCO_2_EIXOS'
  | 'TRUCK_3_EIXOS'
  | 'CAVALO_TOCO_SEMIREBOQUE_4_EIXOS'
  | 'CAVALO_TRUCADO_SEMIREBOQUE_5_EIXOS'
  | 'BITREM_7_EIXOS'
  | 'RODOTREM_9_EIXOS';

export interface ParametrosCalculoFrete {
  tipoVeiculo: TipoVeiculoCarga;
  distanciaKm: number;
  pesoCargaToneladas: number;
  valorPedagioTotal: number;
  tipoCarga: 'GRANEL_SOLIDO' | 'FRIGORIFICADA' | 'NEOS_GERAL';
  retornoVazio?: boolean;
}

export interface ResultadoFreteANTT {
  tipoVeiculo: TipoVeiculoCarga;
  quantidadeEixos: number;
  distanciaKm: number;
  pesoCargaToneladas: number;
  capacidadeMaximaLiquidaToneladas: number;
  tarifaCustoDeslocamentoKm: number;
  tarifaCustoCargaDescarga: number;
  custoTransporteBruto: number;
  valorPedagioObrigatorio: number;
  adicionalRetornoVazio: number;
  valorTotalMinimoFrete: number;
  custoPorTonelada: number;
  custoPorSaca60kg: number;
  emConformidadePisoANTT: boolean;
}

export class FreteRodoviarioANTTService {
  /**
   * Tabela referencial de coeficientes da ANTT (Resolução em vigor para Granel Sólido)
   * CCD: Coeficiente de Custo de Deslocamento (R$/km)
   * CC:  Coeficiente de Custo de Carga e Descarga (R$)
   */
  private static readonly TABELA_EIXOS: Record<
    TipoVeiculoCarga,
    { eixos: number; ccdKm: number; ccFixo: number; capacidadeLiquidaTon: number }
  > = {
    TOCO_2_EIXOS: { eixos: 2, ccdKm: 3.42, ccFixo: 280.0, capacidadeLiquidaTon: 8.5 },
    TRUCK_3_EIXOS: { eixos: 3, ccdKm: 4.56, ccFixo: 360.0, capacidadeLiquidaTon: 14.0 },
    CAVALO_TOCO_SEMIREBOQUE_4_EIXOS: { eixos: 4, ccdKm: 5.68, ccFixo: 440.0, capacidadeLiquidaTon: 22.0 },
    CAVALO_TRUCADO_SEMIREBOQUE_5_EIXOS: { eixos: 5, ccdKm: 6.72, ccFixo: 520.0, capacidadeLiquidaTon: 27.0 },
    BITREM_7_EIXOS: { eixos: 7, ccdKm: 8.94, ccFixo: 680.0, capacidadeLiquidaTon: 38.0 },
    RODOTREM_9_EIXOS: { eixos: 9, ccdKm: 10.45, ccFixo: 820.0, capacidadeLiquidaTon: 49.5 }
  };

  /**
   * Calcula o Piso Mínimo de Frete oficial segundo as regras vigentes da ANTT
   */
  public calcularPisoMinimoFrete(params: ParametrosCalculoFrete): ResultadoFreteANTT {
    const config = FreteRodoviarioANTTService.TABELA_EIXOS[params.tipoVeiculo];
    if (!config) {
      throw new Error(`Tipo de veículo '${params.tipoVeiculo}' não cadastrado na tabela ANTT.`);
    }

    if (params.distanciaKm <= 0) {
      throw new Error('Distância em quilômetros deve ser maior que zero.');
    }

    // 1. Custo de deslocamento = Distância * Coeficiente de deslocamento
    const custoDeslocamento = params.distanciaKm * config.ccdKm;

    // 2. Custo fixo de carga e descarga
    const custoCargaDescarga = config.ccFixo;

    // 3. Subtotal base de transporte
    let custoTransporteBruto = custoDeslocamento + custoCargaDescarga;

    // 4. Adicional de retorno vazio (caso não haja frete de retorno contratado, +20%)
    let adicionalRetornoVazio = 0;
    if (params.retornoVazio) {
      adicionalRetornoVazio = custoDeslocamento * 0.20;
    }

    // 5. Total = Base + Adicional + Pedágio (Lei 10.209/2001: pedágio é obrigatório e pago antecipadamente pelo embarcador)
    const valorTotalMinimoFrete = Number(
      (custoTransporteBruto + adicionalRetornoVazio + params.valorPedagioTotal).toFixed(2)
    );

    // 6. Custo unitário por tonelada e por saca de 60 kg
    const pesoEfetivoTon = Math.max(0.1, params.pesoCargaToneladas);
    const custoPorTonelada = Number((valorTotalMinimoFrete / pesoEfetivoTon).toFixed(2));
    const sacasTransportadas = (pesoEfetivoTon * 1000) / 60;
    const custoPorSaca60kg = Number((valorTotalMinimoFrete / sacasTransportadas).toFixed(2));

    return {
      tipoVeiculo: params.tipoVeiculo,
      quantidadeEixos: config.eixos,
      distanciaKm: params.distanciaKm,
      pesoCargaToneladas: params.pesoCargaToneladas,
      capacidadeMaximaLiquidaToneladas: config.capacidadeLiquidaTon,
      tarifaCustoDeslocamentoKm: config.ccdKm,
      tarifaCustoCargaDescarga: config.ccFixo,
      custoTransporteBruto: Number(custoTransporteBruto.toFixed(2)),
      valorPedagioObrigatorio: params.valorPedagioTotal,
      adicionalRetornoVazio: Number(adicionalRetornoVazio.toFixed(2)),
      valorTotalMinimoFrete,
      custoPorTonelada,
      custoPorSaca60kg,
      emConformidadePisoANTT: true
    };
  }

  /**
   * Valida se uma tarifa proposta pelo operador ou transportadora respeita o piso da ANTT
   */
  public validarTarifaProposta(
    params: ParametrosCalculoFrete,
    valorPropostoReais: number
  ): { aprovado: boolean; diferencaParaPisoMinimo: number; mensagem: string } {
    const piso = this.calcularPisoMinimoFrete(params);
    const diferenca = Number((valorPropostoReais - piso.valorTotalMinimoFrete).toFixed(2));

    if (valorPropostoReais < piso.valorTotalMinimoFrete) {
      return {
        aprovado: false,
        diferencaParaPisoMinimo: diferenca,
        mensagem: `Tarifa abaixo do piso mínimo legal da ANTT em R$ ${Math.abs(diferenca).toFixed(2)}. Risco de multa e autuação fiscal na balança da rodovia.`
      };
    }

    return {
      aprovado: true,
      diferencaParaPisoMinimo: diferenca,
      mensagem: `Tarifa aprovada! Em total conformidade com a Lei 13.703/2018 (margem acima do piso: R$ ${diferenca.toFixed(2)}).`
    };
  }
}
