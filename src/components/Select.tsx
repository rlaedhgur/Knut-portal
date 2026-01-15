"use client";

type Option = { value: string; label: string };

export default function Select({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  className?: string;
}) {
  return (
    <label className={`flex items-center gap-2 ${className}`}>
      {label ? <span className="text-sm text-gray-600">{label}</span> : null}
      <select
        className="border rounded px-2 py-1 bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
