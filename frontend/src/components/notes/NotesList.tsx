import { useEffect, useState } from 'react';
import { NoteItem } from './NoteItem';
import { Note } from '../../types/api';
import { notesApi } from '../../services/api';
import { useAppContext } from '../../contexts/AppContext';

const NotesList: React.FC = () => {
  const { accessToken } = useAppContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchNotes = async () => {
      if (!accessToken) return;

      try {
        setLoading(true);
        const response = await notesApi.getNotes(1, 10, accessToken);
        console.log('Notes API Response:', response);
        setNotes(response.data);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [accessToken]);

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
