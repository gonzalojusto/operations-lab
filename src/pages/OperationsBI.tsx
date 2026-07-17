import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, ArrowRight } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { ScoreHistoryChart } from '../components/charts/ScoreHistoryChart';
import { useScoreHistoryStore } from '../store/useScoreHistoryStore';
import { useKPIPulseStore } from '../store/useKPIPulseStore';
import { calculateKPIStatus } from '../services/kpiStatus';

export function OperationsBI() {
  const { entries } = useScoreHistoryStore();
  const { kpis, entries: kpiEntries } = useKPIPulseStore();

  const sortedHistory = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sortedHistory[sortedHistory.length - 1];
  const first = sortedHistory[0];
  const delta = latest && first && sortedHistory.length > 1 ? latest.globalScore - first.globalScore : null;

  const statusCounts = kpis.reduce(
    (acc, kpi) => {
      const status = calculateKPIStatus(kpi, kpiEntries);
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <AppLayout title="Operations BI">
      <div className="mb-8 fade-in">
        <span className="text-xs uppercase tracking-wider text-[var(--color-brand-300)] font-medium">
          Operations Lab
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1 mb-2">Operations BI</h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl text-sm leading-relaxed">
          Vista consolidada de tu evolución operativa: histórico de Operations Score y estado actual de tus
          KPIs. Se construye automáticamente a partir de los otros módulos que ya usas.
        </p>
      </div>

      {sortedHistory.length === 0 ? (
        <div className="card p-12 text-center fade-in mb-5">
          <BarChart3 size={28} className="text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Todavía no tienes ningún diagnóstico de Operations Score guardado en este navegador.
          </p>
          <Link to="/operations-score" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium">
            Hacer mi primer Operations Score <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-5 mb-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard icon={BarChart3} label="Diagnósticos realizados" value={String(sortedHistory.length)} />
            <StatCard icon={TrendingUp} label="Último Operations Score" value={`${latest.globalScore}/100`} />
            {delta !== null && (
              <StatCard
                icon={TrendingUp}
                label="Evolución desde el primer diagnóstico"
                value={`${delta > 0 ? '+' : ''}${delta}`}
                tone={delta > 0 ? 'success' : delta < 0 ? 'danger' : 'neutral'}
              />
            )}
          </div>

          <div className="card p-6 fade-in">
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">
              Evolución del Operations Score
            </h3>
            <ScoreHistoryChart entries={sortedHistory} />
          </div>
        </div>
      )}

      <div className="card p-6 fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Estado actual de tus KPIs</h3>
          <Link to="/kpi-pulse" className="text-xs text-[var(--color-brand-300)] hover:text-[var(--color-brand-500)] flex items-center gap-1">
            Ver KPI Pulse <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={TrendingUp} label="On Track" value={String(statusCounts['on-track'] ?? 0)} tone="success" />
          <StatCard icon={TrendingUp} label="At Risk" value={String(statusCounts['at-risk'] ?? 0)} tone="warning" />
          <StatCard icon={TrendingUp} label="Off Track" value={String(statusCounts['off-track'] ?? 0)} tone="danger" />
          <StatCard icon={TrendingUp} label="Sin datos" value={String(statusCounts['no-data'] ?? 0)} />
        </div>
      </div>
    </AppLayout>
  );
}
