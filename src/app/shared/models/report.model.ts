import { Moment } from 'moment';
import { Event } from 'src/app/shared/models/event.model';
import { Medicament } from 'src/app/shared/models/medicament.model';
import { Seizure } from 'src/app/shared/models/seizure.model';

export interface Report {
  dateStart: Moment;
  dateEnd: Moment;
  monthsData: MonthsData[];
}

export interface MonthsData {
  month: Moment;
  data: ReportCase[];
}

export interface ReportCase {
  event?: Event;
  medicament?: Medicament;
  seizure?: Seizure;
}

export function reportCaseDate(reportCase: ReportCase): Moment {
  let result;
  if (reportCase.event) {
    result = reportCase.event.occurred;
  } else if (reportCase.medicament) {
    result = reportCase.medicament.startDate;
  } else if (reportCase.seizure) {
    result = reportCase.seizure.occurred;
  } else {
    throw `Object type unsupported: ${JSON.stringify(reportCase)}`;
  }

  return result;
}
