import { Moment } from "moment";

export interface Medicament {
  name: string;
  doses: {
    morning: number;
    noon: number;
    evening: number;
  },
  startDate: Moment
}
