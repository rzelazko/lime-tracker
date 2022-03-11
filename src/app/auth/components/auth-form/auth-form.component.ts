import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginData } from '../../models/login-data.model';
import { RegisterData } from '../../models/register-data.model';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
  @Input() signUpMode: boolean = false;
  @Input() imageUrl?: string;
  @Output() onRegister = new EventEmitter<RegisterData>();
  @Output() onLogin = new EventEmitter<LoginData>();

  constructor() {}

  ngOnInit(): void {}

  onSubmit(form: NgForm): void {
    if (this.signUpMode) {
      this.onRegister.next({
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
      });
    } else {
      this.onLogin.next({
        email: form.value.email,
        password: form.value.password,
      });
    }
  }
}
