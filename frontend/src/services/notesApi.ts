import { authenticatedApi } from './api';
import {
  NotesResponse,
  CreateNoteRequest,
  CreateNoteResponse,
  UpdateNoteRequest,
} from '../types/api';

export const notesApi = {
  getNotes: async (
    page: number = 1,
    limit: number = 10,
    status?: string,
    categoryId?: string
  ): Promise<NotesResponse> => {
    let url = `/notes?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    const response = await authenticatedApi.get(url);
    return response.data;
  },

  createNote: async (
    noteData: CreateNoteRequest
  ): Promise<CreateNoteResponse> => {
    const response = await authenticatedApi.post('/notes', noteData);
    return response.data;
  },

  updateNote: async (
    noteId: string,
    update: UpdateNoteRequest
  ): Promise<CreateNoteResponse> => {
    const response = await authenticatedApi.patch(`/notes/${noteId}`, update);
    return response.data;
  },
};
