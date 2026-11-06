// Memeriksa kelengkapan knowledge base, fakta kedaluwarsa, dan status konfirmasi. Exit 1 bila ada file yang hilang atau rusak.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('knowledge');
const today = process.argv[2] ?? new Date().toISOString().slice(0, 10);
const SHARED = ['copywriting.md', 'archetypes.md', 'rubric.md', 'sources.md'];
const FILES = ['profile.md', 'patterns.md', 'questions.md', 'assets.md', 'products.json', 'library.json'];
const STATUS = ['terkonfirmasi', 'dari_post_live', 'perlu_konfirmasi'];
const problems = [];

for (const f of SHARED) if (!fs.existsSync(path.join(ROOT, 'shared', f))) problems.push(`shared/${f} tidak ada`);

const rows = [];
for (const brand of fs.readdirSync(path.join(ROOT, 'brands'))) {
  const dir = path.join(ROOT, 'brands', brand);
  for (const f of FILES) if (!fs.existsSync(path.join(dir, f))) problems.push(`${brand}/${f} tidak ada`);
  const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const { items } = read('products.json');
  const library = read('library.json').items;
  const count = (s) => items.filter((i) => i.status === s).length;
  for (const i of items) if (!STATUS.includes(i.status)) problems.push(`${brand}: status "${i.status}" pada ${i.id} tidak dikenal`);
  const expired = items.filter((i) => i.berlaku_sampai && i.berlaku_sampai < today).map((i) => i.id);
  const questions = fs.readFileSync(path.join(dir, 'questions.md'), 'utf8');
  const tag = (t) => (questions.match(new RegExp(`\\[${t}\\]`, 'g')) ?? []).length;
  rows.push({
    brand, fakta: items.length, terkonfirmasi: count('terkonfirmasi'), dari_live: count('dari_post_live'), perlu_konfirmasi: count('perlu_konfirmasi'),
    kedaluwarsa: expired.length, konten_tayang: library.length, pertanyaan: tag('guideline') + tag('live') + tag('hipotesis'), hipotesis: tag('hipotesis'),
    referensi: fs.readdirSync(path.join(dir, 'refs')).length,
  });
  if (expired.length) console.log(`${brand}: kedaluwarsa per ${today}: ${expired.join(', ')}`);
}
console.table(rows);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log('Struktur lengkap.');
