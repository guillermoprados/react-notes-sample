import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('DatabaseExceptionFilter');

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Log the database error
    this.logger.error('Database error occurred:', exception);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if ((exception as any).code === '23505') {
      // Unique constraint violation (PostgreSQL)
      response.status(409).json({
        statusCode: 409,
        message: 'A record with this value already exists',
        error: 'Conflict',
      });
      return;
    }

    // For other database errors
    response.status(500).json({
      statusCode: 500,
      message: 'A server error occurred. Please check server logs',
      error: 'Internal Server Error',
    });
  }
}
