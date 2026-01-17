import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

interface StoreState {
  searchQuery: string;
  selectedCategories: string[];
  allCategories: string[];
  session: Session | null;
  isAdmin: boolean;
  isLoadingSession: boolean;
  currentPersona: 'citizen' | 'investor' | 'tourist';
  setSearchQuery: (q: string) => void;
  toggleCategory: (cat: string) => void;
  setAllCategories: (cats: string[]) => void;
  setSession: (s: Session | null) => void;
  setIsLoadingSession: (loading: boolean) => void;
  clearSelectedCategories?: () => void;
  setPersona: (p: 'citizen' | 'investor' | 'tourist') => void;
  viewState: 'grid' | 'map' | 'mixed';
  algorithmWeights: {
    time: number;
    location: number;
    history: number;
  };
  setViewState: (v: 'grid' | 'map' | 'mixed') => void;
  updateWeights: (w: Partial<StoreState['algorithmWeights']>) => void;
  setHelperVisible: (v: boolean) => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
  helperVisible?: boolean; 
}

export const useStore = create<StoreState>((set) => ({
  searchQuery: '',
  selectedCategories: [],
  allCategories: [],
  session: null,
  isAdmin: false,
  isLoadingSession: true,
  currentPersona: 'citizen',
  viewState: 'mixed',
  algorithmWeights: { time: 0.3, location: 0.2, history: 0.5 },
  isCommandPaletteOpen: false,
  helperVisible: false,
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleCategory: (cat) =>
    set((state) => {
      if (state.selectedCategories.includes(cat)) {
        return { selectedCategories: state.selectedCategories.filter((c) => c !== cat) };
      }
      return { selectedCategories: [...state.selectedCategories, cat] };
    }),
  setAllCategories: (cats) => set({ allCategories: cats }),
  setSession: (s) => set({ session: s, isAdmin: s?.user?.email?.endsWith('@gmail.com') || false }), 
  // For now, simple admin check. In production, check role or metadata.
  setIsLoadingSession: (loading) => set({ isLoadingSession: loading }),
  clearSelectedCategories: () => set({ selectedCategories: [] }),
  setPersona: (p) => set({ currentPersona: p }),
  setViewState: (v) => set({ viewState: v }),
  updateWeights: (w) => set((state) => ({ algorithmWeights: { ...state.algorithmWeights, ...w } })),
  setCommandPaletteOpen: (v) => set({ isCommandPaletteOpen: v }),
  setHelperVisible: (_v) => {}, // No-op or implementation if needed.
}));
