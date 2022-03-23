import { Duration, Moment } from "moment";

export interface Seizure {
  id: string,
  occurred: Moment;
  duration: Duration;
  type: string;
  trigger?: string;
}

export const isSeizure = (variable: any): variable is Seizure =>
  (variable as Seizure).duration !== undefined;
