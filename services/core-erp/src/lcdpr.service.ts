/**
 * SUPER AGTECH v2.0 - SERVIÇO FISCAL DE GERAÇÃO DO LCDPR
 * Em conformidade com a Instrução Normativa da Receita Federal do Brasil (RFB).
 * Suporta particionamento automático para Condomínios Rurais e Arrendamentos.
 */

export interface ProdutorCondominio {
  cpf: string;
  nome: string;
  percentualParticipacao: number; // Ex: 40 para 40%
  titularPrincipal: boolean;
}

export interface ImovelRural {
  codigoImovel: string; // Ex: '001'
  nomeFazenda: string;
  numeroCar: string;
  municipioIbge: string;
  uf: string;
  tipoExploracao: '1' | '2' | '3'; // 1=Individual, 2=Condomínio, 3=Arrendamento
}

export interface ContaBancaria {
  codigoConta: string; // Ex: '001'
  banco: string; // '001' Banco do Brasil
  agencia: string;
  numeroConta: string;
}

export interface LancamentoLivroCaixa {
  data: string; // YYYY-MM-DD
  codigoImovel: string;
  codigoConta: string;
  tipoDocumento: '1' | '2' | '3' | '4' | '5'; // 1=NF, 2=Fatura, 3=Recibo, etc
  numeroDocumento: string;
  historico: string;
  cpfCnpjParticipante: string;
  tipoLancamento: '1' | '2' | '3'; // 1=Receita, 2=Despesa Custeio, 3=Investimentos
  valorTotalOriginal: number;
}

export class LCDPRService {
  /**
   * Gera o conteúdo em formato TXT estrito do LCDPR para um produtor específico do condomínio
   */
  public gerarArquivoLCDPR(
    anoCalendario: number,
    produtorAlvo: ProdutorCondominio,
    imoveis: ImovelRural[],
    contas: ContaBancaria[],
    condominos: ProdutorCondominio[],
    lancamentos: LancamentoLivroCaixa[]
  ): string {
    const linhas: string[] = [];

    // REGISTRO 0000: ABERTURA DO ARQUIVO
    linhas.push(
      `0000|LCDPR|0013|${produtorAlvo.cpf.replace(/\D/g, '')}|${produtorAlvo.nome.toUpperCase()}|0|0|0101${anoCalendario}|3112${anoCalendario}`
    );

    // REGISTRO 0010: FORMA DE APURAÇÃO (1 = Livro Caixa)
    linhas.push(`0010|1`);

    // REGISTRO 0030: IDENTIFICAÇÃO DOS IMÓVEIS RURAIS
    for (const imovel of imoveis) {
      linhas.push(
        `0030|${imovel.codigoImovel}|${imovel.tipoExploracao}|BR|${imovel.numeroCar}|${imovel.nomeFazenda.toUpperCase()}|${imovel.municipioIbge}|${imovel.uf}`
      );
    }

    // REGISTRO 0040: CADASTRO DAS CONTAS BANCÁRIAS
    for (const conta of contas) {
      linhas.push(
        `0040|${conta.codigoConta}|BR|${conta.banco}|${conta.agencia}|${conta.numeroConta}`
      );
    }

    // REGISTRO 0050: CADASTRO DOS CONDÔMINOS E EXPLORAÇÃO COMPARTILHADA
    for (let i = 0; i < condominos.length; i++) {
      const c = condominos[i];
      const pctFormatado = (c.percentualParticipacao * 100).toFixed(0).padStart(4, '0'); // ex: 4000 = 40.00%
      linhas.push(
        `0050|${(i + 1).toString().padStart(3, '0')}|${c.cpf.replace(/\D/g, '')}|${c.nome.toUpperCase()}|${pctFormatado}`
      );
    }

    // REGISTRO Q100: DEMONSTRATIVO DO LIVRO CAIXA COM RATEIO AUTOMÁTICO
    let saldoAcumulado = 0;
    for (const lanc of lancamentos) {
      // Aplica o percentual do condomínio para o produtor alvo
      const fatorRateio = produtorAlvo.percentualParticipacao / 100;
      const valorRateado = lanc.valorTotalOriginal * fatorRateio;

      if (lanc.tipoLancamento === '1') {
        saldoAcumulado += valorRateado;
      } else {
        saldoAcumulado -= valorRateado;
      }

      const dataFormatada = lanc.data.replace(/-/g, '').slice(6, 8) + lanc.data.replace(/-/g, '').slice(4, 6) + lanc.data.replace(/-/g, '').slice(0, 4);
      const valorFormatado = (valorRateado * 100).toFixed(0).padStart(12, '0');
      const saldoFormatado = (Math.abs(saldoAcumulado) * 100).toFixed(0).padStart(12, '0');
      const sinalSaldo = saldoAcumulado >= 0 ? 'P' : 'N';

      linhas.push(
        `Q100|${dataFormatada}|${lanc.codigoImovel}|${lanc.codigoConta}|${lanc.tipoDocumento}|${lanc.numeroDocumento}|${lanc.historico.substring(0, 50).toUpperCase()}|${lanc.cpfCnpjParticipante.replace(/\D/g, '')}|${lanc.tipoLancamento}|${valorFormatado}|${sinalSaldo}|${saldoFormatado}`
      );
    }

    // REGISTRO 9999: ENCERRAMENTO DO ARQUIVO
    const totalLinhas = linhas.length + 1;
    linhas.push(`9999|${produtorAlvo.nome.toUpperCase()}|${produtorAlvo.cpf.replace(/\D/g, '')}|${totalLinhas}`);

    return linhas.join('\r\n');
  }
}
