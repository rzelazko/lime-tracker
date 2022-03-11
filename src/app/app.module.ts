import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgApexchartsModule } from 'ng-apexcharts';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AuthFormComponent } from './auth/components/auth-form/auth-form.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { VerifyEmailComponent } from './auth/pages/verify-email/verify-email.component';
import { ConfirmDeleteDialogComponent } from './epilepsy/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { HeaderComponent } from './epilepsy/components/header/header.component';
import { SidenavComponent } from './epilepsy/components/sidenav/sidenav.component';
import { TableComponent } from './epilepsy/components/table/table.component';
import { EpilepsyComponent } from './epilepsy/epilepsy.component';
import { ChartsComponent } from './epilepsy/pages/charts/charts.component';
import { DashboardComponent } from './epilepsy/pages/dashboard/dashboard.component';
import { EventsFormComponent } from './epilepsy/pages/events/events-form/events-form.component';
import { EventsComponent } from './epilepsy/pages/events/events.component';
import { MedicamentsFormComponent } from './epilepsy/pages/medicaments/medicaments-form/medicaments-form.component';
import { MedicamentsComponent } from './epilepsy/pages/medicaments/medicaments.component';
import { ReportsComponent } from './epilepsy/pages/reports/reports.component';
import { SeizuresFormComponent } from './epilepsy/pages/seizures/seizures-form/seizures-form.component';
import { SeizuresComponent } from './epilepsy/pages/seizures/seizures.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HumanizePipe } from './shared/pipes/humanize.pipe';
import { MomentPipe } from './shared/pipes/moment.pipe';
import { CompareValidatorDirective } from './shared/validators/compare-validator.directive';

let resolvePersistenceEnabled: (enabled: boolean) => void;

export const persistenceEnabled = new Promise<boolean>((resolve) => {
  resolvePersistenceEnabled = resolve;
});

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
    ConfirmDeleteDialogComponent,
    DashboardComponent,
    EpilepsyComponent,
    EventsFormComponent,
    EventsComponent,
    HeaderComponent,
    MedicamentsComponent,
    ReportsComponent,
    SidenavComponent,
    SeizuresComponent,
    TableComponent,
    MedicamentsFormComponent,
    SeizuresFormComponent,
    LoginComponent,
    RegisterComponent,
    VerifyEmailComponent,
    PageNotFoundComponent,
  ],
  imports: [
    // angular
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    // firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      enableMultiTabIndexedDbPersistence(firestore).then(
        () => resolvePersistenceEnabled(true),
        () => resolvePersistenceEnabled(false)
      );
      return firestore;
    }),

    // flex
    FlexLayoutModule,

    // apex charts
    NgApexchartsModule,

    // material
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMomentDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  exports: [CompareValidatorDirective],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDeleteDialogComponent],
})
export class AppModule {}
