# Jepang Koey: pola visual

Sumber: 4 slide live dan grid feed 10 post. File ada di `refs/`.

## Dasar

- Guideline: 60% terang, 25% tipografi atau foto, 15% merah. Merah #D71920, charcoal #20252B, warm white #FAF8F5, cool mist #EAF1F5, soft gold #E8B957 terbatas. Lato.
- Logo di atas tengah atau kiri atas. Footer pill merah dengan ikon globe `www.otca.co.id`.
- Grid feed memakai latar merah penuh pada banyak post. Porsi merah tetap mengikuti guideline, sesuai keputusan user.

## Latar slide isi

- Foto Jepang sangat samar: Fuji dengan sakura, kuil, atau jalanan kota, memudar ke putih.
- Ornamen awan bergaya Jepang di sudut atas, warna merah muda.
- Bintang kecil kuning sebagai aksen.

## Tipe cover

| Tipe | Ciri | Contoh |
|---|---|---|
| Maskot + lanskap | Maskot besar, foto kuil samar, highlight putih pada headline | Grid: "Kuasai Bahasa Jepang untuk Karier IT & Manufacturing" |
| Bukti | Foto sertifikat JLPT, maskot, highlight pada kata kunci | Grid: "Bukti Peningkatan Kemampuan" |
| Orang asli | Wajah siswa, highlight pada kata kunci | Grid: "Dari Nol sampai Bisa Ngomong Jepang" |
| Maskot + properti | Maskot memakai headset, ikon gelombang suara, kartu ajakan merah | Grid: "Tips Menghadapi Audio Ujian Choukai" |

## Tipe slide isi

| Tipe | Ciri | Contoh |
|---|---|---|
| Timeline kartu | Judul merah dengan bayangan, kartu putih berikon pin 3D, rentang merah, "Fokus:" tebal, kotak Catatan merah dengan ikon buku | `target-jepang` |
| Kartu konteks + daftar | Kartu pembuka merah, subjudul, kartu putih besar, label nomor merah berpita, ilustrasi 3D kanan, garis putus-putus antar item | `potongan-gaji-1` |
| Daftar berlabel | Label nomor + label judul berbentuk pita merah, isi, ilustrasi 3D kanan | `potongan-gaji-2` |
| Infografis padat | 5 item dalam satu slide, ilustrasi kecil tiap item, kotak ajakan di bawah | Grid: "5 Jebakan Soal Partikel" |
| Grid perbandingan | 4 kotak beasiswa dengan logo, daftar cakupan, kotak CTA | Grid: "Beasiswa ke Jepang" |

## Tipe penutup

Judul merah, kartu putih berisi daftar centang hijau bonus, papan "FREE" 3D, stiker "BONUS", kotak merah CTA komentar, maskot tutor membawa buku. Contoh: `penawaran-2027`.

## Komponen yang sering muncul

- Ikon 3D realistis: pin, hati, koper, koin, rumah, buku catatan.
- Maskot cowo berjas merah dan cewe berhijab berkimono merah.
- Kotak Catatan untuk disclaimer.
- Istilah Jepang miring dengan arti.

## Arah desain yang disetujui (5 November 2026)

**Dikunci user.** QA memblokir lewat field `design` di `config/brands/jepang-koey.json`: tampilan slide hanya merah (default), `cover`, atau `sky`; cover wajib bermaskot; CTA hanya di slide penutup dan berbentuk tombol; tanpa frame atau foto tempelan.

**Keputusan user:** ikuti feed live, termasuk font Montserrat dan porsi merah sekitar 35% dari gradasi bawah.

Sumber: 12 slide live di `refs/` (`jalur-*`, `industri-*`, `choukai-*`). Dua gaya dipakai bergantian:

**Gaya merah (`skin` cover dan default):**
- Foto berbeda per slide (`bg` per slide): cover jelas, slide isi buram dan pudar putih di atas, gradasi merah pekat di bawah mulai sekitar 65%.
- Ornamen garis Koey: pil kontur, gelombang, dan garis merah di kanan atas; versi putih di kiri bawah.
- Cover: maskot bust di kiri di atas headline, sorotan kotak putih bertulisan merah, sisa headline putih, sub putih tebal. Footer teks putih.
- Slide isi: judul merah Title Case, ikon 3D besar di tengah, poin bulat, kotak gelap `QUICK TIPS` dengan lampu, atau kotak gelap dengan label kuning `Solusi Jepang Koey`.
- Variasi: judul di kotak putih, kartu tulisan Jepang, maskot bust di kiri bawah dengan kalimat putih.
- Penutup: maskot di tengah, judul kotak putih bertumpuk, tombol merah mengilap dengan cincin terang.

**Gaya langit (`skin: sky`):** latar biru muda dengan pagoda dan Fuji pudar, lantai berpola grid, pita awan merah di sudut atas. Maskot besar dengan properti 3D, judul merah berpendar putih, kartu merah, kartu putih bernomor dengan pita merah, footer pill merah.

Batas QA `accentMaxPct` dinaikkan ke 45 mengikuti keputusan ini.

Aset 3D `c-*` palet merah, putih, charcoal, dan emas (`npm run make3d -- jepang-koey`), termasuk torii, bendera Jepang, papan FREE, stiker BONUS, buku 日本語, dan sertifikat N4/JFT.

### Detail yang sudah dikoreksi user (5 November 2026)

- Kotak `QUICK TIPS`: lingkaran gelap berisi lampu bergaris dengan sinar (bukan bola 3D), label kuning di sampingnya, teks dengan jarak tetap. Di kotak sempit (di bawah ~85% lebar) pakai label di atas (`tip` varian `top`) supaya teks tidak turun tiga baris.
- Cover langit: maskot besar, badan bawah tertutup kabut putih (`bar` varian `fog`), judul merah langsung di atas kabut tanpa jarak.
- Lampu 3D (`c-bulb`) berbentuk bola kaca, ulir, dan sinar, supaya terbaca sebagai ide.

## Metrik 3 PDF Canva Week 1 Nov 2026 (Campaign, Problem Education, Proof & Achievement), diukur 6 November 2026

13 halaman, satu keluarga tampilan. Lembar ringkas `refs/pdf-week1-nov.jpg`. **Belum diterapkan ke render; menunggu persetujuan user.**

- **Logo:** horizontal (ikon JK merah + "JEPANG KOEY by OTCA"), x 462–617, y 20–86 (155 x 66), sama di semua halaman. File di PDF 240 x 102 (xref 38 dst.). Berbeda dari `logo/primary.png` kita (vertikal, 209 x 89, y 58).
- **Footer:** Open Sans Regular 19,2 putih, `www.otca.co.id  |  @jepang.koey`, tengah, y 1281, langsung di atas merah padat, tanpa pill dan tanpa globe.
- **Ornamen:** garis lengkung merah #D60000 di kanan atas (x 973–1239, y -16–135) dan garis putih di kiri bawah (x -126–142, y 1257–1408).
- **Latar:** foto Jepang (Fuji, kuil, sakura, ruang belajar) di atas, memudar ke merah. Tepi kanan slide isi: putih sampai y 800, #EAABA9 di y 900, #DD625B di y 1000, #DB3733 di y 1100, #D30000 padat dari y ±1260.
- **Cover:** maskot cowo berbaju gi merah (aset baru, belum ada di folder kita) di kiri, padat x 65–307, y 507–1167. Headline ExtraBold 67,3, x 77, mulai y 855, langkah 78 (1,16), maks 3 baris. Baris berkotak putih persegi (tanpa radius) tinggi 82 dengan teks merah #D40000; baris tanpa kotak putih. Sub SemiBold 32,1 putih, y 1102, langkah 42.
- **Judul isi:** ExtraBold 53,4 merah #D40000, rata kiri x 108, y 188–265, langkah 61 (1,14), Title Case.
- **Isi:** ikon 3D besar di tengah (±320 x 290), poin bullet SemiBold 29,4 #303030, langkah 39.
- **Kotak catatan:** charcoal #20252B, x 125–1010, tinggi ±181; label kuning #FAD703 "QUICK TIPS" atau pill kuning "Solusi Jepang Koey" (Bold 29,4); teks SemiBold 29,4 putih.
- **Penutup:** maskot tengah, judul ExtraBold 55,3 merah dalam kotak putih (x 157–923), CTA tombol merah, Bold 28,6 putih.
- **Promo:** angka harga Bold 61,8–67,9 merah, label pill, harga coret Regular 18–20.

## Standar aktif (divalidasi user 6 November 2026)

Berlaku lewat kelas `.brand-jepang-koey` di `src/render/base.css` dan `config/brands/jepang-koey.json`. Logo horizontal dan maskot `cowo-gi-*` diambil dari gambar di PDF (logo lama di `logo/_asli`, `white.png` belum diganti). Merah #D40000 dan #D30000. Skin `sky` tidak dipakai lagi: tampilan hanya `cover` dan default. Headline cover maks 3 baris, sub dan kalimat maks 3 baris, blokir ketat spasi aktif. Maskot cover dan penutup melebur ke merah sebelum headline. Judul 2 baris di cover mulai y 933 supaya dekat dengan sub.

Revisi 6 November (perbandingan kedua): maskot cover dan penutup memakai gambar PDF utuh (`cowo-gi-berdiri-pdf`, kotak gambar cover x -24..434 y 490..1201, penutup x 291..749 y 255..966) tanpa mask; gi merah menyatu dengan merah latar. Penutup: satu kotak putih membungkus seluruh judul (x 157..923, y 750..957), tombol CTA memakai gambar tombol dari PDF (`feed/cta-btn.png`, x 226..854, y 993..1194), teks Bold 28,6 putih.
- Lapisan cover: foto, scrim, maskot (z1), kabut merah depan kaki y 780-1215 (z2), headline dan sub (z3). QA `TEXT_COVERED` memblokir teks yang tertutup.
- Ikon 3D (revisi 6 Nov): bayangan tanah lembut di bawah ikon (`.fic::after`), ikon rata bawah dalam kotaknya, seperti render di PDF.
- Ikon slide isi: bagian terlihat maks 420 x 350 px (user minta lebih besar dari ukuran awal), tengah x 540, bawah y 690; daftar mulai y 722.
