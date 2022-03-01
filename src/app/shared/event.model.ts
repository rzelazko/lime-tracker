import { Moment } from 'moment';

export interface Event {
  id: number;
  name: string;
  occurred: Moment;
}

export const isEvent = (variable: any): variable is Event =>
  (variable as Event).name !== undefined && (variable as Event).occurred !== undefined;
