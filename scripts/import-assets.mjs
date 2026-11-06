// Menyalin aset sumber ke assets/brands/<slug>. File sumber tidak diubah.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
sharp.cache(false);
const DL = 'D:/Pindahan dari C/Downloads';
const VE = 'D:/KERJAAN/CODING/CLAUDE/VIDEO_EDITOR/video-system/.sementara/paket-otca-2026.11.03/VIDEO-OTCA/contoh';
const out = (b, ...p) => path.join('assets/brands', b, ...p);
const slug = (s) => s.toLowerCase().replace(/^\d+_/, '').replace(/\.png$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function logo(src, brand, name) {
  const dst = out(brand, 'logo', name + '.png');
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  // Trim area transparan, batasi lebar 1600px supaya render tetap ringan.
  const trimmed = await sharp(src, { limitInputPixels: false }).trim().toBuffer();
  await sharp(trimmed, { limitInputPixels: false }).resize({ width: 1600, withoutEnlargement: true }).png().toFile(dst);
  const m = await sharp(dst).metadata();
  console.log('logo', brand, name, m.width + 'x' + m.height);
}

const LC = DL + '/01_Logo-20261104T223825Z-1-001/01_Logo';
const LK = DL + '/01_Logo-20261104T223715Z-1-001/01_Logo';
await logo('assets/brands/ciao-manda/logo/ciao-manda-logo-primary.png', 'ciao-manda', 'primary');
await logo(LC + '/02_Ciao Manda by OTCA White.png', 'ciao-manda', 'white');
await logo(LK + '/Jepang Koey by OTCA.png', 'jepang-koey', 'primary');
await logo(LK + '/Jepang Koey by OTCA Putih.png', 'jepang-koey', 'white');
await logo('D:/KERJAAN/OTCA/1788070443548-01_Logo-OTCA-Gold.webp', 'otca', 'primary');
await logo(VE + '/2026-10_info-jerman-3-jalur/aset/grafis/logo-info-jerman.png', 'info-jerman', 'primary');
await logo(VE + '/2026-10_info-jerman-3-jalur/aset/grafis/logo-info-jerman-terang.png', 'info-jerman', 'white');

const index = {};
for (const [brand, root] of [
  ['ciao-manda', DL + '/Ciao Manda-20261104T221115Z-1-001/Ciao Manda'],
  ['jepang-koey', DL + '/Jepang Koey-20261104T221057Z-1-001/Jepang Koey'],
]) {
  index[brand] = {};
  for (const dir of fs.readdirSync(root)) {
    for (const f of fs.readdirSync(path.join(root, dir))) {
      const src = path.join(root, dir, f);
      const meta = await sharp(src).metadata();
      const id = slug(f).replace(/^(minda|minkoey)-(cewe|cowo)-/, '').replace(/^minda-/, '');
      const who = /cowo/i.test(dir) ? 'cowo' : 'cewe';
      const key = `${who}-${id}`;
      const dst = out(brand, 'mascots', key + '.png');
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      if (meta.hasAlpha) await sharp(await sharp(src).trim().toBuffer()).png().toFile(dst);
      else fs.copyFileSync(src, dst);
      index[brand][key] = { file: path.relative(out(brand), dst).split(path.sep).join('/'), transparent: !!meta.hasAlpha };
    }
  }
  fs.writeFileSync(out(brand, 'mascots.json'), JSON.stringify(index[brand], null, 2));
  console.log(brand, Object.entries(index[brand]).map(([k, v]) => k + (v.transparent ? '' : ' [LATAR HITAM]')).join(', '));
}
