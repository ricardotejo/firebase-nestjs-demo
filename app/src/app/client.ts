export interface ClientRequest {
    firstName: string;
    lastName: string;
    birthdate: string; // ISO-8601
}

export interface Client extends ClientRequest {
    id: string;
    age: number;
    sex: string;
    death: string; // ISO-8601,
    creation: number;
}

export interface ClientStats {
    n: number; // count
    m: number; // mean
    s: number; // std.dev.

    mc: number; // male count
    fc: number; // female count
    bc: number; // undef count
    a: { [age: number]: number }; // age distribution
    am: { [age: number]: number }; // age distribution male
    af: { [age: number]: number }; // age distribution female
    lm: number; // male passing expected life
    lf: number; // male passing expected life
}
