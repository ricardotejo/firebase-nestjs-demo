import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { FieldValue } from '@google-cloud/firestore';

@Injectable()
export class FirestoreProvider {

    public db: firebase.firestore.Firestore;

    constructor() {
        this.db =
            firebase.initializeApp({
                credential: firebase.credential.cert(require('../assets/firebase.json')),
                databaseURL: 'https://YOUR-DB-URL.firebaseio.com',
            }).firestore();

    }

    public timestamp(): FieldValue {
        return firebase.firestore.FieldValue.serverTimestamp();
    }
}
