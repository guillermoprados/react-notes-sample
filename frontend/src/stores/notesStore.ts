import { create } from 'zustand';
import { Note, PaginationMeta } from '../types/api';
import { notesApi } from '../services/api';

interface CachedPage {
  notes: Note[];
  pagination: PaginationMeta;
  timestamp: number;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  pagination: PaginationMeta | null;
  cache: Map<string, CachedPage>;
  fetchNotes: (page?: number, limit?: number) => Promise<void>;
  clearCache: () => void;
}

const isCacheValid = (cachedPage: CachedPage): boolean => {
  const now = Date.now();
  const CACHE_DURATION = 5 * 60 * 1000;
  return now - cachedPage.timestamp < CACHE_DURATION;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,
  pagination: null,
  cache: new Map(),

  fetchNotes: async (page = 1, limit = 10) => {
    const cacheKey = `${page}-${limit}`;
    const { cache } = get();

    const cachedPage = cache.get(cacheKey);
    if (cachedPage && isCacheValid(cachedPage)) {
      set({
        notes: cachedPage.notes,
        pagination: cachedPage.pagination,
        loading: false,
      });
      return;
    }

    set({ loading: true });
    try {
      const response = await notesApi.getNotes(page, limit);

      const newCache = new Map(cache);
      newCache.set(cacheKey, {
        notes: response.data,
        pagination: response.meta,
        timestamp: Date.now(),
      });

      set({
        notes: response.data,
        pagination: response.meta,
        loading: false,
        cache: newCache,
      });
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      set({ loading: false });
    }
  },

  clearCache: () => {
    set({ cache: new Map() });
  },
}));
