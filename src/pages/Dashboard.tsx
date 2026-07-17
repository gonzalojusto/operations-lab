import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { ScoreCard } from '../components/dashboard/ScoreCard';
import { ConfidenceCard } from '../components/dashboard/ConfidenceCard';
import { RisksCard } from '../components/dashboard/RisksCard';
import { QuickWinsCard } from '../components/dashboard/QuickWinsCard';
import { SavingsCard } from '../components/dashboard/SavingsCard';
import { RoadmapCard } from '../components/dashboard/RoadmapCard';
import { PDFButton } from '../components/dashboard/PDFButton';
import { ShareButton } from '../components/dashboard/ShareButton';
import { CrossSellCard } from '../components/dashboard/CrossSellCard';
import { ContactCard } from '../components/dashboard/ContactCard';
import { RadarChart } from '../components/charts/RadarChart';
import { useOperationsStore } from '../store/useOperationsStore';
import { getCrossSellRecommendation } from '../data/crossSell';

export function Dashboard() {
  const navigate = useNavigate();
  const { score, company, answers, csvResults, reset } = useOperationsStore();
  const radarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!score) navigate('/operations-score');
  }, [score, navigate]);

  if (!score) return null;

  const csvCount = Object.values(csvResults).filter(Boolean).length;
  const recommendation = getCrossSellRecommendation(score.categoryScores);

  return (
    <AppLayout title="Operations Score · Resultados">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4 fade-in">
        <div>
          <span className="text-xs uppercase tracking-wider text-[var(--color-brand-300)] font-medium">
            {company.name || 'Tu empresa'}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">Resultado del diagnóstico</h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => {
              reset();
              navigate('/operations-score');
            }}
            className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm"
          >
            <RotateCcw size={14} /> Nuevo diagnóstico
          </button>
          <ShareButton company={company} answers={answers} />
          <PDFButton company={company} result={score} radarElement={radarRef.current} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <ScoreCard globalScore={score.globalScore} maturityLevel={score.maturityLevel} />
        <ConfidenceCard
          confidenceScore={score.confidenceScore}
          confidenceLabel={score.confidenceLabel}
          csvCount={csvCount}
        />
        <SavingsCard savings={score.savings} />
      </div>

      <div className="card p-6 md:p-8 mb-5 fade-in" ref={radarRef}>
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-6 text-center">
          Radar por Categoría
        </h3>
        <RadarChart categoryScores={score.categoryScores} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <RisksCard risks={score.risks} />
        <QuickWinsCard quickWins={score.quickWins} />
      </div>

      <div className="mb-5">
        <RoadmapCard roadmap={score.roadmap} />
      </div>

      {recommendation && (
        <div className="mb-5">
          <CrossSellCard recommendation={recommendation} />
        </div>
      )}

      <ContactCard company={company} result={score} />
    </AppLayout>
  );
}
