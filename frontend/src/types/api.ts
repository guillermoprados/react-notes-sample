// User related types
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

// Auth response types
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

// Generic API error response (for other endpoints)
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}
