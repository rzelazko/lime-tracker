import { Attribute, Directive, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[compareValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useClass: CompareValidatorDirective,
      multi: true,
    },
  ],
})
export class CompareValidatorDirective implements Validator {
  constructor(
    @Attribute('compareValidator') public compareToControl: string
  ) {}

  validate(formControl: FormControl) {
    const compareToInput = formControl.root.get(this.compareToControl);
    const currentInput = formControl;

    if (currentInput.value === null) {
      return null;
    }

    if (compareToInput) {
      const subscription: Subscription = compareToInput.valueChanges.subscribe(() => {
        currentInput.updateValueAndValidity();
        subscription.unsubscribe();
      });
    }
    return compareToInput && compareToInput.value !== currentInput.value
      ? { passwordMatchError: true }
      : null;
  }
}
