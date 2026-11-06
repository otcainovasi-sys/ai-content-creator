# Penyelarasan dengan pipeline AI Content Creator

Acuan: *Struktur 5 AI Agent OTCA*, v2, Oktober 2026. Yang dipakai hanya bagian Content Creator, alur sistem, RACI, Human
Approval, dan batas tanggung jawab.

## 1. Pipeline menurut dokumen

```
Input: Parents Talk · feedback sales · chat export · product knowledge · brand guideline · event dan promo · memori kreatif tim
  → Content Research → Audience Insight (pertanyaan yang paling sering muncul)
  → Content Strategy (tema, kategori, angle, pesan utama)          ◆ approval tema dan angle: Reviewer / Mbak Nia
  → Copywriting (headline, sub, isi, caption, CTA)
  → Carousel Production  |  Image Single Production (Parents Talk, sertifikat, achievement, promo)
  → Creative Design → Creative Ads (variasi untuk iklan)
  → Quality Control (guideline, style, rules, context, taste)       ◆ approval carousel dan image: Reviewer / Mbak Nia
  → Serah ke Social Media Manager (library, kalender, publikasi)
  ↺ Feedback performa kembali ke Content Creator
```

Prinsip dari dokumen yang langsung berlaku untuk sistem ini:
1. **Satu agent, banyak modul.** Carousel, caption, dan QA menjadi modul atau skill di dalam Content Creator, bukan agent terpisah.
2. **Human Approval bukan AI.** Ada dua gerbang: tema dan angle sebelum produksi, lalu desain sebelum publikasi.
3. **Batas tanggung jawab:**
   - Content Creator mengemas pesan. Ia tidak menentukan budget ads, tidak menjadwalkan, dan tidak membalas komentar.
   - Ide, script, dan pesan video menjadi tanggung jawab Content Creator. Eksekusi video dikerjakan Video Editor.
4. **Output:** ide konten, content brief, carousel, image single, caption dan CTA, serta aset kreatif untuk ads.

## 2. Posisi sistem saat ini

| Tahap dokumen | Sudah ada | Belum ada |
|---|---|---|
| Input dan knowledge | Guideline sebagai `config/brands`, stok foto berlisensi | Basis fakta produk (dengan sumber dan masa berlaku), folder Parents Talk, feedback sales, chat export, log topik yang sudah tayang, memori selera reviewer |
| Research dan insight | Riset manual di `research/` | Format tetap untuk pertanyaan audiens dan frekuensinya |
| Strategy dan brief | Planner jadwal (slot dan pilar) | **Brief sebagai artefak** (masalah, angle, pesan, format, alur slide, CTA, fakta dan sumber) dan **gerbang approval angle** |
| Copywriting | Spec JSON dan caption | Aturan copy per brand yang bisa dicek (pola hook, mekanisme CTA) |
| Carousel | Spec bisa memuat 10 slide | **Template peran slide**: cover, kerangka, poin, penutup + CTA |
| Image single | 9 layout | Template promo, sertifikat, dan kutipan Parents Talk |
| Creative design | Render HTML ke PNG yang presisi | Pustaka ikon dan ilustrasi 3D, maskot OTCA dan Info Jerman |
| Creative Ads | 5 format ukuran | Paket variasi ads (copy A/B dan ukuran) untuk Digital Marketing |
| QA | QA teknis, layout, brand, klaim | Cek struktur carousel, klaim wajib bersumber, topik berulang, tanda "cek tutor/Sensei" |
| Approval | Status tertinggi `SIAP_DIREVIEW` | Status alur kerja dan catatan reviewer |
| Serah ke SMM | Folder `projects/` | **Paket serah terima** dengan metadata (brand, platform, format, kategori, jadwal, kata kunci CTA) |
| Feedback | - | Impor performa (reach, save, komentar, lead) |

## 3. Usulan penyelarasan

### 3.1 Alur status satu konten

```
IDE → BRIEF → [Approval angle] → BRIEF_DISETUJUI → PRODUKSI → QA → DIBLOKIR | SIAP_DIREVIEW
    → [Approval desain] → DISETUJUI | REVISI (catatan reviewer) → DISERAHKAN_KE_SMM
```

Sistem tidak pernah bisa menulis `DISETUJUI`. Status itu hanya diisi lewat tindakan reviewer, beserta nama dan waktunya.

### 3.2 Artefak per tahap

| Artefak | Isi | Lokasi |
|---|---|---|
| `knowledge/<brand>/facts.json` | Fakta produk, harga, bonus. Masing-masing punya sumber, pemilik, dan tanggal berlaku. | Satu sumber kebenaran untuk `verified_claims` |
| `knowledge/<brand>/published.json` | Topik dan angle yang sudah tayang | Dipakai untuk mencegah topik berulang |
| `knowledge/inbox/` | Parents Talk, feedback sales, chat export (mentah) | Bahan riset |
| `knowledge/creative-direction.md` | Pelajaran dari approval dan revisi reviewer ("taste") | Memori kreatif tim |
| `briefs/<minggu>/<brand>/<slot>.json` | Masalah, angle, pesan utama, format (`carousel` / `single`), peran tiap slide, CTA, id fakta, risiko | Diajukan untuk approval angle |
| `specs/...` | Copy final per slide dan caption, dibuat dari brief yang sudah disetujui | Sudah ada |
| `outbox/<brand>/<tanggal>_<slot>/` | Slide PNG, `caption.md`, `meta.json` (platform, format, pilar, jadwal, kata kunci CTA untuk auto-reply SMM) | Serah terima ke Social Media Manager |

### 3.3 Format konten

- **Carousel (default untuk edukasi, story, proof):** 3–10 slide dengan peran tetap. Cover hook (tanpa CTA), kerangka atau konteks (opsional), slide poin (biasanya 3), dan penutup berisi punchline + satu CTA.
- **Image single:** promo dan harga, achievement, sertifikat, kutipan Parents Talk, pengumuman event.
- **Variasi ads:** turunan dari konten yang disetujui, yaitu 1:1, 4:5, dan 9:16, plus 2–3 variasi headline. Diserahkan ke Digital Marketing, bukan dijalankan sendiri.

### 3.4 Modul di dalam agent Content Creator

Modul dibuat sebagai skill Claude Code. Logika yang harus konsisten (render, QA, validasi) tetap berupa kode.

| Skill | Tugas | Kode yang dipakai |
|---|---|---|
| `riset-audiens` | Mengolah `knowledge/inbox` dan konten live menjadi daftar pertanyaan dan masalah teratas | - |
| `brief-konten` | Membuat brief per slot dari jadwal, pilar, fakta, dan log topik | Validasi skema brief, cek topik berulang |
| `copywriting` | Brief yang sudah disetujui menjadi spec dan caption, mengikuti pola copy brand | Validasi spec |
| `produksi` | Render carousel dan single | `render`, `batch` |
| `qc` | Menjalankan QA dan membuat ringkasan review untuk reviewer | `qa` |
| `serah-terima` | Menyusun `outbox` untuk SMM | Pembuat paket |

## 4. Urutan pembangunan yang disarankan

| Tahap | Isi | Alasan |
|---|---|---|
| A (sekarang) | Skema brief + gerbang approval angle, template carousel (cover, kerangka, poin, penutup), template single promo, status alur kerja | Konten minggu ini butuh carousel dan approval angle |
| B | `facts.json` dengan masa berlaku, log topik dan cek pengulangan, memori selera reviewer | Mencegah klaim kedaluwarsa dan topik berulang |
| C | Paket serah terima `outbox` untuk SMM, paket variasi ads | Batas tanggung jawab dengan SMM dan Digital Marketing |
| D | Ingest Parents Talk, feedback sales, dan chat export, lalu impor performa | Loop feedback |
| E | Dashboard untuk reviewer dan PIC | Approval tanpa command line |

## 5. Yang perlu dikonfirmasi

1. **Reviewer:** Mbak Nia untuk semua brand, atau PIC tiap brand (Nina, Indah, Helmi, Alya) dulu, lalu Mbak Nia?
2. **Approval angle:** per brief, atau sekali untuk satu paket mingguan per brand?
3. **Bahan Parents Talk, feedback sales, dan chat export:** di mana lokasinya, dan apakah boleh diolah di sistem ini? Bahan ini berisi data pribadi.
4. **Serah terima ke SMM:** lewat folder Google Drive tertentu, atau folder lokal dulu?
