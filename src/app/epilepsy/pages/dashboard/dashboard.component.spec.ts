import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { User } from 'firebase/auth';
import moment from 'moment';
import { delay, of, throwError } from 'rxjs';
import { UserData } from './../../../auth/models/user-details.model';
import { ErrorCardComponent } from './../../../shared/error-card/error-card.component';
import { Event } from './../../../shared/models/event.model';
import { Medication } from './../../../shared/models/medication.model';
import { MockFirebaseUser } from './../../../shared/models/mock-firebase-user.model';
import { Period } from './../../../shared/models/period.model';
import { Seizure } from './../../../shared/models/seizure.model';
import { HumanizePipe } from './../../../shared/pipes/humanize.pipe';
import { MomentPipe } from './../../../shared/pipes/moment.pipe';
import { TimeSincePipe } from './../../../shared/pipes/time-since.pipe';
import { AuthService } from './../../../shared/services/auth.service';
import { DashboardService } from './../../../shared/services/dashboard.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  
  let fixture: ComponentFixture<DashboardComponent>;

  const mockUserData: UserData = {
    id: 'joanna.smith',
    name: 'Joanna Smith',
    email: 'joanna.smith@webperfekt.pl',
    seizureTriggers: [],
    seizureTypes: [],
    isFemale: true
  };

  const mockUser: User = new MockFirebaseUser(
    mockUserData.name,
    mockUserData.email,
    mockUserData.id
  );

  beforeEach(async () => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['userDetails$']);
    const dashboardServiceSpyObj = jasmine.createSpyObj('DashboardService', [
      'currentMedications',
      'lastSeizures',
      'lastEvents',
      'lastPeriods'
    ]);

    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        ErrorCardComponent,

        HumanizePipe,
        MomentPipe,
        TimeSincePipe
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: DashboardService, useValue: dashboardServiceSpyObj }
      ],
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatTooltipModule
      ]
    }).compileComponents();
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    dashboardServiceSpy = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(moment('2021-05-15T12:00:00', 'YYYY-MM-DDTHH:mm:ss').toDate());
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  // ------------------------------------------------------------------------------
  // Medicaments section
  // ------------------------------------------------------------------------------

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
          evening: 125
        },
        startDate: moment('2021-05-15'),
        archived: false
      },
      {
        objectType: 'MEDICATION',
        id: 'm2',
        name: 'Neque porro',
        doses: {
          morning: 1200,
          noon: 100,
          evening: 800
        },
        startDate: moment('2021-01-01'),
        archived: false
      }
    ];
    dashboardServiceSpy.currentMedications.and.returnValue(of(medications));
    dashboardServiceSpy.lastSeizures.and.returnValue(of());
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of());

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const medNameElements = fixture.debugElement.queryAll(By.css('.medication-name'));
    const medDoseElements = fixture.debugElement.queryAll(By.css('.medication-dose'));
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
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of());

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
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of());

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
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of());

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

  // ------------------------------------------------------------------------------
  // Seizures section
  // ------------------------------------------------------------------------------

  it('should show last seizure data', async () => {
    // given
    const seizures: Seizure[] = [
      {
        objectType: 'SEIZURE',
        id: 's1',
        occurred: moment('2021-05-15T12:05:00'),
        duration: moment.duration(5, 'minutes'),
        type: 'some seizure type',
        triggers: []
      }
    ];
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of(seizures));
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of());

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const lastSeizureElement = fixture.debugElement.query(By.css('.last-seizure mat-card-content'));
    expect(lastSeizureElement).toBeTruthy();
    expect(lastSeizureElement.nativeElement.textContent).toContain('5 minutes'); // system time is set in beforeEach
  });

  it('should show no data if last seizure is empty', async () => {
    // given
    const seizures: Seizure[] = [];
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of(seizures));
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of());

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const lastSeizureElement = fixture.debugElement.query(By.css('.last-seizure mat-card-content'));
    expect(lastSeizureElement.nativeElement.textContent.toLowerCase()).toContain('unknown');
  });

  it('should show error if last seizure data throw error', async () => {
    // given
    const errorMsg = 'Some last seizure error!';
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(throwError(() => new Error(errorMsg)));
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of());

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
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of());

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

  // ------------------------------------------------------------------------------
  // Events section
  // ------------------------------------------------------------------------------

  it('should show events data', async () => {
    // given
    const events: Event[] = [
      {
        objectType: 'EVENT',
        id: 'e1',
        name: 'Lorem ipsum 1',
        occurred: moment('2021-02-15')
      },
      {
        objectType: 'EVENT',
        id: 'e2',
        name: 'Lorem ipsum 2',
        occurred: moment('2021-01-12')
      }
    ];
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of());
    dashboardServiceSpy.lastEvents.and.returnValue(of(events));
    dashboardServiceSpy.lastPeriods.and.returnValue(of());

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const evNameElements = fixture.debugElement.queryAll(By.css('.event-name'));
    const evOccurredElements = fixture.debugElement.queryAll(By.css('.event-occurred'));
    expect(evNameElements.length).toBe(events.length);
    for (let i = 0; i < events.length; i++) {
      expect(evNameElements[i].nativeElement.textContent).toContain(events[i].name);
      expect(evOccurredElements[i].nativeElement.textContent).toContain(
        events[i].occurred.format('LL')
      );
    }
  });

  it('should show no data if events list is empty', async () => {
    // given
    const events: Event[] = [];
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of());
    dashboardServiceSpy.lastEvents.and.returnValue(of(events));
    dashboardServiceSpy.lastPeriods.and.returnValue(of());

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const evCardElement = fixture.debugElement.query(By.css('.events'));
    expect(evCardElement.nativeElement.textContent).toContain('No data');
  });

  it('should show error if events data throw error', async () => {
    // given
    const errorMsg = 'Some events error!';
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of());
    dashboardServiceSpy.lastEvents.and.returnValue(throwError(() => new Error(errorMsg)));
    dashboardServiceSpy.lastPeriods.and.returnValue(of());

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const errorCardElement = fixture.debugElement.query(By.directive(ErrorCardComponent));
    expect(errorCardElement.nativeElement.textContent).toContain(errorMsg);
  });

  it('should show loading indicator on events data load', fakeAsync(() => {
    // given
    const spinnerElementQuery = By.css('.events mat-progress-spinner');
    const events: Event[] = [];
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of());
    dashboardServiceSpy.lastEvents.and.returnValue(of(events).pipe(delay(100)));
    dashboardServiceSpy.lastPeriods.and.returnValue(of());

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

  // ------------------------------------------------------------------------------
  // Periods section
  // ------------------------------------------------------------------------------

  it('should show current period data', async () => {
    // given
    authServiceSpy.userDetails$.and.returnValue(of(mockUserData));
    const periods: Period[] = [
      {
        objectType: 'PERIOD',
        id: 'p1',
        startDate: moment('2021-05-11T00:00:00')
      }
    ];
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of());
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of(periods));

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const lastPeriodTitle = fixture.debugElement.query(By.css('.last-period mat-card-subtitle'));
    expect(lastPeriodTitle).toBeTruthy();
    expect(lastPeriodTitle.nativeElement.textContent).toContain(periods[0].startDate.format('LL'));

    const lastPeriodElement = fixture.debugElement.query(By.css('.last-period mat-card-content'));
    expect(lastPeriodElement).toBeTruthy();
    expect(lastPeriodElement.nativeElement.textContent).toContain('4 days'); // system time is set in beforeEach
  });

  it('should show last period data', async () => {
    // given
    authServiceSpy.userDetails$.and.returnValue(of(mockUserData));
    const periods: Period[] = [
      {
        objectType: 'PERIOD',
        id: 'p1',
        startDate: moment('2021-05-08T12:05:00'),
        endDate: moment('2021-05-15T12:05:00')
      }
    ];
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of());
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of(periods));

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const lastPeriodTitle = fixture.debugElement.query(By.css('.last-period mat-card-subtitle'));
    expect(lastPeriodTitle).toBeTruthy();
    expect(lastPeriodTitle.nativeElement.textContent).toContain(periods[0].startDate.format('LL'));
    expect(lastPeriodTitle.nativeElement.textContent).toContain(periods[0].endDate?.format('LL'));

    const lastPeriodElement = fixture.debugElement.query(By.css('.last-period mat-card-content'));
    expect(lastPeriodElement).toBeTruthy();
    expect(lastPeriodElement.nativeElement.textContent).toContain('a few seconds'); // system time is set in beforeEach
  });

  it('should show no data if last period is empty', async () => {
    // given
    authServiceSpy.userDetails$.and.returnValue(of(mockUserData));
    const periods: Period[] = [];
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of());
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of(periods));

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const lastPeriodElement = fixture.debugElement.query(By.css('.last-period mat-card-content'));
    expect(lastPeriodElement).toBeTruthy();
    expect(lastPeriodElement.nativeElement.textContent.toLowerCase()).toContain('no data');
  });

  it('should show error if last period data throw error', async () => {
    // given
    authServiceSpy.userDetails$.and.returnValue(of(mockUserData));
    const errorMsg = 'Some last period error!';
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of());
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(throwError(() => new Error(errorMsg)));

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const errorCardElement = fixture.debugElement.query(By.directive(ErrorCardComponent));
    expect(errorCardElement.nativeElement.textContent).toContain(errorMsg);
  });

  it('should show loading indicator on last period data load', fakeAsync(() => {
    // given
    authServiceSpy.userDetails$.and.returnValue(of(mockUserData));
    const spinnerElementQuery = By.css('.last-period mat-progress-spinner');
    const periods: Period[] = [];
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of());
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of(periods).pipe(delay(100)));

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

  it('should show loading indicator on user details data load', fakeAsync(() => {
    // given
    authServiceSpy.userDetails$.and.returnValue(of(mockUserData).pipe(delay(100)));
    const spinnerElementQuery = By.css('.last-period mat-progress-spinner');
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of());
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of([]).pipe(delay(100)));

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    expect(fixture.debugElement.queryAll(spinnerElementQuery).length).toBe(1);
    tick(100);
    fixture.detectChanges(); // tick - load user data
    tick(100);
    fixture.detectChanges(); // tick - load periods
    expect(fixture.debugElement.queryAll(spinnerElementQuery).length).toBe(0);
  }));

  it('should not display last period if not a female', fakeAsync(() => {
    // given
    authServiceSpy.userDetails$.and.returnValue(of({ ...mockUserData, isFemale: false }));
    dashboardServiceSpy.currentMedications.and.returnValue(of());
    dashboardServiceSpy.lastSeizures.and.returnValue(of());
    dashboardServiceSpy.lastEvents.and.returnValue(of());
    dashboardServiceSpy.lastPeriods.and.returnValue(of());

    // when
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    expect(fixture.debugElement.query(By.css('.last-period'))).toBeFalsy();
  }));
});
