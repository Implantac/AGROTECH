import assert from 'assert';

async function testBillingFlow() {
  console.log('================================================================');
  console.log('💳 TESTE DE INTEGRAÇÃO REAL: SAAS BILLING, BACEN PIX & WEBHOOK');
  console.log('================================================================');

  const BASE_URL = 'http://127.0.0.1:5173';

  // 1. Criar Checkout de Assinatura via API Real
  console.log('1. Executando checkout para o plano PRO Enterprise (Anual)...');
  const checkoutResp = await fetch(`${BASE_URL}/api/v1/subscription/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planoId: 'PRO',
      ciclo: 'ANNUAL',
      metodoPagamento: 'PIX',
      valorTotal: 12384.0,
    }),
  });

  assert.strictEqual(checkoutResp.status, 200, 'Endpoint checkout deve retornar HTTP 200');
  const checkoutData = await checkoutResp.json();
  assert.ok(checkoutData.sucesso, 'Checkout deve indicar sucesso');
  assert.ok(checkoutData.assinatura.txid, 'Assinatura deve conter TxID');
  assert.ok(checkoutData.assinatura.reciboFiscalNfse, 'Assinatura deve conter recibo fiscal');
  assert.ok(checkoutData.assinatura.autenticacaoBancaria, 'Assinatura deve conter autenticação Bacen');
  console.log(`✓ Assinatura gerada: ${checkoutData.assinatura.id} | TxID: ${checkoutData.assinatura.txid}`);
  console.log(`✓ Recibo NFS-e: ${checkoutData.assinatura.reciboFiscalNfse} | Autenticação: ${checkoutData.assinatura.autenticacaoBancaria}`);

  // 2. Consultar Status do TxID
  console.log('\n2. Consultando status da transação em tempo real via /api/v1/billing/status/:txid...');
  const statusResp = await fetch(`${BASE_URL}/api/v1/billing/status/${checkoutData.assinatura.txid}`);
  assert.strictEqual(statusResp.status, 200, 'Status deve retornar HTTP 200');
  const statusData = await statusResp.json();
  assert.strictEqual(statusData.status, 'PAGO_CONFIRMADO', 'Status deve constar como confirmado');
  console.log(`✓ Status da transação verificado com sucesso: ${statusData.status}`);

  // 3. Testar Webhook Assíncrono de Gateway de Pagamento
  console.log('\n3. Disparando webhook simulando notificação de gateway (Asaas/Stripe/Bacen)...');
  const webhookResp = await fetch(`${BASE_URL}/api/v1/billing/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'PAYMENT_CONFIRMED',
      txid: checkoutData.assinatura.txid,
      amount: 12384.0,
      paymentMethod: 'PIX',
      gatewayId: 'GW-BACEN-2026-991823',
    }),
  });

  assert.strictEqual(webhookResp.status, 200, 'Webhook deve responder HTTP 200');
  const webhookData = await webhookResp.json();
  assert.ok(webhookData.recebido, 'Webhook deve confirmar recebimento do evento');
  console.log(`✓ Webhook processado e persistido no log de auditoria: Log ID ${webhookData.logId}`);

  console.log('\n================================================================');
  console.log('🎉 TESTE DE FATURAMENTO SAAS CONCLUÍDO COM 100% DE SUCESSO!');
  console.log('================================================================');
}

testBillingFlow().catch(err => {
  console.error('❌ Falha no teste de Billing:', err);
  process.exit(1);
});
