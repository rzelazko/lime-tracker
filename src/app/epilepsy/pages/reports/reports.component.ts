import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
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
  routeSubscription: Subscription;

  constructor(private reportsService: ReportsService, private activatedRoute: ActivatedRoute) {
    this.report$ = this.reportsService.getReports();
    this.routeSubscription = this.activatedRoute.params.subscribe((routeParams) => {
      this.selectedYear = routeParams['year'];
      this.report$ = this.reportsService.getReports(this.selectedYear);
    });
  }

  ngOnInit(): void {
    this.selectedYear = this.activatedRoute.snapshot.params['year'];
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
