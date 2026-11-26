import ProductThumb from './ProductThumb.jsx';
import StatusBadge from './StatusBadge.jsx';

function AksiProduk({ produk, onUbah, onHapus }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onUbah(produk)}
        aria-label={`Ubah ${produk.nama_produk}`}
        className="rounded-lg border border-blue-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
      >
        Ubah
      </button>
      <button
        type="button"
        onClick={() => onHapus(produk)}
        aria-label={`Hapus ${produk.nama_produk}`}
        className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
      >
        Hapus
      </button>
    </div>
  );
}

function Stok({ nilai }) {
  return (
    <span className={`font-bold ${nilai === 0 ? 'text-red-600' : 'text-slate-900'}`}>{nilai}</span>
  );
}

export default function ProductTable({ produk, onUbah, onHapus }) {
  return (
    <>
      {/* Tabel untuk layar md ke atas */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold text-slate-600">
              <th className="rounded-l-lg px-4 py-3.5">Foto</th>
              <th className="px-4 py-3.5">Nama Produk</th>
              <th className="px-4 py-3.5">Kategori</th>
              <th className="px-4 py-3.5">Warna</th>
              <th className="px-4 py-3.5">Ukuran</th>
              <th className="px-4 py-3.5">Stok (pcs)</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="rounded-r-lg px-4 py-3.5">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {produk.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <ProductThumb foto={p.foto_url} nama={p.nama_produk} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-900">{p.nama_produk}</td>
                <td className="px-4 py-3 text-slate-700">{p.nama_kategori}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{p.warna}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{p.ukuran}</td>
                <td className="px-4 py-3">
                  <Stok nilai={p.stok_pcs} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge stok={p.stok_pcs} />
                </td>
                <td className="px-4 py-3">
                  <AksiProduk produk={p} onUbah={onUbah} onHapus={onHapus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kartu untuk ponsel */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {produk.map((p) => (
          <li key={p.id} className="flex flex-col gap-3 py-4">
            <div className="flex items-start gap-3">
              <ProductThumb foto={p.foto_url} nama={p.nama_produk} />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900">{p.nama_produk}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {p.nama_kategori} - {p.warna} - {p.ukuran}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-slate-500">
                  Stok: <Stok nilai={p.stok_pcs} /> pcs
                </span>
                <StatusBadge stok={p.stok_pcs} />
              </div>
            </div>
            <AksiProduk produk={p} onUbah={onUbah} onHapus={onHapus} />
          </li>
        ))}
      </ul>
    </>
  );
}
