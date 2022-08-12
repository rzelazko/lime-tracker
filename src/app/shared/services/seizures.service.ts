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
export class SeizuresService extends CrudService<SeizureInternal, Seizure> {
  constructor(authService: AuthService, firestoreService: FirestoreService) {
    super('seizures', 'occurred', authService, firestoreService);
  }

  override convertFromInternal(data: SeizureInternal): Seizure {
    return {
      objectType: 'SEIZURE',
      ...data,
      duration: moment.duration(data.duration, 'minutes'),
    };
  }

  override convertToInternal(data: Partial<Seizure>): Partial<SeizureInternal> {
    const {objectType, duration, ...internalSeizure} = data;
    return {
      ...internalSeizure,
      duration: data.duration?.minutes(),
    };
  }
}
