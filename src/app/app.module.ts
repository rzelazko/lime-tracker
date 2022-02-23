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
import { AddEventComponent } from './epilepsy/add-event/add-event.component';
import { AddMedicamentComponent } from './epilepsy/add-medicament/add-medicament.component';
import { AddSeizureComponent } from './epilepsy/add-seizure/add-seizure.component';
import { ChartsComponent } from './epilepsy/charts/charts.component';
import { DashboardComponent } from './epilepsy/dashboard/dashboard.component';
import { EpilepsyComponent } from './epilepsy/epilepsy.component';
import { HeaderComponent } from './epilepsy/layout/header/header.component';
import { SidenavComponent } from './epilepsy/layout/sidenav/sidenav.component';
import { ReportsComponent } from './epilepsy/reports/reports.component';
import { HumanizePipe } from './shared/pipes/humanize.pipe';
import { MomentPipe } from './shared/pipes/moment.pipe';
import { CompareValidatorDirective } from './validators/compare-validator.directive';

@NgModule({
  declarations: [
    // components
    AppComponent,
    AddEventComponent,
    AddMedicamentComponent,
    AddSeizureComponent,
    AuthComponent,
    AuthFormComponent,
    ChartsComponent,
    DashboardComponent,
    EpilepsyComponent,
    HeaderComponent,
    ReportsComponent,
    SidenavComponent,

    // directives
    CompareValidatorDirective,

    // pipes
    HumanizePipe,
    MomentPipe,
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
