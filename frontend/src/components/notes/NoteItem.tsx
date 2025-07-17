import { Note } from '../../types/api';
import { IoArchiveOutline, IoReload, IoTrash } from 'react-icons/io5';
import { useState } from 'react';
import { useNotesStore } from '../../stores/notesStore';
import { ConfirmModal } from '../ui/ConfirmModal';

interface NoteItemProps {
  note: Note;
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  const { content, category, archived, id } = note;
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { updateNote, deleteNote } = useNotesStore();

  const handleArchiveToggle = async () => {
    setLoading(true);
    await updateNote(id, { archived: !archived });
    setLoading(false);
  };

  const handleDeleteNote = async () => {
    setLoading(true);
    await deleteNote(id);
    setLoading(false);
    setShowConfirm(false);
  };

  return (
    <div className="p-4 border-b border-gray-200 last:border-b-0 flex items-start gap-3">
      <div className="flex-1 min-w-0">
        {/* Chips */}
        <div className="flex gap-2 mb-2">
          {category && (
            <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
              {category.name}
            </span>
          )}
          {archived && (
            <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
              Archived
            </span>
          )}
        </div>

        <p className="text-gray-800 truncate text-left">{content}</p>
      </div>

      <div className="flex-shrink-0">
        {archived ? (
          <button
            onClick={handleArchiveToggle}
            disabled={loading}
            className="px-3 py-1 md:w-[100px] text-sm rounded hover:opacity-80 transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200 flex gap-2 items-center disabled:opacity-50"
          >
            <IoReload size={16} className="mr-1" />{' '}
            <p className="hidden md:block">Restore</p>
          </button>
        ) : (
          <button
            onClick={handleArchiveToggle}
            disabled={loading}
            className="px-3 py-1 md:w-[100px] text-sm rounded hover:opacity-80 transition-colors bg-purple-100 text-purple-700 hover:bg-red-200 flex gap-2 items-center disabled:opacity-50"
          >
            <IoArchiveOutline size={16} className="mr-1" />{' '}
            <p className="hidden md:block">Archive</p>
          </button>
        )}
        <button
          onClick={() => setShowConfirm(true)}
          disabled={loading}
          className="px-3 py-1 md:w-[100px] mt-2 text-sm rounded hover:opacity-80 transition-colors bg-red-100 text-red-700 hover:bg-red-200 flex gap-2 items-center disabled:opacity-50"
        >
          <IoTrash size={16} className="mr-1" />{' '}
          <p className="hidden md:block">Delete</p>
        </button>
        <ConfirmModal
          open={showConfirm}
          title="Delete Note"
          message="Are you sure you want to delete this note?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteNote}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </div>
  );
};

export { NoteItem };
