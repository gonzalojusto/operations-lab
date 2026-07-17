import type { Category, CategoryScore, ProductModule } from '../types';
import { MODULES } from './modules';

interface CrossSellRule {
  categories: Category[];
  moduleId: string;
  message: (score: number) => string;
}

// ============================================================================
// Reglas de cross-sell: mapean la categoría más débil del diagnóstico al
// módulo futuro de la suite que la resuelve. Es la materialización del
// pipeline "Score → detecta problema → sugiere herramienta" de la estrategia
// de producto. Si no hay módulo relevante para la categoría más débil,
// deliberadamente no se sugiere nada (ver getCrossSellRecommendation).
// ============================================================================
const RULES: CrossSellRule[] = [
  {
    categories: ['inventario'],
    moduleId: 'inventory-analyzer',
    message: (score) =>
      `Inventario es tu categoría con más margen de mejora (${score}/100). Inventory Analyzer está diseñado exactamente para esto: ABC, rotación y detección de excesos.`,
  },
  {
    categories: ['kpis'],
    moduleId: 'kpi-pulse',
    message: (score) =>
      `Tus KPIs tienen recorrido de mejora (${score}/100). KPI Pulse te dará un dashboard en tiempo real para dejar de mirar Excel sueltos.`,
  },
  {
    categories: ['procesos', 'mejora'],
    moduleId: 'process-mapper',
    message: (score) =>
      `Tus procesos no están del todo documentados (${score}/100). Process Mapper te ayudará a mapearlos de forma visual.`,
  },
];

export interface CrossSellRecommendation {
  module: ProductModule;
  message: string;
  weakestCategory: CategoryScore;
}

/**
 * Devuelve una única recomendación basada en la categoría más débil del
 * diagnóstico. Si la categoría más débil no tiene un módulo mapeado
 * (p.ej. Tecnología o Gestión Operativa hoy), devuelve null: preferimos no
 * sugerir nada antes que sugerir algo genérico o forzado.
 */
export function getCrossSellRecommendation(
  categoryScores: CategoryScore[]
): CrossSellRecommendation | null {
  const sorted = [...categoryScores].sort((a, b) => a.score - b.score);
  const weakest = sorted[0];
  if (!weakest || weakest.score >= 70) return null; // ya va bien, no hace falta empujar nada

  const rule = RULES.find((r) => r.categories.includes(weakest.category));
  if (!rule) return null;

  const module = MODULES.find((m) => m.id === rule.moduleId);
  if (!module) return null;

  return {
    module,
    message: rule.message(weakest.score),
    weakestCategory: weakest,
  };
}
