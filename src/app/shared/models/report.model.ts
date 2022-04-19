import { Moment } from 'moment';
import { Event } from '../../shared/models/event.model';
import { Medication } from './medication.model';
import { Seizure } from '../../shared/models/seizure.model';

export interface Report {
  dateFrom: Moment;
  dateTo: Moment;
  monthsData: MonthsData[];
}

export interface MonthsData {
  month: Moment;
  data: ReportCase[];
}

export interface ReportCase {
  event?: Event;
  medication?: Medication;
  seizure?: Seizure;
}

export function reportCaseDate(reportCase: ReportCase): Moment {
  let result;
  if (reportCase.event) {
    result = reportCase.event.occurred;
  } else if (reportCase.medication) {
    result = reportCase.medication.startDate;
  } else if (reportCase.seizure) {
    result = reportCase.seizure.occurred;
  } else {
    // should be impossible - we have only 3 types of cases
    throw `Object type unsupported: ${JSON.stringify(reportCase)}`;
  }

  return result;
}
