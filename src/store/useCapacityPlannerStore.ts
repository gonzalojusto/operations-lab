import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CapacityInputs } from '../types';

interface CapacityPlannerState {
  inputs: CapacityInputs;
  setInputs: (patch: Partial<CapacityInputs>) => void;
  setWeekdayMultiplier: (dayIndex: number, value: number) => void;
  reset: () => void;
}

const DEFAULT_INPUTS: CapacityInputs = {
  ordersPerDay: 150,
  minutesPerOrder: 8,
  hoursPerEmployeePerDay: 8,
  currentEmployees: 4,
  weeklyDemandMultipliers: [1, 1, 1, 1, 1.2, 1.4, 0.6], // L-M-X-J-V-S-D, viernes/sábado más carga
};

export const useCapacityPlannerStore = create<CapacityPlannerState>()(
  persist(
    (set) => ({
      inputs: DEFAULT_INPUTS,

      setInputs: (patch) => set((state) => ({ inputs: { ...state.inputs, ...patch } })),

      setWeekdayMultiplier: (dayIndex, value) =>
        set((state) => {
          const next = [...state.inputs.weeklyDemandMultipliers];
          next[dayIndex] = value;
          return { inputs: { ...state.inputs, weeklyDemandMultipliers: next } };
        }),

      reset: () => set({ inputs: DEFAULT_INPUTS }),
    }),
    { name: 'operations-lab-capacity-planner' }
  )
);
