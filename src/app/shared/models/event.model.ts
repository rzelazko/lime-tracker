import { Moment } from 'moment';
import { Identifiable } from './identifiable.model';

export interface EventInternal extends Identifiable { // used to repersent events in DB (only)
  name: string;
  occurred: Moment;
}

export interface Event extends EventInternal {
  readonly objectType: 'EVENT';
}
