import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';

@Component({
    selector: 'app-epilepsy',
    templateUrl: './authenticated.component.html',
    styleUrls: ['./authenticated.component.scss'],
    standalone: false
})
export class LayoutAuthenticatedComponent implements OnInit, OnDestroy {
  hideSideMenu: boolean = false;
  breakpointChangeSubscription: Subscription;
  breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  constructor() {
    this.breakpointChangeSubscription = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(state => this.hideSideMenu = state.matches);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.breakpointChangeSubscription?.unsubscribe();
  }
}
