/* ============================================================
   PUSAT DATA SITUS
   Untuk menambah catatan baru, cukup tambahkan objek ke NOTES.
   ============================================================ */

var SITE = {
  title: "Perpustakaan Ilmu Pribadi",
  owner: "Nama Kamu"
};

/* Topik / Kategori */
var CATEGORIES = [
  { id: "kehidupan",     label: "Kehidupan" },
  { id: "karier",        label: "Karier" },
  { id: "keuangan",      label: "Keuangan" },
  { id: "mindset",       label: "Mindset" },
  { id: "produktivitas", label: "Produktivitas" },
  { id: "kesehatan",     label: "Kesehatan" },
  { id: "relasi",        label: "Relasi" },
  { id: "spiritual",     label: "Spiritual" }
];

/* Daftar semua catatan */
var NOTES = [
  {
    id: "kaizen-produktivitas",
    title: "Kaizen: Maju 1% Setiap Hari",
    file: "catatan/yt-kaizen-produktivitas.md",
    source: "YouTube",
    sourceUrl: "https://www.youtube.com/",
    tokoh: "Produktif Harian",
    category: "produktivitas",
    tags: ["kebiasaan", "kaizen", "fokus", "sistem"],
    date: "2025-02-10",
    excerpt: "Ringkasan video tentang filosofi perbaikan kecil yang konsisten: kenapa sistem lebih penting daripada target besar."
  },
  {
    id: "pindah-karier",
    title: "Pelajaran dari Pindah Karier di Usia 30",
    file: "catatan/pengalaman-pindah-karier.md",
    source: "Pengalaman",
    sourceUrl: "",
    tokoh: "Diri Sendiri",
    category: "karier",
    tags: ["karier", "keputusan", "keberanian", "belajar"],
    date: "2025-03-04",
    excerpt: "Refleksi pribadi setelah berpindah bidang pekerjaan: rasa takut, proses adaptasi, dan apa yang akhirnya berubah."
  },
  {
    id: "dana-darurat",
    title: "Membangun Dana Darurat dari Nol",
    file: "keuangan/dana-darurat.md",
    source: "Pengalaman",
    sourceUrl: "",
    tokoh: "Diri Sendiri",
    category: "keuangan",
    tags: ["dana-darurat", "tabungan", "anggaran", "keamanan"],
    date: "2025-01-18",
    excerpt: "Rencana praktis menyiapkan dana darurat: berapa besarnya, di mana menyimpannya, dan langkah menabungnya tiap bulan."
  }
];

/* Profil tokoh (opsional). Key = nilai 'tokoh' pada NOTES. */
var TOKOH = {
  "Produktif Harian": {
    bio: "Sumber edukasi tentang kebiasaan, fokus, dan sistem kerja sederhana.",
    profile: "tokoh/produktif-harian.md"
  },
  "Diri Sendiri": {
    bio: "Catatan pengalaman dan refleksi pribadi.",
    profile: ""
  }
};

/* Tautan eksternal untuk halaman Keuangan (mis. Google Drive). */
var EXTERNAL_LINKS = [
  { label: "Spreadsheet Anggaran Bulanan", url: "https://drive.google.com/", note: "Google Sheets" },
  { label: "Arsip Bukti & Dokumen Keuangan", url: "https://drive.google.com/", note: "Folder Google Drive" },
  { label: "Backup Catatan (.md)", url: "https://drive.google.com/", note: "Folder cadangan" }
];
