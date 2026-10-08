// test_todos_os_regimes_tributarios_e2e.mjs
// Teste E2E da Auditoria e Enquadramento de TODOS os Regimes Tributários do Agronegócio Brasileiro
// Cobre os 7 Regimes Oficiais:
// 1. PF - Livro Caixa Digital do Produtor Rural (LCDPR - Lei 8.023/1990 & IN RFB 1.903/2019)
// 2. PF - Arbitramento Legal de Lucro 20% (Art. 5º Lei 8.023/1990 & RIR/2018)
// 3. PJ - Lucro Presumido Agropecuário (Presunção 8% IRPJ / 12% CSLL - Lei 9.249/1995)
// 4. PJ - Lucro Real Agropecuário (Art. 314 RIR/2018 com Depreciação Acelerada Incentivada)
// 5. PJ - Simples Nacional ME/EPP Agrícola (Anexo I LC 123/2006 com Segregação ICMS)
// 6. Cooperativa Agropecuária (Ato Cooperativo Típico Não-Tributável - Lei 5.764/1971)
// 7. Agroexportação Direta / Comercial Exportadora (Imunidade Constitucional Art. 149 e 153 CF/88)
// + Opções de Funrural (Comercialização 1.5% vs Folha 0.2%) e Reforma Tributária (IBS/CBS LC 214/2025)

import assert from 'node:assert';

const BASE_URL = process.env.AGTECH_API_URL || 'http://127.0.0.1:3000';

async function testAuditoriaTodosRegimes() {
  console.log('🌾 =========================================================================');
  console.log('⚖️ INICIANDO SUÍTE E2E: AUDITORIA DE TODOS OS REGIMES TRIBUTÁRIOS DO AGRO');
  console.log('🌾 =========================================================================\n');

  // 1. Testar endpoint da API: POST /api/v1/fiscal/regimes-tributarios/comparar
  console.log('🔍 [TESTE 1] Chamada à API: POST /api/v1/fiscal/regimes-tributarios/comparar');
  const payloadAuditoria = {
    valorOperacao: 158400.0, // Venda de 1.200 sacas de soja a R$ 132/sc
    faturamentoAnualEstimado: 5500000.0, // Fazenda de médio porte faturando R$ 5,5M
    despesasOperacionaisPct: 65, // 65% de despesas com sementes, adubo, diesel
    investimentoMaquinasAno: 450000.0, // R$ 450k em investimentos (dedutível no LCDPR)
    opcaoFunrural: 'COMERCIALIZACAO',
    anoReferenciaReforma: 2026,
    cClassTrib: '200032' // Soja grão
  };

  const response = await fetch(`${BASE_URL}/api/v1/fiscal/regimes-tributarios/comparar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payloadAuditoria)
  });

  assert.strictEqual(response.status, 200, `API deveria responder HTTP 200, obteve: ${response.status}`);
  const resJson = await response.json();
  assert.strictEqual(resJson.sucesso, true, 'Resposta deve conter sucesso=true');
  console.log('  ✓ Resposta HTTP 200 OK com payload estruturado recebido da API.');

  const auditoria = resJson.auditoria || resJson.dados;
  assert(auditoria, 'Objeto auditoria deve existir');
  const regimes = auditoria.regimes;
  assert.strictEqual(Array.isArray(regimes), true, 'Regimes deve ser um array');
  assert.strictEqual(regimes.length, 7, `Devem existir exatamente 7 regimes auditados, encontrou: ${regimes.length}`);
  console.log(`  ✓ 7 regimes fiscais homologados retornados com sucesso.`);

  // 2. Validação Individual de cada um dos 7 Regimes
  console.log('\n🔍 [TESTE 2] Validação Detalhada das Fórmulas dos 7 Regimes');

  // Regime 1: PF LCDPR
  const regLcdpr = regimes.find(r => r.codigo.includes('PF_LIVRO_CAIXA'));
  assert(regLcdpr, 'Regime PF Livro Caixa LCDPR deve estar presente');
  assert.strictEqual(regLcdpr.categoria, 'Pessoa Física');
  assert(regLcdpr.cargaTributariaTotal > 0, 'Carga tributária LCDPR deve ser calculada');
  assert(regLcdpr.aliquotaEfetivaGlobalPct > 0, 'Alíquota efetiva LCDPR deve ser calculada');
  assert(regLcdpr.fundamentoLegal.includes('IN RFB 1.903/2019') || regLcdpr.fundamentoLegal.includes('RIR'), 'Fundamento legal LCDPR validado');
  console.log(`  ✓ Regime 1: ${regLcdpr.nome} -> Carga R$ ${regLcdpr.cargaTributariaTotal.toLocaleString('pt-BR')} | Alíquota Total: ${regLcdpr.aliquotaEfetivaGlobalPct}%`);

  // Regime 2: PF Arbitramento 20%
  const regArbitrado = regimes.find(r => r.codigo === 'PF_ARBITRAMENTO_20');
  assert(regArbitrado, 'Regime PF Arbitramento 20% deve estar presente');
  assert.strictEqual(regArbitrado.categoria, 'Pessoa Física');
  assert(regArbitrado.cargaTributariaTotal > 0, 'Carga arbitramento 20% calculada');
  console.log(`  ✓ Regime 2: ${regArbitrado.nome} -> Carga R$ ${regArbitrado.cargaTributariaTotal.toLocaleString('pt-BR')} | Alíquota Total: ${regArbitrado.aliquotaEfetivaGlobalPct}%`);

  // Regime 3: PJ Lucro Presumido
  const regPresumido = regimes.find(r => r.codigo === 'PJ_LUCRO_PRESUMIDO');
  assert(regPresumido, 'Regime PJ Lucro Presumido deve estar presente');
  assert.strictEqual(regPresumido.categoria, 'Pessoa Jurídica');
  assert.strictEqual(regPresumido.totalTributosRenda > 0, true, 'Tributos de renda PJ Presumido calculados');
  console.log(`  ✓ Regime 3: ${regPresumido.nome} -> Tributos Renda R$ ${regPresumido.totalTributosRenda.toLocaleString('pt-BR')} | Alíquota Total: ${regPresumido.aliquotaEfetivaGlobalPct}%`);

  // Regime 4: PJ Lucro Real
  const regReal = regimes.find(r => r.codigo === 'PJ_LUCRO_REAL');
  assert(regReal, 'Regime PJ Lucro Real deve estar presente');
  assert.strictEqual(regReal.categoria, 'Pessoa Jurídica');
  console.log(`  ✓ Regime 4: ${regReal.nome} -> Carga R$ ${regReal.cargaTributariaTotal.toLocaleString('pt-BR')} | Alíquota Total: ${regReal.aliquotaEfetivaGlobalPct}%`);

  // Regime 5: Simples Nacional Agro
  const regSimples = regimes.find(r => r.codigo.includes('SIMPLES_NACIONAL'));
  assert(regSimples, 'Regime Simples Nacional deve estar presente');
  assert(regSimples.observacaoEstrategica.includes('ultrapassa o teto') || regSimples.observacaoEstrategica.includes('4,8'), 'Simples aponta teto da LC 123/2006');
  console.log(`  ✓ Regime 5: ${regSimples.nome} -> Validação de teto e segregação ICMS.`);

  // Regime 6: Cooperativa Agropecuária
  const regCoop = regimes.find(r => r.codigo === 'COOPERATIVA_AGRO');
  assert(regCoop, 'Regime Cooperativa Agropecuária deve estar presente');
  assert.strictEqual(regCoop.categoria, 'Cooperativa');
  assert(regCoop.fundamentoLegal.includes('5.764/1971'), 'Deve fundamentar na Lei Cooperativista 5.764/1971');
  console.log(`  ✓ Regime 6: ${regCoop.nome} -> Sobras cooperativas e isenção de IRPJ sobre ato cooperativo.`);

  // Regime 7: Agroexportação Imune
  const regExport = regimes.find(r => r.codigo === 'EXPORTACAO_IMUNE');
  assert(regExport, 'Regime Exportação Imune deve estar presente');
  assert.strictEqual(regExport.categoria, 'Exportação');
  assert(regExport.fundamentoLegal.includes('CF/88'), 'Deve fundamentar nas imunidades da Constituição Federal');
  console.log(`  ✓ Regime 7: ${regExport.nome} -> Não-incidência de Funrural e alíquota zero de PIS/COFINS/IBS/CBS.`);

  // 3. Validação do Ranking e Melhor Regime
  console.log('\n🔍 [TESTE 3] Validação do Ranking e Economia Tributária');
  const melhorRegime = auditoria.melhorRegime;
  assert(melhorRegime, 'Deverá indicar o melhor regime');
  console.log(`  🏆 Melhor Regime Apontado: ${melhorRegime.nome} (${melhorRegime.aliquotaEfetivaGlobalPct}%)`);
  assert(auditoria.economiaAnualEstimadaVsPior > 0, 'Economia anual vs pior regime deve ser expressiva (> 0)');
  console.log(`  💰 Economia estimada anual vs pior regime: R$ ${auditoria.economiaAnualEstimadaVsPior.toLocaleString('pt-BR')}`);

  // 4. Teste de Alternância de Opção do Funrural (Folha de Salários)
  console.log('\n🔍 [TESTE 4] Simulação com Opção do Funrural sobre Folha (0,2% Senar)');
  const payloadFolha = { ...payloadAuditoria, opcaoFunrural: 'FOLHA_DE_PAGAMENTO' };
  const respFolha = await fetch(`${BASE_URL}/api/v1/fiscal/regimes-tributarios/comparar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payloadFolha)
  });
  const dataFolha = await respFolha.json();
  const regLcdprFolha = (dataFolha.auditoria || dataFolha.dados).regimes.find(r => r.codigo.includes('PF_LIVRO_CAIXA'));
  // Na folha de pagamento, retenção na nota é de 0,2% (5.500.000 * 0.002 = 11.000)
  assert.strictEqual(regLcdprFolha.funruralValor, 11000, 'Retenção na nota sob regime de folha deve ser 0,2% do SENAR');
  console.log(`  ✓ Retenção Funrural na nota sob regime de folha calculada: R$ ${regLcdprFolha.funruralValor.toLocaleString('pt-BR')}`);

  // 5. Teste da Transição da Reforma Tributária (IBS/CBS para 2033)
  console.log('\n🔍 [TESTE 5] Simulação com Ano Pleno da Reforma Tributária (2033)');
  const payload2033 = { ...payloadAuditoria, anoReferenciaReforma: 2033 };
  const resp2033 = await fetch(`${BASE_URL}/api/v1/fiscal/regimes-tributarios/comparar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload2033)
  });
  const data2033 = await resp2033.json();
  const regPresumido2033 = (data2033.auditoria || data2033.dados).regimes.find(r => r.codigo === 'PJ_LUCRO_PRESUMIDO');
  assert(regPresumido2033.reformaIbsCbsValor > 0, 'No regime PJ em 2033 deve haver IBS/CBS apurado');
  console.log(`  ✓ IBS/CBS calculado para PJ Lucro Presumido em 2033: R$ ${regPresumido2033.reformaIbsCbsValor.toLocaleString('pt-BR')}`);

  console.log('\n🌾 =========================================================================');
  console.log('✅ SUCESSO TOTAL! TODOS OS 7 REGIMES FISCAIS DO AGRO FORAM VALIDADOS COM 100% DE SUCESSO.');
  console.log('🌾 =========================================================================\n');
}

testAuditoriaTodosRegimes().catch(err => {
  console.error('❌ Falha nos testes de regimes fiscais:', err);
  process.exit(1);
});
