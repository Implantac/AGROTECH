/**
 * SUPER AGTECH v2.0 - PARSER DE XML DA NF-e & GESTÃO DE ALMOXARIFADO
 * Processamento de XMLs de compra de insumos agrícolas (SEFAZ Brasil)
 * e recálculo do Custo Médio Ponderado Móvel com rateio de frete e impostos não recuperáveis.
 */

export interface ItemNotaFiscalEntrada {
  numeroItem: number;
  codigoProdutoFornecedor: string;
  descricaoProduto: string;
  ncm: string;
  cfop: string;
  unidadeMedida: 'KG' | 'L' | 'SC' | 'DOSE' | 'UN';
  quantidade: number;
  valorUnitario: number;
  valorTotalBruto: number;
  valorFreteRateado: number;
  valorIpiNaoRecuperavel: number;
  valorOutrasDespesas: number;
  desconto: number;
  numeroLote?: string;
  dataValidade?: string;
  taxaGerminacao?: number;
}

export interface DadosNFeEntrada {
  chaveAcesso44: string;
  numeroNota: string;
  serie: string;
  dataEmissao: string;
  cnpjEmitente: string;
  razaoSocialEmitente: string;
  cnpjDestinatario: string;
  valorTotalNota: number;
  valorTotalFrete: number;
  itens: ItemNotaFiscalEntrada[];
}

export interface SaldoEstoqueAtual {
  insumoId: string;
  quantidadeAtual: number;
  custoMedioAtual: number;
}

export interface ResultadoRecalculoEstoque {
  insumoId: string;
  quantidadeAnterior: number;
  custoMedioAnterior: number;
  quantidadeEntrada: number;
  custoEfetivoEntrada: number; // Custo considerando frete, IPI e despesas acessórias
  quantidadeNova: number;
  novoCustoMedioUnitario: number;
  impactoPatrimonialTotal: number;
}

export class NFeParserAlmoxarifadoService {
  /**
   * Converte tags XML de NF-e (leiaute padrão SEFAZ) em estrutura tipada
   */
  public parseXmlNFe(xmlString: string): DadosNFeEntrada {
    // Parser robusto com expressões regulares para independência de libs nativas pesadas
    const extrairTag = (xml: string, tag: string): string => {
      const match = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i'));
      return match ? match[1].trim() : '';
    };

    const extrairChave = (xml: string): string => {
      const match = xml.match(/Id="NFe(\d{44})"/i) || xml.match(/<chNFe>(\d{44})<\/chNFe>/i);
      return match ? match[1] : '';
    };

    const chaveAcesso44 = extrairChave(xmlString);
    const numeroNota = extrairTag(xmlString, 'nNF');
    const serie = extrairTag(xmlString, 'serie');
    const dataEmissao = extrairTag(xmlString, 'dhEmi') || extrairTag(xmlString, 'dEmi');
    
    // Emitente
    const emitMatch = xmlString.match(/<emit>([\s\S]*?)<\/emit>/i);
    const emitXml = emitMatch ? emitMatch[1] : '';
    const cnpjEmitente = extrairTag(emitXml, 'CNPJ') || extrairTag(emitXml, 'CPF');
    const razaoSocialEmitente = extrairTag(emitXml, 'xNome');

    // Destinatário
    const destMatch = xmlString.match(/<dest>([\s\S]*?)<\/dest>/i);
    const destXml = destMatch ? destMatch[1] : '';
    const cnpjDestinatario = extrairTag(destXml, 'CNPJ') || extrairTag(destXml, 'CPF');

    // Totais da Nota
    const totalMatch = xmlString.match(/<ICMSTot>([\s\S]*?)<\/ICMSTot>/i);
    const totalXml = totalMatch ? totalMatch[1] : '';
    const valorTotalNota = parseFloat(extrairTag(totalXml, 'vNF') || '0');
    const valorTotalFrete = parseFloat(extrairTag(totalXml, 'vFrete') || '0');

    // Processamento dos itens (<det>)
    const itens: ItemNotaFiscalEntrada[] = [];
    const detRegex = /<det\s+nItem="(\d+)">([\s\S]*?)<\/det>/gi;
    let matchDet;

    while ((matchDet = detRegex.exec(xmlString)) !== null) {
      const nItem = parseInt(matchDet[1], 10);
      const detXml = matchDet[2];

      const prodMatch = detXml.match(/<prod>([\s\S]*?)<\/prod>/i);
      const prodXml = prodMatch ? prodMatch[1] : '';

      const impostoMatch = detXml.match(/<imposto>([\s\S]*?)<\/imposto>/i);
      const impostoXml = impostoMatch ? impostoMatch[1] : '';

      const cProd = extrairTag(prodXml, 'cProd');
      const xProd = extrairTag(prodXml, 'xProd');
      const ncm = extrairTag(prodXml, 'NCM');
      const cfop = extrairTag(prodXml, 'CFOP');
      const uCom = (extrairTag(prodXml, 'uCom') || 'UN').toUpperCase() as ItemNotaFiscalEntrada['unidadeMedida'];
      const qCom = parseFloat(extrairTag(prodXml, 'qCom') || '0');
      const vUnCom = parseFloat(extrairTag(prodXml, 'vUnCom') || '0');
      const vProd = parseFloat(extrairTag(prodXml, 'vProd') || '0');
      const vFreteItem = parseFloat(extrairTag(prodXml, 'vFrete') || '0');
      const vDesc = parseFloat(extrairTag(prodXml, 'vDesc') || '0');
      const vOutro = parseFloat(extrairTag(prodXml, 'vOutro') || '0');

      // IPI não recuperável (gera acréscimo no custo do insumo para produtor pessoa física)
      const vIPI = parseFloat(extrairTag(impostoXml, 'vIPI') || '0');

      // Rastreabilidade de lote agrícola (<rastro>)
      const rastroMatch = detXml.match(/<rastro>([\s\S]*?)<\/rastro>/i);
      const rastroXml = rastroMatch ? rastroMatch[1] : '';
      const nLote = extrairTag(rastroXml, 'nLote');
      const dVal = extrairTag(rastroXml, 'dVal');

      itens.push({
        numeroItem: nItem,
        codigoProdutoFornecedor: cProd,
        descricaoProduto: xProd,
        ncm,
        cfop,
        unidadeMedida: uCom,
        quantidade: qCom,
        valorUnitario: vUnCom,
        valorTotalBruto: vProd,
        valorFreteRateado: vFreteItem,
        valorIpiNaoRecuperavel: vIPI,
        valorOutrasDespesas: vOutro,
        desconto: vDesc,
        numeroLote: nLote || undefined,
        dataValidade: dVal || undefined,
      });
    }

    return {
      chaveAcesso44,
      numeroNota,
      serie,
      dataEmissao,
      cnpjEmitente,
      razaoSocialEmitente,
      cnpjDestinatario,
      valorTotalNota,
      valorTotalFrete,
      itens,
    };
  }

  /**
   * Recalcula o Custo Médio Ponderado Móvel de um insumo após a entrada de uma nova nota fiscal
   * Fórmula:
   * Novo Custo Médio = ( (QtdAtual * CustoAtual) + (QtdNota * CustoEfetivoNota) ) / (QtdAtual + QtdNota)
   */
  public calcularNovoCustoMedio(
    estoqueAtual: SaldoEstoqueAtual,
    itemEntrada: ItemNotaFiscalEntrada
  ): ResultadoRecalculoEstoque {
    const qtdAtual = Math.max(0, estoqueAtual.quantidadeAtual);
    const custoAtual = Math.max(0, estoqueAtual.custoMedioAtual);
    const qtdEntrada = Math.max(0, itemEntrada.quantidade);

    if (qtdEntrada === 0) {
      return {
        insumoId: estoqueAtual.insumoId,
        quantidadeAnterior: qtdAtual,
        custoMedioAnterior: custoAtual,
        quantidadeEntrada: 0,
        custoEfetivoEntrada: 0,
        quantidadeNova: qtdAtual,
        novoCustoMedioUnitario: custoAtual,
        impactoPatrimonialTotal: Number((qtdAtual * custoAtual).toFixed(2)),
      };
    }

    // Custo efetivo total do item = Valor Bruto + Frete + IPI + Despesas Acessórias - Desconto
    const valorEfetivoTotalItem =
      itemEntrada.valorTotalBruto +
      itemEntrada.valorFreteRateado +
      itemEntrada.valorIpiNaoRecuperavel +
      itemEntrada.valorOutrasDespesas -
      itemEntrada.desconto;

    const custoEfetivoUnitarioEntrada = valorEfetivoTotalItem / qtdEntrada;

    const valorTotalAnterior = qtdAtual * custoAtual;
    const valorTotalNovo = valorTotalAnterior + valorEfetivoTotalItem;
    const quantidadeNova = qtdAtual + qtdEntrada;

    const novoCustoMedioUnitario = quantidadeNova > 0 ? valorTotalNovo / quantidadeNova : 0;

    return {
      insumoId: estoqueAtual.insumoId,
      quantidadeAnterior: Number(qtdAtual.toFixed(4)),
      custoMedioAnterior: Number(custoAtual.toFixed(4)),
      quantidadeEntrada: Number(qtdEntrada.toFixed(4)),
      custoEfetivoEntrada: Number(custoEfetivoUnitarioEntrada.toFixed(4)),
      quantidadeNova: Number(quantidadeNova.toFixed(4)),
      novoCustoMedioUnitario: Number(novoCustoMedioUnitario.toFixed(4)),
      impactoPatrimonialTotal: Number(valorTotalNovo.toFixed(2)),
    };
  }
}
