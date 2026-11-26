import { STATUS_STOK, getStatusStok } from '../utils/stock.js';

const tampilan = {
  [STATUS_STOK.HABIS]: { label: 'Habis', kelas: 'bg-red-100 text-red-700' },
  [STATUS_STOK.MENIPIS]: { label: 'Menipis', kelas: 'bg-amber-100 text-amber-800' },
  [STATUS_STOK.TERSEDIA]: { label: 'Tersedia', kelas: 'bg-emerald-100 text-emerald-800' },
};

export default function StatusBadge({ stok }) {
  const { label, kelas } = tampilan[getStatusStok(stok)];
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${kelas}`}>
      {label}
    </span>
  );
}
