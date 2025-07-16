import axios from 'axios';
import { LoginSuccessResponse, NotesResponse } from '../types/api';

const API_URL =
  (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api';

const baseConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const api = axios.create(baseConfig);

const createAuthenticatedApi = (accessToken: string) => {
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
    limit: number = 10,
    accessToken: string
  ): Promise<NotesResponse> => {
    const authenticatedApi = createAuthenticatedApi(accessToken);
    const response = await authenticatedApi.get(
      `/notes?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

export default api;
