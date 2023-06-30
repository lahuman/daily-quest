import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import * as hbs from 'hbs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  const logger = new Logger('App');

  app.useStaticAssets(join(process.env.PWD, 'public'));
  app.setBaseViewsDir(join(process.env.PWD, 'views'));
  hbs.registerPartials(join(process.env.PWD, 'views/partials'));
  app.setViewEngine('hbs');
  app.set('view options', { layout: 'main' });

  await app.listen(3000);
  logger.log('Application started on port 3000');
}
bootstrap();
