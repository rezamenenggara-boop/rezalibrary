# rezalibrary
Perpustakaan pribadi: catatan ilmu, hidup, dan keuangan
# Perpustakaan Ilmu Pribadi

Website statis untuk menyimpan catatan ilmu, ringkasan video, pengalaman hidup,
dan catatan keuangan. Dibangun dengan HTML + CSS + JavaScript murni, konten
berbasis Markdown, dan di-hosting gratis di GitHub Pages.

## Menjalankan secara lokal (opsional)
Karena situs membaca file `.md` lewat `fetch`, membuka `index.html` langsung
(klik dua kali) akan gagal memuat isi catatan. Jalankan server lokal sederhana:

    python -m http.server 8000

Lalu buka http://localhost:8000

## A. Cara Upload ke GitHub
1. Buat repository baru di github.com (mis. `perpustakaan-ilmu`), set Public.
2. Klik "Add file" > "Upload files".
3. Seret seluruh isi folder proyek (bukan foldernya, tapi isinya).
4. Klik "Commit changes".

## B. Cara Mengaktifkan GitHub Pages
1. Buka repository > tab "Settings".
2. Menu kiri pilih "Pages".
3. Bagian "Source" pilih branch `main` dan folder `/ (root)`.
4. Klik "Save". Tunggu 1–2 menit.
5. Situs aktif di: https://USERNAME.github.io/perpustakaan-ilmu/

## C. Cara Menambah Catatan Baru (3 langkah)
1. Salin `template/template-catatan.md` ke folder yang sesuai
   (`catatan/`, `keuangan/`, atau `tokoh/`) dengan nama file baru,
   misalnya `catatan/buku-deep-work.md`. Isi sesuai template.
2. Buka `js/data.js` dan tambahkan satu objek ke array `NOTES`:

       {
         id: "deep-work",
         title: "Ringkasan Buku Deep Work",
         file: "catatan/buku-deep-work.md",
         source: "Buku",
         sourceUrl: "",
         tokoh: "Cal Newport",
         category: "produktivitas",
         tags: ["fokus", "kerja-dalam"],
         date: "2025-04-01",
         excerpt: "Catatan inti tentang kerja fokus tanpa gangguan."
       }

3. Commit perubahan. Catatan otomatis muncul di daftar, kategori,
   tokoh, dan pencarian.

Catatan: nilai `category` harus salah satu `id` di array `CATEGORIES`.
Untuk topik baru, tambahkan dulu ke `CATEGORIES`.

## D. Cara Backup Data
- Seluruh isi situs adalah file teks biasa, jadi sangat mudah dicadangkan.
- Backup utama: repository GitHub itu sendiri (riwayat versi tersimpan).
- Backup tambahan: klik "Code" > "Download ZIP" secara berkala dan simpan
  salinannya di Google Drive / hard disk eksternal.
- Karena formatnya Markdown murni, isi catatan tetap bisa dibaca puluhan tahun
  ke depan tanpa bergantung pada situs ini.

## Struktur Singkat
- `catatan/`, `keuangan/`, `tokoh/` — isi catatan Markdown.
- `js/data.js` — daftar catatan (satu-satunya file yang rutin diedit).
- `css/style.css` — tampilan.
- `template/` — cetakan catatan baru.
