import { describe, expect, it } from 'vitest';
import {
  calculateAllCategoryScores,
  calculateCategoryScore,
  calculateConfidenceScore,
  calculateGlobalScore,
  calculatePotentialSavings,
  generateMaturityLevel,
} from '../services/scoring';
import { QUESTIONS } from '../data/questions';
import type { Answers, CompanyInfo } from '../types';

function allAnswers(value: 0 | 1 | 2 | 3 | 4 | 5): Answers {
  return Object.fromEntries(QUESTIONS.map((q) => [q.id, value]));
}

describe('calculateCategoryScore', () => {
  it('returns 100 when every question in a category is answered with 5', () => {
    const answers = allAnswers(5);
    const score = calculateCategoryScore('procesos', answers);
    expect(score).toBe(100);
  });

  it('returns 0 when every question in a category is answered with 0', () => {
    const answers = allAnswers(0);
    const score = calculateCategoryScore('kpis', answers);
    expect(score).toBe(0);
  });

  it('returns 0 for a category with no answers at all', () => {
    expect(calculateCategoryScore('inventario', {})).toBe(0);
  });
});

describe('calculateGlobalScore / generateMaturityLevel', () => {
  it('produces a perfect 100 with all answers maxed', () => {
    const categoryScores = calculateAllCategoryScores(allAnswers(5));
    const global = calculateGlobalScore(categoryScores);
    expect(global).toBe(100);
    expect(generateMaturityLevel(global)).toBe('Operational Excellence');
  });

  it('produces a 0 with all answers at minimum', () => {
    const categoryScores = calculateAllCategoryScores(allAnswers(0));
    const global = calculateGlobalScore(categoryScores);
    expect(global).toBe(0);
    expect(generateMaturityLevel(global)).toBe('Reactive');
  });

  it('maps score thresholds to the correct maturity level', () => {
    expect(generateMaturityLevel(24)).toBe('Reactive');
    expect(generateMaturityLevel(25)).toBe('Developing');
    expect(generateMaturityLevel(49)).toBe('Developing');
    expect(generateMaturityLevel(50)).toBe('Structured');
    expect(generateMaturityLevel(74)).toBe('Structured');
    expect(generateMaturityLevel(75)).toBe('Operational Excellence');
  });

  it('category weights sum to 100% so a uniform answer set is scale-invariant', () => {
    const categoryScores = calculateAllCategoryScores(allAnswers(3));
    const global = calculateGlobalScore(categoryScores);
    // 3/5 = 60% on every question -> every category scores 60 -> global must be 60
    expect(global).toBe(60);
  });
});

describe('calculateConfidenceScore', () => {
  it('returns the base confidence score of 50 with no CSVs', () => {
    const { score, label } = calculateConfidenceScore({});
    expect(score).toBe(50);
    expect(label).toBe('MEDIUM');
  });

  it('increases with more CSVs provided and clean data', () => {
    const clean = {
      inventario: {
        fileName: 'inventario.csv',
        rowCount: 100,
        skuCount: 100,
        deadStockCount: 5,
        deadStockPercentage: 5,
        abcAnalysis: { a: 20, b: 30, c: 50 },
        missingValues: 0,
        duplicates: 0,
        potentialExcessStock: 0,
        inventoryHealth: 90,
        warnings: [],
      },
    };
    const { score } = calculateConfidenceScore(clean);
    expect(score).toBe(65);
  });
});

describe('calculatePotentialSavings', () => {
  const baseCompany: CompanyInfo = {
    name: 'Test Co',
    sector: 'Retail',
    employees: '50-99',
    hasWarehouse: false,
    usesERP: false,
    usesExcel: true,
    country: 'España',
  };

  it('always marks the result as an estimate', () => {
    const savings = calculatePotentialSavings(10, 'Reactive', baseCompany);
    expect(savings.isEstimate).toBe(true);
  });

  it('assigns a higher base amount to lower operational scores', () => {
    const low = calculatePotentialSavings(10, 'Reactive', baseCompany);
    const high = calculatePotentialSavings(90, 'Operational Excellence', baseCompany);
    expect(low.baseAmount).toBeGreaterThan(high.baseAmount);
    expect(low.totalEstimated).toBeGreaterThan(high.totalEstimated);
  });

  it('applies a warehouse multiplier when the company has a warehouse', () => {
    const without = calculatePotentialSavings(40, 'Developing', baseCompany);
    const withWarehouse = calculatePotentialSavings(40, 'Developing', {
      ...baseCompany,
      hasWarehouse: true,
    });
    expect(withWarehouse.totalEstimated).toBeGreaterThan(without.totalEstimated);
  });
});
