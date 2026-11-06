# Official OTCA: pola visual

Sumber: 4 slide carousel "Jalur ke Jerman" dan grid feed 10 post. File ada di `refs/`.

## Dasar

- Hitam dominan, emas #CB9D31 dan gradasi emas, putih untuk isi. Montserrat.
- Logo non-glow di atas tengah. Footer `www.otca.co.id | @official.otca` di tengah bawah.

## Tipe cover

| Tipe | Ciri | Contoh |
|---|---|---|
| Foto landmark + maskot | Foto gedung Jerman terlihat jelas, maskot di tengah kiri, pita hitam di bawah berisi headline | `jalur-cover` |
| Orang asli | Wajah tutor atau siswa, gradasi hitam ke bawah | Grid: "Belajar online, siswa OTCA lolos sertifikasi" |
| Cuplikan kelas | Screenshot Zoom, papan tulis, atau materi; headline di bawah | Grid: "Ketemu grammar baru" |
| Kartu komentar | Kartu putih seperti komentar IG, nama disamarkan, maskot di bawahnya | Grid: "Kelas online, tapi anak susah fokus?" |

Headline cover: kapital, 2–3 baris, putih + emas. Sub 2 baris putih. Tanpa CTA.

## Tipe slide isi

| Tipe | Ciri | Contoh |
|---|---|---|
| Kartu kerangka | Foto samar di latar, judul gradasi emas Title Case, kartu putih bertepi emas, header pill putih, alur 3 ikon garis dengan panah emas, 3 bullet `Kata kunci → pertanyaan`, baris kesimpulan dual-tone | `jalur-kerangka` |
| Daftar opsi | Foto gelap di latar, judul gradasi emas, nomor 01–03 dual-tone besar, subjudul emas, isi putih, kesimpulan dual-tone | `jalur-3-opsi` |

## Tipe penutup

Judul dua warna (putih + emas), kalimat penjelas, maskot dengan properti chat, kartu putih CTA dengan badge emas "KOMEN" dan ikon tangan. Contoh: `jalur-penutup`.

## Tipe single

- **Cerita Siswa:** judul dua warna, kutipan miring, foto dalam bingkai emas, pita nama, CTA putih.
- **Student Achievement:** tumpukan sertifikat, wreath emas, nama pada pita, "Berhasil Lulus Goethe Zertifikat B1", CTA putih.

## Komponen yang sering muncul

- Latar: foto Reichstag atau bangunan Jerman tetap tampil di slide isi, makin gelap ke bawah.
- Maskot robot hitam-emas berjas, dengan properti sesuai topik: peta Jerman, topi wisuda, jam, buku, chat.
- Ornamen garis emas melengkung pada latar hitam single.
- Nomor dual-tone: angka 0 putih, angka kedua emas.

## Arah desain yang dipilih (5 November 2026)

Arah A, Editorial, dipilih user dengan syarat tetap mengikuti guideline dan pola feed live:
- Judul dual-tone (putih + emas gradasi), boleh rata kiri atau tengah sesuai komposisi.
- Baris bergaris emas tipis menggantikan kartu tempelan. Level atau kata kunci memakai huruf kerangka, yang terpenting emas solid.
- Pola feed yang tetap dipakai: kartu putih berheader pill dengan alur ikon (`panel`), nomor dual-tone 0 putih dan angka emas (`rows` varian `num`), papan catur 2x2 (`grid` varian `checker`), maskot di slide penutup, CTA "KOMEN STUDI".
- Angka penting boleh menjadi tokoh utama (`big`).
- **Keputusan user:** setiap slide, termasuk slide isi dan promo, wajib berlatar foto bangunan atau pemandangan kota Jerman, di-zoom ke detail bangunan seperti feed live (`zoom` 1.2–1.6). Foto tampil jelas di atas lalu menggelap ke bawah. Tingkat gelap diatur per slide sesuai kebutuhan keterbacaan (`shade`: light, mid, dark). Tidak ada slide berlatar hitam polos.
- **Keputusan user:** ornamen garis emas mengalir dan kilap sudut tidak dipakai. Garis frame emas di tepi slide juga tidak dipakai (keputusan user, 5 November 2026).
- Foto bangunan yang tersedia: Reichstag (`582dd4f6`, `cc26331a`), Berliner Dom (`2ffc5811`), Frauenkirche München (`71593db7`), Kölner Dom (`4ef741f6`, `c2a321be`). Gunakan foto berbeda per konten dalam satu minggu.
- **Keputusan user:** bangunan tidak harus di Jerman, asalkan bergaya klasik Eropa seperti feed live. Foto tampil berwarna dengan grading gelap (`photoFilter`), langit dramatis lebih baik.
- Cover mengikuti feed live: foto penuh di atas, pita hitam di bawah, headline kapital putih dan emas, maskot di kiri dengan 3 lencana ikon emas di sekitar tangannya (`props`).
- **Keputusan user:** tidak ada foto tempelan yang menimpa foto bangunan latar (blok `photo` tidak dipakai di OTCA). Gradasi gelap di cover dibuat lebih pekat agar headline dan maskot menonjol.
- **Keputusan user:** ikon dan ilustrasi memakai aset 3D buatan sendiri `c-*` (`npm run make3d -- otca`), warna emas metalik, perak, dan gading. Badan objek perak supaya tidak tenggelam di latar gelap; charcoal hanya untuk teks dan detail kecil. Objek khas OTCA: kampus klasik, paspor visa, gembok. Adegan penutup memakai adegan `o-*` di `config/scenes.json`.

## Ukuran dari PDF Canva "Education/Problem - Pilar OTCA" (6 November 2026)

Diukur langsung dari teks PDF, dikonversi ke kanvas 1080x1350. Dipakai lewat `skin: feed` (contoh: `specs/khusus/otca/siapa-membantu-anak.json`).

| Elemen | Font dan ukuran | Warna | Posisi |
|---|---|---|---|
| Logo | Sekitar 255 px lebar | Emas | Tengah, sekitar y 36–100 |
| Footer | Montserrat SemiBold 20 | Putih | Tengah, y 1282–1306, tanpa ikon globe, teks `www.otca.co.id \| @official.otca` |
| Headline cover | Montserrat Black 66,7, kapital, jarak baris 68 | Putih + emas | Rata kiri x 72, mulai sekitar y 837 |
| Sub cover | SemiBold 33,3 | Putih | Rata kiri x 72, sekitar y 1051 |
| Judul slide isi | ExtraBold 73,3, Title Case | Emas gradasi, bayangan gelap | Tengah, y 170–340 |
| Judul penutup | ExtraBold 73,3 | Putih + emas | Tengah, y 230–490 |
| Pita subjudul | Bold 33,3 | Putih di pita emas memudar ke kedua sisi | Tengah, sekitar y 370–460 |
| Teks kartu | Bold + Medium 29,3, jarak baris 35, format `Kata kunci → isi` | Hitam di kartu putih bertepi emas | Kartu x 104–1015 |
| Nomor | Bold 73,3 | 0 putih, angka emas #CB9D31 | Kiri, kepala Bold 29,3 emas, isi Medium 29,3 putih |
| Kalimat bawah | SemiBold 33,3 | Putih + emas | Tengah, y 1074–1200 |
| CTA | Tag ExtraBold 39,8; judul Bold 33,3; sub Medium 26,7 | Kartu putih, tag emas miring, ikon tangan | x 133–1020, y 988–1185 |

Foto: terang di atas dengan langit dramatis, satu foto untuk satu seri, hitam penuh mulai sekitar 75% tinggi slide. Tanpa kilau bintang. Jarak tepi 72 px.

### Koreksi user setelah perbandingan kedua (6 November 2026)

- **Maskot terpotong:** lapisan gradasi hitam berada di atas maskot (`bar` varian `fogdark`, z di antara maskot dan teks), jadi badan maskot tenggelam ke gelap di balik headline. Di pojok bawah, maskot terpotong tepi kanvas (`mascot` varian `bleed`). Di penutup, kaki maskot tertutup kartu CTA.
- **Emas:** judul slide isi memakai emas gradasi penuh tanpa kombinasi putih: `linear-gradient(90deg,#D0A63E,#E2C366 25%,#FCEFA2 50%,#D4B462 75%,#BA8D38)`, diukur dari PDF. Kombinasi putih + emas hanya untuk cover dan penutup.
- **Latar:** pilih bangunan yang jelas menggambarkan Jerman, misalnya Reichstag dengan bendera (`assets/brands/otca/feed/reichstag-bendera.png`, diambil dari PDF tim).
- **Tag KOMEN:** teks putih dengan bayangan gelap di atas tag emas miring, ditambah kilau dan kursor tangan dari PDF (`assets/brands/otca/feed/cta-kilau.png`, `cta-tangan.png`). Dikecualikan dari cek kontras QA.

## Ukuran teks terkunci (revisi 6 Nov, dari PDF Canva)
Dikunci di `src/render/base.css` bagian `.skin-feed` (ukuran tidak lagi menyusut otomatis). Cek dengan `node scripts/measure-text.mjs projects/otca/<slug>`.
- Headline cover: Montserrat Black 66,7 px, jarak baris 1,02, spasi huruf 0, kapital, maksimal 3 baris (QA `COVER_TITLE_LINES`).
- Sub cover: SemiBold 33,3 px, jarak baris 1,17, maksimal 2 baris (QA `COVER_SUB_LINES`).
- Judul isi dan penutup: ExtraBold 73,3 px, jarak baris 1,04, spasi huruf 0, lebar tetap di safe zone (x 72 sampai 1008).
- Pita: Bold 33,3 px, jarak baris 1,38. Kartu dan panel: 29,3 px. Baris bernomor: kepala 29,3, isi 29,3 dengan jarak baris 1,4. Pill panel 26,7. Kalimat bawah 33,3. Footer SemiBold 20 tanpa spasi huruf.
- Posisi: headline cover mulai y 840, sub y 1051, judul isi y 189, judul penutup y 248, paragraf penutup y 549.
- Headline cover yang terlalu panjang harus dipendekkan, bukan dikecilkan.

## Ukuran maskot dari PDF (kotak yang terlihat, kanvas 1080x1350)
Ukur dengan `node scripts/measure-mascot.mjs projects/otca/<slug>`.
- Cover: robot tinggi 471, kiri 137, puncak 518; lencana ±118 px di kanan robot.
- Halaman kartu (robot di kiri): tinggi 432, kiri 35, puncak 610.
- Robot terpotong pojok kiri bawah: tinggi utuh 404, kiri 21, puncak 1089.
- Penutup: lebar 341, puncak 680, bagian bawah tertutup kartu CTA (mulai 988).
- Pita: tanpa padding atas bawah; jarak pita ke kartu pertama ±34 sampai 42 px.

## Panel poin (PDF hal. 4)
- Kotak putih menyesuaikan isi (tidak ada ruang kosong di tengah), atas di y 467, lebar 803 (x 139 sampai 942), garis emas 3 px.
- Pill judul menempel di tepi atas (15 px di atas kotak), lebar ±87%.
- Poin mulai 40 px di bawah pill (pill padat berakhir y 521; kotak gambarnya sampai 550 karena bayangan), teks mulai x 188, jarak antar-poin 35 px, ruang bawah ±60 px.
- Bullet seukuran teks; panah hitam tebal, bukan emas tipis.
- Kartu bertangga (PDF hal. 2): kartu memeluk isinya, ikon ±84 px, padding atas bawah ±16 px, mulai y 501/646/803. Maskot tidak boleh menimpa kartu.
- Baris bernomor (PDF hal. 9): jarak tetap antar-teks ±60 px, jangan dibagi rata ke seluruh ruang. Kalimat bawah ikut naik mendekati daftar.
- Semua aturan jarak diperiksa otomatis oleh `src/qa/spacing.ts` (skill `cek-spasi`); OTCA memakai `design.spacingStrict`.

## Warna dan gradasi (diukur dari piksel PDF, 6 Nov)
- Pita: emas polos #CB9D31, memudar ke transparan di 30% tiap ujung, lebar 748 px (x 166 sampai 914), satu baris 64 px. Teks putih.
- Nomor baris: angka nol putih, digit kedua emas polos #CB9D31. Judul baris emas polos #CB9D31, isi putih.
- Cover: foto tidak digelapkan di bagian atas. Overlay hitam mulai y 537: alfa 0,35 di y 700, 0,54 di y 800, 0,81 di y 920, 0,87 di y 1000, hitam di bawah.
- Kalimat bawah slide isi maksimal 2 baris (QA `TEXT_LINES`).
- Butir daftar (baris bernomor dan poin panel) maksimal 2 baris (QA `LIST_LINES`).
- Emas pada kalimat (`.ftext mark`): polos #CB9D31, bukan gradasi. Gradasi emas hanya untuk judul.
- Lapisan cover: foto, gradasi utama, maskot dan lencana, kabut depan mulai y 740 (hanya menutup kaki), lalu teks.
- Kartu CTA (bagian padat): x 149-980, y 1003-1145, radius 22. Tag kapsul emas polos #CB9D31 miring 17 derajat, teks mulai x 377. Robot penutup dipotong di belakang kartu.
- Posisi PDF boleh disesuaikan isi: judul 2 baris tidak perlu segaris dengan judul 3 baris di PDF. Jarak judul ke kalimat di bawahnya ±60 px, maksimal 100 (QA `SPACE_LOOSE`).

## Layout tambahan feed OTCA (7 November 2026)

Contoh: `specs/khusus/otca/pilihan-jalur-kuliah.json`. Kolom bertangga (`col`, kartu putih bergaris emas, label emas), alur pertanyaan (kartu kiri, robot kanan), kotak 2x2 (`tile`), cover dengan robot kanan dan lencana berjajar.
