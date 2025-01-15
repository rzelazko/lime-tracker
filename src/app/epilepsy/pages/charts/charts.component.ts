import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    standalone: false
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
