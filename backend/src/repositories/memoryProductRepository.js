import { AppError } from '../utils/errors.js';
import { DEFAULT_LOW_STOCK_THRESHOLD } from '../utils/productValidation.js';
import { applyProductQuery, formatProductRecord } from '../utils/productQuery.js';

const INITIAL_CATEGORIES = [
  { id: 1, nama_kategori: 'Blouse' },
  { id: 2, nama_kategori: 'Cardigan' },
  { id: 3, nama_kategori: 'Kemeja' },
  { id: 4, nama_kategori: 'Dress' },
  { id: 5, nama_kategori: 'Jaket' },
  { id: 6, nama_kategori: 'Rok' },
  { id: 7, nama_kategori: 'Celana' },
];

const INITIAL_PRODUCTS = [
  { category_id: 1, nama_produk: 'Blouse Peplum Kerah', warna: 'Krem', ukuran: 'M', stok_pcs: 2 },
  { category_id: 1, nama_produk: 'Blouse Satin Putih', warna: 'Putih', ukuran: 'L', stok_pcs: 7 },
  { category_id: 1, nama_produk: 'Blouse Lengan Balon', warna: 'Putih', ukuran: 'L', stok_pcs: 1 },
  { category_id: 3, nama_produk: 'Kemeja Flanel Oversize', warna: 'Merah Kotak', ukuran: 'L', stok_pcs: 1 },
  { category_id: 3, nama_produk: 'Kemeja Kotak-kotak', warna: 'Biru Tua', ukuran: 'M', stok_pcs: 8 },
  { category_id: 3, nama_produk: 'Kemeja Kotak-kotak', warna: 'Hitam', ukuran: 'XL', stok_pcs: 0 },
  { category_id: 4, nama_produk: 'Dress Floral Midi', warna: 'Putih Motif', ukuran: 'M', stok_pcs: 0 },
  { category_id: 4, nama_produk: 'Dress Polos Midi', warna: 'Hitam', ukuran: 'S', stok_pcs: 6 },
  { category_id: 2, nama_produk: 'Cardigan Rajut', warna: 'Abu-abu', ukuran: 'Semua Ukuran', stok_pcs: 0 },
  { category_id: 5, nama_produk: 'Jaket Denim Vintage', warna: 'Biru Denim', ukuran: 'L', stok_pcs: 2 },
  { category_id: 6, nama_produk: 'Rok Plisket', warna: 'Cokelat Muda', ukuran: 'S', stok_pcs: 5 },
];

/**
 * Repositori produk in-memory (menggunakan seed & aturan constraint yang sama dengan Supabase).
 */
export function createMemoryProductRepository(seedOverrides) {
  const categories = INITIAL_CATEGORIES.map((c) => ({ ...c }));
  let nextId = 1;
  const now = new Date().toISOString();

  const sourceProducts = seedOverrides ?? INITIAL_PRODUCTS;
  const products = sourceProducts.map((p) => ({
    id: nextId++,
    category_id: p.category_id,
    nama_produk: p.nama_produk,
    warna: p.warna,
    ukuran: p.ukuran,
    stok_pcs: p.stok_pcs,
    foto_url: p.foto_url ?? null,
    ai_detected_category: p.ai_detected_category ?? null,
    ai_detected_color: p.ai_detected_color ?? null,
    created_at: now,
    updated_at: now,
  }));

  function getCategoryName(categoryId) {
    const found = categories.find((c) => c.id === categoryId);
    if (!found) {
      throw new AppError(400, `Kategori dengan ID ${categoryId} tidak ditemukan.`, 'INVALID_CATEGORY');
    }
    return found.nama_kategori;
  }

  function assertUniqueVariant(namaProduk, warna, ukuran, ignoreId = null) {
    const duplicate = products.find(
      (item) =>
        item.id !== ignoreId &&
        item.nama_produk.toLowerCase() === namaProduk.toLowerCase() &&
        item.warna.toLowerCase() === warna.toLowerCase() &&
        item.ukuran === ukuran,
    );
    if (duplicate) {
      throw new AppError(
        409,
        `Produk "${namaProduk}" (${warna}, ukuran ${ukuran}) sudah terdaftar.`,
        'DUPLICATE_PRODUCT_VARIANT',
      );
    }
  }

  return {
    mode: 'memory',

    async checkHealth() {
      return { ok: true, mode: 'memory', total_products: products.length };
    },

    async listCategories() {
      return categories.map((c) => ({ ...c }));
    },

    async listProducts(query) {
      const enriched = products.map((p) =>
        formatProductRecord(p, getCategoryName(p.category_id), DEFAULT_LOW_STOCK_THRESHOLD),
      );
      return applyProductQuery(enriched, query);
    },

    async getProductById(id) {
      const found = products.find((p) => p.id === id);
      if (!found) {
        throw new AppError(404, `Produk dengan ID ${id} tidak ditemukan.`, 'PRODUCT_NOT_FOUND');
      }
      return formatProductRecord(found, getCategoryName(found.category_id), DEFAULT_LOW_STOCK_THRESHOLD);
    },

    async createProduct(payload) {
      const categoryName = getCategoryName(payload.category_id);
      assertUniqueVariant(payload.nama_produk, payload.warna, payload.ukuran);

      const timestamp = new Date().toISOString();
      const created = {
        id: nextId++,
        ...payload,
        created_at: timestamp,
        updated_at: timestamp,
      };
      products.push(created);
      return formatProductRecord(created, categoryName, DEFAULT_LOW_STOCK_THRESHOLD);
    },

    async updateProduct(id, updates) {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new AppError(404, `Produk dengan ID ${id} tidak ditemukan.`, 'PRODUCT_NOT_FOUND');
      }

      const current = products[index];
      const next = {
        ...current,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const categoryName = getCategoryName(next.category_id);
      assertUniqueVariant(next.nama_produk, next.warna, next.ukuran, id);

      products[index] = next;
      return formatProductRecord(next, categoryName, DEFAULT_LOW_STOCK_THRESHOLD);
    },

    async deleteProduct(id) {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new AppError(404, `Produk dengan ID ${id} tidak ditemukan.`, 'PRODUCT_NOT_FOUND');
      }
      const [removed] = products.splice(index, 1);
      return { id: removed.id, nama_produk: removed.nama_produk };
    },
  };
}
