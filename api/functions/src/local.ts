// tslint:disable: no-console

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';

const server = express();

export const createNestServer = async (expressInstance: any) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
    {
      cors: true,
    },
  );
  app.use(helmet()); // protect from HTTP vulnerabilities

  setupDocumentation(app); // enable swagger documentation

  await app.listen(3000);
};

function setupDocumentation(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Firebase Nest.js Demo')
    .setDescription('Client API')
    .setVersion('0.1.0')
    .setSchemes('http')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('doc', app, document);
}

createNestServer(server)
  .then(v => console.log('Nest Ready'))
  .catch(err => console.error('Nest broken', err));
