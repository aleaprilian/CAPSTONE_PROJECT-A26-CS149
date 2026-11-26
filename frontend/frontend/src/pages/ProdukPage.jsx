import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import ProductToolbar from '../components/ProductToolbar.jsx';
import ProductTable from '../components/ProductTable.jsx';
import Pagination from '../components/Pagination.jsx';
import { getProducts } from '../services/productService.js';
import { kategoriMaster } from '../data/mockProducts.js';
import { BATAS_MENIPIS, getStatusStok } from '../utils/stock.js';

const JUMLAH_PER_HALAMAN = 8;
const UKURAN_STANDAR = ['S', 'M', 'L', 'XL'];
const FILTER_AWAL = { cari: '', kategori: 'semua', ukuran: 'semua', status: 'semua', urut: 'stok-asc' };

function urutkan(daftar, urut) {
  const hasil = [...daftar];
  const cmpNama = (a, b) => a.nama_produk.localeCompare(b.nama_produk, 'id');
  switch (urut) {
    case 'stok-desc':
      return hasil.sort((a, b) => b.stok_pcs - a.stok_pcs || cmpNama(a, b));
    case 'nama-asc':
      return hasil.sort(cmpNama);
    case 'terbaru':
      return hasil.sort((a, b) => b.id - a.id);
    case 'stok-asc':
    default:
      return hasil.sort((a, b) => a.stok_pcs - b.stok_pcs || cmpNama(a, b));
  }
}

export default function ProdukPage() {
  const [produk, setProduk] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState('');
  const [filter, setFilter] = useState(FILTER_AWAL);
  const [halaman, setHalaman] = useState(1);
  const [pesan, setPesan] = useState('');

  useEffect(() => {
    let batal = false;
    getProducts()
      .then((data) => !batal && setProduk(data))
      .catch(() => !batal && setGalat('Data produk gagal dimuat. Muat ulang halaman untuk mencoba lagi.'))
      .finally(() => !batal && setMemuat(false));
    return () => {
      batal = true;
    };
  }, []);

  // Pesan sementara untuk aksi yang belum aktif.
  useEffect(() => {
    if (!pesan) return undefined;
    const t = setTimeout(() => setPesan(''), 3000);
    return () => clearTimeout(t);
  }, [pesan]);

  const opsiKategori = useMemo(
    () => [
      { value: 'semua', label: 'Semua' },
      ...kategoriMaster.map((k) => ({ value: k.nama_kategori, label: k.nama_kategori })),
    ],
    [],
  );

  const opsiUkuran = useMemo(
    () => [{ value: 'semua', label: 'Semua' }, ...UKURAN_STANDAR.map((u) => ({ value: u, label: u }))],
    [],
  );

  const hasilFilter = useMemo(() => {
    const kata = filter.cari.trim().toLowerCase();
    const disaring = produk.filter((p) => {
      if (kata && !p.nama_produk.toLowerCase().includes(kata)) return false;
      if (filter.kategori !== 'semua' && p.nama_kategori !== filter.kategori) return false;
      // Produk "Semua Ukuran" tersedia untuk ukuran apa pun.
      if (filter.ukuran !== 'semua' && p.ukuran !== filter.ukuran && p.ukuran !== 'Semua Ukuran') return false;
      if (filter.status !== 'semua' && getStatusStok(p.stok_pcs) !== filter.status) return false;
      return true;
    });
    return urutkan(disaring, filter.urut);
  }, [produk, filter]);

  const total = hasilFilter.length;
  const totalHalaman = Math.ceil(total / JUMLAH_PER_HALAMAN);
  const halamanAktif = Math.min(halaman, Math.max(totalHalaman, 1));
  const awal = (halamanAktif - 1) * JUMLAH_PER_HALAMAN;
  const tampil = hasilFilter.slice(awal, awal + JUMLAH_PER_HALAMAN);

  const ubahFilter = (kunci, nilai) => {
    setFilter((f) => ({ ...f, [kunci]: nilai }));
    setHalaman(1);
  };

  const aksiBelumAktif = (teks) => () => setPesan(teks);

  return (
    <div className="mx-auto max-w-[1100px] lg:max-w-none">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Produk</h1>
          <p className="mt-1 text-sm text-slate-500">
            Daftar semua produk beserta jumlah stok per ukuran
          </p>
        </div>
        <button
          type="button"
          onClick={aksiBelumAktif('Form tambah produk belum tersedia pada tahap ini.')}
          className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Plus size={16} strokeWidth={2.2} />
          Tambah Produk
        </button>
      </div>

      {pesan && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
        >
          {pesan}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <ProductToolbar
          filter={filter}
          opsiKategori={opsiKategori}
          opsiUkuran={opsiUkuran}
          onUbah={ubahFilter}
        />

        <div className="mt-5 min-h-[200px]">
          {memuat && <p className="py-16 text-center text-sm text-slate-500">Memuat data produk...</p>}

          {!memuat && galat && (
            <p role="alert" className="py-16 text-center text-sm text-red-600">
              {galat}
            </p>
          )}

          {!memuat && !galat && total === 0 && (
            <p className="py-16 text-center text-sm text-slate-500">Produk tidak ditemukan.</p>
          )}

          {!memuat && !galat && total > 0 && (
            <ProductTable
              produk={tampil}
              onUbah={(p) => setPesan(`Form ubah produk "${p.nama_produk}" belum tersedia pada tahap ini.`)}
              onHapus={(p) => setPesan(`Hapus produk "${p.nama_produk}" belum tersedia pada tahap ini.`)}
            />
          )}
        </div>

        {!memuat && !galat && total > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              Menampilkan {awal + 1} sampai {awal + tampil.length} dari {total} produk
            </p>
            <Pagination halaman={halamanAktif} totalHalaman={totalHalaman} onUbah={setHalaman} />
          </div>
        )}
      </section>

      <p className="mt-3 text-xs text-slate-400">
        Status stok otomatis: Habis = 0 pcs, Menipis = 1 sampai {BATAS_MENIPIS} pcs, Tersedia = lebih
        dari {BATAS_MENIPIS} pcs (ambang batas dapat diubah di Pengaturan).
      </p>
    </div>
  );
}
