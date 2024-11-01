import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';
import getConfig from './config';
import { MongooseExceptionFilter } from './common/mongoose-exception-filter';

const config = getConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new MongooseExceptionFilter());

  if(config.env === 'development') {
    swagger(app);
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
