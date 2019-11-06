import { Injectable } from '@nestjs/common';
import * as firebaseTesting from '@firebase/testing';
import { FieldValue } from '@google-cloud/firestore';

@Injectable()
export class FirestoreLocalProvider {

    public db: firebase.firestore.Firestore;

    constructor() {
        this.db = firebaseTesting.initializeTestApp({
            projectId: 'demo-8571b',
            auth: { uid: 'rtejo', email: 'ricardo@example.com' },
        }).firestore();
    }

    public timestamp(): FieldValue {
        return firebaseTesting.firestore.FieldValue.serverTimestamp();
    }
}
