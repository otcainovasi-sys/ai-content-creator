# OTCA Design Studio

Sistem produksi konten visual Instagram untuk Official OTCA, Info Jerman, Jepang Koey, dan Ciao Manda.
Satu spec JSON menjadi PNG berukuran persis, lengkap dengan laporan QA.

## Alur kerja

```bash
npm run plan -- jepang-koey 2026-11-09     # 10 slot feed seminggu dari jadwal master
npm run stock -- "mount fuji" 4            # cari foto berlisensi komersial, simpan + catat lisensi
npm run render -- specs/2026-11-09/jepang-koey/01-senin-problem_education.json
npm run batch -- specs/2026-11-09/jepang-koey
```

Hasil ada di `projects/<brand>/<slug>/`: `slide-NN.png`, `design-spec.json`, `qa-report.json`, `caption.md`,
**`review.html` dan `review.png`** (lembar review untuk Mbak Nia), dan `_build/slide-NN.html`.

Status tertinggi hanya `SIAP_DIREVIEW`. Persetujuan tayang selalu keputusan reviewer (Mbak Nia, semua brand).

## Alur konten harian

Riset → brief → copywriting → render → QA → lembar review. Konten harian tidak butuh approval angle
(approval angle hanya untuk event Parents Talk). Rancangan lengkap: `docs/pipeline-content-creator.md`.

1. **Riset**: konten live brand, pertanyaan audiens, dan fakta bersumber (`research/`).
2. **Brief** di dalam spec (`brief`): masalah, angle, pesan utama, CTA (`comment` + kata kunci, `link_bio`, `dm`, `save`),
   sumber fakta (`check: true` bila wajib dicek), risiko, dan konten live yang dilanjutkan.
3. **Copy per slide** dengan `role` (cover, context, point, closing) dan `intent` (alasan slide ada).
4. **Render + QA + lembar review** dengan `npm run render` / `npm run batch`.

Carousel adalah format default. Single image (`"type": "single"`) untuk promo, harga, achievement, sertifikat,
dan Parents Talk.

## Skill Claude Code

| Skill | Hasil |
|---|---|
| `/riset <brand> <senin>` | `research/<senin>/<brand>-kandidat.json` |
| `/rencana-minggu <brand> <senin>` | `plans/<senin>/<brand>.json`, diperiksa `npm run check-plan` |
| `/brief <brand> <senin>` | `briefs/<senin>/<brand>/<NN>.json` |
| `/copy <brand> <senin> <slot>` | Spec dengan skor rubrik, lalu render dan lembar review |

`npm run review-week -- <brand> <senin>` membuat satu lembar review untuk seluruh minggu.

## Struktur

| Lokasi | Isi |
|---|---|
| `knowledge/` | Knowledge base konten: suara brand, pola visual, pertanyaan, produk, log konten (lihat `knowledge/README.md`) |
| `config/brands/*.json` | Semua nilai brand: warna, font, safe zone, footer, frasa terlarang |
| `config/schedule.json` | Jadwal feed dan story |
| `src/schema.ts` | Validasi spec dan daftar format |
| `src/render/` | 9 layout, CSS bersama, auto-fit teks, render Playwright |
| `src/qa/qa.ts` | QA teknis, layout, brand, konten, kontras |
| `src/stock/stock.ts` | Provider foto: Pexels, Pixabay, Openverse |
| `assets/brands/<slug>/` | Logo dan maskot (salinan; sumber asli tidak diubah) |
| `scripts/` | Impor aset, spec uji, uji semua format |

Layout tidak menyimpan nilai brand. Brand baru cukup menambah satu file JSON dan folder aset.

## Layout

| Layout carousel | Peran |
|---|---|
| `cover` | Hook. Foto atau maskot opsional. Tidak boleh ada CTA. |
| `point` | Satu poin per slide: nomor, isi, contoh (teks + bacaan + arti, mis. Mandarin/Jepang), tips |
| `grid` | 2–4 poin paralel. `numbered: false` untuk perbandingan |
| `numbered_list` | 2–5 poin dalam satu slide |
| `closing` | Punchline + satu CTA wajib, dengan catatan CTA |

`free` adalah layout bebas berbasis blok (`title`, `text`, `card`, `big`, `bubble`, `pill`, `icon`, `mascot`, `scene`, `cta`, `bar`, `ring`) dengan posisi x, y, w, h dalam persen. Logo, footer, dan warna tetap dari brand, dan QA tetap memeriksa hasilnya.

| Layout single | Pilar |
|---|---|
| `hero_photo` | Problem / Education |
| `mascot_hero` | Problem / Education, promosi |
| `numbered_list` | Problem / Education |
| `story_card` | Student / Parent Story |
| `achievement` | Proof / Achievement |
| `score_infographic` | Proof / Achievement |
| `tutor_profile` | Tutor Authority |
| `program_value` | Program / Product / Value |
| `price_table` | Conversion / Hardsell |

`**kata**` pada teks memberi highlight sesuai gaya brand.

## Aturan yang ditegakkan QA

Struktur carousel: cover tanpa CTA, CTA hanya di slide penutup (tanpa CTA penutup = diblokir), nomor poin berurutan,
kata kunci CTA di brief muncul di slide penutup, 3–10 slide, setiap slide punya peran, spec punya brief.


Memblokir: placeholder `[...]`, frasa terlarang guideline, klaim (garansi, harga, angka hasil, beasiswa) yang
belum tercantum di `verified_claims`, teks tidak muat, teks bertabrakan, keluar safe zone, gambar hilang,
foto stok tanpa catatan lisensi, maskot belum dipotong, kontras sangat rendah.

Teks tidak pernah dipotong. Bila tidak muat di ukuran minimum, spec diblokir dan copy harus dipendekkan.

## Stok foto

Isi `.env` (salin dari `.env.example`) dengan `PEXELS_API_KEY` dan `PIXABAY_API_KEY`. Tanpa key, sistem memakai
Openverse dan hanya mengambil CC0 atau public domain. Foto orang atau bangunan tertentu tetap perlu dicek sebelum
dipakai untuk iklan.

## Tes

```bash
npm test
npm run typecheck
npx tsx scripts/check-formats.ts <folder-output>
```
