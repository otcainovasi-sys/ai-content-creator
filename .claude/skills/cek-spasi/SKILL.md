---
name: cek-spasi
description: Memeriksa dan merapikan margin, padding, jarak antar-kotak, jarak teks ke kotak, rongga kosong, dan maskot yang menimpa isi pada carousel hasil render brand OTCA. Pakai setelah render, saat user mengeluh tulisan atau kotak terlalu rapat, kosong, menempel, atau kurang profesional, atau sebelum menyerahkan konten untuk direview.
---

# Cek spasi

Argumen: `<path spec>`, contoh `specs/khusus/otca/siapa-membantu-anak.json`.

## 1. Render dan baca temuan otomatis

```
npm run render -- <path spec>
```

QA memanggil `src/qa/spacing.ts` di setiap slide. Kodenya:

| Kode | Arti | Cara memperbaiki |
|---|---|---|
| `SPACE_TIGHT` | teks terlalu dekat dengan kotak lain, atau kotak terlalu dekat dengan kotak lain | geser blok, beri margin, atau kecilkan kotak di atasnya |
| `BOX_OVERLAP`, `TEXT_ON_BOX` | kotak atau teks saling menimpa | atur ulang posisi `y` dan tinggi `h` blok |
| `BOX_PADDING` | jarak isi ke tepi kotak terlalu sempit | tambah padding di CSS skin, atau tinggikan kotak |
| `BOX_UNBALANCED` | ruang atas dan bawah di dalam kotak timpang | ratakan isi (`justify-content`) atau pakai tinggi otomatis |
| `BOX_EMPTY` | kotak jauh lebih tinggi dari isinya | kurangi `h` sampai kotak memeluk isinya |
| `SPACE_UNEVEN` | jarak antar-kartu bertumpuk tidak seragam | samakan jarak antar-kartu |
| `SPACE_LOOSE` | butir daftar terlalu renggang (lebih dari 80 px) | pakai jarak tetap, jangan dibagi rata ke seluruh ruang |
| `SPACE_VOID` | rongga kosong lebih dari 150 px di tengah slide | sebar isi dengan rata, atau pindahkan blok ke rongga itu |
| `MASCOT_OVER` | piksel maskot menutupi teks atau kotak | geser atau kecilkan maskot, atau turunkan lapisannya |

Brand dengan `design.spacingStrict: true` (sekarang OTCA) memblokir pelanggaran berat. Brand lain mendapat catatan saja. Ambangnya ada di `SPACE` di `src/qa/spacing.ts`.

## 2. Ukur angka pastinya

```
node scripts/measure-text.mjs projects/<brand>/<slug>
node scripts/measure-mascot.mjs projects/<brand>/<slug>
```

Bandingkan dengan referensi brand di `knowledge/brands/<brand>/patterns.md`. Untuk OTCA, angka dari PDF Canva ada di sana: ukuran font, posisi, jarak pill ke poin pertama 40 px, jarak antar-poin 35 px, dan kartu yang memeluk isinya.

Saat mengukur PDF, pakai bagian gambar yang padat (alfa di atas 200), bukan kotak gambarnya. Kotak gambar ikut menghitung bayangan, jadi jarak terbaca lebih sempit dari aslinya.

## 3. Tinjau mata

Muat skill `ui-ux-pro-max:ui-ux-pro-max` untuk tinjauan visual. Lihat PNG tiap slide dan cari hal yang tidak tertangkap angka: hierarki, keseimbangan kiri kanan, dan apakah ruang kosong terasa disengaja. Detektor tidak menilai selera, jadi temuan mata tetap dicatat.

## 4. Perbaiki dan ulangi

- Ubah posisi dan ukuran blok di spec, atau aturan skin di `src/render/base.css`. Jangan mengecilkan font di bawah ukuran terkunci brand.
- Jangan memotong teks diam-diam. Kalau isi tidak muat, pendekkan copy lalu beri tahu user.
- Render ulang sampai status `SIAP_DIREVIEW` tanpa catatan spasi, atau setiap catatan yang tersisa punya alasan desain yang jelas.
- Laporkan ke user: temuan, perbaikan, dan angka sebelum dan sesudah.
