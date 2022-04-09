import { FormControl } from '@angular/forms';
import * as moment from 'moment';

export class DatesValidator {
  static inThePast = () => {
    return (control: FormControl) => {
      if (control.value) {
        const controlValue = moment(control.value);

        if (!controlValue.isValid()) {
          return { invalid: true };
        }

        if (controlValue.isAfter(moment())) {
          return { future: true };
        }
      }
      return null;
    };
  };
}
