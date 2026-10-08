import { chromium } from 'playwright';

async function testConfinamento() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });

  // Enter platform
  const enterBtn = page.locator('text=Conhecer a plataforma').first();
  await enterBtn.click();
  await page.waitForTimeout(1000);

  // Switch farm to Estância Pantaneira
  console.log('Switching farm to Estância Pantaneira...');
  const farmDropdown = page.locator('button:has-text("Fazenda Santa Helena")').first();
  await farmDropdown.click();
  await page.waitForTimeout(400);

  const pantaneiraOption = page.locator('button:has-text("Estância Pantaneira")').first();
  await pantaneiraOption.click();
  await page.waitForTimeout(1000);

  // Click on Pecuária & ILPF in the sidebar
  console.log('Navigating to Pecuária & ILPF...');
  await page.click('button:has-text("Pecuária & ILPF")');
  await page.waitForTimeout(800);

  // Click on Confinamento & Cocho
  console.log('Selecting Confinamento & Cocho...');
  const confPill = page.locator('button:has-text("Confinamento & Cocho")').first();
  if (await confPill.isVisible()) {
    await confPill.click();
    await page.waitForTimeout(800);
  }

  await page.screenshot({ path: '/home/user/screenshot_domain_confinamento.png' });
  console.log('Captured Confinamento Bovino successfully!');

  await browser.close();
}

testConfinamento().catch(console.error);
