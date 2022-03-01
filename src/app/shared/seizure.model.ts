import { Duration, Moment } from "moment";

export interface Seizure {
  id: number,
  occurred: Moment;
  type: string;
  trigger?: string;
  duration: Duration;
}
