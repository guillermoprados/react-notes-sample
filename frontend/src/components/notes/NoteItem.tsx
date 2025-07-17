import { Note } from '../../types/api';

interface NoteItemProps {
  note: Note;
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  const { content, category, archived } = note;

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
        <button
          onClick={() => {
            console.log('Archive note:', note.id);
          }}
          className={`px-3 py-1 text-sm rounded hover:opacity-80 transition-colors ${
            archived
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          {archived ? 'Unarchive' : 'Archive'}
        </button>
      </div>
    </div>
  );
};

export { NoteItem };
