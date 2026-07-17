import { AlertTriangle } from 'lucide-react';
import type { Risk } from '../../types';

const SEVERITY_COLOR: Record<Risk['severity'], string> = {
  high: 'var(--color-danger)',
  medium: 'var(--color-warning)',
  low: 'var(--color-text-muted)',
};

export function RisksCard({ risks }: { risks: Risk[] }) {
  return (
    <div className="card p-6 fade-in">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-[var(--color-danger)]" />
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Riesgos</h3>
      </div>
      {risks.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)]">
          No se detectaron riesgos significativos con la información disponible.
        </p>
      ) : (
        <ul className="space-y-3">
          {risks.map((risk) => (
            <li key={risk.id} className="flex items-start gap-2.5 text-sm">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ backgroundColor: SEVERITY_COLOR[risk.severity] }}
              />
              <span className="text-[var(--color-text-primary)] leading-snug">{risk.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
