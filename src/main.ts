import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  

  if(process.env.NODE_ENV === 'development') {
    swagger(app);
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
