import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterData } from '../../models/register-data.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(data: RegisterData) {
    this.authService
      .register(data)
      .then(() => this.router.navigate(['auth', 'register', 'confirm']))
      .catch((error) => {
        console.log(error);
        // TODO handle error
      });
  }
}
