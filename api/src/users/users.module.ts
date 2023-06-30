import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database.module';
import { userProviders } from './user.providers';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, ...userProviders],
  exports: [UsersService],
})
export class UsersModule {}
