import { Moment } from "moment";
import { Identifiable } from "./identifiable.model";

export interface Medication extends Identifiable {
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

export const isMedication = (variable: any): variable is Medication =>
  (variable as Medication).doses !== undefined;
