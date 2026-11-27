-- ============================================================================
-- RoyalStore (Royal Thrift Store) — Supabase PostgreSQL Schema
-- Capstone Project Asah 2026 | Tim A26-CS149 (roadtogoto)
-- Prinsip Privasi: Bebas dari data harga modal, harga jual, maupun margin laba.
-- Cara pakai: Salin seluruh isi file ini ke Supabase -> SQL Editor -> Run.
-- ============================================================================

-- 1. ENUM TYPES
DO $$ BEGIN
  CREATE TYPE product_size AS ENUM ('S', 'M', 'L', 'XL', 'Semua Ukuran');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE mutation_type AS ENUM ('KELUAR', 'MASUK');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE sales_channel AS ENUM ('Toko Offline', 'WhatsApp', 'Instagram', 'Stok baru', 'Penyesuaian');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE restock_priority AS ENUM ('Kritis', 'Tinggi', 'Sedang');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE stock_alert_status AS ENUM ('HABIS', 'MENIPIS');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- 2. TRIGGER HELPER FOR updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 3. TABEL USERS (Layar 01 Masuk & 11 Profil)
CREATE TABLE IF NOT EXISTS users (
  id              BIGINT GENERATED ALWAYS AS IDENTITY,
  nama_lengkap    VARCHAR(100) NOT NULL,
  nama_pengguna   VARCHAR(60)  NOT NULL,
  password_hash   TEXT         NOT NULL,
  nomor_whatsapp  VARCHAR(30),
  foto_url        TEXT,
  nama_toko       VARCHAR(120) NOT NULL DEFAULT 'Royal Thrift Store',
  peran           VARCHAR(60)  NOT NULL DEFAULT 'Admin / Pemilik Toko',
  status_aktif    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_users                        PRIMARY KEY (id),
  CONSTRAINT uq_users_nama_pengguna          UNIQUE (nama_pengguna),
  CONSTRAINT chk_users_nama_lengkap_not_blank CHECK (LENGTH(TRIM(nama_lengkap)) > 0),
  CONSTRAINT chk_users_nama_pengguna_format  CHECK (nama_pengguna ~ '^[a-zA-Z0-9_]{3,60}$'),
  CONSTRAINT chk_users_password_not_blank    CHECK (LENGTH(TRIM(password_hash)) > 0),
  CONSTRAINT chk_users_whatsapp_format       CHECK (nomor_whatsapp IS NULL OR nomor_whatsapp ~ '^\+?[0-9\s\-]{8,25}$'),
  CONSTRAINT chk_users_nama_toko_not_blank   CHECK (LENGTH(TRIM(nama_toko)) > 0),
  CONSTRAINT chk_users_peran_not_blank       CHECK (LENGTH(TRIM(peran)) > 0)
);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- 4. TABEL STORE SETTINGS (Layar 09 Pengaturan)
CREATE TABLE IF NOT EXISTS store_settings (
  id                    BIGINT GENERATED ALWAYS AS IDENTITY,
  user_id               BIGINT      NOT NULL,
  bahasa                VARCHAR(10) NOT NULL DEFAULT 'id',
  tema                  VARCHAR(10) NOT NULL DEFAULT 'light',
  batas_stok_menipis    INT         NOT NULL DEFAULT 3,
  notifikasi_aplikasi   BOOLEAN     NOT NULL DEFAULT TRUE,
  pengingat_mingguan    BOOLEAN     NOT NULL DEFAULT TRUE,
  hari_pengingat        VARCHAR(20) NOT NULL DEFAULT 'Senin',
  jam_pengingat         VARCHAR(10) NOT NULL DEFAULT '08:00',
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_store_settings         PRIMARY KEY (id),
  CONSTRAINT uq_store_settings_user    UNIQUE (user_id),
  CONSTRAINT fk_store_settings_user    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_store_settings_bahasa CHECK (bahasa IN ('id', 'en')),
  CONSTRAINT chk_store_settings_tema   CHECK (tema IN ('light', 'dark')),
  CONSTRAINT chk_store_settings_batas  CHECK (batas_stok_menipis BETWEEN 0 AND 1000),
  CONSTRAINT chk_store_settings_hari   CHECK (hari_pengingat IN ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu')),
  CONSTRAINT chk_store_settings_jam    CHECK (jam_pengingat ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$')
);

DROP TRIGGER IF EXISTS trg_settings_updated_at ON store_settings;
CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- 5. TABEL CATEGORIES (Master Kategori Pakaian)
CREATE TABLE IF NOT EXISTS categories (
  id              BIGINT GENERATED ALWAYS AS IDENTITY,
  nama_kategori   VARCHAR(80) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_categories                PRIMARY KEY (id),
  CONSTRAINT uq_categories_nama           UNIQUE (nama_kategori),
  CONSTRAINT chk_categories_nama_not_blank CHECK (LENGTH(TRIM(nama_kategori)) > 0)
);


-- 6. TABEL PRODUCTS (Layar 03 Produk, 04 Tambah Produk + CV AI, 05 Ubah Produk, & RAG)
CREATE TABLE IF NOT EXISTS products (
  id                    BIGINT GENERATED ALWAYS AS IDENTITY,
  category_id           BIGINT       NOT NULL,
  nama_produk           VARCHAR(150) NOT NULL,
  warna                 VARCHAR(60)  NOT NULL,
  ukuran                product_size NOT NULL,
  stok_pcs              INT          NOT NULL DEFAULT 0,
  foto_url              TEXT,
  ai_detected_category  VARCHAR(80),
  ai_detected_color     VARCHAR(60),
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_products                  PRIMARY KEY (id),
  CONSTRAINT fk_products_category         FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT uq_products_variant          UNIQUE (nama_produk, warna, ukuran),
  CONSTRAINT chk_products_nama_not_blank  CHECK (LENGTH(TRIM(nama_produk)) > 0),
  CONSTRAINT chk_products_warna_not_blank CHECK (LENGTH(TRIM(warna)) > 0),
  CONSTRAINT chk_products_stok_non_neg    CHECK (stok_pcs >= 0)
);

CREATE INDEX IF NOT EXISTS idx_products_nama      ON products (LOWER(nama_produk));
CREATE INDEX IF NOT EXISTS idx_products_category  ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_ukuran    ON products (ukuran);
CREATE INDEX IF NOT EXISTS idx_products_stok      ON products (stok_pcs);

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- 7. TABEL STOCK MUTATIONS (Layar 06 Transaksi, Grafik 02/07, & Dataset Forecasting DS)
CREATE TABLE IF NOT EXISTS stock_mutations (
  id               BIGINT GENERATED ALWAYS AS IDENTITY,
  product_id       BIGINT        NOT NULL,
  user_id          BIGINT,
  jenis            mutation_type NOT NULL,
  jumlah           INT           NOT NULL,
  kanal            sales_channel NOT NULL,
  catatan          TEXT,
  waktu_transaksi  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_stock_mutations           PRIMARY KEY (id),
  CONSTRAINT fk_mutations_product         FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_mutations_user            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT chk_mutations_jumlah_pos     CHECK (jumlah > 0),
  CONSTRAINT chk_mutations_kanal_jenis    CHECK (
    (jenis = 'KELUAR' AND kanal IN ('Toko Offline', 'WhatsApp', 'Instagram', 'Penyesuaian')) OR
    (jenis = 'MASUK'  AND kanal IN ('Stok baru', 'Penyesuaian'))
  )
);

CREATE INDEX IF NOT EXISTS idx_mutations_waktu   ON stock_mutations (waktu_transaksi DESC);
CREATE INDEX IF NOT EXISTS idx_mutations_product ON stock_mutations (product_id);
CREATE INDEX IF NOT EXISTS idx_mutations_jenis   ON stock_mutations (jenis);


-- 8. TABEL STOCK NOTIFICATIONS (Badge Lonceng & Layar 10 Notifikasi)
CREATE TABLE IF NOT EXISTS stock_notifications (
  id           BIGINT GENERATED ALWAYS AS IDENTITY,
  product_id   BIGINT             NOT NULL,
  tipe_status  stock_alert_status NOT NULL,
  pesan        TEXT               NOT NULL,
  is_read      BOOLEAN            NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ        NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_stock_notifications          PRIMARY KEY (id),
  CONSTRAINT uq_notifications_product        UNIQUE (product_id),
  CONSTRAINT fk_notifications_product        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_notifications_pesan_not_blank CHECK (LENGTH(TRIM(pesan)) > 0)
);

DROP TRIGGER IF EXISTS trg_notif_updated_at ON stock_notifications;
CREATE TRIGGER trg_notif_updated_at
  BEFORE UPDATE ON stock_notifications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- 9. TABEL RESTOCK FORECASTS (Output Model Forecasting Unit DS — Layar 07 & 08)
CREATE TABLE IF NOT EXISTS restock_forecasts (
  id               BIGINT GENERATED ALWAYS AS IDENTITY,
  product_id       BIGINT           NOT NULL,
  prediksi_7_hari  INT              NOT NULL DEFAULT 0,
  saran_tambah_pcs INT              NOT NULL DEFAULT 0,
  prioritas        restock_priority NOT NULL DEFAULT 'Sedang',
  mae              NUMERIC(6, 2),
  rmse             NUMERIC(6, 2),
  generated_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_restock_forecasts            PRIMARY KEY (id),
  CONSTRAINT uq_forecasts_product            UNIQUE (product_id),
  CONSTRAINT fk_forecasts_product            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_forecasts_prediksi_non_neg  CHECK (prediksi_7_hari >= 0),
  CONSTRAINT chk_forecasts_saran_non_neg     CHECK (saran_tambah_pcs >= 0),
  CONSTRAINT chk_forecasts_mae_non_neg       CHECK (mae IS NULL OR mae >= 0),
  CONSTRAINT chk_forecasts_rmse_non_neg      CHECK (rmse IS NULL OR rmse >= 0)
);


-- 10. TABEL AI WEEKLY NARRATIVES (Cache Smart Restock Narrative & Fallback — Layar 07 & 08)
CREATE TABLE IF NOT EXISTS ai_weekly_narratives (
  id            BIGINT GENERATED ALWAYS AS IDENTITY,
  periode_label VARCHAR(80) NOT NULL,
  narasi_poin   JSONB       NOT NULL, -- Contoh: [{"judul": "...", "isi": "..."}]
  sumber        VARCHAR(30) NOT NULL DEFAULT 'LLM_PROPRIETARY',
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_ai_narratives                 PRIMARY KEY (id),
  CONSTRAINT uq_ai_narratives_periode         UNIQUE (periode_label),
  CONSTRAINT chk_ai_narratives_periode_blank  CHECK (LENGTH(TRIM(periode_label)) > 0),
  CONSTRAINT chk_ai_narratives_sumber         CHECK (sumber IN ('LLM_PROPRIETARY', 'FALLBACK_RULE')),
  CONSTRAINT chk_ai_narratives_json_array     CHECK (jsonb_typeof(narasi_poin) = 'array' AND jsonb_array_length(narasi_poin) > 0)
);


-- 11. DYNAMIC VIEW: PRODUK + STATUS STOK OTOMATIS BERDASARKAN PENGATURAN
-- Aturan default (batas_stok_menipis = 3): 0 = Habis, 1..3 = Menipis, >3 = Tersedia
CREATE OR REPLACE VIEW v_products_with_status AS
SELECT
  p.id,
  p.nama_produk,
  c.id AS category_id,
  c.nama_kategori AS kategori,
  p.warna,
  p.ukuran,
  p.stok_pcs,
  p.foto_url,
  COALESCE(s.batas_stok_menipis, 3) AS batas_menipis,
  CASE
    WHEN p.stok_pcs = 0 THEN 'Habis'
    WHEN p.stok_pcs <= COALESCE(s.batas_stok_menipis, 3) THEN 'Menipis'
    ELSE 'Tersedia'
  END AS status_stok,
  p.created_at,
  p.updated_at
FROM products p
JOIN categories c ON c.id = p.category_id
LEFT JOIN LATERAL (
  SELECT batas_stok_menipis FROM store_settings ORDER BY id ASC LIMIT 1
) s ON TRUE;


-- 12. TRIGGER OTOMATIS SINKRONISASI NOTIFIKASI STOK
-- Saat produk ditambah/diubah stoknya, notifikasi muncul otomatis jika <= batas,
-- dan otomatis terhapus jika stok sudah diisi ulang (> batas).
CREATE OR REPLACE FUNCTION sync_stock_notification()
RETURNS TRIGGER AS $$
DECLARE
  v_batas INT;
BEGIN
  SELECT COALESCE(batas_stok_menipis, 3) INTO v_batas FROM store_settings LIMIT 1;
  IF v_batas IS NULL THEN
    v_batas := 3;
  END IF;

  IF NEW.stok_pcs = 0 THEN
    INSERT INTO stock_notifications (product_id, tipe_status, pesan, is_read)
    VALUES (
      NEW.id,
      'HABIS',
      'Ukuran ' || NEW.ukuran::TEXT || ' · stok 0 pcs (habis)',
      FALSE
    )
    ON CONFLICT (product_id) DO UPDATE
      SET tipe_status = 'HABIS',
          pesan = EXCLUDED.pesan,
          is_read = FALSE,
          updated_at = NOW();

  ELSIF NEW.stok_pcs <= v_batas THEN
    INSERT INTO stock_notifications (product_id, tipe_status, pesan, is_read)
    VALUES (
      NEW.id,
      'MENIPIS',
      'Ukuran ' || NEW.ukuran::TEXT || ' · sisa ' || NEW.stok_pcs || ' pcs (menipis)',
      FALSE
    )
    ON CONFLICT (product_id) DO UPDATE
      SET tipe_status = 'MENIPIS',
          pesan = EXCLUDED.pesan,
          is_read = FALSE,
          updated_at = NOW();

  ELSE
    DELETE FROM stock_notifications WHERE product_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_sync_notif ON products;
CREATE TRIGGER trg_products_sync_notif
  AFTER INSERT OR UPDATE OF stok_pcs, ukuran ON products
  FOR EACH ROW EXECUTE FUNCTION sync_stock_notification();

-- Jika ambang batas di 09 Pengaturan diubah, sinkronkan ulang seluruh notifikasi
CREATE OR REPLACE FUNCTION resync_all_stock_notifications()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET stok_pcs = stok_pcs;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_settings_resync_notif ON store_settings;
CREATE TRIGGER trg_settings_resync_notif
  AFTER UPDATE OF batas_stok_menipis ON store_settings
  FOR EACH ROW EXECUTE FUNCTION resync_all_stock_notifications();


-- 13. STORED FUNCTIONS (ATOMIC TRANSACTION) UNTUK PENJUALAN & STOK MASUK
-- Mencegah stok minus saat stok = 0 atau transaksi bersamaan (race condition).
CREATE OR REPLACE FUNCTION record_stock_sale(
  p_product_id BIGINT,
  p_user_id    BIGINT,
  p_jumlah     INT,
  p_kanal      sales_channel,
  p_waktu      TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  mutation_id BIGINT,
  product_id  BIGINT,
  sisa_stok   INT
) AS $$
DECLARE
  v_current_stock INT;
  v_mut_id        BIGINT;
BEGIN
  IF p_jumlah IS NULL OR p_jumlah <= 0 THEN
    RAISE EXCEPTION 'Jumlah terjual harus minimal 1 pcs.';
  END IF;

  -- Row lock agar mutasi stok aman dari race condition
  SELECT stok_pcs INTO v_current_stock
  FROM products
  WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Produk dengan ID % tidak ditemukan.', p_product_id;
  END IF;

  IF v_current_stock = 0 THEN
    RAISE EXCEPTION 'Stok habis. Penjualan tidak dapat disimpan jika stok produk 0 pcs.';
  END IF;

  IF v_current_stock < p_jumlah THEN
    RAISE EXCEPTION 'Stok tidak mencukupi. Sisa stok saat ini: % pcs.', v_current_stock;
  END IF;

  UPDATE products
  SET stok_pcs = stok_pcs - p_jumlah
  WHERE id = p_product_id
  RETURNING stok_pcs INTO v_current_stock;

  INSERT INTO stock_mutations (product_id, user_id, jenis, jumlah, kanal, waktu_transaksi)
  VALUES (p_product_id, p_user_id, 'KELUAR', p_jumlah, p_kanal, COALESCE(p_waktu, NOW()))
  RETURNING id INTO v_mut_id;

  RETURN QUERY SELECT v_mut_id, p_product_id, v_current_stock;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION record_stock_in(
  p_product_id BIGINT,
  p_user_id    BIGINT,
  p_jumlah     INT,
  p_kanal      sales_channel DEFAULT 'Stok baru',
  p_catatan    TEXT DEFAULT NULL
)
RETURNS TABLE (
  mutation_id BIGINT,
  product_id  BIGINT,
  stok_baru   INT
) AS $$
DECLARE
  v_new_stock INT;
  v_mut_id    BIGINT;
BEGIN
  IF p_jumlah IS NULL OR p_jumlah <= 0 THEN
    RAISE EXCEPTION 'Jumlah stok masuk harus minimal 1 pcs.';
  END IF;

  UPDATE products
  SET stok_pcs = stok_pcs + p_jumlah
  WHERE id = p_product_id
  RETURNING stok_pcs INTO v_new_stock;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Produk dengan ID % tidak ditemukan.', p_product_id;
  END IF;

  INSERT INTO stock_mutations (product_id, user_id, jenis, jumlah, kanal, catatan)
  VALUES (p_product_id, p_user_id, 'MASUK', p_jumlah, p_kanal, p_catatan)
  RETURNING id INTO v_mut_id;

  RETURN QUERY SELECT v_mut_id, p_product_id, v_new_stock;
END;
$$ LANGUAGE plpgsql;


-- 14. SEED DATA AWAL (SESUAI DESAIN FIGMA & PROJECT PLAN A26-CS149)
INSERT INTO users (nama_lengkap, nama_pengguna, password_hash, nomor_whatsapp, nama_toko)
VALUES (
  'Egi',
  'egi_royalthrift',
  '$2b$10$placeholderHashGantiDenganBcryptDariBackend',
  '+62 852-7196-8290',
  'Royal Thrift Store'
)
ON CONFLICT (nama_pengguna) DO NOTHING;

INSERT INTO store_settings (user_id, bahasa, tema, batas_stok_menipis, notifikasi_aplikasi, pengingat_mingguan)
SELECT id, 'id', 'light', 3, TRUE, TRUE
FROM users WHERE nama_pengguna = 'egi_royalthrift'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO categories (nama_kategori) VALUES
  ('Blouse'),
  ('Cardigan'),
  ('Kemeja'),
  ('Dress'),
  ('Jaket'),
  ('Rok'),
  ('Celana')
ON CONFLICT (nama_kategori) DO NOTHING;

-- Seed Produk Contoh (Trigger sync_stock_notification otomatis mengisi notifikasi 7 item kritis/menipis!)
DO $$
DECLARE
  c_blouse   BIGINT;
  c_cardigan BIGINT;
  c_kemeja   BIGINT;
  c_dress    BIGINT;
  c_jaket    BIGINT;
  c_rok      BIGINT;
BEGIN
  IF (SELECT COUNT(*) FROM products) = 0 THEN
    SELECT id INTO c_blouse   FROM categories WHERE nama_kategori = 'Blouse';
    SELECT id INTO c_cardigan FROM categories WHERE nama_kategori = 'Cardigan';
    SELECT id INTO c_kemeja   FROM categories WHERE nama_kategori = 'Kemeja';
    SELECT id INTO c_dress    FROM categories WHERE nama_kategori = 'Dress';
    SELECT id INTO c_jaket    FROM categories WHERE nama_kategori = 'Jaket';
    SELECT id INTO c_rok      FROM categories WHERE nama_kategori = 'Rok';

    INSERT INTO products (category_id, nama_produk, warna, ukuran, stok_pcs) VALUES
      (c_blouse,   'Blouse Peplum Kerah',     'Krem',         'M',            2), -- Menipis
      (c_blouse,   'Blouse Satin Putih',      'Putih',        'L',            7), -- Tersedia
      (c_blouse,   'Blouse Lengan Balon',     'Putih',        'L',            1), -- Menipis
      (c_kemeja,   'Kemeja Flanel Oversize',  'Merah Kotak',  'L',            1), -- Menipis
      (c_kemeja,   'Kemeja Kotak-kotak',      'Biru Tua',     'M',            8), -- Tersedia
      (c_kemeja,   'Kemeja Kotak-kotak',      'Hitam',        'XL',           0), -- Habis
      (c_dress,    'Dress Floral Midi',       'Putih Motif',  'M',            0), -- Habis
      (c_dress,    'Dress Polos Midi',        'Hitam',        'S',            6), -- Tersedia
      (c_cardigan, 'Cardigan Rajut',          'Abu-abu',      'Semua Ukuran', 0), -- Habis
      (c_jaket,    'Jaket Denim Vintage',     'Biru Denim',   'L',            2), -- Menipis
      (c_rok,      'Rok Plisket',             'Cokelat Muda', 'S',            5); -- Tersedia
  END IF;
END $$;
