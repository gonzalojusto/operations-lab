import { ShieldCheck } from 'lucide-react';
import type { ConfidenceLabel } from '../../types';

const LABEL_COLOR: Record<ConfidenceLabel, string> = {
  LOW: 'var(--color-danger)',
  MEDIUM: 'var(--color-warning)',
  HIGH: 'var(--color-brand-500)',
  'VERY HIGH': 'var(--color-success)',
};

interface ConfidenceCardProps {
  confidenceScore: number;
  confidenceLabel: ConfidenceLabel;
  csvCount: number;
}

export function ConfidenceCard({ confidenceScore, confidenceLabel, csvCount }: ConfidenceCardProps) {
  const color = LABEL_COLOR[confidenceLabel];
  return (
    <div className="card p-6 fade-in">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={16} style={{ color }} />
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Confidence Score</h3>
      </div>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-3xl font-bold">{confidenceScore}</span>
        <span className="text-sm text-[var(--color-text-muted)] mb-1">/ 100</span>
      </div>
      <span
        className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3"
        style={{ color, backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
      >
        {confidenceLabel}
      </span>
      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
        Basado en {csvCount} de 3 archivos CSV aportados{csvCount > 0 ? ' y su calidad de datos' : ''}. A más
        datos operativos reales, mayor precisión del diagnóstico.
      </p>
    </div>
  );
}
