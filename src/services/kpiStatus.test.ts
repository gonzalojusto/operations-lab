import { describe, expect, it } from 'vitest';
import { calculateKPIStatus, getLatestValue, getTrend } from './kpiStatus';
import type { KPIDefinition, KPIEntry } from '../types';

const higherIsBetter: KPIDefinition = {
  id: 'kpi-1',
  name: 'OTIF',
  unit: '%',
  target: 95,
  direction: 'higher-is-better',
  isPreset: true,
};

const lowerIsBetter: KPIDefinition = {
  id: 'kpi-2',
  name: 'Coste por pedido',
  unit: '€',
  target: 6,
  direction: 'lower-is-better',
  isPreset: true,
};

function entry(kpiId: string, date: string, value: number): KPIEntry {
  return { id: `${kpiId}-${date}`, kpiId, date, value };
}

describe('calculateKPIStatus', () => {
  it('returns no-data when there are no entries', () => {
    expect(calculateKPIStatus(higherIsBetter, [])).toBe('no-data');
  });

  it('is on-track when a higher-is-better KPI meets or exceeds target', () => {
    const entries = [entry('kpi-1', '2026-01-01', 96)];
    expect(calculateKPIStatus(higherIsBetter, entries)).toBe('on-track');
  });

  it('is at-risk within 10% deviation below target (higher-is-better)', () => {
    // 95 * 0.92 = 87.4 -> ~8% below target
    const entries = [entry('kpi-1', '2026-01-01', 88)];
    expect(calculateKPIStatus(higherIsBetter, entries)).toBe('at-risk');
  });

  it('is off-track beyond 10% deviation (higher-is-better)', () => {
    const entries = [entry('kpi-1', '2026-01-01', 60)];
    expect(calculateKPIStatus(higherIsBetter, entries)).toBe('off-track');
  });

  it('is on-track when a lower-is-better KPI is at or below target', () => {
    const entries = [entry('kpi-2', '2026-01-01', 5)];
    expect(calculateKPIStatus(lowerIsBetter, entries)).toBe('on-track');
  });

  it('is off-track when a lower-is-better KPI far exceeds target', () => {
    const entries = [entry('kpi-2', '2026-01-01', 20)];
    expect(calculateKPIStatus(lowerIsBetter, entries)).toBe('off-track');
  });

  it('uses the most recent entry, not the first, when several exist', () => {
    const entries = [entry('kpi-1', '2026-01-01', 40), entry('kpi-1', '2026-02-01', 97)];
    expect(calculateKPIStatus(higherIsBetter, entries)).toBe('on-track');
    expect(getLatestValue(higherIsBetter, entries)).toBe(97);
  });
});

describe('getTrend', () => {
  it('returns no-data with fewer than 2 entries', () => {
    expect(getTrend(higherIsBetter, [entry('kpi-1', '2026-01-01', 90)])).toBe('no-data');
  });

  it('detects an upward trend', () => {
    const entries = [entry('kpi-1', '2026-01-01', 80), entry('kpi-1', '2026-02-01', 95)];
    expect(getTrend(higherIsBetter, entries)).toBe('up');
  });

  it('detects a downward trend', () => {
    const entries = [entry('kpi-1', '2026-01-01', 95), entry('kpi-1', '2026-02-01', 80)];
    expect(getTrend(higherIsBetter, entries)).toBe('down');
  });
});
