import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ClientRequest, Client, ClientStats } from '../client';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient,
  ) { }

  public async create(client: ClientRequest): Promise<string> {
    // await of('').pipe(delay(3000)).toPromise(); // DEBUG SLEEP
    return this.http.post<string>(environment.api + `/clients`, client).toPromise();
  }

  public async list(count: number, last?: string): Promise<Client[]> {
    return this.http.get<Client[]>(environment.api + `/clients?size=${count}`).toPromise();
  }

  public find(pageSize = 10, afterId?: string): Observable<Client[]> {

    let params = new HttpParams()
      .set('size', pageSize.toString());

    if (!!afterId) {
      params = params.set('last', afterId.toString());
    }
    // .set('sortOrder', sortOrder)
    // .set('pageSize', pageSize.toString())

    return this.http.get<Client[]>(environment.api + `/clients`, { params });
    // .pipe(delay(3000)); // DEBUG
  }

  public async kpi(): Promise<ClientStats> {
    // await of('').pipe(delay(3000)).toPromise(); // DEBUG SLEEP
    return this.http.get<ClientStats>(environment.api + `/clients/kpi`).toPromise();
  }

}
