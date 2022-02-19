import { Duration, Moment } from "moment";

export interface Attack {
  occured: Moment;
  type: string;
  duration: Duration;
}
