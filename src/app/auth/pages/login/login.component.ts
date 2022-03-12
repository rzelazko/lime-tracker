import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
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
    return this.loginForm.get(path)?.hasError(errorCode);
  }

  private handleError(error: Error): void {
    if (error instanceof FirebaseError) {
      this.error = (error as FirebaseError).code;
    } else {
      this.error = error.message;
    }
  }
}
