import { describe, expect, it } from 'vitest';
import { checkSpacing, type Hit, type Space, type SpaceBox, type SpaceText } from '../src/qa/spacing.js';

const box = (name: string, x: number, y: number, w: number, h: number, ord: number, extra: Partial<SpaceBox> = {}): SpaceBox =>
  ({ name, rect: { x, y, w, h }, z: 0, ord, container: true, title: -1, ribbon: false, parent: -1, group: '', ...extra });
const text = (t: string, x: number, y: number, w: number, h: number, ord: number, boxes: number[], inner: number): SpaceText =>
  ({ text: t, size: 29.3, rect: { x, y, w, h }, z: 0, ord, container: true, title: -1, boxes, inner });
const codes = (s: Space & { solid?: (h: Hit) => boolean }, strict = true) => checkSpacing(s, strict).map((i) => `${i.level}:${i.code}`);

describe('pemeriksaan jarak', () => {
  // Kasus nyata: pill "Jalur bantuan" berakhir di y 508, poin pertama mulai y 519.
  const panel = (firstY: number): Space => ({
    boxes: [box('panel', 138, 467, 804, 500, 1), box('Jalur bantuan', 212, 452, 640, 56, 1, { parent: 0 })],
    texts: [text('Jalur bantuan', 260, 464, 540, 33, 1, [0, 1], 1), text('Studierendenwerk', 187, firstY, 700, 70, 1, [0], 0), text('Darurat', 187, 880, 500, 35, 1, [0], 0)],
    imgs: [], mascots: [],
  });

  it('memblokir teks yang menempel ke pill di atasnya', () => {
    expect(codes(panel(519))).toContain('critical:SPACE_TIGHT');
  });

  it('meloloskan jarak 40 px seperti PDF', () => {
    expect(codes(panel(548)).filter((c) => c.endsWith('SPACE_TIGHT'))).toEqual([]);
  });

  it('brand tanpa spacingStrict hanya mendapat catatan', () => {
    expect(codes(panel(519), false).every((c) => c.startsWith('warning:'))).toBe(true);
  });

  it('mendeteksi kotak yang saling menimpa', () => {
    const s: Space = { boxes: [box('A', 100, 400, 800, 160, 1), box('B', 100, 548, 800, 120, 2)], texts: [], imgs: [], mascots: [] };
    expect(codes(s)).toContain('critical:BOX_OVERLAP');
  });

  it('mendeteksi isi kotak yang tidak seimbang dan kosong', () => {
    const s: Space = { boxes: [box('kartu', 100, 400, 800, 300, 1)], texts: [text('isi', 130, 420, 600, 35, 1, [0], 0)], imgs: [], mascots: [] };
    const c = codes(s);
    expect(c).toContain('warning:BOX_UNBALANCED');
    expect(c).toContain('warning:BOX_EMPTY');
  });

  it('mendeteksi rongga besar di tengah slide', () => {
    const s: Space = { boxes: [], texts: [text('judul', 100, 200, 800, 80, 1, [], -1), text('kalimat', 100, 600, 800, 40, 2, [], -1)], imgs: [], mascots: [] };
    expect(codes(s)).toContain('warning:SPACE_VOID');
  });

  it('mendeteksi butir daftar yang terlalu renggang', () => {
    const r = (y: number) => ({ x: 100, y, w: 700, h: 76 });
    const s = (step: number): Space => ({ boxes: [], texts: [], imgs: [], mascots: [], stacks: [[r(500), r(500 + step), r(500 + step * 2)]] });
    expect(codes(s(185))).toContain('critical:SPACE_LOOSE');
    expect(codes(s(140))).not.toContain('critical:SPACE_LOOSE');
  });

  it('tidak menilai pill judul yang sengaja ditumpuk rapat', () => {
    const s: Space = { boxes: [box('Takut salah?', 100, 200, 500, 90, 1, { container: false, stack: true }), box('Latihan kecil', 100, 302, 600, 90, 2, { container: false, stack: true })], texts: [], imgs: [], mascots: [] };
    expect(codes(s)).toEqual([]);
  });

  it('memblokir maskot yang pikselnya menimpa teks', () => {
    const t = { ...text('kalimat', 100, 1000, 600, 40, 3, [], -1), hits: [{ asset: 'assets/x.png', u: 0.5, v: 0.5, masked: false }] };
    const s: Space & { solid: () => boolean } = { boxes: [], texts: [t], imgs: [], mascots: [], solid: () => true };
    expect(codes(s)).toContain('critical:MASCOT_OVER');
    expect(codes({ ...s, solid: () => false })).not.toContain('critical:MASCOT_OVER');
  });
});
