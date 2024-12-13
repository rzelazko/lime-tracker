import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { Moment, Duration, unitOfTime } from 'moment';

type DiffUnits = (
  "InDays"
);

@Pipe({
    name: 'timeSince',
    standalone: false
})
export class TimeSincePipe implements PipeTransform {

  transform(date: Moment, unit?: DiffUnits): Duration {
    let result;
    if (unit === "InDays") {
      var given = date.startOf('day');
      var current = moment().startOf('day');
      result = moment.duration(moment.duration(given.diff(current)).asDays(), 'days');
    } else {
      result = moment.duration(date.diff(moment()));
    }

    return result;
  }
}
