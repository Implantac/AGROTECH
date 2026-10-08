import { chromium } from 'playwright';

async function testScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });

  // Enter platform directly
  const enterBtn = page.locator('text=Conhecer a plataforma').first();
  await enterBtn.click();
  await page.waitForTimeout(1000);

  // 1. Confinamento Bovino: Click on 'Pecuária & ILPF' in sidebar
  console.log('Navigating to Pecuária & ILPF...');
  await page.click('button:has-text("Pecuária & ILPF")');
  await page.waitForTimeout(800);

  // Look for Confinamento pill
  const confPill = page.locator('button:has-text("Confinamento & Cocho")').first();
  if (await confPill.isVisible()) {
    await confPill.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/home/user/screenshot_domain_confinamento.png' });
    console.log('Captured Confinamento Bovino via pill!');
  } else {
    console.log('Confinamento pill not found, trying text match...');
    const altPill = page.locator('button:has-text("Confinamento")').first();
    if (await altPill.isVisible()) {
      await altPill.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: '/home/user/screenshot_domain_confinamento.png' });
      console.log('Captured Confinamento Bovino via alt pill!');
    }
  }

  // 2. FBN: Click on 'Campo & Manejo' in sidebar
  console.log('Navigating to Campo & Manejo...');
  await page.click('button:has-text("Campo & Manejo")');
  await page.waitForTimeout(800);

  const fbnPill = page.locator('button:has-text("FBN & Inoculação")').first();
  if (await fbnPill.isVisible()) {
    await fbnPill.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/home/user/screenshot_domain_fbn.png' });
    console.log('Captured FBN via pill!');
  } else {
    console.log('FBN pill not found, searching in pills...');
    const altFbn = page.locator('button:has-text("FBN")').first();
    if (await altFbn.isVisible()) {
      await altFbn.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: '/home/user/screenshot_domain_fbn.png' });
      console.log('Captured FBN via alt pill!');
    }
  }

  await browser.close();
  console.log('Finished capturing all target modules.');
}

testScreenshots().catch(console.error);
