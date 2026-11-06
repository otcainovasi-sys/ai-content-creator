# Arketipe konten

Setiap konten memilih satu arketipe di tahap rencana. Arketipe menentukan alur slide, kepadatan, dan komponen wajib.
Nama file referensi mengacu ke `brands/<brand>/refs/`.

Status template (5 November 2026): semua arketipe sudah dibangun dan diuji gaya. A `tips`, B dan F `labels`, C `timeline`, D `framework` dan `options`, E `compare`, G `comment`, H `feature`, I `offer`, J `proof`, K `promo`, L `program`.

## Carousel

### A. Tips N cara
- **Dipakai untuk:** masalah belajar sehari-hari.
- **Alur:** cover hook → 1 slide ilustrasi besar + 3–4 kartu berikon → pill punchline → CTA.
- **Komponen wajib:** pill seri, ilustrasi 3D utama, kartu berikon (2–4 kata), pill gelap punchline.
- **Referensi:** Info Jerman `absen-ketinggalan`, `3x10-menit`, `lembur`.

### B. Daftar padat
- **Dipakai untuk:** etiket, jebakan ujian, langkah praktis, kosakata atau kalimat kerja.
- **Alur:** cover → 1–2 slide berisi 3–5 item bernomor → slide penawaran atau CTA.
- **Komponen wajib:** label nomor, judul item, penjelas, contoh dalam bahasa target (aksara + bacaan + arti), ilustrasi kecil bila ada.
- **Referensi:** Ciao Manda `menyapa-klien`; grid Koey "5 jebakan partikel".

### C. Timeline atau target
- **Dipakai untuk:** rencana persiapan, target waktu, roadmap level.
- **Alur:** cover → kartu per target waktu (rentang + fokus) → kotak Catatan → penawaran.
- **Komponen wajib:** ikon penanda, label rentang waktu, kata "Fokus:", kotak Catatan "bukan jaminan".
- **Referensi:** Jepang Koey `target-jepang`.

### D. Kerangka dan alur keputusan
- **Dipakai untuk:** pilihan jalur, keputusan besar orang tua.
- **Alur:** cover maskot → kartu header pill + alur ikon + 3 poin `kata kunci → pertanyaan` → opsi bernomor → penutup pergeseran sudut pandang + CTA.
- **Komponen wajib:** header pill, alur ikon berpanah, nomor dual-tone, baris kesimpulan dual-tone.
- **Referensi:** OTCA `jalur-cover`, `jalur-kerangka`, `jalur-3-opsi`, `jalur-penutup`.

### E. Perbandingan
- **Dipakai untuk:** kampus, beasiswa, jenis tes, jenis kelas.
- **Alur:** cover → grid 2–4 kolom → CTA.
- **Komponen wajib:** kolom berjudul, logo atau foto, poin berikon dengan label yang sama di tiap kolom.
- **Referensi:** grid Koey "Beasiswa ke Jepang"; grid Ciao "3 Universitas Top China".

### F. Edukasi berangka
- **Dipakai untuk:** gaji, potongan, biaya, istilah kerja.
- **Alur:** cover → konteks → item bernomor dengan angka dan istilah asli → CTA.
- **Komponen wajib:** angka tebal, istilah asli miring + arti, ilustrasi 3D per item, sumber di brief.
- **Referensi:** Jepang Koey `potongan-gaji-1`, `potongan-gaji-2`.

### G. Hook komentar
- **Dipakai untuk:** keberatan yang nyata dari audiens.
- **Alur:** cover kartu komentar → jawaban → bukti → CTA.
- **Komponen wajib:** kartu komentar dengan nama disamarkan, maskot.
- **Syarat:** komentarnya asli. Tidak boleh dikarang.
- **Referensi:** grid OTCA "Kelas online, tapi anak susah fokus?".

### H. Fitur produk
- **Dipakai untuk:** portal, laporan belajar, alur kelas.
- **Alur:** cover mockup → langkah 1-2-3 → manfaat → CTA.
- **Komponen wajib:** mockup perangkat dengan UI asli, kartu langkah, baris alur `LOGIN → PILIH LEVEL → KERJAKAN UJIAN`.
- **Referensi:** Info Jerman `portal-3-langkah`, `portal-progres`.

### I. Penutup penawaran
- **Dipakai sebagai:** slide terakhir arketipe lain, atau konten konversi.
- **Komponen wajib:** kalimat ajakan, daftar bonus berikon, kotak CTA, maskot pose ajakan.
- **Referensi:** Jepang Koey `penawaran-2027`; Ciao Manda `kenapa-daftar`, `penutup-bonus`.

## Single image

### J. Bukti
- **Dipakai untuk:** cerita siswa, achievement, Wall of Success.
- **Komponen wajib:** aset asli (foto, sertifikat, cuplikan), nama, kutipan atau hasil, CTA. Wajib ada izin.
- **Referensi:** grid OTCA "Cerita Siswa", "Student Achievement"; grid Koey "Wall of Success".

### K. Promo
- **Dipakai untuk:** harga, tier, periode.
- **Komponen wajib:** tabel atau tier, harga coret dan harga promo dari `products.json`, periode, fitur.
- **Referensi:** grid Ciao "Gold Mandarin Deals"; grid Info Jerman "Super Promo Best Deal".

### L. Program
- **Dipakai untuk:** nilai kelas, sering dengan cuplikan kelas.
- **Komponen wajib:** headline, screenshot kelas asli, baris garansi (S&K), 2–3 manfaat dengan ikon.
- **Referensi:** grid Koey "Fondasi Kuat"; grid Ciao "Salah Pengucapan?".

## Komposisi mingguan

| Pilar | Slot | Arketipe yang cocok |
|---|---|---|
| Problem / Education | 3 | A, B, C, D, E, F, G |
| Student / Parent Story | 2 | J, atau Reels (Video Editor) |
| Proof / Achievement | 2 | J |
| Tutor Authority | 1 | Reels, atau J dengan profil tutor |
| Program / Value | 1 | H, L |
| Conversion | 1 | K, I |

Dalam satu minggu, tiga slot Problem / Education tidak boleh memakai arketipe yang sama.

## Aturan ikon dan ilustrasi

Disetujui user pada 5 November 2026.

Info Jerman memakai aset 3D buatan sendiri `c-*` (`npm run make3d`) sebagai aset utama, dominan charcoal, kuning, dan krem mengikuti feed live. Buat objek khusus topik di `scripts/3d/scene.js` bila belum ada.

- **Sumber ikon:** 3dicons lebih dulu. Bila tidak ada yang cocok dengan konten, pakai Microsoft Fluent. Keduanya wajib versi multi-warna brand dari `assets/icons/<brand>/`, bukan warna aslinya.
- **Warna:** warna utama ikon adalah warna brand atau putih keabu-abuan. Hitam dan charcoal hanya aksen kecil (`config/icon-palettes.json`).
- **Peletakan:** ilustrasi utama wajib tersusun sebagai adegan dari `config/scenes.json`: ikon bertumpuk, ukuran berbeda, sedikit miring, ada bayangan lantai dan garis aksen. Ikon tidak boleh hanya dijejer.
- **Adegan baru:** bila topik tidak cocok dengan adegan yang ada, tambahkan adegan baru di `config/scenes.json` dengan pola yang sama.

## Tetap dan bebas

Keputusan user 5 November 2026: arketipe adalah titik awal, bukan cetakan. Konten dalam satu minggu tidak boleh terlihat sama.

| Tetap | Bebas |
|---|---|
| Logo: file, posisi, clear space | Komposisi slide isi: posisi, ukuran, arah baca |
| Pola cover brand | Jumlah kolom, bentuk kartu, susunan poin |
| Warna, font, footer, safe zone | Metafora visual: tangga, percakapan, angka besar, papan catur, orbit |
| Klaim, sumber, voice brand | Posisi maskot dan ilustrasi |

Untuk slide isi, utamakan layout `free` dan pilih bentuk yang mengikuti isi: urutan naik menjadi tangga, pertanyaan menjadi gelembung chat, angka penting menjadi angka besar. Dalam satu minggu, dua slide isi tidak boleh punya komposisi yang sama.

## Potongan maskot

Disetujui user pada 5 November 2026.

- Memotong maskot itu pilihan, bukan keharusan. Pilih per slide mana yang lebih baik.
- Potong (setengah badan) bila maskot berada di balik judul atau ruangnya sempit, misalnya cover dan penutup. Potongan bawah dilebur ke latar (`mascot` varian `bust` dengan `bustMask`, atau `fade`), minimal sampai tangan terlihat, tidak pernah garis lurus.
- Tampilkan utuh bila ada ruang dan maskot berinteraksi dengan isi, misalnya melambai atau menunjuk ke kartu. Kakinya berdiri di dasar slide, jangan melayang.
- Bila dipotong, badan maskot terus turun ke balik judul tanpa jarak, supaya bekas potongan tersamar oleh tulisan. Di latar terang, tutup badan bawah dan latar sekaligus dengan kabut putih (`bar` varian `fog`, di antara maskot dan teks), seperti feed live Koey. Jangan hanya memudarkan maskotnya.
- Variasikan posisi antar-slide (kanan, kiri, tengah), dan pilih pose yang cocok dengan isi.
- Pilih pose yang ikut bercerita sesuai isi slide (koper untuk keberangkatan, laptop untuk kelas online, kaca pembesar untuk pertanyaan), bukan maskot berdiri diam di setiap slide. Disetujui user 5 November 2026 untuk Info Jerman dan OTCA. Pose kecil (sekitar 350 px) dipakai di slide isi dan penutup; cover tetap memakai file resolusi tinggi.
- Jangan menjepit maskot di pojok bersama kalimat pendek. Teks tidak menabrak maskot, dan tidak ada kata yang turun sendirian di baris terakhir.

## Variasi antar-konten (arahan user, 7 November 2026)

Berlaku untuk keempat brand. Standar PDF mengunci sistem (logo, warna, font, footer, batas baris, jarak, QA), bukan satu template. Maskot, posisi, dan susunan isi dipilih per tema, dan struktur carousel sebelumnya tidak disalin.
