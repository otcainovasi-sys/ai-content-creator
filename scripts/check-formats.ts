import fs from 'node:fs';
import { chromium } from 'playwright';
import { renderSpec } from '../src/render/render.js';

const out = process.argv[2];
const browser = await chromium.launch();
const tally: Record<string, Record<string, number>> = {};
for (const brand of ['jepang-koey', 'ciao-manda', 'info-jerman', 'otca']) {
  const s = JSON.parse(fs.readFileSync(`specs/samples/${brand}.json`, 'utf8'));
  for (const format of ['feed_square', 'story', 'reels_cover', 'landscape']) {
    const r = await renderSpec({ ...s, format, slug: format.replace('_', '-') }, { browser, outRoot: out });
    for (const sl of r.slides) for (const i of sl.issues) {
      if (i.code === 'PLACEHOLDER') continue;
      (tally[format] ??= {});
      const k = `${i.level === 'critical' ? '!' : ''}${i.code} ${sl.layout}`;
      tally[format][k] = (tally[format][k] ?? 0) + 1;
    }
  }
}
await browser.close();
console.log(JSON.stringify(tally, null, 1));
