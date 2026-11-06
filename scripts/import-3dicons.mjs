// Mengambil PNG dari SVG 3dicons (CC0) ke assets/icons/3dicons-color, lalu memberi alias nama ikon yang dipakai spec.
// Jalankan: node scripts/import-3dicons.mjs "<folder 3dicons>"  lalu  npm run icons
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const src = process.argv[2];
if (!src) { console.error('Pakai: node scripts/import-3dicons.mjs "<folder>"'); process.exit(2); }
const out = 'assets/icons/3dicons-color';
fs.mkdirSync(out, { recursive: true });

// Nama id kami -> nama 3dicons. Ikon lain tetap bisa dipakai dengan nama aslinya.
const ALIAS = {
  calendar: 'calender', 'spiral-calendar': 'calender', 'alarm-clock': 'clock', stopwatch: 'clock', hourglass: 'clock',
  memo: 'file-text', page: 'file-text', receipt: 'file', clipboard: 'copy', 'direct-hit': 'target', magnifier: 'zoom',
  laptop: 'computer', phone: 'mobile', speech: 'chat-text', thought: 'chat-bubble', pin: 'map-pin', check: 'tick',
  briefcase: 'bag', compass: 'explorer',
  'movie-camera': 'video-camera', envelope: 'mail', crown: 'crow', airplane: 'travel', shield: 'sheild', 'open-book': 'notebook',
};
// Gaya Color dipakai karena bagian ikonnya berbeda warna, jadi bisa dipetakan ke beberapa warna brand.
const STYLE = /[-_]front[-_]color\.svg$/;
const nameOf = (f) => f.replace(/\.svg$/, '').replace(/[-_]front[-_](color|gradient)$/, '');
const files = fs.readdirSync(src);
const pick = files.filter((f) => STYLE.test(f));
// Ikon tanpa gaya Color memakai gaya Gradient.
for (const f of files) if (/[-_]front[-_]gradient\.svg$/.test(f) && !pick.some((x) => nameOf(x) === nameOf(f))) pick.push(f);
let n = 0;
for (const f of pick) {
  const m = fs.readFileSync(path.join(src, f), 'utf8').match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
  if (!m) { console.warn(`lewati ${f}`); continue; }
  await sharp(Buffer.from(m[1], 'base64')).resize(512, 512, { fit: 'inside' }).png().toFile(path.join(out, `${nameOf(f)}.png`));
  n++;
}
for (const [id, name] of Object.entries(ALIAS)) {
  const p = path.join(out, `${name}.png`);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(out, `${id}.png`));
  else console.warn(`alias ${id}: ${name} tidak ada`);
}
fs.writeFileSync(path.join(out, 'LICENSE.txt'), '3dicons by Vijay Verma (https://3dicons.co). CC0 1.0: bebas untuk personal dan komersial tanpa atribusi.\n');
console.log(`${n} ikon`);
