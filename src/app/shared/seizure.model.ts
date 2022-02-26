import { Duration, Moment } from "moment";

export interface Seizure {
  id: number,
  occurred: Moment;
  type: string;
  duration: Duration;
}
