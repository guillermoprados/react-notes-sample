import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AppModule } from './app.module';
import { env } from './config';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { seedDatabase } from './seed/seed';
import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Note } from './notes/entities/note.entity';

async function bootstrap() {
  await waitForDatabase();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: env.corsOrigin.split(',').map((origin) => origin.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new DatabaseExceptionFilter());

  await seedIfEmpty();

  await app.listen(env.port);
}
void bootstrap();

async function waitForDatabase(retries = 10, delayMs = 2000) {
  const ds = new DataSource({
    type: 'postgres',
    host: env.dbHost,
    port: env.dbPort,
    database: env.dbName,
    username: env.dbUsername,
    password: env.dbPassword,
  });
  for (let i = 0; i < retries; i++) {
    try {
      await ds.initialize();
      await ds.destroy();
      return;
    } catch (err) {
      if (i === retries - 1) throw err;

      console.log(`Waiting for database... (${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

async function seedIfEmpty() {
  const ds = new DataSource({
    type: 'postgres',
    host: env.dbHost,
    port: env.dbPort,
    database: env.dbName,
    username: env.dbUsername,
    password: env.dbPassword,
    entities: [User, Category, Note],
  });
  await ds.initialize();
  await seedDatabase(ds);
  await ds.destroy();
}
