import type { MaturityLevel } from '../../types';

const MATURITY_COLOR: Record<MaturityLevel, string> = {
  Reactive: 'var(--color-danger)',
  Developing: 'var(--color-warning)',
  Structured: 'var(--color-brand-500)',
  'Operational Excellence': 'var(--color-success)',
};

interface ScoreCardProps {
  globalScore: number;
  maturityLevel: MaturityLevel;
}

export function ScoreCard({ globalScore, maturityLevel }: ScoreCardProps) {
  const color = MATURITY_COLOR[maturityLevel];
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - globalScore / 100);

  return (
    <div className="card p-8 flex flex-col items-center text-center fade-in">
      <div className="relative w-40 h-40 mb-4">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-surface-hover)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="54"
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
          <span className="text-4xl font-bold tracking-tight">{globalScore}</span>
          <span className="text-xs text-[var(--color-text-muted)]">/ 100</span>
        </div>
      </div>
      <h3 className="text-sm uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
        Operations Score
      </h3>
      <span
        className="text-xs font-medium px-3 py-1 rounded-full"
        style={{ color, backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
      >
        {maturityLevel}
      </span>
    </div>
  );
}
