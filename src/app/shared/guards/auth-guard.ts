import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { authState$ } from '../firebase';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot) {
    const user = await firstValueFrom(authState$());
    const pipe = (route.data && (route.data as any)['authGuardPipe']) as ((user: any) => any) | undefined;
    if (pipe) {
      try {
        const result = pipe(user);
        if (result === true) return true;
        if (Array.isArray(result) && result.length) {
          return this.router.parseUrl(result.join(''));
        }
      } catch (e) {
        // fallthrough to default behaviour
      }
    }

    if (user) return true;

    return this.router.parseUrl('/login');
  }
}
