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

async function runTests() {
  console.log('🌾 =========================================================================');
  console.log('🌾 TESTE E2E: PLANO SAFRA (MCR), NR-31 / eSOCIAL RURAL E RENOVABIO CBIO');
  console.log('🌾 =========================================================================');

  // TEST 1: Simulação do Plano Safra e Enquadramento PRONAMP
  console.log('\n[1/6] Testando Simulador do Plano Safra (BACEN MCR)...');
  const resSafra = await makeRequest('POST', '/api/v1/credito/plano-safra/simular', {
    receitaBrutaAnualBrl: 2400000.00,
    valorDesejadoBrl: 1000000.00,
    finalidadeSolicitada: 'CUSTEIO_LAVOURA'
  });
  assert.strictEqual(resSafra.status, 200);
  assert.strictEqual(resSafra.data.sucesso, true);
  assert.strictEqual(resSafra.data.enquadramento.linhaCodigo, 'PRONAMP_CUSTEIO');
  assert.strictEqual(resSafra.data.enquadramento.taxaJurosAnualPct, 8.0);
  console.log('  ✅ Enquadramento confirmado:', resSafra.data.enquadramento.linhaNome, '| Taxa:', resSafra.data.enquadramento.taxaJurosAnual);

  // TEST 2: Geração de Dossiê Bancário MCR
  console.log('\n[2/6] Testando Geração de Dossiê Bancário Padronizado MCR...');
  const resDossie = await makeRequest('POST', '/api/v1/credito/dossie/gerar', {
    produtorNome: 'Schneider Agricultura e Pecuária Ltda',
    carNumero: 'MT-5107909-E8192841029',
    areaCultivadaHa: 420.5,
    valorSolicitadoBrl: 1000000.00
  });
  assert.strictEqual(resDossie.status, 200);
  assert.strictEqual(resDossie.data.statusDossie, 'PRONTO_PARA_PROTOCOLO_BANCARIO');
  assert.ok(resDossie.data.protocoloDossie.startsWith('DOSSIE-MCR-'));
  assert.strictEqual(resDossie.data.documentoFormatado.cronogramaDesembolsoBrl.length, 3);
  console.log('  ✅ Dossiê gerado com sucesso. Protocolo:', resDossie.data.protocoloDossie);

  // TEST 3: Auditoria de Conformidade NR-31 em Frentes de Trabalho
  console.log('\n[3/6] Testando Auditoria de Conformidade Trabalhista NR-31...');
  const resNr31 = await makeRequest('POST', '/api/v1/trabalhista/nr31/auditoria', {
    frenteTrabalho: 'Frente Agrícola 01 - Pulverização e Plantio',
    totalTrabalhadoresPresentes: 18,
    itensAuditados: [
      { codigo: 'EPI_COMPLETO_AGROTOXICOS', conforme: true },
      { codigo: 'AREA_VIVENCIA_MOVEL', conforme: true },
      { codigo: 'PROTECAO_CARDAN_TDP', conforme: true }
    ]
  });
  assert.strictEqual(resNr31.status, 200);
  assert.strictEqual(resNr31.data.statusGeral, 'CONFORME_RISCO_ZERO');
  assert.strictEqual(resNr31.data.percentualConformidade, 100.0);
  console.log('  ✅ Auditoria NR-31 concluída. Status:', resNr31.data.statusGeral, '| 100% Conforme');

  // TEST 4: Geração de Evento S-2240 do eSocial Rural
  console.log('\n[4/6] Testando Geração do Evento S-2240 (Condições Ambientais) para eSocial...');
  const resS2240 = await makeRequest('POST', '/api/v1/trabalhista/esocial/evento-s2240', {
    trabalhadorNome: 'Marcos Barreto de Oliveira',
    trabalhadorCpf: '123.456.789-00',
    cargo: 'Operador de Máquinas Agrícolas'
  });
  assert.strictEqual(resS2240.status, 201);
  assert.strictEqual(resS2240.data.eventoCodigo, 'S-2240');
  assert.strictEqual(resS2240.data.statusValidacao, 'VALIDADO_SCHEMA_ESOCIAL_S_01_02_00');
  assert.ok(resS2240.data.xmlEvento.includes('<evtExpRisco Id="ID1'));
  assert.ok(resS2240.data.hashAssinaturaXml.length === 64);
  console.log('  ✅ Evento S-2240 do eSocial gerado no layout S-1.2 com assinatura SHA-256.');

  // TEST 5: Auditoria de Elegibilidade RenovaBio (ANP)
  console.log('\n[5/6] Testando Auditoria de Elegibilidade RenovaBio (Marco Temporal 2018)...');
  const resRenovaEleg = await makeRequest('POST', '/api/v1/renovabio/elegibilidade/auditar', {
    carNumero: 'MT-5107909-E8192841029',
    anoAberturaArea: 2014,
    sobreposicaoTerrasProtegidas: false
  });
  assert.strictEqual(resRenovaEleg.status, 200);
  assert.strictEqual(resRenovaEleg.data.statusElegibilidade, 'FAZENDA_100_PORCENTO_ELEGIVEL_RENOVABIO');
  assert.strictEqual(resRenovaEleg.data.fatorElegibilidadePercentual, 100.0);
  console.log('  ✅ Elegibilidade RenovaBio comprovada: Desmatamento Zero pós-2018 cumprido.');

  // TEST 6: Cálculo de NEEA e Emissão de CBIOs na B3
  console.log('\n[6/6] Testando Cálculo de NEEA e Faturamento com CBIOs na B3...');
  const resCbio = await makeRequest('POST', '/api/v1/renovabio/cbio/calcular-emissao', {
    culturaBiomassa: 'SOJA_PARA_BIODIESEL',
    volumeProducaoTon: 28000.0,
    intensidadeCarbonoAgricolaGCo2Mj: 24.8,
    cotacaoCbioB3Brl: 105.00
  });
  assert.strictEqual(resCbio.status, 200);
  assert.strictEqual(resCbio.data.sucesso, true);
  assert.ok(resCbio.data.calculoNeea.neeaGCo2Mj > 60);
  assert.ok(resCbio.data.saldoCbios.totalCbiosEmitidos > 10000);
  assert.ok(resCbio.data.saldoCbios.receitaLiquidaProdutorBrl > 1000000);
  console.log('  ✅ NEEA Calculada:', resCbio.data.calculoNeea.neeaGCo2Mj, 'g CO2eq/MJ');
  console.log('  ✅ Total de CBIOs emitidos:', resCbio.data.saldoCbios.totalCbiosEmitidos, '| Receita B3: R$', resCbio.data.saldoCbios.receitaLiquidaProdutorBrl);

  console.log('\n🎉 =========================================================================');
  console.log('🎉 TODOS OS TESTES DE PLANO SAFRA, NR-31 E RENOVABIO FORAM APROVADOS (100%)!');
  console.log('🎉 =========================================================================');
}

runTests().catch(err => {
  console.error('\n❌ Erro durante a execução dos testes:', err);
  process.exit(1);
});
