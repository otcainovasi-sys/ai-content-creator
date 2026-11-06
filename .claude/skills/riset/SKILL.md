---
name: riset
description: Riset kandidat topik konten harian untuk satu brand OTCA (Official OTCA, Info Jerman, Jepang Koey, Ciao Manda). Pakai saat diminta mencari ide, topik, atau riset konten minggu tertentu.
---

# Riset konten

Argumen: `<brand> <senin YYYY-MM-DD>`. Output: `research/<senin>/<brand>-kandidat.json`.

## Muat context

Baca dulu, jangan mengandalkan ingatan:
- `knowledge/brands/<brand>/questions.md`, `library.json`, `products.json`, `profile.md`
- `knowledge/shared/sources.md`, `knowledge/shared/archetypes.md`

## Langkah

1. Kumpulkan 15–20 kandidat dari bank pertanyaan dan momen terdekat. Label `[hipotesis]` boleh dipakai, tetapi nilai relevansinya lebih rendah.
2. Buang atau beri angle baru untuk topik yang mengulang `library.json`. Periksa dengan `npm run check-plan -- --topik <brand> "<topik>"`.
3. Untuk kandidat teratas, cari fakta ke sumber resmi di `sources.md`. Buka halamannya langsung. Halaman yang gagal dibuka tidak boleh ditulis seolah sudah dibaca.
4. Beri skor: relevansi 30, kebaruan 25, fakta 20, aset 15, momen 10.

## Aturan sumber

- Klaim memakai sumber resmi. Situs agen dan blog hanya untuk mencari arah.
- Catat URL, tanggal akses, dan kutipan pendek. Bila tidak terbaca langsung, tulis `"dibaca": false`.
- Kandidat tanpa sumber resmi boleh ada, tetapi skor faktanya 0.

## Format

```json
{
  "brand": "otca", "minggu": "2026-11-16", "diriset": "2026-11-05",
  "kandidat": [{
    "topik": "...", "masalah": "adegan nyata audiens", "label": "guideline|live|hipotesis", "angle": "...",
    "arketipe": "D", "skor": { "relevansi": 25, "kebaruan": 20, "fakta": 15, "aset": 10, "momen": 5, "total": 75 },
    "fakta": [{ "klaim": "...", "sumber": "...", "url": "...", "dibaca": true, "kutipan": "..." }],
    "catatan": "..."
  }]
}
```
