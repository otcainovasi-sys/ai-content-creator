// Merender aset 3D clay per brand ke assets/icons/<brand>/c-<nama>.png. Pakai: npm run make3d -- <brand> [nama...]
import fs from 'node:fs';
import { build } from 'esbuild';
import { chromium } from 'playwright';
import sharp from 'sharp';

const PAL: Record<string, Record<string, string>> = {
  otca: { metal: '0.75', body: '#C4C6CB', dark: '#2C2C2F', acc: '#CB9D31', paper: '#F3EEE2', soft: '#B9B6AD', red: '#C8322A' },
  'ciao-manda': { dark: '#242830', acc: '#5E1520', paper: '#F8F6F2', soft: '#D9C9A8', red: '#BD2331', skin: '#F2C39B', metalGold: '1', onacc: '#FFFFFF', gold: '#D4A65C', cur: '¥', book: '中文', certA: 'HSK', certB: '中文' },
  'jepang-koey': { dark: '#2A2D33', acc: '#B50D14', paper: '#F7F5F2', soft: '#CFCBC5', red: '#D71920', onacc: '#FFFFFF', gold: '#E8B957', cur: '¥', book: '日本語', certA: 'N4', certB: 'JFT' },
  'info-jerman': { dark: '#2B2C31', acc: '#F0B90C', paper: '#F7F1E2', soft: '#C9C6BC', red: '#D8392B' },
};
const [brand = 'info-jerman', ...only] = process.argv.slice(2);
const pal = PAL[brand];
if (!pal) throw new Error(`Palet belum ada: ${brand}`);
const out = await build({ entryPoints: ['scripts/3d/scene.js'], bundle: true, format: 'iife', write: false, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage();
await page.setContent('<!doctype html><body style="margin:0;background:transparent"></body>');
const woff = fs.readFileSync('node_modules/@fontsource/montserrat/files/montserrat-latin-800-normal.woff2').toString('base64');
await page.addStyleTag({ content: `@font-face{font-family:Montserrat;font-weight:800;src:url(data:font/woff2;base64,${woff}) format('woff2')}` });
await page.evaluate(`document.fonts.load('800 40px Montserrat').then(()=>document.fonts.ready)`);
await page.addScriptTag({ content: out.outputFiles[0].text });
const names = only.length ? only : ((await page.evaluate('window.__names')) as string[]);
const dir = `assets/icons/${brand}`;
for (const n of names) {
  const url = (await page.evaluate(`window.__render(${JSON.stringify(n)}, ${JSON.stringify(pal)})`)) as string;
  await sharp(Buffer.from(url.split(',')[1], 'base64')).trim().resize(1000, 1000, { fit: 'inside' }).png().toFile(`${dir}/c-${n}.png`);
  console.log(`${dir}/c-${n}.png`);
}
await browser.close();
