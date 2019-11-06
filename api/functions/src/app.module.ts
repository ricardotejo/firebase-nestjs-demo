import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { ClientService } from './client/client.service';
import { ClientController } from './client/client.controller';
import { FirestoreProvider } from './core/firestore.provider';
import { FirestoreLocalProvider } from './core/firestore-local.provider';

// TODO: to local testing use: { provide: FirestoreProvider, useClass: FirestoreLocalProvider },

@Module({
  imports: [CoreModule],
  controllers: [AppController, ClientController],
  providers: [AppService,
    FirestoreProvider,
    ClientService],
})
export class AppModule { }
