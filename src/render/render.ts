import fs from 'node:fs';
import path from 'node:path';
import { chromium, type Browser } from 'playwright';
import { FORMATS, parseSpec, type Brand, type Slide, type Spec } from '../schema.js';
import { esc, fileUrl, fontFaces, layoutHtml, ROOT } from './layouts.js';
import { runQa, summarize, type SlideQa } from '../qa/qa.js';
import { writeReview } from '../review/review.js';

const CSS = fs.readFileSync(new URL('./base.css', import.meta.url), 'utf8');
const BROWSER_JS = fs.readFileSync(new URL('./browser.js', import.meta.url), 'utf8');

export function loadBrand(slug: string): Brand {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'config/brands', `${slug}.json`), 'utf8'));
}

/** Ornamen dekoratif per brand (assets/decor, dibuat oleh npm run decor). Posisi dari config brand -> decor. */
function decorHtml(brand: Brand, theme: string): string {
  const items = brand.decor?.[theme === 'plain' ? 'inner' : theme] ?? [];
  return items.length ? `<div class="decor">${items.map((d) => `<img class="dc" data-asset="assets/decor/${brand.slug}/${d.f}" src="${fileUrl(`assets/decor/${brand.slug}/${d.f}`)}" style="${d.s}" alt="">`).join('')}</div>` : '';
}

export function pageHtml(slide: Slide, brand: Brand, format: Spec['format'], background?: Spec['background']): string {
  const { w, h } = FORMATS[format];
  const [mx, my] = brand.safe[format];
  const t = brand.tokens;
  const { back, main, theme } = layoutHtml(slide, brand, slide.bg ?? background);
  const logoFile = `assets/brands/${brand.slug}/logo/${theme === 'hero' ? brand.logo.hero : brand.logo.default}.png`;
  const vars = `--w:${w}px;--h:${h}px;--mx:${mx}px;--my:${my}px;--logo-w:${brand.logo.width}px;--logo-h:${brand.logo.height}px;
    --font:'${brand.font.family}';--cjk:'${brand.font.cjkFont ?? 'Yu Gothic'}';--w-head:${brand.font.headline};--w-sub:${brand.font.sub};--w-body:${brand.font.body};
    --head-transform:${brand.font.uppercaseHeadline ? 'uppercase' : 'none'};
    --bg:${t.bg};--ink:${t.ink};--muted:${t.muted};--accent:${t.accent};--accent-gradient:${t.accentGradient};--accent-ink:${t.accentInk};
    --surface:${t.surface};--surface-ink:${t.surfaceInk};--surface-muted:${t.surfaceMuted};--hl-color:${t.hlColor};--hl-bg:${t.hlBg};
    --hero-ink:${t.heroInk};--hero-muted:${t.heroMuted};--footer-ink:${t.footerInk};--scrim:${t.scrim};--photo-opacity:${t.photoOpacity};--line:${t.line};
    --num-color:${t.numColor};--num-zero:${t.numZero};--num-bg:${t.numBg};--hl-pad:${t.hlPad};--eyebrow:${t.eyebrow};--hero-cta-bg:${t.heroCtaBg};--hero-cta-ink:${t.heroCtaInk};--tick:${t.tick};--item-bg:${t.itemBg};--item-ink:${t.itemInk};--item-muted:${t.itemMuted};--item-border:${t.itemBorder};
    ${Object.entries(brand.style ?? {}).map(([k, v]) => `--s-${k}:${String(v).startsWith('asset:') ? `url('${fileUrl(String(v).slice(6))}')` : v};`).join('')}`;
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${esc(slide.headline)}</title>
<style>${fontFaces(brand)}
:root{${vars}}
${CSS}</style></head><body><div class="canvas brand-${brand.slug}${slide.role ? ` role-${slide.role}` : ''} theme-${theme}${slide.shade ? ` shade-${slide.shade}` : ''}${brand.style?.duoStyle === 'box' ? ' duo-box' : ''}${slide.skin ? ` skin-${slide.skin}` : ''}">${back}<div class="ishade"></div>${decorHtml(brand, slide.skin ?? theme)}${brand.frame ? '<div class="frame"></div>' : ''}
<div class="safe"><div class="logo-wrap"><img class="logo" src="${fileUrl(logoFile)}" alt="${esc(brand.name)}"></div>
<div class="main">${main}</div><div class="footer">${esc(brand.footer)}</div></div></div></body></html>`;
}

export interface RenderResult { dir: string; status: string; slides: SlideQa[] }

export async function renderSpec(raw: unknown, opts: { browser?: Browser; outRoot?: string } = {}): Promise<RenderResult> {
  const spec = parseSpec(raw);
  const brand = loadBrand(spec.brand);
  const { w, h } = FORMATS[spec.format];
  const dir = path.join(opts.outRoot ?? path.join(ROOT, 'projects'), spec.brand, spec.slug.startsWith(spec.month) ? spec.slug : `${spec.month}-${spec.slug}`);
  const build = path.join(dir, '_build');
  fs.mkdirSync(build, { recursive: true });

  const browser = opts.browser ?? (await chromium.launch());
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const slides: SlideQa[] = [];
  try {
    for (const [i, slide] of spec.slides.entries()) {
      const n = String(i + 1).padStart(2, '0');
      const html = path.join(build, `slide-${n}.html`);
      fs.writeFileSync(html, pageHtml(slide, brand, spec.format, spec.background));
      await page.goto(fileUrl(html), { waitUntil: 'load' });
      await page.addScriptTag({ content: BROWSER_JS });
      const measure = await page.evaluate('window.__fitAndMeasure()');
      const png = path.join(dir, `slide-${n}.png`);
      await page.screenshot({ path: png, clip: { x: 0, y: 0, width: w, height: h } });
      // Tanpa teks: dipakai untuk mengukur kontras teks terhadap latar sebenarnya.
      await page.addStyleTag({ content: '.safe *{color:transparent!important;-webkit-text-fill-color:transparent!important}.canvas:not(.brand-jepang-koey) .title{background:none!important}.canvas:not(.duo-box) .title.duo mark,.fr-l{background:none!important}.skin-feed .ftext mark,.skin-feed .fr-h,.skin-feed .nm,.skin-feed .nm i{background:none!important}' });
      const bare = await page.screenshot({ clip: { x: 0, y: 0, width: w, height: h } });
      slides.push(await runQa({ n: i + 1, slide, spec, brand, png, bare, measure: measure as never }));
    }
    const report = summarize(spec, brand, slides);
    fs.writeFileSync(path.join(dir, 'design-spec.json'), JSON.stringify(spec, null, 2));
    fs.writeFileSync(path.join(dir, 'qa-report.json'), JSON.stringify(report, null, 2));
    if (spec.caption) fs.writeFileSync(path.join(dir, 'caption.md'), spec.caption + '\n');
    await writeReview(browser, dir, spec, brand, report);
    return { dir, status: report.status, slides };
  } finally {
    await page.close();
    if (!opts.browser) await browser.close();
  }
}
