// DATA CONTOH (dummy) untuk Minggu 1.
// Nama properti diselaraskan dengan skema basis data produk/kategori.
// Hanya data operasional stok. Tidak ada harga jual, harga beli, omzet, maupun margin keuntungan.
// `foto_url: null` memakai placeholder; `ai_detected_*` diisi hasil deteksi model Computer Vision nanti.

export const mockNotificationCount = 7;

// Master kategori
export const kategoriMaster = [
  { id: 1, nama_kategori: 'Blouse' },
  { id: 2, nama_kategori: 'Cardigan' },
  { id: 3, nama_kategori: 'Kemeja' },
  { id: 4, nama_kategori: 'Dress' },
  { id: 5, nama_kategori: 'Jaket' },
  { id: 6, nama_kategori: 'Rok' },
  { id: 7, nama_kategori: 'Celana' },
];

export const mockProducts = [
  { id: 1, category_id: 1, nama_kategori: 'Blouse', nama_produk: 'Blouse Peplum Kerah', warna: 'Krem', ukuran: 'M', stok_pcs: 2, foto_url: null, ai_detected_category: 'Blouse', ai_detected_color: 'Krem' },
  { id: 2, category_id: 1, nama_kategori: 'Blouse', nama_produk: 'Blouse Satin Putih', warna: 'Putih', ukuran: 'L', stok_pcs: 7, foto_url: null, ai_detected_category: 'Blouse', ai_detected_color: 'Putih' },
  { id: 3, category_id: 3, nama_kategori: 'Kemeja', nama_produk: 'Kemeja Flanel Oversize', warna: 'Merah Kotak', ukuran: 'L', stok_pcs: 1, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 4, category_id: 3, nama_kategori: 'Kemeja', nama_produk: 'Kemeja Kotak-kotak', warna: 'Biru Tua', ukuran: 'M', stok_pcs: 8, foto_url: null, ai_detected_category: 'Kemeja', ai_detected_color: 'Biru' },
  { id: 5, category_id: 4, nama_kategori: 'Dress', nama_produk: 'Dress Floral Midi', warna: 'Putih Motif', ukuran: 'M', stok_pcs: 0, foto_url: null, ai_detected_category: 'Dress', ai_detected_color: 'Putih' },
  { id: 6, category_id: 4, nama_kategori: 'Dress', nama_produk: 'Dress Polos Midi', warna: 'Hitam', ukuran: 'S', stok_pcs: 6, foto_url: null, ai_detected_category: 'Dress', ai_detected_color: 'Hitam' },
  { id: 7, category_id: 2, nama_kategori: 'Cardigan', nama_produk: 'Cardigan Rajut', warna: 'Abu-abu', ukuran: 'Semua Ukuran', stok_pcs: 0, foto_url: null, ai_detected_category: 'Cardigan', ai_detected_color: 'Abu-abu' },
  { id: 8, category_id: 6, nama_kategori: 'Rok', nama_produk: 'Rok Plisket', warna: 'Cokelat Muda', ukuran: 'S', stok_pcs: 3, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 9, category_id: 1, nama_kategori: 'Blouse', nama_produk: 'Blouse Rajut Lengan Balon', warna: 'Pink Muda', ukuran: 'S', stok_pcs: 5, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 10, category_id: 3, nama_kategori: 'Kemeja', nama_produk: 'Kemeja Linen Putih', warna: 'Putih', ukuran: 'XL', stok_pcs: 4, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 11, category_id: 4, nama_kategori: 'Dress', nama_produk: 'Dress Satin Slip', warna: 'Hijau Zaitun', ukuran: 'M', stok_pcs: 2, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 12, category_id: 2, nama_kategori: 'Cardigan', nama_produk: 'Cardigan Oversize Krem', warna: 'Krem', ukuran: 'L', stok_pcs: 9, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 13, category_id: 6, nama_kategori: 'Rok', nama_produk: 'Rok Jeans Midi', warna: 'Biru Denim', ukuran: 'M', stok_pcs: 6, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 14, category_id: 6, nama_kategori: 'Rok', nama_produk: 'Rok Mini Tenis', warna: 'Hitam', ukuran: 'S', stok_pcs: 1, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 15, category_id: 1, nama_kategori: 'Blouse', nama_produk: 'Blouse Polos Lengan Panjang', warna: 'Hitam', ukuran: 'XL', stok_pcs: 12, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 16, category_id: 3, nama_kategori: 'Kemeja', nama_produk: 'Kemeja Denim Washed', warna: 'Biru Muda', ukuran: 'L', stok_pcs: 0, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 17, category_id: 4, nama_kategori: 'Dress', nama_produk: 'Dress Pinafore Kotak-kotak', warna: 'Abu Tua', ukuran: 'S', stok_pcs: 4, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 18, category_id: 2, nama_kategori: 'Cardigan', nama_produk: 'Cardigan Crop Rajut', warna: 'Cokelat Susu', ukuran: 'Semua Ukuran', stok_pcs: 3, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 19, category_id: 6, nama_kategori: 'Rok', nama_produk: 'Rok Plisket Panjang', warna: 'Navy', ukuran: 'L', stok_pcs: 7, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 20, category_id: 5, nama_kategori: 'Jaket', nama_produk: 'Jaket Bomber Hitam', warna: 'Hitam', ukuran: 'M', stok_pcs: 5, foto_url: null, ai_detected_category: 'Jaket', ai_detected_color: 'Hitam' },
  { id: 21, category_id: 5, nama_kategori: 'Jaket', nama_produk: 'Jaket Denim Oversize', warna: 'Biru Denim', ukuran: 'L', stok_pcs: 2, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 22, category_id: 4, nama_kategori: 'Dress', nama_produk: 'Dress Wrap Floral', warna: 'Maroon Motif', ukuran: 'L', stok_pcs: 10, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 23, category_id: 7, nama_kategori: 'Celana', nama_produk: 'Celana Kulot Linen', warna: 'Krem', ukuran: 'M', stok_pcs: 6, foto_url: null, ai_detected_category: null, ai_detected_color: null },
  { id: 24, category_id: 7, nama_kategori: 'Celana', nama_produk: 'Celana Kulot Hitam', warna: 'Hitam', ukuran: 'XL', stok_pcs: 0, foto_url: null, ai_detected_category: null, ai_detected_color: null },
];
