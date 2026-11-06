# Rubrik self-review

Diadaptasi dari rubrik evaluator OTCA (`D:\KERJAAN\OTCA\AI_RULE_OTCA_EVALUATOR_CONTENT.md`) supaya berlaku untuk keempat brand.
Dinilai sebelum desain dan ditulis ke lembar review. Di bawah 85, copy wajib ditulis ulang.

Skor ini penilaian diri AI, bukan persetujuan. Keputusan tayang tetap di tangan Mbak Nia.

## Empat aspek

### 1. Target market dan sudut pandang (0–25)

| Skor | Kriteria |
|---|---|
| 21–25 | Adegan langsung dikenali segmen brand. Sapaan dan sudut pandang tepat. |
| 11–20 | Topik relevan, tetapi situasinya umum atau kurang menyentuh kekhawatiran audiens. |
| 0–10 | Salah sasaran. |

### 2. Ketepatan informasi (0–25)

| Skor | Kriteria |
|---|---|
| 21–25 | Semua klaim bersumber, produk sesuai `products.json`, tidak ada janji berlebihan. |
| 11–20 | Benar, tetapi terlalu umum atau sebagian sumber lemah. |
| 0–10 | Ada informasi tanpa sumber atau keliru. |

### 3. Struktur dan kepadatan (0–25)

| Skor | Kriteria |
|---|---|
| 21–25 | Alur sesuai arketipe, 3–5 unit per slide isi, setiap slide punya detail konkret. |
| 11–20 | Alur benar, tetapi ada slide tipis atau blok teks panjang. |
| 0–10 | Paragraf di kartu, atau slide tanpa isi berarti. |

### 4. Kualitas copy dan suara brand (0–25)

| Skor | Kriteria |
|---|---|
| 21–25 | Bebas slop, punchline terikat isi, terdengar seperti contoh di `profile.md`. |
| 11–20 | Jelas, tetapi datar atau bisa dipakai brand lain. |
| 0–10 | Penuh klise atau membingungkan. |

## Pengurang otomatis

| Temuan | Pengurangan |
|---|---|
| Topik atau angle mengulang `library.json` 8 minggu terakhir | −15 |
| Hook berupa nama topik, bukan situasi | −10 |
| Penutup bisa dipindah ke topik lain tanpa diubah | −5 |
| CTA tanpa mekanisme | −5 |

## Ambang

| Skor | Tindakan |
|---|---|
| 85–100 | Lanjut ke desain |
| 65–84 | Tulis ulang bagian yang lemah, nilai lagi |
| 0–64 | Ganti angle |

Klaim tanpa sumber atau janji berlebihan menggagalkan konten berapa pun skornya.

## Format hasil

```json
{ "target": 22, "informasi": 23, "struktur": 21, "copy": 22, "pengurang": 0, "total": 88, "catatan": "..." }
```
