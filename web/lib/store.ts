import { create } from "zustand";

export type Locale = "en-US" | "es-US" | "fr-CA";

export interface ExhibitState {
  locale: Locale;
  scores: Record<string, number>;
  setLocale: (locale: Locale) => void;
  recordScore: (moduleId: string, points: number) => void;
  manualReset: () => void;
}

const initial: Pick<ExhibitState, "locale" | "scores"> = {
  locale: "en-US",
  scores: {},
};

export const useExhibitStore = create<ExhibitState>((set) => ({
  ...initial,
  setLocale: (locale) => set({ locale }),
  recordScore: (moduleId, points) =>
    set((s) => ({ scores: { ...s.scores, [moduleId]: points } })),
  manualReset: () => {
    set(initial);
    if (typeof window !== "undefined") window.location.reload();
  },
}));
