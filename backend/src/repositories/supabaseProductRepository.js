import { AppError } from '../utils/errors.js';
import { DEFAULT_LOW_STOCK_THRESHOLD } from '../utils/productValidation.js';
import { applyProductQuery, formatProductRecord } from '../utils/productQuery.js';

const PRODUCT_SELECT_FIELDS =
  'id, category_id, nama_produk, warna, ukuran, stok_pcs, foto_url, ai_detected_category, ai_detected_color, created_at, updated_at, categories(nama_kategori)';

function mapSupabaseError(error, fallbackMessage) {
  if (!error) return null;

  switch (error.code) {
    case '23505':
      return new AppError(
        409,
        'Produk dengan kombinasi nama, warna, dan ukuran tersebut sudah terdaftar.',
        'DUPLICATE_PRODUCT_VARIANT',
      );
    case '23503':
      return new AppError(
        400,
        'Kategori (category_id) tidak ditemukan.',
        'INVALID_CATEGORY',
      );
    case '23514':
    case '22P02':
      return new AppError(400, error.message || 'Data tidak memenuhi aturan validasi database.', 'VALIDATION_ERROR');
    default:
      return new AppError(500, fallbackMessage || error.message, 'DATABASE_ERROR');
  }
}

/**
 * Repositori produk yang terhubung langsung ke PostgreSQL Supabase.
 */
export function createSupabaseProductRepository(supabase) {
  async function getLowStockThreshold() {
    const { data, error } = await supabase
      .from('store_settings')
      .select('batas_stok_menipis')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !data || typeof data.batas_stok_menipis !== 'number') {
      return DEFAULT_LOW_STOCK_THRESHOLD;
    }
    return data.batas_stok_menipis;
  }

  function normalizeJoinedRow(row, threshold) {
    const categoryName = row.categories?.nama_kategori || 'Tanpa Kategori';
    return formatProductRecord(row, categoryName, threshold);
  }

  return {
    mode: 'supabase',

    async checkHealth() {
      const { count, error } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true });

      if (error) {
        throw mapSupabaseError(error, 'Gagal terhubung ke Supabase.');
      }
      return { ok: true, mode: 'supabase', total_products: count ?? 0 };
    },

    async listCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('id, nama_kategori')
        .order('id', { ascending: true });

      if (error) {
        throw mapSupabaseError(error, 'Gagal mengambil daftar kategori.');
      }
      return data || [];
    },

    async listProducts(query) {
      const [threshold, res] = await Promise.all([
        getLowStockThreshold(),
        supabase.from('products').select(PRODUCT_SELECT_FIELDS),
      ]);

      if (res.error) {
        throw mapSupabaseError(res.error, 'Gagal mengambil daftar produk.');
      }

      const enriched = (res.data || []).map((row) => normalizeJoinedRow(row, threshold));
      return applyProductQuery(enriched, query);
    },

    async getProductById(id) {
      const [threshold, res] = await Promise.all([
        getLowStockThreshold(),
        supabase.from('products').select(PRODUCT_SELECT_FIELDS).eq('id', id).maybeSingle(),
      ]);

      if (res.error) {
        throw mapSupabaseError(res.error, 'Gagal mengambil detail produk.');
      }
      if (!res.data) {
        throw new AppError(404, `Produk dengan ID ${id} tidak ditemukan.`, 'PRODUCT_NOT_FOUND');
      }
      return normalizeJoinedRow(res.data, threshold);
    },

    async createProduct(payload) {
      const [threshold, res] = await Promise.all([
        getLowStockThreshold(),
        supabase.from('products').insert(payload).select(PRODUCT_SELECT_FIELDS).single(),
      ]);

      if (res.error) {
        throw mapSupabaseError(res.error, 'Gagal menambahkan produk.');
      }
      return normalizeJoinedRow(res.data, threshold);
    },

    async updateProduct(id, updates) {
      const [threshold, res] = await Promise.all([
        getLowStockThreshold(),
        supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select(PRODUCT_SELECT_FIELDS)
          .maybeSingle(),
      ]);

      if (res.error) {
        throw mapSupabaseError(res.error, 'Gagal memperbarui produk.');
      }
      if (!res.data) {
        throw new AppError(404, `Produk dengan ID ${id} tidak ditemukan.`, 'PRODUCT_NOT_FOUND');
      }
      return normalizeJoinedRow(res.data, threshold);
    },

    async deleteProduct(id) {
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .select('id, nama_produk')
        .maybeSingle();

      if (error) {
        throw mapSupabaseError(error, 'Gagal menghapus produk.');
      }
      if (!data) {
        throw new AppError(404, `Produk dengan ID ${id} tidak ditemukan.`, 'PRODUCT_NOT_FOUND');
      }
      return data;
    },
  };
}
