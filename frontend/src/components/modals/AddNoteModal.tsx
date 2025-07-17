import { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { LoadingOverlay } from '../ui/LoadingOverlay';
import { notesApi } from '../../services';
import { useCategoriesStore } from '../../stores/categoriesStore';

interface AddNoteForm {
  content: string;
}

interface AddNoteModalProps {
  onModalCloseRequest: () => void;
  onNewNoteCreated: () => void;
}

export const AddNoteModal = ({
  onModalCloseRequest: onModalClosed,
  onNewNoteCreated,
}: AddNoteModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { formState, onInputChange } = useForm<AddNoteForm>({
    content: '',
  });
  const { categories } = useCategoriesStore();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  const isFormValid = formState.content.trim().length > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value || undefined);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await notesApi.createNote({
        content: formState.content.trim(),
        categoryId: selectedCategory || undefined,
      });

      onNewNoteCreated();
      onModalClosed();
    } catch (error: any) {
      setError('Failed to create the note');
      console.error('Failed to create note:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={loading} message="Creating note..." />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="max-w-lg w-full mx-4 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Add New Note
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <textarea
              id="content"
              name="content"
              value={formState.content}
              onChange={handleInputChange}
              rows={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-blue-500 focus:ring-blue-500 resize-none"
              placeholder="Write your note here..."
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
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={!isFormValid}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
              >
                Create Note
              </button>
              <button
                type="button"
                onClick={onModalClosed}
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
