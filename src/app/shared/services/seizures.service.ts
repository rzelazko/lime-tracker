import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs';
import { PageData } from '../models/page-data.model';
import { Seizure } from '../models/seizure.model';
import { AuthService } from './auth.service';
import { CrudService } from './crud.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class SeizuresService  extends CrudService<Seizure> {
  constructor(authService: AuthService, firestoreService: FirestoreService) {
    super('seizures', 'occurred', authService, firestoreService);
  }

  override create(seizure: Partial<Seizure>) {
    return super.create(seizure);
  }

  override read(id: string) {
    return super.read(id).pipe(map((data) => this.convertDuration(data)));
  }

  override update(id: string, seizure: Partial<Seizure>) {
    return super.update(id, seizure);
  }

  override delete(id: string) {
    return super.delete(id).pipe(
      map(
        (pageData): PageData<Seizure> => ({
          hasMore: pageData.hasMore,
          data: this.convertDurations(pageData.data),
        })
      )
    );
  }

  override listConcatenated(pageSize: number) {
    return super.listConcatenated(pageSize).pipe(
      map(
        (pageData): PageData<Seizure> => ({
          hasMore: pageData.hasMore,
          data: this.convertDurations(pageData.data),
        })
      )
    );
  }

  convertDurations(data: Seizure[]) {
    return data.map((seizure) => this.convertDuration(seizure));
  }

  private convertDuration(data: Seizure) {
    return {
      ...data,
      duration: moment.duration(data.duration, 'minutes'),
    };
  }
}
