import { AbstractControl, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export class DatesValidator {
  static inThePast = () => {
    return (control: AbstractControl): ValidationErrors | null => {
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

  static startAndEnd(startControlName: string, endControlName: string) {
    return (formGroup: UntypedFormGroup): ValidationErrors | null => {
      const startDateField = formGroup.controls[startControlName];
      const endDateField = formGroup.controls[endControlName];

      if (startDateField && startDateField.value && endDateField && endDateField.value && !startDateField.errors && (!endDateField.errors || endDateField.errors['isBefore'])) {
        const startDate = moment(startDateField.value);
        const endDate = moment(endDateField.value);

        if (startDate.isValid() && endDate.isValid()) {
          if (endDate.isBefore(startDate)) {
            endDateField.setErrors({isBefore: true});
          } else {
            endDateField.setErrors(null);
          }
        }
      }

      return null;
    };
  }

  static isDate = () => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        const controlValue = moment(control.value, true);

        if (!controlValue.isValid()) {
          return { invalid: true };
        }
      }
      return null;
    };
  };
}
