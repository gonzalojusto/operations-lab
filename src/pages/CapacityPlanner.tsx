import { useMemo } from 'react';
import { Users, Clock, Gauge as GaugeIcon, TrendingUp } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { CapacityChart } from '../components/charts/CapacityChart';
import { useCapacityPlannerStore } from '../store/useCapacityPlannerStore';
import { computeCapacity, WEEKDAY_LABELS } from '../services/capacityPlanner';

function NumberField({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-canvas-elevated)] border border-[var(--color-border)] focus:border-[var(--color-brand-500)] outline-none text-sm"
        />
        {suffix && <span className="text-xs text-[var(--color-text-muted)] shrink-0">{suffix}</span>}
      </div>
    </div>
  );
}

export function CapacityPlanner() {
  const { inputs, setInputs, setWeekdayMultiplier } = useCapacityPlannerStore();
  const result = useMemo(() => computeCapacity(inputs), [inputs]);

  return (
    <AppLayout title="Capacity Planner">
      <div className="mb-8 fade-in">
        <span className="text-xs uppercase tracking-wider text-[var(--color-brand-300)] font-medium">
          Operations Lab
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1 mb-2">Capacity Planner</h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl text-sm leading-relaxed">
          Calcula si tu plantilla actual cubre la demanda esperada, con picos por día de la semana. Tus datos
          se guardan solo en este navegador.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-6 space-y-4 lg:col-span-1 fade-in">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">Parámetros</h3>
          <NumberField
            label="Pedidos/día (media)"
            value={inputs.ordersPerDay}
            onChange={(v) => setInputs({ ordersPerDay: v })}
          />
          <NumberField
            label="Minutos por pedido"
            value={inputs.minutesPerOrder}
            onChange={(v) => setInputs({ minutesPerOrder: v })}
            suffix="min"
          />
          <NumberField
            label="Horas disponibles/empleado/día"
            value={inputs.hoursPerEmployeePerDay}
            onChange={(v) => setInputs({ hoursPerEmployeePerDay: v })}
            suffix="h"
          />
          <NumberField
            label="Empleados actuales"
            value={inputs.currentEmployees}
            onChange={(v) => setInputs({ currentEmployees: v })}
          />

          <div>
            <label className="block text-xs text-[var(--color-text-secondary)] mb-2">
              Multiplicador de demanda por día
            </label>
            <div className="space-y-2">
              {WEEKDAY_LABELS.map((day, i) => (
                <div key={day} className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-text-muted)] w-20 shrink-0">{day}</span>
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={inputs.weeklyDemandMultipliers[i]}
                    onChange={(e) => setWeekdayMultiplier(i, parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs w-8 text-right">{inputs.weeklyDemandMultipliers[i].toFixed(1)}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard icon={Users} label="Empleados necesarios" value={String(result.requiredEmployees)} />
            <StatCard
              icon={GaugeIcon}
              label="Utilización de capacidad"
              value={`${result.utilization}%`}
              tone={result.utilization > 100 ? 'danger' : result.utilization > 85 ? 'warning' : 'success'}
            />
            <StatCard
              icon={TrendingUp}
              label={result.gap > 0 ? 'Faltan empleados' : 'Margen de capacidad'}
              value={`${Math.abs(result.gap)}`}
              tone={result.gap > 0 ? 'danger' : 'success'}
            />
          </div>

          <div className="card p-6 fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={15} className="text-[var(--color-brand-500)]" />
              <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                Horas requeridas vs. disponibles por día
              </h3>
            </div>
            <CapacityChart
              dailyRequiredHours={result.dailyRequiredHours}
              dailyAvailableHours={result.dailyAvailableHours}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
