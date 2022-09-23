import { TestBed } from '@angular/core/testing';

import { ChartHeatmapService } from './chart-heatmap.service';

describe('ChartHeatmapService', () => {
  let service: ChartHeatmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartHeatmapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
