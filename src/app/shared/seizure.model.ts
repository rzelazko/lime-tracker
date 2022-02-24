import { Duration, Moment } from "moment";

export interface Seizure {
  occurred: Moment;
  type: string;
  duration: Duration;
}
