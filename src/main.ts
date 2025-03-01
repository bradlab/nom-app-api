import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from 'adapter/http/http-exception.filter';
import { fDate } from 'util/date.helper';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({});
  const helmetOptions = {
    //
  };
  app.use(helmet(helmetOptions));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('NomAPP API')
    .setDescription(
      `This is the NomAPP API documentation\n\n${fDate(new Date())}`,
    )
    .addTag('NomAPP')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .addBasicAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'NomAPP API',
  };
  SwaggerModule.setup('doc', app, document, customOptions);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('APP_PORT') ?? 3010;
  await app.listen(PORT, () => {
    const logger = new Logger('NomAPP::API');
    logger.log(
      `API successfully started on port ${PORT} at ${new Date().toISOString()}`,
    );
  });
}
void bootstrap();
