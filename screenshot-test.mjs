import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scratchDir = 'C:/Users/JOSALE~1/AppData/Local/Temp/claude/C--dev-Claude-code-05-arcade-vault/7fb173b8-9059-4cc6-b246-a6a06e636ea8/scratchpad';
const refPath = path.join(__dirname, 'references/templates/Arcade Vault.html').replace(/\\/g, '/');

const browser = await chromium.launch({ headless: true });

// Screenshot of live app
const appPage = await browser.newPage();
await appPage.setViewportSize({ width: 1440, height: 900 });
const errors = [];
appPage.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
await appPage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
await appPage.waitForTimeout(2000);
await appPage.screenshot({ path: path.join(scratchDir, 'app-homepage.png') });
console.log('✅ app screenshot saved');
console.log('Console errors:', errors.length ? errors : 'none');

// Screenshot of reference HTML
const refPage = await browser.newPage();
await refPage.setViewportSize({ width: 1440, height: 900 });
await refPage.goto(`file:///${refPath}`, { waitUntil: 'networkidle', timeout: 30000 });
await refPage.waitForTimeout(2000);
await refPage.screenshot({ path: path.join(scratchDir, 'ref-homepage.png') });
console.log('✅ reference screenshot saved');

await browser.close();
