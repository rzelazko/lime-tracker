import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formFieldHasError } from '../../../shared/services/form-field-has-error';
import { Router } from '@angular/router';

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

  constructor() {}

  ngOnInit(): void {
    this.form = this.fb.group({
      by: ['month', Validators.required],
      amount: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
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
