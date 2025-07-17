import { useState } from 'react';
import { TopBar, NotesList, AddNoteModal } from '../components';
import { useNotesStore } from '../stores/notesStore';

function Home() {
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const { pagination, clearCache, fetchNotes } = useNotesStore();

  const openAddNewNoteModal = () => {
    setIsAddNoteOpen(true);
  };

  const closeAddNewNoteModal = () => {
    setIsAddNoteOpen(false);
  };

  const handleNewNoteCreated = () => {
    clearCache();
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
