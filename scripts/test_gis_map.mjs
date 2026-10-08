import { chromium } from 'playwright';

async function testGisMap() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:5173/#cockpit', { timeout: 10000 });
  await page.waitForTimeout(500);

  const sigTab = page.locator('text=Mapas SIG & Satélite').first();
  await sigTab.click({ timeout: 5000 });
  await page.waitForTimeout(1000);

  // Take screenshot of default map
  await page.screenshot({ path: '/home/user/screenshot_gis_map.png' });
  console.log('Saved screenshot_gis_map.png');

  // Try clicking NDRE button with force
  const ndreBtn = page.locator('button:has-text("NDRE Clorofila")').first();
  if (await ndreBtn.count() > 0) {
    await ndreBtn.click({ force: true, timeout: 2000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/home/user/screenshot_gis_map_ndre.png' });
    console.log('Saved screenshot_gis_map_ndre.png');
  }

  await browser.close();
}

testGisMap().catch(console.error);
