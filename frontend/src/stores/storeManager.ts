import { useNotesStore } from './notesStore';
import { useCategoriesStore } from './categoriesStore';

export const storeManager = {
  clearAllStores: () => {
    useNotesStore.getState().clearCache();
    useNotesStore.setState({
      notes: [],
      loading: false,
      pagination: null,
    });

    useCategoriesStore.setState({
      categories: [],
      loading: false,
    });
  },
};
