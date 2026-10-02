/**
 * SUPER AGTECH v2.0 - SERVIÇO DE CUSTEIO BASEADO EM ATIVIDADES (ABC)
 * Calcula o custo total real da lavoura: Insumos + Horas-Máquina + Mão-de-Obra.
 */

export interface ItemCaldaInsumo {
  insumoId: string;
  nomeInsumo: string;
  categoria: 'DEFENSIVO' | 'FERTILIZANTE' | 'ADJUVANTE' | 'SEMENTE';
  dosePorHectare: number; // L/ha ou kg/ha
  custoMedioUnitario: number; // R$/L ou R$/kg
}

export interface CalculoOperacaoABCInput {
  talhaoId: string;
  areaTalhaoHectares: number;
  horasTrabalhadas: number; // ou horimetro_final - horimetro_inicial
  custoHoraMaquina: number; // Depreciação + Manutenção + Diesel/h
  taxaHoraOperador: number; // Salário base + Encargos / horas úteis
  itensCalda: ItemCaldaInsumo[];
  precoPrevistoSacaVenda: number; // R$ por saca de 60kg (ex: R$ 130,00 soja)
}

export interface ResultadoCustoABC {
  custoTotalInsumos: number;
  custoTotalMaquina: number;
  custoTotalMaoDeObra: number;
  custoTotalOperacao: number;
  custoPorHectare: number;
  breakEvenSacasPorHectare: number; // Sacas necessárias para pagar o custo
  detalhamentoItens: Array<{
    nomeInsumo: string;
    quantidadeTotal: number;
    custoTotal: number;
    participacaoPercentual: number;
  }>;
}

export class CusteioABCService {
  /**
   * Calcula o impacto econômico exato da operação no talhão
   */
  public calcularCustoOperacao(input: CalculoOperacaoABCInput): ResultadoCustoABC {
    // 1. Custo de Insumos da Calda / Aplicação
    let custoTotalInsumos = 0;
    const detalhamentoItens = input.itensCalda.map((item) => {
      const quantidadeTotal = item.dosePorHectare * input.areaTalhaoHectares;
      const custoTotalItem = quantidadeTotal * item.custoMedioUnitario;
      custoTotalInsumos += custoTotalItem;
      return {
        nomeInsumo: item.nomeInsumo,
        quantidadeTotal: Number(quantidadeTotal.toFixed(2)),
        custoTotal: Number(custoTotalItem.toFixed(2)),
        participacaoPercentual: 0, // calculado abaixo
      };
    });

    // Calcula percentual de cada insumo no custo da calda
    detalhamentoItens.forEach((item) => {
      item.participacaoPercentual =
        custoTotalInsumos > 0
          ? Number(((item.custoTotal / custoTotalInsumos) * 100).toFixed(1))
          : 0;
    });

    // 2. Custo da Frota Agrícola (Horímetro x Custo/hora)
    const custoTotalMaquina = input.horasTrabalhadas * input.custoHoraMaquina;

    // 3. Custo da Mão de Obra do Operador
    const custoTotalMaoDeObra = input.horasTrabalhadas * input.taxaHoraOperador;

    // 4. Custo Total da Operação
    const custoTotalOperacao =
      custoTotalInsumos + custoTotalMaquina + custoTotalMaoDeObra;

    const custoPorHectare =
      input.areaTalhaoHectares > 0
        ? custoTotalOperacao / input.areaTalhaoHectares
        : 0;

    // 5. Ponto de Equilíbrio (Break-Even em sacas/ha)
    const breakEvenSacasPorHectare =
      input.precoPrevistoSacaVenda > 0
        ? custoPorHectare / input.precoPrevistoSacaVenda
        : 0;

    return {
      custoTotalInsumos: Number(custoTotalInsumos.toFixed(2)),
      custoTotalMaquina: Number(custoTotalMaquina.toFixed(2)),
      custoTotalMaoDeObra: Number(custoTotalMaoDeObra.toFixed(2)),
      custoTotalOperacao: Number(custoTotalOperacao.toFixed(2)),
      custoPorHectare: Number(custoPorHectare.toFixed(2)),
      breakEvenSacasPorHectare: Number(breakEvenSacasPorHectare.toFixed(2)),
      detalhamentoItens,
    };
  }
}
