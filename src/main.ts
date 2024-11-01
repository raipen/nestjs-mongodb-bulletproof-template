import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if(process.env.NODE_ENV === 'development') {
    swagger(app);
  }

  await app.listen(3000);
}
bootstrap();
