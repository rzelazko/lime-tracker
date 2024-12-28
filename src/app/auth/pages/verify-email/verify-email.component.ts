import { Component, inject, OnInit } from '@angular/core';
import moment, { Moment } from 'moment';
import { interval, map, Observable } from 'rxjs';
import { UserData } from '../../models/user-details.model';
import { AuthService } from './../../../shared/services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  standalone: false
})
export class VerifyEmailComponent implements OnInit {
  oneHourAgo$: Observable<Moment>;
  userDetails$: Observable<UserData>;
  private auth: AuthService = inject(AuthService);

  constructor() {
    this.oneHourAgo$ = interval(1000).pipe(map(() => moment().subtract(1, 'hour')));
    this.userDetails$ = this.auth.userDetails$();
  }

  ngOnInit(): void {}

  async onEmailSend() {
    await this.auth.sendVerificationEmail();
  }
}
