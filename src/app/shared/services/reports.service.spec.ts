import { TestBed } from '@angular/core/testing';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { of, takeLast } from 'rxjs';
import { Event } from './../models/event.model';
import { Medication } from './../models/medication.model';
import { Period } from './../models/period.model';
import { Seizure } from './../models/seizure.model';
import { EventsService } from './events.service';
import { MedicationsService } from './medications.service';
import { PeriodsService } from './periods.service';
import { ReportsService } from './reports.service';
import { SeizuresService } from './seizures.service';

const moment = extendMoment(Moment);

describe('ReportsService', () => {
  const reportCurrntMonths = ['May', 'Apr', 'Mar', 'Feb', 'Jan', 'Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun'];
  const reportByYearMonths = ['Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan'];

  let reportsService: ReportsService;

  let medsServiceSpy: jasmine.SpyObj<MedicationsService>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let seizuresServiceSpy: jasmine.SpyObj<SeizuresService>;
  let periodsServiceSpy: jasmine.SpyObj<PeriodsService>;

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(moment('2021-05-15T12:00:00', 'YYYY-MM-DDTHH:mm:ss').toDate());

    const medicationsServiceSpyObj = jasmine.createSpyObj('MedicationsService', ['listCollection']);
    const eventsServiceSpyObj = jasmine.createSpyObj('EventsService', ['listCollection']);
    const seizuresServiceSpyObj = jasmine.createSpyObj('SeizuresService', ['listCollection']);
    const periodsServiceSpyObj = jasmine.createSpyObj('PeriodsService', ['listCollection']);

    TestBed.configureTestingModule({
      providers: [
        ReportsService,
        { provide: MedicationsService, useValue: medicationsServiceSpyObj },
        { provide: EventsService, useValue: eventsServiceSpyObj },
        { provide: SeizuresService, useValue: seizuresServiceSpyObj },
        { provide: PeriodsService, useValue: periodsServiceSpyObj },
      ],
    });
    reportsService = TestBed.inject(ReportsService);
    medsServiceSpy = TestBed.inject(MedicationsService) as jasmine.SpyObj<MedicationsService>;
    eventsServiceSpy = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
    seizuresServiceSpy = TestBed.inject(SeizuresService) as jasmine.SpyObj<SeizuresService>;
    periodsServiceSpy = TestBed.inject(PeriodsService) as jasmine.SpyObj<PeriodsService>;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(reportsService).toBeTruthy();
  });

  it('should return valid range for current period', async () => {
    // given
    const medicationList: Medication[] = [];
    const eventsList: Event[] = [];
    const seizuresList: Seizure[] = [];
    const periodsList: Period[] = [];

    medsServiceSpy.listCollection.and.returnValue(of(medicationList));
    eventsServiceSpy.listCollection.and.returnValue(of(eventsList));
    seizuresServiceSpy.listCollection.and.returnValue(of(seizuresList));
    periodsServiceSpy.listCollection.and.returnValue(of(periodsList));

    // when
    const report$ = reportsService.getReports();

    // then
    report$.subscribe((report) => {
      expect(report).toBeTruthy();
      expect(report.dateFrom.isSame(moment('2020-06-01').startOf('day'))).toBeTrue();
      expect(report.dateTo.isSame(moment('2021-05-15').endOf('day'))).toBeTrue();

      for(let i = 0; i < reportCurrntMonths.length; i++) {
        expect(report.monthsData[i].month.format('MMM')).toEqual(reportCurrntMonths[i]);
      }
    });
  });

  it('should return valid range for defined period', async () => {
    // given
    const medicationList: Medication[] = [];
    const eventsList: Event[] = [];
    const seizuresList: Seizure[] = [];
    const periodsList: Period[] = [];

    medsServiceSpy.listCollection.and.returnValue(of(medicationList));
    eventsServiceSpy.listCollection.and.returnValue(of(eventsList));
    seizuresServiceSpy.listCollection.and.returnValue(of(seizuresList));
    periodsServiceSpy.listCollection.and.returnValue(of(periodsList));

    // when
    const report$ = reportsService.getReports(2019);

    // then
    report$.subscribe((report) => {
      expect(report).toBeTruthy();
      expect(report.dateFrom.isSame(moment('2019-01-01').startOf('day'))).toBeTrue();
      expect(report.dateTo.isSame(moment('2019-12-31').endOf('day'))).toBeTrue();

      for(let i = 0; i < reportByYearMonths.length; i++) {
        expect(report.monthsData[i].month.format('MMM')).toEqual(reportByYearMonths[i]);
      }
    });
  });

  it('should have correct amount of events', async() => {
    // given
    const medicationList: Medication[] = [];
    const eventsList: Event[] = [
      { objectType: 'EVENT', id: 'e1', name: 'Event 1', occurred: moment('2021-03-01') },
      { objectType: 'EVENT', id: 'e2', name: 'Event 2', occurred: moment('2021-03-31') },
    ];
    const seizuresList: Seizure[] = [];
    const periodsList: Period[] = [];

    medsServiceSpy.listCollection.and.returnValue(of(medicationList));
    eventsServiceSpy.listCollection.and.returnValue(of(eventsList));
    seizuresServiceSpy.listCollection.and.returnValue(of(seizuresList));
    periodsServiceSpy.listCollection.and.returnValue(of(periodsList));

    // when
    const report$ = reportsService.getReports(2021).pipe(takeLast(1));

    // then
    report$.subscribe((report) => {
      expect(report.monthsData[9].month.format('MMM')).toEqual('Mar');
      expect(report.monthsData[9].data.filter((e) => e.objectType === 'EVENT').length).toBe(2);
    });
  });

  it('should have correct amount of seizures', async () => {
    // given
    const medicationList: Medication[] = [];
    const eventsList: Event[] = [];
    const seizuresList: Seizure[] = [
      {
        objectType: 'SEIZURE',
        id: 's1',
        occurred: moment('2021-01-01 00:00:00'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
      {
        objectType: 'SEIZURE',
        id: 's2',
        occurred: moment('2021-01-01 23:59:59'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
      {
        objectType: 'SEIZURE',
        id: 's3',
        occurred: moment('2021-12-31 23:59:59'),
        duration: moment.duration(5, 'minutes'),
        type: 'some type',
      },
    ];
    const periodsList: Period[] = [];

    medsServiceSpy.listCollection.and.returnValue(of(medicationList));
    eventsServiceSpy.listCollection.and.returnValue(of(eventsList));
    seizuresServiceSpy.listCollection.and.returnValue(of(seizuresList));
    periodsServiceSpy.listCollection.and.returnValue(of(periodsList));

    // when
    const report$ = reportsService.getReports(2021).pipe(takeLast(1));

    // then
    report$.subscribe((report) => {
      expect(report.monthsData[11].month.format('MMM')).toEqual('Jan');
      expect(report.monthsData[11].data.filter((e) => e.objectType === 'SEIZURE').length).toBe(2);

      expect(report.monthsData[0].month.format('MMM')).toEqual('Dec');
      expect(report.monthsData[0].data.filter((e) => e.objectType === 'SEIZURE').length).toBe(1);
    });
  });

  it('should have correct amount of medications for both start and end dates', async () => {
    // given
    const medicationList: Medication[] = [
      {
        objectType: 'MEDICATION',
        id: 'm1',
        name: 'med1',
        doses: { morning: 0, noon: 1, evening: 0 },
        startDate: moment('2021-01-01'),
        archived: true,
        endDate: moment('2021-01-02'),
      },
      {
        objectType: 'MEDICATION',
        id: 'm2',
        name: 'med2',
        doses: { morning: 0, noon: 0, evening: 2 },
        startDate: moment('2021-10-15'),
        archived: true,
        endDate: moment('2021-12-30'),
      },
      {
        objectType: 'MEDICATION',
        id: 'm3',
        name: 'med2',
        doses: { morning: 0, noon: 0, evening: 1 },
        startDate: moment('2021-12-31'),
        archived: false,
      },
    ];
    const eventsList: Event[] = [];
    const seizuresList: Seizure[] = [];
    const periodsList: Period[] = [];

    medsServiceSpy.listCollection.and.returnValues(of(medicationList.filter(medication => medication.archived)), of(medicationList));
    eventsServiceSpy.listCollection.and.returnValue(of(eventsList));
    seizuresServiceSpy.listCollection.and.returnValue(of(seizuresList));
    periodsServiceSpy.listCollection.and.returnValue(of(periodsList));

    // when
    const report$ = reportsService.getReports(2021).pipe(takeLast(1));

    // then
    report$.subscribe({next: (report) => {
      expect(report.monthsData[11].month.format('MMM')).toEqual('Jan');
      expect(report.monthsData[11].data.filter((e) => e.objectType === 'MEDICATION').length).toBe(2);

      expect(report.monthsData[2].month.format('MMM')).toEqual('Oct');
      expect(report.monthsData[2].data.filter((e) => e.objectType === 'MEDICATION').length).toBe(1);

      expect(report.monthsData[0].month.format('MMM')).toEqual('Dec');
      expect(report.monthsData[0].data.filter((e) => e.objectType === 'MEDICATION').length).toBe(2);
    }, error: (message) => {
      fail(`Subscription error: ${message}`)
    }});
  });

  it('should have correct amount of periods for both start and end dates', async () => {
    // given
    const medicationList: Medication[] = [];
    const eventsList: Event[] = [];
    const seizuresList: Seizure[] = [];
    const periodsList: Period[] = [
      {
        objectType: 'PERIOD',
        id: 'p1',
        startDate: moment('2021-01-01'),
        endDate: moment('2021-01-02'),
      },
      {
        objectType: 'PERIOD',
        id: 'p2',
        startDate: moment('2021-10-15'),
        endDate: moment('2021-12-30'),
      },
      {
        objectType: 'PERIOD',
        id: 'p3',
        startDate: moment('2021-12-31'),
      },];

    medsServiceSpy.listCollection.and.returnValue(of(medicationList));
    eventsServiceSpy.listCollection.and.returnValue(of(eventsList));
    seizuresServiceSpy.listCollection.and.returnValue(of(seizuresList));
    periodsServiceSpy.listCollection.and.returnValues(of(periodsList.filter(period => period.endDate)), of(periodsList));

    // when
    const report$ = reportsService.getReports(2021).pipe(takeLast(1));

    // then
    report$.subscribe({next: (report) => {
      expect(report.monthsData[11].month.format('MMM')).toEqual('Jan');
      expect(report.monthsData[11].data.filter((e) => e.objectType === 'PERIOD').length).toBe(2);

      expect(report.monthsData[2].month.format('MMM')).toEqual('Oct');
      expect(report.monthsData[2].data.filter((e) => e.objectType === 'PERIOD').length).toBe(1);

      expect(report.monthsData[0].month.format('MMM')).toEqual('Dec');
      expect(report.monthsData[0].data.filter((e) => e.objectType === 'PERIOD').length).toBe(2);
    }, error: (message) => {
      fail(`Subscription error: ${message}`)
    }});
  });
});
