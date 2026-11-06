// Layout slide isi carousel, mengikuti arketipe di knowledge/shared/archetypes.md.
// Tidak ada nilai brand di sini: semua warna datang dari token `style` di config/brands.
import fs from 'node:fs';
import type { Slide } from '../schema.js';
import { esc, fileUrl, pinyin, rich } from './layouts.js';

/** Ikon sudah diwarnai per brand (npm run icons). */
let brandSlug = '';
export const useBrandIcons = (slug: string) => { brandSlug = slug; };
const icon = (id: string | undefined, cls = 'ic') => {
  if (!id) return '';
  const src = `assets/icons/${brandSlug}/${id}.png`;
  return `<img class="${cls}" data-asset="${esc(src)}" src="${fileUrl(src)}" alt="">`;
};
const photo = (src: string, cls: string, position?: string, zoom?: number) => {
  const st = `${position ? `object-position:${esc(position)};` : ''}${zoom && zoom > 1 ? `transform:scale(${zoom});transform-origin:${esc(position ?? 'center')};` : ''}`;
  return `<img class="${cls}" data-asset="${esc(src)}" src="${fileUrl(src)}"${st ? ` style="${st}"` : ''} alt="">`;
};
const fit = (tag: string, cls: string, min: number, max: number, html: string) =>
  `<${tag} class="${cls}" data-fit data-min="${min}" data-max="${max}">${html}</${tag}>`;
const title = (s: { headline: string }, min = 44, max = 72) => fit('h1', 'title', min, max, rich(s.headline));
const series = (s: { eyebrow?: string }) => (s.eyebrow ? `<p class="spill">${esc(s.eyebrow)}</p>` : '');
const punch = (t?: string) => (t ? `<p class="punchpill">${rich(t)}</p>` : '');
const nn = (i: number) => String(i + 1).padStart(2, '0');

export const heroIcons = (ids: string[] = []) => (ids.length
  ? `<div class="hero n${ids.length}">${ids.map((id, i) => icon(id, `hero-ic h${i}`)).join('')}</div>` : '');

/** Ilustrasi tersusun dari config/scenes.json: ikon ditumpuk jadi satu adegan, dengan bayangan lantai dan garis aksen. */
const SCENES: Record<string, { icon: string; x: number; y: number; h: number; r: number; z: number }[]> =
  JSON.parse(fs.readFileSync('config/scenes.json', 'utf8'));
export const badgeIcon = (id: string) => icon(id, 'prop-i');

export function sceneHtml(name: string) {
  const items = SCENES[name];
  if (!items) throw new Error(`Scene tidak dikenal: ${name}`);
  const parts = items.map((it) => {
    const src = `assets/icons/${brandSlug}/${it.icon}.png`;
    return `<img class="sc-i" data-asset="${esc(src)}" src="${fileUrl(src)}" style="left:${it.x}%;bottom:calc(${it.y}% + 18px);height:calc(${it.h}% - 18px);transform:translateX(-50%) rotate(${it.r}deg);z-index:${it.z}" alt="">`;
  }).join('');
  return `<div class="scene"><span class="sc-floor"></span><span class="sc-marks"><i></i><i></i><i></i></span>${parts}</div>`;
}

function example(e?: { text: string; reading?: string; meaning?: string }) {
  if (!e) return '';
  return `<div class="lex">${fit('p', 'lex-text', 34, 52, pinyin(esc(e.text)))}
    ${e.reading ? fit('p', 'lex-read', 24, 32, pinyin(esc(e.reading))) : ''}${e.meaning ? fit('p', 'lex-mean', 23, 29, rich(e.meaning)) : ''}</div>`;
}

function tips(s: Extract<Slide, { layout: 'tips' }>) {
  const cards = s.cards.map((c) => `<div class="tcard">${icon(c.icon, 'tcard-ic')}
    <div class="tcard-b">${c.meta ? `<p class="tmeta">${esc(c.meta)}</p>` : ''}${fit('p', 'tcard-t', 26, 36, rich(c.title))}</div></div>`).join('');
  return `<div class="head center">${series(s)}${title(s)}</div>${s.scene ? sceneHtml(s.scene) : heroIcons(s.hero)}
    ${s.sub ? `<p class="subpill">${esc(s.sub)}</p>` : ''}<div class="tcards n${s.cards.length}">${cards}</div>${punch(s.punch)}`;
}

function labels(s: Extract<Slide, { layout: 'labels' }>) {
  const items = s.items.map((it, i) => `<div class="lcard"><div class="lrow"><span class="lnum">${nn(i)}</span>${fit('p', 'ltitle', 25, 33, pinyin(esc(it.label)))}</div>
    <div class="lbody"><div class="lmain">${it.text ? fit('p', 'ltext', 24, 33, rich(it.text)) : ''}${example(it.example)}</div>${icon(it.icon, 'lcard-ic')}</div></div>`).join('');
  return `<div class="head center">${series(s)}${title(s, 42, 64)}${s.sub ? fit('p', 'hsub', 24, 30, rich(s.sub)) : ''}</div>
    <div class="lcards n${s.items.length}">${items}</div>${punch(s.punch)}`;
}

function timeline(s: Extract<Slide, { layout: 'timeline' }>) {
  const items = s.items.map((it) => `<div class="ccard">${icon(it.icon, 'ccard-ic')}<div class="ccard-b">
    ${fit('p', 'ctitle', 28, 38, rich(it.title))}<p class="crange">${esc(it.range)}</p>${fit('p', 'ctext', 24, 31, rich(it.text))}</div></div>`).join('');
  const note = s.note ? `<div class="notebox"><p class="note-l">${esc(s.note.label)}</p>${fit('p', 'note-t', 22, 27, rich(s.note.text))}</div>` : '';
  return `<div class="head center">${series(s)}${title(s, 40, 60)}</div><div class="ccards">${items}</div>${note}`;
}

function framework(s: Extract<Slide, { layout: 'framework' }>) {
  const flow = s.flow.map((id, i) => `${i ? '<span class="arrow"></span>' : ''}${icon(id, 'flow-ic')}`).join('');
  const pts = s.points.map((p) => `<li>${fit('p', 'fpoint', 24, 30, `<b>${esc(p.key)}</b> <span class="farrow">→</span> ${rich(p.text)}`)}</li>`).join('');
  return `<div class="head center">${series(s)}${title(s, 46, 74)}</div>
    <div class="fcard"><p class="fpill">${esc(s.header)}</p><div class="flow">${flow}</div><ul class="fpoints">${pts}</ul></div>${punch(s.punch)}`;
}

function options(s: Extract<Slide, { layout: 'options' }>) {
  const items = s.items.map((it, i) => {
    const n = nn(i);
    return `<div class="orow"><span class="onum"><i>${n[0]}</i><b>${n[1]}</b></span><div class="obody">${fit('p', 'otitle', 28, 38, rich(it.title))}${fit('p', 'otext', 24, 30, rich(it.text))}</div></div>`;
  }).join('');
  return `<div class="head center">${series(s)}${title(s, 46, 74)}</div><div class="orows">${items}</div>${punch(s.punch)}`;
}

/** Kotak CTA: ikon, teks, dan panah. Latarnya memakai garis ornamen brand. */
function ctaBand(cta: string, note?: string, ic = 'point-right') {
  const art = fileUrl(`assets/decor/${brandSlug}/flow-lines.svg`);
  return `<div class="ctaband" style="--band-art:url('${art}')"><span class="cb-ic">${icon(ic, 'cb-img')}</span><div class="cb-b"><div class="ctabox-t" data-role="cta">${esc(cta)}</div>${note ? `<p class="ctabox-n">${esc(note)}</p>` : ''}</div><span class="cb-go"></span></div>`;
}

const sticker = (t?: string) => (t ? `<div class="sticker" style="background-image:url('${fileUrl(`assets/decor/${brandSlug}/burst.svg`)}')"><span>${esc(t)}</span></div>` : '');

function offer(s: Extract<Slide, { layout: 'offer' }>, mascot: string) {
  const items = s.items.map((it) => `<div class="oitem">${icon(it.icon, 'fitem-ic')}<div class="oitem-b">${fit('p', 'fi-title', 27, 36, rich(it.title))}
    ${it.text ? fit('p', 'fi-text', 22, 27, rich(it.text)) : ''}</div></div>`).join('');
  const floats = mascot ? (s.hero ?? []).map((id, i) => icon(id, `float f${i}`)).join('') : '';
  const visual = mascot || s.hero?.length || s.scene
    ? `<div class="ovis"><div class="ovis-glow"></div>${sticker(s.badge)}${floats}${mascot || (s.scene ? sceneHtml(s.scene) : heroIcons(s.hero))}</div>` : '';
  return `<div class="head center">${series(s)}${title(s, 44, 66)}${s.sub ? fit('p', 'hsub', 24, 30, rich(s.sub)) : ''}</div>
    <div class="ogrid${visual ? '' : ' solo'}"><div class="olist">${s.itemsTitle ? `<p class="olist-t">${esc(s.itemsTitle)}</p>` : ''}${items}</div>${visual}</div>
    ${ctaBand(s.cta, s.ctaNote, s.ctaIcon)}`;
}

function compare(s: Extract<Slide, { layout: 'compare' }>) {
  const cols = s.columns.map((c) => `<div class="kcol">${c.image ? photo(c.image.src, 'kcol-img', c.image.position) : icon(c.icon, 'kcol-ic')}
    ${fit('p', 'kcol-t', 23, 40, rich(c.title))}<div class="krows">${c.rows.map((r) => `<div class="krow"><p class="krow-l">${esc(r.label)}</p>${fit('p', 'krow-t', 23, 32, rich(r.text))}</div>`).join('')}</div></div>`).join('');
  return `<div class="head center">${series(s)}${title(s, 42, 66)}${s.sub ? fit('p', 'hsub', 24, 30, rich(s.sub)) : ''}</div>
    <div class="kcols n${s.columns.length}">${cols}</div>${punch(s.punch)}`;
}

function comment(s: Extract<Slide, { layout: 'comment' }>, mascot: string) {
  return `<div class="cmt"><div class="cmt-av"></div><div class="cmt-b"><p class="cmt-n">${esc(s.author)}</p>${fit('p', 'cmt-t', 30, 40, esc(s.comment))}<p class="cmt-m">2h &nbsp; Reply</p></div></div>
    <div class="cmt-v">${mascot || (s.scene ? sceneHtml(s.scene) : heroIcons(s.hero))}</div>
    <div class="head">${fit('h1', 'title big', 52, 84, rich(s.headline))}${s.sub ? fit('p', 'hsub', 26, 34, rich(s.sub)) : ''}</div>`;
}

function feature(s: Extract<Slide, { layout: 'feature' }>) {
  const steps = s.steps.map((t) => `<div class="fstep">${fit('p', 'fstep-t', 28, 38, rich(t))}</div>`).join('');
  const flow = s.flow?.length ? `<div class="fflow">${s.flow.map((t, i) => `${i ? '<span class="arrow"></span>' : ''}<span>${esc(t)}</span>`).join('')}</div>` : '';
  return `<div class="head center">${series(s)}${title(s, 44, 68)}</div>
    <div class="fwrap"><div class="device">${photo(s.screen.src, 'device-img', s.screen.position)}</div><div class="fsteps">${steps}</div></div>${flow}`;
}

function proof(s: Extract<Slide, { layout: 'proof' }>) {
  return `<div class="head center">${series(s)}${title(s, 46, 76)}</div>
    <div class="pphoto${s.fit === 'contain' ? ' contain' : ''}">${photo(s.image.src, 'pphoto-img', s.image.position)}<div class="pname"><p class="pname-n">${esc(s.name)}</p>${s.label ? `<p class="pname-r">${esc(s.label)}</p>` : ''}</div></div>
    ${s.quote ? fit('p', 'pquote', 26, 36, `“${esc(s.quote)}”`) : ''}${s.sub ? fit('p', 'hsub center-text', 24, 28, rich(s.sub)) : ''}${s.cta ? `<div class="cta" data-role="cta">${esc(s.cta)}</div>` : ''}`;
}

function promo(s: Extract<Slide, { layout: 'promo' }>) {
  const head = `<div class="head center">${series(s)}${title(s, 44, 74)}${s.sub ? fit('p', 'hsub', 24, 30, rich(s.sub)) : ''}${s.period ? `<p class="spill">${esc(s.period)}</p>` : ''}</div>`;
  const foot = `${s.note ? `<p class="pnote">${esc(s.note)}</p>` : ''}${s.cta ? ctaBand(s.cta, s.ctaNote, s.ctaIcon) : ''}`;
  if (s.matrix?.length) {
    const hdr = s.tiers.map((t) => `<th class="${t.featured ? 'on' : ''}"><span>${esc(t.name)}</span></th>`).join('');
    const price = s.tiers.map((t) => `<td class="mp${t.featured ? ' on' : ''}">${t.strike ? `<s>${esc(t.strike)}</s>` : ''}<b>${esc(t.price)}</b></td>`).join('');
    const rows = s.matrix.map((r) => `<tr><td class="ml">${icon(r.icon, 'ml-ic')}<span>${esc(r.label)}</span></td>${r.values.map((v, i) => `<td class="mc${s.tiers[i]?.featured ? ' on' : ''}">${v ? '<i class="tick"></i>' : ''}</td>`).join('')}</tr>`).join('');
    return `${head}<div class="mcard"><table class="mtable"><tr><th class="ml">Fasilitas</th>${hdr}</tr><tr><td class="ml"><b>Harga</b></td>${price}</tr>${rows}</table></div>${foot}`;
  }
  const main = s.tiers.find((t) => t.featured) ?? s.tiers[0];
  const rest = s.tiers.filter((t) => t !== main);
  const ticket = `<div class="ticket-w"><div class="ticket"><span class="tk-ic">${icon(s.ticketIcon ?? 'crown', 'tk-img')}</span>
    <div class="tk-b"><p class="ptier-n">${esc(main.name)}</p>${main.strike ? `<s class="ptier-s">${esc(main.strike)}</s>` : ''}${fit('p', 'ptier-p', 60, 92, esc(main.price))}</div></div>${sticker(s.badge)}</div>`;
  const others = rest.length ? `<div class="tminis n${rest.length}">${rest.map((t) => `<div class="tmini"><p class="tmini-n">${esc(t.name)}</p>${t.strike ? `<s class="tmini-s">${esc(t.strike)}</s>` : ''}<p class="tmini-p">${esc(t.price)}</p></div>`).join('')}</div>` : '';
  const feats = s.features?.length ? `<div class="pbox n${s.features.length}">${s.features.map((f) => `<div class="pfeat">${icon(f.icon, 'pfeat-ic')}${fit('p', 'pfeat-t', 23, 29, rich(f.title))}</div>`).join('')}</div>` : '';
  return `${head}<div class="pstack">${ticket}${others}${feats}</div>${foot}`;
}

function program(s: Extract<Slide, { layout: 'program' }>) {
  return `<div class="head center">${series(s)}${title(s, 44, 70)}${s.sub ? fit('p', 'hsub', 24, 30, rich(s.sub)) : ''}</div>
    <div class="gshot">${s.imageLabel ? `<p class="gshot-l">${esc(s.imageLabel)}</p>` : ''}${photo(s.image.src, 'gshot-img', s.image.position)}</div>
    ${s.guarantee ? `<p class="gband">${rich(s.guarantee)}</p>` : ''}
    <div class="gben n${s.benefits.length}">${s.benefits.map((b) => `<div class="gb">${icon(b.icon, 'gb-ic')}${fit('p', 'gb-t', 23, 29, rich(b.title))}</div>`).join('')}</div>
    ${s.cta ? `<div class="cta" data-role="cta">${esc(s.cta)}</div>` : ''}`;
}

/** Layout bebas: setiap blok diletakkan sesuai komposisi konten. QA tetap memeriksa muat, tabrakan, safe zone, dan kontras. */
function free(s: Extract<Slide, { layout: 'free' }>, mascot: (id?: string, cls?: string) => string) {
  const nz = (n?: number) => (n ? String(n).padStart(2, '0') : '');
  const parts = s.blocks.map((b) => {
    const style = `left:${b.x}%;top:${b.y}%;width:${b.w}%;height:${b.h}%;${b.r ? `transform:rotate(${b.r}deg);` : ''}${b.z ? `z-index:${b.z};` : ''}${b.align ? `text-align:${b.align};` : ''}`;
    const tone = `tone-${b.tone ?? 'light'}`;
    switch (b.k) {
      case 'title': return `<div class="fz" style="${style}">${fit('h1', `${b.variant === 'duo' ? 'title duo' : 'title'}${b.color ? ` c-${b.color}` : ''}`, b.min ?? 44, b.max ?? 74, rich(b.t ?? s.headline))}</div>`;
      case 'text': return b.variant === 'swipe'
        ? `<div class="fz fswipe" style="${style}"><p>${esc(b.t ?? '')}</p><i class="farrow"></i></div>`
        : `<div class="fz" style="${style}">${fit('p', `ftext c-${b.color ?? 'ink'}`, b.min ?? 24, b.max ?? 34, rich(b.t ?? ''))}</div>`;
      case 'pill': return b.variant === 'punch'
        ? `<div class="fz fpunch" style="${style}">${fit('p', 'fp-t', b.min ?? 25, b.max ?? 33, rich(b.t ?? ''))}</div>`
        : `<div class="fz fpillx${b.variant ? ` ${b.variant}` : ''}" style="${style}"><span class="${tone}"${b.max ? ` style="font-size:${b.max}px"` : ''}>${esc(b.t ?? '')}</span></div>`;
      case 'list': return `<div class="fz flist" style="${style}">${(b.items ?? []).map((it) => `<div class="fl-r"><i class="${b.note === 'check' ? 'ck' : 'dot'}"></i>${fit('p', 'fl-t', b.min ?? 25, b.max ?? 33, rich(it.t ?? ''))}</div>`).join('')}</div>`;
      case 'tip': return `<div class="fz ftip${b.variant === 'top' ? ' top' : ''}" style="${style}">${b.variant === 'top' ? `<span class="ftip-y">${esc(b.note ?? '')}</span>` : `<div class="ftip-tag"><span class="ftip-c"><svg class="ftip-bulb" viewBox="0 0 64 64" fill="none" stroke="#F6D23C" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M32 15c-7.7 0-13.5 5.8-13.5 13 0 4.8 2.4 8 5.1 10.6 1.6 1.5 2.6 3.4 2.6 5.6v1.3h11.6v-1.3c0-2.2 1-4.1 2.6-5.6 2.7-2.6 5.1-5.8 5.1-10.6 0-7.2-5.8-13-13.5-13z"/><path d="M26.6 51h10.8M28.4 56h7.2"/><path d="M32 4.5v4.5M15.5 11.5l3.2 3.2M48.5 11.5l-3.2 3.2M8.5 28h4.5M51 28h4.5"/><path d="M28 30.5l4 4 4-4" stroke-width="2.6"/></svg></span><span class="ftip-l">${esc(b.note ?? 'QUICK TIPS')}</span></div>`}<div class="ftip-b">${b.head ? fit('p', 'ftip-h', 26, 32, rich(b.head)) : ''}${fit('p', 'ftip-t', b.min ?? 24, b.max ?? 31, rich(b.t ?? ''))}</div></div>`;
      case 'step': return `<div class="fz fstepx" style="${style}"><div class="fs-h"><span class="fs-n">${nz(b.num)}</span><span class="fs-l">${esc(b.head ?? '')}</span></div>${fit('p', 'fs-t', 23, b.max ?? 30, rich(b.t ?? ''))}</div>`;
      case 'tile': return `<div class="fz ftile ${tone}" style="${style}">${icon(b.id, 'ft-ic')}${b.head ? fit('p', `ft-h${b.variant === 'pill' ? ' pilled' : ''}`, b.min ?? 24, b.max ?? 34, rich(b.head)) : ''}${b.t ? fit('p', 'ft-t', 22, 28, rich(b.t)) : ''}</div>`;
      case 'col': return `<div class="fz fcol ${tone}" style="${style}"><span class="fcol-a">${esc(b.head ?? '')}</span>${b.note ? `<span class="fcol-b">${esc(b.note)}</span>` : ''}${b.id ? icon(b.id, 'fcol-ic') : ''}<div class="fcol-l">${(b.items ?? []).map((it) => `<div class="fcol-r"><i class="ck"></i>${fit('p', 'fcol-t', 22, b.max ?? 30, rich(it.t ?? it.head ?? ''))}</div>`).join('')}</div></div>`;
      case 'big': return `<div class="fz fbig" style="${style}">${fit('p', 'fbig-n', b.min ?? 90, b.max ?? 190, esc(b.t ?? ''))}${b.unit ? `<p class="fbig-u">${esc(b.unit)}</p>` : ''}</div>`;
      case 'card': return `<div class="fz fcardx ${tone}${b.variant ? ` ${b.variant}` : ''}" style="${style}">${b.num ? `<span class="fnum">${nz(b.num)}</span>` : ''}${icon(b.id, 'fc-ic')}<div class="fc-b">${b.head ? fit('p', 'fc-h', b.min ?? 28, b.max ?? 42, rich(b.head)) : ''}${b.t ? fit('p', 'fc-t', 23, 30, rich(b.t)) : ''}</div></div>`;
      case 'bubble': return `<div class="fz fbub ${tone} side-${b.side ?? 'l'}" style="${style}">${fit('p', 'fc-h', b.min ?? 28, b.max ?? 38, rich(b.t ?? ''))}${b.note ? fit('p', 'fc-t', 22, 27, rich(b.note)) : ''}</div>`;
      case 'icon': return `<div class="fz fic${b.variant ? ` ${b.variant}` : ''}" style="${style}">${icon(b.id, 'fic-i')}</div>`;
      case 'mascot': return `<div class="fz fmas${b.flip ? ' flip' : ''}${b.variant ? ` ${b.variant}` : ''}" style="${style}">${mascot(b.id, 'fmas-i')}</div>`;
      case 'scene': return `<div class="fz fsc" style="${style}">${sceneHtml(b.id ?? '')}</div>`;
      case 'cta': if (b.variant === 'tag') return `<div class="fz fctag" style="${style}">${b.icons?.[1] ? photo(b.icons[1], 'ct-spark') : ''}<span class="ct-tag">${esc(b.t ?? '')}</span>${b.icons?.[0] ? photo(b.icons[0], 'ct-hand') : icon(b.id, 'ct-hand')}<div class="ct-b"><p class="ct-h">${esc(s.cta ?? '')}</p>${b.note ? `<p class="ct-s">${esc(b.note)}</p>` : ''}</div></div>`;
        return b.variant === 'pill'
        ? `<div class="fz fpunch" style="${style}">${fit('p', 'fp-t', b.min ?? 25, b.max ?? 33, rich(s.cta ?? b.t ?? ''))}</div>`
        : `<div class="fz fctaz" style="${style}">${ctaBand(s.cta ?? b.t ?? '', b.note, b.id)}</div>`;
      case 'bar': return `<div class="fz fbar${b.variant ? ` ${b.variant}` : ''}" style="${style}"></div>`;
      case 'ring': return b.variant === 'plain' ? `<div class="fz fbox" style="${style}"></div>` :  `<div class="fz fring" style="${style}"></div>`;
      case 'photo': return `<div class="fz fphoto v-${b.variant ?? 'mono'}" style="${style}">${photo(b.src ?? '', 'fphoto-i', b.pos, b.zoom)}</div>`;
      case 'rows': return `<div class="fz frows v-${b.variant ?? 'outline'}" style="${style}">${(b.items ?? []).map((it, i) => {
        const lab = b.variant === 'num' ? `<span class="nm"><i>${nz(i + 1)[0]}</i>${nz(i + 1)[1]}</span>` : b.variant === 'quote' ? '<span class="qm"></span>' : b.variant === 'plain' ? icon(it.icon, 'fr-ic') : esc(it.label ?? '');
        return `<div class="fr${it.on ? ' on' : ''}"><div class="fr-l">${lab}</div><div class="fr-b">${it.head ? fit('p', 'fr-h', 26, b.max ?? 36, rich(it.head)) : ''}${it.t ? fit('p', 'fr-t', 21, 27, rich(it.t)) : ''}</div></div>`;
      }).join('')}</div>`;
      case 'grid': return `<div class="fz fgrid v-${b.variant ?? 'checker'}" style="${style}">${(b.items ?? []).map((it) => `<div class="fg">${icon(it.icon, 'fg-ic')}${it.head ? fit('p', 'fg-h', 28, b.max ?? 40, rich(it.head)) : ''}${it.t ? fit('p', 'fg-t', 21, 27, rich(it.t)) : ''}</div>`).join('')}</div>`;
      case 'panel': {
        const flow = (b.icons ?? []).map((id, i) => `${i ? '<span class="pn-ar"></span>' : ''}${icon(id, 'pn-ic')}`).join('');
        const list = (b.items ?? []).map((it) => `<li>${fit('p', 'pn-li', 24, 34, `${it.head ? `<b>${esc(it.head)}</b> <span class="pn-to">→</span> ` : ''}${rich(it.t ?? '')}`)}</li>`).join('');
        return `<div class="fz fpanel" style="${style}">${b.head ? `<p class="pn-head">${esc(b.head)}</p>` : ''}${flow ? `<div class="pn-flow">${flow}</div>` : ''}<ul class="pn-list">${list}</ul></div>`;
      }
    }
  }).join('');
  return `<div class="free">${parts}</div>`;
}

export function archetypeHtml(s: Slide, mascotHtml: (id?: string, cls?: string) => string): string | null {
  switch (s.layout) {
    case 'tips': return tips(s);
    case 'labels': return labels(s);
    case 'timeline': return timeline(s);
    case 'framework': return framework(s);
    case 'options': return options(s);
    case 'offer': return offer(s, mascotHtml(s.mascot, 'mascot-offer'));
    case 'compare': return compare(s);
    case 'comment': return comment(s, mascotHtml(s.mascot, 'mascot center'));
    case 'feature': return feature(s);
    case 'proof': return proof(s);
    case 'promo': return promo(s);
    case 'program': return program(s);
    case 'free': return free(s, mascotHtml);
    default: return null;
  }
}
