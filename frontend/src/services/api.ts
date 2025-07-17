import axios from 'axios';
import {
  LoginSuccessResponse,
  NotesResponse,
  CreateNoteRequest,
  CreateNoteResponse,
  Category,
} from '../types/api';
import { useAuthStore } from '../stores/authStore';

const API_URL =
  (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api';

const baseConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const api = axios.create(baseConfig);

const authenticatedApi = () => {
  const { accessToken } = useAuthStore.getState();

  if (!accessToken) {
    throw new Error('No access token available');
  }

  return axios.create({
    ...baseConfig,
    headers: {
      ...baseConfig.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<LoginSuccessResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

export const notesApi = {
  getNotes: async (
    page: number = 1,
    limit: number = 10
  ): Promise<NotesResponse> => {
    const api = authenticatedApi();
    const response = await api.get(`/notes?page=${page}&limit=${limit}`);
    return response.data;
  },

  createNote: async (
    noteData: CreateNoteRequest
  ): Promise<CreateNoteResponse> => {
    const api = authenticatedApi();
    const response = await api.post('/notes', noteData);
    return response.data;
  },
};

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const api = authenticatedApi();
    const response = await api.get('/categories');
    return response.data;
  },
};

export default api;
