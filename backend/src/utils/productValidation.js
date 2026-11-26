import { AppError } from './errors.js';

export const ALLOWED_SIZES = ['S', 'M', 'L', 'XL', 'Semua Ukuran'];
export const DEFAULT_LOW_STOCK_THRESHOLD = 3;

const PRIVACY_BLOCKED_FIELDS = new Set([
  'harga',
  'harga_beli',
  'harga_modal',
  'harga_jual',
  'price',
  'cost',
  'margin',
  'laba',
  'profit',
  'omzet',
]);

/**
 * Menghitung label status stok berdasarkan ambang batas pengaturan toko.
 */
export function computeStockStatus(stokPcs, batasMenipis = DEFAULT_LOW_STOCK_THRESHOLD) {
  if (stokPcs <= 0) return 'Habis';
  if (stokPcs <= batasMenipis) return 'Menipis';
  return 'Tersedia';
}

export function parsePositiveIntId(rawId, fieldName = 'id') {
  if (typeof rawId === 'number') {
    if (Number.isInteger(rawId) && rawId > 0) return rawId;
    throw new AppError(400, `${fieldName} harus berupa bilangan bulat positif.`, 'INVALID_ID');
  }
  if (typeof rawId === 'string' && /^[1-9]\d*$/.test(rawId.trim())) {
    return Number.parseInt(rawId.trim(), 10);
  }
  throw new AppError(400, `${fieldName} harus berupa bilangan bulat positif.`, 'INVALID_ID');
}

function assertNoPrivacyFields(body) {
  const blockedFound = Object.keys(body).filter((key) =>
    PRIVACY_BLOCKED_FIELDS.has(key.trim().toLowerCase()),
  );
  if (blockedFound.length > 0) {
    throw new AppError(
      400,
      `Data harga/keuntungan tidak diperbolehkan sesuai privasi UMKM (${blockedFound.join(', ')}).`,
      'PRIVACY_POLICY_VIOLATION',
    );
  }
}

function parseNonEmptyString(value, fieldLabel, maxLength) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AppError(400, `${fieldLabel} wajib diisi dan tidak boleh kosong.`, 'VALIDATION_ERROR');
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new AppError(
      400,
      `${fieldLabel} maksimal ${maxLength} karakter.`,
      'VALIDATION_ERROR',
    );
  }
  return trimmed;
}

function parseOptionalString(value, fieldLabel, maxLength) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (typeof value !== 'string') {
    throw new AppError(400, `${fieldLabel} harus berupa teks.`, 'VALIDATION_ERROR');
  }
  const trimmed = value.trim();
  if (maxLength && trimmed.length > maxLength) {
    throw new AppError(
      400,
      `${fieldLabel} maksimal ${maxLength} karakter.`,
      'VALIDATION_ERROR',
    );
  }
  return trimmed || null;
}

function parseNonNegativeStock(value) {
  if (value === undefined || value === null || value === '') {
    throw new AppError(400, 'Jumlah stok (stok_pcs) wajib diisi.', 'VALIDATION_ERROR');
  }

  let parsed;
  if (typeof value === 'number') {
    parsed = value;
  } else if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
    parsed = Number.parseInt(value.trim(), 10);
  } else {
    throw new AppError(
      400,
      'Jumlah stok (stok_pcs) harus berupa bilangan bulat minimal 0 (tidak boleh huruf, desimal, atau negatif).',
      'VALIDATION_ERROR',
    );
  }

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new AppError(
      400,
      'Jumlah stok (stok_pcs) harus berupa bilangan bulat minimal 0 (tidak boleh huruf, desimal, atau negatif).',
      'VALIDATION_ERROR',
    );
  }
  return parsed;
}

function parseProductSize(value) {
  if (typeof value !== 'string' || !ALLOWED_SIZES.includes(value.trim())) {
    throw new AppError(
      400,
      `Ukuran tidak valid. Pilihan yang tersedia: ${ALLOWED_SIZES.join(', ')}.`,
      'VALIDATION_ERROR',
    );
  }
  return value.trim();
}

/**
 * Memvalidasi payload pembuatan produk baru (POST /api/products).
 */
export function validateCreateProductPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError(400, 'Payload JSON tidak valid.', 'INVALID_PAYLOAD');
  }

  assertNoPrivacyFields(body);

  return {
    category_id: parsePositiveIntId(body.category_id, 'category_id'),
    nama_produk: parseNonEmptyString(body.nama_produk, 'Nama produk', 150),
    warna: parseNonEmptyString(body.warna, 'Warna produk', 60),
    ukuran: parseProductSize(body.ukuran),
    stok_pcs: parseNonNegativeStock(body.stok_pcs),
    foto_url: parseOptionalString(body.foto_url, 'foto_url', 2048) ?? null,
    ai_detected_category:
      parseOptionalString(body.ai_detected_category, 'ai_detected_category', 80) ?? null,
    ai_detected_color:
      parseOptionalString(body.ai_detected_color, 'ai_detected_color', 60) ?? null,
  };
}

/**
 * Memvalidasi payload pembaruan produk (PUT/PATCH /api/products/:id).
 */
export function validateUpdateProductPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError(400, 'Payload JSON tidak valid.', 'INVALID_PAYLOAD');
  }

  assertNoPrivacyFields(body);

  const updates = {};
  if (body.category_id !== undefined) {
    updates.category_id = parsePositiveIntId(body.category_id, 'category_id');
  }
  if (body.nama_produk !== undefined) {
    updates.nama_produk = parseNonEmptyString(body.nama_produk, 'Nama produk', 150);
  }
  if (body.warna !== undefined) {
    updates.warna = parseNonEmptyString(body.warna, 'Warna produk', 60);
  }
  if (body.ukuran !== undefined) {
    updates.ukuran = parseProductSize(body.ukuran);
  }
  if (body.stok_pcs !== undefined) {
    updates.stok_pcs = parseNonNegativeStock(body.stok_pcs);
  }
  if (body.foto_url !== undefined) {
    updates.foto_url = parseOptionalString(body.foto_url, 'foto_url', 2048);
  }
  if (body.ai_detected_category !== undefined) {
    updates.ai_detected_category = parseOptionalString(
      body.ai_detected_category,
      'ai_detected_category',
      80,
    );
  }
  if (body.ai_detected_color !== undefined) {
    updates.ai_detected_color = parseOptionalString(
      body.ai_detected_color,
      'ai_detected_color',
      60,
    );
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError(
      400,
      'Minimal satu field produk harus dikirim untuk diperbarui.',
      'EMPTY_UPDATE',
    );
  }

  return updates;
}
