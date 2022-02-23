import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthFormComponent } from './auth/auth-form/auth-form.component';
import { AuthComponent } from './auth/auth.component';
import { ChartsComponent } from './epilepsy/charts/charts.component';
import { DashboardComponent } from './epilepsy/dashboard/dashboard.component';
import { EventsAddComponent } from './epilepsy/data-management/events-add/events-add.component';
import { EventsListComponent } from './epilepsy/data-management/events-list/events-list.component';
import { MedicamentsAddComponent } from './epilepsy/data-management/medicaments-add/medicaments-add.component';
import { MedicamentsListComponent } from './epilepsy/data-management/medicament-list/medicaments-list.component';
import { SeizuresAddComponent } from './epilepsy/data-management/seizures-add/seizures-add.component';
import { SeizuresListComponent } from './epilepsy/data-management/seizures-list/seizures-list.component';
import { EpilepsyComponent } from './epilepsy/epilepsy.component';
import { HeaderComponent } from './epilepsy/layout/header/header.component';
import { SidenavComponent } from './epilepsy/layout/sidenav/sidenav.component';
import { ReportsComponent } from './epilepsy/reports/reports.component';
import { HumanizePipe } from './shared/pipes/humanize.pipe';
import { MomentPipe } from './shared/pipes/moment.pipe';
import { CompareValidatorDirective } from './validators/compare-validator.directive';

@NgModule({
  declarations: [
    // directives
    CompareValidatorDirective,

    // pipes
    HumanizePipe,
    MomentPipe,

    // components
    AppComponent,
    AuthComponent,
    AuthFormComponent,
    ChartsComponent,
    DashboardComponent,
    EpilepsyComponent,
    EventsAddComponent,
    EventsListComponent,
    HeaderComponent,
    MedicamentsAddComponent,
    MedicamentsListComponent,
    ReportsComponent,
    SidenavComponent,
    SeizuresAddComponent,
    SeizuresListComponent,
  ],
  imports: [
    // angular
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,

    // flex
    FlexLayoutModule,

    // apex charts
    NgApexchartsModule,

    // material
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  exports: [CompareValidatorDirective],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
