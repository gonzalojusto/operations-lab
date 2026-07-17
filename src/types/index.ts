// ============================================================================
// OPERATIONS LAB — Core domain types
// ============================================================================

export type Category =
  | 'procesos'
  | 'kpis'
  | 'inventario'
  | 'tecnologia'
  | 'gestion'
  | 'mejora';

export const CATEGORY_LABELS: Record<Category, string> = {
  procesos: 'Procesos',
  kpis: 'KPIs',
  inventario: 'Inventario',
  tecnologia: 'Tecnología',
  gestion: 'Gestión Operativa',
  mejora: 'Mejora Continua',
};

export const CATEGORY_WEIGHTS: Record<Category, number> = {
  procesos: 0.2,
  kpis: 0.2,
  inventario: 0.2,
  tecnologia: 0.15,
  gestion: 0.15,
  mejora: 0.1,
};

export interface CompanyInfo {
  name: string;
  sector: string;
  employees: string; // bucket, e.g. "10-50"
  hasWarehouse: boolean;
  usesERP: boolean;
  usesExcel: boolean;
  country: string;
}

export interface Question {
  id: string;
  category: Category;
  question: string;
  description: string;
  weight: number; // relative weight within its category (1 = normal)
}

export type AnswerScale = 0 | 1 | 2 | 3 | 4 | 5;

export interface Answers {
  [questionId: string]: AnswerScale;
}

export type MaturityLevel =
  | 'Reactive'
  | 'Developing'
  | 'Structured'
  | 'Operational Excellence';

export type ConfidenceLabel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH';

export interface CategoryScore {
  category: Category;
  label: string;
  score: number; // 0-100
}

export interface InventoryCSVResult {
  fileName: string;
  rowCount: number;
  skuCount: number;
  deadStockCount: number;
  deadStockPercentage: number;
  abcAnalysis: { a: number; b: number; c: number };
  missingValues: number;
  duplicates: number;
  potentialExcessStock: number;
  inventoryHealth: number; // 0-100
  warnings: string[];
}

export interface OrdersCSVResult {
  fileName: string;
  rowCount: number;
  totalOrders: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  concentrationTop20Percentage: number; // % de volumen en el top 20% de clientes/SKUs
  monthlyDistribution: { label: string; value: number }[];
  seasonalityDetected: boolean;
  warnings: string[];
}

export type ABCClass = 'A' | 'B' | 'C';

export interface InventoryRow {
  sku: string;
  stock: number;
  value: number; // stock * coste/precio unitario (o stock si no hay valor)
  lastSaleDate: string | null; // ISO date o null si no se detectó
  daysSinceLastSale: number | null;
  abcClass: ABCClass;
  isDeadStock: boolean; // sin ventas en > 90 días
  isExcess: boolean; // heurística de exceso de stock
}

export interface InventoryDetailedResult {
  summary: InventoryCSVResult;
  rows: InventoryRow[];
}

export interface IncidentsCSVResult {
  fileName: string;
  rowCount: number;
  totalIncidents: number;
  pareto: { label: string; count: number; cumulativePercentage: number }[];
  topIncidents: { label: string; count: number; percentage: number }[];
  severityBreakdown: { severity: string; count: number }[];
  estimatedImpact: 'low' | 'medium' | 'high';
  warnings: string[];
}

export interface CSVResults {
  inventario?: InventoryCSVResult;
  pedidos?: OrdersCSVResult;
  incidencias?: IncidentsCSVResult;
}

export interface Risk {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  category: Category;
}

export interface QuickWin {
  id: string;
  title: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  category: Category;
}

export interface RoadmapItem {
  title: string;
  description: string;
}

export interface Roadmap {
  days30: RoadmapItem[];
  days90: RoadmapItem[];
  days180: RoadmapItem[];
}

export interface Recommendation {
  category: Category;
  title: string;
  detail: string;
}

export interface SavingsBreakdown {
  baseAmount: number;
  employeeMultiplier: number;
  warehouseMultiplier: number;
  maturityMultiplier: number;
  totalEstimated: number;
  isEstimate: true;
}

export interface ScoreResult {
  globalScore: number; // 0-100
  categoryScores: CategoryScore[];
  maturityLevel: MaturityLevel;
  confidenceScore: number; // 0-100
  confidenceLabel: ConfidenceLabel;
  risks: Risk[];
  quickWins: QuickWin[];
  recommendations: Recommendation[];
  roadmap: Roadmap;
  savings: SavingsBreakdown;
  computedAt: string;
}

export type ModuleStatus = 'live' | 'coming-soon';

export interface ProductModule {
  id: string;
  name: string;
  description: string;
  status: ModuleStatus;
  route: string;
  icon: string;
}

export type WizardStep = 'company' | 'questions' | 'csv' | 'results';
