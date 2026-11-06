import fs from 'node:fs';
import { renderSpec } from '../render/render.js';

const file = process.argv[2];
if (!file) { console.error('Pakai: npm run render -- <spec.json>'); process.exit(2); }

const r = await renderSpec(JSON.parse(fs.readFileSync(file, 'utf8')));
console.log(`${r.status}  ${r.dir}`);
for (const s of r.slides) {
  console.log(`  slide ${s.slide} [${s.layout}] skala teks ${s.fitScale}`);
  for (const i of s.issues) console.log(`    ${i.level === 'critical' ? 'KRITIS' : 'catatan'} ${i.code}: ${i.message}`);
}
process.exit(r.status === 'DIBLOKIR' ? 1 : 0);
