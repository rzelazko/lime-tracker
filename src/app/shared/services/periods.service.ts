import { Injectable } from '@angular/core';
import { Period, PeriodInternal } from '../models/period.model';
import { AuthService } from './auth.service';
import { CrudService } from './crud.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class PeriodsService extends CrudService<PeriodInternal, Period> {
  constructor(authService: AuthService, firestoreService: FirestoreService) {
    super('periods', 'startDate', authService, firestoreService);
  }

  override convertFromInternal(data: PeriodInternal): Period {
    return {
      objectType: 'PERIOD',
      ...data,
    };
  }

  override convertToInternal(data: Partial<Period>): Partial<PeriodInternal> {
    const { objectType, ...internalPeriod } = data;
    return {
      ...internalPeriod,
    };
  }
}
