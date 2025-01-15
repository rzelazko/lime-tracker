import { Pipe, PipeTransform } from '@angular/core';
import { Moment } from 'moment';

@Pipe({
    name: 'endOf',
    standalone: false
})
export class EndOfPipe implements PipeTransform {
  transform(date: Moment): Moment {
    return date.endOf('month');
  }
}
