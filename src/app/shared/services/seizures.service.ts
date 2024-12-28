import { Injectable } from '@angular/core';
import moment from 'moment';
import { Seizure, SeizureInternal } from './../models/seizure.model';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class SeizuresService extends CrudService<SeizureInternal, Seizure> {
  constructor() {
    super('seizures', 'occurred');
  }

  override convertFromInternal(data: SeizureInternal): Seizure {
    return {
      objectType: 'SEIZURE',
      ...data,
      duration: moment.duration(data.duration, 'minutes')
    };
  }

  override convertToInternal(data: Partial<Seizure>): Partial<SeizureInternal> {
    const { objectType, duration, ...internalSeizure } = data;
    return {
      ...internalSeizure,
      duration: data.duration?.minutes()
    };
  }
}
