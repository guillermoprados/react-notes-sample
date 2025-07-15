import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './config';
import { NotesModule } from './notes/notes.module';
import { CommonModule } from './common/common.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.dbHost,
      port: env.dbPort,
      database: env.dbName,
      username: env.dbUsername,
      password: env.dbPassword,
      autoLoadEntities: true,
      synchronize: true,
    }),
    NotesModule,
    CommonModule,
    CategoriesModule,
  ],
})
export class AppModule {}
