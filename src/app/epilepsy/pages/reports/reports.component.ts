import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, Observable, of, Subscription, throwError } from 'rxjs';
import { Report } from './../../../shared/models/report.model';
import { ReportsService } from './../../../shared/services/reports.service';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    standalone: false
})
export class ReportsComponent implements OnInit, OnDestroy {
  selectedYear?: number;
  report$?: Observable<Report | null>;
  routeSubscription?: Subscription;
  error?: string;

  constructor(private reportsService: ReportsService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.report$ = this.reportsService.getReports();
    this.routeSubscription = this.activatedRoute.params.subscribe((routeParams) => {
      this.selectedYear = routeParams['year'];
      this.report$ = this.reportsService.getReports(this.selectedYear);
    });
    this.report$ = this.report$.pipe(
      catchError((error) => {
        this.error = error.message || error;
        return of(null);
      })
    );
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }
}
