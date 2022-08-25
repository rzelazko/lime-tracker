import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import * as moment from 'moment';
import { delay, of, throwError } from 'rxjs';
import { ErrorCardComponent } from './../../../shared/error-card/error-card.component';
import { Medication } from './../../../shared/models/medication.model';
import { Seizure } from './../../../shared/models/seizure.model';
import { HumanizePipe } from './../../../shared/pipes/humanize.pipe';
import { MomentPipe } from './../../../shared/pipes/moment.pipe';
import { TimeSincePipe } from './../../../shared/pipes/time-since.pipe';
import { DashboardService } from './../../../shared/services/dashboard.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;

  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const dashboardServiceSpyObj = jasmine.createSpyObj('DashboardService', [
      'currentMedications',
      'lastSeizures',
    ]);

    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        ErrorCardComponent,

        HumanizePipe,
        MomentPipe,
        TimeSincePipe,
      ],
      providers: [{ provide: DashboardService, useValue: dashboardServiceSpyObj }],
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatTooltipModule,
      ],
    }).compileComponents();
    dashboardServiceSpy = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(moment('2021-05-15T12:00:00', 'YYYY-MM-DDTHH:mm:ss').toDate());
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should show medicaments data', async () => {
    // given
    const medications: Medication[] = [
      {
        objectType: 'MEDICATION',
        id: 'm1',
        name: 'Lorem ipsum',
        doses: {
          morning: 125,
          noon: 0,
          evening: 125,
        },
        startDate: moment('2021-05-15'),
        archived: false,
      },
      {
        objectType: 'MEDICATION',
        id: 'm2',
        name: 'Neque porro',
        doses: {
          morning: 1200,
          noon: 100,
          evening: 800,
        },
        startDate: moment('2021-01-01'),
        archived: false,
      },
    ];
    dashboardServiceSpy.currentMedications.and.returnValue(of(medications));
    dashboardServiceSpy.lastSeizures.and.returnValue(of());

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const medNameElements = fixture.debugElement.queryAll(By.css('.medication-name'));
    const medDoseElements = fixture.debugElement.queryAll(By.css('.dose'));
    expect(medNameElements.length).toBe(medications.length);
    for (let i = 0; i < medications.length; i++) {
      expect(medNameElements[i].nativeElement.textContent).toContain(medications[i].name);
      expect(medDoseElements[i].nativeElement.textContent).toContain(
        `${medications[i].doses.morning} - ${medications[i].doses.noon} - ${medications[i].doses.evening}`
      );
    }
  });

  it('should show no data if medicaments list is empty', async () => {
    // given
    const medications: Medication[] = [];
    dashboardServiceSpy.currentMedications.and.returnValue(of(medications));
    dashboardServiceSpy.lastSeizures.and.returnValue(of());

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const medCardElement = fixture.debugElement.query(By.css('.medications'));
    expect(medCardElement.nativeElement.textContent).toContain('No data');
  });

  it('should show error if medicaments data throw error', async () => {
    // given
    const errorMsg = 'Some medicaments error!';
    dashboardServiceSpy.currentMedications.and.returnValue(throwError(() => new Error(errorMsg)));
    dashboardServiceSpy.lastSeizures.and.returnValue(of());

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const errorCardElement = fixture.debugElement.query(By.directive(ErrorCardComponent));
    expect(errorCardElement.nativeElement.textContent).toContain(errorMsg);
  });

  it('should show loading indicator on medicaments data load', fakeAsync(() => {
    // given
    const spinnerElementQuery = By.css('.medications mat-progress-spinner');
    const medications: Medication[] = [];
    dashboardServiceSpy.currentMedications.and.returnValue(of(medications).pipe(delay(100)));
    dashboardServiceSpy.lastSeizures.and.returnValue(of());

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    expect(fixture.debugElement.queryAll(spinnerElementQuery).length).toBe(1);
    tick(100);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(spinnerElementQuery).length).toBe(0);
  }));

  it('should show last seizure data', async () => {
    // given
    const seizures: Seizure[] = [
      {
        objectType: 'SEIZURE',
        id: 's1',
        occurred: moment('2021-05-15T12:05:00'),
        duration: moment.duration(5, 'minutes'),
        type: 'some seizure type',
        triggers: [],
      },
    ];
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of(seizures));

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const lastSeizureElement = fixture.debugElement.query(
      By.css('.last-seizure mat-card-content p')
    );
    expect(lastSeizureElement).toBeTruthy();
    expect(lastSeizureElement.nativeElement.textContent).toContain('5 minutes'); // system time is set in beforeEach
  });

  it('should show no data if last seizure is empty', async () => {
    // given
    const seizures: Seizure[] = [];
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of(seizures));

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const lastSeizureElement = fixture.debugElement.query(
      By.css('.last-seizure mat-card-content p')
    );
    expect(lastSeizureElement.nativeElement.textContent).toContain('unknown');
  });

  it('should show error if last seizure data throw error', async () => {
    // given
    const errorMsg = 'Some last seizure error!';
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(throwError(() => new Error(errorMsg)));

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const errorCardElement = fixture.debugElement.query(By.directive(ErrorCardComponent));
    expect(errorCardElement.nativeElement.textContent).toContain(errorMsg);
  });

  it('should show loading indicator on last seizure data load', fakeAsync(() => {
    // given
    const spinnerElementQuery = By.css('.last-seizure mat-progress-spinner');
    const seizures: Seizure[] = [];
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of(seizures).pipe(delay(100)));

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    expect(fixture.debugElement.queryAll(spinnerElementQuery).length).toBe(1);
    tick(100);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(spinnerElementQuery).length).toBe(0);
  }));
});
