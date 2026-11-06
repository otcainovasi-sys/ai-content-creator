import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { chromium, type Browser } from 'playwright';
import sharp from 'sharp';
import { FORMATS, parseSpec, type Slide } from '../src/schema.js';
import { brandIssues, contentIssues, contrast, luminance, structureIssues } from '../src/qa/qa.js';
import { loadBrand, renderSpec } from '../src/render/render.js';
import { pinyin, rich } from '../src/render/layouts.js';
import { repeats, similarity } from '../src/plan/plan.js';

const koey = loadBrand('jepang-koey');
const stock = fs.readdirSync('assets/stock').find((f) => f.endsWith('.jpg'))!;
const image = { src: `assets/stock/${stock}` };
const hero = (over: Partial<Slide> = {}) => ({ layout: 'hero_photo', headline: 'Cuma punya 30 menit per hari?', sub: 'Begini cara konsisten belajar.', cta: 'Simpan panduannya', image, ...over }) as Slide;
const spec = (slides: unknown[], over: object = {}) => ({ brand: 'jepang-koey', slug: 'tes', month: '2026-11', slides, ...over });

describe('schema', () => {
  it('menolak spec tanpa headline dan menyebut lokasinya', () => {
    expect(() => parseSpec(spec([{ layout: 'hero_photo', image }]))).toThrow(/slides\.0\.headline/);
  });
  it('menolak brand yang tidak dikenal', () => {
    expect(() => parseSpec(spec([hero()], { brand: 'lain' }))).toThrow(/brand/);
  });
});

describe('carousel', () => {
  const cover = { layout: 'cover', role: 'cover', headline: 'Hook' };
  const pt = (n: number) => ({ layout: 'point', role: 'point', number: n, headline: `Poin ${n}`, body: 'Isi' });
  const close = { layout: 'closing', role: 'closing', headline: 'Penutup', cta: 'Komen "STUDI"' };
  const brief = { problem: 'p', angle: 'a', key_message: 'k', cta: { type: 'comment', keyword: 'STUDI' } };
  const codes = (slides: unknown[], over: object = {}) => structureIssues(parseSpec(spec(slides, { brief, ...over }))).map((x) => x.issue.code);
  it('cover menolak CTA', () => {
    expect(() => parseSpec(spec([{ ...cover, cta: 'Daftar' }, close]))).toThrow(/slides\.0\.cta/);
  });
  it('slide penutup wajib punya CTA', () => {
    expect(() => parseSpec(spec([cover, { ...close, cta: undefined }]))).toThrow(/slides\.1\.cta/);
  });
  it('struktur lengkap tidak memunculkan catatan', () => {
    expect(codes([cover, pt(1), pt(2), close])).toEqual([]);
  });
  it('menandai nomor loncat, CTA di tengah, dan kata kunci yang tidak muncul', () => {
    const c = codes([cover, pt(1), { ...pt(3), cta: 'Daftar' }, { ...close, cta: 'Klik link di bio' }]);
    expect(c).toEqual(expect.arrayContaining(['NUMBER_GAP', 'CTA_MID', 'CTA_KEYWORD']));
  });
  it('carousel tanpa CTA penutup diblokir', () => {
    const s = parseSpec(spec([cover, pt(1), { ...pt(2) }], { brief }));
    expect(structureIssues(s).find((x) => x.issue.code === 'NO_FINAL_CTA')?.issue.level).toBe('critical');
  });
});

describe('aturan desain OTCA yang sudah disetujui', () => {
  const otca = loadBrand('otca');
  const close = { layout: 'free', role: 'closing', headline: 'Penutup', cta: 'Komen "STUDI"', blocks: [{ k: 'photo', x: 0, y: 0, w: 50, h: 50, src: 'x.jpg' }, { k: 'text', x: 0, y: 60, w: 80, h: 20, t: 'Isi' }] };
  it('memblokir cover tanpa foto, maskot, props, latar slide isi, dan foto tempelan', () => {
    const s = parseSpec(spec([{ layout: 'cover', role: 'cover', headline: 'Hook' }, close], { slug: 'tes', brand: 'otca' }));
    const c = brandIssues(s, otca).map((x) => x.issue.code);
    expect(c).toEqual(expect.arrayContaining(['NO_BACKGROUND', 'BLOCK_NOT_ALLOWED', 'COVER_NO_PHOTO', 'COVER_NO_MASCOT', 'COVER_NO_PROPS']));
    expect(brandIssues(s, otca).every((x) => x.issue.level === 'critical')).toBe(true);
  });
  it('config OTCA sudah tanpa frame dan tanpa garis emas mengalir', () => {
    expect(otca.frame).toBe(false);
    expect(Object.values(otca.decor ?? {}).flat().some((d) => d.f.startsWith('flow-lines'))).toBe(false);
  });
});

describe('aturan desain Info Jerman yang sudah disetujui', () => {
  const ij = loadBrand('info-jerman');
  const close = { layout: 'free', role: 'closing', headline: 'Penutup', cta: 'Klik link di bio', blocks: [{ k: 'title', x: 0, y: 0, w: 100, h: 20, t: 'Penutup' }, { k: 'cta', x: 0, y: 80, w: 100, h: 14 }] };
  it('memblokir cover pola lama, CTA pita, dan latar lain', () => {
    const s = parseSpec(spec([{ layout: 'cover', role: 'cover', headline: 'Hook' }, close], { brand: 'info-jerman', background: { src: 'assets/stock/lain.jpg' } }));
    expect(brandIssues(s, ij).map((x) => x.issue.code)).toEqual(expect.arrayContaining(['COVER_PATTERN', 'CTA_PATTERN', 'WRONG_BACKGROUND']));
  });
  it('pilot yang disetujui lolos aturan', () => {
    for (const f of fs.readdirSync('specs/2026-11-16/info-jerman')) {
      const s = parseSpec(JSON.parse(fs.readFileSync(`specs/2026-11-16/info-jerman/${f}`, 'utf8')));
      expect(brandIssues(s, ij)).toEqual([]);
    }
  });
  it('font mengikuti feed live', () => {
    expect(ij.font.family).toBe('Montserrat');
  });
});

describe('aturan kunci Jepang Koey', () => {
  it('memblokir cover tanpa maskot, CTA di tengah, dan tampilan lain', () => {
    const k = loadBrand('jepang-koey');
    const t = (x: string) => [{ k: 'title', x: 0, y: 0, w: 100, h: 20, t: x }, { k: 'text', x: 0, y: 30, w: 100, h: 10, t: x }];
    const s = parseSpec(spec([
      { layout: 'free', role: 'cover', skin: 'cover', headline: 'Hook', blocks: t('Hook') },
      { layout: 'free', role: 'point', skin: 'ivory', headline: 'Isi', blocks: t('Klik link di Bio') },
      { layout: 'free', role: 'closing', headline: 'Penutup', cta: 'Klik link di Bio', blocks: t('Penutup') }], { brand: 'jepang-koey' }));
    expect(brandIssues(s, k).map((x) => x.issue.code)).toEqual(expect.arrayContaining(['COVER_NO_MASCOT', 'CTA_NOT_LAST', 'SKIN_NOT_ALLOWED']));
  });
});

describe('pilot Jepang Koey', () => {
  it('lolos aturan desain dan memakai font feed live', () => {
    const k = loadBrand('jepang-koey');
    expect(k.font.family).toBe('Montserrat');
    for (const f of fs.readdirSync('specs/2026-11-16/jepang-koey')) {
      const s = parseSpec(JSON.parse(fs.readFileSync(`specs/2026-11-16/jepang-koey/${f}`, 'utf8')));
      expect(brandIssues(s, k)).toEqual([]);
    }
  });
});

describe('aturan desain Ciao Manda yang sudah disetujui', () => {
  const c = loadBrand('ciao-manda');
  it('pilot lolos aturan', () => {
    for (const f of fs.readdirSync('specs/2026-11-16/ciao-manda')) {
      const s = parseSpec(JSON.parse(fs.readFileSync(`specs/2026-11-16/ciao-manda/${f}`, 'utf8')));
      expect(brandIssues(s, c)).toEqual([]);
    }
  });
  it('memblokir CTA di tengah carousel dan tampilan lama', () => {
    const mid = { layout: 'free', role: 'point', skin: 'wine', headline: 'Isi', blocks: [{ k: 'title', x: 0, y: 0, w: 100, h: 20, t: 'Isi' }, { k: 'text', x: 0, y: 30, w: 100, h: 10, t: 'Klik link di Bio!' }] };
    const close = { layout: 'free', role: 'closing', skin: 'ivory', headline: 'Penutup', cta: 'Klik link di Bio', blocks: [{ k: 'title', x: 0, y: 0, w: 100, h: 20, t: 'Penutup' }, { k: 'text', x: 0, y: 30, w: 100, h: 10, t: 'Simpan' }] };
    const s = parseSpec(spec([{ layout: 'free', role: 'cover', skin: 'cover', headline: 'Hook', blocks: [{ k: 'title', x: 0, y: 0, w: 100, h: 20, t: 'Hook' }, { k: 'text', x: 0, y: 30, w: 100, h: 10, t: 'Sub' }] }, mid, close], { brand: 'ciao-manda' }));
    expect(brandIssues(s, c).map((x) => x.issue.code)).toEqual(expect.arrayContaining(['CTA_NOT_LAST', 'SKIN_NOT_ALLOWED']));
  });
});

describe('layout arketipe', () => {
  it('hook komentar menolak CTA', () => {
    expect(() => parseSpec(spec([{ layout: 'comment', headline: 'H', author: 'A', comment: 'K', cta: 'Daftar' }]))).toThrow(/slides\.0\.cta/);
  });
  it('ikon tiap brand sudah diwarnai', () => {
    for (const b of ['otca', 'info-jerman', 'jepang-koey', 'ciao-manda']) expect(fs.existsSync(`assets/icons/${b}/pin.png`)).toBe(true);
  });
});

describe('rencana', () => {
  it('mendeteksi topik yang sudah tayang', () => {
    const lib = [{ hook: 'Kelas online, tapi anak susah fokus?', topik: 'Fokus di kelas online' }];
    expect(repeats('Anak susah fokus di kelas online', lib)).toHaveLength(1);
    expect(repeats('Dana Sperrkonto sebelum visa', lib)).toHaveLength(0);
  });
  it('kata umum tidak dihitung', () => {
    expect(similarity('yang dan untuk', 'yang dan untuk')).toBe(0);
  });
  it('rubrik di bawah 85 diblokir', () => {
    const r = { target: 15, informasi: 15, struktur: 15, copy: 15, pengurang: 0, total: 60 };
    const codes = structureIssues(parseSpec(spec([{ layout: 'hero_photo', headline: 'H', image, cta: 'C' }], { rubric: r }))).map((x) => x.issue.code);
    expect(codes).toContain('RUBRIC_LOW');
  });
});

describe('teks', () => {
  it('meng-escape HTML dan hanya mengubah ** menjadi highlight', () => {
    expect(rich('<b>a</b> **c**')).toBe('&lt;b&gt;a&lt;/b&gt; <mark>c</mark>');
  });
  it('memindah frasa pinyin utuh ke font CJK, teks Indonesia tetap', () => {
    expect(pinyin('Zuì wǎn jǐ hào jiāo? · Paling lambat')).toBe('<span class="cjk">Zuì wǎn jǐ hào jiāo?</span> · Paling lambat');
  });
});

describe('QA konten', () => {
  const codes = (s: Slide, v: string[] = []) => contentIssues(s, { verified_claims: v }, koey).map((i) => i.code);
  it('memblokir frasa terlarang guideline', () => {
    expect(codes(hero({ headline: 'Wujudkan karier Jepangmu Sekarang Juga' }))).toContain('BANNED_PHRASE');
  });
  it('memblokir placeholder', () => {
    expect(codes(hero({ headline: '[headline]' }))).toContain('PLACEHOLDER');
  });
  it('garansi lolos hanya bila sudah diverifikasi', () => {
    const s = hero({ sub: 'Garansi mengulang kelas, S&K berlaku' });
    expect(codes(s)).toContain('UNVERIFIED_CLAIM');
    expect(codes(s, ['garansi'])).not.toContain('UNVERIFIED_CLAIM');
  });
  it('mengecek setiap harga, bukan hanya yang pertama', () => {
    const s = { layout: 'price_table', headline: 'Promo', tiers: [{ name: 'A', price: 'Rp 1.000.000' }, { name: 'B', price: 'Rp 2.000.000' }] } as Slide;
    const msgs = contentIssues(s, { verified_claims: ['1.000.000'] }, koey).map((i) => i.message).join();
    expect(msgs).toContain('2.000.000');
    expect(msgs).not.toContain('"Rp 1.000.000"');
  });
});

describe('kontras', () => {
  it('sesuai rumus WCAG', () => {
    expect(contrast(luminance(0, 0, 0), luminance(255, 255, 255))).toBeCloseTo(21, 0);
  });
});

describe('render', () => {
  let browser: Browser; let out: string;
  beforeAll(async () => { browser = await chromium.launch(); out = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-')); });
  afterAll(async () => { await browser.close(); fs.rmSync(out, { recursive: true, force: true }); });

  it.each(Object.entries(FORMATS))('format %s menghasilkan ukuran persis', async (format, { w, h }) => {
    const r = await renderSpec(spec([hero()], { format, slug: `f-${format.replace('_', '-')}` }), { browser, outRoot: out });
    const m = await sharp(path.join(r.dir, 'slide-01.png')).metadata();
    expect([m.width, m.height]).toEqual([w, h]);
  }, 30000);

  it('copy bersih lolos ke SIAP_DIREVIEW dan menyimpan paket project', async () => {
    const r = await renderSpec(spec([hero()], { caption: 'Caption', slug: 'bersih' }), { browser, outRoot: out });
    expect(r.status).toBe('SIAP_DIREVIEW');
    for (const f of ['slide-01.png', 'design-spec.json', 'qa-report.json', 'caption.md', 'review.html', 'review.png']) expect(fs.existsSync(path.join(r.dir, f))).toBe(true);
  }, 30000);

  it('copy terlalu panjang diblokir, bukan dipotong', async () => {
    const long = Array(60).fill('belajar bahasa Jepang sambil kerja').join(' ');
    const r = await renderSpec(spec([hero({ headline: long })], { slug: 'panjang' }), { browser, outRoot: out });
    expect(r.status).toBe('DIBLOKIR');
    expect(r.slides[0].issues.map((i) => i.code)).toContain('TEXT_OVERFLOW');
  }, 30000);

  it('layout perbandingan dan promo lolos render', async () => {
    const r = await renderSpec(spec([
      { layout: 'compare', headline: 'Pilih kelas', columns: [{ title: 'A', icon: 'books', rows: [{ label: 'Format', text: 'Grup' }] }, { title: 'B', icon: 'laptop', rows: [{ label: 'Format', text: 'Privat' }] }] },
      { layout: 'promo', headline: 'Promo', tiers: [{ name: 'Kelas', price: 'Rp 1.000.000', featured: true }], cta: 'Komen' },
    ], { slug: 'arketipe', verified_claims: ['1.000.000'], background: image }), { browser, outRoot: out });
    expect(r.slides.flatMap((s) => s.issues).filter((i) => i.level === 'critical')).toEqual([]);
  }, 30000);

  it('gambar hilang diblokir', async () => {
    const r = await renderSpec(spec([hero({ image: { src: 'assets/stock/tidak-ada.jpg' } } as Partial<Slide>)], { slug: 'hilang' }), { browser, outRoot: out });
    expect(r.slides[0].issues.map((i) => i.code)).toContain('MISSING_ASSET');
  }, 30000);

  it('maskot berlatar hitam diblokir', async () => {
    const r = await renderSpec(spec([hero({ mascot: 'cewe-bawa-megaphone' } as Partial<Slide>)], { slug: 'maskot' }), { browser, outRoot: out });
    expect(r.slides[0].issues.map((i) => i.code)).toContain('MASCOT_NOT_CUT');
  }, 30000);
});
