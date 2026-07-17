import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScoreHistoryEntry } from '../types';

interface ScoreHistoryState {
  entries: ScoreHistoryEntry[];
  addEntry: (entry: Omit<ScoreHistoryEntry, 'id' | 'date'>) => void;
  clear: () => void;
}

export const useScoreHistoryStore = create<ScoreHistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            ...state.entries,
            { ...entry, id: crypto.randomUUID(), date: new Date().toISOString() },
          ],
        })),
      clear: () => set({ entries: [] }),
    }),
    { name: 'operations-lab-score-history' }
  )
);
