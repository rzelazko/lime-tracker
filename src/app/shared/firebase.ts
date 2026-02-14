import { Observable } from 'rxjs';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, connectAuthEmulator, User } from 'firebase/auth';
import {
  initializeFirestore,
  connectFirestoreEmulator,
  persistentLocalCache,
  persistentMultipleTabManager,
  onSnapshot,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { environment } from '../../environments/environment';

const app = getApps().length ? getApp() : initializeApp(environment.firebase);

export const auth = getAuth(app);
if (environment.useEmulators) {
  connectAuthEmulator(auth, `http://${environment.emulatorHost}:9099`, { disableWarnings: true });
}

export const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
if (environment.useEmulators) {
  connectFirestoreEmulator(firestore, environment.emulatorHost, 8080);
}

export function authState$(): Observable<User | null> {
  return new Observable((subscriber) => {
    const unsub = onAuthStateChanged(
      auth,
      (user) => subscriber.next(user),
      (err) => subscriber.error(err),
      () => subscriber.complete()
    );
    return { unsubscribe: unsub } as any;
  });
}

export function collectionSnapshots<T = any>(queryRef: any): Observable<DocumentSnapshot[]> {
  return new Observable((subscriber) => {
    const unsub = onSnapshot(queryRef, (snap: QuerySnapshot) => {
      subscriber.next(snap.docs as DocumentSnapshot[]);
    }, (err) => subscriber.error(err));
    return () => unsub();
  });
}

export function docSnapshots(docRef: any): Observable<DocumentSnapshot> {
  return new Observable((subscriber) => {
    const unsub = onSnapshot(docRef, (snap: DocumentSnapshot) => {
      subscriber.next(snap);
    }, (err) => subscriber.error(err));
    return () => unsub();
  });
}
