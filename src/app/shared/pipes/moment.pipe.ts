import { Moment } from 'moment';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: Moment, timeFormat: string): string {
      return value.format(timeFormat);
  }

}
