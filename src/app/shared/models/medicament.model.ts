import { Moment } from "moment";
import { Identifiable } from "./identifiable.model";

export interface Medicament extends Identifiable {
  name: string;
  doses: {
    morning: number;
    noon: number;
    evening: number;
  },
  startDate: Moment
}

export const isMedicament = (variable: any): variable is Medicament =>
  (variable as Medicament).doses !== undefined;
