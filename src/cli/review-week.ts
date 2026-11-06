// Lembar review mingguan: semua slot satu brand dalam satu halaman untuk reviewer.
// npm run review-week -- <brand> <senin>  ->  projects/<brand>/minggu-<senin>.html dan .png
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { esc, fileUrl, ROOT } from '../render/layouts.js';

const [brand, week] = process.argv.slice(2);
if (!brand || !week) { console.error('Pakai: npm run review-week -- <brand> <senin>'); process.exit(2); }
const plan = JSON.parse(fs.readFileSync(path.join(ROOT, 'plans', week, `${brand}.json`), 'utf8'));
const specDir = path.join(ROOT, 'specs', week, brand);
const files = fs.existsSync(specDir) ? fs.readdirSync(specDir) : [];
const out = path.join(ROOT, 'projects', brand);

const CSS = `*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;background:#F4F4F2;color:#1F2328;width:1400px;padding:40px;font-size:17px;line-height:1.45}
h1{font-size:30px}.meta{color:#57606A;margin:6px 0 24px}.slot{background:#fff;border:1px solid #D8DEE4;border-radius:14px;padding:18px 20px;margin-bottom:16px}
.top{display:flex;gap:14px;align-items:baseline;flex-wrap:wrap}.top b{font-size:20px}.tag{font-size:14px;font-weight:700;padding:2px 12px;border-radius:999px}
.ok{background:#DCF5E3;color:#116329}.wait{background:#FFF4D4;color:#7A4D00}.bad{background:#FFE1DE;color:#A40E26}
.row{display:flex;gap:10px;margin:12px 0}.row img{width:200px;border-radius:8px;border:1px solid #D8DEE4}
.chk{color:#A40E26;font-size:15px}.note{color:#57606A;font-size:15px}.dec{margin-top:10px;font-size:16px}`;

const blocks = plan.slot.map((s: { no: number; jadwal: string; topik: string; status: string; arketipe: string; data_dibutuhkan: string[] }) => {
  const nn = String(s.no).padStart(2, '0');
  const head = (tag: string, cls: string) => `<div class="top"><b>${esc(s.jadwal)}</b><span>${esc(s.topik)}</span><span class="tag ${cls}">${tag}</span></div>`;
  const file = files.find((f) => f.startsWith(`${nn}-`));
  if (s.status === 'butuh_data' || !file) {
    return `<div class="slot">${head('Menunggu data', 'wait')}<p class="note">Dibutuhkan: ${esc((s.data_dibutuhkan ?? []).join('; ') || 'copy belum ditulis')}</p></div>`;
  }
  const spec = JSON.parse(fs.readFileSync(path.join(specDir, file), 'utf8'));
  const dir = path.join(out, spec.slug);
  const qa = JSON.parse(fs.readFileSync(path.join(dir, 'qa-report.json'), 'utf8'));
  const imgs = fs.readdirSync(dir).filter((f) => /^slide-\d+\.png$/.test(f)).sort().map((f) => `<img src="${fileUrl(path.join(dir, f))}" alt="">`).join('');
  const checks = (qa.must_check as string[]).map((c) => `<li>${esc(c)}</li>`).join('');
  return `<div class="slot">${head(qa.status === 'SIAP_DIREVIEW' ? 'Siap direview' : 'Diblokir', qa.status === 'SIAP_DIREVIEW' ? 'ok' : 'bad')}
    <div class="row">${imgs}</div>${checks ? `<div class="chk"><b>Perlu dicek:</b><ul style="padding-left:20px">${checks}</ul></div>` : ''}
    <p class="note">Rubrik ${spec.rubric?.total ?? '-'}/100 (penilaian diri AI) · Detail: ${esc(spec.slug)}/review.html</p>
    <div class="dec">☐ Setuju tayang &nbsp;&nbsp; ☐ Revisi &nbsp;&nbsp; Catatan: ____________________________</div></div>`;
}).join('');

const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Review ${esc(brand)} ${esc(week)}</title><style>${CSS}</style></head><body>
<h1>Review feed ${esc(brand)}, minggu ${esc(week)}</h1><p class="meta">Reviewer: Mbak Nia. Status "siap direview" berarti lolos QA otomatis, bukan izin tayang.</p>${blocks}</body></html>`;
const file = path.join(out, `minggu-${week}.html`);
fs.writeFileSync(file, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto(fileUrl(file), { waitUntil: 'load' });
await page.screenshot({ path: file.replace(/\.html$/, '.png'), fullPage: true });
await browser.close();
console.log(file);
