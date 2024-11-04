import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from './swagger';
import getConfig from './config';

const config = getConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  if(config.env === 'development') {
    swagger(app);
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
