import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

@Pipe({
  name: 'endOf'
})
export class EndOfPipe implements PipeTransform {
  transform(year: number, month?: number): Moment {
    let date = moment().year(year);
    if (month) {
      date.month(month);
    }
    return date.endOf(month ? 'month' : 'year');
  }
}
