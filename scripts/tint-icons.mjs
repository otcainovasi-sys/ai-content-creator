// Mewarnai ikon 3D ke palet brand secara multi-warna, dengan volume 3D tetap terjaga.
// Cara kerja: bagian ikon dipisah dengan k-means pada warna aslinya, lalu tiap bagian diberi warna peran dari
// config/icon-palettes.json. Bayangan dan kilap diambil dari luminansi asli. Skema diputar antar-ikon.
// Sumber (prioritas naik): assets/icons/fluent (MIT), custom, 3dicons-color (CC0).
// Hasil: assets/icons/<brand>/<id>.png. Jalankan: npm run icons
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const { _catatan, ...PALETTES } = JSON.parse(fs.readFileSync('config/icon-palettes.json', 'utf8'));
const K = 3;
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Warna opponent sederhana: cukup untuk memisahkan bagian ikon. */
const feat = (r, g, b) => [(r - g) * 0.9, (r + g - 2 * b) * 0.5, (0.299 * r + 0.587 * g + 0.114 * b) * 0.55];

function kmeans(pts) {
  // Inisialisasi deterministik: titik paling jauh.
  const cs = [pts[Math.floor(pts.length / 2)].slice()];
  while (cs.length < K) {
    let best = pts[0], bd = -1;
    for (let i = 0; i < pts.length; i += 7) {
      const d = Math.min(...cs.map((c) => (c[0] - pts[i][0]) ** 2 + (c[1] - pts[i][1]) ** 2 + (c[2] - pts[i][2]) ** 2));
      if (d > bd) { bd = d; best = pts[i]; }
    }
    cs.push(best.slice());
  }
  for (let it = 0; it < 12; it++) {
    const sum = cs.map(() => [0, 0, 0, 0]);
    for (const p of pts) {
      let bi = 0, bd = Infinity;
      cs.forEach((c, i) => { const d = (c[0] - p[0]) ** 2 + (c[1] - p[1]) ** 2 + (c[2] - p[2]) ** 2; if (d < bd) { bd = d; bi = i; } });
      const s = sum[bi]; s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; s[3]++;
    }
    sum.forEach((s, i) => { if (s[3]) cs[i] = [s[0] / s[3], s[1] / s[3], s[2] / s[3]]; });
  }
  return cs;
}

/** Bayangan -> warna dasar -> kilap. t: 0..1. */
function shade(c, t) {
  const lum = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
  const dark = lum > 200 ? c.map((v) => v * 0.68) : c.map((v) => v * 0.42);
  const light = lum < 70 ? c.map((v) => v + (255 - v) * 0.34) : c.map((v) => v + (255 - v) * 0.62);
  return t < 0.55 ? dark.map((v, i) => v + (c[i] - v) * (t / 0.55)) : c.map((v, i) => v + (light[i] - v) * ((t - 0.55) / 0.45));
}

async function analyse(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  const pts = [];
  for (let i = 0; i < n; i += 5) { const p = i * 4; if (data[p + 3] > 128) pts.push(feat(data[p], data[p + 1], data[p + 2])); }
  const cs = kmeans(pts);
  // Gradasi satu warna tidak boleh terbelah jadi dua warna brand: gabungkan bagian yang hanya beda terang sedikit.
  const group = [...cs.keys()];
  for (let i = 0; i < K; i++) for (let j = i + 1; j < K; j++) {
    const chroma = Math.hypot(cs[i][0] - cs[j][0], cs[i][1] - cs[j][1]), light = Math.abs(cs[i][2] - cs[j][2]);
    if (chroma < 62 && light < 95) { const g = group[j]; for (let k = 0; k < K; k++) if (group[k] === g) group[k] = group[i]; }
  }
  const w = new Float32Array(n * K), lum = new Float32Array(n), area = new Array(K).fill(0);
  const byC = cs.map(() => []);
  for (let i = 0; i < n; i++) {
    const p = i * 4, f = feat(data[p], data[p + 1], data[p + 2]);
    lum[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
    if (data[p + 3] < 8) continue;
    const d = cs.map((c) => (c[0] - f[0]) ** 2 + (c[1] - f[1]) ** 2 + (c[2] - f[2]) ** 2);
    const m = Math.min(...d), e = d.map((x) => Math.exp(-(x - m) / 420)), s = e.reduce((a, b) => a + b, 0);
    let bi = 0;
    e.forEach((x, k) => { w[i * K + group[k]] += x / s; if (x > e[bi]) bi = k; });
    area[group[bi]]++; if (i % 5 === 0) byC[group[bi]].push(lum[i]);
  }
  const range = byC.map((a) => { a.sort((x, y) => x - y); return [a[Math.floor(a.length * 0.04)] ?? 0, a[Math.floor(a.length * 0.96)] ?? 255]; });
  const order = [...area.keys()].filter((k) => area[k] > 0).sort((a, b) => area[b] - area[a]); // bagian terbesar dulu
  return { data, info, n, w, lum, range, order };
}

const sources = new Map();
for (const dir of ['assets/icons/fluent', 'assets/icons/custom', 'assets/icons/3dicons-color']) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.png')) sources.set(f, path.join(dir, f));
}
for (const brand of Object.keys(PALETTES)) fs.mkdirSync(path.join('assets/icons', brand), { recursive: true });

for (const [name, src] of sources) {
  const a = await analyse(src);
  for (const [brand, schemes] of Object.entries(PALETTES)) {
    const scheme = schemes[hash(name) % schemes.length].map(hex);
    const role = new Array(K);
    a.order.forEach((c, rank) => { role[c] = scheme[rank]; });
    const out = Buffer.from(a.data);
    for (let i = 0; i < a.n; i++) {
      const p = i * 4;
      if (out[p + 3] < 8) continue;
      let r = 0, g = 0, b = 0;
      for (let k = 0; k < K; k++) {
        const wt = a.w[i * K + k];
        if (wt < 0.01 || !role[k]) continue;
        const [lo, hi] = a.range[k];
        const t = Math.max(0, Math.min(1, (a.lum[i] - lo) / Math.max(12, hi - lo)));
        const c = shade(role[k], t);
        r += c[0] * wt; g += c[1] * wt; b += c[2] * wt;
      }
      out[p] = r; out[p + 1] = g; out[p + 2] = b;
    }
    await sharp(out, { raw: { width: a.info.width, height: a.info.height, channels: 4 } }).png({ compressionLevel: 9 }).toFile(path.join('assets/icons', brand, name));
  }
}
console.log(`${sources.size} ikon x ${Object.keys(PALETTES).length} brand`);
