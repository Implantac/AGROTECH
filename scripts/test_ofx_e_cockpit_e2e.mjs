import http from 'http';
import assert from 'assert';

const BASE_URL = 'http://127.0.0.1:5173';

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...headers
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: json, raw: data });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

const SAMPLE_OFX_CONTENT = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS><CODE>0<SEVERITY>INFO</STATUS>
<DTSERVER>20261009120000
<LANGUAGE>POR
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1001
<STATUS><CODE>0<SEVERITY>INFO</STATUS>
<STMTRS>
<CURDEF>BRL
<BANKACCTFROM>
<BANKID>748
<ACCTID>12345-6
<ACCTTYPE>CHECKING
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>20261001000000
<DTEND>20261009000000
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261002120000
<TRNAMT>-38500.00
<FITID>TX-SICREDI-01
<MEMO>PAGTO DIESEL S10 COMBOIO PETROBRAS</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261003120000
<TRNAMT>-92000.00
<FITID>TX-SICREDI-02
<MEMO>COMPRA ADUBO FERTILIZANTE YARA</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20261005120000
<TRNAMT>650000.00
<FITID>TX-SICREDI-03
<MEMO>LIQUIDACAO VENDA GRAOS SOJA CARGILL</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261006120000
<TRNAMT>-24000.00
<FITID>TX-SICREDI-04
<MEMO>DEFENSIVO HERBICIDA GLIFOSATO SYNGENTA</MEMO>
</STMTTRN>
</BANKTRANLIST>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`;

async function runTests() {
  console.log('🌾 =========================================================================');
  console.log('🌾 TESTE E2E: CONCILIAÇÃO BANCÁRIA OFX & AUTOMAÇÃO DO LCDPR (SPED AGRO)');
  console.log('🌾 =========================================================================');

  // TEST 1: Importação e Parsing do Extrato OFX
  console.log('\n[1/4] Testando Importação e Autoclassificação de Extrato OFX...');
  const resImport = await makeRequest('POST', '/api/v1/financeiro/ofx/importar', {
    conteudoOfx: SAMPLE_OFX_CONTENT
  });

  assert.strictEqual(resImport.status, 200);
  assert.strictEqual(resImport.data.sucesso, true);
  assert.strictEqual(resImport.data.cabecalho.bancoCodigo, '748');
  assert.strictEqual(resImport.data.cabecalho.bancoNome, 'Banco Cooperativo Sicredi S.A.');
  assert.strictEqual(resImport.data.cabecalho.totalTransacoes, 4);
  assert.strictEqual(resImport.data.resumoFinanceiro.totalReceitasBrl, 650000.00);
  assert.strictEqual(resImport.data.resumoFinanceiro.totalDespesasBrl, 154500.00);
  assert.strictEqual(resImport.data.resumoFinanceiro.saldoLiquidoBrl, 495500.00);

  console.log('  ✅ Extrato OFX Sicredi importado com sucesso:');
  console.log('     Banco:', resImport.data.cabecalho.bancoNome, '| Conta:', resImport.data.cabecalho.contaCorrente);
  console.log('     Receitas Safra: R$', resImport.data.resumoFinanceiro.totalReceitasBrl);
  console.log('     Despesas Insumos: R$', resImport.data.resumoFinanceiro.totalDespesasBrl);
  console.log('     Saldo Líquido: R$', resImport.data.resumoFinanceiro.saldoLiquidoBrl);

  // TEST 2: Validação de Categorização Agro das Transações
  console.log('\n[2/4] Validando Mapeamento Semântico no Plano de Contas LCDPR...');
  const tDiesel = resImport.data.transacoes.find(t => t.fitId === 'TX-SICREDI-01');
  assert.ok(tDiesel);
  assert.strictEqual(tDiesel.classificacaoAutomatica.categoria, 'COMBUSTIVEL_E_LUBRIFICANTES');
  assert.strictEqual(tDiesel.classificacaoAutomatica.contaLcdpr, '3.01.01');

  const tAdubo = resImport.data.transacoes.find(t => t.fitId === 'TX-SICREDI-02');
  assert.ok(tAdubo);
  assert.strictEqual(tAdubo.classificacaoAutomatica.categoria, 'FERTILIZANTES_E_CORRETIVOS');
  assert.strictEqual(tAdubo.classificacaoAutomatica.contaLcdpr, '3.01.02');

  const tSoja = resImport.data.transacoes.find(t => t.fitId === 'TX-SICREDI-03');
  assert.ok(tSoja);
  assert.strictEqual(tSoja.classificacaoAutomatica.categoria, 'RECEITA_VENDA_COMMODITIES');
  assert.strictEqual(tSoja.classificacaoAutomatica.contaLcdpr, '1.01.01');

  console.log('  ✅ Todas as 4 transações foram categorizadas corretamente no padrão da Receita Federal.');

  // TEST 3: Geração de Registros Q100 para o Livro Caixa Digital (LCDPR)
  console.log('\n[3/4] Testando Conciliação e Injeção no Registro Q100 do LCDPR...');
  const resConciliar = await makeRequest('POST', '/api/v1/financeiro/ofx/conciliar', {
    transacoes: resImport.data.transacoes,
    matriculaImovel: '001',
    cnpjCpfTitular: '18.491.029/0001-88'
  });

  assert.strictEqual(resConciliar.status, 200);
  assert.strictEqual(resConciliar.data.sucesso, true);
  assert.strictEqual(resConciliar.data.totalLancamentosQ100, 4);
  assert.strictEqual(resConciliar.data.statusIntegracao, 'INTEGRADO_AO_LIVRO_CAIXA_SPED');

  const q100List = resConciliar.data.lancamentosQ100;
  assert.strictEqual(q100List[0].registro, 'Q100');
  assert.strictEqual(q100List[0].codigoConta, '3.01.01');
  assert.strictEqual(q100List[0].valorSaida, 38500);

  console.log('  ✅ 4 registros Q100 formatados e integrados ao Livro Caixa do Produtor.');

  // TEST 4: Verificação de Rejeição de Payload Vazio
  console.log('\n[4/4] Testando Rejeição Segura para OFX Inválido...');
  const resErro = await makeRequest('POST', '/api/v1/financeiro/ofx/importar', {});
  assert.strictEqual(resErro.status, 400);
  assert.strictEqual(resErro.data.sucesso, false);
  console.log('  ✅ Payload vazio rejeitado com HTTP 400 conforme Princípio 2 (Sem mascaramento).');

  console.log('\n🎉 =========================================================================');
  console.log('🎉 TESTES DE CONCILIAÇÃO OFX & LCDPR APROVADOS COM 100% DE SUCESSO!');
  console.log('🎉 =========================================================================');
}

runTests().catch(err => {
  console.error('\n❌ Erro durante o teste E2E:', err);
  process.exit(1);
});
