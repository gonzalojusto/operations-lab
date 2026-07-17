import { describe, expect, it } from 'vitest';
import { computeCapacity } from './capacityPlanner';
import type { CapacityInputs } from '../types';

const baseInputs: CapacityInputs = {
  ordersPerDay: 150,
  minutesPerOrder: 8,
  hoursPerEmployeePerDay: 8,
  currentEmployees: 4,
  weeklyDemandMultipliers: [1, 1, 1, 1, 1, 1, 1], // demanda uniforme
};

describe('computeCapacity', () => {
  it('computes required hours correctly from orders and time per order', () => {
    // 150 orders * 8 min = 1200 min = 20 hours/day required
    const result = computeCapacity(baseInputs);
    expect(result.dailyRequiredHours[0]).toBeCloseTo(20, 1);
  });

  it('flags a capacity gap when current staff is insufficient', () => {
    // 20h required/day, 4 employees * 8h = 32h available -> no gap expected here
    const result = computeCapacity(baseInputs);
    expect(result.gap).toBeLessThanOrEqual(0);

    const understaffed = computeCapacity({ ...baseInputs, currentEmployees: 1 });
    // 8h available vs 20h required -> gap should be positive (need more people)
    expect(understaffed.gap).toBeGreaterThan(0);
  });

  it('applies weekday demand multipliers to daily required hours', () => {
    const inputs: CapacityInputs = {
      ...baseInputs,
      weeklyDemandMultipliers: [1, 1, 1, 1, 2, 2, 0.5],
    };
    const result = computeCapacity(inputs);
    expect(result.dailyRequiredHours[4]).toBeGreaterThan(result.dailyRequiredHours[0]);
    expect(result.dailyRequiredHours[6]).toBeLessThan(result.dailyRequiredHours[0]);
  });

  it('returns 100% utilization when required equals available', () => {
    // 8 employees * 8h = 64h available, required = 150*8/60 = 20h -> utilization ~31%
    // construct a case where they match exactly instead
    const inputs: CapacityInputs = {
      ordersPerDay: 60,
      minutesPerOrder: 8,
      hoursPerEmployeePerDay: 8,
      currentEmployees: 1,
      weeklyDemandMultipliers: [1, 1, 1, 1, 1, 1, 1],
    };
    // required = 60*8/60 = 8h, available = 1*8 = 8h -> 100% utilization
    const result = computeCapacity(inputs);
    expect(result.utilization).toBe(100);
  });
});
