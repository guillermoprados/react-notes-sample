import axios from "axios";
import { LoginSuccessResponse } from "../types/api";

const API_URL =
  (import.meta as any).env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<LoginSuccessResponse> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
};

export default api;
