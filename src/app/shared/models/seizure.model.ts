import { Duration, Moment } from "moment";

export interface Seizure {
  id?: number,
  occurred: Moment;
  duration: Duration;
  type: string;
  trigger?: string;
}

export const isSeizure = (variable: any): variable is Seizure =>
  (variable as Seizure).duration !== undefined;
