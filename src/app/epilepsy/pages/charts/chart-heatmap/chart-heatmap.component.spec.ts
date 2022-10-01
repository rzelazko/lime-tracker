import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { delay, of, throwError } from 'rxjs';
import { ErrorCardComponent } from './../../../../shared/error-card/error-card.component';
import { ChartData } from './../../../../shared/models/chart-data.model';
import { ChartHeatmapService } from './../../../../shared/services/chart-heatmap.service';
import { ChartHeatmapComponent } from './chart-heatmap.component';

describe('ChartHeatmapComponent', () => {
  let component: ChartHeatmapComponent;
  let fixture: ComponentFixture<ChartHeatmapComponent>;
  let chartServiceSpy: jasmine.SpyObj<ChartHeatmapService>;

  beforeEach(async () => {
    const chartServiceSpyObj = jasmine.createSpyObj('ChartHeatmapService', [
      'setYear',
      'subtitle',
      'seizureSerie',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ChartHeatmapComponent, ErrorCardComponent],
      providers: [{ provide: ChartHeatmapService, useValue: chartServiceSpyObj }],
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
    chartServiceSpy = TestBed.inject(ChartHeatmapService) as jasmine.SpyObj<ChartHeatmapService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show progress spinner on load', fakeAsync(() => {
    // given
    const chartData: ChartData[] = [];
    chartServiceSpy.seizureSerie.and.returnValue(of(chartData).pipe(delay(100)));

    // when
    component.ngOnChanges({});
    fixture.detectChanges();

    // then
    expect(fixture.debugElement.queryAll(By.directive(MatProgressSpinner)).length).toBe(1);
    component.ngOnChanges({});
    tick(100);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.directive(MatProgressSpinner)).length).toBe(0);
  }));

  it('should show chart when seizureSerie ready', async () => {
    // given
    const chartData: ChartData[] = [];
    chartServiceSpy.seizureSerie.and.returnValue(of(chartData));

    // when
    component.ngOnChanges({});
    fixture.detectChanges();

    // then
    expect(fixture.debugElement.queryAll(By.directive(MatProgressSpinner)).length).toBe(0);
    expect(fixture.debugElement.queryAll(By.directive(ChartComponent)).length).toBe(1);
  });

  it('should show error from Error object', () => {
    // given
    chartServiceSpy.seizureSerie.and.returnValue(throwError(() => new Error('test message')));

    // when
    component.ngOnChanges({});
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
    component.ngOnChanges({});
    fixture.detectChanges();

    // then
    expect(fixture.debugElement.queryAll(By.directive(MatProgressSpinner)).length).toBe(0);
    expect(fixture.debugElement.queryAll(By.directive(ErrorCardComponent)).length).toBe(1);
    expect(
      fixture.debugElement.query(By.directive(ErrorCardComponent)).nativeElement.textContent
    ).toContain('Error: test message');
  });
});
