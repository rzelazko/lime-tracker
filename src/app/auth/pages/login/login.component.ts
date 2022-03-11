import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from '../../models/login-data.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(data: LoginData) {
    this.authService
      .login(data)
      .then(() => this.router.navigate(['epilepsy']))
      .catch((error) => {
        console.log(error);
        // TODO handle error
      });
  }
}
