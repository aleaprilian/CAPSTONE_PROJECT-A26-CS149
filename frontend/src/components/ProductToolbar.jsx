import { ListFilter, Search } from 'lucide-react';
import FilterSelect from './FilterSelect.jsx';

export const OPSI_URUTAN = [
  { value: 'stok-asc', label: 'Stok Terendah' },
  { value: 'stok-desc', label: 'Stok Tertinggi' },
  { value: 'nama-asc', label: 'Nama A-Z' },
  { value: 'terbaru', label: 'Terbaru Masuk' },
];

export const OPSI_STATUS = [
  { value: 'semua', label: 'Semua' },
  { value: 'tersedia', label: 'Tersedia' },
  { value: 'menipis', label: 'Menipis' },
  { value: 'habis', label: 'Habis' },
];

export default function ProductToolbar({ filter, opsiKategori, opsiUkuran, onUbah }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="relative min-w-[180px] flex-[2]">
        <span className="sr-only">Cari nama produk</span>
        <Search
          size={16}
          strokeWidth={1.8}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={filter.cari}
          onChange={(e) => onUbah('cari', e.target.value)}
          placeholder="Cari nama produk"
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/30"
        />
      </label>

      <FilterSelect
        label="Kategori"
        value={filter.kategori}
        options={opsiKategori}
        onChange={(v) => onUbah('kategori', v)}
      />
      <FilterSelect
        label="Ukuran"
        value={filter.ukuran}
        options={opsiUkuran}
        onChange={(v) => onUbah('ukuran', v)}
      />
      <FilterSelect
        label="Status Stok"
        value={filter.status}
        options={OPSI_STATUS}
        onChange={(v) => onUbah('status', v)}
      />
      <FilterSelect
        label="Urutkan"
        icon={ListFilter}
        value={filter.urut}
        options={OPSI_URUTAN}
        onChange={(v) => onUbah('urut', v)}
      />
    </div>
  );
}
