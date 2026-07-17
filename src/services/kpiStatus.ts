import type { KPIDefinition, KPIEntry, KPIStatus } from '../types';

/**
 * Calcula el estado de un KPI comparando su último valor registrado con el
 * target, teniendo en cuenta la dirección (mayor-es-mejor / menor-es-mejor).
 *
 * - on-track: cumple o supera el target
 * - at-risk: dentro de un margen del 10% respecto al target
 * - off-track: se desvía más de un 10% del target en la dirección incorrecta
 * - no-data: no hay ninguna entrada registrada todavía
 */
export function calculateKPIStatus(kpi: KPIDefinition, entries: KPIEntry[]): KPIStatus {
  const kpiEntries = entries.filter((e) => e.kpiId === kpi.id).sort((a, b) => a.date.localeCompare(b.date));
  if (kpiEntries.length === 0) return 'no-data';

  const latest = kpiEntries[kpiEntries.length - 1].value;
  const target = kpi.target;
  if (target === 0) return 'on-track';

  const deviation = kpi.direction === 'higher-is-better' ? (target - latest) / target : (latest - target) / target;

  if (deviation <= 0) return 'on-track';
  if (deviation <= 0.1) return 'at-risk';
  return 'off-track';
}

export function getLatestValue(kpi: KPIDefinition, entries: KPIEntry[]): number | null {
  const kpiEntries = entries.filter((e) => e.kpiId === kpi.id).sort((a, b) => a.date.localeCompare(b.date));
  if (kpiEntries.length === 0) return null;
  return kpiEntries[kpiEntries.length - 1].value;
}

export function getTrend(kpi: KPIDefinition, entries: KPIEntry[]): 'up' | 'down' | 'stable' | 'no-data' {
  const kpiEntries = entries.filter((e) => e.kpiId === kpi.id).sort((a, b) => a.date.localeCompare(b.date));
  if (kpiEntries.length < 2) return 'no-data';
  const first = kpiEntries[0].value;
  const last = kpiEntries[kpiEntries.length - 1].value;
  if (first === 0) return 'stable';
  const change = (last - first) / Math.abs(first);
  if (Math.abs(change) < 0.02) return 'stable';
  return change > 0 ? 'up' : 'down';
}
