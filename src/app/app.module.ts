import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { AddSeizureComponent } from './epilepsy/add-seizure/add-seizure.component';
import { AddMedicamentComponent } from './epilepsy/add-medicament/add-medicament.component';
import { AddEventComponent } from './epilepsy/add-event/add-event.component';
import { ChartsComponent } from './reports/charts/charts.component';
import { CalendarComponent } from './reports/calendar/calendar.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    HomeComponent,
    AddSeizureComponent,
    AddMedicamentComponent,
    AddEventComponent,
    ChartsComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
