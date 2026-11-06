// npm run check-plan -- plans/<senin>/<brand>.json
// npm run check-plan -- --topik <brand> "<topik>"
import fs from 'node:fs';
import { checkPlan, library, repeats } from '../plan/plan.js';

const args = process.argv.slice(2);
if (args[0] === '--topik') {
  const hits = repeats(args[2] ?? '', library(args[1]), 0.4);
  if (!hits.length) console.log('Tidak ada konten tayang yang mirip.');
  for (const h of hits) console.log(`${Math.round(h.skor * 100)}%  ${h.hook}`);
  process.exit(0);
}
if (!args[0]) { console.error('Pakai: npm run check-plan -- <file rencana>'); process.exit(2); }
const found = checkPlan(JSON.parse(fs.readFileSync(args[0], 'utf8')));
for (const f of found) console.log(`${f.level === 'kritis' ? 'KRITIS' : 'catatan'}${f.no ? ` slot ${f.no}` : ''}: ${f.pesan}`);
const critical = found.filter((f) => f.level === 'kritis').length;
console.log(critical ? `${critical} masalah kritis` : 'Rencana lolos');
process.exit(critical ? 1 : 0);
