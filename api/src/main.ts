import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('v1');

  app.set('trust proxy', 1);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
      transform: true,
      whitelist: true,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(helmet());
  const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    methods: 'GET,PUT,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  app.enableCors(corsOptions);

  const logger = new Logger('App');

  // app.useStaticAssets(join(process.env.PWD, 'public'));
  // app.setBaseViewsDir(join(process.env.PWD, 'views'));
  // hbs.registerPartials(join(process.env.PWD, 'views/partials'));
  // app.setViewEngine('hbs');
  // app.set('view options', { layout: 'main' });

  const options = new DocumentBuilder()
    .setTitle('루틴')
    .setDescription('매일 매일 미션!')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(parseInt(process.env.PORT, 10) || 3000);
  logger.log(
    `Application started on port ${parseInt(process.env.PORT, 10) || 3000}`,
  );
}
bootstrap();
