import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment as any);

export abstract class ChartService {
  dateTo: moment.Moment;
  dateFrom: moment.Moment;

  constructor() {
    this.dateTo = moment().endOf('day');
    this.dateFrom = this.oneYearBefore(this.dateTo);
  }

  setYear(year?: number) {
    const momentTo = moment();
    if (year) {
      momentTo.year(year).endOf('year');
    }
    this.dateTo = momentTo.endOf('day');
    this.dateFrom = this.oneYearBefore(this.dateTo);
  }

  subtitle(): string {
    let subtitle;
    if (this.dateFrom.year() === this.dateTo.year()) {
      subtitle = $localize`:@@chart-subtitle-year:Year ${this.dateTo.year()}`;
    } else {
      subtitle = `${this.dateFrom.format('LL')} - ${this.dateTo.format('LL')}`;
    }
    return subtitle;
  }

  oneYearBefore(date: moment.Moment) {
    return moment(date).add('1', 'day').subtract(1, 'year');
  }
}
