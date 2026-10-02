/**
 * AGROTECH ENTERPRISE v9.5 - CORE ERP
 * Integração Bancária CNAB 240 (Padrão FEBRABAN)
 * Remessas e Retornos de Pagamento a Fornecedores, Insumos e Custeio Rural
 * Suporte a Banco do Brasil (001), Sicredi (748) e Sicoob (756)
 */

export interface DadosEmpresaEmitente {
  codigoBanco: string;      // '001', '748', '756'
  nomeBanco: string;
  cnpjEmpresa: string;      // 14 dígitos
  nomeEmpresa: string;      // até 30 caracteres
  numeroAgencia: string;    // 5 dígitos
  digitoAgencia: string;
  numeroConta: string;      // 12 dígitos
  digitoConta: string;
  convenioCobranca?: string;
}

export interface ItemPagamentoFornecedor {
  sequencialRegistro: number;
  tipoInscricaoFavorecido: '1' | '2'; // 1=CPF, 2=CNPJ
  cpfCnpjFavorecido: string;
  nomeFavorecido: string;
  chavePixOuBancoFavorecido: string;
  agenciaFavorecido: string;
  contaFavorecido: string;
  numeroNotaFiscal: string;
  dataVencimento: string; // 'AAAAMMDD'
  valorPagamentoReais: number;
  finalidadePagamento: string;
}

export class CNAB240BancarioService {
  /**
   * Gera o arquivo de remessa CNAB 240 para envio ao Internet Banking
   */
  public gerarArquivoRemessaPagamentos(
    empresa: DadosEmpresaEmitente,
    pagamentos: ItemPagamentoFornecedor[]
  ): string {
    const linhas: string[] = [];
    const dataHoraAtual = new Date();
    const dataGravacao = dataHoraAtual.toISOString().slice(0, 10).replace(/-/g, '');
    const horaGravacao = dataHoraAtual.toTimeString().slice(0, 8).replace(/:/g, '');

    // 1. Registro Header de Arquivo (Tipo 0)
    let headerArquivo = '';
    headerArquivo += empresa.codigoBanco.padStart(3, '0'); // 001-003: Código do Banco
    headerArquivo += '0000'; // 004-007: Lote de Serviço
    headerArquivo += '0';    // 008-008: Tipo de Registro (0=Header Arquivo)
    headerArquivo += ''.padEnd(9, ' '); // 009-017: Uso Febraban
    headerArquivo += '2';    // 018-018: Tipo de Inscrição (2=CNPJ)
    headerArquivo += empresa.cnpjEmpresa.replace(/\D/g, '').padStart(14, '0'); // 019-032: CNPJ
    headerArquivo += (empresa.convenioCobranca || '').padEnd(20, ' '); // 033-052: Convênio
    headerArquivo += empresa.numeroAgencia.padStart(5, '0'); // 053-057: Agência
    headerArquivo += empresa.digitoAgencia.slice(0, 1) || '0'; // 058-058: Dígito Agência
    headerArquivo += empresa.numeroConta.padStart(12, '0'); // 059-070: Conta
    headerArquivo += empresa.digitoConta.slice(0, 1) || '0'; // 071-071: Dígito Conta
    headerArquivo += ' '; // 072-072: Dígito Ag/Conta
    headerArquivo += empresa.nomeEmpresa.toUpperCase().padEnd(30, ' ').slice(0, 30); // 073-102: Nome Empresa
    headerArquivo += empresa.nomeBanco.toUpperCase().padEnd(30, ' ').slice(0, 30); // 103-132: Nome Banco
    headerArquivo += ''.padEnd(10, ' '); // 133-142: Uso Febraban
    headerArquivo += '1'; // 143-143: Código Remessa (1=Remessa)
    headerArquivo += dataGravacao; // 144-151: Data Gravação
    headerArquivo += horaGravacao; // 152-157: Hora Gravação
    headerArquivo += '000001'; // 158-163: Sequencial NSA
    headerArquivo += '103'; // 164-166: Versão do Layout
    headerArquivo += '00000'; // 167-171: Densidade Gravação
    headerArquivo += ''.padEnd(69, ' '); // 172-240: Reservado Banco
    linhas.push(headerArquivo);

    // 2. Registro Header de Lote (Tipo 1 - Pagamento a Fornecedores/Insumos)
    let headerLote = '';
    headerLote += empresa.codigoBanco.padStart(3, '0'); // 001-003
    headerLote += '0001'; // 004-007: Lote 1
    headerLote += '1';    // 008-008: Tipo de Registro (1=Header Lote)
    headerLote += 'C';    // 009-009: Tipo de Operação (C=Crédito)
    headerLote += '20';   // 010-011: Tipo de Pagamento (20=Pagamento Fornecedores)
    headerLote += '01';   // 012-013: Forma de Lançamento (01=Crédito em Conta/PIX)
    headerLote += '045';  // 014-016: Versão Layout Lote
    headerLote += ' ';    // 017-017: Uso Febraban
    headerLote += '2';    // 018-018: Inscrição Empresa (2=CNPJ)
    headerLote += empresa.cnpjEmpresa.replace(/\D/g, '').padStart(14, '0');
    headerLote += (empresa.convenioCobranca || '').padEnd(20, ' ');
    headerLote += empresa.numeroAgencia.padStart(5, '0');
    headerLote += empresa.digitoAgencia.slice(0, 1) || '0';
    headerLote += empresa.numeroConta.padStart(12, '0');
    headerLote += empresa.digitoConta.slice(0, 1) || '0';
    headerLote += ' ';
    headerLote += empresa.nomeEmpresa.toUpperCase().padEnd(30, ' ').slice(0, 30);
    headerLote += ''.padEnd(40, ' '); // 103-142: Informação 1
    headerLote += ''.padEnd(98, ' '); // 143-240: Uso Banco
    linhas.push(headerLote);

    // 3. Registros Detalhe (Segmento A)
    let valorTotalLoteCentavos = 0;
    pagamentos.forEach((pag, idx) => {
      const valorCentavos = Math.round(pag.valorPagamentoReais * 100);
      valorTotalLoteCentavos += valorCentavos;

      let segA = '';
      segA += empresa.codigoBanco.padStart(3, '0'); // 001-003
      segA += '0001'; // 004-007: Lote 1
      segA += '3';    // 008-008: Detalhe
      segA += String(idx + 1).padStart(5, '0'); // 009-013: Nº Sequencial do Registro no Lote
      segA += 'A';    // 014-014: Segmento A
      segA += '000';  // 015-017: Tipo de Movimento (000=Inclusão)
      segA += '000';  // 018-020: Código da Câmara Compensação
      segA += (pag.chavePixOuBancoFavorecido.slice(0, 3) || '001').padStart(3, '0'); // 021-023: Banco Favorecido
      segA += pag.agenciaFavorecido.padStart(5, '0'); // 024-028: Agência Favorecido
      segA += '0';    // 029-029: Dígito Agência
      segA += pag.contaFavorecido.padStart(12, '0'); // 030-041: Conta Favorecido
      segA += '0';    // 042-042: Dígito Conta
      segA += ' ';    // 043-043: Dígito Ag/Conta
      segA += pag.nomeFavorecido.toUpperCase().padEnd(30, ' ').slice(0, 30); // 044-073: Nome Favorecido
      segA += pag.numeroNotaFiscal.padEnd(20, ' ').slice(0, 20); // 074-093: Nº Documento Atribuído pela Empresa
      segA += pag.dataVencimento.padEnd(8, '0'); // 094-101: Data Pagamento/Vencimento
      segA += 'BRL';  // 102-104: Tipo Moeda
      segA += '000000000000000'; // 105-119: Quantidade Moeda
      segA += String(valorCentavos).padStart(15, '0'); // 120-134: Valor Pagamento
      segA += ''.padEnd(20, ' '); // 135-154: Nº Doc atribuído pelo Banco
      segA += '00000000'; // 155-162: Data Real
      segA += '000000000000000'; // 163-177: Valor Real
      segA += pag.finalidadePagamento.padEnd(40, ' ').slice(0, 40); // 178-217: Finalidade
      segA += ''.padEnd(10, ' '); // 218-227: Uso Febraban
      segA += '0'; // 228-228: Emissão Aviso
      segA += ''.padEnd(10, '0'); // 229-238: Ocorrências
      linhas.push(segA.padEnd(240, ' '));
    });

    // 4. Registro Trailer de Lote (Tipo 5)
    let trailerLote = '';
    trailerLote += empresa.codigoBanco.padStart(3, '0');
    trailerLote += '0001';
    trailerLote += '5'; // Tipo 5
    trailerLote += ''.padEnd(9, ' ');
    trailerLote += String(pagamentos.length + 2).padStart(6, '0'); // Quantidade de registros do lote
    trailerLote += String(valorTotalLoteCentavos).padStart(18, '0'); // Somatória dos valores do lote
    trailerLote += '000000000000000000'; // Somatória de Moedas
    trailerLote += ''.padEnd(181, ' ');
    linhas.push(trailerLote.slice(0, 240).padEnd(240, ' '));

    // 5. Registro Trailer de Arquivo (Tipo 9)
    let trailerArquivo = '';
    trailerArquivo += empresa.codigoBanco.padStart(3, '0');
    trailerArquivo += '9999';
    trailerArquivo += '9'; // Tipo 9
    trailerArquivo += ''.padEnd(9, ' ');
    trailerArquivo += '000001'; // Quantidade de lotes
    trailerArquivo += String(linhas.length + 1).padStart(6, '0'); // Total de registros do arquivo
    trailerArquivo += ''.padEnd(211, ' ');
    linhas.push(trailerArquivo.slice(0, 240).padEnd(240, ' '));

    return linhas.join('\r\n') + '\r\n';
  }
}
