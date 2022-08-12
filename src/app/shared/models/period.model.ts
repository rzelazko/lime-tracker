import { Moment } from "moment";
import { Identifiable } from "./identifiable.model";

export interface PeriodInternal extends Identifiable { // used to repersent period in DB (only)
  startDate: Moment,
  endDate?: Moment
}

export interface Period extends PeriodInternal {
  readonly objectType: 'PERIOD';
}

