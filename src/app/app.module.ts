import { LayoutModule } from '@angular/cdk/layout';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgApexchartsModule } from 'ng-apexcharts';
import { environment } from './../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { LogoutComponent } from './auth/pages/logout/logout.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { VerifyEmailComponent } from './auth/pages/verify-email/verify-email.component';
import { ConfirmDeleteDialogComponent } from './epilepsy/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TableComponent } from './epilepsy/components/table/table.component';
import { YearsnavComponent } from './epilepsy/components/yearsnav/yearsnav.component';
import { ChartHeatmapComponent } from './epilepsy/pages/charts/chart-heatmap/chart-heatmap.component';
import { ChartSeizuresByHoursComponent } from './epilepsy/pages/charts/chart-seizures-by-hours/chart-seizures-by-hours.component';
import { ChartSummaryComponent } from './epilepsy/pages/charts/chart-summary/chart-summary.component';
import { ChartsComponent } from './epilepsy/pages/charts/charts.component';
import { DashboardComponent } from './epilepsy/pages/dashboard/dashboard.component';
import { EventsFormComponent } from './epilepsy/pages/events/events-form/events-form.component';
import { EventsComponent } from './epilepsy/pages/events/events.component';
import { MedicationsFormComponent } from './epilepsy/pages/medications/medications-form/medications-form.component';
import { MedicationsComponent } from './epilepsy/pages/medications/medications.component';
import { PeriodsFormComponent } from './epilepsy/pages/periods/periods-form/periods-form.component';
import { PeriodsComponent } from './epilepsy/pages/periods/periods.component';
import { ReportsComponent } from './epilepsy/pages/reports/reports.component';
import { SeizuresFormComponent } from './epilepsy/pages/seizures/seizures-form/seizures-form.component';
import { SeizuresComponent } from './epilepsy/pages/seizures/seizures.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ManageProfileComponent } from './profile/pages/manage-profile/manage-profile.component';
import { ErrorModalComponent } from './shared/components/error-modal/error-modal.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { UpdateDialogComponent } from './shared/components/update-dialog/update-dialog.component';
import { ErrorCardComponent } from './shared/error-card/error-card.component';
import { LayoutAnonymousComponent } from './shared/layout/anonymous/anonymous.component';
import { LayoutAuthenticatedComponent } from './shared/layout/authenticated/authenticated.component';
import { EndOfPipe } from './shared/pipes/end-of.pipe';
import { HumanizePipe } from './shared/pipes/humanize.pipe';
import { JoinPipe } from './shared/pipes/join.pipe';
import { MomentPipe } from './shared/pipes/moment.pipe';
import { StartOfPipe } from './shared/pipes/start-of.pipe';
import { TimeSincePipe } from './shared/pipes/time-since.pipe';

let resolvePersistenceEnabled: (enabled: boolean) => void;

export const persistenceEnabled = new Promise<boolean>((resolve) => {
  resolvePersistenceEnabled = resolve;
});

@NgModule({
    declarations: [
        // Pipes
        EndOfPipe,
        HumanizePipe,
        JoinPipe,
        MomentPipe,
        StartOfPipe,
        TimeSincePipe,
        // Components
        AppComponent,
        ChartsComponent,
        ChartHeatmapComponent,
        ChartSeizuresByHoursComponent,
        ChartSummaryComponent,
        ConfirmDeleteDialogComponent,
        DashboardComponent,
        EventsFormComponent,
        EventsComponent,
        ErrorCardComponent,
        ErrorModalComponent,
        HeaderComponent,
        LayoutAnonymousComponent,
        LayoutAuthenticatedComponent,
        LoginComponent,
        LogoutComponent,
        ManageProfileComponent,
        MedicationsComponent,
        MedicationsFormComponent,
        PageNotFoundComponent,
        PeriodsComponent,
        PeriodsFormComponent,
        RegisterComponent,
        ReportsComponent,
        SidenavComponent,
        SeizuresComponent,
        SeizuresFormComponent,
        TableComponent,
        UpdateDialogComponent,
        VerifyEmailComponent,
        YearsnavComponent,
    ],
    imports: [
        // Angular
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        // Firebase
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAnalytics(() => getAnalytics()),
        provideAuth(() => {
            const auth = getAuth();
            if (environment.useEmulators) {
                connectAuthEmulator(auth, `http://${environment.emulatorHost}:9099`, { disableWarnings: true });
            }
            return auth;
        }),
        provideFirestore(() => {
            const firestore = getFirestore();
            if (environment.useEmulators) {
                connectFirestoreEmulator(firestore, environment.emulatorHost, 8080);
            }
            enableMultiTabIndexedDbPersistence(firestore).then(() => resolvePersistenceEnabled(true), () => resolvePersistenceEnabled(false));
            return firestore;
        }),
        // Apex charts
        NgApexchartsModule,
        // Material CDK
        LayoutModule,
        // Material
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatMomentDateModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        // Progressive Web App
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
    exports: [],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
