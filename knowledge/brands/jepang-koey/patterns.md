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
