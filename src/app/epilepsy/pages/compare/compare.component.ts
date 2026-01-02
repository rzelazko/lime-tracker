import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formFieldHasError } from '../../../shared/services/form-field-has-error';
import { Router } from '@angular/router';

export const COMPARE_AMOUNT_MIN = 1;
export const COMPARE_AMOUNT_MAX = 5;

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss',
  standalone: false,
})
export class CompareComponent implements OnInit {
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  form!: FormGroup;
  readonly COMPARE_AMOUNT_MIN = COMPARE_AMOUNT_MIN;
  readonly COMPARE_AMOUNT_MAX = COMPARE_AMOUNT_MAX;

  constructor() {}

  ngOnInit(): void {
    this.form = this.fb.group({
      by: ['month', Validators.required],
      amount: [
        3,
        [Validators.required, Validators.min(COMPARE_AMOUNT_MIN), Validators.max(COMPARE_AMOUNT_MAX)],
      ],
    });
  }

  onSubmit() {
    const url = $localize`:@@routerLink-epilepsy-compare-by-amount:/epilepsy/compare/:by/:amount`
      .replace(':by', this.form.value.by)
      .replace(':amount', this.form.value.amount);
    this.router.navigate([url]);
  }

  hasError(path: string, errorCode: string) {
    return formFieldHasError(this.form, path, errorCode);
  }
}
