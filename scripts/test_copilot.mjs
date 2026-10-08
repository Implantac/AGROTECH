import { chromium } from 'playwright';

async function testCopilot() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:5173/#cockpit', { timeout: 10000 });
  await page.waitForTimeout(600);

  // Click on "Copilot IA Safra" in sidebar
  const copilotTab = page.locator('text=Copilot IA Safra').first();
  await copilotTab.click({ timeout: 5000 });
  await page.waitForTimeout(800);

  // Take screenshot
  await page.screenshot({ path: '/home/user/screenshot_copilot_safra.png' });
  console.log('Saved screenshot_copilot_safra.png');

  await browser.close();
}

testCopilot().catch(console.error);
