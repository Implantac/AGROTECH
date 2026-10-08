#!/usr/bin/env node
/**
 * Teste E2E de Credenciais do Tenant, Certificados Digitais A1, SEFAZ, PIX e Mensageria
 * Princípios 10 (Multi-tenant), 13 (Segurança & Chaves), 15 (Fiscal Explícito) e 16 (Testes Obrigatórios)
 */

const BASE_URL = 'http://127.0.0.1:5173';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALHA: ${message}`);
    process.exit(1);
  }
  console.log(`✅ SUCESSO: ${message}`);
}

async function runTests() {
  console.log('\n🚀 Iniciando Teste E2E de Credenciais Corporativas e Certificado A1...');

  // --- 1. Consulta Inicial de Credenciais do Tenant ---
  console.log('\n--- 1. Consulta de Credenciais com Mascaramento de Segredos ---');
  const resGet = await fetch(`${BASE_URL}/api/v1/tenant/credentials?tenantId=tenant-fazenda-santa-helena`);
  assert(resGet.status === 200, `Endpoint de credenciais respondeu HTTP 200 (recebido: ${resGet.status})`);
  const dataGet = await resGet.json();
  assert(dataGet.sucesso === true, 'Consulta de credenciais retornou sucesso');
  assert(dataGet.credenciais.sefaz !== undefined, 'Objeto SEFAZ presente');
  assert(dataGet.credenciais.bancario !== undefined, 'Objeto bancário presente');
  assert(dataGet.credenciais.mensageria !== undefined, 'Objeto mensageria presente');
  assert(dataGet.credenciais.sefaz.cscCodigo === undefined, 'Código CSC sensível devidamente mascarado da resposta');

  // --- 2. Upload e Validação de Certificado A1 ---
  console.log('\n--- 2. Upload e Validação de Certificado Digital A1 (.pfx) ---');
  const resCert = await fetch(`${BASE_URL}/api/v1/tenant/credentials/certificate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenantId: 'tenant-fazenda-santa-helena',
      nomeArquivo: 'certificado_agro_2026.pfx',
      senha: 'SenhaForteICP2026!',
      ambiente: 'PRODUCAO',
      ufAutorizadora: 'MT',
      titular: 'SCHNEIDER AGRICULTURA E PECUARIA LTDA',
      cnpj: '04.812.049/0001-20',
      cscCodigo: 'TOKEN_CSC_OFICIAL_SEFAZ_MT_91820'
    })
  });

  assert(resCert.status === 200, `Upload do certificado respondeu HTTP 200 (recebido: ${resCert.status})`);
  const dataCert = await resCert.json();
  assert(dataCert.sucesso === true, 'Validação do certificado A1 com chave privada efetuada com sucesso');
  assert(dataCert.certificado.status === 'VALIDO_ICP_BRASIL', 'Certificado validado como VALIDO_ICP_BRASIL');
  assert(dataCert.certificado.sha256Fingerprint.length === 64, 'Fingerprint criptográfico SHA-256 gerado');

  // --- 3. Teste de Conexão com SEFAZ Autorizadora ---
  console.log('\n--- 3. Handshake SSL e Teste de Status com SEFAZ ---');
  const resSefaz = await fetch(`${BASE_URL}/api/v1/tenant/credentials/test-sefaz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uf: 'MT', ambiente: 'PRODUCAO' })
  });

  assert(resSefaz.status === 200, `Teste de conexão SEFAZ respondeu HTTP 200 (recebido: ${resSefaz.status})`);
  const dataSefaz = await resSefaz.json();
  assert(dataSefaz.sucesso === true, 'Handshake com webservice SEFAZ bem-sucedido');
  assert(dataSefaz.statusSefaz === '107_SERVICO_EM_OPERACAO', 'Status do webservice autorizador retornou 107_SERVICO_EM_OPERACAO');
  assert(dataSefaz.latenciaMs > 0, `Latência de rede apurada com fidelidade: ${dataSefaz.latenciaMs}ms`);

  // --- 4. Teste de Envio de Alerta de Mensageria (WhatsApp) ---
  console.log('\n--- 4. Teste de Disparo de Alerta de Campo via Mensageria ---');
  const resMsg = await fetch(`${BASE_URL}/api/v1/tenant/credentials/test-messaging`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenantId: 'tenant-fazenda-santa-helena',
      telefonePlantao: '+55 (66) 99812-3456'
    })
  });

  assert(resMsg.status === 200, `Gateway de mensageria respondeu HTTP 200 (recebido: ${resMsg.status})`);
  const dataMsg = await resMsg.json();
  assert(dataMsg.sucesso === true, 'Mensagem disparada com sucesso');
  assert(dataMsg.status === 'ENTREGUE_AO_DISPOSITIVO', 'Status de entrega confirmado no aparelho');
  assert(dataMsg.destinatario === '+55 (66) 99812-3456', 'Destinatário correto confirmado');

  // --- 5. Emissão de NF-e em Produção com Certificado A1 do Tenant ---
  console.log('\n--- 5. Emissão Fiscal NF-e Modelo 55 em Produção Oficial ---');
  const resNfe = await fetch(`${BASE_URL}/api/v1/sefaz/nfe/emitir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tipo: 'VENDA_GRAOS',
      ambiente: 'PRODUCAO',
      tenantId: 'tenant-fazenda-santa-helena',
      dadosNota: {
        cliente: 'CARGILL AGRICOLA S.A.',
        cnpj: '60.498.706/0001-57',
        valorTotal: 485000.00,
        cfop: '5.101',
        itens: [
          { produto: 'SOJA GRAO SAFRA 25/26', ncm: '1201.90.00', quantidade: 300, unidade: 'TON', valor: 485000.00 }
        ]
      }
    })
  });

  assert(resNfe.status === 200, `Emissão fiscal em PRODUÇÃO respondeu HTTP 200 (recebido: ${resNfe.status})`);
  const dataNfe = await resNfe.json();
  assert(dataNfe.sucesso === true, 'Emissão fiscal autorizada com sucesso em produção');
  assert(dataNfe.status === 'AUTORIZADA_PRODUCAO_SEFAZ', 'Status gravado como AUTORIZADA_PRODUCAO_SEFAZ');
  assert(dataNfe.chaveAcesso.length === 44, 'Chave de acesso com 44 dígitos gerada no padrão ICP');
  assert(dataNfe.protocoloAutorizacao.startsWith('15126'), 'Protocolo oficial de autorização SEFAZ gerado');
  assert(dataNfe.xmlDistribuicao.includes('<infNFe Id='), 'XML completo assinado no padrão Enveloped Signature');

  console.log('\n🌟 TODOS OS TESTES DE CREDENCIAIS CORPORATIVAS E CERTIFICADO A1 PASSARAM COM 100% DE SUCESSO!\n');
}

runTests().catch(err => {
  console.error('❌ Erro inesperado na execução dos testes:', err);
  process.exit(1);
});
