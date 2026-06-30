import { chromium } from 'playwright';
import path from 'path';

const scratchDir = 'C:/Users/JOSALE~1/AppData/Local/Temp/claude/C--dev-Claude-code-05-arcade-vault/7fb173b8-9059-4cc6-b246-a6a06e636ea8/scratchpad';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);

// Hero + subtitle zone
await page.screenshot({
  path: path.join(scratchDir, 'zone-hero.png'),
  clip: { x: 0, y: 60, width: 1440, height: 320 }
});

// Filters zone (search + chips)
await page.screenshot({
  path: path.join(scratchDir, 'zone-filters.png'),
  clip: { x: 0, y: 360, width: 1440, height: 90 }
});

// First card row
await page.screenshot({
  path: path.join(scratchDir, 'zone-cards.png'),
  clip: { x: 0, y: 430, width: 1440, height: 380 }
});

// Full page
await page.screenshot({ path: path.join(scratchDir, 'app-fullpage.png'), fullPage: true });

console.log('Console errors:', errors.length ? errors : 'none');
console.log('All detail screenshots saved');
await browser.close();
