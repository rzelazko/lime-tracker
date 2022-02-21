import { Duration } from 'moment';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanize'
})
export class HumanizePipe implements PipeTransform {

  transform(value: Duration): string {
    return value.humanize();
  }

}
