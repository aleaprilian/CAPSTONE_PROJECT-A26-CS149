import { ChevronDown } from 'lucide-react';

// Select native (aksesibel & nyaman di ponsel) dengan tampilan "Label: Pilihan" seperti desain.
export default function FilterSelect({ label, value, options, onChange, icon: Icon }) {
  const terpilih = options.find((o) => o.value === value);

  return (
    <label className="relative flex h-11 min-w-[150px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus-within:ring-2 focus-within:ring-blue-500/40 lg:flex-none">
      {Icon && <Icon size={16} className="shrink-0 text-slate-500" strokeWidth={1.8} />}
      <span className="flex-1 truncate whitespace-nowrap">
        {label}: {terpilih?.label}
      </span>
      <ChevronDown size={16} className="shrink-0 text-slate-500" />
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
