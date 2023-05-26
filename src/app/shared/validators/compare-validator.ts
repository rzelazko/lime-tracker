import { UntypedFormGroup, ValidationErrors } from '@angular/forms';

export class CompareValidator {
  static mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: UntypedFormGroup): ValidationErrors | null => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (!matchingControl.errors || matchingControl.errors['mustMatch']) {
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
        } else {
          matchingControl.setErrors(null);
        }
      }
      return null;
    };
  }
}
