// Membuat ornamen dekoratif SVG per brand (buatan sendiri, bebas lisensi). Hasil: assets/decor/<brand>/*.svg
// Jalankan: npm run decor. Warna dari config/decor.json; penempatan diatur di config/brands/<brand>.json -> decor.
import fs from 'node:fs';
import path from 'node:path';

const CFG = JSON.parse(fs.readFileSync('config/decor.json', 'utf8'));
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const f = (n) => Number(n.toFixed(1));
const svg = (w, h, body, defs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none"><defs>${defs}</defs>${body}</svg>`;
const grain = (id) => `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="3" result="n"/><feColorMatrix in="n" type="saturate" values="0" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in" result="gm"/><feBlend in="SourceGraphic" in2="gm" mode="overlay"/></filter>`;

/** Berkas garis mengalir: N kurva paralel dengan stroke gradasi (seperti ornamen emas di feed OTCA). */
function flowLines(c, n = 16) {
  const W = 1200, H = 800;
  let paths = '';
  for (let i = 0; i < n; i++) {
    const o = i * 14;
    paths += `<path d="M-50 ${f(560 - o)} C ${f(250 + o)} ${f(820 - o * 1.4)}, ${f(520 - o)} ${f(120 + o * 0.6)}, ${f(1250)} ${f(260 - o * 0.9)}" stroke="url(#fl)" stroke-width="${f(1.4 + (i % 3) * 0.5)}" stroke-opacity="${f(0.35 + 0.65 * (1 - Math.abs(i - n / 2) / (n / 2)))}"/>`;
  }
  return svg(W, H, paths, `<linearGradient id="fl" x1="0" y1="0" x2="1" y2="0">${c.line.map((col, i, a) => `<stop offset="${f(i / (a.length - 1))}" stop-color="${col}"/>`).join('')}</linearGradient>`);
}

/** Blob organik dengan gradasi dan grain (gaya bentuk abstrak modern). */
function blob(c, k) {
  const N = 9, R = 300, pts = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2, r = R * (0.72 + rnd() * 0.36);
    pts.push([500 + Math.cos(a) * r, 500 + Math.sin(a) * r]);
  }
  let d = '';
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
    if (!i) d += `M${f(p1[0])} ${f(p1[1])}`;
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)}, ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)}, ${f(p2[0])} ${f(p2[1])}`;
  }
  const [a, b] = c.blob[k % c.blob.length];
  return svg(1000, 1000, `<path d="${d}Z" fill="url(#bg)" filter="url(#gr)"/>`,
    `<radialGradient id="bg" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>${grain('gr')}`);
}

/** Kilau bintang empat sudut. */
const sparkle = (c) => svg(200, 200, `<path d="M100 0 C108 70 130 92 200 100 C130 108 108 130 100 200 C92 130 70 108 0 100 C70 92 92 70 100 0Z" fill="${c.sparkle}"/>`);

/** Cincin konsentris tipis. */
const rings = (c) => svg(800, 800, Array.from({ length: 7 }, (_, i) => `<circle cx="400" cy="400" r="${120 + i * 42}" stroke="${c.ring}" stroke-width="2" stroke-opacity="${f(0.9 - i * 0.11)}"/>`).join(''));

/** Grid titik. */
const dots = (c) => {
  let b = '';
  for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) b += `<circle cx="${20 + x * 40}" cy="${20 + y * 40}" r="4" fill="${c.dot}"/>`;
  return svg(400, 400, b);
};

/** Pola seigaiha (gelombang Jepang), satu panel. */
const seigaiha = (c) => {
  let b = '';
  for (let row = 0; row < 9; row++) for (let col = -1; col < 9; col++) {
    const cx = col * 100 + (row % 2 ? 50 : 0), cy = row * 25;
    for (let r = 50; r > 8; r -= 12) b += `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="${c.pattern}" stroke-width="2.4" fill="${r === 50 ? c.patternFill : 'none'}"/>`;
  }
  return svg(800, 240, b);
};

/** Awan bergaya Jepang (garis lengkung bertumpuk). */
const cloud = (c) => svg(600, 220, `<path d="M20 180 H560 M40 180 C40 120 120 100 160 140 C160 70 260 40 300 110 C330 60 420 60 430 130 C470 100 540 120 540 180" stroke="${c.cloud}" stroke-width="10" stroke-linecap="round" fill="${c.cloudFill}"/>
  <path d="M200 140 C215 120 245 120 255 140 M360 130 C372 112 398 112 408 130" stroke="${c.cloud}" stroke-width="7" stroke-linecap="round"/>`);

/** Pita gelombang untuk bagian bawah slide. */
const wave = (c) => svg(1080, 360, `<path d="M0 140 C240 60 420 220 660 140 C820 90 960 70 1080 120 V360 H0Z" fill="url(#wv)"/><path d="M0 110 C260 30 420 190 680 112 C840 64 980 44 1080 92" stroke="${c.waveLine}" stroke-width="3" stroke-opacity=".7"/>`,
  `<linearGradient id="wv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.wave[0]}"/><stop offset="1" stop-color="${c.wave[1]}"/></linearGradient>`);

/** Kilap diagonal di sudut. */
const sheen = (c) => svg(600, 600, `<path d="M600 0 L600 600 L0 0Z" fill="url(#sh)"/>`, `<linearGradient id="sh" x1="1" y1="0" x2="0.3" y2="0.7"><stop offset="0" stop-color="${c.sheen}" stop-opacity=".55"/><stop offset="1" stop-color="${c.sheen}" stop-opacity="0"/></linearGradient>`);

/** Busur tebal: aksen geometris yang bersih. */
const arc = (c) => svg(800, 800, `<circle cx="400" cy="400" r="300" stroke="${c.arc}" stroke-width="70"/><circle cx="400" cy="400" r="222" stroke="${c.arc2}" stroke-width="6"/>`);

/** Stiker starburst untuk label seperti BONUS atau FREE. */
function burst(c) {
  let d = '';
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2, r = i % 2 ? 176 : 200;
    d += `${i ? 'L' : 'M'}${f(200 + Math.cos(a) * r)} ${f(200 + Math.sin(a) * r)} `;
  }
  return svg(400, 400, `<path d="${d}Z" fill="url(#bu)"/><circle cx="200" cy="200" r="150" stroke="${c.burstLine}" stroke-width="3" stroke-dasharray="6 8"/>`,
    `<linearGradient id="bu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.burst[0]}"/><stop offset="1" stop-color="${c.burst[1]}"/></linearGradient>`);
}

const MAKERS = { arc, burst, 'flow-lines': flowLines, 'blob-1': (c) => blob(c, 0), 'blob-2': (c) => blob(c, 1), 'blob-3': (c) => blob(c, 2), sparkle, rings, dots, seigaiha, cloud, wave, sheen };

for (const [brand, c] of Object.entries(CFG)) {
  const dir = path.join('assets/decor', brand);
  fs.mkdirSync(dir, { recursive: true });
  seed = 7;
  for (const name of c.make) fs.writeFileSync(path.join(dir, `${name}.svg`), MAKERS[name](c));
  console.log(`${brand}: ${c.make.join(', ')}`);
}
