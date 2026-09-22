const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    consoleErrors.push('PAGE ERROR: ' + error.message);
  });
  
  try {
    await page.goto('http://localhost:4201/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    const content = await page.content();
    console.log('Page content length:', content.length);
    console.log('Page content preview:', content.substring(0, 500));
    
    if (consoleErrors.length > 0) {
      console.log('Console errors:');
      consoleErrors.forEach(e => console.log('  -', e));
    } else {
      console.log('No console errors detected');
    }
  } catch (e) {
    console.log('Navigation error:', e.message);
  }
  
  await browser.close();
})();
