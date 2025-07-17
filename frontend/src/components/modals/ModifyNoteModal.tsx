import { useState } from 'react';
import { useNotesStore } from '../../stores/notesStore';
import { useForm } from '../../hooks/useForm';
import { LoadingOverlay } from '../ui/LoadingOverlay';
import { useCategoriesStore } from '../../stores/categoriesStore';

interface ModifyNoteForm {
  content: string;
}

interface ModifyNoteModalProps {
  onModalCloseRequest: () => void;
  noteId?: string;
}

export const ModifyNoteModal = ({
  onModalCloseRequest: onModalClosed,
  noteId = '',
}: ModifyNoteModalProps) => {
  const { notes } = useNotesStore();
  const { updateNote } = useNotesStore() as {
    updateNote: (id: string, update: any) => Promise<any>;
  };
  const { categories } = useCategoriesStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const note = notes.find((n) => n.id === noteId);
  const noteContent = note?.content || '';
  const noteCategoryId = note?.category?.id || '';

  const { formState, onInputChange } = useForm<ModifyNoteForm>({
    content: noteContent,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    noteCategoryId
  );

  const contentChanged = formState.content.trim() !== noteContent.trim();
  const categoryChanged = selectedCategory !== noteCategoryId;
  const formHasChanges =
    formState.content.trim().length > 0 && (contentChanged || categoryChanged);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value || undefined);
  };

  if (!note) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await updateNote(note.id, {
        content: formState.content.trim(),
        categoryId: selectedCategory || undefined,
      });
      setLoading(false);
      onModalClosed();
    } catch (err) {
      setError('Failed to update the note');
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={loading} message="Modifying note..." />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="max-w-lg w-full mx-4 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Modify Note</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <textarea
              id="content"
              name="content"
              value={formState.content}
              onChange={handleInputChange}
              rows={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-blue-500 focus:ring-blue-500 resize-none"
              placeholder="Edit your note here..."
            />
            <div>
              <label
                htmlFor="category-select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category-select"
                value={selectedCategory || ''}
                onChange={handleCategoryChange}
                className="border rounded px-2 py-1 text-sm w-full"
              >
                <option value="">None</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            <div className="flex space-x-3 mt-2">
              <button
                type="submit"
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
                disabled={!formHasChanges || loading}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                onClick={onModalClosed}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
