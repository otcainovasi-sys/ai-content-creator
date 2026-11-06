# info-jerman: inventaris aset

## Sudah ada

- **Logo:** `primary.png`, `white.png` (1375×710, resolusi rendah). Master resolusi tinggi belum ada.
- **Maskot transparan:** cowo-berdiri, cewe-berdiri, duo, cowo-bust, cewe-bust, cowo-cermin, cewe-cermin. Satu pose dasar; varian hanya potongan dan cermin.
- **Foto:** Foto latar sementara di `assets/stock/` (Openverse, CC0 atau public domain). Kualitas terbatas.
- **Referensi:** 16 file di `refs/`.

## Dibutuhkan

- **Maskot:** pose lain (menunjuk, membawa buku, mengangkat tangan) perlu dibuat lewat image generator atau desainer.
- **Aset bukti (dengan izin):** Foto Frau Priska dan tutor lain, screenshot Portal Exam, cuplikan kelas, sertifikat siswa, foto Azubi berizin.
- **Ikon dan ilustrasi 3D:** 157 ikon multi-warna brand di `assets/icons/<brand>/` (3dicons CC0, Fluent MIT). Ilustrasi tersusun: `config/scenes.json` (jadwal, lembur, progres, bahasa, karier, bonus).
- **Foto latar:** sebagian sudah resolusi tinggi (Openverse, CC0). Pilihan masih terbatas; key Pexels atau Pixabay di `.env`, atau foto milik tim, akan memperluasnya.

## Pose maskot (dari tim, 5 November 2026)

64 pose transparan di `assets/brands/info-jerman/mascots/`, dipanggil dengan id `cowo-<pose>` atau `cewe-<pose>`. Dipotong dari 4 sprite sheet di `D:\KERJAAN\OTCA\MASKOT INFO JERMAN` (salinan di `mascots/_sumber/`) dengan `python scripts/slice-mascots.py`.

| Kelompok | Pose |
|---|---|
| Berdiri | melambai, jempol, menunjuk-samping, menunjuk-atas, presentasi, tangan-terbuka, berpikir, semangat, baca-buku, laptop, clipboard, ponsel, oke, lipat-tangan, tangan-dirapatkan, bendera-jerman |
| Beraksi | duduk-baca, laptop-bersila, berlari, melompat, kaca-pembesar, berlutut-presentasi, membungkuk, mengintip-dinding, duduk-berpikir, tas-kerja, koper, naik-tangga, baca-lantai, menunjuk-semangat, bersandar-dinding, seimbang |

**Batas resolusi:** tiap pose sekitar 360 px tinggi. Aman dipakai sampai sekitar 400 px di slide (pendamping kartu, ilustrasi kecil). Untuk maskot besar di cover, tetap pakai `cowo-berdiri` atau `cewe-berdiri` (1268 px) sampai tim mengirim versi resolusi tinggi per pose.
