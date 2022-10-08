import { TestBed } from '@angular/core/testing';

import { ChartSeizuresByHoursService } from './chart-seizures-by-hours.service';

describe('ChartSeizuresByHoursService', () => {
  let service: ChartSeizuresByHoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartSeizuresByHoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
