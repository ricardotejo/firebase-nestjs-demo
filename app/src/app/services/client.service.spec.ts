import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { ClientService } from './client.service';
import { Client } from '../client';
import { environment } from 'src/environments/environment';

describe('ClientService', () => {

  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService]
    });
    service = TestBed.get(ClientService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('be able to retrieve posts from the API bia GET', () => {
    const dummy: Client[] = [{
      id: 'ABC01',
      firstName: 'ricardo',
      lastName: 'tejo',
      age: 37,
      birthdate: '1982-03-28',
      creation: 0,
      death: '2100-12-31',
      sex: 'M'
    }];

    service.find(1).subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(dummy);
    });
    const request = httpMock.expectOne(`${environment.api}/clients?size=1`);
    expect(request.request.method).toBe('GET');
    request.flush(dummy);
  });

  afterEach(() => {
    httpMock.verify();
  });

});
