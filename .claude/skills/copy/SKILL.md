---
name: copy
description: Menulis copy per slide dan caption dari brief konten brand OTCA, lalu menilainya dengan rubrik dan menulis ulang sampai lolos. Pakai setelah skill brief, atau saat diminta menulis copy konten.
---

# Copy konten

Argumen: `<brand> <senin> <nomor slot>`. Output: `specs/<senin>/<brand>/<NN>-<hari>-<pilar>.json`.

## Muat context

- Brief slot tersebut
- `knowledge/brands/<brand>/profile.md`: tulis meniru contoh suara asli
- `knowledge/shared/copywriting.md`, `knowledge/shared/rubric.md`, `knowledge/shared/archetypes.md`

## Langkah

1. Tulis hook dari formula di `copywriting.md`. Hook adalah situasi, bukan nama topik.
2. Isi slide sesuai `alur` di brief. Blok teks maksimal 25 kata, dan setiap slide isi punya detail konkret.
3. Tulis caption. Kalimat Mandarin atau Jepang diberi `check: true` di `brief.sources`.
4. Nilai dengan rubrik dan isi `rubric` di spec. Jujur: slop dan kalimat umum diberi nilai rendah.
5. Di bawah 85, tulis ulang bagian yang lemah lalu nilai lagi. Maksimal 3 putaran. Masih di bawah 85: ganti angle atau laporkan.
6. Render: `npm run render -- <spec>`. Lihat PNG-nya sendiri, jangan hanya membaca status QA.

## Humanizer

Setelah copy lolos rubrik, periksa slide dan caption dengan skill `humanizer:humanizer`, lalu ikuti contoh suara asli di `profile.md`. Istilah produk seperti `A1–B1` tetap ditulis apa adanya.

## Komposisi

Logo, pola cover, warna, font, dan footer tetap. Slide isi bebas: pakai layout `free` dan pilih bentuk yang mengikuti isi (tangga, percakapan, angka besar, papan catur, orbit). Lihat "Tetap dan bebas" di `archetypes.md`. Dalam satu minggu, jangan mengulang komposisi yang sama.

## Larangan

Jangan mengarang nama, kutipan, nilai, testimoni, harga, atau bonus. Ikon dan ilustrasi mengikuti "Aturan ikon dan ilustrasi" di `archetypes.md`.

Status tertinggi adalah `SIAP_DIREVIEW`. Keputusan tayang ada pada Mbak Nia.
