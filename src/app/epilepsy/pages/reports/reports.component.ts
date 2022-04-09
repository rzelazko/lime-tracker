import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Report } from '../../../shared/models/report.model';
import { ReportsService } from '../../../shared/services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  selectedYear?: number;
  report$: Observable<Report>;

  constructor(private reportsService: ReportsService) {
    this.report$ = this.reportsService.getReports();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onYearSelect(year?: number) {
    this.selectedYear = year;
    this.report$ = this.reportsService.getReports(year);
  }
}
