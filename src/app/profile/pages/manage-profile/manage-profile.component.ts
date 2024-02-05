import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { finalize, Observable, Subscription } from 'rxjs';
import { UserData } from 'src/app/auth/models/user-details.model';
import { AuthService } from './../../../shared/services/auth.service';
import { UserDetailsService } from './../../../shared/services/user-details.service';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.scss'],
})
export class ManageProfileComponent implements OnInit, OnDestroy {
  userDetails$: Observable<UserData>;
  submitting = false;
  error?: string;
  private submitSubscription?: Subscription;

  constructor(private auth: AuthService, private userDetails: UserDetailsService) {
    this.userDetails$ = userDetails.get(auth.user());
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.submitSubscription?.unsubscribe();
  }

  onChange(event: MatSlideToggleChange): void {
    this.submitting = true;
    this.submitSubscription = this.userDetails
      .setIsFemale(this.auth.user().uid, event.checked)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: () => {},
        error: (error) => (this.error = error.message),
      });
  }
}
