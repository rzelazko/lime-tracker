import { Component, OnInit } from '@angular/core';
import { Duration } from 'moment';
import { Observable } from 'rxjs';
import { Seizure } from 'src/app/shared/models/seizure.model';
import { Medicament } from '../../../shared/models/medicament.model';
import { DashboardService } from './../../../shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  medicaments$: Observable<Medicament[]>;
  lastSeizure$: Observable<Seizure[]>;
  timeSinceLastSeizure?: Duration;

  constructor(dashboardService: DashboardService) {
    this.medicaments$ = dashboardService.currentMedicaments();
    this.lastSeizure$ = dashboardService.lastSeizure();
  }

  ngOnInit(): void {}
}
