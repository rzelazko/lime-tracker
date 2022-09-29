import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChartHeatmapService } from './../../../../shared/services/chart-heatmap.service';
import { ChartHeatmapComponent } from './chart-heatmap.component';

describe('ChartHeatmapComponent', () => {
  let component: ChartHeatmapComponent;
  let fixture: ComponentFixture<ChartHeatmapComponent>;
  let chartServiceSpy: jasmine.SpyObj<ChartHeatmapService>;

  beforeEach(async () => {
    const chartServiceSpyObj = jasmine.createSpyObj('ChartHeatmapService', ['seizureSerie']);

    await TestBed.configureTestingModule({
      declarations: [ChartHeatmapComponent],
      providers: [{ provide: ChartHeatmapService, useValue: chartServiceSpyObj }],
      imports: [
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

  // TODO add tests
});
