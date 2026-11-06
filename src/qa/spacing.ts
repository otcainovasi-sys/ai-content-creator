// Pemeriksaan jarak dan kerapian kotak. Data diukur di halaman oleh browser.js, aturannya di sini.
// Brand dengan design.spacingStrict memblokir pelanggaran berat; brand lain hanya mendapat catatan.
import path from 'node:path';
import sharp from 'sharp';

type Level = 'critical' | 'warning';
export interface SpaceIssue { level: Level; area: 'layout'; code: string; message: string }
export interface R { x: number; y: number; w: number; h: number }
export interface Hit { asset: string; u: number; v: number; masked: boolean }
interface Layer { z: number; ord: number; container: boolean; stack?: boolean; title: number }
export interface SpaceBox extends Layer { name: string; rect: R; ribbon: boolean; parent: number; group: string; hits?: Hit[] }
export interface SpaceText extends Layer { text: string; size: number; rect: R; boxes: number[]; inner: number; hits?: Hit[]; covered?: string }
export interface SpaceImg { rect: R; inner: number }
export interface SpaceMascot { asset: string; rect: R; z: number; ord: number }
export interface Space { boxes: SpaceBox[]; texts: SpaceText[]; imgs: SpaceImg[]; mascots: SpaceMascot[]; stacks?: R[][] }

/** Ambang dalam px pada kanvas 1080. Semua bisa diubah di satu tempat. */
export const SPACE = {
  boxGap: 16, // jarak minimal antar-kotak
  padMin: 12, padRatio: 0.45, // padding minimal = maks(12, 0,45 x ukuran font)
  textGapRatio: 0.75, textGapMin: 16, textGapMax: 28, // jarak teks ke kotak lain
  textTextRatio: 0.3, // jarak antar-teks dari blok berbeda
  uneven: 14, // selisih jarak antar-kotak bertumpuk
  titleGapMax: 100, // jarak judul ke kalimat tepat di bawahnya
  listGapMax: 80, // jarak terbesar antar-butir dalam satu daftar
  voidMax: 150, // rongga kosong terbesar di tengah slide
  fillMin: 0.4, // isi minimal kotak tinggi
  tilt: 2.5, // rasio ruang atas dan bawah di dalam kotak
};

const xOver = (a: R, b: R) => Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
const yOver = (a: R, b: R) => Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
const gapY = (a: R, b: R) => Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h);
const gapX = (a: R, b: R) => Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w);
const short = (s: string) => (s.length > 28 ? `${s.slice(0, 28)}…` : s);
/** Dua elemen dalam satu komposisi (judul berkotak, angka besar berlabel) sengaja dirapatkan; kecuali di dalam kotak isi seperti panel atau kartu. */
const sameDesign = (a: Layer, b: Layer) => (a.ord >= 0 && a.ord === b.ord && !a.container) || (!!a.stack && !!b.stack);

type Alpha = { data: Buffer; w: number; h: number; box: number[] };
const cache = new Map<string, Alpha>();
async function alpha(root: string, asset: string): Promise<Alpha> {
  let a = cache.get(asset);
  if (a) return a;
  const { data, info } = await sharp(path.join(root, asset)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 40) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  a = { data, w: info.width, h: info.height, box: [x0 / info.width, y0 / info.height, (x1 + 1) / info.width, (y1 + 1) / info.height] };
  cache.set(asset, a);
  return a;
}

/** Mengecilkan kotak maskot ke bagian yang benar-benar terlihat, dan menandai titik sampel yang jatuh di piksel maskot yang tidak transparan. */
export async function prepareSpace(s: Space, root: string): Promise<Space & { solid: (h: Hit) => boolean }> {
  const mascots: SpaceMascot[] = [];
  for (const m of s.mascots) {
    const f = (await alpha(root, m.asset)).box, r = m.rect;
    mascots.push({ ...m, rect: { x: r.x + f[0] * r.w, y: r.y + f[1] * r.h, w: (f[2] - f[0]) * r.w, h: (f[3] - f[1]) * r.h } });
  }
  for (const h of [...s.boxes, ...s.texts].flatMap((e) => e.hits ?? [])) await alpha(root, h.asset);
  const solid = (h: Hit) => {
    const a = cache.get(h.asset);
    if (!a || h.masked) return false;
    const x = Math.min(a.w - 1, Math.floor(h.u * a.w)), y = Math.min(a.h - 1, Math.floor(h.v * a.h));
    return a.data[(y * a.w + x) * 4 + 3] > 40;
  };
  return { ...s, mascots, solid };
}

/** Pill judul kartu yang menempel tepat di tepi atas kartunya (pola PDF Info Jerman hal. 17). */
const attached = (a: R, b: R) => { const [u, l] = a.y < b.y ? [a, b] : [b, a]; return Math.abs(l.y - (u.y + u.h)) <= 2 && u.h < 90 && u.x >= l.x && u.x + u.w <= l.x + l.w; };

export function checkSpacing(s: Space & { solid?: (h: Hit) => boolean }, strict = false): SpaceIssue[] {
  const out: SpaceIssue[] = [];
  const add = (level: Level, code: string, message: string) => out.push({ level: strict ? level : 'warning', area: 'layout', code, message });
  const related = (i: number, j: number) => {
    for (let p = s.boxes[i].parent; p >= 0; p = s.boxes[p].parent) if (p === j) return true;
    for (let p = s.boxes[j].parent; p >= 0; p = s.boxes[p].parent) if (p === i) return true;
    return false;
  };

  // 1. Kotak dengan kotak
  for (let i = 0; i < s.boxes.length; i++) for (let j = i + 1; j < s.boxes.length; j++) {
    const a = s.boxes[i], b = s.boxes[j];
    if (related(i, j) || sameDesign(a, b) || attached(a.rect, b.rect)) continue;
    if (xOver(a.rect, b.rect) > 2 && yOver(a.rect, b.rect) > 2) { add('critical', 'BOX_OVERLAP', `Kotak "${short(a.name)}" menimpa "${short(b.name)}" sebanyak ${Math.round(yOver(a.rect, b.rect))} px`); continue; }
    const gy = gapY(a.rect, b.rect), gx = gapX(a.rect, b.rect);
    if (xOver(a.rect, b.rect) > 20 && gy >= 0 && gy < SPACE.boxGap) add('warning', 'SPACE_TIGHT', `Jarak kotak "${short(a.name)}" ke "${short(b.name)}" hanya ${Math.round(gy)} px, minimal ${SPACE.boxGap}`);
    if (yOver(a.rect, b.rect) > 20 && gx >= 0 && gx < SPACE.boxGap) add('warning', 'SPACE_TIGHT', `Jarak samping "${short(a.name)}" ke "${short(b.name)}" hanya ${Math.round(gx)} px, minimal ${SPACE.boxGap}`);
  }

  // 2. Teks dengan kotak yang bukan wadahnya (contoh: pill menempel ke poin pertama)
  for (const t of s.texts) s.boxes.forEach((b, i) => {
    if (t.boxes.includes(i) || sameDesign(t, b) || t.boxes.some((x) => attached(s.boxes[x].rect, b.rect))) return;
    if (xOver(t.rect, b.rect) > 2 && yOver(t.rect, b.rect) > 2) { add('critical', 'TEXT_ON_BOX', `Teks "${short(t.text)}" tertimpa kotak "${short(b.name)}"`); return; }
    const need = Math.min(SPACE.textGapMax, Math.max(SPACE.textGapMin, t.size * SPACE.textGapRatio));
    const g = gapY(t.rect, b.rect);
    if (xOver(t.rect, b.rect) > 20 && g >= 0 && g < need) add(g < need * 0.6 ? 'critical' : 'warning', 'SPACE_TIGHT', `Teks "${short(t.text)}" terlalu dekat dengan "${short(b.name)}": ${Math.round(g)} px, minimal ${Math.round(need)}`);
  });

  // 3. Teks dengan teks dari blok berbeda (judul ke kalimat, kalimat ke kalimat)
  for (let i = 0; i < s.texts.length; i++) for (let j = i + 1; j < s.texts.length; j++) {
    const a = s.texts[i], b = s.texts[j];
    if (a.ord < 0 || b.ord < 0 || sameDesign(a, b) || a.ord === b.ord || a.boxes.some((x) => b.boxes.includes(x))) continue;
    const need = Math.max(a.size, b.size) * SPACE.textTextRatio, g = gapY(a.rect, b.rect);
    if (xOver(a.rect, b.rect) > 20 && g >= 0 && g < need) add('warning', 'SPACE_TIGHT', `Teks "${short(a.text)}" dan "${short(b.text)}" hanya berjarak ${Math.round(g)} px, minimal ${Math.round(need)}`);
  }

  // 4. Isi kotak: padding, keseimbangan atas bawah, ruang kosong
  s.boxes.forEach((b, i) => {
    if (b.ribbon || b.stack) return; // pita dan pill judul: tinggi baris sudah mengatur ruangnya
    const ts = s.texts.filter((t) => t.inner === i);
    if (!ts.length) return;
    // Gambar hiasan yang sengaja keluar dari tepi kotak bukan isi kotak.
    const inside = (r: R) => r.x >= b.rect.x - 1 && r.y >= b.rect.y - 1 && r.x + r.w <= b.rect.x + b.rect.w + 1 && r.y + r.h <= b.rect.y + b.rect.h + 1;
    const rs = [...ts.map((t) => t.rect), ...s.imgs.filter((m) => m.inner === i && inside(m.rect)).map((m) => m.rect)];
    const top = Math.min(...rs.map((r) => r.y)) - b.rect.y, bot = b.rect.y + b.rect.h - Math.max(...rs.map((r) => r.y + r.h));
    const left = Math.min(...rs.map((r) => r.x)) - b.rect.x, right = b.rect.x + b.rect.w - Math.max(...rs.map((r) => r.x + r.w));
    const need = Math.max(SPACE.padMin, Math.max(...ts.map((t) => t.size)) * SPACE.padRatio);
    // Pill pendek: tinggi baris sudah memberi ruang atas bawah, jadi hanya kiri kanan yang dinilai.
    // Nilai negatif berarti label sengaja keluar dari tepi (tab), jadi tidak dinilai.
    const pill = b.rect.h < 80;
    for (const [side, v] of Object.entries({ atas: top, bawah: bot, kiri: left, kanan: right })) {
      if (v < 0 || v >= need || (pill && (side === 'atas' || side === 'bawah'))) continue;
      add('warning', 'BOX_PADDING', `Padding ${side} "${short(b.name)}" hanya ${Math.round(v)} px, minimal ${Math.round(need)}`);
    }
    const hi = Math.max(top, bot), lo = Math.min(top, bot);
    if (!pill && hi > 40 && lo > 0 && hi / lo > SPACE.tilt) add('warning', 'BOX_UNBALANCED', `Isi "${short(b.name)}" tidak seimbang: ruang atas ${Math.round(top)} px, bawah ${Math.round(bot)} px`);
    const fill = (b.rect.h - Math.max(top, 0) - Math.max(bot, 0)) / b.rect.h;
    if (b.rect.h > 120 && fill < SPACE.fillMin) add('warning', 'BOX_EMPTY', `Kotak "${short(b.name)}" terlalu kosong, isi hanya ${Math.round(fill * 100)}% tingginya`);
  });

  // 5. Irama jarak antar-kotak yang bertumpuk
  const groups = new Map<string, SpaceBox[]>();
  for (const b of s.boxes) if (b.group) groups.set(b.group, [...(groups.get(b.group) ?? []), b]);
  for (const list of groups.values()) {
    if (list.length < 3) continue;
    const sorted = [...list].sort((a, b) => a.rect.y - b.rect.y);
    const gaps = sorted.slice(1).map((b, i) => b.rect.y - (sorted[i].rect.y + sorted[i].rect.h));
    if (gaps.every((g) => g >= 0) && Math.max(...gaps) - Math.min(...gaps) > SPACE.uneven) add('warning', 'SPACE_UNEVEN', `Jarak antar-kotak tidak seragam: ${gaps.map(Math.round).join(', ')} px`);
  }

  // 5b. Butir daftar yang terlalu renggang sehingga tidak terbaca sebagai satu kelompok
  for (const list of s.stacks ?? []) {
    const gaps = list.slice(1).map((r, i) => r.y - (list[i].y + list[i].h));
    const wide = Math.max(0, ...gaps);
    if (wide > SPACE.listGapMax) add('critical', 'SPACE_LOOSE', `Jarak antar-butir daftar ${Math.round(wide)} px, maksimal ${SPACE.listGapMax}`);
  }

  // 5c. Judul dan kalimat tepat di bawahnya harus terbaca sebagai satu kelompok
  for (const t of s.texts.filter((x) => x.stack && x.size >= 60)) {
    const bottom = t.rect.y + t.rect.h;
    const next = s.texts.filter((x) => x !== t && !x.stack && x.rect.y >= bottom && xOver(x.rect, t.rect) > 20).sort((a, b) => a.rect.y - b.rect.y)[0];
    if (!next) continue;
    const between = [...s.boxes.map((b) => b.rect), ...s.imgs.map((m) => m.rect), ...s.mascots.map((m) => m.rect)].some((r) => r.y + r.h > bottom && r.y < next.rect.y);
    const g = next.rect.y - bottom;
    if (!between && g > SPACE.titleGapMax) add('critical', 'SPACE_LOOSE', `Judul dan kalimat di bawahnya berjarak ${Math.round(g)} px, maksimal ${SPACE.titleGapMax}`);
  }

  // 6. Rongga besar di tengah slide
  const rects = [...s.boxes.filter((b) => b.parent < 0).map((b) => b.rect), ...s.texts.map((t) => t.rect), ...s.imgs.map((m) => m.rect), ...s.mascots.map((m) => m.rect)].sort((a, b) => a.y - b.y);
  let end = rects[0]?.y ?? 0;
  for (const r of rects) {
    if (r.y - end > SPACE.voidMax) add('warning', 'SPACE_VOID', `Ada rongga kosong ${Math.round(r.y - end)} px (y ${Math.round(end)} sampai ${Math.round(r.y)})`);
    end = Math.max(end, r.y + r.h);
  }

  // 6b. Teks tertutup elemen lain (kabut, gambar, blok lain) di titik tengahnya
  for (const t of s.texts) if (t.covered) add('critical', 'TEXT_COVERED', `Teks "${short(t.text)}" tertutup ${t.covered.split(' ').slice(0, 2).join(' ')}`);

  // 7. Maskot menimpa kotak atau teks: piksel maskot yang tidak transparan berada paling atas di titik sampel.
  if (s.solid) {
    const solid = s.solid;
    for (const b of s.boxes) { const h = (b.hits ?? []).find(solid); if (h) add('critical', 'MASCOT_OVER', `Maskot ${path.basename(h.asset, '.png')} menimpa kotak "${short(b.name)}"`); }
    for (const t of s.texts) { const h = (t.hits ?? []).find(solid); if (h) add('critical', 'MASCOT_OVER', `Maskot ${path.basename(h.asset, '.png')} menimpa teks "${short(t.text)}"`); }
  }

  const seen = new Set<string>();
  return out.filter((i) => !seen.has(i.message) && !!seen.add(i.message));
}
