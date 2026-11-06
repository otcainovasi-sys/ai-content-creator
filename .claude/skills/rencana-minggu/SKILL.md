---
name: rencana-minggu
description: Menyusun rencana 10 slot feed mingguan untuk satu brand OTCA dari hasil riset. Pakai setelah skill riset, atau saat diminta membuat rencana atau kalender konten minggu tertentu.
---

# Rencana minggu

Argumen: `<brand> <senin YYYY-MM-DD>`. Output: `plans/<senin>/<brand>.json`.

## Muat context

- `research/<senin>/<brand>-kandidat.json` (bila belum ada, jalankan skill `riset` dulu)
- `config/schedule.json`, `knowledge/shared/archetypes.md`
- `knowledge/brands/<brand>/library.json`, `products.json`, `assets.md`

## Aturan

1. Isi 10 slot sesuai `config/schedule.json`, jangan menggeser pilar.
2. Tiga slot Problem / Education memakai tiga arketipe berbeda.
3. Slot yang butuh data asli (cerita siswa, achievement, tutor, nilai) diberi `"status": "butuh_data"` dan daftar `data_dibutuhkan`. Jangan mengarang isinya.
4. Slot harga hanya boleh `siap_brief` bila harga ada di `products.json`, belum kedaluwarsa, dan statusnya bukan `perlu_konfirmasi`.
5. Setiap slot `siap_brief` punya adegan dari `config/scenes.json`, atau maskot, atau aset nyata.

## Format

```json
{
  "brand": "otca", "minggu": "2026-11-16",
  "slot": [{
    "no": 1, "jadwal": "Senin 10:00", "pilar": "problem_education", "status": "siap_brief",
    "topik": "...", "angle": "...", "arketipe": "D", "format": "carousel", "scene": "karier", "mascot": "robot-berpikir",
    "cta": { "type": "comment", "keyword": "STUDI" }, "produk": [], "data_dibutuhkan": []
  }]
}
```

## Periksa

Jalankan `npm run check-plan -- plans/<senin>/<brand>.json`. Perbaiki semua masalah kritis.
