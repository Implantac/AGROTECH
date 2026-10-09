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
  console.log('🌾 TESTE E2E: CPR DIGITAL B3, DEFESA SANITÁRIA (CFO/GTA) & BALANÇO HÍDRICO');
  console.log('🌾 =========================================================================');

  // TEST 1: Cotações em Tempo Real e Relação de Troca Barter
  console.log('\n[1/5] Testando Cotações de Commodities e Relação de Troca Barter...');
  const resCotacoes = await makeRequest('GET', '/api/v1/barter/cotacoes-tempo-real');
  assert.strictEqual(resCotacoes.status, 200);
  assert.ok(resCotacoes.data.mercado.sojaSaca60kgBrl > 100);

  const resBarter = await makeRequest('POST', '/api/v1/barter/relacao-troca/calcular', {
    commodity: 'SOJA',
    insumos: [
      { tipo: 'MAP 11-52-00', quantidadeTon: 150, precoUnitarioTonBrl: 4450.00 },
      { tipo: 'Cloreto de Potássio KCl', quantidadeTon: 100, precoUnitarioTonBrl: 2980.00 }
    ],
    precoPreFixadoSacaBrl: 136.50
  });
  assert.strictEqual(resBarter.status, 200);
  assert.strictEqual(resBarter.data.sucesso, true);
  assert.strictEqual(resBarter.data.valorTotalPacoteInsumosBrl, 965500);
  assert.ok(resBarter.data.totalSacasComprometidas > 7000);
  console.log('  ✅ Barter calculado com sucesso: R$', resBarter.data.valorTotalPacoteInsumosBrl, '-> Sacas:', resBarter.data.totalSacasComprometidas);

  // TEST 2: Emissão de CPR Digital com Registro B3 (Lei 13.986)
  console.log('\n[2/5] Testando Emissão de CPR Digital com Registro na B3...');
  const resCpr = await makeRequest('POST', '/api/v1/barter/cpr/emitir', {
    tipoCpr: 'CPR_FISICA_LIQUIDACAO_PRODUTO',
    produto: 'Soja em Grãos Safra 2025/2026',
    quantidadeSacas: 8000,
    valorReferenciaBrl: 1092000.00,
    dataVencimento: '30/04/2026'
  });
  assert.strictEqual(resCpr.status, 201);
  assert.strictEqual(resCpr.data.sucesso, true);
  assert.strictEqual(resCpr.data.statusRegistro, 'REGISTRADA_E_ATIVA_NA_B3');
  assert.ok(resCpr.data.protocoloRegistroB3.startsWith('B3-REG-'));
  assert.ok(resCpr.data.hashCartulaSha256.length === 64);
  console.log('  ✅ CPR Digital emitida conforme Nova Lei do Agro (Lei 13.986/2020). Protocolo:', resCpr.data.protocoloRegistroB3);

  // TEST 3: Emissão de Certificado Fitossanitário de Origem (CFO / MAPA)
  console.log('\n[3/5] Testando Emissão de Certificado Fitossanitário de Origem (CFO MAPA)...');
  const resCfo = await makeRequest('POST', '/api/v1/sanidade/cfo/emitir', {
    tipo: 'CFO_ORIGEM_PROPRIEDADE',
    produtor: 'Schneider Agricultura e Pecuária Ltda',
    carNumero: 'MT-5107909-E8192841029',
    produtoVegetal: 'Soja em Grãos (Glycine max)',
    volumeCargaKg: 48000
  });
  assert.strictEqual(resCfo.status, 201);
  assert.strictEqual(resCfo.data.statusSanitario, 'APROVADO_TRANSITO_INTERESTADUAL_E_EXPORTACAO');
  assert.ok(resCfo.data.numeroCfo.startsWith('CFO-MT-'));
  assert.strictEqual(resCfo.data.responsavelTecnicoHabilitado.habilitacaoMapaCfo, 'BR-MT-9812-CFO');
  console.log('  ✅ CFO Digital homologado conforme IN MAPA nº 33/2016. Número:', resCfo.data.numeroCfo);

  // TEST 4: Emissão de Guia de Trânsito Animal Eletrônica (e-GTA)
  console.log('\n[4/5] Testando Emissão de e-GTA (Guia de Trânsito Animal MAPA/INDEA)...');
  const resGta = await makeRequest('POST', '/api/v1/sanidade/gta/emitir', {
    especie: 'BOVINA',
    quantidadeAnimais: 90,
    finalidadeTransito: 'ABATE_FRIGORIFICO'
  });
  assert.strictEqual(resGta.status, 201);
  assert.strictEqual(resGta.data.statusEmissao, 'AUTORIZADA_TRANSITO_SANITARIO_VIGENTE');
  assert.ok(resGta.data.numeroGta.startsWith('GTA-MT-'));
  assert.strictEqual(resGta.data.rebanho.quantidadeCabecas, 90);
  console.log('  ✅ e-GTA emitida com sucesso para trânsito sanitário bovino. Número:', resGta.data.numeroGta);

  // TEST 5: Balanço Hídrico Climatológico (Penman-Monteith) & Delta T 15D
  console.log('\n[5/5] Testando Balanço Hídrico FAO-56 Penman-Monteith e Janela Delta T 15D...');
  const resBalanco = await makeRequest('GET', '/api/v1/clima/balanco-hidrico/talhao/talhao-01?cultura=SOJA');
  assert.strictEqual(resBalanco.status, 200);
  assert.strictEqual(resBalanco.data.sucesso, true);
  assert.ok(resBalanco.data.etoReferenciaMmDia >= 2.0 && resBalanco.data.etoReferenciaMmDia <= 7.0);
  assert.ok(resBalanco.data.etcDemandaCulturaMmDia > 0);
  assert.ok(resBalanco.data.perfilSolo.percentualCapacidadePct >= 0);

  const resJanela = await makeRequest('GET', '/api/v1/clima/janela-pulverizacao-15d');
  assert.strictEqual(resJanela.status, 200);
  assert.strictEqual(resJanela.data.totalDiasAnalisados, 15);
  assert.ok(resJanela.data.previsoesDiarias.length === 15);
  assert.ok(resJanela.data.previsoesDiarias[0].deltaTC >= 0);
  console.log('  ✅ Evapotranspiração da Cultura (ETc):', resBalanco.data.etcDemandaCulturaMmDia, 'mm/dia | ETo:', resBalanco.data.etoReferenciaMmDia, 'mm/dia');
  console.log('  ✅ Janela de pulverização 15D calculada com índice Delta T (ASABE S572.1). Dias ideais:', resJanela.data.diasIdeaisParaPulverizacao);

  console.log('\n🎉 =========================================================================');
  console.log('🎉 TODOS OS TESTES DE CPR B3, DEFESA SANITÁRIA E CLIMA PASSARAM (100%)!');
  console.log('🎉 =========================================================================');
}

runTests().catch(err => {
  console.error('\n❌ Erro durante a execução dos testes:', err);
  process.exit(1);
});
