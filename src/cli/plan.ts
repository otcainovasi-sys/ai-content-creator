// Membuat 10 spec feed satu minggu dari jadwal master. Isi [placeholder] lalu jalankan: npm run batch -- <folder>
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../render/layouts.js';

const [brand, start] = process.argv.slice(2);
if (!brand || !/^\d{4}-\d{2}-\d{2}$/.test(start ?? '')) {
  console.error('Pakai: npm run plan -- <brand> <senin YYYY-MM-DD>');
  process.exit(2);
}
const schedule = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/schedule.json'), 'utf8'));
const brandCfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/brands', `${brand}.json`), 'utf8'));

const image = { src: '[assets/stock/... atau foto brand]' };
const base = { headline: '[headline]', sub: '[subheadline]', cta: '[CTA]' };
const skeleton: Record<string, object> = {
  hero_photo: { ...base, image },
  mascot_hero: { ...base, image, mascot: '[id maskot]', benefits: ['[manfaat 1]', '[manfaat 2]'] },
  score_infographic: { ...base, tableTitle: 'Hasil Belajar', rows: [{ skill: '[keterampilan]', before: '[nilai]', after: '[nilai]', note: '[catatan tutor]' }, { skill: '[keterampilan]', before: '[nilai]', after: '[nilai]', note: '[catatan tutor]' }] },
  story_card: { ...base, image, name: '[nama + izin]', quote: '[kutipan asli]' },
  achievement: { ...base, image, name: '[nama + izin]' },
  tutor_profile: { ...base, image, name: '[nama tutor]', credentials: ['[kredensial]'] },
  program_value: { ...base, image, guarantee: '[garansi bila benar]', benefits: ['[manfaat 1]', '[manfaat 2]'] },
  price_table: { ...base, tiers: [{ name: '[paket]', price: '[harga]', featured: true }], features: ['[fitur]'] },
  numbered_list: { ...base, items: [{ title: '[poin 1]', text: '[penjelasan]' }, { title: '[poin 2]', text: '[penjelasan]' }] },
};

const dir = path.join(ROOT, 'specs', `${start}`, brand);
fs.mkdirSync(dir, { recursive: true });
schedule.feed.forEach((slot: { day: string; time: string; pillar: string; layout: string }, i: number) => {
  const n = String(i + 1).padStart(2, '0');
  const file = path.join(dir, `${n}-${slot.day.toLowerCase()}-${slot.pillar}.json`);
  if (fs.existsSync(file)) return; // Spec yang sudah diisi tidak ditimpa.
  fs.writeFileSync(file, JSON.stringify({
    brand, slug: `${start}-${n}-${slot.pillar.replaceAll('_', '-')}`, month: start.slice(0, 7), pillar: slot.pillar,
    format: 'feed_portrait', schedule: `${slot.day} ${slot.time}`, verified_claims: [],
    slides: [{ layout: slot.layout, ...skeleton[slot.layout] }],
  }, null, 2));
});
console.log(`${schedule.feed.length} slot ${brandCfg.name} (PIC ${brandCfg.pic}) di ${path.relative(ROOT, dir)}`);
