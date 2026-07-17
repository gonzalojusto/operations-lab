import type { ComponentType } from 'react';

interface StatCardProps {
  icon: ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  hint?: string;
  tone?: 'neutral' | 'warning' | 'danger' | 'success';
}

const TONE_COLOR: Record<NonNullable<StatCardProps['tone']>, string> = {
  neutral: 'var(--color-brand-500)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  success: 'var(--color-success)',
};

export function StatCard({ icon: Icon, label, value, hint, tone = 'neutral' }: StatCardProps) {
  const color = TONE_COLOR[tone];
  return (
    <div className="card p-5 fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={15} style={{ color }} />
        <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      {hint && <p className="text-xs text-[var(--color-text-muted)] mt-1">{hint}</p>}
    </div>
  );
}
