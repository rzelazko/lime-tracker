import { TestBed } from '@angular/core/testing';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { ChartHeatmapService } from './chart-heatmap.service';
import { SeizuresService } from './seizures.service';

const moment = extendMoment(Moment);

describe('ChartHeatmapService', () => {
  let service: ChartHeatmapService;

  let seizuresServiceSpy: jasmine.SpyObj<SeizuresService>;

  beforeEach(() => {
    const seizuresServiceSpyObj = jasmine.createSpyObj('SeizuresService', ['listCollection']);

    TestBed.configureTestingModule({
      providers: [
        ChartHeatmapService,
        { provide: SeizuresService, useValue: seizuresServiceSpyObj },
      ],
    });
    service = TestBed.inject(ChartHeatmapService);
    seizuresServiceSpy = TestBed.inject(SeizuresService) as jasmine.SpyObj<SeizuresService>;
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(moment('2021-05-15T12:00:00', 'YYYY-MM-DDTHH:mm:ss').toDate());
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO add tests
});
