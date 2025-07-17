//Auth

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

// Domain

export interface Note {
  id: string;
  content: string;
  archived: boolean;
  category: Category | null;
}

export interface NotesResponse {
  data: Note[];
  meta: PaginationMeta;
}

export interface Category {
  id: string;
  name: string;
}

// Utils
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
