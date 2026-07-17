import { ArrowDown, ChevronUp, ChevronDown, Trash2, User } from 'lucide-react';
import type { ProcessStep } from '../../types';

interface ProcessStepFlowProps {
  steps: ProcessStep[];
  onMove: (id: string, direction: 'up' | 'down') => void;
  onRemove: (id: string) => void;
}

export function ProcessStepFlow({ steps, onMove, onRemove }: ProcessStepFlowProps) {
  const sorted = [...steps].sort((a, b) => a.order - b.order);

  if (sorted.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          Añade el primer paso de tu proceso para empezar a mapearlo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch">
      {sorted.map((step, i) => (
        <div key={step.id} className="flex flex-col items-center">
          <div className="card p-5 w-full fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-[var(--color-brand-500)]/15 text-[var(--color-brand-300)] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  {step.description && (
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                  {step.responsible && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-2 flex items-center gap-1.5">
                      <User size={11} /> {step.responsible}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onMove(step.id, 'up')}
                  disabled={i === 0}
                  className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Mover arriba"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => onMove(step.id, 'down')}
                  disabled={i === sorted.length - 1}
                  className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Mover abajo"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={() => onRemove(step.id)}
                  className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-surface-hover)] transition-colors"
                  aria-label="Eliminar paso"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
          {i < sorted.length - 1 && <ArrowDown size={16} className="text-[var(--color-text-muted)] my-2" />}
        </div>
      ))}
    </div>
  );
}
