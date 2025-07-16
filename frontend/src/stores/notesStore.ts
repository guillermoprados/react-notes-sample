import { create } from 'zustand';
import { Note } from '../types/api';
import { notesApi } from '../services/api';

interface NotesState {
  notes: Note[];
  loading: boolean;
  fetchNotes: () => Promise<void>;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  loading: false,

  fetchNotes: async () => {
    set({ loading: true });
    try {
      const response = await notesApi.getNotes(1, 10);
      console.log('Notes API Response:', response);
      set({ notes: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      set({ loading: false });
    }
  },
}));
