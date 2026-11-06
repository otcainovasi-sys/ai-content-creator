import { z } from 'zod';

const text = z.string().trim().min(1);
const image = z.object({
  src: text, // relatif terhadap root project, mis. assets/stock/xxx.jpg
  alt: z.string().optional(),
  position: z.string().optional(), // CSS object-position
  zoom: z.number().min(1).max(3).optional(), // perbesar foto dari titik position
});

export const ROLES = ['cover', 'context', 'point', 'closing', 'single'] as const;
const base = {
  // Peran slide di alur carousel dan alasan slide ini ada. Tidak dirender; dipakai QA dan lembar review.
  role: z.enum(ROLES).optional(),
  // Tingkat gelap tambahan di atas foto latar, dipilih sesuai kebutuhan keterbacaan slide.
  shade: z.enum(['light', 'mid', 'dark']).optional(),
  // Varian tampilan dalam satu brand, dan foto latar khusus slide ini.
  skin: z.string().optional(),
  bg: image.optional(),
  intent: z.string().optional(),
  eyebrow: z.string().optional(),
  headline: text, // **kata** = highlight
  sub: z.string().optional(),
  cta: z.string().optional(),
};

const heroPhoto = z.object({ layout: z.literal('hero_photo'), ...base, image, mascot: z.string().optional() });
const mascotHero = z.object({
  layout: z.literal('mascot_hero'), ...base, image, mascot: text,
  benefits: z.array(text).max(2).optional(),
});
const scoreInfographic = z.object({
  layout: z.literal('score_infographic'), ...base, image: image.optional(), mascot: z.string().optional(),
  tableTitle: text,
  rows: z.array(z.object({ skill: text, before: z.string().optional(), after: text, note: z.string().optional() })).min(2).max(6),
});
const storyCard = z.object({
  layout: z.literal('story_card'), ...base, image,
  name: text, role: z.string().optional(), quote: z.string().optional(),
});
const achievement = z.object({
  layout: z.literal('achievement'), ...base, image,
  name: text,
});
const tutorProfile = z.object({
  layout: z.literal('tutor_profile'), ...base, image,
  name: text, role: z.string().optional(), credentials: z.array(text).max(4).optional(),
});
const programValue = z.object({
  layout: z.literal('program_value'), ...base, image,
  guarantee: z.string().optional(), benefits: z.array(text).min(2).max(3),
});
const priceTable = z.object({
  layout: z.literal('price_table'), ...base,
  period: z.string().optional(),
  tiers: z.array(z.object({ name: text, price: text, strike: z.string().optional(), featured: z.boolean().optional() })).min(1).max(3),
  features: z.array(text).max(4).optional(),
  note: z.string().optional(),
});
const numberedList = z.object({
  layout: z.literal('numbered_list'), ...base, image: image.optional(), mascot: z.string().optional(),
  items: z.array(z.object({ title: text, text: z.string().optional() })).min(2).max(5),
});

/** Carousel: cover tanpa CTA. */
const cover = z.object({
  layout: z.literal('cover'), ...base, cta: z.never({ error: 'cover tidak memakai CTA; letakkan CTA di slide penutup' }).optional(),
  image: image.optional(), mascot: z.string().optional(), hero: z.array(z.string()).max(3).optional(), scene: z.string().optional(),
  props: z.array(z.string()).max(3).optional(), // lencana ikon di sekitar tangan maskot, seperti feed live
});
/** Carousel: satu poin per slide, dengan contoh opsional (mis. kalimat Mandarin + pinyin + arti). */
const point = z.object({
  layout: z.literal('point'), ...base, number: z.number().int().min(1).max(20).optional(),
  body: z.string().optional(),
  example: z.object({ text: text, reading: z.string().optional(), meaning: z.string().optional() }).optional(),
  tip: z.string().optional(), mascot: z.string().optional(),
});
/** Carousel: 2–4 poin paralel dalam grid. */
const grid = z.object({
  layout: z.literal('grid'), ...base,
  cells: z.array(z.object({ title: text, text: z.string().optional() })).min(2).max(4),
  numbered: z.boolean().optional(), // false untuk perbandingan (mis. JFT-Basic vs JLPT)
  closing: z.string().optional(),
});
/** Carousel: punchline + satu CTA dengan mekanisme yang jelas. */
const closing = z.object({
  layout: z.literal('closing'), ...base, cta: text, ctaNote: z.string().optional(),
  image: image.optional(), mascot: z.string().optional(),
});

const iconId = z.string().regex(/^[a-z0-9-]+$/);
const phrase = z.object({ text: text, reading: z.string().optional(), meaning: z.string().optional() });
/** A. Tips N cara: ilustrasi + kartu berikon + pill punchline. */
const tips = z.object({
  layout: z.literal('tips'), ...base, hero: z.array(iconId).max(3).optional(), scene: z.string().optional(),
  cards: z.array(z.object({ icon: iconId, title: text, meta: z.string().optional() })).min(2).max(4),
  punch: z.string().optional(),
});
/** B/F. Daftar padat: label bernomor + isi + contoh bahasa + ikon. */
const labels = z.object({
  layout: z.literal('labels'), ...base,
  items: z.array(z.object({ label: text, text: z.string().optional(), example: phrase.optional(), icon: iconId.optional() })).min(2).max(5),
  punch: z.string().optional(),
});
/** C. Timeline: kartu target waktu + kotak catatan. */
const timeline = z.object({
  layout: z.literal('timeline'), ...base,
  items: z.array(z.object({ icon: iconId, title: text, range: text, text: text })).min(2).max(4),
  note: z.object({ label: text, text: text }).optional(),
});
/** D. Kerangka: kartu dengan header pill, alur ikon, poin kata kunci dan pertanyaan. */
const framework = z.object({
  layout: z.literal('framework'), ...base, header: text, flow: z.array(iconId).min(2).max(4),
  points: z.array(z.object({ key: text, text: text })).min(2).max(4), punch: z.string().optional(),
});
/** D. Opsi bernomor terbuka di atas latar. */
const options = z.object({
  layout: z.literal('options'), ...base,
  items: z.array(z.object({ title: text, text: text })).min(2).max(4), punch: z.string().optional(),
});
/** I. Penutup penawaran: daftar berikon + kotak CTA + maskot. */
const offer = z.object({
  layout: z.literal('offer'), ...base, cta: text, ctaNote: z.string().optional(), itemsTitle: z.string().optional(),
  hero: z.array(iconId).max(3).optional(), badge: z.string().optional(), ctaIcon: iconId.optional(), scene: z.string().optional(),
  items: z.array(z.object({ icon: iconId.optional(), title: text, text: z.string().optional() })).min(1).max(5),
  mascot: z.string().optional(),
});

/** E. Perbandingan: 2–4 kolom dengan label yang sama di setiap kolom. */
const compare = z.object({
  layout: z.literal('compare'), ...base,
  columns: z.array(z.object({ title: text, icon: iconId.optional(), image: image.optional(), rows: z.array(z.object({ label: text, text: text })).min(1).max(4) })).min(2).max(4),
  punch: z.string().optional(),
});
/** G. Hook komentar: komentar audiens asli sebagai cover. Nama disamarkan. */
const comment = z.object({
  layout: z.literal('comment'), ...base, cta: z.never({ error: 'cover tidak memakai CTA' }).optional(),
  author: text, comment: text, mascot: z.string().optional(), hero: z.array(iconId).max(3).optional(), scene: z.string().optional(),
});
/** H. Fitur produk: mockup perangkat + langkah + baris alur. */
const feature = z.object({
  layout: z.literal('feature'), ...base, screen: image, steps: z.array(text).min(2).max(4), flow: z.array(text).max(4).optional(),
});
/** J. Bukti: aset asli (foto/sertifikat), nama, kutipan. Wajib izin. */
const proof = z.object({
  layout: z.literal('proof'), ...base, image, name: text, label: z.string().optional(), quote: z.string().optional(), fit: z.enum(['cover', 'contain']).optional(),
});
/** K. Promo: tier harga, atau tabel fasilitas bila ada matrix. */
const promo = z.object({
  layout: z.literal('promo'), ...base, period: z.string().optional(), note: z.string().optional(),
  badge: z.string().optional(), ticketIcon: iconId.optional(), ctaNote: z.string().optional(), ctaIcon: iconId.optional(),
  tiers: z.array(z.object({ name: text, price: text, strike: z.string().optional(), featured: z.boolean().optional() })).min(1).max(3),
  features: z.array(z.object({ icon: iconId.optional(), title: text })).max(4).optional(),
  matrix: z.array(z.object({ label: text, icon: iconId.optional(), values: z.array(z.boolean()).min(1).max(3) })).max(6).optional(),
});
/** L. Program: cuplikan kelas + baris garansi + manfaat berikon. */
const program = z.object({
  layout: z.literal('program'), ...base, image, imageLabel: z.string().optional(), guarantee: z.string().optional(),
  benefits: z.array(z.object({ icon: iconId, title: text })).min(2).max(3),
});

/** Komposisi bebas: blok ditempatkan dengan x, y, w, h (% area isi). Logo, footer, dan warna tetap dari brand. */
const block = z.object({
  k: z.enum(['title', 'text', 'card', 'big', 'bubble', 'pill', 'icon', 'mascot', 'scene', 'cta', 'bar', 'ring', 'photo', 'rows', 'grid', 'panel', 'tile', 'col', 'list', 'tip', 'step']),
  x: z.number(), y: z.number(), w: z.number(), h: z.number(),
  t: z.string().optional(), head: z.string().optional(), unit: z.string().optional(), id: z.string().optional(), note: z.string().optional(),
  tone: z.enum(['light', 'dark', 'accent', 'ghost', 'brand', 'white', 'cream']).optional(), align: z.enum(['left', 'center', 'right', 'justify']).optional(),
  color: z.enum(['ink', 'muted', 'accent', 'white', 'outline']).optional(), side: z.enum(['l', 'r']).optional(),
  min: z.number().optional(), max: z.number().optional(), r: z.number().optional(), z: z.number().optional(), flip: z.boolean().optional(), num: z.number().optional(),
  // Blok editorial: baris bergaris, grid 2x2, kartu putih berheader pill, panel foto.
  items: z.array(z.object({ label: z.string().optional(), head: z.string().optional(), t: z.string().optional(), on: z.boolean().optional(), icon: z.string().optional() })).max(6).optional(),
  icons: z.array(z.string()).max(4).optional(), src: z.string().optional(), pos: z.string().optional(), zoom: z.number().optional(),
  variant: z.enum(['outline', 'num', 'quote', 'plain', 'checker', 'dark', 'mono', 'dim', 'duo', 'big', 'punch', 'pill', 'swipe', 'fade', 'fat', 'flank', 'note', 'strip', 'bust', 'top', 'jp', 'fog', 'quote2', 'deal', 'ribbon', 'feed', 'tag', 'badge', 'fogdark', 'fogfront', 'bleed', 'stackhead', 'stackbody', 'head', 'compact']).optional(),
});
const free = z.object({ layout: z.literal('free'), ...base, blocks: z.array(block).min(2).max(16) });

export const slideSchema = z.discriminatedUnion('layout', [
  heroPhoto, mascotHero, scoreInfographic, storyCard, achievement, tutorProfile, programValue, priceTable, numberedList,
  cover, point, grid, closing, tips, labels, timeline, framework, options, offer,
  compare, comment, feature, proof, promo, program, free,
]);

/** Brief: hasil riset yang menjadi dasar copy. Ditampilkan di lembar review untuk reviewer. */
export const briefSchema = z.object({
  problem: text, // masalah atau pertanyaan audiens
  angle: text, // sudut pandang yang dipilih
  key_message: text,
  audience: z.string().optional(),
  cta: z.object({ type: z.enum(['comment', 'link_bio', 'dm', 'save', 'other']), keyword: z.string().optional() }),
  sources: z.array(z.object({ claim: text, source: text, url: z.string().optional(), check: z.boolean().optional() })).default([]),
  risks: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]), // konten live atau seri yang dilanjutkan
});
export type Brief = z.infer<typeof briefSchema>;

export const FORMATS = {
  feed_portrait: { w: 1080, h: 1350 },
  feed_square: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
  reels_cover: { w: 1080, h: 1920 },
  landscape: { w: 1920, h: 1080 },
} as const;
export type FormatId = keyof typeof FORMATS;

export const PILLARS = ['problem_education', 'student_story', 'proof_achievement', 'tutor_authority', 'program_value', 'conversion'] as const;

export const specSchema = z.object({
  brand: z.enum(['otca', 'info-jerman', 'jepang-koey', 'ciao-manda']),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug hanya huruf kecil, angka, dan tanda hubung'),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  pillar: z.enum(PILLARS).optional(),
  format: z.enum(Object.keys(FORMATS) as [FormatId, ...FormatId[]]).default('feed_portrait'),
  type: z.enum(['carousel', 'single']).optional(),
  schedule: z.string().optional(),
  brief: briefSchema.optional(),
  background: image.optional(), // foto samar di slide isi
  archetype: z.string().optional(),
  // Self-review dari skill copy (knowledge/shared/rubric.md). Bukan persetujuan tayang.
  rubric: z.object({ target: z.number(), informasi: z.number(), struktur: z.number(), copy: z.number(), pengurang: z.number().default(0), total: z.number(), catatan: z.string().optional() }).optional(),
  caption: z.string().optional(),
  // Klaim (garansi, harga, hasil) yang sudah dipastikan benar oleh manusia.
  verified_claims: z.array(z.string()).default([]),
  slides: z.array(slideSchema).min(1).max(10),
});

export type Spec = z.infer<typeof specSchema>;
export const isCarousel = (s: Spec) => (s.type ?? (s.slides.length > 1 ? 'carousel' : 'single')) === 'carousel';
export type Slide = z.infer<typeof slideSchema>;

export function parseSpec(raw: unknown): Spec {
  const r = specSchema.safeParse(raw);
  if (r.success) return r.data;
  const msg = r.error.issues.map((i) => `- ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
  throw new Error(`Spec tidak valid:\n${msg}`);
}

export interface Brand {
  slug: string; name: string; pic: string; guideline: string;
  font: { family: string; headline: number; sub: number; body: number; uppercaseHeadline: boolean; cjk?: boolean; cjkFont?: string; extra?: number[]; footerFont?: string };
  tokens: Record<string, string>;
  logo: { default: string; hero: string; width: number; height: number };
  frame: boolean; footer: string; style?: Record<string, string>; decor?: Record<string, { f: string; s: string }[]>;
  /** Aturan desain yang sudah disetujui user untuk brand ini; diperiksa QA (brandIssues). */
  design?: { background?: boolean; noBlocks?: string[]; coverMascot?: boolean; coverProps?: boolean; coverImage?: boolean; noFrame?: boolean; noDecor?: string[]; coverFree?: boolean; ctaPill?: boolean; backgroundSrc?: string; skins?: string[]; ctaLastOnly?: boolean; coverMascotBlock?: boolean; coverTitleLines?: number; coverSubLines?: number; spacingStrict?: boolean; textLines?: number; listLines?: number };
  safe: Record<FormatId, [number, number]>;
  rules: { headlineMaxWords: number; accentHex: string; accentMaxPct: number; banned: string[]; requireWords: string[] };
}
