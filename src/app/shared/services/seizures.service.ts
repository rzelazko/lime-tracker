import { duration } from 'moment';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { Seizure } from '../models/seizure.model';
import { FirestoreService } from './firestore.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class SeizuresService {
  constructor(private firestoreService: FirestoreService) {}

  create(seizure: Partial<Seizure>) {
    return this.firestoreService.add('seizures', seizure);
  }

  list() {
    return this.firestoreService
      .list<Seizure>('seizures')
      .pipe(map((data) => this.convertDurations(data)));
  }

  get(id: string) {
    return this.firestoreService
      .get<Seizure>(`seizures/${id}`)
      .pipe(map((data) => this.convertDuration(data)));
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
