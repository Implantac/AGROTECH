import { chromium } from 'playwright';

async function testQuickAccess() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err));

  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });

  // Enter platform
  const enterBtn = page.locator('text=Conhecer a plataforma').first();
  await enterBtn.click();
  await page.waitForTimeout(1000);

  // Click search button
  console.log('Clicking search button...');
  const searchBtn = page.locator('button:has-text("Buscar módulo")').first();
  await searchBtn.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: '/home/user/screenshot_quick_access_review.png' });
  await browser.close();
}

testQuickAccess().catch(console.error);
