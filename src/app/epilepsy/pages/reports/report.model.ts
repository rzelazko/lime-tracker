import { Moment } from 'moment';
import { Event } from 'src/app/shared/models/event.model';
import { Medicament } from 'src/app/shared/models/medicament.model';
import { Seizure } from 'src/app/shared/models/seizure.model';

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
