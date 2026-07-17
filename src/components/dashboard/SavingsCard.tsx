import { PiggyBank } from 'lucide-react';
import type { SavingsBreakdown } from '../../types';

function formatEUR(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function SavingsCard({ savings }: { savings: SavingsBreakdown }) {
  return (
    <div className="card p-6 fade-in">
      <div className="flex items-center gap-2 mb-3">
        <PiggyBank size={16} className="text-[var(--color-success)]" />
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Ahorro Potencial Estimado</h3>
      </div>
      <div className="text-3xl font-bold mb-1">{formatEUR(savings.totalEstimated)}</div>
      <p className="text-xs text-[var(--color-text-muted)]">por año</p>

      <p className="text-xs text-[var(--color-text-muted)] mt-4 leading-relaxed">
        Esta cifra es una <strong className="text-[var(--color-text-secondary)]">estimación orientativa</strong>,
        calculada a partir de benchmarks sectoriales, el tamaño de la empresa y el nivel de madurez operativa
        detectado. No constituye un compromiso ni una auditoría financiera formal.
      </p>
    </div>
  );
}
