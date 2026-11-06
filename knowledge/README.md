# Knowledge base konten

Sumber kebenaran untuk produksi konten harian. Alur dan cara pakainya ada di `docs/pipeline-konten-v2.md`.

Versi awal disusun 5 November 2026 dari: brand guideline Nov 2026, slide target market dan jadwal, dokumen evaluator OTCA,
16 slide carousel live, dan 4 tangkapan grid feed. **Belum ada data asli chat sales, komentar, atau Parents Talk.**

## Isi

| File | Fungsi |
|---|---|
| `shared/copywriting.md` | Formula hook, aturan kepadatan, daftar AI slop dan contoh perbaikannya |
| `shared/archetypes.md` | Alur slide dan komponen wajib tiap arketipe |
| `shared/rubric.md` | Rubrik self-review 100 poin |
| `shared/sources.md` | Sumber fakta tepercaya dan status pengecekannya |
| `brands/<brand>/profile.md` | Positioning, audiens, suara brand, CTA, keputusan yang sudah diambil |
| `brands/<brand>/patterns.md` | Pola visual dari konten live |
| `brands/<brand>/questions.md` | Bank pertanyaan dan masalah audiens |
| `brands/<brand>/products.json` | Produk, harga, bonus, tutor, dan status konfirmasinya |
| `brands/<brand>/library.json` | Konten yang sudah tayang |
| `brands/<brand>/assets.md` | Aset yang ada dan yang masih dibutuhkan |
| `brands/<brand>/refs/` | Slide live sebagai referensi |

## Status informasi

**`products.json`**

| Status | Arti | Boleh dipakai di konten? |
|---|---|---|
| `terkonfirmasi` | Tercantum di dokumen resmi internal atau sudah dikonfirmasi tim | Ya, selama belum lewat `berlaku_sampai` |
| `dari_post_live` | Terbaca dari post yang sudah tayang, belum dikonfirmasi tim | Boleh dipakai sebagai draf, wajib ditandai perlu dicek di brief |
| `perlu_konfirmasi` | Teks kurang terbaca, atau sumbernya saling berbeda | Tidak boleh dipakai sebelum dikonfirmasi |

**`questions.md`**

| Label | Arti |
|---|---|
| `[guideline]` | Tertulis di guideline atau slide target market |
| `[live]` | Diangkat di konten live, atau muncul di komentar yang ditampilkan di konten |
| `[hipotesis]` | Dugaan penyusun. Belum terbukti sebagai pertanyaan nyata audiens. |

## Cara merawat

- Harga, bonus, atau periode promo berubah: ubah `products.json`, lalu perbarui `status` dan `berlaku_sampai`.
- Konten tayang: tambahkan ke `library.json`.
- Ada pertanyaan baru dari sales atau komentar: tambahkan ke `questions.md` dengan label sumbernya.
- Mbak Nia memberi catatan yang berlaku umum: tambahkan ke `profile.md` atau `shared/copywriting.md`.

Periksa kelengkapan dan fakta kedaluwarsa dengan:

```bash
npm run knowledge
```
