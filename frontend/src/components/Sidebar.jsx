import { NavLink } from 'react-router-dom';
import {
  ArrowLeftRight,
  ChartColumn,
  LayoutGrid,
  LogOut,
  Package,
  RefreshCw,
  SlidersHorizontal,
  X,
} from 'lucide-react';

const menuUtama = [
  { to: '/beranda', label: 'Beranda', icon: LayoutGrid },
  { to: '/produk', label: 'Produk', icon: Package },
  { to: '/transaksi', label: 'Transaksi', icon: ArrowLeftRight },
  { to: '/analitik-penjualan', label: 'Analitik Penjualan', icon: ChartColumn },
  { to: '/rekomendasi-restock', label: 'Rekomendasi Restock', icon: RefreshCw },
];

const linkClass = ({ isActive }) =>
  [
    'flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ');

export default function Sidebar({ terbuka, onTutup }) {
  return (
    <>
      {/* Latar gelap untuk drawer di ponsel */}
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity lg:hidden ${
          terbuka ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onTutup}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[216px] flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          terbuka ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[68px] items-center justify-between px-6">
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-blue-600">Royal</span>
            <span className="text-slate-900">Store</span>
          </span>
          <button
            type="button"
            onClick={onTutup}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col px-3 pt-3" aria-label="Menu utama">
          <ul className="space-y-1">
            {menuUtama.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} className={linkClass} onClick={onTutup}>
                  <Icon size={18} strokeWidth={1.8} className="shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="my-5 border-t border-slate-200" />

          <ul className="space-y-1">
            <li>
              <NavLink to="/pengaturan" className={linkClass} onClick={onTutup}>
                <SlidersHorizontal size={18} strokeWidth={1.8} />
                Pengaturan
              </NavLink>
            </li>
            <li>
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <LogOut size={18} strokeWidth={1.8} />
                Keluar
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
