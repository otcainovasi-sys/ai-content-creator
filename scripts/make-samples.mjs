// Membuat spec uji: tiap brand memakai semua layout. Copy dari guideline dan feed; data yang tidak ada = [placeholder].
import fs from 'node:fs';

const S = (id) => {
  const f = fs.readdirSync('assets/stock').find((x) => x.includes(id) && x.endsWith('.jpg'));
  if (!f) throw new Error(id);
  return { src: 'assets/stock/' + f };
};
const office = S('b73d6a7e');
const desk = S('be224b0f');
const team = S('60d07cfc');

const brands = {
  'jepang-koey': {
    land: S('a9f740c8'), mascotA: 'cowo-melipat-tangan', mascotB: 'cewe-say-hi',
    hero: { headline: 'Sudah kerja, tapi ingin cari **peluang di Jepang?**', sub: 'Mulai dari bahasa dan rencana belajar yang tepat.', cta: 'Cek langkah awal' },
    promo: { headline: 'Cuma punya 30 menit per hari?', sub: 'Begini cara konsisten belajar bahasa Jepang sambil kerja.', benefits: ['Laporan perkembangan transparan setiap level', 'Garansi mengulang kelas apabila belum lulus ujian sertifikasi, dengan S&K berlaku'], cta: 'Simpan panduannya' },
    score: { headline: 'Perbandingan **nilai awal & akhir** siswa', sub: 'Kelas Platinum N5–N4', tableTitle: 'Hasil Belajar', rows: [['Mendengar / Chōkai', '89.0', '89.0', 'Pertahankan kecepatan tangkap'], ['Membaca / Dokkai', '90.0', '93.0', 'Cepat memahami pola kalimat'], ['Menulis / Sakubun', '', '92.0', 'Lancar menyusun tata bahasa'], ['Berbicara / Kaiwa', '', '93.0', 'Mampu merespons dengan tepat']], cta: 'Lihat alur kelas' },
    story: { headline: 'Belajar sambil kerja itu **realistis.**', quote: '[kutipan asli peserta + izin]', sub: 'Dengar proses, kendala, dan tips dari peserta kelas.', cta: 'Lihat cerita mereka' },
    ach: { eyebrow: 'Student Achievement', headline: 'Lulus JFT Basic A2', sub: 'Satu langkah dalam rencana belajarnya.', cta: 'Konsultasikan target belajarmu' },
    tutor: { headline: 'Bingung bedanya **JLPT dan JFT-Basic?**', name: '[Nama Sensei]', role: 'Tutor Jepang Koey by OTCA', credentials: ['[kredensial terverifikasi]'], cta: 'Simpan panduannya' },
    prog: { headline: 'Fondasi kuat, kemampuan bahasa Jepang meningkat', sub: 'Mulai dari dasar hingga level berikutnya dengan pendampingan tutor.', guarantee: '**Garansi mengulang kelas** jika tidak lulus ujian JLPT/JFT (S&K berlaku)', benefits: ['Japan Career Blueprint', 'Kelas persiapan SSW/TG', 'Simulasi ujian JLPT/JFT'], cta: 'Lihat alur kelas' },
    price: { headline: 'Diskusikan kelas yang cocok dengan targetmu', sub: 'Platinum N5–N4 atau Private 24–48 jam', tiers: [{ name: 'Platinum', price: '[harga]' }, { name: 'Private 24', price: '[harga]', featured: true }, { name: 'Private 48', price: '[harga]' }], features: ['Laporan progres tiap level', 'Jadwal sesuai kelas'], cta: 'Konsultasikan target belajarmu' },
    list: { headline: 'Pulang kerja capek, **kapan sempat belajar?**', items: [['Tentukan target kecil', 'Mulai dari yang bisa konsisten'], ['Pakai 30 menit sehari', 'Tidak harus 3 jam'], ['Pantau progres', 'Lihat level dan latihan tiap minggu']], cta: 'Simpan panduannya' },
    claims: ['garansi'],
  },
  'ciao-manda': {
    land: S('3dcdb607'), mascotA: 'cowo-pointing', mascotB: 'cewe-say-hi',
    hero: { headline: 'Bos China minta **revisi lagi?**', sub: '3 kalimat untuk memberi update kerja dengan jelas.', cta: 'Simpan untuk dipakai di kantor' },
    promo: { headline: 'Atasan bicara cepat saat briefing?', sub: 'Belajar respons yang sopan.', benefits: ['Latihan komunikasi bisnis bareng native', 'Garansi mengulang kelas jika tidak lulus ujian HSK (S&K berlaku)'], cta: 'DM KANTOR untuk cek kelas' },
    score: { headline: 'Gimana cara **pantau progres** belajarmu?', sub: 'Melalui laporan belajar bulanan Ciao Manda.', tableTitle: 'Laporan Belajar', rows: [['Mendengar', '[nilai]', '[nilai]', '[catatan tutor]'], ['Membaca', '[nilai]', '[nilai]', '[catatan tutor]'], ['Berbicara', '[nilai]', '[nilai]', '[catatan tutor]']], cta: 'Simpan untuk dipakai di kantor' },
    story: { headline: 'Lebih percaya diri saat **daily meeting.**', quote: '[kutipan asli + izin]', cta: 'DM KANTOR untuk cek kelas' },
    ach: { eyebrow: 'Cerita Peserta', headline: 'Lanjut HSK 2 karena jadwal fleksibel', sub: 'Pengalaman peserta Ciao Manda.', cta: 'DM KANTOR untuk cek kelas' },
    tutor: { headline: 'Bagaimana pekerja full-time bisa **efektif belajar Mandarin?**', name: 'Nia Laoshi', role: 'Tutor Ciao Manda by OTCA', credentials: ['HSK 5', 'Spesialisasi HSK Standar Course'], cta: 'DM KANTOR untuk cek kelas' },
    prog: { headline: 'Persiapan HSK lebih terarah', sub: 'Kuasai materi secara bertahap bersama Ciao Manda by OTCA.', guarantee: '**Garansi mengulang kelas** jika tidak lulus ujian HSK (S&K berlaku)', benefits: ['Business Conversation Class with Native', 'Gratis Simulasi Ujian HSK'], cta: 'Cek kelas' },
    price: { eyebrow: 'Gold Mandarin Deals', headline: 'Unlock your Mandarin potential', period: 'Periode 1–10 November 2026', tiers: [{ name: 'Normal', price: '6.890.000', strike: '8.990.000' }, { name: 'Super Promo', price: '6.390.000', strike: '8.990.000', featured: true }, { name: 'Early Bird', price: '6.590.000', strike: '8.990.000' }], features: ['Speaking with Native Class', 'Garansi mengulang kelas'], note: 'HSK Level 1–3, durasi 8 bulan', cta: 'DM KANTOR untuk cek kelas' },
    list: { headline: 'Bos minta update mendadak lewat chat Mandarin?', items: [['Konfirmasi instruksi', 'Pastikan yang diminta sudah benar'], ['Beri status singkat', 'Sebutkan progres dan kendala'], ['Sebutkan estimasi waktu', 'Supaya atasan bisa merencanakan']], cta: 'Simpan untuk dipakai di kantor' },
    claims: ['garansi', '6.890.000', '6.590.000', '6.390.000', '8.990.000'],
  },
  'info-jerman': {
    land: S('582dd4f6'),
    hero: { headline: 'Investasi kursus bahasa Jerman, **hasilnya mana?**', sub: 'Kursus bukan sekadar hadir, tapi juga membuktikan progress.', cta: 'Konsultasikan target ujianmu' },
    promo: { headline: 'Perjalanan Ausbildung bisa lebih terarah', sub: 'Bimbingan dari persiapan dokumen, belajar, hingga visa.', cta: 'Konsultasikan target ujianmu' },
    score: { headline: 'Belajar terus, lalu **progresnya gimana?**', sub: 'Cek laporan belajarmu di Portal Exam OTCA.', tableTitle: 'Laporan Belajar', rows: [['Lesen', '[nilai]', '[nilai]', '[catatan tutor]'], ['Hören', '[nilai]', '[nilai]', '[catatan tutor]'], ['Schreiben', '[nilai]', '[nilai]', '[catatan tutor]'], ['Sprechen', '[nilai]', '[nilai]', '[catatan tutor]']], cta: 'Konsultasikan target ujianmu' },
    story: { headline: 'Sering lembur? Materi tetap bisa dikejar', quote: '[kutipan asli + izin]', cta: 'Konsultasikan target ujianmu' },
    ach: { eyebrow: 'Student Achievement', headline: 'Selangkah lebih dekat ke Ausbildung', sub: 'Bukti proses belajar peserta Info Jerman.', cta: 'Konsultasikan target ujianmu' },
    tutor: { headline: 'Grammar bahasa Jerman **bikin pusing?**', name: 'Frau Priska', role: 'Tutor Goethe & TELC', credentials: ['Goethe C1', 'Penerima DAAD', 'Mengajar sejak 2019'], cta: 'Konsultasikan target ujianmu' },
    prog: { headline: 'Ausbildung itu harus punya sertifikat B1 atau B2?', sub: 'Swipe untuk lebih jelasnya.', guarantee: '**Garansi mengulang kelas** jika tidak lulus ujian sertifikasi (S&K berlaku)', benefits: ['German Career Blueprint', 'Speaking with Native', 'Laporan belajar di Portal Exam'], cta: 'Konsultasikan target ujianmu' },
    price: { headline: 'Super promo best deal', period: 'Periode [tanggal]', tiers: [{ name: 'Normal', price: '[harga]' }, { name: 'Super Promo', price: '[harga]', featured: true }, { name: 'Early Bird', price: '[harga]' }], features: ['Ausbildung Preparation', 'Speaking with Native'], cta: 'Konsultasikan target ujianmu' },
    list: { headline: '3 hal sebelum **ujian Goethe**', items: [['Kenali format ujian', 'Lesen, Hören, Schreiben, Sprechen'], ['Latihan sesuai level', 'Dari A1 sampai B1'], ['Konsultasikan target', 'Tentukan jadwal belajarmu']], cta: 'Konsultasikan target ujianmu' },
    claims: ['garansi'],
  },
  otca: {
    land: S('582dd4f6'),
    hero: { headline: 'Siap berangkat, **belum tentu siap belajar.**', sub: 'Persiapan sering hanya fokus pada dokumen dan bahasa.', cta: 'Konsultasi dengan Tim OTCA' },
    promo: { headline: 'Target berbeda, **ritme belajar pun tak harus sama.**', sub: 'Setiap anak berkembang dengan fokus dan kecepatan yang sesuai kebutuhannya.', cta: 'Konsultasi dengan Tim OTCA' },
    score: { headline: 'Progres belajar anak **terukur**', sub: 'Lesen, Hören, Schreiben, Sprechen', tableTitle: 'Laporan Belajar Anak', rows: [['Lesen', '[nilai]', '[nilai]', '[catatan]'], ['Hören', '[nilai]', '[nilai]', '[catatan]'], ['Schreiben', '[nilai]', '[nilai]', '[catatan]'], ['Sprechen', '[nilai]', '[nilai]', '[catatan]']], cta: 'Konsultasi dengan Tim OTCA' },
    story: { headline: 'Cerita **siswa OTCA**', quote: '[kutipan asli + izin]', sub: 'Setiap anak punya cara belajar yang berbeda.', cta: 'Konsultasi dengan Tim OTCA' },
    ach: { headline: 'Student **achievement**', sub: 'Setiap pencapaian adalah bagian dari perjalanan menuju Jerman.', cta: 'Konsultasi dengan Tim OTCA' },
    tutor: { headline: 'Belajar Jerman harus langsung tahu grammar? **Mulai bertahap.**', name: '[Nama Tutor]', role: 'Tutor OTCA', credentials: ['[kredensial terverifikasi]'], cta: 'Konsultasi dengan Tim OTCA' },
    prog: { headline: 'Tuntaskan bahasa Jerman anak dengan **pembelajaran personal**', guarantee: 'Sesuai jadwal. Sesuai kebutuhan. Sesuai target.', benefits: ['Private 1-on-1', 'Jadwal fleksibel', 'Fokus target'], cta: 'Daftar 1-on-1 sekarang' },
    price: { headline: 'Prince 60 **Online**', sub: '60 jam coaching + extra 2 jam', tiers: [{ name: 'Prince 60', price: 'Rp 9.900.000', featured: true }], features: ['Private 1-on-1', 'Jadwal fleksibel', 'Fokus target'], cta: 'Konsultasi dengan Tim OTCA' },
    list: { headline: 'Sebelum tanya nilai, **cek dulu jalur masuknya.**', items: [['Memahami', 'Mampu menjelaskan alasan, bukan cuma menghafal'], ['Mengatur', 'Menyusun waktu dan prioritas'], ['Bertanya', 'Berani mencari bantuan saat tidak paham'], ['Mengevaluasi', 'Mengganti strategi saat cara lama tidak efektif']], cta: 'Konsultasi dengan Tim OTCA' },
    claims: ['9.900.000'],
  },
};

for (const [brand, c] of Object.entries(brands)) {
  const rows = c.score.rows.map(([skill, before, after, note]) => ({ skill, ...(before ? { before } : {}), after, note }));
  const slides = [
    { layout: 'hero_photo', ...c.hero, image: c.land, ...(c.mascotB ? { mascot: c.mascotB } : {}) },
    // Maskot Info Jerman dan OTCA belum tersedia, jadi slide ini memakai foto.
    c.mascotA
      ? { layout: 'mascot_hero', ...c.promo, image: c.land, mascot: c.mascotA }
      : { layout: 'hero_photo', ...c.promo, image: c.land },
    { layout: 'score_infographic', ...c.score, rows },
    { layout: 'story_card', ...c.story, image: desk, name: '[Nama Siswa]', role: 'Siswa' },
    { layout: 'achievement', ...c.ach, image: office, name: '[Nama Siswa]' },
    { layout: 'tutor_profile', ...c.tutor, image: team },
    { layout: 'program_value', ...c.prog, image: office },
    { layout: 'price_table', ...c.price },
    { layout: 'numbered_list', ...c.list, items: c.list.items.map(([title, text]) => ({ title, text })), ...(c.mascotA ? { mascot: c.mascotA } : {}) },
  ];
  fs.writeFileSync(`specs/samples/${brand}.json`, JSON.stringify({ brand, slug: 'uji-layout', month: '2026-11', format: 'feed_portrait', verified_claims: c.claims, slides }, null, 2));
}
