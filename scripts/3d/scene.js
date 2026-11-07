// Aset 3D clay buatan sendiri (Three.js). Warna dari palet brand, teks bisa ditulis di permukaan objek.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const S = 1400;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setSize(S, S); renderer.setClearColor(0, 0);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const env = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;

let P, dark, ink, acc, paper, soft, red, gold;
const M = (c, r = 0.5, cc = 0.3) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, clearcoat: cc, clearcoatRoughness: 0.5, envMapIntensity: 0.32 });
function palette(p) { P = p; gold = M(p.gold ?? p.acc, 0.34, 0.3); if (p.gold) { gold.metalness = 0.6; gold.envMapIntensity = 1.1; } ink = M(p.dark, 0.5, 0.2); dark = M(p.body ?? p.dark, 0.5, 0.2); if (p.body) { dark.metalness = 0.55; dark.roughness = 0.36; dark.envMapIntensity = 1.1; } acc = M(p.acc, 0.42, 0.25); if (p.metal) { acc.metalness = Number(p.metal); acc.roughness = 0.34; acc.envMapIntensity = 1.1; } paper = M(p.paper, 0.68, 0.1); soft = M(p.soft, 0.6, 0.15); red = M(p.red ?? '#D8392B', 0.45, 0.3); }

const at = (m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); return m; };
const mesh = (g, m) => { const o = new THREE.Mesh(g, m); o.castShadow = o.receiveShadow = true; return o; };
const grp = (...c) => { const g = new THREE.Group(); c.forEach((x) => g.add(x)); return g; };
const box = (w, h, d, r, m) => mesh(new RoundedBoxGeometry(w, h, d, 8, Math.min(r, w / 2.01, h / 2.01, d / 2.01)), m);
const ball = (r, m) => mesh(new THREE.SphereGeometry(r, 64, 48), m);
const torus = (R, r, m, arc = Math.PI * 2) => mesh(new THREE.TorusGeometry(R, r, 32, 128, arc), m);
/** Silinder dengan tepi membulat. */
function disc(R, h, m, b = 0.06) {
  const p = [new THREE.Vector2(0.0001, -h / 2), new THREE.Vector2(R - b, -h / 2)];
  for (let i = 1; i <= 8; i++) { const a = -Math.PI / 2 + (Math.PI / 2) * (i / 8); p.push(new THREE.Vector2(R - b + b * Math.cos(a), -h / 2 + b + b * Math.sin(a))); }
  for (let i = 0; i <= 8; i++) { const a = (Math.PI / 2) * (i / 8); p.push(new THREE.Vector2(R - b + b * Math.cos(a), h / 2 - b + b * Math.sin(a))); }
  p.push(new THREE.Vector2(0.0001, h / 2));
  return mesh(new THREE.LatheGeometry(p, 96), m);
}
function rr(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
const ext = (shape, d, m, b = 0.1) => { const g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 10, curveSegments: 48 }); g.center(); return mesh(g, m); };
/** Teks atau gambar di permukaan objek. */
function label(w, h, draw) {
  const k = 512 / Math.max(w, h), c = document.createElement('canvas'); c.width = Math.round(w * k * 2); c.height = Math.round(h * k * 2);
  const x = c.getContext('2d'); x.scale(k * 2, k * 2); draw(x, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.6 }));
}
const write = (txt, color, size, w, h) => (x) => { x.fillStyle = color; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `800 ${size}px Montserrat, 'Yu Gothic', 'Meiryo'`; x.fillText(txt, w / 2, h / 2 + size * 0.04); };
const text = (t, w, h, size, color) => label(w, h, write(t, color, size, w, h));

function bubble(t, w = 3, h = 2.1, mat = acc, inkc) {
  const s = rr(w, h, 0.62), tail = new THREE.Shape();
  tail.moveTo(-w * 0.26, -h / 2 + 0.1); tail.lineTo(-w * 0.34, -h / 2 - 0.62); tail.quadraticCurveTo(-w * 0.1, -h / 2 - 0.3, w * 0.02, -h / 2 + 0.1); tail.closePath();
  const g = grp(ext(s, 0.34, mat, 0.16), at(ext(tail, 0.34, mat, 0.12), -w * 0.17, -h / 2 - 0.16, 0));
  if (t) g.add(at(text(t, w * 0.92, h * 0.8, Math.min(h * 0.44, (w * 0.84) / (t.length * 0.66)), inkc ?? P.onacc ?? P.dark), 0, 0, 0.345));
  return g;
}
function book(w, t, d, cover, pages = paper) {
  return grp(at(box(w, 0.1, d, 0.05, cover), 0, -t / 2, 0), at(box(w, 0.1, d, 0.05, cover), 0, t / 2, 0), at(box(w - 0.14, t - 0.06, d - 0.14, 0.03, pages), 0.05, 0, 0), at(box(0.16, t + 0.1, d, 0.07, cover), -w / 2 + 0.06, 0, 0));
}
function coin(R = 1, h = 0.26) {
  const g = grp(disc(R, h, acc, 0.07), at(torus(R * 0.8, 0.035, acc), 0, h / 2, 0, Math.PI / 2));
  g.add(at(text(P.cur ?? '€', R * 1.3, R * 1.3, R * 0.95, P.onacc ?? P.dark), 0, h / 2 + 0.006, 0, -Math.PI / 2));
  return g;
}
function cert(t) {
  const g = grp(box(2.5, 3.1, 0.24, 0.26, acc), at(box(2.16, 2.76, 0.1, 0.16, paper), 0, 0, 0.1));
  g.add(at(text(t, 2.1, 1.1, 0.92, P.dark), 0, 0.62, 0.16));
  g.add(at(box(1.5, 0.11, 0.03, 0.02, soft), 0, -0.1, 0.16), at(box(1.1, 0.11, 0.03, 0.02, soft), -0.2, -0.38, 0.16));
  g.add(at(disc(0.42, 0.12, acc, 0.04), 0.56, -0.86, 0.2, Math.PI / 2));
  return g;
}
function target(R = 1.5) {
  const g = grp();
  [[R, acc], [R * 0.76, paper], [R * 0.52, acc], [R * 0.28, ink]].forEach(([r, m], i) => g.add(at(disc(r, 0.2, m, 0.06), 0, 0, i * 0.075, Math.PI / 2)));
  const dart = grp(at(mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.9, 24), ink), 0, 0.95, 0), at(mesh(new THREE.ConeGeometry(0.06, 0.3, 24), ink), 0, -0.14, 0, Math.PI));
  for (let i = 0; i < 3; i++) dart.add(at(box(0.44, 0.62, 0.05, 0.03, ink), 0, 1.74, 0, 0, (i * Math.PI) / 3, 0));
  g.add(at(dart, 0.06, 0.06, 0.34, 1.02, 0, -0.62));
  return g;
}

function tri(w, h = w) { const s = new THREE.Shape(); s.moveTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(0, h / 2); s.closePath(); return s; }
function check(k, m = acc) { const s = new THREE.Shape(); s.moveTo(-1, 0); s.lineTo(-0.66, 0.34); s.lineTo(-0.3, -0.04); s.lineTo(0.66, 0.92); s.lineTo(1, 0.56); s.lineTo(-0.3, -0.72); s.closePath(); const o = ext(s, 0.06, m, 0.03); o.scale.set(k, k, 1); return o; }

const A = {
  'deutsch-cap'() {
    const b = book(4.2, 1.0, 2.8, acc);
    const spine = at(box(4.25, 1.16, 0.22, 0.1, paper), 0, 0, 1.4);
    const lab = at(text(P.book ?? 'Deutsch', 3, 0.9, 0.64, P.dark), -0.42, 0, 1.52);
    const flag = P.book ? grp(box(0.74, 1.1, 0.06, 0.03, M('#FFFFFF', 0.6, 0.1)), at(disc(0.26, 0.05, red, 0.02), 0, 0, 0.04, Math.PI / 2)) : grp(at(box(0.62, 0.38, 0.06, 0.02, ink), 0, 0.38, 0), at(box(0.62, 0.38, 0.06, 0.02, red), 0, 0, 0), at(box(0.62, 0.38, 0.06, 0.02, acc), 0, -0.38, 0));
    const skull = at(disc(1.02, 0.72, dark, 0.1), 0, 0.98, 0);
    const board = at(box(3.1, 0.14, 3.1, 0.06, dark), 0, 1.4, 0, 0, Math.PI / 4, 0);
    const btn = at(disc(0.16, 0.1, acc, 0.04), 0, 1.5, 0);
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(0.9, 1.5, 0.55), new THREE.Vector3(1.42, 1.28, 0.9), new THREE.Vector3(1.48, 1.08, 0.95)]);
    const cord = mesh(new THREE.TubeGeometry(curve, 48, 0.055, 16), acc);
    const tas = at(box(0.26, 0.42, 0.26, 0.1, acc), 1.48, 0.9, 0.95);
    return grp(b, spine, lab, at(flag, 1.74, 0, 1.53), at(grp(skull, board, btn, cord, tas), -0.1, -0.06, -0.1));
  },
  'bubble-der': () => bubble('der?'),
  'bubble-die': () => bubble('die?'),
  'bubble-das': () => bubble('das?'),
  'bubble-b1': () => bubble('B1?'),
  'bubble-b2': () => bubble('B2?'),
  'bubble-ausbildung': () => bubble('Ausbildung?', 5.4, 2.1),
  'bubble-kuliah': () => bubble('Kuliah?', 3.8, 2.1),
  'bubble-kerja': () => bubble('Kerja?', 3.4, 2.1),
  'bubble-berapa': () => bubble('Berapa?', 4, 2.1),
  'bubble-aeh': () => bubble('Äh...', 3.4, 2.1),
  'bubble-sendiri': () => bubble('Sendirian?', 4.8, 2.1),
  'bubble-gagal': () => bubble('Kalau gagal?', 5.2, 2.1),
  books() {
    const a = at(book(3.8, 0.72, 2.6, dark), 0, -0.86, 0, 0, 0.08, 0), b = at(book(3.5, 0.62, 2.4, acc), 0.14, -0.1, 0, 0, -0.12, 0), c = at(book(3.2, 0.56, 2.2, dark), -0.08, 0.56, 0, 0, 0.2, 0);
    return grp(a, b, c);
  },
  briefcase() {
    const h = at(torus(0.62, 0.11, acc, Math.PI), 0, 1.16, 0);
    return grp(box(3.8, 2.5, 1.2, 0.34, dark), h, at(box(3.84, 0.1, 1.24, 0.04, M(P.dark, 0.7, 0)), 0, 0.26, 0), at(box(0.72, 0.56, 0.2, 0.1, acc), 0, 0.2, 0.62));
  },
  building() {
    const g = grp(box(2.1, 4.2, 1.6, 0.14, dark), at(box(1.9, 2.6, 1.6, 0.14, paper), 1.9, -0.8, 0.1));
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) g.add(at(box(0.36, 0.42, 0.1, 0.06, acc), -0.56 + c * 0.56, 1.5 - r * 0.72, 0.8));
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) g.add(at(box(0.44, 0.44, 0.1, 0.06, acc), 1.56 + c * 0.68, -0.05 - r * 0.72, 0.9));
    return g;
  },
  magnifier() {
    return grp(at(torus(1.25, 0.24, acc), 0, 0, 0), at(disc(1.14, 0.06, M(P.paper, 0.2, 0.6), 0.02), 0, 0, 0, Math.PI / 2), at(box(0.42, 2.1, 0.42, 0.2, dark), 1.62, -1.62, 0, 0, 0, Math.PI / 4));
  },
  clipboard() {
    const g = grp(box(3, 3.9, 0.24, 0.26, acc), at(box(2.54, 3.34, 0.1, 0.1, paper), 0, -0.1, 0.12), at(box(1.3, 0.56, 0.3, 0.14, dark), 0, 1.86, 0.16));
    for (let i = 0; i < 3; i++) { g.add(at(box(0.44, 0.44, 0.12, 0.08, i === 2 ? soft : acc), -0.82, 0.86 - i * 1, 0.2)); if (i < 2) g.add(at(check(0.17, ink), -0.82, 0.86 - i * 1, 0.3)); g.add(at(box(1.3, 0.14, 0.05, 0.03, ink), 0.3, 0.86 - i * 1, 0.18)); }
    return g;
  },
  bars() {
    const g = grp(); [1.1, 1.9, 2.8, 3.9].forEach((h, i) => g.add(at(box(0.92, h, 0.92, 0.12, i === 3 ? acc : i === 0 ? dark : acc), -1.6 + i * 1.08, h / 2 - 2, 0)));
    return g;
  },
  calendar() {
    const g = grp(box(3.5, 3.3, 0.42, 0.3, paper), at(box(3.5, 0.92, 0.46, 0.26, acc), 0, 1.2, 0.02));
    [-1, 1].forEach((s) => g.add(at(box(0.24, 0.84, 0.24, 0.12, dark), s * 0.92, 1.64, 0.2)));
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) g.add(at(box(0.5, 0.5, 0.1, 0.1, r === 1 && c === 2 ? ink : r === 2 && c === 0 ? acc : soft), -1.08 + c * 0.72, 0.28 - r * 0.68, 0.24));
    return g;
  },
  contract() {
    const g = grp(box(2.9, 3.8, 0.12, 0.08, paper));
    [1.28, 0.86, 0.44, 0.02].forEach((y, i) => g.add(at(box(i % 2 ? 1.5 : 2.1, 0.12, 0.04, 0.02, soft), i % 2 ? -0.3 : 0, y, 0.07)));
    g.add(at(box(2.1, 0.06, 0.04, 0.02, ink), 0, -1.2, 0.07), at(disc(0.42, 0.12, acc, 0.04), 0.82, -0.6, 0.1, Math.PI / 2));
    const pen = grp(at(disc(0.12, 2.6, dark, 0.05), 0, 0.3, 0), at(mesh(new THREE.ConeGeometry(0.12, 0.42, 32), acc), 0, -1.2, 0, Math.PI), at(disc(0.13, 0.3, acc, 0.03), 0, 1.3, 0));
    g.add(at(pen, 1.4, -0.2, 0.5, 0.1, 0, -0.5));
    return g;
  },
  mic() {
    const head = box(1.5, 2.5, 1.5, 0.74, dark), g = grp(at(head, 0, 0.9, 0), at(disc(0.8, 0.14, acc, 0.05), 0, 0.42, 0));
    [1.1, 1.42, 1.74].forEach((y) => g.add(at(box(1.1, 0.07, 0.05, 0.02, acc), 0, y, 0.76)));
    g.add(at(torus(1.14, 0.1, acc, Math.PI), 0, 0.5, 0, 0, 0, Math.PI), at(disc(0.1, 0.8, acc, 0.03), 0, -1, 0), at(disc(0.96, 0.2, dark, 0.08), 0, -1.42, 0));
    return g;
  },
  chat() {
    const a = at(bubble('', 3.3, 2.2, dark), -0.5, 0.7, -0.5), b = at(bubble('', 3, 1.9, acc), 0.75, -0.72, 0.3);
    b.rotation.y = Math.PI; b.children.forEach((c) => (c.rotation.y = 0));
    const g = grp(a, at(grp(bubble('', 3, 1.9, acc)), 0.75, -0.72, 0.3));
    [-0.7, 0, 0.7].forEach((x) => g.add(at(ball(0.2, P.body ? ink : paper), -0.5 + x, 0.7, -0.14)));
    [0.9, 0.55].forEach((w, i) => g.add(at(box(2 * w, 0.14, 0.05, 0.03, ink), 0.75 - (i ? 0.3 : 0), -0.52 - i * 0.4, 0.66)));
    return g;
  },
  memo() {
    const g = grp(box(2.9, 3.5, 0.14, 0.12, paper), at(box(2.9, 0.62, 0.2, 0.1, acc), 0, 1.44, 0.02));
    [0.56, 0.08, -0.4, -0.88].forEach((y, i) => g.add(at(box(i === 3 ? 1.3 : 2.1, 0.13, 0.04, 0.02, i % 2 ? soft : ink), i === 3 ? -0.4 : 0, y, 0.08)));
    const pen = grp(at(disc(0.14, 2.8, acc, 0.04), 0, 0, 0), at(mesh(new THREE.ConeGeometry(0.14, 0.42, 32), dark), 0, -1.6, 0, Math.PI), at(disc(0.15, 0.3, dark, 0.04), 0, 1.5, 0));
    g.add(at(pen, 1.2, -0.3, 0.52, 0.08, 0, -0.42));
    return g;
  },
  video() {
    const g = grp(box(3.3, 2.3, 1.5, 0.34, dark), at(disc(0.86, 0.3, acc, 0.08), -0.1, 0, 0.86, Math.PI / 2), at(disc(0.56, 0.34, dark, 0.08), -0.1, 0, 0.92, Math.PI / 2), at(ball(0.2, paper), -0.28, 0.2, 1.05));
    const lens = ext(tri(1.2), 0.5, acc, 0.1); g.add(at(lens, 2.2, 0, 0.1), at(ball(0.13, red), 1.2, 0.8, 0.78));
    return g;
  },
  compass() {
    const g = grp(at(disc(1.9, 0.36, acc, 0.12), 0, 0, 0, Math.PI / 2), at(disc(1.5, 0.1, paper, 0.03), 0, 0, 0.17, Math.PI / 2), at(disc(0.26, 0.2, acc, 0.04), 0, 2.06, 0));
    const need = (m, s) => at(ext(tri(0.86), 0.06, m, 0.03), 0, 0, 0.3);
    const a = need(red), b = need(ink); a.scale.set(0.4, 1.15, 1); b.scale.set(0.4, 1.15, 1);
    return grp(g, at(grp(at(a, 0, 0.5, 0, 0, 0, 0), at(b, 0, -0.5, 0, 0, 0, Math.PI)), 0, 0, 0.32, 0, 0, -0.6), at(disc(0.14, 0.1, acc, 0.03), 0, 0, 0.42, Math.PI / 2));
  },
  shield() {
    const s = new THREE.Shape(); s.moveTo(0, 1.9); s.quadraticCurveTo(0.8, 1.56, 1.6, 1.5); s.quadraticCurveTo(1.74, 0.1, 1.2, -0.8); s.quadraticCurveTo(0.76, -1.5, 0, -2); s.quadraticCurveTo(-0.76, -1.5, -1.2, -0.8); s.quadraticCurveTo(-1.74, 0.1, -1.6, 1.5); s.quadraticCurveTo(-0.8, 1.56, 0, 1.9);
    const inner = at(ext(s, 0.12, ink, 0.06), 0, 0, 0.3); inner.scale.set(0.84, 0.84, 1);
    return grp(ext(s, 0.42, acc, 0.14), inner, at(check(1.05), 0, 0, 0.52));
  },
  alarm() {
    const g = grp(at(disc(1.72, 0.5, acc, 0.14), 0, 0, 0, Math.PI / 2), at(disc(1.4, 0.1, paper, 0.03), 0, 0, 0.25, Math.PI / 2));
    g.add(at(box(0.14, 0.92, 0.07, 0.05, ink), 0, 0.42, 0.34), at(box(0.14, 0.72, 0.07, 0.05, ink), 0.3, -0.16, 0.34, 0, 0, -2.2), at(disc(0.14, 0.08, ink, 0.03), 0, 0, 0.36, Math.PI / 2));
    [-1, 1].forEach((s) => g.add(at(ball(0.56, dark), s * 1.16, 1.5, 0), at(box(0.22, 0.56, 0.22, 0.1, dark), s * 1, -1.82, 0, 0, 0, s * 0.5)));
    return g;
  },
  headset() {
    const g = grp(at(torus(1.76, 0.17, dark, Math.PI), 0, 0, 0));
    [-1, 1].forEach((s) => g.add(at(disc(0.82, 0.5, acc, 0.14), s * 1.76, -0.3, 0, 0, 0, Math.PI / 2), at(disc(0.6, 0.2, dark, 0.06), s * 1.5, -0.3, 0, 0, 0, Math.PI / 2)));
    return g;
  },
  tablet() {
    const g = grp(box(3.3, 4.2, 0.24, 0.3, dark), at(box(2.9, 3.76, 0.05, 0.1, paper), 0, 0, 0.12));
    [0.8, 1.3, 1, 1.7].forEach((h, i) => g.add(at(box(0.44, h, 0.1, 0.08, i === 3 ? acc : acc), -0.87 + i * 0.58, 0.24 + h / 2 - 1.1 + 0.66, 0.18)));
    g.add(at(box(2.3, 0.2, 0.06, 0.05, soft), 0, -1.2, 0.17), at(box(1.4, 0.2, 0.08, 0.05, acc), -0.45, -1.2, 0.19));
    return g;
  },
  house() {
    const roof = ext(tri(2.4, 1.5), 1.9, acc, 0.12);
    return grp(box(3, 2.2, 2, 0.14, paper), at(roof, 0, 1.76, 0), at(box(0.78, 1.3, 0.1, 0.1, dark), -0.56, -0.44, 1.02), at(box(0.72, 0.72, 0.1, 0.08, acc), 0.72, 0.1, 1.02));
  },
  bulb() {
    const glassM = P.gold ? gold : acc;
    const pts = [];
    for (let k = 0; k <= 40; k++) { const a = -Math.PI / 2 + (Math.PI * 1.32) * (k / 40); pts.push(new THREE.Vector2(Math.max(0.0001, 1.45 * Math.cos(a)), 0.9 + 1.45 * Math.sin(a))); }
    pts.reverse(); pts.push(new THREE.Vector2(0.62, -0.5));
    const neckPts = [new THREE.Vector2(0.62, -0.5), new THREE.Vector2(0.62, -0.62)];
    const glass = mesh(new THREE.LatheGeometry([new THREE.Vector2(0.0001, 2.35), ...pts.filter((v) => v.y < 2.34), ...neckPts], 96), glassM);
    const g = grp(glass, at(disc(0.66, 0.24, soft, 0.06), 0, -0.74, 0), at(disc(0.62, 0.2, ink, 0.05), 0, -0.96, 0), at(disc(0.58, 0.2, soft, 0.05), 0, -1.16, 0), at(disc(0.34, 0.24, ink, 0.08), 0, -1.38, 0));
    [-60, -30, 0, 30, 60].forEach((d) => { const a = (d * Math.PI) / 180; g.add(at(box(0.22, 0.62, 0.22, 0.1, glassM), Math.sin(a) * 2.3, 0.95 + Math.cos(a) * 2.3, 0, 0, 0, -a)); });
    return g;
  },
  roll() {
    const b = ball(1.8, acc); b.scale.set(1.3, 0.74, 0.92);
    const g = grp(b); [-1, 0, 1].forEach((x) => g.add(at(box(0.3, 1.2, 0.34, 0.14, paper), x * 0.92, 0.72, 1.36 - Math.abs(x) * 0.2, -0.86, x * 0.3, 0.3)));
    return g;
  },
  target: () => target(1.6),
  campus() {
    const g = grp(at(box(5.6, 0.22, 2.9, 0.06, paper), 0, -1.7, 0), at(box(5.1, 0.22, 2.6, 0.06, paper), 0, -1.48, 0), at(box(4.3, 2.3, 1.5, 0.08, dark), 0, -0.2, -0.3));
    [-2, -1, 0, 1, 2].forEach((x) => g.add(at(disc(0.21, 2.34, paper, 0.04), x * 0.98, -0.2, 0.86)));
    g.add(at(box(5.2, 0.34, 2.4, 0.07, acc), 0, 1.12, 0.1), at(ext(tri(5, 1.2), 2, acc, 0.07), 0, 1.92, 0.1), at(disc(0.3, 0.1, paper, 0.03), 0, 1.84, 1.26, Math.PI / 2), at(box(0.7, 1.3, 0.08, 0.05, ink), 0, -0.72, 0.46));
    return g;
  },
  passport() {
    const page = at(box(2.6, 3.5, 0.12, 0.08, paper), 0.86, 0.12, -0.22, 0, 0, -0.08);
    const stamp = at(text('VISA', 1.5, 0.6, 0.46, P.dark), 1.76, 0.16, -0.15, 0, 0, Math.PI / 2 - 0.08);
    const g = grp(page, stamp, box(2.7, 3.6, 0.32, 0.18, acc), at(disc(0.66, 0.08, paper, 0.03), 0, 0.44, 0.17, Math.PI / 2), at(disc(0.34, 0.1, acc, 0.03), 0, 0.44, 0.2, Math.PI / 2));
    g.add(at(text('PASPOR', 2.3, 0.6, 0.38, P.paper), 0, -0.78, 0.17));
    return g;
  },
  lock() {
    const g = grp(at(torus(0.92, 0.2, dark, Math.PI), 0, 0.92, 0), at(disc(0.2, 0.6, dark, 0.05), -0.92, 0.72, 0), at(disc(0.2, 0.6, dark, 0.05), 0.92, 0.72, 0), at(box(3, 2.5, 1, 0.3, acc), 0, -0.62, 0));
    g.add(at(disc(0.3, 0.1, ink, 0.03), 0, -0.42, 0.51, Math.PI / 2), at(box(0.2, 0.62, 0.1, 0.05, ink), 0, -0.84, 0.51));
    return g;
  },
  'bubble-30': () => bubble('30 menit', 4.2, 2.1),
  'bubble-cukup': () => bubble('Cukup?', 3.8, 2.1),
  'bubble-ohayou': () => bubble('おはよう', 4.2, 2.1),
  'bubble-yoroshiku': () => bubble('よろしく', 4.2, 2.1),
  'bubble-grup': () => bubble('Grup?', 3.2, 2.1),
  'bubble-private': () => bubble('Private?', 4, 2.1),
  torii() {
    const g = grp(at(disc(0.26, 4, acc, 0.05), -1.7, 0, 0), at(disc(0.26, 4, acc, 0.05), 1.7, 0, 0), at(box(4.6, 0.3, 0.42, 0.08, acc), 0, 1.06, 0), at(box(5.6, 0.34, 0.6, 0.1, acc), 0, 1.66, 0), at(box(6.1, 0.24, 0.72, 0.1, ink), 0, 1.92, 0), at(box(0.4, 0.5, 0.26, 0.05, acc), 0, 1.34, 0));
    [-1.7, 1.7].forEach((x) => g.add(at(disc(0.34, 0.36, ink, 0.06), x, -1.86, 0)));
    return g;
  },
  'flag-jp'() {
    const cloth = at(box(3.2, 2.1, 0.08, 0.04, M('#FFFFFF', 0.6, 0.1)), 1.7, 1.2, 0, 0, 0, -0.04);
    return grp(at(disc(0.09, 5, soft, 0.03), 0, 0, 0), at(ball(0.18, soft), 0, 2.56, 0), cloth, at(disc(0.62, 0.06, acc, 0.02), 1.7, 1.2, 0.05, Math.PI / 2));
  },
  'free-sign'() {
    const b = box(4, 2.1, 0.3, 0.2, gold), g = grp(b, at(text('FREE', 3.4, 1.4, 1.02, '#FFFFFF'), 0, 0, 0.16));
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(-1.5, 1, 0), new THREE.Vector3(0, 2.1, 0), new THREE.Vector3(1.5, 1, 0)], false, 'catmullrom', 0);
    g.add(mesh(new THREE.TubeGeometry(c, 24, 0.05, 12), ink), at(ball(0.16, ink), 0, 2.14, 0));
    return g;
  },
  bonus() {
    const g = grp(at(disc(2, 0.3, acc, 0.1), 0, 0, 0, Math.PI / 2));
    g.add(at(text('BONUS', 3.4, 1.2, 0.92, '#FFFFFF'), 0, 0, 0.17, 0, 0, 0.14));
    return g;
  },
  lantern() {
    const body = ball(1.5, acc); body.scale.set(1, 0.86, 1);
    const g = grp(body, at(disc(0.8, 0.3, gold, 0.08), 0, 1.32, 0), at(disc(0.8, 0.3, gold, 0.08), 0, -1.32, 0), at(disc(0.08, 1.6, ink, 0.02), 0, 2.2, 0));
    [0, 60, 120].forEach((d) => g.add(at(torus(1.5, 0.04, gold), 0, 0, 0, 0, (d * Math.PI) / 180, 0)));
    g.children.slice(-3).forEach((r) => r.scale.set(1, 0.86, 1));
    g.add(at(disc(0.14, 0.5, gold, 0.04), 0, -1.7, 0), at(mesh(new THREE.ConeGeometry(0.3, 1.1, 24), red), 0, -2.45, 0, Math.PI));
    return g;
  },
  'phone-chat'() {
    const g = grp(box(2.4, 4.4, 0.3, 0.34, ink), at(box(2.08, 3.9, 0.06, 0.16, paper), 0, -0.05, 0.15));
    const bub = (w, x, y, m) => at(box(w, 0.56, 0.12, 0.2, m), x, y, 0.22);
    g.add(bub(1.4, -0.22, 1.2, soft), bub(1.3, 0.28, 0.42, acc), bub(1.5, -0.14, -0.36, soft), bub(1.0, 0.44, -1.14, acc));
    g.add(at(text('收到', 1, 0.5, 0.34, P.onacc ?? '#fff'), 0.44, -1.14, 0.29));
    return g;
  },
  'hand-point'() {
    const skinM = M(P.skin ?? '#F2C39B', 0.55, 0.15);
    const g = grp(box(1.7, 1.5, 1.1, 0.5, skinM), at(box(0.46, 1.9, 0.46, 0.23, skinM), -0.42, 1.4, 0.18), at(box(0.42, 0.9, 0.42, 0.2, skinM), -0.98, 0.15, 0.2, 0, 0, 0.7));
    [0, 0.42].forEach((x) => g.add(at(box(0.44, 0.62, 0.5, 0.22, skinM), 0.02 + x, 0.62, 0.3, 0.5, 0, 0)));
    g.add(at(box(1.9, 0.6, 1.3, 0.24, P.gold ? gold : acc), 0.05, -0.95, 0));
    [-50, -18, 18].forEach((d) => { const a = (d * Math.PI) / 180; g.add(at(box(0.16, 0.5, 0.16, 0.08, P.gold ? gold : acc), -0.42 + Math.sin(a) * 1.25, 2.45 + Math.cos(a) * 0.9, 0.2, 0, 0, -a)); });
    return g;
  },
  'bubble-shoudao': () => bubble('收到', 3.4, 2.1),
  'bubble-haode': () => bubble('好的', 3.4, 2.1),
  'bubble-nin': () => bubble('您', 2.6, 2.1),
  'bubble-mingbai': () => bubble('明白了', 4, 2.1),
  'bubble-shaodeng': () => bubble('稍等一下', 4.8, 2.1),
  'bubble-zaishuo': () => bubble('再说一遍?', 5, 2.1),
  'bubble-man': () => bubble('慢一点', 4, 2.1),
  'cert-target'() { return grp(at(cert(P.certA ?? 'B1'), -1.55, 0, 0, 0, 0.1, 0.12), at(cert(P.certB ?? 'B2'), 1.55, 0.22, -0.12, 0, -0.1, -0.08), at(target(1.1), 0, -0.86, 0.5)); },
  coins() {
    const g = grp(); [0, 1, 2, 3].forEach((i) => g.add(at(coin(1.05), (i % 2) * 0.07 - 0.9, -1 + i * 0.28, 0, 0, i)));
    [0, 1].forEach((i) => g.add(at(coin(1.05), 0.95 + i * 0.05, -1 + i * 0.28, 0.5, 0, i * 2)));
    g.add(at(coin(1.2), 0.2, 0.25, 1.2, Math.PI / 2 - 0.2, 0, 0.1)); return g;
  },
};

window.__names = Object.keys(A);
window.__render = (name, pal) => {
  palette(pal);
  const scene = new THREE.Scene(); scene.environment = env;
  const obj = A[name](); const pivot = grp(obj); pivot.rotation.set(0.26, -0.42, 0); scene.add(pivot); pivot.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(pivot), c = b.getCenter(new THREE.Vector3()), sz = b.getSize(new THREE.Vector3());
  pivot.position.sub(c);
  const cam = new THREE.PerspectiveCamera(22, 1, 0.1, 200), R = Math.max(sz.x, sz.y) * 0.56;
  cam.position.set(0, 0, R / Math.tan((22 / 2) * Math.PI / 180) + sz.z / 2); cam.lookAt(0, 0, 0);
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-5, 9, 8); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 9; key.shadow.bias = -0.0006; key.shadow.normalBias = 0.02;
  const k = Math.max(sz.x, sz.y, sz.z); Object.assign(key.shadow.camera, { left: -k, right: k, top: k, bottom: -k, near: 0.1, far: 60 });
  const fill = new THREE.DirectionalLight(0xfff2d6, 0.5); fill.position.set(6, 1, 5);
  scene.add(key, fill, new THREE.HemisphereLight(0xffffff, 0x8a7a55, 0.22));
  renderer.render(scene, cam);
  return renderer.domElement.toDataURL('image/png');
};
