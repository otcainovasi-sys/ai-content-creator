---
name: brief
description: Menulis brief konten per slot dari rencana minggu brand OTCA, berisi situasi, insight, angle, pesan, alur slide, fakta bersumber, dan CTA. Pakai setelah rencana-minggu, atau saat diminta membuat brief konten.
---

# Brief konten

Argumen: `<brand> <senin> [nomor slot]`. Output: `briefs/<senin>/<brand>/<NN>.json`.

## Muat context

- `plans/<senin>/<brand>.json` dan `research/<senin>/<brand>-kandidat.json`
- `knowledge/brands/<brand>/profile.md`, `patterns.md`, `products.json`, `assets.md`
- `knowledge/shared/archetypes.md`
- Satu contoh live yang arketipenya sama di `knowledge/brands/<brand>/refs/`. Lihat gambarnya.

## Isi brief

- **situasi:** satu adegan yang bisa dibayangkan. Siapa, kapan, sedang apa.
- **insight:** hal yang belum disadari audiens.
- **angle:** sudut yang membuat topik ini berbeda dari post sebelumnya.
- **pesan:** satu kalimat.
- **alur:** satu entri per slide: peran, layout, tujuan, dan unit informasi yang masuk. Slide isi 3–5 unit.
- **fakta:** klaim, sumber, URL, `check: true` bila belum dibaca langsung atau butuh konfirmasi tim.
- **cta**, **risiko**, **acuan** (post live yang dilanjutkan atau dijadikan pola).

Brief belum berisi copy final. Copy ditulis oleh skill `copy`.

Hanya slot `siap_brief` yang boleh dibuatkan brief.
