# RoyalStore - Frontend (Royal Thrift Store)

Antarmuka web pemilik toko untuk sistem manajemen dan pencatatan stok pakaian Royal Thrift Store
(Capstone Asah 2026, tim A26-CS149). Tahap saat ini: **Minggu 1** (pengaturan proyek frontend dan
halaman Daftar Produk).

> **Catatan data:** seluruh data yang tampil adalah **data contoh (dummy)** di `src/data/mockProducts.js`.
> Belum ada koneksi ke backend. Data tidak memuat harga jual, harga beli, omzet, maupun margin keuntungan
> sesuai batasan privasi UMKM.

## Tech stack

| Kebutuhan | Teknologi |
| --- | --- |
| Framework dan bundler | React 19 + Vite |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Routing | React Router |
| Ikon | lucide-react |
| Font | Inter (`@fontsource-variable/inter`) |
| Networking (placeholder) | Axios |

## Cara menjalankan

Prasyarat: Node.js 20 atau lebih baru.

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Perintah lain:

```bash
npm run build     # build produksi ke folder dist
npm run preview   # menjalankan hasil build secara lokal
```

Untuk tahap integrasi nanti, salin `.env.example` menjadi `.env` lalu sesuaikan `VITE_API_BASE_URL`.

## Struktur folder

```
frontend/
  src/
    components/   Sidebar, Topbar, ProductToolbar, ProductTable, StatusBadge, Pagination, dll.
    layouts/      DashboardLayout (sidebar kiri + topbar kanan atas)
    pages/        ProdukPage (Daftar Produk), PlaceholderPage (menu lain)
    data/         mockProducts.js (data contoh)
    services/     api.js (instance Axios), productService.js (titik pergantian ke REST API)
    utils/        stock.js (aturan status stok)
```

## Fitur Minggu 1

- Layout utama sesuai desain: sidebar RoyalStore, topbar dengan notifikasi dan profil `Egi - Admin`.
- Halaman **Produk**: tabel 24 data contoh (field selaras skema DB: `id`, `category_id`, `nama_kategori`, `nama_produk`, `warna`, `ukuran`, `stok_pcs`, `foto_url`, `ai_detected_category`, `ai_detected_color`), pencarian nama, filter Kategori (master: Blouse, Cardigan, Kemeja, Dress, Jaket, Rok, Celana) / Ukuran / Status Stok,
  pengurutan, dan paginasi (8 data per halaman). Produk berukuran "Semua Ukuran" ikut tampil pada filter ukuran apa pun.
- Status stok otomatis: `Habis` (0 pcs), `Menipis` (1 sampai 3 pcs), `Tersedia` (lebih dari 3 pcs).
- Tombol `+ Tambah Produk`, `Ubah`, dan `Hapus` baru berupa tampilan dan menampilkan pesan bahwa fitur belum tersedia.
- Responsif: sidebar menjadi menu geser dan tabel menjadi daftar kartu di ponsel.

## Belum dikerjakan (tahap berikutnya)

Form CRUD produk, transaksi dan mutasi stok, analitik, rekomendasi restock, serta integrasi REST API.
