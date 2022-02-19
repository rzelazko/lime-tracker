import { Moment } from 'moment';
import { Attack } from 'src/app/shared/attack.model';
import { Event } from 'src/app/shared/event.model';
import { Medicament } from 'src/app/shared/medicament.model';

export interface Report {
  dateStart: Moment;
  dateEnd: Moment;
  subReports: {
    dateStart: Moment;
    dateEnd: Moment;
    cases: { event?: Event; medicament?: Medicament; attack?: Attack }[];
  }[];
}
