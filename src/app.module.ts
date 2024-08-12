import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { prismaModule } from './prisma/prisma.module';

@Module({
  imports: [UserModule, prismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
