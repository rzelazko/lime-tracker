import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { formFieldHasError } from 'src/app/shared/services/form-field-has-error';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error?: string;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
  });

  @ViewChild('formDirective') private formDirective?: NgForm;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.isLoading = true;
    this.auth
      .login(this.loginForm.value)
      .then(() => this.router.navigate(['epilepsy']))
      .catch((error) => this.handleError(error))
      .finally(() => (this.isLoading = false));
  }

  hasError(path: string, errorCode: string) {
    return formFieldHasError(this.loginForm, path, errorCode);
  }

  private handleError(error: Error): void {
    this.error = error.message;
    const formData = {
      ...this.loginForm.value,
      password: '',
    };
    this.formDirective?.resetForm();
    this.loginForm.patchValue(formData);
  }
}
