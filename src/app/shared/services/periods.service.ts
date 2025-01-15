import { Injectable } from '@angular/core';
import { Period, PeriodInternal } from './../models/period.model';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodsService extends CrudService<PeriodInternal, Period> {
  constructor() {
    super('periods', 'startDate');
  }

  override convertFromInternal(data: PeriodInternal): Period {
    return {
      objectType: 'PERIOD',
      ...data
    };
  }

  override convertToInternal(data: Partial<Period>): Partial<PeriodInternal> {
    const { objectType, ...internalPeriod } = data;
    return {
      ...internalPeriod
    };
  }
}
