import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './user/user.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './core/snake-naming.strategy';
import { join } from 'path';
import { TodoModule } from './todo/todo.module';
import { AuthStrategy } from './auth/auth.strategy';
import { AllExceptionsFilter } from './core/exception.filter';
import { APP_FILTER } from '@nestjs/core';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('./core/snake-naming.strategy').SnakeNamingStrategy;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      namingStrategy: new SnakeNamingStrategy(),
      database: process.env.DB_SCHEMA,
      enableWAL: true,
      synchronize: false,
      entities: [join(__dirname, '**/*.entity.{ts,js}')],
      subscribers: [],
      maxQueryExecutionTime: 1000, // 1초 이상되는 모든 쿼리 등록
      extra: {
        synchronous: 'normal',
        temp_store: 'memory',
        mmap_size: 30000000000,
        page_size: 32768,
      },
    }),
    UsersModule,
    TodoModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    AuthStrategy,
    {
      // ExceptionFilter 등록
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
