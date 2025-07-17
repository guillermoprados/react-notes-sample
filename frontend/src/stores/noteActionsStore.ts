import { create } from 'zustand';

interface NoteActionsState {
  isAddNoteOpen: boolean;
  isEditNoteOpen: boolean;
  editNoteId: string | null;
  openAddNote: () => void;
  closeAddNote: () => void;
  openEditNote: (noteId: string) => void;
  closeEditNote: () => void;
}

export const useNoteActionsStore = create<NoteActionsState>((set) => ({
  isAddNoteOpen: false,
  isEditNoteOpen: false,
  editNoteId: null,

  openAddNote: () => set({ isAddNoteOpen: true }),
  closeAddNote: () => set({ isAddNoteOpen: false }),
  openEditNote: (noteId: string) =>
    set({ isEditNoteOpen: true, editNoteId: noteId }),
  closeEditNote: () => set({ isEditNoteOpen: false, editNoteId: null }),
}));
