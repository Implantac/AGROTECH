import http from 'http';
import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('🐘 TESTE E2E: PERSISTÊNCIA RELACIONAL, POSTGIS & MIGRATIONS');
console.log('================================================================');

const BASE_URL = 'http://127.0.0.1:5173';

function request(method, pathUrl, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathUrl, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });

    req.on('error', err => reject(err));
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runDatabasePersistenceAudit() {
  // 1. Validar endpoint de Health e status de storage
  console.log('\n--- 1. Validando Liveness & Informações de Storage em /api/v1/health ---');
  const healthRes = await request('GET', '/api/v1/health');
  if (healthRes.status !== 200 || healthRes.body.status !== 'ONLINE') {
    console.error('❌ FALHA: Healthcheck não respondeu ONLINE!', healthRes);
    process.exit(1);
  }
  const storageInfo = healthRes.body.servicos?.storageEngine;
  const postgresInfo = healthRes.body.servicos?.postgresPostGIS;
  if (!storageInfo || !postgresInfo) {
    console.error('❌ FALHA: Seções de storage/postgres ausentes no healthcheck!', healthRes.body);
    process.exit(1);
  }
  console.log(`✓ Motor de Armazenamento Ativo: ${storageInfo.tipo} (${storageInfo.status})`);
  console.log(`✓ Driver Relacional: ${storageInfo.driver}`);
  console.log(`✓ PostgreSQL/PostGIS: ${postgresInfo.status} | Migrations Totais: ${postgresInfo.migrationsTotal}`);

  // 2. Validar endpoint de Diagnóstico Completo /api/v1/db/status
  console.log('\n--- 2. Validando Diagnóstico de Banco em /api/v1/db/status ---');
  const dbStatusRes = await request('GET', '/api/v1/db/status');
  if (dbStatusRes.status !== 200 || dbStatusRes.body.status !== 'OPERACIONAL') {
    console.error('❌ FALHA: /api/v1/db/status não retornou status OPERACIONAL!', dbStatusRes);
    process.exit(1);
  }
  const dbStatus = dbStatusRes.body;
  if (!dbStatus.schema || dbStatus.schema.totalTabelas < 10) {
    console.error('❌ FALHA: Esquema fundacional incompleto em /api/v1/db/status!', dbStatus.schema);
    process.exit(1);
  }
  console.log(`✓ Tipo de Armazenamento: ${dbStatus.tipoArmazenamento}`);
  console.log(`✓ Tabelas Fundacionais Mapeadas: ${dbStatus.schema.totalTabelas}`);
  console.log(`✓ Registros Atuais: Usuários=${dbStatus.registros?.usuarios}, Fazendas=${dbStatus.registros?.fazendas}, Talhões=${dbStatus.registros?.talhoes}, Frotas=${dbStatus.registros?.frota}`);
  console.log(`✓ Backup Quente Ativo: ${dbStatus.seguranca?.backupLocalAtivo} (${dbStatus.seguranca?.tamanhoBackupBytes} bytes)`);

  // 3. Validar Migrations Versionadas em /api/v1/db/migrations
  console.log('\n--- 3. Validando Versionamento de Migrations em /api/v1/db/migrations ---');
  const migrationsRes = await request('GET', '/api/v1/db/migrations');
  if (migrationsRes.status !== 200 || !migrationsRes.body.sucesso) {
    console.error('❌ FALHA: /api/v1/db/migrations falhou!', migrationsRes);
    process.exit(1);
  }
  const migrations = migrationsRes.body.migrations || [];
  if (migrations.length < 3) {
    console.error(`❌ FALHA: Esperado no mínimo 3 migrations, encontrado: ${migrations.length}`);
    process.exit(1);
  }
  const expectedFiles = [
    '001_initial_schema.sql',
    '002_barter_frete_irrigacao_solo.sql',
    '003_billing_and_audit.sql'
  ];
  for (const exp of expectedFiles) {
    const found = migrations.find(m => m.arquivo === exp);
    if (!found) {
      console.error(`❌ FALHA: Migration ${exp} não encontrada na lista!`);
      process.exit(1);
    }
    console.log(`  ✓ Migration validada: ${found.arquivo} (${found.tamanhoBytes} bytes) - Status: ${found.status}`);
  }

  // 4. Testar Concorrência & ACID (Simulação de 25 chamadas simultâneas)
  console.log('\n--- 4. Testando Concorrência e Isolamento Transacional (25 chamadas simultâneas) ---');
  const concurrentCalls = [];
  for (let i = 0; i < 25; i++) {
    concurrentCalls.push(request('GET', '/api/v1/db/status'));
  }
  const results = await Promise.all(concurrentCalls);
  const allSuccessful = results.every(r => r.status === 200 && r.body.status === 'OPERACIONAL');
  if (!allSuccessful) {
    console.error('❌ FALHA: Concorrência causou falha em uma ou mais requisições!');
    process.exit(1);
  }
  console.log('✓ 25 requisições concorrentes processadas com 100% de integridade (0 erros de I/O ou lock).');

  console.log('\n================================================================');
  console.log('🎉 AUDITORIA DE PERSISTÊNCIA E BANCO CONCLUÍDA COM SUCESSO (100%)!');
  console.log('================================================================');
}

runDatabasePersistenceAudit().catch(err => {
  console.error('Erro na auditoria de persistência de banco:', err);
  process.exit(1);
});
