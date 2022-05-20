import { TestBed } from '@angular/core/testing';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { of } from 'rxjs';
import { Event } from '../models/event.model';
import { Medication } from '../models/medication.model';
import { Seizure } from '../models/seizure.model';
import { ChartSummaryService } from './chart-summary.service';
import { EventsService } from './events.service';
import { MedicationsService } from './medications.service';
import { SeizuresService } from './seizures.service';

const moment = extendMoment(Moment);

describe('ChartSummaryService', () => {
  let chartSummaryService: ChartSummaryService;

  let medsServiceSpy: jasmine.SpyObj<MedicationsService>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let seizuresServiceSpy: jasmine.SpyObj<SeizuresService>;

  beforeEach(() => {
    const medicationsServiceSpyObj = jasmine.createSpyObj('MedicationsService', ['listCollection']);
    const eventsServiceSpyObj = jasmine.createSpyObj('EventsService', ['listCollection']);
    const seizuresServiceSpyObj = jasmine.createSpyObj('SeizuresService', ['listCollection']);

    TestBed.configureTestingModule({
      providers: [
        ChartSummaryService,
        { provide: MedicationsService, useValue: medicationsServiceSpyObj },
        { provide: EventsService, useValue: eventsServiceSpyObj },
        { provide: SeizuresService, useValue: seizuresServiceSpyObj },
      ],
    });
    chartSummaryService = TestBed.inject(ChartSummaryService);
    medsServiceSpy = TestBed.inject(MedicationsService) as jasmine.SpyObj<MedicationsService>;
    eventsServiceSpy = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
    seizuresServiceSpy = TestBed.inject(SeizuresService) as jasmine.SpyObj<SeizuresService>;
  });

  it('should be created', () => {
    expect(chartSummaryService).toBeTruthy();
  });

  it('should contain medication from previous year', async () => {
    // given
    const medicationList: Medication[] = [
      {
        id: 'm1',
        name: 'med1',
        doses: { morning: 100, noon: 200, evening: 300 },
        startDate: moment('2020-01-01'),
        archived: false,
      },
    ];

    chartSummaryService.setYear(2021);
    medsServiceSpy.listCollection.and.returnValue(of(medicationList));

    // when
    const meds$ = chartSummaryService.medicationsSeries();

    // then
    meds$.subscribe((medicationsSeries) => {
      expect(medicationsSeries.length).toBe(1);
      expect(medicationsSeries[0].data.length).toBe(12);
      for (const data of medicationsSeries[0].data) {
        expect(data.y).toBe(600);
      }
    });
  });

  it('should contain medication started and ended witin same month', async () => {
    // given
    const medicationList: Medication[] = [
      {
        id: 'm1',
        name: 'med1',
        doses: { morning: 0, noon: 5, evening: 0 },
        startDate: moment('2021-06-25'),
        archived: true,
        endDate: moment('2021-06-28'),
      },
    ];

    chartSummaryService.setYear(2021);
    medsServiceSpy.listCollection.and.returnValue(of(medicationList));

    // when
    const meds$ = chartSummaryService.medicationsSeries();

    // then
    meds$.subscribe((medicationsSeries) => {
      expect(medicationsSeries.length).toBe(1);
      expect(medicationsSeries[0].data.length).toBe(12);
      for (let i = 0; i < 12; i++) {
        const month = moment().month(i).format(chartSummaryService.rangeFormat);
        const data = medicationsSeries[0].data[i];

        expect(data.x).toBe(month);
        if (i == 5) {
          expect(data.y).toBe(5);
        } else {
          expect(data.y).toBe(0);
        }
      }
    });
  });

  it('should contain only medications series valid within given year', async () => {
    // given
    const medicationList: Medication[] = [
      {
        id: 'm1',
        name: 'med1',
        doses: { morning: 0, noon: 1, evening: 0 },
        startDate: moment('2020-01-01'),
        archived: true,
        endDate: moment('2021-01-01'),
      },
      {
        id: 'm2',
        name: 'med2',
        doses: { morning: 0, noon: 0, evening: 2 },
        startDate: moment('2021-10-15'),
        archived: true,
        endDate: moment('2021-12-30'),
      },
      {
        id: 'm3',
        name: 'med2',
        doses: { morning: 0, noon: 0, evening: 1 },
        startDate: moment('2021-12-31'),
        archived: false,
      },
      {
        id: 'm4',
        name: 'med3',
        doses: { morning: 5, noon: 0, evening: 5 },
        startDate: moment('2020-01-01'),
        archived: true,
        endDate: moment('2020-12-31'),
      },
    ];

    chartSummaryService.setYear(2021);
    medsServiceSpy.listCollection.and.returnValue(of(medicationList));

    // when
    const meds$ = chartSummaryService.medicationsSeries();

    // then
    meds$.subscribe((medicationsSeries) => {
      expect(medicationsSeries.length).toBe(2);
      expect(medicationsSeries[0].name).toBe('med1');
      expect(medicationsSeries[1].name).toBe('med2');
    });
  });

  it('should not contain medications series if no medications', async () => {
    // given
    const medicationList: Medication[] = [];

    chartSummaryService.setYear(2021);
    medsServiceSpy.listCollection.and.returnValue(of(medicationList));

    // when
    const meds$ = chartSummaryService.medicationsSeries();

    // then
    meds$.subscribe((medicationsSeries) => {
      expect(medicationsSeries.length).toBe(0);
    });
  });

  it('should group events for month', async () => {
    // given
    const eventsList: Event[] = [
      { id: 'e1', name: 'Event 1', occurred: moment('2021-03-01') },
      { id: 'e2', name: 'Event 2', occurred: moment('2021-03-31') },
    ];

    chartSummaryService.setYear(2021);
    eventsServiceSpy.listCollection.and.returnValue(of(eventsList));

    // when
    const events$ = chartSummaryService.eventsSerie();

    // then
    events$.subscribe((eventsSerie) => {
      expect(eventsSerie.data?.length).toBe(12);
      expect(eventsSerie.labels?.length).toBe(12);
      expect(eventsSerie.data[2].y).toBe(2);
      if (eventsSerie.labels) {
        expect(eventsSerie.labels[2]).toBe('Event 1, Event 2');
      } else {
        fail('Events labels undefined');
      }
    });
  });

  it('should hide events serie if no events', async () => {
    // given
    const eventsList: Event[] = [];

    chartSummaryService.setYear(2021);
    eventsServiceSpy.listCollection.and.returnValue(of(eventsList));

    // when
    const events$ = chartSummaryService.eventsSerie();

    // then
    events$.subscribe((eventsSerie) => {
      expect(eventsSerie.data?.length).toBe(12);
      for (let i = 0; i < 12; i++) {
        expect(eventsSerie.data[i].y).toBe(-1);
      }
    });
  });

  it('should count seizures correctly', async () => {
    // given
    const seizuresList: Seizure[] = [
      {
        id: 's1',
        occurred: moment('2021-01-01 00:00:00'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
      {
        id: 's2',
        occurred: moment('2021-01-01 00:00:01'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
      {
        id: 's3',
        occurred: moment('2021-01-01 23:59:59'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
      {
        id: 's4',
        occurred: moment('2021-07-12 12:00:00'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
      {
        id: 's5',
        occurred: moment('2021-12-31 01:00:00'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
      {
        id: 's6',
        occurred: moment('2021-12-31 10:00:00'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
    ];

    chartSummaryService.setYear(2021);
    seizuresServiceSpy.listCollection.and.returnValue(of(seizuresList));

    // when
    const seizures$ = chartSummaryService.seizureSerie();

    // then
    seizures$.subscribe((seizuresSerie) => {
      expect(seizuresSerie.data?.length).toBe(12);
      for (let i = 0; i < 12; i++) {
        if (i == 0) {
          expect(seizuresSerie.data[i].y).toBe(3);
        } else if (i == 6) {
          expect(seizuresSerie.data[i].y).toBe(1);
        } else if (i == 11) {
          expect(seizuresSerie.data[i].y).toBe(2);
        } else {
          expect(seizuresSerie.data[i].y).toBe(0);
        }
      }
    });
  });
});
