import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
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
      mergeMap((uid) => this.firestoreService.add(`users/${uid}/seizures`, seizure))
    );
  }

  read(id: string) {
    return this.authService.authenticatedUserId$.pipe(
      mergeMap((uid) =>
        this.firestoreService
          .get<Seizure>(`users/${uid}/seizures/${id}`)
          .pipe(map((data) => this.convertDuration(data)))
      )
    );
  }

  update(id: string, seizure: Partial<Seizure>) {
    return this.authService.authenticatedUserId$.pipe(
      mergeMap((uid) => this.firestoreService.set(`users/${uid}/seizures/${id}`, seizure))
    );
  }

  delete(id: string) {
    return this.authService.authenticatedUserId$.pipe(
      mergeMap((uid) => this.firestoreService.delete(`users/${uid}/seizures/${id}`))
    );
  }

  list() {
    return this.authService.authenticatedUserId$.pipe(
      mergeMap((uid) =>
        this.firestoreService
          .list<Seizure>(`users/${uid}/seizures`)
          .pipe(map((data) => this.convertDurations(data)))
      )
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
