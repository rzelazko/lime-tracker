import { NgModule } from '@angular/core';
import { AuthGuard, AuthPipeGenerator, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes, TitleStrategy, provideRouter } from '@angular/router';
import { map } from 'rxjs';
import { LoginComponent } from './auth/pages/login/login.component';
import { LogoutComponent } from './auth/pages/logout/logout.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { VerifyEmailComponent } from './auth/pages/verify-email/verify-email.component';
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
import { ManageProfileComponent } from './profile/pages/manage-profile/manage-profile.component';
import { YearInRangeGuard } from './shared/guards/year-in-range.guard';
import { LayoutAnonymousComponent } from './shared/layout/anonymous/anonymous.component';
import { LayoutAuthenticatedComponent } from './shared/layout/authenticated/authenticated.component';
import { TemplatePageTitleStrategy } from './shared/services/template-page-title.strategy';

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
    component: LayoutAnonymousComponent,
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
        title: $localize`:@@title-verify-email:Verify Email`,
      },
    ],
  },
  {
    path: $localize`:@@routing-epilepsy:epilepsy`,
    component: LayoutAuthenticatedComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        title: $localize`:@@title-dashboard:Dashboard`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-charts:charts`,
        component: ChartsComponent,
        title: $localize`:@@title-charts:Charts`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-charts-year:charts/:year`,
        component: ChartsComponent,
        title: $localize`:@@title-charts:Charts`,
        canActivate: [AuthGuard, YearInRangeGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-periods:periods`,
        component: PeriodsComponent,
        title: $localize`:@@title-periods:Periods`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-periods-add:periods/add`,
        component: PeriodsFormComponent,
        title: $localize`:@@title-add-period:Add Period`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-periods-update:periods/update/:id`,
        component: PeriodsFormComponent,
        title: $localize`:@@title-update-period:Update Period`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-reports:reports`,
        component: ReportsComponent,
        title: $localize`:@@title-reports:Reports`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-reports-year:reports/:year`,
        component: ReportsComponent,
        title: $localize`:@@title-reports:Reports`,
        canActivate: [AuthGuard, YearInRangeGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-seizures:seizures`,
        component: SeizuresComponent,
        title: $localize`:@@title-seizures:Seizures`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-seizures-add:seizures/add`,
        component: SeizuresFormComponent,
        title: $localize`:@@title-add-seizure:Add Seizure`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-seizures-update:seizures/update/:id`,
        component: SeizuresFormComponent,
        title: $localize`:@@title-update-seizure:Update Seizure`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-medications:medications`,
        component: MedicationsComponent,
        title: $localize`:@@title-medications:Medications`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-medications-add:medications/add`,
        component: MedicationsFormComponent,
        title: $localize`:@@title-add-medication:Add Medication`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-medications-update:medications/update/:id`,
        component: MedicationsFormComponent,
        title: $localize`:@@title-update-medication:Update Medication`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-events:events`,
        component: EventsComponent,
        title: $localize`:@@title-events:Events`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-events-add:events/add`,
        component: EventsFormComponent,
        title: $localize`:@@title-add-event:Add Event`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
      {
        path: $localize`:@@routing-evetns-update:events/update/:id`,
        component: EventsFormComponent,
        title: $localize`:@@title-update-event:Update Event`,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedOrUnverifiedUser },
      },
    ],
  },
  {
    path: $localize`:@@routing-profile:account`,
    component: LayoutAuthenticatedComponent,
    children: [
      {
        path: '',
        component: ManageProfileComponent,
        title: $localize`:@@title-profile:Manage account`,
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
  providers: [
    provideRouter(routes),
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
  ],
})
export class AppRoutingModule {}
