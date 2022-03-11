import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'register/confirm', component: VerifyEmailComponent },
    ],
  },
  {
    path: 'epilepsy',
    component: EpilepsyComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'charts', component: ChartsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'seizures', component: SeizuresComponent },
      { path: 'seizures/add', component: SeizuresFormComponent },
      { path: 'seizures/update/:id', component: SeizuresFormComponent },
      { path: 'medicaments', component: MedicamentsComponent },
      { path: 'medicaments/add', component: MedicamentsFormComponent },
      { path: 'medicaments/update/:id', component: MedicamentsFormComponent },
      { path: 'events', component: EventsComponent },
      { path: 'events/add', component: EventsFormComponent },
      { path: 'events/update/:id', component: EventsFormComponent },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
