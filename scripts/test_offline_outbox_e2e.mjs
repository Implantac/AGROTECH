// scripts/test_offline_outbox_e2e.mjs
// Teste de Integração Automatizado E2E do Princípio 12: Offline Outbox Pattern
// 1. Enfileiramento de Apontamentos de Campo no Local/Outbox
// 2. Drenagem de Lote via POST /api/v1/sync/batch
// 3. Consulta e Auditoria via GET /api/v1/sync/outbox
// 4. Detecção e Resolução de Conflitos via POST /api/v1/sync/outbox/resolve
// 5. Validação de PWA Service Worker e Web App Manifest

import http from 'http';
import fs from 'fs';

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
  console.log('🚀 Iniciando Teste E2E de Sincronização Offline (Princípio 12 - Outbox Pattern)...');

  // TESTE 1: Envio de Lote de Apontamentos em Campo para o Gateway de Sincronização
  console.log('\n--- 1. Envio de Lote de Apontamentos Offline ---');
  const batchId = `batch-test-${Date.now()}`;
  const op1Id = `op-abastecimento-${Date.now()}`;
  const op2Id = `op-mip-${Date.now()}`;

  const payloadLote = {
    tenantId: 'tenant-fazenda-santa-helena',
    batchId,
    dispositivoId: 'ROBUST-TABLET-IP68-01',
    operacoes: [
      {
        id: op1Id,
        tipo: 'ABASTECIMENTO_COMBOIO',
        talhao: 'Talhão 02 - Pivô Central',
        resumo: 'Trator Case Magnum 340 • 420 L Diesel S10 • Horímetro 4.120h',
        createdAt: new Date().toISOString(),
        createdBy: 'Operador Valmor Bertoncelli'
      },
      {
        id: op2Id,
        tipo: 'MONITORAMENTO_MIP',
        talhao: 'Talhão 01 - Norte',
        resumo: 'Lagarta Helicoverpa armigera • 1.4 lagartas/metro • Nível de Dano Econômico',
        createdAt: new Date().toISOString(),
        createdBy: 'Agrônomo Marcelo Prado',
        versaoLocal: 1,
        versaoRemota: 2 // Gera detecção de conflito controlada
      }
    ]
  };

  const resBatch = await makeRequest('POST', '/api/v1/sync/batch', payloadLote);
  assert(resBatch.status === 202, `Gateway de sincronização respondeu HTTP 202 Accepted (recebido: ${resBatch.status})`);
  assert(resBatch.body.sucesso === true, 'Lote aceito com sucesso na fila de mensageria');
  assert(resBatch.body.sincronizados >= 1, `Itens sincronizados com sucesso: ${resBatch.body.sincronizados}`);
  assert(resBatch.body.conflitos === 1, 'Detecção de conflito de versões (Local vs Servidor) funcionou conforme especificação');

  // TESTE 2: Consulta da Fila Outbox e Reconciliação
  console.log('\n--- 2. Consulta da Fila de Auditoria Outbox ---');
  const resOutbox = await makeRequest('GET', '/api/v1/sync/outbox');
  assert(resOutbox.status === 200, 'Consulta da fila outbox respondeu HTTP 200');
  assert(resOutbox.body.sucesso === true, 'Fila de outbox retornou sucesso');
  assert(resOutbox.body.total >= 2, `Total de registros na outbox auditável: ${resOutbox.body.total}`);

  // TESTE 3: Resolução de Conflito de Apontamento
  console.log('\n--- 3. Resolução de Conflito de Apontamento ---');
  const resResolve = await makeRequest('POST', '/api/v1/sync/outbox/resolve', {
    id: op2Id,
    manterLocal: true,
    resolucaoManual: 'Validado pelo Agrônomo Chefe com base em foto de pano-de-batida'
  });
  assert(resResolve.status === 200, 'Resolução de conflito respondeu HTTP 200');
  assert(resResolve.body.sucesso === true, 'Conflito marcado como resolvido');
  assert(resResolve.body.item.status === 'SYNCED', 'Status atualizado para SYNCED');

  // TESTE 4: Verificação de Ativos PWA Offline (Service Worker & Manifest)
  console.log('\n--- 4. Validação de Ativos PWA Offline ---');
  const swExists = fs.existsSync('/home/user/agtech-platform/public/sw.js') &&
                   fs.existsSync('/home/user/agtech-platform/app_static/sw.js');
  assert(swExists, 'Service Worker sw.js presente tanto em public/ quanto em app_static/');

  const manifestExists = fs.existsSync('/home/user/agtech-platform/public/manifest.json') &&
                         fs.existsSync('/home/user/agtech-platform/app_static/manifest.json');
  assert(manifestExists, 'Web App Manifest manifest.json presente');

  // Testa entrega do Service Worker via HTTP
  const resSwHttp = await makeRequest('GET', '/sw.js');
  assert(resSwHttp.status === 200, 'Service Worker acessível na raiz via HTTP GET /sw.js');
  assert(resSwHttp.body.includes('super-agtech-cache-v2'), 'Service Worker v2 com estratégia de cache para offline confirmada');

  console.log('\n🌟 TODOS OS TESTES DO OUTBOX PATTERN OFFLINE E PWA PASSARAM COM 100% DE SUCESSO!\n');
}

runTests().catch(err => {
  console.error('Erro na execução do teste:', err);
  process.exit(1);
});
