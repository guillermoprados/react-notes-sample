import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { error } from 'console';
import { NotesPaginationDto } from './dto/notes-pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

@Injectable()
export class NotesService {
  private readonly logger = new Logger('NotesService');

  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    try {
      const note = this.notesRepository.create(createNoteDto);
      await this.notesRepository.save(note);
      return note;
    } catch {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Cannot insert the new note, there was a server error. Check server Logs',
      );
    }
  }

  async findAll(
    paginationDto: NotesPaginationDto,
  ): Promise<PaginatedResponse<Note>> {
    const { limit = 10, page = 1, archived = 'false' } = paginationDto;

    const offset = (page - 1) * limit;

    const whereCondition: { archived?: boolean } = {};
    // If archived === 'all', we don't add any condition (fetch all)
    if (archived === 'true') {
      whereCondition.archived = true;
    } else if (archived === 'false') {
      whereCondition.archived = false;
    }

    const data = await this.notesRepository.find({
      where: whereCondition,
      take: limit,
      skip: offset,
    });

    const totalItems = await this.notesRepository.count({
      where: whereCondition,
    });
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException(`Note with id ${id} cannot be found`);
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const note = await this.notesRepository.preload({ id, ...updateNoteDto });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} cannot be found`);
    }

    try {
      await this.notesRepository.save(note);
    } catch {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Cannot update note with id ${id}, there was a server error. Check server Logs`,
      );
    }
    return note;
  }

  async remove(id: string) {
    const note = await this.notesRepository.findOneBy({ id });
    if (note) {
      await this.notesRepository.remove(note);
    }

    return {};
  }
}
