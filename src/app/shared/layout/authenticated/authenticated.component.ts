import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';

@Component({
  selector: 'app-epilepsy',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss'],
})
export class LayoutAuthenticatedComponent implements OnInit, OnDestroy {
  hideSideMenu: boolean = false;
  breakpointChangeSubscription: Subscription;
  constructor(breakpointObserver: BreakpointObserver) {
    this.breakpointChangeSubscription = breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(state => {this.hideSideMenu = state.matches; console.log(`Hide side menu: ${this.hideSideMenu}`)});
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.breakpointChangeSubscription?.unsubscribe();
  }
}
