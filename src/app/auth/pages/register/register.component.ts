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
   constructor() {}

  ngOnInit(): void {}
}
