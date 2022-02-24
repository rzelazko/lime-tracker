import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { EpilepsyComponent } from './epilepsy/epilepsy.component';
import { ChartsComponent } from './epilepsy/pages/charts/charts.component';
import { DashboardComponent } from './epilepsy/pages/dashboard/dashboard.component';
import { EventsAddComponent as EventsAddComponent } from './epilepsy/pages/events-add/events-add.component';
import { EventsListComponent as EventsListComponent } from './epilepsy/pages/events-list/events-list.component';
import { MedicamentsListComponent as MedicamentsListComponent } from './epilepsy/pages/medicament-list/medicaments-list.component';
import { MedicamentsAddComponent as MedicamentsAddComponent } from './epilepsy/pages/medicaments-add/medicaments-add.component';
import { ReportsComponent } from './epilepsy/pages/reports/reports.component';
import { SeizuresAddComponent as SeizuresAddComponent } from './epilepsy/pages/seizures-add/seizures-add.component';
import { SeizuresListComponent as SeizuresListComponent } from './epilepsy/pages/seizures-list/seizures-list.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  {
    path: 'epilepsy',
    component: EpilepsyComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'charts', component: ChartsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'seizures', component: SeizuresListComponent },
      { path: 'seizures/add', component: SeizuresAddComponent },
      { path: 'medicaments', component: MedicamentsListComponent },
      { path: 'medicaments/add', component: MedicamentsAddComponent },
      { path: 'events', component: EventsListComponent },
      { path: 'events/add', component: EventsAddComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
