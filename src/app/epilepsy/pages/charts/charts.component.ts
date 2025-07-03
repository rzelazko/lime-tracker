
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChartSeizuresByReasonComponent } from './chart-seizures-by-reason/chart-seizures-by-reason.component';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    standalone: false
    // Add the new chart component to the module's declarations if using standalone components
    // If using NgModule, add ChartSeizuresByReasonComponent to the module instead
})
export class ChartsComponent implements OnInit, OnDestroy {
  selectedYear?: number;
  routeSubscription: Subscription;

  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.routeSubscription = this.activatedRoute.params.subscribe((routeParams) => {
      this.selectedYear = routeParams['year'];
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
