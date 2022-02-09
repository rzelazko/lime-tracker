import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AddEventComponent } from './epilepsy/add-event/add-event.component';
import { AddMedicamentComponent } from './epilepsy/add-medicament/add-medicament.component';
import { AddSeizureComponent } from './epilepsy/add-seizure/add-seizure.component';
import { CalendarComponent } from './epilepsy/calendar/calendar.component';
import { ChartsComponent } from './epilepsy/charts/charts.component';
import { EpilepsyComponent } from './epilepsy/epilepsy.component';
import { HomeComponent } from './epilepsy/home/home.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  {
    path: 'epilepsy',
    component: EpilepsyComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'charts', component: ChartsComponent },
      { path: 'calendar', component: CalendarComponent },
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
