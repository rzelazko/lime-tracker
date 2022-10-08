import { TestBed } from '@angular/core/testing';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { ChartSeizuresByHoursService } from './chart-seizures-by-hours.service';
import { SeizuresService } from './seizures.service';

const moment = extendMoment(Moment);

describe('ChartSeizuresByHoursService', () => {
  let service: ChartSeizuresByHoursService;
  let seizuresServiceSpy: jasmine.SpyObj<SeizuresService>;

  beforeEach(() => {
    const seizuresServiceSpyObj = jasmine.createSpyObj('SeizuresService', ['listCollection']);

    TestBed.configureTestingModule({
      providers: [
        ChartSeizuresByHoursService,
        { provide: SeizuresService, useValue: seizuresServiceSpyObj },
      ],
    });

    service = TestBed.inject(ChartSeizuresByHoursService);
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
});
