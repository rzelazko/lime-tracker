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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
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
import { HeaderComponent } from './epilepsy/components/header/header.component';
import { SidenavComponent } from './epilepsy/components/sidenav/sidenav.component';
import { TableComponent } from './epilepsy/components/table/table.component';
import { EpilepsyComponent } from './epilepsy/epilepsy.component';
import { ChartsComponent } from './epilepsy/pages/charts/charts.component';
import { DashboardComponent } from './epilepsy/pages/dashboard/dashboard.component';
import { EventsAddComponent } from './epilepsy/pages/events-add/events-add.component';
import { EventsListComponent } from './epilepsy/pages/events-list/events-list.component';
import { MedicamentsListComponent } from './epilepsy/pages/medicament-list/medicaments-list.component';
import { MedicamentsAddComponent } from './epilepsy/pages/medicaments-add/medicaments-add.component';
import { ReportsComponent } from './epilepsy/pages/reports/reports.component';
import { SeizuresAddComponent } from './epilepsy/pages/seizures-add/seizures-add.component';
import { SeizuresListComponent } from './epilepsy/pages/seizures-list/seizures-list.component';
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
    TableComponent,
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
    MatPaginatorModule,
    MatSidenavModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  exports: [CompareValidatorDirective],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
