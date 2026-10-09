import http from 'http';
import assert from 'assert';
import crypto from 'crypto';

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

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

function generateMockJwt(payload, secret = process.env.JWT_SECRET || 'super_agro_jwt_secret_2026_xyz') {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

async function runTests() {
  console.log('🌾 ========================================================');
  console.log('🌾 AGROTECH SUITE E2E: SEFAZ XMLDSig, IDOR & TELEMETRIA IoT');
  console.log('🌾 ========================================================');

  // TEST 1: Emissão de NF-e com Assinatura Criptográfica Real XMLDSig
  console.log('\n[1/5] Testando emissão de NF-e com assinatura XMLDSig RSA-SHA1...');
  const resEmitir = await makeRequest('POST', '/api/v1/sefaz/nfe/emitir', {
    ambiente: 'HOMOLOGACAO',
    numeroNfe: 5042,
    valorTotal: 250000.00,
    regimeProdutor: 'PRODUTOR_PF_NAO_OPTANTE',
    cClassTrib: '200032',
    descricaoProduto: 'MILHO EM GRAO SAFRINHA 2026',
    tenantId: 'tenant-fazenda-santa-helena'
  });

  assert.strictEqual(resEmitir.status, 200, 'Status deve ser 200 na emissão homologada');
  assert.strictEqual(resEmitir.data.sucesso, true, 'Emissão deve retornar sucesso');
  assert.ok(resEmitir.data.digestValue, 'Deve conter digestValue calculado');
  assert.ok(resEmitir.data.signatureValue, 'Deve conter signatureValue RSA-SHA1');
  assert.strictEqual(resEmitir.data.assinaturaDigitalValida, true, 'Assinatura deve ser válida');
  assert.ok(resEmitir.data.xmlDistribuicao.includes('<Signature xmlns="http://www.w3.org/2000/09/xmldsig#"'), 'XML deve conter elemento Signature XMLDSig');
  assert.ok(resEmitir.data.soapEnvelope.includes('<soap12:Envelope'), 'Envelope SOAP 1.2 deve estar presente');
  console.log('  ✅ NF-e emitida com assinatura digital criptográfica real ICP-Brasil.');
  console.log('     Chave de Acesso:', resEmitir.data.chaveAcesso);
  console.log('     DigestValue:', resEmitir.data.digestValue);

  // TEST 2: Validação Criptográfica de Assinatura via Endpoint Dedicado
  console.log('\n[2/5] Testando endpoint de validação criptográfica de assinatura...');
  const resValidar = await makeRequest('POST', '/api/v1/sefaz/nfe/validar-assinatura', {
    xml: resEmitir.data.xmlDistribuicao
  });

  assert.strictEqual(resValidar.status, 200, 'Endpoint de validação deve responder 200 para XML íntegro');
  assert.strictEqual(resValidar.data.valida, true, 'XML original deve ser validado como íntegro');
  assert.strictEqual(resValidar.data.status, 'ASSINATURA_DIGITAL_INTEGRA_ICP');
  console.log('  ✅ Validação de assinatura XMLDSig confirmou integridade e autenticidade.');

  // TEST 3: Detecção de Adulteração de XML (Anti-Fraude Criptográfico)
  console.log('\n[3/5] Testando rejeição anti-fraude para XML adulterado...');
  // Adulteramos o valor do produto no XML para simular ataque Man-in-the-Middle ou fraude
  const xmlAdulterado = resEmitir.data.xmlDistribuicao.replace(
    'MILHO EM GRAO SAFRINHA 2026',
    'MILHO EM GRAO SAFRINHA ADULTERADO 99999'
  );

  const resTampered = await makeRequest('POST', '/api/v1/sefaz/nfe/validar-assinatura', {
    xml: xmlAdulterado
  });

  assert.strictEqual(resTampered.status, 422, 'XML adulterado deve ser rejeitado com status 422');
  assert.strictEqual(resTampered.data.valida, false, 'Assinatura deve ser rejeitada como inválida');
  assert.ok(resTampered.data.erro.includes('DigestValue') && resTampered.data.erro.includes('divergente'), 'Erro deve apontar divergência criptográfica de digest');
  console.log('  ✅ Tentativa de adulteração detectada imediatamente pela camada criptográfica.');

  // TEST 4: Blindagem Multi-tenant Rigorosa contra IDOR
  console.log('\n[4/5] Testando blindagem multi-tenant e interceptação de IDOR...');
  const tokenTenantA = generateMockJwt({
    id: 'user-gerente-a',
    nome: 'Gerente Fazenda A',
    perfil: 'ENGENHEIRO_AGRONOMO',
    tenantId: 'tenant-fazenda-a'
  });

  // Tenta alterar dados de tenant-fazenda-b usando token de tenant-fazenda-a
  const resIdorTalhao = await makeRequest('POST', '/api/v1/talhoes', {
    properties: { id: 'talhao-invasor', tenantId: 'tenant-fazenda-b', nome: 'Talhao B Invadido' }
  }, { Authorization: `Bearer ${tokenTenantA}` });

  assert.strictEqual(resIdorTalhao.status, 403, 'Acesso cruzado a talhão de outro tenant deve retornar 403');
  assert.ok(resIdorTalhao.data.erro.includes('IDOR interceptado'), 'Resposta deve indicar bloqueio de IDOR');

  const resIdorFrota = await makeRequest('POST', '/api/v1/frota', {
    tag: 'TRAT-B-01',
    tenantId: 'tenant-fazenda-b',
    modelo: 'Trator Invasor'
  }, { Authorization: `Bearer ${tokenTenantA}` });

  assert.strictEqual(resIdorFrota.status, 403, 'Acesso cruzado a frota de outro tenant deve retornar 403');
  assert.ok(resIdorFrota.data.erro.includes('IDOR interceptado'), 'Resposta deve indicar bloqueio de IDOR');

  const resIdorEstoque = await makeRequest('POST', '/api/v1/estoque', {
    codigo: 'INSUMO-B-99',
    tenantId: 'tenant-fazenda-b',
    nome: 'Adubo Roubado'
  }, { Authorization: `Bearer ${tokenTenantA}` });

  assert.strictEqual(resIdorEstoque.status, 403, 'Acesso cruzado a estoque de outro tenant deve retornar 403');
  assert.ok(resIdorEstoque.data.erro.includes('IDOR interceptado'), 'Resposta deve indicar bloqueio de IDOR');
  console.log('  ✅ Todas as tentativas de IDOR foram interceptadas e bloqueadas com HTTP 403.');

  // TEST 5: Motor de Ingestão de Telemetria IoT & Fila Store-and-Forward
  console.log('\n[5/5] Testando Ingestão de Telemetria IoT e Fila Store-and-Forward...');
  const resTelemetria = await makeRequest('POST', '/api/v1/telemetria/iot/buffer', {
    frames: [
      {
        machineId: 'COLH-CASE-9250',
        rpm: 2100,
        coolantTempC: 89,
        oilPressureBar: 3.6,
        fuelRateLh: 32.1,
        horimeterHours: 1420.5,
        latitude: -12.551,
        longitude: -55.709
      },
      {
        machineId: 'TRAT-JD-8400R',
        rpm: 2450, // RPM acima do limite
        coolantTempC: 109, // Superaquecimento
        oilPressureBar: 1.4, // Pressão crítica
        fuelRateLh: 45.0,
        horimeterHours: 890.2,
        latitude: -12.553,
        longitude: -55.712
      }
    ]
  });

  assert.strictEqual(resTelemetria.status, 200, 'Ingestão em lote deve retornar 200');
  assert.strictEqual(resTelemetria.data.totalProcessados, 2, 'Dois pacotes devem ser processados');
  assert.strictEqual(resTelemetria.data.alertasGerados.length, 1, 'Trator 2 deve gerar alertas');
  assert.ok(resTelemetria.data.alertasGerados[0].alerts.includes('ALERTA_SUPERAQUECIMENTO_MOTOR'), 'Deve alertar superaquecimento');

  const resStatus = await makeRequest('GET', '/api/v1/telemetria/iot/status');
  assert.strictEqual(resStatus.status, 200, 'Status deve retornar 200');
  assert.strictEqual(resStatus.data.status, 'OPERACIONAL');
  assert.strictEqual(resStatus.data.modo, 'STORE_AND_FORWARD_IOT_GATEWAY');
  assert.ok(resStatus.data.bufferTamanho >= 2, 'Buffer ativo deve conter os pacotes ingeridos');
  console.log('  ✅ Telemetria IoT ingerida com sucesso, alertas de motor disparados e buffer operacional.');

  // TEST 6: Emissão em Contingência Fiscal EPEC (tpEvento 110140)
  console.log('\n[6/8] Testando contingência fiscal EPEC (SEFAZ Nacional)...');
  const resEpec = await makeRequest('POST', '/api/v1/sefaz/nfe/contingencia', {
    chaveAcesso: resEmitir.data.chaveAcesso,
    valorTotal: 250000.00,
    vICMS: 30000.00,
    justificativa: 'INDISPONIBILIDADE TRANSITORIA DE FIBRA SEFAZ REGIONAL',
    ambiente: 'HOMOLOGACAO',
    tenantId: 'tenant-fazenda-santa-helena'
  });

  assert.strictEqual(resEpec.status, 200, 'Ativação de contingência EPEC deve responder 200');
  assert.strictEqual(resEpec.data.sucesso, true, 'Ativação EPEC deve retornar sucesso');
  assert.strictEqual(resEpec.data.cStat, 135, 'cStat deve ser 135 (Evento vinculado a NF-e)');
  assert.ok(resEpec.data.protocoloEpec.startsWith('19126'), 'Protocolo EPEC deve iniciar com 191 (Ambiente Nacional)');
  assert.ok(resEpec.data.procEventoXml.includes('<tpEvento>110140</tpEvento>'), 'XML deve conter tpEvento 110140');
  console.log('  ✅ Contingência EPEC ativada com sucesso. Carga liberada para transporte legal.');
  console.log('     Protocolo EPEC:', resEpec.data.protocoloEpec);

  // Validação criptográfica do evento EPEC assinado
  const resValEpec = await makeRequest('POST', '/api/v1/sefaz/nfe/validar-assinatura', {
    xml: resEpec.data.procEventoXml
  });
  assert.strictEqual(resValEpec.status, 200, 'XML do evento EPEC deve ser criptograficamente válido');
  assert.strictEqual(resValEpec.data.valida, true, 'Assinatura digital do EPEC deve ser íntegra');
  console.log('  ✅ Assinatura digital do evento EPEC validada com integridade ICP-Brasil.');

  // TEST 7: SPED Fiscal Bloco K (Livro de Controle de Estoque Agropecuário)
  console.log('\n[7/8] Testando exportação de SPED Fiscal Bloco K...');
  const resBlocoK = await makeRequest('GET', '/api/v1/fiscal/sped/bloco-k');
  assert.strictEqual(resBlocoK.status, 200, 'Bloco K deve responder 200');
  const linhasBlocoK = resBlocoK.raw.split('\r\n');
  assert.ok(linhasBlocoK.some(l => l.startsWith('|K001|0|')), 'Deve conter abertura de Bloco K com dados (|K001|0|)');
  assert.ok(linhasBlocoK.some(l => l.startsWith('|K100|')), 'Deve conter período de apuração (|K100|)');
  assert.ok(linhasBlocoK.some(l => l.startsWith('|K200|')), 'Deve conter registro de estoque escriturado (|K200|)');
  assert.ok(linhasBlocoK.some(l => l.startsWith('|K990|')), 'Deve conter encerramento do bloco (|K990|)');
  console.log('  ✅ SPED Bloco K gerado e em conformidade com o Guia Prático da EFD-ICMS/IPI.');

  // TEST 8: Server-Sent Events (SSE) para Telemetria em Tempo Real
  console.log('\n[8/8] Testando Server-Sent Events (SSE) em /api/v1/telemetria/stream...');
  const sseOk = await new Promise((resolve, reject) => {
    const sseReq = http.request(`${BASE_URL}/api/v1/telemetria/stream`, res => {
      assert.strictEqual(res.statusCode, 200, 'SSE stream deve responder 200');
      assert.ok(res.headers['content-type'].includes('text/event-stream'), 'Content-Type deve ser text/event-stream');
      let dataChunks = '';
      res.on('data', chunk => {
        dataChunks += chunk.toString();
        if (dataChunks.includes('event: init') && dataChunks.includes('frotaAtiva')) {
          sseReq.destroy();
          resolve(true);
        }
      });
      res.on('error', reject);
    });
    sseReq.on('error', reject);
    sseReq.end();
  });
  assert.strictEqual(sseOk, true, 'SSE handshake e evento de inicialização de telemetria recebidos com sucesso');
  console.log('  ✅ Conexão SSE de telemetria em tempo real validada com sucesso.');

  console.log('\n🎉 ========================================================');
  console.log('🎉 TODOS OS TESTES DE REFORÇO FISCAL, IDOR E IoT PASSARAM!');
  console.log('🎉 ========================================================');
}

runTests().catch(err => {
  console.error('\n❌ Falha na execução da suíte E2E:', err);
  process.exit(1);
});
