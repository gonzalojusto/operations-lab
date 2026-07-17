import { Map } from 'lucide-react';
import type { Roadmap } from '../../types';

const SECTIONS: { key: keyof Roadmap; label: string }[] = [
  { key: 'days30', label: '30 días' },
  { key: 'days90', label: '90 días' },
  { key: 'days180', label: '180 días' },
];

export function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  return (
    <div className="card p-6 fade-in">
      <div className="flex items-center gap-2 mb-5">
        <Map size={16} className="text-[var(--color-brand-500)]" />
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Roadmap</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SECTIONS.map(({ key, label }) => (
          <div key={key}>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-300)] mb-3">
              {label}
            </div>
            <ul className="space-y-3">
              {roadmap[key].length === 0 ? (
                <li className="text-xs text-[var(--color-text-muted)]">Sin acciones pendientes en este horizonte.</li>
              ) : (
                roadmap[key].map((item, i) => (
                  <li key={i} className="text-sm">
                    <p className="font-medium leading-snug">{item.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-snug">{item.description}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
