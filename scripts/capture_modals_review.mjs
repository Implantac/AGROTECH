import { chromium } from 'playwright';

async function captureModals() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to landing page...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });

  // Click on "Conhecer a plataforma" to enter the PLATFORM directly
  const enterBtn = page.locator('text=Conhecer a plataforma').first();
  await enterBtn.click();
  await page.waitForTimeout(1000);

  // 1. Open Quick Access Modal via the topbar search input or button
  console.log('Opening Quick Access Modal...');
  const searchBar = page.locator('button:has-text("Buscar módulo"), div:has-text("Buscar módulo")').first();
  if (await searchBar.isVisible()) {
    await searchBar.click();
  } else {
    await page.keyboard.press('Control+k');
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/home/user/screenshot_quick_access_review.png' });
  console.log('Captured QuickAccess screenshot.');

  // Close Quick Access
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // 2. Open Module Config Modal via sidebar button "Configurar Módulos"
  console.log('Opening Module Config Modal...');
  const configBtn = page.locator('button:has-text("Configurar Módulos")').first();
  await configBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/home/user/screenshot_module_config_review.png' });
  console.log('Captured ModuleConfig screenshot.');

  // Also switch to Culturas tab
  const culturasTab = page.locator('button:has-text("2. Culturas")').first();
  if (await culturasTab.isVisible()) {
    await culturasTab.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: '/home/user/screenshot_module_config_culturas.png' });
    console.log('Captured ModuleConfig Culturas screenshot.');
  }

  // Also switch to Modulos tab
  const modulosTab = page.locator('button:has-text("3. Ajuste Fino")').first();
  if (await modulosTab.isVisible()) {
    await modulosTab.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: '/home/user/screenshot_module_config_modulos.png' });
    console.log('Captured ModuleConfig Modulos screenshot.');
  }

  await browser.close();
  console.log('All modal screenshots captured successfully.');
}

captureModals().catch(console.error);
