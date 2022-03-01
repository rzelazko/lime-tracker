import { Duration, Moment } from "moment";

export interface Seizure {
  id?: number,
  occurred: Moment;
  duration: Duration;
  type: string;
  trigger?: string;
}
