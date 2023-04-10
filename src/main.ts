import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookie_parser from 'cookie-parser';
// import * as multer from 'multer';

// const storage = multer.diskStorage({
//   destination: (_, __, cb) => {
//     cb(null, 'uploads'); // Папка для хранения
//   },
//   filename: (_, file, cb) => {
//     cb(null, file.originalname); // Имя файла
//   },
// });
//
// const upload = multer({ storage });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /* app.enableCors({
    origin: true,
    allowedHeaders: 'X-Forwarded-For',
  }); */
  app.use(cookie_parser());
  await app.listen(3000);
}
bootstrap();
