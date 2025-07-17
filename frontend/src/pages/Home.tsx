import { useState, useEffect } from 'react';
import { TopBar, NotesList, AddNoteModal } from '../components';
import { useNotesStore } from '../stores/notesStore';
import { useCategoriesStore } from '../stores/categoriesStore';
import { useAuthStore } from '../stores/authStore';

function Home() {
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const { clearCache, refetch } = useNotesStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && categories.length === 0) {
      fetchCategories();
    }
  }, [isAuthenticated, categories.length, fetchCategories]);

  const openAddNewNoteModal = () => {
    setIsAddNoteOpen(true);
  };

  const closeAddNewNoteModal = () => {
    setIsAddNoteOpen(false);
  };

  const handleNewNoteCreated = () => {
    clearCache();
    refetch();
  };

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col">
      <TopBar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <NotesList onShowAddNewNote={openAddNewNoteModal} />
      </div>
      {isAddNoteOpen && (
        <AddNoteModal
          onNewNoteCreated={handleNewNoteCreated}
          onModalCloseRequest={closeAddNewNoteModal}
        />
      )}
    </div>
  );
}

export default Home;
