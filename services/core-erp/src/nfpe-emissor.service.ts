/**
 * SUPER AGTECH v2.0 - EMISSOR & VALIDADOR FISCAL DE NFP-e (MODELO 55)
 * Implementa validação da Chave de Acesso de 44 dígitos com Dígito Verificador Módulo 11,
 * apuração legal de retenções do Funrural/Senar e parametrização de CFOP agropecuário.
 */

export interface ItemNFP {
  numeroItem: number;
  descricao: string;
  ncm: string;
  cfop: string; // Ex: '5101' (Venda de produção própria dentro do estado)
  unidade: 'SC' | 'KG' | 'TON' | 'CAB' | 'L';
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface EmissaoNFPInput {
  ufEmitenteCodigoIbge: string; // Ex: '51' (Mato Grosso), '52' (Goiás), '31' (Minas Gerais)
  anoMesEmissao: string; // YYMM, ex: '2610' (Outubro de 2026)
  cnpjCpfEmitente: string;
  modeloDocumento: '55'; // NFP-e padrão nacional
  serie: string; // Ex: '1'
  numeroNota: number;
  tipoEmissao: '1'; // 1 = Normal
  codigoNumericoAleatorio: string; // 8 dígitos
  opcaoTributacaoFunrural: 'RECEITA_BRUTA' | 'FOLHA_SALARIOS';
  itens: ItemNFP[];
  destinatarioCpfCnpj: string;
  destinatarioNome: string;
}

export interface ResultadoEmissaoNFP {
  chaveAcesso44: string;
  digitoVerificador: number;
  valorTotalBruto: number;
  valorFunruralRetido: number;
  aliquotaFunruralEfetiva: number;
  valorLiquidoProdutor: number;
  itensValidados: ItemNFP[];
  statusValidacao: 'APROVADO_PRE_EMISSAO' | 'REJEITADO';
  errosValidacao: string[];
}

export class NFPeEmissorService {
  /**
   * Calcula o Dígito Verificador (Módulo 11) dos primeiros 43 dígitos da NF-e
   * Pesos ponderados de 2 a 9 da direita para a esquerda.
   */
  public static calcularDigitoModulo11(chave43: string): number {
    if (chave43.length !== 43) {
      throw new Error(`A chave base deve conter exatamente 43 dígitos numéricos. Recebido: ${chave43.length}`);
    }

    let soma = 0;
    let peso = 2;

    for (let i = chave43.length - 1; i >= 0; i--) {
      const digito = parseInt(chave43.charAt(i), 10);
      soma += digito * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }

    const resto = soma % 11;
    const dv = 11 - resto;

    if (dv === 0 || dv === 10 || dv === 11) {
      return 0;
    }

    return dv;
  }

  /**
   * Valida se uma Chave de Acesso de 44 dígitos é estrutural e matematicamente válida
   */
  public static validarChaveAcesso44(chave44: string): boolean {
    const limpa = chave44.replace(/\D/g, '');
    if (limpa.length !== 44) {
      return false;
    }

    const chave43 = limpa.substring(0, 43);
    const dvInformado = parseInt(limpa.charAt(43), 10);
    const dvCalculado = NFPeEmissorService.calcularDigitoModulo11(chave43);

    return dvInformado === dvCalculado;
  }

  /**
   * Gera a chave de 44 dígitos completa a partir dos dados do documento fiscal
   */
  public gerarChaveAcesso(input: {
    ufIbge: string;
    anoMes: string;
    cnpjCpf: string;
    modelo: string;
    serie: string;
    numeroNota: number;
    tipoEmissao: string;
    codigoAleatorio: string;
  }): { chave44: string; digitoVerificador: number } {
    const uf = input.ufIbge.padStart(2, '0');
    const aamm = input.anoMes.padStart(4, '0');
    const docLimpo = input.cnpjCpf.replace(/\D/g, '').padStart(14, '0');
    const mod = input.modelo.padStart(2, '0');
    const serie = input.serie.padStart(3, '0');
    const nNF = input.numeroNota.toString().padStart(9, '0');
    const tpEmis = input.tipoEmissao.padStart(1, '0');
    const cNF = input.codigoAleatorio.padStart(8, '0');

    const chave43 = `${uf}${aamm}${docLimpo}${mod}${serie}${nNF}${tpEmis}${cNF}`;
    const dv = NFPeEmissorService.calcularDigitoModulo11(chave43);
    const chave44 = `${chave43}${dv}`;

    return { chave44, digitoVerificador: dv };
  }

  /**
   * Processa a pré-emissão da NFP-e com validação fiscal e retenção de Funrural
   */
  public processarPreEmissao(input: EmissaoNFPInput): ResultadoEmissaoNFP {
    const erros: string[] = [];

    // 1. Validação dos Itens
    if (!input.itens || input.itens.length === 0) {
      erros.push('A nota fiscal deve conter pelo menos um item faturado.');
    }

    let valorTotalBruto = 0;
    for (const item of input.itens) {
      if (item.quantidade <= 0) {
        erros.push(`Item ${item.numeroItem} (${item.descricao}): quantidade deve ser maior que zero.`);
      }
      if (item.valorUnitario <= 0) {
        erros.push(`Item ${item.numeroItem} (${item.descricao}): valor unitário deve ser maior que zero.`);
      }
      if (!/^\d{4}$/.test(item.cfop)) {
        erros.push(`Item ${item.numeroItem} (${item.descricao}): CFOP '${item.cfop}' inválido. Deve possuir 4 dígitos.`);
      }
      valorTotalBruto += item.valorTotal;
    }

    // 2. Cálculo do Funrural
    // Alíquota padrão Produtor Rural PF: 1,2% (INSS) + 0,1% (RAT) + 0,2% (SENAR) = 1,5%
    let aliquotaFunruralEfetiva = 0;
    let valorFunruralRetido = 0;

    if (input.opcaoTributacaoFunrural === 'RECEITA_BRUTA') {
      aliquotaFunruralEfetiva = 0.015; // 1.5%
      valorFunruralRetido = Number((valorTotalBruto * aliquotaFunruralEfetiva).toFixed(2));
    } else {
      // Optante por recolhimento sobre a folha de pagamento: retém apenas SENAR (0,2%)
      aliquotaFunruralEfetiva = 0.002; // 0.2%
      valorFunruralRetido = Number((valorTotalBruto * aliquotaFunruralEfetiva).toFixed(2));
    }

    const valorLiquidoProdutor = Number((valorTotalBruto - valorFunruralRetido).toFixed(2));

    // 3. Chave de Acesso
    const { chave44, digitoVerificador } = this.gerarChaveAcesso({
      ufIbge: input.ufEmitenteCodigoIbge,
      anoMes: input.anoMesEmissao,
      cnpjCpf: input.cnpjCpfEmitente,
      modelo: input.modeloDocumento,
      serie: input.serie,
      numeroNota: input.numeroNota,
      tipoEmissao: input.tipoEmissao,
      codigoAleatorio: input.codigoNumericoAleatorio,
    });

    const statusValidacao: ResultadoEmissaoNFP['statusValidacao'] =
      erros.length === 0 ? 'APROVADO_PRE_EMISSAO' : 'REJEITADO';

    return {
      chaveAcesso44: chave44,
      digitoVerificador,
      valorTotalBruto: Number(valorTotalBruto.toFixed(2)),
      valorFunruralRetido,
      aliquotaFunruralEfetiva,
      valorLiquidoProdutor,
      itensValidados: input.itens,
      statusValidacao,
      errosValidacao: erros,
    };
  }
}
