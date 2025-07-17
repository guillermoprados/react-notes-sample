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

  refreshToken: async (refreshToken: string): Promise<LoginSuccessResponse> => {
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};
