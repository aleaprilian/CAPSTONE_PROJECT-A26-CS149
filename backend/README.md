# RoyalStore - Backend REST API (Royal Thrift Store)

Layanan backend **Node.js + Express** untuk sistem manajemen dan pencatatan stok pakaian **Royal Thrift Store** (Capstone Asah 2026, tim `A26-CS149`). Terhubung ke database **Supabase (PostgreSQL)** pada [`../database/supabase_schema.sql`](../database/supabase_schema.sql).

> **Prinsip Privasi UMKM:** API tidak menerima maupun menyimpan atribut harga modal, harga jual, omzet, atau margin keuntungan. Permintaan yang menyertakan field harga/laba akan otomatis ditolak (`400 Bad Request`).

## Tech Stack

| Kebutuhan | Teknologi |
| :--- | :--- |
| Runtime & Framework | Node.js 20+ + Express 4 |
| Database Client | `@supabase/supabase-js` (HTTPS/REST) |
| Konfigurasi & CORS | `dotenv`, `cors` |
| Pengujian Lokal | `node --test` (built-in) |

## Cara Menjalankan

```bash
cd backend
npm install
cp .env.example .env
```

Isi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` pada `.env` jika ingin tersambung langsung ke proyek Supabase. Jika kedua variabel tersebut belum diisi dan `STORAGE_MODE=auto`, server otomatis memakai **in-memory repository** dengan *seed data* yang sama untuk pengujian lokal.

```bash
npm run dev    # jalankan dengan auto-reload pada http://localhost:3000
npm start      # jalankan mode produksi
npm test       # jalankan integration test HTTP endpoint
```

## Daftar Endpoint (Minggu 1)

Seluruh endpoint tersedia di prefix `/api` maupun `/api/v1` (selaras dengan `VITE_API_BASE_URL=http://localhost:3000/api/v1` pada frontend).

| Method | Endpoint | Kegunaan |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Cek status server & koneksi database |
| `GET` | `/api/categories` | Ambil 7 kategori master pakaian |
| `GET` | `/api/products` | Daftar produk (`?search=`, `kategori=`, `category_id=`, `ukuran=`, `status=`, `sort=`, `page=`, `limit=`) |
| `GET` | `/api/products/:id` | Detail satu produk |
| `POST` | `/api/products` | Tambah produk baru (`category_id`, `nama_produk`, `warna`, `ukuran`, `stok_pcs`) |
| `PUT` / `PATCH` | `/api/products/:id` | Perbarui data/stok produk |
| `DELETE` | `/api/products/:id` | Hapus produk |

### Aturan Validasi & Status Stok
* **Ukuran valid:** `S`, `M`, `L`, `XL`, `Semua Ukuran`. Filter `GET /api/products?ukuran=M` otomatis ikut menyertakan produk `Semua Ukuran` (tambahkan `exactSize=true` jika ingin filter persis).
* **Stok (`stok_pcs`):** Wajib bilangan bulat non-negatif (`>= 0`).
* **Status Stok Dinamis:** `0 pcs` $\rightarrow$ `Habis`, `1 – batas_stok_menipis` (default `3`) $\rightarrow$ `Menipis`, `> batas` $\rightarrow$ `Tersedia`.
