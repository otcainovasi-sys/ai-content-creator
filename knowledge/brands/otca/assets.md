# otca: inventaris aset

## Sudah ada

- **Logo:** `primary.png` (dari webp, resolusi menengah). Versi non-glow resolusi tinggi belum ada.
- **Maskot transparan:** robot-berpikir, robot-berpikir-cermin, robot-bust. Satu pose dasar; varian hanya potongan dan cermin.
- **Foto:** Foto latar sementara di `assets/stock/` (Openverse, CC0 atau public domain). Kualitas terbatas.
- **Referensi:** 5 file di `refs/`.

## Dibutuhkan

- **Maskot:** pose lain (menunjuk, membawa buku, mengangkat tangan) perlu dibuat lewat image generator atau desainer.
- **Aset bukti (dengan izin):** Foto siswa dan orang tua berizin, sertifikat Goethe, cuplikan Zoom, screenshot komentar (disamarkan), foto tutor.
- **Ikon dan ilustrasi 3D:** 157 ikon multi-warna brand di `assets/icons/<brand>/` (3dicons CC0, Fluent MIT). Ilustrasi tersusun: `config/scenes.json` (jadwal, lembur, progres, bahasa, karier, bonus).
- **Foto latar:** sebagian sudah resolusi tinggi (Openverse, CC0). Pilihan masih terbatas; key Pexels atau Pixabay di `.env`, atau foto milik tim, akan memperluasnya.

## Pose maskot robot (dari tim, 5 November 2026)

16 pose transparan di `assets/brands/otca/mascots/`, dipanggil dengan id `robot-<pose>`. Dipotong dari `D:\KERJAAN\OTCA\maskot otca official` (salinan di `mascots/_sumber/`) dengan `python scripts/slice-mascots.py otca`.

Pose: melambai, jempol, presentasi, berpikir-hitung, duduk-baca, laptop-bersila, berlari, melompat, kaca-pembesar, berlutut-presentasi, membungkuk, mengintip-dinding, koper, duduk-berpikir, menunjuk-dua, seimbang.

**Batas resolusi:** tiap pose sekitar 350 px tinggi. Aman sampai sekitar 400 px di slide. Cover OTCA yang dikunci tetap memakai `robot-berpikir` (resolusi tinggi) sampai tim mengirim versi besar per pose.
