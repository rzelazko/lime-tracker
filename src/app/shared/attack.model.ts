import { Duration, Moment } from "moment";

export interface Attack {
  occurred: Moment;
  type: string;
  duration: Duration;
}
