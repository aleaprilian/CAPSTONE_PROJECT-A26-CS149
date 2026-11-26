import assert from 'node:assert/strict';
import test from 'node:test';
import { createApp } from '../src/app.js';
import { createMemoryProductRepository } from '../src/repositories/memoryProductRepository.js';

async function startTestServer() {
  const repo = createMemoryProductRepository();
  const app = createApp(repo);
  const server = await new Promise((resolve) => {
    const srv = app.listen(0, '127.0.0.1', () => resolve(srv));
  });
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  return { server, baseUrl };
}

async function requestJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const body = await res.json();
  return { status: res.status, body };
}

test('GET /api/health dan GET /api/categories mengembalikan status sehat dan 7 kategori master', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const health = await requestJson(`${baseUrl}/api/health`);
    assert.equal(health.status, 200);
    assert.equal(health.body.success, true);
    assert.equal(health.body.data.storage.ok, true);
    assert.equal(health.body.data.storage.total_products, 11);

    const categories = await requestJson(`${baseUrl}/api/categories`);
    assert.equal(categories.status, 200);
    assert.equal(categories.body.data.length, 7);
    assert.equal(categories.body.data[0].nama_kategori, 'Blouse');

    const v1Products = await requestJson(`${baseUrl}/api/v1/products?limit=2`);
    assert.equal(v1Products.status, 200);
    assert.equal(v1Products.body.data.length, 2);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /api/products mendukung pencarian, filter kategori/ukuran/status, dan paginasi', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    // Filter ukuran M harus ikut menampilkan produk "Semua Ukuran" (Cardigan Rajut)
    const sizeM = await requestJson(`${baseUrl}/api/products?ukuran=M`);
    assert.equal(sizeM.status, 200);
    const hasAllSize = sizeM.body.data.some((p) => p.ukuran === 'Semua Ukuran');
    assert.equal(hasAllSize, true);

    // Filter status habis (0 pcs)
    const emptyStock = await requestJson(`${baseUrl}/api/products?status=habis`);
    assert.equal(emptyStock.status, 200);
    assert.ok(emptyStock.body.data.length > 0);
    assert.ok(emptyStock.body.data.every((p) => p.stok_pcs === 0 && p.status_stok === 'Habis'));

    // Paginasi page=1&limit=4
    const paged = await requestJson(`${baseUrl}/api/products?page=1&limit=4`);
    assert.equal(paged.status, 200);
    assert.equal(paged.body.data.length, 4);
    assert.equal(paged.body.meta.total, 11);
    assert.equal(paged.body.meta.total_pages, 3);

    // Pencarian yang tidak ditemukan
    const notFoundSearch = await requestJson(`${baseUrl}/api/products?search=tidak_ada_sama_sekali`);
    assert.equal(notFoundSearch.status, 200);
    assert.equal(notFoundSearch.body.data.length, 0);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('Alur penuh CRUD produk: POST -> GET -> PUT -> DELETE -> GET 404', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    // 1. Tambah produk baru (stok 2 -> Menipis)
    const created = await requestJson(`${baseUrl}/api/products`, {
      method: 'POST',
      body: JSON.stringify({
        category_id: 5,
        nama_produk: 'Jaket Corduroy Vintage',
        warna: 'Cokelat',
        ukuran: 'L',
        stok_pcs: 2,
      }),
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.nama_kategori, 'Jaket');
    assert.equal(created.body.data.status_stok, 'Menipis');
    const productId = created.body.data.id;

    // 2. Detail produk
    const fetched = await requestJson(`${baseUrl}/api/products/${productId}`);
    assert.equal(fetched.status, 200);
    assert.equal(fetched.body.data.nama_produk, 'Jaket Corduroy Vintage');

    // 3. Ubah stok produk menjadi 8 -> Tersedia
    const updated = await requestJson(`${baseUrl}/api/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ stok_pcs: 8, ukuran: 'XL' }),
    });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.data.stok_pcs, 8);
    assert.equal(updated.body.data.ukuran, 'XL');
    assert.equal(updated.body.data.status_stok, 'Tersedia');

    // 4. Hapus produk
    const deleted = await requestJson(`${baseUrl}/api/products/${productId}`, {
      method: 'DELETE',
    });
    assert.equal(deleted.status, 200);

    // 5. Pastikan tidak ada lagi
    const afterDelete = await requestJson(`${baseUrl}/api/products/${productId}`);
    assert.equal(afterDelete.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('Validasi input menolak stok negatif/desimal/huruf, field kosong, varian duplikat, dan kolom harga', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const invalidCases = [
      {
        label: 'stok negatif',
        payload: { category_id: 1, nama_produk: 'Blouse Uji', warna: 'Merah', ukuran: 'M', stok_pcs: -1 },
        expectedStatus: 400,
      },
      {
        label: 'stok desimal',
        payload: { category_id: 1, nama_produk: 'Blouse Uji', warna: 'Merah', ukuran: 'M', stok_pcs: 2.5 },
        expectedStatus: 400,
      },
      {
        label: 'stok huruf',
        payload: { category_id: 1, nama_produk: 'Blouse Uji', warna: 'Merah', ukuran: 'M', stok_pcs: 'lima' },
        expectedStatus: 400,
      },
      {
        label: 'stok spasi kosong',
        payload: { category_id: 1, nama_produk: 'Blouse Uji', warna: 'Merah', ukuran: 'M', stok_pcs: '   ' },
        expectedStatus: 400,
      },
      {
        label: 'ukuran tidak valid',
        payload: { category_id: 1, nama_produk: 'Blouse Uji', warna: 'Merah', ukuran: 'XXXL', stok_pcs: 3 },
        expectedStatus: 400,
      },
      {
        label: 'melanggar privasi harga/margin',
        payload: { category_id: 1, nama_produk: 'Blouse Uji', warna: 'Merah', ukuran: 'M', stok_pcs: 3, harga_jual: 50000 },
        expectedStatus: 400,
      },
      {
        label: 'kategori tidak ada',
        payload: { category_id: 999, nama_produk: 'Blouse Uji', warna: 'Merah', ukuran: 'M', stok_pcs: 3 },
        expectedStatus: 400,
      },
      {
        label: 'duplikat nama+warna+ukuran dengan seed',
        payload: { category_id: 1, nama_produk: 'Blouse Peplum Kerah', warna: 'Krem', ukuran: 'M', stok_pcs: 4 },
        expectedStatus: 409,
      },
    ];

    for (const tc of invalidCases) {
      const res = await requestJson(`${baseUrl}/api/products`, {
        method: 'POST',
        body: JSON.stringify(tc.payload),
      });
      assert.equal(res.status, tc.expectedStatus, `Gagal pada skenario: ${tc.label}`);
      assert.equal(res.body.success, false);
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
