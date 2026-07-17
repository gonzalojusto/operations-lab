import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { CrossSellRecommendation } from '../../data/crossSell';

export function CrossSellCard({ recommendation }: { recommendation: CrossSellRecommendation }) {
  return (
    <div className="card p-6 fade-in border-[var(--color-brand-500)]/25 bg-[var(--color-brand-500)]/5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-[var(--color-brand-500)]" />
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
          Tu próximo paso recomendado
        </h3>
      </div>
      <p className="text-sm leading-relaxed mb-4">{recommendation.message}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{recommendation.module.name}</span>
        <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider px-2.5 py-1 rounded-full border border-[var(--color-border-strong)] text-[var(--color-text-muted)]">
          Coming Soon
        </span>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-[var(--color-brand-300)] hover:text-[var(--color-brand-500)] transition-colors"
      >
        Ver módulos de Operations Lab <ArrowRight size={14} />
      </Link>
    </div>
  );
}
