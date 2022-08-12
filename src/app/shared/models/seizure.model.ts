import { Duration, Moment } from "moment";
import { Identifiable } from "./identifiable.model";

export interface SeizureInternal extends Identifiable { // used to repersent seizure in DB (only)
  occurred: Moment;
  duration: number;
  type: string;
  triggers?: string[];
}

export interface Seizure extends Identifiable {
  readonly objectType: 'SEIZURE';
  occurred: Moment;
  duration: Duration;
  type: string;
  triggers?: string[];
}
