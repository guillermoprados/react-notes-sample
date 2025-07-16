import { useEffect } from 'react';
import { NoteItem } from './NoteItem';
import { useAuthStore } from '../../stores/authStore';
import { useNotesStore } from '../../stores/notesStore';

const NotesList: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { notes, loading, fetchNotes } = useNotesStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated, fetchNotes]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md m-6 p-6">
        <p className="text-gray-500 text-center">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md m-6">
      {notes.map((note) => (
        <NoteItem key={note.id} content={note.content} />
      ))}
    </div>
  );
};

export { NotesList };
