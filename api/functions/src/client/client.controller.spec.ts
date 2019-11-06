import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientRequest, ClientResponse, ClientStats } from './client.model';

describe('Client Controller', () => {
  let controller: ClientController;

  beforeAll(async () => {

    const clientService = {
      async create(req) {
        return {
          id: '00000', firstName: req.firstName, lastName: req.lastName, birthdate: req.birthdate,
        } as ClientResponse;
      },
      async get(id: string) {
        return {
          id, firstName: 'test', lastName: 'TEST', birthdate: '2000-01-01',
        } as ClientResponse;
      },
      async kpi() {
        return { n: 8 } as ClientStats;
      },
      async list(size: number, last?: string) {
        return new Array<ClientResponse>(last ? 5 : size).fill({ firstName: 'test' } as ClientResponse);
      },

      //
      async creacliente(req) {
        return this.create(req);
      },
      async listclientes(size: number, last?: string) {
        return this.list(size, last);
      },
      async kpideclientes() {
        return this.kpi();
      },

    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [{ provide: ClientService, useValue: clientService }],
    }).compile();
    controller = module.get<ClientController>(ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create on service', async () => {
    const response = await controller.create({
      firstName: 'test',
      lastName: 'TEST',
      birthdate: '2000-01-01',
    });
    expect(response.firstName).toEqual('test');
  });

  it('should call kpi on service', async () => {
    const response = await controller.kpi();
    expect(response.n).toEqual(8);
  });

  it('should call get on service', async () => {
    const id = '0123456';
    const response = await controller.get({ id });
    expect(response.id).toEqual(id);
  });

  it('should call list on service', async () => {
    const response = await controller.list(10);
    expect(response.length).toEqual(10);
  });

  it('should call list on service with last-id', async () => {
    const response = await controller.list(10, '01234');
    expect(response.length).toEqual(5);
  });

});
