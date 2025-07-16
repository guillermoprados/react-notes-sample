export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export interface LoginSuccessResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}
