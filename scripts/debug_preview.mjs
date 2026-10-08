import { chromium } from 'playwright';

async function test() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));
  
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.toString()));

  const failedRequests = [];
  page.on('requestfailed', req => failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`));

  console.log('Navigating to http://127.0.0.1:5173/ ...');
  try {
    const res = await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 10000 });
    console.log('Response status:', res.status());
  } catch (e) {
    console.log('Goto error:', e.message);
  }

  await page.screenshot({ path: 'screenshot_debug_preview.png' });
  console.log('Console messages:', consoleMessages);
  console.log('Page errors:', pageErrors);
  console.log('Failed requests:', failedRequests);

  await browser.close();
}

test();
