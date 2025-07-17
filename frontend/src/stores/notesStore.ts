import { create } from 'zustand';
import { Note, PaginationMeta } from '../types/api';
import { notesApi } from '../services';

interface FilterCache {
  status?: string;
  category?: string;
  pages: Record<string, Note[]>;
  timestamp: number;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  pagination: PaginationMeta | null;
  cache: FilterCache | null;

  fetchParams: {
    page: number;
    limit: number;
    status?: string;
    category?: string;
  } | null;

  fetchNotes: (
    page?: number,
    limit?: number,
    status?: string,
    category?: string
  ) => Promise<void>;
  refetch: () => void;
  clearCache: () => void;
  updateNote: (noteId: string, update: Partial<Note>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
}

const isCacheValid = (
  cache: FilterCache | null,
  status?: string,
  category?: string
): boolean => {
  if (!cache) return false;

  if ((cache.status || '') !== (status || '')) return false;
  if ((cache.category || '') !== (category || '')) return false;

  const now = Date.now();
  const CACHE_DURATION = 5 * 60 * 1000;
  return now - cache.timestamp < CACHE_DURATION;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,
  pagination: null,
  cache: null,
  fetchParams: null,

  fetchNotes: async (
    page = 1,
    limit = 10,
    status?: string,
    category?: string
  ) => {
    set({ fetchParams: { page, limit, status, category } });

    const { cache } = get();
    const pageKey = `${page}-${limit}`;

    if (isCacheValid(cache, status, category)) {
      const cachedNotes = cache!.pages[pageKey];
      if (cachedNotes) {
        set({
          notes: cachedNotes,
          loading: false,
        });
        return;
      }
    }

    set({ loading: true });
    try {
      const response = await notesApi.getNotes(page, limit, status, category);

      const newCache: FilterCache = {
        status,
        category,
        pages: cache
          ? { ...cache.pages, [pageKey]: response.data }
          : { [pageKey]: response.data },
        timestamp: Date.now(),
      };

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
    set({ cache: null });
  },

  refetch: () => {
    const { fetchParams: currentFetchParams, fetchNotes } = get();
    if (currentFetchParams) {
      const { page, limit, status, category } = currentFetchParams;
      fetchNotes(page, limit, status, category);
    }
  },

  updateNote: async (noteId: string, update: Partial<Note>) => {
    try {
      await notesApi.updateNote(noteId, update);
      get().clearCache();
      get().refetch();
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  },

  deleteNote: async (noteId: string) => {
    try {
      await notesApi.deleteNote(noteId);
      get().clearCache();
      get().refetch();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  },
}));
