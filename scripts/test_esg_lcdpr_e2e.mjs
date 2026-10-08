// scripts/test_esg_lcdpr_e2e.mjs
// Teste de Integração Automatizado E2E:
// 1. ESG & EUDR Due Diligence Statement (Regulamento UE 2023/1115) & TRACES NT
// 2. Bloqueio Socioambiental EUDR (Marco Temporal 31/12/2020, Terras Indígenas, Embargos IBAMA)
// 3. Consulta Pública e Integridade Criptográfica do DDS
// 4. Livro Caixa Digital do Produtor Rural (LCDPR SPED - RFB IN 1.848/2018)

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
  console.log('🚀 Iniciando Teste E2E de ESG/EUDR e Fiscal LCDPR SPED...');

  // TESTE 1: Emissão de DDS Conforme para Exportação UE (Regulamento UE 2023/1115)
  console.log('\n--- 1. Emissão de Declaração de Due Diligence EUDR (Conforme) ---');
  const ddsId = `DDS-EUDR-2026-BR-MT-${Math.floor(10000 + Math.random() * 90000)}`;
  const resEudrConforme = await makeRequest('POST', '/api/v1/esg/eudr/diligence', {
    ddsNumero: ddsId,
    talhaoId: 'talhao-01',
    carNumero: 'MT-5107909-E8192841029',
    cultura: 'Soja em Grãos',
    safra: '2025/2026',
    volumeEstimadoTon: 1500,
    dataAberturaArea: '2014-08-20', // Anterior ao marco 31/12/2020
    desmatamentoProdesPos2020: false,
    sobreposicaoTerraIndigena: false,
    sobreposicaoUnidadeConservacao: false,
    embargoIbamaAtivo: false
  });

  assert(resEudrConforme.status === 201, `Emissão EUDR respondeu HTTP 201 (recebido: ${resEudrConforme.status})`);
  assert(resEudrConforme.body.sucesso === true, 'Declaração DDS emitida com sucesso');
  assert(resEudrConforme.body.declaracao.statusEUDR === 'APTO_EXPORTACAO_UE', 'Status confirmado como APTO_EXPORTACAO_UE');
  assert(resEudrConforme.body.declaracao.verificationHash.length === 64, 'Hash criptográfico SHA-256 gerado para auditoria na UE');
  assert(resEudrConforme.body.declaracao.pegadaCarbonoKgCO2ePorTon > 0, `Pegada de carbono calculada: ${resEudrConforme.body.declaracao.pegadaCarbonoKgCO2ePorTon} kg CO2e/ton`);

  // TESTE 2: Consulta Pública da Declaração EUDR
  console.log('\n--- 2. Consulta Pública e Autenticidade do DDS ---');
  const resConsulta = await makeRequest('GET', `/api/v1/esg/eudr/diligence/${ddsId}`);
  assert(resConsulta.status === 200, 'Consulta pública respondeu HTTP 200');
  assert(resConsulta.body.declaracao.ddsNumero === ddsId, 'DDS recuperado com fidelidade cadastral');
  assert(resConsulta.body.declaracao.tracesNtId.startsWith('TRACES-NT-'), 'ID TRACES NT da Comissão Europeia presente');

  // TESTE 3: Bloqueio Socioambiental EUDR (Marco Temporal Violado)
  console.log('\n--- 3. Bloqueio Socioambiental EUDR (Não Conforme) ---');
  const resEudrBloqueio = await makeRequest('POST', '/api/v1/esg/eudr/diligence', {
    talhaoId: 'talhao-09',
    carNumero: 'MT-5107909-IRREGULAR',
    cultura: 'Soja em Grãos',
    dataAberturaArea: '2022-04-10', // Pós 31/12/2020 -> Proibido pelo EUDR
    desmatamentoProdesPos2020: true,
    sobreposicaoTerraIndigena: true
  });

  assert(resEudrBloqueio.status === 422, 'Bloqueio socioambiental retornou HTTP 422 Unprocessable Entity');
  assert(resEudrBloqueio.body.sucesso === false, 'Emissão bloqueada conforme esperado');
  assert(resEudrBloqueio.body.declaracao.statusEUDR === 'BLOQUEIO_SOCIOAMBIENTAL', 'Status gravado como BLOQUEIO_SOCIOAMBIENTAL');
  assert(resEudrBloqueio.body.declaracao.irregularidades.length >= 2, 'Irregularidades detalhadas detectadas (desmatamento e terra indígena)');

  // TESTE 4: Geração Oficial de Arquivo LCDPR SPED (Layout 0013 RFB)
  console.log('\n--- 4. Geração do Livro Caixa Digital do Produtor Rural (LCDPR SPED) ---');
  const resLcdpr = await makeRequest('POST', '/api/v1/fiscal/lcdpr/gerar', {
    anoExercicio: 2025,
    cpfProdutor: '038.921.481-20',
    nomeProdutor: 'Dr. Roberto Schneider',
    imoveis: [
      { codigo: '001', nome: 'FAZENDA SANTA HELENA', nirf: '84910291', cafir: '51079090', car: 'MT-5107909-089201948120491820', participacaoPct: 100 }
    ],
    contasBancarias: [
      { codigo: '001', banco: '001', agencia: '1248', conta: '491820' }
    ],
    lancamentos: [
      { data: '15012025', codImovel: '001', codConta: '001', numDoc: 'NFE-4128', tipoDoc: '1', historico: 'Venda de Soja em Graos Safra 2024/2025', cpfCnpj: '04812049000120', tipoLancamento: '1', valorEntrada: 285400.00, valorSaida: 0 },
      { data: '22012025', codImovel: '001', codConta: '001', numDoc: 'NFE-9921', tipoDoc: '1', historico: 'Aquisicao Adubo NPK 04-14-08 Fertilizantes', cpfCnpj: '09124819000188', tipoLancamento: '2', valorEntrada: 0, valorSaida: 62000.00 }
    ]
  });

  assert(resLcdpr.status === 200, 'Geração LCDPR respondeu HTTP 200');
  assert(resLcdpr.body.sucesso === true, 'Arquivo LCDPR gerado com sucesso');
  assert(resLcdpr.body.totalEntradas === 285400.00, `Total de entradas conferido: R$ ${resLcdpr.body.totalEntradas}`);
  assert(resLcdpr.body.totalSaidas === 62000.00, `Total de saídas conferido: R$ ${resLcdpr.body.totalSaidas}`);
  assert(resLcdpr.body.resultadoLiquido === 223400.00, `Resultado líquido apurado: R$ ${resLcdpr.body.resultadoLiquido}`);
  assert(resLcdpr.body.arquivoLcdprSped.includes('0000|LCDPR|0013|'), 'Registro 0000 presente no layout oficial da RFB');
  assert(resLcdpr.body.arquivoLcdprSped.includes('Q100|'), 'Registros de movimentação rural Q100 presentes');
  assert(resLcdpr.body.arquivoLcdprSped.includes('9999|'), 'Registro de encerramento 9999 presente');

  console.log('\n🌟 TODOS OS TESTES DE ESG/EUDR E FISCAL LCDPR PASSARAM COM 100% DE SUCESSO!\n');
}

runTests().catch(err => {
  console.error('Erro na execução do teste:', err);
  process.exit(1);
});
