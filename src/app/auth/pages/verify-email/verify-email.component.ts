import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { interval, map, Observable } from 'rxjs';
import { UserData } from '../../models/user-details.model';
import { AuthService } from './../../../shared/services/auth.service';
import { UserDetailsService } from './../../../shared/services/user-details.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  oneHourAgo$: Observable<Moment>;
  userDetails$: Observable<UserData>;

  constructor(private auth: AuthService, private userDetails: UserDetailsService) {
    this.oneHourAgo$ = interval(1000).pipe(map(() => moment().subtract(1, 'hour')));
    this.userDetails$ = userDetails.get(auth.user());
  }

  ngOnInit(): void {}

  async onEmailSend() {
    await this.auth.sendVerificationEmail();
  }
}
