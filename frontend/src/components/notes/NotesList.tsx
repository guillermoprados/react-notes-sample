import { useEffect, useState } from 'react';
import { NoteItem } from './NoteItem';
import { useAuthStore } from '../../stores/authStore';
import { useNotesStore } from '../../stores/notesStore';
import { Paginator } from '../Paginator';
import { ToggleGroup } from '../ui/ToggleGroup';

const archiveFilterOptions = ['Not Archived', 'Archived', 'All'];
const statusMap = ['not-archived', 'archived', 'all'] as const;
const ITEMS_PER_PAGE = 8;

interface NotesListProps {
  onShowAddNewNote: () => void;
}

const StatusKeyForIndex = (index: number): string | undefined => {
  return statusMap[index] === 'all' ? undefined : statusMap[index];
};

const NotesList: React.FC<NotesListProps> = ({ onShowAddNewNote }) => {
  const { isAuthenticated } = useAuthStore();
  const { notes, loading, pagination, fetchNotes, clearCache } =
    useNotesStore();

  const [selectedArchiveIndex, setSelectedArchiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleArchiveFilterChange = (index: number, option: string) => {
    setSelectedArchiveIndex(index);
    setCurrentPage(1);
    clearCache();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes(
        currentPage,
        ITEMS_PER_PAGE,
        StatusKeyForIndex(selectedArchiveIndex)
      );
    }
  }, [isAuthenticated, currentPage, selectedArchiveIndex, fetchNotes]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md m-6 p-6 flex-1">
        <p className="text-gray-500 text-center">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md m-6 flex-1 flex flex-col">
      {/* Header with filters */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex-1">
          <span className="text-sm text-gray-600">Categoria</span>
        </div>

        <div className="flex-1 flex justify-center">
          <ToggleGroup
            options={archiveFilterOptions}
            selectedIndex={selectedArchiveIndex}
            onSelectionChange={handleArchiveFilterChange}
          />
        </div>

        <div className="flex-1"></div>
      </div>

      {/* Notes content */}
      <div className="flex-1">
        {notes.length > 0 ? (
          notes.map((note) => <NoteItem key={note.id} note={note} />)
        ) : (
          <div className="flex items-center justify-center h-full min-h-64">
            <p className="text-gray-500 text-center">No notes found</p>
          </div>
        )}
      </div>
      {pagination && (
        <div className="mt-auto flex items-center justify-between px-4 border-t border-gray-200">
          <div className="flex-1"></div>
          <div className="flex-1 flex justify-center">
            <Paginator
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={onShowAddNewNote}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Add New Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { NotesList };
