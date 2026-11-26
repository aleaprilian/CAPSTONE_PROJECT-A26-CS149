import { computeStockStatus, DEFAULT_LOW_STOCK_THRESHOLD } from './productValidation.js';

/**
 * Menormalkan record produk + kategori + status stok dinamis sesuai format API & frontend.
 */
export function formatProductRecord(row, categoryName, batasMenipis = DEFAULT_LOW_STOCK_THRESHOLD) {
  return {
    id: row.id,
    category_id: row.category_id,
    nama_kategori: categoryName,
    nama_produk: row.nama_produk,
    warna: row.warna,
    ukuran: row.ukuran,
    stok_pcs: row.stok_pcs,
    batas_menipis: batasMenipis,
    status_stok: computeStockStatus(row.stok_pcs, batasMenipis),
    foto_url: row.foto_url ?? null,
    ai_detected_category: row.ai_detected_category ?? null,
    ai_detected_color: row.ai_detected_color ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Menyaring, mengurutkan, dan mempaginasi daftar produk secara konsisten.
 */
export function applyProductQuery(items, query = {}) {
  const search = typeof query.search === 'string' ? query.search.trim().toLowerCase() : '';
  const kategori = typeof query.kategori === 'string' ? query.kategori.trim().toLowerCase() : '';
  const categoryId = query.category_id ? Number.parseInt(String(query.category_id), 10) : null;
  const ukuran = typeof query.ukuran === 'string' ? query.ukuran.trim() : '';
  const exactSize = query.exactSize === 'true' || query.exactSize === true;
  const status = typeof query.status === 'string' ? query.status.trim().toLowerCase() : '';
  const sort = typeof query.sort === 'string' ? query.sort.trim() : 'stok-asc';

  const filtered = items.filter((item) => {
    if (search) {
      const hay = `${item.nama_produk} ${item.warna} ${item.nama_kategori}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    if (categoryId && item.category_id !== categoryId) return false;
    if (kategori && kategori !== 'semua' && item.nama_kategori.toLowerCase() !== kategori) {
      return false;
    }
    if (ukuran && ukuran.toLowerCase() !== 'semua') {
      if (exactSize) {
        if (item.ukuran !== ukuran) return false;
      } else if (item.ukuran !== ukuran && item.ukuran !== 'Semua Ukuran') {
        return false;
      }
    }
    if (status && status !== 'semua' && item.status_stok.toLowerCase() !== status) {
      return false;
    }
    return true;
  });

  const cmpName = (a, b) => a.nama_produk.localeCompare(b.nama_produk, 'id');
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'stok-desc':
        return b.stok_pcs - a.stok_pcs || cmpName(a, b);
      case 'nama-asc':
        return cmpName(a, b);
      case 'terbaru':
        return b.id - a.id;
      case 'stok-asc':
      default:
        return a.stok_pcs - b.stok_pcs || cmpName(a, b);
    }
  });

  const total = sorted.length;
  const hasPagination = query.page !== undefined || query.limit !== undefined;
  if (!hasPagination) {
    return {
      items: sorted,
      meta: { total, page: 1, limit: total, total_pages: 1 },
    };
  }

  const parsedPage = Number.parseInt(String(query.page || '1'), 10);
  const parsedLimit = Number.parseInt(String(query.limit || '8'), 10);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100) : 8;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const start = (page - 1) * limit;

  return {
    items: sorted.slice(start, start + limit),
    meta: { total, page, limit, total_pages: totalPages },
  };
}
