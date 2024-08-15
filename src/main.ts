import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// import { LogInterceptor } from './interceptores/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  // app.useGlobalInterceptors(new LogInterceptor());
  await app.listen(3000, () => console.log('Serve On'));
}
bootstrap();
