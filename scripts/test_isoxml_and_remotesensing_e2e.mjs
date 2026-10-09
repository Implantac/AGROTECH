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
  console.log('🌾 ========================================================');
  console.log('🌾 TESTE E2E: PRESCRIÇÃO ISO-XML & SENSORIAMENTO MULTIESPECTRAL');
  console.log('🌾 ========================================================');

  // TEST 1: Geração de Prescrição em Taxa Variável ISO-XML
  console.log('\n[1/3] Testando geração de prescrição ISO 11783-10 (ISOBUS)...');
  const resPresc = await makeRequest('POST', '/api/v1/talhoes/prescricao/gerar', {
    talhaoId: 'talhao-01',
    areaHa: 420.5,
    produto: { codigo: 'ADU-MAP', nome: 'Fosfato Monoamônico MAP', unidade: 'kg/ha' },
    zonasTaxaVariavel: [
      { zona: 1, descricao: 'Baixo Vigor', doseKgHa: 220.0, percentualArea: 30 },
      { zona: 2, descricao: 'Vigor Médio', doseKgHa: 160.0, percentualArea: 50 },
      { zona: 3, descricao: 'Alto Vigor', doseKgHa: 100.0, percentualArea: 20 }
    ]
  });

  assert.strictEqual(resPresc.status, 200, 'Geração de prescrição deve retornar 200');
  assert.strictEqual(resPresc.data.sucesso, true, 'Deve indicar sucesso');
  assert.strictEqual(resPresc.data.padrao, 'ISO 11783-10:2015 (ISOBUS TaskData V4)');
  assert.strictEqual(resPresc.data.doseMediaKgHa, 166.0, 'Dose média ponderada deve ser 166 kg/ha');
  assert.strictEqual(resPresc.data.consumoTotalEstimadoKg, 69803, 'Consumo total deve ser 69.803 kg');
  assert.ok(resPresc.data.conteudoXml.includes('<ISO11783_TaskData'), 'XML deve conter elemento raiz ISO11783_TaskData');
  assert.ok(resPresc.data.conteudoXml.includes('<TZN A="1" B="220.00" />'), 'XML deve conter zona 1');
  console.log('  ✅ Prescrição em taxa variável gerada conforme norma ISO 11783-10.');
  console.log('     Dose Média:', resPresc.data.doseMediaKgHa, 'kg/ha | Total:', resPresc.data.consumoTotalEstimadoKg, 'kg');

  // TEST 2: Download Direto de TASKDATA.XML para Pen-Drive de Trator
  console.log('\n[2/3] Testando download direto de TASKDATA.XML...');
  const resDownload = await makeRequest('GET', '/api/v1/talhoes/prescricao/isoxml?talhaoId=talhao-01');
  assert.strictEqual(resDownload.status, 200, 'Download deve responder 200');
  assert.ok(resDownload.headers['content-type'].includes('application/xml'), 'Content-Type deve ser application/xml');
  assert.ok(resDownload.headers['content-disposition'].includes('filename="TASKDATA.XML"'), 'Header Content-Disposition deve especificar TASKDATA.XML');
  assert.ok(resDownload.raw.includes('<TSK A="TSK1"'), 'XML baixado deve conter tags operacionais de tarefa');
  console.log('  ✅ Arquivo TASKDATA.XML baixado com sucesso pronto para cabine (John Deere / Trimble / Case).');

  // TEST 3: Sensoriamento Remoto Multiespectral Sentinel-2 & Índices
  console.log('\n[3/3] Testando motor de sensoriamento remoto (NDVI, NDRE, MSAVI)...');
  const resSens = await makeRequest('GET', '/api/v1/talhoes/sensoriamento/indices?talhaoId=talhao-01');
  assert.strictEqual(resSens.status, 200, 'Sensoriamento deve responder 200');
  assert.strictEqual(resSens.data.sucesso, true, 'Deve indicar sucesso');
  assert.ok(resSens.data.indicesMedios.ndvi >= 0.5 && resSens.data.indicesMedios.ndvi <= 0.9, 'NDVI médio deve estar em faixa válida');
  assert.ok(resSens.data.indicesMedios.ndre >= 0.2 && resSens.data.indicesMedios.ndre <= 0.6, 'NDRE médio deve estar em faixa válida');
  assert.strictEqual(resSens.data.amostragemZonal.length, 5, 'Devem ser analisados 5 pontos zonais');
  assert.ok(resSens.data.recomendacoesAgronomicas.length >= 1, 'Recomendações agronômicas devem ser geradas');
  console.log('  ✅ Índices espectrais calculados com sucesso:');
  console.log('     NDVI Médio:', resSens.data.indicesMedios.ndvi, '| NDRE Médio:', resSens.data.indicesMedios.ndre);
  console.log('     Classificação:', resSens.data.indicesMedios.statusVigor);

  console.log('\n🎉 ========================================================');
  console.log('🎉 TODOS OS TESTES DE PRESCRIÇÃO ISO-XML E SATÉLITE PASSARAM!');
  console.log('🎉 ========================================================');
}

runTests().catch(err => {
  console.error('\n❌ Falha na execução da suíte E2E:', err);
  process.exit(1);
});
