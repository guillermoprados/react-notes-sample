import { authenticatedApi } from './api';
import {
  NotesResponse,
  CreateNoteRequest,
  CreateNoteResponse,
} from '../types/api';

export const notesApi = {
  getNotes: async (
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<NotesResponse> => {
    let url = `/notes?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
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
};
