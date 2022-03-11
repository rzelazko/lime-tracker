import { Moment } from "moment";

export interface Medicament {
  id: number,
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
