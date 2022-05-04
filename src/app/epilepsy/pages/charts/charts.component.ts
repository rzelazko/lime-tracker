import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit, OnDestroy {
  selectedYear?: number;
  routeSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute) {
    this.routeSubscription = this.activatedRoute.params.subscribe((routeParams) => {
      this.selectedYear = routeParams['year'];
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
