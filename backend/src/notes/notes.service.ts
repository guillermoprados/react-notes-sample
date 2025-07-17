import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { NotesPaginationDto } from './dto/notes-pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { NoteResponseDto } from './dto/note-response.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class NotesService {
  private readonly logger = new Logger('NotesService');

  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createNoteDto: CreateNoteDto,
    userId: string,
  ): Promise<NoteResponseDto> {
    if (createNoteDto.categoryId) {
      const categoryExists = await this.categoryRepository.findOne({
        where: { id: createNoteDto.categoryId },
      });

      if (!categoryExists) {
        throw new NotFoundException(
          `Category with id ${createNoteDto.categoryId} not found`,
        );
      }
    }

    const note = this.notesRepository.create({
      ...createNoteDto,
      userId,
    });
    await this.notesRepository.save(note);

    const savedNote = await this.notesRepository.findOne({
      where: { id: note.id },
      relations: ['category'],
    });

    return new NoteResponseDto(savedNote!);
  }

  async findAll(
    paginationDto: NotesPaginationDto,
    userId: string,
  ): Promise<PaginatedResponse<NoteResponseDto>> {
    const { limit = 10, page = 1, status = 'all', category } = paginationDto;

    const offset = (page - 1) * limit;

    const whereCondition: {
      archived?: boolean;
      categoryId?: string;
      userId: string;
    } = { userId };

    if (status === 'archived') {
      whereCondition.archived = true;
    } else if (status === 'not-archived') {
      whereCondition.archived = false;
    }
    // If status === 'all', we don't add any condition (fetch all)

    if (category) {
      whereCondition.categoryId = category;
    }

    const data = await this.notesRepository.find({
      where: whereCondition,
      take: limit,
      skip: offset,
      relations: ['category'],
    });

    const totalItems = await this.notesRepository.count({
      where: whereCondition,
    });
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: data.map((note) => new NoteResponseDto(note)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  async findOne(id: string, userId: string): Promise<NoteResponseDto> {
    const note = await this.notesRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} cannot be found`);
    }

    return new NoteResponseDto(note);
  }

  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
    userId: string,
  ): Promise<NoteResponseDto> {
    if (updateNoteDto.categoryId) {
      const categoryExists = await this.categoryRepository.findOne({
        where: { id: updateNoteDto.categoryId },
      });

      if (!categoryExists) {
        throw new NotFoundException(
          `Category with id ${updateNoteDto.categoryId} not found`,
        );
      }
    }

    const note = await this.notesRepository.findOne({
      where: { id, userId },
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} cannot be found`);
    }

    const updatedNote = await this.notesRepository.preload({
      id,
      ...updateNoteDto,
    });

    await this.notesRepository.save(updatedNote!);

    const savedNote = await this.notesRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    return new NoteResponseDto(savedNote!);
  }

  async remove(id: string, userId: string) {
    const note = await this.notesRepository.findOne({
      where: { id, userId },
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} cannot be found`);
    }

    await this.notesRepository.remove(note);
    return {};
  }
}
