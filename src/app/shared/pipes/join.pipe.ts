import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'join',
    standalone: false
})
export class JoinPipe implements PipeTransform {
  transform(input?: Array<any> | string, sep = ', '): string {
    let result;
    if (Array.isArray(input)) {
      result = input.join(sep);
    } else if (input) {
      result = input;
    } else {
      result = '';
    }
    return result;
  }
}
