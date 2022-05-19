import { Injectable } from '@angular/core';
import { QueryConstraint } from 'firebase/firestore';
import * as moment from 'moment';
import { map } from 'rxjs';
import { PageData } from '../models/page-data.model';
import { Seizure, SeizureInternal } from '../models/seizure.model';
import { AuthService } from './auth.service';
import { CrudService } from './crud.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class SeizuresService {
  private crudService: CrudService<SeizureInternal>;
  constructor(authService: AuthService, firestoreService: FirestoreService) {
    this.crudService = new CrudService('seizures', 'occurred', authService, firestoreService);
  }

  create(seizure: Partial<Seizure>) {
    return this.crudService.create(this.convertToInternal(seizure));
  }

  read(id: string) {
    return this.crudService.read(id).pipe(map((data) => this.convertFromInternal(data)));
  }

  update(id: string, seizure: Partial<Seizure>) {
    return this.crudService.update(id, this.convertToInternal(seizure));
  }

  delete(id: string) {
    return this.crudService.delete(id);
  }

  listCollection(queryConstraint: QueryConstraint[]) {
    return this.crudService.listCollection(queryConstraint).pipe(map((data) => this.convertAllFromInternal(data)));
  }

  listConcatenated(pageSize: number) {
    return this.crudService.listConcatenated(pageSize).pipe(
      map(
        (pageData): PageData<Seizure> => ({
          hasMore: pageData.hasMore,
          data: this.convertAllFromInternal(pageData.data),
        })
      )
    );
  }

  resetConcatenated() {
    this.crudService.resetConcatenated();
  }

  private convertAllFromInternal(data: SeizureInternal[]): Seizure[] {
    return data.map((seizure) => this.convertFromInternal(seizure));
  }

  private convertFromInternal(data: SeizureInternal): Seizure {
    return {
      ...data,
      duration: moment.duration(data.duration, 'minutes'),
    };
  }

  private convertToInternal(data: Partial<Seizure>): Partial<SeizureInternal> {
    return {
      ...data,
      duration: data.duration?.minutes(),
    };
  }
}
