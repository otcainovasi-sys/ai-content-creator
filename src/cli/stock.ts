import 'dotenv/config';
import { downloadStock, searchStock } from '../stock/stock.js';

const [q, nArg, provider] = process.argv.slice(2);
if (!q) { console.error('Pakai: npm run stock -- "kata kunci" [jumlah] [pexels|pixabay|openverse]'); process.exit(2); }

const hits = await searchStock(q, Number(nArg ?? 3), provider);
if (!hits.length) { console.error('Tidak ada hasil.'); process.exit(1); }
for (const h of hits) {
  try {
    console.log(`${await downloadStock(h, q)}  ${h.width}x${h.height}  ${h.license}  ${h.author}`);
  } catch (e) {
    console.warn(`lewati ${h.id}: ${(e as Error).message}`);
  }
}
