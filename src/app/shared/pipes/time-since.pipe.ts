import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Moment, Duration } from 'moment';

@Pipe({
  name: 'timeSince'
})
export class TimeSincePipe implements PipeTransform {

  transform(date: Moment): Duration {
    return moment.duration(date.diff(moment()));
  }

}
