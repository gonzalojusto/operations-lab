import { Zap } from 'lucide-react';
import type { QuickWin } from '../../types';

export function QuickWinsCard({ quickWins }: { quickWins: QuickWin[] }) {
  return (
    <div className="card p-6 fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-[var(--color-warning)]" />
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Top 5 Quick Wins</h3>
      </div>
      {quickWins.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)]">
          Tu operación ya cubre las prácticas básicas evaluadas. Buen trabajo.
        </p>
      ) : (
        <ol className="space-y-3">
          {quickWins.map((win, i) => (
            <li key={win.id} className="flex items-start gap-3 text-sm">
              <span className="w-5 h-5 rounded-full bg-[var(--color-brand-500)]/15 text-[var(--color-brand-300)] text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="leading-snug">{win.title}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
