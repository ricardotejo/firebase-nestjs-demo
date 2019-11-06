import { Injectable } from '@nestjs/common';
import { FirestoreProvider } from '../core/firestore.provider';

import { ClientRequest, ClientResponse, DbStats, DbClient, ClientStats, DbAnalytics } from './client.model';
import * as names from '../assets/names.json';
import * as life from '../assets/life.json';

@Injectable()
export class ClientService {

    constructor(
        private provider: FirestoreProvider,
    ) { }

    public async create(client: ClientRequest): Promise<ClientResponse> {

        // calculate age
        const ageMs = Date.now() - new Date(client.birthdate).getTime();
        const age = Math.abs(new Date(ageMs).getUTCFullYear() - 1970); // miliseconds from epoch

        // short birthday
        client.birthdate = client.birthdate.substr(0, 10);

        client.firstName = client.firstName.trim();
        client.lastName = client.lastName.trim();

        // infer the sex
        const normName = client.firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const sex = names[normName] || 'B';

        // [ reduce document size ]
        const { firstName: f, lastName: l, birthdate: b } = client;
        const dbClient: DbClient = { f, l, a: age, b, s: sex, t: this.provider.timestamp() };

        try {
            const ref = await this.provider.db.collection('clients').add(dbClient);

            const res = this.rehydrateClient(ref.id, dbClient);

            void (await this.addClientToStatistics(res.age, res.sex)); // fire & forget

            return res;
        } catch (ex) {
            throw new Error('Error creating the client' + ex);
        }
    }

    public async get(id: string): Promise<ClientResponse> {
        try {
            const doc = await this.provider.db.collection('clients').doc(id).get();
            return this.rehydrateClient(doc.id, doc.data() as DbClient);
        } catch (ex) {
            // console.log(ex);
            throw new Error('Error creating the client');
        }
    }

    public async list(count: number = 10, last?: string): Promise<ClientResponse[]> {
        try {
            const ref = this.provider.db.collection('clients');
            let query = ref.orderBy('t', 'desc');

            if (!!last) {
                const lastSnapshot = await ref.doc(last).get();
                query = query.startAfter(lastSnapshot);
            }

            const snapshot = await query.limit(count).get();

            return snapshot.docs.map(d => this.rehydrateClient(d.id, d.data() as DbClient));
        } catch (ex) {
            // console.log(ex);
            throw (ex);
        }
    }

    public async kpi(): Promise<ClientStats> {
        const dbS = await this.getStats();
        return dbS as ClientStats;
    }

    public async getStats(): Promise<DbStats & DbAnalytics> {
        const cacheRef = this.provider.db.collection('cache').orderBy('t', 'desc');
        const current = (await cacheRef.limit(1).get()).docs[0]; // uses index on 't' (timestamp) 'order desc'

        let stats: DbStats & DbAnalytics;
        if (!!current && current.exists) {
            stats = current.data() as DbStats & DbAnalytics;
        } else {
            stats = {
                n: 0,
                m: 0,
                s: 0,
                mc: 0,
                fc: 0,
                bc: 0,
                a: {},
                am: {},
                af: {},
                lm: 0,
                lf: 0,
            };
        }
        return stats;
    }

    private async addClientToStatistics(newAge: number, sex: string) {

        // To reduce Firebase cost, instead of calculate Std.Dev using all data,
        //  we can recalculate the value from previous stats using this function:

        // Get latest client stats
        const kpiCache = await this.getStats();

        const sd: DbStats = this.recalculateStandardDeviation(kpiCache, newAge);

        // update charting statistics
        const newStats: DbStats & DbAnalytics = {
            ...sd,
            mc: kpiCache.mc + (sex === 'M' ? 1 : 0),
            fc: kpiCache.fc + (sex === 'F' ? 1 : 0),
            bc: kpiCache.bc + (sex === 'B' ? 1 : 0),
            a: { ...kpiCache.a, [newAge]: (kpiCache.a[newAge] || 0) + 1 },
            am: { ...kpiCache.am, [newAge]: (kpiCache.am[newAge] || 0) + (sex === 'M' ? 1 : 0) },
            af: { ...kpiCache.af, [newAge]: (kpiCache.af[newAge] || 0) + (sex === 'F' ? 1 : 0) },
            lm: kpiCache.lm + ((sex === 'M' && newAge > life.latest[sex]) ? 1 : 0),
            lf: kpiCache.lf + ((sex === 'F' && newAge > life.latest[sex]) ? 1 : 0),
        };

        try {
            const cacheRef = this.provider.db.collection('cache');

            cacheRef.add({
                ...newStats,
                t: this.provider.timestamp(), // timestamp - index
            }); // f&f
        } catch (ex) {
            // console.log(ex);
            /**/
        }
    }

    public recalculateStandardDeviation(stats: DbStats, v: number): DbStats {

        // Recalculate standard deviation:  (idea from: `http://mathforum.org/library/drmath/view/52820.html`)

        // So from n, mu, and s, we can recover Sum[x] and Sum[x^2], which means we can compute s'.

        // n        = the population size (number of data points)
        // mu       = population mean
        // s        = standard deviation
        // Sum[x^2] = the sum of the squares of all data points
        // Sum[x]   = the sum of all data points

        const { n, m, s } = stats;
        const sum1 = n * m;
        const sum2 = n * (s * s + m * m);  // n(s^2 + mu^2) = Sum[x^2]

        // the standard deviation after adding a new value, v, would be:
        //             (n+1)*(v^2 + Sum[x^2]) - (v + Sum[x])^2
        //  s' = Sqrt[ --------------------------------------- ]
        //                      (n+1)^2

        const n1 = n + 1;
        const m1 = (sum1 + v) / n1;
        const s1 = Math.sqrt(((n1) * (v * v + sum2) - (v + sum1) * (v + sum1)) / ((n1) * (n1)));

        return { n: n1, m: m1, s: s1 };
    }

    private rehydrateClient(id: string, dbClient: DbClient): ClientResponse {

        const { f: firstName, l: lastName, a: age, b: birthdate, s: sex } = dbClient;

        const bd = new Date(birthdate).getTime();

        const death = new Date(bd + (life.latest[sex] * 31536000000)) // year ≈ 365*24*60*60*1000 ms
            .toISOString().substr(0, 10);
        const creation = (dbClient.t as unknown as { seconds: number }).seconds;

        return { id, firstName, lastName, age, birthdate, sex, death, creation } as ClientResponse;
    }

}
