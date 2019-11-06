import { Component, OnInit, OnDestroy } from '@angular/core';
import { Client } from '../client';
import { ClientService } from '../services/client.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit, OnDestroy {

  public headElements = ['Nombre', 'Apellido', 'Edad', 'Sexo', 'Fecha muerte'];
  public elements$: Observable<Client[]>;


  private clientsSubject = new BehaviorSubject<Client[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  pageSize = 10;

  last?: string = null;

  private loadedClients: Client[] = [];

  constructor(
    private service: ClientService
  ) { }


  ngOnInit() {
    this.elements$ = this.clientsSubject.asObservable();
    this.loadMore();
  }

  ngOnDestroy(): void {
    this.clientsSubject.complete();
    this.loadingSubject.complete();
  }

  load(pageSize: number) {
    this.loadingSubject.next(true);

    this.service.find(pageSize, this.last).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(clients => {
      if (clients.length) {
        this.last = (clients[clients.length - 1] as Client).id;
      }

      // this.loadedClients = [...this.loadedClients, ...clients];
      this.loadedClients = this.loadedClients.concat(clients);

      this.clientsSubject.next(this.loadedClients);
    });
  }

  loadMore() {
    this.load(this.pageSize);
  }

}
