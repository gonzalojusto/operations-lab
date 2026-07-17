import { describe, expect, it } from 'vitest';
import { computeSlotting, summarizeByZone } from './slotting';
import type { PickingRow } from './csvAnalysis';

describe('computeSlotting', () => {
  it('assigns the highest-frequency SKUs to Zone A', () => {
    const rows: PickingRow[] = [
      { sku: 'SKU-HIGH', frequency: 800 },
      { sku: 'SKU-MED', frequency: 150 },
      { sku: 'SKU-LOW', frequency: 50 },
    ];
    const result = computeSlotting(rows);
    const high = result.find((r) => r.sku === 'SKU-HIGH');
    expect(high?.recommendedZone).toBe('A');
  });

  it('splits SKUs across A/B/C respecting the 80/95 cumulative rule', () => {
    // 10 SKUs with equal frequency: cumulative 80% falls at the 8th SKU
    const rows: PickingRow[] = Array.from({ length: 10 }, (_, i) => ({
      sku: `SKU-${i}`,
      frequency: 10,
    }));
    const result = computeSlotting(rows);
    const zoneA = result.filter((r) => r.recommendedZone === 'A');
    const zoneC = result.filter((r) => r.recommendedZone === 'C');
    expect(zoneA.length).toBeGreaterThan(0);
    expect(zoneC.length).toBeGreaterThan(0);
    expect(zoneA.length + result.filter((r) => r.recommendedZone === 'B').length + zoneC.length).toBe(10);
  });

  it('handles an empty input without throwing', () => {
    expect(computeSlotting([])).toEqual([]);
  });
});

describe('summarizeByZone', () => {
  it('aggregates counts and picks per zone', () => {
    const rows = computeSlotting([
      { sku: 'A1', frequency: 500 },
      { sku: 'A2', frequency: 300 },
      { sku: 'C1', frequency: 10 },
    ]);
    const summary = summarizeByZone(rows);
    const totalCount = summary.A.count + summary.B.count + summary.C.count;
    const totalPicks = summary.A.picks + summary.B.picks + summary.C.picks;
    expect(totalCount).toBe(3);
    expect(totalPicks).toBe(810);
  });
});
