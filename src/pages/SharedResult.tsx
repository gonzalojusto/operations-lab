import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { ScoreCard } from '../components/dashboard/ScoreCard';
import { ConfidenceCard } from '../components/dashboard/ConfidenceCard';
import { RisksCard } from '../components/dashboard/RisksCard';
import { QuickWinsCard } from '../components/dashboard/QuickWinsCard';
import { SavingsCard } from '../components/dashboard/SavingsCard';
import { RoadmapCard } from '../components/dashboard/RoadmapCard';
import { CrossSellCard } from '../components/dashboard/CrossSellCard';
import { ContactCard } from '../components/dashboard/ContactCard';
import { RadarChart } from '../components/charts/RadarChart';
import { decodeShareState } from '../utils/shareState';
import { computeScoreResult } from '../services/scoring';
import { getCrossSellRecommendation } from '../data/crossSell';

export function SharedResult() {
  const [searchParams] = useSearchParams();
  const encoded = searchParams.get('d');

  const decoded = useMemo(() => (encoded ? decodeShareState(encoded) : null), [encoded]);
  const result = useMemo(() => {
    if (!decoded) return null;
    return computeScoreResult(decoded.answers, decoded.company, {});
  }, [decoded]);

  if (!decoded || !result) {
    return (
      <AppLayout title="Resultado compartido">
        <div className="card p-8 max-w-md mx-auto text-center fade-in">
          <AlertTriangle size={24} className="text-[var(--color-warning)] mx-auto mb-4" />
          <h1 className="text-lg font-semibold mb-2">Enlace no válido</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Este enlace de resultado parece incompleto o dañado. Puedes hacer tu propio diagnóstico gratuito.
          </p>
          <Link to="/operations-score" className="btn-primary inline-block px-5 py-2.5 text-sm font-medium">
            Hacer mi Operations Score
          </Link>
        </div>
      </AppLayout>
    );
  }

  const { company } = decoded;
  const recommendation = getCrossSellRecommendation(result.categoryScores);

  return (
    <AppLayout title="Operations Score · Resultado compartido">
      <div className="mb-8 fade-in">
        <span className="text-xs uppercase tracking-wider text-[var(--color-brand-300)] font-medium">
          Resultado compartido {company.name && `· ${company.name}`}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">
          Diagnóstico de Operations Score
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2 max-w-xl">
          Este resultado se ha recalculado localmente en tu navegador a partir de un enlace compartido — sin
          que ningún dato pase por un servidor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <ScoreCard globalScore={result.globalScore} maturityLevel={result.maturityLevel} />
        <ConfidenceCard
          confidenceScore={result.confidenceScore}
          confidenceLabel={result.confidenceLabel}
          csvCount={0}
        />
        <SavingsCard savings={result.savings} />
      </div>

      <div className="card p-6 md:p-8 mb-5 fade-in">
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-6 text-center">
          Radar por Categoría
        </h3>
        <RadarChart categoryScores={result.categoryScores} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <RisksCard risks={result.risks} />
        <QuickWinsCard quickWins={result.quickWins} />
      </div>

      <div className="mb-5">
        <RoadmapCard roadmap={result.roadmap} />
      </div>

      {recommendation && (
        <div className="mb-5">
          <CrossSellCard recommendation={recommendation} />
        </div>
      )}

      <ContactCard company={company} result={result} />

      <div className="card p-6 mt-5 text-center fade-in bg-[var(--color-brand-500)]/5 border-[var(--color-brand-500)]/20">
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          ¿Quieres evaluar la madurez operativa de tu propia empresa?
        </p>
        <Link to="/operations-score" className="btn-primary inline-block px-6 py-3 text-sm font-medium">
          Hacer mi Operations Score gratis
        </Link>
      </div>
    </AppLayout>
  );
}
