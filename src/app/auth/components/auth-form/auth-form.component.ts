import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthData } from '../../models/auth-data.model';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
  @Input() public signUpMode: boolean = false;
  @Input() public imageUrl?: string;
  public isLoading = false;
  public error?: string;
  public authData: AuthData = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  };

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.isLoading = true;
    if (this.signUpMode) {
      this.authService
        .register(this.authData)
        .then(() => this.router.navigate(['auth', 'register', 'confirm']))
        .catch((error) => this.handleError(error))
        .finally(() => (this.isLoading = false));
    } else {
      this.authService
        .login(this.authData)
        .then(() => this.router.navigate(['epilepsy']))
        .catch((error) => this.handleError(error))
        .finally(() => (this.isLoading = false));
    }
  }

  private handleError(error: Error) {
    if (error instanceof FirebaseError) {
      this.error = (error as FirebaseError).code;
    } else {
      this.error = error.message;
    }
  }
}
