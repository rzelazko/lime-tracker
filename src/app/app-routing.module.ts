import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AddEventComponent } from './epilepsy/add-event/add-event.component';
import { AddMedicamentComponent } from './epilepsy/add-medicament/add-medicament.component';
import { AddSeizureComponent } from './epilepsy/add-seizure/add-seizure.component';
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
      { path: 'add-seizure', component: AddSeizureComponent },
      { path: 'add-medicament', component: AddMedicamentComponent },
      { path: 'add-event', component: AddEventComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
