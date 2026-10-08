// scripts/test_zarc_renovabio_e2e.mjs
// Teste de Integração Automatizado E2E:
// 1. ZARC - Zoneamento Agrícola de Risco Climático (MAPA e MCR BACEN 2-6)
// 2. RenovaBio CBIO & RenovaCalc (Lei 13.576/2017 & ANP)
// 3. FAO-56 Balanço Hídrico & Tarifa Noturna de Irrigação
// 4. Interpretação de Laudo de Solo, Calagem & Gessagem

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
  console.log('🚀 Iniciando Teste E2E de ZARC, RenovaBio CBIO, Irrigação FAO-56 e Solos...');

  // TESTE 1: ZARC - Zoneamento de Risco Climático
  console.log('\n--- 1. Consulta e Classificação ZARC ---');
  const resZarcBaixo = await makeRequest('POST', '/api/v1/erp/zarc/consultar', {
    cultura: 'Soja Safra Cheia',
    tipoSolo: 'AD3',
    decendio: 28, // Janela ideal
    cicloCultivar: 'PRECOCE'
  });

  assert(resZarcBaixo.status === 200, 'Endpoint ZARC respondeu HTTP 200');
  assert(resZarcBaixo.body.enquadramentoZarc === 'RISCO_20_BAIXO', `Enquadramento ZARC ótimo: ${resZarcBaixo.body.enquadramentoZarc}`);
  assert(resZarcBaixo.body.elegivelProagro === true, 'Elegibilidade Proagro confirmada');
  assert(resZarcBaixo.body.subsidioFederalPsrPct === 40, 'Subvenção ao prêmio do seguro rural PSR de 40%');

  // Teste ZARC fora da janela (Decêndio 15)
  const resZarcFora = await makeRequest('POST', '/api/v1/erp/zarc/consultar', {
    cultura: 'Soja Safra Cheia',
    tipoSolo: 'AD1',
    decendio: 15,
    cicloCultivar: 'TARDIO'
  });
  assert(resZarcFora.body.enquadramentoZarc === 'INAPTO_FORA_JANELA', 'Bloqueio de enquadramento fora da janela climatológica');
  assert(resZarcFora.body.elegivelCreditoRuralCusteio === false, 'Bloqueio de crédito de custeio por inaptidão ZARC');

  // TESTE 2: RenovaBio CBIO & RenovaCalc
  console.log('\n--- 2. Cálculo e Emissão RenovaBio CBIO ---');
  const resCbio = await makeRequest('POST', '/api/v1/erp/renovabio/calcular', {
    biocombustivel: 'ETANOL_HIDRATADO',
    volumeProduzidoM3: 50000,
    fracaoBiomassaElegivelPct: 95.0,
    notaEficienciaEnergeticaGCo2Mj: 64.0,
    precoCbioB3Reais: 100.0,
    custoAuditoriaRenovabioReais: 120000
  });

  assert(resCbio.status === 200, 'Endpoint RenovaBio respondeu HTTP 200');
  assert(resCbio.body.cbiosEmitiveisTotal > 60000, `Total de CBIOs calculados com sucesso: ${resCbio.body.cbiosEmitiveisTotal}`);
  assert(resCbio.body.receitaBrutaB3Reais > 6000000, `Receita bruta B3 calculada: R$ ${resCbio.body.receitaBrutaB3Reais}`);
  assert(resCbio.body.receitaLiquidaProdutorReais > 5000000, `Receita líquida apurada: R$ ${resCbio.body.receitaLiquidaProdutorReais}`);

  // TESTE 3: Irrigação FAO-56 Balanço Hídrico & Tarifa Noturna ANEEL
  console.log('\n--- 3. Irrigação FAO-56 & Tarifa Verde Noturna ---');
  const resIrrig = await makeRequest('POST', '/api/v1/erp/irrigacao/balanco', {
    etoReferenciaMmDia: 6.2,
    coeficienteCulturaKc: 1.15,
    precipitacaoEfetivaMmDia: 1.0,
    areaIrrigadaHectares: 140,
    vazaoTotalM3Hora: 420
  });

  assert(resIrrig.status === 200, 'Endpoint Irrigação FAO-56 respondeu HTTP 200');
  assert(resIrrig.body.necessitaIrrigacao === true, 'Necessidade de irrigação detectada por déficit hídrico');
  assert(resIrrig.body.horasOperacaoPivoNecessarias > 0, `Horas de operação calculadas: ${resIrrig.body.horasOperacaoPivoNecessarias} h`);
  assert(resIrrig.body.percentualEconomiaNoturnaPct > 50, `Economia tarifária noturna comprovada: ${resIrrig.body.percentualEconomiaNoturnaPct}%`);

  // TESTE 4: Laudo de Solo, Calagem & Gessagem
  console.log('\n--- 4. Laudo de Solo, Calagem e Gessagem ---');
  const resSolo = await makeRequest('POST', '/api/v1/erp/solo/recomendacao', {
    calcioCmolcdm3: 1.5,
    magnesioCmolcdm3: 0.6,
    potassioCmolcdm3: 0.15,
    aluminioCmolcdm3: 0.8,
    hMaisAlCmolcdm3: 4.5,
    argilaPct: 42.0,
    saturacaoBasesAlvoV2Pct: 70.0,
    prntCalcarioPct: 85.0
  });

  assert(resSolo.status === 200, 'Endpoint Solos respondeu HTTP 200');
  assert(resSolo.body.necessidadeCalagemTonHa > 0, `Necessidade de calagem calculada: ${resSolo.body.necessidadeCalagemTonHa} t/ha`);
  assert(resSolo.body.necessidadeGessoKgHa === Math.round(50 * 42.0), `Necessidade de gessagem calculada (50 x %Argila): ${resSolo.body.necessidadeGessoKgHa} kg/ha`);

  console.log('\n🌟 TODOS OS TESTES DE ZARC, RENOVABIO, IRRIGAÇÃO E SOLOS PASSARAM COM 100% DE SUCESSO!\n');
}

runTests().catch(err => {
  console.error('Erro na execução do teste:', err);
  process.exit(1);
});
