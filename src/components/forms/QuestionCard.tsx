import type { AnswerScale, Question } from '../../types';

const SCALE_LABELS: Record<AnswerScale, string> = {
  0: 'No existe',
  1: 'Muy pobre',
  2: 'Básico',
  3: 'Aceptable',
  4: 'Bueno',
  5: 'Excelente',
};

interface QuestionCardProps {
  question: Question;
  value?: AnswerScale;
  onChange: (value: AnswerScale) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div className="card p-6 md:p-8 fade-in">
      <h2 className="text-lg md:text-xl font-semibold mb-2 leading-snug">{question.question}</h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">{question.description}</p>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {([0, 1, 2, 3, 4, 5] as AnswerScale[]).map((scale) => (
          <button
            key={scale}
            type="button"
            onClick={() => onChange(scale)}
            className={`flex flex-col items-center justify-center gap-1 py-3 rounded-[var(--radius-md)] border text-xs transition-all ${
              value === scale
                ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10 text-[var(--color-text-primary)]'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            <span className="text-base font-semibold">{scale}</span>
            <span className="text-center leading-tight">{SCALE_LABELS[scale]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
