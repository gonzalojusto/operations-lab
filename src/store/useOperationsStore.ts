import { create } from 'zustand';
import { computeScoreResult } from '../services/scoring';
import type { AnswerScale, Answers, CompanyInfo, CSVResults, ScoreResult, WizardStep } from '../types';

interface OperationsState {
  step: WizardStep;
  company: CompanyInfo;
  answers: Answers;
  csvResults: CSVResults;
  score: ScoreResult | null;

  setStep: (step: WizardStep) => void;
  setCompany: (company: Partial<CompanyInfo>) => void;
  setAnswer: (questionId: string, value: AnswerScale) => void;
  setCSVResult: <K extends keyof CSVResults>(key: K, value: CSVResults[K]) => void;
  computeScore: () => void;
  reset: () => void;
}

const emptyCompany: CompanyInfo = {
  name: '',
  sector: '',
  employees: '10-49',
  hasWarehouse: false,
  usesERP: false,
  usesExcel: true,
  country: 'España',
};

export const useOperationsStore = create<OperationsState>((set, get) => ({
  step: 'company',
  company: emptyCompany,
  answers: {},
  csvResults: {},
  score: null,

  setStep: (step) => set({ step }),

  setCompany: (partial) =>
    set((state) => ({ company: { ...state.company, ...partial } })),

  setAnswer: (questionId, value) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: value } })),

  setCSVResult: (key, value) =>
    set((state) => ({ csvResults: { ...state.csvResults, [key]: value } })),

  computeScore: () => {
    const { answers, company, csvResults } = get();
    const score = computeScoreResult(answers, company, csvResults);
    set({ score, step: 'results' });
  },

  reset: () =>
    set({
      step: 'company',
      company: emptyCompany,
      answers: {},
      csvResults: {},
      score: null,
    }),
}));
