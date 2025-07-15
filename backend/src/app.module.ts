import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './config';

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
    }),
  ],
})
export class AppModule {}
