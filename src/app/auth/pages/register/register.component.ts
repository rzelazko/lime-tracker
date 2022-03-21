import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { CompareValidator } from 'src/app/shared/validators/compare-validator';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
    },
    {
      validator: CompareValidator.mustMatch('password', 'confirmPassword'),
    }
  );

  @ViewChild('formDirective') private formDirective?: NgForm;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.isLoading = true;
    this.auth
      .register(this.registerForm.value)
      .then(() => this.router.navigate(['register', 'confirm']))
      .catch((error) => this.handleError(error))
      .finally(() => (this.isLoading = false));
  }

  hasError(path: string, errorCode: string) {
    return this.registerForm.get(path)?.hasError(errorCode);
  }

  private handleError(error: Error): void {
    if (error instanceof FirebaseError) { // TODO move this Firebase logic to service
      this.error = (error as FirebaseError).code;
    } else {
      this.error = error.message;
    }
    const formData = {
      ...this.registerForm.value,
      password: '',
      confirmPassword: '',
    };
    this.formDirective?.resetForm();
    this.registerForm.patchValue(formData);
  }
}
