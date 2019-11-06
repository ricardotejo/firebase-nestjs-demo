// tslint:disable: max-classes-per-file

import { ApiModelProperty } from '@nestjs/swagger';
import { FieldValue } from '@google-cloud/firestore';

export class ClientRequest {
    @ApiModelProperty()
    firstName: string;
    @ApiModelProperty()
    lastName: string;
    @ApiModelProperty({ type: 'string', format: 'yyyy-mm-dd' })
    birthdate: string; // ISO-8601
}

export class ClientResponse extends ClientRequest {
    @ApiModelProperty()
    id: string;
    @ApiModelProperty()
    age: number;
    @ApiModelProperty()
    sex: string;
    @ApiModelProperty()
    death: string; // ISO-8601
    @ApiModelProperty()
    creation: number;
}

export interface DbClient {
    f: string; // firstname
    l: string; // lastname
    b: string; // birthday
    a: number; // age
    s: string; // sex
    t: FieldValue; // timestamp
}

export interface DbStats {
    n: number;
    m: number;
    s: number;
}

export interface DbAnalytics {
    mc: number; // male count
    fc: number; // female count
    bc: number; // undef count
    a: { [age: number]: number }; // age distribution
    am: { [age: number]: number }; // age distribution male
    af: { [age: number]: number }; // age distribution female
    lm: number; // male passing expected life
    lf: number; // male passing expected life
}

export type ClientStats = DbStats & DbAnalytics;
