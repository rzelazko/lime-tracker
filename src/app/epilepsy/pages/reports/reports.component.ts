import { ReportsService } from '../../../shared/services/reports.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { Report } from '../../../shared/models/report.model';
import { take, Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  report$: Observable<Report>;

  constructor(private reportsService: ReportsService) {
    this.report$ = this.reportsService.getReports();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
