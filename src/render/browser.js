// Dijalankan di dalam halaman. Mengatur ukuran teks lalu mengukur hasilnya untuk QA.
window.__fitAndMeasure = async function () {
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));

  const fits = [...document.querySelectorAll('[data-fit]')];
  const main = document.querySelector('.main');
  const keeps = [...document.querySelectorAll('[data-keep]')];

  const overflowing = () => {
    if (main.scrollHeight > main.clientHeight + 1) return true;
    for (const k of keeps) if (k.getBoundingClientRect().height < Number(k.dataset.keep)) return true;
    for (const f of fits) if (f.scrollWidth > f.clientWidth + 1) return true;
    // Kotak yang menyusut mengikuti ruang tidak menaikkan scrollHeight .main, jadi dicek sendiri.
    for (const b of document.querySelectorAll('.item,.card,.tier,.cell,.point-card,.tcard,.lcard,.ccard,.fcard,.ocard,.notebox,.kcol,.cmt,.fstep,.mcard,.oitem,.tmini,.fcardx,.fbub,.fpanel,.fg,.ftile,.fcol,.fpunch,.ftip,.fstepx')) if (b.scrollHeight > b.clientHeight + 1) return true;
    return false;
  };
  const apply = (t) => {
    for (const f of fits) {
      const min = Number(f.dataset.min), max = Number(f.dataset.max);
      f.style.fontSize = Math.round(min + (max - min) * t) + 'px';
    }
  };

  // Teks tidak pernah dipotong: bila ukuran minimum tetap tidak muat, QA melaporkannya.
  let t = 1, fitted = false;
  for (; t >= 0; t -= 0.04) {
    apply(Math.max(t, 0));
    if (!overflowing()) { fitted = true; break; }
  }
  if (!fitted) apply(0);

  const rect = (r) => ({ x: r.left, y: r.top, w: r.width, h: r.height });
  const runs = [];
  const walker = document.createTreeWalker(document.querySelector('.safe'), NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode;
    if (!n.textContent.trim()) continue;
    const el = n.parentElement, cs = getComputedStyle(el);
    const range = document.createRange(); range.selectNodeContents(n);
    const block = el.closest('[data-fit],.cta,.pill,.fr-l,.pn-head,.nm,.qm,.fnum,.fbig-u,.fpillx span,.olist-t,.sticker,.tmini-n,.tmini-s,.tmini-p,.krow-l,.cmt-n,.cmt-m,.pname-n,.pname-r,.gband,.gshot-l,.ptier-n,.ptier-s,.ptier-p,.pnote,.fflow,.mtable td,.mtable th,.spill,.subpill,.punchpill,.lnum,.tmeta,.crange,.note-l,.fpill,.onum,.ocard-t,.ctabox-t,.ctabox-n,.eyebrow,.series,.punch,.cta-note,.footer,.tier,td,th,.card-title,.role,.note-text,.n') || el;
    if (!block.dataset.bid) block.dataset.bid = String(runs.length) + '-' + Math.random().toString(36).slice(2, 6);
    runs.push({
      text: n.textContent.trim().slice(0, 60), block: block.dataset.bid, color: cs.color,
      size: parseFloat(cs.fontSize), weight: cs.fontWeight, family: cs.fontFamily.split(',')[0].replace(/['"]/g, ''),
      strike: cs.textDecorationLine.includes('line-through') || !!el.closest('.ct-tag'), footer: !!el.closest('.footer'),
      rects: [...range.getClientRects()].map(rect),
    });
  }
  // Data untuk pemeriksaan jarak di src/qa/spacing.ts.
  const BOX = '.fcardx,.fpanel,.pn-head,.fpillx span,.ftile,.fcol,.ftip,.fstepx,.fbub,.fctag,.item,.card,.tier,.cell,.point-card,.tcard,.lcard,.ccard,.fcard,.ocard,.notebox,.kcol,.cmt,.fstep,.mcard,.oitem,.tmini';
  const painted = (e) => { const cs = getComputedStyle(e); return cs.backgroundImage !== 'none' || !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) || parseFloat(cs.borderTopWidth) > 0; };
  const layers = [...document.querySelectorAll('.fz')];
  const CONTAINER = '.fpanel,.fcardx,.ftile,.fcol,.ftip,.fstepx,.fctag';
  // Judul yang disusun dari pill bertumpuk atau angka besar berlabel memang sengaja rapat.
  const STACK = '.fpillx:not(.ribbon),.fbig,.title';
  const layer = (e) => { const f = e.closest('.fz'); return { z: f ? parseInt(getComputedStyle(f).zIndex, 10) || 0 : 0, ord: f ? layers.indexOf(f) : -1, container: !!f && f.matches(CONTAINER), stack: !!f && f.matches(STACK), title: f && f.matches('.title') ? layers.indexOf(f) : -1 }; };
  // Titik sampel: siapa yang paling atas di atas teks atau kotak. Bila maskot, catat posisi pikselnya untuk dicek alfanya.
  const hits = (r) => {
    const out = [];
    for (let i = 1; i <= 5; i++) for (let j = 1; j <= 3; j++) {
      const x = r.x + (r.w * i) / 6, y = r.y + (r.h * j) / 4;
      const el = document.elementFromPoint(x, y);
      if (!el || !el.classList.contains('fmas-i')) continue;
      const q = el.getBoundingClientRect(), k = Math.min(q.width / el.naturalWidth, q.height / el.naturalHeight), w = el.naturalWidth * k, h = el.naturalHeight * k;
      const dx = q.left + (q.width - w) / 2, dy = q.top + q.height - h;
      const cs = getComputedStyle(el), masked = (cs.maskImage || cs.webkitMaskImage || 'none') !== 'none';
      const u = (x - dx) / w, v = (y - dy) / h;
      if (u >= 0 && u <= 1 && v >= 0 && v <= 1) out.push({ asset: el.dataset.asset || '', u, v, masked });
    }
    return out;
  };
  const boxEls = [...document.querySelectorAll(BOX)].filter((e) => painted(e) && e.getBoundingClientRect().width > 0);
  const innerBox = (e) => { let best = -1, area = Infinity; boxEls.forEach((b, i) => { if (b === e || b.contains(e)) { const r = b.getBoundingClientRect(); if (r.width * r.height < area) { area = r.width * r.height; best = i; } } }); return best; };
  const space = {
    boxes: boxEls.map((e) => ({ name: e.textContent.trim().replace(/\s+/g, ' ') || e.className, rect: rect(e.getBoundingClientRect()), ...layer(e), ribbon: !!e.closest('.ribbon'), parent: e.parentElement ? innerBox(e.parentElement) : -1, group: e.classList.contains('fcardx') ? 'kartu' : '', hits: hits(rect(e.getBoundingClientRect())) })),
    texts: [...document.querySelectorAll('.safe [data-bid]')].filter((e) => !e.closest('.footer,.ct-tag') && e.textContent.trim()).map((e) => {
      const range = document.createRange(); range.selectNodeContents(e);
      const rs = [...range.getClientRects()].filter((r) => r.width > 0);
      if (!rs.length) return null;
      const x = Math.min(...rs.map((r) => r.left)), y = Math.min(...rs.map((r) => r.top));
      const box = { x, y, w: Math.max(...rs.map((r) => r.right)) - x, h: Math.max(...rs.map((r) => r.bottom)) - y };
      return { text: e.textContent.trim().replace(/\s+/g, ' '), size: parseFloat(getComputedStyle(e).fontSize), rect: box, ...layer(e), boxes: boxEls.flatMap((b, i) => (b === e || b.contains(e) ? [i] : [])), inner: innerBox(e), hits: hits(box) };
    }).filter(Boolean),
    stacks: [...document.querySelectorAll('.frows,.pn-list')].map((e) => [...e.children].map((c) => { const g = document.createRange(); g.selectNodeContents(c.querySelector('.fr-b') || c); return rect(g.getBoundingClientRect()); })),
    imgs: [...document.querySelectorAll('.main img:not(.fmas-i):not(.ct-hand):not(.ct-spark)')].filter((i) => i.getBoundingClientRect().width > 0).map((i) => ({ rect: rect(i.getBoundingClientRect()), inner: innerBox(i) })),
    mascots: [...document.querySelectorAll('.fmas-i')].map((e) => {
      const r = e.getBoundingClientRect(), k = Math.min(r.width / e.naturalWidth, r.height / e.naturalHeight), w = e.naturalWidth * k, h = e.naturalHeight * k;
      return { asset: e.dataset.asset || '', rect: { x: r.left + (r.width - w) / 2, y: r.top + r.height - h, w, h }, ...layer(e) };
    }).filter((m) => m.asset.startsWith('assets/')),
  };
  const logo = document.querySelector('.logo');
  return {
    fitted, scale: Math.max(t, 0), runs,
    logo: logo ? { ...rect(logo.getBoundingClientRect()), ok: logo.naturalWidth > 0 } : null,
    safe: rect(document.querySelector('.safe').getBoundingClientRect()),
    images: [...document.querySelectorAll('img')].map((i) => ({ asset: i.dataset.asset || i.className, ok: i.naturalWidth > 0, w: i.naturalWidth, h: i.naturalHeight, shown: rect(i.getBoundingClientRect()) })),
    fontsLoaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/['"]/g, '') + ':' + f.weight),
    ctaCount: document.querySelectorAll('[data-role=cta]').length,
    space,
    lines: [...document.querySelectorAll('.title,.ftext,.fr-t,.pn-li')].map((e) => { const cs = getComputedStyle(e); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2; return { kind: e.classList.contains('title') ? 'title' : e.classList.contains('ftext') ? 'text' : 'list', n: Math.round(e.getBoundingClientRect().height / lh) }; }),
  };
};
