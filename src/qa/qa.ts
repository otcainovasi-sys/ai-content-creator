import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { FORMATS, isCarousel, type Brand, type Slide, type Spec } from '../schema.js';
import { plain, ROOT } from '../render/layouts.js';

export type Level = 'critical' | 'warning';
export interface Issue { level: Level; area: string; code: string; message: string }
export interface SlideQa { slide: number; layout: string; png: string; fitScale: number; passed: string[]; issues: Issue[] }

interface Rect { x: number; y: number; w: number; h: number }
interface Run { text: string; block: string; color: string; size: number; weight: string; family: string; strike: boolean; footer: boolean; rects: Rect[] }
import { checkSpacing, prepareSpace, type Space } from './spacing.js';

export interface Measure {
  fitted: boolean; scale: number; runs: Run[]; logo: (Rect & { ok: boolean }) | null; safe: Rect;
  images: { asset: string; ok: boolean; w: number; h: number; shown: Rect }[]; fontsLoaded: string[]; ctaCount: number;
  space?: Space;
}

const hit = (a: Rect, b: Rect, pad = 1) =>
  a.x + pad < b.x + b.w && b.x + pad < a.x + a.w && a.y + pad < b.y + b.h && b.y + pad < a.y + a.h;

const lin = (v: number) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
export const luminance = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
export const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const parseRgb = (s: string) => (s.match(/[\d.]+/g) ?? ['0', '0', '0']).slice(0, 3).map(Number) as [number, number, number];
const hexRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/** Klaim yang wajib dipastikan manusia sebelum tayang. */
const CLAIM_PATTERNS: [RegExp, string][] = [
  [/garansi|jaminan|dijamin/i, 'garansi'],
  [/rp\s?[\d.]+|\b\d{1,3}(\.\d{3}){1,3}\b/i, 'harga'],
  [/\b\d+\s?%|lulus\s+\d+|\b\d+\s+(siswa|peserta|alumni)\b/i, 'angka hasil'],
  [/beasiswa/i, 'beasiswa'],
];

export function slideText(s: Slide): string {
  const parts: string[] = [];
  const walk = (v: unknown, key = '') => {
    if (typeof v === 'string') { if (!['src', 'position', 'alt', 'mascot', 'layout', 'role', 'intent', 'icon', 'pos', 'shade', 'variant', 'src'].includes(key)) parts.push(v); }
    else if (Array.isArray(v)) v.forEach((x) => walk(x));
    else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, k));
  };
  walk(s);
  return plain(parts.join(' \n '));
}

export function contentIssues(slide: Slide, spec: Pick<Spec, 'verified_claims'>, brand: Brand): Issue[] {
  const out: Issue[] = [];
  const all = slideText(slide);
  const lower = all.toLowerCase();
  for (const b of brand.rules.banned) {
    if (lower.includes(b.toLowerCase())) out.push({ level: 'critical', area: 'content', code: 'BANNED_PHRASE', message: `Frasa terlarang menurut guideline: "${b}"` });
  }
  const words = plain(slide.headline).trim().split(/\s+/).length;
  if (words > brand.rules.headlineMaxWords) out.push({ level: 'warning', area: 'content', code: 'HEADLINE_LONG', message: `Headline ${words} kata, batas ${brand.rules.headlineMaxWords}` });
  const holders = all.match(/\[[^\]]+\]/g);
  if (holders) out.push({ level: 'critical', area: 'content', code: 'PLACEHOLDER', message: `Masih ada placeholder: ${[...new Set(holders)].join(', ')}` });
  const verified = spec.verified_claims.join(' ').toLowerCase();
  for (const [re, label] of CLAIM_PATTERNS) {
    for (const m of all.matchAll(new RegExp(re.source, 'gi'))) {
      const claim = m[0].replace(/^rp\s?/i, '').toLowerCase();
      if (!verified.includes(claim)) {
        out.push({ level: 'critical', area: 'content', code: 'UNVERIFIED_CLAIM', message: `Klaim ${label} "${m[0]}" belum ada di verified_claims` });
      }
    }
  }
  return out;
}

async function textContrast(bare: Buffer, runs: Run[], width: number, height: number): Promise<Issue[]> {
  const { data, info } = await sharp(bare).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out: Issue[] = [];
  const seen = new Set<string>();
  for (const r of runs) {
    if (r.strike) continue;
    // Huruf kerangka (outline) berwarna transparan; kontrasnya datang dari garis tepi, bukan isi.
    if (/rgba\([^)]*,\s*0\)$/.test(r.color)) continue;
    const [cr, cg, cb] = parseRgb(r.color);
    const tl = luminance(cr, cg, cb);
    const ratios: number[] = [];
    for (const q of r.rects) {
      const x0 = Math.max(0, Math.floor(q.x)), x1 = Math.min(width, Math.ceil(q.x + q.w));
      const y0 = Math.max(0, Math.floor(q.y)), y1 = Math.min(height, Math.ceil(q.y + q.h));
      for (let y = y0; y < y1; y += 3) for (let x = x0; x < x1; x += 3) {
        const i = (y * info.width + x) * info.channels;
        ratios.push(contrast(tl, luminance(data[i], data[i + 1], data[i + 2])));
      }
    }
    if (!ratios.length) continue;
    ratios.sort((a, b) => a - b);
    const p10 = ratios[Math.floor(ratios.length * 0.1)];
    const large = r.size >= 32 || (r.size >= 24 && Number(r.weight) >= 700);
    const need = large ? 3 : 4.5;
    if (p10 < need && !seen.has(r.block)) {
      seen.add(r.block);
      out.push({ level: p10 < need * 0.7 ? 'critical' : 'warning', area: 'visual', code: 'LOW_CONTRAST', message: `Kontras ${p10.toFixed(1)}:1 (minimal ${need}:1) pada "${r.text}"` });
    }
  }
  return out;
}

export async function runQa(a: { n: number; slide: Slide; spec: Spec; brand: Brand; png: string; bare: Buffer; measure: Measure }): Promise<SlideQa> {
  const { slide, spec, brand, png, bare, measure: m } = a;
  const issues: Issue[] = [];
  const passed: string[] = [];
  const { w, h } = FORMATS[spec.format];
  const add = (ok: boolean, label: string, issue: Issue) => { if (ok) passed.push(label); else issues.push(issue); };
  // Aturan brand: headline cover maksimal N baris, sub maksimal M baris.
  const lines = (m as unknown as { lines?: { kind: string; n: number }[] }).lines ?? [];
  const lim = brand.design;
  if (a.n === 1 && lim?.coverTitleLines) {
    const t = lines.find((l) => l.kind === 'title');
    if (t) add(t.n <= lim.coverTitleLines, 'Headline cover sesuai batas baris', { level: 'critical', area: 'brand', code: 'COVER_TITLE_LINES', message: `Headline cover ${t.n} baris, maksimal ${lim.coverTitleLines}. Pendekkan headline.` });
  }
  if (a.n === 1 && lim?.coverSubLines) {
    const t = lines.find((l) => l.kind === 'text');
    if (t) add(t.n <= lim.coverSubLines, 'Sub cover sesuai batas baris', { level: 'critical', area: 'brand', code: 'COVER_SUB_LINES', message: `Sub cover ${t.n} baris, maksimal ${lim.coverSubLines}. Pendekkan sub.` });
  }

  if (a.n > 1 && lim?.textLines) {
    const long = lines.find((l) => l.kind === 'text' && l.n > lim.textLines!);
    add(!long, 'Kalimat sesuai batas baris', { level: 'critical', area: 'brand', code: 'TEXT_LINES', message: `Kalimat ${long?.n} baris, maksimal ${lim.textLines}. Pendekkan kalimat.` });
  }

  if (lim?.listLines) {
    const long = lines.find((l) => l.kind === 'list' && l.n > lim.listLines!);
    add(!long, 'Butir daftar sesuai batas baris', { level: 'critical', area: 'brand', code: 'LIST_LINES', message: `Butir daftar ${long?.n} baris, maksimal ${lim.listLines}. Pendekkan butirnya.` });
  }

  const meta = await sharp(png).metadata();
  add(meta.width === w && meta.height === h && meta.format === 'png', `Ukuran ${w}x${h}`, { level: 'critical', area: 'technical', code: 'BAD_SIZE', message: `Ukuran ${meta.width}x${meta.height}` });
  const broken = m.images.filter((i) => !i.ok);
  add(!broken.length, 'Semua gambar termuat', { level: 'critical', area: 'technical', code: 'MISSING_ASSET', message: `Gambar gagal dimuat: ${broken.map((b) => b.asset).join(', ')}` });

  for (const i of m.images) {
    if (!i.ok || !i.asset.startsWith('assets/')) continue;
    const scale = Math.max(i.shown.w / i.w, i.shown.h / i.h);
    if (i.asset.includes('/stock/') && scale > 1.6) issues.push({ level: 'warning', area: 'technical', code: 'LOW_RES_IMAGE', message: `${path.basename(i.asset)} diperbesar ${scale.toFixed(1)}x` });
    if (i.asset.includes('/stock/')) {
      const side = path.join(ROOT, i.asset.replace(/\.[a-z]+$/i, '.json'));
      if (!fs.existsSync(side)) issues.push({ level: 'critical', area: 'brand', code: 'NO_LICENSE', message: `Tidak ada catatan lisensi untuk ${path.basename(i.asset)}` });
    }
    if (i.asset.includes('/mascots/')) {
      const reg = path.join(ROOT, 'assets/brands', brand.slug, 'mascots.json');
      const id = path.basename(i.asset, '.png');
      const entry = fs.existsSync(reg) ? JSON.parse(fs.readFileSync(reg, 'utf8'))[id] : undefined;
      if (!entry) issues.push({ level: 'critical', area: 'brand', code: 'UNKNOWN_MASCOT', message: `Maskot ${id} tidak terdaftar untuk ${brand.name}` });
      else if (!entry.transparent) issues.push({ level: 'critical', area: 'brand', code: 'MASCOT_NOT_CUT', message: `Maskot ${id} masih berlatar hitam` });
    }
  }

  add(m.fitted, 'Teks muat tanpa terpotong', { level: 'critical', area: 'layout', code: 'TEXT_OVERFLOW', message: 'Teks tidak muat pada ukuran minimum. Pendekkan copy.' });

  const safe = m.safe;
  const outside = m.runs.filter((r) => !r.footer && r.rects.some((q) => q.x < safe.x - 1 || q.y < safe.y - 1 || q.x + q.w > safe.x + safe.w + 1 || q.y + q.h > safe.y + safe.h + 1));
  add(!outside.length, 'Teks di dalam safe zone', { level: 'critical', area: 'layout', code: 'OUTSIDE_SAFE', message: `Keluar safe zone: "${outside[0]?.text}"` });

  let overlap = '';
  outer: for (let i = 0; i < m.runs.length; i++) for (let j = i + 1; j < m.runs.length; j++) {
    if (m.runs[i].block === m.runs[j].block) continue;
    for (const p of m.runs[i].rects) for (const q of m.runs[j].rects) if (hit(p, q, 2)) { overlap = `"${m.runs[i].text}" dan "${m.runs[j].text}"`; break outer; }
  }
  add(!overlap, 'Tidak ada teks bertabrakan', { level: 'critical', area: 'layout', code: 'TEXT_OVERLAP', message: `Teks bertabrakan: ${overlap}` });

  const small = m.runs.filter((r) => r.size < 20 && !r.footer);
  add(!small.length, 'Ukuran teks terbaca di ponsel', { level: 'warning', area: 'visual', code: 'TEXT_SMALL', message: `Teks ${small[0]?.size}px terlalu kecil: "${small[0]?.text}"` });

  add(!!m.logo?.ok, 'Logo resmi tampil', { level: 'critical', area: 'brand', code: 'NO_LOGO', message: 'Logo tidak termuat' });
  if (m.logo) {
    const lg = m.logo;
    const clash = m.runs.find((r) => r.rects.some((q) => hit(q, lg)));
    add(!clash, 'Clear space logo aman', { level: 'critical', area: 'brand', code: 'LOGO_OVERLAP', message: `Teks menimpa logo: "${clash?.text}"` });
  }
  const wrongFont = m.runs.find((r) => r.family !== brand.font.family && r.family !== brand.font.cjkFont && !(r.footer && r.family === brand.font.footerFont));
  const loaded = m.fontsLoaded.some((f) => f.startsWith(brand.font.family));
  add(!wrongFont && loaded, `Font ${brand.font.family}`, { level: 'critical', area: 'brand', code: 'WRONG_FONT', message: `Font tidak sesuai: ${wrongFont?.family ?? 'font brand gagal dimuat'}` });
  add(m.runs.some((r) => r.footer), 'Footer brand ada', { level: 'critical', area: 'brand', code: 'NO_FOOTER', message: 'Footer tidak ada' });

  const px = await sharp(png).resize(270).removeAlpha().raw().toBuffer();
  const [ar, ag, ab] = hexRgb(brand.rules.accentHex);
  let near = 0;
  for (let i = 0; i < px.length; i += 3) if (Math.abs(px[i] - ar) + Math.abs(px[i + 1] - ag) + Math.abs(px[i + 2] - ab) < 90) near++;
  const pct = (near / (px.length / 3)) * 100;
  add(pct <= brand.rules.accentMaxPct, `Porsi warna aksen ${pct.toFixed(0)}%`, { level: 'warning', area: 'brand', code: 'ACCENT_HEAVY', message: `Warna aksen ${pct.toFixed(0)}%, batas ${brand.rules.accentMaxPct}%` });

  add(m.ctaCount <= 1, 'Maksimal satu CTA', { level: 'critical', area: 'content', code: 'MULTI_CTA', message: `${m.ctaCount} CTA dalam satu slide` });
  issues.push(...contentIssues(slide, spec, brand));
  issues.push(...(await textContrast(bare, m.runs, w, h)));
  if (m.space) issues.push(...checkSpacing(await prepareSpace(m.space, ROOT), !!brand.design?.spacingStrict));

  return { slide: a.n, layout: slide.layout, png: path.basename(png), fitScale: Number(m.scale.toFixed(2)), passed, issues };
}

/** Struktur carousel mengikuti pola konten live: cover hook tanpa CTA, isi, penutup dengan satu CTA. */
export function structureIssues(spec: Spec): { slide: number; issue: Issue }[] {
  const out: { slide: number; issue: Issue }[] = [];
  const add = (slide: number, level: Level, code: string, message: string) => out.push({ slide, issue: { level, area: 'structure', code, message } });
  const n = spec.slides.length;
  if (!spec.brief) add(1, 'warning', 'NO_BRIEF', 'Belum ada brief (masalah, angle, pesan utama, CTA)');
  if (spec.rubric && spec.rubric.total < 85) add(1, 'critical', 'RUBRIC_LOW', `Skor rubrik ${spec.rubric.total}, minimal 85. Tulis ulang copy.`);
  if (!isCarousel(spec)) {
    if (!spec.slides[0].cta) add(1, 'warning', 'NO_FINAL_CTA', 'Single image tanpa CTA');
    return out;
  }
  if (n < 3) add(1, 'warning', 'SHORT_CAROUSEL', `Carousel hanya ${n} slide; pola brand 3–10 slide`);
  if (spec.slides[0].cta) add(1, 'warning', 'CTA_ON_COVER', 'Cover carousel sebaiknya tanpa CTA, cukup hook');
  spec.slides.forEach((s, i) => {
    if (i > 0 && i < n - 1 && s.cta) add(i + 1, 'warning', 'CTA_MID', 'CTA di tengah carousel; simpan CTA untuk slide penutup');
    if (!s.role) add(i + 1, 'warning', 'NO_ROLE', 'Peran slide belum ditentukan');
  });
  if (!spec.slides[n - 1].cta) add(n, 'critical', 'NO_FINAL_CTA', 'Slide penutup carousel tidak punya CTA');
  const nums = spec.slides.flatMap((s) => (s.layout === 'point' && s.number ? [s.number] : []));
  if (nums.some((x, i) => x !== nums[0] + i)) add(1, 'warning', 'NUMBER_GAP', `Nomor poin tidak berurutan: ${nums.join(', ')}`);
  const kw = spec.brief?.cta.keyword;
  if (kw && !spec.slides[n - 1].cta?.toUpperCase().includes(kw.toUpperCase())) add(n, 'warning', 'CTA_KEYWORD', `Kata kunci CTA "${kw}" tidak muncul di slide penutup`);
  return out;
}

/** Aturan brand yang sudah disetujui (config brand -> design). Pelanggaran = kritis, karena sudah keputusan user. */
export function brandIssues(spec: Spec, brand: Brand): { slide: number; issue: Issue }[] {
  const r = brand.design; const out: { slide: number; issue: Issue }[] = [];
  if (!r) return out;
  const add = (slide: number, code: string, message: string) => out.push({ slide, issue: { level: 'critical', area: 'brand', code, message } });
  const inner = spec.slides.some((s) => s.layout !== 'cover');
  if (r.background && inner && !spec.background?.src) add(2, 'NO_BACKGROUND', `${brand.name}: setiap slide wajib berlatar foto bangunan (isi field background)`);
  if (r.noFrame && brand.frame) add(1, 'FRAME_ON', `${brand.name}: garis frame tidak dipakai`);
  if (r.backgroundSrc && spec.background?.src !== r.backgroundSrc) add(1, 'WRONG_BACKGROUND', `${brand.name}: latar seri memakai ${r.backgroundSrc}`);
  spec.slides.forEach((s, i) => {
    const bad = ((s as { blocks?: { k: string }[] }).blocks ?? []).filter((b) => r.noBlocks?.includes(b.k));
    if (bad.length) add(i + 1, 'BLOCK_NOT_ALLOWED', `${brand.name}: blok ${[...new Set(bad.map((b) => b.k))].join(', ')} tidak dipakai`);
    const blocks = (s as { blocks?: { k: string; variant?: string }[] }).blocks ?? [];
    if (r.coverFree && s.role === 'cover') {
      if (s.layout !== 'free') add(i + 1, 'COVER_PATTERN', `${brand.name}: cover memakai layout free`);
      else if (!blocks.some((b) => b.k === 'mascot' && b.variant === 'fade') || !blocks.some((b) => b.variant === 'swipe')) add(i + 1, 'COVER_PATTERN', `${brand.name}: cover wajib maskot melebur (fade) dan baris swipe berpanah`);
    }
    if (r.ctaPill && blocks.some((b) => b.k === 'cta' && b.variant !== 'pill')) add(i + 1, 'CTA_PATTERN', `${brand.name}: CTA memakai pill, bukan pita`);
    const skin = (s as { skin?: string }).skin;
    if (r.coverMascotBlock && s.role === 'cover' && s.layout === 'free' && !blocks.some((b) => b.k === 'mascot')) add(i + 1, 'COVER_NO_MASCOT', `${brand.name}: cover memakai maskot`);
    if (r.skins && s.layout === 'free' && !r.skins.includes(skin ?? 'default')) add(i + 1, 'SKIN_NOT_ALLOWED', `${brand.name}: tampilan slide harus salah satu dari ${r.skins.join(', ')}`);
    const words = JSON.stringify(blocks).toLowerCase();
    if (r.ctaLastOnly && i < spec.slides.length - 1 && (words.includes('klik link di bio') || blocks.some((b) => b.k === 'cta'))) add(i + 1, 'CTA_NOT_LAST', `${brand.name}: CTA hanya di slide penutup`);
    if (s.layout === 'cover') {
      const c = s as { image?: { src?: string }; mascot?: string; props?: string[] };
      if (r.coverImage && !c.image?.src) add(i + 1, 'COVER_NO_PHOTO', `${brand.name}: cover wajib foto bangunan`);
      if (r.coverMascot && !c.mascot) add(i + 1, 'COVER_NO_MASCOT', `${brand.name}: cover memakai maskot`);
      if (r.coverProps && !c.props?.length) add(i + 1, 'COVER_NO_PROPS', `${brand.name}: cover memakai lencana ikon di sekitar maskot (props)`);
    }
  });
  const decor = Object.values(brand.decor ?? {}).flat().map((d) => d.f);
  const banned = decor.filter((f) => r.noDecor?.some((x) => f.startsWith(x)));
  if (banned.length) add(1, 'DECOR_NOT_ALLOWED', `${brand.name}: ornamen ${banned.join(', ')} tidak dipakai`);
  return out;
}

export function summarize(spec: Spec, brand: Brand, slides: SlideQa[]) {
  for (const { slide, issue } of [...structureIssues(spec), ...brandIssues(spec, brand)]) slides[Math.min(slide, slides.length) - 1].issues.push(issue);
  const checks = (spec.brief?.sources ?? []).filter((x) => x.check).map((x) => x.claim);
  const all = slides.flatMap((s) => s.issues);
  const critical = all.filter((i) => i.level === 'critical').length;
  const warnings = all.length - critical;
  return {
    brand: brand.name, pic: brand.pic, reviewer: 'Mbak Nia', generated_at: new Date().toISOString(),
    // Status tertinggi hanya "siap direview": persetujuan tayang selalu keputusan manusia.
    status: critical ? 'DIBLOKIR' : 'SIAP_DIREVIEW',
    critical, warnings, must_check: checks, slides,
  };
}
