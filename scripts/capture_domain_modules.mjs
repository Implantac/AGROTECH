import { chromium } from 'playwright';

async function testDomainModules() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });

  // Enter platform directly
  const enterBtn = page.locator('text=Conhecer a plataforma').first();
  await enterBtn.click();
  await page.waitForTimeout(1000);

  // 1. Click on "Fiscal & ESG"
  console.log('Navigating to Fiscal & ESG...');
  const fiscalBtn = page.locator('button:has-text("Fiscal & ESG")').first();
  if (await fiscalBtn.isVisible()) {
    await fiscalBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/home/user/screenshot_domain_fiscal.png' });
    console.log('Captured Fiscal & ESG.');
  }

  // 2. Click on "Máquinas & Frotas"
  console.log('Navigating to Máquinas & Frotas...');
  const frotasBtn = page.locator('button:has-text("Máquinas & Frotas")').first();
  if (await frotasBtn.isVisible()) {
    await frotasBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/home/user/screenshot_domain_frotas.png' });
    console.log('Captured Máquinas & Frotas.');
  }

  // 3. Click on "Pecuária & ILPF"
  console.log('Navigating to Pecuária & ILPF...');
  const pecuariaBtn = page.locator('button:has-text("Pecuária & ILPF")').first();
  if (await pecuariaBtn.isVisible()) {
    await pecuariaBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/home/user/screenshot_domain_pecuaria.png' });
    console.log('Captured Pecuária & ILPF.');
  }

  // 4. Click on "Mercado & Finanças"
  console.log('Navigating to Mercado & Finanças...');
  const mercadoBtn = page.locator('button:has-text("Mercado & Finanças")').first();
  if (await mercadoBtn.isVisible()) {
    await mercadoBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/home/user/screenshot_domain_mercado.png' });
    console.log('Captured Mercado & Finanças.');
  }

  await browser.close();
  console.log('Domain modules captured successfully.');
}

testDomainModules().catch(console.error);
