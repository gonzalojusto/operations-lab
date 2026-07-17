import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProcessStep } from '../types';

interface ProcessMapperState {
  steps: ProcessStep[];
  addStep: (step: Omit<ProcessStep, 'id' | 'order'>) => void;
  updateStep: (id: string, patch: Partial<Omit<ProcessStep, 'id' | 'order'>>) => void;
  removeStep: (id: string) => void;
  moveStep: (id: string, direction: 'up' | 'down') => void;
  reset: () => void;
}

export const useProcessMapperStore = create<ProcessMapperState>()(
  persist(
    (set) => ({
      steps: [],

      addStep: (step) =>
        set((state) => ({
          steps: [...state.steps, { ...step, id: crypto.randomUUID(), order: state.steps.length }],
        })),

      updateStep: (id, patch) =>
        set((state) => ({
          steps: state.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),

      removeStep: (id) =>
        set((state) => ({
          steps: state.steps
            .filter((s) => s.id !== id)
            .map((s, i) => ({ ...s, order: i })),
        })),

      moveStep: (id, direction) =>
        set((state) => {
          const sorted = [...state.steps].sort((a, b) => a.order - b.order);
          const index = sorted.findIndex((s) => s.id === id);
          const swapWith = direction === 'up' ? index - 1 : index + 1;
          if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return state;
          [sorted[index], sorted[swapWith]] = [sorted[swapWith], sorted[index]];
          return { steps: sorted.map((s, i) => ({ ...s, order: i })) };
        }),

      reset: () => set({ steps: [] }),
    }),
    { name: 'operations-lab-process-mapper' }
  )
);
