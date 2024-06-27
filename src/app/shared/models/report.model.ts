import moment from 'moment';
import { Moment } from 'moment';
import { Event } from './event.model';
import { Medication } from './medication.model';
import { Period } from './period.model';
import { Seizure } from './seizure.model';

export interface Report {
  dateFrom: Moment;
  dateTo: Moment;
  monthsData: MonthsData[];
}

export interface MonthsData {
  month: Moment;
  data: ReportRecord[];
}

export interface MedicationReport extends Medication {
  useStartDate: boolean;
}

export interface PeriodReport extends Period {
  useStartDate: boolean;
}

export declare type ReportRecord = MedicationReport | Seizure | Event | PeriodReport;

export function reportCaseDate(reportCase: ReportRecord): Moment {
  const DATE_MAX_VALUE = moment(8640000000000000);
  let result;
  if (reportCase.objectType === 'EVENT') {
    result = reportCase.occurred;
  } else if (reportCase.objectType === 'MEDICATION') {
    if (reportCase.useStartDate) {
      result = reportCase.startDate;
    } else {
      result = reportCase.endDate || DATE_MAX_VALUE;
    }
  } else if (reportCase.objectType === 'SEIZURE') {
    result = reportCase.occurred;
  } else if (reportCase.objectType === 'PERIOD') {
    if (reportCase.useStartDate) {
      result = reportCase.startDate;
    } else {
      result = reportCase.endDate || DATE_MAX_VALUE;
    }
  } else {
    // should be impossible - we should have all cases above
    throw new Error(`Object type unsupported: ${JSON.stringify(reportCase)}`);
  }

  return result;
}
