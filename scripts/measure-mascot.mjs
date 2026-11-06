// Mengukur kotak maskot yang benar-benar terlihat (tanpa area transparan) per slide.
// Pakai: node scripts/measure-mascot.mjs projects/<brand>/<slug>
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const dir = process.argv[2];
const files = fs.readdirSync(path.join(dir, '_build')).filter((f) => f.endsWith('.html')).sort();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
const alpha = new Map();
async function bbox(src) {
  if (alpha.has(src)) return alpha.get(src);
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 20) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  const r = { x0: x0 / info.width, y0: y0 / info.height, x1: (x1 + 1) / info.width, y1: (y1 + 1) / info.height };
  alpha.set(src, r); return r;
}
for (const f of files) {
  await page.goto(pathToFileURL(path.resolve(dir, '_build', f)).href);
  await page.waitForLoadState('networkidle');
  const imgs = await page.evaluate(() => [...document.querySelectorAll('.fmas-i')].map((e) => {
    const r = e.getBoundingClientRect(), nw = e.naturalWidth, nh = e.naturalHeight;
    const s = Math.min(r.width / nw, r.height / nh), w = nw * s, h = nh * s;
    const fit = getComputedStyle(e).objectFit === 'contain' && Math.abs(r.width / r.height - nw / nh) > 0.01;
    // object-position bottom center
    return { src: e.currentSrc, x: fit ? r.left + (r.width - w) / 2 : r.left, y: fit ? r.top + r.height - h : r.top, w: fit ? w : r.width, h: fit ? h : r.height };
  }));
  for (const m of imgs) {
    const b = await bbox(fileURLToPath(m.src));
    const v = [m.x + b.x0 * m.w, m.y + b.y0 * m.h, m.x + b.x1 * m.w, m.y + b.y1 * m.h].map(Math.round);
    console.log(`${f}  ${path.basename(fileURLToPath(m.src))}  terlihat [${v.join(',')}]  w${v[2] - v[0]} h${v[3] - v[1]}`);
  }
}
await browser.close();
