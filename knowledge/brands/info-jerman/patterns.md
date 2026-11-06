# Info Jerman: pola visual

Sumber: 5 slide live dan grid feed 10 post. File ada di `refs/`.

## Dasar

- Gradasi krem #F7F1E2 ke kuning #F3CF45 dari atas ke bawah. Charcoal #25272B untuk teks.
- Logo di atas tengah. Footer `infojerman.id` dengan ikon globe di tengah bawah.
- Font Montserrat mengikuti feed live (keputusan user 5 November 2026), menggantikan Lato di guideline.

## Tipe cover

| Tipe | Ciri | Contoh |
|---|---|---|
| Orang asli | Foto tutor atau siswa setengah badan, gradasi kuning di bawah, headline kapital charcoal | Grid: "Investasi kursus bahasa Jerman" |
| Maskot | Maskot berpose, gelembung B1/B2, gradasi kuning | Grid: "Ausbildung itu harus punya sertifikat B1 atau B2 sih?" |
| Mockup | Tablet atau ponsel menampilkan portal | Grid: "Belajar terus, lalu progresnya gimana?" |

Baris kecil di bawah headline, misalnya "Swipe buat tau caranya" dengan ikon panah.

## Tipe slide isi

| Tipe | Ciri | Contoh |
|---|---|---|
| Tips tengah | Pill "Tips Belajar", headline kapital tengah, ilustrasi 3D besar, pill subjudul, 3 kartu krem berikon, pill gelap punchline | `absen-ketinggalan` |
| Tips kiri | Pill, headline kiri, ikon stopwatch kanan, pill kuning, badge "3x10 menit", 3 kartu putih pill dengan label waktu | `3x10-menit` |
| Tips grid | Headline tengah, ilustrasi clipboard + buku "Deutsch", grid 2x2 kartu berikon, 2 pill gelap | `lembur` |
| Langkah portal | Foto bangunan samar, judul dalam pill, mockup ponsel, 3 kartu kuning, baris alur | `portal-3-langkah` |
| Manfaat + maskot | Highlight pill kuning di headline, maskot pose semangat, kartu putih, 3 pill kuning, kotak CTA | `portal-progres` |

## Komponen yang sering muncul

- Ilustrasi dan ikon 3D warna kuning-hitam: kalender, jam, target, buku, kaca pembesar, kamera, clipboard, grafik.
- Pill kuning dan pill charcoal.
- Maskot cowo berkacamata berjas dan cewe berhijab kuning.
- Foto bangunan Jerman samar di latar.
- Mahkota 3D untuk promo.

## Tipe single

- **Promo:** tabel fasilitas dengan kolom Super Promo disorot, mahkota, periode.
- **Testimoni:** headline, foto dalam kartu, baris garansi, 3 manfaat.

## Arah desain pilot (5 November 2026, draf pertama)

**Sudah dibandingkan dengan 3 carousel live dan belum sesuai. Lihat bagian "Selisih dengan feed live" di bawah; bagian itu yang berlaku.**

Mengikuti feed live, bukan gaya OTCA:
- Latar krem ke kuning. Foto bangunan Jerman pudar di separuh atas (`photoFilter` abu-sepia, opacity rendah, pudar ke bawah lewat `innerMask`), tanpa garis batas.
- Sorotan judul berupa kotak kuning di belakang teks charcoal (`duoStyle: box`), seperti "YUK PANTAU PROGRES". Bukan teks kuning di atas krem.
- Cover: maskot cowo atau cewe di kiri dengan 3 lencana ikon, headline kapital di bawah, sorotan kotak charcoal, baris "Swipe buat ..." di bawahnya.
- Slide isi memakai pola live: pill "Tips Belajar" atau "Info ...", judul kapital tengah, ilustrasi 3D tersusun, kartu putih berikon atau bernomor, pill charcoal untuk punchline di bawah.
- Tidak memakai lengkungan dan titik besar di sudut (tidak ada di feed live); hanya kilau kecil.
- Angka besar berwarna charcoal (`bigInk`).

## Selisih dengan feed live (5 November 2026)

Sumber: 10 slide di `refs/` (`b1b2-*`, `portal-*`, `biaya-*`), dibandingkan dengan pilot minggu 16 November.

| Hal | Feed live | Pilot draf pertama |
|---|---|---|
| Cover | Maskot besar di tengah, tubuh bawah melebur ke kuning, pose dan properti sesuai topik | Maskot berdiri utuh di kiri + 3 lencana (pola OTCA, bukan Info Jerman) |
| Headline cover | Charcoal polos rata kiri, bayangan halus, tanpa kotak | Kotak charcoal berteks kuning |
| Baris swipe | Tebal, dengan panah dalam lingkaran | Tipis, tanpa panah |
| Font | Montserrat ExtraBold di 10 slide | Lato (guideline) |
| Sorotan judul | Pill kuning bulat penuh, bayangan halus; bisa dua pill bertumpuk kuning + putih | Kotak kuning sudut kecil |
| Latar | Satu adegan tetap per seri: menara gereja dan rumah Fachwerk dalam kabut krem, atau gedung bata dan pohon | Foto berganti per konten |
| Gradasi | Kuning sudah pekat sejak sekitar 60–70% tinggi slide (#F1DB82 ke #EDD05F) | Baru pekat di dasar slide (#F6EAC1 di 60%) |
| Ikon | Besar, tanah liat charcoal + kuning + krem, kontras kuat, dibuat untuk topik (buku "Deutsch" + topi wisuda, sertifikat B1/B2 + target) | Emas metalik satu nada, kecil, pudar di kartu |
| Kartu | Krem di atas kuning, ikon besar di atas, label pill, teks tengah | Putih horizontal, ikon kecil berlingkar, banyak ruang kosong |
| Komposisi | Berlapis: kolom bertangga B1/B2, angka 3 raksasa di antara pill, header pill + kartu | Tumpukan kartu seragam |
| Ukuran teks | Teks kartu besar, mengisi kartu | Lebih kecil |
| Punchline | Pill gelap besar, teks kuning, 2–3 baris | Pill kecil satu baris |
| CTA | Di dalam pill gelap atau kuning | Pita dengan ikon tangan dan panah |
| Slide penutup | Tetap berisi konten, CTA menyatu di pill | Maskot + adegan + pita CTA |
| Alur | Satu pertanyaan dijawab bertahap: bedanya, butuh yang mana, cek apa | Sebagian slide berdiri sendiri |
| Maskot | Minimal 4 pose (berpikir, garuk kepala, tablet, melangkah) | 1 pose berdiri |

Yang sudah sama: posisi logo, footer, warna krem atas, gaya bahasa santai, pill charcoal sebagai penutup kalimat.

Keputusan user 5 November 2026: font dan warna ikon mengikuti feed live, yaitu Montserrat dan ikon dominan charcoal + kuning.

## Arah desain yang disetujui (5 November 2026)

**Dikunci user. Dicek QA lewat field `design` di `config/brands/info-jerman.json`.** Pelanggaran cover, CTA, latar, frame, dan ornamen memblokir konten.

Menggantikan "draf pertama" di atas. Dipakai di `specs/2026-11-16/info-jerman/`:
- Semua slide memakai layout `free`, termasuk cover. Latar satu foto Fachwerk tetap per seri (`openverse-273142cb-5d4`, CC0), sangat pudar.
- Cover: maskot tengah dengan `variant: fade`, bubble 3D di sekitar kepala, headline charcoal polos rata kiri, baris `swipe` berpanah.
- Slide isi: `tile` (ikon besar + label pill), `col` (kolom checklist bertangga), `pill` varian `big` (judul dua pill kuning dan putih) dan `punch` (pill gelap besar), `cta` varian `pill`.
- Aset utama: 3D buatan sendiri `c-*` (`npm run make3d -- info-jerman`, sumber `scripts/3d/scene.js`). Objek bisa ditulisi teks, contoh `bubble('der?')` dan `cert('B1')`.
- Maskot baru punya 1 pose. Pose berpikir, garuk kepala, tablet, dan melangkah butuh file asli dari tim.

### Variasi bentuk (hasil bedah "Cek 3 Hal ini", 5 November 2026)

Satu komposisi tidak boleh dipakai di semua slide. Pilihan yang tersedia di layout `free`:
- Judul: dua pill bertumpuk di tengah (`pill` varian `big`, kuning + putih), judul sebaris dengan garis bawah (`bar`), atau judul dua baris rata kiri.
- Pengantar: kalimat tengah dengan kata kunci tebal, teks medium (`**kata**`).
- Kolom besar: pill gemuk huruf campur (`pill` varian `fat`) mengapit angka raksasa, jarak rapat.
- Kartu: `card` varian `note` (sudut kecil, ikon besar, judul disorot pill krem, pakai titik dua).
- Pill menumpang kartu (pola 4 komponen), pill berpengapit garis putih (`pill` varian `flank`), strip putih penutup (`card` varian `strip`), catatan miring di kartu putih.
- Penutup slide bergantian: pill gelap, strip putih, atau CTA pill.

## Metrik PDF "Problem Edukasi - Indah" (6 November 2026)

28 halaman, 8 carousel, kanvas 1080x1350. Angka diukur dari teks PDF dan bagian padat gambar. Lembar ringkas: `refs/pdf-indah-hal-1-24.jpg`, `refs/pdf-indah-hal-25-28.jpg`. **Belum diterapkan ke render; menunggu keputusan user.**

### Tiga keluarga tampilan

| Halaman | Latar | Footer | Headline cover | Judul isi |
|---|---|---|---|---|
| 1–6 | foto krem, pita kuning padat di bawah | Medium 21,3, y 1300 | ExtraBold 73,3, langkah 95 | ExtraBold 60 + 53,3 Title Case, kotak nomor kuning |
| 7–14 | foto krem, pita kuning padat di bawah | Medium 21,3, y 1299 | ExtraBold 66,7–72, langkah 86–93 | Bold 60 atau ExtraBold 40 dalam dua pita |
| 15–28 | krem ke kuning, tanpa pita | Medium 24, x 482–645, y 1295 | Black 66,7 atau ExtraBold 66,7, langkah 86 | ExtraBold atau Black 53,3 kapital |

### Keluarga terbaru (hal. 15–28)

- Logo: bagian gelap ±122 x 74, y 74–148, tengah.
- Gradasi tepi kiri: #F5F0E2 di y 500, #F2E4B5 di y 700, #EFD577 di y 800, #F0D158 di y 900, #F3CF45 padat mulai y 1100.
- Cover: maskot tengah, lebar padat 446–457, puncak ±195–288, bawah melebur ke kuning. Headline x 85, y 859, 3 baris; hal. 19 mulai y 916, x 108. Sub Bold 40, y 1137, langkah ±52; baris swipe Bold 33,3–40.
- Teks: #25272B. Sorotan judul: pill #F3CF45 tinggi ±72, teks tetap charcoal.
- Isi: paragraf 33,3; label kartu SemiBold atau Bold 33,3; teks kartu Medium 24–26,7.
- Pill kuning: tinggi 74, teks Bold 33,3. Pill charcoal: tinggi 57 (1 baris) atau 91 (2 baris), teks Bold 26,7 #F3CF45.
- Kartu 3 kolom: 283 x 259 jarak 37 (hal. 20), 319 x 289 jarak 28 (hal. 25). Kartu 2x2: 399 x 132 jarak 24 (hal. 22). Warna #F7F1E2 atau putih.

### Selisih dengan render kita (pilot 2026-11-16-07-jumat)

| Hal | PDF terbaru | Kita |
|---|---|---|
| Headline cover | 66,7 Black, x 85, y 859, langkah 86 (1,29) | 74 ExtraBold, x 56, y 779, jarak baris 1,12 |
| Judul isi | jarak baris ±1,29 | 1,12, spasi huruf -0,3 |
| Footer | Medium 24, y 1295 | Bold 21, y 1261, spasi huruf 0,2 |
| Logo | 122 lebar, y 74 | 148 lebar, y 65 |
| Kuning padat | mulai y 1100 | baru di y ±1300 |
| Maskot cover | lebar 446–457 | lebar 236–270 |
| Pill kuning | tinggi 74 | tinggi 56 |
| Pill charcoal | Bold 26,7, tinggi 57 atau 91 | ExtraBold 33, teks 84 |

## Standar aktif (dipilih user 6 November 2026): PDF hal. 15–28

Berlaku otomatis lewat kelas `.brand-info-jerman` di `src/render/base.css`; gradasi di `config/brands/info-jerman.json`. Headline cover maksimal 3 baris, sub 2 baris (QA). Posisi cover: maskot besar di tengah (`x 30, y 14.4, w 40, h 85`, persen kanvas), judul 3 baris mulai y 859, judul 2 baris mulai y 945, baris swipe y 1163.
**Logo belum sama:** logo di PDF berbeda dari `assets/brands/info-jerman/logo/primary.png`. Perlu file resmi dari tim.

Pembaruan 6 November: logo `primary.png` kini diambil dari lapisan transparan PDF (124 x 75 px, tampil 1:1), logo lama di `logo/_asli`. Logo ini kecil, jadi jangan diperbesar; `white.png` masih versi lama. Label kartu mengikuti PDF hal. 17: pill 33,3 setinggi 74 menempel di tepi atas kartu. Blokir ketat QA spasi aktif (`design.spacingStrict`).
- Kolom (hal. 24): pill level 283 x 57 dan label kuning menempel tanpa jarak, ikon tinggi ±150, daftar mengisi sisa kotak. Toga duduk langsung di atas buku Deutsch.
- Tumpukan label (hal. 26): pill gelap x 87-435 tinggi 47, Bold 33,3 putih, menempel pada kotak kuning x 83-432 sampai y 605, radius ±26, Bold 46,7. Varian `stackhead` dan `stackbody`.
