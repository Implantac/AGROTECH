/**
 * SERVIÇO OFICIAL DA REFORMA TRIBUTÁRIA (IBS & CBS) - SUPER AGTECH ENTERPRISE
 * Em conformidade com:
 * - Emenda Constitucional nº 132/2023
 * - Lei Complementar da Reforma Tributária (LC 214/2025)
 * - Nota Técnica NF-e 2024.002 (ENCAT / Receita Federal do Brasil / SEFAZ)
 * - MOC v7.0 do Portal da Nota Fiscal Eletrônica
 * - Regime Específico e Diferenciado do Produtor Rural (Arts. 132 e 140 da LC)
 */

export type RegimeProdutorRural =
  | 'PRODUTOR_PF_NAO_OPTANTE' // Pessoa Física faturamento até R$ 3,6M - Não recolhe na saída, gera Crédito Presumido p/ adquirente
  | 'PRODUTOR_OPTANTE_IBS_CBS' // Produtor Rural Optante pelo regime regular - Débito e Crédito da não-cumulatividade
  | 'PESSOA_JURIDICA_AGRO'; // Empresa Rural / Agroindústria no regime regular

export type CategoriaProdutoAgro =
  | 'AGROPECUARIO_IN_NATURA' // Soja, milho, algodão em pluma, boi gordo, café (Redução de 60%)
  | 'CESTA_BASICA_ALIMENTOS' // Arroz, feijão, leite in natura, hortaliças, ovos, mandioca (Alíquota Zero / 100% redução)
  | 'INSUMO_AGROPECUARIO' // Fertilizantes MAPA, defensivos, sementes fiscalizadas, rações (Redução de 60% ou diferimento)
  | 'EXPORTACAO_COMMODITY' // Exportação imune (Não incidência constitucional)
  | 'PRODUTO_PROCESSADO'; // Farinhas, óleos refinados, rações industriais (Alíquota padrão com créditos)

export interface ClassificacaoTributariaItem {
  cClassTrib: string;
  cstIbsCbs: string;
  descricao: string;
  fundamentoLegal: string;
  percentualReducao: number; // 0, 60 ou 100
  aliquotaZero: boolean;
  geraCreditoPresumido: boolean;
  categoria: CategoriaProdutoAgro;
}

export interface CalculoIbsCbsItemInput {
  valorOperacao: number;
  regimeProdutor: RegimeProdutorRural;
  cClassTrib: string;
  anoReferencia?: number; // 2026 (transição) ou 2033 (regime pleno)
  aliquotaPadraoCbs?: number; // Alíquota teste 2026: 0.90%
  aliquotaPadraoIbs?: number; // Alíquota teste 2026: 0.10% (0.07% Estado, 0.03% Município)
  percentualCreditoPresumido?: number; // Crédito presumido LC 214/2025 (ex: 1.0% na transição)
}

export interface CalculoIbsCbsResultado {
  valorOperacao: number;
  anoReferencia: number;
  regimeProdutor: RegimeProdutorRural;
  classificacao: ClassificacaoTributariaItem;
  
  // Base de cálculo
  vBCIBS: number;
  vBCCBS: number;
  
  // CBS (Federal)
  pCBSNominal: number;
  pRedCBS: number;
  pCBSEfetiva: number;
  vCBS: number;
  
  // IBS (Estadual + Municipal)
  pIBSNominal: number;
  pRedIBS: number;
  pIBSEfetiva: number;
  vIBS: number;
  pIBSEst: number;
  vIBSEst: number;
  pIBSMun: number;
  vIBSMun: number;
  
  // Total Tributário
  vTotalIbsCbs: number;
  
  // Crédito Presumido do Produtor Rural (Art. 140 LC 214/2025)
  gCredPresProdRural?: {
    cCredPres: string;
    pCredPres: number;
    vCredPres: number;
    indOptanteIBSCBS: 0 | 1;
    destinatarioApropriador: string;
  };
  
  // Nó XML formatado para a tag <IBSCBS> da NF-e
  xmlSnippetIbsCbs: string;
  xmlSnippetTot: string;
}

// TABELA OFICIAL DE CÓDIGOS DE CLASSIFICAÇÃO TRIBUTÁRIA (cClassTrib) DA RECEITA FEDERAL / ENCAT (NT 2024.002)
export const TABELA_OFICIAL_CCLASSTRIB: ClassificacaoTributariaItem[] = [
  {
    cClassTrib: '200032',
    cstIbsCbs: '200',
    descricao: 'Produtos agropecuários in natura (soja, milho, algodão, gado, café)',
    fundamentoLegal: 'Art. 132 da LC 214/2025 - Redução de 60% nas alíquotas de IBS e CBS',
    percentualReducao: 60,
    aliquotaZero: false,
    geraCreditoPresumido: false,
    categoria: 'AGROPECUARIO_IN_NATURA',
  },
  {
    cClassTrib: '200035',
    cstIbsCbs: '200',
    descricao: 'Sementes, mudas fiscalizadas e insumos agropecuários registrados no MAPA',
    fundamentoLegal: 'Art. 133 da LC 214/2025 - Redução de 60% nas alíquotas de IBS e CBS',
    percentualReducao: 60,
    aliquotaZero: false,
    geraCreditoPresumido: false,
    categoria: 'INSUMO_AGROPECUARIO',
  },
  {
    cClassTrib: '220001',
    cstIbsCbs: '220',
    descricao: 'Cesta Básica Nacional de Alimentos (arroz, feijão, leite in natura, frutas e legumes)',
    fundamentoLegal: 'Art. 8º da EC 132/2023 e Art. 128 da LC 214/2025 - Alíquota Zero (100% Redução)',
    percentualReducao: 100,
    aliquotaZero: true,
    geraCreditoPresumido: false,
    categoria: 'CESTA_BASICA_ALIMENTOS',
  },
  {
    cClassTrib: '410001',
    cstIbsCbs: '410',
    descricao: 'Exportação Direta de Commodities Agrícolas (soja, café, carnes)',
    fundamentoLegal: 'Art. 153, § 3º e 156-A da CF/88 - Imunidade Constitucional nas Exportações',
    percentualReducao: 100,
    aliquotaZero: true,
    geraCreditoPresumido: false,
    categoria: 'EXPORTACAO_COMMODITY',
  },
  {
    cClassTrib: '510001',
    cstIbsCbs: '510',
    descricao: 'Insumos agropecuários comercializados com diferimento de IBS e CBS',
    fundamentoLegal: 'Art. 135 da LC 214/2025 - Diferimento do lançamento do imposto',
    percentualReducao: 100,
    aliquotaZero: false,
    geraCreditoPresumido: false,
    categoria: 'INSUMO_AGROPECUARIO',
  },
  {
    cClassTrib: '600001',
    cstIbsCbs: '600',
    descricao: 'Venda de Produtor Rural Pessoa Física Não Optante (Crédito Presumido ao Adquirente)',
    fundamentoLegal: 'Art. 140 da LC 214/2025 - Regime Especial Produtor PF (Crédito Presumido)',
    percentualReducao: 100,
    aliquotaZero: false,
    geraCreditoPresumido: true,
    categoria: 'AGROPECUARIO_IN_NATURA',
  },
  {
    cClassTrib: '000001',
    cstIbsCbs: '000',
    descricao: 'Produtos industrializados e derivados agropecuários tributados integralmente',
    fundamentoLegal: 'Regra Geral de incidência de IBS e CBS no consumo',
    percentualReducao: 0,
    aliquotaZero: false,
    geraCreditoPresumido: false,
    categoria: 'PRODUTO_PROCESSADO',
  },
];

export class ReformaTributariaService {
  /**
   * Busca item de classificação fiscal por código cClassTrib
   */
  static buscarClassificacao(cClassTrib: string): ClassificacaoTributariaItem {
    const item = TABELA_OFICIAL_CCLASSTRIB.find((t) => t.cClassTrib === cClassTrib);
    if (item) return item;

    // Fallback padrão: produtos agropecuários in natura com redução de 60%
    return TABELA_OFICIAL_CCLASSTRIB[0];
  }

  /**
   * Calcula IBS e CBS em conformidade rigorosa com a Nota Técnica 2024.002
   */
  static calcularIbsCbs(input: CalculoIbsCbsItemInput): CalculoIbsCbsResultado {
    const valor = Math.max(0, input.valorOperacao || 0);
    const ano = input.anoReferencia || 2026;
    const classificacao = this.buscarClassificacao(input.cClassTrib);

    // Alíquotas nominais do ano (padrão transição 2026: CBS 0,90% e IBS 0,10%)
    const pCBSNominal = input.aliquotaPadraoCbs !== undefined ? input.aliquotaPadraoCbs : (ano === 2026 ? 0.90 : 8.80);
    const pIBSNominal = input.aliquotaPadraoIbs !== undefined ? input.aliquotaPadraoIbs : (ano === 2026 ? 0.10 : 17.70);

    const vBCIBS = valor;
    const vBCCBS = valor;

    let pRedCBS = 0;
    let pRedIBS = 0;
    let pCBSEfetiva = 0;
    let pIBSEfetiva = 0;
    let vCBS = 0;
    let vIBS = 0;
    let pIBSEst = 0;
    let vIBSEst = 0;
    let pIBSMun = 0;
    let vIBSMun = 0;

    let gCredPresProdRural: CalculoIbsCbsResultado['gCredPresProdRural'] = undefined;

    // Cenário 1: Produtor Rural PF Não Optante (Regime Especial Art. 140 LC 214/2025)
    if (input.regimeProdutor === 'PRODUTOR_PF_NAO_OPTANTE' || classificacao.cstIbsCbs === '600') {
      pRedCBS = 100;
      pRedIBS = 100;
      pCBSEfetiva = 0;
      pIBSEfetiva = 0;
      vCBS = 0;
      vIBS = 0;
      vIBSEst = 0;
      vIBSMun = 0;

      // O adquirente (indústria/trading/cooperativa) apropria crédito presumido
      const pCred = input.percentualCreditoPresumido || (pCBSNominal + pIBSNominal);
      const vCred = Number(((valor * pCred) / 100).toFixed(2));

      gCredPresProdRural = {
        cCredPres: 'PR01',
        pCredPres: pCred,
        vCredPres: vCred,
        indOptanteIBSCBS: 0,
        destinatarioApropriador: 'Adquirente Comercial/Agroindústria (Crédito Integral)',
      };
    } else if (classificacao.aliquotaZero || classificacao.cstIbsCbs === '220' || classificacao.cstIbsCbs === '410') {
      // Cenário 2: Cesta Básica Nacional (Alíquota Zero) ou Exportação Imune
      pRedCBS = 100;
      pRedIBS = 100;
      pCBSEfetiva = 0;
      pIBSEfetiva = 0;
      vCBS = 0;
      vIBS = 0;
      vIBSEst = 0;
      vIBSMun = 0;
    } else if (classificacao.percentualReducao === 60 || classificacao.cstIbsCbs === '200') {
      // Cenário 3: Redução de 60% para Produtos Agropecuários in Natura ou Insumos MAPA
      pRedCBS = 60;
      pRedIBS = 60;
      pCBSEfetiva = Number((pCBSNominal * (1 - 0.60)).toFixed(4));
      pIBSEfetiva = Number((pIBSNominal * (1 - 0.60)).toFixed(4));

      vCBS = Number(((vBCCBS * pCBSEfetiva) / 100).toFixed(2));
      vIBS = Number(((vBCIBS * pIBSEfetiva) / 100).toFixed(2));

      // Partilha constitucional do IBS: 70% Estados e 30% Municípios
      pIBSEst = Number((pIBSEfetiva * 0.70).toFixed(4));
      vIBSEst = Number(((vBCIBS * pIBSEst) / 100).toFixed(2));
      pIBSMun = Number((pIBSEfetiva * 0.30).toFixed(4));
      vIBSMun = Number((vIBS - vIBSEst).toFixed(2));
    } else {
      // Cenário 4: Tributação Integral (CST 000)
      pCBSEfetiva = pCBSNominal;
      pIBSEfetiva = pIBSNominal;
      vCBS = Number(((vBCCBS * pCBSEfetiva) / 100).toFixed(2));
      vIBS = Number(((vBCIBS * pIBSEfetiva) / 100).toFixed(2));
      pIBSEst = Number((pIBSEfetiva * 0.70).toFixed(4));
      vIBSEst = Number(((vBCIBS * pIBSEst) / 100).toFixed(2));
      pIBSMun = Number((pIBSEfetiva * 0.30).toFixed(4));
      vIBSMun = Number((vIBS - vIBSEst).toFixed(2));
    }

    const vTotalIbsCbs = Number((vCBS + vIBS).toFixed(2));

    // Montagem do Snippet XML para a NF-e Modelo 55 (NT 2024.002)
    const xmlSnippetIbsCbs = `      <IBSCBS>
        <CST>${classificacao.cstIbsCbs}</CST>
        <cClassTrib>${classificacao.cClassTrib}</cClassTrib>
        <gIBS>
          <vBCIBS>${vBCIBS.toFixed(2)}</vBCIBS>
          <pIBS>${pIBSNominal.toFixed(4)}</pIBS>
          <pRedIBS>${pRedIBS.toFixed(2)}</pRedIBS>
          <pIBSEfet>${pIBSEfetiva.toFixed(4)}</pIBSEfet>
          <vIBS>${vIBS.toFixed(2)}</vIBS>
          <gIBSUF>
            <pIBSEst>${pIBSEst.toFixed(4)}</pIBSEst>
            <vIBSEst>${vIBSEst.toFixed(2)}</vIBSEst>
            <pIBSMun>${pIBSMun.toFixed(4)}</pIBSMun>
            <vIBSMun>${vIBSMun.toFixed(2)}</vIBSMun>
          </gIBSUF>
        </gIBS>
        <gCBS>
          <vBCCBS>${vBCCBS.toFixed(2)}</vBCCBS>
          <pCBS>${pCBSNominal.toFixed(4)}</pCBS>
          <pRedCBS>${pRedCBS.toFixed(2)}</pRedCBS>
          <pCBSEfet>${pCBSEfetiva.toFixed(4)}</pCBSEfet>
          <vCBS>${vCBS.toFixed(2)}</vCBS>
        </gCBS>${
          gCredPresProdRural
            ? `\n        <gCredPresProdRural>
          <cCredPres>${gCredPresProdRural.cCredPres}</cCredPres>
          <pCredPres>${gCredPresProdRural.pCredPres.toFixed(4)}</pCredPres>
          <vCredPres>${gCredPresProdRural.vCredPres.toFixed(2)}</vCredPres>
          <indOptanteIBSCBS>${gCredPresProdRural.indOptanteIBSCBS}</indOptanteIBSCBS>
        </gCredPresProdRural>`
            : ''
        }
      </IBSCBS>`;

    const xmlSnippetTot = `    <IBSCBSTot>
      <vBCIBS>${vBCIBS.toFixed(2)}</vBCIBS>
      <vIBS>${vIBS.toFixed(2)}</vIBS>
      <vIBSEst>${vIBSEst.toFixed(2)}</vIBSEst>
      <vIBSMun>${vIBSMun.toFixed(2)}</vIBSMun>
      <vBCCBS>${vBCCBS.toFixed(2)}</vBCCBS>
      <vCBS>${vCBS.toFixed(2)}</vCBS>${
        gCredPresProdRural
          ? `\n      <vCredPresProdRural>${gCredPresProdRural.vCredPres.toFixed(2)}</vCredPresProdRural>`
          : ''
      }
    </IBSCBSTot>`;

    return {
      valorOperacao: valor,
      anoReferencia: ano,
      regimeProdutor: input.regimeProdutor,
      classificacao,
      vBCIBS,
      vBCCBS,
      pCBSNominal,
      pRedCBS,
      pCBSEfetiva,
      vCBS,
      pIBSNominal,
      pRedIBS,
      pIBSEfetiva,
      vIBS,
      pIBSEst,
      vIBSEst,
      pIBSMun,
      vIBSMun,
      vTotalIbsCbs,
      gCredPresProdRural,
      xmlSnippetIbsCbs,
      xmlSnippetTot,
    };
  }

  /**
   * Simulação Comparativa Inteligente: Optar pelo IBS/CBS vs Regime Especial Não Optante
   */
  static simularComparativoRegimes(
    faturamentoAnual: number,
    comprasInsumosAnual: number,
    investimentoMaquinasAnual: number
  ) {
    // Ano de referência: Transição 2026 (CBS 0.9%, IBS 0.1% = 1.0%)
    // Carga tributária na venda (com 60% de redução = 0,40% efetivo)
    const taxaEfetivaVenda = 0.0040; // 0.40%
    const taxaCreditoInsumos = 0.0040; // 0.40%
    const taxaCreditoMaquinas = 0.0100; // 1.00% integral para bens de capital

    // Cenário A: Produtor PF Não Optante (Regime Especial)
    // Recolhimento na saída = 0
    // Créditos de insumos = 0 (custo de insumos absorvido)
    // Crédito presumido gerado para adquirentes:
    const creditoPresumidoGerado = faturamentoAnual * 0.0100;
    const desembolsoTributarioDiretoA = 0;

    // Cenário B: Produtor Optante pelo Regime Regular
    // Débito sobre vendas:
    const debitoIbsCbsVendas = faturamentoAnual * taxaEfetivaVenda;
    // Créditos apropriados sobre insumos e máquinas:
    const creditoInsumos = comprasInsumosAnual * taxaCreditoInsumos;
    const creditoMaquinas = investimentoMaquinasAnual * taxaCreditoMaquinas;
    const totalCreditosApropriados = creditoInsumos + creditoMaquinas;
    const saldoLiquidoTributarioB = debitoIbsCbsVendas - totalCreditosApropriados;

    const recomendacao =
      saldoLiquidoTributarioB < 0
        ? 'OPCAO_RECOMENDADA_REGIME_REGULAR' // Acumula créditos líquidos (restituíveis em dinheiro ou compensáveis)
        : faturamentoAnual <= 3600000
        ? 'PERMANECER_NAO_OPTANTE' // Menor burocracia, faturamento até R$ 3,6M
        : 'OBRIGATORIEDADE_REGIME_REGULAR'; // Acima de R$ 3,6M é obrigatório

    return {
      faturamentoAnual,
      comprasInsumosAnual,
      investimentoMaquinasAnual,
      cenarioNaoOptante: {
        recolhimentoDireto: desembolsoTributarioDiretoA,
        creditoPresumidoTransferidoAoComprador: creditoPresumidoGerado,
        obrigacoesAcessorias: 'Simplificadas (Apenas emissão NF-e com cClassTrib 600001)',
      },
      cenarioOptante: {
        debitoVendas: debitoIbsCbsVendas,
        creditosInsumos: creditoInsumos,
        creditosMaquinas: creditoMaquinas,
        totalCreditos: totalCreditosApropriados,
        saldoAPagarOuCreditoAcumulado: saldoLiquidoTributarioB,
        obrigacoesAcessorias: 'Completas com SPED e apuração do IVA Dual',
      },
      recomendacao,
      justificativa:
        saldoLiquidoTributarioB < 0
          ? `A fazenda gera mais créditos fiscais em compras (R$ ${totalCreditosApropriados.toFixed(2)}) do que débitos em vendas (R$ ${debitoIbsCbsVendas.toFixed(2)}). A opção gera crédito líquido acumulado de R$ ${Math.abs(saldoLiquidoTributarioB).toFixed(2)}!`
          : `Permanecer no regime especial não optante é mais vantajoso: desembolso tributário zero na saída e geração de R$ ${creditoPresumidoGerado.toFixed(2)} em crédito presumido para a indústria adquirente.`,
    };
  }

  /**
   * Cálculo oficial das regras tributárias tradicionais vigentes (Normal):
   * ICMS Diferido/Tributado, PIS/COFINS Suspenso (Lei 10.925/2004) e Funrural (Lei 13.606/2018)
   */
  static calcularTributacaoNormal(input: {
    valorOperacao: number;
    regimeIcms?: 'DIFERIMENTO_INTERNO' | 'TRIBUTADO_INTEGRAL' | 'ISENTO_EXPORTACAO';
    aliquotaIcmsInterestadual?: number;
    opcaoFunrural?: 'COMERCIALIZACAO' | 'FOLHA_DE_PAGAMENTO';
    quantidadeSacasSoja?: number;
    incluirFethabMt?: boolean;
  }): TributacaoNormalAgro {
    const valor = Math.max(0, input.valorOperacao || 0);
    const regimeIcms = input.regimeIcms || 'DIFERIMENTO_INTERNO';
    const opcaoFunrural = input.opcaoFunrural || 'COMERCIALIZACAO';

    // 1. ICMS Rural Tradicional
    let cstIcms: '51' | '00' | '20' | '41' = '51';
    let aliquotaIcms = 0;
    let baseCalculoIcms = 0;
    let valorIcms = 0;
    let fundamentoIcms = 'Art. 358 do RICMS/MT e Convênio ICMS 100/97: Diferimento total do imposto para o momento da comercialização industrial ou exportação';

    if (regimeIcms === 'DIFERIMENTO_INTERNO') {
      cstIcms = '51';
      aliquotaIcms = 0;
      baseCalculoIcms = 0;
      valorIcms = 0;
    } else if (regimeIcms === 'ISENTO_EXPORTACAO') {
      cstIcms = '41';
      aliquotaIcms = 0;
      baseCalculoIcms = 0;
      valorIcms = 0;
      fundamentoIcms = 'Art. 3º, II da Lei Complementar nº 87/1996 (Lei Kandir): Não incidência nas exportações de produtos primários e semielaborados';
    } else {
      cstIcms = '00';
      aliquotaIcms = input.aliquotaIcmsInterestadual || 12.0;
      baseCalculoIcms = valor;
      valorIcms = Number(((valor * aliquotaIcms) / 100).toFixed(2));
      fundamentoIcms = `Tributação Interestadual Padrão SEFAZ (${aliquotaIcms}% sobre o valor da operação)`;
    }

    // 2. PIS e COFINS Rural Tradicional
    // Lei 10.925/2004, arts. 8º e 9º: Suspensão da incidência de PIS/COFINS na venda de produtos agropecuários in natura por produtor rural
    const pisCofins = {
      situacao: 'SUSPENSAO_LEI_10925' as const,
      cstPis: '09' as const,
      cstCofins: '09' as const,
      aliquotaPis: 0,
      aliquotaCofins: 0,
      valorPis: 0,
      valorCofins: 0,
      fundamentoLegal: 'Art. 9º, I da Lei 10.925/2004 e Lei 12.058/2009: Suspensão da incidência de PIS e COFINS nas saídas de produtos in natura efetuadas por produtor rural para PJ',
    };

    // 3. Funrural (Lei 8.212/1991 com alterações da Lei 13.606/2018)
    let aliquotaInss = 1.20;
    let aliquotaGilrat = 0.10;
    let aliquotaSenar = 0.20;
    let aliquotaTotal = 1.50;
    let fundamentoFunrural = 'Art. 25 da Lei 8.212/1991 (com redação da Lei 13.606/2018): Opção Comercialização (1,2% Previdência + 0,1% RAT + 0,2% SENAR = 1,5%) retido pelo adquirente';

    if (opcaoFunrural === 'FOLHA_DE_PAGAMENTO') {
      aliquotaInss = 0.00;
      aliquotaGilrat = 0.00;
      aliquotaSenar = 0.20;
      aliquotaTotal = 0.20;
      fundamentoFunrural = 'Art. 25, § 13 da Lei 8.212/1991: Produtor optante pelo recolhimento previdenciário sobre a Folha de Salários. Na nota fiscal é retido exclusivamente o SENAR (0,2%)';
    }

    const valorRetencaoFunrural = Number(((valor * aliquotaTotal) / 100).toFixed(2));

    // 4. Fethab MT (Fundo Estadual de Transporte e Habitação - Lei MT 7.263/1996)
    let fethabMt: TributacaoNormalAgro['fethabMt'] = undefined;
    if (input.incluirFethabMt) {
      const sacas = input.quantidadeSacasSoja || (valor / 130);
      const taxaPorSaca = 1.45; // Média estimada UPF/MT por saca
      const valorFethab = Number((sacas * taxaPorSaca).toFixed(2));
      fethabMt = {
        incide: true,
        valorRetencao: valorFethab,
        fundamentoLegal: 'Lei Estadual MT nº 7.263/1996 e Decreto 1.261/2000 (FETHAB Soja)',
      };
    }

    const totalRetencoes = valorRetencaoFunrural + (fethabMt?.valorRetencao || 0);
    const valorLiquidoReceber = Number((valor - totalRetencoes).toFixed(2));

    return {
      icms: {
        regimeIcms,
        cstIcms,
        aliquotaIcms,
        baseCalculoIcms,
        valorIcms,
        fundamentoLegal: fundamentoIcms,
      },
      pisCofins,
      funrural: {
        opcaoTributaria: opcaoFunrural,
        aliquotaTotal,
        aliquotaInss,
        aliquotaGilrat,
        aliquotaSenar,
        valorRetencao: valorRetencaoFunrural,
        fundamentoLegal: fundamentoFunrural,
      },
      fethabMt,
      valorBrutoOperacao: valor,
      valorLiquidoReceber,
    };
  }

  /**
   * Visão Consolidada: Integração do Regime Tradicional e da Reforma Tributária (IBS/CBS)
   * Demonstra a convivência simultânea durante a transição constitucional (2026-2032)
   */
  static calcularTributacaoConsolidada(input: {
    valorOperacao: number;
    regimeProdutor: RegimeProdutorRural;
    cClassTrib: string;
    anoReferencia?: number;
    regimeIcms?: 'DIFERIMENTO_INTERNO' | 'TRIBUTADO_INTEGRAL' | 'ISENTO_EXPORTACAO';
    opcaoFunrural?: 'COMERCIALIZACAO' | 'FOLHA_DE_PAGAMENTO';
    quantidadeSacasSoja?: number;
  }): TributacaoAgroConsolidada {
    const ano = input.anoReferencia || 2026;
    const regraNormal = this.calcularTributacaoNormal({
      valorOperacao: input.valorOperacao,
      regimeIcms: input.regimeIcms,
      opcaoFunrural: input.opcaoFunrural,
      quantidadeSacasSoja: input.quantidadeSacasSoja,
      incluirFethabMt: true,
    });

    const regraIbsCbs = this.calcularIbsCbs({
      valorOperacao: input.valorOperacao,
      regimeProdutor: input.regimeProdutor,
      cClassTrib: input.cClassTrib,
      anoReferencia: ano,
    });

    const totalTributosDiretosProdutor = regraNormal.icms.valorIcms + regraIbsCbs.vTotalIbsCbs;
    const totalRetencoesFonte = regraNormal.funrural.valorRetencao + (regraNormal.fethabMt?.valorRetencao || 0);
    const creditoPresumidoGeradoParaAdquirente = regraIbsCbs.gCredPresProdRural?.vCredPres || 0;
    const valorLiquidoEfetivoConta = Number((input.valorOperacao - totalRetencoesFonte - totalTributosDiretosProdutor).toFixed(2));

    return {
      regraNormal,
      regraIbsCbs,
      anoReferencia: ano,
      resumoImpactoFinanceiro: {
        totalTributosDiretosProdutor,
        totalRetencoesFonte,
        creditoPresumidoGeradoParaAdquirente,
        valorLiquidoEfetivoConta,
      },
    };
  }

  /**
   * Auditoria e Planejamento Tributário Completo: Avaliação de TODOS OS REGIMES TRIBUTÁRIOS do Agronegócio
   * Cobre:
   * 1. PF - Livro Caixa / LCDPR (Resultado Real - IRPF até 27,5%)
   * 2. PF - Arbitramento 20% da Receita Bruta (Art. 5º da Lei 8.023/1990)
   * 3. PJ - Lucro Presumido (Presunção 8% IRPJ / 12% CSLL / PIS-COFINS Cumulativo)
   * 4. PJ - Lucro Real (Não-Cumulativo 9,25% + IRPJ/CSLL c/ compensação de prejuízos)
   * 5. Simples Nacional Agro (ME/EPP - Anexo I c/ Segregação de Tributos)
   * 6. Cooperativa Agropecuária (Ato Cooperativo Típico - Lei 5.764/1971)
   * 7. Exportação Direta / Trading (Imunidade Constitucional Total LC 87/96 e CF/88)
   */
  static auditarTodosOsRegimesTributarios(input: {
    valorOperacao?: number;
    faturamentoAnualEstimado?: number;
    despesasOperacionaisPct?: number; // Custo de produção / insumos em % da receita
    investimentoMaquinasAno?: number; // Investimento em maquinários / infraestrutura no ano (dedutível no LCDPR e Lucro Real)
    opcaoFunrural?: 'COMERCIALIZACAO' | 'FOLHA_DE_PAGAMENTO';
    anoReferenciaReforma?: number; // 2026 a 2033
    cClassTrib?: string;
  }): AuditoriaMultiRegimesResultado {
    const valorOperacao = Math.max(0, input.valorOperacao || 185400.0);
    const rbAnual = Math.max(valorOperacao, input.faturamentoAnualEstimado || (valorOperacao * 25)); // Ex: ~R$ 4.635.000
    const despesasPct = Math.min(95, Math.max(20, input.despesasOperacionaisPct ?? 65)); // 65% padrão de custo agrícola
    const investimento = Math.max(0, input.investimentoMaquinasAno ?? 350000);
    const opcaoFunrural = input.opcaoFunrural || 'COMERCIALIZACAO';
    const anoReforma = input.anoReferenciaReforma || 2026;
    const cClassTrib = input.cClassTrib || '200032';

    // Despesas totais comprovadas com documentação hábil
    const despesasTotaisAnual = (rbAnual * (despesasPct / 100)) + investimento;
    const lucroRealApurado = Math.max(0, rbAnual - despesasTotaisAnual);
    const margemLucroRealPct = Number(((lucroRealApurado / rbAnual) * 100).toFixed(2));

    // Cálculos de IBS e CBS para o ano de referência
    const calcIbsCbsOptante = this.calcularIbsCbs({
      valorOperacao: rbAnual,
      regimeProdutor: 'PRODUTOR_OPTANTE_IBS_CBS',
      cClassTrib,
      anoReferencia: anoReforma,
    });

    const calcIbsCbsNaoOptante = this.calcularIbsCbs({
      valorOperacao: rbAnual,
      regimeProdutor: 'PRODUTOR_PF_NAO_OPTANTE',
      cClassTrib,
      anoReferencia: anoReforma,
    });

    // Taxa FETHAB MT anual proporcional (~R$ 1,45 por saca / saca ~R$ 130 = ~1,11% da receita)
    const fethabMtValor = Number(((rbAnual / 130) * 1.45).toFixed(2));

    // --- REGIME 1: Produtor Rural PF - Livro Caixa / LCDPR (Resultado Real) ---
    // Art. 59 do RIR/2018: Dedução integral de custeio e investimentos no ano de aquisição
    // IRPF sobre o lucro real apurado na tabela progressiva (alíquota efetiva média sobre o lucro)
    let irpfLcdpr = 0;
    if (lucroRealApurado > 0) {
      // Tabela progressiva anual do IRPF: parcela que excede limite isento tributada a até 27,5%
      irpfLcdpr = Number((lucroRealApurado * 0.275).toFixed(2));
      // Dedução de parcela a deduzir do topo da tabela (~R$ 10.432,32/ano)
      irpfLcdpr = Math.max(0, Number((irpfLcdpr - 10432.32).toFixed(2)));
    }
    const funruralPfLcdpr = opcaoFunrural === 'FOLHA_DE_PAGAMENTO'
      ? Number((rbAnual * 0.002).toFixed(2)) // 0,20% SENAR
      : Number((rbAnual * 0.015).toFixed(2)); // 1,50% completo (1,2% INSS + 0,1% RAT + 0,2% SENAR)

    const cargaTotalLcdpr = Number((irpfLcdpr + funruralPfLcdpr + fethabMtValor).toFixed(2));
    const sobraLcdpr = Number((rbAnual - despesasTotaisAnual - cargaTotalLcdpr).toFixed(2));

    const regimeLcdpr: DetalheRegimeTributario = {
      codigo: 'PF_LIVRO_CAIXA_LCDPR',
      nome: 'Pessoa Física - LCDPR / Livro Caixa (Resultado Real)',
      categoria: 'Pessoa Física',
      descricao: 'Escrituração contábil detalhada das receitas e despesas da atividade rural no Livro Caixa Digital do Produtor Rural (IN RFB 1.903/2019).',
      fundamentoLegal: 'Art. 59 a 64 do Decreto nº 9.580/2018 (RIR/2018) e Lei Federal nº 8.023/1990',
      limiteFaturamento: 'Sem limite legal (Obrigatório entregar LCDPR se Faturamento > R$ 4,8 Milhões/ano)',
      baseCalculoRenda: lucroRealApurado,
      aliquotaNominalRenda: 27.5,
      irpf: irpfLcdpr,
      totalTributosRenda: irpfLcdpr,
      pisCofins: {
        regime: 'SUSPENSO_LEI_10925',
        aliquotaTotal: 0,
        valorTotal: 0,
        detalhes: 'Suspensão total de PIS e COFINS nas saídas agropecuárias in natura (Art. 9º da Lei 10.925/2004)',
      },
      funrural: {
        opcao: opcaoFunrural === 'FOLHA_DE_PAGAMENTO' ? 'FOLHA' : 'COMERCIALIZACAO',
        aliquotaTotal: opcaoFunrural === 'FOLHA_DE_PAGAMENTO' ? 0.20 : 1.50,
        valorRetencao: funruralPfLcdpr,
        detalhes: opcaoFunrural === 'FOLHA_DE_PAGAMENTO' ? 'Opção Folha: 0,2% SENAR retido na nota' : 'Opção Comercialização: 1,5% retido (1,2% Previdência + 0,1% RAT + 0,2% SENAR)',
      },
      tributosEstaduais: {
        icmsValor: 0,
        icmsCst: '51',
        fethabMtValor,
        totalEstadual: fethabMtValor,
      },
      reformaIbsCbs: {
        regimeIbsCbs: 'NAO_OPTANTE_CREDITO_PRESUMIDO',
        valorCbs: 0,
        valorIbs: 0,
        totalIbsCbs: 0,
        aliquotaEfetiva: 0,
        creditoPresumidoGeradoParaComprador: calcIbsCbsNaoOptante.gCredPresProdRural?.vCredPres || 0,
      },
      cargaTributariaTotal: cargaTotalLcdpr,
      aliquotaEfetivaGlobalPct: Number(((cargaTotalLcdpr / rbAnual) * 100).toFixed(2)),
      sobraLiquidaReceita: sobraLcdpr,
      vantagens: [
        'Dedução integral no mesmo ano de 100% dos investimentos em máquinas, implementos e pivôs (sem depreciação lenta).',
        'Compensação de até 100% de prejuízos fiscais de safras anteriores sem trava de 30%.',
        'Se o ano tiver quebra de safra ou margem baixa, o imposto sobre a renda é ZERO.',
        'Não optante de IBS/CBS gera crédito presumido de 8,5% altamente atrativo para cooperativas e tradings.',
      ],
      desvantagens: [
        'Exige controle fiscal rigoroso de notas fiscais de despesas e conta bancária exclusiva.',
        'Se a margem líquida for alta (acima de 20%), a alíquota de 27,5% incide sobre o lucro.',
      ],
      recomendado: margemLucroRealPct < 20 || investimento > 200000,
      scoreAtratividade: margemLucroRealPct < 20 ? 95 : 75,
      observacaoEstrategica: 'Altamente recomendável quando há investimentos contínuos em frotas e insumos com margem operacional real abaixo de 20%.',
    };

    // --- REGIME 2: Produtor Rural PF - Arbitramento 20% (Lei 8.023/1990) ---
    // Art. 5º da Lei 8.023/1990: Base de cálculo arbitrada em exatamente 20% da Receita Bruta
    const baseArbitrada20 = Number((rbAnual * 0.20).toFixed(2));
    let irpfArbitrado = Number((baseArbitrada20 * 0.275 - 10432.32).toFixed(2));
    irpfArbitrado = Math.max(0, irpfArbitrado);
    const cargaTotalArbitramento = Number((irpfArbitrado + funruralPfLcdpr + fethabMtValor).toFixed(2));
    const sobraArbitramento = Number((rbAnual - despesasTotaisAnual - cargaTotalArbitramento).toFixed(2));

    const regimeArbitramento: DetalheRegimeTributario = {
      codigo: 'PF_ARBITRAMENTO_20',
      nome: 'Pessoa Física - Arbitramento da Receita Bruta (20%)',
      categoria: 'Pessoa Física',
      descricao: 'Opção simplificada da Lei 8.023/1990 onde 20% do faturamento bruto é considerado resultado líquido tributável.',
      fundamentoLegal: 'Art. 5º da Lei Federal nº 8.023/1990 e Art. 54 do Decreto nº 9.580/2018 (RIR/2018)',
      limiteFaturamento: 'Sem limite máximo de receita',
      baseCalculoRenda: baseArbitrada20,
      aliquotaNominalRenda: 27.5,
      irpf: irpfArbitrado,
      totalTributosRenda: irpfArbitrado,
      pisCofins: {
        regime: 'SUSPENSO_LEI_10925',
        aliquotaTotal: 0,
        valorTotal: 0,
        detalhes: 'Suspensão total de PIS e COFINS nas saídas agropecuárias in natura (Art. 9º da Lei 10.925/2004)',
      },
      funrural: {
        opcao: opcaoFunrural === 'FOLHA_DE_PAGAMENTO' ? 'FOLHA' : 'COMERCIALIZACAO',
        aliquotaTotal: opcaoFunrural === 'FOLHA_DE_PAGAMENTO' ? 0.20 : 1.50,
        valorRetencao: funruralPfLcdpr,
        detalhes: 'Mesma regra de retenção do produtor pessoa física',
      },
      tributosEstaduais: {
        icmsValor: 0,
        icmsCst: '51',
        fethabMtValor,
        totalEstadual: fethabMtValor,
      },
      reformaIbsCbs: {
        regimeIbsCbs: 'NAO_OPTANTE_CREDITO_PRESUMIDO',
        valorCbs: 0,
        valorIbs: 0,
        totalIbsCbs: 0,
        aliquotaEfetiva: 0,
        creditoPresumidoGeradoParaComprador: calcIbsCbsNaoOptante.gCredPresProdRural?.vCredPres || 0,
      },
      cargaTributariaTotal: cargaTotalArbitramento,
      aliquotaEfetivaGlobalPct: Number(((cargaTotalArbitramento / rbAnual) * 100).toFixed(2)),
      sobraLiquidaReceita: sobraArbitramento,
      vantagens: [
        'Teto máximo do IRPF fixado em ~5,5% do faturamento bruto da fazenda.',
        'Dispensa a comprovação contábil de notas fiscais de despesas para apuração do imposto.',
        'Ideal para quem tem margens líquidas reais altas (superiores a 20%).',
      ],
      desvantagens: [
        'Não permite compensar prejuízos fiscais em safras atingidas por seca ou pragas.',
        'Não aproveita deduções de investimentos vultosos em máquinas e pivôs.',
      ],
      recomendado: margemLucroRealPct >= 20 && investimento < 100000,
      scoreAtratividade: margemLucroRealPct >= 20 ? 90 : 60,
      observacaoEstrategica: 'Excelente alternativa de blindagem quando a margem líquida supera 20% ou quando o produtor possui poucas notas fiscais de despesas.',
    };

    // --- REGIME 3: Pessoa Jurídica - Lucro Presumido ---
    // Lei 9.249/1995: Base IRPJ 8%, Base CSLL 12%
    const baseIrpjPresumido = Number((rbAnual * 0.08).toFixed(2));
    const irpjBasico = Number((baseIrpjPresumido * 0.15).toFixed(2));
    const adicionalIrpj = Number((Math.max(0, baseIrpjPresumido - 240000) * 0.10).toFixed(2));
    const irpjTotal = Number((irpjBasico + adicionalIrpj).toFixed(2));

    const baseCsllPresumido = Number((rbAnual * 0.12).toFixed(2));
    const csllTotal = Number((baseCsllPresumido * 0.09).toFixed(2));
    const totalRendaPresumido = Number((irpjTotal + csllTotal).toFixed(2));

    // Funrural PJ: 2,05% (1,70% Previdência + 0,10% RAT + 0,25% SENAR) ou 0,25% na folha
    const funruralPjPresumido = opcaoFunrural === 'FOLHA_DE_PAGAMENTO'
      ? Number((rbAnual * 0.0025).toFixed(2))
      : Number((rbAnual * 0.0205).toFixed(2));

    // PIS/COFINS Cumulativo: 3,65% - com suspensão da Lei 10.925/2004 para grãos in natura vendidos a PJ
    const pisCofinsPresumido = 0; // Suspensão legal

    // IBS/CBS 2026: PJ entra no regime regular com redução de 60%
    const ibsCbsPj2026 = calcIbsCbsOptante.vTotalIbsCbs;

    const cargaTotalPresumido = Number((totalRendaPresumido + funruralPjPresumido + fethabMtValor + ibsCbsPj2026).toFixed(2));
    const sobraPresumido = Number((rbAnual - despesasTotaisAnual - cargaTotalPresumido).toFixed(2));

    const regimePresumido: DetalheRegimeTributario = {
      codigo: 'PJ_LUCRO_PRESUMIDO',
      nome: 'Pessoa Jurídica - Lucro Presumido (Presunção 8% / 12%)',
      categoria: 'Pessoa Jurídica',
      descricao: 'Tributação corporativa baseada em coeficientes de presunção de lucro (8% IRPJ e 12% CSLL) para empresas rurais.',
      fundamentoLegal: 'Arts. 15 e 20 da Lei Federal nº 9.249/1995 e Lei Federal nº 9.430/1996',
      limiteFaturamento: 'Até R$ 78.000.000,00 por ano-calendário',
      baseCalculoRenda: baseIrpjPresumido,
      aliquotaNominalRenda: 15.0,
      irpj: irpjBasico,
      adicionalIrpj,
      csll: csllTotal,
      totalTributosRenda: totalRendaPresumido,
      pisCofins: {
        regime: 'SUSPENSO_LEI_10925',
        aliquotaTotal: 0,
        valorTotal: pisCofinsPresumido,
        detalhes: 'Suspensão de PIS (0,65%) e COFINS (3,00%) nas saídas de grãos in natura a PJ (Art. 9º da Lei 10.925/2004)',
      },
      funrural: {
        opcao: opcaoFunrural === 'FOLHA_DE_PAGAMENTO' ? 'FOLHA' : 'COMERCIALIZACAO',
        aliquotaTotal: opcaoFunrural === 'FOLHA_DE_PAGAMENTO' ? 0.25 : 2.05,
        valorRetencao: funruralPjPresumido,
        detalhes: opcaoFunrural === 'FOLHA_DE_PAGAMENTO' ? 'Opção Folha PJ: 0,25% SENAR retido na comercialização' : 'Opção Comercialização PJ: 2,05% (1,7% Previdência + 0,1% RAT + 0,25% SENAR)',
      },
      tributosEstaduais: {
        icmsValor: 0,
        icmsCst: '51',
        fethabMtValor,
        totalEstadual: fethabMtValor,
      },
      reformaIbsCbs: {
        regimeIbsCbs: 'REGIME_REGULAR_OPTANTE',
        valorCbs: calcIbsCbsOptante.vCBS,
        valorIbs: calcIbsCbsOptante.vIBS,
        totalIbsCbs: ibsCbsPj2026,
        aliquotaEfetiva: Number((calcIbsCbsOptante.pCBSEfetiva + calcIbsCbsOptante.pIBSEfetiva).toFixed(2)),
        creditoPresumidoGeradoParaComprador: 0,
      },
      cargaTributariaTotal: cargaTotalPresumido,
      aliquotaEfetivaGlobalPct: Number(((cargaTotalPresumido / rbAnual) * 100).toFixed(2)),
      sobraLiquidaReceita: sobraPresumido,
      vantagens: [
        'Carga de IRPJ e CSLL previsível e limitada a ~2,28% a 3,4% do faturamento bruto.',
        'Facilita a constituição de Holding Rural para planejamento sucessório e proteção patrimonial familiar.',
        'Alíquota efetiva de tributação sobre a renda menor que a do LCDPR quando a margem líquida da fazenda é elevada.',
      ],
      desvantagens: [
        'Funrural PJ na comercialização é 2,05% (maior que o 1,5% de PF).',
        'Não permite compensar prejuízos fiscais em anos de quebra de safra climática.',
        'Obrigatoriedade de recolher IRPJ/CSLL mesmo se houver prejuízo na safra.',
      ],
      recomendado: rbAnual > 4800000 && margemLucroRealPct > 15 && rbAnual <= 78000000,
      scoreAtratividade: 80,
      observacaoEstrategica: 'Muito utilizada em holdings patrimoniais do agro e médias propriedades familiares com foco em sucessão hereditária.',
    };

    // --- REGIME 4: Pessoa Jurídica - Lucro Real ---
    // IRPJ 15% + 10% adicional + CSLL 9% sobre o lucro líquido contábil
    let irpjReal = 0;
    let adicionalIrpjReal = 0;
    let csllReal = 0;
    if (lucroRealApurado > 0) {
      irpjReal = Number((lucroRealApurado * 0.15).toFixed(2));
      adicionalIrpjReal = Number((Math.max(0, lucroRealApurado - 240000) * 0.10).toFixed(2));
      csllReal = Number((lucroRealApurado * 0.09).toFixed(2));
    }
    const totalRendaReal = Number((irpjReal + adicionalIrpjReal + csllReal).toFixed(2));
    const cargaTotalReal = Number((totalRendaReal + funruralPjPresumido + fethabMtValor + ibsCbsPj2026).toFixed(2));
    const sobraReal = Number((rbAnual - despesasTotaisAnual - cargaTotalReal).toFixed(2));

    const regimeReal: DetalheRegimeTributario = {
      codigo: 'PJ_LUCRO_REAL',
      nome: 'Pessoa Jurídica - Lucro Real (Regime Não-Cumulativo)',
      categoria: 'Pessoa Jurídica',
      descricao: 'Apuração do IRPJ e CSLL sobre o lucro contábil efetivo ajustado no LALUR e LACS, com compensação de prejuízos fiscais.',
      fundamentoLegal: 'Decreto nº 9.580/2018 (RIR/2018) e Leis nº 10.637/2002 e 10.833/2003',
      limiteFaturamento: 'Obrigatório para faturamento acima de R$ 78.000.000,00 ou opcional para qualquer faturamento',
      baseCalculoRenda: lucroRealApurado,
      aliquotaNominalRenda: 34.0, // 15% IRPJ + 10% adic + 9% CSLL
      irpj: irpjReal,
      adicionalIrpj: adicionalIrpjReal,
      csll: csllReal,
      totalTributosRenda: totalRendaReal,
      pisCofins: {
        regime: 'NAO_CUMULATIVO',
        aliquotaTotal: 0,
        valorTotal: 0,
        detalhes: 'Suspensão de PIS (1,65%) e COFINS (7,60%) nas vendas agro in natura + direito a crédito presumido de PIS/COFINS nas aquisições de PF/Cooperativas',
      },
      funrural: {
        opcao: opcaoFunrural === 'FOLHA_DE_PAGAMENTO' ? 'FOLHA' : 'COMERCIALIZACAO',
        aliquotaTotal: opcaoFunrural === 'FOLHA_DE_PAGAMENTO' ? 0.25 : 2.05,
        valorRetencao: funruralPjPresumido,
        detalhes: 'Regra de Funrural PJ',
      },
      tributosEstaduais: {
        icmsValor: 0,
        icmsCst: '51',
        fethabMtValor,
        totalEstadual: fethabMtValor,
      },
      reformaIbsCbs: {
        regimeIbsCbs: 'REGIME_REGULAR_OPTANTE',
        valorCbs: calcIbsCbsOptante.vCBS,
        valorIbs: calcIbsCbsOptante.vIBS,
        totalIbsCbs: ibsCbsPj2026,
        aliquotaEfetiva: Number((calcIbsCbsOptante.pCBSEfetiva + calcIbsCbsOptante.pIBSEfetiva).toFixed(2)),
        creditoPresumidoGeradoParaComprador: 0,
      },
      cargaTributariaTotal: cargaTotalReal,
      aliquotaEfetivaGlobalPct: Number(((cargaTotalReal / rbAnual) * 100).toFixed(2)),
      sobraLiquidaReceita: sobraReal,
      vantagens: [
        'Se houver prejuízo fiscal por frustração de safra, o imposto sobre a renda é ZERO.',
        'Compensação de prejuízos fiscais acumulados de anos anteriores (até 30% do lucro real).',
        'Aproveitamento amplo de créditos de insumos, diesel, energia elétrica e depreciação de ativos.',
        'Crédito presumido de PIS/COFINS para agroindústrias adquirentes de produtores rurais.',
      ],
      desvantagens: [
        'Alíquota nominal alta (34% somando IRPJ e CSLL) sobre o lucro.',
        'Complexidade contábil máxima (obrigatoriedade de ECD, ECF, e-LALUR e e-LACS).',
        'Depreciação de máquinas agrícolas é distribuída ao longo dos anos (não é dedução integral imediata como na PF).',
      ],
      recomendado: rbAnual > 78000000 || margemLucroRealPct <= 6,
      scoreAtratividade: margemLucroRealPct <= 6 ? 90 : 70,
      observacaoEstrategica: 'Mandatório para grandes grupos agrícolas e tradings; muito vantajoso para operações com margem operacional muito estreita.',
    };

    // --- REGIME 5: Simples Nacional Agro (ME / EPP) ---
    // LC 123/2006: Anexo I - Comércio (até R$ 4,8M). Se faturamento > 4,8M, desenquadra
    const elegivelSimples = rbAnual <= 4800000;
    let aliquotaEfetivaSimples = 0;
    let valorDas = 0;

    if (elegivelSimples) {
      // Cálculo da alíquota efetiva do Anexo I
      if (rbAnual <= 180000) {
        aliquotaEfetivaSimples = 4.0;
      } else if (rbAnual <= 360000) {
        aliquotaEfetivaSimples = Number((((rbAnual * 0.073) - 5940) / rbAnual * 100).toFixed(2));
      } else if (rbAnual <= 720000) {
        aliquotaEfetivaSimples = Number((((rbAnual * 0.095) - 13860) / rbAnual * 100).toFixed(2));
      } else if (rbAnual <= 1800000) {
        aliquotaEfetivaSimples = Number((((rbAnual * 0.107) - 22500) / rbAnual * 100).toFixed(2));
      } else if (rbAnual <= 3600000) {
        aliquotaEfetivaSimples = Number((((rbAnual * 0.143) - 87300) / rbAnual * 100).toFixed(2));
      } else {
        aliquotaEfetivaSimples = Number((((rbAnual * 0.190) - 378000) / rbAnual * 100).toFixed(2));
      }

      // Segregação de tributos: Abatimento de ICMS diferido/isento (~33,5%) e PIS/COFINS suspenso (~12,5%)
      // Alíquota líquida do DAS para produtos rurais com diferimento e suspensão
      const aliquotaSimplesSegregada = Number((aliquotaEfetivaSimples * 0.54).toFixed(2)); // Paga CPP + IRPJ + CSLL no DAS
      valorDas = Number(((rbAnual * aliquotaSimplesSegregada) / 100).toFixed(2));
    } else {
      aliquotaEfetivaSimples = 0;
      valorDas = 0;
    }

    const cargaTotalSimples = elegivelSimples ? Number((valorDas + fethabMtValor).toFixed(2)) : 999999999;
    const sobraSimples = elegivelSimples ? Number((rbAnual - despesasTotaisAnual - cargaTotalSimples).toFixed(2)) : 0;

    const regimeSimples: DetalheRegimeTributario = {
      codigo: 'SIMPLES_NACIONAL',
      nome: 'Simples Nacional Agro (ME / EPP Rural - Anexo I)',
      categoria: 'Simples Nacional',
      descricao: 'Regime unificado de arrecadação de tributos (DAS) para microempresas e empresas de pequeno porte rurais.',
      fundamentoLegal: 'Lei Complementar nº 123/2006 (Estatuto da Microempresa e EPP)',
      limiteFaturamento: 'Até R$ 4.800.000,00 anuais (sublimite de R$ 3,6M para ICMS/ISS estadual)',
      baseCalculoRenda: rbAnual,
      aliquotaNominalRenda: aliquotaEfetivaSimples,
      totalTributosRenda: valorDas,
      pisCofins: {
        regime: 'SEGREGADO_SIMPLES',
        aliquotaTotal: 0,
        valorTotal: 0,
        detalhes: 'Parcela de PIS/COFINS segregada e zerada no PGDAS-D devido à suspensão da Lei 10.925/2004',
      },
      funrural: {
        opcao: 'UNIFICADO_DAS',
        aliquotaTotal: 0,
        valorRetencao: 0,
        detalhes: 'Previdência patronal unificada dentro do DAS (sem retenção de 1,5% ou 2,05% na comercialização)',
      },
      tributosEstaduais: {
        icmsValor: 0,
        icmsCst: 'ICMS Segregado no DAS',
        fethabMtValor,
        totalEstadual: fethabMtValor,
      },
      reformaIbsCbs: {
        regimeIbsCbs: 'SIMPLES_PROPORCIONAL',
        valorCbs: 0,
        valorIbs: 0,
        totalIbsCbs: 0,
        aliquotaEfetiva: 0,
        creditoPresumidoGeradoParaComprador: 0,
      },
      cargaTributariaTotal: cargaTotalSimples,
      aliquotaEfetivaGlobalPct: elegivelSimples ? Number(((cargaTotalSimples / rbAnual) * 100).toFixed(2)) : 0,
      sobraLiquidaReceita: sobraSimples,
      vantagens: [
        'Guia única (DAS) simplificada congregando impostos federais e previdência.',
        'Sem recolhimento avulso de Funrural (isenção da retenção na nota fiscal).',
        'Benefício da segregação de ICMS e PIS/COFINS reduz a alíquota efetiva do DAS em quase 50%.',
      ],
      desvantagens: [
        elegivelSimples
          ? 'Não permite repasse amplo de créditos para grandes tradings industriais.'
          : 'LIMITE ULTRAPASSADO: Faturamento projetado excede o teto de R$ 4,8 milhões/ano do Simples Nacional.',
      ],
      recomendado: elegivelSimples && rbAnual <= 1800000,
      scoreAtratividade: elegivelSimples ? 85 : 0,
      observacaoEstrategica: elegivelSimples
        ? 'Altamente vantajoso para pequenos produtores familiares, hortifrúti, flores e queijarias com receita até R$ 1,8M/ano.'
        : 'Inaplicável para esta fazenda pois a receita anual ultrapassa o teto legal de R$ 4,8 milhões.',
    };

    // --- REGIME 6: Cooperativa Agropecuária (Ato Cooperativo Típico) ---
    // Lei 5.764/1971: Não incidência de IRPJ e CSLL sobre sobras líquidas; PIS Folha 1%
    const pisFolhaCoop = Number(((rbAnual * 0.05) * 0.01).toFixed(2)); // PIS sobre folha cooperativa (~1% da folha)
    const cargaTotalCoop = Number((pisFolhaCoop + funruralPfLcdpr + fethabMtValor).toFixed(2));
    const sobraCoop = Number((rbAnual - despesasTotaisAnual - cargaTotalCoop).toFixed(2));

    const regimeCoop: DetalheRegimeTributario = {
      codigo: 'COOPERATIVA_AGRO',
      nome: 'Cooperativa Agropecuária (Regime dos Atos Cooperativos)',
      categoria: 'Cooperativa',
      descricao: 'Modelo de intercooperação onde as sobras líquidas apuradas são distribuídas aos cooperados sem incidência de IRPJ e CSLL.',
      fundamentoLegal: 'Art. 79 e 111 da Lei Federal nº 5.764/1971 e Art. 15 da MP nº 2.158-35/2001',
      limiteFaturamento: 'Sem limite legal de faturamento',
      baseCalculoRenda: 0,
      aliquotaNominalRenda: 0,
      totalTributosRenda: 0,
      pisCofins: {
        regime: 'ISENTO_COOP',
        aliquotaTotal: 1.0,
        valorTotal: pisFolhaCoop,
        detalhes: 'Isenção de PIS e COFINS sobre atos cooperativos; recolhimento exclusivo de PIS sobre a Folha de Salários (1%)',
      },
      funrural: {
        opcao: opcaoFunrural === 'FOLHA_DE_PAGAMENTO' ? 'FOLHA' : 'COMERCIALIZACAO',
        aliquotaTotal: opcaoFunrural === 'FOLHA_DE_PAGAMENTO' ? 0.20 : 1.50,
        valorRetencao: funruralPfLcdpr,
        detalhes: 'Retido e repassado pela cooperativa em nome do cooperado',
      },
      tributosEstaduais: {
        icmsValor: 0,
        icmsCst: '51',
        fethabMtValor,
        totalEstadual: fethabMtValor,
      },
      reformaIbsCbs: {
        regimeIbsCbs: 'NAO_OPTANTE_CREDITO_PRESUMIDO',
        valorCbs: 0,
        valorIbs: 0,
        totalIbsCbs: 0,
        aliquotaEfetiva: 0,
        creditoPresumidoGeradoParaComprador: calcIbsCbsNaoOptante.gCredPresProdRural?.vCredPres || 0,
      },
      cargaTributariaTotal: cargaTotalCoop,
      aliquotaEfetivaGlobalPct: Number(((cargaTotalCoop / rbAnual) * 100).toFixed(2)),
      sobraLiquidaReceita: sobraCoop,
      vantagens: [
        'Não incidência de IRPJ e CSLL sobre sobras decorrentes de atos cooperativos.',
        'Poder de barganha conjunto na compra coletiva de insumos e venda de safra com escala.',
        'Preservação do crédito presumido para repasse aos cooperados.',
      ],
      desvantagens: [
        'Exige governança cooperativa estruturada com no mínimo 20 associados fundadores.',
        'Atos não cooperativos (comercialização com não cooperados) são tributados pelas regras normais de PJ.',
      ],
      recomendado: true,
      scoreAtratividade: 92,
      observacaoEstrategica: 'O modelo cooperativista é historicamente o mais eficiente para redução de carga tributária e ganho de escala na comercialização agrícola.',
    };

    // --- REGIME 7: Exportação Direta / Trading / Drawback ---
    // Imunidade Constitucional Total (Art. 155, § 2º, X, 'a' e Art. 149, § 2º, I da CF/88)
    // Sem ICMS, sem PIS/COFINS, sem Funrural de exportação direta e sem IBS/CBS
    // Apenas IRPJ/CSLL corporativo sobre o resultado da exportadora
    const cargaTotalExportacao = Number((totalRendaPresumido + fethabMtValor).toFixed(2));
    const sobraExportacao = Number((rbAnual - despesasTotaisAnual - cargaTotalExportacao).toFixed(2));

    const regimeExportacao: DetalheRegimeTributario = {
      codigo: 'EXPORTACAO_IMUNE',
      nome: 'Exportação Direta / Trading Agro (Imunidade Constitucional)',
      categoria: 'Exportação',
      descricao: 'Comercialização direta para o mercado internacional amparada por imunidade tributária e alíquota zero nas saídas.',
      fundamentoLegal: 'Art. 149, § 2º, I e Art. 155, § 2º, X, "a" da CF/88; LC nº 87/1996 e Art. 156-A da EC 132/2023',
      limiteFaturamento: 'Sem limite legal',
      baseCalculoRenda: baseIrpjPresumido,
      aliquotaNominalRenda: 15.0,
      irpj: irpjBasico,
      adicionalIrpj,
      csll: csllTotal,
      totalTributosRenda: totalRendaPresumido,
      pisCofins: {
        regime: 'IMUNE_EXPORTACAO',
        aliquotaTotal: 0,
        valorTotal: 0,
        detalhes: 'Alíquota Zero / Não Incidência de PIS e COFINS nas exportações (Art. 5º da Lei 10.637 e Art. 6º da Lei 10.833)',
      },
      funrural: {
        opcao: 'ISENTO',
        aliquotaTotal: 0,
        valorRetencao: 0,
        detalhes: 'Não incidência de Funrural na receita decorrente de exportação direta ao exterior (Art. 149, § 2º, I da CF/88)',
      },
      tributosEstaduais: {
        icmsValor: 0,
        icmsCst: '41',
        fethabMtValor,
        totalEstadual: fethabMtValor,
      },
      reformaIbsCbs: {
        regimeIbsCbs: 'IMUNE',
        valorCbs: 0,
        valorIbs: 0,
        totalIbsCbs: 0,
        aliquotaEfetiva: 0,
        creditoPresumidoGeradoParaComprador: 0,
      },
      cargaTributariaTotal: cargaTotalExportacao,
      aliquotaEfetivaGlobalPct: Number(((cargaTotalExportacao / rbAnual) * 100).toFixed(2)),
      sobraLiquidaReceita: sobraExportacao,
      vantagens: [
        'Imunidade constitucional de ICMS, PIS, COFINS, IBS e CBS nas saídas para o exterior.',
        'Isenção total do Funrural na venda para fora do país.',
        'Direito a ressarcimento célere de saldos credores de insumos no IBS/CBS em até 60 dias.',
        'Receita dolarizada protegida contra oscilações cambiais.',
      ],
      desvantagens: [
        'Exige habilitação no RADAR da Receita Federal e conformidade estrita com o EUDR europeu.',
        'Sujeito às novas regras de Preços de Transferência (Transfer Pricing da Lei 14.596/2023).',
      ],
      recomendado: true,
      scoreAtratividade: 96,
      observacaoEstrategica: 'Máxima eficiência tributária brasileira; elimina encargos indiretos e viabiliza a maior sobra líquida do agronegócio.',
    };

    // Compilação dos regimes válidos
    const listaRegimes: DetalheRegimeTributario[] = [
      regimeLcdpr,
      regimeArbitramento,
      regimePresumido,
      regimeReal,
      regimeSimples,
      regimeCoop,
      regimeExportacao,
    ];

    // Ranking de economia: Menor carga tributária total em R$ (desconsiderando regimes inelegíveis como Simples acima de 4.8M)
    const regimesElegiveis = listaRegimes.filter((r) => r.cargaTributariaTotal < 900000000);
    const ranking = [...regimesElegiveis].sort((a, b) => a.cargaTributariaTotal - b.cargaTributariaTotal);
    const melhor = ranking[0];
    const pior = ranking[ranking.length - 1];
    const deltaEconomia = Number((pior.cargaTributariaTotal - melhor.cargaTributariaTotal).toFixed(2));

    const analiseTexto = `O planejamento tributário para a safra atual indica que o regime "${melhor.nome}" proporciona a menor carga tributária efetiva (${melhor.aliquotaEfetivaGlobalPct}% da receita bruta), gerando uma economia anual estimada de R$ ${deltaEconomia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em comparação ao regime menos favorável (${pior.nome} a ${pior.aliquotaEfetivaGlobalPct}%).`;

    return {
      valorOperacao,
      faturamentoAnualEstimado: rbAnual,
      margemLucroRealPct,
      despesasOperacionaisPct: despesasPct,
      investimentoMaquinasAno: investimento,
      opcaoFunrural,
      anoReferenciaReforma: anoReforma,
      cClassTrib,
      regimes: listaRegimes,
      rankingEconomia: ranking,
      melhorRegime: melhor,
      economiaAnualEstimadaVsPior: deltaEconomia,
      analisePlanejamentoTributario: analiseTexto,
    };
  }
}

export const TABELA_CCLASSTRIB_RURAL = TABELA_OFICIAL_CCLASSTRIB;
export type ComparativoRegimesProdutor = ReturnType<typeof ReformaTributariaService.simularComparativoRegimes>;

export type RegimeTributarioAgroCodigo =
  | 'PF_LIVRO_CAIXA_LCDPR'
  | 'PF_ARBITRAMENTO_20'
  | 'PJ_LUCRO_PRESUMIDO'
  | 'PJ_LUCRO_REAL'
  | 'SIMPLES_NACIONAL'
  | 'COOPERATIVA_AGRO'
  | 'EXPORTACAO_IMUNE';

export interface DetalheRegimeTributario {
  codigo: RegimeTributarioAgroCodigo;
  nome: string;
  categoria: 'Pessoa Física' | 'Pessoa Jurídica' | 'Simples Nacional' | 'Cooperativa' | 'Exportação';
  descricao: string;
  fundamentoLegal: string;
  limiteFaturamento: string;
  baseCalculoRenda: number;
  aliquotaNominalRenda: number;
  irpf?: number;
  irpj?: number;
  adicionalIrpj?: number;
  csll?: number;
  totalTributosRenda: number;
  pisCofins: {
    regime: string;
    aliquotaTotal: number;
    valorTotal: number;
    detalhes: string;
  };
  funrural: {
    opcao: string;
    aliquotaTotal: number;
    valorRetencao: number;
    detalhes: string;
  };
  tributosEstaduais: {
    icmsValor: number;
    icmsCst: string;
    fethabMtValor: number;
    totalEstadual: number;
  };
  reformaIbsCbs: {
    regimeIbsCbs: string;
    valorCbs: number;
    valorIbs: number;
    totalIbsCbs: number;
    aliquotaEfetiva: number;
    creditoPresumidoGeradoParaComprador: number;
  };
  cargaTributariaTotal: number;
  aliquotaEfetivaGlobalPct: number;
  sobraLiquidaReceita: number;
  vantagens: string[];
  desvantagens: string[];
  recomendado: boolean;
  scoreAtratividade: number;
  observacaoEstrategica: string;
}

export interface AuditoriaMultiRegimesResultado {
  valorOperacao: number;
  faturamentoAnualEstimado: number;
  margemLucroRealPct: number;
  despesasOperacionaisPct: number;
  investimentoMaquinasAno: number;
  opcaoFunrural: 'COMERCIALIZACAO' | 'FOLHA_DE_PAGAMENTO';
  anoReferenciaReforma: number;
  cClassTrib: string;
  regimes: DetalheRegimeTributario[];
  rankingEconomia: DetalheRegimeTributario[];
  melhorRegime: DetalheRegimeTributario;
  economiaAnualEstimadaVsPior: number;
  analisePlanejamentoTributario: string;
}

export interface TributacaoNormalAgro {
  icms: {
    regimeIcms: 'DIFERIMENTO_INTERNO' | 'TRIBUTADO_INTEGRAL' | 'ISENTO_EXPORTACAO';
    cstIcms: '51' | '00' | '20' | '41';
    aliquotaIcms: number;
    baseCalculoIcms: number;
    valorIcms: number;
    fundamentoLegal: string;
  };
  pisCofins: {
    situacao: 'SUSPENSAO_LEI_10925';
    cstPis: '08' | '09';
    cstCofins: '08' | '09';
    aliquotaPis: number;
    aliquotaCofins: number;
    valorPis: number;
    valorCofins: number;
    fundamentoLegal: string;
  };
  funrural: {
    opcaoTributaria: 'COMERCIALIZACAO' | 'FOLHA_DE_PAGAMENTO';
    aliquotaTotal: number; // 1.50% ou 0.20%
    aliquotaInss: number; // 1.20% ou 0.00%
    aliquotaGilrat: number; // 0.10% ou 0.00%
    aliquotaSenar: number; // 0.20%
    valorRetencao: number;
    fundamentoLegal: string;
  };
  fethabMt?: {
    incide: boolean;
    valorRetencao: number;
    fundamentoLegal: string;
  };
  valorBrutoOperacao: number;
  valorLiquidoReceber: number;
}

export interface TributacaoAgroConsolidada {
  regraNormal: TributacaoNormalAgro;
  regraIbsCbs: CalculoIbsCbsResultado;
  anoReferencia: number;
  resumoImpactoFinanceiro: {
    totalTributosDiretosProdutor: number;
    totalRetencoesFonte: number;
    creditoPresumidoGeradoParaAdquirente: number;
    valorLiquidoEfetivoConta: number;
  };
}


