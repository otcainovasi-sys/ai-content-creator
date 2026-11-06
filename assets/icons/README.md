# Ikon

| Folder | Isi | Lisensi |
|---|---|---|
| `fluent/` | Sumber Microsoft Fluent Emoji 3D, 256 px | MIT |
| `custom/` | Dibuat sendiri (`pin.png`, `scripts/make-pin.ts`) | Milik proyek |
| `3dicons-color/` | Ikon gaya Color + alias nama id kami (`node scripts/import-3dicons.mjs`) | CC0 |
| `<brand>/` | Hasil pewarnaan. Jangan diedit, jalankan `npm run icons` | Mengikuti sumber |

Skema warna diatur di `config/icon-palettes.json`: tiap ikon memakai 3 warna brand dan skema diputar antar-ikon. Prioritas sumber: `3dicons-color`, lalu `custom`, lalu `fluent`.

## Aset 3D buatan sendiri (`c-*`)

File `assets/icons/<brand>/c-*.png` dirender sendiri dengan Three.js (`npm run make3d -- <brand> [nama]`). Sumber objek ada di `scripts/3d/scene.js`, palet per brand di `scripts/make-3d.ts`. Tidak memakai aset pihak ketiga, jadi bebas dipakai untuk komersial. Teks seperti `Deutsch` atau `B1` ditulis langsung di permukaan objek.
