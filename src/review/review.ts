// Lembar review (storyboard) untuk reviewer: alur slide, brief, caption, fakta, dan hasil QA dalam satu halaman.
import fs from 'node:fs';
import path from 'node:path';
import type { Browser } from 'playwright';
import { isCarousel, type Brand, type Spec } from '../schema.js';
import { esc, fileUrl } from '../render/layouts.js';
import type { summarize } from '../qa/qa.js';

type Report = ReturnType<typeof summarize>;

const ROLE: Record<string, string> = { cover: 'Cover / hook', context: 'Konteks', point: 'Poin', closing: 'Penutup + CTA', single: 'Single' };
const CTA_TYPE: Record<string, string> = { comment: 'Komentar kata kunci', link_bio: 'Link di bio', dm: 'DM', save: 'Simpan', other: 'Lainnya' };
const PILLAR: Record<string, string> = {
  problem_education: 'Problem / Education', student_story: 'Student / Parent Story', proof_achievement: 'Proof / Achievement',
  tutor_authority: 'Tutor Authority', program_value: 'Program / Value', conversion: 'Conversion / Hardsell',
};

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;background:#F4F4F2;color:#1F2328;width:1400px;padding:40px;font-size:17px;line-height:1.45}
h1{font-size:30px;margin-bottom:6px}h2{font-size:19px;margin:30px 0 12px;text-transform:uppercase;letter-spacing:1.5px;color:#57606A}
.meta{color:#57606A}.badge{display:inline-block;padding:4px 14px;border-radius:999px;font-weight:700;font-size:15px;margin-left:10px;vertical-align:middle}
.ok{background:#DCF5E3;color:#116329}.bad{background:#FFE1DE;color:#A40E26}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.box{background:#fff;border:1px solid #D8DEE4;border-radius:12px;padding:16px}
.box b{display:block;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#57606A;margin-bottom:6px}
.board{display:flex;flex-wrap:wrap;gap:14px}
.frame{width:250px;background:#fff;border:1px solid #D8DEE4;border-radius:12px;overflow:hidden}
.frame img{width:250px;display:block;border-bottom:1px solid #D8DEE4}
.frame .cap{padding:10px 12px;font-size:14.5px}
.role{display:inline-block;font-weight:700;font-size:13px;background:#1F2328;color:#fff;border-radius:6px;padding:2px 8px;margin-bottom:6px}
.issue{font-size:13px;margin-top:6px;padding:4px 8px;border-radius:6px}
.critical{background:#FFE1DE;color:#A40E26}.warning{background:#FFF4D4;color:#7A4D00}
pre{white-space:pre-wrap;font-family:inherit;background:#fff;border:1px solid #D8DEE4;border-radius:12px;padding:18px}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #D8DEE4;border-radius:12px;overflow:hidden}
td,th{padding:10px 14px;border-bottom:1px solid #EAEEF2;text-align:left;vertical-align:top}th{background:#F6F8FA;font-size:14px}
.check{color:#A40E26;font-weight:700}
ul{padding-left:22px}.two{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.decision{display:flex;gap:30px;font-size:18px}.line{border-bottom:1px solid #8C959F;flex:1;height:26px}
`;

export function reviewHtml(spec: Spec, brand: Brand, report: Report): string {
  const b = spec.brief;
  const ok = report.status === 'SIAP_DIREVIEW';
  const frames = report.slides.map((s, i) => {
    const sl = spec.slides[i];
    const issues = s.issues.map((x) => `<div class="issue ${x.level}">${x.level === 'critical' ? 'KRITIS' : 'Catatan'} · ${esc(x.message)}</div>`).join('');
    return `<div class="frame"><img src="${esc(s.png)}" alt=""><div class="cap"><span class="role">${i + 1}. ${esc(ROLE[sl.role ?? ''] ?? sl.layout)}</span>
      <div>${esc(sl.intent ?? '')}</div>${issues}</div></div>`;
  }).join('');
  const brief = b
    ? `<div class="grid"><div class="box"><b>Masalah audiens</b>${esc(b.problem)}</div><div class="box"><b>Angle</b>${esc(b.angle)}</div>
       <div class="box"><b>Pesan utama</b>${esc(b.key_message)}</div><div class="box"><b>CTA</b>${esc(CTA_TYPE[b.cta.type])}${b.cta.keyword ? ` · "${esc(b.cta.keyword)}"` : ''}</div></div>
       ${b.references.length ? `<p class="meta" style="margin-top:10px">Melanjutkan / acuan: ${b.references.map(esc).join(' · ')}</p>` : ''}`
    : '<p class="check">Belum ada brief.</p>';
  const sources = b?.sources.length
    ? `<table><tr><th>Klaim di konten</th><th>Sumber</th><th>Status</th></tr>${b.sources.map((x) => `<tr><td>${esc(x.claim)}</td>
       <td>${x.url ? `<a href="${esc(x.url)}">${esc(x.source)}</a>` : esc(x.source)}</td><td>${x.check ? '<span class="check">Perlu dicek</span>' : 'Sesuai sumber'}</td></tr>`).join('')}</table>`
    : '<p class="meta">Tidak ada klaim faktual yang perlu sumber.</p>';
  const risks = b?.risks.length ? `<ul>${b.risks.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : '<p class="meta">-</p>';
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Review ${esc(brand.name)} ${esc(spec.slug)}</title><style>${CSS}</style></head><body>
  <h1>${esc(brand.name)} · ${esc(spec.slides[0].headline.replace(/\*\*/g, ''))}<span class="badge ${ok ? 'ok' : 'bad'}">${ok ? 'SIAP DIREVIEW' : 'DIBLOKIR'}</span></h1>
  <p class="meta">${esc(PILLAR[spec.pillar ?? ''] ?? '-')} · ${isCarousel(spec) ? `Carousel ${spec.slides.length} slide` : 'Single image'} · ${esc(spec.format)}
   · Jadwal ${esc(spec.schedule ?? '-')} · PIC ${esc(brand.pic)} · Reviewer ${esc(report.reviewer)} ${spec.archetype ? ` · Arketipe ${esc(spec.archetype)}` : ''}${spec.rubric ? ` · Rubrik ${spec.rubric.total}/100 (penilaian diri AI)` : ''} · QA ${report.critical} kritis, ${report.warnings} catatan${report.must_check.length ? ` · <span class="check">${report.must_check.length} klaim perlu dicek</span>` : ''}</p>
  <h2>Brief</h2>${brief}
  <h2>Storyboard</h2><div class="board">${frames}</div>
  <div class="two"><div><h2>Caption</h2><pre>${esc(spec.caption ?? '(belum ada caption)')}</pre></div>
  <div><h2>Fakta dan sumber</h2>${sources}<h2>Risiko</h2>${risks}</div></div>
  <h2>Keputusan reviewer</h2><div class="box"><div class="decision"><span>☐ Setuju tayang</span><span>☐ Revisi</span><span>Catatan:</span><span class="line"></span></div></div>
  </body></html>`;
}

/** Menulis review.html dan review.png di folder project. */
export async function writeReview(browser: Browser, dir: string, spec: Spec, brand: Brand, report: Report) {
  const file = path.join(dir, 'review.html');
  fs.writeFileSync(file, reviewHtml(spec, brand, report));
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  try {
    await page.goto(fileUrl(file), { waitUntil: 'load' });
    await page.screenshot({ path: path.join(dir, 'review.png'), fullPage: true });
  } finally {
    await page.close();
  }
}
