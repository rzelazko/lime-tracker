import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YearInRangeGuard  {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const year = Number.parseInt(route.paramMap.get('year') || '', 10);
    const currentYear = moment().year();

    if (!year || year > currentYear - 10) {
      return true;
    } else {
      return this.router.parseUrl('/404');
    }
  }
}
