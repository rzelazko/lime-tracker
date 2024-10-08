import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import ApexCharts from 'apexcharts';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { delay, of, throwError } from 'rxjs';
import { ErrorCardComponent } from './../../../../shared/error-card/error-card.component';
import { ChartData } from './../../../../shared/models/chart-data.model';
import { ChartSeizuresByHoursService } from './../../../../shared/services/chart-seizures-by-hours.service';
import { ChartSeizuresByHoursComponent } from './chart-seizures-by-hours.component';

describe('ChartSeizuresByHoursComponent', () => {
  let component: ChartSeizuresByHoursComponent;
  let fixture: ComponentFixture<ChartSeizuresByHoursComponent>;
  let chartServiceSpy: jasmine.SpyObj<ChartSeizuresByHoursService>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const chartServiceSpyObj = jasmine.createSpyObj('ChartSeizuresByHoursService', [
      'setYear',
      'subtitle',
      'seizureSerie',
    ]);
    const activatedRouteMockObj = { params: of({ year: '2021' }) };

    await TestBed.configureTestingModule({
      declarations: [ChartSeizuresByHoursComponent, ErrorCardComponent],
      providers: [
        { provide: ChartSeizuresByHoursService, useValue: chartServiceSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteMockObj },
        { provide: ApexCharts, useValue: ApexCharts },
      ],
      imports: [
        NgApexchartsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
      ],
    }).compileComponents();
    chartServiceSpy = TestBed.inject(
      ChartSeizuresByHoursService
    ) as jasmine.SpyObj<ChartSeizuresByHoursService>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSeizuresByHoursComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show progress spinner on load', fakeAsync(() => {
    // given
    const chartData: ChartData = { data: [] };
    chartServiceSpy.seizureSerie.and.returnValue(of(chartData).pipe(delay(100)));

    // when
    fixture.detectChanges();

    // then
    expect(fixture.debugElement.queryAll(By.directive(MatProgressSpinner)).length).toBe(1);
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.directive(MatProgressSpinner)).length).toBe(0);
    flush();
  }));

  it('should show chart when seizureSerie ready', async () => {
    // given
    const chartData: ChartData = { data: [] };
    chartServiceSpy.seizureSerie.and.returnValue(of(chartData));

    // when
    fixture.detectChanges();

    // then
    expect(fixture.debugElement.queryAll(By.directive(MatProgressSpinner)).length).toBe(0);
    expect(fixture.debugElement.queryAll(By.directive(ChartComponent)).length).toBe(1);
  });

  it('should show error from Error object', () => {
    // given
    chartServiceSpy.seizureSerie.and.returnValue(throwError(() => new Error('test message')));

    // when
    fixture.detectChanges();

    // then
    expect(fixture.debugElement.queryAll(By.directive(MatProgressSpinner)).length).toBe(0);
    expect(fixture.debugElement.queryAll(By.directive(ErrorCardComponent)).length).toBe(1);
    expect(
      fixture.debugElement.query(By.directive(ErrorCardComponent)).nativeElement.textContent
    ).toContain('Error: test message');
  });

  it('should show error from string', () => {
    // given
    chartServiceSpy.seizureSerie.and.returnValue(throwError(() => `test message`));

    // when
    fixture.detectChanges();

    // then
    expect(fixture.debugElement.queryAll(By.directive(MatProgressSpinner)).length).toBe(0);
    expect(fixture.debugElement.queryAll(By.directive(ErrorCardComponent)).length).toBe(1);
    expect(
      fixture.debugElement.query(By.directive(ErrorCardComponent)).nativeElement.textContent
    ).toContain('Error: test message');
  });
});
