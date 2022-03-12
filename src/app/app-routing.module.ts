import { LogoutComponent } from './auth/pages/logout/logout.component';
import { NgModule } from '@angular/core';
import {
  AuthGuard,
  AuthPipe,
  AuthPipeGenerator,
  emailVerified,
  loggedIn,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { forkJoin, map, mergeMap, of, pipe } from 'rxjs';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { VerifyEmailComponent } from './auth/pages/verify-email/verify-email.component';
import { EpilepsyComponent } from './epilepsy/epilepsy.component';
import { ChartsComponent } from './epilepsy/pages/charts/charts.component';
import { DashboardComponent } from './epilepsy/pages/dashboard/dashboard.component';
import { EventsFormComponent } from './epilepsy/pages/events/events-form/events-form.component';
import { EventsComponent } from './epilepsy/pages/events/events.component';
import { MedicamentsFormComponent } from './epilepsy/pages/medicaments/medicaments-form/medicaments-form.component';
import { MedicamentsComponent } from './epilepsy/pages/medicaments/medicaments.component';
import { ReportsComponent } from './epilepsy/pages/reports/reports.component';
import { SeizuresFormComponent } from './epilepsy/pages/seizures/seizures-form/seizures-form.component';
import { SeizuresComponent } from './epilepsy/pages/seizures/seizures.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const redirectLoggedInToDashboard = () => redirectLoggedInTo(['epilepsy']);
const redirectUnauthorizedOrUnverifiedUser: AuthPipeGenerator = () =>
  map((user) => {
    if (user) {
      if (user.emailVerified) {
        return true;
      }
      return ['register', 'confirm'];
    }
    return ['login'];
  });

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedInToDashboard },
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedInToDashboard },
      },
      { path: 'register/confirm', component: VerifyEmailComponent },
    ],
  },
  {
    path: 'epilepsy',
    component: EpilepsyComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: 'charts',
        component: ChartsComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: 'seizures',
        component: SeizuresComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: 'seizures/add',
        component: SeizuresFormComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: 'seizures/update/:id',
        component: SeizuresFormComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: 'medicaments',
        component: MedicamentsComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: 'medicaments/add',
        component: MedicamentsFormComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: 'medicaments/update/:id',
        component: MedicamentsFormComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: 'events',
        component: EventsComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: 'events/add',
        component: EventsFormComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: 'events/update/:id',
        component: EventsFormComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
