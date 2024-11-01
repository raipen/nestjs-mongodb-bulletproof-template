import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

function swagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('nestjs With mongodb')
    .setDescription('nest js 템플릿 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'nestjs API v1.0'
  });
}

export { swagger };
