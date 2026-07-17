import { describe, expect, it } from 'vitest';
import { decodeShareState, encodeShareState } from './shareState';
import { QUESTIONS } from '../data/questions';
import type { Answers, CompanyInfo } from '../types';

const company: CompanyInfo = {
  name: 'Almacenes del Noroeste S.L.',
  sector: 'Logística / Transporte',
  employees: '50-99',
  hasWarehouse: true,
  usesERP: false,
  usesExcel: true,
  country: 'España',
};

function sampleAnswers(): Answers {
  const answers: Answers = {};
  QUESTIONS.forEach((q, i) => {
    answers[q.id] = (i % 6) as Answers[string];
  });
  return answers;
}

describe('shareState round-trip', () => {
  it('decodes exactly what was encoded, including special characters in company name', () => {
    const answers = sampleAnswers();
    const encoded = encodeShareState(company, answers);
    const decoded = decodeShareState(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded?.company).toEqual(company);
    expect(decoded?.answers).toEqual(answers);
  });

  it('handles accented characters and symbols in company name (UTF-8 safety)', () => {
    const weirdCompany: CompanyInfo = { ...company, name: 'Peña & Ñíguez, S.A. — 100% café ☕' };
    const answers = sampleAnswers();
    const encoded = encodeShareState(weirdCompany, answers);
    const decoded = decodeShareState(encoded);

    expect(decoded?.company.name).toBe(weirdCompany.name);
  });

  it('produces a URL-safe string with no +, / or = characters', () => {
    const encoded = encodeShareState(company, sampleAnswers());
    expect(encoded).not.toMatch(/[+/=]/);
  });

  it('returns null for garbage input instead of throwing', () => {
    expect(decodeShareState('not-valid-base64!!!')).toBeNull();
    expect(decodeShareState('')).toBeNull();
  });
});
