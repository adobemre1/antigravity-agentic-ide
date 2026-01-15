import { create } from 'zustand';

interface StoreState {
  searchQuery: string;
  selectedCategories: string[];
  allCategories: string[];
  setSearchQuery: (q: string) => void;
  toggleCategory: (cat: string) => void;
  setAllCategories: (cats: string[]) => void;
}

export const useStore = create<StoreState>((set) => ({
  searchQuery: '',
  selectedCategories: [],
  allCategories: [], 
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleCategory: (cat) =>
    set((state) => {
      if (state.selectedCategories.includes(cat)) {
        return { selectedCategories: state.selectedCategories.filter((c) => c !== cat) };
      }
      return { selectedCategories: [...state.selectedCategories, cat] };
    }),
  setAllCategories: (cats) => set({ allCategories: cats }),
}));
