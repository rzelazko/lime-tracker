import { Component, OnInit } from '@angular/core';
import { Duration } from 'moment';
import { catchError, Observable, throwError } from 'rxjs';
import { Event } from './../../../shared/models/event.model';
import { Medication } from './../../../shared/models/medication.model';
import { Period } from './../../../shared/models/period.model';
import { Seizure } from './../../../shared/models/seizure.model';
import { DashboardService } from './../../../shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  medications$: Observable<Medication[]>;
  lastSeizures$: Observable<Seizure[]>;
  lastEvents$: Observable<Event[]>;
  lastPeriods$: Observable<Period[]>;
  timeSinceLastSeizure?: Duration;
  seizureError?: string;
  medicationsError?: string;
  eventsError?: string;
  periodsError?: string;

  constructor(dashboardService: DashboardService) {
    this.medications$ = dashboardService.currentMedications().pipe(
      catchError((error) => {
        this.seizureError = error;
        return throwError(() => error);
      })
    );
    this.lastSeizures$ = dashboardService.lastSeizures().pipe(
      catchError((error) => {
        this.medicationsError = error;
        return throwError(() => error);
      })
    );
    this.lastEvents$ = dashboardService.lastEvents().pipe(
      catchError((error) => {
        this.eventsError = error;
        return throwError(() => error);
      })
    );
    this.lastPeriods$ = dashboardService.lastPeriods().pipe(
      catchError((error) => {
        this.periodsError = error;
        return throwError(() => error);
      })
    );
  }

  ngOnInit(): void {}
}
