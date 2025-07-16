import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesPaginationDto } from './dto/notes-pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser, AuthUserType } from '../auth/decorators/authUser.decorator';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @AuthUser() user: AuthUserType) {
    return this.notesService.create(createNoteDto, user.id);
  }

  @Get()
  findAll(
    @Query() paginationDto: NotesPaginationDto,
    @AuthUser() user: AuthUserType,
  ) {
    return this.notesService.findAll(paginationDto, user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthUser() user: AuthUserType,
  ) {
    return this.notesService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @AuthUser() user: AuthUserType,
  ) {
    return this.notesService.update(id, updateNoteDto, user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthUser() user: AuthUserType,
  ) {
    return this.notesService.remove(id, user.id);
  }
}
