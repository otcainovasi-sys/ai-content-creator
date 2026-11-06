import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import type { Brand, Slide } from '../schema.js';
import { archetypeHtml, badgeIcon, heroIcons, sceneHtml, useBrandIcons } from './archetypes.js';

export const ROOT = process.cwd();
export const fileUrl = (p: string) => pathToFileURL(path.resolve(ROOT, p)).href;

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** **kata** menjadi highlight. Teks lain di-escape. */
/** **tebal** jadi sorotan biasa; ^^teks^^ jadi sorotan ajakan (misalnya CTA merah di ujung kalimat). */
export const rich = (s: string) => pinyin(esc(s).replace(/\*\*(.+?)\*\*/g, '<mark>$1</mark>').replace(/\^\^(.+?)\^\^/g, '<mark class="hot">$1</mark>'));
/** Font brand (Lato v1) tidak punya huruf bernada pinyin. Segmen berpinyin (dipisah " · ") dipindah utuh ke font CJK
 *  supaya satu frasa tidak tercampur dua font. */
const TONE = /[āǎēěīǐōǒūǔǖǘǚǜĀǍĒĚĪǏŌǑŪǓ]/;
export const pinyin = (html: string) => html.split(' · ').map((seg) => (TONE.test(seg) ? `<span class="cjk">${seg}</span>` : seg)).join(' · ');
export const plain = (s: string) => s.replace(/\*\*|\^\^/g, '');

export function mascotPath(brand: Brand, id: string): string {
  return `assets/brands/${brand.slug}/mascots/${id}.png`;
}

const img = (src: string, cls: string, position?: string, zoom?: number) => {
  const st = `${position ? `object-position:${esc(position)};` : ''}${zoom && zoom > 1 ? `transform:scale(${zoom});transform-origin:${esc(position ?? 'center')};` : ''}`;
  return `<img class="${cls}" data-asset="${esc(src)}" src="${fileUrl(src)}"${st ? ` style="${st}"` : ''} alt="">`;
};

const fit = (tag: string, cls: string, min: number, max: number, html: string) =>
  `<${tag} class="${cls}" data-fit data-min="${min}" data-max="${max}">${html}</${tag}>`;

const headline = (s: { headline: string }, min = 46, max = 80) => fit('h1', 'headline', min, max, rich(s.headline));
const sub = (s: { sub?: string }, min = 25, max = 34, cls = '') => (s.sub ? fit('p', `sub ${cls}`, min, max, rich(s.sub)) : '');
const eyebrow = (s: { eyebrow?: string }) => (s.eyebrow ? `<p class="eyebrow">${esc(s.eyebrow)}</p>` : '');
const cta = (s: { cta?: string }) => (s.cta ? `<div class="cta" data-role="cta">${esc(s.cta)}</div>` : '');
const bg = (src: string | undefined, position?: string, zoom?: number) =>
  src ? `<div class="bg">${img(src, 'bg-img', position, zoom)}</div><div class="scrim"></div>` : '';
const mascotImg = (brand: Brand, id?: string, cls = 'mascot') => (id ? img(mascotPath(brand, id), cls) : '');

function heroPhoto(s: Extract<Slide, { layout: 'hero_photo' }>, b: Brand) {
  return {
    back: bg(s.image.src, s.image.position, s.image.zoom),
    theme: 'hero',
    main: `<div class="visual" data-keep="280">${mascotImg(b, s.mascot, 'mascot left')}</div>
      <div class="block">${eyebrow(s)}${headline(s)}${sub(s)}${cta(s)}</div>`,
  };
}

function mascotHero(s: Extract<Slide, { layout: 'mascot_hero' }>, b: Brand) {
  const ben = s.benefits?.length
    ? `<div class="cols n${s.benefits.length}">${s.benefits.map((t) => fit('p', 'col', 22, 28, esc(t))).join('')}</div>`
    : '';
  return {
    back: bg(s.image.src, s.image.position, s.image.zoom),
    theme: 'hero',
    main: `<div class="visual" data-keep="360">${mascotImg(b, s.mascot, 'mascot center')}</div>
      <div class="block center">${eyebrow(s)}${headline(s, 44, 72)}${sub(s)}${ben}${cta(s)}</div>`,
  };
}

function scoreInfographic(s: Extract<Slide, { layout: 'score_infographic' }>) {
  const hasBefore = s.rows.some((r) => r.before);
  const hasNote = s.rows.some((r) => r.note);
  const rows = s.rows.map((r) => `<tr><td class="skill">${esc(r.skill)}</td>
    ${hasBefore ? `<td class="num">${esc(r.before ?? '–')}</td>` : ''}<td class="num strong">${esc(r.after)}</td>
    ${hasNote ? `<td class="note">${esc(r.note ?? '')}</td>` : ''}</tr>`).join('');
  return {
    back: '',
    theme: 'plain',
    main: `<div class="block top">${eyebrow(s)}${headline(s, 44, 68)}${sub(s, 24, 30)}</div>
      <div class="card table-card" data-box><p class="card-title">${esc(s.tableTitle)}</p>
      <table><thead><tr><th>Keterampilan</th>${hasBefore ? '<th class="num">Awal</th>' : ''}<th class="num">Akhir</th>${hasNote ? '<th>Catatan tutor</th>' : ''}</tr></thead><tbody>${rows}</tbody></table></div>
      ${cta(s)}`,
  };
}

function storyCard(s: Extract<Slide, { layout: 'story_card' }>) {
  return {
    back: '',
    theme: 'plain',
    main: `<div class="block top center">${eyebrow(s)}${headline(s, 42, 66)}</div>
      <div class="photo-card" data-keep="340">${img(s.image.src, 'fill', s.image.position)}</div>
      <div class="name-row"><span class="pill">${esc(s.name)}</span>${s.role ? `<span class="role">${esc(s.role)}</span>` : ''}</div>
      ${s.quote ? fit('p', 'quote center-text', 24, 32, `“${esc(s.quote)}”`) : ''}${sub(s, 23, 28, 'center-text')}${cta(s)}`,
  };
}

function achievement(s: Extract<Slide, { layout: 'achievement' }>) {
  return {
    back: '',
    theme: 'plain',
    main: `<div class="block top center">${eyebrow(s)}${headline(s, 42, 70)}</div>
      <div class="photo-card contain" data-keep="400">${img(s.image.src, 'fit', s.image.position)}</div>
      <div class="name-row"><span class="pill">${esc(s.name)}</span></div>${sub(s, 23, 28, 'center-text')}${cta(s)}`,
  };
}

function tutorProfile(s: Extract<Slide, { layout: 'tutor_profile' }>) {
  const cred = s.credentials?.length
    ? `<ul class="ticks">${s.credentials.map((c) => fit('li', '', 23, 28, esc(c))).join('')}</ul>` : '';
  return {
    back: bg(s.image.src, s.image.position, s.image.zoom),
    theme: 'hero',
    main: `<div class="visual" data-keep="300"></div>
      <div class="block">${eyebrow(s)}${headline(s, 44, 72)}
      <div class="name-row left"><span class="pill">${esc(s.name)}</span>${s.role ? `<span class="role hero-role">${esc(s.role)}</span>` : ''}</div>
      ${cred}${sub(s)}${cta(s)}</div>`,
  };
}

function programValue(s: Extract<Slide, { layout: 'program_value' }>) {
  return {
    back: '',
    theme: 'plain',
    main: `<div class="block top center">${eyebrow(s)}${headline(s, 42, 66)}${sub(s, 23, 28)}</div>
      <div class="photo-card" data-keep="300">${img(s.image.src, 'fill', s.image.position)}</div>
      ${s.guarantee ? fit('p', 'strip', 23, 28, rich(s.guarantee)) : ''}
      <div class="cols n${s.benefits.length}">${s.benefits.map((t) => fit('p', 'col', 21, 26, esc(t))).join('')}</div>${cta(s)}`,
  };
}

function priceTable(s: Extract<Slide, { layout: 'price_table' }>) {
  const tiers = s.tiers.map((t) => `<div class="tier${t.featured ? ' featured' : ''}"><p class="tier-name">${esc(t.name)}</p>
    ${t.strike ? `<p class="strike">${esc(t.strike)}</p>` : ''}<p class="price">${esc(t.price)}</p></div>`).join('');
  const feats = s.features?.length ? `<ul class="ticks plain-ticks">${s.features.map((f) => fit('li', '', 24, 32, esc(f))).join('')}</ul>` : '';
  return {
    back: '',
    theme: 'plain',
    main: `<div class="block top center">${eyebrow(s)}${headline(s, 44, 72)}${sub(s, 24, 30)}</div>
      ${s.period ? `<div class="name-row"><span class="pill">${esc(s.period)}</span></div>` : ''}
      <div class="tiers">${tiers}</div>${feats}${s.note ? `<p class="note-text">${esc(s.note)}</p>` : ''}${cta(s)}`,
  };
}

function numberedList(s: Extract<Slide, { layout: 'numbered_list' }>, b: Brand) {
  const items = s.items.map((it, i) => {
    const n = String(i + 1).padStart(2, '0');
    return `<li class="item"><span class="n"><i>${n[0]}</i><b>${n[1]}</b></span><div class="item-body">
      ${fit('p', 'item-title', 26, 38, pinyin(esc(it.title)))}${it.text ? fit('p', 'item-text', 22, 30, pinyin(esc(it.text))) : ''}</div></li>`;
  }).join('');
  return {
    back: '',
    theme: 'plain',
    main: `<div class="list-head"><div class="block top">${eyebrow(s)}${headline(s, 44, 70)}${sub(s, 24, 30)}</div>${mascotImg(b, s.mascot, 'mascot-side')}</div>
      <ol class="items">${items}</ol>${cta(s)}`,
  };
}

const num = (n: number) => { const t = String(n).padStart(2, '0'); return `<span class="n"><i>${t[0]}</i><b>${t.slice(1)}</b></span>`; };

function cover(s: Extract<Slide, { layout: 'cover' }>, b: Brand) {
  const ey = s.eyebrow ? `<p class="series">${esc(s.eyebrow)}</p>` : '';
  if (s.image) {
    return {
      back: bg(s.image.src, s.image.position, s.image.zoom),
      theme: 'hero',
      main: `<div class="visual" data-keep="${s.mascot || s.scene ? 470 : 300}">${s.scene ? sceneHtml(s.scene) : mascotImg(b, s.mascot, 'mascot left')}${s.props?.length ? `<div class="props n${s.props.length}">${s.props.map((id, i) => `<span class="prop p${i}">${badgeIcon(id)}</span>`).join('')}<span class="prop-rays"><i></i><i></i><i></i></span></div>` : ''}</div>
        <div class="block">${ey}${headline(s, 50, s.mascot || s.scene ? 74 : 96)}${sub(s, 26, s.mascot || s.scene ? 30 : 36)}</div>`,
    };
  }
  if (s.hero?.length || s.scene) {
    return {
      back: '<div class="ibase"></div><div class="iscrim"></div>',
      theme: 'inner',
      main: `<div class="head center">${ey}${headline(s, 50, 74)}${sub(s, 26, 32)}</div>${s.scene ? sceneHtml(s.scene) : heroIcons(s.hero)}`,
    };
  }
  if (!s.mascot) return { back: '', theme: 'plain', main: `<div class="stack"><div class="block center">${ey}${headline(s, 60, 110)}${sub(s, 28, 40)}</div></div>` };
  return {
    back: '',
    theme: 'plain',
    main: `<div class="block top center">${ey}${headline(s, 54, 96)}${sub(s, 26, 36)}</div>
      <div class="visual" data-keep="420">${mascotImg(b, s.mascot, 'mascot center')}</div>`,
  };
}

function point(s: Extract<Slide, { layout: 'point' }>, b: Brand) {
  const ex = s.example
    ? `<div class="example">${fit('p', 'ex-text', 44, 88, pinyin(esc(s.example.text)))}
        ${s.example.reading ? fit('p', 'ex-reading', 28, 46, pinyin(esc(s.example.reading))) : ''}
        ${s.example.meaning ? fit('p', 'ex-meaning', 26, 40, rich(s.example.meaning)) : ''}</div>`
    : '';
  return {
    back: '',
    theme: 'plain',
    main: `<div class="point-head">${s.number ? num(s.number) : ''}<div class="block">${eyebrow(s)}${headline(s, 44, 72)}</div></div>
      <div class="point-area"><div class="point-card" data-box>${s.body ? fit('p', 'point-body', 28, 52, rich(s.body)) : ''}${ex}
        ${s.tip ? fit('p', 'point-tip', 24, 34, rich(s.tip)) : ''}</div></div>
      ${s.mascot ? `<div class="point-mascot">${mascotImg(b, s.mascot, 'mascot-side')}</div>` : ''}${cta(s)}`,
  };
}

function grid(s: Extract<Slide, { layout: 'grid' }>) {
  const cells = s.cells.map((c, i) => `<div class="cell${(i === 1 || i === 2) && s.cells.length === 4 ? ' alt' : ''}">${s.numbered === false ? '' : num(i + 1)}
    ${fit('p', 'cell-title', 32, 60, pinyin(esc(c.title)))}${c.text ? fit('p', 'cell-text', 24, 40, rich(c.text)) : ''}</div>`).join('');
  return {
    back: '',
    theme: 'plain',
    main: `<div class="block top center">${eyebrow(s)}${headline(s, 44, 70)}${sub(s, 24, 30)}</div>
      <div class="cells n${s.cells.length}">${cells}</div>
      ${s.closing ? `<p class="punch">${rich(s.closing)}</p>` : ''}${cta(s)}`,
  };
}

function closing(s: Extract<Slide, { layout: 'closing' }>, b: Brand) {
  const card = `<div class="cta-card"><div class="cta" data-role="cta">${esc(s.cta)}</div>${s.ctaNote ? `<p class="cta-note">${esc(s.ctaNote)}</p>` : ''}</div>`;
  if (s.image) {
    return {
      back: bg(s.image.src, s.image.position, s.image.zoom),
      theme: 'hero',
      main: `<div class="block center">${eyebrow(s)}${headline(s, 46, 80)}${sub(s, 25, 34)}</div>
        <div class="visual" data-keep="${s.mascot ? 300 : 0}">${mascotImg(b, s.mascot, 'mascot center')}</div>${card}`,
    };
  }
  if (!s.mascot) return { back: '', theme: 'plain', main: `<div class="stack"><div class="block center">${eyebrow(s)}${headline(s, 50, 92)}${sub(s, 26, 36)}</div>${card}</div>` };
  return {
    back: '',
    theme: 'plain',
    main: `<div class="block top center">${eyebrow(s)}${headline(s, 46, 80)}${sub(s, 25, 34)}</div>
      <div class="visual" data-keep="360">${mascotImg(b, s.mascot, 'mascot center')}</div>${card}`,
  };
}

const INNER = ['tips', 'labels', 'timeline', 'framework', 'options', 'offer', 'compare', 'comment', 'feature', 'proof', 'promo', 'program', 'free'];
// Slide padat memakai foto 10%, slide lapang sampai 30% (guideline OTCA).
const DENSE = ['labels', 'timeline', 'framework', 'compare', 'promo', 'feature', 'program', 'free'];

export function layoutHtml(slide: Slide, brand: Brand, background?: { src: string; position?: string; zoom?: number }) {
  useBrandIcons(brand.slug);
  if (INNER.includes(slide.layout)) {
    const main = archetypeHtml(slide, (id, cls) => mascotImg(brand, id, cls))!;
    const back = `<div class="ibase"></div>${background ? `<div class="ibg${DENSE.includes(slide.layout) ? ' dense' : ''}">${img(background.src, 'ibg-img', background.position, background.zoom)}</div>` : ''}<div class="iscrim"></div>`;
    return { back, main, theme: 'inner' };
  }
  switch (slide.layout) {
    case 'hero_photo': return heroPhoto(slide, brand);
    case 'mascot_hero': return mascotHero(slide, brand);
    case 'score_infographic': return scoreInfographic(slide);
    case 'story_card': return storyCard(slide);
    case 'achievement': return achievement(slide);
    case 'tutor_profile': return tutorProfile(slide);
    case 'program_value': return programValue(slide);
    case 'price_table': return priceTable(slide);
    case 'numbered_list': return numberedList(slide, brand);
    case 'cover': return cover(slide, brand);
    case 'point': return point(slide, brand);
    case 'grid': return grid(slide);
    case 'closing': return closing(slide, brand);
    default: throw new Error(`Layout tidak dikenal: ${slide.layout}`);
  }
}

export function fontFaces(brand: Brand): string {
  const fam = brand.font.family;
  const dir = `node_modules/@fontsource/${fam.toLowerCase()}/files`;
  const weights = [...new Set([brand.font.headline, brand.font.sub, brand.font.body, 700, ...(brand.font.extra ?? [])])];
  const foot = brand.font.footerFont ? `@font-face{font-family:'${brand.font.footerFont}';font-weight:400;src:url('${fileUrl(`node_modules/@fontsource/${brand.font.footerFont.toLowerCase().replace(/ /g, '-')}/files/${brand.font.footerFont.toLowerCase().replace(/ /g, '-')}-latin-400-normal.woff2`)}') format('woff2');}\n` : '';
  return foot + weights.map((w) => {
    const f = `${dir}/${fam.toLowerCase()}-latin-${w}-normal.woff2`;
    if (!fs.existsSync(path.resolve(ROOT, f))) throw new Error(`Font tidak ditemukan: ${f}`);
    return `@font-face{font-family:'${fam}';font-weight:${w};src:url('${fileUrl(f)}') format('woff2');}`;
  }).join('\n');
}
