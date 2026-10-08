import http from 'http';
import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('🛡️ TESTE E2E: AUDITORIA DE SEGURANÇA, CRIPTOGRAFIA & AUTENTICAÇÃO (SECOPS)');
console.log('================================================================');

const BASE_URL = 'http://127.0.0.1:5173';
const DB_PATH = path.resolve('/home/user/agtech-platform/data/agtech_db.json');
const BACKUP_PATH = path.resolve('/home/user/agtech-platform/data/agtech_db.backup.json');

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

async function runSecurityAudit() {
  // 1. Testar rejeição de usuário inexistente (sem fallback permissivo)
  console.log('\n--- 1. Testando rejeição de usuário inexistente ---');
  const bogusLogin = await request('POST', '/api/v1/auth/login', {
    email: 'hacker_inexistente@agro.com',
    senha: 'senhaInvalida123'
  });
  if (bogusLogin.status !== 401 || bogusLogin.body.sucesso === true) {
    console.error('❌ FALHA CRÍTICA: Usuário inexistente não recebeu 401 Unauthorized!', bogusLogin);
    process.exit(1);
  }
  console.log('✓ Usuário inexistente rejeitado estritamente com HTTP 401.');

  // 2. Testar rejeição de senha incorreta
  console.log('\n--- 2. Testando rejeição de senha incorreta para conta existente ---');
  const wrongPwLogin = await request('POST', '/api/v1/auth/login', {
    email: 'produtor@superagtech.com.br',
    senha: 'senhaTotalmenteErrada'
  });
  if (wrongPwLogin.status !== 401 || wrongPwLogin.body.sucesso === true) {
    console.error('❌ FALHA CRÍTICA: Senha incorreta não recebeu 401 Unauthorized!', wrongPwLogin);
    process.exit(1);
  }
  console.log('✓ Senha incorreta rejeitada estritamente com HTTP 401.');

  // 3. Testar login com credencial correta e migração PBKDF2 automática
  console.log('\n--- 3. Testando login válido e rehash automático com PBKDF2 ---');
  const validLogin = await request('POST', '/api/v1/auth/login', {
    email: 'admin@superagtech.com.br',
    senha: 'admin123'
  });
  if (validLogin.status !== 200 || !validLogin.body.sucesso || !validLogin.body.token) {
    console.error('❌ FALHA: Login válido falhou!', validLogin);
    process.exit(1);
  }
  console.log('✓ Login com credenciais válidas autenticado com sucesso (HTTP 200).');
  console.log('✓ Token JWT gerado:', validLogin.body.token.substring(0, 30) + '...');

  // 4. Verificar se senhaHash foi exposta na resposta
  if (validLogin.body.usuario?.senhaHash || validLogin.body.usuario?.senha) {
    console.error('❌ FALHA DE SEGURANÇA: Resposta de login vazou hash de senha!', validLogin.body.usuario);
    process.exit(1);
  }
  console.log('✓ Sanitização de dados confirmada: nenhum hash ou segredo vazado na resposta do usuário.');

  // 5. Verificar persistência e formato PBKDF2 no banco
  const dbData = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const adminInDb = dbData.usuarios.find(u => u.email === 'admin@superagtech.com.br');
  if (!adminInDb || !adminInDb.senhaHash.startsWith('pbkdf2$sha512$100000$')) {
    console.error('❌ FALHA: Credencial não foi atualizada para PBKDF2 100k rounds!', adminInDb?.senhaHash);
    process.exit(1);
  }
  console.log('✓ Hash do banco de dados atualizado com sucesso para padrão PBKDF2-SHA512 (100.000 iterações).');

  // 6. Testar segundo login usando o novo hash PBKDF2
  const reLoginPbkdf2 = await request('POST', '/api/v1/auth/login', {
    email: 'admin@superagtech.com.br',
    senha: 'admin123'
  });
  if (reLoginPbkdf2.status !== 200 || !reLoginPbkdf2.body.sucesso) {
    console.error('❌ FALHA: Re-autenticação com hash PBKDF2 falhou!', reLoginPbkdf2);
    process.exit(1);
  }
  console.log('✓ Re-autenticação subsequente contra hash PBKDF2 aprovada com sucesso.');

  // 7. Testar rota /api/v1/auth/me com token válido
  console.log('\n--- 4. Testando validação de sessão em /api/v1/auth/me ---');
  const meAuth = await request('GET', '/api/v1/auth/me', null, {
    'Authorization': `Bearer ${validLogin.body.token}`
  });
  if (meAuth.status !== 200 || !meAuth.body.sucesso || !meAuth.body.usuario) {
    console.error('❌ FALHA: /api/v1/auth/me não validou token legítimo!', meAuth);
    process.exit(1);
  }
  if (meAuth.body.usuario.senhaHash || meAuth.body.usuario.senha) {
    console.error('❌ FALHA DE SEGURANÇA: /api/v1/auth/me vazou hash de senha!');
    process.exit(1);
  }
  console.log(`✓ /api/v1/auth/me validou sessão de: ${meAuth.body.usuario.nome} (${meAuth.body.usuario.perfil}) sem expor senhas.`);

  // 8. Testar rota /api/v1/auth/me sem token ou com token adulterado
  const meBogus = await request('GET', '/api/v1/auth/me', null, {
    'Authorization': 'Bearer token_invalido_adulterado_xyz'
  });
  if (meBogus.status !== 401) {
    console.error('❌ FALHA CRÍTICA: /api/v1/auth/me não retornou 401 para token adulterado!', meBogus);
    process.exit(1);
  }
  console.log('✓ Token adulterado em /api/v1/auth/me rejeitado com HTTP 401 Unauthorized.');

  // 9. Testar proteção contra força bruta (Rate Limiting)
  console.log('\n--- 5. Testando proteção contra ataque de força bruta (Rate Limiter) ---');
  const attackerTarget = 'vitima_teste@superagtech.com.br';
  let blockedResponse = null;
  for (let i = 1; i <= 6; i++) {
    const attempt = await request('POST', '/api/v1/auth/login', {
      email: attackerTarget,
      senha: `tentativa_errada_${i}`
    });
    if (attempt.status === 429) {
      blockedResponse = attempt;
      break;
    }
  }
  if (!blockedResponse || blockedResponse.status !== 429) {
    console.error('❌ FALHA: Rate limiter não bloqueou após 5 tentativas incorretas!', blockedResponse);
    process.exit(1);
  }
  console.log('✓ Ataque de força bruta neutralizado com sucesso com HTTP 429 Too Many Requests.');
  console.log(`✓ Mensagem do rate limiter: "${blockedResponse.body.erro}"`);

  // 10. Validar persistência atômica e backup
  console.log('\n--- 6. Testando integridade da camada de armazenamento & backup atômico ---');
  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ DB_PATH não encontrado!');
    process.exit(1);
  }
  if (!fs.existsSync(BACKUP_PATH)) {
    console.error('❌ BACKUP_PATH não gerado!');
    process.exit(1);
  }
  const backupStat = fs.statSync(BACKUP_PATH);
  console.log(`✓ Arquivo de backup atômico validado: ${BACKUP_PATH} (${backupStat.size} bytes).`);

  console.log('\n================================================================');
  console.log('🎉 AUDITORIA DE SEGURANÇA E AUTENTICAÇÃO APROVADA COM SUCESSO (100%)!');
  console.log('================================================================');
}

runSecurityAudit().catch(err => {
  console.error('Erro na execução dos testes de segurança:', err);
  process.exit(1);
});
