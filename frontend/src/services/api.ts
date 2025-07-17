import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { authApi } from './authApi';

const API_URL =
  (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api';

const baseConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const api = axios.create(baseConfig);

const authenticatedApi = axios.create(baseConfig);

authenticatedApi.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authenticatedApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      // Retry original request
      try {
        const response = await authApi.refreshToken(refreshToken);
        const { access_token, refresh_token, user } = response;

        setTokens(access_token, refresh_token, user);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return authenticatedApi(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { authenticatedApi, api };
