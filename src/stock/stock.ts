import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { ROOT } from '../render/layouts.js';

export interface StockHit {
  provider: string; id: string; url: string; pageUrl: string; author: string; license: string; width?: number; height?: number;
}
export interface StockProvider { name: string; available(): boolean; search(q: string, n: number): Promise<StockHit[]> }

const UA = { 'User-Agent': 'otca-design-studio/0.1' };
async function json(url: string, headers: Record<string, string> = {}) {
  const r = await fetch(url, { headers: { ...UA, ...headers } });
  if (!r.ok) throw new Error(`${new URL(url).host}: HTTP ${r.status}`);
  return r.json() as Promise<any>;
}

export const pexels: StockProvider = {
  name: 'pexels',
  available: () => !!process.env.PEXELS_API_KEY,
  async search(q, n) {
    const d = await json(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${n}&orientation=portrait`, { Authorization: process.env.PEXELS_API_KEY! });
    return d.photos.map((p: any) => ({ provider: 'pexels', id: String(p.id), url: p.src.large2x, pageUrl: p.url, author: p.photographer, license: 'Pexels License', width: p.width, height: p.height }));
  },
};

export const pixabay: StockProvider = {
  name: 'pixabay',
  available: () => !!process.env.PIXABAY_API_KEY,
  async search(q, n) {
    const d = await json(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(q)}&per_page=${Math.max(n, 3)}&safesearch=true&image_type=photo`);
    return d.hits.map((p: any) => ({ provider: 'pixabay', id: String(p.id), url: p.largeImageURL, pageUrl: p.pageURL, author: p.user, license: 'Pixabay Content License', width: p.imageWidth, height: p.imageHeight }));
  },
};

/** Tanpa API key. Hanya CC0 dan public domain, jadi aman untuk pemakaian komersial. */
export const openverse: StockProvider = {
  name: 'openverse',
  available: () => true,
  async search(q, n) {
    const d = await json(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license=cc0,pdm&page_size=${Math.max(n * 4, 20)}&size=large&mature=false`);
    // Feed 1080x1350 dipotong dari tengah: tinggi sumber minimal 1350 px supaya tidak diperbesar.
    return d.results.filter((p: any) => p.height >= 1350 && p.width >= 1080 && !p.url.includes('editor_1024')).slice(0, n).map((p: any) => ({ provider: 'openverse', id: p.id, url: p.url, pageUrl: p.foreign_landing_url, author: p.creator ?? 'Tidak diketahui', license: `${p.license} ${p.license_version ?? ''}`.trim(), width: p.width, height: p.height }));
  },
};

export const PROVIDERS = [pexels, pixabay, openverse];

export async function searchStock(q: string, n = 5, only?: string): Promise<StockHit[]> {
  for (const p of PROVIDERS) {
    if (only ? p.name !== only : !p.available()) continue;
    try {
      const hits = await p.search(q, n);
      if (hits.length) return hits;
    } catch (e) {
      console.warn(`[stok] ${p.name} gagal: ${(e as Error).message}`);
    }
  }
  return [];
}

/** Mengunduh satu gambar dan menyimpan catatan lisensi di sebelahnya. */
export async function downloadStock(hit: StockHit, query: string): Promise<string> {
  const dir = path.join(ROOT, 'assets/stock');
  fs.mkdirSync(dir, { recursive: true });
  const base = `${hit.provider}-${hit.id.slice(0, 12)}`;
  const file = path.join(dir, `${base}.jpg`);
  if (!fs.existsSync(file)) {
    const r = await fetch(hit.url, { headers: UA });
    if (!r.ok) throw new Error(`Unduh gagal: HTTP ${r.status}`);
    await sharp(Buffer.from(await r.arrayBuffer())).rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 88 }).toFile(file);
  }
  fs.writeFileSync(path.join(dir, `${base}.json`), JSON.stringify({ ...hit, query, downloaded_at: new Date().toISOString() }, null, 2));
  return `assets/stock/${base}.jpg`;
}
