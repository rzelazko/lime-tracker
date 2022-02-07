import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AddEventComponent } from './epilepsy/add-event/add-event.component';
import { AddMedicamentComponent } from './epilepsy/add-medicament/add-medicament.component';
import { AddSeizureComponent } from './epilepsy/add-seizure/add-seizure.component';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './reports/calendar/calendar.component';
import { ChartsComponent } from './reports/charts/charts.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reports/charts', component: ChartsComponent },
  { path: 'reports/calendar', component: CalendarComponent },
  { path: 'add-seizure', component: AddSeizureComponent },
  { path: 'add-medicament', component: AddMedicamentComponent },
  { path: 'add-event', component: AddEventComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
