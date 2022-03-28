import { Injectable } from '@angular/core';
import {
  collection, collectionSnapshots, docSnapshots, Firestore, QueryConstraint
} from '@angular/fire/firestore';
import {
  addDoc,
  CollectionReference,
  deleteDoc,
  doc, DocumentSnapshot, query,
  setDoc, Timestamp,
  updateDoc
} from '@firebase/firestore';
import * as moment from 'moment';
import { Moment } from 'moment';
import { defer, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {
    this.enableIndexedDbPersistence();
  }

  createId() {
    return doc(collection(this.firestore, 'id')).id;
  }

  enableIndexedDbPersistence() {
    // TODO enableIndexedDbPersistence(this.firestore)
  }

  list<T>(path: string, ...q: QueryConstraint[]) {
    const ref = collection(this.firestore, path) as CollectionReference<Partial<T>>;
    return collectionSnapshots<Partial<T>>(query<Partial<T>>(ref, ...q))
      .pipe(map((data) => this.convertSnapshots<T>(data)));
  }

  add(path: string, data: any) {
    const ref = collection(this.firestore, path);
    return defer(() => addDoc(ref, this.toFirebaseCompatible(data)));
  }

  set(path: string, data: any) {
    const ref = doc(this.firestore, path);
    return defer(() => setDoc(ref, this.toFirebaseCompatible(data)));
  }

  get<T>(path: string) {
    const ref = doc(this.firestore, path);
    return docSnapshots(ref).pipe(
      map((result) => this.convertSnapshot<T>(result))
    );
  }

  update(path: string, data: any) {
    const ref = doc(this.firestore, path);
    return defer(() => updateDoc(ref, this.toFirebaseCompatible(data)));
  }

  delete(path: string) {
    const ref = doc(this.firestore, path);
    return defer(() => deleteDoc(ref));
  }

  private convertSnapshots<T>(results: any) {
    return <T[]>results.map((snap: DocumentSnapshot) => {
      return this.convertSnapshot(snap);
    });
  }

  private convertSnapshot<T>(result: DocumentSnapshot) {
    return <T>{
      id: result.id,
      ...this.convertFromTimestamps(result.data())
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
    Object.keys(data)
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
