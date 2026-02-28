import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from './../../../app-routing.module';
import { ErrorCardComponent } from './../../../shared/error-card/error-card.component';
import { Report } from './../../../shared/models/report.model';
import { EndOfPipe } from './../../../shared/pipes/end-of.pipe';
import { HumanizePipe } from './../../../shared/pipes/humanize.pipe';
import { JoinPipe } from './../../../shared/pipes/join.pipe';
import { MomentPipe } from './../../../shared/pipes/moment.pipe';
import { StartOfPipe } from './../../../shared/pipes/start-of.pipe';
import { ReportsService } from './../../../shared/services/reports.service';
import { YearsnavComponent } from './../../components/yearsnav/yearsnav.component';
import { ReportsComponent } from './reports.component';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let reportsServiceSpy: jasmine.SpyObj<ReportsService>;
  let activatedRoute: ActivatedRoute;

  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async () => {
    const reportsServiceSpyObj = jasmine.createSpyObj('ReportsService', ['getReports']);
    const activatedRouteMockObj = { params: of() };

    await TestBed.configureTestingModule({
      declarations: [
        ErrorCardComponent,
        ReportsComponent,
        YearsnavComponent,

        EndOfPipe,
        HumanizePipe,
        JoinPipe,
        MomentPipe,
        StartOfPipe,
      ],
      providers: [
        { provide: ReportsService, useValue: reportsServiceSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteMockObj },
      ],
      imports: [
        AppRoutingModule,
        NoopAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
      ],
    }).compileComponents();
    reportsServiceSpy = TestBed.inject(ReportsService) as jasmine.SpyObj<ReportsService>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(moment('2021-05-15T12:00:00', 'YYYY-MM-DDTHH:mm:ss').toDate());

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have valid title', () => {
    // given
    const report: Report = {
      dateFrom: moment('2020-01-01'),
      dateTo: moment('2020-12-31'),
      monthsData: [],
    };
    reportsServiceSpy.getReports.and.returnValue(of(report));

    // when
    fixture.detectChanges();

    // then
    expect(component).toBeTruthy();
    const titleElement = fixture.debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent).toContain(report.dateFrom.format('L'));
    expect(titleElement.nativeElement.textContent).toContain(report.dateTo.format('L'));
  });

  it('should shows error if reports generation problem', () => {
    // given
    const errorMsg = 'Some error';
    reportsServiceSpy.getReports.and.returnValue(throwError(() => new Error(errorMsg)));

    // when
    fixture.detectChanges();

    // then
    expect(component).toBeTruthy();
    const errorElement = fixture.debugElement.query(By.directive(ErrorCardComponent));
    expect(errorElement.nativeElement.textContent).toContain(errorMsg);
  });

  it('should contain data for returned months', () => {
    // given
    const report: Report = {
      dateFrom: moment('2020-01-01'),
      dateTo: moment('2020-12-31'),
      monthsData: [
        {
          month: moment('2020-01-01'),
          data: [
            {
              objectType: 'EVENT',
              id: 'e1',
              name: 'Test Event',
              occurred: moment('2020-01-15'),
            },
          ],
        },
        {
          month: moment('2020-02-01'),
          data: [
            {
              objectType: 'MEDICATION',
              id: 'm1',
              name: 'Lorem ipsum',
              doses: {
                morning: 125,
                noon: 0,
                evening: 125,
              },
              startDate: moment('2020-02-15'),
              archived: false,
              useStartDate: true
            },
            {
              objectType: 'SEIZURE',
              id: 's1',
              occurred: moment('2020-02-16T12:05:00'),
              duration: moment.duration(5, 'minutes'),
              type: 'some seizure type',
              triggers: ['trigger 1', 'trigger 2'],
            },
          ],
        },
        {
          month: moment('2020-03-01'),
          data: [
            {
              objectType: 'PERIOD',
              id: 'p1',
              startDate: moment('2020-03-20'),
              useStartDate: true
            },
            {
              objectType: 'PERIOD',
              id: 'p1',
              startDate: moment('2020-03-27'),
              useStartDate: false
            },
          ],
        },
      ],
    };
    reportsServiceSpy.getReports.and.returnValue(of(report));

    // when
    fixture.detectChanges();

    // then
    const monthElements = fixture.debugElement.queryAll(By.css('.report-month'));
    const caseElements = fixture.debugElement.queryAll(By.css('mat-list-item'));
    expect(monthElements.length).toBe(3);
    expect(caseElements.length).toBe(5);
  });
});
