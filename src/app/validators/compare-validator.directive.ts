import { Directive, forwardRef, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  NgModel,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
import { Subscription, take } from 'rxjs';

@Directive({
  selector: '[compareValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CompareValidatorDirective),
      multi: true,
    },
  ],
})
export class CompareValidatorDirective implements Validator {
  @Input('compareValidator') compareToInput: NgModel | null = null;

  validate(control: AbstractControl): ValidationErrors | null {
      return CompareValidator(this.compareToInput)(control);
  }

}

export const CompareValidator =
  (compareToInput: NgModel | null): ValidatorFn =>
  (formControl: AbstractControl) => {
    let result: ValidationErrors | null = null;
    if (compareToInput) {
      const currentInput = formControl;

      if (currentInput.value !== null) {
        const subscription: Subscription = compareToInput.control.valueChanges
          .pipe(take(1))
          .subscribe(() => {
            currentInput.updateValueAndValidity();
          });
      }
      result =
        compareToInput.control.value !== currentInput.value
          ? { passwordMatchError: true }
          : null;
    }
    return result;
  };
