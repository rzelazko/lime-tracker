import { EventsAddComponent as EventsAddComponent } from './epilepsy/data-management/events-add/events-add.component';
import { EventsListComponent as EventsListComponent } from './epilepsy/data-management/events-list/events-list.component';
import { MedicamentsAddComponent as MedicamentsAddComponent } from './epilepsy/data-management/medicaments-add/medicaments-add.component';
import { MedicamentsListComponent as MedicamentsListComponent } from './epilepsy/data-management/medicament-list/medicaments-list.component';
import { SeizuresAddComponent as SeizuresAddComponent } from './epilepsy/data-management/seizures-add/seizures-add.component';
import { SeizuresListComponent as SeizuresListComponent } from './epilepsy/data-management/seizures-list/seizures-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ChartsComponent } from './epilepsy/charts/charts.component';
import { DashboardComponent } from './epilepsy/dashboard/dashboard.component';
import { EpilepsyComponent } from './epilepsy/epilepsy.component';
import { ReportsComponent } from './epilepsy/reports/reports.component';

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
