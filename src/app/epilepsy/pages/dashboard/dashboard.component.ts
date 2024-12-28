import { Component, inject, OnInit } from '@angular/core';
import { Duration } from 'moment';
import { catchError, Observable, throwError } from 'rxjs';
import { UserData } from './../../../auth/models/user-details.model';
import { Event } from './../../../shared/models/event.model';
import { Medication } from './../../../shared/models/medication.model';
import { Period } from './../../../shared/models/period.model';
import { Seizure } from './../../../shared/models/seizure.model';
import { AuthService } from './../../../shared/services/auth.service';
import { DashboardService } from './../../../shared/services/dashboard.service';
import { UserDetailsService } from './../../../shared/services/user-details.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  userDetails$: Observable<UserData>;
  medications$: Observable<Medication[]>;
  lastSeizures$: Observable<Seizure[]>;
  lastEvents$: Observable<Event[]>;
  lastPeriods$: Observable<Period[]>;
  timeSinceLastSeizure?: Duration;
  seizureError?: string;
  medicationsError?: string;
  eventsError?: string;
  periodsError?: string;
  private auth: AuthService = inject(AuthService);
  private dashboardService: DashboardService = inject(DashboardService);

  constructor() {
    this.userDetails$ = this.auth.userDetails$();

    this.medications$ = this.dashboardService.currentMedications().pipe(
      catchError((error) => {
        this.seizureError = error;
        return throwError(() => error);
      })
    );

    this.lastSeizures$ = this.dashboardService.lastSeizures().pipe(
      catchError((error) => {
        this.medicationsError = error;
        return throwError(() => error);
      })
    );

    this.lastEvents$ = this.dashboardService.lastEvents().pipe(
      catchError((error) => {
        this.eventsError = error;
        return throwError(() => error);
      })
    );

    this.lastPeriods$ = this.dashboardService.lastPeriods().pipe(
      catchError((error) => {
        this.periodsError = error;
        return throwError(() => error);
      })
    );
  }

  ngOnInit(): void {}
}
