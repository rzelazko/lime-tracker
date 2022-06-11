import { NgModule } from '@angular/core';
import { AuthGuard, AuthPipeGenerator, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { map } from 'rxjs';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { LogoutComponent } from './auth/pages/logout/logout.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { VerifyEmailComponent } from './auth/pages/verify-email/verify-email.component';
import { EpilepsyComponent } from './epilepsy/epilepsy.component';
import { ChartsComponent } from './epilepsy/pages/charts/charts.component';
import { DashboardComponent } from './epilepsy/pages/dashboard/dashboard.component';
import { EventsFormComponent } from './epilepsy/pages/events/events-form/events-form.component';
import { EventsComponent } from './epilepsy/pages/events/events.component';
import { MedicationsFormComponent } from './epilepsy/pages/medications/medications-form/medications-form.component';
import { MedicationsComponent } from './epilepsy/pages/medications/medications.component';
import { PeriodsFormComponent } from './epilepsy/pages/periods/periods-form/periods-form.component';
import { PeriodsComponent } from './epilepsy/pages/periods/periods.component';
import { ReportsComponent } from './epilepsy/pages/reports/reports.component';
import { SeizuresFormComponent } from './epilepsy/pages/seizures/seizures-form/seizures-form.component';
import { SeizuresComponent } from './epilepsy/pages/seizures/seizures.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { YearInRangeGuard } from './shared/guards/year-in-range.guard';

const redirectLoggedInToDashboard = () =>
  redirectLoggedInTo([$localize`:@@routerLink-epilepsy:/epilepsy`]);
const redirectUnauthorizedOrUnverifiedUser: AuthPipeGenerator = () =>
  map((user) => {
    if (user) {
      if (user.emailVerified) {
        return true;
      }
      return [$localize`:@@routerLink-register-confirm:/register/confirm`];
    }
    return [$localize`:@@routerLink-login:/login`];
  });

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: $localize`:@@routerLink-login:/login` },
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: $localize`:@@routerLink-login:/login` },
      {
        path: $localize`:@@routing-login:login`,
        component: LoginComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedInToDashboard },
      },
      {
        path: $localize`:@@routing-logout:logout`,
        component: LogoutComponent,
      },
      {
        path: $localize`:@@routing-register:register`,
        component: RegisterComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedInToDashboard },
      },
      {
        path: $localize`:@@routing-register-confirm:register/confirm`,
        component: VerifyEmailComponent,
      },
    ],
  },
  {
    path: $localize`:@@routing-epilepsy:epilepsy`,
    component: EpilepsyComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-charts:charts`,
        component: ChartsComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-charts-year:charts/:year`,
        component: ChartsComponent,
        canActivate: [AuthGuard, YearInRangeGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-periods:periods`,
        component: PeriodsComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-periods-add:periods/add`,
        component: PeriodsFormComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-reports:reports`,
        component: ReportsComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-reports-year:reports/:year`,
        component: ReportsComponent,
        canActivate: [AuthGuard, YearInRangeGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-seizures:seizures`,
        component: SeizuresComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-seizures-add:seizures/add`,
        component: SeizuresFormComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-seizures-update:seizures/update/:id`,
        component: SeizuresFormComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-medications:medications`,
        component: MedicationsComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-medications-add:medications/add`,
        component: MedicationsFormComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-medications-update:medications/update/:id`,
        component: MedicationsFormComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-events:events`,
        component: EventsComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-events-add:events/add`,
        component: EventsFormComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-evetns-update:events/update/:id`,
        component: EventsFormComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
    ],
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
