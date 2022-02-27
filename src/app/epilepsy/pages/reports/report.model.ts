import { Moment } from 'moment';
import { Seizure } from 'src/app/shared/seizure.model';
import { Event } from 'src/app/shared/event.model';
import { Medicament } from 'src/app/shared/medicament.model';

export interface Report {
  dateStart: Moment;
  dateEnd: Moment;
  subReports: SubReport[];
};

export interface SubReport {
  dateStart: Moment;
  dateEnd: Moment;
  cases: ReportCase[];
};

export interface ReportCase {
  event?: Event;
  medicament?: Medicament;
  seizure?: Seizure;
};
