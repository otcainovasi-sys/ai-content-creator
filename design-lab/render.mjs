// Render semua HTML di design-lab/<brand>/ menjadi PNG 1080x1350.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
const dir = path.resolve(process.argv[2] ?? 'design-lab/otca');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
  await page.goto(pathToFileURL(path.join(dir, f)).href, { waitUntil: 'load' });
  await page.evaluate('document.fonts.ready');
  await page.screenshot({ path: path.join(dir, f.replace('.html', '.png')) });
}
await browser.close();
console.log('ok');
