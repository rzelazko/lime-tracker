import { Moment } from "moment";
import { Identifiable } from "./identifiable.model";

export interface MedicationInternal extends Identifiable { // used to repersent medication in DB (only)
  name: string;
  doses: {
    morning: number;
    noon: number;
    evening: number;
  },
  startDate: Moment,
  archived: boolean,
  endDate?: Moment
}

export interface Medication extends MedicationInternal {
  readonly objectType: 'MEDICATION';
}

