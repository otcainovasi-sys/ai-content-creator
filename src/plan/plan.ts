// Pemeriksaan rencana mingguan: kecocokan jadwal, variasi arketipe, topik berulang, dan status fakta produk.
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { PILLARS } from '../schema.js';
import { ROOT } from '../render/layouts.js';

const slot = z.object({
  no: z.number().int().min(1).max(10), jadwal: z.string(), pilar: z.enum(PILLARS),
  status: z.enum(['siap_brief', 'butuh_data']),
  topik: z.string().min(1), angle: z.string().optional(), arketipe: z.string().min(1), format: z.enum(['carousel', 'single', 'reels']),
  scene: z.string().optional(), mascot: z.string().optional(),
  cta: z.object({ type: z.string(), keyword: z.string().optional() }).optional(),
  produk: z.array(z.string()).default([]), data_dibutuhkan: z.array(z.string()).default([]),
});
export const planSchema = z.object({ brand: z.string(), minggu: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), slot: z.array(slot).length(10) });
export type Plan = z.infer<typeof planSchema>;
export interface Finding { level: 'kritis' | 'catatan'; no?: number; pesan: string }

const STOP = new Set('yang dan di ke dari untuk dengan atau ini itu anak kamu apa bisa harus sih lebih juga pada dalam jadi tapi tetapi saja cuma mau biar agar sudah belum'.split(' '));
const tokens = (s: string) => new Set(s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w)));

/** Kemiripan topik: proporsi kata penting yang sama, dihitung terhadap teks yang lebih pendek. */
export function similarity(a: string, b: string): number {
  const x = tokens(a), y = tokens(b);
  if (!x.size || !y.size) return 0;
  const same = [...x].filter((w) => y.has(w)).length;
  return same / Math.min(x.size, y.size);
}

export function repeats(topic: string, library: { hook: string; topik: string }[], limit = 0.6) {
  return library.map((l) => ({ ...l, skor: Math.max(similarity(topic, l.hook), similarity(topic, l.topik)) }))
    .filter((l) => l.skor >= limit).sort((a, b) => b.skor - a.skor);
}

const readJson = (p: string) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
export const library = (brand: string) => readJson(`knowledge/brands/${brand}/library.json`).items as { hook: string; topik: string }[];

export function checkPlan(raw: unknown): Finding[] {
  const plan = planSchema.parse(raw);
  const out: Finding[] = [];
  const schedule = readJson('config/schedule.json').feed as { day: string; time: string; pillar: string }[];
  const scenes = readJson('config/scenes.json');
  const products = readJson(`knowledge/brands/${plan.brand}/products.json`).items as { id: string; status: string; berlaku_sampai?: string }[];
  const mascots = fs.existsSync(path.join(ROOT, `assets/brands/${plan.brand}/mascots.json`)) ? readJson(`assets/brands/${plan.brand}/mascots.json`) : {};
  const lib = library(plan.brand);

  plan.slot.forEach((s, i) => {
    const want = schedule[i];
    if (s.no !== i + 1) out.push({ level: 'kritis', no: s.no, pesan: `Nomor slot harus ${i + 1}` });
    if (s.jadwal !== `${want.day} ${want.time}`) out.push({ level: 'kritis', no: s.no, pesan: `Jadwal harus ${want.day} ${want.time}` });
    if (s.pilar !== want.pillar) out.push({ level: 'kritis', no: s.no, pesan: `Pilar harus ${want.pillar}` });
    if (s.status === 'butuh_data') {
      if (!s.data_dibutuhkan.length) out.push({ level: 'kritis', no: s.no, pesan: 'Slot butuh_data tanpa daftar data_dibutuhkan' });
      return;
    }
    const dup = repeats(s.topik, lib)[0];
    if (dup) out.push({ level: 'catatan', no: s.no, pesan: `Mirip konten tayang (${Math.round(dup.skor * 100)}%): "${dup.hook}". Pastikan angle baru.` });
    if (s.scene && !scenes[s.scene]) out.push({ level: 'kritis', no: s.no, pesan: `Scene "${s.scene}" tidak ada` });
    if (s.mascot && !mascots[s.mascot]) out.push({ level: 'kritis', no: s.no, pesan: `Maskot "${s.mascot}" tidak terdaftar` });
    if (s.format === 'carousel' && !s.cta) out.push({ level: 'kritis', no: s.no, pesan: 'Carousel tanpa CTA' });
    for (const id of s.produk) {
      const p = products.find((x) => x.id === id);
      if (!p) out.push({ level: 'kritis', no: s.no, pesan: `Produk "${id}" tidak ada di products.json` });
      else if (p.status === 'perlu_konfirmasi') out.push({ level: 'kritis', no: s.no, pesan: `Produk "${id}" masih perlu konfirmasi` });
      else if (p.berlaku_sampai && p.berlaku_sampai < plan.minggu) out.push({ level: 'kritis', no: s.no, pesan: `Produk "${id}" berakhir ${p.berlaku_sampai}` });
      else if (p.status === 'dari_post_live') out.push({ level: 'catatan', no: s.no, pesan: `Produk "${id}" baru dari post live, tandai perlu dicek` });
    }
  });
  const edu = plan.slot.filter((s) => s.pilar === 'problem_education' && s.status === 'siap_brief').map((s) => s.arketipe);
  if (new Set(edu).size < edu.length) out.push({ level: 'kritis', pesan: `Slot Problem / Education memakai arketipe yang sama: ${edu.join(', ')}` });
  return out;
}
