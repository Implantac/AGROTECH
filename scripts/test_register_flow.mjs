import { chromium } from 'playwright';

async function testRegister() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });

  // Click on "Começar agora" to enter registration onboarding
  const registerBtn = page.locator('button:has-text("Começar agora")').first();
  await registerBtn.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: '/home/user/screenshot_register_onboarding.png' });
  console.log('Saved screenshot_register_onboarding.png');

  await browser.close();
}

testRegister().catch(console.error);
