import { Injectable } from '@angular/core';
import { startAfter } from '@angular/fire/firestore';
import { limit, orderBy, QueryConstraint } from 'firebase/firestore';
import * as moment from 'moment';
import { map } from 'rxjs';
import { concatMap, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Seizure } from '../models/seizure.model';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class SeizuresService {
  constructor(private authService: AuthService, private firestoreService: FirestoreService) {}

  create(seizure: Partial<Seizure>) {
    return this.authService.authenticatedUserId$.pipe(
      switchMap((uid) => this.firestoreService.add(`users/${uid}/seizures`, seizure))
    );
  }

  read(id: string) {
    return this.authService.authenticatedUserId$.pipe(
      switchMap((uid) =>
        this.firestoreService
          .get<Seizure>(`users/${uid}/seizures/${id}`)
          .pipe(map((data) => this.convertDuration(data)))
      )
    );
  }

  update(id: string, seizure: Partial<Seizure>) {
    return this.authService.authenticatedUserId$.pipe(
      switchMap((uid) => this.firestoreService.set(`users/${uid}/seizures/${id}`, seizure))
    );
  }

  delete(id: string) {
    return this.authService.authenticatedUserId$.pipe(
      switchMap((uid) => this.firestoreService.delete(`users/${uid}/seizures/${id}`))
    );
  }

  list(pageSize: number, startAfterId: string) {
    return this.authService.authenticatedUserId$.pipe(
      switchMap((uid) => {
        let queryConstraint: QueryConstraint[] = [orderBy('occurred', 'desc'), limit(pageSize)];

        if (startAfterId) {
          return this.firestoreService.getRaw(`users/${uid}/seizures/${startAfterId}`).pipe(
            switchMap((startAfterDoc) => {
              queryConstraint.push(startAfter(startAfterDoc));
              return this.firestoreService.list<Seizure>(
                `users/${uid}/seizures`,
                ...queryConstraint
              );
            })
          );
        } else {
          return this.firestoreService.list<Seizure>(
            `users/${uid}/seizures`,
            ...queryConstraint
          );
        }
      }),
      map((data) => this.convertDurations(data))
    );
  }

  private convertDurations(data: Seizure[]) {
    return data.map((seizure) => this.convertDuration(seizure));
  }

  private convertDuration(data: Seizure) {
    return {
      ...data,
      duration: moment.duration(data.duration, 'minutes'),
    };
  }
}
