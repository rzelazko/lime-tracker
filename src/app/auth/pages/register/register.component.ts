import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../../shared/services/auth.service';
import { formFieldHasError } from './../../../shared/services/form-field-has-error';
import { CompareValidator } from './../../../shared/validators/compare-validator';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: false
})
export class RegisterComponent implements OnInit {
  isLoading = false;
  error?: string;
  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required]],
      isFemale: [false, []],
    },
    {
      validator: CompareValidator.mustMatch('password', 'confirmPassword'),
    }
  );

  @ViewChild('formDirective') private formDirective?: NgForm;

  constructor(private fb: UntypedFormBuilder, private router: Router, private auth: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.isLoading = true;
    this.auth
      .register(this.registerForm.value)
      .then(() => this.router.navigate([$localize`:@@routerLink-register-confirm:/register/confirm`]))
      .catch((error) => this.handleError(error))
      .finally(() => (this.isLoading = false));
  }

  hasError(path: string, errorCode: string) {
    return formFieldHasError(this.registerForm, path, errorCode);
  }

  private handleError(error: Error): void {
    this.error = error.message;
    const formData = {
      ...this.registerForm.value,
      password: '',
      confirmPassword: '',
    };
    this.formDirective?.resetForm();
    this.registerForm.patchValue(formData);
  }
}
