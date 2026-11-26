import { Shirt } from 'lucide-react';

export default function ProductThumb({ foto, nama }) {
  if (foto) {
    return <img src={foto} alt={nama} className="h-8 w-8 rounded-lg object-cover" />;
  }
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200/70 text-slate-400"
      aria-hidden="true"
    >
      <Shirt size={15} strokeWidth={1.8} />
    </div>
  );
}
