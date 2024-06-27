import { TestBed } from '@angular/core/testing';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { of } from 'rxjs';
import { ChartData } from '../models/chart-data.model';
import { Seizure } from '../models/seizure.model';
import { ChartHeatmapService } from './chart-heatmap.service';
import { SeizuresService } from './seizures.service';

const moment = extendMoment(Moment as any);

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

  it('should have valid amount of series and days for year with 365 days', async () => {
    // given
    service.setYear(2019);
    const seizuresList: Seizure[] = [];
    seizuresServiceSpy.listCollection.and.returnValue(of(seizuresList));

    // when
    const seizuresSerie$ = service.seizureSerie();

    // then
    seizuresSerie$.subscribe((seizuresSerie: ChartData[]) => {
      expect(seizuresSerie.length).toBe(5);
      for (let i = 0; i < seizuresSerie.length; i++) {
        expect(seizuresSerie[i].data.length).toBe(73);
      }
    });
  });

  it('should have valid amount of series and days for year with 366 days', async () => {
    // given
    service.setYear(2020);
    const seizuresList: Seizure[] = [];
    seizuresServiceSpy.listCollection.and.returnValue(of(seizuresList));

    // when
    const seizuresSerie$ = service.seizureSerie();

    // then
    seizuresSerie$.subscribe((seizuresSerie: ChartData[]) => {
      expect(seizuresSerie.length).toBe(6);
      for (let i = 0; i < seizuresSerie.length; i++) {
        expect(seizuresSerie[i].data.length).toBe(61);
      }
    });
  });

  it('should have valid values', async () => {
    // given
    service.setYear(2019);
    const seizuresList: Seizure[] = [
      {
        objectType: 'SEIZURE',
        id: 's1',
        occurred: moment('2019-01-01 00:00:00'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
      {
        objectType: 'SEIZURE',
        id: 's2',
        occurred: moment('2019-01-01 00:00:01'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
      {
        objectType: 'SEIZURE',
        id: 's3',
        occurred: moment('2019-01-01 23:59:59'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
      {
        objectType: 'SEIZURE',
        id: 's4',
        occurred: moment('2019-07-12 12:00:00'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
      {
        objectType: 'SEIZURE',
        id: 's5',
        occurred: moment('2019-12-31 01:00:00'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
      {
        objectType: 'SEIZURE',
        id: 's6',
        occurred: moment('2019-12-31 10:00:00'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
    ];
    seizuresServiceSpy.listCollection.and.returnValue(of(seizuresList));

    // when
    const seizuresSerie$ = service.seizureSerie();

    // then
    seizuresSerie$.subscribe((seizuresSerie: ChartData[]) => {
      let totalVerfiedDays = 0;
      const label0101 = moment('2019-01-01').format('LL');
      const label0712 = moment('2019-07-12').format('LL');
      const label1231 = moment('2019-12-31').format('LL');
      for (let i = 0; i < seizuresSerie.length; i++) {
        for (let j = 0; j < seizuresSerie[i].data.length; j++) {
          const data = seizuresSerie[i].data[j];
          if (data.label === label0101) {
            expect(data.y).toBe(3);
          } else if (data.label === label0712) {
            expect(data.y).toBe(1);
          } else if (data.label === label1231) {
            expect(data.y).toBe(2);
          } else {
            expect(data.y).toBe(0);
          }
          totalVerfiedDays++;
        }
      }
      expect(totalVerfiedDays).toBe(365);
    });
  });
});
