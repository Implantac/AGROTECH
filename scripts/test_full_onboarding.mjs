import { chromium } from 'playwright';

async function testFullOnboarding() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });

  // Click Começar agora
  await page.click('button:has-text("Começar agora")');
  await page.waitForTimeout(400);

  // Step 1: User details
  console.log('Filling Step 1...');
  await page.fill('input[placeholder*="Carlos Eduardo"]', 'Roberto Marcondes');
  await page.fill('input[placeholder*="produtor@fazenda"]', 'roberto@fazendasantaclara.com.br');
  await page.fill('input[placeholder*="Mínimo 8 dígitos"]', 'senhaSegura123!');
  await page.click('button:has-text("Avançar para Dados da Fazenda")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/home/user/screenshot_onboarding_step2.png' });

  // Step 2: Farm details
  console.log('Filling Step 2...');
  await page.fill('input[placeholder*="Fazenda Santa Maria"]', 'Fazenda Santa Clara');
  await page.fill('input[placeholder*="Sorriso/MT"]', 'Rio Verde/GO');
  await page.click('button:has-text("Avançar para Vocação")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/home/user/screenshot_onboarding_step3.png' });

  // Step 3: Vocation & Cultures
  console.log('Filling Step 3...');
  await page.click('button:has-text("Avançar para Talhão")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/home/user/screenshot_onboarding_step4.png' });

  // Step 4: First Field
  console.log('Completing Onboarding...');
  await page.click('button:has-text("Concluir e Abrir Cockpit")');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: '/home/user/screenshot_onboarding_completed.png' });

  console.log('Full onboarding flow tested and captured successfully!');
  await browser.close();
}

testFullOnboarding().catch(console.error);
