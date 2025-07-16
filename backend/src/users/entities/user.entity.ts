import { Note } from 'src/notes/entities/note.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: false, unique: true })
  email: string;

  @Column('text', { nullable: false })
  password: string;

  @Column('text', { nullable: true })
  name?: string;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];
}
