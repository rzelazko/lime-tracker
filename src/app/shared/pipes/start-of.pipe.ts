import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

@Pipe({
  name: 'startOf',
})
export class StartOfPipe implements PipeTransform {
  transform(year: number, month?: number): Moment {
    let date = moment().year(year);
    if (month || month === 0) {
      date.month(month);
    }
    return date.startOf(month || month === 0 ? 'month' : 'year');
  }
}
