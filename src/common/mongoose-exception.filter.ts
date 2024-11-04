import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { MongooseError } from 'mongoose';
import { Response } from 'express';

@Catch(MongoError, MongooseError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError|MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(500)
      .json({
        statusCode: 500,
        message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : exception.message,
      });
  }
}
