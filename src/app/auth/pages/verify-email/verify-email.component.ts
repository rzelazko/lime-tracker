import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { interval, map, Observable } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  public oneHourAgo$: Observable<Moment>;

  constructor(public auth: AuthService) {
    this.oneHourAgo$ = interval(1000).pipe(map(() => moment().subtract(1, 'hour')));
  }

  ngOnInit(): void {}

  onEmailSend() {
    this.auth.sendVerificationEmail();
  }
}
