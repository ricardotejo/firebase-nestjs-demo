import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { FirestoreProvider } from '../core/firestore.provider';
import { FirestoreLocalProvider } from '../core/firestore-local.provider';
import { ClientRequest, ClientResponse, DbClient } from './client.model';

describe('ClientService', () => {
  let service: ClientService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientService, { provide: FirestoreProvider, useClass: FirestoreLocalProvider }],
    }).compile();

    service = module.get<ClientService>(ClientService);
    const provider = module.get<FirestoreProvider>(FirestoreProvider);
    const db = provider.db;

    const ref = db.collection('clients').doc('TEST01');
    if (!(await ref.get()).exists) {
      await ref.set({ f: 'test', l: 'TEST', a: 30, b: '1965-01-10', s: 'M', t: provider.timestamp() } as DbClient);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('client is created', async () => {
    const date = new Date().toISOString();
    const age = parseInt(date.substr(20, 3), 10) / 10; // quasirandom age using ms value
    const birthdate = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() - age)).toISOString().substring(0, 10);

    const result = await service.create({
      firstName: `test-${date}`,
      lastName: `TEST-${date}`,
      birthdate,
    });

    expect(result).toBeTruthy();
  });

  it('client list', async () => {
    const result = await service.list(1);
    expect(result.length).toBeLessThanOrEqual(1);
  });

  it('client list with last-id', async () => {
    const result = await service.list(1, 'TEST01');
    expect(result.length).toBeLessThanOrEqual(1);
  });

  it('get one client by id', async () => {
    const client = await service.get('TEST01');
    expect(client.firstName).toEqual('test');
  });

  it('recalculate standard deviation', () => {

    //    T0	              T1	              T2
    // N	             304	             305	             306
    // M	50.4440789473684	50.3344262295082	50.2941176470588
    // S	28.8584937637008	28.8745102023374	28.8358850401981
    // V                                  17                38

    const t0 = {
      n: 304,
      m: 50.4440789473684,
      s: 28.8584937637008,
    };

    const t1 = service.recalculateStandardDeviation(t0, 17);
    expect(t1.n).toEqual(305);
    expect(t1.m).toBeCloseTo(50.3344262295082, 12);
    expect(t1.s).toBeCloseTo(28.8745102023374, 12);

    const t2 = service.recalculateStandardDeviation(t1, 38);
    expect(t2.n).toEqual(306);
    expect(t2.m).toBeCloseTo(50.2941176470588, 12);
    expect(t2.s).toBeCloseTo(28.8358850401981, 12);
  });

  it('calculate standard deviation from begin', () => {

    //    T0 T1	              T2                T3
    // N	0                 1	               2	               3
    // M	0  28.0000000000000 21.0000000000000	24.6666666666667
    // S	0  0.00000000000000 7.00000000000000	7.71722460186020
    // V                   28               14                32

    const t0 = {
      n: 0,
      m: 0,
      s: 0,
    };

    const t1 = service.recalculateStandardDeviation(t0, 28);
    expect(t1.n).toEqual(1);
    expect(t1.m).toBeCloseTo(28.0000000000000, 12);
    expect(t1.s).toBeCloseTo(0.00000000000000, 12);

    const t2 = service.recalculateStandardDeviation(t1, 14);
    expect(t2.n).toEqual(2);
    expect(t2.m).toBeCloseTo(21.0000000000000, 12);
    expect(t2.s).toBeCloseTo(7.00000000000000, 12);

    const t3 = service.recalculateStandardDeviation(t2, 32);
    expect(t3.n).toEqual(3);
    expect(t3.m).toBeCloseTo(24.6666666666667, 12);
    expect(t3.s).toBeCloseTo(7.71722460186020, 12);
  });

  it('kpi is returned', async () => {
    const result = await service.kpi();

    expect(result.n).toBeGreaterThan(0);
  });
});
