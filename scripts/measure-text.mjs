// Mengukur teks pada slide hasil render: ukuran font, jarak baris, spasi huruf, posisi, dan jumlah baris.
// Pakai: node scripts/measure-text.mjs projects/<brand>/<slug>
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const dir = process.argv[2];
const js = fs.readFileSync('src/render/browser.js', 'utf8');
const files = fs.readdirSync(path.join(dir, '_build')).filter((f) => f.endsWith('.html')).sort();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
for (const f of files) {
  await page.goto(pathToFileURL(path.resolve(dir, '_build', f)).href);
  await page.addScriptTag({ content: js });
  await page.evaluate('window.__fitAndMeasure()');
  const rows = await page.evaluate(() => {
    const sel = '.title,.ftext,.fc-h,.fc-t,.fr-h,.fr-t,.nm,.fpillx span,.pn-head,.pn-li,.fp-t,.ct-tag,.ct-h,.ct-s,.footer,.ftile .ft-h';
    return [...document.querySelectorAll(sel)].filter((e) => e.textContent.trim()).map((e) => {
      const cs = getComputedStyle(e), r = e.getBoundingClientRect(), lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
      return { cls: e.className.split(' ')[0], size: +parseFloat(cs.fontSize).toFixed(1), weight: cs.fontWeight, lh: +(lh / parseFloat(cs.fontSize)).toFixed(2), ls: cs.letterSpacing,
        x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), lines: Math.round(r.height / lh), text: e.textContent.trim().slice(0, 40) };
    });
  });
  console.log('== ' + f);
  for (const r of rows) console.log(`  ${r.cls.padEnd(8)} ${String(r.size).padStart(5)} w${r.weight} lh${r.lh} ls:${r.ls} x${r.x} y${r.y} h${r.h} baris:${r.lines}  ${r.text}`);
}
await browser.close();
