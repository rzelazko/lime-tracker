import { Component, OnInit } from '@angular/core';
import { Duration } from 'moment';
import { Observable } from 'rxjs';
import { Medication } from '../../../shared/models/medication.model';
import { Seizure } from '../../../shared/models/seizure.model';
import { DashboardService } from '../../../shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  medications$: Observable<Medication[]>;
  lastSeizures$: Observable<Seizure[]>;
  timeSinceLastSeizure?: Duration;

  constructor(dashboardService: DashboardService) {
    this.medications$ = dashboardService.currentMedications();
    this.lastSeizures$ = dashboardService.lastSeizures();
  }

  ngOnInit(): void {}
}
