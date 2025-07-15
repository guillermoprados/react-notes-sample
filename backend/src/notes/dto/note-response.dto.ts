import { Note } from '../entities/note.entity';

export class NoteResponseDto {
  id: string;
  content: string;
  archived: boolean;
  category: {
    id: string;
    name: string;
  } | null;

  constructor(note: Note) {
    this.id = note.id;
    this.content = note.content;
    this.archived = note.archived;
    this.category = note.category
      ? {
          id: note.category.id,
          name: note.category.name,
        }
      : null;
  }
}
