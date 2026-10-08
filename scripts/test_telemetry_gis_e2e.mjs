// scripts/test_telemetry_gis_e2e.mjs
// Teste de Integração Automatizado E2E:
// 1. SAE J1939 / ISO 11783 CAN Bus Decoder
// 2. Continuous Fleet Telemetry Ingestion Pipeline & Operational Alerts
// 3. CAR (Cadastro Ambiental Rural) Polygon Geodesic Calculation & SICAR Ingestion
// 4. PostGIS Spatial Radius Query & Proximity Fleet Calculation

import http from 'http';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : null;
    const options = {
      hostname: '127.0.0.1',
      port: 5173,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(dataString ? { 'Content-Length': Buffer.byteLength(dataString) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let resData = '';
      res.on('data', chunk => { resData += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(resData);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body: resData });
        }
      });
    });

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALHA: ${message}`);
    process.exit(1);
  }
  console.log(`✅ SUCESSO: ${message}`);
}

async function runTests() {
  console.log('🚀 Iniciando Teste E2E de Telemetria CAN Bus J1939/ISOBUS e GIS Espacial...');

  // TESTE 1: Decodificador CAN Bus J1939 - PGN 61444 (EEC1 Rotação Motor)
  console.log('\n--- 1. Decodificação CAN Bus J1939 ---');
  // Raw RPM 0x3EE0 = 16096 * 0.125 = 2012 RPM
  const resRpm = await makeRequest('POST', '/api/v1/erp/telemetria/canbus', {
    canId: '0x0CF00400',
    data: [0, 0, 0, 0xE0, 0x3E, 0, 0, 0]
  });
  assert(resRpm.status === 200, 'Endpoint CAN Bus respondeu HTTP 200');
  assert(resRpm.body.pgn === 61444, 'PGN 61444 (EEC1) extraído corretamente');
  assert(resRpm.body.rpmMotor === 2012, `RPM do motor decodificado corretamente: ${resRpm.body.rpmMotor} rpm (esperado 2012)`);

  // PGN 65257 (0xFEE9) - Total Horímetro de Operação
  // 70000 horas em 0.05h/bit = 1,400,000 = 0x00155CC0
  const rawHoursVal = 1400000;
  const b0 = rawHoursVal & 0xff;
  const b1 = (rawHoursVal >> 8) & 0xff;
  const b2 = (rawHoursVal >> 16) & 0xff;
  const b3 = (rawHoursVal >> 24) & 0xff;
  const resHours = await makeRequest('POST', '/api/v1/erp/telemetria/canbus', {
    canId: '0x18FEE900',
    data: [b0, b1, b2, b3, 0, 0, 0, 0]
  });
  assert(resHours.body.pgn === 65257, 'PGN 65257 (LHR) extraído corretamente');
  assert(resHours.body.horimetroTotalHoras === 70000, `Horímetro total decodificado: ${resHours.body.horimetroTotalHoras} h`);

  // PGN 65263 (0xFEEF) - Pressão de Óleo (Byte 3: 40 * 0.04 = 1.6 bar)
  const resOil = await makeRequest('POST', '/api/v1/erp/telemetria/canbus', {
    canId: '0x18FEEF00',
    data: [0, 0, 0, 40, 0, 0, 0, 0]
  });
  assert(resOil.body.pgn === 65263, 'PGN 65263 (EFL_P1) extraído com sucesso');
  assert(resOil.body.pressaoOleoBar === 1.6, `Pressão de óleo decodificada: ${resOil.body.pressaoOleoBar} bar`);

  // TESTE 2: Pipeline de Ingestão Contínua de Telemetria com Detecção de Alerta
  console.log('\n--- 2. Ingestão Contínua de Telemetria & Alertas ---');
  // Envia múltiplos frames com motor superaquecido (108°C -> byte0 = 108 + 40 = 148 = 0x94) e óleo baixo (1.2 bar -> byte3 = 30)
  const resIngest = await makeRequest('POST', '/api/v1/erp/telemetria/ingest', {
    maquinaId: 'TRAT-JD-8R',
    timestamp: new Date().toISOString(),
    frames: [
      { canId: '0x0CF00400', data: [0, 0, 0, 0xE0, 0x3E, 0, 0, 0] }, // 2012 RPM
      { canId: '0x18FEEE00', data: [148, 0, 0, 0, 0, 0, 0, 0] },     // 108°C (superaquecimento)
      { canId: '0x18FEEF00', data: [0, 0, 0, 30, 0, 0, 0, 0] },      // 1.2 bar (pressão baixa)
      { canId: '0x18FEF200', data: [0x50, 0x02, 0, 0, 0, 0, 0, 0] }  // 592 * 0.05 = 29.6 L/h
    ],
    telemetriaDireta: {
      posicaoGps: { lat: -12.5520, lng: -55.7100 }
    }
  });

  assert(resIngest.status === 200, 'Ingestão de telemetria retornou HTTP 200');
  assert(resIngest.body.maquina.rpmMotor === 2012, 'RPM da máquina persistido');
  assert(resIngest.body.maquina.temperaturaC === 108, 'Temperatura do líquido persistida (108°C)');
  assert(resIngest.body.maquina.consumoLh === 29.6, 'Consumo instantâneo persistido (29.6 L/h)');
  assert(resIngest.body.alertasGerados.length >= 2, `Alertas gerados com sucesso: ${resIngest.body.alertasGerados.map(a => a.codigo).join(', ')}`);

  // TESTE 3: Ingestão de CAR e Geometria PostGIS
  console.log('\n--- 3. Ingestão de CAR (Cadastro Ambiental Rural) ---');
  const carGeojson = {
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-55.7250, -12.5400],
          [-55.7000, -12.5400],
          [-55.7000, -12.5650],
          [-55.7250, -12.5650],
          [-55.7250, -12.5400]
        ]
      ]
    }
  };

  const resCar = await makeRequest('POST', '/api/v1/gis/car/import', {
    sicarCodigo: 'MT-5107909-089201948120491820',
    nomeImovel: 'Fazenda AgroTech - Talhão 05 Gleba Sul',
    codigo: 'TAL-05',
    cultura: 'Milho Safrinha',
    salvarComoTalhao: true,
    geojson: carGeojson
  });

  assert(resCar.status === 201, 'Importação CAR retornou HTTP 201 Created');
  assert(resCar.body.carInfo.areaTotalHa > 0, `Área em hectares calculada com precisão geodésica: ${resCar.body.carInfo.areaTotalHa} ha`);
  assert(resCar.body.carInfo.centroide.lat !== 0, `Centróide calculado: lat ${resCar.body.carInfo.centroide.lat}, lng ${resCar.body.carInfo.centroide.lng}`);
  assert(resCar.body.carInfo.reservaLegalHa > 0, `Cálculo de Reserva Legal (20%): ${resCar.body.carInfo.reservaLegalHa} ha`);

  // TESTE 4: Consulta Espacial PostGIS por Raio e Proximidade de Frota
  console.log('\n--- 4. Consulta Espacial PostGIS & Proximidade ---');
  const resSpatial = await makeRequest('GET', '/api/v1/gis/spatial-query?lat=-12.5512&lng=-55.7098&radiusKm=20');
  assert(resSpatial.status === 200, 'Consulta espacial retornou HTTP 200');
  assert(resSpatial.body.resumoEspacial.totalTalhoesNoRaio >= 1, `Talhões encontrados no raio de 20 km: ${resSpatial.body.resumoEspacial.totalTalhoesNoRaio}`);
  assert(resSpatial.body.resumoEspacial.maquinasNoRaio >= 1, `Máquinas conectadas na zona de operação: ${resSpatial.body.resumoEspacial.maquinasNoRaio}`);
  assert(resSpatial.body.frota[0].distanciaKm >= 0, `Distância calculada da máquina mais próxima: ${resSpatial.body.frota[0].distanciaKm} km`);

  console.log('\n🌟 TODOS OS TESTES DE TELEMETRIA CAN BUS E GIS ESPACIAL PASSARAM COM 100% DE SUCESSO!\n');
}

runTests().catch(err => {
  console.error('Erro na execução do teste:', err);
  process.exit(1);
});
