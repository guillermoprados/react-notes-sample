import { useEffect, useState } from 'react';
import { NoteItem } from './NoteItem';
import { useAuthStore } from '../../stores/authStore';
import { useNotesStore } from '../../stores/notesStore';
import { Paginator } from '../Paginator';
import { ToggleGroup } from '../ui/ToggleGroup';
import { useCategoriesStore } from '../../stores/categoriesStore';
import { useNoteActionsStore } from '../../stores/noteActionsStore';

const archiveFilterOptions = ['Not Archived', 'Archived', 'All'];
const statusMap = ['not-archived', 'archived', 'all'] as const;
const ITEMS_PER_PAGE = 8;

const statusKeyForIndex = (index: number): string | undefined => {
  return statusMap[index] === 'all' ? undefined : statusMap[index];
};

const NotesList: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { notes, loading, pagination, fetchNotes, clearCache } =
    useNotesStore();
  const { categories } = useCategoriesStore();
  const { openAddNote } = useNoteActionsStore();

  const [selectedArchiveIndex, setSelectedArchiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  const handleArchiveFilterChange = (index: number, option: string) => {
    setSelectedArchiveIndex(index);
    setCurrentPage(1);
    clearCache();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value || undefined);
    setCurrentPage(1);
    clearCache();
  };

  useEffect(() => {
    if (isAuthenticated) {
      const categoryId =
        selectedCategory && selectedCategory !== ''
          ? selectedCategory
          : undefined;
      fetchNotes(
        currentPage,
        ITEMS_PER_PAGE,
        statusKeyForIndex(selectedArchiveIndex),
        categoryId
      );
    }
  }, [
    isAuthenticated,
    currentPage,
    selectedArchiveIndex,
    selectedCategory,
    fetchNotes,
  ]);

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
        <div className="hidden md:block flex-1"></div>
        <div className="flex-1 flex justify-center">
          <ToggleGroup
            options={archiveFilterOptions}
            selectedIndex={selectedArchiveIndex}
            onSelectionChange={handleArchiveFilterChange}
          />
        </div>
        <div className="flex-1 flex justify-end items-center">
          <label
            className="hidden md:block text-sm text-gray-600 mr-2"
            htmlFor="category-select"
          >
            Category
          </label>
          <select
            id="category-select"
            value={selectedCategory || ''}
            onChange={handleCategoryChange}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
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
          <div className="hidden md:block flex-1"></div>
          <div className="flex-1 flex justify-center">
            <Paginator
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={openAddNote}
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
