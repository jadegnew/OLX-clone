import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookie_parser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookie_parser());

  const config = new DocumentBuilder()
    .setTitle('OLX Clone')
    .setDescription('The OLX Clone API description')
    .setVersion('1.0')
    .addTag('OLX Clone')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
