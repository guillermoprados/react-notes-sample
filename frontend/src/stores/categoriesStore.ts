import { create } from 'zustand';
import { Category } from '../types/api';
import { categoriesApi } from '../services/api';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const categories = await categoriesApi.getCategories();
      set({
        categories,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      set({ loading: false });
    }
  },
}));
