import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Trash2, Plus } from 'lucide-react';
import { KPITrendChart } from '../charts/KPITrendChart';
import { calculateKPIStatus, getLatestValue, getTrend } from '../../services/kpiStatus';
import type { KPIDefinition, KPIEntry, KPIStatus } from '../../types';

const STATUS_CONFIG: Record<KPIStatus, { label: string; color: string }> = {
  'on-track': { label: 'On Track', color: 'var(--color-success)' },
  'at-risk': { label: 'At Risk', color: 'var(--color-warning)' },
  'off-track': { label: 'Off Track', color: 'var(--color-danger)' },
  'no-data': { label: 'Sin datos', color: 'var(--color-text-muted)' },
};

const TREND_ICON = { up: TrendingUp, down: TrendingDown, stable: Minus, 'no-data': Minus };

interface KPICardProps {
  kpi: KPIDefinition;
  entries: KPIEntry[];
  onLogEntry: (value: number) => void;
  onRemove: () => void;
}

export function KPICard({ kpi, entries, onLogEntry, onRemove }: KPICardProps) {
  const [value, setValue] = useState('');
  const kpiEntries = entries.filter((e) => e.kpiId === kpi.id);
  const status = calculateKPIStatus(kpi, entries);
  const latest = getLatestValue(kpi, entries);
  const trend = getTrend(kpi, entries);
  const statusConfig = STATUS_CONFIG[status];
  const TrendIcon = TREND_ICON[trend];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(value.replace(',', '.'));
    if (!Number.isNaN(parsed)) {
      onLogEntry(parsed);
      setValue('');
    }
  };

  return (
    <div className="card p-6 fade-in">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold">{kpi.name}</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Target: {kpi.target} {kpi.unit} ·{' '}
            {kpi.direction === 'higher-is-better' ? 'mayor es mejor' : 'menor es mejor'}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors shrink-0"
          aria-label={`Eliminar ${kpi.name}`}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl font-bold tracking-tight">
          {latest !== null ? `${latest} ${kpi.unit}` : '—'}
        </span>
        {trend !== 'no-data' && <TrendIcon size={16} className="text-[var(--color-text-muted)]" />}
        <span
          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ml-auto"
          style={{ color: statusConfig.color, backgroundColor: `color-mix(in srgb, ${statusConfig.color} 15%, transparent)` }}
        >
          {statusConfig.label}
        </span>
      </div>

      {kpiEntries.length > 0 ? (
        <KPITrendChart entries={kpiEntries} target={kpi.target} unit={kpi.unit} />
      ) : (
        <div className="h-[140px] flex items-center justify-center text-xs text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-[var(--radius-md)]">
          Registra tu primer valor para ver la evolución
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Valor de hoy (${kpi.unit})`}
          className="flex-1 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-canvas-elevated)] border border-[var(--color-border)] focus:border-[var(--color-brand-500)] outline-none text-sm"
        />
        <button type="submit" className="btn-primary flex items-center gap-1.5 px-3 py-2 text-sm shrink-0">
          <Plus size={14} /> Registrar
        </button>
      </form>
    </div>
  );
}
