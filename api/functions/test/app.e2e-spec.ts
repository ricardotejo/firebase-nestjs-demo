import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { FirestoreProvider } from './../src/core/firestore.provider';
import { FirestoreLocalProvider } from './../src/core/firestore-local.provider';
import { ClientResponse, DbClient, ClientStats } from '../src/client/client.model';

describe('AppController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirestoreProvider).useClass(FirestoreLocalProvider)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('OK');
  });

  it('/clients (GET)', () => {
    return request(app.getHttpServer())
      .get('/clients?size=1')
      .expect(200)
      ;
  });

  it('/clients/kpi (GET)', () => {
    return request(app.getHttpServer())
      .get('/clients/kpi')
      .expect(200)
      ;
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await new FirestoreLocalProvider().db.terminate();
  });
});
