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
import { PaginationDto } from 'src/common/dtos/pagination.dto';
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
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Note>> {
    const { limit = 10, page = 1 } = paginationDto;

    const offset = (page - 1) * limit;

    const totalItems = await this.notesRepository.count();
    const totalPages = Math.ceil(totalItems / limit);

    const data = await this.notesRepository.find({
      take: limit,
      skip: offset,
    });

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

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  async remove(id: string) {
    const note = await this.notesRepository.findOneBy({ id });
    if (note) {
      await this.notesRepository.remove(note);
    }

    return {};
  }
}
