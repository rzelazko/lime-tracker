import { Duration, Moment } from "moment";
import { Identifiable } from "./identifiable.model";

export interface Seizure extends Identifiable {
  occurred: Moment;
  duration: Duration;
  type: string;
  triggers?: string[];
}

export interface SeizureInternal extends Identifiable { // used to repersent seizure in DB (only)
  occurred: Moment;
  duration: number;
  type: string;
  triggers?: string[];
}

export const isSeizure = (variable: any): variable is Seizure =>
  (variable as Seizure).duration !== undefined;
