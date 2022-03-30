import { Moment } from 'moment';
import { Identifiable } from './identifiable.model';

export interface Event extends Identifiable {
  name: string;
  occurred: Moment;
}

export const isEvent = (variable: any): variable is Event =>
  (variable as Event).name !== undefined && (variable as Event).occurred !== undefined;
