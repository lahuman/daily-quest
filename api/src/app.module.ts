import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ResourcesModule } from './resources/resources.module';
import { FirebaseAuthStrategy } from './firebase/firebase-auth.strategy';

@Module({
  imports: [AuthModule, UsersModule, ResourcesModule],
  controllers: [AppController],
  providers: [AppService, FirebaseAuthStrategy],
})
export class AppModule {}
