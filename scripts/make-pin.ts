// Merender ikon pin lokasi 3D sendiri (Three.js, netral/abu) supaya bisa diwarnai sesuai brand. Hasil: assets/icons/custom/pin.png
import fs from 'node:fs';
import { build } from 'esbuild';
import { chromium } from 'playwright';

const entry = `
import * as THREE from 'three';
const S = 1024;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setSize(S, S); renderer.setClearColor(0, 0); renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 50); cam.position.set(1.2, 0.5, 7.6); cam.lookAt(0, 0.05, 0);
const mat = new THREE.MeshPhysicalMaterial({ color: 0xb8b8b8, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.25 });
// Profil tetes (piriform): ujung runcing di bawah, kepala bulat di atas.
const pts = [];
for (let i = 0; i <= 160; i++) {
  const th = Math.PI * (i / 160);
  pts.push(new THREE.Vector2(Math.max(0.0001, 1.5 * Math.sin(th) * Math.sin(th / 2) ** 1.6), -1.75 + 3.1 * (1 - Math.cos(th)) / 2));
}
const pin = new THREE.Mesh(new THREE.LatheGeometry(pts, 128), mat);
scene.add(pin);
// Lubang di kepala: bola terang yang tertanam, memberi kesan cekung.
const hole = new THREE.Mesh(new THREE.SphereGeometry(0.46, 64, 64), new THREE.MeshPhysicalMaterial({ color: 0xf4f4f4, roughness: 0.4 }));
hole.scale.z = 0.35; hole.position.set(0.1, 0.42, 0.98); scene.add(hole);
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.5));
const key = new THREE.DirectionalLight(0xffffff, 3.2); key.position.set(-3, 4, 5); scene.add(key);
const rim = new THREE.DirectionalLight(0xffffff, 1.2); rim.position.set(4, 1, -3); scene.add(rim);
renderer.render(scene, cam);
window.__png = renderer.domElement.toDataURL('image/png');
`;

const out = await build({ stdin: { contents: entry, resolveDir: process.cwd() }, bundle: true, format: 'iife', write: false, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage();
await page.setContent('<!doctype html><body style="margin:0;background:transparent"></body>');
await page.addScriptTag({ content: out.outputFiles[0].text });
const url = (await page.evaluate('window.__png')) as string;
await browser.close();
fs.mkdirSync('assets/icons/custom', { recursive: true });
fs.writeFileSync('assets/icons/custom/pin.png', Buffer.from(url.split(',')[1], 'base64'));
console.log('assets/icons/custom/pin.png');
