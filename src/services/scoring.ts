import { QUESTIONS } from '../data/questions';
import { CATEGORY_LABELS, CATEGORY_WEIGHTS } from '../types';
import type {
  Answers,
  Category,
  CategoryScore,
  CompanyInfo,
  ConfidenceLabel,
  CSVResults,
  MaturityLevel,
  QuickWin,
  Recommendation,
  Risk,
  Roadmap,
  SavingsBreakdown,
  ScoreResult,
} from '../types';

const MAX_SCALE = 5;

// ----------------------------------------------------------------------------
// calculateCategoryScore
// Media ponderada (0-100) de las respuestas de una categoría, usando el peso
// individual de cada pregunta.
// ----------------------------------------------------------------------------
export function calculateCategoryScore(category: Category, answers: Answers): number {
  const categoryQuestions = QUESTIONS.filter((q) => q.category === category);
  if (categoryQuestions.length === 0) return 0;

  let weightedSum = 0;
  let weightTotal = 0;

  for (const q of categoryQuestions) {
    const answer = answers[q.id];
    if (answer === undefined) continue;
    weightedSum += (answer / MAX_SCALE) * q.weight;
    weightTotal += q.weight;
  }

  if (weightTotal === 0) return 0;
  return Math.round((weightedSum / weightTotal) * 100);
}

export function calculateAllCategoryScores(answers: Answers): CategoryScore[] {
  const categories = Object.keys(CATEGORY_LABELS) as Category[];
  return categories.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    score: calculateCategoryScore(category, answers),
  }));
}

// ----------------------------------------------------------------------------
// calculateGlobalScore
// Media ponderada de las categorías usando los pesos oficiales del producto.
// ----------------------------------------------------------------------------
export function calculateGlobalScore(categoryScores: CategoryScore[]): number {
  let total = 0;
  for (const cs of categoryScores) {
    total += cs.score * CATEGORY_WEIGHTS[cs.category];
  }
  return Math.round(total);
}

// ----------------------------------------------------------------------------
// generateMaturityLevel
// ----------------------------------------------------------------------------
export function generateMaturityLevel(globalScore: number): MaturityLevel {
  if (globalScore < 25) return 'Reactive';
  if (globalScore < 50) return 'Developing';
  if (globalScore < 75) return 'Structured';
  return 'Operational Excellence';
}

// ----------------------------------------------------------------------------
// calculateConfidenceScore
// Base según nº de CSVs aportados, con penalizaciones por calidad de datos.
// ----------------------------------------------------------------------------
export function calculateConfidenceScore(csvResults: CSVResults): {
  score: number;
  label: ConfidenceLabel;
} {
  const csvCount = Object.values(csvResults).filter(Boolean).length;
  const baseByCount = [50, 65, 80, 95];
  let score = baseByCount[csvCount] ?? 50;

  let penalty = 0;
  if (csvResults.inventario) {
    const { missingValues, duplicates, rowCount } = csvResults.inventario;
    if (rowCount > 0) {
      penalty += Math.min(10, (missingValues / rowCount) * 20);
      penalty += Math.min(10, (duplicates / rowCount) * 20);
    }
  }
  if (csvResults.pedidos && csvResults.pedidos.warnings.length > 0) {
    penalty += Math.min(8, csvResults.pedidos.warnings.length * 3);
  }
  if (csvResults.incidencias && csvResults.incidencias.warnings.length > 0) {
    penalty += Math.min(8, csvResults.incidencias.warnings.length * 3);
  }

  score = Math.max(30, Math.round(score - penalty));

  let label: ConfidenceLabel = 'LOW';
  if (score >= 90) label = 'VERY HIGH';
  else if (score >= 70) label = 'HIGH';
  else if (score >= 50) label = 'MEDIUM';

  return { score, label };
}

// ----------------------------------------------------------------------------
// calculatePotentialSavings
// Estimación de ahorro anual según score, con multiplicadores por tamaño,
// existencia de almacén y nivel de madurez. SIEMPRE es una estimación.
// ----------------------------------------------------------------------------
function employeeMultiplier(employees: string): number {
  // buckets: "1-9" | "10-49" | "50-99" | "100-249" | "250-500"
  switch (employees) {
    case '1-9':
      return 0.5;
    case '10-49':
      return 0.8;
    case '50-99':
      return 1;
    case '100-249':
      return 1.4;
    case '250-500':
      return 1.9;
    default:
      return 1;
  }
}

export function calculatePotentialSavings(
  globalScore: number,
  maturityLevel: MaturityLevel,
  company: CompanyInfo
): SavingsBreakdown {
  let baseAmount: number;
  if (globalScore < 25) baseAmount = 40000;
  else if (globalScore < 50) baseAmount = 25000;
  else if (globalScore < 75) baseAmount = 12000;
  else baseAmount = 3000;

  const empMultiplier = employeeMultiplier(company.employees);
  const warehouseMultiplier = company.hasWarehouse ? 1.25 : 1;

  const maturityMultiplierMap: Record<MaturityLevel, number> = {
    Reactive: 1.2,
    Developing: 1.1,
    Structured: 1,
    'Operational Excellence': 0.85,
  };
  const maturityMultiplier = maturityMultiplierMap[maturityLevel];

  const totalEstimated = Math.round(
    baseAmount * empMultiplier * warehouseMultiplier * maturityMultiplier
  );

  return {
    baseAmount,
    employeeMultiplier: empMultiplier,
    warehouseMultiplier,
    maturityMultiplier,
    totalEstimated,
    isEstimate: true,
  };
}

// ----------------------------------------------------------------------------
// generateRiskAssessment
// ----------------------------------------------------------------------------
export function generateRiskAssessment(
  answers: Answers,
  categoryScores: CategoryScore[],
  csvResults: CSVResults
): Risk[] {
  const risks: Risk[] = [];
  const scoreByCategory = Object.fromEntries(
    categoryScores.map((c) => [c.category, c.score])
  ) as Record<Category, number>;

  if ((answers['inv-01'] ?? 0) <= 1) {
    risks.push({
      id: 'no-cycle-counts',
      title: 'No existen cycle counts: alto riesgo de descuadres de inventario',
      severity: 'high',
      category: 'inventario',
    });
  }
  if (csvResults.inventario && csvResults.inventario.deadStockPercentage > 15) {
    risks.push({
      id: 'high-dead-stock',
      title: `Alto stock obsoleto detectado (${csvResults.inventario.deadStockPercentage.toFixed(1)}% del inventario)`,
      severity: 'high',
      category: 'inventario',
    });
  }
  if (scoreByCategory.kpis < 50) {
    risks.push({
      id: 'low-kpi-visibility',
      title: 'Baja visibilidad operativa: los KPIs no se miden ni revisan de forma sistemática',
      severity: scoreByCategory.kpis < 25 ? 'high' : 'medium',
      category: 'kpis',
    });
  }
  if ((answers['tec-02'] ?? 5) <= 1) {
    risks.push({
      id: 'excel-dependency',
      title: 'Dependencia crítica de Excel para procesos operativos clave',
      severity: 'medium',
      category: 'tecnologia',
    });
  }
  if (scoreByCategory.procesos < 40) {
    risks.push({
      id: 'no-sops',
      title: 'Ausencia de procedimientos documentados: riesgo ante rotación de personal',
      severity: 'medium',
      category: 'procesos',
    });
  }
  if (csvResults.incidencias && csvResults.incidencias.estimatedImpact === 'high') {
    risks.push({
      id: 'high-incident-impact',
      title: 'Las incidencias operativas muestran un impacto estimado alto y concentrado',
      severity: 'high',
      category: 'gestion',
    });
  }
  if (scoreByCategory.mejora < 30) {
    risks.push({
      id: 'no-continuous-improvement',
      title: 'No existe un proceso estructurado de mejora continua',
      severity: 'low',
      category: 'mejora',
    });
  }

  return risks.slice(0, 6);
}

// ----------------------------------------------------------------------------
// generateQuickWins
// ----------------------------------------------------------------------------
const QUICK_WIN_LIBRARY: Record<string, QuickWin> = {
  abc: { id: 'abc', title: 'Implementar clasificación ABC de inventario', impact: 'high', effort: 'low', category: 'inventario' },
  kpiDashboard: { id: 'kpiDashboard', title: 'Crear un Dashboard de KPIs centralizado', impact: 'high', effort: 'medium', category: 'kpis' },
  sops: { id: 'sops', title: 'Documentar SOPs de los 3 procesos más críticos', impact: 'medium', effort: 'medium', category: 'procesos' },
  otif: { id: 'otif', title: 'Introducir la medición de OTIF', impact: 'high', effort: 'low', category: 'kpis' },
  pareto: { id: 'pareto', title: 'Aplicar análisis de Pareto a las incidencias recurrentes', impact: 'medium', effort: 'low', category: 'gestion' },
  cycleCounts: { id: 'cycleCounts', title: 'Poner en marcha cycle counts semanales', impact: 'high', effort: 'medium', category: 'inventario' },
  capacityPlan: { id: 'capacityPlan', title: 'Introducir planificación básica de capacidad', impact: 'medium', effort: 'medium', category: 'gestion' },
  kaizen: { id: 'kaizen', title: 'Instaurar una reunión mensual de mejora continua', impact: 'medium', effort: 'low', category: 'mejora' },
  integration: { id: 'integration', title: 'Automatizar la integración entre ventas y almacén', impact: 'medium', effort: 'high', category: 'tecnologia' },
  deadStock: { id: 'deadStock', title: 'Plan de liquidación de stock obsoleto', impact: 'high', effort: 'medium', category: 'inventario' },
};

export function generateQuickWins(
  answers: Answers,
  categoryScores: CategoryScore[]
): QuickWin[] {
  const wins: QuickWin[] = [];
  const scoreByCategory = Object.fromEntries(
    categoryScores.map((c) => [c.category, c.score])
  ) as Record<Category, number>;

  if ((answers['inv-02'] ?? 0) <= 2) wins.push(QUICK_WIN_LIBRARY.abc);
  if (scoreByCategory.kpis < 60) wins.push(QUICK_WIN_LIBRARY.kpiDashboard);
  if (scoreByCategory.procesos < 60) wins.push(QUICK_WIN_LIBRARY.sops);
  if ((answers['kpi-01'] ?? 0) <= 2) wins.push(QUICK_WIN_LIBRARY.otif);
  if ((answers['ges-02'] ?? 0) <= 2) wins.push(QUICK_WIN_LIBRARY.pareto);
  if ((answers['inv-01'] ?? 0) <= 2) wins.push(QUICK_WIN_LIBRARY.cycleCounts);
  if ((answers['ges-01'] ?? 0) <= 2) wins.push(QUICK_WIN_LIBRARY.capacityPlan);
  if ((answers['mej-01'] ?? 0) <= 2) wins.push(QUICK_WIN_LIBRARY.kaizen);
  if ((answers['tec-03'] ?? 0) <= 2) wins.push(QUICK_WIN_LIBRARY.integration);
  if (scoreByCategory.inventario < 50) wins.push(QUICK_WIN_LIBRARY.deadStock);

  // Dedupe y limitar a top 5, priorizando alto impacto / bajo esfuerzo
  const unique = Array.from(new Map(wins.map((w) => [w.id, w])).values());
  const effortScore = { low: 0, medium: 1, high: 2 };
  const impactScore = { low: 0, medium: 1, high: 2 };
  unique.sort(
    (a, b) =>
      impactScore[b.impact] - impactScore[a.impact] ||
      effortScore[a.effort] - effortScore[b.effort]
  );

  return unique.slice(0, 5);
}

// ----------------------------------------------------------------------------
// generateRecommendations
// ----------------------------------------------------------------------------
export function generateRecommendations(categoryScores: CategoryScore[]): Recommendation[] {
  return categoryScores
    .filter((c) => c.score < 70)
    .sort((a, b) => a.score - b.score)
    .map((c) => {
      const detailMap: Record<Category, string> = {
        procesos: 'Prioriza documentar y estandarizar los procesos con mayor variabilidad entre operarios o turnos.',
        kpis: 'Define de 3 a 5 KPIs críticos y revísalos semanalmente con el equipo.',
        inventario: 'Introduce clasificación ABC y cycle counts para ganar visibilidad real del stock.',
        tecnologia: 'Reduce la dependencia de Excel automatizando los flujos de datos entre sistemas.',
        gestion: 'Formaliza la planificación de capacidad y el registro de incidencias.',
        mejora: 'Crea un ritual recurrente (Kaizen/retro) para capturar mejoras del día a día.',
      };
      return {
        category: c.category,
        title: `Reforzar ${c.label}`,
        detail: detailMap[c.category],
      };
    });
}

// ----------------------------------------------------------------------------
// generateRoadmap
// ----------------------------------------------------------------------------
export function generateRoadmap(quickWins: QuickWin[], risks: Risk[]): Roadmap {
  const days30 = quickWins.slice(0, 2).map((w) => ({
    title: w.title,
    description: 'Quick win de alto impacto y bajo esfuerzo relativo, priorizado para el primer mes.',
  }));

  const days90 = quickWins.slice(2, 4).map((w) => ({
    title: w.title,
    description: 'Consolidar la iniciativa anterior e institucionalizarla como práctica recurrente.',
  }));
  if (days90.length === 0 && risks.length > 0) {
    days90.push({
      title: `Mitigar: ${risks[0].title}`,
      description: 'Plan de acción específico para reducir este riesgo operativo en el trimestre.',
    });
  }

  const days180 = [
    {
      title: 'Auditoría de seguimiento (re-evaluación del Operations Score)',
      description: 'Medir el progreso frente al diagnóstico inicial y ajustar prioridades.',
    },
    ...(quickWins.slice(4).map((w) => ({
      title: w.title,
      description: 'Iniciativa de medio plazo para consolidar la madurez operativa.',
    }))),
  ];

  return { days30, days90, days180 };
}

// ----------------------------------------------------------------------------
// Orquestador principal
// ----------------------------------------------------------------------------
export function computeScoreResult(
  answers: Answers,
  company: CompanyInfo,
  csvResults: CSVResults
): ScoreResult {
  const categoryScores = calculateAllCategoryScores(answers);
  const globalScore = calculateGlobalScore(categoryScores);
  const maturityLevel = generateMaturityLevel(globalScore);
  const { score: confidenceScore, label: confidenceLabel } = calculateConfidenceScore(csvResults);
  const risks = generateRiskAssessment(answers, categoryScores, csvResults);
  const quickWins = generateQuickWins(answers, categoryScores);
  const recommendations = generateRecommendations(categoryScores);
  const roadmap = generateRoadmap(quickWins, risks);
  const savings = calculatePotentialSavings(globalScore, maturityLevel, company);

  return {
    globalScore,
    categoryScores,
    maturityLevel,
    confidenceScore,
    confidenceLabel,
    risks,
    quickWins,
    recommendations,
    roadmap,
    savings,
    computedAt: new Date().toISOString(),
  };
}
