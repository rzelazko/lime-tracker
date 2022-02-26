import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { EpilepsyComponent } from './epilepsy/epilepsy.component';
import { ChartsComponent } from './epilepsy/pages/charts/charts.component';
import { DashboardComponent } from './epilepsy/pages/dashboard/dashboard.component';
import { EventsAddComponent as EventsAddComponent } from './epilepsy/pages/events-add/events-add.component';
import { EventsComponent as EventsComponent } from './epilepsy/pages/events/events.component';
import { MedicamentsComponent as MedicamentsComponent } from './epilepsy/pages/medicaments/medicaments.component';
import { MedicamentsAddComponent as MedicamentsAddComponent } from './epilepsy/pages/medicaments-add/medicaments-add.component';
import { ReportsComponent } from './epilepsy/pages/reports/reports.component';
import { SeizuresAddComponent as SeizuresAddComponent } from './epilepsy/pages/seizures-add/seizures-add.component';
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
      { path: 'seizures/add', component: SeizuresAddComponent },
      { path: 'medicaments', component: MedicamentsComponent },
      { path: 'medicaments/add', component: MedicamentsAddComponent },
      { path: 'events', component: EventsComponent },
      { path: 'events/add', component: EventsAddComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
