import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import * as moment from 'moment';
import { of } from 'rxjs';
import { AppRoutingModule } from './../../../app-routing.module';
import { ErrorCardComponent } from './../../../shared/error-card/error-card.component';
import { PageData } from './../../../shared/models/page-data.model';
import { Period } from './../../../shared/models/period.model';
import { HumanizePipe } from './../../../shared/pipes/humanize.pipe';
import { MomentPipe } from './../../../shared/pipes/moment.pipe';
import { TimeSincePipe } from './../../../shared/pipes/time-since.pipe';
import { PeriodsService } from './../../../shared/services/periods.service';
import { TableComponent } from './../../components/table/table.component';

import { PeriodsComponent } from './periods.component';

describe('PeriodsComponent', () => {
  let component: PeriodsComponent;
  let periodsServiceSpy: jasmine.SpyObj<PeriodsService>;
  let fixture: ComponentFixture<PeriodsComponent>;

  beforeEach(async () => {
    const periodsServiceSpyObj = jasmine.createSpyObj('PeriodsService', [
      'listConcatenated',
      'resetConcatenated',
      'delete',
    ]);
    await TestBed.configureTestingModule({
      declarations: [
        PeriodsComponent,
        ErrorCardComponent,
        TableComponent,
        HumanizePipe,
        MomentPipe,
        TimeSincePipe,
      ],
      providers: [{ provide: PeriodsService, useValue: periodsServiceSpyObj }],
      imports: [
        AppRoutingModule,
        NoopAnimationsModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatToolbarModule,
      ],
    }).compileComponents();

    periodsServiceSpy = TestBed.inject(PeriodsService) as jasmine.SpyObj<PeriodsService>;
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(moment('2021-05-15T12:00:00', 'YYYY-MM-DDTHH:mm:ss').toDate());
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    // given
    periodsServiceSpy.listConcatenated.and.returnValue(of());

    // when
    fixture = TestBed.createComponent(PeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    expect(component).toBeTruthy();
  });

  it('should show row for each period from service', () => {
    // given
    const periodsData: PageData<Period> = {
      hasMore: false,
      data: [
        { objectType: 'PERIOD', id: 'p1', startDate: moment('2021-05-10') },
        {
          objectType: 'PERIOD',
          id: 'p2',
          startDate: moment('2021-04-10'),
          endDate: moment('2021-04-16'),
        },
      ],
    };
    periodsServiceSpy.listConcatenated.and.returnValue(of(periodsData));

    // when
    fixture = TestBed.createComponent(PeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // then
    const rows = fixture.debugElement.queryAll(By.css('tr'));
    expect(rows.length).toBe(3);
  });
});
