import { Moment } from 'moment';
import { Event } from '../../shared/models/event.model';
import { Medication } from './medication.model';
import { Seizure } from '../../shared/models/seizure.model';
import { TrackingCore } from './tracking-core.model';

export interface Report {
  dateFrom: Moment;
  dateTo: Moment;
  monthsData: MonthsData[];
}

export interface MonthsData {
  month: Moment;
  data: TrackingCore[];
}

export function reportCaseDate(reportCase: TrackingCore): Moment {
  let result;
  if (reportCase.objectType === 'EVENT') {
    result = reportCase.occurred;
  } else if (reportCase.objectType === 'MEDICATION') {
    result = reportCase.startDate;
  } else if (reportCase.objectType === 'SEIZURE') {
    result = reportCase.occurred;
  } else if (reportCase.objectType === 'PERIOD') {
    result = reportCase.startDate;
  } else {
    // should be impossible - we should have all cases above
    throw new Error(`Object type unsupported: ${JSON.stringify(reportCase)}`);
  }

  return result;
}
