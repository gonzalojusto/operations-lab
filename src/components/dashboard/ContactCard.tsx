import { Mail } from 'lucide-react';
import type { CompanyInfo, ScoreResult } from '../../types';
import { CATEGORY_LABELS } from '../../types';

const CONTACT_EMAIL = 'gonzalo.justo@gmail.com';

function buildMailtoUrl(company: CompanyInfo, result: ScoreResult): string {
  const subject = `Operations Score — ${company.name || 'mi empresa'} (${result.globalScore}/100)`;

  const weakest = [...result.categoryScores].sort((a, b) => a.score - b.score)[0];

  const bodyLines = [
    `Hola Gonzalo,`,
    ``,
    `Acabo de completar el diagnóstico de Operations Score y me gustaría hablar sobre los resultados.`,
    ``,
    `— Empresa: ${company.name || '(sin especificar)'}`,
    `— Sector: ${company.sector || '(sin especificar)'}`,
    `— Score global: ${result.globalScore}/100 (${result.maturityLevel})`,
    weakest ? `— Categoría con más margen de mejora: ${CATEGORY_LABELS[weakest.category]} (${weakest.score}/100)` : '',
    ``,
    `Cuéntame más sobre cómo podríais ayudarnos.`,
  ].filter(Boolean);

  const body = bodyLines.join('\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

interface ContactCardProps {
  company: CompanyInfo;
  result: ScoreResult;
}

export function ContactCard({ company, result }: ContactCardProps) {
  return (
    <div className="card p-6 fade-in flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 className="text-sm font-semibold mb-1">¿Quieres profundizar en estos resultados?</h3>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Hablemos sobre cómo priorizar tus quick wins y cerrar la brecha operativa detectada.
        </p>
      </div>
      <a
        href={buildMailtoUrl(company, result)}
        className="btn-primary flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium shrink-0"
      >
        <Mail size={16} /> Contactar
      </a>
    </div>
  );
}
