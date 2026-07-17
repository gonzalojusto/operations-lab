import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRESET_KPIS } from '../data/presetKPIs';
import type { KPIDefinition, KPIEntry } from '../types';

interface KPIPulseState {
  kpis: KPIDefinition[];
  entries: KPIEntry[];

  addCustomKPI: (kpi: Omit<KPIDefinition, 'id' | 'isPreset'>) => void;
  removeKPI: (kpiId: string) => void;
  logEntry: (kpiId: string, date: string, value: number) => void;
  removeEntry: (entryId: string) => void;
  resetToDefaults: () => void;
}

// KPI Pulse persiste en localStorage: es un tracker que vive enteramente en
// el navegador del usuario, sin backend ni sincronización entre dispositivos.
export const useKPIPulseStore = create<KPIPulseState>()(
  persist(
    (set) => ({
      kpis: PRESET_KPIS,
      entries: [],

      addCustomKPI: (kpi) =>
        set((state) => ({
          kpis: [...state.kpis, { ...kpi, id: `custom-${crypto.randomUUID()}`, isPreset: false }],
        })),

      removeKPI: (kpiId) =>
        set((state) => ({
          kpis: state.kpis.filter((k) => k.id !== kpiId),
          entries: state.entries.filter((e) => e.kpiId !== kpiId),
        })),

      logEntry: (kpiId, date, value) =>
        set((state) => ({
          entries: [...state.entries, { id: crypto.randomUUID(), kpiId, date, value }],
        })),

      removeEntry: (entryId) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== entryId) })),

      resetToDefaults: () => set({ kpis: PRESET_KPIS, entries: [] }),
    }),
    { name: 'operations-lab-kpi-pulse' }
  )
);
