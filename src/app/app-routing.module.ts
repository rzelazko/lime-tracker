import { EventsFormComponent } from './epilepsy/pages/events/events-form/events-form.component';
import { MedicamentsFormComponent } from './epilepsy/pages/medicaments/medicaments-form/medicaments-form.component';
import { SeizuresFormComponent } from './epilepsy/pages/seizures/seizures-form/seizures-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { EpilepsyComponent } from './epilepsy/epilepsy.component';
import { ChartsComponent } from './epilepsy/pages/charts/charts.component';
import { DashboardComponent } from './epilepsy/pages/dashboard/dashboard.component';
import { EventsComponent as EventsComponent } from './epilepsy/pages/events/events.component';
import { MedicamentsComponent as MedicamentsComponent } from './epilepsy/pages/medicaments/medicaments.component';
import { ReportsComponent } from './epilepsy/pages/reports/reports.component';
import { SeizuresComponent as SeizuresComponent } from './epilepsy/pages/seizures/seizures.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
