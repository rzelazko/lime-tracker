import { Injectable } from '@angular/core';
import {
  collection,
  collectionSnapshots,
  docSnapshots,
  DocumentData,
  Firestore,
  QueryConstraint,
  writeBatch
} from '@angular/fire/firestore';
import {
  addDoc,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  WriteBatch
} from '@firebase/firestore';
import * as moment from 'moment';
import { Moment } from 'moment';
import { defer, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private batch?: WriteBatch;
  constructor(private firestore: Firestore) {}

  list<T>(path: string, ...q: QueryConstraint[]) {
    const ref = collection(this.firestore, path) as CollectionReference<Partial<T>>;
    return collectionSnapshots<Partial<T>>(query<Partial<T>, DocumentData>(ref, ...q)).pipe(
      map((data) => this.convertSnapshots<T>(data))
    );
  }

  add(path: string, data: any) {
    const ref = collection(this.firestore, path);
    return defer(() => addDoc(ref, this.toFirebaseCompatible(data)));
  }

  set(path: string, data: any) {
    const ref = doc(this.firestore, path);
    return defer(() => setDoc(ref, this.toFirebaseCompatible(data)));
  }

  getRaw<T>(path: string) {
    const ref = doc(this.firestore, path);
    return docSnapshots(ref);
  }

  get<T>(path: string) {
    return this.getRaw<T>(path).pipe(map((result) => this.convertSnapshot<T>(result)));
  }

  update(path: string, data: any) {
    const ref = doc(this.firestore, path);
    return defer(() => updateDoc(ref, this.toFirebaseCompatible(data)));
  }

  delete(path: string) {
    const ref = doc(this.firestore, path);
    return defer(() => deleteDoc(ref));
  }

  startTransaction() {
    this.batch = writeBatch(this.firestore);
  }

  appendAddToTransaction(path: string, data: any) {
    if (!this.batch) {
      this.startTransaction();
    }
    const ref = doc(collection(this.firestore, path));
    this.batch?.set(ref, this.toFirebaseCompatible(data));
  }

  appendUpdateToTransaction(path: string, data: any) {
    if (!this.batch) {
      this.startTransaction();
    }
    const ref = doc(this.firestore, path);
    this.batch?.update(ref, this.toFirebaseCompatible(data));
  }

  commitTransaction() {
    return defer(() => {
      if (this.batch) {
        return this.batch.commit();
      }
      throw new Error(`Transaction has not been started - cannot commit!`);
    });
  }

  private convertSnapshots<T>(results: any) {
    return <T[]>results.map((snap: DocumentSnapshot) => {
      return this.convertSnapshot(snap);
    });
  }

  private convertSnapshot<T>(result: DocumentSnapshot) {
    return <T>{
      id: result.id,
      ...this.convertFromTimestamps(result.data()),
    };
  }

  private toFirebaseCompatible(data: any) {
    return this.setUndefinedValuesToNull(this.convertToTimestamps(data));
  }

  private setUndefinedValuesToNull(data: any) {
    Object.keys(data)
      .filter((k) => data[k] == undefined)
      .forEach((k) => (data[k] = null));
    return data;
  }

  private convertFromTimestamps(data: any) {
    Object.keys(data || {})
      .filter((k) => data[k] instanceof Timestamp)
      .forEach((k) => (data[k] = moment((data[k] as Timestamp).toDate())));
    return data;
  }

  private convertToTimestamps(data: any) {
    Object.keys(data)
      .filter((k) => data[k] instanceof moment)
      .forEach((k) => (data[k] = Timestamp.fromDate((data[k] as Moment).toDate())));
    return data;
  }
}
