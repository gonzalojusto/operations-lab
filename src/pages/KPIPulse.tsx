import { AlertCircle } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { KPICard } from '../components/kpi/KPICard';
import { AddKPIForm } from '../components/kpi/AddKPIForm';
import { useKPIPulseStore } from '../store/useKPIPulseStore';
import { calculateKPIStatus } from '../services/kpiStatus';

export function KPIPulse() {
  const { kpis, entries, addCustomKPI, removeKPI, logEntry } = useKPIPulseStore();

  const offTrackKpis = kpis.filter((k) => calculateKPIStatus(k, entries) === 'off-track');

  return (
    <AppLayout title="KPI Pulse">
      <div className="mb-8 fade-in">
        <span className="text-xs uppercase tracking-wider text-[var(--color-brand-300)] font-medium">
          Operations Lab
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1 mb-2">KPI Pulse</h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl text-sm leading-relaxed">
          Registra tus KPIs operativos periódicamente y visualiza su evolución frente al target. Tus datos se
          guardan solo en este navegador (localStorage) — sin backend ni cuenta.
        </p>
      </div>

      {offTrackKpis.length > 0 && (
        <div className="card p-4 mb-6 border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle size={15} className="text-[var(--color-danger)] mt-0.5 shrink-0" />
            <p className="text-sm">
              <strong>{offTrackKpis.length}</strong> KPI{offTrackKpis.length > 1 ? 's' : ''} fuera de target:{' '}
              {offTrackKpis.map((k) => k.name).join(', ')}.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.id}
            kpi={kpi}
            entries={entries}
            onLogEntry={(value) => logEntry(kpi.id, new Date().toISOString().slice(0, 10), value)}
            onRemove={() => removeKPI(kpi.id)}
          />
        ))}
      </div>

      <div className="max-w-md">
        <AddKPIForm onAdd={addCustomKPI} />
      </div>
    </AppLayout>
  );
}
