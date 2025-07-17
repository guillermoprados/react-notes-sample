import { api } from './api';
import { LoginSuccessResponse } from '../types/api';

export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<LoginSuccessResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (
    email: string,
    password: string,
    name?: string
  ): Promise<LoginSuccessResponse> => {
    const payload: { email: string; password: string; name?: string } = {
      email,
      password,
    };
    if (name && name.trim()) {
      payload.name = name;
    }
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<LoginSuccessResponse> => {
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};
