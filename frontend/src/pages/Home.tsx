import { useEffect } from 'react';
import { TopBar, NotesList, AddNoteModal } from '../components';
import { ModifyNoteModal } from '../components/modals/ModifyNoteModal';
import { useNotesStore } from '../stores/notesStore';
import { useCategoriesStore } from '../stores/categoriesStore';
import { useAuthStore } from '../stores/authStore';
import { useNoteActionsStore } from '../stores/noteActionsStore';

function Home() {
  const { clearCache, refetch } = useNotesStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const { isAuthenticated } = useAuthStore();
  const {
    isAddNoteOpen,
    isEditNoteOpen,
    closeAddNote,
    closeEditNote,
    editNoteId,
  } = useNoteActionsStore();
  const { notes } = useNotesStore();

  useEffect(() => {
    if (isAuthenticated && categories.length === 0) {
      fetchCategories();
    }
  }, [isAuthenticated, categories.length, fetchCategories]);

  const handleNewNoteCreated = () => {
    clearCache();
    refetch();
  };

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col">
      <TopBar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <NotesList />
      </div>
      {isAddNoteOpen && (
        <AddNoteModal
          onNewNoteCreated={handleNewNoteCreated}
          onModalCloseRequest={closeAddNote}
        />
      )}
      {isEditNoteOpen && editNoteId && (
        <ModifyNoteModal
          onModalCloseRequest={closeEditNote}
          noteId={editNoteId}
        />
      )}
    </div>
  );
}

export default Home;
