import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('🌐 INICIANDO TESTE E2E PLAYWRIGHT: RBAC & CONTROLE DE ACESSO');
console.log('================================================================');

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  try {
    // 1. Abrir a tela de Login
    console.log('1. Navegando para a tela de autenticação...');
    await page.goto('http://127.0.0.1:5173/?view=login', { waitUntil: 'networkidle' });

    // Verificar se os 6 perfis de demonstração estão visíveis na tela de Login
    const demoCardText = await page.textContent('body');
    if (!demoCardText.includes('Dr. Roberto Schneider') || !demoCardText.includes('Carlos Eduardo Silva') || !demoCardText.includes('Valmor Bertoncelli')) {
      throw new Error('Cards de perfis operacionais demo não encontrados na tela de Login!');
    }
    console.log('✓ Cards de demonstração dos perfis RBAC encontrados com sucesso.');

    // 2. Login como Superadmin Master
    console.log('2. Efetuando login como Superadmin Master (Dr. Roberto Schneider)...');
    const superadminBtn = page.locator('button', { hasText: 'Dr. Roberto Schneider' }).first();
    await superadminBtn.click();
    await page.waitForTimeout(2000);

    // Verificar se os elementos exclusivos de Superadmin aparecem
    const superadminTopbarBtn = page.locator('button', { hasText: 'Perfis & Matriz RBAC' }).first();
    const isTopbarBtnVisible = await superadminTopbarBtn.isVisible();
    if (!isTopbarBtnVisible) {
      throw new Error('Botão "Perfis & Matriz RBAC" não está visível para o Superadmin!');
    }
    console.log('✓ Botão "Perfis & Matriz RBAC" visível no Topbar para Superadmin.');

    // Abrir o Modal de Governança RBAC
    console.log('3. Abrindo Modal de Governança RBAC como Superadmin...');
    await superadminTopbarBtn.click();
    await page.waitForTimeout(1000);

    const modalTitle = await page.textContent('body');
    if (!modalTitle.includes('Governança & Matriz de Perfis de Acesso (RBAC)')) {
      throw new Error('Modal de Governança RBAC não abriu com o título esperado!');
    }
    console.log('✓ Modal PerfilAcessoSuperadminModal aberto com sucesso!');

    // Capturar screenshot do Modal de Governança do Superadmin
    await page.screenshot({ path: '/home/user/screenshot_rbac_superadmin_matrix.png' });
    console.log('✓ Screenshot salvo: screenshot_rbac_superadmin_matrix.png');

    // Fechar o modal
    const closeBtn = page.locator('button', { hasText: 'Fechar Painel' }).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(800);

    // 3. Trocar para Operador via Login
    console.log('4. Navegando para Login e autenticando como Operador de Máquinas...');
    await page.goto('http://127.0.0.1:5173/?view=login', { waitUntil: 'networkidle' });
    const operadorBtn = page.locator('button', { hasText: 'Valmor Bertoncelli' }).first();
    await operadorBtn.click();
    await page.waitForTimeout(2000);

    // Verificar se os botões de Superadmin NÃO existem na tela do Operador
    const hasSuperadminTopbar = await page.locator('button', { hasText: 'Perfis & Matriz RBAC' }).isVisible();
    if (hasSuperadminTopbar) {
      throw new Error('ERRO CRÍTICO: Botão de Superadmin visível para Operador de Máquinas!');
    }
    console.log('✓ Botão de governança Superadmin NÃO exibido para o Operador (Acesso restrito OK).');

    // Verificar indicador de perfil restrito na sidebar
    const operadorPageText = await page.textContent('body');
    if (!operadorPageText.includes('Operador') || !operadorPageText.includes('Recursos restritos ao perfil')) {
      throw new Error('Indicador de perfil restrito ausente na barra lateral do Operador!');
    }
    console.log('✓ Indicador "Recursos restritos ao perfil cadastrado" confirmado na sidebar do Operador.');

    // Capturar screenshot do Cockpit restrito do Operador
    await page.screenshot({ path: '/home/user/screenshot_rbac_operador_restricted.png' });
    console.log('✓ Screenshot salvo: screenshot_rbac_operador_restricted.png');

    // 4. Trocar para Contador Rural
    console.log('5. Autenticando como Contadora Rural & Fiscal...');
    await page.goto('http://127.0.0.1:5173/?view=login', { waitUntil: 'networkidle' });
    const contadorBtn = page.locator('button', { hasText: 'Valéria Campos' }).first();
    await contadorBtn.click();
    await page.waitForTimeout(2000);

    const contadorPageText = await page.textContent('body');
    if (!contadorPageText.includes('Contador') && !contadorPageText.includes('Valéria Campos')) {
      throw new Error('Autenticação como Contador Rural falhou!');
    }
    console.log('✓ Cockpit da Contadora Rural autenticado com sucesso.');

    // Capturar screenshot do Cockpit do Contador
    await page.screenshot({ path: '/home/user/screenshot_rbac_contador_view.png' });
    console.log('✓ Screenshot salvo: screenshot_rbac_contador_view.png');

    console.log('\n================================================================');
    console.log('🎉 TESTE E2E PLAYWRIGHT APROVADO COM 100% DE SUCESSO!');
    console.log('================================================================');
  } catch (err) {
    console.error('❌ Falha no teste Playwright:', err);
    await page.screenshot({ path: '/home/user/screenshot_error_playwright.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
