function buatDaftarHalaman(halaman, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, halaman - 1, halaman, halaman + 1]);
  const urut = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const hasil = [];
  urut.forEach((n, i) => {
    if (i > 0 && n - urut[i - 1] > 1) hasil.push('...');
    hasil.push(n);
  });
  return hasil;
}

const tombolDasar =
  'h-10 rounded-xl border text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export default function Pagination({ halaman, totalHalaman, onUbah }) {
  if (totalHalaman <= 0) return null;

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Paginasi">
      <button
        type="button"
        disabled={halaman === 1}
        onClick={() => onUbah(halaman - 1)}
        className={`${tombolDasar} border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50`}
      >
        Sebelumnya
      </button>

      {buatDaftarHalaman(halaman, totalHalaman).map((item, i) =>
        item === '...' ? (
          <span key={`titik-${i}`} className="px-1 text-slate-400">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onUbah(item)}
            aria-current={item === halaman ? 'page' : undefined}
            className={`${tombolDasar} w-10 ${
              item === halaman
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={halaman === totalHalaman}
        onClick={() => onUbah(halaman + 1)}
        className={`${tombolDasar} border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50`}
      >
        Berikutnya
      </button>
    </nav>
  );
}
