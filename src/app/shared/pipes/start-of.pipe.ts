import { Pipe, PipeTransform } from '@angular/core';
import { Moment } from 'moment';

@Pipe({
    name: 'startOf',
    standalone: false
})
export class StartOfPipe implements PipeTransform {
  transform(date: Moment): Moment {
    return date.startOf('month');
  }
}
