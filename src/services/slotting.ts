import type { SlottingRow, SlotZone } from '../types';
import type { PickingRow } from './csvAnalysis';

// ============================================================================
// Heurística de "golden zone slotting": las referencias que concentran el
// grueso de los picks se asignan a la Zona A (más cercana a la zona de
// packing/expedición), reduciendo distancia recorrida. Se usa la misma regla
// de concentración acumulada 80/95 que el análisis ABC de inventario, pero
// aplicada a frecuencia de picking en vez de a valor económico.
// ============================================================================
export function computeSlotting(rows: PickingRow[]): SlottingRow[] {
  const sorted = [...rows].sort((a, b) => b.frequency - a.frequency);
  const total = sorted.reduce((acc, r) => acc + r.frequency, 0) || 1;

  let cumulative = 0;
  return sorted.map((r) => {
    cumulative += r.frequency;
    const pct = cumulative / total;
    const zone: SlotZone = pct <= 0.8 ? 'A' : pct <= 0.95 ? 'B' : 'C';
    return { sku: r.sku, frequency: r.frequency, recommendedZone: zone };
  });
}

export function summarizeByZone(rows: SlottingRow[]): Record<SlotZone, { count: number; picks: number }> {
  const summary: Record<SlotZone, { count: number; picks: number }> = {
    A: { count: 0, picks: 0 },
    B: { count: 0, picks: 0 },
    C: { count: 0, picks: 0 },
  };
  for (const row of rows) {
    summary[row.recommendedZone].count += 1;
    summary[row.recommendedZone].picks += row.frequency;
  }
  return summary;
}
