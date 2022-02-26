import { Moment } from "moment";

export interface Event {
  id: number;
  name: string;
  occurred: Moment;
}
