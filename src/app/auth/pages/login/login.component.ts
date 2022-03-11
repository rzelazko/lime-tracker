import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from '../../models/login-data.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {  constructor() {}

  ngOnInit(): void {}
}
