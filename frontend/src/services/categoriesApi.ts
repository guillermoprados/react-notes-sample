import { authenticatedApi } from './api';
import { Category } from '../types/api';

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await authenticatedApi.get('/categories');
    return response.data;
  },
};
