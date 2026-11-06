# Pipeline konten harian v2: struktur, context, knowledge base

Status: Tahap 1–3 selesai 5 November 2026 (knowledge base, skill riset sampai copy, komponen visual). Pilot OTCA minggu 16 November: 5 konten selesai dan lembar review mingguan dibuat, 5 slot menunggu data asli. Tahap 4–5 belum selesai.
Lingkup: konten harian (carousel dan single) dari riset sampai lembar review. Event Parents Talk di luar lingkup.

---

## 1. Diagnosis: kenapa carousel Senin terasa polos dan "AI slop"

Pembanding: 16 slide carousel live dan 4 tangkapan grid feed (40 post) yang dikirim 5 November 2026.

| # | Masalah | Di konten live | Di carousel Senin |
|---|---|---|---|
| 1 | **Kepadatan** | Satu slide isi memuat 3–5 unit informasi (ikon + judul + 1–2 baris), tabel, atau grid | Satu slide = satu paragraf di kartu putih besar |
| 2 | **Komponen visual** | Ikon dan ilustrasi 3D, maskot berpose sesuai konteks, screenshot kelas, sertifikat, UI portal, foto tutor, label pill, panah alur, badge bonus | Hanya teks dan kartu |
| 3 | **Latar slide isi** | Foto atau ornamen brand tetap tampil samar di slide isi (Reichstag, Fuji, skyline, kertas) | Latar polos |
| 4 | **Spesifik vs umum** | Angka, nama, istilah, contoh nyata: "±9,15% dari gaji", "Tsinghua · Peking · Fudan", "Lesen, Hören, Schreiben, Sprechen" | Kalimat penjelas yang umum dan berulang ("umumnya", "cek syarat") |
| 5 | **Suara brand** | Info Jerman kasual ("nggak", "Yuk"); OTCA dual-tone dengan sudut pandang parents; Koey hangat dengan "kamu" | Nada netral yang sama di keempat brand |
| 6 | **Topik berulang** | Info Jerman **sudah** memposting "Ausbildung itu harus punya sertifikat B1 atau B2 sih?" | Topik yang sama dibuat ulang, karena tidak ada log konten yang sudah tayang |
| 7 | **Bukti nyata** | Screenshot komentar orang tua sebagai hook, cuplikan Zoom kelas, scan sertifikat | Tidak ada, karena belum ada pustaka aset bukti |

Akar masalahnya ada tiga. Mesin render dan QA sudah bekerja dengan benar, jadi masalahnya bukan di sana:
1. **Tidak ada knowledge base.** Setiap konten ditulis hanya dari guideline dan ingatan sesi.
2. **Tidak ada pustaka pola.** Belum ada katalog arketipe slide dan komponen visual yang diambil dari konten live.
3. **Tidak ada gerbang kualitas copy.** QA saat ini memeriksa teknis dan struktur, bukan apakah copy itu spesifik, padat, dan bersuara brand.

---

## 2. Struktur knowledge base

```
knowledge/
├── shared/
│   ├── copywriting.md        Formula hook dari konten live, aturan kepadatan, daftar AI slop + contoh perbaikannya
│   ├── archetypes.md         Katalog arketipe carousel dan single (bagian 4)
│   ├── rubric.md             Rubrik penilaian 4 × 25 poin (diadaptasi dari evaluator OTCA, berlaku untuk 4 brand)
│   └── sources.md            Sumber fakta tepercaya per topik (kedutaan, Goethe, Japan Foundation, jlpt.jp, Hanban/HSK)
└── brands/<brand>/
    ├── profile.md            Positioning, audiens, suara (contoh asli dari post live), CTA, keputusan guideline vs feed live
    ├── products.json         Produk, harga, bonus, garansi. Setiap fakta punya sumber, pemilik, dan berlaku_sampai
    ├── questions.md          Bank pertanyaan dan masalah audiens. Sumber: Parents Talk, chat sales, komentar, guideline
    ├── library.json          Log konten yang sudah tayang: tanggal, hook, topik, angle, arketipe, CTA, (nanti) performa
    ├── patterns.md           Pola visual brand: tipe cover, slide isi, penutup, komponen, warna, maskot per konteks
    ├── assets.md             Inventaris aset: maskot dan pose, foto tutor, screenshot kelas, sertifikat, UI portal, ikon
    └── refs/                 Contoh slide live yang sudah dianotasi (dipakai sebagai pembanding di lembar review)
```

Aturan knowledge base:
- **Satu sumber kebenaran.** Harga, bonus, dan garansi hanya boleh diambil dari `products.json`. Fakta yang sudah lewat `berlaku_sampai` otomatis memblokir konten.
- **`library.json` wajib dicek** sebelum memilih topik. Topik atau angle yang sama dalam 8 minggu terakhir harus diberi angle baru atau diganti.
- **Contoh suara brand berasal dari post asli,** bukan dari kalimat yang saya karang sendiri.
- File ditulis dalam Markdown dan JSON, supaya tim bisa membaca dan merevisinya langsung.

---

## 3. Context per tahap (context pack)

Setiap tahap hanya memuat file yang relevan, supaya keputusan konsisten dan bisa ditelusuri.

| Tahap | Context yang dimuat | Output |
|---|---|---|
| **1. Riset** | `questions.md`, `library.json`, `products.json`, `sources.md`, kalender momen (JLPT 6 Des, intake, promo) | Daftar 15–20 kandidat topik dengan skor |
| **2. Rencana minggu** | Kandidat topik, `config/schedule.json`, `library.json`, `archetypes.md` | 10 slot: topik, pilar, arketipe, aset yang dibutuhkan |
| **3. Brief** | `profile.md`, `questions.md`, `products.json`, `sources.md`, `patterns.md` | Brief: situasi nyata, insight, angle, pesan, arketipe, rencana isi per slide, fakta bersumber, CTA |
| **4. Copy** | Brief, `profile.md` (suara + contoh asli), `copywriting.md` | Copy per slide dan caption |
| **5. Self-review** | Copy, `rubric.md`, `copywriting.md` (daftar slop) | Skor rubrik. Di bawah 85, copy wajib ditulis ulang. |
| **6. Desain** | Arketipe, `patterns.md`, `assets.md` | Spec render dengan komponen |
| **7. QA** | Spec dan PNG | Laporan QA: teknis, struktur, **kepadatan** |
| **8. Lembar review** | Semua output di atas + 1 contoh `refs/` dengan arketipe yang sama | Halaman review untuk Mbak Nia |

Tahap 1–5 dijalankan sebagai **skill Claude Code** (`/riset`, `/rencana-minggu`, `/brief`, `/copy`). Skill-skill ini membaca knowledge base, sesuai rekomendasi dokumen Struktur 5 AI Agent: satu agent, banyak modul. Tahap 6–8 dijalankan oleh kode yang sudah ada.

### Skor kandidat topik (tahap 1)

| Kriteria | Bobot | Pertanyaan |
|---|---|---|
| Relevansi masalah | 30 | Apakah ini pertanyaan nyata audiens (ada di `questions.md`)? |
| Kebaruan | 25 | Belum tayang dalam 8 minggu, atau angle-nya benar-benar baru? |
| Fakta tersedia | 20 | Ada sumber tepercaya untuk setiap klaim? |
| Aset tersedia | 15 | Ada maskot, ikon, foto, atau screenshot yang cocok? |
| Momen | 10 | Terkait momen terdekat (ujian, intake, promo)? |

---

## 4. Katalog arketipe (dari konten live)

Setiap konten memilih satu arketipe. Arketipe menentukan alur slide, kepadatan, dan komponen yang wajib ada.

| Arketipe | Contoh live | Alur slide | Komponen wajib |
|---|---|---|---|
| **Tips N cara** | Info Jerman "Absen sekali…", "Nggak punya waktu…" | Cover → 1 slide berisi ilustrasi + 3–4 kartu berikon → penutup pill | Eyebrow seri, ilustrasi 3D, kartu berikon, pill punchline |
| **Daftar padat** | Koey "5 jebakan partikel", Ciao "3 langkah menyapa klien" | Cover → 1–2 slide berisi 3–5 item bernomor (label + isi + contoh) → CTA | Label nomor pill, contoh dalam bahasa target, ilustrasi kecil per item |
| **Timeline / target** | Koey "Target ke Jepang-mu kapan?" | Cover → kartu waktu berikon pin → kotak Catatan → CTA penawaran | Ikon pin, rentang waktu, kotak disclaimer |
| **Kerangka / alur** | OTCA "Tidak semua anak cocok di jalur yang sama" | Cover maskot → kartu header pill + alur ikon → poin → penutup mindset shift | Header pill, alur ikon dengan panah, dual-tone |
| **Perbandingan** | Ciao "3 universitas top China", Koey "4 beasiswa" | Cover → grid 3–4 kolom (logo/foto + poin) → CTA | Grid kolom, logo/foto, ikon poin |
| **Edukasi berangka** | Koey "potongan gaji di Jepang" | Cover → item berangka (%, istilah asli + arti) → CTA | Angka besar, istilah miring, ikon 3D per item |
| **Hook komentar** | OTCA "anak saya susah fokus…" | Cover screenshot komentar → jawaban → CTA | Kartu komentar (izin/anonim) |
| **Fitur produk** | Info Jerman Portal Exam | Cover mockup → langkah 1-2-3 → manfaat → CTA | Mockup ponsel/tablet, alur langkah |
| **Penutup penawaran** | Koey "Jangan tunggu 2027", Ciao bonus | Punchline → daftar bonus berikon → CTA kata kunci + maskot | Badge bonus, ikon, maskot pose ajakan |
| **Single: bukti** | Student achievement, Wall of Success, cerita siswa | Satu slide: foto/sertifikat + nama + kutipan + CTA | Aset asli + izin |
| **Single: promo** | Gold Mandarin Deals, Super Promo Best Deal | Tabel harga/tier + periode + fitur | Harga dari `products.json` |

---

## 5. Gerbang kualitas tambahan

### 5.1 Aturan copy (diperiksa di tahap self-review, sebagian otomatis di QA)
- **Spesifik:** setiap slide isi memuat minimal satu detail konkret, yaitu angka, istilah, contoh kalimat, nama, atau situasi.
- **Padat:** maksimal 25 kata per blok teks. Tidak ada paragraf penjelas. Satu ide per kartu.
- **Kata berhedging** ("umumnya", "biasanya", "bisa jadi") maksimal satu kali per carousel. Ketidakpastian ditaruh di kotak Catatan, bukan di setiap kalimat.
- **Daftar slop** (di `copywriting.md`): pembuka klise, punchline generik ("X, lalu Y"), kata sifat kosong, serta kalimat yang bisa dipakai brand lain tanpa diubah.
- **Suara brand:** dicocokkan dengan contoh asli di `profile.md`.

### 5.2 QA kepadatan visual (otomatis)
- Setiap slide isi minimal punya 2 jenis komponen (teks + ikon/ilustrasi/foto/tabel).
- Rasio area kosong di atas ambang (diukur dari varians piksel) memunculkan catatan "slide terlalu kosong".
- Komponen wajib arketipe tidak ada = catatan.

### 5.3 Lembar review
Tambahan dari versi sekarang: skor rubrik, arketipe, dan **satu slide referensi live** di samping storyboard, supaya Mbak Nia bisa langsung membandingkan.

---

## 6. Kebutuhan aset visual

Komponen paling besar yang belum ada adalah **ikon dan ilustrasi 3D**. Opsi yang berlisensi komersial:

| Opsi | Lisensi | Catatan |
|---|---|---|
| Ikon yang dipakai tim saat ini (Canva/Freepik/AI) | Ikut lisensi akun tim | Paling konsisten dengan feed live |
| Microsoft Fluent Emoji 3D | MIT, boleh komersial | Gaya 3D mirip kalender, jam, dan buku di feed Info Jerman; ±1.500 ikon |
| 3dicons.co | CC0 | Ikon 3D umum, pilihan lebih sedikit |

Aset bukti dan brand perlu disediakan tim, karena tidak bisa dibuat atau dicari dari stok:
- Foto tutor
- Screenshot kelas (Zoom)
- Sertifikat siswa (dengan izin)
- UI Portal Exam
- Maskot OTCA (robot) dan Info Jerman, dalam berbagai pose
- Screenshot komentar (dianonimkan)

---

## 7. Urutan pembangunan yang diusulkan

| Tahap | Isi | Hasil yang bisa dicek |
|---|---|---|
| **1. Knowledge base awal** | `profile.md`, `library.json` (dari 40 post di grid), `patterns.md`, `questions.md`, `products.json` untuk 4 brand; `copywriting.md`, `archetypes.md`, `rubric.md`, `sources.md` | Anda dan tim mengoreksi isinya |
| **2. Skill riset → brief → copy** | 4 skill yang memuat context pack dan rubrik | 1 rencana minggu + brief untuk 1 brand |
| **3. Komponen visual dan arketipe** | Ikon 3D, maskot per pose, latar samar slide isi, template untuk 6 arketipe utama | 1 carousel per arketipe, berdampingan dengan referensi live |
| **4. QA kepadatan dan lembar review v2** | Aturan 5.1 dan 5.2, skor rubrik, slide referensi | Lembar review baru |
| **5. Pilot satu minggu, satu brand** | 10 konten dari riset sampai review | Penilaian Mbak Nia sebagai patokan sebelum diperluas ke 4 brand |

---

## 8. Yang dibutuhkan dari tim

1. **Lebih banyak konten live:** idealnya ekspor 1–2 bulan terakhir per brand (gambar slide + caption), untuk `library.json` dan `refs/`.
2. **Sumber ikon dan ilustrasi 3D** yang dipakai tim, atau izin memakai Fluent Emoji 3D (MIT).
3. **Folder aset bukti:** foto tutor, screenshot kelas, sertifikat berizin, UI portal, maskot OTCA dan Info Jerman.
4. **Bahan pertanyaan audiens:** rangkuman chat sales atau komentar yang sering muncul, boleh dianonimkan.
5. **Data produk terkini per brand:** paket, harga, bonus, garansi, dan periode berlakunya.
