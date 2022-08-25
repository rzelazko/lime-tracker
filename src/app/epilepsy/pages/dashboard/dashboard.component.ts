import { Component, OnInit } from '@angular/core';
import { Duration } from 'moment';
import { catchError, Observable, throwError } from 'rxjs';
import { Medication } from './../../../shared/models/medication.model';
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
  timeSinceLastSeizure?: Duration;
  seizureError?: string;
  medicationsError?: string;

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
  }

  ngOnInit(): void {}
}
