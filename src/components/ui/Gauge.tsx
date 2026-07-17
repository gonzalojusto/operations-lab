interface GaugeProps {
  value: number; // 0-100
  label: string;
  color?: string;
  size?: number;
}

export function Gauge({ value, label, color = 'var(--color-brand-500)', size = 128 }: GaugeProps) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.max(0, Math.min(100, value)) / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-surface-hover)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 700ms ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight">{Math.round(value)}</span>
          <span className="text-[10px] text-[var(--color-text-muted)]">/ 100</span>
        </div>
      </div>
      <span className="text-xs text-[var(--color-text-secondary)] mt-2 text-center">{label}</span>
    </div>
  );
}
