import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-epilepsy',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss'],
})
export class LayoutAuthenticatedComponent implements OnInit {
  hideSideMenu$: Observable<boolean>;
  constructor(breakpointObserver: BreakpointObserver) {
    this.hideSideMenu$ = breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(
      map(state => state.breakpoints[Breakpoints.XSmall] && state.breakpoints[Breakpoints.Small]));
  }

  ngOnInit(): void {}
}
