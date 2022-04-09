import { Component, OnInit } from '@angular/core';
import { Duration } from 'moment';
import { Observable } from 'rxjs';
import { Medicament } from '../../../shared/models/medicament.model';
import { Seizure } from '../../../shared/models/seizure.model';
import { DashboardService } from '../../../shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  medicaments$: Observable<Medicament[]>;
  lastSeizures$: Observable<Seizure[]>;
  timeSinceLastSeizure?: Duration;

  constructor(dashboardService: DashboardService) {
    this.medicaments$ = dashboardService.currentMedicaments();
    this.lastSeizures$ = dashboardService.lastSeizures();
  }

  ngOnInit(): void {}
}
