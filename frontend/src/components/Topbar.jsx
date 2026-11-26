import { Bell, Menu } from 'lucide-react';
import { mockNotificationCount } from '../data/mockProducts.js';

export default function Topbar({ onBukaMenu }) {
  return (
    <header className="flex h-[68px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
      <button
        type="button"
        onClick={onBukaMenu}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </button>

      <div className="ml-auto flex items-center gap-4">
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          aria-label={`Notifikasi, ${mockNotificationCount} belum dibaca`}
        >
          <Bell size={18} strokeWidth={1.8} />
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {mockNotificationCount}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
            E
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-bold text-slate-900">Egi</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
