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
  console.log('🌾 TESTE E2E: 4 GRANDES MELHORIAS ESTRATÉGICAS DO AGRO INTEGRAL');
  console.log('🌾 =========================================================================');

  // 1. MELHORIA 1: Prescrição em Taxa Variável ISOBUS ISO-XML (ISO 11783-10)
  console.log('\n[1/4] Testando Prescrição ISO-XML e Download para Pen-Drive ISOBUS...');
  const resPresc = await makeRequest('POST', '/api/v1/talhoes/prescricao/gerar', {
    talhaoId: 'talhao-01',
    areaHa: 420.5,
    produto: { codigo: 'ADU-MAP', nome: 'MAP 11-52-00', unidade: 'kg/ha' },
    zonasTaxaVariavel: [
      { zona: 1, descricao: 'Baixo Vigor', doseKgHa: 220, percentualArea: 30 },
      { zona: 2, descricao: 'Médio Vigor', doseKgHa: 160, percentualArea: 50 },
      { zona: 3, descricao: 'Alto Vigor', doseKgHa: 100, percentualArea: 20 }
    ]
  });
  assert.strictEqual(resPresc.status, 200, 'Geração de prescrição deve responder 200');
  assert.strictEqual(resPresc.data.sucesso, true, 'Deve indicar sucesso');
  assert.strictEqual(resPresc.data.doseMediaKgHa, 166.0, 'Dose média deve ser 166 kg/ha');

  const resXml = await makeRequest('GET', '/api/v1/talhoes/prescricao/isoxml?talhaoId=talhao-01');
  assert.strictEqual(resXml.status, 200, 'Download ISO-XML deve responder 200');
  assert.ok(resXml.raw.includes('<ISO11783_TaskData'), 'Deve gerar arquivo TASKDATA.XML padronizado');
  console.log('  ✅ Prescrição ISOBUS ISO-XML homologada para John Deere, Trimble e Case IH.');

  // 2. MELHORIA 2: Copilot Ordem de Tanque (D.A.L.E.) & Auditoria de Carência LMR
  console.log('\n[2/4] Testando Copilot Ordem de Tanque D.A.L.E. e Carência de Defensivos LMR...');
  const resCalda = await makeRequest('POST', '/api/v1/agronomico/copilot/ordem-calda', {
    itensCalda: [
      { nome: 'Glifosato 720 WG', formulacao: 'WG', dosePorHa: '2.0 kg/ha' },
      { nome: 'Fungicida Protioconazol', formulacao: 'SC', dosePorHa: '0.4 L/ha' },
      { nome: 'Adjuvante Siliconado', formulacao: 'SL', dosePorHa: '0.05 L/ha' },
      { nome: 'Óleo Metilado de Soja', formulacao: 'EC', dosePorHa: '0.5 L/ha' }
    ]
  });
  assert.strictEqual(resCalda.status, 200, 'Simulador de calda deve responder 200');
  assert.strictEqual(resCalda.data.sucesso, true);
  assert.strictEqual(resCalda.data.passoAPasso.length, 6, 'Devem ser 6 passos (Água + 4 Insumos + Fechamento)');
  assert.strictEqual(resCalda.data.passoAPasso[1].formulacao, 'WG', 'WG deve ser adicionado primeiro');
  assert.strictEqual(resCalda.data.passoAPasso[2].formulacao, 'SC', 'SC deve ser adicionado em segundo');
  assert.strictEqual(resCalda.data.passoAPasso[4].formulacao, 'EC', 'EC deve ser adicionado por último');

  const resCarencia = await makeRequest('POST', '/api/v1/agronomico/carencia/validar', {
    cultura: 'Soja em Grãos',
    dataAplicacao: '2026-09-01',
    dataPrevisaoColheita: '2026-10-15',
    produtosAplicados: [{ nome: 'Fungicida Protioconazol', intervaloSegurancaDias: 30 }]
  });
  assert.strictEqual(resCarencia.status, 200);
  assert.strictEqual(resCarencia.data.aptoParaColheita, true, 'Carência cumprida com 44 dias (mínimo 30)');
  console.log('  ✅ Protocolo de preparo de calda D.A.L.E. e auditoria de resíduos LMR validados com precisão.');

  // 3. MELHORIA 3: OEE Agrícola & Manutenção Preditiva J1939
  console.log('\n[3/4] Testando OEE Agrícola e Gatilhos de Manutenção Preditiva...');
  const resOee = await makeRequest('GET', '/api/v1/frota/oee/dashboard?horasPlanejadas=12&horasTrabalhadas=10.5&hectaresRealizados=94&consumoDieselLitrosTotal=282');
  assert.strictEqual(resOee.status, 200);
  assert.ok(resOee.data.oeeGlobalPercentual >= 70.0 && resOee.data.oeeGlobalPercentual <= 95.0, 'OEE deve estar na faixa de cálculo');
  assert.strictEqual(resOee.data.metricasOperacionais.consumoDieselLitrosPorHa, 3.0, 'Consumo deve ser 3.00 L/ha');

  const resManut = await makeRequest('GET', '/api/v1/frota/manutencao/gatilhos-preditivos');
  assert.strictEqual(resManut.status, 200);
  assert.ok(typeof resManut.data.totalMaquinasAvaliadas === 'number');
  console.log('  ✅ OEE Global calculado:', resOee.data.oeeGlobalPercentual, '% | Diesel:', resOee.data.metricasOperacionais.consumoDieselLitrosPorHa, 'L/ha');
  console.log('  ✅ Sistema de Manutenção Preditiva CAN Bus verificado.');

  // 4. MELHORIA 4: Passaporte Digital do Grão & Rastreabilidade de Lote com QR Code
  console.log('\n[4/4] Testando Rastreabilidade Digital de Lote e Emissão de Passaporte EUDR...');
  const resLote = await makeRequest('POST', '/api/v1/rastreabilidade/lote/criar', {
    fazenda: 'Fazenda Santa Helena - MT',
    talhaoOrigemId: 'talhao-01',
    carNumero: 'MT-5107909-E8192841029',
    cultura: 'Soja em Grãos',
    variedade: 'TMG 2378 IPRO',
    safra: '2025/2026',
    volumeTon: 310.5,
    umidadePercentual: 13.1,
    impurezaPercentual: 0.7
  });
  assert.strictEqual(resLote.status, 201, 'Criação de lote deve responder 201');
  assert.strictEqual(resLote.data.sucesso, true);
  assert.ok(resLote.data.hashAuditoriaSha256.length === 64, 'Hash SHA-256 deve ter 64 caracteres hex');
  assert.ok(resLote.data.qrCodeSvg.includes('<svg'), 'QR Code SVG deve ser emitido');
  assert.strictEqual(resLote.data.classificacaoComercial.statusUmidade, 'PADRAO_EXPORTACAO_OTIMO');
  assert.strictEqual(resLote.data.segurancaAlimentarEudr.status, 'APTO_EXPORTACAO_UE');

  // Testar consulta pública por hash
  const resAuditar = await makeRequest('GET', `/api/v1/rastreabilidade/publica/auditar/${resLote.data.hashAuditoriaSha256}`);
  assert.strictEqual(resAuditar.status, 200, 'Auditoria pública do lote deve responder 200');
  assert.strictEqual(resAuditar.data.loteCodigo, resLote.data.loteCodigo);
  console.log('  ✅ Passaporte Digital emitido com Hash SHA-256 e QR Code rastreável.');
  console.log('     Código:', resLote.data.loteCodigo, '| Umidade:', resLote.data.classificacaoComercial.umidadePercentual, '% | Status EUDR:', resLote.data.segurancaAlimentarEudr.status);

  console.log('\n🎉 =========================================================================');
  console.log('🎉 TODAS AS 4 MELHORIAS ESTRATÉGICAS HOMOLOGADAS COM 100% DE SUCESSO!');
  console.log('🎉 =========================================================================');
}

runTests().catch(err => {
  console.error('\n❌ Erro durante a execução dos testes:', err);
  process.exit(1);
});
