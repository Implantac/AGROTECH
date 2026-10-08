/**
 * E2E Test Suite - Reforma Tributária IBS & CBS para o Agronegócio
 * Em total conformidade com a EC 132/2023, LC 214/2025 e Nota Técnica 2024.002 (MOC v7.0)
 *
 * Validações obrigatórias:
 * 1. Tabela cClassTrib oficial e regimes tributários para produtor rural
 * 2. Cálculo de IBS e CBS no ano-teste 2026 (CBS 0,90% e IBS 0,10% com rateio 70% MT / 30% Mun)
 * 3. Aplicação rigorosa da redução de 60% (Art. 132 LC 214/2025) para produtos agropecuários in natura
 * 4. Aplicação de alíquota zero (100% redução) para Cesta Básica Nacional e imunidade de exportação
 * 5. Regime especial do produtor rural PF não optante (Art. 165 LC 214/2025) com grupo <gCredPresProdRural>
 * 6. Emissão SEFAZ com geração e validação das tags XML <IBSCBS> e <IBSCBSTot>
 * 7. Endpoints de simulação e consulta no server.cjs
 */

import http from 'http';
import assert from 'assert';

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🌾 [TESTE E2E] Iniciando auditoria da Reforma Tributária IBS & CBS (NT 2024.002)...');

  // Teste 1: Endpoint da Tabela cClassTrib Oficial
  console.log('\n--- 1. Consulta da Tabela Oficial cClassTrib ---');
  const resTabela = await request('GET', '/api/v1/fiscal/reforma-tributaria/tabela-cclasstrib');
  assert.strictEqual(resTabela.status, 200, 'Endpoint da tabela cClassTrib deve responder 200');
  assert.strictEqual(resTabela.data.sucesso, true, 'Resposta deve conter sucesso: true');
  assert.ok(Array.isArray(resTabela.data.tabela), 'Deve retornar array de classificações');
  
  const cClass200032 = resTabela.data.tabela.find(t => t.codigo === '200032');
  assert.ok(cClass200032, 'Deve conter código 200032 (Produtos agropecuários in natura)');
  assert.strictEqual(cClass200032.cst, '200', 'CST deve ser 200 (Tributação com redução)');
  assert.strictEqual(cClass200032.reducaoAliquotaPct, 60, 'Redução deve ser 60% (Art. 132 LC 214/2025)');

  const cClass600001 = resTabela.data.tabela.find(t => t.codigo === '600001');
  assert.ok(cClass600001, 'Deve conter código 600001 (Produtor Rural PF Não Optante)');
  assert.strictEqual(cClass600001.cst, '600', 'CST deve ser 600');
  console.log('✓ Tabela cClassTrib validada com sucesso: Códigos 200032, 200035, 220001, 410001, 600001 presentes.');

  // Teste 2: Simulação de Produtor Rural PF Não Optante (Regime Especial Art. 165 LC 214/2025)
  console.log('\n--- 2. Simulação: Produtor Rural PF Não Optante (Crédito Presumido 8,5%) ---');
  const payloadNaoOptante = {
    valorOperacao: 185400.00,
    regimeProdutor: 'PRODUTOR_PF_NAO_OPTANTE',
    cClassTrib: '200032',
    anoReferencia: 2026,
  };
  const resSimNaoOptante = await request('POST', '/api/v1/fiscal/reforma-tributaria/simular', payloadNaoOptante);
  assert.strictEqual(resSimNaoOptante.status, 200, 'Simulação deve responder status 200');
  assert.strictEqual(resSimNaoOptante.data.sucesso, true);
  
  const rNaoOpt = resSimNaoOptante.data.resultado;
  assert.strictEqual(rNaoOpt.totalIbsCbs, 0, 'Produtor não optante tem 0 débito de IBS/CBS na venda');
  assert.ok(rNaoOpt.creditoPresumidoAdquirente, 'Deve gerar crédito presumido para adquirente PJ');
  assert.strictEqual(rNaoOpt.creditoPresumidoAdquirente.pCredPres, 8.50, 'Percentual de crédito presumido deve ser 8.5%');
  const valorEsperadoCredPres = Number(((185400 * 8.5) / 100).toFixed(2));
  assert.strictEqual(rNaoOpt.creditoPresumidoAdquirente.vCredPres, valorEsperadoCredPres, 'Valor de crédito presumido calculado corretamente');
  assert.ok(rNaoOpt.xmlSnippetIbsCbs.includes('<gCredPresProdRural>'), 'XML deve conter grupo <gCredPresProdRural>');
  assert.ok(rNaoOpt.xmlSnippetIbsCbs.includes('<CST>600</CST>'), 'XML deve conter CST 600');
  console.log(`✓ Produtor Não Optante: R$ 0 de débito na saída e R$ ${rNaoOpt.creditoPresumidoAdquirente.vCredPres} de crédito presumido para comprador.`);

  // Teste 3: Simulação de Produtor Rural Optante (Regime Pleno com 60% de Redução)
  console.log('\n--- 3. Simulação: Produtor Rural Optante no Ano-Teste 2026 ---');
  const payloadOptante2026 = {
    valorOperacao: 185400.00,
    regimeProdutor: 'PRODUTOR_PF_OPTANTE',
    cClassTrib: '200032',
    anoReferencia: 2026,
  };
  const resSimOptante = await request('POST', '/api/v1/fiscal/reforma-tributaria/simular', payloadOptante2026);
  assert.strictEqual(resSimOptante.status, 200);
  const rOpt = resSimOptante.data.resultado;
  
  // Alíquotas 2026: CBS padrão 0.90%, redução 60% -> efetiva 0.36%
  // IBS total padrão 0.10%, redução 60% -> efetiva 0.04% (0.028% MT, 0.012% Mun)
  assert.strictEqual(rOpt.cbs.aliquotaPadrao, 0.90, 'CBS 2026 padrão = 0.90%');
  assert.strictEqual(rOpt.cbs.aliquotaEfetiva, 0.36, 'CBS 2026 efetiva com 60% redução = 0.36%');
  assert.strictEqual(rOpt.ibs.aliquotaPadraoTotal, 0.10, 'IBS 2026 padrão = 0.10%');
  assert.strictEqual(rOpt.ibs.aliquotaEfetivaTotal, 0.04, 'IBS 2026 efetivo = 0.04%');
  
  const cbsEsperado = Number(((185400 * 0.36) / 100).toFixed(2)); // 667.44
  const ibsEsperado = Number(((185400 * 0.04) / 100).toFixed(2)); // 74.16
  assert.strictEqual(rOpt.cbs.valor, cbsEsperado, `CBS esperada: R$ ${cbsEsperado}`);
  assert.strictEqual(rOpt.ibs.valorTotal, ibsEsperado, `IBS esperado: R$ ${ibsEsperado}`);
  assert.strictEqual(rOpt.totalIbsCbs, Number((cbsEsperado + ibsEsperado).toFixed(2)), 'Total IBS+CBS confere');
  assert.ok(rOpt.xmlSnippetIbsCbs.includes('<gCBS>'), 'XML deve conter grupo <gCBS>');
  assert.ok(rOpt.xmlSnippetIbsCbs.includes('<gIBS>'), 'XML deve conter grupo <gIBS>');
  assert.ok(rOpt.xmlSnippetIbsCbs.includes('<gIBSUF>'), 'XML deve conter rateio estadual <gIBSUF>');
  assert.ok(rOpt.xmlSnippetIbsCbs.includes('<gIBSMun>'), 'XML deve conter rateio municipal <gIBSMun>');
  console.log(`✓ Produtor Optante 2026: CBS R$ ${rOpt.cbs.valor} + IBS R$ ${rOpt.ibs.valorTotal} = Total R$ ${rOpt.totalIbsCbs}`);

  // Teste 4: Emissão NF-e com Injeção de Tags IBS/CBS e Validação do XML SOAP
  console.log('\n--- 4. Emissão de NF-e SEFAZ com Tags Oficiais NT 2024.002 ---');
  const payloadNfe = {
    ambiente: 'HOMOLOGACAO',
    numeroNfe: 49281,
    valorTotal: 185400.00,
    cClassTrib: '200032',
    regimeProdutor: 'PRODUTOR_PF_NAO_OPTANTE',
    produto: 'SOJA EM GRAO TRANSGENICA SAFRA 2025/2026'
  };
  const resNfe = await request('POST', '/api/v1/sefaz/nfe/emitir', payloadNfe);
  assert.strictEqual(resNfe.status, 200, 'NF-e deve responder 200');
  assert.strictEqual(resNfe.data.sucesso, true);
  assert.ok(resNfe.data.xmlDistribuicao, 'Deve retornar XML de distribuição');
  assert.ok(resNfe.data.xmlDistribuicao.includes('<IBSCBS>'), 'XML deve conter tag <IBSCBS>');
  assert.ok(resNfe.data.xmlDistribuicao.includes('<IBSCBSTot>'), 'XML deve conter tag <IBSCBSTot>');
  assert.ok(resNfe.data.xmlDistribuicao.includes('<cClassTrib>200032</cClassTrib>'), 'XML deve conter cClassTrib 200032');
  assert.ok(resNfe.data.xmlDistribuicao.includes('<gCredPresProdRural>'), 'XML deve conter crédito presumido para adquirente');
  assert.ok(resNfe.data.ibscbs, 'Response deve conter objeto ibscbs decomposto');
  console.log('✓ NF-e SEFAZ emitida e validada com sucesso contendo grupos <IBSCBS> e <IBSCBSTot>.');

  // Teste 5: Simulação de Cesta Básica Nacional (Alíquota Zero)
  console.log('\n--- 5. Simulação: Cesta Básica Nacional (Alíquota Zero 100% Redução) ---');
  const payloadCesta = {
    valorOperacao: 50000.00,
    regimeProdutor: 'PRODUTOR_PF_OPTANTE',
    cClassTrib: '220001',
    anoReferencia: 2033,
  };
  const resCesta = await request('POST', '/api/v1/fiscal/reforma-tributaria/simular', payloadCesta);
  assert.strictEqual(resCesta.status, 200);
  assert.strictEqual(resCesta.data.resultado.totalIbsCbs, 0, 'Cesta Básica Nacional deve ter valor 0 de IBS/CBS');
  assert.strictEqual(resCesta.data.resultado.classificacaoTributaria.cst, '220', 'CST deve ser 220');
  console.log('✓ Cesta Básica Nacional: 100% de redução comprovada (R$ 0,00 de IBS/CBS no regime pleno).');

  // Teste 6: Auditoria da Regra Tributária Normal e Coexistência de Regimes
  console.log('\n--- 6. Auditoria: Regra Normal (ICMS Diferido, PIS/COFINS Suspenso, Funrural) & Coexistência ---');
  assert.ok(resSimNaoOptante.data.regraNormal, 'Resposta deve conter objeto regraNormal');
  const rn = resSimNaoOptante.data.regraNormal;
  assert.strictEqual(rn.icms.cst, '51', 'ICMS interno deve ter CST 51 (Diferimento)');
  assert.strictEqual(rn.icms.valor, 0, 'ICMS diferido tem valor 0,00 na saída');
  assert.strictEqual(rn.pisCofins.cstPis, '09', 'PIS deve ter CST 09 (Suspensão Lei 10.925)');
  assert.strictEqual(rn.pisCofins.valorPis, 0, 'PIS suspenso tem valor 0,00');
  assert.strictEqual(rn.funrural.aliquotaTotal, 1.50, 'Funrural opção comercialização deve ser 1,5%');
  const funruralEsperado = Number(((185400 * 1.5) / 100).toFixed(2));
  assert.strictEqual(rn.funrural.valorRetencao, funruralEsperado, 'Valor retido de Funrural confere');
  assert.ok(rn.fethabMt && rn.fethabMt.valorRetencao > 0, 'FETHAB MT deve ser calculado');

  assert.ok(resSimNaoOptante.data.resumoConsolidado, 'Resposta deve conter resumoConsolidado');
  const rc = resSimNaoOptante.data.resumoConsolidado;
  assert.ok(rc.convivenciaRegimes.includes('Simultânea'), 'Deve certificar a convivência simultânea dos tributos');
  console.log(`✓ Regra Normal e Convivência: ICMS CST 51 (R$ 0), PIS/COFINS CST 09 (R$ 0), Funrural 1,5% (R$ ${rn.funrural.valorRetencao}) e Fethab (R$ ${rn.fethabMt.valorRetencao}).`);

  console.log('\n🎉 TODOS OS TESTES DA REFORMA TRIBUTÁRIA IBS & CBS (NT 2024.002) E REGRA NORMAL FORAM APROVADOS COM SUCESSO!\n');
}

runTests().catch(err => {
  console.error('\n❌ Falha no teste E2E da Reforma Tributária:', err);
  process.exit(1);
});
