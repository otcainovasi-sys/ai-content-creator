import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { renderSpec } from '../render/render.js';

const dir = process.argv[2];
if (!dir) { console.error('Pakai: npm run batch -- <folder-spec>'); process.exit(2); }

const files = fs.readdirSync(dir, { recursive: true }).map(String).filter((f) => f.endsWith('.json')).sort();
const browser = await chromium.launch();
const rows: { file: string; status: string; critical: number; warnings: number }[] = [];
for (const f of files) {
  try {
    const r = await renderSpec(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')), { browser });
    const all = r.slides.flatMap((s) => s.issues);
    const critical = all.filter((i) => i.level === 'critical').length;
    rows.push({ file: f, status: r.status, critical, warnings: all.length - critical });
    for (const s of r.slides) for (const i of s.issues) console.log(`  ${f} #${s.slide} ${i.level === 'critical' ? 'KRITIS' : 'catatan'} ${i.code}: ${i.message}`);
  } catch (e) {
    rows.push({ file: f, status: 'GAGAL', critical: 1, warnings: 0 });
    console.error(`  ${f} GAGAL: ${(e as Error).message}`);
  }
}
await browser.close();
console.table(rows);
process.exit(rows.some((r) => r.status !== 'SIAP_DIREVIEW') ? 1 : 0);
