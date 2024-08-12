import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { prismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';

@Module({
  imports: [prismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
