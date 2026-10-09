/**
 * @file ofxConciliacaoService.cjs
 * @description Módulo de Conciliação Bancária OFX & Integração Automática com LCDPR SPED
 * Padrão Bancário: Open Financial Exchange (OFX 1.02 / 2.0 / 2.2)
 * Compatibilidade: Banco do Brasil (001), Sicredi (748), Sicoob (756), Bradesco (237), Santander (033), Itaú (341)
 */

const crypto = require('crypto');

// Mapeamento semântico de palavras-chave do agronegócio para o Plano de Contas Oficial do LCDPR (Receita Federal)
const REGRAS_CATEGORIZACAO_AGRO = [
  {
    categoria: 'RECEITA_VENDA_COMMODITIES',
    contaLcdpr: '1.01.01',
    tipoOperacaoLcdpr: 1, // 1 - Receita da Atividade Rural
    palavrasChave: ['SOJA', 'MILHO', 'ALGODAO', 'BOVINOS', 'CARGILL', 'BUNGE', 'AMAGGI', 'COAMO', 'LDC', 'COFCO', 'VENDA GRAOS', 'CRA', 'CPR FINANCEIRA']
  },
  {
    categoria: 'FERTILIZANTES_E_CORRETIVOS',
    contaLcdpr: '3.01.02',
    tipoOperacaoLcdpr: 2, // 2 - Despesa da Atividade Rural
    palavrasChave: ['FERTILIZANTE', 'ADUBO', 'YARA', 'MOSAIC', 'CALCARIO', 'GESSO', 'UREIA', 'MAP', 'KCL', 'NUTRICAO FOLIAR']
  },
  {
    categoria: 'DEFENSIVOS_AGRICOLAS',
    contaLcdpr: '3.01.03',
    tipoOperacaoLcdpr: 2,
    palavrasChave: ['DEFENSIVO', 'HERBICIDA', 'FUNGICIDA', 'INSETICIDA', 'SYNGENTA', 'BAYER', 'BASF', 'CORTEVA', 'IHARA', 'GLIFOSATO', 'PULVERIZACAO']
  },
  {
    categoria: 'SEMENTES_E_MUDAS',
    contaLcdpr: '3.01.04',
    tipoOperacaoLcdpr: 2,
    palavrasChave: ['SEMENTE', 'MONSANTO', 'PIONEER', 'DONMARIO', 'BRASMAX', 'TSI', 'MUDAS', 'EMBRAPA']
  },
  {
    categoria: 'COMBUSTIVEL_E_LUBRIFICANTES',
    contaLcdpr: '3.01.01',
    tipoOperacaoLcdpr: 2,
    palavrasChave: ['DIESEL', 'COMBUSTIVEL', 'PETROBRAS', 'IPIRANGA', 'RAIZEN', 'VIBRA', 'LUBRIFICANTE', 'ARLA 32', 'COMBOIO', 'POSTO']
  },
  {
    categoria: 'PECAS_E_MANUTENCAO_MAQUINARIO',
    contaLcdpr: '3.01.06',
    tipoOperacaoLcdpr: 2,
    palavrasChave: ['JOHN DEERE', 'CASE IH', 'NEW HOLLAND', 'AGCO', 'VALTRA', 'JACTO', 'PECAS', 'RETIFICA', 'OFICINA', 'MANGUEIRA', 'PNEU', 'FILTRO']
  },
  {
    categoria: 'FOLHA_PAGAMENTO_E_ENCARGOS',
    contaLcdpr: '3.01.05',
    tipoOperacaoLcdpr: 2,
    palavrasChave: ['SALARIO', 'FOLHA', 'GPS', 'FGTS', 'PAGTO FUNC', 'PRO-LABORE', 'RESCISAO', 'DIARIA', 'SENAR', 'FUNRURAL']
  },
  {
    categoria: 'SERVICOS_TERCEIROS_FRETE',
    contaLcdpr: '3.01.07',
    tipoOperacaoLcdpr: 2,
    palavrasChave: ['FRETE', 'TRANSPORTADORA', 'TRANS', 'COLHEITA TERCEIROS', 'PULVERIZACAO AEREA', 'DRONE', 'LOCACAO']
  },
  {
    categoria: 'AMORTIZACAO_FINANCIAMENTO_PLANO_SAFRA',
    contaLcdpr: '3.02.01',
    tipoOperacaoLcdpr: 2,
    palavrasChave: ['PARCELA', 'FINAME', 'PRONAMP', 'MODERFROTA', 'PROIRRIGA', 'CUSTEIO', 'JUROS BANCARIOS', 'IOF', 'TARIFA']
  }
];

/**
 * Faz o parsing inteligente de string OFX (tanto SGML quanto XML tag-based)
 */
function parseOfxContent(ofxString) {
  if (!ofxString || typeof ofxString !== 'string') {
    throw new Error('Conteúdo OFX inválido ou vazio');
  }

  // Identificação do banco
  let bancoCodigo = '001';
  let bancoNome = 'Banco do Brasil S.A.';
  const bankIdMatch = ofxString.match(/<BANKID>([^<\r\n]+)/i);
  if (bankIdMatch) {
    bancoCodigo = bankIdMatch[1].trim();
    if (bancoCodigo === '748') bancoNome = 'Banco Cooperativo Sicredi S.A.';
    else if (bancoCodigo === '756') bancoNome = 'Banco Cooperativo Sicoob S.A.';
    else if (bancoCodigo === '237') bancoNome = 'Banco Bradesco S.A.';
    else if (bancoCodigo === '033') bancoNome = 'Banco Santander Brasil S.A.';
    else if (bancoCodigo === '341') bancoNome = 'Itaú Unibanco S.A.';
  }

  // Identificação da conta
  let contaCorrente = '00000-0';
  const acctIdMatch = ofxString.match(/<ACCTID>([^<\r\n]+)/i);
  if (acctIdMatch) contaCorrente = acctIdMatch[1].trim();

  // Extração das transações <STMTTRN>
  const transacoes = [];
  const stmtTrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
  let match;

  while ((match = stmtTrnRegex.exec(ofxString)) !== null) {
    const bloco = match[1];

    const trnType = (bloco.match(/<TRNTYPE>([^<\r\n]+)/i) || [])[1] || 'OTHER';
    const dtPostedRaw = (bloco.match(/<DTPOSTED>([^<\r\n]+)/i) || [])[1] || '';
    const trnAmtRaw = (bloco.match(/<TRNAMT>([^<\r\n]+)/i) || [])[1] || '0';
    const fitId = (bloco.match(/<FITID>([^<\r\n]+)/i) || [])[1] || crypto.randomUUID();
    const memo = (bloco.match(/<MEMO>([^<\r\n]+)/i) || (bloco.match(/<NAME>([^<\r\n]+)/i)) || [])[1] || 'TRANSACAO BANCARIA';

    // Normalização de data (YYYYMMDDHHMMSS -> YYYY-MM-DD)
    const ano = dtPostedRaw.substring(0, 4) || new Date().getFullYear();
    const mes = dtPostedRaw.substring(4, 6) || '01';
    const dia = dtPostedRaw.substring(6, 8) || '01';
    const dataFormatada = `${ano}-${mes}-${dia}`;

    const valor = parseFloat(trnAmtRaw.replace(',', '.'));

    // Categorização automática
    const memoUpper = memo.toUpperCase();
    let categoriaEncontrada = 'OUTRAS_DESPESAS_OPERACIONAIS';
    let contaLcdpr = valor >= 0 ? '1.01.99' : '3.01.99';
    let tipoOperacaoLcdpr = valor >= 0 ? 1 : 2;

    for (const regra of REGRAS_CATEGORIZACAO_AGRO) {
      if (regra.palavrasChave.some(kw => memoUpper.includes(kw))) {
        categoriaEncontrada = regra.categoria;
        contaLcdpr = regra.contaLcdpr;
        tipoOperacaoLcdpr = regra.tipoOperacaoLcdpr;
        break;
      }
    }

    transacoes.push({
      fitId: fitId.trim(),
      tipo: trnType.trim(),
      data: dataFormatada,
      historicoOriginal: memo.trim(),
      valorBrl: valor,
      natureza: valor >= 0 ? 'CREDITO_RECEITA' : 'DEBITO_DESPESA',
      classificacaoAutomatica: {
        categoria: categoriaEncontrada,
        contaLcdpr,
        tipoOperacaoLcdpr,
        confiancaPct: 95.0
      }
    });
  }

  // Totalizadores
  const totalReceitas = transacoes
    .filter(t => t.valorBrl > 0)
    .reduce((acc, t) => acc + t.valorBrl, 0);

  const totalDespesas = transacoes
    .filter(t => t.valorBrl < 0)
    .reduce((acc, t) => acc + Math.abs(t.valorBrl), 0);

  const saldoLiquidoPeriodo = totalReceitas - totalDespesas;

  return {
    cabecalho: {
      bancoCodigo,
      bancoNome,
      contaCorrente,
      totalTransacoes: transacoes.length,
      timestampImportacao: new Date().toISOString()
    },
    resumoFinanceiro: {
      totalReceitasBrl: Math.round(totalReceitas * 100) / 100,
      totalDespesasBrl: Math.round(totalDespesas * 100) / 100,
      saldoLiquidoBrl: Math.round(saldoLiquidoPeriodo * 100) / 100
    },
    transacoes
  };
}

/**
 * Converte as transações conciliadas diretamente em registros Q100 para o LCDPR SPED
 */
function gerarLancamentosLcdprQ100(transacoesConciliadas, matriculaImovel = '001', cnpjCpfTitular = '00.000.000/0001-99') {
  let saldoAcumulado = 0;

  return transacoesConciliadas.map((t, idx) => {
    saldoAcumulado += t.valorBrl;

    return {
      registro: 'Q100',
      numLinha: idx + 1,
      data: t.data.replace(/-/g, ''), // Formato DDMMAAAA ou AAAAMMDD
      codigoImovel: matriculaImovel,
      codigoConta: t.classificacaoAutomatica.contaLcdpr,
      numeroDocumento: t.fitId.substring(0, 15),
      tipoDocumento: 3, // 3 - Recibo / Extrato Bancário
      historico: t.historicoOriginal.substring(0, 50),
      cnpjCpfParticipante: cnpjCpfTitular,
      tipoLancamento: t.classificacaoAutomatica.tipoOperacaoLcdpr,
      valorEntrada: t.valorBrl > 0 ? t.valorBrl : 0,
      valorSaida: t.valorBrl < 0 ? Math.abs(t.valorBrl) : 0,
      saldoFinalAcumulado: Math.round(saldoAcumulado * 100) / 100,
      statusIntegracao: 'PRONTO_PARA_LIVRO_CAIXA'
    };
  });
}

module.exports = {
  REGRAS_CATEGORIZACAO_AGRO,
  parseOfxContent,
  gerarLancamentosLcdprQ100
};
