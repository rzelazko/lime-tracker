import { TestBed } from '@angular/core/testing';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { of } from 'rxjs';
import { ChartData } from '../models/chart-data.model';
import { Seizure } from '../models/seizure.model';
import { ChartSeizuresByHoursService } from './chart-seizures-by-hours.service';
import { SeizuresService } from './seizures.service';

const moment = extendMoment(Moment as any);

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
    jasmine.clock().mockDate(moment('2021-08-15T12:00:00', 'YYYY-MM-DDTHH:mm:ss').toDate());
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should cover all hours', async () => {
    const seizuresList: Seizure[] = seizureListForHours([...Array(24).keys()]);
    seizuresServiceSpy.listCollection.and.returnValue(of(seizuresList));

    // when
    const seizuresSerie$ = service.seizureSerie();

    // then
    seizuresSerie$.subscribe((seizuresSerie: ChartData) => {
      expect(seizuresSerie.data.length).toBe(24);
      for (let i = 0; i < seizuresSerie.data.length; i++) {
        expect(seizuresSerie.data[i].y).toBe(1);
      }
    });
  });

  it('should not be distracted by gaps', async () => {
    const seizuresList: Seizure[] = seizureListForHours([7, 20, 20]);
    seizuresServiceSpy.listCollection.and.returnValue(of(seizuresList));

    // when
    const seizuresSerie$ = service.seizureSerie();

    // then
    seizuresSerie$.subscribe((seizuresSerie: ChartData) => {
      expect(seizuresSerie.data.length).toBe(24);
      for (let i = 0; i < seizuresSerie.data.length; i++) {
        if (i === 7) {
          expect(seizuresSerie.data[i].y).toBe(1);
        } else if (i === 20) {
          expect(seizuresSerie.data[i].y).toBe(2);
        } else {
          expect(seizuresSerie.data[i].y).toBe(0);
        }
      }
    });
  });

  it('should have valid serie names even when no data', async () => {
    const seizuresList: Seizure[] = [];
    seizuresServiceSpy.listCollection.and.returnValue(of(seizuresList));

    // when
    const seizuresSerie$ = service.seizureSerie();

    // then
    seizuresSerie$.subscribe((seizuresSerie: ChartData) => {
      expect(seizuresSerie.data.length).toBe(24);
      for (let i = 0; i < seizuresSerie.data.length; i++) {
        expect(seizuresSerie.data[i].x).toContain(String(i));
      }
    });
  });

  const seizureListForHours = (hours:number[]):Seizure[] => {
    const seizuresList: Seizure[] = [];
    for (let i = 0; i < hours.length; i++) {
      const hour = String(hours[i]).padStart(2, '0');
      const day = String((i + 1) % 31).padStart(2, '0');

      seizuresList.push({
        objectType: 'SEIZURE',
        id: `s-${day}-${hour}`,
        occurred: moment(`2021-07-${day} ${hour}:00:00`),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      });
    }
    return seizuresList;
  }
});
