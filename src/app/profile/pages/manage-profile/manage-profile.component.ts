import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { finalize, Observable, Subscription, switchMap } from 'rxjs';
import { UserData } from 'src/app/auth/models/user-details.model';
import { AuthService } from './../../../shared/services/auth.service';
import { UserDetailsService } from './../../../shared/services/user-details.service';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.scss'],
  standalone: false
})
export class ManageProfileComponent implements OnInit, OnDestroy {
  userDetails$: Observable<UserData>;
  submitting = false;
  error?: string;
  private submitSubscription?: Subscription;
  private auth: AuthService = inject(AuthService);
  private userDetails: UserDetailsService = inject(UserDetailsService);

  constructor() {
    this.userDetails$ = this.auth.userDetails$();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.submitSubscription?.unsubscribe();
  }

  onChange(event: MatSlideToggleChange): void {
    this.submitting = true;
    this.submitSubscription = this.auth
      .userIdProvider$()
      .pipe(
        switchMap((userId) => this.userDetails.setIsFemale(userId, event.checked)),
        finalize(() => (this.submitting = false))
      )
      .subscribe({
        next: () => {},
        error: (error) => (this.error = error.message)
      });
  }
}
