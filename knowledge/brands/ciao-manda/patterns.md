# Ciao Manda: pola visual

Sumber: 3 slide live dan grid feed 10 post. File ada di `refs/`.

## Dasar

- Guideline: 55% ivory #F8F6F2, 25% merah (#BD2331, deep red #79202A), 15% graphite #242830, 5% gold #D4A65C. Lato.
- Logo di atas tengah. Footer pill merah atau putih dengan ikon globe `www.otca.co.id`.
- Feed live memakai headline Montserrat dan beberapa headline outline, berbeda dari Lato di guideline.

## Latar

- Gradasi terang ke deep red di bagian bawah.
- Foto skyline atau bangunan samar.
- Pada sebagian konten live: lampion di sudut atas dan bintang kuning. **Belum diputuskan** apakah dipertahankan.

## Tipe cover

| Tipe | Ciri | Contoh |
|---|---|---|
| Maskot + skyline | Maskot besar di tengah, headline kapital putih di bawah pada gradasi merah | Grid: "Satu kantor, bisa beda gaji karena Mandarin?" |
| Maskot + gelembung hanzi | Maskot, gelembung 你好 dan 您好, headline merah | Grid: "Salah cari sapaan bisa bikin deals gagal?" |
| Orang asli | Wajah siswa atau tutor, gradasi merah | Grid: "Lanjut HSK 2 karena jadwal fleksibel!" |
| Dokumen | Laporan belajar miring, gradasi merah | Grid: "Gimana cara pantau progres belajarmu?" |

## Tipe slide isi

| Tipe | Ciri | Contoh |
|---|---|---|
| Kartu berlabel | Judul merah tengah, 3 kartu putih bayangan, label nomor + label judul merah, hanzi tebal + pinyin + arti dalam kurung | `menyapa-klien` |
| Grid kolom | 3 kolom universitas dengan foto, label ikon: Ranking, Kelebihan, Cara Masuk | Grid: "3 Universitas Top China" |
| Cuplikan kelas | Screenshot materi di bingkai merah, label kelas, pita garansi, 2 manfaat | Grid: "Persiapan HSK Lebih Terarah" |

## Tipe penutup

| Tipe | Ciri | Contoh |
|---|---|---|
| Kartu alasan | Judul, paragraf singkat, kartu "Kenapa Daftar Sekarang?" dengan 3 ikon 3D, maskot melambai | `kenapa-daftar` |
| Kartu bonus | Pertanyaan hook, kartu merah (Klik link di bio + Extra Bonus), kartu kutipan miring, maskot headset | `penutup-bonus` |

## Komponen yang sering muncul

- Ikon 3D: buku, gelembung chat, tangan menunjuk, bintang bonus.
- Maskot cowo berbaju tang merah, cewe berhijab berbaju tang.
- Pita garansi di bawah cuplikan kelas.

## Arah desain yang disetujui (5 November 2026, mengikuti feed terbaru)

**Dikunci user.** QA memblokir lewat field `design` di `config/brands/ciao-manda.json`: tampilan slide hanya `cover` atau `ivory`, CTA hanya di slide penutup, tanpa lampion, frame, atau foto tempelan.

Sumber: 10 slide live terbaru yang dikirim user (tidak tersimpan sebagai file karena terkirim di tengah percakapan) dan `refs/`.

- **Palet:** deep red #79202A dominan, krem keemasan untuk aksen, ivory #F8F6F2. Font Montserrat mengikuti feed live.
- **Latar slide isi (`skin: ivory`):** ivory bermotif gelombang halus, foto istana pudar di tengah (`openverse-1e41ac53`), gradasi marun di bawah mulai sekitar 55%. Tanpa lampion (feed terbaru tidak memakainya).
- **Cover (`skin: cover`):** maskot besar di tengah, headline kapital putih di area marun, sub putih, footer teks putih.
- **Judul slide isi:** marun Title Case berbingkai putih dengan bayangan (`title` warna `outline`).
- **Kartu:** kartu ivory besar berisi ikon 3D seragam (sekitar 130 px) di kiri dan teks rata kiri. Contoh kalimat disusun hanzi tebal, lalu pinyin dan arti. Maskot berdiri utuh menumpang di tepi kanan kartu, tidak menutup teks.
- **CTA:** hanya di slide penutup berpola "Kenapa Daftar Sekarang?". Poin terakhirnya memakai ikon tangan menunjuk dan diakhiri **Klik link di Bio!**, lalu kalimat "Simpan postingan ini..." putih di bawah kartu. Kartu tips atau contoh tidak berisi CTA (user menilai CTA di sana muncul tiba-tiba).
- **Kartu daftar 2x2:** gelembung hanzi 3D di atas, pinyin dalam pill marun, arti tebal, dan kapan dipakai, supaya tidak kosong.
- **Motif gelombang:** garis putih di atas latar abu-merah muda terang (#EFE9E7), lebih cerah seperti feed live.
- **Footer:** pill putih bertinta marun di slide isi.
- **Maskot:** baju diwarnai ulang ke marun dengan aksen krem dan hijab krem (`python scripts/recolor-ciao.py`). Asli tersimpan di `assets/brands/ciao-manda/mascots/_asli/`.
- **Logo:** merah digelapkan ke #79202A atas permintaan user. Asli di `assets/brands/ciao-manda/logo/_asli/`.
- **Ikon 3D `c-*`:** deep red, krem, graphite (`npm run make3d -- ciao-manda`), termasuk tangan menunjuk dan gelembung hanzi.
